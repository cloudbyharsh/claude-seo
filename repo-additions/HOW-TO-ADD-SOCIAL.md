# How to Add Social Listening to Your claude-seo Installation

This adds a completely separate `/social` skill namespace alongside your existing SEO skills.
**Zero existing files are modified.**

---

## What You're Installing

| Command | What it does |
|---------|-------------|
| `/social listen <brand>` | Scan Reddit, YouTube, Yelp, News for brand mentions |
| `/social sentiment <brand>` | Aspect-based sentiment breakdown by business type |
| `/social competitors <brand>` | Side-by-side competitive social comparison |
| `/social alerts <brand>` | Spike detection rules + immediate crisis scan |
| `/social report <brand>` | Full weekly brand health report |
| `/social respond "<review>"` | Draft professional response to any review |

Works for any business: hotels, SaaS, restaurants, retail, agencies, local businesses, and more.

---

## Installation (CMD / Windows)

Open Command Prompt and run these commands one by one:

```cmd
:: Step 1 — Navigate to your claude-seo repo folder
cd path\to\your\claude-seo

:: Step 2 — Copy skill folders to ~/.claude/skills/
xcopy /E /I repo-additions\skills\social "%USERPROFILE%\.claude\skills\social"
xcopy /E /I repo-additions\skills\social-listen "%USERPROFILE%\.claude\skills\social-listen"
xcopy /E /I repo-additions\skills\social-sentiment "%USERPROFILE%\.claude\skills\social-sentiment"
xcopy /E /I repo-additions\skills\social-competitors "%USERPROFILE%\.claude\skills\social-competitors"
xcopy /E /I repo-additions\skills\social-alerts "%USERPROFILE%\.claude\skills\social-alerts"
xcopy /E /I repo-additions\skills\social-report "%USERPROFILE%\.claude\skills\social-report"
xcopy /E /I repo-additions\skills\social-respond "%USERPROFILE%\.claude\skills\social-respond"

:: Step 3 — Copy agent files to ~/.claude/agents/
copy repo-additions\agents\social-listener.md "%USERPROFILE%\.claude\agents\social-listener.md"
copy repo-additions\agents\social-analyst.md "%USERPROFILE%\.claude\agents\social-analyst.md"
copy repo-additions\agents\social-reporter.md "%USERPROFILE%\.claude\agents\social-reporter.md"
copy repo-additions\agents\social-responder.md "%USERPROFILE%\.claude\agents\social-responder.md"
```

---

## Installation (bash / macOS / Linux)

```bash
# Step 1 — Navigate to your claude-seo repo folder
cd /path/to/your/claude-seo

# Step 2 — Copy skill folders to ~/.claude/skills/
cp -r repo-additions/skills/social ~/.claude/skills/social
cp -r repo-additions/skills/social-listen ~/.claude/skills/social-listen
cp -r repo-additions/skills/social-sentiment ~/.claude/skills/social-sentiment
cp -r repo-additions/skills/social-competitors ~/.claude/skills/social-competitors
cp -r repo-additions/skills/social-alerts ~/.claude/skills/social-alerts
cp -r repo-additions/skills/social-report ~/.claude/skills/social-report
cp -r repo-additions/skills/social-respond ~/.claude/skills/social-respond

# Step 3 — Copy agent files to ~/.claude/agents/
cp repo-additions/agents/social-listener.md ~/.claude/agents/social-listener.md
cp repo-additions/agents/social-analyst.md ~/.claude/agents/social-analyst.md
cp repo-additions/agents/social-reporter.md ~/.claude/agents/social-reporter.md
cp repo-additions/agents/social-responder.md ~/.claude/agents/social-responder.md
```

---

## Verify Installation

After running the commands, check these paths exist:

```
~/.claude/skills/social/SKILL.md
~/.claude/skills/social-listen/SKILL.md
~/.claude/skills/social-sentiment/SKILL.md
~/.claude/skills/social-competitors/SKILL.md
~/.claude/skills/social-alerts/SKILL.md
~/.claude/skills/social-report/SKILL.md
~/.claude/skills/social-respond/SKILL.md
~/.claude/agents/social-listener.md
~/.claude/agents/social-analyst.md
~/.claude/agents/social-reporter.md
~/.claude/agents/social-responder.md
```

---

## Test It

Open Claude Code and run:

```
/social listen "your brand name"
```

Then try:

```
/social report "your brand name"
```

---

## Confirm SEO Tool is Untouched

Your existing SEO skill files are at `~/.claude/skills/seo*/` — none of those paths are touched by this install.

To verify:
```cmd
dir "%USERPROFILE%\.claude\skills\"
```
You should see both `seo/`, `seo-audit/`, etc. AND the new `social/`, `social-listen/`, etc. — fully separate.

---

## Platform Notes

### Free Sources (work out of the box)
- Reddit, YouTube, Yelp (public search), Google News, Web/forums, Trustpilot, G2, Capterra

### Requires API credentials (stubbed — activate by adding keys)
| Platform | What you need |
|----------|--------------|
| Google Reviews | Google Places API key |
| TripAdvisor | Partner API access |
| Instagram | Meta app with Graph API approval |
| X / Twitter | Paid API tier |
| Booking.com | Partner/affiliate access |

The skill runs fully on free sources without any API keys. Paid platform stubs are included and activate when credentials are provided.

---

## Done.
