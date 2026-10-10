import { NextResponse } from "next/server";
import { FINANCIAL_METRICS_BY_TICKER } from "@/data/financials";
import { COMPANIES } from "@/data/companies";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker")?.toUpperCase() || "AAPL";

    const company = COMPANIES.find((c) => c.ticker === ticker);
    const history = FINANCIAL_METRICS_BY_TICKER[ticker];

    if (!history || history.length === 0) {
      return NextResponse.json(
        { error: `No historical financial data available for ticker ${ticker}` },
        { status: 404 }
      );
    }

    const latest = history[history.length - 1];
    const prior = history.length > 1 ? history[history.length - 2] : undefined;

    return NextResponse.json({
      ticker,
      company,
      history,
      latest,
      prior,
      periodCount: history.length,
      isDemoData: true,
      lastAuditedFiling: "FY2025 Form 10-K",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve financial metrics", details: (error as Error).message },
      { status: 500 }
    );
  }
}
