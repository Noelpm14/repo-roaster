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
  const [activeTab, setActiveTab] = useState<"form" | "roast" | "smells">("form");

  // Vibe check (Cookie/Privacy consent)
  useEffect(() => {
    const clearance = localStorage.getItem("meme_roaster_vibe_check");
    setHasClearance(!!clearance);
  }, []);

  const grantClearance = () => {
    localStorage.setItem("meme_roaster_vibe_check", "true");
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
      if (!res.ok) throw new Error(data.error || "Bro your repo broke our server 💀");
      
      setResult(data);
      setActiveTab("roast");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Prevent hydration UI flash
  if (hasClearance === null) return <div className="min-h-screen bg-zinc-950" />;

  // --- THE VIBE CHECK (PRIVACY / COOKIES GATEWAY) ---
  if (!hasClearance) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white font-sans flex items-center justify-center p-4 selection:bg-pink-500">
        <div className="max-w-xl w-full border-4 border-pink-500 bg-zinc-900 p-8 shadow-[8px_8px_0px_#ec4899] relative">
          <div className="absolute -top-6 -right-6 text-5xl animate-bounce">⚠️</div>
          
          <header className="border-b-4 border-zinc-800 pb-4 mb-6">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400 uppercase tracking-tighter transform -skew-x-6">
              MANDATORY VIBE CHECK
            </h1>
            <p className="text-sm text-zinc-400 mt-2 font-bold uppercase">Trigger Warning: Your code is about to get bullied.</p>
          </header>

          <div className="space-y-6 text-sm font-medium">
            <div className="bg-zinc-800 p-4 border-l-4 border-cyan-400">
              <h2 className="text-cyan-400 font-black uppercase mb-1 text-lg">🛑 The Rules</h2>
              <p className="text-zinc-300">You are about to feed a public GitHub repo to an unhinged AI. It will analyze your garbage code and roast you into oblivion.</p>
            </div>

            <div className="bg-zinc-800 p-4 border-l-4 border-yellow-400">
              <h2 className="text-yellow-400 font-black uppercase mb-1 text-lg">🍪 Cookies & Privacy</h2>
              <p className="text-zinc-300">We don't steal your code. We don't save your data. The only cookie we use is local storage to remember that you passed this vibe check so you don't see this popup again. Absolute zero tracking.</p>
            </div>
          </div>

          <button 
            onClick={grantClearance}
            className="mt-8 w-full bg-pink-500 hover:bg-pink-400 text-black font-black px-8 py-4 text-xl uppercase tracking-widest transition-all shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-1 active:translate-y-0 active:shadow-[0px_0px_0px_#000]"
          >
            I AIN'T CRYING. LET'S GO 💀
          </button>
        </div>
      </div>
    );
  }

  // --- MAIN MEME ROASTING UI ---
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-cyan-400 selection:text-black p-4 md:p-8 flex flex-col items-center">
      
      {/* HEADER */}
      <header className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b-4 border-zinc-800 pb-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-spin-slow">🤡</span>
          <div>
            <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
              REPO ROASTER
            </h1>
            <p className="text-zinc-400 font-bold uppercase text-xs tracking-widest mt-1">Exposing developer frauds since 2026</p>
          </div>
        </div>
        <div className="bg-zinc-900 border-2 border-zinc-700 px-4 py-2 font-mono text-xs text-zinc-400 font-bold uppercase shadow-[4px_4px_0px_#27272a]">
          STATUS: READY TO BULLY
        </div>
      </header>

      {/* MAIN GRID */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1">
        
        {/* LEFT COLUMN: THE DAMAGE (STATS) */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-zinc-900 border-4 border-zinc-800 p-6 shadow-[8px_8px_0px_#18181b]">
            <h2 className="text-xl font-black uppercase text-zinc-500 tracking-tighter mb-4 flex justify-between items-center">
              <span>TARGET ACQUIRED</span>
              <span className="text-2xl">{result ? '🎯' : '💤'}</span>
            </h2>
            
            <div className="bg-black border-2 border-zinc-800 p-3 mb-6 font-mono text-sm break-all text-cyan-400">
              {result ? result.repoName : (loading ? "SNIFFING CODEBASE..." : "N/A")}
            </div>

            <h2 className="text-xl font-black uppercase text-zinc-500 tracking-tighter mb-2">
              CLOWN SCORE (TECH DEBT)
            </h2>
            
            <div className="relative w-full h-8 bg-zinc-950 border-2 border-zinc-700 p-1 mb-2">
              <div 
                className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 transition-all duration-1000 ease-out"
                style={{ width: `${result ? result.roastScore : 0}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center mix-blend-difference text-white font-black text-xl italic drop-shadow-md">
                {result ? `${result.roastScore}% COOKED` : "0%"}
              </div>
            </div>
            
            <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500 mt-1">
              <span>Pristine ✨</span>
              <span>Absolute Garbage 🗑️</span>
            </div>

            <div className="mt-6 pt-4 border-t-4 border-zinc-800">
              <h3 className="text-sm font-black text-pink-500 uppercase mb-2">TL;DR VERDICT:</h3>
              <p className="font-bold text-lg leading-tight">
                {result ? `"${result.verdict}"` : "Waiting for someone to get roasted..."}
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: ACTION & TABS */}
        <section className="lg:col-span-8 flex flex-col">
          
          {/* MEME TABS */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              onClick={() => setActiveTab('form')} 
              className={`px-4 py-2 font-black uppercase tracking-widest text-sm border-2 transition-all ${activeTab === 'form' ? 'bg-cyan-400 text-black border-cyan-400 shadow-[4px_4px_0px_#22d3ee] -translate-y-1' : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:bg-zinc-800 hover:text-white'}`}
            >
              🚀 DROP REPO
            </button>
            <button 
              onClick={() => setActiveTab('roast')} 
              className={`px-4 py-2 font-black uppercase tracking-widest text-sm border-2 transition-all ${activeTab === 'roast' ? 'bg-pink-500 text-black border-pink-500 shadow-[4px_4px_0px_#ec4899] -translate-y-1' : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:bg-zinc-800 hover:text-white'}`}
            >
              🔥 THE ROAST
            </button>
            <button 
              onClick={() => setActiveTab('smells')} 
              className={`px-4 py-2 font-black uppercase tracking-widest text-sm border-2 transition-all ${activeTab === 'smells' ? 'bg-yellow-400 text-black border-yellow-400 shadow-[4px_4px_0px_#facc15] -translate-y-1' : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:bg-zinc-800 hover:text-white'}`}
            >
              💀 SKILL ISSUES
            </button>
          </div>

          <div className="bg-zinc-900 border-4 border-zinc-800 p-6 shadow-[8px_8px_0px_#18181b] min-h-[400px]">
            
            {/* TAB 1: FORM */}
            <div className={`${activeTab === 'form' ? 'block' : 'hidden'}`}>
              <h2 className="text-3xl font-black uppercase italic mb-2">SEND IT 📬</h2>
              <p className="text-zinc-400 font-bold mb-8">Drop a GitHub URL below. Don't say we didn't warn you.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/20 border-4 border-red-500 p-4 text-red-400 font-black uppercase">
                    L + Ratio: {error}
                  </div>
                )}
                
                <div>
                  <label className="block font-black text-cyan-400 uppercase tracking-widest mb-2">GitHub Username / Repo</label>
                  <input 
                    type="text" 
                    value={repoUrl.replace(/https?:\/\/github\.com\/?/, "")}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full bg-black border-4 border-zinc-700 focus:border-cyan-400 text-white font-mono p-4 outline-none transition-colors"
                    placeholder="e.g. facebook/react" 
                    required 
                    disabled={loading}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !repoUrl}
                  className="w-full bg-cyan-400 hover:bg-cyan-300 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-black text-xl uppercase py-4 border-4 border-black transition-all shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#000] hover:-translate-y-1 active:translate-y-0 active:shadow-[0px_0px_0px_#000]"
                >
                  {loading ? "COOKING YOUR CODE... 🍳" : "LET HIM COOK 🔥"}
                </button>
              </form>
            </div>

            {/* TAB 2: THE ROAST */}
            <div className={`${activeTab === 'roast' ? 'block' : 'hidden'} flex flex-col h-full`}>
              <h2 className="text-3xl font-black uppercase italic mb-6 text-pink-500">THE RECEIPTS 🧾</h2>
              
              {!result && !loading && <div className="flex-1 flex items-center justify-center text-zinc-600 font-black text-2xl uppercase italic">Waiting for a victim...</div>}
              {loading && <div className="flex-1 flex items-center justify-center text-cyan-400 font-black text-2xl uppercase italic animate-pulse">Diagnosing skill issues...</div>}
              
              {result && (
                <div className="bg-black border-4 border-zinc-800 p-6 font-mono text-sm leading-relaxed text-zinc-300 relative">
                  <div className="absolute -top-4 -right-4 text-4xl transform rotate-12">💅</div>
                  <p className="whitespace-pre-line text-base">{result.roast}</p>
                </div>
              )}
            </div>

            {/* TAB 3: SKILL ISSUES (CODE SMELLS) */}
            <div className={`${activeTab === 'smells' ? 'block' : 'hidden'}`}>
              <h2 className="text-3xl font-black uppercase italic mb-6 text-yellow-400">CAUGHT IN 4K 📸</h2>
              
              {!result && !loading && <div className="text-zinc-600 font-black text-xl uppercase italic text-center mt-20">No crimes committed... yet.</div>}
              {loading && <div className="text-yellow-400 font-black text-xl uppercase italic text-center mt-20 animate-pulse">Digging through the trash...</div>}
              
              <div className="space-y-4">
                {result?.codeSmells.map((smellItem: any, idx: number) => {
                  const title = typeof smellItem === "string" ? smellItem : smellItem.smell;
                  const detail = typeof smellItem === "string" ? null : smellItem.detail;
                  return (
                    <div key={idx} className="bg-black border-4 border-yellow-400 p-4 relative group hover:-translate-y-1 transition-transform">
                      <span className="absolute -top-3 -left-3 bg-yellow-400 text-black font-black px-2 py-1 rotate-[-10deg] border-2 border-black">
                        CRIME #{idx + 1}
                      </span>
                      <h3 className="font-black text-white uppercase text-lg mt-2">{title}</h3>
                      {detail && <p className="mt-2 text-zinc-400 font-medium">{detail}</p>}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* MEME FOOTER WITH INSTAGRAM LINK */}
      <footer className="w-full max-w-6xl mt-12 pt-6 border-t-4 border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 font-black uppercase text-xs tracking-widest text-zinc-600">
        <div>
          BUILT WITH SPITE & NEXT.JS 🤡
        </div>
        
        <a 
          href="https://instagram.com/Noelpm14" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center gap-2 bg-zinc-900 border-2 border-zinc-700 px-4 py-2 hover:bg-pink-500 hover:text-black hover:border-pink-500 transition-colors shadow-[4px_4px_0px_#27272a] hover:shadow-[4px_4px_0px_#000]"
          title="Bully the Creator"
        >
          <span>CHIEF ROASTER:</span>
          <span className="text-cyan-400 group-hover:text-black underline decoration-2 underline-offset-2">
            @NOELPM14
          </span>
        </a>
      </footer>
    </div>
  );
}
