export interface Company {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  industry: string;
  country: string;
  currency: string;
  marketCap: number; // in USD billions
  description: string;
  peRatio: number;
  dividendYield: number;
  beta: number;
  logoUrl?: string;
  healthScore: number; // 0-100 composite score
  piotroskiFScore: number; // 0-9
  altmanZScore: number; // >2.99 safe, 1.81-2.99 grey, <1.81 distress
}

export interface FinancialMetric {
  year: number;
  revenue: number; // in USD billions
  cogs: number;
  grossProfit: number;
  operatingExpenses: number;
  ebitda: number;
  ebit: number;
  interestExpense: number;
  taxExpense: number;
  netIncome: number;
  operatingCashFlow: number;
  capitalExpenditures: number;
  freeCashFlow: number;
  totalAssets: number;
  currentAssets: number;
  cashAndEquivalents: number;
  totalLiabilities: number;
  currentLiabilities: number;
  totalDebt: number;
  stockholdersEquity: number;
  sharesOutstanding: number; // in billions
  eps: number;
  // Computed Ratios
  grossMargin: number; // percentage
  operatingMargin: number; // percentage
  netMargin: number; // percentage
  ebitdaMargin: number; // percentage
  roe: number; // Return on Equity %
  roa: number; // Return on Assets %
  debtToEquity: number;
  currentRatio: number;
  assetTurnover: number;
}

export interface FinancialStatementRow {
  label: string;
  key: keyof FinancialMetric;
  category: "revenue" | "profitability" | "cash_flow" | "balance_sheet" | "ratio";
  format: "currency" | "percent" | "number" | "ratio";
  values: Record<number, number>; // year -> value
}

export interface KpiCardData {
  title: string;
  key: string;
  value: number;
  previousValue: number;
  changePercent: number;
  formattedValue: string;
  formattedPrevious: string;
  unit: string;
  format: "currency" | "percent" | "ratio";
  trend: "positive" | "negative" | "neutral";
  tooltip: string;
}
