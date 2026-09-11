"client";

import { useState, useEffect } from "react";

interface CodeSmell {
  smell: string;
  detail?: string;
}

interface AuditResult {
  repoName: string;
  roast: string;
  roastScore: number;
  codeSmells: Array<string | CodeSmell>;
  verdict: string;
}

type AppState = "gateway" | "idle" | "cooking" | "receipts";
type Persona = "troll" | "cto" | "psychopath";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [appState, setAppState] = useState<AppState>("gateway");
  const [repoUrl, setRepoUrl] = useState("");
  const [persona, setPersona] = useState<Persona>("troll");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cookTime, setCookTime] = useState(0);
  
  const [bribeText, setBribeText] = useState("HIDE SCORE ($99)");
  const [footerClicks, setFooterClicks] = useState(0);
  const [showMatrix, setShowMatrix] = useState(false);
  const [isBossMode, setIsBossMode] = useState(false);
  const [isWaterboarding, setIsWaterboarding] = useState(false);
  
  const [liveFeed, setLiveFeed] = useState<Array<{repo: string; score: number; time: string}>>([
    { repo: "alex-dev/portfolio-v12", score: 94, time: "Just now" },
    { repo: "web3-chad/crypto-dex", score: 99, time: "2m ago" },
    { repo: "saas-founder/ai-wrapper", score: 88, time: "4m ago" }
  ]);

  useEffect(() => {
    setMounted(true);
    const clearance = localStorage.getItem("meme_roaster_vibe_check");
    if (clearance) setAppState("idle");
  }, []);

  const grantClearance = () => {
    localStorage.setItem("meme_roaster_vibe_check", "true");
    setAppState("idle");
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (appState === "cooking") {
      setCookTime(0);
      interval = setInterval(() => setCookTime((t) => t + 0.05), 50);
    }
    return () => clearInterval(interval);
  }, [appState]);

  const playSound = (type: "click" | "boom") => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (type === "click") {
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {}
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!repoUrl.trim()) return;

    playSound("click");
    setAppState("cooking");
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl, persona }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Execution fault during audit.");

      playSound("boom");
      setResult(data);
      setAppState("receipts");
    } catch (err: any) {
      setError(err.message);
      setAppState("idle");
    }
  };

  const triggerWaterboard = async () => {
    if (isWaterboarding || !repoUrl) return;
    setIsWaterboarding(true);
    for (let i = 0; i < 3; i++) {
      await handleSubmit();
      if (i < 2) await new Promise((r) => setTimeout(r, 1000));
    }
    setIsWaterboarding(false);
  };

  if (!mounted) return <div style={{ minHeight: "100vh", backgroundColor: "#09090b" }} />;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#09090b", color: "#f4f4f5", fontFamily: "monospace", padding: "20px" }}>
      
      {/* BOSS KEY */}
      <button onClick={() => setIsBossMode(!isBossMode)} style={{ position: "fixed", top: 15, right: 15, zIndex: 99, background: "#27272a", color: "#fff", padding: "8px 12px", border: "2px solid #52525b", fontWeight: "bold", cursor: "pointer" }}>
        {isBossMode ? "EXIT JIRA ❌" : "BOSS KEY (JIRA) 📊"}
      </button>

      {isBossMode && (
        <div style={{ position: "fixed", inset: 0, zIndex: 90, background: "#f4f5f7", color: "#172b4d", padding: "40px", fontFamily: "sans-serif" }}>
          <h2>JIRA SOFTWARE - Sprint Dashboard</h2>
          <p>Active Tasks: Refactoring legacy code infrastructure (IN PROGRESS)</p>
          <button onClick={() => setIsBossMode(false)} style={{ background: "#0052cc", color: "#fff", padding: "10px 20px", border: "none", fontWeight: "bold", cursor: "pointer", marginTop: "20px" }}>Return to App</button>
        </div>
      )}

      {showMatrix && (
        <div style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(0,0,0,0.95)", color: "#22c55e", padding: "40px", fontFamily: "monospace" }}>
          <h1 style={{ color: "#ef4444" }}>🚨 FBI CYBER CRIMES DIVISION NOTIFIED OF YOUR CODEBASE.</h1>
          <p>&gt; Bypassing security protocols via unmanaged useEffect hooks...</p>
          <button onClick={() => setShowMatrix(false)} style={{ background: "#22c55e", color: "#000", padding: "10px 20px", fontWeight: "bold", marginTop: "20px", cursor: "pointer" }}>CLOSE SIMULATION</button>
        </div>
      )}

      <div style={{ maxWidth: "800px", margin: "60px auto", textAlign: "center" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "900", color: "#d99753", marginBottom: "10px" }}>💀 REPO ROASTER</h1>
        <p style={{ color: "#a1a1aa", marginBottom: "30px" }}>Paste any GitHub repository and get publicly humiliated by AI.</p>

        {appState === "gateway" && (
          <button onClick={grantClearance} style={{ background: "#d99753", color: "#000", padding: "16px 32px", fontSize: "18px", fontWeight: "bold", border: "3px solid #000", cursor: "pointer", boxShadow: "4px 4px 0px #ea580c" }}>
            ENTER THE ARENA
          </button>
        )}

        {appState === "idle" && (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              {(["troll", "cto", "psychopath"] as Persona[]).map((p) => (
                <button type="button" key={p} onClick={() => setPersona(p)} style={{ padding: "8px 14px", background: persona === p ? "#d99753" : "#18181b", color: persona === p ? "#000" : "#a1a1aa", border: "2px solid #3f3f46", fontWeight: "bold", cursor: "pointer" }}>
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
            <input 
              type="text" 
              placeholder="github.com/facebook/react" 
              value={repoUrl} 
              onChange={(e) => setRepoUrl(e.target.value)} 
              required
              style={{ width: "100%", padding: "14px", background: "#18181b", border: "2px solid #52525b", color: "#fff", fontSize: "16px" }}
            />
            <button type="submit" style={{ background: "#d99753", color: "#000", padding: "14px 28px", fontSize: "16px", fontWeight: "bold", border: "2px solid #000", cursor: "pointer", boxShadow: "4px 4px 0px #000" }}>
              LET HIM COOK 🔥
            </button>
          </form>
        )}

        {appState === "cooking" && (
          <h2 style={{ color: "#d99753" }}>{isWaterboarding ? "WATERBOARDING CODEBASE..." : "DISSECTING CODEBASE..."} ({cookTime.toFixed(2)}s)</h2>
        )}

        {appState === "receipts" && result && (
          <div style={{ background: "#18181b", border: "4px solid #27272a", padding: "30px", textAlign: "left", boxShadow: "8px 8px 0px #000" }}>
            <h2 style={{ fontSize: "36px", color: result.roastScore >= 90 ? "#ef4444" : "#fff" }}>CLOWN SCORE: {result.roastScore}%</h2>
            <p style={{ fontStyle: "italic", color: "#d99753", margin: "15px 0" }}>{result.verdict}</p>
            <div style={{ background: "#09090b", padding: "20px", border: "2px solid #3f3f46", lineHeight: "1.6", marginBottom: "20px" }}>
              {result.roast}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              <button onClick={triggerWaterboard} disabled={isWaterboarding} style={{ background: "#dc2626", color: "#fff", padding: "10px 16px", fontWeight: "bold", border: "2px solid #000", cursor: "pointer" }}>
                {isWaterboarding ? "WATERBOARDING..." : "WATERBOARD ME 🌊"}
              </button>
              <button onClick={() => alert("🚨 EXCUSE COPIED: 'It's not a bug, it's an undocumented asynchronous event handler.'")} style={{ background: "#facc15", color: "#000", padding: "10px 16px", fontWeight: "bold", border: "2px solid #000", cursor: "pointer" }}>
                Slack Excuse 📢
              </button>
              <button onClick={() => alert("⚠️ HR ALERT: Human Resources has flagged your commit messages.")} style={{ background: "#3b82f6", color: "#fff", padding: "10px 16px", fontWeight: "bold", border: "2px solid #000", cursor: "pointer" }}>
                Notify HR 👔
              </button>
              <button onClick={() => setAppState("idle")} style={{ background: "#52525b", color: "#fff", padding: "10px 16px", fontWeight: "bold", border: "2px solid #000", cursor: "pointer", marginLeft: "auto" }}>
                Roast Next
              </button>
            </div>
          </div>
        )}

        <footer style={{ marginTop: "60px", color: "#52525b", fontSize: "12px", cursor: "pointer" }} onClick={() => {
          const next = footerClicks + 1;
          setFooterClicks(next);
          if (next >= 3) setShowMatrix(true);
        }}>
          REPO ROASTER FINALS EDITION v4.20 (CLICK 3 TIMES FOR EASTER EGG)
        </footer>
      </div>
    </div>
  );
}
