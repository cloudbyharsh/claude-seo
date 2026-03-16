"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Command {
  id: string;
  label: string;
  description: string;
  icon: string;
  badge?: string;
  quick?: boolean;
}

const COMMANDS: Command[] = [
  { id: "page",        icon: "📄", label: "Page Analysis",     description: "Single-page deep dive (~20s)",                 badge: "Fast", quick: true  },
  { id: "technical",   icon: "⚙️",  label: "Technical SEO",    description: "Speed, crawl, security — 9 categories (~30s)", badge: "Fast", quick: true  },
  { id: "audit",       icon: "🔍", label: "Full Audit",        description: "Whole site + 7 parallel subagents (~3-5 min)", badge: "Deep"               },
  { id: "content",     icon: "✍️",  label: "Content & E-E-A-T",description: "Experience, Expertise, Authority, Trust (~40s)",              quick: true  },
  { id: "schema",      icon: "🏷️", label: "Schema Markup",    description: "Detect, validate & generate Schema.org (~25s)",              quick: true  },
  { id: "images",      icon: "🖼️", label: "Image SEO",         description: "Alt text, compression, next-gen formats (~25s)",             quick: true  },
  { id: "geo",         icon: "🤖", label: "AI Search (GEO)",   description: "Optimize for AI Overviews & ChatGPT",          badge: "2026"               },
  { id: "sitemap",     icon: "🗺️", label: "Sitemap",           description: "Analyze or generate XML sitemap (~20s)",                     quick: true  },
  { id: "hreflang",    icon: "🌍", label: "Hreflang / i18n",   description: "Multi-language SEO validation (~25s)",                       quick: true  },
  { id: "programmatic",icon: "⚡", label: "Programmatic SEO",  description: "Scale pages at data-driven SEO"                                            },
  { id: "competitor-pages", icon: "⚔️", label: "Competitor Pages", description: "Generate 'X vs Y' comparison pages"                                   },
];

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
function isValidUrl(url: string): boolean {
  try { new URL(url); return true; } catch { return false; }
}
function formatTime(s: number) {
  return s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`;
}

export default function Home() {
  const [url, setUrl]                   = useState("");
  const [selectedCmd, setSelectedCmd]   = useState<string>("page");
  const [output, setOutput]             = useState("");
  const [status, setStatus]             = useState<"idle" | "running" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg]         = useState("");
  const [elapsed, setElapsed]           = useState(0);
  const [copied, setCopied]             = useState(false);
  const [exporting, setExporting]       = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef  = useRef<AbortController | null>(null);

  // Auto-scroll
  useEffect(() => {
    if (outputRef.current && status === "running") {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, status]);

  // Timer
  useEffect(() => {
    if (status === "running") {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status]);

  const handleAnalyze = useCallback(async () => {
    const finalUrl = normalizeUrl(url);
    if (!isValidUrl(finalUrl)) { setErrorMsg("Please enter a valid URL, e.g. https://example.com"); return; }
    setOutput(""); setErrorMsg(""); setStatus("running");
    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: finalUrl, command: selectedCmd }),
        signal: abortRef.current.signal,
      });
      if (!res.ok || !res.body) throw new Error(`Server responded ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const payload = JSON.parse(line.slice(6));
            if (payload.text)   { fullText += payload.text; setOutput(fullText); }
            if (payload.stderr) { fullText += `\n> ${payload.stderr}`; setOutput(fullText); }
            if (payload.error)  { setErrorMsg(payload.error); setStatus("error"); return; }
            if (payload.done)   { setStatus("done"); autoSave(finalUrl, selectedCmd, fullText); return; }
          } catch {}
        }
      }
      setStatus("done");
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") setStatus("idle");
      else { setErrorMsg(String(err)); setStatus("error"); }
    }
  }, [url, selectedCmd]);

  async function autoSave(siteUrl: string, cmd: string, text: string) {
    try {
      await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: siteUrl, command: cmd, content: text }),
      });
    } catch {}
  }

  const handleStop = () => { abortRef.current?.abort(); setStatus("idle"); };

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const handleDownloadMd = () => {
    const blob = new Blob([output], { type: "text/markdown" });
    const a = document.createElement("a");
    const hostname = new URL(normalizeUrl(url) || "https://site.com").hostname;
    a.href = URL.createObjectURL(blob);
    a.download = `seo-${selectedCmd}-${hostname}-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
  };

  const handleDownloadHtml = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>SEO Report</title>
<style>body{font-family:system-ui,sans-serif;max-width:900px;margin:40px auto;padding:0 20px;background:#0a0f0d;color:#e2e8e4}
h1,h2,h3{color:#86efac}code{background:#1a2e1f;padding:2px 6px;border-radius:4px;color:#86efac}
pre{background:#1a2e1f;padding:16px;border-radius:8px;overflow-x:auto}
table{border-collapse:collapse;width:100%}th,td{border:1px solid #1f2e28;padding:8px 12px}
th{background:#1a2e1f;color:#bbf7d0}a{color:#22c55e}</style></head>
<body><pre style="white-space:pre-wrap;word-wrap:break-word">${output.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    const hostname = new URL(normalizeUrl(url) || "https://site.com").hostname;
    a.href = URL.createObjectURL(blob);
    a.download = `seo-${selectedCmd}-${hostname}-${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
  };

  const handleDownloadDocx = async () => {
    if (!output || exporting) return;
    setExporting(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: output,
          url: normalizeUrl(url),
          analysisType: COMMANDS.find(c => c.id === selectedCmd)?.label ?? selectedCmd,
        }),
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const a = document.createElement("a");
      const hostname = new URL(normalizeUrl(url) || "https://site.com").hostname;
      a.href = URL.createObjectURL(blob);
      a.download = `seo-${selectedCmd}-${hostname}-${new Date().toISOString().slice(0, 10)}.docx`;
      a.click();
    } catch (e) {
      setErrorMsg(`Word export failed: ${e}`);
    } finally {
      setExporting(false);
    }
  };

  const cmd = COMMANDS.find(c => c.id === selectedCmd);
  const isRunning = status === "running";
  const hasOutput = output.length > 0;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>

      {/* Header */}
      <header className="border-b px-6 py-4 flex items-center justify-between"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)" }}>🔍</div>
          <div>
            <h1 className="font-bold text-base leading-tight" style={{ color: "#f0fdf4" }}>SEO Analyzer</h1>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Powered by Claude Code + claude-seo skill</p>
          </div>
        </div>
        <span className="text-xs px-2 py-1 rounded-full font-medium"
          style={{ background: "#1a2e1f", color: "#86efac", border: "1px solid #16a34a33" }}>
          ✦ Local AI
        </span>
      </header>

      <main className="flex-1 flex flex-col max-w-5xl w-full mx-auto px-4 py-8 gap-8">

        {/* Hero */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight gradient-text">AI-Powered SEO Analysis</h2>
          <p className="text-sm max-w-lg mx-auto" style={{ color: "var(--muted)" }}>
            Enter any URL, pick an analysis type, and get a detailed report — runs 100% locally via Claude Code.
          </p>
        </div>

        {/* URL Input */}
        <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Website URL</label>
          <div className="flex gap-3">
            <input
              type="url" value={url}
              onChange={e => { setUrl(e.target.value); setErrorMsg(""); }}
              onKeyDown={e => { if (e.key === "Enter" && !isRunning) handleAnalyze(); }}
              placeholder="https://your-site.com"
              disabled={isRunning}
              className="flex-1 px-4 py-3 rounded-lg text-sm font-mono outline-none transition-all"
              style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
              onFocus={e => (e.target.style.borderColor = "#22c55e")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
            {!isRunning ? (
              <button onClick={handleAnalyze} disabled={!url.trim()}
                className="px-6 py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff" }}>
                Analyze →
              </button>
            ) : (
              <button onClick={handleStop}
                className="px-6 py-3 rounded-lg font-semibold text-sm"
                style={{ background: "#1f1a0e", border: "1px solid #ca8a04", color: "#fbbf24" }}>
                Stop ✕
              </button>
            )}
          </div>
          {errorMsg && (
            <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "#2c1a1a", color: "#fca5a5", border: "1px solid #7f1d1d" }}>
              ⚠ {errorMsg}
            </p>
          )}
        </div>

        {/* Speed tip */}
        <div className="rounded-lg px-4 py-2.5 flex items-center gap-2 text-xs"
          style={{ background: "#0d1f12", border: "1px solid #1a3a20", color: "#86efac" }}>
          <span>⚡</span>
          <span><strong>Tip:</strong> For fast results (15-30s) use Page Analysis, Technical, or Schema. Full Audit crawls the entire site and takes 3-5 minutes.</span>
        </div>

        {/* Command Selector */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Analysis Type</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {COMMANDS.map(c => (
              <button key={c.id} onClick={() => !isRunning && setSelectedCmd(c.id)} disabled={isRunning}
                className={`cmd-card rounded-xl p-3 text-left relative ${selectedCmd === c.id ? "selected" : ""}`}
                style={{
                  background: selectedCmd === c.id ? "#162a1c" : "var(--surface)",
                  border: `1px solid ${selectedCmd === c.id ? "#22c55e" : "var(--border)"}`,
                }}>
                {c.badge && (
                  <span className="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded-full font-medium"
                    style={{
                      background: c.badge === "Fast" ? "#0d2a1a" : c.badge === "Deep" ? "#1a1a2e" : "#1a2e1f",
                      color: c.badge === "Fast" ? "#4ade80" : c.badge === "Deep" ? "#818cf8" : "#86efac",
                      fontSize: "0.6rem",
                      border: `1px solid ${c.badge === "Fast" ? "#16a34a44" : c.badge === "Deep" ? "#4338ca44" : "#16a34a33"}`,
                    }}>
                    {c.badge === "Fast" ? "⚡ Fast" : c.badge === "Deep" ? "🔬 Deep" : c.badge}
                  </span>
                )}
                <div className="text-xl mb-1">{c.icon}</div>
                <div className="text-sm font-semibold" style={{ color: selectedCmd === c.id ? "#86efac" : "#d1fae5" }}>{c.label}</div>
                <div className="text-xs mt-0.5 leading-snug" style={{ color: "var(--muted)" }}>{c.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {(isRunning || hasOutput) && (
          <div className="space-y-3 flex-1 flex flex-col">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Results</p>
                {isRunning && (
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: "#86efac" }}>
                    <span className="w-1.5 h-1.5 rounded-full pulse-green" style={{ background: "#22c55e", display: "inline-block" }} />
                    Running /seo {selectedCmd} · {formatTime(elapsed)}
                  </span>
                )}
                {status === "done" && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#1a2e1f", color: "#86efac" }}>
                    ✓ Done in {formatTime(elapsed)}
                  </span>
                )}
              </div>

              {/* Export buttons */}
              {hasOutput && (
                <div className="flex gap-2 flex-wrap">
                  <button onClick={handleCopy}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                    style={{ background: copied ? "#1a2e1f" : "var(--surface2)", color: copied ? "#4ade80" : "var(--muted)", border: "1px solid var(--border)" }}>
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>
                  <button onClick={handleDownloadMd}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                    style={{ background: "#162a1c", color: "#86efac", border: "1px solid #22c55e44" }}>
                    ↓ Markdown
                  </button>
                  <button onClick={handleDownloadHtml}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                    style={{ background: "#1a1a2e", color: "#818cf8", border: "1px solid #4338ca44" }}>
                    ↓ HTML
                  </button>
                  <button onClick={handleDownloadDocx} disabled={exporting}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50"
                    style={{ background: "#1a1420", color: "#c084fc", border: "1px solid #7c3aed44" }}>
                    {exporting ? "Exporting…" : "↓ Word (.docx)"}
                  </button>
                  {status === "done" && (
                    <span className="text-xs px-2 py-1.5 rounded-lg" style={{ background: "#0d1f12", color: "#4ade80", border: "1px solid #16a34a33" }}>
                      ✓ Auto-saved
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Output panel */}
            <div ref={outputRef} className="rounded-xl p-5 overflow-y-auto"
              style={{
                background: "var(--surface)",
                border: `1px solid ${isRunning ? "#22c55e44" : "var(--border)"}`,
                minHeight: "400px", maxHeight: "70vh",
                boxShadow: isRunning ? "0 0 0 1px #22c55e22, 0 8px 32px #22c55e0a" : "none",
                transition: "box-shadow 0.3s, border-color 0.3s",
              }}>
              {isRunning && !hasOutput && (
                <div className="flex items-center gap-3" style={{ color: "var(--muted)" }}>
                  <span className="w-2 h-2 rounded-full pulse-green" style={{ background: "#22c55e", display: "inline-block" }} />
                  <span className="text-sm">
                    Running <code style={{ color: "#86efac", fontFamily: "monospace" }}>/seo {selectedCmd} {normalizeUrl(url)}</code> via Claude Code…
                  </span>
                </div>
              )}
              {hasOutput && (
                <div className="output-prose text-sm leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
                </div>
              )}
              {isRunning && hasOutput && (
                <span className="inline-block w-2 h-4 ml-1 align-middle pulse-green"
                  style={{ background: "#22c55e", borderRadius: "1px" }} />
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isRunning && !hasOutput && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-3">
            <div className="text-4xl opacity-30">🔍</div>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Enter a URL and click <strong style={{ color: "#86efac" }}>Analyze</strong> to get started.
            </p>
            <p className="text-xs" style={{ color: "var(--muted)", opacity: 0.6 }}>
              Results stream live from your local Claude Code instance.
            </p>
          </div>
        )}
      </main>

      <footer className="border-t px-6 py-3 flex items-center justify-between text-xs"
        style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
        <span>{cmd?.icon} {cmd?.label} selected {cmd?.quick ? "· ⚡ Fast mode" : "· 🔬 Deep mode"}</span>
        <span>100% local · claude-seo by AgriciDaniel</span>
      </footer>
    </div>
  );
}
