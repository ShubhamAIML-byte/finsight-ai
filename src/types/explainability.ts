export interface FeatureContribution {
  featureName: string;
  category: "financial" | "macro" | "geopolitical" | "industry";
  contributionValue: number; // positive or negative force (-1.0 to +1.0)
  importanceScore: number; // absolute ranking 0.0 - 1.0
  direction: "positive" | "negative";
  description: string;
  observedValue: string;
  historicalBenchmark: string;
}

export interface TraceableEvidence {
  id: string;
  sourceType: "SEC_FILING" | "MACRO_STATISTIC" | "NEWS_FEED" | "ANALYST_TRANSCRIPT";
  sourceTitle: string;
  citationSnippet: string;
  relevanceScore: number;
  date: string;
  confidence: number;
  verifiableMetric?: {
    name: string;
    value: string;
    sourcePage?: number;
  };
}

export interface ExplainabilityModelOverview {
  targetDecision: string;
  methodology: "SHAP_Feature_Attribution" | "Deterministic_Rule_Attribution" | "Multi_Agent_Trace";
  methodologyDescription: string;
  baselineValue: number;
  targetValue: number;
  features: FeatureContribution[];
  evidenceChain: TraceableEvidence[];
  modelConfidence: number; // 0 - 100
  uncertaintyFactors: string[];
  limitationsNotice: string;
}
