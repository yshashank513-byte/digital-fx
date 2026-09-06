import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const txnid = String(
      formData.get("txnid") || ""
    );

    const reason = String(
      formData.get("error_Message") ||
        formData.get("error") ||
        "Payment was not completed."
    );

    console.error("PAYU PAYMENT FAILED", {
      txnid,
      reason,
    });

    // Customer-facing failure page
    const url = new URL(
      "/payment/failure",
      request.url
    );

    if (txnid) {
      url.searchParams.set(
        "txnid",
        txnid
      );
    }

    if (reason) {
      url.searchParams.set(
        "reason",
        reason
      );
    }

    return NextResponse.redirect(url);
  } catch (error) {
    console.error(
      "PAYU FAILURE ERROR:",
      error
    );

    return NextResponse.redirect(
      new URL(
        "/payment/failure",
        request.url
      )
    );
  }
}