---
description: Run every report at once — SEO audit, SEO competitors, social listening, social sentiment, social competitors, and brand health — merged into one unified report with PDF export. Usage: /full-report https://yourwebsite.com OR /full-report https://yourwebsite.com "Brand Name"
---

Run a complete unified brand and SEO intelligence report for: $ARGUMENTS

Follow the `full-report` skill exactly. Here is the execution sequence:

---

## Step 1 — Extract Brand Name & Business Type

Fetch the URL from $ARGUMENTS and extract:
- The **brand name** from the title tag or H1 (use only the first part if separators like `|` `-` `:` are present)
- The **business type** (Hotel, Restaurant, SaaS, Retail, Healthcare, Agency, Local Business)

If a brand name was explicitly passed as a second argument in $ARGUMENTS, use that instead.

Store both for use throughout all steps below.

---

## Steps 2–7 — Run All Modules in Parallel

Launch the following six analyses simultaneously. Do not wait for one before starting the next.

### SEO Audit
Run the complete `seo-audit` skill on the URL. Capture:
- SEO Health Score (0–100) + band
- Category scores (Crawlability, Technical, On-Page, Content/E-E-A-T, Authority)
- Issue counts: Critical / High / Medium / Low
- Top 5 issues + top 3 quick wins

### SEO Competitor Analysis
Run the complete `seo-competitor` skill on the URL. Capture:
- Top 3–5 competitors + why they qualify
- SEO Health Score for each
- Comparison table across all categories
- Gaps where competitors outperform the target
- Advantages where target leads
- Competitive action plan (immediate / 30-60d / strategic)

### Social Listening
Run the `social-listen` skill for the brand name. Capture:
- Mentions across Reddit, YouTube, Yelp, Google News, Web/Forums
- Total mention count + recency
- Dominant sentiment per platform
- Any crisis or viral complaint signals

### Social Sentiment Analysis
Run the `social-sentiment` skill for the brand name. Capture:
- Overall Sentiment Score (0–100) + band
- Aspect-by-aspect breakdown (adapted to business type)
- Top 3 praised + top 3 complained-about aspects with direct quotes
- Data confidence level

### Social Competitor Comparison
Run the `social-competitors` skill for the brand name. Capture:
- Social Health Score for brand + top 3 competitors
- Side-by-side comparison table
- Where competitors are winning the conversation
- Where the target brand has an advantage
- Platforms where competitors are present but target is not

### Brand Health Report
Run the `social-report` skill for the brand name. Capture:
- Social Health Score (0–100) + band
- Mention volume by platform
- Sentiment trend (growing / stable / declining)
- Top 5 themes (positive + negative) with quotes
- Active alerts (crisis / urgent / watch)
- Priority actions list

---

## Step 8 — Merge Into Unified Report

Combine all results from Steps 2–7 using the master report format defined in the `full-report` skill:

1. **Executive Dashboard** — scores table + Overall Brand Health Score (average of SEO Health + Social Sentiment + Social Health) + one-sentence summary
2. **Top 10 Priority Actions** — ranked by combined impact across all modules. Cross-reference: if the same issue appears in both SEO and social data, elevate it to Priority 1
3. **Section 1** — SEO Health (full breakdown)
4. **Section 2** — SEO Competitive Standing
5. **Section 3** — Social Sentiment (aspect breakdown)
6. **Section 4** — Social Brand Health (mention overview, alerts, themes)
7. **Section 5** — Social Competitive Standing
8. **Data & Methodology Notes** — sources, sample sizes, confidence, excluded platforms

---

## Step 9 — Generate PDF

Run this bash command to save the PDF:

```bash
cd "$HOME/OneDrive - George Brown College/Desktop/PRODUCT MANAGEMENT/My Apps/seo-app" && python audit.py $ARGUMENTS
```

The PDF will be saved in `backend/reports/` named after the brand.

---

## Step 10 — Confirm to User

Tell the user:
- Brand name detected and business type
- **Overall Brand Health Score** (average of SEO + Social Sentiment + Social Health)
- SEO Health Score + band
- Social Sentiment Score + band
- Social Health Score + band
- Total critical issues found across all modules
- Exact PDF path where the report was saved
- Top 3 priority actions from the unified list
