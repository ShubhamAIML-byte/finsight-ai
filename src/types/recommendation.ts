export type RecommendationPriority = "critical" | "high" | "medium" | "low";

export type RecommendationCategory =
  | "cost_optimization"
  | "risk_mitigation"
  | "pricing_strategy"
  | "market_expansion"
  | "capital_allocation"
  | "investment_prioritization";

export type RecommendationStatus = "pending" | "under_review" | "approved" | "implemented" | "dismissed";

export interface ImplementationStep {
  stepNumber: number;
  phase: string;
  action: string;
  timeline: string;
  ownerDepartment: string;
}

export interface RecommendationSourceRef {
  title: string;
  type: "10-K Filing" | "10-Q Filing" | "Earnings Call" | "Macro Report" | "Trade Bulletin";
  section?: string;
  date: string;
  url?: string;
}

export interface Recommendation {
  id: string;
  companyTicker: string;
  title: string;
  priority: RecommendationPriority;
  category: RecommendationCategory;
  businessObjective: string;
  explanation: string;
  supportingMetrics: {
    label: string;
    value: string;
    baseline: string;
    change: string;
  }[];
  relatedEvents: string[]; // headlines of related geopolitical/macro events
  expectedImpactRange: {
    minPercent: number;
    maxPercent: number;
    estimatedValueUSD: string;
    impactMetric: string;
  };
  confidenceScore: number; // 0.0 - 1.0
  confidenceRationale: string;
  potentialRisks: string[];
  implementationSteps: ImplementationStep[];
  sourceReferences: RecommendationSourceRef[];
  status: RecommendationStatus;
  createdAt: string;
  updatedAt: string;
}
