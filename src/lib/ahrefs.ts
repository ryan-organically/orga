import type {
  AhrefsDomainRating,
  AhrefsMetrics,
  AhrefsKeyword,
  AhrefsBacklinksStats,
  AhrefsCompetitor,
  AuditReportData,
  KeywordPositionBreakdown,
} from "@/types/ahrefs";

const AHREFS_BASE = "https://api.ahrefs.com/v3/site-explorer";

function getApiKey(): string {
  const key = process.env.AHREFS_API_KEY;
  if (!key) throw new Error("AHREFS_API_KEY is not set");
  return key;
}

function todayDate(): string {
  return new Date().toISOString().split("T")[0];
}

async function ahrefsFetch<T>(
  endpoint: string,
  params: Record<string, string>
): Promise<T | null> {
  const url = new URL(`${AHREFS_BASE}/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${getApiKey()}` },
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    console.error(
      `Ahrefs ${endpoint} failed: ${res.status} ${res.statusText}`
    );
    return null;
  }

  return res.json();
}

// ─── Individual Fetchers ───

async function fetchDomainRating(
  domain: string,
  date: string
): Promise<AhrefsDomainRating | null> {
  return ahrefsFetch<AhrefsDomainRating>("domain-rating", {
    target: domain,
    date,
  });
}

async function fetchMetrics(
  domain: string,
  date: string
): Promise<AhrefsMetrics | null> {
  const data = await ahrefsFetch<{ metrics: AhrefsMetrics }>("metrics", {
    target: domain,
    date,
    mode: "domain",
  });
  return data?.metrics ?? null;
}

async function fetchOrganicKeywords(
  domain: string,
  date: string
): Promise<AhrefsKeyword[]> {
  const data = await ahrefsFetch<{ keywords: AhrefsKeyword[] }>(
    "organic-keywords",
    {
      target: domain,
      date,
      mode: "domain",
      limit: "50",
      order_by: "traffic:desc",
      select: "keyword,position,volume,traffic,url,difficulty,cpc",
    }
  );
  return data?.keywords ?? [];
}

async function fetchBacklinksStats(
  domain: string,
  date: string
): Promise<AhrefsBacklinksStats | null> {
  return ahrefsFetch<AhrefsBacklinksStats>("backlinks-stats", {
    target: domain,
    date,
    mode: "domain",
  });
}

async function fetchOrganicCompetitors(
  domain: string,
  date: string
): Promise<AhrefsCompetitor | null> {
  const data = await ahrefsFetch<{ competitors: AhrefsCompetitor[] }>(
    "organic-competitors",
    {
      target: domain,
      date,
      mode: "domain",
      limit: "5",
    }
  );
  const competitors = data?.competitors ?? [];
  return competitors[0] ?? null;
}

// ─── Orchestrator ───

export async function fetchAuditData(domain: string): Promise<AuditReportData> {
  const date = todayDate();

  const [drResult, metricsResult, kwResult, blResult, compResult] =
    await Promise.allSettled([
      fetchDomainRating(domain, date),
      fetchMetrics(domain, date),
      fetchOrganicKeywords(domain, date),
      fetchBacklinksStats(domain, date),
      fetchOrganicCompetitors(domain, date),
    ]);

  const domainRating =
    drResult.status === "fulfilled" ? drResult.value : null;
  const metrics =
    metricsResult.status === "fulfilled" ? metricsResult.value : null;
  const topKeywords =
    kwResult.status === "fulfilled" ? kwResult.value : [];
  const backlinksStats =
    blResult.status === "fulfilled" ? blResult.value : null;
  const topCompetitor =
    compResult.status === "fulfilled" ? compResult.value : null;

  // Keyword position breakdown
  const keywordPositionBreakdown: KeywordPositionBreakdown = {
    top3: topKeywords.filter((k) => k.position <= 3).length,
    top10: topKeywords.filter((k) => k.position <= 10).length,
    top50: topKeywords.filter((k) => k.position <= 50).length,
    total: topKeywords.length,
  };

  // Biggest opportunity: high volume keyword ranking outside top 10
  const biggestOpportunity =
    topKeywords
      .filter((k) => k.position > 10 && k.volume > 0)
      .sort((a, b) => b.volume - a.volume)[0] ?? null;

  const hasData =
    domainRating !== null || metrics !== null || topKeywords.length > 0;

  return {
    domain,
    domainRating,
    metrics,
    topKeywords,
    keywordPositionBreakdown,
    biggestOpportunity,
    backlinksStats,
    topCompetitor,
    hasData,
    fetchedAt: new Date().toISOString(),
  };
}
