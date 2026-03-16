# How to Install the /full-report Command

`/full-report` is a single command that runs every analysis at once:
SEO audit + SEO competitors + social listening + social sentiment + social competitors + brand health report — all in parallel — merged into one unified report with PDF export.

**Zero existing files are modified.**

---

## What You Get

| Module | What it does |
|--------|-------------|
| SEO Health | Full site audit with Health Score 0–100 |
| SEO Competitors | Top 3–5 competitor audit + gap analysis |
| Social Listening | Mention scan across Reddit, Yelp, YouTube, News |
| Social Sentiment | Aspect-by-aspect sentiment breakdown |
| Social Competitors | Side-by-side social intelligence vs competitors |
| Brand Health Report | Weekly summary with themes, alerts, actions |
| Unified Output | Executive Dashboard + Top 10 Priority Actions + PDF |

**One command. Everything.**

---

## Usage

```
/full-report https://yourwebsite.com
/full-report https://yourwebsite.com "Brand Name"
/full-report https://yourwebsite.com "Brand Name" vs "Competitor A" vs "Competitor B"
```

---

## Installation (CMD / Windows)

> **Prerequisite:** You must have already installed the social skills from `HOW-TO-ADD-SOCIAL.md` AND the seo-report command. If not, do those first.

Open Command Prompt, navigate to your repo folder, then run:

```cmd
:: Step 1 — Navigate to your repo
cd path\to\your\claude-seo

:: Step 2 — Install the full-report skill
xcopy /E /I repo-additions\skills\full-report "%USERPROFILE%\.claude\skills\full-report" /Y

:: Step 3 — Install the full-report command
copy repo-additions\.claude\commands\full-report.md "%USERPROFILE%\.claude\commands\full-report.md"
```

That's it. Two commands.

---

## Installation (bash / macOS / Linux)

```bash
# Step 1 — Navigate to your repo
cd /path/to/your/claude-seo

# Step 2 — Install the full-report skill
cp -r repo-additions/skills/full-report ~/.claude/skills/full-report

# Step 3 — Install the full-report command
cp repo-additions/.claude/commands/full-report.md ~/.claude/commands/full-report.md
```

---

## Verify Installation

Check these paths exist:

```
~/.claude/skills/full-report/SKILL.md
~/.claude/commands/full-report.md
```

---

## Test It

Open Claude Code and run:

```
/full-report https://yourwebsite.com
```

You'll see it run all modules in parallel and deliver one merged report.

---

## What the Output Includes

```
FULL BRAND & SEO INTELLIGENCE REPORT
├── Executive Dashboard          ← 5-score table + Overall Brand Health Score
├── Top 10 Priority Actions      ← Cross-module, ranked by impact
├── Section 1: SEO Health        ← Scores, issues, quick wins
├── Section 2: SEO Competitors   ← Comparison table, gaps, action plan
├── Section 3: Social Sentiment  ← Aspect breakdown with quotes
├── Section 4: Social Brand Health ← Mentions, alerts, themes
├── Section 5: Social Competitors ← Side-by-side social intelligence
└── Data & Methodology Notes     ← Sources, confidence, excluded platforms
```

Plus: **PDF saved automatically** to `backend/reports/`

---

## Already Have Social Skills Installed?

If you already installed the social skills, only Steps 2–3 above are needed. The full-report command builds on the existing skills — it does not reinstall them.

---

## Confirm Existing Tools Are Untouched

```cmd
dir "%USERPROFILE%\.claude\skills\"
dir "%USERPROFILE%\.claude\commands\"
```

You should see your existing `seo/`, `social/`, etc. skills unchanged — and the new `full-report/` added alongside them.

---

## Done.
