"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function PaymentFailureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const txnid =
    searchParams.get("txnid") || "";

  const reason =
    searchParams.get("reason") ||
    "Payment was not completed.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] p-5">

      <div className="w-full max-w-[520px] rounded-3xl bg-white p-8 text-center shadow-2xl">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-3xl font-bold text-white">
            ×
          </div>

        </div>

        <p className="mt-6 text-[10px] font-extrabold tracking-[2px] text-red-500">
          PAYMENT FAILED
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-[#071534]">
          Payment Unsuccessful
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Your payment was not completed.
          Please try again.
        </p>

        <div className="mt-7 rounded-2xl bg-gray-50 p-5 text-left">

          <p className="text-[9px] font-extrabold uppercase tracking-[1px] text-gray-400">
            Transaction ID
          </p>

          <p className="mt-2 break-all font-mono text-xs font-bold text-[#071534]">
            {txnid || "-"}
          </p>

          <div className="my-4 border-t border-gray-200" />

          <p className="text-[9px] font-extrabold uppercase tracking-[1px] text-gray-400">
            Reason
          </p>

          <p className="mt-2 text-xs leading-5 text-gray-600">
            {reason}
          </p>

        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">

          <button
            type="button"
            onClick={() => router.push("/")}
            className="h-12 flex-1 rounded-xl border border-gray-200 bg-white text-xs font-extrabold text-[#071534] hover:bg-gray-50"
          >
            Back to Website
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="h-12 flex-1 rounded-xl bg-[#315df5] text-xs font-extrabold text-white hover:bg-[#254fe5]"
          >
            Try Again
          </button>

        </div>

        <p className="mt-7 text-[9px] text-gray-400">
          Digital FX • Secure Payment Processing
        </p>

      </div>

    </main>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] p-5">
          <div className="rounded-3xl bg-white px-10 py-12 text-center shadow-xl">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#315df5]" />

            <p className="mt-5 text-sm font-semibold text-gray-500">
              Processing payment...
            </p>
          </div>
        </main>
      }
    >
      <PaymentFailureContent />
    </Suspense>
  );
}