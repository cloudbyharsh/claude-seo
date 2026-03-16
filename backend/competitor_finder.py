"""
Competitor Finder — no API required.
Uses DuckDuckGo HTML search to find competitors based on the target site's
title, description, and domain niche.
"""

import requests
import re
import time
from urllib.parse import urlparse, quote_plus
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/120.0.0.0 Safari/537.36"
}
TIMEOUT = 12


def _get_site_context(url: str) -> dict:
    """Extract title, description, and keywords from the main site."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
        soup = BeautifulSoup(resp.text, "html.parser")

        title = soup.find("title")
        title_text = title.get_text(strip=True) if title else ""

        desc = soup.find("meta", {"name": re.compile("description", re.I)})
        desc_text = desc["content"].strip() if desc and desc.get("content") else ""

        og_type = soup.find("meta", {"property": "og:type"})
        site_type = og_type["content"] if og_type and og_type.get("content") else ""

        return {
            "title": title_text[:80],
            "description": desc_text[:200],
            "site_type": site_type,
        }
    except Exception:
        return {"title": "", "description": "", "site_type": ""}


def _search_duckduckgo(query: str, max_results: int = 8) -> list:
    """Scrape DuckDuckGo HTML search results and return URLs."""
    urls = []
    try:
        search_url = f"https://html.duckduckgo.com/html/?q={quote_plus(query)}"
        resp = requests.get(search_url, headers=HEADERS, timeout=TIMEOUT)
        soup = BeautifulSoup(resp.text, "html.parser")

        # DuckDuckGo HTML result links
        for a in soup.select("a.result__url"):
            href = a.get("href", "").strip()
            if href and href.startswith("http"):
                urls.append(href)
            if len(urls) >= max_results:
                break

        # Fallback: grab result snippet URLs
        if not urls:
            for a in soup.select("a[href*='//']"):
                href = a.get("href", "")
                if "duckduckgo.com" not in href and href.startswith("http"):
                    urls.append(href)
                if len(urls) >= max_results:
                    break
    except Exception:
        pass
    return urls


def _clean_url(url: str) -> str:
    """Normalise a URL to scheme + netloc."""
    parsed = urlparse(url)
    if parsed.scheme and parsed.netloc:
        return f"{parsed.scheme}://{parsed.netloc}"
    return url


def _dedupe_and_filter(urls: list, exclude_domain: str) -> list:
    """Remove duplicates, the main site, and known non-competitor domains."""
    blocklist = {
        "google", "facebook", "twitter", "linkedin", "youtube",
        "wikipedia", "amazon", "yelp", "trustpilot", "tripadvisor",
        "instagram", "reddit", "pinterest", "apple", "microsoft",
    }
    seen = set()
    result = []
    for url in urls:
        domain = urlparse(url).netloc.lower().replace("www.", "")
        if domain == exclude_domain:
            continue
        if any(b in domain for b in blocklist):
            continue
        if domain in seen:
            continue
        seen.add(domain)
        result.append(_clean_url(url))
    return result


def find_competitors(url: str, max_competitors: int = 4) -> list:
    """
    Auto-discover competitors for a given URL.
    Returns a list of competitor base URLs.
    """
    parsed = urlparse(url if url.startswith("http") else "https://" + url)
    main_domain = parsed.netloc.lower().replace("www.", "")

    print(f"   🔎 Analysing site to find competitors...")
    ctx = _get_site_context(url)

    # Build smart search queries from site context
    queries = []

    if ctx["title"]:
        # Strip domain-like parts from title for cleaner query
        clean_title = re.sub(r"\b\w+\.(com|net|org|io)\b", "", ctx["title"], flags=re.I).strip(" |-_")
        queries.append(f'sites like {main_domain} "{clean_title}" competitors')
        queries.append(f'top competitors to {main_domain}')
        queries.append(f'alternatives to {main_domain}')

    if not queries:
        queries = [
            f"competitors to {main_domain}",
            f"sites similar to {main_domain}",
        ]

    all_urls = []
    for q in queries[:2]:  # Use top 2 queries to avoid rate limiting
        print(f"   🌐 Searching: {q[:60]}...")
        results = _search_duckduckgo(q, max_results=10)
        all_urls.extend(results)
        time.sleep(1.5)  # Be polite

    competitors = _dedupe_and_filter(all_urls, main_domain)
    competitors = competitors[:max_competitors]

    if not competitors:
        print("   ⚠️  Could not auto-find competitors. Using fallback search...")
        fallback = _search_duckduckgo(f"best {main_domain} alternatives 2024", 10)
        competitors = _dedupe_and_filter(fallback, main_domain)[:max_competitors]

    return competitors
