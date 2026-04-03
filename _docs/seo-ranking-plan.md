# SEO Ranking Plan — organicallyseo.com
**Last Updated:** April 3, 2026

---

## Baseline (GSC — Last 3 Months)
- Total clicks: 35
- Total impressions: 34,600
- Average CTR: 0.1%
- Average position: 40.4
- Indexed pages: 79
- External backlinks: 6

---

## Core Problem
The site has content volume but near-zero authority (6 backlinks). Google won't rank content-heavy pages from low-authority domains against established competitors. The secondary problem is keyword cannibalization in the startup cluster, which dilutes whatever signal does exist.

---

## Stage 1 — Stop the Bleeding (Immediate)

### 1a. Publish the SEO Checklist
- `seo-phase1-checklist.html` has `published: false` — it's done, ship it.

### 1b. Consolidate the Startup Cluster
7 pages competing for "SEO for startups" keywords. Consolidate the two most redundant:
- **Redirect** `seo-tips-for-startups.html` → `/seo-for-startups/`
- **Redirect** `seo-for-tech-startups.html` → `/seo-for-startups/` (or `/seo-for-saas-startups/`)
- **Keep** (distinct enough): `seo-for-startups.html`, `seo-for-saas-startups.html`, `diy-seo-for-startups.html`, `local-seo-for-startups.html`, `seo-services-for-startups.html`

### 1c. Fix Stale/Draft Content
- `chat-gpt-basics-everything-you-need-to-know.html` — visible `[DRAFT]` warning in live HTML. Fix or unpublish.
- `sem.html` — title/content references 2022. Update to 2026.
- `dental-seo-keywords.html` — title says "Best Keyword Research Services" (wrong). Fix to match content.

---

## Stage 2 — Win the Easy Battles First

### Near-Page-1 Opportunities (highest ROI right now)
Two pages are near page 1 but getting almost no clicks:
| Page | Position | Impressions | Issue |
|---|---|---|---|
| `/webflow-vs-figma/` | 6.8 | 4,451 | Title/meta not compelling enough for CTR |
| `/technical-co-founder-equity/` | 6.2 | 3,586 | Same |

**Action:** Optimize both pages' title tags and meta descriptions for click-through rate. Getting from position 7 → 4 on these two alone would outperform any new content written this quarter.

---

## Stage 3 — Build Local Authority

Core keywords ("organic SEO services," "organic SEO company") rank at positions 77–79 nationally. Can't win that fight yet. Win locally first.

**Actions:**
- Create `/pittsburgh-seo/` page — targeting the home market (Houston and San Jose pages exist; Pittsburgh does not)
- Get listed: Pittsburgh Chamber of Commerce, local business directories, BNI, local citations
- Every Pittsburgh-specific backlink is worth 10x a generic one at current authority

---

## Stage 4 — Link-Worthy Assets

Fastest path to links for an SEO site:
- **The SEO checklist** (once published) is a natural link target for marketing blogs
- **Original case studies with real numbers** — "I ranked a Pittsburgh plumber from 0 to #1 in 90 days — exact steps"
- **Free tools/templates** — a downloadable SEO audit template, etc.

---

## Stage 5 — Own One Niche Vertically

Currently 20+ industry pages with surface-level coverage. Pick 1–2 niches and go deep:
- **Plastic surgery** — high-value client, good impression volume
- **Contractors** — dedicated funnel page already exists, strong content foundation

For the chosen niches: more internal links, case studies, earn links from industry publications/directories.

---

## Content Architecture Decisions

| Page | Decision | Reason |
|---|---|---|
| `seo-for-startups.html` | **Pillar** | Keep and strengthen |
| `seo-tips-for-startups.html` | **Redirect → /seo-for-startups/** | Pure overlap, no unique angle |
| `seo-for-tech-startups.html` | **Redirect → /seo-for-startups/** | Overlaps too much with pillar |
| `seo-for-saas-startups.html` | **Keep** | Distinct keyword + audience |
| `diy-seo-for-startups.html` | **Keep** | Distinct intent (no-budget) |
| `local-seo-for-startups.html` | **Keep** | Distinct (local search angle) |
| `seo-services-for-startups.html` | **Keep** | Commercial intent, different from educational pages |
| `law-firm-seo.html` | **Keep** | Service page |
| `law-firm-seo-audit.html` | **Keep** | Different intent (DIY audit), cross-link to above |
| `seo-family-law.html` | **Audit** | Possibly thin — compare vs `family-law-digital-marketing.html` |
| `seo-for-dentists.html` | **Keep** | Service |
| `local-seo-dentists.html` | **Keep** | Map pack specific, different intent |
| `dental-seo-keywords.html` | **Keep** | Fix title — targets different keyword |
| All other industry pages | **Keep** | Low-competition keyword targeting, worth maintaining |

---

## Metrics to Watch

After deploying Stage 1:
- Coverage > Indexed pages should increase toward 100+
- "Page with redirect" count should decrease
- "Alternate page with proper canonical" should decrease
- Monitor `/webflow-vs-figma/` and `/technical-co-founder-equity/` CTR after title optimization

After Stage 3:
- Check `/pittsburgh-seo/` for impressions within 60 days
- Monitor external backlink count (goal: 25 links within 6 months)

---

## Notes
- Site has 116 URLs in sitemap as of April 3, 2026 (rebuilt from 56)
- All canonical tags standardized to non-www + trailing slash on April 3, 2026
- `seo-phase1-checklist.html` is complete but has `published: false` — needs to be shipped
- Redirect mechanism: use meta-refresh + canonical redirect stubs (no `jekyll-redirect-from` plugin in Gemfile)
