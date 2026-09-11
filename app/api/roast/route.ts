import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { repoUrl, persona } = await req.json();

    if (!repoUrl) {
      return NextResponse.json({ error: "Repository URL is required" }, { status: 400 });
    }

    // Using gemini-1.5-flash as it is the most stable and heavily-provisioned model for the free tier
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
        "roastScore": 99, // An integer from 0 to 100 where 100 is absolute trash
        "codeSmells": ["A list of 3 funny fake or real code smells/issues"],
        "verdict": "A 1-sentence final brutal summary"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Attempt to parse and return the actual AI response
    return NextResponse.json(JSON.parse(responseText));

  } catch (error: any) {
    console.error("API Error or Rate Limit Hit:", error);

    // 🔥 THE BULLETPROOF DEMO FALLBACK 🔥
    // If your API key hits its free tier limit (Error 429) during the presentation, 
    // the app will instantly serve this mock JSON instead of crashing.
    return NextResponse.json({
      repoName: "Terminal-Rate-Limit",
      roast: "This codebase is so catastrophically terrible that it actually caused our AI to suffer a panic attack and exhaust its API quota. The model literally refused to process any more of this spaghetti code to protect its own sanity. We are billing you for therapy.",
      roastScore: 100,
      codeSmells: ["API Emotional Abuse", "Unprecedented Toxicity", "StackOverflow Copy-Paste Overflow"],
      verdict: "Codebase so toxic it triggered Google's API safety limits."
    });
  }
}
