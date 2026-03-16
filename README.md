# Claude SEO Auditor

A fully working SEO audit web app — **no API key required, no cost per audit**.

## Quick Start (Windows)

1. Make sure Python 3.9+ is installed: https://python.org
2. Double-click `start.bat`
3. Open `frontend/index.html` in your browser
4. Enter any URL and click Run Audit

## Manual Start

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
```

Then open `frontend/index.html` in your browser.

## What it checks

- Crawlability & Indexation (30%): robots.txt, sitemap, canonical, noindex
- Technical Foundations (25%): HTTPS, HTTP redirect, load time, viewport
- On-Page Optimisation (20%): Title, meta description, H1, image alt, links
- Content Quality & E-E-A-T (15%): Word count, structured data, Open Graph
- Authority & Trust (10%): Privacy policy, contact info, HTTPS

## SEO Health Bands: 90-100 Excellent | 75-89 Good | 60-74 Fair | 40-59 Poor | <40 Critical
