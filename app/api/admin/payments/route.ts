import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdminAuth } from "@/lib/adminApiAuth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.response!;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase server credentials are missing.",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("PAYMENTS DATABASE ERROR:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    const payments = (data || []).filter(
      (p) => String(p.status || "").toLowerCase() !== "deleted"
    );

    return NextResponse.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error("PAYMENTS API ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load payments.",
      },
      { status: 500 }
    );
  }
}


export async function DELETE(request: Request) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.response!;
    }
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { success: false, error: "Supabase server credentials are missing." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const body = await request.json();
    if (body?.clearAll) {
      const { data: allItems } = await supabase.from("payments").select("id");
      if (Array.isArray(allItems)) {
        for (const item of allItems) {
          await supabase.from("payments").update({ status: "deleted" }).eq("id", item.id);
        }
      }
      return NextResponse.json({ success: true, message: "All payments cleared." });
    }

    const id = String(body?.id || "").trim();
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Payment ID is required." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("payments")
      .update({ status: "deleted" })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Payment record deleted." });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Delete failed." },
      { status: 500 }
    );
  }
}
