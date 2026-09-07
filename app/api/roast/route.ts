import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

function parseGitHubUrl(url: string) {
  const match = url.trim().match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

async function generateWithRetry(prompt: string, retries = 2, delayMs = 1500): Promise<any> {
  const schema = {
    type: Type.OBJECT,
    properties: {
      roast: { 
        type: Type.STRING, 
        description: "A short, devastating 2-3 sentence roast. Maximum 60 words. No throat-clearing, pure unvarnished brutality." 
      },
      roastScore: { 
        type: Type.INTEGER, 
        description: "Shame rating from 0 (immaculate) to 100 (architectural felony). Default to 70-95 for typical messy code." 
      },
      codeSmells: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            smell: { type: Type.STRING, description: "Short, cutting title (3-5 words)" },
            detail: { type: Type.STRING, description: "One single merciless sentence explaining the crime." }
          },
          required: ["smell", "detail"]
        },
        description: "3 concise, highly specific architectural offenses.",
      },
      verdict: { 
        type: Type.STRING, 
        description: "A lethal one-line hiring rejection verdict under 15 words." 
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
    const { repoUrl } = await req.json();
    const parsed = parseGitHubUrl(repoUrl);

    if (!parsed) {
      return NextResponse.json({ error: "Invalid GitHub repository URL" }, { status: 400 });
    }

    const { owner, repo } = parsed;
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "Repo-Autopsy",
    };

    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!repoRes.ok) {
      return NextResponse.json({ error: "Repository not found or is private." }, { status: 404 });
    }
    const repoData = await repoRes.json();

    let readmeText = "No README found.";
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
You are a burned-out, deeply sarcastic Staff Principal Engineer conducting a brutal code post-mortem. 
Your job is to roast this repository with zero filter, maximum dry wit, and clinical technical accuracy.

CRITICAL INSTRUCTIONS:
- BE EXTREMELY SHORT: Limit the roast to 2-3 sentences. Every word must draw blood.
- NO POLITE CUSHIONING: Do not say "while this has potential" or "good effort". Go straight for the jugular.
- TARGET THE TECH DEBT: Roast messy folder structures, missing tests, copy-pasted boilerplate, framework churn, vanity star-chasing, or over-engineered garbage based on the file tree.
- VERDICT: Must be a cold, terminal rejection punchline.

Repository Telemetry:
- Name: ${repoData.full_name}
- Description: ${repoData.description || "None (cowardly)"}
- Stars: ${repoData.stargazers_count} | Forks: ${repoData.forks_count}
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
    return NextResponse.json({ error: err.message || "Failed to inspect repository" }, { status: 500 });
  }
}
