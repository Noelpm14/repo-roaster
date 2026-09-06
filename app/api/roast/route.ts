import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

function parseGitHubUrl(url: string) {
  const match = url.trim().match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

export async function POST(req: NextRequest) {
  try {
    const { repoUrl } = await req.json();
    const parsed = parseGitHubUrl(repoUrl);

    if (!parsed) {
      return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });
    }

    const { owner, repo } = parsed;
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "Repo-Roaster",
    };

    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!repoRes.ok) {
      return NextResponse.json({ error: "Repository not found or is private" }, { status: 404 });
    }
    const repoData = await repoRes.json();

    let readmeText = "No README found.";
    const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
    if (readmeRes.ok) {
      const readmeData = await readmeRes.json();
      readmeText = Buffer.from(readmeData.content, "base64").toString("utf-8").slice(0, 1200);
    }

    let filesSummary = "Not available";
    const treeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${repoData.default_branch}?recursive=1`,
      { headers }
    );
    if (treeRes.ok) {
      const treeData = await treeRes.json();
      filesSummary = (treeData.tree || [])
        .slice(0, 45)
        .map((f: { path: string }) => f.path)
        .join("\n");
    }

    const prompt = `
      You are a cynical, witty, brutally honest Senior Tech Lead roasting a candidate's GitHub repo.
      Analyze this repository:
      - Repository Name: ${repoData.full_name}
      - Description: ${repoData.description || "None"}
      - Stars: ${repoData.stargazers_count} \vert{} Forks:${repoData.forks_count}
      - Primary Language: ${repoData.language || "Unknown"}
      - License: ${repoData.license?.name || "None"}
      - File Tree Sample:
      ${filesSummary}
      - README Sample:
      ${readmeText}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roast: { type: Type.STRING, description: "A 2-3 paragraph punchy roast of the code and architecture." },
            roastScore: { type: Type.INTEGER, description: "Rating from 0 (pristine) to 100 (disaster)" },
            codeSmells: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-4 humorous yet technically accurate architectural critiques.",
            },
            verdict: { type: Type.STRING, description: "One-sentence executive hiring verdict." },
          },
          required: ["roast", "roastScore", "codeSmells", "verdict"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return NextResponse.json({ ...result, repoName: repoData.full_name });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to roast repository" }, { status: 500 });
  }
}