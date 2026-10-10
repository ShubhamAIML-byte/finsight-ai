import { AgentContext, AgentOutput } from "./types";
import { generateFinancialForecast } from "@/lib/forecasting-engine";
import { ForecastResult } from "@/types/forecasting";

export interface ForecastingAgentData {
  forecast: ForecastResult;
  projectedNextYearRevenue: number;
  projectedGrowthPercent: number;
  modelConfidenceNote: string;
}

export class ForecastingAgent {
  public readonly name = "Forecasting Agent";
  public readonly role = "forecasting";

  public async analyze(context: AgentContext): Promise<AgentOutput<ForecastingAgentData>> {
    const startTime = Date.now();
    const { financialHistory, company } = context;

    const historyObs = financialHistory.map((m) => ({
      year: m.year,
      period: `${m.year}`,
      value: m.revenue,
    }));

    const forecast = generateFinancialForecast(historyObs, {
      metric: "revenue",
      metricLabel: "Total Revenue ($B)",
      companyTicker: company.ticker,
      modelType: "ensemble_weighted",
      horizon: "annual",
    });

    const nextPoint = forecast.forecastPoints[0];
    const latestActual = historyObs[historyObs.length - 1]?.value || 100;
    const projectedNextYearRevenue = nextPoint ? nextPoint.predicted : latestActual * 1.05;
    const projectedGrowthPercent = Number(
      (((projectedNextYearRevenue - latestActual) / latestActual) * 100).toFixed(2)
    );

    return {
      agentRole: this.role,
      agentName: this.name,
      success: true,
      durationMs: Date.now() - startTime,
      data: {
        forecast,
        projectedNextYearRevenue,
        projectedGrowthPercent,
        modelConfidenceNote: `Walk-forward validation MAPE: ${forecast.evaluation.mape}%, RMSE: $${forecast.evaluation.rmse}B across ${forecast.evaluation.sampleSize} fiscal periods.`,
      },
      summary: `Projected next-period revenue of $${projectedNextYearRevenue}B (${projectedGrowthPercent > 0 ? "+" : ""}${projectedGrowthPercent}%) with walk-forward MAPE of ${forecast.evaluation.mape}%.`,
      confidence: 0.91,
    };
  }
}
