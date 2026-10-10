import { describe, it, expect } from "vitest";
import { calculateScenarioImpact } from "@/lib/scenario-engine";
import { calculateFinancialRatios } from "@/lib/financial-math";

describe("Scenario Stress Simulator Calculation Engine", () => {
  const baseline = calculateFinancialRatios({
    year: 2025,
    revenue: 100.0,
    cogs: 60.0,
    grossProfit: 40.0,
    operatingExpenses: 20.0,
    ebitda: 20.0,
    ebit: 15.0,
    interestExpense: 2.0,
    taxExpense: 2.6,
    netIncome: 10.4,
    operatingCashFlow: 18.0,
    capitalExpenditures: 5.0,
    freeCashFlow: 13.0,
    totalAssets: 90.0,
    currentAssets: 40.0,
    cashAndEquivalents: 15.0,
    totalLiabilities: 45.0,
    currentLiabilities: 20.0,
    totalDebt: 25.0,
    stockholdersEquity: 45.0,
    sharesOutstanding: 2.0,
    eps: 5.2,
  });

  it("calculates accurate margin degradation under tariff and cost shocks", () => {
    const result = calculateScenarioImpact(
      baseline,
      {
        currencyMovement: 5.0,
        tariffIncrease: 20.0,
        interestRateChange: 2.0,
        supplyChainCostIncrease: 15.0,
        revenueDecline: -10.0,
        marketDownturn: -15.0,
      },
      "TEST"
    );

    // Revenue should be reduced
    expect(result.impactMetrics.revenue.scenario).toBeLessThan(baseline.revenue);

    // COGS should increase due to tariffs and supply chain
    expect(result.impactMetrics.cogs.scenario).toBeGreaterThan(baseline.cogs);

    // EBITDA should compress
    expect(result.impactMetrics.ebitda.scenario).toBeLessThan(baseline.ebitda);

    // Operating margin percentage should compress
    expect(result.impactMetrics.operatingMargin.scenario).toBeLessThan(baseline.operatingMargin);

    // Stress score should reflect high vulnerability
    expect(result.stressScore).toBeGreaterThan(30);

    // Should include mitigation recommendations
    expect(result.recommendedMitigations.length).toBeGreaterThanOrEqual(3);
  });
});
