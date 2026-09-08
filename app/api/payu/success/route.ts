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

    const reverseHashString = [
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

    const calculatedHash =
      crypto
        .createHash("sha512")
        .update(reverseHashString)
        .digest("hex");

    const validHash =
      calculatedHash.toLowerCase() ===
      hash.toLowerCase();

    if (!validHash) {
      console.error(
        "PAYU HASH VERIFICATION FAILED",
        {
          txnid,
          amount,
        }
      );

      return NextResponse.redirect(
        new URL(
          `/payment/failure?txnid=${encodeURIComponent(
            txnid
          )}&reason=invalid_response`,
          request.url
        ),
        303
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
    // SUPABASE
    // ========================================

    const supabase =
      getAdminSupabase();

    // ========================================
    // SAVE / UPDATE PAYMENT
    // ========================================

    const paymentData = {
      txnid,

      customer_name:
        firstname || null,

      customer_email:
        email || null,

      customer_phone:
        phone || null,

      plan_id:
        planId,

      product_name:
        productinfo || null,

      amount:
        Number(amount) || 0,

      status:
        finalStatus,

      updated_at:
        new Date().toISOString(),
    };

    const { data: savedPayment, error } =
      await supabase
        .from("payments")
        .upsert(
          paymentData,
          {
            onConflict: "txnid",
          }
        )
        .select()
        .single();

    // ========================================
    // DATABASE ERROR
    // ========================================

    if (error) {
      console.error(
        "PAYMENT DATABASE SAVE ERROR:",
        error
      );

      return new NextResponse(
        `Payment received but database update failed: ${error.message}`,
        { status: 500 }
      );
    }

    // ========================================
    // SUCCESS LOG
    // ========================================

    console.log(
      "PAYMENT SAVED SUCCESSFULLY:",
      savedPayment
    );

    // ========================================
    // FAILED / PENDING
    // ========================================

    if (
      finalStatus !== "success"
    ) {
      const failureUrl =
        new URL(
          "/payment/failure",
          request.url
        );

      failureUrl.searchParams.set(
        "txnid",
        txnid
      );

      failureUrl.searchParams.set(
        "reason",
        "Payment was not successful."
      );

      return NextResponse.redirect(
        failureUrl,
        303
      );
    }

    // ========================================
    // SUCCESS REDIRECT
    // ========================================

    const successUrl =
      new URL(
        "/payment/success",
        request.url
      );

    successUrl.searchParams.set(
      "txnid",
      txnid
    );

    successUrl.searchParams.set(
      "amount",
      amount
    );

    return NextResponse.redirect(
      successUrl,
      303
    );

  } catch (error) {
    console.error(
      "PAYU SUCCESS ERROR:",
      error
    );

    return new NextResponse(
      error instanceof Error
        ? error.message
        : "Unable to process payment response.",
      { status: 500 }
    );
  }
}