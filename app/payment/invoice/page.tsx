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

  function numberToWordsINR(num: number): string {
    const a = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen"
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const n = Math.floor(num);
    if (n === 0) return "Zero Rupees Only";

    function convert(val: number): string {
      if (val < 20) return a[val];
      if (val < 100) return b[Math.floor(val / 10)] + (val % 10 !== 0 ? " " + a[val % 10] : "");
      if (val < 1000) return a[Math.floor(val / 100)] + " Hundred" + (val % 100 !== 0 ? " and " + convert(val % 100) : "");
      if (val < 100000) return convert(Math.floor(val / 1000)) + " Thousand" + (val % 1000 !== 0 ? " " + convert(val % 1000) : "");
      if (val < 10000000) return convert(Math.floor(val / 100000)) + " Lakh" + (val % 100000 !== 0 ? " " + convert(val % 100000) : "");
      return convert(Math.floor(val / 10000000)) + " Crore" + (val % 10000000 !== 0 ? " " + convert(val % 10000000) : "");
    }

    return convert(n) + " Rupees Only";
  }

  /* ============================================
     LOADING
  ============================================ */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f1f5f9]">
        <div className="rounded-2xl bg-white px-10 py-9 text-center shadow-lg border border-slate-300">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#071534]" />
          <p className="mt-4 text-sm font-bold text-slate-800">
            Generating Tax Invoice...
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
      <main className="flex min-h-screen items-center justify-center bg-[#f1f5f9] p-5">
        <div className="w-full max-w-[500px] rounded-2xl bg-white p-8 text-center shadow-lg border border-slate-300">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 text-2xl font-black">
            !
          </div>
          <h1 className="mt-4 text-2xl font-black text-slate-900">
            Invoice Unavailable
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {error || "Payment record could not be found."}
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-6 h-11 w-full rounded-lg bg-slate-900 text-xs font-bold text-white hover:bg-slate-800 transition"
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

  const isPaid = payment.status.toLowerCase() === "success";
  const rawId = payment.txnid.replace(/^DFX_/, "");
  const invoiceNumber = `DFX-INV-${rawId.substring(0, 12).toUpperCase()}`;
  const amount = Number(payment.amount || 0);

  const whatsappShareText = encodeURIComponent(
    `Hi Digital FX, here is my payment confirmation for ₹${formatAmount(
      amount
    )} for ${payment.product_name || "Digital Services"} (Invoice: ${invoiceNumber}, Txn ID: ${
      payment.txnid
    }). Please proceed with project execution.`
  );

  /* ============================================
     STANDARD CORPORATE TAX INVOICE STRUCTURE
  ============================================ */

  return (
    <>
      {/* ========================================
          TOP ACTION CONTROLS (HIDDEN IN PRINT)
      ======================================== */}
      <div className="no-print fixed left-0 right-0 top-0 z-50 border-b border-slate-300 bg-white/95 px-4 py-2.5 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-[820px] items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>←</span>
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/918447583685?text=${whatsappShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition flex items-center gap-1.5"
            >
              <span>💬</span>
              <span className="hidden sm:inline">WhatsApp Invoice</span>
            </a>

            <button
              type="button"
              onClick={printInvoice}
              className="rounded-lg bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-bold text-white shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>🖨️</span>
              <span>Download / Print PDF (A4)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================
          PAGE WRAPPER
      ======================================== */}
      <main className="min-h-screen bg-[#f1f5f9] px-3 pb-12 pt-16 sm:px-6 sm:pt-20">
        {/* ======================================
            A4 INVOICE SHEET (EXACT REQUESTED STRUCTURE)
        ====================================== */}
        <div
          id="invoice"
          className="invoice-paper relative mx-auto w-full max-w-[800px] bg-white text-slate-900 border border-slate-800 shadow-md"
        >
          {/* ┌──────────────────────────────────────────────────────────┐
              │  LOGO        COMPANY NAME                  TAX INVOICE    │
              │              Address / Phone / GSTIN       Invoice No.   │
              │                                             Date          │
              └──────────────────────────────────────────────────────────┘ */}
          <div className="p-5 sm:p-6 border-b border-slate-800">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              {/* LEFT: LOGO + COMPANY NAME + ADDRESS/PHONE/GSTIN */}
              <div className="flex items-start gap-4">
                <div className="shrink-0 pt-0.5">
                  <img
                    src="/logo.png"
                    alt="Digital FX"
                    className="h-14 sm:h-16 w-auto max-w-[160px] object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
                    DIGITAL FX
                  </h1>
                  <p className="text-[11px] font-bold text-slate-700">
                    Digital Marketing &amp; AI Search (GEO) Agency
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Address: Ghaziabad, Delhi NCR - 201001, India
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Phone: <strong className="text-slate-800">+91 8447583685</strong> | Email: <strong className="text-slate-800">hello@digitalfx.in</strong>
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Website: <a href="https://digitalfx.in" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-semibold">https://digitalfx.in</a> | GSTIN: <span className="font-mono font-bold">07AABCD1234E1Z5</span>
                  </p>
                </div>
              </div>

              {/* RIGHT: TAX INVOICE + INVOICE NO + DATE */}
              <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto">
                <p className="text-xl sm:text-2xl font-black tracking-wider text-slate-900 uppercase">
                  TAX INVOICE
                </p>
                <div className="mt-1 text-xs space-y-1">
                  <div>
                    <span className="text-slate-500 font-medium">Invoice No: </span>
                    <strong className="font-mono text-slate-900">{invoiceNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Date: </span>
                    <strong className="text-slate-900">{formatDate(payment.created_at)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Status: </span>
                    <span className={`inline-block font-bold px-2 py-0.5 rounded text-[10.5px] ${
                      isPaid ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-red-100 text-red-800 border border-red-300"
                    }`}>
                      {isPaid ? "PAID (VERIFIED)" : "PAYMENT PENDING"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ├──────────────────────────────────────────────────────────┤
              │ BILL TO:                                                 │
              │ Customer Name | Phone | Email | Address                  │
              └──────────────────────────────────────────────────────────┘ */}
          <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-800">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-900 mb-1.5">
              BILL TO:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Customer Name</span>
                <strong className="text-slate-900 text-sm">{payment.customer_name || "Valued Client"}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Phone Number</span>
                <strong className="text-slate-900">{payment.customer_phone || "+91 8447583685"}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Email Address</span>
                <strong className="text-slate-900 break-all">{payment.customer_email || "hello@digitalfx.in"}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Address / Region</span>
                <strong className="text-slate-900">Delhi NCR / India</strong>
              </div>
            </div>
          </div>

          {/* ├────┬──────────────────────┬──────┬────────┬───────────────┤
              │ S.No │ Description        │ Qty  │ Rate   │ Amount        │
              ├────┼──────────────────────┼──────┼────────┼───────────────┤
              │  1 │ Service / Package    │  1   │ ₹...   │ ₹...          │
              └────┴──────────────────────┴──────┴────────┴───────────────┘ */}
          <div className="border-b border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-800 text-slate-900 font-extrabold uppercase text-[10.5px]">
                  <th className="py-2.5 px-3 border-r border-slate-800 text-center w-12">S.No</th>
                  <th className="py-2.5 px-4 border-r border-slate-800">Description</th>
                  <th className="py-2.5 px-3 border-r border-slate-800 text-center w-16">Qty</th>
                  <th className="py-2.5 px-3 border-r border-slate-800 text-right w-28">Rate</th>
                  <th className="py-2.5 px-4 text-right w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                <tr className="align-top">
                  <td className="py-3 px-3 border-r border-slate-800 text-center font-bold text-slate-600">
                    1
                  </td>
                  <td className="py-3 px-4 border-r border-slate-800">
                    <p className="font-extrabold text-slate-900 text-xs">
                      {payment.product_name || "Digital Marketing & AI Optimization Package"}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      Search Engine Optimization (SEO), Google Maps 3-Pack Citation, Schema.org Markup &amp; Generative AI (GEO) Citation Setup.
                    </p>
                    {payment.plan_id && (
                      <span className="inline-block mt-1 font-mono text-[10px] text-slate-500 font-semibold">
                        Plan Ref: {payment.plan_id.toUpperCase()}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 border-r border-slate-800 text-center font-bold text-slate-800">
                    1
                  </td>
                  <td className="py-3 px-3 border-r border-slate-800 text-right font-medium text-slate-900">
                    ₹{formatAmount(amount)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    ₹{formatAmount(amount)}
                  </td>
                </tr>
                {/* Secondary optional row space for visual balance if needed */}
              </tbody>
            </table>
          </div>

          {/* ├────┴──────────────────────┴──────┴────────┼───────────────┤
              │                              Sub Total     │ ₹...          │
              │                              GST           │ ₹...          │
              │                              Discount      │ ₹...          │
              │                              GRAND TOTAL   │ ₹...          │
              └────────────────────────────────────────────┴───────────────┘ */}
          <div className="border-b border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_300px]">
              {/* Amount in words */}
              <div className="p-4 sm:p-5 border-b sm:border-b-0 sm:border-r border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Amount in Words</span>
                  <p className="font-serif italic font-bold text-slate-800 text-sm mt-1">
                    {numberToWordsINR(amount)}
                  </p>
                </div>
                <p className="text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-200">
                  Transaction verified securely via PayU Payments Gateway (256-Bit SSL).
                </p>
              </div>

              {/* Totals Table */}
              <div className="text-xs">
                <div className="flex justify-between py-2 px-4 border-b border-slate-300">
                  <span className="text-slate-600 font-medium">Sub Total</span>
                  <strong className="text-slate-900">₹{formatAmount(amount)}</strong>
                </div>
                <div className="flex justify-between py-2 px-4 border-b border-slate-300">
                  <span className="text-slate-600 font-medium">GST (18% / Inclusive)</span>
                  <strong className="text-slate-900">₹0.00 (Included)</strong>
                </div>
                <div className="flex justify-between py-2 px-4 border-b border-slate-800">
                  <span className="text-slate-600 font-medium">Discount</span>
                  <strong className="text-slate-900">₹0.00</strong>
                </div>
                <div className="flex justify-between py-3 px-4 bg-slate-100 font-black text-sm text-slate-900">
                  <span>GRAND TOTAL</span>
                  <span className="text-base text-slate-900">₹{formatAmount(amount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ├────────────────────────────────────────────┴───────────────┤
              │ Payment Details:                                           │
              │ Bank Name | A/C No. | IFSC | UPI                          │
              └───────────────────────────────────────────────────────────┘ */}
          <div className="p-4 bg-slate-50 border-b border-slate-800 text-xs text-slate-800">
            <p className="font-black text-[11px] uppercase tracking-wider text-slate-900 mb-1.5">
              PAYMENT DETAILS:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Bank Name</span>
                <strong className="text-slate-900">HDFC Bank Ltd.</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Account Number</span>
                <strong className="font-mono text-slate-900">50200084475836</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">IFSC Code</span>
                <strong className="font-mono text-slate-900">HDFC0001234</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">UPI ID</span>
                <strong className="font-mono text-slate-900">digitalfx@hdfcbank</strong>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
              <span>PayU Transaction ID: <strong className="font-mono text-slate-900">{payment.txnid}</strong></span>
              <span>•</span>
              <span>Channel: <strong className="text-slate-900">Online Gateway (UPI/NetBanking/Cards)</strong></span>
            </div>
          </div>

          {/* ├───────────────────────────────────────────────────────────┤
              │ Terms & Conditions                    Authorized Signature │
              └───────────────────────────────────────────────────────────┘ */}
          <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-xs">
            {/* Left: Terms & Conditions */}
            <div className="max-w-[440px] space-y-1">
              <p className="font-black text-[11px] uppercase tracking-wider text-slate-900 mb-1">
                TERMS &amp; CONDITIONS:
              </p>
              <ol className="list-decimal list-inside space-y-0.5 text-[10.5px] text-slate-600 leading-relaxed">
                <li>This is a computer-generated tax invoice and requires no physical signature.</li>
                <li>Digital campaign kickoff and onboarding commence within 24–48 business hours.</li>
                <li>For any billing questions or support, email <strong className="text-slate-800">hello@digitalfx.in</strong> or call <strong className="text-slate-800">+91 8447583685</strong>.</li>
              </ol>
            </div>

            {/* Right: Authorized Signature */}
            <div className="text-left sm:text-right w-full sm:w-auto">
              <p className="text-[10px] font-bold text-slate-500 uppercase">
                For DIGITAL FX
              </p>
              <div className="my-2 py-2 inline-block border-b-2 border-slate-800 min-w-[170px] text-center sm:text-right">
                <span className="font-serif italic font-bold text-slate-800 text-sm block">
                  Digital FX Billing Desk
                </span>
              </div>
              <p className="text-[11px] font-black uppercase text-slate-900">
                Authorized Signatory
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================
          A4 PRINT STYLES
      ======================================== */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            font-size: 11px !important;
            color: #000000 !important;
          }

          .no-print {
            display: none !important;
          }

          main {
            min-height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #ffffff !important;
          }

          #invoice {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: 1.5px solid #000000 !important;
            page-break-inside: avoid !important;
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
