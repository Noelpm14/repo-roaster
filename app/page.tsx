"use client";

import { useState, useEffect, useRef } from "react";

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

type CharacterMood = "idle" | "scanning" | "disappointed" | "shocked" | "talking";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Animated bubble progression state
  const [revealedBubbles, setRevealedBubbles] = useState<number>(0);
  const [mood, setMood] = useState<CharacterMood>("idle");
  const dialogueEndRef = useRef<HTMLDivElement>(null);

  const referenceTargets = [
    "facebook/react",
    "torvalds/linux",
    "vercel/next.js",
  ];

  // Progressive bubble reveal effect
  useEffect(() => {
    if (!result) return;
    setRevealedBubbles(0);
    setMood(result.roastScore > 70 ? "shocked" : "talking");

    const delays = [300, 1400, 2600, 3800];
    const timers = delays.map((delay, idx) =>
      setTimeout(() => {
        setRevealedBubbles(idx + 1);
        dialogueEndRef.current?.scrollIntoView({ behavior: "smooth" });
        if (idx === delays.length - 1) {
          setMood(result.roastScore > 65 ? "disappointed" : "idle");
        }
      }, delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [result]);

  const handleAudit = async (targetOverride?: string) => {
    const target = targetOverride || repoUrl;
    if (!target.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setRevealedBubbles(0);
    setMood("scanning");

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: target }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Inspection failed.");
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to inspect repository.");
      setMood("disappointed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#161b22] text-[#f0f6fc] antialiased flex flex-col justify-between p-4 sm:p-8 selection:bg-[#e3b341] selection:text-[#161b22]">
      <main className="max-w-3xl w-full mx-auto space-y-6 pt-4">

        {/* Top Header */}
        <header className="border-b border-[#30363d] pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e3b341] inline-block animate-pulse" />
            <h1 className="text-sm font-bold font-mono tracking-tight text-[#f0f6fc]">
              repo/autopsy :: chief_examiner
            </h1>
          </div>
          <span className="text-[11px] font-mono text-[#8b949e]">
            v2.1 &bull; autonomous auditor
          </span>
        </header>

        {/* Input Bar */}
        <section className="space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAudit();
            }}
            className="flex flex-col sm:flex-row border border-[#30363d] bg-[#0d1117] focus-within:border-[#e3b341] transition-colors"
          >
            <div className="flex items-center px-4 py-3 flex-1 text-sm font-mono border-b sm:border-b-0 sm:border-r border-[#30363d]">
              <span className="text-[#8b949e] select-none pr-1">github.com/</span>
              <input
                type="text"
                value={repoUrl.replace(/https?:\/\/github\.com\/?/, "")}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="owner/repo"
                className="w-full bg-transparent focus:outline-none text-[#f0f6fc] placeholder-[#8b949e]/40 font-mono"
                spellCheck={false}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !repoUrl.trim()}
              className="px-6 py-3 bg-[#30363d] hover:bg-[#e3b341] hover:text-[#161b22] text-[#f0f6fc] font-mono text-xs font-semibold tracking-wide transition-colors disabled:opacity-40 disabled:hover:bg-[#30363d] disabled:hover:text-[#f0f6fc] cursor-pointer"
            >
              {loading ? "EXAMINER DISPATCHED..." : "SUBMIT FOR AUTOPSY"}
            </button>
          </form>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#8b949e]">
            <span>Feed the examiner:</span>
            {referenceTargets.map((slug) => (
              <button
                key={slug}
                type="button"
                onClick={() => {
                  setRepoUrl(slug);
                  handleAudit(slug);
                }}
                className="hover:text-[#f0f6fc] underline underline-offset-4 decoration-[#30363d] transition-colors cursor-pointer"
              >
                {slug}
              </button>
            ))}
          </div>
        </section>

        {/* Error readout */}
        {error && (
          <div className="border border-[#e3b341]/40 bg-[#0d1117] p-4 text-xs font-mono space-y-1">
            <span className="text-[#e3b341] font-semibold">Coroner report aborted:</span>
            <div className="text-[#8b949e]">{error}</div>
          </div>
        )}

        {/* The Animated Character & Dialogue Stage */}
        <section className="border border-[#30363d] bg-[#0d1117] p-4 sm:p-6 space-y-6">
          
          {/* Character Stage Row */}
          <div className="flex items-center gap-4 border-b border-[#30363d] pb-4">
            <CoronerAvatar mood={mood} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#f0f6fc]">
                  Unit 404 &quot;Coroner&quot;
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 border border-[#30363d] text-[#8b949e] uppercase">
                  {mood}
                </span>
              </div>
              <p className="text-xs font-mono text-[#8b949e]">
                {loading
                  ? "Paging git trees... preparing caustic critique."
                  : result
                  ? `Inspection complete for ${result.repoName}.`
                  : "Awaiting candidate repository."}
              </p>
            </div>
          </div>

          {/* Dialogue Bubbles Feed */}
          <div className="space-y-4 font-mono text-xs">
            
            {/* Initial Idle Greeting */}
            {!loading && !result && (
              <DialogueBubble sender="Unit 404">
                <p className="text-[#8b949e]">
                  Hand over a GitHub repository URL. I will inspect the commit logs, file tree sprawl, and technical choices — then explain precisely where things went wrong.
                </p>
              </DialogueBubble>
            )}

            {/* Active Scanning Animation */}
            {loading && (
              <DialogueBubble sender="Unit 404">
                <div className="flex items-center gap-2 text-[#e3b341]">
                  <span className="w-2 h-2 rounded-full bg-[#e3b341] animate-ping" />
                  <span>Cracking open Git tree structure and inspecting manifest debt...</span>
                </div>
              </DialogueBubble>
            )}

            {/* Bubble 1: Initial Impression & Shame Score */}
            {result && revealedBubbles >= 1 && (
              <DialogueBubble
                sender="Unit 404"
                badge={`DEFECT SCORE: ${result.roastScore}/100`}
                badgeColor={result.roastScore > 60 ? "border-[#e3b341] text-[#e3b341]" : "border-emerald-400 text-emerald-400"}
              >
                <p className="font-bold text-[#f0f6fc]">
                  I pulled the file tree for <span className="underline decoration-[#e3b341]">{result.repoName}</span>.
                </p>
                <p className="text-[#8b949e] mt-1">
                  Defect Index calculated at <span className="font-bold text-[#f0f6fc]">{result.roastScore}/100</span>. Here is the post-mortem summary:
                </p>
              </DialogueBubble>
            )}

            {/* Bubble 2: Detailed Roast Breakdown */}
            {result && revealedBubbles >= 2 && (
              <DialogueBubble sender="Unit 404" highlight>
                <p className="font-sans text-sm text-[#f0f6fc] leading-relaxed whitespace-pre-line">
                  {result.roast}
                </p>
              </DialogueBubble>
            )}

            {/* Bubble 3: Architectural Red Flags */}
            {result && revealedBubbles >= 3 && (
              <DialogueBubble sender="Unit 404">
                <span className="text-[10px] text-[#8b949e] uppercase tracking-wider block mb-2">
                  FLAGGED DEFECTS ENCOUNTERED:
                </span>
                <div className="space-y-2">
                  {result.codeSmells.map((smellItem, idx) => {
                    const title = typeof smellItem === "string" ? smellItem : smellItem.smell;
                    const detail = typeof smellItem === "string" ? null : smellItem.detail;
                    return (
                      <div
                        key={idx}
                        className="border border-[#30363d] bg-[#161b22] p-2.5 space-y-1"
                      >
                        <div className="text-[#e3b341] font-semibold flex items-center gap-1.5">
                          <span>&bull;</span>
                          <span>{title}</span>
                        </div>
                        {detail && (
                          <p className="text-[#8b949e] font-sans text-xs pl-3">
                            {detail}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </DialogueBubble>
            )}

            {/* Bubble 4: Final Hiring Verdict */}
            {result && revealedBubbles >= 4 && (
              <DialogueBubble sender="Unit 404" isFinal>
                <span className="text-[10px] text-[#e3b341] uppercase tracking-wider block font-bold">
                  FINAL COMMITTEE DISPOSITION
                </span>
                <p className="font-sans text-sm font-semibold text-[#f0f6fc] mt-1">
                  &ldquo;{result.verdict}&rdquo;
                </p>
              </DialogueBubble>
            )}

            <div ref={dialogueEndRef} />
          </div>

        </section>

      </main>

      <footer className="max-w-3xl w-full mx-auto pt-6 border-t border-[#30363d] mt-8 flex justify-between text-xs font-mono text-[#8b949e]">
        <span>git trees metadata evaluation</span>
        <span>ephemeral session</span>
      </footer>
    </div>
  );
}

// Custom Speech Bubble Component
function DialogueBubble({
  sender,
  children,
  badge,
  badgeColor,
  highlight = false,
  isFinal = false,
}: {
  sender: string;
  children: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  highlight?: boolean;
  isFinal?: boolean;
}) {
  return (
    <div
      className={`relative border p-4 transition-all duration-300 ${
        isFinal
          ? "border-[#e3b341] bg-[#161b22]"
          : highlight
          ? "border-[#30363d] bg-[#161b22]"
          : "border-[#30363d]/60 bg-[#161b22]/50"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono text-[#8b949e] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-[#e3b341] rounded-full inline-block" />
          {sender}
        </span>
        {badge && (
          <span className={`text-[10px] font-mono px-2 py-0.5 border ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

// Inline Animated Vector Avatar
function CoronerAvatar({ mood }: { mood: CharacterMood }) {
  const isScanning = mood === "scanning";
  const isShocked = mood === "shocked";
  const isDisappointed = mood === "disappointed";

  return (
    <div className="relative w-14 h-14 bg-[#161b22] border border-[#30363d] flex items-center justify-center shrink-0 overflow-hidden">
      {/* Top Antenna */}
      <div
        className={`absolute top-1 w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
          isScanning ? "bg-[#e3b341] animate-ping" : "bg-[#8b949e]"
        }`}
      />

      {/* Robot Face Grid */}
      <div className="w-10 h-8 border border-[#30363d] bg-[#0d1117] flex flex-col justify-between p-1.5 relative">
        
        {/* Eyes Row */}
        <div className="flex justify-between items-center px-1">
          {/* Left Eye */}
          <div
            className={`w-2 h-2 rounded-xs transition-all duration-200 ${
              isShocked
                ? "bg-[#e3b341] scale-125"
                : isScanning
                ? "bg-[#e3b341] animate-pulse"
                : isDisappointed
                ? "bg-[#8b949e] h-0.5 mt-1"
                : "bg-[#e3b341]"
            }`}
          />
          {/* Right Eye */}
          <div
            className={`w-2 h-2 rounded-xs transition-all duration-200 ${
              isShocked
                ? "bg-[#e3b341] scale-125"
                : isScanning
                ? "bg-[#e3b341] animate-pulse delay-75"
                : isDisappointed
                ? "bg-[#8b949e] h-0.5 mt-1"
                : "bg-[#e3b341]"
            }`}
          />
        </div>

        {/* Mouth / Audio Wave Readout */}
        <div className="flex justify-center items-center gap-0.5">
          {mood === "talking" ? (
            <>
              <span className="w-1 h-1.5 bg-[#e3b341] animate-pulse" />
              <span className="w-1 h-3 bg-[#e3b341] animate-pulse delay-100" />
              <span className="w-1 h-2 bg-[#e3b341] animate-pulse delay-200" />
              <span className="w-1 h-1 bg-[#e3b341] animate-pulse" />
            </>
          ) : isScanning ? (
            <span className="w-6 h-0.5 bg-[#e3b341] animate-pulse" />
          ) : (
            <span className="w-4 h-0.5 bg-[#30363d]" />
          )}
        </div>
      </div>
    </div>
  );
}
