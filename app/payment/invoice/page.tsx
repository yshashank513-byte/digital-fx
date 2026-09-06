"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Payment = {
  txnid: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  plan_id: string | null;
  product_name: string | null;
  amount: number;
  status: string;
  created_at: string;
};

function PaymentInvoiceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const txnid = searchParams.get("txnid") || "";

  const [payment, setPayment] =
    useState<Payment | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* ============================================
     LOAD PAYMENT
  ============================================ */

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

        const text = await response.text();

        if (!text) {
          throw new Error(
            "Payment details response is empty."
          );
        }

        let result;

        try {
          result = JSON.parse(text);
        } catch {
          throw new Error(
            "Invalid payment details response."
          );
        }

        if (!response.ok || !result.success) {
          throw new Error(
            result?.error ||
              "Unable to load payment."
          );
        }

        setPayment(result.data);
      } catch (err) {
        console.error(
          "INVOICE LOAD ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load invoice."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPayment();
  }, [txnid]);

  /* ============================================
     HELPERS
  ============================================ */

  function formatDate(date: string) {
    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return date;
    }
  }

  function formatDateTime(date: string) {
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
  }

  function formatAmount(amount: number) {
    return Number(amount || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  }

  function printInvoice() {
    window.print();
  }

  function goBack() {
    router.back();
  }

  /* ============================================
     LOADING
  ============================================ */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eef2f7]">
        <div className="rounded-2xl bg-white px-10 py-9 text-center shadow-xl">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#155EEF]" />

          <p className="mt-4 text-sm font-semibold text-gray-500">
            Preparing your invoice...
          </p>

        </div>
      </main>
    );
  }

  /* ============================================
     ERROR
  ============================================ */

  if (error || !payment) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eef2f7] p-5">

        <div className="w-full max-w-[500px] rounded-3xl bg-white p-8 text-center shadow-xl">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <span className="text-2xl font-black text-red-500">
              !
            </span>
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-[#071534]">
            Invoice Unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {error || "Payment not found."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-7 h-12 w-full rounded-xl bg-[#155EEF] text-xs font-extrabold text-white"
          >
            Back to Website
          </button>

        </div>

      </main>
    );
  }

  /* ============================================
     VALUES
  ============================================ */

  const isPaid =
    payment.status.toLowerCase() ===
    "success";

  const invoiceNumber =
    `DFX-${payment.txnid.replace(
      /^DFX_/,
      ""
    )}`;

  const amount = Number(
    payment.amount || 0
  );

  /* ============================================
     INVOICE
  ============================================ */

  return (
    <>
      {/* ========================================
          ACTION BAR
      ======================================== */}

      <div className="no-print fixed left-0 right-0 top-0 z-50 border-b border-gray-200 bg-white/95 px-5 py-3 backdrop-blur">

        <div className="mx-auto flex max-w-[1000px] items-center justify-between gap-3">

          <button
            type="button"
            onClick={goBack}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-[#071534] hover:bg-gray-50"
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={printInvoice}
            className="rounded-lg bg-[#155EEF] px-5 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-[#0F4ED8]"
          >
            Download / Print Invoice
          </button>

        </div>

      </div>

      {/* ========================================
          PAGE
      ======================================== */}

      <main className="min-h-screen bg-[#eef2f7] px-4 pb-16 pt-24 sm:px-8">

        {/* ======================================
            A4 INVOICE
        ====================================== */}

        <div
          id="invoice"
          className="invoice-paper relative mx-auto w-full max-w-[900px] overflow-hidden bg-white shadow-[0_15px_60px_rgba(7,21,52,0.14)]"
        >

          {/* ====================================
              TOP BRAND BAR
          ==================================== */}

          <div className="relative z-20 h-1.5 bg-[#155EEF]" />

          {/* ====================================
              DIGITAL FX WATERMARK
          ==================================== */}

          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
            aria-hidden="true"
          >
            <img
              src="/logo.png"
              alt=""
              className="h-[190px] w-[190px] object-contain opacity-[0.055] grayscale"
            />
          </div>

          {/* ====================================
              HEADER
          ==================================== */}

          <header className="relative z-10 px-8 pb-7 pt-8 sm:px-12 sm:pt-10">

            <div className="flex flex-col justify-between gap-8 sm:flex-row">

              {/* BRAND */}

              <div className="flex items-center gap-4">

                <img
                  src="/logo.png"
                  alt="Digital FX"
                  className="h-[62px] w-auto max-w-[190px] object-contain"
                />

                <div className="hidden h-12 w-px bg-gray-200 sm:block" />

                <div className="hidden sm:block">

                  <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#155EEF]">
                    Digital Marketing Agency
                  </p>

                  <p className="mt-1 text-[11px] text-gray-400">
                    Professional Digital Solutions
                  </p>

                </div>

              </div>

              {/* INVOICE TITLE */}

              <div className="sm:text-right">

                <p className="text-[34px] font-black tracking-[-1px] text-[#071534]">
                  INVOICE
                </p>

                <div className="mt-2 flex items-center gap-2 sm:justify-end">

                  <span className="text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                    Invoice No.
                  </span>

                  <span className="font-mono text-[10px] font-bold text-[#071534]">
                    {invoiceNumber}
                  </span>

                </div>

              </div>

            </div>

            {/* COMPANY INFO */}

            <div className="mt-7 border-t border-gray-100 pt-5">

              <div className="flex flex-col justify-between gap-3 text-[10px] text-gray-500 sm:flex-row">

                <div>
                  <span className="font-bold text-[#071534]">
                    DIGITAL FX
                  </span>

                  <span className="mx-2 text-gray-300">
                    •
                  </span>

                  Digital Marketing Agency
                </div>

                <div className="sm:text-right">
                  Contact Digital FX for support regarding this invoice.
                </div>

              </div>

            </div>

          </header>

          {/* ====================================
              BILLING INFORMATION
          ==================================== */}

          <section className="relative z-10 mx-8 border-y border-gray-200 bg-[#fafbfd] px-6 py-6 sm:mx-12 sm:px-7">

            <div className="grid gap-8 sm:grid-cols-2">

              {/* BILLED TO */}

              <div>

                <p className="text-[9px] font-extrabold uppercase tracking-[1.5px] text-[#155EEF]">
                  Billed To
                </p>

                <p className="mt-3 text-base font-extrabold text-[#071534]">
                  {payment.customer_name || "-"}
                </p>

                <div className="mt-2 space-y-1">

                  {payment.customer_email && (
                    <p className="break-all text-[11px] text-gray-500">
                      {payment.customer_email}
                    </p>
                  )}

                  {payment.customer_phone && (
                    <p className="text-[11px] text-gray-500">
                      {payment.customer_phone}
                    </p>
                  )}

                </div>

              </div>

              {/* INVOICE META */}

              <div className="sm:text-right">

                <div className="grid grid-cols-2 gap-y-3 text-[10px] sm:grid-cols-[auto_auto] sm:justify-end sm:gap-x-8">

                  <span className="font-bold text-gray-400">
                    Invoice Date
                  </span>

                  <span className="font-bold text-[#071534]">
                    {formatDate(
                      payment.created_at
                    )}
                  </span>

                  <span className="font-bold text-gray-400">
                    Payment Date
                  </span>

                  <span className="font-bold text-[#071534]">
                    {formatDateTime(
                      payment.created_at
                    )}
                  </span>

                  <span className="font-bold text-gray-400">
                    Transaction ID
                  </span>

                  <span className="break-all font-mono font-bold text-[#071534]">
                    {payment.txnid}
                  </span>

                </div>

              </div>

            </div>

          </section>

          {/* ====================================
              SERVICE TABLE
          ==================================== */}

          <section className="relative z-10 px-8 pt-8 sm:px-12">

            <div className="overflow-hidden rounded-xl border border-gray-200">

              {/* TABLE HEADER */}

              <div className="grid grid-cols-[52px_1fr_140px] bg-[#071534] px-5 py-4 text-[9px] font-extrabold uppercase tracking-[1px] text-white">

                <span>
                  #
                </span>

                <span>
                  Service / Description
                </span>

                <span className="text-right">
                  Amount
                </span>

              </div>

              {/* ITEM */}

              <div className="grid min-h-[115px] grid-cols-[52px_1fr_140px] px-5 py-6">

                <div className="text-xs font-bold text-gray-400">
                  01
                </div>

                <div>

                  <p className="text-sm font-extrabold text-[#071534]">
                    {payment.product_name ||
                      "Digital FX Professional Service"}
                  </p>

                  <p className="mt-2 max-w-[470px] text-[10px] leading-5 text-gray-500">
                    Professional digital services provided
                    by Digital FX as selected by the customer.
                  </p>

                  {payment.plan_id && (
                    <p className="mt-2 text-[9px] font-bold uppercase tracking-[1px] text-[#155EEF]">
                      Plan: {payment.plan_id}
                    </p>
                  )}

                </div>

                <div className="text-right">

                  <p className="text-sm font-extrabold text-[#071534]">
                    ₹{formatAmount(amount)}
                  </p>

                  <p className="mt-1 text-[9px] text-gray-400">
                    1 Service
                  </p>

                </div>

              </div>

            </div>

          </section>

          {/* ====================================
              TOTAL + PAYMENT STATUS
          ==================================== */}

          <section className="relative z-10 grid gap-8 px-8 py-8 sm:grid-cols-[1fr_300px] sm:px-12">

            {/* LEFT */}

            <div>

              <div className="rounded-xl border border-gray-100 bg-[#f8fafc] p-5">

                <p className="text-[9px] font-extrabold uppercase tracking-[1.5px] text-[#155EEF]">
                  Payment Status
                </p>

                <div className="mt-4 flex items-center gap-3">

                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-black ${
                      isPaid
                        ? "bg-emerald-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {isPaid ? "✓" : "×"}
                  </span>

                  <div>

                    <p
                      className={`text-xs font-extrabold ${
                        isPaid
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {isPaid
                        ? "PAYMENT RECEIVED"
                        : "PAYMENT NOT COMPLETED"}
                    </p>

                    <p className="mt-1 text-[10px] text-gray-400">
                      {isPaid
                        ? "This transaction has been successfully recorded."
                        : "This transaction is not marked as paid."}
                    </p>

                  </div>

                </div>

              </div>

              {/* THANK YOU */}

              <div className="mt-6">

                <p className="text-[9px] font-extrabold uppercase tracking-[1.5px] text-[#155EEF]">
                  Thank You
                </p>

                <p className="mt-2 max-w-[430px] text-[10px] leading-5 text-gray-500">
                  Thank you for choosing Digital FX.
                  We appreciate your trust and look forward
                  to delivering excellent digital solutions.
                </p>

              </div>

            </div>

            {/* TOTAL BOX */}

            <div className="overflow-hidden rounded-xl border border-gray-200">

              <div className="space-y-3 p-5">

                <div className="flex justify-between text-[11px]">

                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-bold text-[#071534]">
                    ₹{formatAmount(amount)}
                  </span>

                </div>

                <div className="flex justify-between text-[11px]">

                  <span className="text-gray-500">
                    Discount
                  </span>

                  <span className="font-bold text-[#071534]">
                    ₹0.00
                  </span>

                </div>

              </div>

              <div className="border-t border-gray-200 bg-[#f5f8ff] px-5 py-5">

                <div className="flex items-end justify-between gap-4">

                  <div>

                    <p className="text-[9px] font-extrabold uppercase tracking-[1px] text-gray-400">
                      Total Amount
                    </p>

                    <p className="mt-1 text-[9px] text-gray-400">
                      Inclusive of selected services
                    </p>

                  </div>

                  <p className="text-xl font-black text-[#155EEF]">
                    ₹{formatAmount(amount)}
                  </p>

                </div>

              </div>

              {isPaid && (
                <div className="border-t border-emerald-200 bg-emerald-50 px-5 py-4">

                  <div className="flex items-center justify-between">

                    <span className="text-[10px] font-extrabold uppercase tracking-[1px] text-emerald-700">
                      Amount Paid
                    </span>

                    <span className="text-sm font-black text-emerald-700">
                      ₹{formatAmount(amount)}
                    </span>

                  </div>

                </div>
              )}

            </div>

          </section>

          {/* ====================================
              AUTHORIZED AREA
          ==================================== */}

          <section className="relative z-10 mx-8 border-t border-gray-200 px-0 py-7 sm:mx-12">

            <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">

              <div>

                <p className="text-[9px] font-extrabold uppercase tracking-[1.5px] text-gray-400">
                  Payment Reference
                </p>

                <p className="mt-2 font-mono text-[10px] font-bold text-[#071534]">
                  {payment.txnid}
                </p>

                <p className="mt-1 text-[9px] text-gray-400">
                  Keep this transaction ID for future reference.
                </p>

              </div>

              <div className="text-left sm:text-right">

                <div className="mb-8 ml-auto h-px w-40 bg-gray-300" />

                <p className="text-[10px] font-extrabold text-[#071534]">
                  Authorized by Digital FX
                </p>

                <p className="mt-1 text-[9px] text-gray-400">
                  Authorized Representative
                </p>

              </div>

            </div>

          </section>

          {/* ====================================
              FOOTER
          ==================================== */}

          <footer className="relative z-10">

            <div className="bg-[#071534] px-8 py-5 sm:px-12">

              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                <div>

                  <p className="text-[10px] font-extrabold tracking-[1px] text-white">
                    DIGITAL FX
                  </p>

                  <p className="mt-1 text-[8px] text-blue-200">
                    Digital Marketing • Web Development • Business Growth
                  </p>

                </div>

                <p className="text-[8px] text-gray-400 sm:text-right">
                  This is a computer-generated invoice.
                  No physical signature is required.
                </p>

              </div>

            </div>

            <div className="h-1 bg-[#155EEF]" />

          </footer>

        </div>

      </main>

      {/* ========================================
          PRINT STYLES
      ======================================== */}

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }

          .no-print {
            display: none !important;
          }

          main {
            min-height: auto !important;
            padding: 0 !important;
            background: #ffffff !important;
          }

          #invoice {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            box-shadow: none !important;
          }

          .invoice-paper {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </>
  );
}

export default function PaymentInvoicePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#eef2f7]">
          <div className="rounded-2xl bg-white px-10 py-9 text-center shadow-xl">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#155EEF]" />

            <p className="mt-4 text-sm font-semibold text-gray-500">
              Preparing your invoice...
            </p>
          </div>
        </main>
      }
    >
      <PaymentInvoiceContent />
    </Suspense>
  );
}
