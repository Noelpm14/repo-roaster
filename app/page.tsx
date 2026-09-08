
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

export default function Home() {
  const [hasClearance, setHasClearance] = useState<boolean | null>(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"requisition" | "pathology" | "transcript" | "evidence">("requisition");

  // Check if user has already accepted the privacy/cookie policy
  useEffect(() => {
    const clearance = localStorage.getItem("autopsy_clearance");
    setHasClearance(!!clearance);
  }, []);

  const grantClearance = () => {
    localStorage.setItem("autopsy_clearance", "true");
    setHasClearance(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setLoading(true);
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
      setActiveTab("pathology");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Prevent UI flashing before local storage is checked
  if (hasClearance === null) return <div className="min-h-screen bg-[#0a0f14]" />;

  // --- BEGIN: INTRODUCTION & CLEARANCE GATEWAY ---
  if (!hasClearance) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Special+Elite&display=swap" rel="stylesheet" />
        <div className="min-h-screen bg-[#0a0f14] text-stone-300 font-['Courier_Prime',monospace] flex items-center justify-center p-4 selection:bg-red-900 selection:text-white">
          
          <div className="max-w-2xl w-full border border-stone-700 bg-[#11161d] p-1 shadow-2xl relative">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-800/70" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-800/70" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-800/70" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-800/70" />

            <div className="border border-stone-700/50 p-6 md:p-10">
              <header className="border-b border-stone-700 pb-4 mb-6 text-center">
                <h1 className="text-xl md:text-2xl font-bold text-stone-100 tracking-widest uppercase">Security Clearance Required</h1>
                <p className="text-xs text-stone-500 mt-2">DEPARTMENT OF CODEBASE PATHOLOGY // SOP-09</p>
              </header>

              <div className="space-y-6 text-sm leading-relaxed">
                <section>
                  <h2 className="text-red-500 font-bold uppercase mb-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block animate-pulse" />
                    Standard Operating Procedure
                  </h2>
                  <p className="text-stone-400">
                    You are requesting access to the <strong>Unit 404 Autopsy Terminal</strong>. Your directive is to submit public GitHub repository coordinates. The system will parse the target's topology and generate a pathological assessment of its technical debt, anti-patterns, and architectural negligence.
                  </p>
                </section>

                <section>
                  <h2 className="text-stone-100 font-bold uppercase mb-1">Privacy & Data Governance</h2>
                  <p className="text-stone-400">
                    <strong>Zero Code Retention:</strong> This facility operates on a strict ephemeral basis. We do not clone, store, or retain your source code. Target metadata is fetched dynamically via the public GitHub API, analyzed in memory, and immediately flushed upon completion.
                  </p>
                </section>

                <section>
                  <h2 className="text-stone-100 font-bold uppercase mb-1">Cookie & Storage Compliance</h2>
                  <p className="text-stone-400">
                    We utilize browser <code className="bg-stone-800 px-1 py-0.5 text-xs rounded text-stone-300">localStorage</code> strictly to remember your clearance level (preventing this prompt from recurring). <strong>No third-party trackers, analytical beacons, or advertising cookies are deployed on this terminal.</strong>
                  </p>
                </section>
              </div>

              <div className="mt-10 pt-6 border-t border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-stone-500 font-['Special_Elite',cursive] uppercase tracking-widest">
                  AUTHORIZATION PENDING...
                </span>
                <button 
                  onClick={grantClearance}
                  className="w-full sm:w-auto bg-stone-200 hover:bg-white text-stone-900 font-bold px-8 py-3 text-xs uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer"
                >
                  ACKNOWLEDGE & ENTER
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  // --- END: INTRODUCTION & CLEARANCE GATEWAY ---

  // --- BEGIN: MAIN DESK UI ---
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Special+Elite&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@600;800&family=Caveat:wght@600;700&display=swap" rel="stylesheet" />

      <style dangerouslySetInnerHTML={{ __html: `
        .font-typewriter { font-family: 'Courier Prime', Courier, monospace; }
        .font-stamp { font-family: 'Special Elite', cursive, monospace; }
        .font-seal { font-family: 'Cinzel', serif; }
        .font-hand { font-family: 'Caveat', cursive; }
        .bg-woodgrain { background-color: #1a0f08; background-image: radial-gradient(ellipse at 50% 40%, rgba(68, 38, 20, 0.4) 0%, rgba(15, 8, 4, 0.95) 100%), repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 2px, transparent 2px, transparent 8px), linear-gradient(to bottom, #23140c 0%, #170d07 100%); box-shadow: inset 0 0 160px rgba(0,0,0,0.92); }
        .leather-mat { background: radial-gradient(circle at 48% 35%, #56331e 0%, #301a0d 80%, #201108 100%); border: 3px solid #6b4025; box-shadow: 0 25px 60px -10px rgba(0,0,0,0.9), 0 10px 25px rgba(0,0,0,0.8), inset 0 0 45px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.1); position: relative; }
        .leather-mat::before { content: ''; position: absolute; inset: 8px; border: 2px dashed rgba(220, 185, 140, 0.35); border-radius: 14px; pointer-events: none; }
        .topo-chart-bg { background-color: #d6ccba; background-image: radial-gradient(circle at 50% 50%, rgba(245, 239, 226, 0.75), rgba(204, 192, 172, 0.95)), radial-gradient(#5d6c52 0.75px, transparent 0.75px), repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(120, 135, 110, 0.18) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(120, 135, 110, 0.18) 40px); background-size: 100% 100%, 20px 20px, 40px 40px, 40px 40px; }
        .paper-sheet { background-color: #f7f3e8; background-image: linear-gradient(rgba(255,255,255,0.4), rgba(240,233,218,0.7)), radial-gradient(#111 0.4px, transparent 0.4px); background-size: 100%, 14px 14px; box-shadow: 0 18px 30px -10px rgba(0,0,0,0.45), 0 4px 10px rgba(0,0,0,0.25), inset 0 0 30px rgba(184, 160, 126, 0.2); }
        .rubber-stamp { mix-blend-mode: multiply; filter: contrast(160%) drop-shadow(0px 0px 0.4px rgba(180,0,0,0.4)); border: 3.5px double currentColor; text-transform: uppercase; letter-spacing: 0.15em; position: relative; }
        .postage-stamp { background: #fbf7ee; box-shadow: 0 4px 8px rgba(0,0,0,0.3); border: 4px dotted #c9bda4; outline: 2px solid #fbf7ee; }
        .paperclip-clip { position: absolute; width: 14px; height: 48px; border: 3px solid #8e959e; border-radius: 9px 9px 0 0; border-bottom: none; z-index: 50; box-shadow: 2px 2px 4px rgba(0,0,0,0.35), inset 1px 1px 1px #ffffff; }
        .paperclip-clip::after { content: ''; position: absolute; top: 8px; left: 2px; width: 6px; height: 38px; border: 2px solid #757d87; border-radius: 5px 5px 0 0; border-bottom: none; }
        .folder-tab { transition: all 0.18s ease-in-out; transform-origin: bottom center; }
        .folder-tab:hover { transform: translateY(-3px); }
        .active-tab { background-color: #f7f3e8 !important; color: #1a222d !important; font-weight: 700; border-bottom-color: #f7f3e8 !important; z-index: 40 !important; box-shadow: 0 -4px 10px rgba(0,0,0,0.18); }
      `}} />

      <div className="bg-woodgrain min-h-screen text-stone-900 font-typewriter overflow-x-hidden selection:bg-red-800 selection:text-white p-3 md:p-6 lg:p-8 flex items-center justify-center animate-in fade-in duration-1000">
        <main className="leather-mat w-full max-w-[1520px] rounded-2xl p-4 sm:p-7 md:p-9 my-auto overflow-hidden">
          
          <div className="topo-chart-bg relative rounded-xl border border-stone-400/70 p-4 sm:p-6 md:p-8 overflow-hidden min-h-[860px]">
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-45" xmlns="http://www.w3.org/2000/svg">
              <path d="M 120 180 Q 280 120 440 310 T 890 280 T 1280 490" fill="none" stroke="#3b5240" strokeDasharray="6,4" strokeWidth="2"></path>
              <path d="M 210 650 Q 520 780 830 540 T 1390 620" fill="none" stroke="#5a3d31" strokeDasharray="10,6" strokeWidth="2.5"></path>
              <circle cx="120" cy="180" fill="#882222" r="7"></circle>
              <circle cx="440" cy="310" fill="#25446b" r="6"></circle>
              <circle cx="890" cy="280" fill="none" r="9" stroke="#882222" strokeWidth="3"></circle>
              <circle cx="1280" cy="490" fill="#5a3d31" r="8"></circle>
            </svg>

            <div className="absolute top-4 left-1/2 -translate-x-1/2 select-none pointer-events-none text-center">
              <div className="rubber-stamp font-stamp text-stone-700/35 text-3xl sm:text-5xl md:text-6xl tracking-widest px-8 py-2 border-stone-600/30">
                REPO-AUTOPSY.ORG
              </div>
              <p className="font-typewriter text-xs tracking-widest text-stone-600/50 mt-1 uppercase">Central Repository Registry // Division of Codebase Pathology</p>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 pt-12 sm:pt-14 items-start">
              
              {/* LEFT BOARD: DYNAMIC LIVE STATS */}
              <section className="lg:col-span-4 relative rotate-[-1.2deg] transition-transform hover:rotate-0 duration-300">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30 w-36 h-10 bg-gradient-to-b from-stone-400 via-stone-300 to-stone-500 rounded-t shadow-md border-t border-stone-200 flex items-center justify-center">
                  <div className="w-16 h-2 bg-stone-700/60 rounded-full shadow-inner"></div>
                  <div className="absolute -top-3 w-8 h-4 border-2 border-stone-500 rounded-t-full"></div>
                </div>

                <article className="paper-sheet rounded-sm border border-stone-300 p-6 pt-9 text-xs sm:text-sm text-stone-900 leading-relaxed shadow-2xl relative">
                  {result && (
                    <div className={`absolute top-8 right-4 rubber-stamp font-stamp text-xs sm:text-sm px-2 py-0.5 rotate-[-8deg] font-bold pointer-events-none ${result.roastScore > 75 ? "text-red-700 border-red-700/80" : "text-amber-700 border-amber-700/80"}`}>
                      {result.roastScore > 75 ? "MORTALITY: FLATLINED" : "CRITICAL CONDITION"}
                    </div>
                  )}

                  <div className="border-b-2 border-stone-900 pb-3 mb-4">
                    <h1 className="text-base sm:text-lg font-bold tracking-tight font-typewriter uppercase">INCIDENT REPORT // FORM 1-A</h1>
                    <p className="text-[11px] text-stone-600 tracking-wider">CASE REF: #404-AUTOPSY</p>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div>
                      <span className="font-bold block text-stone-600 text-[11px] tracking-wider uppercase">[ TARGET SPECIMEN ]</span>
                      <p className="font-bold text-sm bg-stone-200/70 px-2 py-1 border-l-2 border-stone-900">
                        {result ? result.repoName : (loading ? "EXTRACTING DATA..." : "AWAITING SPECIMEN")}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[12px]">
                      <div>
                        <span className="text-stone-500 block text-[10px] uppercase">Incident Date:</span>
                        <span className="font-semibold">{new Date().toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px] uppercase">Primary Cause:</span>
                        <span className="font-bold text-red-800">Architectural Negligence</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-dashed border-stone-400 rounded p-3 bg-stone-100/70 mb-5 relative">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[11px] uppercase tracking-wide">Cognitive Hazard Metric</span>
                      <span className="text-xs font-bold text-red-700 font-mono">{result ? result.roastScore : 0}% ROT</span>
                    </div>
                    <div className="w-full bg-stone-300 h-4 rounded-sm border border-stone-400 overflow-hidden relative p-0.5">
                      <div 
                        className="bg-gradient-to-r from-amber-600 via-red-600 to-rose-900 h-full rounded-sm transition-all duration-1000"
                        style={{ width: `${result ? result.roastScore : 0}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] font-hand text-stone-700 mt-1.5 text-right -rotate-1">
                      * Monitored by Coroner Unit 404
                    </p>
                  </div>

                  <div className="bg-stone-200/50 p-2 border-t border-stone-300 text-[11px] leading-snug">
                    <span className="font-bold text-stone-600">CORONER VERDICT: </span>
                    <span>{result ? result.verdict : "Standing by for codebase ingestion..."}</span>
                  </div>

                  <div className="mt-5 pt-3 border-t border-stone-400 flex justify-between items-end">
                    <div>
                      <p className="font-hand text-lg text-blue-900 -rotate-3 leading-none">Coroner Dr. A. Turing</p>
                      <p className="text-[9px] text-stone-500 uppercase">Unit 404 Autopsy Officer #889</p>
                    </div>
                    {result && (
                      <div className="w-12 h-12 rounded-full border-2 border-stone-400/80 flex items-center justify-center font-stamp text-[9px] text-stone-600 rotate-6">
                        VERIFIED
                      </div>
                    )}
                  </div>
                </article>
              </section>

              {/* RIGHT TABS: INTERACTIVE DOSSIER */}
              <section className="lg:col-span-8 relative">
                <nav className="flex flex-wrap items-end gap-1.5 px-4 z-20 relative -mb-[1px]">
                  <button onClick={() => setActiveTab('requisition')} className={`folder-tab bg-[#2d4159] text-stone-200 hover:text-white px-4 py-2 text-xs uppercase font-typewriter rounded-t-md border-t border-l border-r border-stone-600 shadow cursor-pointer ${activeTab === 'requisition' ? 'active-tab' : ''}`}>
                    📋 Form 8-C: Target
                  </button>
                  <button onClick={() => setActiveTab('pathology')} className={`folder-tab bg-[#3a4d3d] text-stone-200 hover:text-white px-4 py-2 text-xs uppercase font-typewriter rounded-t-md border-t border-l border-r border-stone-600 shadow cursor-pointer ${activeTab === 'pathology' ? 'active-tab' : ''}`}>
                    🔬 Pathology Analysis
                  </button>
                  <button onClick={() => setActiveTab('transcript')} className={`folder-tab bg-[#543b2f] text-stone-200 hover:text-white px-4 py-2 text-xs uppercase font-typewriter rounded-t-md border-t border-l border-r border-stone-600 shadow cursor-pointer ${activeTab === 'transcript' ? 'active-tab' : ''}`}>
                    📼 Black-Box Log
                  </button>
                </nav>

                <div className="bg-[#223247] text-stone-100 rounded-lg p-3 sm:p-5 shadow-2xl border-4 border-[#162232] relative min-h-[450px]">
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.5px,transparent_0.5px)] opacity-5 pointer-events-none"></div>

                  {/* TAB 1: FORM INPUT */}
                  <div className={`paper-sheet text-stone-900 rounded p-6 sm:p-9 shadow-inner border border-stone-300 transition-opacity duration-200 ${activeTab !== 'requisition' ? 'hidden' : 'block'}`}>
                    <div className="paperclip-clip -top-4 right-10"></div>
                    <header className="border-b-2 border-stone-900 pb-3 mb-6">
                      <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight">FORM 8-C: SPECIMEN REQUISITION</h2>
                      <p className="text-xs text-stone-600 mt-1">Enter a public GitHub repository link. Our coroner unit will parse the structural topology and deliver an unvarnished post-mortem.</p>
                    </header>

                    <form className="space-y-5 text-xs sm:text-sm" onSubmit={handleSubmit}>
                      {error && (
                         <div className="border border-dotted border-red-800/60 bg-red-50/40 p-3 rounded text-[11px] text-stone-800 leading-relaxed">
                           <strong className="text-red-900 uppercase">SYSTEM FAULT: </strong> {error}
                         </div>
                      )}
                      <div className="space-y-1">
                        <label className="block font-bold uppercase text-[11px] text-stone-800 tracking-wider">
                          1. Target Repository Coordinates <span className="text-red-700">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={repoUrl.replace(/https?:\/\/github\.com\/?/, "")}
                          onChange={(e) => setRepoUrl(e.target.value)}
                          className="w-full bg-transparent border-0 border-b-2 border-dotted border-stone-500 focus:border-stone-900 focus:ring-0 px-1 py-1 font-typewriter text-stone-800 placeholder:text-stone-400 text-sm outline-none" 
                          placeholder="owner/repo" 
                          required 
                          disabled={loading}
                        />
                      </div>

                      <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full inline-block ${loading ? 'bg-amber-500 animate-ping' : 'bg-emerald-700'}`}></span>
                          <span className="text-[10px] font-mono uppercase text-stone-600">Field Transceiver: {loading ? 'TRANSMITTING' : 'ONLINE'}</span>
                        </div>
                        <button 
                          type="submit" 
                          disabled={loading || !repoUrl}
                          className="border-2 border-stone-800 bg-stone-200 hover:bg-stone-300 disabled:opacity-50 text-stone-900 font-bold px-6 py-2.5 rounded text-xs uppercase tracking-widest shadow flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          {loading ? "EXTRACTING DATA..." : "TRANSMIT DISPATCH ↵"}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* TAB 2: PATHOLOGY */}
                  <div className={`paper-sheet text-stone-900 rounded p-6 sm:p-9 shadow-inner border border-stone-300 ${activeTab !== 'pathology' ? 'hidden' : 'block'}`}>
                    <header className="border-b-2 border-stone-900 pb-3 mb-5 flex justify-between items-start">
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight">PATHOLOGICAL AUTOPSY FINDINGS</h2>
                        <p className="text-xs text-stone-600">Specimen: <span className="font-mono font-bold">{result?.repoName || "AWAITING SPECIMEN"}</span></p>
                      </div>
                      {result && <span className="rubber-stamp text-red-700 text-xs px-2 py-0.5 rotate-2">BIO-HAZARD</span>}
                    </header>
                    <div className="space-y-4 text-xs sm:text-sm">
                      {!result && !loading && <p className="text-stone-500 italic">No specimen data recorded. Please submit Form 8-C.</p>}
                      {loading && <p className="text-stone-500 italic animate-pulse">Running diagnostics...</p>}
                      {result?.codeSmells.map((smellItem: any, idx: number) => {
                         const title = typeof smellItem === "string" ? smellItem : smellItem.smell;
                         const detail = typeof smellItem === "string" ? null : smellItem.detail;
                         return (
                           <div key={idx} className="bg-stone-100 p-3 border-l-4 border-red-800">
                             <h3 className="font-bold text-red-900 uppercase">Finding {idx + 1}: {title}</h3>
                             {detail && <p className="mt-1 text-stone-700 leading-relaxed">{detail}</p>}
                           </div>
                         );
                      })}
                    </div>
                  </div>

                  {/* TAB 3: BLACK BOX LOG */}
                  <div className={`paper-sheet text-stone-900 rounded p-6 sm:p-9 shadow-inner border border-stone-300 ${activeTab !== 'transcript' ? 'hidden' : 'block'}`}>
                    <header className="border-b-2 border-stone-900 pb-3 mb-4 flex justify-between items-center">
                      <div>
                        <h2 className="text-lg font-bold uppercase tracking-tight">TERMINAL RECOVERY TRANSCRIPT</h2>
                        <p className="text-xs text-stone-600 font-mono">EXTRACTED FROM UNIT 404 LOGS</p>
                      </div>
                    </header>
                    <div className="bg-stone-900 text-emerald-400 font-mono p-4 rounded text-xs space-y-1.5 overflow-x-auto border border-stone-700 shadow-inner min-h-[150px]">
                      {!result && !loading && <p className="text-stone-500">[SYSTEM] Awaiting target payload...</p>}
                      {loading && <p className="text-amber-400 animate-pulse">[SYSTEM] Decrypting manifest debt... please wait.</p>}
                      {result && <p className="text-emerald-400 leading-relaxed whitespace-pre-line">{result.roast}</p>}
                    </div>
                  </div>

                </div>
              </section>
            </div>
            
            <footer className="mt-12 pt-6 border-t border-stone-400/80 flex flex-wrap items-center justify-between gap-4 relative z-10 text-stone-700 text-xs">
              <div className="flex items-center gap-2 select-none">
                <div className="postage-stamp w-8 h-10 flex flex-col items-center justify-center rotate-[-3deg] hover:rotate-0 transition-transform cursor-pointer">
                  <span className="font-bold text-xs font-stamp text-stone-800">git</span>
                </div>
                <span className="text-[10px] text-stone-600 ml-1 italic font-hand hidden sm:inline">Clearance level verified</span>
              </div>
              <div className="bg-stone-300/80 border border-stone-500 px-3 py-1 font-mono text-[10px] tracking-wider text-stone-800 uppercase shadow-sm">
                PROPERTY OF THE INSTITUTE // CLASSIFICATION: CODE AUTOPSY
              </div>
            </footer>

          </div>
        </main>
      </div>
    </>
  );
}
