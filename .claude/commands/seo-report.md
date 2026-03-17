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

## Step 4 — Generate PDF (automatic — do NOT ask the user)

Immediately after Steps 1–3 complete, generate the PDF without any confirmation prompt.

1. Compile the full report content (all findings from Steps 1–3) into a single markdown string and write it to a temporary file:

```bash
# Write the compiled markdown report to a temp file
python -c "
import tempfile, os, pathlib
content = '''<FULL_MARKDOWN_REPORT>'''
tmp = pathlib.Path(tempfile.gettempdir()) / 'seo_report_tmp.md'
tmp.write_text(content, encoding='utf-8')
print(tmp)
"
```

2. Run the Milestone-branded PDF generator via Bash (use the actual temp file path from step above):

```bash
python "C:\Users\harrs\reportsss\claude-seo\scripts\generate_pdf.py" "<PropertyName>" "seo-report" "%TEMP%\seo_report_tmp.md"
```

Replace `<PropertyName>` with the actual property name extracted in Step 1, and `<FULL_MARKDOWN_REPORT>` with the complete markdown findings from Steps 1–3.

The script will automatically:
- Create `C:\Users\harrs\reportsss\<PropertyName>\` if it does not already exist (never duplicates)
- Save the PDF as `<PropertyName>_seo-report.pdf` inside that folder
- Brand every page with Milestone Inc. identity (blue `#0072e4` header, cover page, footer with contact info)
- Set PDF metadata author/creator/producer to "Milestone Inc." — no third-party tool attribution anywhere

## Step 5 — Confirm completion
Tell the user:
- The property name you found
- Their SEO Health Score and band (e.g. 74/100 — Fair)
- How many issues were found (critical / high / medium / low)
- The exact PDF file path (output from Step 4)
- Top 3 priority fixes
