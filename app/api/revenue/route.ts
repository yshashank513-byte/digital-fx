import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({
        success: true,
        totalRevenue: 104993,
        formatted: "₹1,04,993+",
        source: "cached_fallback",
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await supabase
      .from("payments")
      .select("amount, status")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("PUBLIC REVENUE FETCH ERROR:", error);
      return NextResponse.json({
        success: true,
        totalRevenue: 104993,
        formatted: "₹1,04,993+",
        source: "fallback",
      });
    }

    const successfulPayments = (data || []).filter(
      (p) =>
        String(p.status || "").toLowerCase() === "success" ||
        String(p.status || "").toLowerCase() === "paid"
    );

    const totalRevenue = successfulPayments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

    const finalRevenue = Math.max(totalRevenue, 104993);

    return NextResponse.json(
      {
        success: true,
        totalRevenue: finalRevenue,
        formatted: `₹${finalRevenue.toLocaleString("en-IN")}+`,
        successfulCount: successfulPayments.length,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("PUBLIC REVENUE API ERROR:", error);
    return NextResponse.json({
      success: true,
      totalRevenue: 104993,
      formatted: "₹1,04,993+",
      source: "error_fallback",
    });
  }
}
