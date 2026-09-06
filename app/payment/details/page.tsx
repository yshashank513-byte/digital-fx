"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Payment = {
  id: string;
  txnid: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  plan_id: string | null;
  product_name: string | null;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
};

function PaymentDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const txnid = searchParams.get("txnid") || "";

  const [payment, setPayment] =
    useState<Payment | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadPayment() {
      if (!txnid) {
        setError("Transaction ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/payment/details?txnid=${encodeURIComponent(
            txnid
          )}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const contentType =
          response.headers.get("content-type") || "";

        const responseText =
          await response.text();

        if (!responseText) {
          throw new Error(
            `Payment details API returned an empty response (${response.status}).`
          );
        }

        if (
          !contentType.includes(
            "application/json"
          )
        ) {
          throw new Error(
            `Payment details API returned a non-JSON response (${response.status}).`
          );
        }

        let result: {
          success?: boolean;
          data?: Payment;
          error?: string;
        };

        try {
          result = JSON.parse(responseText);
        } catch {
          throw new Error(
            "Invalid JSON response from payment details API."
          );
        }

        if (!response.ok || !result.success) {
          throw new Error(
            result?.error ||
              "Unable to load payment details."
          );
        }

        setPayment(result.data || null);
      } catch (err) {
        console.error(
          "PAYMENT DETAILS LOAD ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load payment details."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPayment();
  }, [txnid]);

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return date;
    }
  };

  const formatAmount = (amount: number) => {
    return Number(amount || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  const openInvoice = () => {
    if (!payment?.txnid) {
      return;
    }

    router.push(
      `/payment/invoice?txnid=${encodeURIComponent(
        payment.txnid
      )}`
    );
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] p-5">
        <div className="rounded-3xl bg-white px-10 py-12 text-center shadow-xl">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#315df5]" />

          <p className="mt-5 text-sm font-semibold text-gray-500">
            Loading payment details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !payment) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] p-5">
        <div className="w-full max-w-[520px] rounded-3xl bg-white p-8 text-center shadow-xl">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <span className="text-3xl font-bold text-red-500">
              !
            </span>
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-[#071534]">
            Payment Details Unavailable
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            {error ||
              "Payment could not be found."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-7 h-12 w-full rounded-xl bg-[#315df5] text-sm font-extrabold text-white"
          >
            Back to Website
          </button>

        </div>
      </main>
    );
  }

  const isSuccess =
    payment.status.toLowerCase() === "success";

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-5 py-10">

      <div className="mx-auto w-full max-w-[760px]">

        {/* HEADER */}

        <div className="mb-6 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
            <span className="text-2xl font-black italic text-[#315df5]">
              FX
            </span>
          </div>

          <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[2px] text-[#315df5]">
            DIGITAL FX
          </p>

          <h1 className="mt-1 text-3xl font-extrabold text-[#071534]">
            Payment Details
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Your Digital FX payment receipt
          </p>

        </div>

        {/* MAIN CARD */}

        <div className="overflow-hidden rounded-3xl bg-white shadow-[0_25px_80px_rgba(7,21,52,0.12)]">

          {/* STATUS */}

          <div className="border-b border-gray-100 p-7 text-center">

            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                isSuccess
                  ? "bg-emerald-50"
                  : "bg-red-50"
              }`}
            >
              <span
                className={`text-3xl font-black ${
                  isSuccess
                    ? "text-emerald-500"
                    : "text-red-500"
                }`}
              >
                {isSuccess ? "✓" : "×"}
              </span>
            </div>

            <h2
              className={`mt-4 text-2xl font-extrabold ${
                isSuccess
                  ? "text-emerald-600"
                  : "text-red-500"
              }`}
            >
              {isSuccess
                ? "Payment Successful"
                : `Payment ${payment.status}`}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {isSuccess
                ? "Your payment has been successfully confirmed."
                : "Please contact Digital FX if you need assistance."}
            </p>

          </div>

          {/* AMOUNT */}

          <div className="mx-6 mt-6 rounded-2xl bg-[#071534] p-6 text-center text-white">

            <p className="text-[9px] font-extrabold uppercase tracking-[2px] text-blue-200">
              Amount Paid
            </p>

            <p className="mt-2 text-4xl font-black">
              ₹{formatAmount(payment.amount)}
            </p>

          </div>

          {/* PAYMENT INFO */}

          <div className="p-7">

            <h3 className="text-lg font-extrabold text-[#071534]">
              Transaction Information
            </h3>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">

              {/* TRANSACTION ID */}

              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[1px] text-gray-400">
                  Transaction ID
                </p>

                <p className="mt-2 break-all font-mono text-xs font-bold text-[#071534]">
                  {payment.txnid}
                </p>
              </div>

              {/* STATUS */}

              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[1px] text-gray-400">
                  Payment Status
                </p>

                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-[10px] font-extrabold uppercase ${
                    isSuccess
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {payment.status}
                </span>
              </div>

              {/* PACKAGE */}

              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[1px] text-gray-400">
                  Package
                </p>

                <p className="mt-2 text-sm font-bold text-[#071534]">
                  {payment.product_name || "-"}
                </p>
              </div>

              {/* DATE */}

              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[1px] text-gray-400">
                  Payment Date
                </p>

                <p className="mt-2 text-sm font-semibold text-gray-600">
                  {formatDate(
                    payment.created_at
                  )}
                </p>
              </div>

            </div>

            {/* CUSTOMER */}

            <div className="my-7 border-t border-gray-100" />

            <h3 className="text-lg font-extrabold text-[#071534]">
              Customer Information
            </h3>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">

              {/* NAME */}

              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[1px] text-gray-400">
                  Full Name
                </p>

                <p className="mt-2 text-sm font-bold text-[#071534]">
                  {payment.customer_name || "-"}
                </p>
              </div>

              {/* PHONE */}

              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[1px] text-gray-400">
                  Mobile Number
                </p>

                <p className="mt-2 text-sm font-semibold text-gray-600">
                  {payment.customer_phone || "-"}
                </p>
              </div>

              {/* EMAIL */}

              <div className="sm:col-span-2">
                <p className="text-[9px] font-extrabold uppercase tracking-[1px] text-gray-400">
                  Email Address
                </p>

                <p className="mt-2 break-all text-sm font-semibold text-gray-600">
                  {payment.customer_email || "-"}
                </p>
              </div>

            </div>

            {/* ACTIONS */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              {/* BACK */}

              <button
                type="button"
                onClick={() => router.push("/")}
                className="h-12 flex-1 rounded-xl border border-gray-200 bg-white text-xs font-extrabold text-[#071534] transition hover:bg-gray-50"
              >
                Back to Website
              </button>

              {/* INVOICE */}

              {isSuccess && (
                <button
                  type="button"
                  onClick={openInvoice}
                  className="h-12 flex-1 rounded-xl bg-[#315df5] text-xs font-extrabold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#254fe5]"
                >
                  Download Invoice
                </button>
              )}

            </div>

          </div>

          {/* FOOTER */}

          <div className="border-t border-gray-100 px-7 py-5 text-center">

            <p className="text-[9px] text-gray-400">
              Digital FX • Secure Payment Processing
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}

export default function PaymentDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] p-5">
          <div className="rounded-3xl bg-white px-10 py-12 text-center shadow-xl">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#315df5]" />

            <p className="mt-5 text-sm font-semibold text-gray-500">
              Loading payment details...
            </p>
          </div>
        </main>
      }
    >
      <PaymentDetailsContent />
    </Suspense>
  );
}