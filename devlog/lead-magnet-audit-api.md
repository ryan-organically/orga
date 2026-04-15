# Lead Magnet: Ahrefs SEO Audit API

## What
API endpoint (`POST /api/audit/`) that generates a branded SEO audit report and emails it to a lead via Resend. Built for the Meta ads contractor funnel — a lead fills the ad form, lands on the contractor funnel page to book a call, and gets a personalized SEO report delivered to their inbox.

## Architecture

```
POST /api/audit/  (JSON body with lead data)
  │
  ├─ Validate: first_name, business_name, email, website (required)
  ├─ Extract clean domain from website URL
  │
  ├─ 5 parallel Ahrefs API calls (Promise.allSettled):
  │   ├─ /v3/site-explorer/domain-rating       → DR score (0-100)
  │   ├─ /v3/site-explorer/metrics             → organic traffic, traffic value, keyword count
  │   ├─ /v3/site-explorer/organic-keywords    → top 50 keywords by traffic
  │   ├─ /v3/site-explorer/backlinks-stats     → referring domains, total backlinks
  │   └─ /v3/site-explorer/organic-competitors → top 5 organic competitors
  │
  ├─ Assemble AuditReportData (keyword position breakdown, biggest opportunity detection)
  ├─ Generate self-contained HTML report (inline CSS, email-client compatible)
  └─ Send via Resend (branded email body + HTML file attachment)
```

## Files

| File | Purpose |
|------|---------|
| `src/app/api/audit/route.ts` | POST endpoint — orchestrates the full flow |
| `src/lib/ahrefs.ts` | Server-side Ahrefs API client, 5 fetch functions + orchestrator |
| `src/lib/resend.ts` | Resend email client, sends branded email with HTML attachment |
| `src/lib/utils/domain.ts` | URL → clean domain extraction |
| `src/templates/audit-report.ts` | HTML report generator — scores, keywords, backlinks, competitor, insights, CTA |
| `src/types/ahrefs.ts` | TypeScript interfaces for all data shapes |
| `.env.local` | AHREFS_API_KEY, RESEND_API_KEY (gitignored) |

## Key Decisions

**Promise.allSettled over Promise.all** — If one Ahrefs endpoint fails (rate limit, timeout), the report still renders with available data. Each section gracefully degrades independently.

**24-hour fetch cache** — Ahrefs charges API units per request. Using `next.revalidate: 86400` so repeat queries for the same domain hit cache. Prevents burning units on page refreshes or duplicate leads.

**Self-contained HTML** — The report uses only inline CSS with no external dependencies. It renders correctly as an email attachment opened in any browser. No images to host, no CDN to maintain.

**Dynamic interpretation** — The "What This Means" section generates plain-English insights based on score thresholds. A DR of 12 gets different messaging than a DR of 45. The "biggest opportunity" card identifies the highest-volume keyword where they rank outside the top 10 — the emotional hook.

**No-data handling** — Many small contractor sites have zero Ahrefs data. Instead of showing an empty report, it says "Your site is brand new to search engines — massive untapped potential" and still pushes the Calendly CTA.

## Meta Ads Integration

The Meta lead form should pass these fields (trade/city/state optional):
```
first_name, business_name, email, website, trade, city, state
```

Can be triggered via:
- Zapier: Meta Lead Ad → Webhook → POST to /api/audit/
- Direct webhook from Meta to the deployed endpoint
- Manual curl/Postman for now

## Usage

```bash
curl -X POST http://localhost:3000/api/audit/ \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Mike",
    "business_name": "Mike Roofing",
    "email": "mike@example.com",
    "website": "mikeroofing.com",
    "trade": "roofing",
    "city": "Pittsburgh",
    "state": "PA"
  }'
```

## Future

- Supabase lead storage (table schema already designed)
- Report page at `/free-seo-audit/` for live viewing (server component)
- Meta webhook direct integration
- Email follow-up sequences
- CRM dashboard for lead tracking
