"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const txnid = searchParams.get("txnid") || "";
  const amount = searchParams.get("amount") || "";

  const formattedAmount = Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  function handlePaymentDetails() {
    if (!txnid) {
      router.push("/payment/invoice");
      return;
    }

    router.push(
      `/payment/invoice?txnid=${encodeURIComponent(
        txnid
      )}&amount=${encodeURIComponent(amount)}`
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-5 py-10">
      <div className="w-full max-w-[540px] rounded-[30px] border border-gray-100 bg-white p-7 text-center shadow-[0_25px_80px_rgba(7,21,52,0.12)] sm:p-9">

        {/* SUCCESS ICON */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-2xl font-black text-white shadow-lg shadow-emerald-500/20">
            ✓
          </div>
        </div>

        {/* TITLE */}
        <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[2px] text-emerald-500">
          PAYMENT SUCCESSFUL
        </p>

        <h1 className="mt-2 text-3xl font-extrabold tracking-[-1px] text-[#071534] sm:text-[34px]">
          Payment Successful
        </h1>

        <p className="mx-auto mt-3 max-w-[400px] text-sm leading-6 text-gray-500">
          Thank you for your payment. Your transaction has been successfully
          received and verified by Digital FX.
        </p>

        {/* PAYMENT SUMMARY */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 text-left">

          {/* AMOUNT */}
          <div className="p-5">
            <p className="text-[9px] font-extrabold uppercase tracking-[1.2px] text-gray-400">
              Amount Paid
            </p>

            <p className="mt-2 text-3xl font-black text-emerald-600">
              ₹{formattedAmount}
            </p>
          </div>

          <div className="border-t border-gray-200" />

          {/* TRANSACTION ID */}
          <div className="p-5">
            <p className="text-[9px] font-extrabold uppercase tracking-[1.2px] text-gray-400">
              Transaction ID
            </p>

            <p className="mt-2 break-all font-mono text-[11px] font-bold leading-5 text-[#071534]">
              {txnid || "-"}
            </p>
          </div>

          <div className="border-t border-gray-200" />

          {/* CONFIRMATION */}
          <div className="flex items-center gap-3 p-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-600">
              ✓
            </div>

            <div>
              <p className="text-xs font-extrabold text-[#071534]">
                Verified by Digital FX Desk
              </p>

              <p className="mt-1 text-[10px] leading-4 text-gray-400">
                Official payment receipt &amp; tax invoice ready for download.
              </p>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          {/* BACK TO WEBSITE */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="h-12 flex-1 rounded-xl border border-gray-200 bg-white px-5 text-xs font-extrabold text-[#071534] transition hover:bg-gray-50 cursor-pointer"
          >
            Back to Website
          </button>

          {/* PAYMENT RECEIPT */}
          <button
            type="button"
            onClick={handlePaymentDetails}
            className="h-12 flex-1 rounded-xl bg-[#155EEF] px-5 text-xs font-extrabold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#0f4ed8] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>View &amp; Print Receipt</span>
            <span>→</span>
          </button>
        </div>

        {/* SECURITY NOTE */}
        <div className="mt-7 flex items-center justify-center gap-2">
          <span className="text-xs text-emerald-500">
            ✓
          </span>

          <p className="text-[9px] font-semibold text-gray-400">
            Secure payment processed by PayU
          </p>
        </div>

        {/* FOOTER */}
        <p className="mt-5 text-[9px] text-gray-400">
          Digital FX • Secure Payment Processing
        </p>
      </div>
    </main>
  );
}

/*
  Suspense wrapper is required because
  useSearchParams() is used inside the page.
*/
export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-5">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#315df5]" />
            <p className="mt-4 text-sm font-semibold text-gray-500">
              Loading payment details...
            </p>
          </div>
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}