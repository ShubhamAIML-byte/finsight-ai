import { describe, it, expect } from "vitest";
import {
  calculateFinancialRatios,
  calculateAltmanZScore,
  calculatePiotroskiFScore,
} from "@/lib/financial-math";
import { FinancialMetric } from "@/types/financial";

describe("Deterministic Financial Mathematics", () => {
  const sampleMetric: Omit<
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
  > = {
    year: 2025,
    revenue: 400.0,
    cogs: 240.0,
    grossProfit: 160.0,
    operatingExpenses: 60.0,
    ebitda: 120.0,
    ebit: 100.0,
    interestExpense: 4.0,
    taxExpense: 16.0,
    netIncome: 80.0,
    operatingCashFlow: 110.0,
    capitalExpenditures: 15.0,
    freeCashFlow: 95.0,
    totalAssets: 300.0,
    currentAssets: 150.0,
    cashAndEquivalents: 40.0,
    totalLiabilities: 200.0,
    currentLiabilities: 100.0,
    totalDebt: 80.0,
    stockholdersEquity: 100.0,
    sharesOutstanding: 10.0,
    eps: 8.0,
  };

  it("calculates accurate financial margins and profitability ratios", () => {
    const computed = calculateFinancialRatios(sampleMetric);

    // Gross Margin = (160 / 400) * 100 = 40.0%
    expect(computed.grossMargin).toBe(40.0);

    // Operating Margin = (100 / 400) * 100 = 25.0%
    expect(computed.operatingMargin).toBe(25.0);

    // Net Margin = (80 / 400) * 100 = 20.0%
    expect(computed.netMargin).toBe(20.0);

    // EBITDA Margin = (120 / 400) * 100 = 30.0%
    expect(computed.ebitdaMargin).toBe(30.0);

    // ROE = (80 / 100) * 100 = 80.0%
    expect(computed.roe).toBe(80.0);

    // ROA = (80 / 300) * 100 = 26.67%
    expect(computed.roa).toBe(26.67);

    // Debt to Equity = 80 / 100 = 0.8
    expect(computed.debtToEquity).toBe(0.8);

    // Current Ratio = 150 / 100 = 1.5
    expect(computed.currentRatio).toBe(1.5);
  });

  it("calculates Altman Z-Score and correctly classifies the solvency zone", () => {
    const computed = calculateFinancialRatios(sampleMetric);
    const zResult = calculateAltmanZScore(computed, 2500.0); // $2.5T Market Cap

    expect(zResult.score).toBeGreaterThan(2.99);
    expect(zResult.zone).toBe("safe");
    expect(zResult.interpretation).toContain("Safe Zone");
  });

  it("calculates Piotroski F-Score comparing current year vs prior baseline", () => {
    const current = calculateFinancialRatios(sampleMetric);
    const prior = calculateFinancialRatios({
      ...sampleMetric,
      year: 2024,
      revenue: 380.0,
      netIncome: 70.0,
      grossProfit: 140.0,
      roa: 23.0,
      currentRatio: 1.3,
    });

    const fScore = calculatePiotroskiFScore(current, prior);

    expect(fScore.score).toBeGreaterThanOrEqual(7);
    expect(fScore.criteria.length).toBe(9);
    expect(fScore.criteria.find((c) => c.name === "Positive Net Income")?.pass).toBe(true);
    expect(fScore.criteria.find((c) => c.name === "Positive Operating Cash Flow")?.pass).toBe(true);
  });
});
