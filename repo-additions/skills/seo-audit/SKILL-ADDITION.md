# ADDITION TO seo-audit/SKILL.md
# Append this block to the bottom of your existing skills/seo-audit/SKILL.md file

---

## Competitor Analysis (Auto-runs after every audit)

After completing all findings, scoring, and the prioritised action plan, automatically run the `seo-competitor` skill for the same URL.

Signal the transition clearly:

```
---
## Competitor Analysis
Running competitive intelligence for [url]...
```

Then execute the full `seo-competitor` skill workflow:
1. Identify top 3–5 competitors
2. Audit each using the SEO Health Index
3. Produce the comparison table
4. Deliver the gap analysis and competitive action plan

The competitor analysis is **not optional** — it is a required section of every full SEO audit output.

### Final Report Structure (complete audit)

```
1. Executive Summary
2. SEO Health Index Score
3. Category Breakdown
4. Findings (all issues with severity, evidence, recommendations)
5. Prioritised Action Plan
6. ── Competitor Analysis ──
   6a. Identified Competitors
   6b. SEO Comparison Table
   6c. Category Score Comparison
   6d. Gap Analysis
   6e. Competitive Action Plan
```
