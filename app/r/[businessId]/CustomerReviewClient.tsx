"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { BusinessProfile } from "@/lib/reviewFlowTypes";
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  structureCustomerReview,
} from "@/lib/humanReviewEngine";

interface Props {
  business: BusinessProfile;
}

const ASPECT_PROMPTS = [
  { id: "Service", label: "Service", icon: "⚡" },
  { id: "Staff", label: "Staff", icon: "👥" },
  { id: "Quality", label: "Quality", icon: "✨" },
  { id: "Experience", label: "Experience", icon: "⭐" },
  { id: "Value", label: "Value", icon: "💎" },
];

export default function CustomerReviewClient({ business }: Props) {
  // Step State: 1 = Rate, 2 = Write, 3 = Post
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [reviewDraft, setReviewDraft] = useState<string>("");
  const [userCustomText, setUserCustomText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [sessionId] = useState<string>(() => "sess-" + Math.random().toString(36).substring(2, 10));

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [aiProvider, setAiProvider] = useState<string>("AI Smart Assistant");
  const abortControllerRef = useRef<AbortController | null>(null);

  // Generate structured review based strictly on customer rating + customer-selected prompts/keywords
  const refreshReview = useCallback(
    async (
      currentRating: number = rating,
      prompts: string[] = selectedPrompts,
      lang: SupportedLanguage = language,
      customNotes: string = userCustomText
    ) => {
      setIsShuffling(true);

      const dynamicSeed = Date.now() + Math.random() * 500000;

      // 1. Instant local high-entropy synthesis (0ms latency, zero delay)
      const instantDraft = structureCustomerReview({
        businessName: business.name,
        category: business.category,
        rating: currentRating,
        keywords: prompts,
        userNotes: customNotes,
        language: lang,
        seed: dynamicSeed,
      });
      setReviewDraft(instantDraft);

      // 2. Query /api/reviewflow/generate-draft in background for AI model (Gemini / Groq / OpenAI)
      try {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        const ac = new AbortController();
        abortControllerRef.current = ac;

        const res = await fetch("/api/reviewflow/generate-draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessId: business.id,
            businessName: business.name,
            category: business.category,
            customerRating: currentRating,
            language: lang,
            prompts,
            userNotes: customNotes,
            sessionId,
            seed: dynamicSeed,
          }),
          signal: ac.signal,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.draft && !isEditing) {
            setReviewDraft(data.draft);
            if (data.provider) setAiProvider(data.provider);
          }
        }
      } catch (e: any) {
        if (e.name !== "AbortError") {
          // Keep instant draft as fallback
        }
      } finally {
        setTimeout(() => setIsShuffling(false), 150);
      }
    },
    [business.id, business.name, business.category, rating, selectedPrompts, language, userCustomText, sessionId, isEditing]
  );

  // Initialize review draft on mount
  useEffect(() => {
    refreshReview(5, [], "en", "");
  }, []);

  // Track page visit & QR scan on mount
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

  // Handle Star Rating Selection
  const handleRatingSelect = (selectedStar: number) => {
    setRating(selectedStar);
    setStep(2); // Immediately open Step 2: Write Your Review
    refreshReview(selectedStar, selectedPrompts, language, userCustomText);
  };

  // Handle Prompt Chip Toggle (Service, Staff, Quality, Experience, Value)
  const handleTogglePrompt = (promptId: string) => {
    const nextPrompts = selectedPrompts.includes(promptId)
      ? selectedPrompts.filter((p) => p !== promptId)
      : [...selectedPrompts, promptId];
    setSelectedPrompts(nextPrompts);
    refreshReview(rating, nextPrompts, language, userCustomText);
  };

  // Handle Language Change
  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    refreshReview(rating, selectedPrompts, newLang, userCustomText);
  };

  // Copy review to clipboard
  const handleCopyReview = async () => {
    try {
      await navigator.clipboard.writeText(reviewDraft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2800);
    } catch (_) {
      const ta = document.createElement("textarea");
      ta.value = reviewDraft;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2800);
    }
  };

  // Handle "Post Review" Click
  // Copies review text and opens the configured review destination for the business
  const handlePostReview = async () => {
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

    // 3. Open selected business's configured review destination URL
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

    // Small delay to let user see "Copied!" notification then open review URL
    setTimeout(() => {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }, 250);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  // Deactivated status handling
  if (business.status === "deactivated") {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between p-4 sm:p-6">
        <div className="max-w-md mx-auto w-full py-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl">
            ⏸️
          </div>
          <h2 className="text-xl font-bold text-slate-900">Review Desk Inactive</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
            The review portal for <strong>{business.name}</strong> is currently paused. Please check back later.
          </p>
        </div>
        <footer className="text-center py-4 text-xs text-slate-400">
          Powered by Digital FX ReviewFlow
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-blue-500 selection:text-white pb-16">
      
      {/* Floating Copied Toast */}
      {copied && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <span className="text-emerald-400 font-bold">✓</span>
          <span>Review text copied! Opening review page...</span>
        </div>
      )}

      {/* Top Mobile Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={business.name}
                className="h-8 w-auto max-w-[100px] object-contain rounded"
              />
            ) : (
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center font-bold text-white text-xs shrink-0"
                style={{ backgroundColor: business.brandColor || "#2563EB" }}
              >
                {business.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {business.name}
              </h1>
              <p className="text-[11px] text-slate-500 truncate">
                {business.category} {business.city ? `• ${business.city}` : ""}
              </p>
            </div>
          </div>

          {/* Official Google Review Desk Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold shrink-0 border border-slate-200">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Verified Desk</span>
          </div>
        </div>
      </header>

      {/* Main Mobile-First Container */}
      <main className="max-w-md mx-auto px-4 pt-4 sm:pt-6 space-y-4">
        
        {/* Subtle 3-Step Progress Indicator (Rule #10) */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs">
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold">
            <div className={`flex items-center justify-center gap-1.5 py-1 rounded-xl transition ${
              step >= 1 ? "bg-blue-50 text-[#2563EB] font-bold" : "text-slate-400"
            }`}>
              <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                step >= 1 ? "bg-[#2563EB] text-white" : "bg-slate-200 text-slate-500"
              }`}>1</span>
              <span>Rate</span>
            </div>

            <div className={`flex items-center justify-center gap-1.5 py-1 rounded-xl transition ${
              step >= 2 ? "bg-blue-50 text-[#2563EB] font-bold" : "text-slate-400"
            }`}>
              <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                step >= 2 ? "bg-[#2563EB] text-white" : "bg-slate-200 text-slate-500"
              }`}>2</span>
              <span>Write</span>
            </div>

            <div className={`flex items-center justify-center gap-1.5 py-1 rounded-xl transition ${
              step >= 3 || rating > 0 ? "bg-emerald-50 text-emerald-700 font-bold" : "text-slate-400"
            }`}>
              <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                step >= 3 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
              }`}>3</span>
              <span>Post</span>
            </div>
          </div>
        </div>

        {/* STEP 1: RATE YOUR EXPERIENCE (FIRST SCREEN HERO) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs text-center space-y-3">
          
          {/* Business Logo & Name Container */}
          <div className="flex flex-col items-center">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={business.name}
                className="h-14 w-auto max-w-[140px] object-contain rounded-xl mb-2"
              />
            ) : (
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-xs mb-2"
                style={{ backgroundColor: business.brandColor || "#2563EB" }}
              >
                {business.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {business.name}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">
              How was your experience with us?
            </p>
          </div>

          {/* 5 Large Star Buttons (Visually Prominent & Easy to Tap) */}
          <div className="pt-2 pb-1 flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5].map((star) => {
                const isSelected = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingSelect(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Rate ${star} star`}
                    className="p-1 sm:p-2 transition-all hover:scale-120 active:scale-95 cursor-pointer focus:outline-none group"
                  >
                    <span
                      className={`text-4xl sm:text-5xl transition-all duration-150 block drop-shadow-xs ${
                        isSelected
                          ? "text-amber-400 scale-105"
                          : "text-slate-200 group-hover:text-amber-200"
                      }`}
                    >
                      ★
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 block mt-0.5 group-hover:text-slate-600">
                      ★ {star}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Rating Feedback */}
            <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
              <span className="text-amber-500 font-bold">{rating} ★</span>
              <span>
                {rating === 5 && "Excellent / Loved it"}
                {rating === 4 && "Very Good Experience"}
                {rating === 3 && "Average / Satisfactory"}
                {rating === 2 && "Needs Improvement"}
                {rating === 1 && "Disappointing"}
              </span>
            </div>
          </div>
        </div>

        {/* STEP 2: WRITE YOUR REVIEW (IMMEDIATELY OPENS AFTER STAR SELECTION) */}
        {step >= 2 && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4 animate-in fade-in slide-in-from-bottom-2">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  You rated us {rating} out of 5
                </h3>
                <p className="text-xs text-slate-500">
                  Tell us about your experience
                </p>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`px-2 py-1 rounded-lg transition cursor-pointer text-[11px] ${
                      language === lang.code
                        ? "bg-white text-slate-900 font-bold shadow-2xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {lang.flag} {lang.nativeLabel}
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text Box with AI Indicator */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 font-semibold text-[#2563EB] bg-blue-50/80 px-2.5 py-0.5 rounded-full border border-blue-100">
                  <span>✨</span>
                  <span>{aiProvider}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600 font-normal">Unique Every Time</span>
                </span>
                <span className="text-slate-400">Editable</span>
              </div>

              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={reviewDraft}
                  onChange={(e) => {
                    setReviewDraft(e.target.value);
                    setUserCustomText(e.target.value);
                    setIsEditing(true);
                  }}
                  rows={4}
                  placeholder="Write or adjust your review here..."
                  className={`w-full text-xs sm:text-sm leading-relaxed p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-slate-800 transition ${
                    isShuffling ? "opacity-40" : "opacity-100"
                  }`}
                />
              </div>
            </div>

            {/* Optional Helpful Aspect Prompts (Service, Staff, Quality, Experience, Value) */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 block">
                Tap prompts to add your highlights (AI adapts dynamically):
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {ASPECT_PROMPTS.map((prompt) => {
                  const isSelected = selectedPrompts.includes(prompt.id);
                  return (
                    <button
                      key={prompt.id}
                      type="button"
                      onClick={() => handleTogglePrompt(prompt.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                        isSelected
                          ? "bg-[#2563EB] text-white shadow-2xs font-bold"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80"
                      }`}
                    >
                      <span>{prompt.icon}</span>
                      <span>{prompt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Review Actions: Regenerate, Copy, Edit */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => refreshReview(rating, selectedPrompts, language, userCustomText)}
                disabled={isShuffling}
                className="inline-flex items-center gap-1.5 text-[#2563EB] hover:text-[#1D4ED8] font-bold transition cursor-pointer py-1.5 px-2.5 rounded-lg bg-blue-50/70 hover:bg-blue-100/60 border border-blue-100"
              >
                <span className={isShuffling ? "animate-spin" : ""}>🔄</span>
                <span>Generate Another Variation</span>
              </button>

              <button
                type="button"
                onClick={handleCopyReview}
                className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 font-semibold transition cursor-pointer py-1.5 px-2.5 rounded-lg hover:bg-slate-100 border border-slate-200"
              >
                <span>{copied ? "✓" : "📋"}</span>
                <span>{copied ? "Copied!" : "Copy Text"}</span>
              </button>
            </div>

            {/* STEP 3: POST REVIEW SECTION (PROMINENT CTA) */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handlePostReview}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm sm:text-base transition shadow-sm flex items-center justify-center gap-2.5 cursor-pointer active:scale-98 group"
              >
                <svg className="w-5 h-5 shrink-0 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Post Review</span>
                <span className="text-lg group-hover:translate-x-1 transition-transform">↗</span>
              </button>

              <button
                type="button"
                onClick={handleEditClick}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                ✏️ Edit Review Text
              </button>

              <p className="text-[11px] text-center text-slate-400">
                Copies text to clipboard and opens the official review page.
              </p>
            </div>

          </div>
        )}

      </main>

      {/* Footer Branding */}
      <footer className="max-w-md mx-auto px-4 mt-8 text-center text-[11px] text-slate-400 space-y-1">
        <p>Verified Business Review Experience</p>
        <p>Powered by Digital FX ReviewFlow</p>
      </footer>

    </div>
  );
}
