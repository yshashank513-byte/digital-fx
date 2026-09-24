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
        Date.now() + Math.random() * 1000
      );
      setReviewDraft(generated);
      setVariationIndex((prev) => prev + 1);
      setTimeout(() => setIsShuffling(false), 200);
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

  // Handle Click on Google Review Button
  const handleGoogleReviewClick = () => {
    // 1. Copy review text to clipboard
    handleCopyReview();

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

    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  const ratingDescriptions: Record<number, string> = {
    5: "Excellent / Loved it! ★★★★★",
    4: "Very Good Experience ★★★★☆",
    3: "Average / Satisfactory ★★★☆☆",
    2: "Needs Improvement ★★☆☆☆",
    1: "Disappointing ★☆☆☆☆",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 font-sans pb-16">
      {/* 1. TOP BRAND BANNER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={business.name}
                className="h-8 w-auto max-w-[120px] object-contain rounded"
              />
            ) : (
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center font-black text-white text-xs shadow-xs"
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
                Verified Google Business Desk
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Verified
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTAINER */}
      <main className="max-w-xl mx-auto px-4 pt-5 space-y-4">
        
        {/* BUSINESS INFO CARD */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#207de9]/10 text-[#207de9] text-xs font-bold mb-2">
            <span>📍 {business.category}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#080d24] tracking-tight">
            Rate your experience with {business.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {business.address}
          </p>

          {/* STAR RATING PICKER */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col items-center">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`${star} star rating`}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                >
                  <span
                    className={`text-3xl sm:text-4xl transition-colors ${
                      (hoverRating || rating) >= star
                        ? "text-amber-400 drop-shadow-xs"
                        : "text-slate-200"
                    }`}
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
            <span className="mt-2 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
              {ratingDescriptions[rating]}
            </span>
          </div>
        </div>

        {/* 3. MULTI-LANGUAGE SELECTOR */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>🌐</span> Select Review Language / भाषा चुनें:
            </span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Instant
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-[#207de9] border-[#207de9] text-white shadow-sm scale-102"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.nativeLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. INSTANT REVIEW BOX (HUMAN TONE, ANTI-DUPLICATE SHUFFLE) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Review Text (Ready to Post)
              </span>
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span>✓</span>
              <span>100% Human Phrasing</span>
            </div>
          </div>

          {/* Editable Textarea */}
          <div className="relative">
            <textarea
              value={reviewDraft}
              onChange={(e) => setReviewDraft(e.target.value)}
              rows={4}
              aria-label="Review Text"
              className={`w-full text-sm sm:text-base leading-relaxed p-4 rounded-xl border border-slate-300 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#207de9] text-slate-900 transition ${
                isShuffling ? "opacity-50" : "opacity-100"
              }`}
            />
          </div>

          <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
            ✏️ You can edit or add personal details anytime in the box above.
          </p>

          {/* Action Row: Shuffle & Copy */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => refreshReview(language, rating)}
              disabled={isShuffling}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-blue-50 text-[#207de9] border border-blue-200 hover:bg-blue-100 transition cursor-pointer active:scale-95"
            >
              <span className={isShuffling ? "animate-spin" : ""}>🔄</span>
              <span>दूसरा रिव्यू देखें / Shuffle Review</span>
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
        </div>

        {/* 5. PRIMARY GOOGLE REVIEW BUTTON */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md space-y-3">
          <button
            type="button"
            onClick={handleGoogleReviewClick}
            className="w-full py-4 px-6 rounded-2xl font-black text-white text-base bg-[#4285F4] hover:bg-[#3367d6] shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-98"
          >
            {/* Google G Icon */}
            <svg className="w-5 h-5 shrink-0 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Review on Google</span>
            <span className="text-lg">↗</span>
          </button>

          {/* Quick 3-Step Guide */}
          <div className="bg-slate-50 rounded-xl p-3.5 text-xs text-slate-600 space-y-1.5 border border-slate-100">
            <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              🚀 3 Simple Steps:
            </p>
            <ol className="list-decimal pl-4 space-y-1 text-slate-600 text-xs">
              <li>Button par click karein (Review text copy ho jayega).</li>
              <li>Google Maps review box open hoga.</li>
              <li>Rating select karein, text Paste karein aur <strong>Post</strong> karein!</li>
            </ol>
          </div>
        </div>

        {/* 6. POLICY COMPLIANCE & PRIVACY FOOTER */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 text-center space-y-2">
          <p className="text-[11px] text-slate-500 leading-relaxed max-w-md mx-auto font-normal">
            🛡️ <strong>Google Review Policy Compliance:</strong> ReviewFlow AI provides assistance in organizing feedback into natural reviews. We never post reviews automatically, never incentivize ratings, and never restrict critical feedback.
          </p>
          <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 pt-1">
            <Link href="/" className="hover:text-[#207de9] transition font-semibold">
              Powered by ReviewFlow AI
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
