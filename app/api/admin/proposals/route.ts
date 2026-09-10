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
      .ilike("service", "%Strategic Proposal%")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    let proposals = data || [];

    if (status !== "All") {
      proposals = proposals.filter(
        (p) => String(p.status || "").toLowerCase() === status.toLowerCase()
      );
    }

    if (search) {
      proposals = proposals.filter((p) => {
        const name = String(p.name || "").toLowerCase();
        const email = String(p.email || "").toLowerCase();
        const phone = String(p.phone || "").toLowerCase();
        const service = String(p.service || "").toLowerCase();
        const msg = String(p.message || "").toLowerCase();

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
      data: proposals,
      total: proposals.length,
    });
  } catch (error) {
    console.error("ADMIN PROPOSALS GET ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to load proposals.",
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
        { success: false, error: "Proposal ID and status are required." },
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
    console.error("ADMIN PROPOSALS UPDATE ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to update proposal status.",
      },
      { status: 500 }
    );
  }
}
