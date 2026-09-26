"use client";

import React, { useState } from "react";
import { BusinessProfile } from "@/lib/reviewFlowTypes";

interface Props {
  business: BusinessProfile;
  initialSize?: "A4" | "A5";
  showControls?: boolean;
  onClose?: () => void;
}

export default function PrintableReviewStandee({
  business,
  initialSize = "A5",
  showControls = true,
  onClose,
}: Props) {
  const [size, setSize] = useState<"A4" | "A5">(initialSize);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Compute Review Portal URL (Directs customer to 3-step review flow)
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.digitalfx.in";
  const reviewPortalUrl = `${origin}/r/${business.id}?name=${encodeURIComponent(business.name)}&cat=${encodeURIComponent(business.category)}&city=${encodeURIComponent(business.city || "")}&reviewUrl=${encodeURIComponent(business.googleReviewUrl || "")}&src=standee`;

  // Raw high-resolution QR matrix URL
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=2&data=${encodeURIComponent(
    reviewPortalUrl
  )}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(reviewPortalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {}
  };

  const handleDownloadQR = async () => {
    setDownloading("qr");
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${business.id}-review-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("QR download failed:", err);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Print CSS Rules: Ensures only the standee prints cleanly in exact A4/A5 dimensions */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-standee-card, #printable-standee-card * {
            visibility: visible !important;
          }
          #printable-standee-card {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 32px !important;
            box-shadow: none !important;
            border: none !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            background: #ffffff !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: ${size === "A4" ? "A4 portrait" : "A5 portrait"};
            margin: 10mm;
          }
        }
      `}</style>

      {/* Top Controls Bar */}
      {showControls && (
        <div className="no-print w-full mb-4 flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          
          {/* Size Switcher */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-500 mr-1">Paper Size:</span>
            <button
              type="button"
              onClick={() => setSize("A5")}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                size === "A5"
                  ? "bg-[#2563EB] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              A5 (Counter Tent Card)
            </button>
            <button
              type="button"
              onClick={() => setSize("A4")}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                size === "A4"
                  ? "bg-[#2563EB] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              A4 (Standard Poster)
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={handlePrint}
              className="py-1.5 px-3 rounded-xl bg-[#080d24] hover:bg-[#2563EB] text-white transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>🖨️</span>
              <span>Print {size} Standee</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadQR}
              disabled={downloading === "qr"}
              className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
            >
              <span>📥</span>
              <span>Download QR</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
            >
              <span>{copied ? "✓" : "📋"}</span>
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="py-1.5 px-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          PRINTABLE STANDEE (Clean, Enterprise White Background)
         ======================================================== */}
      <div
        id="printable-standee-card"
        className={`w-full rounded-3xl bg-white border-2 border-slate-200 shadow-xl flex flex-col items-center justify-between text-center relative overflow-hidden transition-all ${
          size === "A4"
            ? "max-w-[500px] p-10 min-h-[680px]"
            : "max-w-[420px] p-7 min-h-[580px]"
        }`}
      >
        {/* Top Google Colors Signature Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />

        {/* 1. Header: Google Accreditation & "Review Us On Google" */}
        <div className="pt-2 flex flex-col items-center w-full">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Google
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black tracking-wide uppercase text-[#1a73e8]">
            REVIEW US ON GOOGLE
          </h3>

          <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
            How was your experience?
          </p>

          {/* 5 Large Golden Stars */}
          <div className="flex items-center justify-center gap-1 text-amber-400 text-2xl sm:text-3xl mt-1 drop-shadow-2xs">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
          </div>
        </div>

        {/* 2. Client Business Actual Logo & Name */}
        <div className="my-3 py-2 px-4 rounded-2xl w-full border border-slate-200 bg-slate-50/70 flex flex-col items-center justify-center gap-1">
          {business.logoUrl ? (
            <img
              src={business.logoUrl}
              alt={business.name}
              className="h-9 w-auto max-w-[150px] object-contain rounded mb-0.5"
            />
          ) : (
            <div
              className="h-8 px-3 rounded-lg flex items-center justify-center font-black text-white text-xs shadow-2xs mb-0.5"
              style={{ backgroundColor: business.brandColor || "#2563EB" }}
            >
              {business.name.substring(0, 3).toUpperCase()}
            </div>
          )}
          <span className="text-base sm:text-lg font-bold text-slate-900 truncate max-w-[280px]">
            {business.name}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            {business.category} {business.city ? `• ${business.city}` : ""}
          </span>
        </div>

        {/* 3. QR Code Prominently in Center */}
        <div className="bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-md my-2 relative group flex items-center justify-center">
          <img
            src={qrImageUrl}
            alt={`${business.name} Review QR`}
            className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
          />

          {/* Subtle Google G Watermark in Center of QR */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-11 h-11 rounded-2xl bg-white shadow-xl border-2 border-slate-100 flex items-center justify-center p-1.5">
              <svg className="w-full h-full" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 4. Below QR Instruction */}
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800">
            <span>📷</span>
            <span>Scan to share your experience</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
            <span>Takes only 15 seconds • No app needed</span>
          </div>
        </div>

        {/* 5. Minimal Bottom Accreditation */}
        <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <span>Verified Review Desk</span>
          <span className="font-mono text-[9.5px]">/r/{business.id}</span>
          <span>Digital FX ReviewFlow</span>
        </div>

      </div>

    </div>
  );
}
