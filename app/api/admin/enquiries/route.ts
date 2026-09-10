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
    const status = url.searchParams.get("status") || "All";
    const search = (url.searchParams.get("search") || "").trim().toLowerCase();

    const { data, error } = await client
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    let enquiries = data || [];

    // Exclude proposals if needed or keep both with filter
    const onlyEnquiries = url.searchParams.get("type") === "general";
    if (onlyEnquiries) {
      enquiries = enquiries.filter(
        (e) => !String(e.service || "").toLowerCase().includes("strategic proposal")
      );
    }

    if (status !== "All") {
      enquiries = enquiries.filter(
        (e) => String(e.status || "").toLowerCase() === status.toLowerCase()
      );
    }

    if (search) {
      enquiries = enquiries.filter((e) => {
        const name = String(e.name || "").toLowerCase();
        const email = String(e.email || "").toLowerCase();
        const phone = String(e.phone || "").toLowerCase();
        const service = String(e.service || "").toLowerCase();
        const msg = String(e.message || "").toLowerCase();

        return (
          name.includes(search) ||
          email.includes(search) ||
          phone.includes(search) ||
          service.includes(search) ||
          msg.includes(search)
        );
      });
    }

    return NextResponse.json({
      success: true,
      data: enquiries,
      total: enquiries.length,
    });
  } catch (error) {
    console.error("ADMIN ENQUIRIES GET ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to load enquiries.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
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

    const body = await request.json();
    const id = Number(body?.id);
    const newStatus = String(body?.status || "").trim();

    if (!id || !newStatus) {
      return NextResponse.json(
        { success: false, error: "Enquiry ID and status are required." },
        { status: 400 }
      );
    }

    const { data, error } = await client
      .from("enquiries")
      .update({ status: newStatus })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("ADMIN ENQUIRY UPDATE ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to update enquiry status.",
      },
      { status: 500 }
    );
  }
}
