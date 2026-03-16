---
name: content-calendar
description: >
  AI-powered content calendar generator. Combines SEO keyword gaps, social listening
  themes, competitor content analysis, and seasonality signals to produce a prioritised
  30/60/90-day content calendar with titles, briefs, keywords, platforms, publish dates,
  and cross-post plans. Works for any business type. Use when user says "content calendar",
  "content plan", "what should I write", "content schedule", "content strategy", or
  "/content-calendar".
---

# Content Calendar — Unified Content Intelligence Skill

Generates a data-driven, prioritised content calendar by pulling from SEO gaps,
social listening themes, competitor content analysis, and seasonal signals —
all in one pass.

---

## Quick Reference

| Command | What it does |
|---------|-------------|
| `/content-calendar <url>` | 30-day calendar (auto-detects brand) |
| `/content-calendar <url> 60` | 60-day calendar |
| `/content-calendar <url> 90` | 90-day calendar |
| `/content-calendar <url> social-only` | Social posts only (no blog/SEO content) |
| `/content-calendar <url> seo-only` | Blog & SEO content only |
| `/content-calendar <url> vs <comp1> <comp2>` | Include named competitors |

---

## Execution Plan — Run All Stages in Parallel

After Step 1 (brand detection), launch Stages 2a–2d **simultaneously**.

---

### Step 1 — Detect Brand, Business Type & Period

Fetch `<url>` and extract:
- **Brand name** from title tag or H1 (first part only if separators present)
- **Business type**: Hotel, Restaurant, SaaS, Retail, Healthcare, Agency, Local Business
- **Calendar period**: 30 / 60 / 90 days (default: 30)
- **Current date** → used for scheduling and seasonality mapping
- **Mode**: all / social-only / seo-only (default: all)

---

### Stage 2 — Run All Intelligence Modules in Parallel

---

#### 2a — SEO Content Gap Analysis (`seo-content` + `seo-audit`)

Scan the site for:
- **Missing content topics** — keywords the business should rank for but has no page targeting
- **Thin or underperforming pages** — existing content that needs expansion
- **Question keywords** — "how to", "best", "near me", "vs" queries relevant to this business type
- **E-E-A-T gaps** — topics where authoritative content would strengthen trust signals
- **Schema opportunities** — content types that would benefit from FAQ, HowTo, or Article schema

Output: List of 15–20 SEO content ideas with target keyword + estimated search intent

---

#### 2b — Social Listening Themes (`social-listen` + `social-sentiment`)

Scan Reddit, YouTube, Yelp, Google News, and web for:
- **Top customer complaints** → content that directly addresses pain points
- **Top praised themes** → content that amplifies strengths
- **Frequently asked questions** in reviews and forums → FAQ/blog fodder
- **Trending topics** in the brand's niche right now
- **Unanswered complaints** → opportunity to publish helpful content that responds at scale
- **User-generated content signals** → what customers are naturally posting about

Output: List of 10–15 social-driven content ideas ranked by mention frequency

---

#### 2c — Competitor Content Analysis

Identify top 3–5 content competitors (may differ from SEO competitors — focus on who
publishes content in the same niche):

For each competitor, scan their blog, social profiles, and news mentions for:
- **Content topics they publish frequently** → understand their content strategy
- **Content gaps they're missing** → topics in the niche they don't cover (your opportunity)
- **Their best-performing content** → topics with high engagement/shares
- **Content formats they use** → blog posts, videos, guides, listicles, FAQs
- **Publishing frequency** → how often they post (set your benchmark)
- **Social platforms they dominate** → channels where they get most engagement

**Competitor Content Gap Matrix:**

| Topic | You | Comp 1 | Comp 2 | Comp 3 | Opportunity |
|-------|-----|--------|--------|--------|-------------|
| [topic] | ❌ | ✅ | ✅ | ❌ | High — 2 competitors cover this |
| [topic] | ❌ | ❌ | ❌ | ❌ | Highest — nobody covers this |
| [topic] | ✅ | ✅ | ❌ | ❌ | Maintain — you're competing well |

Output: 10–15 competitor-gap content ideas, each tagged with which competitor(s) cover it and the gap opportunity score

---

#### 2d — Seasonality & Event Mapping

Based on business type and current date, map upcoming:
- **Holidays and observances** relevant to the business (within the calendar period)
- **Industry events** or peak seasons
- **Local events** (if location-based business)
- **Awareness days** that align with brand values
- **Booking/purchase cycles** — when customers start researching (e.g. 6 weeks before holidays)

Output: List of dated content hooks tied to upcoming events

---

### Step 3 — Content Strategy Layer

Before building the calendar, synthesise all intelligence into a strategy:

**Priority scoring formula for each content idea:**
- SEO demand (search volume / keyword gap size): 30%
- Social demand (mention frequency / complaint volume): 25%
- Competitor gap (how many competitors miss this topic): 25%
- Seasonality fit (how time-sensitive is this): 20%

**Content type assignment** (based on business type + topic intent):

| Intent | Content Type |
|--------|-------------|
| Informational / How-to | Blog post, FAQ page |
| Comparison / Decision | Comparison page, Listicle |
| Local / Near me | Location page, Local guide |
| Visual / Aspirational | Instagram carousel, TikTok, Pinterest |
| Trust / Authority | Case study, Review response article |
| Announcement / Promo | Social post, Email, Press release |
| Community / Engagement | Poll, Q&A, Behind-the-scenes |

**Cross-post plan** — every blog/SEO piece automatically gets:
- 1x Instagram caption (visual angle)
- 1x LinkedIn post (professional angle)
- 1x short-form social hook (Twitter/X style)
- 1x email subject line (for newsletter use)

---

### Step 4 — Build the Calendar

Assign publish dates across the period, following these rules:
- Space content evenly — no more than 2 pieces per platform per week
- High-priority items (score 80+) → schedule in Week 1–2
- Seasonal content → scheduled 2–3 weeks before the event date
- Mix content types across the week (don't publish 3 blogs in a row)
- Balance SEO content (evergreen) vs social content (timely)

---

### Step 5 — Output the Full Calendar

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# CONTENT CALENDAR
## [Brand Name]
**URL:** [url]
**Business type:** [type]
**Period:** [start date] → [end date] ([N] days)
**Total pieces:** [count]
**Generated by:** /content-calendar
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## INTELLIGENCE SUMMARY

### What's Driving This Calendar
| Source | Key Finding | Content Pieces Generated |
|--------|-------------|------------------------|
| SEO Gaps | [top finding] | [count] |
| Social Themes | [top finding] | [count] |
| Competitor Gaps | [top finding] | [count] |
| Seasonality | [upcoming events] | [count] |

### Competitor Content Landscape
| Competitor | Publishes | Best At | Their Gap |
|------------|-----------|---------|-----------|
| [Comp 1] | [frequency] | [format/topic] | [gap] |
| [Comp 2] | [frequency] | [format/topic] | [gap] |
| [Comp 3] | [frequency] | [format/topic] | [gap] |

**Your biggest competitor content gap:** [topic area no competitor covers well]
**Your fastest win vs competitors:** [topic you can publish this week]

---

## PUBLISH THIS WEEK — TOP 5 PRIORITY PIECES

| # | Title | Type | Platform | Why Now | Score |
|---|-------|------|----------|---------|-------|
| 1 | [title] | [type] | [platform] | [reason] | XX/100 |
| 2 | [title] | [type] | [platform] | [reason] | XX/100 |
| 3 | [title] | [type] | [platform] | [reason] | XX/100 |
| 4 | [title] | [type] | [platform] | [reason] | XX/100 |
| 5 | [title] | [type] | [platform] | [reason] | XX/100 |

---

## FULL CONTENT CALENDAR

### WEEK 1 — [Date Range]

| Publish Date | Title | Type | Platform | Keyword / Theme | Source | Priority |
|-------------|-------|------|----------|----------------|--------|----------|
| [date] | [title] | Blog | Website | [keyword] | SEO gap | 🔴 High |
| [date] | [title] | Social Post | Instagram | [theme] | Social listening | 🔴 High |
| [date] | [title] | FAQ Page | Website | [keyword] | Competitor gap | 🟠 Medium |
| [date] | [title] | Social Post | LinkedIn | [theme] | Social listening | 🟡 Standard |

#### Content Briefs — Week 1

**[Title]**
- **Type:** [type] | **Platform:** [platform] | **Publish:** [date]
- **Target keyword / theme:** [keyword or social theme]
- **Source:** [SEO gap / Social complaint / Competitor gap / Seasonal]
- **Competitor note:** [which competitors cover this, or "gap — nobody covers this"]
- **Brief:** [2–3 sentence brief — what to cover, angle to take, call to action]
- **Cross-post plan:**
  - Instagram: [caption angle]
  - LinkedIn: [post angle]
  - Email subject: [subject line]

---

### WEEK 2 — [Date Range]

[Same format as Week 1]

---

### WEEK 3 — [Date Range]

[Same format as Week 1]

---

### WEEK 4 — [Date Range]

[Same format as Week 1]

---

*(Weeks 5–8 included for 60-day calendar; Weeks 5–12 for 90-day calendar)*

---

## CONTENT CALENDAR — MASTER TABLE (all pieces, sortable)

| # | Publish Date | Title | Type | Platform | Keyword/Theme | Source | Competitor Gap | Priority Score |
|---|-------------|-------|------|----------|--------------|--------|---------------|---------------|
| 1 | [date] | [title] | [type] | [platform] | [kw/theme] | [source] | ✅/❌ | XX/100 |
| 2 | [date] | [title] | [type] | [platform] | [kw/theme] | [source] | ✅/❌ | XX/100 |
| ... | | | | | | | | |

---

## COMPETITOR CONTENT GAP REPORT

### Topics Competitors Cover That You Don't
| Topic | Competitor(s) | Their Approach | Your Opportunity |
|-------|--------------|----------------|-----------------|
| [topic] | [comp names] | [how they cover it] | [your angle to differentiate] |

### Topics Nobody in Your Niche Covers (Blue Ocean)
| Topic | Why It Matters | Suggested Format | Priority |
|-------|---------------|-----------------|---------|
| [topic] | [reason] | [format] | 🔴/🟠/🟡 |

### Competitor Publishing Frequency Benchmark
| Brand | Blog Posts/mo | Social Posts/wk | Video/mo |
|-------|--------------|-----------------|---------|
| [Your brand] | [current] | [current] | [current] |
| [Comp 1] | [count] | [count] | [count] |
| [Comp 2] | [count] | [count] | [count] |
**Recommended target for [Brand]:** [X] blog posts/mo · [X] social posts/wk

---

## CONTENT STRATEGY NOTES

### SEO Content Priorities
1. [topic] — [keyword] — [why it matters for rankings]
2. [topic] — [keyword] — [why it matters for rankings]
3. [topic] — [keyword] — [why it matters for rankings]

### Social Content Priorities
1. [theme] — [based on customer complaint / praise] — [platform recommendation]
2. [theme] — [based on customer complaint / praise] — [platform recommendation]

### Seasonal Hooks Coming Up
| Date | Event | Content Idea | Lead Time Needed |
|------|-------|-------------|-----------------|
| [date] | [event] | [idea] | [X weeks] |

---

## DATA SOURCES

| Module | What Was Used | Confidence |
|--------|--------------|------------|
| SEO gaps | Site crawl + keyword intent analysis | High |
| Social themes | Reddit, YouTube, Yelp, Google News | Medium |
| Competitor content | Public blog/social scan of [comp names] | Medium |
| Seasonality | Calendar + business type signals | High |

**Report generated:** [date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 6 — Generate PDF

Run this bash command to save the calendar as a PDF:

```bash
cd "$HOME/OneDrive - George Brown College/Desktop/PRODUCT MANAGEMENT/My Apps/seo-app" && python audit.py $ARGUMENTS
```

The PDF is saved in `backend/reports/` named after the brand.

---

### Step 7 — Confirm to User

Tell the user:
- Brand name + business type detected
- Calendar period covered
- Total content pieces generated
- Breakdown by source: X from SEO gaps, X from social themes, X from competitor gaps, X seasonal
- Top 3 "publish this week" recommendations
- Biggest competitor content gap found
- PDF path

---

## Rules

- Run Stages 2a–2d **in parallel** — never sequentially
- Every content piece must have a clear source (SEO / Social / Competitor gap / Seasonal) — never generate filler content
- Competitor gap column is **mandatory** for every calendar entry — either ✅ (gap exists) or ❌ (competitors cover this)
- Never fabricate keyword volumes, competitor data, or social mention counts
- If a source module returns no data, note it and continue — do not halt
- Cross-post plan is required for every blog/SEO piece
- Priority scores must reflect real data signals — not subjective opinions
- Calendar spacing must be realistic — no brand can publish 5 blog posts in one week unless explicitly requested

---

## Related Skills
- `seo-content` — deep E-E-A-T analysis for individual pages
- `seo-geo` — AI search readiness for content pieces
- `social-sentiment` — aspect analysis that feeds social content ideas
- `social-competitors` — social competitor comparison used in Stage 2c
- `full-report` — master report that this skill complements
