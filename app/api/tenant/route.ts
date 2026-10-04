import { NextRequest, NextResponse } from "next/server";
import { getTenantData, loadStore, resetDemoData } from "@/lib/whatsapp/store";
import { getActiveTenantBusinessId, TENANT_COOKIE_NAME } from "@/lib/whatsapp/auth";

export async function GET(request: NextRequest) {
  try {
    const requestedId = request.nextUrl.searchParams.get("businessId");
    const activeId = requestedId || (await getActiveTenantBusinessId());
    const tenantData = getTenantData(activeId);

    return NextResponse.json(tenantData);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to fetch tenant data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === "reset_demo_data") {
      resetDemoData();
      return NextResponse.json({ success: true, message: "Demo data restored to initial state." });
    }

    if (body.action === "switch_tenant" && body.businessId) {
      const store = loadStore();
      const business = store.businesses.find((b) => b.id === body.businessId);
      if (!business) {
        return NextResponse.json({ error: "Business not found" }, { status: 404 });
      }

      const response = NextResponse.json({
        success: true,
        businessId: business.id,
        businessName: business.name,
      });

      // Set cookie for persistence across navigation
      response.cookies.set({
        name: TENANT_COOKIE_NAME,
        value: business.id,
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: "lax",
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Tenant operation failed" }, { status: 500 });
  }
}
