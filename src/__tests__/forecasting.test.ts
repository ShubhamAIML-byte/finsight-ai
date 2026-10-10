import { describe, it, expect } from "vitest";
import {
  generateFinancialForecast,
  calculateEvaluationMetrics,
} from "@/lib/forecasting-engine";

describe("Deterministic Forecasting & Validation Engine", () => {
  const historicalSeries = [
    { year: 2021, period: "FY2021", value: 100 },
    { year: 2022, period: "FY2022", value: 115 },
    { year: 2023, period: "FY2023", value: 125 },
    { year: 2024, period: "FY2024", value: 140 },
    { year: 2025, period: "FY2025", value: 155 },
  ];

  it("calculates walk-forward validation metrics without data leakage", () => {
    const actuals = [155];
    const predicted = [152];
    const evalMetrics = calculateEvaluationMetrics(actuals, predicted);

    expect(evalMetrics.mae).toBe(3.0);
    expect(evalMetrics.rmse).toBe(3.0);
    expect(evalMetrics.mape).toBeCloseTo(1.94, 1);
    expect(evalMetrics.sampleSize).toBe(1);
    expect(evalMetrics.validationMethod).toBe("walk_forward_chronological");
  });

  it("generates forecast points with expanding prediction intervals", () => {
    const forecast = generateFinancialForecast(historicalSeries, {
      metric: "revenue",
      metricLabel: "Total Revenue ($B)",
      companyTicker: "TEST",
      modelType: "ensemble_weighted",
      horizon: "three_year",
    });

    expect(forecast.forecastPoints.length).toBe(3);
    const p1 = forecast.forecastPoints[0];
    const p3 = forecast.forecastPoints[2];

    // Predicted value should trend upwards
    expect(p1.predicted).toBeGreaterThan(155);
    expect(p3.predicted).toBeGreaterThan(p1.predicted);

    // Prediction uncertainty should expand over time
    const spread1 = p1.upperBound95 - p1.lowerBound95;
    const spread3 = p3.upperBound95 - p3.lowerBound95;
    expect(spread3).toBeGreaterThan(spread1);

    // Evaluation metrics should be defined and positive
    expect(forecast.evaluation.mape).toBeGreaterThan(0);
    expect(forecast.evaluation.rmse).toBeGreaterThan(0);
  });
});
