export interface ScenarioParams {
  currencyMovement: number; // in %, e.g. -10 to +10 (USD appreciation vs foreign)
  tariffIncrease: number; // in %, e.g. 0 to 30
  interestRateChange: number; // in bps or %, e.g. -2.0 to +4.0
  supplyChainCostIncrease: number; // in %, e.g. 0 to 25
  revenueDecline: number; // in %, e.g. -25 to +5
  marketDownturn: number; // in %, e.g. -40 to 0
}

export interface ScenarioImpactMetric {
  name: string;
  key: string;
  baseline: number;
  scenario: number;
  absoluteChange: number;
  percentageChange: number;
  unit: string;
  format: "currency" | "percent";
}

export interface ScenarioResult {
  params: ScenarioParams;
  companyTicker: string;
  baselineYear: number;
  impactMetrics: {
    revenue: ScenarioImpactMetric;
    cogs: ScenarioImpactMetric;
    operatingCosts: ScenarioImpactMetric;
    ebitda: ScenarioImpactMetric;
    netIncome: ScenarioImpactMetric;
    operatingMargin: ScenarioImpactMetric;
    freeCashFlow: ScenarioImpactMetric;
  };
  stressScore: number; // 0 - 100 risk vulnerability index
  riskLevel: "low" | "moderate" | "high" | "severe";
  riskSummary: string;
  assumptions: string[];
  recommendedMitigations: {
    title: string;
    action: string;
    estimatedCostSavings: string;
    timeline: string;
  }[];
  calculatedAt: string;
}

export interface StressTestPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  params: ScenarioParams;
}
