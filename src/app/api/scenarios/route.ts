import { NextResponse } from "next/server";
import { z } from "zod";
import { FINANCIAL_METRICS_BY_TICKER } from "@/data/financials";
import { calculateScenarioImpact } from "@/lib/scenario-engine";

const scenarioSchema = z.object({
  ticker: z.string().min(1).default("AAPL"),
  currencyMovement: z.number().min(-30).max(30).default(0),
  tariffIncrease: z.number().min(0).max(50).default(0),
  interestRateChange: z.number().min(-5).max(10).default(0),
  supplyChainCostIncrease: z.number().min(0).max(50).default(0),
  revenueDecline: z.number().min(-50).max(20).default(0),
  marketDownturn: z.number().min(-60).max(0).default(0),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = scenarioSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid scenario parameters", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { ticker, ...params } = parsed.data;
    const history = FINANCIAL_METRICS_BY_TICKER[ticker.toUpperCase()];

    if (!history || history.length === 0) {
      return NextResponse.json(
        { error: `No historical financials found for ticker ${ticker}` },
        { status: 404 }
      );
    }

    const baseline = history[history.length - 1];
    const result = calculateScenarioImpact(baseline, params, ticker.toUpperCase());

    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to calculate scenario impact", details: (error as Error).message },
      { status: 500 }
    );
  }
}
