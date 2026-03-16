"""
SEO Audit Engine — No API required, pure Python crawling.
Implements the SEO Health Index scoring model from the claude-seo skill.
"""

import requests
import time
import re
from urllib.parse import urlparse, urljoin
from bs4 import BeautifulSoup
from datetime import datetime


HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; ClaudeSEOAuditor/1.0)"
}

TIMEOUT = 15


def safe_get(url, allow_redirects=True):
    try:
        r = requests.get(url, headers=HEADERS, timeout=TIMEOUT, allow_redirects=allow_redirects)
        return r
    except Exception as e:
        return None


def run_audit(url: str) -> dict:
    """Run full SEO audit and return structured results dict."""
    start = time.time()

    # Normalise URL
    if not url.startswith("http"):
        url = "https://" + url
    parsed = urlparse(url)
    base = f"{parsed.scheme}://{parsed.netloc}"

    audit = {
        "url": url,
        "base": base,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "crawlability": {},
        "technical": {},
        "onpage": {},
        "content": {},
        "authority": {},
        "score": {},
        "issues": [],
        "recommendations": [],
    }

    # ── Fetch main page ───────────────────────────────────────────────────────
    t0 = time.time()
    resp = safe_get(url)
    load_time = round(time.time() - t0, 3)

    if resp is None or resp.status_code >= 400:
        audit["error"] = f"Could not fetch {url} (status {getattr(resp, 'status_code', 'N/A')})"
        return audit

    soup = BeautifulSoup(resp.text, "html.parser")

    # ══════════════════════════════════════════════════════════════
    # 1. CRAWLABILITY & INDEXATION  (weight 30)
    # ══════════════════════════════════════════════════════════════
    crawl = {}
    crawl_score = 100
    issues = []

    # robots.txt
    robots_url = base + "/robots.txt"
    robots_resp = safe_get(robots_url)
    if robots_resp and robots_resp.status_code == 200:
        crawl["robots_txt"] = {"found": True, "content": robots_resp.text[:2000]}
        disallowed_root = re.search(r"Disallow:\s*/\s*$", robots_resp.text, re.MULTILINE)
        if disallowed_root:
            issues.append({
                "issue": "robots.txt disallows all crawling (Disallow: /)",
                "category": "Crawlability & Indexation",
                "severity": "Critical",
                "confidence": "High",
                "impact": -25,
                "recommendation": "Remove or narrow the Disallow: / rule in robots.txt immediately."
            })
            crawl_score -= 25
        sitemap_in_robots = "sitemap:" in robots_resp.text.lower()
        crawl["robots_txt"]["sitemap_referenced"] = sitemap_in_robots
        if not sitemap_in_robots:
            issues.append({
                "issue": "Sitemap URL not referenced in robots.txt",
                "category": "Crawlability & Indexation",
                "severity": "Low",
                "confidence": "High",
                "impact": -2,
                "recommendation": "Add 'Sitemap: https://yourdomain.com/sitemap.xml' to robots.txt."
            })
            crawl_score -= 2
    else:
        crawl["robots_txt"] = {"found": False}
        issues.append({
            "issue": "robots.txt not found or inaccessible",
            "category": "Crawlability & Indexation",
            "severity": "Medium",
            "confidence": "High",
            "impact": -5,
            "recommendation": "Create a robots.txt file at the root of your domain."
        })
        crawl_score -= 5

    # XML Sitemap
    sitemap_urls = [base + "/sitemap.xml", base + "/sitemap_index.xml"]
    sitemap_found = False
    sitemap_url_used = None
    for su in sitemap_urls:
        sr = safe_get(su)
        if sr and sr.status_code == 200 and ("xml" in sr.headers.get("content-type", "") or "<urlset" in sr.text or "<sitemapindex" in sr.text):
            sitemap_found = True
            sitemap_url_used = su
            url_count = sr.text.count("<url>")
            crawl["sitemap"] = {"found": True, "url": su, "url_count": url_count}
            break
    if not sitemap_found:
        crawl["sitemap"] = {"found": False}
        issues.append({
            "issue": "XML sitemap not found at /sitemap.xml",
            "category": "Crawlability & Indexation",
            "severity": "High",
            "confidence": "High",
            "impact": -10,
            "recommendation": "Create and submit an XML sitemap to help search engines discover your pages."
        })
        crawl_score -= 10

    # Canonical tag
    canonical = soup.find("link", {"rel": "canonical"})
    crawl["canonical"] = canonical["href"] if canonical else None
    if not canonical:
        issues.append({
            "issue": "No canonical tag found on the page",
            "category": "Crawlability & Indexation",
            "severity": "Medium",
            "confidence": "High",
            "impact": -5,
            "recommendation": "Add a self-referencing canonical tag to prevent duplicate content issues."
        })
        crawl_score -= 5

    # noindex check
    robots_meta = soup.find("meta", {"name": re.compile("robots", re.I)})
    noindex = False
    if robots_meta and robots_meta.get("content"):
        if "noindex" in robots_meta["content"].lower():
            noindex = True
            issues.append({
                "issue": "Page has noindex meta tag — search engines will not index this page",
                "category": "Crawlability & Indexation",
                "severity": "Critical",
                "confidence": "High",
                "impact": -30,
                "recommendation": "Remove the noindex directive unless intentional."
            })
            crawl_score -= 30
    crawl["noindex"] = noindex
    crawl["score"] = max(0, crawl_score)
    audit["crawlability"] = crawl

    # ══════════════════════════════════════════════════════════════
    # 2. TECHNICAL FOUNDATIONS  (weight 25)
    # ══════════════════════════════════════════════════════════════
    tech = {}
    tech_score = 100

    # HTTPS
    tech["https"] = parsed.scheme == "https"
    if not tech["https"]:
        issues.append({
            "issue": "Site is served over HTTP, not HTTPS",
            "category": "Technical Foundations",
            "severity": "Critical",
            "confidence": "High",
            "impact": -25,
            "recommendation": "Install an SSL certificate and redirect all HTTP traffic to HTTPS."
        })
        tech_score -= 25

    # HTTP → HTTPS redirect
    if tech["https"]:
        http_url = url.replace("https://", "http://", 1)
        http_resp = safe_get(http_url, allow_redirects=False)
        if http_resp and http_resp.status_code in (301, 302):
            tech["http_redirect"] = True
        else:
            tech["http_redirect"] = False
            issues.append({
                "issue": "HTTP version does not redirect to HTTPS",
                "category": "Technical Foundations",
                "severity": "High",
                "confidence": "Medium",
                "impact": -8,
                "recommendation": "Set up a 301 redirect from HTTP to HTTPS for all pages."
            })
            tech_score -= 8

    # Page load time
    tech["load_time_s"] = load_time
    if load_time > 3.0:
        issues.append({
            "issue": f"Slow server response time: {load_time}s (target < 2s)",
            "category": "Technical Foundations",
            "severity": "High",
            "confidence": "High",
            "impact": -10,
            "recommendation": "Optimise server response time, enable caching, and consider a CDN."
        })
        tech_score -= 10
    elif load_time > 2.0:
        issues.append({
            "issue": f"Moderate server response time: {load_time}s (target < 2s)",
            "category": "Technical Foundations",
            "severity": "Medium",
            "confidence": "High",
            "impact": -5,
            "recommendation": "Investigate server performance and caching opportunities."
        })
        tech_score -= 5

    # Viewport meta (mobile-friendliness)
    viewport = soup.find("meta", {"name": re.compile("viewport", re.I)})
    tech["viewport"] = bool(viewport)
    if not viewport:
        issues.append({
            "issue": "Missing viewport meta tag — site may not be mobile-friendly",
            "category": "Technical Foundations",
            "severity": "High",
            "confidence": "High",
            "impact": -10,
            "recommendation": "Add <meta name='viewport' content='width=device-width, initial-scale=1'>."
        })
        tech_score -= 10

    # Response code
    tech["status_code"] = resp.status_code
    tech["final_url"] = resp.url

    # Content size
    tech["page_size_kb"] = round(len(resp.content) / 1024, 1)

    tech["score"] = max(0, tech_score)
    audit["technical"] = tech

    # ══════════════════════════════════════════════════════════════
    # 3. ON-PAGE OPTIMISATION  (weight 20)
    # ══════════════════════════════════════════════════════════════
    onpage = {}
    onpage_score = 100

    # Title tag
    title_tag = soup.find("title")
    title_text = title_tag.get_text(strip=True) if title_tag else ""
    title_len = len(title_text)
    onpage["title"] = {"text": title_text, "length": title_len}
    if not title_text:
        issues.append({
            "issue": "Missing title tag",
            "category": "On-Page Optimization",
            "severity": "Critical",
            "confidence": "High",
            "impact": -20,
            "recommendation": "Add a descriptive, keyword-rich title tag (50–60 characters)."
        })
        onpage_score -= 20
    elif title_len < 30:
        issues.append({
            "issue": f"Title tag too short ({title_len} chars) — may not be descriptive enough",
            "category": "On-Page Optimization",
            "severity": "Medium",
            "confidence": "High",
            "impact": -5,
            "recommendation": "Expand the title to 50–60 characters with a clear keyword focus."
        })
        onpage_score -= 5
    elif title_len > 65:
        issues.append({
            "issue": f"Title tag too long ({title_len} chars) — may be truncated in SERPs",
            "category": "On-Page Optimization",
            "severity": "Low",
            "confidence": "High",
            "impact": -3,
            "recommendation": "Trim the title to 50–60 characters to avoid truncation."
        })
        onpage_score -= 3

    # Meta description
    meta_desc = soup.find("meta", {"name": re.compile("description", re.I)})
    desc_text = meta_desc["content"].strip() if meta_desc and meta_desc.get("content") else ""
    desc_len = len(desc_text)
    onpage["meta_description"] = {"text": desc_text, "length": desc_len}
    if not desc_text:
        issues.append({
            "issue": "Missing meta description",
            "category": "On-Page Optimization",
            "severity": "Medium",
            "confidence": "High",
            "impact": -8,
            "recommendation": "Write a compelling meta description (150–160 characters) to improve CTR."
        })
        onpage_score -= 8
    elif desc_len < 70:
        issues.append({
            "issue": f"Meta description too short ({desc_len} chars)",
            "category": "On-Page Optimization",
            "severity": "Low",
            "confidence": "High",
            "impact": -3,
            "recommendation": "Expand the meta description to 150–160 characters."
        })
        onpage_score -= 3
    elif desc_len > 165:
        issues.append({
            "issue": f"Meta description too long ({desc_len} chars) — will be truncated",
            "category": "On-Page Optimization",
            "severity": "Low",
            "confidence": "High",
            "impact": -2,
            "recommendation": "Shorten to 150–160 characters."
        })
        onpage_score -= 2

    # Headings
    h1s = soup.find_all("h1")
    h2s = soup.find_all("h2")
    h3s = soup.find_all("h3")
    onpage["headings"] = {
        "h1_count": len(h1s),
        "h1_texts": [h.get_text(strip=True)[:80] for h in h1s[:3]],
        "h2_count": len(h2s),
        "h3_count": len(h3s),
    }
    if len(h1s) == 0:
        issues.append({
            "issue": "No H1 tag found on the page",
            "category": "On-Page Optimization",
            "severity": "High",
            "confidence": "High",
            "impact": -10,
            "recommendation": "Add exactly one H1 tag that clearly describes the page's primary topic."
        })
        onpage_score -= 10
    elif len(h1s) > 1:
        issues.append({
            "issue": f"Multiple H1 tags found ({len(h1s)}) — dilutes topical focus",
            "category": "On-Page Optimization",
            "severity": "Medium",
            "confidence": "High",
            "impact": -5,
            "recommendation": "Consolidate to a single H1 tag per page."
        })
        onpage_score -= 5

    # Images alt text
    images = soup.find_all("img")
    imgs_missing_alt = [img for img in images if not img.get("alt")]
    onpage["images"] = {
        "total": len(images),
        "missing_alt": len(imgs_missing_alt),
        "alt_coverage_pct": round((1 - len(imgs_missing_alt) / len(images)) * 100, 1) if images else 100,
    }
    if imgs_missing_alt:
        pct_missing = round(len(imgs_missing_alt) / len(images) * 100)
        severity = "High" if pct_missing > 50 else "Medium" if pct_missing > 20 else "Low"
        impact = -10 if pct_missing > 50 else -5 if pct_missing > 20 else -3
        issues.append({
            "issue": f"{len(imgs_missing_alt)} of {len(images)} images missing alt text ({pct_missing}%)",
            "category": "On-Page Optimization",
            "severity": severity,
            "confidence": "High",
            "impact": impact,
            "recommendation": "Add descriptive alt text to all images for accessibility and SEO."
        })
        onpage_score += impact

    # Internal / external links
    all_links = soup.find_all("a", href=True)
    internal_links = [a for a in all_links if urlparse(a["href"]).netloc in ("", parsed.netloc)]
    external_links = [a for a in all_links if urlparse(a["href"]).netloc not in ("", parsed.netloc) and urlparse(a["href"]).netloc]
    onpage["links"] = {
        "internal": len(internal_links),
        "external": len(external_links),
        "total": len(all_links),
    }

    onpage["score"] = max(0, onpage_score)
    audit["onpage"] = onpage

    # ══════════════════════════════════════════════════════════════
    # 4. CONTENT QUALITY & E-E-A-T  (weight 15)
    # ══════════════════════════════════════════════════════════════
    content = {}
    content_score = 100

    # Word count
    body_text = soup.get_text(separator=" ", strip=True)
    word_count = len(body_text.split())
    content["word_count"] = word_count
    if word_count < 300:
        issues.append({
            "issue": f"Very thin content ({word_count} words) — may be considered low-quality",
            "category": "Content Quality & E-E-A-T",
            "severity": "High",
            "confidence": "Medium",
            "impact": -15,
            "recommendation": "Expand the content to at least 600–800 words with relevant, substantive information."
        })
        content_score -= 15
    elif word_count < 600:
        issues.append({
            "issue": f"Thin content ({word_count} words) — could benefit from more depth",
            "category": "Content Quality & E-E-A-T",
            "severity": "Medium",
            "confidence": "Medium",
            "impact": -8,
            "recommendation": "Aim for 800+ words with comprehensive coverage of the topic."
        })
        content_score -= 8

    # Structured data / Schema
    schema_scripts = soup.find_all("script", {"type": "application/ld+json"})
    content["schema_count"] = len(schema_scripts)
    if not schema_scripts:
        issues.append({
            "issue": "No structured data (schema.org JSON-LD) found",
            "category": "Content Quality & E-E-A-T",
            "severity": "Medium",
            "confidence": "High",
            "impact": -8,
            "recommendation": "Add JSON-LD structured data (Organization, WebPage, Article, etc.) to enhance SERP rich results."
        })
        content_score -= 8

    # Open Graph / Social meta
    og_title = soup.find("meta", {"property": "og:title"})
    og_desc = soup.find("meta", {"property": "og:description"})
    twitter_card = soup.find("meta", {"name": "twitter:card"})
    content["og_tags"] = {"og_title": bool(og_title), "og_description": bool(og_desc), "twitter_card": bool(twitter_card)}
    if not og_title or not og_desc:
        issues.append({
            "issue": "Missing Open Graph meta tags (og:title, og:description)",
            "category": "Content Quality & E-E-A-T",
            "severity": "Low",
            "confidence": "High",
            "impact": -3,
            "recommendation": "Add Open Graph and Twitter Card meta tags for better social sharing."
        })
        content_score -= 3

    content["score"] = max(0, content_score)
    audit["content"] = content

    # ══════════════════════════════════════════════════════════════
    # 5. AUTHORITY & TRUST SIGNALS  (weight 10)
    # ══════════════════════════════════════════════════════════════
    authority = {}
    auth_score = 100

    # Privacy policy
    page_text_lower = resp.text.lower()
    has_privacy = "privacy" in page_text_lower
    has_contact = "contact" in page_text_lower
    authority["privacy_mention"] = has_privacy
    authority["contact_mention"] = has_contact

    if not has_privacy:
        issues.append({
            "issue": "No privacy policy link detected on the page",
            "category": "Authority & Trust Signals",
            "severity": "Medium",
            "confidence": "Medium",
            "impact": -10,
            "recommendation": "Add a privacy policy link — it's required for GDPR/CCPA and builds E-E-A-T trust signals."
        })
        auth_score -= 10

    if not has_contact:
        issues.append({
            "issue": "No contact information detected on the page",
            "category": "Authority & Trust Signals",
            "severity": "Low",
            "confidence": "Medium",
            "impact": -5,
            "recommendation": "Add clear contact information or a link to a contact page."
        })
        auth_score -= 5

    authority["https_secure"] = tech["https"]

    authority["score"] = max(0, auth_score)
    audit["authority"] = authority

    # ══════════════════════════════════════════════════════════════
    # SEO HEALTH INDEX  (weighted composite 0–100)
    # ══════════════════════════════════════════════════════════════
    weights = {"crawlability": 30, "technical": 25, "onpage": 20, "content": 15, "authority": 10}
    weighted_total = (
        crawl["score"] * 0.30 +
        tech["score"] * 0.25 +
        onpage["score"] * 0.20 +
        content["score"] * 0.15 +
        authority["score"] * 0.10
    )
    overall = round(weighted_total)

    if overall >= 90:
        band = "Excellent"
    elif overall >= 75:
        band = "Good"
    elif overall >= 60:
        band = "Fair"
    elif overall >= 40:
        band = "Poor"
    else:
        band = "Critical"

    audit["score"] = {
        "overall": overall,
        "band": band,
        "breakdown": {
            "crawlability": {"score": crawl["score"], "weight": 30, "weighted": round(crawl["score"] * 0.30, 1)},
            "technical": {"score": tech["score"], "weight": 25, "weighted": round(tech["score"] * 0.25, 1)},
            "onpage": {"score": onpage["score"], "weight": 20, "weighted": round(onpage["score"] * 0.20, 1)},
            "content": {"score": content["score"], "weight": 15, "weighted": round(content["score"] * 0.15, 1)},
            "authority": {"score": authority["score"], "weight": 10, "weighted": round(authority["score"] * 0.10, 1)},
        }
    }

    # Sort issues by severity
    sev_order = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}
    issues.sort(key=lambda x: sev_order.get(x["severity"], 4))
    audit["issues"] = issues

    # Summary counts
    audit["summary"] = {
        "total_issues": len(issues),
        "critical": len([i for i in issues if i["severity"] == "Critical"]),
        "high": len([i for i in issues if i["severity"] == "High"]),
        "medium": len([i for i in issues if i["severity"] == "Medium"]),
        "low": len([i for i in issues if i["severity"] == "Low"]),
        "audit_time_s": round(time.time() - start, 2),
    }

    return audit
