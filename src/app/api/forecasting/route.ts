import { NextResponse } from "next/server";
import { z } from "zod";
import { FINANCIAL_METRICS_BY_TICKER } from "@/data/financials";
import { generateFinancialForecast } from "@/lib/forecasting-engine";
import { ForecastHorizon, ForecastModelType } from "@/types/forecasting";

const forecastSchema = z.object({
  ticker: z.string().min(1).default("AAPL"),
  metric: z.string().min(1).default("revenue"),
  modelType: z
    .enum(["linear_trend", "holt_exponential_smoothing", "autoregressive_ar1", "ensemble_weighted"])
    .default("ensemble_weighted"),
  horizon: z.enum(["quarterly", "annual", "three_year", "five_year"]).default("annual"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = forecastSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid forecast parameters", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { ticker, metric, modelType, horizon } = parsed.data;
    const history = FINANCIAL_METRICS_BY_TICKER[ticker.toUpperCase()];

    if (!history || history.length === 0) {
      return NextResponse.json(
        { error: `No historical financial data found for ticker ${ticker}` },
        { status: 404 }
      );
    }

    // Extract metric observations
    const metricObservations = history.map((h) => {
      const val = (h as unknown as Record<string, number>)[metric] ?? h.revenue;
      return {
        year: h.year,
        period: `${h.year}`,
        value: val,
      };
    });

    const metricLabels: Record<string, string> = {
      revenue: "Total Revenue ($B)",
      ebitda: "EBITDA ($B)",
      netIncome: "Net Profit ($B)",
      freeCashFlow: "Free Cash Flow ($B)",
      operatingMargin: "Operating Margin (%)",
    };

    const result = generateFinancialForecast(metricObservations, {
      metric,
      metricLabel: metricLabels[metric] || metric,
      companyTicker: ticker.toUpperCase(),
      modelType: modelType as ForecastModelType,
      horizon: horizon as ForecastHorizon,
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate financial forecast", details: (error as Error).message },
      { status: 500 }
    );
  }
}
