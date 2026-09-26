"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { BusinessProfile } from "@/lib/reviewFlowTypes";
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  generateNaturalHumanReview,
} from "@/lib/humanReviewEngine";

interface Props {
  business: BusinessProfile;
}

export default function CustomerReviewClient({ business }: Props) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [reviewDraft, setReviewDraft] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [variationIndex, setVariationIndex] = useState<number>(0);
  const [sessionId] = useState<string>(() => "sess-" + Math.random().toString(36).substring(2, 10));

  // 1. Generate human review on language or rating change
  const refreshReview = useCallback(
    (lang: SupportedLanguage = language, currentRating: number = rating) => {
      setIsShuffling(true);
      const generated = generateNaturalHumanReview(
        business.name,
        business.category,
        lang,
        Date.now() + Math.random() * 1000,
        currentRating
      );
      setReviewDraft(generated);
      setVariationIndex((prev) => prev + 1);
      setTimeout(() => setIsShuffling(false), 150);
    },
    [business.name, business.category, language, rating]
  );

  // Initialize review on mount
  useEffect(() => {
    refreshReview("en", 5);
  }, []);

  // 2. Record Page Visit on Mount & check for QR scan
  useEffect(() => {
    try {
      const isQr = typeof window !== "undefined" && window.location.search.includes("src=qr");
      fetch("/api/reviewflow/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          eventType: isQr ? "scan" : "visit",
        }),
      }).catch(() => {});
    } catch (_) {}
  }, [business.id]);

  // Handle Language Change
  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    refreshReview(newLang, rating);
  };

  // Handle Rating Change
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    refreshReview(language, newRating);
  };

  // Copy review to clipboard
  const handleCopyReview = async () => {
    try {
      await navigator.clipboard.writeText(reviewDraft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {
      const ta = document.createElement("textarea");
      ta.value = reviewDraft;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Handle Click on "Copy & Post to Google" Button
  const handleGoogleReviewClick = async () => {
    // 1. Copy review text to clipboard
    await handleCopyReview();

    // 2. Track analytics event
    try {
      fetch("/api/reviewflow/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          eventType: "google_click",
          sessionData: {
            sessionId,
            businessId: business.id,
            category: business.category,
            customerRating: rating,
            language,
            finalReviewText: reviewDraft,
          },
        }),
      }).catch(() => {});
    } catch (_) {}

    // 3. Open verified Google Maps review destination
    let targetUrl = business.googleReviewUrl?.trim();
    const isPlaceholder =
      !targetUrl ||
      targetUrl.includes("ChIJr8q_Orbit_Plaza_DigitalFX") ||
      targetUrl.includes("ChIJspeedy_packers_ncr") ||
      targetUrl.includes("ChIJshree_jewellers_rdc");

    if (isPlaceholder) {
      const query = encodeURIComponent(`${business.name} ${business.address || business.city || ""}`.trim());
      targetUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    }

    // Small delay to let user see "Copied!" notification then open Google Maps
    setTimeout(() => {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }, 200);
  };

  const ratingDescriptions: Record<number, string> = {
    5: "Excellent / Loved it! ★★★★★",
    4: "Very Good Experience ★★★★☆",
    3: "Average / Satisfactory ★★★☆☆",
    2: "Needs Improvement ★★☆☆☆",
    1: "Disappointing ★☆☆☆☆",
  };

  // Status Check: Deactivated Review Desk
  if (business.status === "deactivated") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 font-sans flex flex-col justify-between p-4 sm:p-6">
        <header className="max-w-xl mx-auto w-full pt-4">
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3">
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt={business.name}
                  className="h-10 w-auto max-w-[120px] object-contain rounded"
                />
              ) : (
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-xs"
                  style={{ backgroundColor: business.brandColor || "#64748b" }}
                >
                  {business.name.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-base font-extrabold text-[#080d24] leading-tight line-clamp-1">
                  {business.name}
                </h1>
                <span className="text-xs text-slate-500">{business.category}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
              Paused
            </span>
          </div>
        </header>

        <main className="max-w-xl mx-auto w-full py-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-4xl shadow-sm">
            ⏸️
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#080d24] tracking-tight">
              Review Desk Temporarily Inactive
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              This review desk for <strong>{business.name}</strong> is temporarily paused or undergoing scheduled maintenance. Thank you for your patience.
            </p>
          </div>

          {(business.phone || business.email || business.address) && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs text-left space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Direct Contact Information
              </h3>
              <div className="space-y-2 text-sm text-slate-700">
                {business.address && (
                  <p className="flex items-start gap-2">
                    <span>📍</span>
                    <span>{business.address}{business.city ? `, ${business.city}` : ""}</span>
                  </p>
                )}
                {business.phone && (
                  <p className="flex items-center gap-2">
                    <span>📞</span>
                    <a href={`tel:${business.phone}`} className="text-[#207de9] font-bold hover:underline">
                      {business.phone}
                    </a>
                  </p>
                )}
                {business.email && (
                  <p className="flex items-center gap-2">
                    <span>✉️</span>
                    <a href={`mailto:${business.email}`} className="text-[#207de9] font-medium hover:underline">
                      {business.email}
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}
        </main>

        <footer className="max-w-xl mx-auto w-full text-center py-4 border-t border-slate-200 text-xs text-slate-400">
          <Link href="/" className="hover:text-[#207de9] transition font-semibold">
            Powered by ReviewFlow AI
          </Link>
          <span className="mx-2">•</span>
          <Link href="/privacy-policy" className="hover:text-slate-600 transition">
            Privacy Policy
          </Link>
        </footer>
      </div>
    );
  }

  // Status Check: Pending Approval, Draft, or Rejected
  if (business.status === "pending_approval" || business.status === "draft" || business.status === "rejected") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 font-sans flex flex-col justify-between p-4 sm:p-6">
        <header className="max-w-xl mx-auto w-full pt-4">
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3">
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt={business.name}
                  className="h-10 w-auto max-w-[120px] object-contain rounded"
                />
              ) : (
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-xs"
                  style={{ backgroundColor: business.brandColor || "#207de9" }}
                >
                  {business.name.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-base font-extrabold text-[#080d24] leading-tight line-clamp-1">
                  {business.name}
                </h1>
                <span className="text-xs text-slate-500">{business.category}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#207de9] text-xs font-bold">
              Under Setup
            </span>
          </div>
        </header>

        <main className="max-w-xl mx-auto w-full py-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-4xl shadow-sm">
            ✨
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#080d24] tracking-tight">
              Review Desk Under Verification
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              This review desk for <strong>{business.name}</strong> is currently being verified and configured. It will be available shortly for customer reviews.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs text-xs text-slate-500 max-w-md mx-auto">
            <p>If you are the business administrator, please sign into the unified admin dashboard to approve and activate this business.</p>
          </div>
        </main>

        <footer className="max-w-xl mx-auto w-full text-center py-4 border-t border-slate-200 text-xs text-slate-400">
          <Link href="/" className="hover:text-[#207de9] transition font-semibold">
            Powered by ReviewFlow AI
          </Link>
          <span className="mx-2">•</span>
          <Link href="/privacy-policy" className="hover:text-slate-600 transition">
            Privacy Policy
          </Link>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 font-sans pb-16">
      
      {/* Floating Copied Toast */}
      {copied && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-bounce border border-emerald-400">
          <span className="text-base">✓</span>
          <span>Review text copied! Opening Google Maps...</span>
        </div>
      )}

      {/* 1. TOP BRAND BANNER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={business.name}
                className="h-9 w-auto max-w-[120px] object-contain rounded"
              />
            ) : (
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-xs"
                style={{ backgroundColor: business.brandColor || "#207de9" }}
              >
                {business.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-sm font-extrabold text-[#080d24] leading-tight line-clamp-1">
                {business.name}
              </h1>
              <span className="text-[11px] font-semibold text-slate-500">
                Verified Google Business Portal
              </span>
            </div>
          </div>

          {/* Official Google Verified Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Verified 5★ Desk</span>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTAINER */}
      <main className="max-w-xl mx-auto px-4 pt-4 sm:pt-6 space-y-4">
        
        {/* STEP 1: SABSE PEHLE STAR RATING CARD (HERO FOCUS) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-500" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#207de9] text-xs font-bold mb-3 border border-blue-100">
            <span>📍 {business.category}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#080d24] tracking-tight">
            How was your experience?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Tap a star to rate <strong className="text-slate-800">{business.name}</strong>:
          </p>

          {/* BIG INTERACTIVE STARS */}
          <div className="mt-5 py-2 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5].map((star) => {
                const isLit = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Rate ${star} stars`}
                    className="p-1 sm:p-1.5 transition-transform hover:scale-125 active:scale-95 focus:outline-none cursor-pointer group"
                  >
                    <span
                      className={`text-4xl sm:text-5xl transition-all duration-200 block drop-shadow-sm ${
                        isLit
                          ? "text-amber-400 scale-105"
                          : "text-slate-200 group-hover:text-amber-200"
                      }`}
                    >
                      ★
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Rating Badge */}
            <div className="mt-3.5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs sm:text-sm font-bold text-slate-800">
              <span className="text-amber-500 font-extrabold">{rating} ★</span>
              <span>{ratingDescriptions[rating]}</span>
            </div>
          </div>
        </div>

        {/* STEP 2: DYNAMIC AI REVIEW GENERATED ACCORDING TO STAR RATING */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200 shadow-md space-y-4 animate-fadeIn">
          
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                ✨ AI Suggested Review for {rating}★ Rating
              </span>
              <span className="text-[11px] text-slate-500">
                Tailored for {business.name} • 100% genuine tone
              </span>
            </div>

            {/* Language Switcher Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#207de9] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>{lang.flag} {lang.nativeLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editable Review Draft Box */}
          <div className="relative">
            <textarea
              value={reviewDraft}
              onChange={(e) => setReviewDraft(e.target.value)}
              rows={4}
              aria-label="Review Text"
              className={`w-full text-sm sm:text-base leading-relaxed p-4 rounded-2xl border border-slate-300 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#207de9] text-slate-900 transition font-normal ${
                isShuffling ? "opacity-40" : "opacity-100"
              }`}
            />
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              ✏️ Aap is text me kuch bhi edit ya apna personal point add kar sakte hain.
            </p>
          </div>

          {/* Actions: Shuffle & Manual Copy */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <button
              type="button"
              onClick={() => refreshReview(language, rating)}
              disabled={isShuffling}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-blue-50 text-[#207de9] border border-blue-200 hover:bg-blue-100 transition cursor-pointer active:scale-95"
            >
              <span className={isShuffling ? "animate-spin" : ""}>🔄</span>
              <span>दूसरा रिव्यू देखें / Suggest Another</span>
            </button>

            <button
              type="button"
              onClick={handleCopyReview}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
                copied
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
              }`}
            >
              <span>{copied ? "✓" : "📋"}</span>
              <span>{copied ? "Copied!" : "Copy Text"}</span>
            </button>
          </div>

          {/* STEP 3: THE MAIN "COPY & POST TO GOOGLE" BUTTON */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGoogleReviewClick}
              className="w-full py-4 px-6 rounded-2xl font-black text-white text-base sm:text-lg bg-[#4285F4] hover:bg-[#3367d6] shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-98 group"
            >
              {/* Google G Icon */}
              <svg className="w-6 h-6 shrink-0 bg-white rounded-full p-0.5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>COPY &amp; POST TO GOOGLE</span>
              <span className="text-xl group-hover:translate-x-1 transition-transform">↗</span>
            </button>
            <p className="text-center text-[11.5px] text-slate-500 mt-2 font-medium">
              Click karte hi review copy ho jayega aur Google review box open hoga. Waha bas <strong>Paste &amp; Post</strong> karein!
            </p>
          </div>

          {/* Quick Steps Helper Box */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 text-xs text-slate-600">
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block mb-1">
              ⚡ How It Works (15 Seconds):
            </span>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-white p-2 rounded-xl border border-slate-200/70">
                <span className="font-black text-[#207de9] block">1. Click</span>
                <span className="text-[10px] text-slate-500">Auto-copies text</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200/70">
                <span className="font-black text-[#207de9] block">2. Google Opens</span>
                <span className="text-[10px] text-slate-500">Review box opens</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200/70">
                <span className="font-black text-emerald-600 block">3. Paste &amp; Submit</span>
                <span className="text-[10px] text-slate-500">Done in 5 sec!</span>
              </div>
            </div>
          </div>

        </div>

        {/* 6. POLICY COMPLIANCE & PRIVACY FOOTER */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 text-center space-y-2">
          <p className="text-[11px] text-slate-500 leading-relaxed max-w-md mx-auto font-normal">
            🛡️ <strong>Google Review Policy Compliance:</strong> ReviewFlow AI provides assistance in organizing customer feedback into natural reviews. We never post reviews automatically, never incentivize ratings, and never restrict critical feedback.
          </p>
          <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 pt-1">
            <Link href="/" className="hover:text-[#207de9] transition font-semibold">
              Powered by ReviewFlow AI • Digital FX
            </Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-slate-600 transition">
              Privacy Policy
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
