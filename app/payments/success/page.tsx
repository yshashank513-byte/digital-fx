"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();

  const txnid = searchParams.get("txnid");
  const amount = searchParams.get("amount");

  const formattedAmount =
    amount && !Number.isNaN(Number(amount))
      ? Number(amount).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : amount;

  return (
    <main className="min-h-screen bg-[#f5f8ff] px-5 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
        <div className="w-full rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-[0_25px_80px_rgba(15,23,42,.10)] md:p-12">

          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg">
              <img
                src="/logo.png"
                alt="Digital FX"
                className="h-full w-full object-contain p-2"
              />
            </div>
          </div>

          {/* Success Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-2xl font-black text-white">
              ✓
            </div>
          </div>

          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-emerald-600">
            Payment Successful
          </p>

          <h1 className="text-3xl font-black tracking-tight text-[#101828] md:text-4xl">
            Thank you for your payment!
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-slate-500">
            Your payment has been received successfully.
            Our Digital FX team will contact you shortly
            regarding your selected service.
          </p>

          {/* Transaction */}
          <div className="mt-8 rounded-2xl bg-[#f7f9fc] p-5 text-left">
            {txnid && (
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <span className="text-sm text-slate-500">
                  Transaction ID
                </span>

                <span className="max-w-[60%] break-all text-right text-sm font-bold text-[#101828]">
                  {txnid}
                </span>
              </div>
            )}

            {amount && (
              <div
                className={`flex items-center justify-between gap-4 ${
                  txnid ? "pt-4" : ""
                }`}
              >
                <span className="text-sm text-slate-500">
                  Amount Paid
                </span>

                <span className="text-lg font-black text-[#315df5]">
                  ₹{formattedAmount}
                </span>
              </div>
            )}

            {!txnid && !amount && (
              <p className="text-center text-sm text-slate-400">
                Payment details are not available in the URL.
              </p>
            )}
          </div>

          {/* Status */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Payment confirmation received
          </div>

          {/* Button */}
          <Link
            href="/"
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-[#315df5] px-6 py-4 text-sm font-black text-white shadow-[0_12px_30px_rgba(49,93,245,.25)] transition hover:-translate-y-0.5 hover:bg-[#244be0]"
          >
            Back to Digital FX
            <span className="ml-2">→</span>
          </Link>

          <p className="mt-6 text-xs text-slate-400">
            Digital FX · Digital Marketing That Delivers
          </p>
        </div>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f5f8ff] px-5 py-10">
          <div className="rounded-[28px] border border-slate-200 bg-white px-10 py-12 text-center shadow-xl">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#315df5]" />

            <p className="mt-5 text-sm font-semibold text-slate-500">
              Processing payment...
            </p>
          </div>
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}