"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  COMPANY_NAME,
  COMPANY_PHONE,
  COMPANY_FORMATTED_PHONE,
  COMPANY_LOGO,
} from "@/lib/companyBranding";

export interface BrandedQRCardProps {
  businessName: string;
  businessId: string;
  category?: string;
  reviewUrl?: string;
  logoUrl?: string;
  brandColor?: string;
  className?: string;
  compact?: boolean;
  showActions?: boolean;
  defaultTheme?: "google-white" | "luxury-black";
}

/**
 * BrandedQRCard
 * Official Google Business Acrylic Counter Standee (Tabletop Tent Card) design.
 * Features:
 * - Official Google Multi-color G Icon & "Review Us on Google" branding
 * - 5 Golden 3D rating stars
 * - Client Business Logo & Verified Directory Category
 * - Ultra-sharp high-contrast QR Code with safe quiet zone and center Google badge
 * - Camera scan instructions & frictionless 15-second promise
 * - Dual-theme support: Classic Google White & Luxury Black/Gold
 * - 1-Click A5 Print-Ready & Vector export options
 */
export default function BrandedQRCard({
  businessName,
  businessId,
  category = "Verified Local Business",
  reviewUrl = `/r/${businessId}`,
  logoUrl,
  brandColor = "#207de9",
  className = "",
  compact = false,
  showActions = true,
  defaultTheme = "google-white",
}: BrandedQRCardProps) {
  const [theme, setTheme] = useState<"google-white" | "luxury-black">(defaultTheme);
  const [downloading, setDownloading] = useState<string | null>(null);

  const qrPngUrl = `/api/reviewflow/qr?businessId=${encodeURIComponent(businessId)}&format=png`;
  const qrSvgUrl = `/api/reviewflow/qr?businessId=${encodeURIComponent(businessId)}&format=svg`;
  const rawQrUrl = `/api/reviewflow/qr?businessId=${encodeURIComponent(businessId)}&format=png&raw=true`;

  const handleDownload = async (format: "png" | "svg") => {
    setDownloading(format);
    try {
      const url = format === "png" ? qrPngUrl : qrSvgUrl;
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${businessId}-google-standee.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error(`Failed to download ${format}:`, err);
    } finally {
      setDownloading(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isDark = theme === "luxury-black";

  if (compact) {
    return (
      <div
        className={`rounded-2xl p-4 border shadow-sm flex flex-col items-center text-center max-w-[280px] ${
          isDark
            ? "bg-[#0b1021] text-white border-slate-800"
            : "bg-white text-slate-900 border-slate-200"
        } ${className}`}
      >
        {/* Google Mini Logo & Stars */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span className="text-[11px] font-black uppercase tracking-wider">
            Review Us on Google
          </span>
        </div>

        <div className="flex items-center gap-0.5 text-amber-400 text-xs mb-2">
          {"★★★★★"}
        </div>

        <div className="text-xs font-black truncate max-w-[200px] mb-2">
          {businessName}
        </div>

        {/* Center High-Contrast QR */}
        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs mb-2 relative">
          <img
            src={rawQrUrl}
            alt={`${businessName} Review QR Code`}
            className="w-28 h-28 object-contain rounded"
          />
          {/* Central Google 'G' mini watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-6 h-6 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center p-0.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 font-semibold">
          📷 Point camera to rate 5★
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center w-full max-w-sm mx-auto ${className}`}>
      
      {/* Theme Switcher Toggle */}
      {showActions && (
        <div className="mb-3 flex items-center justify-between w-full px-1 text-xs">
          <span className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">
            Standee Style:
          </span>
          <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
            <button
              type="button"
              onClick={() => setTheme("google-white")}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                theme === "google-white"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              ⚪ Classic White
            </button>
            <button
              type="button"
              onClick={() => setTheme("luxury-black")}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                theme === "luxury-black"
                  ? "bg-slate-900 text-amber-300 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              ⚫ Luxury Black
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          THE OFFICIAL GOOGLE BUSINESS STANDEE (A5 TABLET TENT CARD)
          ======================================================== */}
      <div
        id={`standee-${businessId}`}
        className={`w-full rounded-3xl p-6 sm:p-7 border-2 shadow-2xl flex flex-col items-center text-center relative overflow-hidden transition-all duration-300 ${
          isDark
            ? "bg-gradient-to-b from-[#0a0f1f] via-[#080c1a] to-[#04060c] text-white border-amber-400/40 shadow-amber-500/10"
            : "bg-gradient-to-b from-white via-white to-slate-50 text-slate-900 border-slate-200/90 shadow-slate-300/40"
        }`}
      >
        {/* Top Google Colors Signature Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />

        {/* 1. OFFICIAL GOOGLE BUSINESS HEADER */}
        <div className="pt-2 mb-2 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            {/* Google 4-Color G Logo */}
            <svg className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-[#1f2937]"}`}>
              Google
            </span>
          </div>

          <h3 className={`text-base sm:text-lg font-black tracking-wide uppercase ${isDark ? "text-amber-300" : "text-[#1a73e8]"}`}>
            REVIEW US ON GOOGLE
          </h3>

          {/* 5 3D Golden Stars */}
          <div className="flex items-center justify-center gap-1 text-amber-400 text-xl sm:text-2xl mt-0.5 drop-shadow-sm">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
          </div>
        </div>

        {/* 2. CLIENT BUSINESS IDENTITY */}
        <div className="my-2 py-2 px-3 rounded-2xl w-full border border-dashed flex flex-col items-center justify-center gap-1 bg-slate-50/50"
          style={{ borderColor: isDark ? "rgba(251, 191, 36, 0.2)" : "rgba(203, 213, 225, 0.8)" }}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={businessName}
              className="h-8 w-auto max-w-[140px] object-contain mb-0.5 rounded"
            />
          ) : (
            <div
              className="h-7 px-3 rounded-lg flex items-center justify-center font-black text-white text-xs shadow-xs mb-0.5"
              style={{ backgroundColor: brandColor }}
            >
              {businessName.substring(0, 3).toUpperCase()}
            </div>
          )}
          <span className={`text-sm sm:text-base font-black truncate max-w-[260px] ${isDark ? "text-white" : "text-[#080d24]"}`}>
            {businessName}
          </span>
          <span className="text-[10.5px] text-slate-400 font-medium">
            {category} • Official Feedback Desk
          </span>
        </div>

        {/* 3. CENTERPIECE: HIGH-DEFINITION QR WITH QUIET ZONE */}
        <div className="bg-white p-3.5 sm:p-4 rounded-3xl border-2 border-slate-200 shadow-md my-2.5 relative group">
          <img
            src={rawQrUrl}
            alt={`${businessName} Official Google Review QR`}
            className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
          />

          {/* Centerpiece Google "G" Watermark Badge */}
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

        {/* 4. CALL TO ACTION MICROCOPY */}
        <div className="mt-1 space-y-1.5">
          <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black tracking-tight">
            <span>📷</span>
            <span>POINT YOUR PHONE CAMERA TO SCAN</span>
          </div>

          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
            isDark
              ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
              : "bg-emerald-50 text-emerald-800 border border-emerald-200"
          }`}>
            <span>⚡ Takes Only 15 Seconds • No App Needed</span>
          </div>
        </div>

        {/* 5. FOOTER ACCREDITATION & NFC BADGE */}
        <div className={`mt-4 pt-3.5 border-t w-full flex flex-col items-center text-[10px] sm:text-[11px] ${
          isDark ? "border-white/10 text-slate-400" : "border-slate-100 text-slate-500"
        }`}>
          <div className="flex items-center gap-2 font-semibold">
            <span>(( 📲 Tap Phone for NFC ))</span>
            <span>•</span>
            <span className="font-mono font-bold text-[#207de9]">
              digitalfx.in/r/{businessId}
            </span>
          </div>

          <div className="mt-1.5 font-medium flex items-center justify-center gap-1.5">
            <span>Google Business Partner • ReviewFlow AI</span>
            <span>•</span>
            <strong className={isDark ? "text-slate-200" : "text-slate-800"}>Digital FX</strong>
          </div>
        </div>

      </div>

      {/* ========================================================
          STAND Actions: Print A5 Tent Card + PNG + SVG
          ======================================================== */}
      {showActions && (
        <div className="mt-4 w-full grid grid-cols-3 gap-2 text-xs font-bold">
          
          {/* Print Button (Formatted for A5 Acrylic Standee) */}
          <button
            type="button"
            onClick={handlePrint}
            className="py-2.5 px-2 rounded-xl bg-[#080d24] hover:bg-[#1570ef] text-white text-center transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            title="Print A5 Tabletop Acrylic Standee"
          >
            <span>🖨️</span>
            <span>Print A5</span>
          </button>

          {/* Download PNG */}
          <button
            type="button"
            onClick={() => handleDownload("png")}
            disabled={downloading === "png"}
            className="py-2.5 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#207de9] border border-blue-200 text-center transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <span>{downloading === "png" ? "⏳" : "📥"}</span>
            <span>PNG</span>
          </button>

          {/* Download Vector SVG */}
          <button
            type="button"
            onClick={() => handleDownload("svg")}
            disabled={downloading === "svg"}
            className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-center transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <span>📐</span>
            <span>SVG</span>
          </button>
        </div>
      )}
    </div>
  );
}
