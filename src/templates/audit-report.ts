import type { LeadData, AuditReportData } from "@/types/ahrefs";

function fmt(n: number | undefined | null): string {
  if (n == null) return "N/A";
  return n.toLocaleString("en-US");
}

function fmtDollar(n: number | undefined | null): string {
  if (n == null) return "N/A";
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function drColor(dr: number): string {
  if (dr >= 50) return "#7ec700";
  if (dr >= 30) return "#ffb612";
  if (dr >= 10) return "#ff8c00";
  return "#ff4444";
}

function drVerdict(dr: number): string {
  if (dr >= 60) return "Strong authority — Google trusts your site.";
  if (dr >= 40) return "Solid foundation — room to grow with consistent effort.";
  if (dr >= 20) return "Growing — targeted link building would accelerate your rankings.";
  if (dr >= 5) return "Early stage — there's huge upside in building your site's authority.";
  return "Brand new to Google — the opportunity here is massive.";
}

function trafficVerdict(traffic: number): string {
  if (traffic >= 5000) return "Strong organic presence — you're already attracting significant visitors.";
  if (traffic >= 1000) return "Decent traffic — optimizing your top pages could double this quickly.";
  if (traffic >= 100) return "Getting some traction — a focused keyword strategy would accelerate growth.";
  if (traffic > 0) return "Early stage traffic — the right SEO strategy could transform these numbers.";
  return "No organic traffic yet — there's nowhere to go but up.";
}

function interpretData(lead: LeadData, data: AuditReportData): string[] {
  const points: string[] = [];
  const dr = data.domainRating?.domain_rating ?? 0;
  const traffic = data.metrics?.org_traffic ?? 0;
  const keywords = data.metrics?.org_keywords ?? 0;
  const { top3, top10 } = data.keywordPositionBreakdown;

  if (dr < 30) {
    points.push(
      `Your Domain Rating of ${dr} means Google doesn't fully trust your site yet. The good news: this is fixable with the right link building and content strategy.`
    );
  } else {
    points.push(
      `A Domain Rating of ${dr} puts you ahead of many ${lead.trade} companies. Let's leverage that authority.`
    );
  }

  if (keywords > 0 && top3 < 3) {
    points.push(
      `You're ranking for ${fmt(keywords)} keywords, but only ${top3} are in the top 3. Moving even a few from page 2 to page 1 could significantly increase your leads.`
    );
  } else if (keywords === 0) {
    points.push(
      "Your site isn't ranking for any keywords yet. A targeted content strategy would get you in front of customers actively searching for your services."
    );
  }

  if (data.biggestOpportunity) {
    const opp = data.biggestOpportunity;
    points.push(
      `"${opp.keyword}" gets ${fmt(opp.volume)} searches/month and you're sitting at position ${opp.position}. Getting to page 1 for this keyword alone could drive meaningful new business.`
    );
  }

  if (data.topCompetitor) {
    const comp = data.topCompetitor;
    points.push(
      `Your top organic competitor (${comp.domain}) is getting an estimated ${fmt(comp.org_traffic)} monthly visitors. That's traffic that could be yours.`
    );
  }

  if (points.length === 0) {
    points.push(
      "Your online presence is just getting started — which means there's massive untapped potential waiting for the right strategy."
    );
  }

  return points;
}

export function generateAuditReportHTML(
  lead: LeadData,
  data: AuditReportData
): string {
  const dr = data.domainRating?.domain_rating ?? 0;
  const traffic = data.metrics?.org_traffic ?? 0;
  const trafficValue = data.metrics?.org_cost ?? 0;
  const totalKeywords = data.metrics?.org_keywords ?? 0;
  const refDomains = data.backlinksStats?.live_refdomains ?? 0;
  const totalBacklinks = data.backlinksStats?.live ?? 0;
  const { top3, top10, top50 } = data.keywordPositionBreakdown;
  const insights = interpretData(lead, data);

  const topKeyword = data.topKeywords[0] ?? null;
  const opp = data.biggestOpportunity;
  const comp = data.topCompetitor;

  const noDataSection = !data.hasData
    ? `
    <div style="background: #f0fae0; border-left: 4px solid #7ec700; padding: 24px; margin: 24px 0; border-radius: 0 8px 8px 0;">
      <h3 style="margin: 0 0 8px 0; color: #333;">Your site is brand new to search engines</h3>
      <p style="margin: 0; color: #555; line-height: 1.6;">That's actually not uncommon — and it means there's massive untapped potential. The contractors winning online right now started exactly where you are. Let's map out your growth plan.</p>
    </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SEO Audit Report — ${lead.business_name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      background: #f5f5f5;
      color: #333;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 680px;
      margin: 0 auto;
      background: #fff;
    }
    .header {
      background: #0e0f19;
      padding: 40px 32px;
      text-align: center;
    }
    .header-logo {
      font-size: 28px;
      font-weight: 700;
      color: #fff;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .header-logo span { color: #7ec700; }
    .header-subtitle {
      color: #999;
      font-size: 13px;
      margin-top: 4px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .hero {
      padding: 40px 32px;
      border-bottom: 1px solid #eee;
    }
    .hero h1 {
      font-size: 26px;
      font-weight: 700;
      color: #0e0f19;
      margin-bottom: 8px;
    }
    .hero p {
      color: #666;
      font-size: 15px;
    }
    .hero .domain {
      display: inline-block;
      background: #f0fae0;
      color: #4a7a00;
      padding: 4px 12px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 14px;
      margin-top: 12px;
    }
    .scores {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1px;
      background: #eee;
      border-bottom: 1px solid #eee;
    }
    .score-card {
      background: #fff;
      padding: 28px 24px;
      text-align: center;
    }
    .score-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #999;
      margin-bottom: 8px;
    }
    .score-value {
      font-size: 36px;
      font-weight: 700;
      line-height: 1.1;
    }
    .score-sub {
      font-size: 12px;
      color: #888;
      margin-top: 6px;
    }
    .section {
      padding: 32px;
      border-bottom: 1px solid #eee;
    }
    .section h2 {
      font-size: 18px;
      font-weight: 700;
      color: #0e0f19;
      margin-bottom: 16px;
    }
    .keyword-bar {
      display: flex;
      height: 32px;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 16px;
    }
    .keyword-bar div {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 11px;
      font-weight: 600;
    }
    .kw-top3 { background: #7ec700; }
    .kw-top10 { background: #a8d94e; }
    .kw-top50 { background: #d4e8a0; color: #555 !important; }
    .kw-rest { background: #eee; color: #999 !important; }
    .keyword-legend {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }
    .keyword-legend span {
      font-size: 12px;
      color: #666;
    }
    .keyword-legend .dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 4px;
      vertical-align: middle;
    }
    .opportunity-card {
      background: #fafff2;
      border-left: 4px solid #7ec700;
      padding: 24px;
      border-radius: 0 8px 8px 0;
    }
    .opportunity-card h3 {
      font-size: 16px;
      color: #333;
      margin-bottom: 4px;
    }
    .opportunity-keyword {
      font-size: 22px;
      font-weight: 700;
      color: #0e0f19;
      margin: 8px 0;
    }
    .opportunity-meta {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
    }
    .opportunity-meta div {
      font-size: 13px;
      color: #666;
    }
    .opportunity-meta strong {
      color: #333;
    }
    .stat-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .stat-row:last-child { border-bottom: none; }
    .stat-row .label { color: #666; font-size: 14px; }
    .stat-row .value { font-weight: 700; font-size: 14px; color: #333; }
    .competitor-compare {
      display: flex;
      gap: 24px;
      margin-top: 12px;
    }
    .competitor-col {
      flex: 1;
      padding: 16px;
      border-radius: 8px;
      text-align: center;
    }
    .competitor-col.you { background: #f0fae0; }
    .competitor-col.them { background: #f5f5f5; }
    .competitor-col .comp-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #999;
      margin-bottom: 4px;
    }
    .competitor-col .comp-domain {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
      word-break: break-all;
    }
    .competitor-col .comp-dr {
      font-size: 32px;
      font-weight: 700;
    }
    .insights {
      padding: 32px;
      background: #0e0f19;
      color: #fff;
    }
    .insights h2 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 16px;
      color: #fff;
    }
    .insights ul {
      list-style: none;
      padding: 0;
    }
    .insights li {
      padding: 12px 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      font-size: 14px;
      line-height: 1.7;
      color: #ccc;
    }
    .insights li:last-child { border-bottom: none; }
    .insights li::before {
      content: "\\2192 ";
      color: #7ec700;
      font-weight: 700;
    }
    .cta {
      padding: 48px 32px;
      text-align: center;
      background: #fff;
      border-bottom: 1px solid #eee;
    }
    .cta h2 {
      font-size: 24px;
      font-weight: 700;
      color: #0e0f19;
      margin-bottom: 8px;
    }
    .cta p {
      color: #666;
      font-size: 15px;
      margin-bottom: 24px;
      max-width: 420px;
      margin-left: auto;
      margin-right: auto;
    }
    .cta-button {
      display: inline-block;
      background: #7ec700;
      color: #fff;
      padding: 16px 36px;
      font-size: 16px;
      font-weight: 700;
      text-decoration: none;
      border-radius: 6px;
      letter-spacing: 0.5px;
    }
    .cta-button:hover { background: #6db300; }
    .footer {
      padding: 24px 32px;
      text-align: center;
      font-size: 12px;
      color: #999;
      background: #f9f9f9;
    }
    .footer a { color: #7ec700; text-decoration: none; }
    @media (max-width: 600px) {
      .scores { grid-template-columns: 1fr; }
      .competitor-compare { flex-direction: column; }
      .hero h1 { font-size: 22px; }
      .score-value { font-size: 28px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="header-logo">Organically<span>.</span></div>
      <div class="header-subtitle">Free SEO Audit Report</div>
    </div>

    <!-- Hero -->
    <div class="hero">
      <h1>Hey ${escHtml(lead.first_name)}, here's your SEO snapshot.</h1>
      <p>We ran a full audit on your website using enterprise-grade SEO tools. Here's what we found for <strong>${escHtml(lead.business_name)}</strong>.</p>
      <div class="domain">${escHtml(data.domain)}</div>
    </div>

    ${noDataSection}

    ${data.hasData ? `
    <!-- Score Overview -->
    <div class="scores">
      <div class="score-card">
        <div class="score-label">Domain Rating</div>
        <div class="score-value" style="color: ${drColor(dr)}">${dr}</div>
        <div class="score-sub">${drVerdict(dr).split("—")[0]}</div>
      </div>
      <div class="score-card">
        <div class="score-label">Monthly Organic Traffic</div>
        <div class="score-value">${fmt(traffic)}</div>
        <div class="score-sub">estimated visitors/month</div>
      </div>
      <div class="score-card">
        <div class="score-label">Total Keywords Ranking</div>
        <div class="score-value">${fmt(totalKeywords)}</div>
        <div class="score-sub">${top10} on page 1</div>
      </div>
      <div class="score-card">
        <div class="score-label">Organic Traffic Value</div>
        <div class="score-value">${fmtDollar(trafficValue)}</div>
        <div class="score-sub">equivalent ad spend/month</div>
      </div>
    </div>

    <!-- Keyword Breakdown -->
    ${totalKeywords > 0 ? `
    <div class="section">
      <h2>Keyword Rankings Breakdown</h2>
      <div class="keyword-bar">
        ${top3 > 0 ? `<div class="kw-top3" style="width: ${Math.max((top3 / Math.max(totalKeywords, 1)) * 100, 8)}%">${top3}</div>` : ""}
        ${top10 - top3 > 0 ? `<div class="kw-top10" style="width: ${Math.max(((top10 - top3) / Math.max(totalKeywords, 1)) * 100, 8)}%">${top10 - top3}</div>` : ""}
        ${top50 - top10 > 0 ? `<div class="kw-top50" style="width: ${Math.max(((top50 - top10) / Math.max(totalKeywords, 1)) * 100, 8)}%">${top50 - top10}</div>` : ""}
        ${totalKeywords - top50 > 0 ? `<div class="kw-rest" style="width: ${Math.max(((totalKeywords - top50) / Math.max(totalKeywords, 1)) * 100, 8)}%">${totalKeywords - top50}</div>` : ""}
      </div>
      <div class="keyword-legend">
        <span><span class="dot" style="background:#7ec700"></span>Positions 1-3</span>
        <span><span class="dot" style="background:#a8d94e"></span>Positions 4-10</span>
        <span><span class="dot" style="background:#d4e8a0"></span>Positions 11-50</span>
        <span><span class="dot" style="background:#eee"></span>50+</span>
      </div>
      ${topKeyword ? `
      <div class="stat-row">
        <span class="label">Top ranking keyword</span>
        <span class="value">"${escHtml(topKeyword.keyword)}" — #${topKeyword.position}</span>
      </div>` : ""}
    </div>` : ""}

    <!-- Biggest Opportunity -->
    ${opp ? `
    <div class="section">
      <h2>Your Biggest Keyword Opportunity</h2>
      <div class="opportunity-card">
        <h3>Money left on the table</h3>
        <div class="opportunity-keyword">"${escHtml(opp.keyword)}"</div>
        <div class="opportunity-meta">
          <div>Monthly searches: <strong>${fmt(opp.volume)}</strong></div>
          <div>Your current position: <strong>#${opp.position}</strong></div>
          ${opp.cpc ? `<div>Cost per click (ads): <strong>$${opp.cpc.toFixed(2)}</strong></div>` : ""}
        </div>
      </div>
    </div>` : ""}

    <!-- Backlinks -->
    ${data.backlinksStats ? `
    <div class="section">
      <h2>Backlink Profile</h2>
      <div class="stat-row">
        <span class="label">Referring Domains</span>
        <span class="value">${fmt(refDomains)}</span>
      </div>
      <div class="stat-row">
        <span class="label">Total Backlinks</span>
        <span class="value">${fmt(totalBacklinks)}</span>
      </div>
    </div>` : ""}

    <!-- Competitor -->
    ${comp ? `
    <div class="section">
      <h2>Your Top Organic Competitor</h2>
      <div class="competitor-compare">
        <div class="competitor-col you">
          <div class="comp-label">You</div>
          <div class="comp-domain">${escHtml(data.domain)}</div>
          <div class="comp-dr" style="color: ${drColor(dr)}">${dr}</div>
          <div class="score-sub">Domain Rating</div>
        </div>
        <div class="competitor-col them">
          <div class="comp-label">Competitor</div>
          <div class="comp-domain">${escHtml(comp.domain)}</div>
          <div class="comp-dr">${fmt(comp.org_traffic)}</div>
          <div class="score-sub">monthly traffic</div>
        </div>
      </div>
    </div>` : ""}
    ` : ""}

    <!-- Insights -->
    <div class="insights">
      <h2>What This Means for ${escHtml(lead.business_name)}</h2>
      <ul>
        ${insights.map((i) => `<li>${escHtml(i)}</li>`).join("\n        ")}
      </ul>
    </div>

    <!-- CTA -->
    <div class="cta">
      <h2>Let's turn these numbers into jobs, ${escHtml(lead.first_name)}.</h2>
      <p>I'll walk you through exactly what to focus on first — no fluff, no pressure, just a clear plan for your ${escHtml(lead.trade)} business${lead.city ? ` in ${escHtml(lead.city)}` : ""}.</p>
      <a href="https://calendly.com/organically/30min" class="cta-button">Book Your Free Strategy Call</a>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Report generated ${new Date(data.fetchedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} by <a href="https://organicallyseo.com">Organically</a></p>
      <p style="margin-top: 8px;">Data powered by Ahrefs &bull; ${escHtml(lead.city ? `${lead.city}, ${lead.state}` : "organicallyseo.com")}</p>
    </div>
  </div>
</body>
</html>`;
}

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
