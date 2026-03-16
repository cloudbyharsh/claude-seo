---
name: seo
description: >
  Comprehensive SEO analysis for any website or business type. Performs full site
  audits, single-page deep analysis, technical SEO checks (crawlability, indexability,
  Core Web Vitals with INP), schema markup detection/validation/generation, content
  quality assessment (E-E-A-T framework per Dec 2025 update extending to all
  competitive queries), image optimization, sitemap analysis, and Generative Engine
  Optimization (GEO) for AI Overviews, ChatGPT, and Perplexity citations. Analyzes
  AI crawler accessibility (GPTBot, ClaudeBot, PerplexityBot), llms.txt compliance,
  brand mention signals, and passage-level citability. Industry detection for SaaS,
  e-commerce, local business, publishers, agencies. Triggers on: "SEO", "audit",
  "schema", "Core Web Vitals", "sitemap", "E-E-A-T", "AI Overviews", "GEO",
  "technical SEO", "content quality", "page speed", "structured data".
---

# SEO — Universal SEO Analysis Skill

Comprehensive SEO analysis across all industries (SaaS, local services,
e-commerce, publishers, agencies). Orchestrates 12 specialized sub-skills
and 6 subagents (+ optional extension sub-skills).

---

## Quick Reference

| Command | What it does |
|---------|-------------|
| `/seo <url>` | **FULL MODE** — runs ALL sub-skills in parallel, unified report |
| `/seo audit <url>` | Full website audit with parallel subagent delegation |
| `/seo page <url>` | Deep single-page analysis |
| `/seo sitemap <url or generate>` | Analyze or generate XML sitemaps |
| `/seo schema <url>` | Detect, validate, and generate Schema.org markup |
| `/seo images <url>` | Image optimization analysis |
| `/seo technical <url>` | Technical SEO audit (9 categories) |
| `/seo content <url>` | E-E-A-T and content quality analysis |
| `/seo geo <url>` | AI Overviews / Generative Engine Optimization |
| `/seo hreflang <url>` | Hreflang/i18n SEO audit and generation |
| `/seo plan <business-type>` | Strategic SEO planning |
| `/seo programmatic [url\|plan]` | Programmatic SEO analysis and planning |
| `/seo competitor-pages [url\|generate]` | Competitor comparison page generation |
| `/seo dataforseo [command]` | Live SEO data via DataForSEO (extension) |

---

## Routing Logic

**If invoked as `/seo <url>` with only a URL and no subcommand → run FULL MODE (see below).**

Otherwise detect the subcommand and route to the matching sub-skill:
- `/seo audit` → `seo-audit`
- `/seo page` → `seo-page`
- `/seo technical` → `seo-technical`
- `/seo content` → `seo-content`
- `/seo schema` → `seo-schema`
- `/seo images` → `seo-images`
- `/seo sitemap` → `seo-sitemap`
- `/seo geo` → `seo-geo`
- `/seo hreflang` → `seo-hreflang`
- `/seo plan` → `seo-plan`
- `/seo programmatic` → `seo-programmatic`
- `/seo competitor-pages` → `seo-competitor-pages`
- `/seo dataforseo` → `seo-dataforseo` (extension)
- `/seo` with no URL → show quick reference table above

---

## FULL MODE — Run All SEO Sub-Skills at Once

When invoked as `/seo <url>` (just a URL, no subcommand):

### Step 1 — Detect Brand & Business Type
Fetch `<url>` and extract:
- Brand name from title tag or H1 (use only the first part if separators like `|` `-` `:` are present)
- Business type: SaaS, Local Service, E-commerce, Publisher, Agency, Hotel, Restaurant, Other

### Step 2 — Run All Sub-Skills in Parallel

Launch ALL of the following simultaneously. Do not wait for one before starting the next:

**2a — Full Site Audit** (`seo-audit`)
- SEO Health Score (0–100) + band
- Category scores: Crawlability, Technical, On-Page, Content/E-E-A-T, Authority
- Issue counts: Critical / High / Medium / Low
- Top 5 issues + top 3 quick wins

**2b — Technical SEO** (`seo-technical`)
- 9-category technical audit: crawlability, indexability, security, URL structure, mobile, Core Web Vitals, structured data, JS rendering, IndexNow
- Critical technical blocks + fixes

**2c — Schema & Structured Data** (`seo-schema`)
- Detect all existing schema types on the site
- Validate against Schema.org standards
- Flag missing schema for the business type
- Generate recommended JSON-LD implementations

**2d — Content Quality & E-E-A-T** (`seo-content`)
- E-E-A-T score and signal breakdown
- Thin content detection
- AI citation readiness
- Readability scores + top content issues

**2e — Image Optimization** (`seo-images`)
- Alt text coverage and quality
- File size and format analysis
- Lazy loading and CLS risk
- Top image fixes

**2f — Sitemap Health** (`seo-sitemap`)
- XML sitemap validation
- URL coverage and freshness
- Indexability of sitemap URLs
- Missing or broken entries

**2g — AI Search / GEO** (`seo-geo`)
- AI crawler access (GPTBot, ClaudeBot, PerplexityBot)
- llms.txt presence and compliance
- Passage-level citability score
- Brand mention signals
- Platform-specific recommendations: Google AI Overviews, ChatGPT, Perplexity

**2h — Hreflang / International SEO** (`seo-hreflang`)
- Detect existing hreflang tags
- Validate language/region codes
- Flag missing return links or mismatches
- Recommendations for international sites (skip with note if single-language)

**2i — Competitor SEO Analysis** (`seo-competitor` / `seo-competitor-pages`)
- Identify top 3–5 organic competitors
- SEO Health Score comparison table
- Gaps where competitors outperform the target
- Where the target leads
- Competitive action plan

### Step 3 — Merge Into Unified SEO Report

Output the full report in this format:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# COMPLETE SEO INTELLIGENCE REPORT
## [Brand Name]
**URL:** [url]
**Business type:** [type]
**Report date:** [date]
**Generated by:** /seo (full mode — 9 sub-skills)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SEO EXECUTIVE DASHBOARD

| Module | Score | Band | Status |
|--------|-------|------|--------|
| Overall SEO Health | XX/100 | [band] | 🟢/🟡/🔴 |
| Technical SEO | XX/100 | [band] | 🟢/🟡/🔴 |
| Content & E-E-A-T | XX/100 | [band] | 🟢/🟡/🔴 |
| Schema Coverage | XX/100 | [band] | 🟢/🟡/🔴 |
| Image Optimization | XX/100 | [band] | 🟢/🟡/🔴 |
| Sitemap Health | XX/100 | [band] | 🟢/🟡/🔴 |
| AI Search / GEO | XX/100 | [band] | 🟢/🟡/🔴 |
| International SEO | XX/100 | [band] | 🟢/🟡/🔴 |
| Competitive Standing | #X of N | [position] | 🟢/🟡/🔴 |

**Overall SEO Score: XX/100**
*(Weighted average across all modules)*

**In one sentence:** [Plain-English summary of the site's current SEO position]

---

## TOP 10 PRIORITY SEO ACTIONS

| # | Action | Module | Impact | Urgency |
|---|--------|--------|--------|---------|
| 1 | [specific action] | [module] | High | Immediate |
| 2 | [specific action] | [module] | High | Immediate |
| 3 | [specific action] | [module] | High | This week |
| 4 | [specific action] | [module] | Medium | This week |
| 5–10 | ... | ... | ... | ... |

> ⚠️ Cross-module flags: If the same issue appears in multiple modules (e.g. slow pages = Technical + CWV + Images), elevate to Priority 1.

---

## SECTION 1 — FULL SITE AUDIT

**SEO Health Score: XX/100 — [Band]**

### Category Breakdown
| Category | Score | Issues |
|----------|-------|--------|
| Crawlability & Indexation | XX/100 | [count] |
| Technical Foundations | XX/100 | [count] |
| On-Page Optimization | XX/100 | [count] |
| Content Quality & E-E-A-T | XX/100 | [count] |
| Authority & Trust | XX/100 | [count] |

### Issue Summary
- 🔴 Critical: [count] — [top issue]
- 🟠 High: [count] — [top issue]
- 🟡 Medium: [count]
- 🔵 Low: [count]

### Top 3 Quick Wins
1. [action + expected impact]
2. [action + expected impact]
3. [action + expected impact]

---

## SECTION 2 — TECHNICAL SEO

**Technical Score: XX/100**

| Category | Status | Top Issue |
|----------|--------|-----------|
| Crawlability | 🟢/🟡/🔴 | [issue or "Clear"] |
| Indexability | 🟢/🟡/🔴 | [issue or "Clear"] |
| Security (HTTPS) | 🟢/🟡/🔴 | [issue or "Clear"] |
| URL Structure | 🟢/🟡/🔴 | [issue or "Clear"] |
| Mobile Optimization | 🟢/🟡/🔴 | [issue or "Clear"] |
| Core Web Vitals | 🟢/🟡/🔴 | [LCP/INP/CLS values] |
| JS Rendering | 🟢/🟡/🔴 | [issue or "Clear"] |
| IndexNow | 🟢/🟡/🔴 | [configured or not] |

### Critical Technical Fixes
1. [fix + why it matters]
2. [fix + why it matters]

---

## SECTION 3 — SCHEMA & STRUCTURED DATA

**Schema Coverage: XX/100**

### Detected Schema Types
| Schema Type | Found | Valid | Notes |
|-------------|-------|-------|-------|
| [type] | ✅/❌ | ✅/❌ | [note] |

### Missing Schema (recommended for this business type)
- [schema type]: [why it matters + JSON-LD snippet]

### Generated Implementations
```json
[JSON-LD for top recommended schema type]
```

---

## SECTION 4 — CONTENT QUALITY & E-E-A-T

**Content Score: XX/100**

| Signal | Status | Notes |
|--------|--------|-------|
| Experience signals | 🟢/🟡/🔴 | [finding] |
| Expertise signals | 🟢/🟡/🔴 | [finding] |
| Authoritativeness | 🟢/🟡/🔴 | [finding] |
| Trustworthiness | 🟢/🟡/🔴 | [finding] |
| AI Citation Readiness | 🟢/🟡/🔴 | [finding] |
| Thin Content | 🟢/🟡/🔴 | [page count if any] |

### Top 3 Content Fixes
1. [action]
2. [action]
3. [action]

---

## SECTION 5 — IMAGE OPTIMIZATION

**Image Score: XX/100**

| Check | Status | Detail |
|-------|--------|--------|
| Alt text coverage | XX% | [pages missing alt text] |
| Modern formats (WebP/AVIF) | 🟢/🟡/🔴 | [count still in JPG/PNG] |
| Oversized images | [count] | [largest offender + size] |
| Lazy loading | 🟢/🟡/🔴 | [implemented or not] |
| CLS risk | 🟢/🟡/🔴 | [images without dimensions] |

### Top Image Fixes
1. [action]
2. [action]

---

## SECTION 6 — SITEMAP HEALTH

**Sitemap Score: XX/100**

| Check | Status | Detail |
|-------|--------|--------|
| Sitemap found | ✅/❌ | [URL or "Not found"] |
| Total URLs | [count] | |
| Indexable URLs | [count] | [% of total] |
| Recently updated | 🟢/🟡/🔴 | [last modified date] |
| Broken/redirected URLs | [count] | [top examples] |

### Sitemap Fixes
1. [action]

---

## SECTION 7 — AI SEARCH / GEO READINESS

**GEO Score: XX/100**

| Platform | Accessibility | Citability | Notes |
|----------|--------------|------------|-------|
| Google AI Overviews | 🟢/🟡/🔴 | 🟢/🟡/🔴 | [finding] |
| ChatGPT | 🟢/🟡/🔴 | 🟢/🟡/🔴 | [finding] |
| Perplexity | 🟢/🟡/🔴 | 🟢/🟡/🔴 | [finding] |
| Bing Copilot | 🟢/🟡/🔴 | 🟢/🟡/🔴 | [finding] |

| Signal | Status |
|--------|--------|
| GPTBot allowed | ✅/❌ |
| ClaudeBot allowed | ✅/❌ |
| PerplexityBot allowed | ✅/❌ |
| llms.txt present | ✅/❌ |
| Brand mentions (web) | [count + recency] |
| Passage-level citability | [score + finding] |

### Top GEO Fixes
1. [action]
2. [action]

---

## SECTION 8 — INTERNATIONAL SEO / HREFLANG

**International Score: XX/100**
*(Note: "N/A — single language site" is a valid result)*

| Check | Status | Detail |
|-------|--------|--------|
| Hreflang tags found | ✅/❌ | [count or "None"] |
| Language codes valid | 🟢/🟡/🔴 | [invalid codes if any] |
| Region codes valid | 🟢/🟡/🔴 | [invalid codes if any] |
| Return links present | 🟢/🟡/🔴 | [missing pairs] |
| x-default tag | ✅/❌ | |

### Hreflang Fixes / Recommendations
1. [action or "No action needed — single language site"]

---

## SECTION 9 — COMPETITIVE SEO STANDING

**Your position: #X of [N] competitors audited**

| Brand | SEO Score | Band | Top Weakness |
|-------|-----------|------|-------------|
| [Target] ← YOU | XX/100 | [band] | [weakness] |
| [Competitor 1] | XX/100 | [band] | [weakness] |
| [Competitor 2] | XX/100 | [band] | [weakness] |
| [Competitor 3] | XX/100 | [band] | [weakness] |

### Where You're Losing Ground
- [specific gap with competitor and metric]

### Where You Lead
- [specific advantage with metric]

### Competitive Action Plan
**Immediate:** [action to close biggest gap]
**30–60 days:** [action to exploit competitor weakness]
**Strategic:** [structural advantage to build]

---

## DATA & METHODOLOGY

| Module | Method | Confidence |
|--------|--------|------------|
| Site Audit | Direct crawl of [url] | High |
| Technical SEO | Headers, robots.txt, sitemap, HTML analysis | High |
| Schema | JSON-LD + microdata extraction | High |
| Content/E-E-A-T | On-page signals, author info, trust signals | Medium |
| Images | HTML img tag analysis + format detection | High |
| Sitemap | XML sitemap fetch + URL validation | High |
| GEO | robots.txt crawl rules + llms.txt + brand signals | Medium |
| Hreflang | Link tag extraction + code validation | High |
| Competitors | SERP analysis + SEO Health scoring | Medium |

**Report generated:** [date and time]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 4 — Generate PDF

Run this bash command to save the report as a PDF:

```bash
cd "$HOME/OneDrive - George Brown College/Desktop/PRODUCT MANAGEMENT/My Apps/seo-app" && python audit.py $ARGUMENTS
```

The PDF is saved in `backend/reports/` named after the brand.

---

## Orchestration Logic (for /seo audit subcommand)

When invoked as `/seo audit`, delegate to subagents in parallel:
1. Detect business type (SaaS, local, ecommerce, publisher, agency, other)
2. Spawn subagents: seo-technical, seo-content, seo-schema, seo-sitemap, seo-performance, seo-visual, seo-geo
3. Collect results and generate unified report with SEO Health Score (0-100)
4. Create prioritized action plan (Critical → High → Medium → Low)

---

## Industry Detection

Detect business type from homepage signals:
- **SaaS**: pricing page, /features, /integrations, /docs, "free trial", "sign up"
- **Local Service**: phone number, address, service area, "serving [city]", Google Maps embed
- **E-commerce**: /products, /collections, /cart, "add to cart", product schema
- **Publisher**: /blog, /articles, /topics, article schema, author pages, publication dates
- **Agency**: /case-studies, /portfolio, /industries, "our work", client logos
- **Hotel**: rooms, reservations, check-in/out, amenities, property name

---

## Quality Gates

Read `references/quality-gates.md` for thin content thresholds per page type.
Hard rules:
- ⚠️ WARNING at 30+ location pages (enforce 60%+ unique content)
- 🛑 HARD STOP at 50+ location pages (require user justification)
- Never recommend HowTo schema (deprecated Sept 2023)
- FAQ schema for Google rich results: only government and healthcare sites (Aug 2023 restriction)
- All Core Web Vitals references use INP, never FID

---

## Reference Files

Load these on-demand as needed — do NOT load all at startup:
- `references/cwv-thresholds.md` — Current Core Web Vitals thresholds and measurement details
- `references/schema-types.md` — All supported schema types with deprecation status
- `references/eeat-framework.md` — E-E-A-T evaluation criteria (Sept 2025 QRG update)
- `references/quality-gates.md` — Content length minimums, uniqueness thresholds

---

## Scoring Methodology

### SEO Health Score (0-100)
Weighted aggregate of all categories:

| Category | Weight |
|----------|--------|
| Technical SEO | 22% |
| Content Quality | 23% |
| On-Page SEO | 20% |
| Schema / Structured Data | 10% |
| Performance (CWV) | 10% |
| AI Search Readiness | 10% |
| Images | 5% |

### Priority Levels
- **Critical**: Blocks indexing or causes penalties (immediate fix required)
- **High**: Significantly impacts rankings (fix within 1 week)
- **Medium**: Optimization opportunity (fix within 1 month)
- **Low**: Nice to have (backlog)

---

## Sub-Skills

This skill orchestrates 12 specialized sub-skills (+ 1 extension):

1. **seo-audit** — Full website audit with parallel delegation
2. **seo-page** — Deep single-page analysis
3. **seo-technical** — Technical SEO (9 categories)
4. **seo-content** — E-E-A-T and content quality
5. **seo-schema** — Schema markup detection and generation
6. **seo-images** — Image optimization
7. **seo-sitemap** — Sitemap analysis and generation
8. **seo-geo** — AI Overviews / GEO optimization
9. **seo-hreflang** — Hreflang/i18n SEO audit and generation
10. **seo-plan** — Strategic planning with templates
11. **seo-programmatic** — Programmatic SEO analysis and planning
12. **seo-competitor-pages** — Competitor comparison page generation
13. **seo-dataforseo** — Live SEO data via DataForSEO MCP (extension)
