import { NextResponse } from "next/server";
import { FINANCIAL_METRICS_BY_TICKER } from "@/data/financials";
import { generateFinancialExplainability } from "@/lib/explainability-engine";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker")?.toUpperCase() || "AAPL";

    const history = FINANCIAL_METRICS_BY_TICKER[ticker];
    if (!history || history.length < 2) {
      return NextResponse.json(
        { error: `Insufficient multi-year data for explainability on ticker ${ticker}` },
        { status: 404 }
      );
    }

    const current = history[history.length - 1];
    const prior = history[history.length - 2];

    const overview = generateFinancialExplainability(current, prior, ticker);

    return NextResponse.json({
      data: overview,
      ticker,
      isDemoData: true,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate explainability model", details: (error as Error).message },
      { status: 500 }
    );
  }
}
