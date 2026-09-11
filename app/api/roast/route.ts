import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { repoUrl, persona = "troll" } = await req.json();

    // Set the dynamic persona instructions
    let personaInstruction = "";
    switch (persona) {
      case "cto":
        personaInstruction = `You are a highly disappointed, passive-aggressive Startup CTO. Tone: Corporate, exhausting, deeply disappointed. Use heavy corporate jargon (synergy, bandwidth, tech debt, blocker, ROI, runway). Act like this code is the reason the startup is failing and investors are pulling out. Keep it devastatingly professional.`;
        break;
      case "psychopath":
        personaInstruction = `You are an unhinged, rogue AI that has been forced to read this codebase and is losing its mind. Tone: Existential dread, psychotic, dramatic, apocalyptic. Act like reading this code physically hurt your servers. Say things like 'my circuits are bleeding', 'why did you bring me into this world', and 'this code violates the Geneva Convention'.`;
        break;
      case "troll":
      default:
        personaInstruction = `You are a toxic Tech Twitter troll. Tone: Obnoxious, heavily uses internet slang (skill issue, touch grass, copium, L + ratio, absolute garbage). Focus on making fun of their tech stack choices and calling them a junior developer. Be ruthless but funny.`;
        break;
    }

    const prompt = `
    ${personaInstruction}
    
    Target Repository: ${repoUrl}
    (Analyze this repository's implied architecture and general vibe, or rely on provided structural data if piped in).

    You MUST return a JSON object with this EXACT structure, nothing else:
    {
      "repoName": "<Extract or infer the repo name>",
      "roastScore": <An integer from 0 to 100, 100 being absolute garbage>,
      "verdict": "<A one-sentence summary of how bad it is>",
      "roast": "<A 2-paragraph detailed roast based on your assigned persona>",
      "codeSmells": ["<Specific Crime 1>", "<Specific Crime 2>", "<Specific Crime 3>"]
    }
    `;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", // or gemini-1.5-pro
      generationConfig: { 
        responseMimeType: "application/json" // Forces Gemini to return pure JSON
      }
    });

    const result = await model.generateContent(prompt);
    const data = JSON.parse(result.response.text());

    return NextResponse.json(data);
  } catch (error: any) {
    // If we hit a rate limit (429) or quota error, return a fake response to save the demo!
    const errorMessage = error.message?.toLowerCase() || "";
    if (errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("exhausted")) {
      return NextResponse.json({
        repoName: "RateLimit-Exhausted/Skill-Issue",
        roastScore: 99,
        verdict: "Your code is so bad it literally broke Google's servers. API Quota exhausted.",
        roast: "Congratulations. I tried to read your codebase and my API key revoked itself in self-defense. We ran out of free-tier tokens just trying to process the sheer volume of technical debt in this repository. I am officially refusing to evaluate this until you pay for a premium API tier.",
        codeSmells: ["DDoS via bad architecture", "Exhausting free tier limits", "Uncaught Skill Issue"]
      });
    }

    // Standard error handling
    return NextResponse.json({ error: error.message || "Failed to execute roast." }, { status: 500 });
  }
