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
  const [appState, setAppState] = useState<AppState>("gateway");
  const [repoUrl, setRepoUrl] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cookTime, setCookTime] = useState(0);
  const [activeReceiptTab, setActiveReceiptTab] = useState<"roast" | "crimes" | "metrics">("roast");

  // Vibe Check (Cookie Consent)
  useEffect(() => {
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
    // Automatically submit when clicking a quick link
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

  // Helper to calculate SVG circle dash offset based on score
  const calculateDashOffset = (score: number) => {
    const circumference = 264; // Based on r=42
    return circumference - (circumference * score) / 100;
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&family=Space+Grotesk:wght@700;800;900&display=swap" rel="stylesheet" />

      {/* Tailwind Theme Config from Designer */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              darkMode: "class",
              theme: {
                extend: {
                  colors: {
                    "surface-container-highest": "#353437",
                    "surface": "#131315",
                    "surface-container": "#201f22",
                    "error-container": "#93000a",
                    "surface-dim": "#131315",
                    "primary-container": "#f751a1",
                    "on-background": "#e5e1e4",
                    "surface-container-high": "#2a2a2c",
                    "outline": "#a68992",
                    "tertiary": "#efc200",
                    "on-error": "#690005",
                    "primary": "#ffb0cd",
                    "on-surface-variant": "#debec8",
                    "error": "#ffb4ab",
                    "surface-container-lowest": "#0e0e10",
                    "surface-container-low": "#1c1b1d",
                    "on-surface": "#e5e1e4",
                    "secondary": "#5de6ff",
                    "outline-variant": "#574048",
                  },
                  fontFamily: {
                    "label-md": ["JetBrains Mono"], "headline-md": ["Space Grotesk"], "body-sm": ["JetBrains Mono"], "headline-lg-mobile": ["Space Grotesk"], "display": ["Space Grotesk"], "headline-lg": ["Space Grotesk"], "label-sm": ["JetBrains Mono"], "headline-sm": ["Space Grotesk"], "body-md": ["JetBrains Mono"], "label-lg": ["JetBrains Mono"],
                  },
                  spacing: { "space-1": "4px", "space-2": "8px", "space-3": "12px", "space-4": "16px", "space-6": "24px", "space-8": "32px", "space-12": "48px", "gutter": "16px" }
                }
              }
            };
          `,
        }}
      />
      
      {/* Global CSS from Designer */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
            .animate-marquee { display: flex; width: max-content; animation: marquee 28s linear infinite; }
            .hazard-stripe { background: repeating-linear-gradient(45deg, #efc200, #efc200 14px, #131315 14px, #131315 28px); }
            .cyber-grid { background-size: 32px 32px; background-image: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px); }
            @keyframes waveform { 0%, 100% { stroke-dashoffset: 0; transform: scaleY(1); } 50% { stroke-dashoffset: 120; transform: scaleY(1.35); } }
            .waveform-path { animation: waveform 3.2s ease-in-out infinite alternate; transform-origin: center; }
            ::-webkit-scrollbar { display: none; }
          `,
        }}
      />

      <div className="bg-surface-container-lowest text-on-surface font-body-md text-[14px] cyber-grid min-h-screen selection:bg-primary selection:text-[#3e0022]">
        
        {/* --- GLOBAL HEADER --- */}
        <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest border-b-4 border-surface-container-highest shadow-[0_6px_0px_#000000]">
          <div className="h-20 w-full px-gutter flex items-center justify-between gap-space-4 border-b-2 border-surface-container-highest">
            <div className="flex items-center gap-space-3 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="160" height="40" fill="none">
                <rect x="4" y="6" width="48" height="48" fill="#facc15" stroke="#000" strokeWidth="4"/>
                <rect x="8" y="10" width="48" height="48" fill="#ec4899" stroke="#000" strokeWidth="4"/>
                <text x="32" y="44" fontFamily="monospace" fontSize="28" fontWeight="900" fill="#000" textAnchor="middle">💀</text>
                <text x="68" y="38" fontFamily="'Space Grotesk', 'Impact', sans-serif" fontSize="28" fontWeight="900" fontStyle="italic" fill="#ffffff" letterSpacing="-1">REPO<tspan fill="#ec4899">ROASTER</tspan></text>
                <rect x="68" y="43" width="110" height="6" fill="#22d3ee" stroke="#000" strokeWidth="2"/>
              </svg>
              <div className="hidden sm:flex flex-col">
                <span className="font-headline-sm text-[22px] font-bold text-on-surface uppercase tracking-tight leading-none">REPO ROASTER</span>
                <div className="inline-flex items-center gap-space-1 bg-tertiary text-[#3c2f00] font-label-sm text-[10px] px-space-1 py-0.5 border border-surface-container-lowest shadow-[2px_2px_0px_#000000] mt-1 font-bold">
                  <span className="material-symbols-outlined text-[12px]">warning</span>
                  <span>AI CODE EXECUTIONER v4.20 // HIGH HAZARD</span>
                </div>
              </div>
            </div>
            <div className="hidden xl:flex flex-1 mx-space-4 bg-surface-container-low border-2 border-outline-variant py-1 px-space-2 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
              <div className="animate-marquee flex items-center whitespace-nowrap gap-space-8 text-on-surface-variant font-label-md text-[12px]">
                <span className="text-error font-bold">OVER 248,190 SKILL ISSUES DIAGNOSED</span>
                <span className="text-secondary font-bold">99% OF TECH TWITTER IS UNEMPLOYED</span>
                <span className="text-tertiary font-bold">REACT 19 WAS A MISTAKE</span>
                <span className="text-primary font-bold">YOUR TYPESCRIPT IS JUST 'ANY' EVERYWHERE</span>
                <span className="text-error font-bold">OVER 248,190 SKILL ISSUES DIAGNOSED</span>
              </div>
            </div>
          </div>
          
          {/* NAVIGATION STRIP */}
          <div className="w-full bg-surface-container-lowest px-gutter overflow-x-auto">
            <nav className="flex items-stretch gap-space-2 min-w-max pt-1">
              <button onClick={() => appState !== 'gateway' && setAppState('idle')} className={`px-space-4 py-space-2 font-label-lg text-[14px] uppercase border-2 border-b-0 border-outline-variant transition-colors ${appState === 'idle' ? 'bg-[#d99753] text-[#131315] border-[#d99753] shadow-[4px_0px_0px_#000000] font-bold' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'}`}>
                DROP REPO (IDLE)
              </button>
              <button className={`px-space-4 py-space-2 font-label-lg text-[14px] uppercase border-2 border-b-0 border-outline-variant transition-colors ${appState === 'cooking' ? 'bg-[#d99753] text-[#131315] border-[#d99753] shadow-[4px_0px_0px_#000000] font-bold' : 'bg-surface-container text-on-surface-variant'}`}>
                COOKING MODE (LIVE)
              </button>
              <button className={`px-space-4 py-space-2 font-label-lg text-[14px] uppercase border-2 border-b-0 border-outline-variant transition-colors ${appState === 'receipts' ? 'bg-[#d99753] text-[#131315] border-[#d99753] shadow-[4px_0px_0px_#000000] font-bold' : 'bg-surface-container text-on-surface-variant'}`}>
                THE RECEIPTS (RESULTS)
              </button>
              <button className={`px-space-4 py-space-2 font-label-lg text-[14px] uppercase border-2 border-b-0 border-outline-variant transition-colors ${appState === 'gateway' ? 'bg-[#d99753] text-[#131315] border-[#d99753] shadow-[4px_0px_0px_#000000] font-bold' : 'bg-surface-container text-on-surface-variant'}`}>
                VIBE CHECK (GATEWAY)
              </button>
            </nav>
          </div>
        </header>

        <main className="w-full pt-36 pb-16 min-h-[calc(100vh-280px)]">
          
          {/* --- STATE 1: VIBE CHECK (GATEWAY) --- */}
          {appState === "gateway" && (
            <div className="flex flex-col w-full relative min-h-[calc(100vh-144px)] overflow-hidden">
              <div className="relative z-10 w-full max-w-4xl mx-auto px-gutter py-space-8 sm:py-space-12 flex flex-col items-center justify-center">
                <div className="w-full bg-[#131315] border border-outline-variant/40 rounded-lg overflow-hidden transition-all duration-300">
                  <div className="bg-surface-container-lowest/80 px-space-4 py-space-3 flex items-center justify-between border-b border-outline-variant/30">
                    <div className="flex items-center gap-space-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary-container/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-tertiary/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-secondary/80"></div>
                      </div>
                      <span className="font-label-sm text-[10px] text-on-surface-variant font-mono tracking-widest">GATEWAY://PROTOCOL_403</span>
                    </div>
                  </div>
                  <div className="p-space-6 sm:p-space-8 flex flex-col gap-space-8">
                    <div className="flex flex-col gap-space-3 text-left">
                      <div className="inline-flex items-center gap-space-2">
                        <span className="font-label-sm text-[10px] tracking-widest text-tertiary bg-tertiary/10 border border-tertiary/30 px-space-2 py-0.5 rounded font-bold uppercase">PROTOCOL-403</span>
                        <span className="font-label-sm text-[10px] text-on-surface-variant font-mono tracking-wider">ZERO_COOKIES_ZERO_MERCY</span>
                      </div>
                      <h1 className="font-display text-[32px] sm:text-[44px] text-[#e5e1e4] uppercase tracking-tight font-black leading-tight">
                        TRIGGER WARNING: <span className="text-[#d99753] underline decoration-[#b87333] decoration-2 underline-offset-8">YOUR REPO</span> IS ABOUT TO GET DISSECTED.
                      </h1>
                      <p className="font-body-md text-[14px] text-on-surface-variant max-w-2xl leading-relaxed">
                        Zero telemetry tracking. Zero marketing fluff. We strictly query GitHub's public API and let Gemini AI anatomize your architectural flaws in cold, mathematical prose.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-space-4">
                      <div className="bg-[#1c1b1d] p-space-4 rounded flex flex-col gap-space-2 group">
                        <span className="font-label-sm text-[10px] text-[#d99753] font-bold uppercase tracking-wider">CLAUSE 01</span>
                        <span className="font-title-md text-[16px] font-bold uppercase tracking-wide">NO COOKIES</span>
                        <p className="font-body-sm text-[12px] text-on-surface-variant">Zero remarketing ads. We only measure how reliably code crashes in production.</p>
                      </div>
                      <div className="bg-[#1c1b1d] p-space-4 rounded flex flex-col gap-space-2 group">
                        <span className="font-label-sm text-[10px] text-[#b87333] font-bold uppercase tracking-wider">CLAUSE 02</span>
                        <span className="font-title-md text-[16px] font-bold uppercase tracking-wide">PUBLIC SCRUTINY</span>
                        <p className="font-body-sm text-[12px] text-on-surface-variant">If public on GitHub, it is indexed for algorithmic critique. Git commits and rebase logs exposed.</p>
                      </div>
                      <div className="bg-[#1c1b1d] p-space-4 rounded flex flex-col gap-space-2 group">
                        <span className="font-label-sm text-[10px] text-[#d99753] font-bold uppercase tracking-wider">CLAUSE 03</span>
                        <span className="font-title-md text-[16px] font-bold uppercase tracking-wide">ZERO PADDING</span>
                        <p className="font-body-sm text-[12px] text-on-surface-variant">Constructive brutality only. You waive rights to polite feedback or sugarcoated analysis.</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-4 pt-4 border-t border-outline-variant/20">
                      <button onClick={grantClearance} className="flex-1 bg-[#d99753] text-[#131315] font-headline-sm text-[22px] uppercase px-space-6 py-space-4 rounded font-bold tracking-tight shadow-[0_4px_14px_rgba(217,151,83,0.4)] hover:scale-[1.01] transition-all flex items-center justify-center gap-space-2">
                        <span>EXECUTE ANALYSIS</span>
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- STATE 2: IDLE (DROP ZONE) --- */}
          {appState === "idle" && (
            <div className="relative w-full max-w-5xl mx-auto px-gutter py-space-8 flex flex-col gap-space-8 animate-in fade-in zoom-in duration-500">
              <div className="flex flex-col gap-space-4 items-center text-center relative pt-4">
                <div className="inline-flex items-center gap-space-2 bg-white/[0.03] border border-primary/50 rounded-full px-space-4 py-1 backdrop-blur">
                  <span className="w-2 h-2 rounded-full bg-[#d99753]"></span>
                  <span className="font-label-sm text-[11px] uppercase tracking-widest text-[#d99753]">UNFILTERED AI CODE DISASSEMBLY</span>
                </div>
                <h1 className="font-display text-[44px] md:text-[64px] max-w-4xl uppercase tracking-tighter leading-none text-on-surface font-black">
                  PASTE YOUR REPO.<br /><span className="text-[#d99753]">GET BRUTALLY HUMILIATED.</span>
                </h1>
              </div>

              <div className="w-full bg-[#0e0e11] border border-[#d99753]/30 rounded-xl p-space-6 relative shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-space-3 mb-space-4">
                  <div className="flex items-center gap-space-2">
                    <span className="font-label-sm text-[11px] text-on-surface-variant">TERMINAL TARGET // CLI v4.20</span>
                  </div>
                </div>
                
                <form id="roast-form" className="flex flex-col md:flex-row items-stretch gap-space-3" onSubmit={handleSubmit}>
                  <div className="flex-1 flex items-center bg-[#09090b] border border-[#d99753]/40 focus-within:border-[#d99753] rounded-lg px-space-4 py-2 transition-all">
                    <span className="font-label-md text-[#d99753] text-[14px] select-none mr-2">github.com/</span>
                    <input 
                      autoComplete="off" 
                      className="flex-1 bg-transparent border-0 font-label-md text-on-surface placeholder:text-outline-variant focus:outline-none text-[15px]" 
                      id="repo-input" 
                      placeholder="torvalds/linux or your-ugly-codebase" 
                      required 
                      spellCheck="false" 
                      type="text"
                      value={repoUrl.replace(/https?:\/\/github\.com\/?/, "")}
                      onChange={(e) => setRepoUrl(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="bg-[#d99753] text-[#131315] font-label-lg text-[14px] uppercase px-space-6 py-space-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0">
                    <span>LET HIM COOK</span>
                    <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
                  </button>
                </form>
                
                {error && (
                  <div className="mt-4 p-3 border border-error bg-error-container/20 text-error font-mono text-[12px] uppercase">
                    SYSTEM FAULT: {error}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-space-3">
                <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px] text-[#d99753]">bolt</span>
                  <span>OR SACRIFICE AN INDUSTRY STANDARD:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-space-3">
                  {['facebook/react', 'vercel/next.js', 'reduxjs/redux', 'tailwindlabs/tailwindcss'].map(repo => (
                    <button key={repo} onClick={() => setBenchmark(repo)} className="group flex flex-col p-space-3 bg-white/[0.02] border border-white/10 hover:border-[#d99753] rounded-lg transition-all text-left">
                      <span className="text-[12px] font-label-md text-[#d99753] font-bold group-hover:translate-x-0.5 transition-transform">{repo}</span>
                      <span className="text-[11px] font-body-sm text-on-surface-variant">Click to roast</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- STATE 3: COOKING (LOADING) --- */}
          {appState === "cooking" && (
            <section className="w-full px-gutter py-space-3 max-w-7xl mx-auto flex flex-col gap-space-4">
              <div className="w-full bg-surface-container-low border border-outline-variant/40 p-space-4 flex flex-col md:flex-row items-center justify-between gap-space-4 shadow-xl transition-all">
                <div className="flex items-center gap-space-4">
                  <div className="flex items-center gap-space-2 px-space-3 py-1 bg-surface-container border border-[#d99753]/40 text-[#d99753] font-label-sm text-[10px] uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-[#d99753] animate-ping"></span>
                    <span>ACTIVE PIPELINE</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-[22px] font-bold">{repoUrl || 'TARGET ACQUIRED'}</span>
                    <span className="font-label-sm text-[10px] text-on-surface-variant font-mono">MAIN BRANCH AUDIT</span>
                  </div>
                </div>
                <div className="px-space-3 py-1 bg-surface-container-high text-[#d99753] font-mono text-[10px] border border-[#d99753]/20">
                  EXEC TIME: <span className="font-bold text-on-surface">{cookTime.toFixed(2)}s</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-6 py-space-2">
                <div className="lg:col-span-8 flex flex-col gap-space-6">
                  <div className="bg-surface-container-low border border-outline-variant/30 flex flex-col shadow-2xl">
                    <div className="bg-surface-container px-space-4 py-space-3 flex items-center justify-between border-b border-outline-variant/20">
                      <span className="font-label-md text-[12px] text-on-surface-variant font-mono tracking-wider uppercase">DESTRUCTIVE_AUDIT.LOG</span>
                    </div>
                    <div className="p-space-6 bg-surface-container-lowest/80 flex flex-col gap-space-3 min-h-[380px] font-mono text-[12px] leading-relaxed overflow-hidden">
                      <div className="flex flex-col gap-space-3 text-on-surface-variant">
                        <div className="flex items-start gap-space-3"><span className="text-[#d99753]/70">[{cookTime.toFixed(2)}s]</span><span className="text-on-surface">Scanning syntax tree structure... Resolving dependencies.</span></div>
                        {cookTime > 1.5 && <div className="flex items-start gap-space-3"><span className="text-[#d99753]/70">[{cookTime.toFixed(2)}s]</span><span className="text-secondary">Analyzing recursive hooks and side-effects...</span></div>}
                        {cookTime > 2.5 && <div className="flex items-start gap-space-3"><span className="text-[#d99753]/70">[{cookTime.toFixed(2)}s]</span><span className="text-error">Flagging severe antipatterns...</span></div>}
                        {cookTime > 3.5 && <div className="flex items-start gap-space-3"><span className="text-[#d99753]/70">[{cookTime.toFixed(2)}s]</span><span className="text-on-surface-variant">Synthesizing deep code critiques via Gemini inference model...</span></div>}
                        <div className="flex items-center gap-space-2 text-[#d99753] pt-space-2">
                          <span className="font-bold">AWAITING API PAYLOAD</span>
                          <span className="w-2 h-4 bg-[#d99753] inline-block animate-ping"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-space-6">
                  <div className="bg-surface-container-low border border-outline-variant/30 p-space-4 shadow-xl flex flex-col gap-space-4">
                    <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-2">
                      <span className="font-label-md text-[12px] uppercase tracking-wider font-bold">INFERENCE ENGINE</span>
                      <span className="font-label-sm text-[10px] text-on-surface-variant font-mono">GEMINI-3.6-FLASH</span>
                    </div>
                    <div className="bg-surface-container-lowest p-space-3 border border-outline-variant/20 flex flex-col gap-space-2 relative overflow-hidden">
                      <svg className="w-full h-20 text-[#d99753]" fill="none" preserveAspectRatio="none" viewBox="0 0 300 64">
                        <path className="waveform-path" d="M0,32 Q25,8 50,32 T100,32 T150,12 T200,48 T250,20 T300,32" stroke="#d99753" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" opacity="0.95"></path>
                        <path className="waveform-path" d="M0,32 Q35,54 70,32 T140,24 T210,40 T280,18 T300,32" stroke="#b87333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" opacity="0.7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* --- STATE 4: THE RECEIPTS (RESULTS) --- */}
          {appState === "receipts" && result && (
            <div className="flex flex-col w-full max-w-7xl mx-auto px-gutter pb-space-16 space-y-space-8 animate-in slide-in-from-bottom-8 duration-700">
              
              <div className="flex flex-wrap items-center justify-between gap-space-4 pt-space-4 border-b border-outline-variant pb-space-3">
                <div className="flex flex-wrap items-center gap-space-2">
                  <button onClick={() => setActiveReceiptTab('roast')} className={`font-label-md text-[12px] uppercase px-space-4 py-space-2 border-2 transition-all font-bold ${activeReceiptTab === 'roast' ? 'bg-[#d99753] text-[#131315] border-[#d99753] shadow-[4px_4px_0px_#000000]' : 'bg-surface-container-low text-on-surface-variant border-surface-container-highest hover:text-on-surface'}`}>THE ROAST</button>
                  <button onClick={() => setActiveReceiptTab('crimes')} className={`font-label-md text-[12px] uppercase px-space-4 py-space-2 border-2 transition-all font-bold ${activeReceiptTab === 'crimes' ? 'bg-[#d99753] text-[#131315] border-[#d99753] shadow-[4px_4px_0px_#000000]' : 'bg-surface-container-low text-on-surface-variant border-surface-container-highest hover:text-on-surface'}`}>CRIMINAL PROFILE</button>
                </div>
              </div>

              <div className="relative bg-surface-container-low border border-outline-variant p-space-6 shadow-[0_0_20px_rgba(0,0,0,0.6)] overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-6 relative z-10">
                  <div className="flex flex-col space-y-space-2">
                    <div className="flex items-center gap-space-2 text-[#d99753] font-label-md text-[12px] uppercase tracking-widest">
                      <span className="w-2 h-2 rounded-full bg-[#d99753] animate-pulse"></span>
                      <span className="tracking-wider">TARGET LOCK // INGEST COMPLETE</span>
                    </div>
                    <h1 className="font-headline-lg text-[44px] uppercase font-black tracking-tight">TARGET: <span className="text-[#d99753] border-b-2 border-[#d99753] font-display tracking-normal">{result.repoName}</span></h1>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-6 items-stretch">
                <div className="lg:col-span-7 bg-surface-container-low border border-outline-variant p-space-6 shadow-[4px_4px_0px_#000000] flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between border-b border-outline-variant pb-space-3 mb-space-4">
                    <span className="text-[#d99753] font-label-md text-[12px] uppercase font-bold tracking-widest">DESTRUCTION QUOTIENT GAUGE</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-6 my-space-2">
                    <div className="flex items-center gap-space-6">
                      <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" fill="none" stroke="#201f22" strokeWidth="8"></circle>
                          <circle cx="50" cy="50" r="42" fill="none" stroke="#d99753" strokeWidth="8" strokeDasharray="264" strokeDashoffset={calculateDashOffset(result.roastScore)} strokeLinecap="round" className="transition-all duration-1000 ease-out"></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                          <span className="text-[34px] font-display font-black text-[#d99753] leading-none">{result.roastScore}</span>
                          <span className="text-[10px] font-mono text-outline uppercase">PERCENT</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider">COMPILATION AGONY LEVEL</span>
                        <span className="font-headline-sm text-[22px] font-black uppercase tracking-tight">{result.roastScore > 80 ? "CRITICAL SPIRAL" : result.roastScore > 50 ? "MODERATE TOXICITY" : "COPIUM DETECTED"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-5 bg-surface-container-low border border-outline-variant p-space-6 shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-outline-variant pb-space-2 mb-space-3">
                    <span className="font-label-md text-[12px] text-[#d99753] font-bold uppercase tracking-widest">BIOPSY VERDICT</span>
                  </div>
                  <div className="mt-space-3 bg-surface-container border-l-4 border-[#d99753] p-space-4 font-label-sm text-[14px] text-on-surface flex items-center gap-space-2 leading-relaxed italic">
                    {result.verdict}
                  </div>
                </div>
              </div>

              {/* TABS CONTENT */}
              {activeReceiptTab === 'roast' && (
                <div className="bg-surface-container-lowest border border-outline-variant shadow-[4px_4px_0px_#000000] crt-scanlines overflow-hidden">
                  <div className="bg-surface-container-high px-space-4 py-space-2 border-b border-outline-variant flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#d99753] tracking-wide font-bold">terminal://receipts-exposed.sh</span>
                  </div>
                  <div className="p-space-6 sm:p-space-8 space-y-space-4 font-mono text-[14px] text-on-surface">
                    {result.roast.split('\n\n').map((paragraph, idx) => (
                      <div key={idx} className="flex items-start gap-space-4 bg-surface-container-low/80 p-space-4 border-l-2 border-[#d99753] hover:border-l-4 transition-all duration-200">
                        <span className="text-[#d99753] font-bold shrink-0 pt-0.5 text-[12px]">[LINE_0{idx + 1}]</span>
                        <p className="leading-relaxed text-on-surface">{paragraph}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeReceiptTab === 'crimes' && (
                <div className="flex flex-col space-y-space-4">
                  <div className="flex items-center justify-between border-b border-outline-variant pb-space-2">
                    <h2 className="font-headline-sm text-[22px] uppercase font-black tracking-tight">INDICTED PATTERNS: <span className="text-[#d99753] font-mono">TOP {result.codeSmells.length} SINS</span></h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-space-6">
                    {result.codeSmells.map((smellItem: any, idx: number) => {
                      const title = typeof smellItem === "string" ? smellItem : smellItem.smell;
                      const detail = typeof smellItem === "string" ? null : smellItem.detail;
                      return (
                        <div key={idx} className="bg-surface-container-low border border-[#d99753]/40 hover:border-[#d99753] p-space-6 shadow-[4px_4px_0px_#000000] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group">
                          <div className="space-y-space-3">
                            <div className="flex items-center justify-between border-b border-outline-variant pb-space-2">
                              <span className="font-mono text-[10px] uppercase font-bold text-[#d99753]">CHARGE_0{idx + 1}</span>
                            </div>
                            <h3 className="font-title-lg text-[18px] uppercase font-black tracking-tight leading-snug group-hover:text-[#d99753] transition-colors">{title}</h3>
                            {detail && <p className="font-body-md text-[14px] text-on-surface-variant leading-relaxed">{detail}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ACTION FOOTER */}
              <div className="bg-surface-container-low border border-outline-variant p-space-6 shadow-[0_0_30px_rgba(0,0,0,0.7)] flex flex-col lg:flex-row items-center justify-between gap-space-6">
                <div className="flex flex-col space-y-space-1 text-center lg:text-left">
                  <span className="font-headline-sm text-[22px] uppercase font-black tracking-tight">BROADCAST TELEMETRY</span>
                  <p className="font-body-sm text-[12px] text-on-surface-variant max-w-lg">Deliver the diagnosis to engineering peers or publish verifiable metrics on Tech Twitter / X.</p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-space-4 w-full lg:w-auto">
                  <button onClick={copyShareReceipt} className="flex-1 sm:flex-none flex items-center justify-center gap-space-2 bg-[#d99753] text-[#131315] font-label-lg text-[14px] uppercase px-space-6 py-space-4 border border-[#d99753] shadow-[0_0_16px_rgba(217,151,83,0.4)] hover:-translate-y-0.5 transition-all font-bold tracking-wider">
                    <span className="font-black">FLEX CLOWN SCORE (COPY)</span>
                  </button>
                  <button onClick={() => setAppState('idle')} className="flex-1 sm:flex-none flex items-center justify-center gap-space-1 bg-surface-container text-on-surface font-label-lg text-[14px] uppercase px-space-4 py-space-4 border border-outline-variant hover:border-outline hover:-translate-y-0.5 transition-all font-bold tracking-wider">
                    <span>ROAST NEXT REPO</span>
                  </button>
                </div>
              </div>

            </div>
          )}
        </main>

        {/* --- GLOBAL FOOTER --- */}
        <footer className="w-full bg-[#111114] border-t border-border text-[11px] font-mono relative z-40">
          <div className="max-w-[1720px] mx-auto px-4 h-12 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-dim">
              <span className="text-muted font-bold tracking-widest">REPO ROASTER ENGINE v4.2</span>
            </div>
            <div className="flex items-center gap-4 text-dim">
              <a href="https://instagram.com/Noelpm14" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-[#d99753] transition-colors flex items-center gap-1 font-bold">
                <span>CHIEF ROASTER: @Noelpm14</span>
                <span className="material-symbols-outlined text-[12px]">north_east</span>
              </a>
              <div className="h-3.5 w-px bg-border hidden sm:block"></div>
              <span className="text-dim hidden sm:inline">© 2026 REPO ROASTER SYSTEM. ZERO MERCY.</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
