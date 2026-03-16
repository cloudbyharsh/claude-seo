---
description: Generate a data-driven content calendar combining SEO gaps, social listening themes, competitor content analysis, and seasonality. Usage: /content-calendar https://yoursite.com [30|60|90] [social-only|seo-only] [vs competitor1 competitor2]
---

Generate a content calendar for: $ARGUMENTS

Follow the `content-calendar` skill exactly. Here is the execution sequence:

## Step 1 — Detect Brand, Business Type & Period
Fetch the URL from $ARGUMENTS and extract:
- Brand name from title tag or H1
- Business type (Hotel, Restaurant, SaaS, Retail, Healthcare, Agency, Local Business)
- Calendar period from $ARGUMENTS (30 / 60 / 90 days — default: 30)
- Mode from $ARGUMENTS (all / social-only / seo-only — default: all)
- Any named competitors from $ARGUMENTS after "vs"

## Stages 2a–2d — Run All in Parallel

Launch all four simultaneously:

### SEO Content Gap Analysis
Run `seo-content` + `seo-audit` on the URL:
- Missing content topics / keyword gaps
- Thin or underperforming pages
- Question keywords relevant to business type
- E-E-A-T content gaps
Output: 15–20 SEO content ideas with target keyword + search intent

### Social Listening Themes
Run `social-listen` + `social-sentiment` for the brand name:
- Top customer complaints → content to address them
- Top praised themes → content to amplify them
- Frequently asked questions in reviews/forums
- Trending topics in the niche
Output: 10–15 social-driven content ideas ranked by mention frequency

### Competitor Content Analysis
Identify top 3–5 content competitors and scan their public content:
- Topics they publish frequently
- Topics they're missing (your gap opportunity)
- Their best-performing content formats
- Publishing frequency benchmark
- Social platforms where they get most engagement
Build the Competitor Content Gap Matrix showing which topics competitors cover vs miss.
Output: 10–15 competitor-gap ideas with gap opportunity score

### Seasonality & Event Mapping
Based on business type and current date:
- Upcoming holidays and observances relevant to this business
- Industry events or peak seasons
- Awareness days that align with brand
- Booking/purchase cycle lead times
Output: Dated content hooks for upcoming events within the calendar period

## Step 3 — Content Strategy Layer
Score every content idea using:
- SEO demand: 30%
- Social demand: 25%
- Competitor gap: 25%
- Seasonality fit: 20%

Assign content types (Blog, FAQ, Social Post, Comparison Page, Guide, Video Script, etc.)
Create cross-post plan for every blog/SEO piece (Instagram caption + LinkedIn post + email subject line)

## Step 4 — Build & Output Full Calendar
Follow the full output format defined in the `content-calendar` skill:
1. Intelligence Summary table
2. Competitor Content Landscape table
3. "Publish This Week" Top 5
4. Full calendar by week (with briefs for each piece)
5. Master table (all pieces)
6. Competitor Content Gap Report (topics they cover, blue ocean gaps, frequency benchmark)
7. Content Strategy Notes

## Step 5 — Generate PDF
```bash
cd "$HOME/OneDrive - George Brown College/Desktop/PRODUCT MANAGEMENT/My Apps/seo-app" && python audit.py $ARGUMENTS
```

## Step 6 — Confirm to User
- Brand + business type
- Calendar period
- Total pieces + breakdown by source
- Top 3 "publish this week" picks
- Biggest competitor content gap
- PDF path
