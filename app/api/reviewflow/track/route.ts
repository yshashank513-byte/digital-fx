import { NextResponse } from "next/server";
import { recordScan, recordVisit, recordGoogleClick, saveReviewSession } from "@/lib/reviewFlowStore";
import { checkRateLimit, getClientIp, rateLimitExceededResponse } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`reviewflow-track:${clientIp}`, {
      windowMs: 60 * 1000,
      max: 60,
    });

    if (!rateLimit.success) {
      return rateLimitExceededResponse(rateLimit);
    }
    const body = await request.json();
    const { businessId, eventType, sessionData } = body;

    if (!businessId || !eventType) {
      return NextResponse.json(
        { success: false, error: "businessId and eventType are required." },
        { status: 400 }
      );
    }

    if (eventType === "scan") {
      await recordScan(businessId);
    } else if (eventType === "visit") {
      await recordVisit(businessId);
    } else if (eventType === "google_click") {
      await recordGoogleClick(businessId);
      if (sessionData && sessionData.sessionId) {
        await saveReviewSession({
          ...sessionData,
          completed: true,
          clickedGoogleReview: true,
        });
      }
    }

    return NextResponse.json({ success: true, recorded: eventType });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to record event" },
      { status: 500 }
    );
  }
}
