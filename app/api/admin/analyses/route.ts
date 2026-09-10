import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json(
        { success: false, error: "Supabase configuration is missing." },
        { status: 500 }
      );
    }

    const client = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const url = new URL(request.url);
    const filter = url.searchParams.get("filter") || "all";
    const search = (url.searchParams.get("search") || "").trim().toLowerCase();

    const { data, error } = await client
      .from("geo_analyses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    let analyses = data || [];

    // Filter by type
    if (filter === "free") {
      analyses = analyses.filter((a) => (a.ai_analysis?.analysis_type || "free") === "free");
    } else if (filter === "paid") {
      analyses = analyses.filter((a) => a.ai_analysis?.analysis_type === "paid");
    } else if (filter === "pending") {
      analyses = analyses.filter((a) => (a.ai_analysis?.analysis_status || "completed") === "pending");
    } else if (filter === "completed") {
      analyses = analyses.filter((a) => (a.ai_analysis?.analysis_status || "completed") === "completed");
    }

    // Search by customer name, email, phone, website url
    if (search) {
      analyses = analyses.filter((a) => {
        const cName = String(a.ai_analysis?.customer_name || "").toLowerCase();
        const cEmail = String(a.ai_analysis?.customer_email || "").toLowerCase();
        const cPhone = String(a.ai_analysis?.customer_phone || "").toLowerCase();
        const aUrl = String(a.url || "").toLowerCase();
        const title = String(a.title || "").toLowerCase();

        return (
          cName.includes(search) ||
          cEmail.includes(search) ||
          cPhone.includes(search) ||
          aUrl.includes(search) ||
          title.includes(search)
        );
      });
    }

    return NextResponse.json({
      success: true,
      data: analyses,
      total: analyses.length,
    });
  } catch (error) {
    console.error("ADMIN ANALYSES API ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to load analyses.",
      },
      { status: 500 }
    );
  }
}
