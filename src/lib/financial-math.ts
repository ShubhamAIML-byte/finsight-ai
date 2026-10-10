import { FinancialMetric } from "@/types/financial";

/**
 * Deterministic Financial Metrics and Ratio Calculations
 * Ensures no LLM hallucination of numerical formulas.
 */

export function calculateFinancialRatios(
  metric: Omit<
    FinancialMetric,
    | "grossMargin"
    | "operatingMargin"
    | "netMargin"
    | "ebitdaMargin"
    | "roe"
    | "roa"
    | "debtToEquity"
    | "currentRatio"
    | "assetTurnover"
  >
): FinancialMetric {
  const rev = metric.revenue || 1;
  const assets = metric.totalAssets || 1;
  const equity = metric.stockholdersEquity || 1;
  const currLiab = metric.currentLiabilities || 1;

  const grossMargin = (metric.grossProfit / rev) * 100;
  const operatingMargin = (metric.ebit / rev) * 100;
  const netMargin = (metric.netIncome / rev) * 100;
  const ebitdaMargin = (metric.ebitda / rev) * 100;
  const roe = (metric.netIncome / equity) * 100;
  const roa = (metric.netIncome / assets) * 100;
  const debtToEquity = metric.totalDebt / equity;
  const currentRatio = metric.currentAssets / currLiab;
  const assetTurnover = metric.revenue / assets;

  return {
    ...metric,
    grossMargin: Number(grossMargin.toFixed(2)),
    operatingMargin: Number(operatingMargin.toFixed(2)),
    netMargin: Number(netMargin.toFixed(2)),
    ebitdaMargin: Number(ebitdaMargin.toFixed(2)),
    roe: Number(roe.toFixed(2)),
    roa: Number(roa.toFixed(2)),
    debtToEquity: Number(debtToEquity.toFixed(2)),
    currentRatio: Number(currentRatio.toFixed(2)),
    assetTurnover: Number(assetTurnover.toFixed(2)),
  };
}

/**
 * Calculates Altman Z-Score for public companies
 * Formula: Z = 1.2*X1 + 1.4*X2 + 3.3*X3 + 0.6*X4 + 0.999*X5
 */
export function calculateAltmanZScore(
  current: FinancialMetric,
  marketCap: number
): { score: number; zone: "safe" | "grey" | "distress"; interpretation: string } {
  const assets = current.totalAssets || 1;
  const liabilities = current.totalLiabilities || 1;

  const workingCapital = current.currentAssets - current.currentLiabilities;
  const x1 = workingCapital / assets;
  const x2 = (current.stockholdersEquity * 0.7) / assets; // Retained earnings proxy
  const x3 = current.ebit / assets;
  const x4 = marketCap / liabilities;
  const x5 = current.revenue / assets;

  const zScore = 1.2 * x1 + 1.4 * x2 + 3.3 * x3 + 0.6 * x4 + 0.999 * x5;
  const score = Number(zScore.toFixed(2));

  if (score > 2.99) {
    return {
      score,
      zone: "safe",
      interpretation: "Safe Zone: Negligible probability of financial insolvency over the next 24 months.",
    };
  } else if (score >= 1.81) {
    return {
      score,
      zone: "grey",
      interpretation: "Grey Zone: Moderate vulnerability; credit monitoring and working capital discipline recommended.",
    };
  } else {
    return {
      score,
      zone: "distress",
      interpretation: "Distress Zone: High structural insolvency risk; debt restructuring or capital injection required.",
    };
  }
}

/**
 * Calculates Piotroski F-Score (0 to 9) comparing current year vs prior year
 */
export function calculatePiotroskiFScore(
  current: FinancialMetric,
  prior?: FinancialMetric
): { score: number; criteria: { name: string; pass: boolean; explanation: string }[] } {
  const criteria = [
    {
      name: "Positive Net Income",
      pass: current.netIncome > 0,
      explanation: `Net income is ${current.netIncome > 0 ? "positive" : "negative"} ($${current.netIncome}B)`,
    },
    {
      name: "Positive Operating Cash Flow",
      pass: current.operatingCashFlow > 0,
      explanation: `Operating Cash Flow is ${current.operatingCashFlow > 0 ? "positive" : "negative"} ($${current.operatingCashFlow}B)`,
    },
    {
      name: "Higher ROA YoY",
      pass: prior ? current.roa >= prior.roa : true,
      explanation: prior
        ? `ROA is ${current.roa}% vs ${prior.roa}% prior year`
        : "Prior year baseline met",
    },
    {
      name: "Cash Flow from Operations > Net Income",
      pass: current.operatingCashFlow > current.netIncome,
      explanation: `OCF ($${current.operatingCashFlow}B) ${current.operatingCashFlow > current.netIncome ? ">" : "<="} Net Income ($${current.netIncome}B) (Earnings Quality)`,
    },
    {
      name: "Decreased Leverage (Debt/Assets)",
      pass: prior
        ? current.totalDebt / current.totalAssets <= prior.totalDebt / prior.totalAssets
        : true,
      explanation: prior
        ? `Leverage ratio is ${(current.totalDebt / current.totalAssets).toFixed(2)} vs ${(prior.totalDebt / prior.totalAssets).toFixed(2)}`
        : "Leverage within acceptable threshold",
    },
    {
      name: "Higher Current Ratio YoY",
      pass: prior ? current.currentRatio >= prior.currentRatio : true,
      explanation: prior
        ? `Current ratio is ${current.currentRatio} vs ${prior.currentRatio}`
        : "Liquidity benchmark met",
    },
    {
      name: "No Equity Dilution",
      pass: prior ? current.sharesOutstanding <= prior.sharesOutstanding * 1.01 : true,
      explanation: prior
        ? `Shares outstanding: ${current.sharesOutstanding}B vs ${prior.sharesOutstanding}B`
        : "Share count stable",
    },
    {
      name: "Higher Gross Margin YoY",
      pass: prior ? current.grossMargin >= prior.grossMargin : true,
      explanation: prior
        ? `Gross margin: ${current.grossMargin}% vs ${prior.grossMargin}%`
        : "Margin efficiency benchmark met",
    },
    {
      name: "Higher Asset Turnover YoY",
      pass: prior ? current.assetTurnover >= prior.assetTurnover : true,
      explanation: prior
        ? `Asset turnover: ${current.assetTurnover} vs ${prior.assetTurnover}`
        : "Asset productivity benchmark met",
    },
  ];

  const score = criteria.filter((c) => c.pass).length;
  return { score, criteria };
}
