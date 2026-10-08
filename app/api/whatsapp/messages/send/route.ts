import { NextRequest, NextResponse } from "next/server";
import { sendWhatsAppMessage, sendWhatsAppTemplate } from "@/lib/whatsapp/service";
import { getActiveTenantBusinessId } from "@/lib/whatsapp/auth";
import { verifyAdminAuth } from "@/lib/adminApiAuth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.response!;
    }

    const body = await request.json();
    const activeBusinessId = await getActiveTenantBusinessId();
    const businessId = body.businessId || activeBusinessId;

    if (!body.recipientPhone) {
      return NextResponse.json({ error: "recipientPhone is required" }, { status: 400 });
    }

    if (body.type === "template" && body.templateName) {
      const result = await sendWhatsAppTemplate({
        businessId,
        recipientPhone: body.recipientPhone,
        templateName: body.templateName,
        language: body.language || "en_US",
        variables: body.variables || {},
        conversationId: body.conversationId,
      });
      return NextResponse.json(result);
    }

    if (!body.text) {
      return NextResponse.json({ error: "text or templateName is required" }, { status: 400 });
    }

    const result = await sendWhatsAppMessage({
      businessId,
      recipientPhone: body.recipientPhone,
      text: body.text,
      conversationId: body.conversationId,
      senderName: body.senderName,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to send message" }, { status: 500 });
  }
}
