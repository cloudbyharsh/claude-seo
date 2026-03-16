---
description: Run a full SEO audit + competitor analysis for any URL and save a named PDF report. Usage: /seo-report https://propertywebsite.com
---

Run a complete SEO report for: $ARGUMENTS

Follow these steps in order:

## Step 1 — Fetch property name
Fetch the URL $ARGUMENTS and extract the site's title tag or H1. This is the **property name** that will be used to name the PDF and throughout the report. If the title contains separators like | or - or :, use only the first meaningful part (e.g. "Acme Hotel" from "Acme Hotel | Official Site").

## Step 2 — Run full SEO audit
Run the complete `/seo-audit` skill on $ARGUMENTS including:
- Crawlability & Indexation (robots.txt, sitemap, canonical, noindex)
- Technical Foundations (HTTPS, redirects, load time, viewport)
- On-Page Optimization (title, meta, H1, images, links)
- Content Quality & E-E-A-T (word count, schema, OG tags)
- Authority & Trust (privacy, contact, HTTPS)
- SEO Health Index score (0-100) with category breakdown

## Step 3 — Run competitor analysis
Run the complete `seo-competitor` skill on $ARGUMENTS:
- Identify top 3-5 competitors
- Audit each competitor using the SEO Health Index
- Produce the full comparison table
- Gap analysis and competitive action plan

## Step 4 — Generate PDF
Run this bash command to generate the PDF report, using the property name you extracted in Step 1:

```bash
cd "$HOME/OneDrive - George Brown College/Desktop/PRODUCT MANAGEMENT/My Apps/seo-app" && python audit.py $ARGUMENTS
```

The PDF will be saved automatically in `backend/reports/` named after the property.

## Step 5 — Confirm completion
Tell the user:
- The property name you found
- Their SEO Health Score and band (e.g. 74/100 — Fair)
- How many issues were found (critical / high / medium / low)
- The exact file path where the PDF was saved
- Top 3 priority fixes
