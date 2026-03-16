# How to Add Competitor Analysis to Your claude-seo Repo

## Files to add / modify

### 1. New agent — copy this file:
FROM: repo-additions/agents/seo-competitor.md
TO:   agents/seo-competitor.md   (in your claude-seo repo)

### 2. New skill — copy this folder:
FROM: repo-additions/skills/seo-competitor/
TO:   skills/seo-competitor/     (in your claude-seo repo)

### 3. Update existing audit skill:
OPEN: skills/seo-audit/SKILL.md  (in your claude-seo repo)
ADD:  Paste the contents of repo-additions/skills/seo-audit/SKILL-ADDITION.md
      at the very bottom of that file.

## Done. Test with:
/seo-audit https://yourwebsite.com

The audit will now automatically run competitor analysis and append
the comparison table at the end of every report.
