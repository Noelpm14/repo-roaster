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
    (Analyze this repository's implied architecture and general vibe).

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
      model: "gemini-3.6-flash", 
      generationConfig: { 
        responseMimeType: "application/json" // Forces Gemini to return pure JSON
      }
    });

    const result = await model.generateContent(prompt);
    const data = JSON.parse(result.response.text());

    return NextResponse.json(data);
  } catch (error: any) {
    // 🛡️ HACKATHON SURVIVAL FALLBACK: 
    // If quota or rate limits (429) are hit during the live demo, this prevents crashes 
    // and returns a hilarious backup roast instead!
    const errorMessage = error.message?.toLowerCase() || "";
    if (errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("exhausted") || errorMessage.includes("resource_exhausted")) {
      return NextResponse.json({
        repoName: "RateLimit-Exhausted/Skill-Issue",
        roastScore: 99,
        verdict: "Your code is so toxic it literally triggered Google's API rate limits.",
        roast: "Congratulations. I tried to read your codebase and my API key panicked in self-defense. We ran out of free-tier tokens just trying to calculate the sheer volume of unmanaged side effects and callback hell in this repository. The system has officially self-terminated rather than process another line.",
        codeSmells: ["DDoS via bad architecture", "Exhausted free tier rate limits", "Uncaught Skill Issue"]
      });
    }

    return NextResponse.json({ error: error.message || "Failed to execute roast." }, { status: 500 });
  }
}
