import { NextResponse } from "next/server";
import { RECOMMENDATIONS } from "@/data/recommendations";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker")?.toUpperCase();
    const priority = searchParams.get("priority");
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    let items = RECOMMENDATIONS;

    if (ticker) {
      items = items.filter((r) => r.companyTicker === ticker);
    }
    if (priority) {
      items = items.filter((r) => r.priority === priority);
    }
    if (category) {
      items = items.filter((r) => r.category === category);
    }
    if (status) {
      items = items.filter((r) => r.status === status);
    }

    return NextResponse.json({
      data: items,
      totalCount: items.length,
      isDemoData: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve recommendations", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const rec = RECOMMENDATIONS.find((r) => r.id === id);
    if (!rec) {
      return NextResponse.json({ error: "Recommendation not found" }, { status: 404 });
    }

    rec.status = status;
    rec.updatedAt = new Date().toISOString();

    return NextResponse.json({ success: true, data: rec });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update recommendation", details: (error as Error).message },
      { status: 500 }
    );
  }
}
