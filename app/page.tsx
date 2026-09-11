"use client";

import { useState, useEffect, FormEvent, useRef } from "react";

interface AuditResult {
  repoName: string;
  roast: string;
  roastScore: number;
  codeSmells: string[];
  verdict: string;
}

export default function Home() {
  const [appState, setAppState] = useState<"gateway" | "idle" | "cooking" | "receipts">("gateway");
  const [repoUrl, setRepoUrl] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [cookTime, setCookTime] = useState(0);

  // Load fonts and icons
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;700;900&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  // Cooking Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (appState === "cooking") {
      setCookTime(0);
      interval = setInterval(() => setCookTime((t) => t + 0.05), 50);
    }
    return () => clearInterval(interval);
  }, [appState]);

  const triggerAudit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!repoUrl.trim()) return;

    setAppState("cooking");

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl, persona: "psychopath" }),
      });
      const data = await res.json();
      setResult(data);
      setAppState("receipts");
    } catch (error) {
      setResult({
        repoName: repoUrl || "System-Overload",
        roast: "This codebase is so catastrophically terrible that it actually caused our AI to suffer a panic attack and exhaust its API quota. The model literally refused to process any more of this spaghetti code to protect its own sanity.",
        roastScore: 99,
        codeSmells: ["API Emotional Abuse", "Unprecedented Toxicity", "StackOverflow Copy-Paste Overflow"],
        verdict: "Codebase so toxic it triggered Google's API safety limits."
      });
      setAppState("receipts");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#d97706] selection:text-black bg-[#0e0e10] text-[#f4f4f5]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      
      {/* GLOBAL HEADER */}
      <header className="w-full bg-[#111114] border-b border-[#27272b] text-xs sticky top-0 z-50">
        <div className="max-w-[1720px] mx-auto flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setAppState("idle")}>
              <span className="font-['Space_Grotesk'] font-black text-xl tracking-tighter">REPO<span className="text-[#d97706]">ROASTER</span></span>
              <div className="hidden sm:inline-flex items-center gap-1 bg-[#d97706]/10 text-[#d97706] border border-[#d97706]/30 px-1.5 py-0.5 ml-2 uppercase font-bold tracking-widest text-[10px]">
                <span className="material-symbols-outlined text-[12px]">warning</span> AI ENGINE v4.2
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-[#71717a] font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span className="text-[#a1a1aa]">DAEMON: ACTIVE</span>
              <span className="text-[#71717a]">[pid: 4180]</span>
            </div>
            <a href="https://github.com" target="_blank" className="flex items-center gap-1 bg-[#27272b] hover:bg-[#3f3f46] text-white px-3 py-1.5 border border-[#3f3f46] transition-colors font-bold uppercase tracking-wider text-[10px]">
              STAR ON GITHUB
            </a>
          </div>
        </div>
        
        {/* Navigation Strip */}
        <div className="w-full border-t border-[#27272b] bg-[#0e0e10] px-4 overflow-x-auto">
          <nav className="flex items-center gap-6 min-w-max text-[11px] font-bold tracking-widest uppercase py-2.5">
            <span className={appState === "gateway" ? "text-[#d97706] border-b-2 border-[#d97706] pb-1" : "text-[#71717a]"}>01. GATEWAY</span>
            <span className={appState === "idle" ? "text-[#d97706] border-b-2 border-[#d97706] pb-1" : "text-[#71717a]"}>02. INGEST</span>
            <span className={appState === "cooking" ? "text-[#d97706] border-b-2 border-[#d97706] pb-1" : "text-[#71717a]"}>03. AST COOKING</span>
            <span className={appState === "receipts" ? "text-[#d97706] border-b-2 border-[#d97706] pb-1" : "text-[#71717a]"}>04. RECEIPTS</span>
          </nav>
        </div>
      </header>

      {/* DYNAMIC MAIN WORKSPACE */}
      <main className="flex-1 w-full max-w-[1720px] mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
        
        {/* STATE 1: VIBE CHECK (GATEWAY) */}
        {appState === "gateway" && (
          <div className="w-full max-w-4xl bg-[#111114] border border-[#d97706]/40 shadow-[0_0_30px_rgba(217,119,6,0.15)] flex flex-col relative overflow-hidden">
            <div className="bg-[#161619] px-6 py-4 flex items-center justify-between border-b border-[#27272b]">
              <span className="font-mono text-xs text-[#a1a1aa] tracking-widest">GATEWAY://PROTOCOL_403</span>
              <span className="text-[#d97706] bg-[#d97706]/10 border border-[#d97706]/30 px-2 py-0.5 text-[10px] font-bold tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-ping"></span> STATUS: UNCOMPROMISING
              </span>
            </div>
            <div className="p-8 md:p-12 flex flex-col gap-8">
              <div className="flex flex-col gap-4 text-center md:text-left">
                <span className="inline-block text-[#ef4444] font-bold tracking-widest text-xs uppercase border border-[#ef4444]/30 bg-[#ef4444]/10 px-2 py-1 self-start md:self-auto">TRIGGER WARNING</span>
                <h1 className="font-['Space_Grotesk'] text-4xl md:text-6xl text-white font-black uppercase tracking-tighter leading-none">
                  YOUR REPO IS ABOUT TO GET <span className="text-[#d97706] underline decoration-[#d97706] underline-offset-8">DISSECTED.</span>
                </h1>
                <p className="font-mono text-[#a1a1aa] max-w-2xl text-sm leading-relaxed mt-2">
                  Zero telemetry tracking. Zero marketing fluff. We strictly query GitHub's public API and let Gemini AI anatomize your architectural flaws in cold, mathematical prose.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#161619] border border-[#27272b] p-5 flex flex-col gap-2">
                  <span className="material-symbols-outlined text-[#d97706] text-2xl">cookie_off</span>
                  <span className="font-bold text-white uppercase tracking-wide text-sm mt-2">NO COOKIES</span>
                  <p className="text-[#71717a] text-xs">Zero remarketing ads. We only measure how reliably your code crashes in production.</p>
                </div>
                <div className="bg-[#161619] border border-[#27272b] p-5 flex flex-col gap-2">
                  <span className="material-symbols-outlined text-[#d97706] text-2xl">public</span>
                  <span className="font-bold text-white uppercase tracking-wide text-sm mt-2">PUBLIC SCRUTINY</span>
                  <p className="text-[#71717a] text-xs">If public on GitHub, it is indexed for algorithmic critique. Git commits exposed.</p>
                </div>
                <div className="bg-[#161619] border border-[#27272b] p-5 flex flex-col gap-2">
                  <span className="material-symbols-outlined text-[#d97706] text-2xl">psychology</span>
                  <span className="font-bold text-white uppercase tracking-wide text-sm mt-2">ZERO PADDING</span>
                  <p className="text-[#71717a] text-xs">Constructive brutality only. You waive rights to polite feedback or sugarcoated analysis.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
                <button onClick={() => setAppState("idle")} className="w-full sm:w-auto flex-1 bg-[#d97706] hover:bg-[#d99753] text-black font-['Space_Grotesk'] font-black text-lg uppercase px-8 py-4 flex items-center justify-center gap-2 transition-all active:scale-95">
                  ACCEPT THE ROAST <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button onClick={() => alert("Cowardice recorded in system logs.")} className="w-full sm:w-auto bg-[#161619] text-[#a1a1aa] hover:text-white border border-[#27272b] hover:border-[#71717a] font-bold text-sm uppercase px-8 py-4 transition-all">
                  RETURN TO SAFETY
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STATE 2: TECHNICAL DASHBOARD (IDLE) */}
        {appState === "idle" && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-[#111114] border border-[#27272b] p-8 flex flex-col gap-8 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#27272b] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#d97706] text-xs font-bold uppercase tracking-wider">// REPO SUBMISSION WORKBENCH</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#71717a] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">lock_open</span> PUBLIC AUDIT MODE
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <h1 className="font-['Space_Grotesk'] font-black text-4xl md:text-5xl text-white tracking-tighter uppercase leading-none">
                    INSPECT. DISSECT. HUMILIATE.
                  </h1>
                  <p className="font-mono text-xs md:text-sm text-[#a1a1aa] leading-relaxed max-w-2xl mt-2">
                    Static AST autopsy of public GitHub repositories. Decompiles anti-patterns, cyclic dependencies, type evasions, and architectural delusions without remorse.
                  </p>
                </div>

                <form className="flex flex-col gap-6" onSubmit={triggerAudit}>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-mono uppercase text-[#71717a] tracking-wider flex items-center justify-between">
                      <span>TARGET GITHUB REPOSITORY SPECIFIER</span>
                      <span className="text-[#d97706]">FORMAT: OWNER/REPO</span>
                    </label>
                    <div className="relative flex items-center bg-[#0e0e10] border border-[#27272b] focus-within:border-[#d97706] transition-colors">
                      <span className="px-4 text-[#71717a] font-mono text-sm select-none border-r border-[#27272b] bg-[#161619] py-4">github.com/</span>
                      <input 
                        className="w-full bg-transparent border-0 px-4 py-4 font-mono text-base text-white placeholder:text-[#3f3f46] focus:ring-0 focus:outline-none" 
                        placeholder="torvalds/linux" 
                        required 
                        spellCheck="false" 
                        type="text"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-2 text-[11px] text-[#71717a] font-mono">
                      <span className="w-2 h-2 bg-[#d97706] inline-block animate-pulse"></span> OUTPUT MODE: RAW DIAGNOSTIC
                    </div>
                    <button className="bg-[#d97706] hover:bg-[#d99753] text-black font-mono font-bold text-sm uppercase tracking-wider px-8 py-4 flex items-center justify-center gap-3 transition-all active:translate-y-0.5" type="submit">
                      <span>RUN THERMAL DISASSEMBLY</span>
                      <span className="material-symbols-outlined">terminal</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Benchmarks */}
              <div className="bg-[#111114] border border-[#27272b] p-6">
                <div className="flex items-center justify-between border-b border-[#27272b] pb-3 mb-4">
                  <div className="flex items-center gap-2 text-[#71717a] text-[11px] font-mono uppercase tracking-wider">
                    <span className="material-symbols-outlined text-sm">tune</span> PRE-CALIBRATED TARGET BASELINES
                  </div>
                  <span className="text-[10px] font-mono text-[#71717a]">CLICK TO LOAD ARTIFACT</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['facebook/react', 'vercel/next.js', 'torvalds/linux'].map((repo) => (
                    <button key={repo} onClick={() => setRepoUrl(repo)} className="text-left bg-[#0e0e10] border border-[#27272b] p-4 hover:border-[#d97706] transition-colors group flex flex-col gap-3">
                      <span className="font-mono text-sm font-semibold text-white group-hover:text-[#d97706] transition-colors">{repo}</span>
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#71717a] border-t border-[#27272b] pt-2 w-full">
                        <span>LOAD TARGET</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <aside className="lg:col-span-5 flex flex-col gap-6">
              <div className="border border-[#27272b] bg-[#111114] p-6 flex flex-col gap-4 font-mono">
                <div className="flex items-center justify-between text-xs border-b border-[#27272b] pb-3">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <span className="w-2 h-2 bg-[#d97706]"></span> CLUSTER THROUGHPUT
                  </div>
                  <span className="text-[10px] text-[#71717a]">SAMPLE_WINDOW: 60M</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#0e0e10] border border-[#27272b] p-3 flex flex-col">
                    <span className="text-[10px] text-[#71717a] mb-1">INGESTED</span>
                    <span className="text-xl font-bold text-white">2,418<span className="text-xs text-[#71717a] font-normal">/hr</span></span>
                  </div>
                  <div className="bg-[#0e0e10] border border-[#27272b] p-3 flex flex-col">
                    <span className="text-[10px] text-[#71717a] mb-1">FAIL_RATE</span>
                    <span className="text-xl font-bold text-[#d97706]">98.4%</span>
                  </div>
                  <div className="bg-[#0e0e10] border border-[#27272b] p-3 flex flex-col">
                    <span className="text-[10px] text-[#71717a] mb-1">LATENCY</span>
                    <span className="text-xl font-bold text-white">3.24s</span>
                  </div>
                </div>
              </div>

              <div className="border border-[#27272b] bg-[#111114] flex flex-col font-mono flex-1 min-h-[300px]">
                <div className="p-4 border-b border-[#27272b] flex items-center justify-between bg-[#161619]">
                  <span className="text-xs font-bold text-white uppercase">// INCIDENT LOG STREAM</span>
                  <span className="text-[10px] bg-[#0e0e10] border border-[#27272b] text-[#d97706] px-2 py-1">REAL-TIME</span>
                </div>
                <div className="divide-y divide-[#27272b] overflow-hidden opacity-70">
                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between text-[10px] text-[#71717a]">
                      <span>REQ_8842</span><span className="text-[#ef4444]">GRADE: F--</span>
                    </div>
                    <span className="text-white text-xs">repo: <span className="text-[#d97706]">alex-dev/portfolio</span></span>
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between text-[10px] text-[#71717a]">
                      <span>REQ_8841</span><span className="text-[#ef4444]">GRADE: JAIL</span>
                    </div>
                    <span className="text-white text-xs">repo: <span className="text-[#d97706]">web3-chad/crypto-dex</span></span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* STATE 3: COOKING (LOADING) */}
        {appState === "cooking" && (
          <div className="w-full max-w-4xl flex flex-col gap-6">
            <div className="bg-[#111114] border border-[#27272b] p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[#d97706]/10 border border-[#d97706]/40 text-[#d97706] px-3 py-1 text-xs font-mono font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#d97706] animate-ping"></span> ACTIVE PIPELINE
                  </div>
                  <span className="font-['Space_Grotesk'] text-xl font-bold text-white tracking-tight">{repoUrl}</span>
                </div>
                <div className="text-xs font-mono bg-[#161619] border border-[#27272b] px-3 py-1.5 text-white">
                  EXEC TIME: <span className="font-bold text-[#d97706]">{cookTime.toFixed(2)}s</span>
                </div>
              </div>

              <div className="w-full h-4 bg-[#0e0e10] border border-[#27272b] rounded-full overflow-hidden relative mb-6">
                <div className="h-full bg-[#d97706] rounded-full transition-all duration-300 relative" style={{ width: `${Math.min(cookTime * 20, 95)}%` }}>
                  <div className="absolute top-0 right-0 bottom-0 w-20 bg-white/30 skew-x-12 animate-pulse"></div>
                </div>
              </div>

              <div className="bg-[#0e0e10] border border-[#27272b] p-6 font-mono text-xs leading-loose h-[300px] overflow-hidden relative">
                <div className="flex flex-col gap-2 text-[#a1a1aa] opacity-80 animate-[marquee_5s_linear_infinite] absolute bottom-6 w-full">
                  <div><span className="text-[#71717a]">[00:00.42]</span> Scanning syntax tree structure... <span className="text-white font-bold">842 bloated node_modules</span> resolved.</div>
                  <div><span className="text-[#71717a]">[00:01.10]</span> Analyzing recursive hooks and side-effects...</div>
                  <div className="text-[#ef4444]"><span className="text-[#71717a]">[00:01.85]</span> Flagging severe antipatterns and circular re-renders...</div>
                  <div><span className="text-[#71717a]">[00:02.40]</span> Evaluating comment-to-workaround ratio: <span className="text-[#d97706] font-bold">98.4% copypasta</span></div>
                  <div><span className="text-[#71717a]">[00:03.15]</span> Synthesizing deep code critiques via Gemini inference model...</div>
                  <div className="text-[#d97706] font-bold animate-pulse mt-2"><span className="text-[#71717a] font-normal">[00:03.90]</span> SYNTHESIZING VERDICT RECEIPT <span className="inline-block w-2 h-4 bg-[#d97706] ml-1 align-middle animate-pulse"></span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STATE 4: RECEIPTS (RESULTS) */}
        {appState === "receipts" && result && (
          <div className="w-full flex flex-col gap-8 max-w-[1720px]">
            {/* Target Acquired Banner */}
            <div className="bg-[#111114] border border-[#27272b] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_4px_0_#000000]">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[#d97706] font-mono text-xs uppercase tracking-widest font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#d97706] animate-pulse"></span> TARGET LOCK // SYSTEM INGEST COMPLETE
                </div>
                <h1 className="font-['Space_Grotesk'] text-4xl md:text-5xl text-white uppercase font-black tracking-tight mt-1">
                  TARGET: <span className="text-[#d97706] border-b-4 border-[#d97706] pb-1">{result.repoName}</span>
                </h1>
              </div>
              <div className="flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-wider text-[#a1a1aa]">
                <div className="bg-[#161619] border border-[#27272b] px-3 py-2 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d97706]"></span> UUID: #{Math.floor(Math.random() * 90000) + 10000}</div>
                <div className="bg-[#161619] border border-[#27272b] px-3 py-2 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> STAMP: {new Date().toLocaleTimeString()}</div>
              </div>
            </div>

            {/* Stats Gauge & Telemetry */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-[#111114] border border-[#27272b] p-8 shadow-[4px_4px_0px_#d97706] flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-[#27272b] pb-4 mb-6">
                  <span className="text-[#d97706] font-mono text-sm uppercase font-bold tracking-widest">DESTRUCTION QUOTIENT GAUGE</span>
                  <span className="font-mono text-xs text-[#71717a]">ENGINE: NEURAL-ROAST-V4</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-8">
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-32 rounded-full border-8 border-[#27272b] border-t-[#d97706] border-r-[#d97706] flex items-center justify-center rotate-45 shadow-[0_0_30px_rgba(217,119,6,0.15)]">
                      <div className="flex flex-col items-center justify-center -rotate-45">
                        <span className="font-['Space_Grotesk'] text-5xl font-black text-[#d97706] leading-none">{result.roastScore}</span>
                        <span className="font-mono text-[10px] text-[#71717a] mt-1">PERCENT</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-[#71717a] uppercase mb-1">AGONY LEVEL</span>
                      <span className="font-['Space_Grotesk'] text-2xl text-white font-black uppercase">CRITICAL SPIRAL</span>
                      <span className="font-mono text-xs text-red-500 mt-1 font-bold">TIER 5 HAZARD</span>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-[#161619] border-l-4 border-[#d97706] p-4">
                  <span className="font-mono text-xs text-[#71717a] uppercase block mb-1">VERDICT CLASSIFICATION</span>
                  <span className="font-mono text-lg text-white font-bold">{result.verdict}</span>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#111114] border border-[#27272b] p-8 shadow-[4px_4px_0px_#000000]">
                <div className="flex items-center justify-between border-b border-[#27272b] pb-4 mb-6">
                  <span className="text-[#d97706] font-mono text-sm uppercase font-bold tracking-widest">BIOPSY TELEMETRY</span>
                </div>
                <div className="flex flex-col gap-3 font-mono">
                  <div className="flex items-center justify-between bg-[#0e0e10] border border-[#27272b] p-3 text-xs">
                    <span className="text-[#71717a]">VIBE-TO-VALUE RATIO</span><span className="text-white font-bold">1 : 42,000</span>
                  </div>
                  <div className="flex items-center justify-between bg-[#0e0e10] border border-[#27272b] p-3 text-xs">
                    <span className="text-[#71717a]">NODE_MODULES MASS</span><span className="text-white font-bold">1.2 GB [BLACK HOLE]</span>
                  </div>
                  <div className="flex items-center justify-between bg-[#0e0e10] border border-[#27272b] p-3 text-xs">
                    <span className="text-[#71717a]">SURVIVAL PROBABILITY</span><span className="text-white font-bold">3.2%</span>
                  </div>
                  <div className="flex items-center justify-between bg-[#0e0e10] border border-[#27272b] p-3 text-xs">
                    <span className="text-[#71717a]">DEVELOPER TRAUMA</span><span className="text-red-500 font-bold">MAXIMUM VOLTAGE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Terminal Roast */}
            <div className="bg-[#111114] border border-[#27272b] shadow-[4px_4px_0px_#000000] overflow-hidden">
              <div className="bg-[#161619] px-6 py-3 border-b border-[#27272b] flex items-center justify-between">
                <div className="flex items-center gap-3 font-mono text-xs text-[#d97706] font-bold tracking-wide">
                  <div className="flex gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#27272b]"></span><span className="w-2.5 h-2.5 rounded-full bg-[#27272b]"></span><span className="w-2.5 h-2.5 rounded-full bg-[#27272b]"></span></div>
                  terminal://receipts-exposed.sh --severity=nuclear
                </div>
              </div>
              <div className="p-8 font-mono text-sm md:text-base text-white leading-relaxed space-y-6">
                {result.roast.split('\n\n').map((paragraph, idx) => (
                  <div key={idx} className="flex items-start gap-4 bg-[#161619] p-5 border-l-4 border-[#d97706]">
                    <span className="text-[#d97706] font-bold shrink-0 text-xs mt-1">[LINE_0{idx+1}]</span>
                    <p>{paragraph}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Smells (Criminal Profile) */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-[#27272b] pb-2">
                <span className="w-2 h-2 rounded-full bg-[#d97706]"></span>
                <h2 className="font-['Space_Grotesk'] text-2xl text-white uppercase font-black tracking-tight">INDICTED PATTERNS: <span className="font-mono text-[#d97706]">TOP SINS</span></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {result.codeSmells.map((smell, idx) => (
                  <div key={idx} className="bg-[#111114] border border-[#ef4444]/40 p-6 flex flex-col justify-between group hover:border-[#ef4444] transition-colors">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-[#27272b] pb-2">
                        <span className="font-mono text-xs uppercase font-bold text-[#ef4444]">CHARGE_0{idx+1}</span>
                      </div>
                      <p className="font-mono text-sm text-[#e5e5e5] leading-relaxed">{smell}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-[#111114] border border-[#d97706]/60 p-8 shadow-[0_0_25px_rgba(217,119,6,0.15)] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col gap-1 text-center md:text-left">
                <span className="font-['Space_Grotesk'] text-2xl text-white uppercase font-black tracking-tight">BROADCAST TELEMETRY</span>
                <p className="font-mono text-sm text-[#71717a] max-w-lg">Deliver the diagnosis to engineering peers or publish verifiable metrics on Tech Twitter / X.</p>
              </div>
              <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                <button onClick={() => alert("Copied to clipboard!")} className="flex-1 md:flex-none bg-[#d97706] hover:bg-[#d99753] text-black font-['Space_Grotesk'] text-lg font-black uppercase px-8 py-4 shadow-[4px_4px_0px_#000000] active:translate-y-1 transition-all">
                  FLEX CLOWN SCORE (SHARE)
                </button>
                <button onClick={() => setAppState("idle")} className="flex-1 md:flex-none bg-[#161619] hover:bg-[#27272b] text-white border border-[#3f3f46] font-['Space_Grotesk'] text-lg font-bold uppercase px-8 py-4 shadow-[4px_4px_0px_#000000] active:translate-y-1 transition-all">
                  ROAST NEXT REPO
                </button>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* GLOBAL FOOTER */}
      <footer className="w-full bg-[#111114] border-t-2 border-[#27272b] mt-auto">
        <div className="max-w-[1720px] mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-['Space_Grotesk'] text-xl text-[#d97706] tracking-tight font-black">REPO ROASTER</span>
              <span className="bg-[#ef4444]/10 text-[#ef4444] font-mono text-[10px] px-2 py-0.5 border border-[#ef4444]/30 uppercase">DESTRUCTIVE AI ENGINE</span>
            </div>
            <p className="font-mono text-[11px] text-[#71717a] max-w-md">Savage algorithmic post-mortems for your unhinged spaghetti repositories. No safe spaces. No rubber duckies.</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2 font-mono text-[11px] text-[#71717a]">
            <a href="https://instagram.com/Noelpm14" target="_blank" className="text-white hover:text-[#d97706] flex items-center gap-1 transition-colors">
              CHIEF ROASTER: @Noelpm14 <span className="material-symbols-outlined text-[14px]">north_east</span>
            </a>
            <span>© 2026 REPO ROASTER SYSTEM. ALL SPAGHETTI DESTROYED.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
