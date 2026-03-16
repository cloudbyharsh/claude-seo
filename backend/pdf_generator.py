"""
PDF Report Generator for SEO Audit results.
Uses reportlab to produce a clean, structured PDF.
"""

import os
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT


# ── Colour palette ────────────────────────────────────────────────────────────
DARK_BG   = colors.HexColor("#0f172a")
ACCENT    = colors.HexColor("#6366f1")
GOOD      = colors.HexColor("#22c55e")
WARN      = colors.HexColor("#f59e0b")
BAD       = colors.HexColor("#ef4444")
CRITICAL  = colors.HexColor("#7f1d1d")
LIGHT_BG  = colors.HexColor("#f1f5f9")
MID_GREY  = colors.HexColor("#94a3b8")
DARK_TEXT = colors.HexColor("#1e293b")

BAND_COLORS = {
    "Excellent": GOOD,
    "Good":      colors.HexColor("#84cc16"),
    "Fair":      WARN,
    "Poor":      BAD,
    "Critical":  CRITICAL,
}

SEV_COLORS = {
    "Critical": CRITICAL,
    "High":     BAD,
    "Medium":   WARN,
    "Low":      MID_GREY,
}


def _styles():
    base = getSampleStyleSheet()
    custom = {
        "Title": ParagraphStyle("Title", parent=base["Normal"],
            fontSize=22, textColor=DARK_TEXT, spaceAfter=4,
            fontName="Helvetica-Bold"),
        "SubTitle": ParagraphStyle("SubTitle", parent=base["Normal"],
            fontSize=11, textColor=MID_GREY, spaceAfter=12),
        "SectionHead": ParagraphStyle("SectionHead", parent=base["Normal"],
            fontSize=13, fontName="Helvetica-Bold", textColor=ACCENT,
            spaceBefore=14, spaceAfter=6),
        "Body": ParagraphStyle("Body", parent=base["Normal"],
            fontSize=9.5, textColor=DARK_TEXT, leading=14),
        "Small": ParagraphStyle("Small", parent=base["Normal"],
            fontSize=8, textColor=MID_GREY, leading=11),
        "IssueTitle": ParagraphStyle("IssueTitle", parent=base["Normal"],
            fontSize=9.5, fontName="Helvetica-Bold", textColor=DARK_TEXT, leading=13),
        "IssueBody": ParagraphStyle("IssueBody", parent=base["Normal"],
            fontSize=8.5, textColor=colors.HexColor("#475569"), leading=12),
        "Reco": ParagraphStyle("Reco", parent=base["Normal"],
            fontSize=8.5, textColor=colors.HexColor("#065f46"), leading=12),
        "ScoreHuge": ParagraphStyle("ScoreHuge", parent=base["Normal"],
            fontSize=48, fontName="Helvetica-Bold", textColor=ACCENT,
            alignment=TA_CENTER, leading=52),
        "BandLabel": ParagraphStyle("BandLabel", parent=base["Normal"],
            fontSize=14, fontName="Helvetica-Bold", alignment=TA_CENTER,
            spaceBefore=0, spaceAfter=6),
    }
    return custom


def generate_pdf(url: str, audit: dict, filename_override: str = None) -> str:
    os.makedirs("reports", exist_ok=True)
    if filename_override:
        filename = f"reports/{filename_override}-seo-audit.pdf"
    else:
        safe_name = url.replace("https://", "").replace("http://", "").replace("/", "_").replace(":", "")
        filename = f"reports/seo_audit_{safe_name}.pdf"

    doc = SimpleDocTemplate(
        filename, pagesize=A4,
        rightMargin=1.8*cm, leftMargin=1.8*cm,
        topMargin=1.8*cm, bottomMargin=1.8*cm,
    )
    s = _styles()
    story = []

    # ── Header ────────────────────────────────────────────────────────────────
    story.append(Paragraph("SEO Audit Report", s["Title"]))
    ts = audit.get("timestamp", "")[:19].replace("T", " ")
    story.append(Paragraph(f"{url}  ·  {ts} UTC", s["SubTitle"]))
    story.append(HRFlowable(width="100%", thickness=1, color=LIGHT_BG))
    story.append(Spacer(1, 10))

    # ── Overall Score ─────────────────────────────────────────────────────────
    score_data = audit.get("score", {})
    overall   = score_data.get("overall", 0)
    band      = score_data.get("band", "N/A")
    band_col  = BAND_COLORS.get(band, MID_GREY)

    story.append(Paragraph(str(overall), s["ScoreHuge"]))
    story.append(Paragraph(
        f'<font color="#{band_col.hexval()[2:]}">{band}</font>',
        s["BandLabel"]
    ))
    story.append(Spacer(1, 4))

    # ── Score breakdown table ─────────────────────────────────────────────────
    breakdown = score_data.get("breakdown", {})
    labels = {
        "crawlability": "Crawlability & Indexation",
        "technical":    "Technical Foundations",
        "onpage":       "On-Page Optimization",
        "content":      "Content Quality & E-E-A-T",
        "authority":    "Authority & Trust",
    }
    table_data = [["Category", "Score", "Weight", "Contribution"]]
    for key, label in labels.items():
        b = breakdown.get(key, {})
        table_data.append([
            label,
            f"{b.get('score', 0)}/100",
            f"{b.get('weight', 0)}%",
            f"{b.get('weighted', 0)}",
        ])
    table_data.append(["", "", "TOTAL", str(overall)])

    cat_table = Table(table_data, colWidths=[9*cm, 2.5*cm, 2.5*cm, 3*cm])
    cat_table.setStyle(TableStyle([
        ("BACKGROUND",  (0,0), (-1,0),  ACCENT),
        ("TEXTCOLOR",   (0,0), (-1,0),  colors.white),
        ("FONTNAME",    (0,0), (-1,0),  "Helvetica-Bold"),
        ("FONTSIZE",    (0,0), (-1,-1), 9),
        ("ROWBACKGROUNDS", (0,1), (-1,-2), [colors.white, LIGHT_BG]),
        ("BACKGROUND",  (0,-1), (-1,-1), DARK_BG),
        ("TEXTCOLOR",   (0,-1), (-1,-1), colors.white),
        ("FONTNAME",    (0,-1), (-1,-1), "Helvetica-Bold"),
        ("ALIGN",       (1,0),  (-1,-1), "CENTER"),
        ("GRID",        (0,0),  (-1,-1), 0.3, colors.HexColor("#e2e8f0")),
        ("TOPPADDING",  (0,0),  (-1,-1), 5),
        ("BOTTOMPADDING",(0,0), (-1,-1), 5),
    ]))
    story.append(cat_table)
    story.append(Spacer(1, 14))

    # ── Summary ───────────────────────────────────────────────────────────────
    summary = audit.get("summary", {})
    story.append(Paragraph("Audit Summary", s["SectionHead"]))
    sum_data = [
        ["Total Issues", "Critical", "High", "Medium", "Low", "Audit Time"],
        [
            str(summary.get("total_issues", 0)),
            str(summary.get("critical", 0)),
            str(summary.get("high", 0)),
            str(summary.get("medium", 0)),
            str(summary.get("low", 0)),
            f"{summary.get('audit_time_s', 0)}s",
        ]
    ]
    sum_table = Table(sum_data, colWidths=[2.8*cm]*6)
    sum_table.setStyle(TableStyle([
        ("BACKGROUND",   (0,0), (-1,0),  DARK_BG),
        ("TEXTCOLOR",    (0,0), (-1,0),  colors.white),
        ("FONTNAME",     (0,0), (-1,0),  "Helvetica-Bold"),
        ("BACKGROUND",   (1,1), (1,1),   CRITICAL),
        ("BACKGROUND",   (2,1), (2,1),   BAD),
        ("BACKGROUND",   (3,1), (3,1),   WARN),
        ("TEXTCOLOR",    (1,1), (3,1),   colors.white),
        ("FONTNAME",     (0,1), (-1,1),  "Helvetica-Bold"),
        ("FONTSIZE",     (0,0), (-1,-1), 9),
        ("ALIGN",        (0,0), (-1,-1), "CENTER"),
        ("GRID",         (0,0), (-1,-1), 0.3, colors.HexColor("#e2e8f0")),
        ("TOPPADDING",   (0,0), (-1,-1), 6),
        ("BOTTOMPADDING",(0,0), (-1,-1), 6),
    ]))
    story.append(sum_table)
    story.append(Spacer(1, 14))

    # ── Issues ────────────────────────────────────────────────────────────────
    issues = audit.get("issues", [])
    if issues:
        story.append(Paragraph("Findings & Recommendations", s["SectionHead"]))
        for i, issue in enumerate(issues, 1):
            sev = issue.get("severity", "Low")
            sev_col = SEV_COLORS.get(sev, MID_GREY)
            sev_hex = sev_col.hexval()[2:]

            row_data = [[
                Paragraph(
                    f'<font color="#{sev_hex}"><b>[{sev}]</b></font>  '
                    f'{issue.get("issue", "")}',
                    s["IssueTitle"]
                ),
                Paragraph(
                    f'<i>Category:</i> {issue.get("category","")}<br/>'
                    f'<i>Confidence:</i> {issue.get("confidence","")}'
                    f'  |  <i>Score impact:</i> {issue.get("impact", 0)}',
                    s["IssueBody"]
                ),
                Paragraph(
                    f'<b>Fix:</b> {issue.get("recommendation", "")}',
                    s["Reco"]
                ),
            ]]
            issue_table = Table(row_data, colWidths=[17*cm])
            bg = colors.HexColor("#fff7ed") if sev in ("Critical","High") else colors.white
            issue_table.setStyle(TableStyle([
                ("BACKGROUND",   (0,0), (-1,-1), bg),
                ("BOX",          (0,0), (-1,-1), 0.5, sev_col),
                ("LEFTPADDING",  (0,0), (-1,-1), 8),
                ("RIGHTPADDING", (0,0), (-1,-1), 8),
                ("TOPPADDING",   (0,0), (-1,-1), 6),
                ("BOTTOMPADDING",(0,0), (-1,-1), 6),
                ("ROWBACKGROUNDS",(0,0),(-1,-1),[bg]),
            ]))
            story.append(issue_table)
            story.append(Spacer(1, 5))

    # ── Technical snapshot ────────────────────────────────────────────────────
    story.append(Paragraph("Technical Snapshot", s["SectionHead"]))
    tech = audit.get("technical", {})
    crawl = audit.get("crawlability", {})
    snap_items = [
        ("HTTPS", "Yes" if tech.get("https") else "No"),
        ("HTTP→HTTPS Redirect", "Yes" if tech.get("http_redirect") else "No"),
        ("Status Code", str(tech.get("status_code", ""))),
        ("Page Load Time", f"{tech.get('load_time_s', '')}s"),
        ("Page Size", f"{tech.get('page_size_kb', '')} KB"),
        ("Mobile Viewport", "Yes" if tech.get("viewport") else "No"),
        ("robots.txt", "Found" if crawl.get("robots_txt", {}).get("found") else "Missing"),
        ("Sitemap", "Found" if crawl.get("sitemap", {}).get("found") else "Missing"),
        ("Canonical Tag", crawl.get("canonical") or "Missing"),
        ("noindex", "YES — REMOVE" if crawl.get("noindex") else "No"),
    ]
    snap_data = [["Check", "Value"]] + snap_items
    snap_table = Table(snap_data, colWidths=[8*cm, 9*cm])
    snap_table.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,0),  DARK_BG),
        ("TEXTCOLOR",     (0,0), (-1,0),  colors.white),
        ("FONTNAME",      (0,0), (-1,0),  "Helvetica-Bold"),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),  [colors.white, LIGHT_BG]),
        ("FONTSIZE",      (0,0), (-1,-1), 9),
        ("GRID",          (0,0), (-1,-1), 0.3, colors.HexColor("#e2e8f0")),
        ("TOPPADDING",    (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
        ("LEFTPADDING",   (0,0), (-1,-1), 8),
    ]))
    story.append(snap_table)
    story.append(Spacer(1, 10))

    # ── Footer ────────────────────────────────────────────────────────────────
    story.append(HRFlowable(width="100%", thickness=0.5, color=LIGHT_BG))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        f"Generated by Claude SEO Auditor  ·  {ts} UTC  ·  {url}",
        s["Small"]
    ))

    doc.build(story)
    return filename
