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
  reviewUrl?: string;
  className?: string;
  compact?: boolean;
  showActions?: boolean;
}

/**
 * BrandedQRCard
 * Professional marketing QR card component designed specifically for business reviews.
 * Displays official company logo at the top, high-contrast QR with safe quiet zone in the center,
 * and centralized 'Managed by Digital FX • 📞 8860707797' branding at the bottom.
 */
export default function BrandedQRCard({
  businessName,
  businessId,
  reviewUrl = `/r/${businessId}`,
  className = "",
  compact = false,
  showActions = true,
}: BrandedQRCardProps) {
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
      link.download = `${businessId}-branded-qr.${format}`;
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

  if (compact) {
    return (
      <div
        className={`bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col items-center text-center max-w-[280px] ${className}`}
      >
        {/* Top Company Logo */}
        <div className="mb-2 flex items-center justify-center">
          <Image
            src={COMPANY_LOGO}
            alt={COMPANY_NAME}
            width={120}
            height={32}
            className="h-7 w-auto object-contain"
            priority
          />
        </div>

        <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full mb-2">
          Rate {businessName}
        </span>

        {/* Center High-Contrast QR */}
        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs mb-2">
          <img
            src={rawQrUrl}
            alt={`${businessName} Review QR Code`}
            className="w-32 h-32 object-contain rounded"
          />
        </div>

        {/* Bottom Managed By & Contact */}
        <div className="text-[10px] text-slate-500 font-medium">Managed by</div>
        <div className="text-xs font-black text-[#080d24]">{COMPANY_NAME}</div>
        <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#080d24] text-white text-[10px] font-bold">
          <span>📞</span>
          <span>{COMPANY_PHONE}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xl flex flex-col items-center text-center max-w-sm mx-auto relative overflow-hidden ${className}`}
    >
      {/* Top Brand Accent Line */}
      <div className="absolute top-0 left-8 right-8 h-1.5 bg-[#207de9] rounded-b-md" />

      {/* 1. Header: Official Company Logo */}
      <div className="pt-2 mb-3 flex flex-col items-center">
        <Image
          src={COMPANY_LOGO}
          alt={COMPANY_NAME}
          width={180}
          height={48}
          className="h-10 sm:h-11 w-auto object-contain"
          priority
        />
        <div className="mt-2.5 inline-block px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800 tracking-wide uppercase">
          Scan to Rate {businessName}
        </div>
      </div>

      {/* 2. Center: High-Contrast QR Code with Safe Quiet Zone */}
      <div className="bg-white p-3.5 rounded-2xl border-2 border-slate-100 shadow-sm inline-block my-2">
        <img
          src={rawQrUrl}
          alt={`${businessName} Review QR Code`}
          className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
        />
      </div>

      {/* Instruction Microcopy */}
      <p className="text-[11px] text-slate-500 font-medium max-w-xs mt-1 leading-snug">
        Point your phone camera to review us directly on Google
      </p>

      {/* 3. Footer: Company Branding & Contact Pill */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 w-full flex flex-col items-center">
        <span className="text-[11px] font-semibold text-slate-500">Managed by</span>
        <span className="text-base font-black text-[#080d24] tracking-tight mt-0.5">
          {COMPANY_NAME}
        </span>

        {/* Centralized Phone Number Pill */}
        <div className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#080d24] text-white text-xs font-bold shadow-xs">
          <span>📞</span>
          <span>{COMPANY_PHONE}</span>
        </div>

        <span className="text-[10px] font-semibold text-slate-400 mt-2">
          Google Verified Reviews • Fast AI Feedback
        </span>
      </div>

      {/* Download Action Buttons */}
      {showActions && (
        <div className="mt-5 pt-4 border-t border-slate-100 w-full grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleDownload("png")}
            disabled={downloading === "png"}
            className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-[#207de9] text-white text-center transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>{downloading === "png" ? "⏳" : "📥"}</span>
            <span>{downloading === "png" ? "Preparing..." : "Download PNG"}</span>
          </button>
          <button
            type="button"
            onClick={() => handleDownload("svg")}
            disabled={downloading === "svg"}
            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-center transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>📐</span>
            <span>{downloading === "svg" ? "Preparing..." : "Vector SVG"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
