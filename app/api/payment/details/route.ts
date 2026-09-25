import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdminAuth } from "@/lib/adminApiAuth";
import { checkRateLimit, getClientIp, rateLimitExceededResponse } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Supabase server credentials are missing from .env.local");
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function maskEmail(email?: string | null): string {
  if (!email || !email.includes("@")) return "—";
  const [local, domain] = email.split("@");
  if (local.length <= 2) return `${local[0]}*@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

function maskPhone(phone?: string | null): string {
  if (!phone) return "—";
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "******";
  return `******${digits.slice(-4)}`;
}

export async function GET(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`payment-details:${clientIp}`, {
      windowMs: 60 * 1000,
      max: 20,
    });

    if (!rateLimit.success) {
      return rateLimitExceededResponse(rateLimit);
    }

    const { searchParams } = new URL(request.url);
    const txnid = (searchParams.get("txnid") || "").trim();

    if (!txnid || txnid.length > 80) {
      return NextResponse.json(
        {
          success: false,
          error: "A valid Transaction ID is required.",
        },
        { status: 400 }
      );
    }

    // Check if requester has admin authentication
    const authResult = await verifyAdminAuth(request);
    const isAdmin = authResult.authorized;

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("payments")
      .select(
        "id, txnid, customer_name, customer_email, customer_phone, plan_id, product_name, amount, status, created_at, updated_at"
      )
      .eq("txnid", txnid)
      .maybeSingle();

    if (error) {
      console.error("PAYMENT DETAILS SUPABASE ERROR:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Unable to retrieve payment information.",
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment not found for this transaction ID.",
        },
        { status: 404 }
      );
    }

    // If accessed publicly (non-admin receipt viewing), mask sensitive contact details
    const sanitizedData = isAdmin
      ? data
      : {
          ...data,
          customer_email: maskEmail(data.customer_email),
          customer_phone: maskPhone(data.customer_phone),
        };

    return NextResponse.json(
      {
        success: true,
        data: sanitizedData,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("PAYMENT DETAILS API ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to load payment details.",
      },
      { status: 500 }
    );
  }
}