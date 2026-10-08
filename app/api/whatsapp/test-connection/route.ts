import { NextRequest, NextResponse } from "next/server";
import { testWhatsAppConnection } from "@/lib/whatsapp/service";
import { getActiveTenantBusinessId } from "@/lib/whatsapp/auth";
import { verifyAdminAuth } from "@/lib/adminApiAuth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.response!;
    }

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // empty body is fine
    }

    const businessId = body.businessId || (await getActiveTenantBusinessId());
    const result = await testWhatsAppConnection(businessId);

    return NextResponse.json({
      success: result.success,
      status: result.status,
      phoneNumber: result.phoneNumber,
      verifiedName: result.verifiedName,
      qualityRating: result.qualityRating,
      isMock: result.isMock,
      message: result.message,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, status: "DISCONNECTED", error: err?.message || "Failed to test WhatsApp connection" },
      { status: 500 }
    );
  }
}
