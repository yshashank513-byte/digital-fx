"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { BusinessProfile } from "@/lib/reviewFlowTypes";
import {
  SupportedLanguage,
  structureCustomerReview,
} from "@/lib/humanReviewEngine";

interface Props {
  business: BusinessProfile;
}

const ASPECT_PROMPTS = [
  { id: "Service", label: "Service", icon: "⚡", bg: "bg-amber-50/80 text-amber-900 border-amber-200/80" },
  { id: "Staff", label: "Staff", icon: "👥", bg: "bg-purple-50/80 text-purple-900 border-purple-200/80" },
  { id: "Quality", label: "Quality", icon: "⭐", bg: "bg-yellow-50/80 text-yellow-900 border-yellow-200/80" },
  { id: "Experience", label: "Experience", icon: "👍", bg: "bg-emerald-50/80 text-emerald-900 border-emerald-200/80" },
  { id: "Value", label: "Value", icon: "💙", bg: "bg-sky-50/80 text-sky-900 border-sky-200/80" },
];

const LANGUAGE_BUTTONS: {
  code: SupportedLanguage;
  label: string;
  sub: string;
  icon: React.ReactNode;
}[] = [
  {
    code: "en",
    label: "English",
    sub: "En",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 8l6 6M11 8l-6 6M2 5h12M7 2v3M22 22l-5-10-5 10M14 18h6" />
      </svg>
    ),
  },
  {
    code: "hi",
    label: "हिंदी",
    sub: "हिं",
    icon: (
      <span className="text-[10px] font-bold border border-current px-1 py-0.2 rounded leading-tight">
        हिं
      </span>
    ),
  },
  {
    code: "hinglish",
    label: "Hinglish",
    sub: "Aa",
    icon: <span className="text-[11px] font-bold leading-tight">Aa</span>,
  },
  {
    code: "mr",
    label: "मराठी",
    sub: "म",
    icon: <span className="text-[11px] leading-tight">🚩</span>,
  },
];

export default function CustomerReviewClient({ business }: Props) {
  // Step State: 1 = Rate, 2 = Write, 3 = Post
  const [step, setStep] = useState<1 | 2 | 3>(2);
  const [rating, setRating] = useState<number>(4);
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
  const [aiProvider, setAiProvider] = useState<string>("Digital FX Review Generator");
  const abortControllerRef = useRef<AbortController | null>(null);

  // Avatar Initials (e.g. Apex Healthcare -> AP)
  const getInitials = (name: string) => {
    const clean = name.trim();
    if (!clean) return "FX";
    const words = clean.split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + (words[1][0] || "")).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  const businessInitials = getInitials(business.name);

  // Rating label helper
  const getRatingFeedback = (val: number) => {
    switch (val) {
      case 5:
        return "5 ⭐ Excellent Experience";
      case 4:
        return "4 ⭐ Very Good Experience";
      case 3:
        return "3 ⭐ Good Experience";
      case 2:
        return "2 ⭐ Needs Improvement";
      case 1:
        return "1 ⭐ Disappointing";
      default:
        return `${val} ⭐ Good Experience`;
    }
  };

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
    refreshReview(4, [], "en", "");
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
    setStep(2);
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
    <div className="min-h-screen bg-[#F4F6F9] text-slate-900 font-sans antialiased selection:bg-blue-500 selection:text-white pb-16">
      
      {/* Floating Copied Toast */}
      {copied && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <span className="text-emerald-400 font-bold">✓</span>
          <span>Review text copied! Opening review page...</span>
        </div>
      )}

      {/* Top Mobile Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-[440px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={business.name}
                className="h-10 w-10 object-contain rounded-xl shadow-xs shrink-0"
              />
            ) : (
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-xs"
                style={{ backgroundColor: business.brandColor || "#2563EB" }}
              >
                {businessInitials}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-slate-900 truncate tracking-tight leading-tight">
                {business.name}
              </h1>
              <p className="text-xs text-slate-500 truncate leading-normal">
                {business.category} {business.city ? `• ${business.city}` : ""}
              </p>
            </div>
          </div>

          {/* Official Google Verified Profile Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-700 text-xs font-semibold shrink-0 border border-slate-200 shadow-2xs">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Verified Profile</span>
          </div>
        </div>
      </header>

      {/* Main Mobile-First Container */}
      <main className="max-w-[440px] mx-auto px-4 pt-4 sm:pt-6 space-y-4">
        
        {/* 3-Step Progress Indicator */}
        <div className="bg-white rounded-full p-2 px-3 sm:px-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold">
            {/* Step 1: Rate */}
            <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-blue-50 text-[#2563EB] font-bold">
              <span className="w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-bold bg-[#2563EB] text-white">
                1
              </span>
              <span>Rate</span>
            </div>

            <div className="flex-1 h-[2px] bg-slate-200 mx-2 rounded-full" />

            {/* Step 2: Write */}
            <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-blue-50 text-[#2563EB] font-bold">
              <span className="w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-bold bg-[#2563EB] text-white">
                2
              </span>
              <span>Write</span>
            </div>

            <div className="flex-1 h-[2px] bg-slate-200 mx-2 rounded-full" />

            {/* Step 3: Post */}
            <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
              <span className="w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-bold bg-white border border-emerald-300 text-emerald-700">
                3
              </span>
              <span>Post</span>
            </div>
          </div>
        </div>

        {/* STEP 1 CARD: RATE YOUR EXPERIENCE */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs text-center space-y-3">
          
          {/* Business Logo & Name Container */}
          <div className="flex flex-col items-center">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={business.name}
                className="w-16 h-16 object-contain rounded-2xl mb-3 shadow-xs"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-sm mb-3"
                style={{ backgroundColor: business.brandColor || "#2563EB" }}
              >
                {businessInitials}
              </div>
            )}
            
            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
              {business.name}
            </h2>
            <p className="text-sm font-normal text-slate-500 mt-1">
              How was your experience with us?
            </p>
          </div>

          {/* 5 Large Star Buttons with Numbers 1-5 Underneath */}
          <div className="pt-2 pb-1 flex flex-col items-center">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
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
                    className="p-1 sm:p-1.5 transition-all hover:scale-110 active:scale-95 cursor-pointer focus:outline-none flex flex-col items-center"
                  >
                    <span
                      className={`text-4xl sm:text-5xl transition-colors duration-150 block ${
                        isSelected ? "text-[#FBBF24]" : "text-slate-200"
                      }`}
                    >
                      ★
                    </span>
                    <span className="text-xs font-semibold text-slate-400 mt-1 block">
                      {star}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Rating Feedback Pill */}
            <div className="mt-3 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50/60 border border-blue-100 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs">
              <span>{getRatingFeedback(rating)}</span>
            </div>
          </div>
        </div>

        {/* STEP 2 CARD: WRITE YOUR EXPERIENCE */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          
          {/* Header Row: Rating status on left, Language switcher on right */}
          <div className="flex items-start justify-between gap-2 pb-1">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                You rated us {rating} out of 5
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tell us about your experience
              </p>
            </div>

            {/* Language Switcher (Segmented Cards) */}
            <div className="flex items-center gap-1">
              {LANGUAGE_BUTTONS.map((lang) => {
                const isActive = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`px-2.5 py-1.5 rounded-xl text-center transition cursor-pointer flex flex-col items-center justify-center min-w-[52px] ${
                      isActive
                        ? "bg-white border-2 border-[#2563EB] text-[#2563EB] font-bold shadow-xs"
                        : "bg-slate-50/90 border border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <div className="h-4 flex items-center justify-center mb-0.5">
                      {lang.icon}
                    </div>
                    <span className="text-[11px] leading-tight block">
                      {lang.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Banner: Digital FX Review Generator */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5 font-bold text-[#2563EB]">
              <span>✨</span>
              <span>{aiProvider}</span>
              <span className="text-slate-400 font-normal">- Unique, Likely, Safe</span>
            </div>
            <button
              type="button"
              onClick={() => refreshReview(rating, selectedPrompts, language, userCustomText)}
              className="text-[#2563EB] font-bold hover:underline cursor-pointer"
            >
              Generate
            </button>
          </div>

          {/* Review Textarea Box with Character Counter */}
          <div className="relative rounded-2xl border border-slate-200 bg-white p-3.5 focus-within:ring-2 focus-within:ring-[#2563EB] shadow-2xs transition">
            <textarea
              ref={textareaRef}
              value={reviewDraft}
              onChange={(e) => {
                setReviewDraft(e.target.value);
                setUserCustomText(e.target.value);
                setIsEditing(true);
              }}
              rows={4}
              maxLength={500}
              placeholder="Tell us about your experience..."
              className={`w-full text-xs sm:text-sm leading-relaxed resize-none focus:outline-none bg-transparent text-slate-800 transition ${
                isShuffling ? "opacity-40" : "opacity-100"
              }`}
            />
            <div className="text-right text-[11px] text-slate-400 font-medium select-none pt-1">
              {reviewDraft.length}/500
            </div>
          </div>

          {/* Presets / Highlights Section */}
          <div className="space-y-2">
            <p className="text-xs text-slate-500 font-medium">
              Tap presets to add your highlights (or be more personalized):
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {ASPECT_PROMPTS.map((prompt) => {
                const isSelected = selectedPrompts.includes(prompt.id);
                return (
                  <button
                    key={prompt.id}
                    type="button"
                    onClick={() => handleTogglePrompt(prompt.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      isSelected
                        ? "bg-[#2563EB] text-white border border-[#2563EB] shadow-xs font-bold"
                        : `${prompt.bg} hover:brightness-95 border`
                    }`}
                  >
                    <span>{prompt.icon}</span>
                    <span>{prompt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons Row: Generate Another Variation & Copy Text */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => refreshReview(rating, selectedPrompts, language, userCustomText)}
              disabled={isShuffling}
              className="py-2.5 px-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 text-[#2563EB] font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer"
            >
              <span className={isShuffling ? "animate-spin" : ""}>📄</span>
              <span className="truncate">Generate Another Variation</span>
            </button>

            <button
              type="button"
              onClick={handleCopyReview}
              className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer"
            >
              <span>{copied ? "✓" : "📋"}</span>
              <span>{copied ? "Copied!" : "Copy Text"}</span>
            </button>
          </div>

          {/* STEP 3: POST REVIEW SECTION (PROMINENT CTA) */}
          <div className="pt-2 space-y-2.5">
            <button
              type="button"
              onClick={handlePostReview}
              className="w-full py-4 px-6 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-base transition shadow-md shadow-blue-500/25 flex items-center justify-center gap-3 cursor-pointer active:scale-[0.99] group"
            >
              {/* Google G Logo in White Circle */}
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center p-1 shrink-0 shadow-xs">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <span className="tracking-wide">Post Review</span>
              <span className="text-xl font-bold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                ↗
              </span>
            </button>

            <button
              type="button"
              onClick={handleEditClick}
              className="w-full py-1 text-xs font-semibold text-[#2563EB] hover:underline transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>Edit Review Text</span>
            </button>

            <p className="text-[11px] text-center text-slate-400">
              Opens in official Google review page for this business profile.
            </p>
          </div>

        </div>

      </main>

      {/* Footer Branding */}
      <footer className="max-w-[440px] mx-auto px-4 mt-8 text-center text-[11px] text-slate-400 space-y-1">
        <p>Verified Business Review Experience</p>
        <p>Powered by Digital FX ReviewFlow</p>
      </footer>

    </div>
  );
}
