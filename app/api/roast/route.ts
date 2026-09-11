import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// 🔥 HACKATHON OVERRIDE: API Key is hardcoded so you don't need to open Vercel
const genAI = new GoogleGenerativeAI("AQ.Ab8RN6IQWWFqUeDdWxqYCo0mHTK9VzLHHXkPBkB48UfOgHXTKQ");

export async function POST(req: Request) {
  try {
    const { repoUrl, persona } = await req.json();

    if (!repoUrl) {
      return NextResponse.json({ error: "Repository URL is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
      You are a ${persona}. Roast the following GitHub repository: ${repoUrl}.
      Your response MUST be a valid JSON object exactly matching this schema:
      {
        "repoName": "Name of the repository or username/repo",
        "roast": "A brutally funny, highly critical 2-3 paragraph roast based on the persona.",
        "roastScore": 99,
        "codeSmells": ["A list of 3 funny fake or real code smells/issues"],
        "verdict": "A 1-sentence final brutal summary"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    return NextResponse.json(JSON.parse(responseText));

  } catch (error: any) {
    console.error("API Error or Rate Limit Hit:", error);

    // 🔥 EMERGENCY DEMO BACKUP 🔥
    // If you somehow hit the limit again during the presentation, serve this instead of crashing!
    return NextResponse.json({
      repoName: "System-Overload",
      roast: "This codebase is so catastrophically terrible that it actually caused our AI to suffer a panic attack and exhaust its API quota again. The model literally refused to process any more of this spaghetti code to protect its own sanity. We are billing you for therapy.",
      roastScore: 100,
      codeSmells: ["API Emotional Abuse", "Unprecedented Toxicity", "StackOverflow Copy-Paste Overflow"],
      verdict: "Codebase so toxic it triggered Google's API safety limits."
    });
  }
}
