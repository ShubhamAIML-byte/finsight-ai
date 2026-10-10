import { NextResponse } from "next/server";
import { COMPANIES } from "@/data/companies";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker");
    const search = searchParams.get("search")?.toLowerCase();

    if (ticker) {
      const company = COMPANIES.find((c) => c.ticker.toUpperCase() === ticker.toUpperCase());
      if (!company) {
        return NextResponse.json({ error: `Company with ticker ${ticker} not found` }, { status: 404 });
      }
      return NextResponse.json({ data: company });
    }

    let filtered = COMPANIES;
    if (search) {
      filtered = COMPANIES.filter(
        (c) =>
          c.ticker.toLowerCase().includes(search) ||
          c.name.toLowerCase().includes(search) ||
          c.sector.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ data: filtered, count: filtered.length, isDemoData: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve companies", details: (error as Error).message },
      { status: 500 }
    );
  }
}
