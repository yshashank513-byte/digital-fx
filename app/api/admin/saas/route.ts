import { NextRequest, NextResponse } from "next/server";
import { getSuperAdminDashboardData, loadStore, persistStore, resetDemoData } from "@/lib/whatsapp/store";
import { PlanTier } from "@/lib/whatsapp/types";

export async function GET(request: NextRequest) {
  try {
    const data = getSuperAdminDashboardData();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to fetch super admin data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const store = loadStore();

    switch (body.action) {
      case "suspend_business": {
        const biz = store.businesses.find((b) => b.id === body.businessId);
        if (!biz) return NextResponse.json({ error: "Business not found" }, { status: 404 });
        biz.status = "suspended";
        biz.subscriptionStatus = "paused";
        persistStore(store);
        return NextResponse.json({ success: true, business: biz });
      }

      case "activate_business": {
        const biz = store.businesses.find((b) => b.id === body.businessId);
        if (!biz) return NextResponse.json({ error: "Business not found" }, { status: 404 });
        biz.status = "active";
        biz.subscriptionStatus = "active";
        persistStore(store);
        return NextResponse.json({ success: true, business: biz });
      }

      case "change_plan": {
        const biz = store.businesses.find((b) => b.id === body.businessId);
        if (!biz) return NextResponse.json({ error: "Business not found" }, { status: 404 });
        const plan = store.plans.find((p) => p.id === body.planId || p.tier === body.planTier);
        if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });
        biz.planId = plan.id;
        biz.planTier = plan.tier as PlanTier;
        persistStore(store);
        return NextResponse.json({ success: true, business: biz, plan });
      }

      case "delete_business": {
        store.businesses = store.businesses.filter((b) => b.id !== body.businessId);
        store.leads = store.leads.filter((l) => l.businessId !== body.businessId);
        store.customers = store.customers.filter((c) => c.businessId !== body.businessId);
        store.conversations = store.conversations.filter((c) => c.businessId !== body.businessId);
        persistStore(store);
        return NextResponse.json({ success: true });
      }

      case "reset_account": {
        // Clear activity/usage for specific business
        const usage = store.usage.find((u) => u.businessId === body.businessId);
        if (usage) {
          usage.messagesSent = 0;
          usage.messagesDelivered = 0;
          usage.messagesFailed = 0;
        }
        persistStore(store);
        return NextResponse.json({ success: true });
      }

      case "reset_all_demo": {
        const fresh = resetDemoData();
        return NextResponse.json({ success: true, message: "All demo data restored to initial state." });
      }

      default:
        return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Operation failed" }, { status: 500 });
  }
}
