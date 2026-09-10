import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json(
        { success: false, error: "Supabase configuration is missing." },
        { status: 500 }
      );
    }

    // Client for public tables (enquiries, geo_analyses)
    const clientPublic = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Client for service-role protected tables (payments)
    const clientService = serviceRoleKey
      ? createClient(supabaseUrl, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        })
      : clientPublic;

    // Parallel fetch from all real database tables
    const [enquiriesRes, geoRes, paymentsRes] = await Promise.all([
      clientPublic
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false }),
      clientPublic
        .from("geo_analyses")
        .select("*")
        .order("created_at", { ascending: false }),
      clientService
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    const enquiries = enquiriesRes.data || [];
    const geoAnalyses = geoRes.data || [];
    const payments = paymentsRes.data || [];

    // Separate regular enquiries vs strategic proposals
    const regularEnquiries = enquiries.filter(
      (e) => !String(e.service || "").toLowerCase().includes("strategic proposal")
    );
    const strategicProposals = enquiries.filter((e) =>
      String(e.service || "").toLowerCase().includes("strategic proposal")
    );

    // Free vs Paid Analyses
    const freeAnalyses = geoAnalyses.filter((g) => {
      const type = g.ai_analysis?.analysis_type;
      return type !== "paid";
    });
    const paidAnalyses = geoAnalyses.filter((g) => {
      const type = g.ai_analysis?.analysis_type;
      return type === "paid";
    });

    // Revenue from verified successful payments ONLY
    const successfulPayments = payments.filter(
      (p) => String(p.status || "").toLowerCase() === "success" || String(p.status || "").toLowerCase() === "paid"
    );
    const totalRevenue = successfulPayments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

    const pendingPayments = payments.filter(
      (p) => String(p.status || "").toLowerCase() === "pending"
    );

    // Recent Activity Builder (Combines real events across all modules)
    type ActivityItem = {
      id: string;
      type: "analysis" | "enquiry" | "proposal" | "payment";
      customer: string;
      website: string;
      service: string;
      timestamp: string;
      status: string;
      amount?: number;
      score?: number;
    };

    const activities: ActivityItem[] = [];

    // Add recent enquiries
    regularEnquiries.slice(0, 8).forEach((e) => {
      activities.push({
        id: `enquiry-${e.id}`,
        type: "enquiry",
        customer: e.name || "Customer",
        website: e.message?.match(/Target Website:\s*([^\s\n]+)/i)?.[1] || e.message?.match(/Website:\s*([^\s\n|]+)/i)?.[1] || "—",
        service: e.service || "General Enquiry",
        timestamp: e.created_at,
        status: e.status || "New",
      });
    });

    // Add recent proposals
    strategicProposals.slice(0, 8).forEach((p) => {
      activities.push({
        id: `proposal-${p.id}`,
        type: "proposal",
        customer: p.name || "Customer",
        website: p.message?.match(/Target Website:\s*([^\s\n]+)/i)?.[1] || p.message?.match(/Website:\s*([^\s\n|]+)/i)?.[1] || "—",
        service: p.service || "Strategic Proposal",
        timestamp: p.created_at,
        status: p.status || "New",
      });
    });

    // Add recent analyses
    geoAnalyses.slice(0, 8).forEach((g) => {
      activities.push({
        id: `analysis-${g.id}`,
        type: "analysis",
        customer: g.ai_analysis?.customer_name || "Website Visitor",
        website: g.url || "—",
        service: g.ai_analysis?.service || "GEO AI Search Audit",
        timestamp: g.created_at,
        status: g.ai_analysis?.analysis_status || "completed",
        score: g.overall || g.score || 0,
      });
    });

    // Add recent payments
    payments.slice(0, 8).forEach((p) => {
      activities.push({
        id: `payment-${p.id || p.txnid}`,
        type: "payment",
        customer: p.customer_name || "Customer",
        website: "Digital FX Checkout",
        service: p.product_name || p.plan_id || "Package Payment",
        timestamp: p.created_at,
        status: p.status === "success" ? "Paid" : p.status === "pending" ? "Payment Pending" : "Failed",
        amount: Number(p.amount || 0),
      });
    });

    // Sort by latest timestamp
    activities.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({
      success: true,
      stats: {
        totalEnquiries: regularEnquiries.length,
        freeAnalyses: freeAnalyses.length,
        paidAnalyses: paidAnalyses.length,
        strategicProposals: strategicProposals.length,
        totalRevenue: Math.round(totalRevenue),
        pendingPayments: pendingPayments.length,
      },
      recentActivity: activities.slice(0, 10),
      recentEnquiries: regularEnquiries.slice(0, 5),
      recentProposals: strategicProposals.slice(0, 5),
    });
  } catch (error) {
    console.error("ADMIN STATS API ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to load stats.",
      },
      { status: 500 }
    );
  }
}
