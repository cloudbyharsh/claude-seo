"""
Claude SEO Auditor — CLI tool
Usage:  python audit.py https://yourwebsite.com
Output: PDF saved in reports/ named after the property, opened automatically
"""

import sys
import os
import re

# Make sure backend modules are importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))
os.chdir(os.path.join(os.path.dirname(__file__), "backend"))

from seo_runner import run_audit
from pdf_generator import generate_pdf


def extract_property_name(result: dict) -> str:
    """
    Extract a clean property/hotel name from the audit result.
    Uses the page title, falling back to the domain name.
    """
    # Try title tag first
    title = result.get("onpage", {}).get("title", {}).get("text", "")
    if title:
        # Take the first meaningful segment before | - : —
        parts = re.split(r"[|\-:—–]", title)
        name = parts[0].strip()
        if len(name) > 3:
            return name

    # Fall back to domain name, cleaned up
    from urllib.parse import urlparse
    domain = urlparse(result.get("url", "")).netloc
    domain = domain.replace("www.", "").split(".")[0]
    return domain.replace("-", " ").replace("_", " ").title()


def safe_filename(name: str) -> str:
    """Convert a property name to a safe filename."""
    name = re.sub(r"[^\w\s-]", "", name)
    name = re.sub(r"\s+", "-", name.strip())
    return name.lower()


def main():
    if len(sys.argv) < 2:
        print("Usage: python audit.py https://yourwebsite.com")
        sys.exit(1)

    url = sys.argv[1]
    if not url.startswith("http"):
        url = "https://" + url

    print(f"\n🔍 Auditing: {url}")
    print("   Please wait...\n")

    result = run_audit(url)

    if "error" in result:
        print(f"❌ Error: {result['error']}")
        sys.exit(1)

    score         = result["score"]
    summary       = result["summary"]
    property_name = extract_property_name(result)

    print(f"🏨 Property      : {property_name}")
    print(f"✅ Audit complete!")
    print(f"   SEO Health Score : {score['overall']}/100 ({score['band']})")
    print(f"   Issues found     : {summary['total_issues']} "
          f"({summary['critical']} critical, {summary['high']} high, "
          f"{summary['medium']} medium, {summary['low']} low)")
    print(f"   Audit time       : {summary['audit_time_s']}s\n")

    # Top 3 issues
    issues = result.get("issues", [])
    if issues:
        print("   Top issues:")
        for iss in issues[:3]:
            print(f"   [{iss['severity']}] {iss['issue'][:70]}")
    print()

    # Generate PDF with property name
    print("📄 Generating PDF report...")
    filename_base = safe_filename(property_name)
    pdf_path = generate_pdf(url, result, filename_override=filename_base)
    abs_path = os.path.abspath(pdf_path)
    print(f"   Property : {property_name}")
    print(f"   Saved to : {abs_path}\n")

    # Auto-open the PDF
    try:
        os.startfile(abs_path)
        print("📂 PDF opened automatically.")
    except Exception:
        print(f"📂 Open manually: {abs_path}")

    print()


if __name__ == "__main__":
    main()
