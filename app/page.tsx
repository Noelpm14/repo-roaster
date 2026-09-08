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
  const [activeTab, setActiveTab] = useState<"requisition" | "pathology" | "transcript">("requisition");

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

  if (hasClearance === null) return <div className="min-h-screen bg-[#09090b]" />;

  // --- BEGIN: MINIMAL GATEWAY ---
  if (!hasClearance) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-300 font-mono flex items-center justify-center p-4 selection:bg-zinc-800 selection:text-white">
        <div className="max-w-2xl w-full border border-zinc-800 bg-[#09090b] p-8 sm:p-12">
          <header className="border-b border-zinc-800 pb-6 mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-zinc-100 uppercase tracking-tight">Security Clearance</h1>
            <p className="text-xs text-zinc-500 mt-2">DEPARTMENT OF CODEBASE PATHOLOGY</p>
          </header>

          <div className="space-y-8 text-sm leading-relaxed text-zinc-400 font-sans">
            <section>
              <h2 className="text-zinc-100 font-bold uppercase mb-2 font-mono text-xs tracking-widest">SOP-09: Directive</h2>
              <p>
                You are requesting access to the Unit 404 Autopsy Terminal. Submit public GitHub repository coordinates. The system will parse the target's topology and generate a pathological assessment of its technical debt and architectural negligence.
              </p>
            </section>
            <section>
              <h2 className="text-zinc-100 font-bold uppercase mb-2 font-mono text-xs tracking-widest">Data Governance</h2>
              <p>
                This facility operates ephemerally. We do not clone, store, or retain source code. Target metadata is fetched dynamically, analyzed in memory, and immediately flushed.
              </p>
            </section>
            <section>
              <h2 className="text-zinc-100 font-bold uppercase mb-2 font-mono text-xs tracking-widest">Cookie Policy</h2>
              <p>
                Browser local storage is utilized strictly to remember this clearance flag. No third-party trackers, analytical beacons, or advertising cookies are deployed.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <span className="text-xs text-zinc-500 uppercase tracking-widest">Awaiting Ack...</span>
            <button 
              onClick={grantClearance}
              className="w-full sm:w-auto bg-zinc-100 hover:bg-white text-zinc-900 font-bold px-8 py-3 text-xs uppercase tracking-widest transition-colors cursor-pointer"
            >
              ACKNOWLEDGE & ENTER
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- BEGIN: MAIN MINIMAL DESK UI ---
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-mono p-4 sm:p-8 flex items-center justify-center selection:bg-zinc-800 selection:text-white">
      <main className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
        
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-800 pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight uppercase">REPO/AUTOPSY</h1>
            <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Codebase Pathology & Triage</p>
          </div>
          <div className="text-xs text-zinc-600 bg-zinc-900 px-3 py-1 border border-zinc-800">
            SYSTEM STATUS: {loading ? "PROCESSING" : "ONLINE"}
          </div>
        </header>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: LIVE STATS (FLAT UI) */}
          <section className="lg:col-span-4 border border-zinc-800 bg-[#09090b] p-6 space-y-8">
            <div className="border-b border-zinc-800 pb-4 flex justify-between items-start">
              <div>
                <h2 className="text-sm font-bold text-zinc-100 uppercase">Incident Report</h2>
                <p className="text-[10px] text-zinc-500 mt-1">REF: 404-AUTOPSY</p>
              </div>
              {result && (
                <span className={`text-[10px] font-bold px-2 py-1 uppercase border ${result.roastScore > 75 ? "border-red-900 text-red-500 bg-red-950/30" : "border-amber-900 text-amber-500 bg-amber-950/30"}`}>
                  {result.roastScore > 75 ? "FLATLINED" : "CRITICAL"}
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Target Specimen</span>
                <div className="text-sm text-zinc-100 bg-zinc-900 border border-zinc-800 px-3 py-2 truncate">
                  {result ? result.repoName : (loading ? "Extracting..." : "None")}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Date</span>
                  <span className="text-zinc-300">{new Date().toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Cause</span>
                  <span className="text-zinc-300">Negligence</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 uppercase tracking-widest">Hazard Metric</span>
                <span className="font-bold text-zinc-100">{result ? result.roastScore : 0}%</span>
              </div>
              {/* Solid Progress Bar (No Gradients) */}
              <div className="w-full bg-zinc-900 h-2 border border-zinc-800 overflow-hidden">
                <div 
                  className="bg-zinc-100 h-full transition-all duration-700 ease-out"
                  style={{ width: `${result ? result.roastScore : 0}%` }}
                />
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-4 space-y-2">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Coroner Verdict</span>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                {result ? result.verdict : "Standing by for codebase ingestion..."}
              </p>
            </div>
          </section>

          {/* RIGHT: INTERACTIVE DOSSIER (FLAT TABS) */}
          <section className="lg:col-span-8 flex flex-col">
            <nav className="flex gap-2 mb-4 overflow-x-auto pb-2 sm:pb-0">
              {(["requisition", "pathology", "transcript"] as const).map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)} 
                  className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === tab 
                    ? 'border-zinc-500 bg-zinc-900 text-zinc-100' 
                    : 'border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  {tab === "requisition" ? "1. Requisition" : tab === "pathology" ? "2. Pathology" : "3. Transcript"}
                </button>
              ))}
            </nav>

            <div className="bg-[#09090b] border border-zinc-800 p-6 sm:p-8 min-h-[450px]">
              
              {/* TAB 1: FORM */}
              {activeTab === 'requisition' && (
                <div className="space-y-8 animate-in fade-in">
                  <header className="border-b border-zinc-800 pb-4">
                    <h2 className="text-lg font-bold text-zinc-100 uppercase tracking-tight">Specimen Requisition</h2>
                    <p className="text-xs text-zinc-500 mt-2 font-sans">Enter a public GitHub repository link to parse structural topology.</p>
                  </header>

                  <form className="space-y-6 text-sm" onSubmit={handleSubmit}>
                    {error && (
                       <div className="border border-red-900/50 bg-red-950/20 p-4 text-xs text-red-400">
                         <strong className="uppercase block mb-1">System Fault:</strong> {error}
                       </div>
                    )}
                    <div className="space-y-2">
                      <label className="block uppercase text-xs text-zinc-500 tracking-widest">
                        Target Coordinates
                      </label>
                      <input 
                        type="text" 
                        value={repoUrl.replace(/https?:\/\/github\.com\/?/, "")}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 focus:outline-none px-4 py-3 text-zinc-100 placeholder:text-zinc-700" 
                        placeholder="owner/repo" 
                        required 
                        disabled={loading}
                      />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-widest">
                        <span className={`w-2 h-2 inline-block ${loading ? 'bg-zinc-400 animate-pulse' : 'bg-zinc-700'}`} />
                        {loading ? 'Transmitting...' : 'Ready'}
                      </div>
                      <button 
                        type="submit" 
                        disabled={loading || !repoUrl}
                        className="w-full sm:w-auto border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-zinc-100 disabled:opacity-50 text-zinc-300 font-bold px-8 py-3 text-xs uppercase tracking-widest transition-colors cursor-pointer"
                      >
                        {loading ? "Extracting..." : "Transmit Dispatch"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: PATHOLOGY */}
              {activeTab === 'pathology' && (
                <div className="space-y-6 animate-in fade-in">
                  <header className="border-b border-zinc-800 pb-4">
                    <h2 className="text-lg font-bold text-zinc-100 uppercase tracking-tight">Pathological Findings</h2>
                    <p className="text-xs text-zinc-500 mt-2 font-mono">Specimen: {result?.repoName || "None"}</p>
                  </header>
                  
                  <div className="space-y-4">
                    {!result && !loading && <p className="text-zinc-600 text-sm font-sans">No specimen data recorded. Submit requisition.</p>}
                    {loading && <p className="text-zinc-500 text-sm animate-pulse font-sans">Running diagnostics...</p>}
                    {result?.codeSmells.map((smellItem: any, idx: number) => {
                       const title = typeof smellItem === "string" ? smellItem : smellItem.smell;
                       const detail = typeof smellItem === "string" ? null : smellItem.detail;
                       return (
                         <div key={idx} className="border border-zinc-800 bg-zinc-900/50 p-4">
                           <h3 className="font-bold text-zinc-200 text-sm uppercase mb-2">[{idx + 1}] {title}</h3>
                           {detail && <p className="text-zinc-400 text-xs font-sans leading-relaxed">{detail}</p>}
                         </div>
                       );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: TRANSCRIPT */}
              {activeTab === 'transcript' && (
                <div className="space-y-6 animate-in fade-in flex flex-col h-full">
                  <header className="border-b border-zinc-800 pb-4">
                    <h2 className="text-lg font-bold text-zinc-100 uppercase tracking-tight">Recovery Transcript</h2>
                    <p className="text-xs text-zinc-500 mt-2 font-mono">EXTRACTED FROM UNIT 404 LOGS</p>
                  </header>
                  
                  <div className="flex-1 bg-zinc-900 border border-zinc-800 p-6 text-sm overflow-x-auto">
                    {!result && !loading && <p className="text-zinc-600">[SYSTEM] Awaiting target payload...</p>}
                    {loading && <p className="text-zinc-400 animate-pulse">[SYSTEM] Decrypting manifest debt...</p>}
                    {result && <p className="text-zinc-300 font-sans leading-relaxed whitespace-pre-line">{result.roast}</p>}
                  </div>
                </div>
              )}

            </div>
          </section>
        </div>
        
        {/* FOOTER */}
        <footer className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <div className="uppercase tracking-widest">
            Classification: Code Autopsy
          </div>
          {/* Unobtrusive Instagram Link */}
          <div>
            Built by <a href="https://instagram.com/Noelpm14" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-200 underline underline-offset-4 transition-colors">@Noelpm14</a>
          </div>
        </footer>

      </main>
    </div>
  );
}
