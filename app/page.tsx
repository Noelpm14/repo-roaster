"use client";

import { useState } from "react";

interface RoastResult {
  repoName: string;
  roast: string;
  roastScore: number;
  codeSmells: string[];
  verdict: string;
}

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleTargets = [
    "facebook/react",
    "torvalds/linux",
    "vercel/next.js",
  ];

  const handleRoast = async (target?: string) => {
    const finalUrl = target || repoUrl;
    if (!finalUrl) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: finalUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to inspect repository.");
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyLog = () => {
    if (!result) return;
    navigator.clipboard.writeText(
      `REPO AUDIT: ${result.repoName}\nDEFECT INDEX: ${result.roastScore}/100\n\n${result.roast}\n\nSUMMARY: ${result.verdict}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="min-h-screen bg-[#181A1B] text-[#F5F6F8] font-sans antialiased flex flex-col justify-between p-6 md:p-12 selection:bg-[#F04D24] selection:text-white">
      
      {/* Chassis Container */}
      <div className="max-w-3xl w-full mx-auto space-y-10">

        {/* Identity & Mission */}
        <header className="border-b border-[#26292B] pb-6 space-y-2">
          <div className="flex items-baseline justify-between">
            <h1 className="text-xl font-bold tracking-tight text-white font-mono">
              repo/autopsy
            </h1>
            <span className="text-xs text-[#8C9298] font-mono">
              build 2026.4
            </span>
          </div>
          <p className="text-sm text-[#8C9298] max-w-xl leading-relaxed">
            Automated code debt evaluation and architectural triage. Submit a public repository to run analysis against structure, patterns, and commit debt.
          </p>
        </header>

        {/* Execution Strip */}
        <div className="space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRoast();
            }}
            className="flex flex-col sm:flex-row border border-[#26292B] bg-[#121314]"
          >
            <div className="flex items-center px-4 py-3 flex-1 font-mono text-sm border-b sm:border-b-0 sm:border-r border-[#26292B]">
              <span className="text-[#8C9298] select-none pr-2">github.com/</span>
              <input
                type="text"
                value={repoUrl.replace(/https?:\/\/github\.com\/?/, "")}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="owner/repo"
                className="w-full bg-transparent focus:outline-none text-[#F5F6F8] placeholder-[#8C9298]/50"
                spellCheck={false}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#F5F6F8] text-[#181A1B] font-mono text-xs font-bold hover:bg-white active:bg-[#8C9298] disabled:bg-[#26292B] disabled:text-[#8C9298] transition-colors"
            >
              {loading ? "ANALYZING..." : "RUN AUDIT"}
            </button>
          </form>

          {/* Preset Targets */}
          <div className="flex items-center gap-3 text-xs font-mono text-[#8C9298]">
            <span>Samples:</span>
            {sampleTargets.map((slug) => (
              <button
                key={slug}
                type="button"
                onClick={() => {
                  setRepoUrl(slug);
                  handleRoast(slug);
                }}
                className="hover:text-white underline underline-offset-4 decoration-[#26292B] hover:decoration-[#8C9298]"
              >
                {slug}
              </button>
            ))}
          </div>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="p-4 border-l-2 border-[#F04D24] bg-[#121314] text-xs font-mono text-[#F04D24] space-y-1">
            <div className="font-bold">EXECUTION FAULT</div>
            <div className="text-[#F5F6F8]">{error}</div>
          </div>
        )}

        {/* Inspection Sheet */}
        {result && (
          <article className="border border-[#26292B] bg-[#121314] divide-y divide-[#26292B]">
            
            {/* Metadata Bar */}
            <div className="p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#8C9298] uppercase tracking-wider block">
                  Target Identity
                </span>
                <span className="text-lg font-mono font-bold text-white">
                  {result.repoName}
                </span>
              </div>

              {/* Physical Stamp Score */}
              <div className="flex items-center gap-3 border border-[#26292B] px-4 py-2 bg-[#181A1B]">
                <span className="text-xs font-mono text-[#8C9298]">SHAME INDEX</span>
                <span
                  className={`font-mono font-black text-2xl ${
                    result.roastScore > 70
                      ? "text-[#F04D24]"
                      : result.roastScore > 40
                      ? "text-[#E2C044]"
                      : "text-[#F5F6F8]"
                  }`}
                >
                  {result.roastScore}
                </span>
                <span className="text-xs font-mono text-[#8C9298]">/ 100</span>
              </div>
            </div>

            {/* Critique Body */}
            <div className="p-6 space-y-2">
              <span className="text-[10px] font-mono text-[#8C9298] uppercase tracking-wider block">
                Field Notes
              </span>
              <div className="text-sm text-[#F5F6F8] leading-relaxed whitespace-pre-line font-mono">
                {result.roast}
              </div>
            </div>

            {/* Defect Trace */}
            <div className="p-6 space-y-3">
              <span className="text-[10px] font-mono text-[#8C9298] uppercase tracking-wider block">
                Flagged Deficiencies
              </span>
              <ul className="space-y-2">
                {result.codeSmells.map((smell, idx) => (
                  <li
                    key={idx}
                    className="text-xs font-mono text-[#8C9298] flex items-start gap-3 bg-[#181A1B] p-3 border border-[#26292B]"
                  >
                    <span className="text-[#F04D24] font-bold select-none">[!]</span>
                    <span className="text-[#F5F6F8]">{smell}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Summary & Copy Action */}
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#181A1B]/50">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#8C9298] uppercase tracking-wider block">
                  Final Ruling
                </span>
                <p className="text-xs font-mono text-white">
                  {result.verdict}
                </p>
              </div>

              <button
                type="button"
                onClick={copyLog}
                className="self-start sm:self-center px-4 py-2 border border-[#26292B] bg-[#121314] hover:border-[#8C9298] text-[#F5F6F8] text-xs font-mono transition-colors"
              >
                {copied ? "COPIED TO CLIPBOARD" : "COPY LOG"}
              </button>
            </div>

          </article>
        )}

      </div>

      {/* Ground Footer */}
      <footer className="max-w-3xl w-full mx-auto pt-12 text-xs font-mono text-[#8C9298] flex justify-between border-t border-[#26292B] mt-12">
        <span>github rest api + gemini structured output</span>
        <span>no logs retained</span>
      </footer>

    </main>
  );
}