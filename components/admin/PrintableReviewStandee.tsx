"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
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
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  // Compute Review Portal URL (Directs customer to 3-step review flow)
  const logoParam = business.logoUrl ? `&logoUrl=${encodeURIComponent(business.logoUrl)}` : "";
  const reviewPortalUrl = `${origin}/r/${business.id}?name=${encodeURIComponent(business.name)}&cat=${encodeURIComponent(business.category)}&city=${encodeURIComponent(business.city || "")}&reviewUrl=${encodeURIComponent(business.googleReviewUrl || "")}${logoParam}&src=standee`;

  // Generate crisp, high-resolution QR matrix locally in the browser (Zero CSP issues, 0ms latency)
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(reviewPortalUrl, {
      width: 700,
      margin: 1,
      errorCorrectionLevel: "H",
      color: {
        dark: "#0F172A",
        light: "#FFFFFF",
      },
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error("Standee QR generation error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [reviewPortalUrl]);

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

  // User explicitly requested clicking "Download QR" downloads the FULL STANDEE in high-res JPG
  const handleDownloadQR = () => {
    handleDownloadStandeeJPG();
  };

  // High-Resolution Standee Export in JPG Format (1500 x 2120 px @ 300 DPI)
  const handleDownloadStandeeJPG = async () => {
    if (!qrDataUrl) return;
    setDownloading("jpg");

    try {
      const canvas = document.createElement("canvas");
      // Standard A5 / A4 ratio (1:1.414) at ultra-sharp 300 DPI resolution
      const width = 1500;
      const height = 2120;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get 2D canvas context");

      // 1. Pure White Base Background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);

      // Helper for rounded rectangles
      const drawRoundedRect = (x: number, y: number, w: number, h: number, r: number) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + r, r);
        ctx.lineTo(x + w, y + h - r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h);
        ctx.arcTo(x, y + h, x, y + h - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.closePath();
      };

      // 2. Outer Card Border & Frame
      const margin = 44;
      const cardW = width - margin * 2;
      const cardH = height - margin * 2;
      const cardRadius = 52;

      // Soft drop shadow effect for card border
      ctx.save();
      drawRoundedRect(margin, margin, cardW, cardH, cardRadius);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#E2E8F0";
      ctx.stroke();

      // Clip inside rounded card so top stripe curves gracefully
      drawRoundedRect(margin, margin, cardW, cardH, cardRadius);
      ctx.clip();

      // 3. Top Google 4-Color Signature Stripe
      const stripeH = 20;
      const grad = ctx.createLinearGradient(margin, margin, margin + cardW, margin);
      grad.addColorStop(0, "#4285F4");
      grad.addColorStop(0.35, "#EA4335");
      grad.addColorStop(0.65, "#FBBC05");
      grad.addColorStop(1, "#34A853");
      ctx.fillStyle = grad;
      ctx.fillRect(margin, margin, cardW, stripeH);
      ctx.restore();

      // 4. Header: Google G Icon + "Google"
      const googleY = 160;
      const gSize = 56;
      const gX = width / 2 - 115;
      const gY = googleY - 42;

      const gSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>`;
      const gDataUri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(gSvg);

      const gImg = new Image();
      await new Promise<void>((resolve) => {
        gImg.onload = () => {
          ctx.drawImage(gImg, gX, gY, gSize, gSize);
          resolve();
        };
        gImg.onerror = () => resolve();
        gImg.src = gDataUri;
      });

      // "Google" word next to icon
      ctx.fillStyle = "#1E293B";
      ctx.font = "bold 58px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("Google", gX + gSize + 16, googleY + 4);

      // "REVIEW US ON GOOGLE"
      ctx.textAlign = "center";
      ctx.fillStyle = "#1A73E8";
      ctx.font = "900 42px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText("REVIEW US ON GOOGLE", width / 2, 238);

      // "How was your experience?"
      ctx.fillStyle = "#475569";
      ctx.font = "600 30px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText("How was your experience?", width / 2, 288);

      // 5 Golden Stars
      ctx.fillStyle = "#F59E0B";
      ctx.font = "58px sans-serif";
      ctx.fillText("★   ★   ★   ★   ★", width / 2, 365);

      // 5. Business Info Card
      const bizBoxY = 415;
      const bizBoxH = 195;
      const bizBoxW = cardW - 120;
      const bizBoxX = (width - bizBoxW) / 2;
      drawRoundedRect(bizBoxX, bizBoxY, bizBoxW, bizBoxH, 28);
      ctx.fillStyle = "#F8FAFC";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#E2E8F0";
      ctx.stroke();

      let textStartY = bizBoxY + 124;
      if (business.logoUrl) {
        const logoImg = new Image();
        logoImg.crossOrigin = "anonymous";
        await new Promise<void>((resolve) => {
          logoImg.onload = () => {
            const lSize = 72;
            ctx.save();
            drawRoundedRect(width / 2 - lSize / 2, bizBoxY + 16, lSize, lSize, 16);
            ctx.clip();
            ctx.drawImage(logoImg, width / 2 - lSize / 2, bizBoxY + 16, lSize, lSize);
            ctx.restore();
            resolve();
          };
          logoImg.onerror = () => {
            drawFallbackBadge(ctx, width / 2 - 36, bizBoxY + 16, 72, business);
            resolve();
          };
          logoImg.src = business.logoUrl!;
        });
      } else {
        drawFallbackBadge(ctx, width / 2 - 36, bizBoxY + 16, 72, business);
      }

      // Business Name
      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 38px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText(business.name, width / 2, textStartY);

      // Category + City
      ctx.fillStyle = "#64748B";
      ctx.font = "500 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      const catText = `${business.category}${business.city ? ` • ${business.city}` : ""}`;
      ctx.fillText(catText, width / 2, textStartY + 38);

      // 6. QR Code Container Box
      const qrBoxY = 645;
      const qrBoxSize = 780;
      const qrBoxX = (width - qrBoxSize) / 2;
      drawRoundedRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 40);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#CBD5E1";
      ctx.stroke();

      // Draw QR Code
      const qrImg = new Image();
      await new Promise<void>((resolve) => {
        qrImg.onload = () => {
          const qrPad = 44;
          ctx.drawImage(
            qrImg,
            qrBoxX + qrPad,
            qrBoxY + qrPad,
            qrBoxSize - qrPad * 2,
            qrBoxSize - qrPad * 2
          );
          resolve();
        };
        qrImg.src = qrDataUrl;
      });

      // Center Google G Badge inside QR
      const badgeSize = 114;
      const badgeX = width / 2 - badgeSize / 2;
      const badgeY = qrBoxY + qrBoxSize / 2 - badgeSize / 2;
      drawRoundedRect(badgeX, badgeY, badgeSize, badgeSize, 28);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#E2E8F0";
      ctx.stroke();

      const gCenterImg = new Image();
      await new Promise<void>((resolve) => {
        gCenterImg.onload = () => {
          const iconSize = 66;
          ctx.drawImage(
            gCenterImg,
            width / 2 - iconSize / 2,
            qrBoxY + qrBoxSize / 2 - iconSize / 2,
            iconSize,
            iconSize
          );
          resolve();
        };
        gCenterImg.src = gDataUri;
      });

      // 7. Below QR Instruction
      const scanTextY = qrBoxY + qrBoxSize + 70;
      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 34px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText("📷  Scan to share your experience", width / 2, scanTextY);

      // "Takes only 15 seconds • No app needed" Pill
      const pillY = scanTextY + 28;
      const pillW = 550;
      const pillH = 50;
      drawRoundedRect((width - pillW) / 2, pillY, pillW, pillH, 25);
      ctx.fillStyle = "#F1F5F9";
      ctx.fill();
      ctx.fillStyle = "#475569";
      ctx.font = "600 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText("Takes only 15 seconds • No app needed", width / 2, pillY + 34);

      // 8. Bottom Footer
      const footerY = height - margin - 52;
      ctx.strokeStyle = "#F1F5F9";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(margin + 40, footerY - 32);
      ctx.lineTo(width - margin - 40, footerY - 32);
      ctx.stroke();

      ctx.font = "500 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillStyle = "#94A3B8";
      ctx.textAlign = "left";
      ctx.fillText("Verified Review Desk", margin + 50, footerY);

      ctx.textAlign = "center";
      ctx.fillStyle = "#64748B";
      ctx.font = "500 20px monospace";
      ctx.fillText(`/r/${business.id}`, width / 2, footerY);

      ctx.textAlign = "right";
      ctx.fillStyle = "#94A3B8";
      ctx.font = "500 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText("Digital FX ReviewFlow", width - margin - 50, footerY);

      // 9. Convert to High-Quality JPEG Blob & Trigger Download
      canvas.toBlob(
        (blob) => {
          if (!blob) throw new Error("Canvas blob conversion failed");
          const objectUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = objectUrl;
          link.download = `${business.id}-standee.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(objectUrl);
          setDownloading(null);
        },
        "image/jpeg",
        0.98
      );
    } catch (err) {
      console.error("Failed to generate Standee JPG:", err);
      setDownloading(null);
    }
  };

  // Helper for drawing initials badge on canvas
  const drawFallbackBadge = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    biz: BusinessProfile
  ) => {
    const r = 16;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + size - r, y);
    ctx.arcTo(x + size, y, x + size, y + r, r);
    ctx.lineTo(x + size, y + size - r);
    ctx.arcTo(x + size, y + size, x + size - r, y + size, r);
    ctx.lineTo(x + r, y + size);
    ctx.arcTo(x, y + size, x, y + size - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.fillStyle = biz.brandColor || "#2563EB";
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const initials = biz.name.substring(0, 3).toUpperCase();
    ctx.fillText(initials, x + size / 2, y + size / 2);
    ctx.textBaseline = "alphabetic";
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
            {/* Primary Action: Download QR Full Standee in High-Res JPG */}
            <button
              type="button"
              onClick={handleDownloadStandeeJPG}
              disabled={downloading === "jpg" || !qrDataUrl}
              className="py-1.5 px-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs font-bold disabled:opacity-50"
            >
              {downloading === "jpg" ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Downloading Standee...</span>
                </>
              ) : (
                <>
                  <span>📥</span>
                  <span>Download QR (Full Standee JPG)</span>
                </>
              )}
            </button>

            {/* Print Standee */}
            <button
              type="button"
              onClick={handlePrint}
              className="py-1.5 px-3 rounded-xl bg-[#080d24] hover:bg-[#2563EB] text-white transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>🖨️</span>
              <span>Print {size}</span>
            </button>

            {/* Copy Review Portal Link */}
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
        <div className="bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-md my-2 relative group flex items-center justify-center min-w-[200px] min-h-[200px]">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`${business.name} Review QR`}
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
            />
          ) : (
            <div className="w-48 h-48 sm:w-56 sm:h-56 flex flex-col items-center justify-center bg-slate-50 rounded-2xl gap-2">
              <span className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-[#2563EB]" />
              <span className="text-[10px] font-bold text-slate-400">Rendering QR...</span>
            </div>
          )}

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

      {/* Quick Download Standee Button directly below card */}
      <div className="no-print mt-4 w-full flex justify-center">
        <button
          type="button"
          onClick={handleDownloadStandeeJPG}
          disabled={downloading === "jpg" || !qrDataUrl}
          className="w-full max-w-[420px] py-3 px-5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {downloading === "jpg" ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Downloading Full Standee (1500 x 2120 px)...</span>
            </>
          ) : (
            <>
              <span>📥</span>
              <span>Download QR (Pura Standee JPG)</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
