/* ── Config ──────────────────────────────────────────────────────── */
const API = "http://localhost:8000";

/* ── State ───────────────────────────────────────────────────────── */
let lastAudit  = null;
let activeFilter = "all";

/* ── Helpers ─────────────────────────────────────────────────────── */
function $(id) { return document.getElementById(id); }

function severityColor(sev) {
  return {Critical:"#dc2626", High:"#ef4444", Medium:"#f59e0b", Low:"#94a3b8"}[sev] || "#94a3b8";
}
function severityBg(sev) {
  return {Critical:"rgba(220,38,38,.15)", High:"rgba(239,68,68,.12)",
          Medium:"rgba(245,158,11,.12)",  Low:"rgba(148,163,184,.1)"}[sev] || "transparent";
}
function bandColor(band) {
  return {Excellent:"#22c55e", Good:"#84cc16", Fair:"#f59e0b", Poor:"#ef4444", Critical:"#dc2626"}[band] || "#6366f1";
}
function catColor(key) {
  return {crawlability:"#6366f1", technical:"#0ea5e9", onpage:"#f59e0b",
          content:"#22c55e",      authority:"#a855f7"}[key] || "#6366f1";
}
function catLabel(key) {
  return {crawlability:"Crawlability & Indexation", technical:"Technical Foundations",
          onpage:"On-Page Optimization",            content:"Content Quality & E-E-A-T",
          authority:"Authority & Trust"}[key] || key;
}
function scoreState(s) {
  if (s >= 80) return "ok"; if (s >= 60) return "warn"; return "bad";
}
function showError(msg) {
  const el = $("errorMsg"); el.textContent = msg; el.classList.remove("hidden");
}
function hideError() { $("errorMsg").classList.add("hidden"); }

/* ── Run Audit ───────────────────────────────────────────────────── */
async function runAudit() {
  const url = $("urlInput").value.trim();
  if (!url) { showError("Please enter a URL."); return; }
  hideError();

  // UI state
  $("auditBtn").disabled = true;
  $("pdfBtn").disabled   = true;
  $("results").classList.add("hidden");
  $("loaderUrl").textContent = url;
  $("loader").classList.remove("hidden");

  try {
    const res  = await fetch(`${API}/audit?url=${encodeURIComponent(url)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Server error ${res.status}`);
    }
    const data = await res.json();
    lastAudit  = data;
    renderResults(data);
    $("pdfBtn").disabled = false;
  } catch (e) {
    showError("Audit failed: " + e.message);
  } finally {
    $("loader").classList.add("hidden");
    $("auditBtn").disabled = false;
  }
}

/* ── Download PDF ────────────────────────────────────────────────── */
async function downloadPDF() {
  const url = $("urlInput").value.trim();
  if (!url) return;
  $("pdfBtn").disabled = true;
  $("pdfBtn").innerHTML = '<span class="btn-icon">⏳</span> Generating…';
  try {
    const res = await fetch(`${API}/audit-pdf?url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error(`Server error ${res.status}`);
    const blob = await res.blob();
    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objUrl; a.download = "seo-audit.pdf"; a.click();
    URL.revokeObjectURL(objUrl);
  } catch (e) {
    showError("PDF export failed: " + e.message);
  } finally {
    $("pdfBtn").disabled = false;
    $("pdfBtn").innerHTML = '<span class="btn-icon">📄</span> Export PDF';
  }
}

/* ── Render ──────────────────────────────────────────────────────── */
function renderResults(d) {
  renderScoreBanner(d);
  renderCatGrid(d);
  renderIssues(d);
  renderSnap(d);
  renderDetails(d);
  $("results").classList.remove("hidden");
  $("results").scrollIntoView({ behavior: "smooth", block: "start" });
}

/* Score banner */
function renderScoreBanner(d) {
  const s     = d.score || {};
  const sum   = d.summary || {};
  const score = s.overall || 0;
  const band  = s.band    || "N/A";
  const col   = bandColor(band);

  $("scoreNum").textContent  = score;
  $("scoreBand").textContent = band;
  $("scoreBand").style.color = col;
  $("scoreUrl").textContent  = d.url;

  // Animate ring  (circumference ≈ 314)
  const offset = 314 - (score / 100) * 314;
  const ring = $("ringFill");
  ring.style.stroke = col;
  requestAnimationFrame(() => { ring.style.strokeDashoffset = offset; });

  // Pills
  const pills = [
    { label:"Critical", num: sum.critical||0, cls:"crit" },
    { label:"High",     num: sum.high||0,     cls:"high" },
    { label:"Medium",   num: sum.medium||0,   cls:"med"  },
    { label:"Issues",   num: sum.total_issues||0, cls:"ok" },
  ];
  $("summaryPills").innerHTML = pills.map(p =>
    `<div class="pill ${p.cls}">
       <span class="pill-num">${p.num}</span>
       <span class="pill-lbl">${p.label}</span>
     </div>`
  ).join("");
}

/* Category grid */
function renderCatGrid(d) {
  const breakdown = (d.score||{}).breakdown || {};
  const keys = ["crawlability","technical","onpage","content","authority"];
  $("catGrid").innerHTML = keys.map(k => {
    const b   = breakdown[k] || {};
    const sc  = b.score ?? 0;
    const col = catColor(k);
    return `<div class="cat-card" style="--cat-color:${col}">
      <div class="cat-name">${catLabel(k)}</div>
      <div class="cat-score">${sc}</div>
      <div class="cat-bar-wrap"><div class="cat-bar" data-w="${sc}"></div></div>
      <div class="cat-weight">Weight ${b.weight||0}% · +${b.weighted||0} pts</div>
    </div>`;
  }).join("");

  // Animate bars after paint
  requestAnimationFrame(() => {
    document.querySelectorAll(".cat-bar[data-w]").forEach(el => {
      el.style.width = el.dataset.w + "%";
    });
  });
}

/* Issues */
function renderIssues(d) {
  const issues = d.issues || [];
  $("issueList").innerHTML = "";
  if (!issues.length) {
    $("issueList").innerHTML = `<div class="snap-card"><span class="snap-icon">✅</span><div class="snap-info"><span class="snap-label">No issues detected</span></div></div>`;
    return;
  }
  buildIssueCards(issues);
}

function buildIssueCards(issues) {
  const list = $("issueList");
  list.innerHTML = "";
  const filtered = activeFilter === "all" ? issues : issues.filter(i => i.severity === activeFilter);
  if (!filtered.length) {
    list.innerHTML = `<p style="color:var(--muted);font-size:.9rem">No ${activeFilter} issues found.</p>`;
    return;
  }
  filtered.forEach(iss => {
    const col = severityColor(iss.severity);
    const bg  = severityBg(iss.severity);
    const card = document.createElement("div");
    card.className = "issue-card";
    card.style.setProperty("--sev-color", col);
    card.style.borderLeftColor = col;
    card.innerHTML = `
      <div class="issue-header">
        <span class="issue-title">${iss.issue}</span>
        <span class="sev-badge" style="background:${bg};color:${col}">${iss.severity}</span>
      </div>
      <div class="issue-meta">${iss.category} · Confidence: ${iss.confidence} · Score impact: ${iss.impact} pts</div>
      <div class="issue-reco">💡 ${iss.recommendation}</div>`;
    list.appendChild(card);
  });
}

function filterIssues(sev) {
  activeFilter = sev;
  document.querySelectorAll(".filter-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.sev === sev);
  });
  if (lastAudit) buildIssueCards(lastAudit.issues || []);
}

/* Technical snapshot */
function renderSnap(d) {
  const tech  = d.technical  || {};
  const crawl = d.crawlability || {};
  const items = [
    { icon:"🔒", label:"HTTPS",            value: tech.https ? "Secure" : "Not secure",   state: tech.https ? "ok" : "bad" },
    { icon:"↩️", label:"HTTP Redirect",    value: tech.http_redirect ? "Yes" : "No",       state: tech.http_redirect ? "ok" : "warn" },
    { icon:"⚡", label:"Load Time",        value: `${tech.load_time_s}s`,                  state: tech.load_time_s < 2 ? "ok" : tech.load_time_s < 3 ? "warn" : "bad" },
    { icon:"📦", label:"Page Size",        value: `${tech.page_size_kb} KB`,               state: "ok" },
    { icon:"📱", label:"Mobile Viewport",  value: tech.viewport ? "Present" : "Missing",   state: tech.viewport ? "ok" : "bad" },
    { icon:"🌐", label:"Status Code",      value: String(tech.status_code),                state: tech.status_code === 200 ? "ok" : "bad" },
    { icon:"🤖", label:"robots.txt",       value: crawl.robots_txt?.found ? "Found" : "Missing", state: crawl.robots_txt?.found ? "ok" : "warn" },
    { icon:"🗺️", label:"XML Sitemap",      value: crawl.sitemap?.found ? `Found (${crawl.sitemap?.url_count||"?"} URLs)` : "Missing", state: crawl.sitemap?.found ? "ok" : "warn" },
    { icon:"🔗", label:"Canonical",        value: crawl.canonical ? "Present" : "Missing", state: crawl.canonical ? "ok" : "warn" },
    { icon:"🚫", label:"noindex",          value: crawl.noindex ? "YES — REMOVE" : "Clean",state: crawl.noindex ? "bad" : "ok" },
  ];
  $("snapGrid").innerHTML = items.map(it =>
    `<div class="snap-card">
       <span class="snap-icon">${it.icon}</span>
       <div class="snap-info">
         <span class="snap-label">${it.label}</span>
         <span class="snap-value ${it.state}">${it.value}</span>
       </div>
     </div>`
  ).join("");
}

/* On-page details */
function renderDetails(d) {
  const op = d.onpage  || {};
  const co = d.content || {};
  const t  = op.title  || {};
  const md = op.meta_description || {};
  const hd = op.headings || {};
  const im = op.images  || {};
  const lk = op.links   || {};
  const og = co.og_tags || {};

  const items = [
    { label:"Title Tag",       value: t.text || "(missing)", sub: `${t.length||0} chars · target 50–60` },
    { label:"Meta Description",value: md.text || "(missing)", sub: `${md.length||0} chars · target 150–160` },
    { label:"H1 Tag",          value: hd.h1_texts?.join(", ") || "(none)", sub: `${hd.h1_count||0} found · target exactly 1` },
    { label:"Heading Structure",value:`H1: ${hd.h1_count} · H2: ${hd.h2_count} · H3: ${hd.h3_count}`, sub: "" },
    { label:"Images",          value: `${im.total} total · ${im.missing_alt} missing alt`, sub: `Alt coverage: ${im.alt_coverage_pct}%` },
    { label:"Links",           value: `${lk.internal} internal · ${lk.external} external`, sub: `${lk.total} total` },
    { label:"Word Count",      value: `${co.word_count} words`, sub: co.word_count < 600 ? "⚠️ Aim for 800+" : "✅ Good" },
    { label:"Structured Data", value: `${co.schema_count} JSON-LD block${co.schema_count !== 1 ? "s" : ""}`, sub: co.schema_count ? "✅ Present" : "⚠️ Missing" },
    { label:"Open Graph",      value: og.og_title ? "og:title ✅ og:description ✅" : "Missing", sub: og.twitter_card ? "Twitter Card: ✅" : "Twitter Card: missing" },
    { label:"Privacy / Contact",value:`Privacy: ${d.authority?.privacy_mention ? "✅" : "❌"}  Contact: ${d.authority?.contact_mention ? "✅" : "❌"}`, sub: "E-E-A-T trust signals" },
  ];
  $("detailGrid").innerHTML = items.map(it =>
    `<div class="detail-card">
       <div class="detail-label">${it.label}</div>
       <div class="detail-value">${it.value}</div>
       ${it.sub ? `<div class="detail-sub">${it.sub}</div>` : ""}
     </div>`
  ).join("");
}

/* ── Enter key shortcut ──────────────────────────────────────────── */
$("urlInput").addEventListener("keydown", e => { if (e.key === "Enter") runAudit(); });
