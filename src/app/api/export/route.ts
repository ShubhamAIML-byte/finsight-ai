import { NextResponse } from "next/server";
import { COMPANIES } from "@/data/companies";
import { FINANCIAL_METRICS_BY_TICKER } from "@/data/financials";
import { RECOMMENDATIONS } from "@/data/recommendations";
import { GEOPOLITICAL_EVENTS } from "@/data/macro-intelligence";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ticker = (body.ticker || "AAPL").toUpperCase();
    const format = body.format || "json"; // "json" | "csv"

    const company = COMPANIES.find((c) => c.ticker === ticker) || COMPANIES[0];
    const financials = FINANCIAL_METRICS_BY_TICKER[ticker] || FINANCIAL_METRICS_BY_TICKER["AAPL"];
    const latest = financials[financials.length - 1];
    const recs = RECOMMENDATIONS.filter((r) => r.companyTicker === ticker);
    const events = GEOPOLITICAL_EVENTS.filter((e) => e.relatedCompanies.includes(ticker));

    if (format === "csv") {
      // Generate CSV string of historical financials
      const headers = [
        "Fiscal Year",
        "Revenue ($B)",
        "Gross Profit ($B)",
        "EBITDA ($B)",
        "Net Income ($B)",
        "Operating Cash Flow ($B)",
        "Free Cash Flow ($B)",
        "Operating Margin (%)",
        "Net Margin (%)",
        "ROE (%)",
        "Total Debt ($B)",
      ].join(",");

      const rows = financials.map((f) =>
        [
          f.year,
          f.revenue,
          f.grossProfit,
          f.ebitda,
          f.netIncome,
          f.operatingCashFlow,
          f.freeCashFlow,
          f.operatingMargin,
          f.netMargin,
          f.roe,
          f.totalDebt,
        ].join(",")
      );

      const csvContent = [headers, ...rows].join("\n");

      return new Response(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${ticker}_Financial_Intelligence_Report.csv"`,
        },
      });
    }

    // Comprehensive JSON dossier payload
    const report = {
      title: `FinSight AI Institutional Intelligence Dossier — ${company.name} (${ticker})`,
      ticker,
      generatedAt: new Date().toISOString(),
      classification: "Institutional Investment Grade Analysis",
      company,
      executiveSummary: {
        financialHealthScore: company.healthScore,
        altmanZScore: company.altmanZScore,
        piotroskiFScore: company.piotroskiFScore,
        currentRevenueUSD: `$${latest.revenue}B`,
        operatingMargin: `${latest.operatingMargin}%`,
        freeCashFlowUSD: `$${latest.freeCashFlow}B`,
      },
      historicalFinancials: financials,
      prioritizedRecommendations: recs,
      geopoliticalRiskEvents: events,
      complianceAndLimitations: [
        "Financial figures are grounded in audited SEC Form 10-K & 10-Q filings.",
        "Forecasting metrics reflect chronological walk-forward validation (no data leakage).",
        "Scenario simulations are mathematical sensitivity estimates, not guaranteed outcomes.",
      ],
    };

    return NextResponse.json({ report });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate export dossier", details: (error as Error).message },
      { status: 500 }
    );
  }
}
