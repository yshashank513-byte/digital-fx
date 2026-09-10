import { NextResponse } from "next/server";
import crypto from "crypto";

import { supabase } from "../../../lib/supabase";

const PLANS = {
  google_listing: {
    name: "Google Business Listing",
    amount: "2999.00",
  },

  website: {
    name: "Website Development",
    amount: "5999.00",
  },

  growth: {
    name: "Digital Growth Package",
    amount: "9999.00",
  },
} as const;

type PlanId = (keyof typeof PLANS) | "custom";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const planId = String(
      body?.planId || ""
    ).trim() as PlanId;

    const firstname = String(
      body?.firstname || body?.name || ""
    ).trim();

    const email = String(
      body?.email || ""
    ).trim();

    const phone = String(
      body?.phone || ""
    ).trim();

    // ========================================
    // VALIDATION
    // ========================================

    const isCustom = planId === "custom";
    if (!planId || (!PLANS[planId as keyof typeof PLANS] && !isCustom)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid package selected.",
        },
        { status: 400 }
      );
    }

    if (!firstname) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer name is required.",
        },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer email is required.",
        },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer phone is required.",
        },
        { status: 400 }
      );
    }

    // ========================================
    // PAYU CREDENTIALS (WITH TEST FALLBACK)
    // ========================================

    const merchantKey = (
      process.env.PAYU_MERCHANT_KEY || "Keiaiw"
    ).trim();

    const merchantSalt = (
      process.env.PAYU_MERCHANT_SALT || "y1RKvf6QsKOZqekS1YPgL8Iwqfi87kXh"
    ).trim();

    const requestUrl = new URL(request.url);
    const hostHeader = request.headers.get("x-forwarded-host") || request.headers.get("host") || requestUrl.host;
    const protoHeader = request.headers.get("x-forwarded-proto") || requestUrl.protocol.replace(":", "");
    const originHeader = request.headers.get("origin");
    const siteUrl = (
      originHeader ||
      (hostHeader ? `${protoHeader}://${hostHeader}` : "") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      `${requestUrl.protocol}//${requestUrl.host}`
    ).replace(/\/$/, "");

    // ========================================
    // PLAN & AMOUNT RESOLUTION
    // ========================================

    let amount = "";
    let productinfo = "";

    if (planId === "custom") {
      const customVal = Number(body?.customAmount || body?.amount || 0);
      if (!customVal || isNaN(customVal) || customVal < 1) {
        return NextResponse.json(
          {
            success: false,
            error: "Please enter a valid custom payment amount (minimum ₹1).",
          },
          { status: 400 }
        );
      }
      amount = customVal.toFixed(2);
      productinfo = String(body?.productinfo || "Custom Scope / Bespoke Retainer").trim();
    } else {
      const plan = PLANS[planId as keyof typeof PLANS];
      amount = plan.amount;
      productinfo = plan.name;
    }

    // ========================================
    // TRANSACTION ID
    // ========================================

    const txnid =
      `DFX_${Date.now()}_${crypto
        .randomBytes(4)
        .toString("hex")}`;

    // ========================================
    // UDF
    // ========================================

    const udf1 = planId;
    const udf2 = "";
    const udf3 = "";
    const udf4 = "";
    const udf5 = "";

    // ========================================
    // EXACT PAYU HASH STRING
    // ========================================

    const hashString =
      merchantKey +
      "|" +
      txnid +
      "|" +
      amount +
      "|" +
      productinfo +
      "|" +
      firstname +
      "|" +
      email +
      "|" +
      udf1 +
      "|" +
      udf2 +
      "|" +
      udf3 +
      "|" +
      udf4 +
      "|" +
      udf5 +
      "||||||" +
      merchantSalt;

    console.log(
      "PAYU HASH DEBUG:",
      {
        keyLength: merchantKey.length,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        udf1,
        hashStringWithoutSalt:
          hashString.replace(
            merchantSalt,
            "[SALT]"
          ),
      }
    );

    const hash = crypto
      .createHash("sha512")
      .update(hashString, "utf8")
      .digest("hex")
      .toLowerCase();

    // ========================================
    // SAVE PAYMENT ORDER
    // ========================================

    const { error: saveError } =
      await supabase
        .from("payments")
        .insert({
          txnid,

          customer_name:
            firstname,

          customer_email:
            email,

          customer_phone:
            phone,

          plan_id:
            planId,

          product_name:
            productinfo,

          amount:
            Number(amount),

          status:
            "pending",
        });

    if (saveError) {
      console.error(
        "PAYMENT SAVE ERROR:",
        saveError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to create payment order.",
        },
        { status: 500 }
      );
    }

    // ========================================
    // PAYU CHECKOUT
    // ========================================

    const payuAction =
      process.env.PAYU_ACTION_URL || "https://test.payu.in/_payment";

    const payuParams = {
      key: merchantKey,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      hash,
      surl: `${siteUrl}/api/payu/success`,
      furl: `${siteUrl}/api/payu/failure`,
      curl: `${siteUrl}/api/payu/failure`,
    };

    return NextResponse.json({
      success: true,
      actionUrl: payuAction,
      params: payuParams,
      data: {
        ...payuParams,
        action: payuAction,
      },
    });
  } catch (error) {
    console.error(
      "PAYU CREATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to create PayU payment.",
      },
      { status: 500 }
    );
  }
}