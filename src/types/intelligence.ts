export type SeverityLevel = "critical" | "high" | "medium" | "low" | "informational";
export type ImpactDirection = "negative" | "positive" | "mixed" | "neutral";
export type EventCategory =
  | "tariff"
  | "sanction"
  | "trade_policy"
  | "monetary_policy"
  | "inflation"
  | "foreign_exchange"
  | "supply_chain"
  | "regulation"
  | "commodity"
  | "geopolitical_conflict";

export interface MacroIndicator {
  id: string;
  name: string;
  code: string;
  currentValue: number;
  previousValue: number;
  changeValue: number;
  changePercent: number;
  unit: string;
  frequency: "daily" | "monthly" | "quarterly";
  lastUpdated: string;
  category: "fx" | "rates" | "inflation" | "commodities" | "indices";
  historicalTrend: { date: string; value: number }[];
}

export interface GeopoliticalEvent {
  id: string;
  headline: string;
  summary: string;
  source: string;
  publicationDate: string;
  category: EventCategory;
  relatedCompanies: string[]; // tickers e.g. ["AAPL", "NVDA"]
  relatedIndustries: string[];
  affectedRegions: string[];
  potentialFinancialImpact: string;
  impactDirection: ImpactDirection;
  severity: SeverityLevel;
  confidenceLevel: number; // 0.0 - 1.0
  sourceUrl: string;
  isLiveFeed?: boolean;
}
