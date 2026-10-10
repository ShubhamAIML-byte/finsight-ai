import { FinancialMetric } from "@/types/financial";
import { ScenarioImpactMetric, ScenarioParams, ScenarioResult } from "@/types/scenario";

/**
 * Deterministic Scenario Analysis Engine
 * Calculates sensitivity impacts of macro and operational shocks on financial statements.
 */

export function calculateScenarioImpact(
  baseline: FinancialMetric,
  params: ScenarioParams,
  companyTicker: string
): ScenarioResult {
  // 1. Revenue Impact
  // Currency impact: international exposure estimated at ~55% of revenue for global multinationals
  const internationalRevenueShare = 0.55;
  const currencyRevenueDeltaPct = (params.currencyMovement / 100) * internationalRevenueShare * -1; // Stronger USD reduces translated foreign revenue
  const directRevenueDeltaPct = params.revenueDecline / 100;
  const totalRevenueDeltaPct = directRevenueDeltaPct + currencyRevenueDeltaPct;

  const scenarioRevenue = Math.max(0, baseline.revenue * (1 + totalRevenueDeltaPct));

  // 2. Cost of Goods Sold (COGS) Impact
  // Affected by tariffs (applicable on ~30% imported BOM) and supply chain cost inflation
  const importedBOMShare = 0.30;
  const tariffCogsIncrease = baseline.cogs * (params.tariffIncrease / 100) * importedBOMShare;
  const supplyChainCogsIncrease = baseline.cogs * (params.supplyChainCostIncrease / 100) * 0.70;
  const totalCogsIncrease = tariffCogsIncrease + supplyChainCogsIncrease;

  const scenarioCogs = Math.max(0, baseline.cogs + totalCogsIncrease);
  const scenarioGrossProfit = scenarioRevenue - scenarioCogs;

  // 3. Operating Expenses Impact
  // General inflation & operational friction
  const opexInflation = baseline.operatingExpenses * (Math.max(0, params.supplyChainCostIncrease) / 100) * 0.25;
  const scenarioOperatingCosts = baseline.operatingExpenses + opexInflation;

  // 4. EBITDA Impact
  const scenarioEbitda = scenarioGrossProfit - scenarioOperatingCosts;

  // 5. EBIT and Interest Expense
  const baselineDepreciation = baseline.ebitda - baseline.ebit;
  const scenarioEbit = scenarioEbitda - baselineDepreciation;

  // Interest rate sensitivity: floating debt estimated at ~35% of total debt
  const floatingDebtShare = 0.35;
  const rateDeltaDecimal = params.interestRateChange / 100;
  const additionalInterestExpense = baseline.totalDebt * floatingDebtShare * rateDeltaDecimal;
  const scenarioInterestExpense = Math.max(0, baseline.interestExpense + additionalInterestExpense);

  // 6. Tax and Net Income
  const scenarioEbt = scenarioEbit - scenarioInterestExpense;
  const effectiveTaxRate = baseline.ebit > 0 ? Math.min(0.30, Math.max(0.12, baseline.taxExpense / baseline.ebit)) : 0.18;
  const scenarioTax = scenarioEbt > 0 ? scenarioEbt * effectiveTaxRate : 0;
  const scenarioNetIncome = scenarioEbt - scenarioTax;

  // 7. Operating Margin
  const scenarioOperatingMargin = scenarioRevenue > 0 ? (scenarioEbit / scenarioRevenue) * 100 : 0;

  // 8. Free Cash Flow
  // Cash flow conversion under margin stress + working capital drag
  const workingCapitalDrag = (scenarioCogs - baseline.cogs) * 0.20;
  const scenarioOcf = Math.max(0, baseline.operatingCashFlow + (scenarioNetIncome - baseline.netIncome) - workingCapitalDrag);
  const scenarioFcf = scenarioOcf - baseline.capitalExpenditures;

  // Helpers to format impact metric objects
  const createMetric = (
    name: string,
    key: string,
    base: number,
    scen: number,
    unit: string,
    format: "currency" | "percent"
  ): ScenarioImpactMetric => {
    const absChange = Number((scen - base).toFixed(2));
    const pctChange = base !== 0 ? Number(((absChange / Math.abs(base)) * 100).toFixed(2)) : 0;
    return {
      name,
      key,
      baseline: Number(base.toFixed(2)),
      scenario: Number(scen.toFixed(2)),
      absoluteChange: absChange,
      percentageChange: pctChange,
      unit,
      format,
    };
  };

  const impactMetrics = {
    revenue: createMetric("Total Revenue", "revenue", baseline.revenue, scenarioRevenue, "$", "currency"),
    cogs: createMetric("Cost of Goods Sold (COGS)", "cogs", baseline.cogs, scenarioCogs, "$", "currency"),
    operatingCosts: createMetric("Operating Expenses (OPEX)", "operatingCosts", baseline.operatingExpenses, scenarioOperatingCosts, "$", "currency"),
    ebitda: createMetric("EBITDA", "ebitda", baseline.ebitda, scenarioEbitda, "$", "currency"),
    netIncome: createMetric("Net Profit", "netIncome", baseline.netIncome, scenarioNetIncome, "$", "currency"),
    operatingMargin: createMetric("Operating Margin", "operatingMargin", baseline.operatingMargin, scenarioOperatingMargin, "%", "percent"),
    freeCashFlow: createMetric("Free Cash Flow (FCF)", "freeCashFlow", baseline.freeCashFlow, scenarioFcf, "$", "currency"),
  };

  // Vulnerability & Stress Score (0 - 100)
  const ebitdaDrawdownPct = Math.max(0, -impactMetrics.ebitda.percentageChange);
  const fcfDrawdownPct = Math.max(0, -impactMetrics.freeCashFlow.percentageChange);
  const marginCompressionPct = Math.max(0, baseline.operatingMargin - scenarioOperatingMargin);

  const rawStress = ebitdaDrawdownPct * 0.45 + fcfDrawdownPct * 0.35 + marginCompressionPct * 2.0;
  const stressScore = Math.min(100, Math.max(0, Math.round(rawStress)));

  const riskLevel: "low" | "moderate" | "high" | "severe" =
    stressScore > 65 ? "severe" : stressScore > 40 ? "high" : stressScore > 20 ? "moderate" : "low";

  const riskSummary =
    stressScore > 65
      ? `Severe balance sheet strain: Projected EBITDA declines by ${Math.abs(impactMetrics.ebitda.percentageChange)}% and FCF by ${Math.abs(impactMetrics.freeCashFlow.percentageChange)}%. Requires immediate hedging and OPEX containment.`
      : stressScore > 40
      ? `Material headwinds: Operating margin compresses from ${baseline.operatingMargin}% to ${scenarioOperatingMargin.toFixed(1)}% due to tariff drag and supply friction.`
      : `Resilient financial position: Company absorbs simulated macroeconomic shocks within existing operating cash flow buffers.`;

  // Tailored mitigation actions
  const recommendedMitigations = [
    {
      title: "Supplier Diversification & Tariff Nearshoring",
      action: "Reroute 25-35% of high-tariff intermediate component procurement to non-impacted trade corridors.",
      estimatedCostSavings: `$${(Math.abs(tariffCogsIncrease) * 0.45).toFixed(1)}B recovery`,
      timeline: "3 - 6 Months",
    },
    {
      title: "FX Hedging & Dynamic Regional Pricing",
      action: "Execute rolling 6-month cross-currency forward contracts and calibrate local market price elasticities.",
      estimatedCostSavings: `Protects ~${Math.abs(currencyRevenueDeltaPct * 100).toFixed(1)}% revenue erosion`,
      timeline: "Immediate (30 Days)",
    },
    {
      title: "Discretionary OPEX Freeze & CapEx Re-prioritization",
      action: "Defer uncommitted non-core R&D facilities and optimize procurement vendor payment terms.",
      estimatedCostSavings: `$${(baseline.operatingExpenses * 0.05).toFixed(1)}B liquidity preservation`,
      timeline: "1 - 2 Quarters",
    },
  ];

  return {
    params,
    companyTicker,
    baselineYear: baseline.year,
    impactMetrics,
    stressScore,
    riskLevel,
    riskSummary,
    assumptions: [
      "International revenue share baseline benchmarked at 55% of consolidated gross sales.",
      "Imported Bill of Materials (BOM) tariff exposure modeled at 30% of total COGS.",
      "Variable rate debt exposure modeled at 35% of total outstanding borrowings.",
      "Corporate tax shield applies linearly to positive earnings before taxes (EBT).",
    ],
    recommendedMitigations,
    calculatedAt: new Date().toISOString(),
  };
}
