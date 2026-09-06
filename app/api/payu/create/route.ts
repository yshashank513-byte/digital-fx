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

type PlanId = keyof typeof PLANS;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const planId = String(
      body?.planId || ""
    ).trim() as PlanId;

    const firstname = String(
      body?.firstname || ""
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

    if (!planId || !PLANS[planId]) {
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
    // PAYU CREDENTIALS
    // ========================================

    const merchantKey =
      process.env.PAYU_MERCHANT_KEY?.trim();

    const merchantSalt =
      process.env.PAYU_MERCHANT_SALT?.trim();

    const siteUrl =
      (
        process.env.NEXT_PUBLIC_SITE_URL ||
        "http://localhost:3000"
      ).trim();

    if (!merchantKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "PAYU_MERCHANT_KEY is missing from .env.local",
        },
        { status: 500 }
      );
    }

    if (!merchantSalt) {
      return NextResponse.json(
        {
          success: false,
          error:
            "PAYU_MERCHANT_SALT is missing from .env.local",
        },
        { status: 500 }
      );
    }

    // ========================================
    // PLAN
    // ========================================

    const plan = PLANS[planId];

    const amount = plan.amount;
    const productinfo = plan.name;

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

    return NextResponse.json({
      success: true,

      data: {
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

        surl:
          `${siteUrl}/api/payu/success`,

        furl:
          `${siteUrl}/api/payu/failure`,

        curl:
          `${siteUrl}/api/payu/failure`,

        action:
          "https://test.payu.in/_payment",
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