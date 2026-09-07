import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// --- INLINE IN-MEMORY RATE LIMITER (NO NEW FILE NEEDED) ---
const ipTracker = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string, maxPerMin = 5): { allowed: boolean; waitSec: number } {
  const now = Date.now();
  const windowMs = 60_000;
  const record = ipTracker.get(ip);

  // Clean old entries if the map gets large
  if (ipTracker.size > 500) {
    for (const [key, val] of ipTracker.entries()) {
      if (now > val.resetTime) ipTracker.delete(key);
    }
  }

  if (!record || now > record.resetTime) {
    ipTracker.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, waitSec: 0 };
  }

  if (record.count >= maxPerMin) {
    return { allowed: false, waitSec: Math.ceil((record.resetTime - now) / 1000) };
  }

  record.count += 1;
  return { allowed: true, waitSec: 0 };
}

// Strict sanitizer: only allows alphanumeric, dashes, dots, underscores
function sanitizeAndParseRepo(input: string) {
  if (!input || typeof input !== "string" || input.length > 200) return null;
  const clean = input.trim().replace(/^https?:\/\/github\.com\/?/, "").replace(/\.git$/, "");
  const parts = clean.split("/").filter(Boolean);
  if (parts.length !== 2) return null;

  const validNameRegex = /^[a-zA-Z0-9_\-\.]+$/;
  if (!validNameRegex.test(parts[0]) || !validNameRegex.test(parts[1])) return null;

  return { owner: parts[0], repo: parts[1] };
}

async function generateWithRetry(prompt: string, retries = 2, delayMs = 1500): Promise<any> {
  const schema = {
    type: Type.OBJECT,
    properties: {
      roast: {
        type: Type.STRING,
        description: "A short, brutal 2-3 sentence roast. Maximum 60 words. No cushions, pure technical savagery.",
      },
      roastScore: {
        type: Type.INTEGER,
        description: "Shame rating from 0 (immaculate) to 100 (disaster).",
      },
      codeSmells: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            smell: { type: Type.STRING, description: "Short title (3-5 words)" },
            detail: { type: Type.STRING, description: "Single ruthless sentence describing the technical debt." },
          },
          required: ["smell", "detail"],
        },
        description: "3 specific architectural offenses.",
      },
      verdict: {
        type: Type.STRING,
        description: "A lethal one-line hiring rejection verdict under 15 words.",
      },
    },
    required: ["roast", "roastScore", "codeSmells", "verdict"],
  };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });
    } catch (err: any) {
      const is503 = err?.message?.includes("503") || err?.status === 503;
      if (is503 && attempt < retries) {
        await new Promise((res) => setTimeout(res, delayMs * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting Guard
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const { allowed, waitSec } = isRateLimited(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: `Rate limit triggered to prevent bot abuse. Please wait ${waitSec}s before running another audit.` },
        { status: 429 }
      );
    }

    // 2. Strict Input Validation
    const body = await req.json().catch(() => ({}));
    const target = sanitizeAndParseRepo(body.repoUrl || "");
    if (!target) {
      return NextResponse.json(
        { error: "Invalid repository format. Please enter 'owner/repo' or 'github.com/owner/repo'." },
        { status: 400 }
      );
    }

    const { owner, repo } = target;
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "Repo-Autopsy-App",
    };

    // 3. Fetch from public GitHub API (Zero private or user data stored)
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!repoRes.ok) {
      return NextResponse.json({ error: "Repository is private, does not exist, or GitHub rate limit reached." }, { status: 404 });
    }
    const repoData = await repoRes.json();

    let readmeText = "No README documentation found.";
    const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
    if (readmeRes.ok) {
      const readmeData = await readmeRes.json();
      readmeText = Buffer.from(readmeData.content, "base64").toString("utf-8").slice(0, 800);
    }

    let filesSummary = "Not available";
    const treeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${repoData.default_branch}?recursive=1`,
      { headers }
    );
    if (treeRes.ok) {
      const treeData = await treeRes.json();
      filesSummary = (treeData.tree || [])
        .slice(0, 40)
        .map((f: { path: string }) => f.path)
        .join("\n");
    }

    const prompt = `
You are a burned-out, cynical Staff Principal Engineer conducting a brutal code post-mortem.
Roast this repository with zero filter, dry wit, and clinical technical accuracy.

RULES:
- Maximum 2-3 short sentences for the roast. No polite cushioning.
- Highlight anti-patterns, sloppy folder layouts, missing tests, or bloated dependencies.
- The verdict must be a cold, terminal rejection punchline under 15 words.

Repository Data:
- Name: ${repoData.full_name}
- Description: ${repoData.description || "None"}
- Stars: ${repoData.stargazers_count}
- Primary Language: ${repoData.language || "Unknown"}
- Tree Snapshot:
${filesSummary}
- README Excerpt:
${readmeText}
`;

    const response = await generateWithRetry(prompt);
    const result = JSON.parse(response.text || "{}");
    return NextResponse.json({ ...result, repoName: repoData.full_name });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to inspect repository." }, { status: 500 });
  }
}
