import { NextResponse } from "next/server";
import { getAllBusinesses, saveBusiness, getAnalyticsSummary } from "@/lib/reviewFlowStore";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const withAnalytics = url.searchParams.get("analytics") === "true";

    if (withAnalytics) {
      const summary = await getAnalyticsSummary();
      const businesses = await getAllBusinesses();
      return NextResponse.json({
        success: true,
        businesses,
        analytics: summary,
      });
    }

    const businesses = await getAllBusinesses();
    return NextResponse.json({ success: true, businesses });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load businesses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, googleReviewUrl } = body;

    if (!name || !category || !googleReviewUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Business Name, Category and Google Review URL are required.",
        },
        { status: 400 }
      );
    }

    const saved = await saveBusiness(body);
    return NextResponse.json({ success: true, business: saved });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save business" },
      { status: 500 }
    );
  }
}
