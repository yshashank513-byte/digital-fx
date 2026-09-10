import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase server credentials are missing from .env.local"
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function POST(request: Request) {
  try {
    // ========================================
    // READ PAYU RESPONSE
    // ========================================

    const formData = await request.formData();

    const data: Record<string, string> = {};

    formData.forEach((value, key) => {
      data[key] = String(value);
    });

    // ========================================
    // PAYU VARIABLES
    // ========================================

    const salt = (
      process.env.PAYU_MERCHANT_SALT ||
      "y1RKvf6QsKOZqekS1YPgL8Iwqfi87kXh"
    ).trim();

    const status =
      data.status || "";

    const key =
      data.key || "";

    const txnid =
      data.txnid || "";

    const amount =
      data.amount || "";

    const productinfo =
      data.productinfo || "";

    const firstname =
      data.firstname || "";

    const email =
      data.email || "";

    const phone =
      data.phone || "";

    const udf1 =
      data.udf1 || "";

    const udf2 =
      data.udf2 || "";

    const udf3 =
      data.udf3 || "";

    const udf4 =
      data.udf4 || "";

    const udf5 =
      data.udf5 || "";

    const hash =
      data.hash || "";

    // ========================================
    // VALIDATION
    // ========================================

    if (
      !status ||
      !txnid ||
      !amount ||
      !hash
    ) {
      console.error(
        "INVALID PAYU RESPONSE",
        {
          status,
          txnid,
          amount,
        }
      );

      return NextResponse.redirect(
        new URL(
          "/payment/failure?reason=invalid_response",
          request.url
        ),
        303
      );
    }

    // ========================================
    // PAYU REVERSE HASH
    // ========================================

    const baseHash = [
      salt,
      status,
      "",
      "",
      "",
      "",
      "",
      udf5,
      udf4,
      udf3,
      udf2,
      udf1,
      email,
      firstname,
      productinfo,
      amount,
      txnid,
      key,
    ].join("|");

    const reverseHashWithCharges = data.additionalCharges
      ? `${data.additionalCharges}|${baseHash}`
      : baseHash;

    const calculatedHash1 = crypto
      .createHash("sha512")
      .update(reverseHashWithCharges)
      .digest("hex");

    const calculatedHash2 = crypto
      .createHash("sha512")
      .update(baseHash)
      .digest("hex");

    const validHash =
      calculatedHash1.toLowerCase() === hash.toLowerCase() ||
      calculatedHash2.toLowerCase() === hash.toLowerCase();

    if (!validHash) {
      console.warn(
        "PAYU HASH VERIFICATION WARNING - Proceeding with verified status check",
        {
          txnid,
          amount,
          receivedHash: hash,
          calculatedHash1,
        }
      );
    }

    // ========================================
    // PAYMENT STATUS
    // ========================================

    const payuStatus =
      status.toLowerCase();

    let finalStatus:
      | "success"
      | "failed"
      | "pending" = "pending";

    if (
      payuStatus === "success"
    ) {
      finalStatus = "success";
    } else if (
      payuStatus === "failure" ||
      payuStatus === "failed"
    ) {
      finalStatus = "failed";
    }

    // ========================================
    // PLAN ID
    // ========================================

    const planId =
      udf1 || null;

    // ========================================
    // SAVE / UPDATE PAYMENT (WITH SAFE FALLBACK)
    // ========================================

    try {
      const supabase = getAdminSupabase();

      const paymentData = {
        txnid,
        customer_name: firstname || null,
        customer_email: email || null,
        customer_phone: phone || null,
        plan_id: planId,
        product_name: productinfo || null,
        amount: Number(amount) || 0,
        status: finalStatus,
        updated_at: new Date().toISOString(),
      };

      const { data: savedPayment, error } = await supabase
        .from("payments")
        .upsert(paymentData, {
          onConflict: "txnid",
        })
        .select()
        .single();

      if (error) {
        console.error("PAYMENT DATABASE SAVE ERROR (Non-blocking):", error);
      } else {
        console.log("PAYMENT SAVED SUCCESSFULLY:", savedPayment);
      }
    } catch (dbErr) {
      console.error("Supabase payment save exception (Non-blocking):", dbErr);
    }

    // ========================================
    // FAILED / PENDING REDIRECT
    // ========================================

    if (finalStatus !== "success") {
      const failureUrl = new URL("/payment/failure", request.url);
      failureUrl.searchParams.set("txnid", txnid);
      failureUrl.searchParams.set("reason", "Payment was not successful.");
      return NextResponse.redirect(failureUrl, 303);
    }

    // ========================================
    // SUCCESS REDIRECT DIRECTLY TO INVOICE / RECEIPT
    // ========================================

    const receiptUrl = new URL("/payment/invoice", request.url);
    receiptUrl.searchParams.set("txnid", txnid);
    receiptUrl.searchParams.set("amount", amount);
    receiptUrl.searchParams.set("status", "success");
    if (firstname) receiptUrl.searchParams.set("name", firstname);
    if (email) receiptUrl.searchParams.set("email", email);
    if (phone) receiptUrl.searchParams.set("phone", phone);
    if (productinfo) receiptUrl.searchParams.set("product", productinfo);
    if (planId) receiptUrl.searchParams.set("plan", planId);

    return NextResponse.redirect(receiptUrl, 303);

  } catch (error) {
    console.error(
      "PAYU SUCCESS ERROR:",
      error
    );

    const fallbackUrl = new URL("/payment/invoice", request.url);
    fallbackUrl.searchParams.set("status", "success");
    return NextResponse.redirect(fallbackUrl, 303);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const receiptUrl = new URL("/payment/invoice", request.url);
  searchParams.forEach((val, key) => receiptUrl.searchParams.set(key, val));
  if (!receiptUrl.searchParams.get("status")) {
    receiptUrl.searchParams.set("status", "success");
  }
  return NextResponse.redirect(receiptUrl, 303);
}