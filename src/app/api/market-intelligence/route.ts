import { NextResponse } from "next/server";
import { GEOPOLITICAL_EVENTS, MACRO_INDICATORS } from "@/data/macro-intelligence";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker")?.toUpperCase();
    const category = searchParams.get("category");
    const severity = searchParams.get("severity");

    let events = GEOPOLITICAL_EVENTS;

    if (ticker) {
      events = events.filter((e) => e.relatedCompanies.includes(ticker));
    }

    if (category) {
      events = events.filter((e) => e.category === category);
    }

    if (severity) {
      events = events.filter((e) => e.severity === severity);
    }

    return NextResponse.json({
      indicators: MACRO_INDICATORS,
      events,
      totalEvents: events.length,
      isDemoData: true,
      lastRefreshed: new Date().toISOString(),
      provider: "FinSight Global Macro & BIS Regulatory Feed (Verified Sandbox)",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve market intelligence", details: (error as Error).message },
      { status: 500 }
    );
  }
}
