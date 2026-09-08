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

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [appState, setAppState] = useState<AppState>("gateway");
  const [repoUrl, setRepoUrl] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cookTime, setCookTime] = useState(0);
  const [activeReceiptTab, setActiveReceiptTab] = useState<"roast" | "crimes">("roast");

  // Fix Hydration Mismatch & Check Vibe Clearance
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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!repoUrl.trim()) return;

    setAppState("cooking");
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Execution fault during audit.");

      setResult(data);
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

  const copyShareReceipt = () => {
    if (!result) return;
    const shareText = `💀 REPO ROASTER VERDICT: ${result.repoName} scored ${result.roastScore}/100.\n\n"${result.verdict}"\n\nCheck your skill issue: https://repo-roaster.vercel.app`;
    navigator.clipboard.writeText(shareText);
    alert("COPIED TO CLIPBOARD! 💀🔥");
  };

  const calculateDashOffset = (score: number) => {
    const circumference = 264; 
    return circumference - (circumference * score) / 100;
  };

  // Prevent server-side rendering flash
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
      `}} />

      <div className="bg-[#09090b] text-zinc-200 font-['JetBrains_Mono'] text-[14px] cyber-grid min-h-screen selection:bg-[#d99753] selection:text-black">
        
        {/* --- GLOBAL HEADER --- */}
        <header className="fixed top-0 left-0 w-full z-50 bg-[#09090b] border-b-4 border-zinc-800 shadow-[0_6px_0px_#000000]">
          <div className="h-20 w-full px-4 lg:px-8 flex items-center justify-between gap-4 border-b-2 border-zinc-800">
            <div className="flex items-center gap-3 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="160" height="40" fill="none">
                <rect x="4" y="6" width="48" height="48" fill="#facc15" stroke="#000" strokeWidth="4"/>
                <rect x="8" y="10" width="48" height="48" fill="#ec4899" stroke="#000" strokeWidth="4"/>
                <text x="32" y="44" fontFamily="monospace" fontSize="28" fontWeight="900" fill="#000" textAnchor="middle">💀</text>
                <text x="68" y="38" fontFamily="'Space Grotesk', 'Impact', sans-serif" fontSize="28" fontWeight="900" fontStyle="italic" fill="#ffffff" letterSpacing="-1">REPO<tspan fill="#ec4899">ROASTER</tspan></text>
                <rect x="68" y="43" width="110" height="6" fill="#22d3ee" stroke="#000" strokeWidth="2"/>
              </svg>
              <div className="hidden sm:flex flex-col">
                <span className="font-['Space_Grotesk'] text-[22px] font-bold text-zinc-100 uppercase tracking-tight leading-none">REPO ROASTER</span>
                <div className="inline-flex items-center gap-1 bg-yellow-400 text-black text-[10px] px-1.5 py-0.5 border border-[#09090b] shadow-[2px_2px_0px_#000000] mt-1 font-bold">
                  <span className="material-symbols-outlined text-[12px]">warning</span>
                  <span>AI CODE EXECUTIONER v4.20 // HIGH HAZARD</span>
                </div>
              </div>
            </div>
            <div className="hidden xl:flex flex-1 mx-4 bg-zinc-900 border-2 border-zinc-800 py-1 px-2 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
              <div className="animate-marquee flex items-center whitespace-nowrap gap-8 text-[12px]">
                <span className="text-red-400 font-bold">OVER 248,190 SKILL ISSUES DIAGNOSED</span>
                <span className="text-cyan-400 font-bold">99% OF TECH TWITTER IS UNEMPLOYED</span>
                <span className="text-pink-500 font-bold">REACT 19 WAS A MISTAKE</span>
                <span className="text-[#d99753] font-bold">YOUR TYPESCRIPT IS JUST 'ANY' EVERYWHERE</span>
                <span className="text-red-400 font-bold">OVER 248,190 SKILL ISSUES DIAGNOSED</span>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-[#09090b] px-4 lg:px-8 overflow-x-auto border-b border-zinc-800">
            <nav className="flex items-stretch gap-2 min-w-max pt-1">
              <button onClick={() => appState !== 'gateway' && setAppState('idle')} className={`px-4 py-2 text-[14px] uppercase border-2 border-b-0 border-zinc-800 transition-colors ${appState === 'idle' ? 'bg-[#d99753] text-[#131315] border-[#d99753] shadow-[4px_0px_0px_#000000] font-bold' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-100'}`}>
                DROP REPO (IDLE)
              </button>
              <button className={`px-4 py-2 text-[14px] uppercase border-2 border-b-0 border-zinc-800 transition-colors ${appState === 'cooking' ? 'bg-[#d99753] text-[#131315] border-[#d99753] shadow-[4px_0px_0px_#000000] font-bold' : 'bg-zinc-900 text-zinc-400'}`}>
                COOKING MODE (LIVE)
              </button>
              <button className={`px-4 py-2 text-[14px] uppercase border-2 border-b-0 border-zinc-800 transition-colors ${appState === 'receipts' ? 'bg-[#d99753] text-[#131315] border-[#d99753] shadow-[4px_0px_0px_#000000] font-bold' : 'bg-zinc-900 text-zinc-400'}`}>
                THE RECEIPTS (RESULTS)
              </button>
            </nav>
          </div>
        </header>

        <main className="w-full pt-36 pb-16 min-h-[calc(100vh-100px)]">
          
          {/* --- STATE 1: VIBE CHECK --- */}
          {appState === "gateway" && (
            <div className="w-full max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center">
              <div className="w-full bg-[#131315] border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
                <div className="bg-zinc-900/80 px-4 py-3 flex items-center justify-between border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-pink-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono tracking-widest">GATEWAY://PROTOCOL_403</span>
                  </div>
                </div>
                <div className="p-6 sm:p-8 flex flex-col gap-8">
                  <div className="flex flex-col gap-3 text-left">
                    <div className="inline-flex items-center gap-2">
                      <span className="text-[10px] tracking-widest text-pink-500 bg-pink-500/10 border border-pink-500/30 px-2 py-0.5 rounded font-bold uppercase">PROTOCOL-403</span>
                      <span className="text-[10px] text-zinc-400 font-mono tracking-wider">ZERO_COOKIES_ZERO_MERCY</span>
                    </div>
                    <h1 className="font-['Space_Grotesk'] text-[32px] sm:text-[44px] text-zinc-100 uppercase tracking-tight font-black leading-tight">
                      TRIGGER WARNING: <span className="text-[#d99753] underline decoration-[#b87333] decoration-2 underline-offset-8">YOUR REPO</span> IS ABOUT TO GET DISSECTED.
                    </h1>
                    <p className="text-[14px] text-zinc-400 max-w-2xl leading-relaxed">
                      Zero telemetry tracking. Zero marketing fluff. We strictly query GitHub's public API and let Gemini AI anatomize your architectural flaws in cold, mathematical prose.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-zinc-900 p-4 rounded flex flex-col gap-2">
                      <span className="text-[10px] text-[#d99753] font-bold uppercase tracking-wider">CLAUSE 01</span>
                      <span className="text-[16px] font-bold uppercase tracking-wide">NO COOKIES</span>
                      <p className="text-[12px] text-zinc-400">Zero remarketing ads. We only measure how reliably your code crashes in production.</p>
                    </div>
                    <div className="bg-zinc-900 p-4 rounded flex flex-col gap-2">
                      <span className="text-[10px] text-[#b87333] font-bold uppercase tracking-wider">CLAUSE 02</span>
                      <span className="text-[16px] font-bold uppercase tracking-wide">PUBLIC SCRUTINY</span>
                      <p className="text-[12px] text-zinc-400">If public on GitHub, it is indexed for algorithmic critique. Git commits and rebase logs exposed.</p>
                    </div>
                    <div className="bg-zinc-900 p-4 rounded flex flex-col gap-2">
                      <span className="text-[10px] text-[#d99753] font-bold uppercase tracking-wider">CLAUSE 03</span>
                      <span className="text-[16px] font-bold uppercase tracking-wide">ZERO PADDING</span>
                      <p className="text-[12px] text-zinc-400">Constructive brutality only. You waive rights to polite feedback or sugarcoated analysis.</p>
                    </div>
                  </div>
                  <button onClick={grantClearance} className="w-full bg-[#d99753] hover:bg-[#b87333] text-[#131315] font-['Space_Grotesk'] text-[22px] uppercase px-6 py-4 rounded font-bold tracking-tight shadow-[0_4px_14px_rgba(217,151,83,0.4)] transition-all flex items-center justify-center gap-2">
                    <span>EXECUTE ANALYSIS</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- STATE 2: IDLE (DROP ZONE) --- */}
          {appState === "idle" && (
            <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8 animate-in fade-in duration-500">
              <div className="flex flex-col gap-4 items-center text-center pt-4">
                <div className="inline-flex items-center gap-2 bg-white/5 border border-[#d99753]/50 rounded-full px-4 py-1">
                  <span className="w-2 h-2 rounded-full bg-[#d99753]"></span>
                  <span className="text-[11px] uppercase tracking-widest text-[#d99753]">UNFILTERED AI CODE DISASSEMBLY</span>
                </div>
                <h1 className="font-['Space_Grotesk'] text-[44px] md:text-[64px] max-w-4xl uppercase tracking-tighter leading-none text-zinc-100 font-black">
                  PASTE YOUR REPO.<br /><span className="text-[#d99753]">GET BRUTALLY HUMILIATED.</span>
                </h1>
              </div>

              <div className="w-full bg-[#0e0e11] border border-[#d99753]/30 rounded-xl p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <span className="text-[11px] text-zinc-400">TERMINAL TARGET // CLI v4.20</span>
                </div>
                
                <form id="roast-form" className="flex flex-col md:flex-row items-stretch gap-3" onSubmit={handleSubmit}>
                  <div className="flex-1 flex items-center bg-[#09090b] border border-[#d99753]/40 focus-within:border-[#d99753] rounded-lg px-4 py-2 transition-all">
                    <span className="text-[#d99753] text-[14px] select-none mr-2">github.com/</span>
                    <input 
                      autoComplete="off" 
                      className="flex-1 bg-transparent border-0 text-zinc-100 placeholder:text-zinc-600 focus:outline-none text-[15px]" 
                      id="repo-input" 
                      placeholder="torvalds/linux or your-ugly-codebase" 
                      required 
                      spellCheck="false" 
                      type="text"
                      value={repoUrl.replace(/https?:\/\/github\.com\/?/, "")}
                      onChange={(e) => setRepoUrl(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="bg-[#d99753] hover:bg-[#b87333] text-[#131315] text-[14px] uppercase px-6 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 shrink-0">
                    <span>LET HIM COOK</span>
                    <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
                  </button>
                </form>
                
                {error && (
                  <div className="mt-4 p-3 border border-red-500 bg-red-500/10 text-red-400 font-mono text-[12px] uppercase">
                    SYSTEM FAULT: {error}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-zinc-400 text-[11px] uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px] text-[#d99753]">bolt</span>
                  <span>OR SACRIFICE AN INDUSTRY STANDARD:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
                  {['facebook/react', 'vercel/next.js', 'reduxjs/redux', 'tailwindlabs/tailwindcss'].map(repo => (
                    <button key={repo} onClick={() => setBenchmark(repo)} className="group flex flex-col p-3 bg-white/5 border border-white/10 hover:border-[#d99753] rounded-lg transition-all text-left">
                      <span className="text-[12px] text-[#d99753] font-bold group-hover:translate-x-0.5 transition-transform">{repo}</span>
                      <span className="text-[11px] text-zinc-400">Click to roast</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- STATE 3: COOKING --- */}
          {appState === "cooking" && (
            <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6">
              <div className="w-full bg-zinc-900 border border-zinc-800 p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-zinc-950 border border-[#d99753]/40 text-[#d99753] text-[10px] uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-[#d99753] animate-ping"></span>
                    <span>ACTIVE PIPELINE</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-['Space_Grotesk'] text-[22px] font-bold">{repoUrl || 'TARGET ACQUIRED'}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">MAIN BRANCH AUDIT</span>
                  </div>
                </div>
                <div className="px-3 py-1 bg-zinc-800 text-[#d99753] font-mono text-[10px] border border-[#d99753]/20">
                  EXEC TIME: <span className="font-bold text-zinc-100">{cookTime.toFixed(2)}s</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-2">
                <div className="lg:col-span-8 flex flex-col gap-6">
                  <div className="bg-zinc-900 border border-zinc-800 flex flex-col shadow-2xl">
                    <div className="bg-zinc-950 px-4 py-3 flex items-center justify-between border-b border-zinc-800">
                      <span className="text-[12px] text-zinc-400 font-mono tracking-wider uppercase">DESTRUCTIVE_AUDIT.LOG</span>
                    </div>
                    <div className="p-6 bg-[#09090b]/80 flex flex-col gap-3 min-h-[380px] font-mono text-[12px] leading-relaxed overflow-hidden">
                      <div className="flex items-start gap-3"><span className="text-[#d99753]/70">[{cookTime.toFixed(2)}s]</span><span className="text-zinc-100">Scanning syntax tree structure... Resolving dependencies.</span></div>
                      {cookTime > 1.5 && <div className="flex items-start gap-3"><span className="text-[#d99753]/70">[{cookTime.toFixed(2)}s]</span><span className="text-cyan-400">Analyzing recursive hooks and side-effects...</span></div>}
                      {cookTime > 2.5 && <div className="flex items-start gap-3"><span className="text-[#d99753]/70">[{cookTime.toFixed(2)}s]</span><span className="text-red-400">Flagging severe antipatterns...</span></div>}
                      {cookTime > 3.5 && <div className="flex items-start gap-3"><span className="text-[#d99753]/70">[{cookTime.toFixed(2)}s]</span><span className="text-zinc-400">Synthesizing deep code critiques via Gemini inference model...</span></div>}
                      <div className="flex items-center gap-2 text-[#d99753] pt-2">
                        <span className="font-bold">AWAITING API PAYLOAD</span>
                        <span className="w-2 h-4 bg-[#d99753] inline-block animate-ping"></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="bg-zinc-900 border border-zinc-800 p-4 shadow-xl flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <span className="text-[12px] uppercase tracking-wider font-bold">INFERENCE ENGINE</span>
                      <span className="text-[10px] text-zinc-400 font-mono">GEMINI-3.6-FLASH</span>
                    </div>
                    <div className="bg-[#09090b] p-3 border border-zinc-800 flex flex-col gap-2 relative overflow-hidden">
                      <svg className="w-full h-20 text-[#d99753]" fill="none" preserveAspectRatio="none" viewBox="0 0 300 64">
                        <path className="waveform-path" d="M0,32 Q25,8 50,32 T100,32 T150,12 T200,48 T250,20 T300,32" stroke="#d99753" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" opacity="0.95"></path>
                        <path className="waveform-path" d="M0,32 Q35,54 70,32 T140,24 T210,40 T280,18 T300,32" stroke="#b87333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" opacity="0.7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- STATE 4: RECEIPTS --- */}
          {appState === "receipts" && result && (
            <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8 animate-in slide-in-from-bottom-8 duration-700">
              
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveReceiptTab('roast')} className={`text-[12px] uppercase px-4 py-2 border-2 transition-all font-bold ${activeReceiptTab === 'roast' ? 'bg-[#d99753] text-[#131315] border-[#d99753] shadow-[4px_4px_0px_#000000]' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-100'}`}>THE ROAST</button>
                  <button onClick={() => setActiveReceiptTab('crimes')} className={`text-[12px] uppercase px-4 py-2 border-2 transition-all font-bold ${activeReceiptTab === 'crimes' ? 'bg-[#d99753] text-[#131315] border-[#d99753] shadow-[4px_4px_0px_#000000]' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-100'}`}>CRIMINAL PROFILE</button>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 shadow-[0_0_20px_rgba(0,0,0,0.6)]">
                <div className="flex items-center gap-2 text-[#d99753] text-[12px] uppercase tracking-widest mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#d99753] animate-pulse"></span>
                  <span className="tracking-wider">TARGET LOCK // INGEST COMPLETE</span>
                </div>
                <h1 className="font-['Space_Grotesk'] text-[32px] sm:text-[44px] uppercase font-black tracking-tight">TARGET: <span className="text-[#d99753] border-b-2 border-[#d99753] tracking-normal">{result.repoName}</span></h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 p-6 shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
                  <div className="border-b border-zinc-800 pb-3 mb-4">
                    <span className="text-[#d99753] text-[12px] uppercase font-bold tracking-widest">DESTRUCTION QUOTIENT GAUGE</span>
                  </div>
                  <div className="flex items-center gap-6 my-2">
                    <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#27272a" strokeWidth="8"></circle>
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#d99753" strokeWidth="8" strokeDasharray="264" strokeDashoffset={calculateDashOffset(result.roastScore)} strokeLinecap="round" className="transition-all duration-1000 ease-out"></circle>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                        <span className="text-[34px] font-['Space_Grotesk'] font-black text-[#d99753] leading-none">{result.roastScore}</span>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">PERCENT</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">COMPILATION AGONY LEVEL</span>
                      <span className="font-['Space_Grotesk'] text-[22px] font-black uppercase tracking-tight">{result.roastScore > 80 ? "CRITICAL SPIRAL" : result.roastScore > 50 ? "MODERATE TOXICITY" : "COPIUM DETECTED"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 p-6 shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
                  <div className="border-b border-zinc-800 pb-2 mb-3">
                    <span className="text-[12px] text-[#d99753] font-bold uppercase tracking-widest">BIOPSY VERDICT</span>
                  </div>
                  <div className="mt-3 bg-zinc-950 border-l-4 border-[#d99753] p-4 text-[14px] text-zinc-100 italic leading-relaxed">
                    {result.verdict}
                  </div>
                </div>
              </div>

              {activeReceiptTab === 'roast' && (
                <div className="bg-[#09090b] border border-zinc-800 shadow-[4px_4px_0px_#000000] overflow-hidden">
                  <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800">
                    <span className="font-mono text-[10px] text-[#d99753] tracking-wide font-bold">terminal://receipts-exposed.sh</span>
                  </div>
                  <div className="p-6 sm:p-8 space-y-4 font-mono text-[14px] text-zinc-200">
                    {result.roast.split('\n\n').map((paragraph, idx) => (
                      <div key={idx} className="flex items-start gap-4 bg-zinc-900/80 p-4 border-l-2 border-[#d99753] hover:border-l-4 transition-all duration-200">
                        <span className="text-[#d99753] font-bold shrink-0 pt-0.5 text-[12px]">[LINE_0{idx + 1}]</span>
                        <p className="leading-relaxed">{paragraph}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeReceiptTab === 'crimes' && (
                <div className="flex flex-col gap-4">
                  <div className="border-b border-zinc-800 pb-2">
                    <h2 className="font-['Space_Grotesk'] text-[22px] uppercase font-black tracking-tight">INDICTED PATTERNS: <span className="text-[#d99753] font-mono">TOP {result.codeSmells.length} SINS</span></h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {result.codeSmells.map((smellItem: any, idx: number) => {
                      const title = typeof smellItem === "string" ? smellItem : smellItem.smell;
                      const detail = typeof smellItem === "string" ? null : smellItem.detail;
                      return (
                        <div key={idx} className="bg-zinc-900 border border-[#d99753]/40 hover:border-[#d99753] p-6 shadow-[4px_4px_0px_#000000] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                          <div className="space-y-3">
                            <div className="border-b border-zinc-800 pb-2">
                              <span className="font-mono text-[10px] uppercase font-bold text-[#d99753]">CHARGE_0{idx + 1}</span>
                            </div>
                            <h3 className="font-['Space_Grotesk'] text-[18px] uppercase font-black tracking-tight leading-snug group-hover:text-[#d99753] transition-colors">{title}</h3>
                            {detail && <p className="text-[14px] text-zinc-400 leading-relaxed">{detail}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="bg-zinc-900 border border-zinc-800 p-6 shadow-[0_0_30px_rgba(0,0,0,0.7)] flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex flex-col space-y-1 text-center lg:text-left">
                  <span className="font-['Space_Grotesk'] text-[22px] uppercase font-black tracking-tight">BROADCAST TELEMETRY</span>
                  <p className="text-[12px] text-zinc-400 max-w-lg">Deliver the diagnosis to engineering peers or publish verifiable metrics on Tech Twitter / X.</p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 w-full lg:w-auto">
                  <button onClick={copyShareReceipt} className="flex-1 sm:flex-none bg-[#d99753] hover:bg-[#b87333] text-[#131315] text-[14px] uppercase px-6 py-4 border border-[#d99753] shadow-[0_0_16px_rgba(217,151,83,0.4)] hover:-translate-y-0.5 transition-all font-bold tracking-wider">
                    FLEX CLOWN SCORE (COPY)
                  </button>
                  <button onClick={() => setAppState('idle')} className="flex-1 sm:flex-none bg-zinc-800 text-zinc-100 text-[14px] uppercase px-4 py-4 border border-zinc-700 hover:border-zinc-500 hover:-translate-y-0.5 transition-all font-bold tracking-wider">
                    ROAST NEXT REPO
                  </button>
                </div>
              </div>

            </div>
          )}
        </main>

        {/* --- GLOBAL FOOTER --- */}
        <footer className="w-full bg-[#09090b] border-t border-zinc-800 text-[11px] font-mono relative z-40">
          <div className="max-w-7xl mx-auto px-4 h-12 flex flex-wrap items-center justify-between gap-4">
            <span className="text-zinc-500 font-bold tracking-widest">REPO ROASTER ENGINE v4.2</span>
            <div className="flex items-center gap-4">
              <a href="https://instagram.com/Noelpm14" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#d99753] transition-colors flex items-center gap-1 font-bold">
                <span>CHIEF ROASTER: @Noelpm14</span>
                <span className="material-symbols-outlined text-[12px]">north_east</span>
              </a>
              <div className="h-3.5 w-px bg-zinc-800 hidden sm:block"></div>
              <span className="text-zinc-600 hidden sm:inline">© 2026 REPO ROASTER SYSTEM. ZERO MERCY.</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
