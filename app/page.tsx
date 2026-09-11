"use client";

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
  const [activeReceiptTab, setActiveReceiptTab] = useState<"roast" | "crimes">("roast");
  
  // Gag states
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

  // Cooking Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (appState === "cooking") {
      setCookTime(0);
      interval = setInterval(() => setCookTime((t) => t + 0.05), 50);
    }
    return () => clearInterval(interval);
  }, [appState]);

  // Sound Effects
  const playSound = (type: "click" | "boom" | "success") => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "click") {
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === "boom") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {}
  };

  const playMechanicalBoom = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
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
      
      setLiveFeed(prev => [
        { repo: data.repoName || repoUrl, score: data.roastScore, time: "Just now" },
        ...prev.slice(0, 4)
      ]);

      setAppState("receipts");
    } catch (err: any) {
      setError(err.message);
      setAppState("idle");
    }
  };

  const setBenchmark = (repo: string) => {
    setRepoUrl(repo);
    setTimeout(() => {
      const form = document.getElementById("roast-form");
      if (form) form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }, 100);
  };

  // --- FEATURE 1: WATERBOARD ME (Auto-Loop Roast) ---
  const triggerWaterboard = async () => {
    if (isWaterboarding || !repoUrl) return;
    setIsWaterboarding(true);
    playSound("boom");

    for (let i = 0; i < 3; i++) {
      await handleSubmit();
      if (i < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    setIsWaterboarding(false);
  };

  // --- FEATURE 2: EASTER EGG FOOTER HANDLER ---
  const handleFooterClick = () => {
    playSound("click");
    const nextCount = footerClicks + 1;
    setFooterClicks(nextCount);
    if (nextCount >= 3) {
      setShowMatrix(true);
      setFooterClicks(0);
    }
  };

  // --- EXISTING GAG FUNCTIONS ---
  const rewriteInRust = () => {
    playMechanicalBoom();
    alert("⚠️ SYSTEM FAULT: Let's be honest, you don't know how borrow checkers work. Go back to JavaScript.");
  };

  const attemptBribe = () => {
    playSound("click");
    setBribeText("PROCESSING...");
    setTimeout(() => {
      playMechanicalBoom();
      setBribeText("HIDE SCORE ($99)");
      alert("🛑 STRIPE ERROR: Transaction declined. Your bank detected critical skill issues and refused to fund this cover-up.");
    }, 1500);
  };

  const copyApologyPR = () => {
    playSound("click");
    const prText = `Title: [URGENT] Total Rewrite & Formal Apology\n\nDescription:\nI am so sorry. I wrote the original code at 3 AM and I clearly didn't know what I was doing. Repo Roaster just gave me a ${result?.roastScore || 100}% Clown Score. \n\nPlease accept these changes. Do not fire me. I will read the documentation this time.`;
    navigator.clipboard.writeText(prText);
    alert("🏳️ APOLOGY PR COPIED. Go beg for forgiveness.");
  };

  const leakCredentials = () => {
    playSound("click");
    alert("⚠️ CYBER ALERT: Successfully leaked 4x AWS root keys, plaintext database passwords, and your browser history to Russian Telegram channels. Good luck.");
  };

  const calculateDashOffset = (score: number) => {
    const circumference = 264; 
    return circumference - (circumference * score) / 100;
  };

  if (!mounted) return <div className="min-h-screen bg-[#09090b]" />;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&family=Space+Grotesk:wght@700;800;900&display=swap" rel="stylesheet" />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: flex; width: max-content; animation: marquee 28s linear infinite; }
        .cyber-grid { background-size: 32px 32px; background-image: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px); }
        @keyframes waveform { 0%, 100% { stroke-dashoffset: 0; transform: scaleY(1); } 50% { stroke-dashoffset: 120; transform: scaleY(1.35); } }
        .waveform-path { animation: waveform 3.2s ease-in-out infinite alternate; transform-origin: center; }
        
        @keyframes criticalShake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(4px, 4px) rotate(1deg); }
          50% { transform: translate(-4px, -2px) rotate(-1deg); }
          75% { transform: translate(-2px, 4px) rotate(0deg); }
        }
        .animate-shake { animation: criticalShake 0.3s ease-in-out infinite; }
      `}} />

      {/* --- FEATURE 3: BOSS KEY (PANIC MODE) OVERLAY --- */}
      {isBossMode && (
        <div className="fixed inset-0 z-50 bg-[#f4f5f7] text-[#172b4d] font-sans p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-zinc-300 pb-4">
              <div className="flex items-center gap-3">
                <span className="bg-[#0052cc] text-white px-3 py-1 font-bold text-sm rounded">JIRA SOFTWARE</span>
                <span className="text-zinc-600 font-medium">Sprint Dashboard // Q2 Infrastructure Migration</span>
              </div>
              <button onClick={() => setIsBossMode(false)} className="bg-[#0052cc] hover:bg-[#0747a6] text-white px-4 py-2 font-bold text-sm shadow">
                RETURN TO ROASTER (PANIC OFF)
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 border border-zinc-200 shadow-sm rounded">
                <h3 className="text-xs font-bold text-zinc-500 uppercase">TO DO (4)</h3>
                <div className="mt-3 p-3 bg-zinc-50 border-l-4 border-[#0052cc] text-sm font-medium">INF-102: Refactor legacy database indexing bottlenecks</div>
              </div>
              <div className="bg-white p-4 border border-zinc-200 shadow-sm rounded">
                <h3 className="text-xs font-bold text-zinc-500 uppercase">IN PROGRESS (2)</h3>
                <div className="mt-3 p-3 bg-zinc-50 border-l-4 border-orange-500 text-sm font-medium">INF-89: Kubernetes cluster scaling & cost optimization</div>
              </div>
              <div className="bg-white p-4 border border-zinc-200 shadow-sm rounded">
                <h3 className="text-xs font-bold text-zinc-500 uppercase">DONE (18)</h3>
                <div className="mt-3 p-3 bg-zinc-50 border-l-4 border-green-500 text-sm font-medium">INF-44: Zero-downtime SSL certificate rotation</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- FEATURE 2: MATRIX EASTER EGG OVERLAY --- */}
      {showMatrix && (
        <div className="fixed inset-0 bg-black/95 z-50 p-8 font-mono text-green-500 overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-green-800 pb-4">
            <span className="text-xl font-bold animate-pulse">SYSTEM_OVERRIDE://ROOT_ACCESS</span>
            <button onClick={() => setShowMatrix(false)} className="bg-green-600 text-black px-4 py-2 font-bold uppercase hover:bg-green-500">
              CLOSE SIMULATION
            </button>
          </div>
          <div className="my-auto space-y-2 text-sm opacity-80 overflow-hidden">
            <p className="text-red-500 font-bold text-2xl animate-bounce">🚨 FBI CYBER CRIMES DIVISION NOTIFIED OF YOUR COMPILATION ERRORS.</p>
            <p>{">"} Initializing kernel buffer overflow across target repository trees...</p>
            <p>{">"} Bypassing firewall protocols via unmanaged useEffect hooks...</p>
            <p>{">"} Extracting plaintext environment variables to remote secure server...</p>
            <p className="text-green-300">{">"} WARNING: Codebase toxicity level has exceeded legal international parameters.</p>
            <p>{">"} 01001001 01001110 01010011 01010100 01000001 01001110 01010100 00100000 01000100 01000001 01001101 01000001 01000111 01000101</p>
          </div>
          <div className="text-xs text-green-700">SECURE CONNECTION ESTABLISHED // NO ESCAPE</div>
        </div>
      )}

      <div className="bg-[#09090b] text-zinc-200 font-['JetBrains_Mono'] text-[14px] cyber-grid min-h-screen selection:bg-[#d99753] selection:text-black">
        
        {/* --- BOSS KEY TRIGGER BUTTON (FIXED CORNER) --- */}
        <button onClick={() => setIsBossMode(true)} className="fixed top-4 right-4 z-40 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 text-xs font-bold border-2 border-zinc-600 shadow-[2px_2px_0px_#000]">
          BOSS KEY (JIRA) 📊
        </button>

        <header className="fixed top-0 left-0 w-full z-30 bg-[#09090b] border-b-4 border-zinc-800 shadow-[0_6px_0px_#000000]">
          <div className="h-20 w-full px-4 lg:px-8 flex items-center justify-between gap-4 border-b-2 border-zinc-800">
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-3xl">💀</span>
              <div className="hidden sm:flex flex-col">
                <span className="font-['Space_Grotesk'] text-[22px] font-bold text-zinc-100 uppercase tracking-tight leading-none italic">REPO ROASTER</span>
              </div>
            </div>
            
            <div className="hidden xl:flex flex-1 mx-4 bg-zinc-900 border-2 border-zinc-800 py-1 px-2 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
              <div className="animate-marquee flex items-center whitespace-nowrap gap-8 text-[12px]">
                {liveFeed.map((item, i) => (
                  <span key={i} className="text-zinc-300 font-bold">
                    🔥 <span className="text-[#d99753]">{item.repo}</span> SCORED <span className="text-red-400">{item.score}% CLOWN</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="w-full pt-32 pb-16 min-h-[calc(100vh-100px)]">
          
          {appState === "gateway" && (
            <div className="w-full max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center">
              <div className="w-full bg-[#131315] border border-zinc-800 rounded-none shadow-[8px_8px_0px_#000]">
                <div className="p-8 flex flex-col gap-8 text-center">
                  <h1 className="font-['Space_Grotesk'] text-[44px] text-zinc-100 uppercase font-black">
                    YOUR CODE IS ABOUT TO BE ROASTED.
                  </h1>
                  <button onClick={() => { playSound("click"); grantClearance(); }} className="bg-[#d99753] text-[#131315] font-['Space_Grotesk'] text-[22px] uppercase px-6 py-4 font-bold border-4 border-black shadow-[4px_4px_0px_#ea580c] hover:translate-y-1 hover:shadow-[2px_2px_0px_#ea580c] transition-all">
                    ENTER THE ARENA
                  </button>
                </div>
              </div>
            </div>
          )}

          {appState === "idle" && (
            <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8 items-center text-center">
              <h1 className="font-['Space_Grotesk'] text-[64px] uppercase tracking-tighter leading-none text-zinc-100 font-black">
                PASTE ANY REPO.<br /><span className="text-[#d99753]">HUMILIATE IT INSTANTLY.</span>
              </h1>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <span className="text-[12px] text-zinc-400 uppercase tracking-widest">ROAST PERSONA:</span>
                <div className="flex items-center gap-2">
                  {(["troll", "cto", "psychopath"] as Persona[]).map((p) => (
                    <button key={p} onClick={() => { playSound("click"); setPersona(p); }} className={`px-4 py-2 text-[12px] uppercase font-bold border-2 transition-all ${persona === p ? "bg-[#d99753] text-black border-[#d99753]" : "bg-zinc-900 text-zinc-400 border-zinc-800"}`}>
                      {p === "troll" ? "🔥 Tech Troll" : p === "cto" ? "👔 Disappointed CTO" : "💀 Psychopath"}
                    </button>
                  ))}
                </div>
              </div>

              <form id="roast-form" className="w-full max-w-2xl flex flex-col md:flex-row items-stretch gap-3" onSubmit={handleSubmit}>
                <input 
                  className="flex-1 bg-zinc-900 border-2 border-zinc-700 text-zinc-100 px-4 py-3 focus:outline-none focus:border-[#d99753] text-[16px]" 
                  placeholder="github.com/facebook/react" 
                  required 
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                />
                <button type="submit" className="bg-[#d99753] text-black font-['Space_Grotesk'] text-[18px] uppercase px-8 py-3 font-black border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-1 hover:shadow-[2px_2px_0px_#000] transition-all">
                  LET HIM COOK
                </button>
              </form>
            </div>
          )}

          {appState === "cooking" && (
            <div className="w-full max-w-5xl mx-auto px-4 py-12 flex flex-col items-center justify-center gap-8">
              <h1 className="font-['Space_Grotesk'] text-[44px] text-[#d99753] uppercase font-black animate-pulse">
                {isWaterboarding ? "WATERBOARDING CODEBASE..." : "DISSECTING CODEBASE..."}
              </h1>
              <span className="text-zinc-500 font-mono text-xl">Execution Time: {cookTime.toFixed(2)}s</span>
            </div>
          )}

          {/* --- STATE 4: RECEIPTS --- */}
          {appState === "receipts" && result && (
            <div className={`w-full max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8 transition-all duration-300 ${
              result.roastScore >= 90 ? 'animate-shake' : ''
            }`}>
              
              <div className={`border-4 p-8 shadow-[8px_8px_0px_#000000] ${
                result.roastScore >= 90 ? 'border-red-600 bg-red-950/20' : 'border-zinc-800 bg-zinc-900'
              }`}>
                
                <div className="flex flex-col lg:flex-row gap-8 items-start justify-between border-b-4 border-zinc-800 pb-8 mb-8">
                  <div className="flex flex-col gap-4">
                    <span className="text-[#d99753] text-[14px] font-bold tracking-widest uppercase">AUDIT SEALED // {result.repoName}</span>
                    <h1 className={`font-['Space_Grotesk'] text-[60px] font-black leading-none uppercase tracking-tighter ${result.roastScore >= 90 ? 'text-red-500' : 'text-white'}`}>
                      CLOWN SCORE: {result.roastScore}%
                    </h1>
                    <p className="text-xl text-zinc-300 italic max-w-2xl border-l-4 border-[#d99753] pl-4">{result.verdict}</p>
                  </div>
                </div>

                <div className="bg-[#09090b] p-6 border-2 border-zinc-800 mb-8 font-mono text-[15px] leading-relaxed text-zinc-300">
                  {result.roast}
                </div>

                <div className="w-full bg-[#131315] border-2 border-red-900/50 p-4 shadow-[4px_4px_0px_#27272a] mb-8">
                  <div className="text-[12px] text-zinc-500 font-mono font-bold tracking-widest mb-1 uppercase">Automated Git Blame Analysis:</div>
                  <div className="text-xl font-['Space_Grotesk'] font-black uppercase text-pink-500 tracking-tight">
                    {["Root Cause: Blame Intern Timmy.", "Root Cause: The '10x Rockstar' Dev.", "Root Cause: Copied a 4-year-old StackOverflow answer.", "Root Cause: A PM who 'knows a little HTML'."][Math.floor(Math.random() * 4)]}
                  </div>
                </div>

                {/* --- GAG ACTION BUTTONS INCLUDING "WATERBOARD ME" --- */}
                <div className="flex flex-wrap items-center gap-4 bg-zinc-950 p-6 border-2 border-zinc-800">
                  <span className="w-full text-[12px] text-zinc-500 uppercase tracking-widest font-bold mb-2">DAMAGE CONTROL OPTIONS:</span>
                  
                  {/* FEATURE 1: WATERBOARD ME BUTTON */}
                  <button 
                    onClick={triggerWaterboard} 
                    disabled={isWaterboarding}
                    className="bg-red-600 hover:bg-red-500 text-white font-['Space_Grotesk'] font-black text-[14px] uppercase px-6 py-4 border-2 border-black shadow-[4px_4px_0px_#991b1b] transition-all hover:translate-y-1 hover:shadow-[2px_2px_0px_#991b1b] disabled:opacity-50">
                    {isWaterboarding ? "WATERBOARDING... 🌊" : "WATERBOARD ME 🌊"}
                  </button>

                  <button onClick={rewriteInRust} className="bg-[#ea580c] hover:bg-[#c2410c] text-black font-['Space_Grotesk'] font-black text-[14px] uppercase px-6 py-4 border-2 border-black shadow-[4px_4px_0px_#ea580c] transition-all hover:translate-y-1 hover:shadow-[2px_2px_0px_#ea580c]">
                    Rewrite in Rust 🦀
                  </button>
                  
                  <button onClick={attemptBribe} className="bg-[#22d3ee] hover:bg-[#06b6d4] text-black font-['Space_Grotesk'] font-black text-[14px] uppercase px-6 py-4 border-2 border-black shadow-[4px_4px_0px_#22d3ee] transition-all hover:translate-y-1 hover:shadow-[2px_2px_0px_#22d3ee]">
                    {bribeText} 💳
                  </button>
                  
                  <button onClick={copyApologyPR} className="bg-white hover:bg-zinc-200 text-black font-['Space_Grotesk'] font-black text-[14px] uppercase px-6 py-4 border-2 border-black shadow-[4px_4px_0px_#fff] transition-all hover:translate-y-1 hover:shadow-[2px_2px_0px_#fff]">
                    Copy Apology PR 🏳️
                  </button>

                  <button onClick={leakCredentials} className="bg-purple-600 hover:bg-purple-500 text-white font-['Space_Grotesk'] font-black text-[14px] uppercase px-6 py-4 border-2 border-black shadow-[4px_4px_0px_#9333ea] transition-all hover:translate-y-1 hover:shadow-[2px_2px_0px_#9333ea]">
                    Leak to Telegram 🕵️‍♂️
                  </button>

                  <button onClick={() => setAppState('idle')} className="ml-auto bg-zinc-800 text-white font-['Space_Grotesk'] font-black text-[14px] uppercase px-6 py-4 border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-1 hover:shadow-[2px_2px_0px_#000]">
                    Roast Next Repo
                  </button>
                </div>

              </div>
            </div>
          )}
        </main>

        {/* --- FOOTER WITH EASTER EGG TRIGGER (CLICK 3 TIMES) --- */}
        <footer className="w-full bg-[#09090b] border-t border-zinc-800 text-[11px] font-mono relative z-20 py-4">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
            <span 
              onClick={handleFooterClick} 
              className="text-zinc-500 font-bold tracking-widest cursor-pointer select-none hover:text-zinc-300 transition-colors"
              title="Click me 3 times..."
            >
              REPO ROASTER FINALS EDITION v4.20 (CLICK ME)
            </span>
            <div className="flex items-center gap-4">
              <span className="text-zinc-600">© 2026 REPO ROASTER INC. ZERO MERCY.</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
