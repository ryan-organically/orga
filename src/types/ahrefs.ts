// ─── Lead Data (from Meta form) ───

export interface LeadData {
  first_name: string;
  business_name: string;
  email: string;
  website: string;
  trade: string;
  city: string;
  state: string;
}

// ─── Ahrefs API Response Types ───

export interface AhrefsDomainRating {
  domain_rating: number;
  ahrefs_rank: number;
}

export interface AhrefsMetrics {
  org_traffic: number;
  paid_traffic: number;
  org_cost: number;
  org_keywords: number;
}

export interface AhrefsKeyword {
  keyword: string;
  position: number;
  volume: number;
  traffic: number;
  url: string;
  difficulty: number;
  cpc: number;
}

export interface AhrefsBacklinksStats {
  live: number;
  all_time: number;
  live_refdomains: number;
  all_time_refdomains: number;
}

export interface AhrefsCompetitor {
  domain: string;
  common_keywords: number;
  org_keywords: number;
  org_traffic: number;
}

// ─── Assembled Report ───

export interface KeywordPositionBreakdown {
  top3: number;
  top10: number;
  top50: number;
  total: number;
}

export interface AuditReportData {
  domain: string;
  domainRating: AhrefsDomainRating | null;
  metrics: AhrefsMetrics | null;
  topKeywords: AhrefsKeyword[];
  keywordPositionBreakdown: KeywordPositionBreakdown;
  biggestOpportunity: AhrefsKeyword | null;
  backlinksStats: AhrefsBacklinksStats | null;
  topCompetitor: AhrefsCompetitor | null;
  hasData: boolean;
  fetchedAt: string;
}
