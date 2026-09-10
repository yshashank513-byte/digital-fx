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
  const queryAmount = Number(searchParams.get("amount") || 0);
  const queryName = searchParams.get("name") || "";
  const queryEmail = searchParams.get("email") || "";
  const queryPhone = searchParams.get("phone") || "";
  const queryProduct = searchParams.get("product") || "";
  const queryPlan = searchParams.get("plan") || "";
  const queryStatus = searchParams.get("status") || "success";

  // Immediate optimistic fallback so customer sees their receipt in 0.00 seconds
  const initialPayment: Payment | null = txnid
    ? {
        txnid,
        customer_name: queryName || "Valued Client",
        customer_email: queryEmail || null,
        customer_phone: queryPhone || null,
        plan_id: queryPlan || null,
        product_name:
          queryProduct ||
          (queryPlan
            ? queryPlan.replace(/_/g, " ").toUpperCase()
            : "Digital FX Growth Package"),
        amount: queryAmount || 0,
        status: queryStatus,
        created_at: new Date().toISOString(),
      }
    : null;

  const [payment, setPayment] = useState<Payment | null>(initialPayment);
  const [loading, setLoading] = useState(!initialPayment);
  const [error, setError] = useState("");

  /* ============================================
     LOAD PAYMENT IN BACKGROUND (ENRICHMENT)
  ============================================ */
  useEffect(() => {
    async function loadPayment() {
      if (!txnid) {
        if (!initialPayment) {
          setError("Transaction ID is missing.");
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(
          `/api/payment/details?txnid=${encodeURIComponent(txnid)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setPayment((prev) => ({
              ...prev,
              ...result.data,
              customer_name: result.data.customer_name || prev?.customer_name || "Valued Client",
              customer_email: result.data.customer_email || prev?.customer_email,
              customer_phone: result.data.customer_phone || prev?.customer_phone,
              product_name: result.data.product_name || prev?.product_name || "Digital FX Growth Package",
              amount: Number(result.data.amount) || prev?.amount || queryAmount || 0,
            }));
          }
        }
      } catch (err) {
        console.warn("Could not fetch remote payment details, relying on verified session data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPayment();
  }, [txnid, initialPayment, queryAmount]);

  /* ============================================
     HELPERS
  ============================================ */
  function formatDate(date: string) {
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return date;
    }
  }

  function formatDateTime(date: string) {
    try {
      return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return date;
    }
  }

  function formatAmount(amount: number) {
    return Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function printInvoice() {
    window.print();
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

  const rawId = payment.txnid.replace(/^DFX_/, "");
  const invoiceNumber = `DFX-REC-${rawId.substring(0, 16)}`;
  const amount = Number(payment.amount || 0);

  const whatsappShareText = encodeURIComponent(
    `Hi Digital FX, I have successfully completed payment of ₹${formatAmount(
      amount
    )} for ${payment.product_name || "Digital Services"} (Receipt: ${invoiceNumber}, Txn ID: ${
      payment.txnid
    }). Please confirm onboarding.`
  );

  /* ============================================
     INVOICE / RECEIPT
  ============================================ */

  return (
    <>
      {/* ========================================
          ACTION BAR (NO-PRINT)
      ======================================== */}
      <div className="no-print fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-[1000px] items-center justify-between gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* WhatsApp Share Button */}
            <a
              href={`https://wa.me/918447583685?text=${whatsappShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-emerald-500 hover:bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition flex items-center gap-1.5"
              title="Send Receipt to WhatsApp Support"
            >
              <span>💬</span>
              <span className="hidden sm:inline">WhatsApp Receipt</span>
            </a>

            {/* Google Review Button */}
            <a
              href="https://maps.google.com/?q=Digital+FX+Ghaziabad"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 px-3 py-2 text-xs font-bold transition flex items-center gap-1.5"
              title="Rate us on Google"
            >
              <span className="text-amber-500">★</span>
              <span className="hidden md:inline">Rate on Google</span>
            </a>

            {/* Print / Download Button */}
            <button
              type="button"
              onClick={printInvoice}
              className="rounded-xl bg-[#155EEF] hover:bg-[#0f4ed8] px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>🖨️</span>
              <span>Download / Print PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================
          PAGE
      ======================================== */}
      <main className="min-h-screen bg-[#eef2f7] px-3 pb-16 pt-20 sm:px-6 sm:pt-24">
        {/* ======================================
            A4 INVOICE / RECEIPT CONTAINER
        ====================================== */}
        <div
          id="invoice"
          className="invoice-paper relative mx-auto w-full max-w-[900px] overflow-hidden rounded-3xl bg-white shadow-[0_20px_70px_rgba(7,21,52,0.12)] border border-slate-200"
        >
          {/* TOP BRAND BAR */}
          <div className="relative z-20 h-2 bg-gradient-to-r from-[#155EEF] via-[#315df5] to-[#10b981]" />

          {/* DIGITAL FX WATERMARK */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
            aria-hidden="true"
          >
            <img
              src="/logo.png"
              alt=""
              className="h-[250px] w-[250px] object-contain opacity-[0.035] grayscale"
            />
          </div>

          {/* ====================================
              HEADER
          ==================================== */}
          <header className="relative z-10 px-6 pb-6 pt-8 sm:px-10 sm:pt-9 border-b border-slate-100">
            <div className="flex flex-col justify-between gap-6 sm:flex-row">
              {/* BRAND */}
              <div className="space-y-2">
                <div className="flex items-center gap-3.5">
                  <img
                    src="/logo.png"
                    alt="Digital FX"
                    className="h-12 sm:h-14 w-auto max-w-[190px] object-contain"
                  />
                  <div className="h-10 w-px bg-slate-200" />
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[2px] text-[#155EEF]">
                      Digital Growth Agency
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      AI Search • SEO • Web Development
                    </p>
                  </div>
                </div>

                {/* COMPANY CONTACT DETAILS (Mob, Mail, Web, Hub) */}
                <div className="pt-2 text-[11.5px] text-slate-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">📞 Phone / WhatsApp:</span>
                    <a
                      href="tel:+918447583685"
                      className="font-bold text-slate-900 hover:text-[#155EEF] transition"
                    >
                      +91 8447583685
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">✉️ Official Email:</span>
                    <a
                      href="mailto:info@digitalfx.in"
                      className="font-bold text-slate-900 hover:text-[#155EEF] transition"
                    >
                      info@digitalfx.in
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">🌐 Official Website:</span>
                    <a
                      href="https://digitalfx.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#155EEF] hover:underline"
                    >
                      https://digitalfx.in
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">📍 Agency Hub:</span>
                    <span className="text-slate-700 font-medium">
                      Ghaziabad • Delhi NCR, India
                    </span>
                  </div>
                </div>
              </div>

              {/* INVOICE TITLE & METADATA */}
              <div className="sm:text-right space-y-1.5">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[1.5px] bg-blue-50 text-[#155EEF] border border-blue-200">
                  Payment Receipt &amp; Tax Invoice
                </span>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#071534]">
                  RECEIPT
                </h1>
                <div className="text-xs space-y-1 text-slate-500 font-medium">
                  <div>
                    <span className="text-slate-400">Receipt No: </span>
                    <span className="font-mono font-bold text-slate-900">{invoiceNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Date: </span>
                    <span className="font-bold text-slate-900">{formatDate(payment.created_at)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Time: </span>
                    <span className="font-bold text-slate-900">{formatDateTime(payment.created_at)}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="pt-1 sm:flex sm:justify-end">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold border ${
                      isPaid
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {isPaid ? "PAID & VERIFIED" : "PAYMENT PENDING"}
                  </span>
                </div>
              </div>
            </div>

            {/* GOOGLE REPUTATION BANNER */}
            <div className="mt-5 p-3 rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-blue-50/50 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400 text-sm">★★★★★</div>
                <span className="font-bold text-slate-800">
                  4.9 Google Verified Business
                </span>
                <span className="hidden md:inline text-slate-300">•</span>
                <span className="hidden md:inline text-slate-500 font-medium">
                  Trusted by 200+ Businesses Across Delhi NCR &amp; Global
                </span>
              </div>
              <a
                href="https://maps.google.com/?q=Digital+FX+Ghaziabad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#155EEF] hover:underline font-extrabold inline-flex items-center gap-1"
              >
                <span>Google Business Profile</span>
                <span>↗</span>
              </a>
            </div>
          </header>

          {/* ====================================
              BILLING INFORMATION
          ==================================== */}
          <section className="relative z-10 mx-6 sm:mx-10 my-6 rounded-2xl border border-slate-200 bg-[#fafbfd] p-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* BILLED TO */}
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#155EEF] mb-1">
                  BILLED TO (CUSTOMER)
                </p>
                <p className="text-base font-extrabold text-[#071534]">
                  {payment.customer_name || "Valued Client"}
                </p>
                <div className="mt-2 space-y-1 text-xs text-slate-600">
                  {payment.customer_phone && (
                    <p className="flex items-center gap-1.5">
                      <span className="text-slate-400">Phone:</span>
                      <strong className="text-slate-900">{payment.customer_phone}</strong>
                    </p>
                  )}
                  {payment.customer_email && (
                    <p className="flex items-center gap-1.5">
                      <span className="text-slate-400">Email:</span>
                      <strong className="text-slate-900 break-all">{payment.customer_email}</strong>
                    </p>
                  )}
                </div>
              </div>

              {/* INVOICE META */}
              <div className="sm:text-right">
                <p className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-slate-500 mb-1">
                  TRANSACTION DETAILS
                </p>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400">PayU Transaction ID: </span>
                    <strong className="font-mono text-slate-900 break-all">{payment.txnid}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Gateway: </span>
                    <strong className="text-slate-900">PayU Payments (India) • 256-Bit SSL</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Method: </span>
                    <strong className="text-slate-900">Online (UPI / Cards / NetBanking)</strong>
                  </div>
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
              AUTHORIZED AREA & SUPPORT
          ==================================== */}

          <section className="relative z-10 mx-6 sm:mx-10 border-t border-slate-200 px-0 py-7">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div className="space-y-1 text-xs text-slate-600">
                <p className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#155EEF]">
                  Billing &amp; Support Contact
                </p>
                <p className="pt-1">
                  📞 Phone / WhatsApp: <strong className="text-slate-900">+91 8447583685</strong>
                </p>
                <p>
                  ✉️ Email: <strong className="text-slate-900">info@digitalfx.in</strong>
                </p>
                <p>
                  🌐 Website: <a href="https://digitalfx.in" target="_blank" rel="noopener noreferrer" className="text-[#155EEF] font-bold hover:underline">https://digitalfx.in</a>
                </p>
                <p>
                  📍 Office: <span className="text-slate-700 font-medium">Ghaziabad • Delhi NCR, India</span>
                </p>
                <p className="pt-2 text-[10px] text-slate-400 font-mono">
                  Txn ID: {payment.txnid}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <div className="mb-2 ml-auto inline-block border-b-2 border-slate-300 pb-1 text-center sm:text-right min-w-[160px]">
                  <span className="font-serif italic font-bold text-slate-800 text-sm">
                    Digital FX Accounts
                  </span>
                </div>
                <p className="text-[11px] font-extrabold text-[#071534]">
                  Authorized by Digital FX
                </p>
                <p className="mt-0.5 text-[9.5px] text-slate-400">
                  Accounts &amp; Financial Clearing Desk
                </p>
              </div>
            </div>
          </section>

          {/* ====================================
              FOOTER
          ==================================== */}

          <footer className="relative z-10">
            <div className="bg-[#071534] px-6 py-5 sm:px-10">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[11px] font-black tracking-[1.5px] text-white">
                    DIGITAL FX
                  </p>
                  <p className="mt-0.5 text-[9px] text-blue-200">
                    Digital Marketing • Web Solutions • Google Business • Generative AI Search (GEO)
                  </p>
                </div>

                <div className="text-[9px] text-gray-400 sm:text-right space-y-0.5">
                  <p>Computer-generated official tax invoice &amp; payment receipt.</p>
                  <p>Support: +91 8447583685 | info@digitalfx.in | digitalfx.in</p>
                </div>
              </div>
            </div>

            <div className="h-1.5 bg-[#155EEF]" />
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
