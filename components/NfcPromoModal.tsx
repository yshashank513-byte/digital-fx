"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import Image from "next/image";

const WHATSAPP_ENQUIRY_URL =
  "https://wa.me/919319807273?text=" +
  encodeURIComponent(
    "Hi Digital FX, I saw the NFC Google Review Standee on your website. Please share the details, pricing and availability for my business."
  );

const SANS_FONT_STACK =
  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export default function NfcPromoModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Check if current route is an excluded route (Admin or Customer Review Collection flow)
  const isExcludedRoute =
    !pathname ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/r/") ||
    pathname.startsWith("/review");

  // Handle Close
  const handleClose = useCallback(() => {
    setIsOpen(false);
    try {
      sessionStorage.setItem("dfx_nfc_promo_dismissed", "true");
    } catch {
      // ignore storage errors
    }
  }, []);

  // Handle Open (Manual or via Floating Badge)
  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Auto-open after a short delay
  useEffect(() => {
    setHasMounted(true);

    if (isExcludedRoute) return;

    // Check if dismissed previously in this session
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem("dfx_nfc_promo_dismissed") === "true";
    } catch {
      dismissed = false;
    }

    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isExcludedRoute]);

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, handleClose]);

  if (!hasMounted || isExcludedRoute) {
    return null;
  }

  return createPortal(
    <div style={{ fontFamily: SANS_FONT_STACK }}>
      {/* =========================================================
          1. REAL HUMAN FLOATING PILL (Non-AI, Authentic Product Badge)
          ========================================================= */}
      {!isOpen && (
        <aside
          aria-label="Google Review Standee Announcement"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 999990,
            fontFamily: SANS_FONT_STACK,
          }}
          className="animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <button
            type="button"
            onClick={handleOpen}
            style={{
              backgroundColor: "#0f172a",
              color: "#f8fafc",
              border: "1px solid #334155",
              boxShadow: "0 10px 25px -4px rgba(0, 0, 0, 0.35), 0 4px 10px -2px rgba(0, 0, 0, 0.2)",
              fontFamily: SANS_FONT_STACK,
            }}
            className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium hover:bg-slate-800 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {/* Authentic Google 4-Color 'G' Logo */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.66-5.2 3.66-9.12z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.43 7.33 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.13z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
            </svg>

            <span className="font-semibold text-slate-100">
              Google Review Standee
            </span>

            <span className="text-slate-500 font-normal">
              •
            </span>

            <span className="text-blue-400 font-medium">
              Coming Soon
            </span>

            <span className="text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all text-xs font-bold ml-0.5">
              →
            </span>
          </button>
        </aside>
      )}

      {/* =========================================================
          2. ENGAGING POPUP MODAL (Customer Attraction)
          ========================================================= */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Digital FX NFC Tag Coming Soon"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999999,
            fontFamily: SANS_FONT_STACK,
          }}
          className="flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200"
        >
          {/* Backdrop blur */}
          <div
            onClick={handleClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1,
              backgroundColor: "rgba(3, 7, 18, 0.85)",
              backdropFilter: "blur(8px)",
            }}
            className="transition-opacity cursor-pointer"
          />

          {/* Modal Container */}
          <div
            style={{
              zIndex: 2,
              backgroundColor: "#0f172a",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              fontFamily: SANS_FONT_STACK,
            }}
            className="relative w-full max-w-[680px] rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(59,130,246,0.3)] overflow-hidden animate-in zoom-in-95 duration-300"
          >
            
            {/* Top Close Button (Desktop & Mobile) */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close Announcement"
              style={{ zIndex: 10, backgroundColor: "rgba(15, 23, 42, 0.9)" }}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-red-600 text-white border border-white/20 shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Glowing Accent Top Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-600" />

            {/* Graphic Artwork Banner */}
            <div className="relative w-full bg-white flex items-center justify-center overflow-hidden">
              <Image
                src="/nfc-tag-promo.jpg"
                alt="Digital FX NFC Tag Coming Soon - Just Tap and Get More Google Reviews"
                width={1200}
                height={800}
                className="w-full h-auto object-contain block select-none"
                priority
              />
            </div>

            {/* Natural Human Bottom Action Bar (Non-AI, Authentic) */}
            <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Natural Human Description */}
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                  </span>
                  <span
                    style={{ fontFamily: SANS_FONT_STACK }}
                    className="text-xs font-bold uppercase tracking-wider text-blue-400"
                  >
                    NFC Google Review Standee
                  </span>
                </div>
                <p
                  style={{ fontFamily: SANS_FONT_STACK }}
                  className="text-xs text-slate-300 mt-1 font-normal leading-relaxed"
                >
                  Walk-in customers can just tap their phone on the standee to leave a Google review. No QR scan or search needed.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    color: "#94a3b8",
                    border: "1px solid rgba(51, 65, 85, 0.8)",
                    fontFamily: SANS_FONT_STACK,
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-medium hover:text-white transition cursor-pointer text-center"
                >
                  Close
                </button>

                <a
                  href={WHATSAPP_ENQUIRY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "#ffffff",
                    boxShadow: "0 8px 20px -4px rgba(16, 185, 129, 0.35)",
                    fontFamily: SANS_FONT_STACK,
                  }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer text-center whitespace-nowrap"
                >
                  {/* WhatsApp Vector Icon */}
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm.01 1.67c4.55 0 8.25 3.7 8.25 8.24 0 2.2-.86 4.28-2.42 5.83-1.56 1.56-3.63 2.42-5.83 2.42-1.48 0-2.93-.39-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.188 8.188 0 01-1.25-4.39c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.5-1.4-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z" />
                  </svg>
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
