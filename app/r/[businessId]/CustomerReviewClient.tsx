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
  { id: "Service", label: "Service", icon: "⚡" },
  { id: "Staff", label: "Staff", icon: "👥" },
  { id: "Quality", label: "Quality", icon: "⭐" },
  { id: "Experience", label: "Experience", icon: "👍" },
  { id: "Value", label: "Value", icon: "💙" },
];

const LANGUAGES: { code: SupportedLanguage; label: string; sub: string }[] = [
  { code: "en", label: "English", sub: "En" },
  { code: "hi", label: "हिंदी", sub: "हि" },
  { code: "hinglish", label: "Hinglish", sub: "Hi" },
  { code: "mr", label: "मराठी", sub: "म" },
];

const RATING_LABELS: Record<number, string> = {
  5: "Excellent Experience",
  4: "Very Good Experience",
  3: "Good Experience",
  2: "Needs Improvement",
  1: "Disappointing",
};

export default function CustomerReviewClient({ business }: Props) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [reviewDraft, setReviewDraft] = useState<string>("");
  const [userCustomText, setUserCustomText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [logoError, setLogoError] = useState<boolean>(false);

  const [sessionId] = useState<string>(() => "sess-" + Math.random().toString(36).substring(2, 10));
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  // Prevent duplicate calls — if a generation is in flight, don't start another for same params
  const inFlightRef = useRef<string>("");

  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);
    return words.length >= 2
      ? (words[0][0] + words[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };
  const initials = getInitials(business.name || "FX");

  // Stable generate function — does NOT depend on state (uses params directly)
  const generateReview = useCallback(
    async (params: {
      currentRating: number;
      prompts: string[];
      lang: SupportedLanguage;
      customNotes: string;
    }) => {
      const { currentRating, prompts, lang, customNotes } = params;

      // Abort any previous in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const ac = new AbortController();
      abortControllerRef.current = ac;

      setIsShuffling(true);
      setIsEditing(false);

      // Fresh unique seed every call — guarantees different output each time
      const seed = Date.now() * Math.random() * 9999 + Math.random() * 99999999;

      // Instant local draft (zero latency) — varies by seed
      const instantDraft = structureCustomerReview({
        businessName: business.name,
        category: business.category,
        rating: currentRating,
        keywords: prompts,
        userNotes: "",  // Never pass old notes to local engine — always fresh
        language: lang,
        seed,
      });
      setReviewDraft(instantDraft);

      // Background AI generation (Gemini / fallback)
      try {
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
            seed,
          }),
          signal: ac.signal,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.draft) {
            setReviewDraft(data.draft);
          }
        }
      } catch (e: any) {
        if (e.name !== "AbortError") { /* keep instant draft */ }
      } finally {
        setTimeout(() => setIsShuffling(false), 120);
      }
    },
    [business.id, business.name, business.category, sessionId]
  );

  // Convenience wrapper to call with current state
  const refreshReview = useCallback(
    (
      currentRating: number,
      prompts: string[],
      lang: SupportedLanguage,
      customNotes: string
    ) => {
      generateReview({ currentRating, prompts, lang, customNotes });
    },
    [generateReview]
  );

  // Init
  useEffect(() => {
    refreshReview(5, [], "en", "");
  }, []);

  // Track visit
  useEffect(() => {
    try {
      const isQr = window.location.search.includes("src=qr");
      fetch("/api/reviewflow/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: business.id, eventType: isQr ? "scan" : "visit" }),
      }).catch(() => {});
    } catch (_) {}
  }, [business.id]);

  const handleRatingSelect = (star: number) => {
    setRating(star);
    // Pass star directly — not stale `rating` state
    refreshReview(star, selectedPrompts, language, "");
  };

  const handleTogglePrompt = (id: string) => {
    const next = selectedPrompts.includes(id)
      ? selectedPrompts.filter((p) => p !== id)
      : [...selectedPrompts, id];
    setSelectedPrompts(next);
    // Pass next directly — not stale `selectedPrompts` state
    refreshReview(rating, next, language, userCustomText);
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    refreshReview(rating, selectedPrompts, lang, userCustomText);
  };

  const handleGenerate = () => {
    // Clear custom text so AI generates fresh (not anchored to old edit)
    setUserCustomText("");
    setIsEditing(false);
    refreshReview(rating, selectedPrompts, language, "");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reviewDraft);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = reviewDraft;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2800);
  };

  const handlePostReview = async () => {
    await handleCopy();
    try {
      fetch("/api/reviewflow/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          eventType: "google_click",
          sessionData: { sessionId, businessId: business.id, category: business.category, customerRating: rating, language, finalReviewText: reviewDraft },
        }),
      }).catch(() => {});
    } catch (_) {}

    // ── DIRECT URL: Always use the exact URL the business owner provided ──
    let targetUrl = (business.googleReviewUrl || "").trim();

    // Only fallback to Google Maps search if URL is truly missing or invalid
    const isValidUrl = targetUrl.startsWith("http://") || targetUrl.startsWith("https://");
    if (!isValidUrl) {
      const q = encodeURIComponent(`${business.name} ${business.city || ""}`.trim());
      targetUrl = `https://www.google.com/maps/search/?api=1&query=${q}`;
      console.warn(`[ReviewFlow] No valid URL for ${business.name}, falling back to Maps search.`);
    }

    setTimeout(() => window.open(targetUrl, "_blank", "noopener,noreferrer"), 280);
  };

  // Deactivated guard
  if (business.status === "deactivated") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 mb-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl">⏸️</div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Review Desk Paused</h2>
        <p className="text-sm text-slate-500 max-w-xs">
          The review portal for <strong>{business.name}</strong> is currently inactive.
        </p>
        <p className="mt-6 text-xs text-slate-400">Powered by Digital FX ReviewFlow</p>
      </div>
    );
  }

  const displayRating = hoverRating || rating;

  return (
    <div className="min-h-screen bg-[#F3F4F7] font-sans antialiased selection:bg-blue-500 selection:text-white">

      {/* Copied toast */}
      {copied && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-[13px] font-semibold border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <span className="text-emerald-400">✓</span>
          <span>Copied! Opening Google review page…</span>
        </div>
      )}

      {/* ── STICKY HEADER ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[430px] mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo + Name */}
          <div className="flex items-center gap-2.5 min-w-0">
            {business.logoUrl && !logoError ? (
              <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                <img
                  src={business.logoUrl}
                  alt={business.name}
                  onError={() => setLogoError(true)}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm"
                style={{ backgroundColor: business.brandColor || "#2563EB" }}
              >
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-slate-900 truncate leading-tight">{business.name}</p>
              <p className="text-[11px] text-slate-500 truncate">
                {business.category}{business.city ? ` • ${business.city}` : ""}
              </p>
            </div>
          </div>

          {/* Verified badge */}
          <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-600">
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Verified</span>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-[430px] mx-auto px-4 pt-5 pb-20 space-y-3">

        {/* Step indicator */}
        <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-2.5 border border-slate-200 shadow-sm">
          {["Rate", "Write", "Post"].map((label, i) => {
            const stepNum = i + 1;
            const isActive = stepNum <= 2;
            return (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-1.5 ${isActive ? "text-[#2563EB]" : "text-slate-400"}`}>
                  <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-bold ${isActive ? "bg-[#2563EB] text-white" : "bg-slate-200 text-slate-500"}`}>
                    {stepNum}
                  </span>
                  <span className="text-[12px] font-semibold">{label}</span>
                </div>
                {i < 2 && <div className="flex-1 h-px bg-slate-200" />}
              </div>
            );
          })}
        </div>

        {/* ── RATE CARD ── */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
          {/* Logo */}
          <div className="flex justify-center mb-3">
            {business.logoUrl && !logoError ? (
              <div className="w-[70px] h-[70px] rounded-2xl bg-white border border-slate-200 shadow-sm p-2 flex items-center justify-center overflow-hidden">
                <img
                  src={business.logoUrl}
                  alt={business.name}
                  onError={() => setLogoError(true)}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div
                className="w-[70px] h-[70px] rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-sm"
                style={{ backgroundColor: business.brandColor || "#2563EB" }}
              >
                {initials}
              </div>
            )}
          </div>

          <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">{business.name}</h2>
          <p className="text-[13px] text-slate-500 mt-0.5">How was your experience with us?</p>

          {/* Stars */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingSelect(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110 active:scale-95 cursor-pointer p-0.5 focus:outline-none flex flex-col items-center"
              >
                <span className={`text-[42px] leading-none transition-colors ${displayRating >= star ? "text-[#FBBF24]" : "text-slate-200"}`}>
                  ★
                </span>
                <span className="text-[11px] text-slate-400 font-medium mt-0.5">{star}</span>
              </button>
            ))}
          </div>

          {/* Rating pill */}
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[12px] font-bold text-amber-800">
            <span className="text-[#FBBF24]">★</span>
            <span>{rating} · {RATING_LABELS[rating] || "Good Experience"}</span>
          </div>
        </div>

        {/* ── WRITE CARD ── */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">

          {/* Header: rating + lang tabs */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[13px] font-bold text-slate-900">You rated us {rating} out of 5</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Tell us about your experience</p>
            </div>
            {/* Language buttons */}
            <div className="flex items-center gap-1 shrink-0">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-2 py-1.5 rounded-lg text-center transition cursor-pointer min-w-[44px] ${
                    language === lang.code
                      ? "bg-[#2563EB] text-white font-bold shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span className="text-[11px] block leading-tight font-semibold">{lang.sub}</span>
                  <span className="text-[9px] block leading-tight opacity-75">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI banner */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-3.5 py-2 border border-blue-100">
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#2563EB]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>Digital FX Neural AI</span>
              <span className="text-slate-400 font-normal">— unique every time</span>
            </div>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isShuffling}
              className="text-[12px] text-[#2563EB] font-bold hover:underline cursor-pointer disabled:opacity-50 transition"
            >
              {isShuffling ? "…" : "Generate"}
            </button>
          </div>

          {/* Textarea */}
          <div className={`relative rounded-xl border bg-slate-50 transition-all ${isShuffling ? "border-blue-300 ring-2 ring-blue-100" : "border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"}`}>
            <textarea
              ref={textareaRef}
              value={reviewDraft}
              onChange={(e) => {
                setReviewDraft(e.target.value);
                setUserCustomText(e.target.value);
                setIsEditing(true);
              }}
              rows={5}
              maxLength={500}
              placeholder="Tell us about your experience…"
              className={`w-full px-3.5 pt-3 pb-1 text-[13px] leading-relaxed resize-none focus:outline-none bg-transparent text-slate-800 transition ${isShuffling ? "opacity-30" : "opacity-100"}`}
            />
            <div className="text-right text-[10px] text-slate-400 font-medium px-3.5 pb-2 select-none">
              {reviewDraft.length}/500
            </div>
          </div>

          {/* Highlight presets */}
          <div>
            <p className="text-[11px] text-slate-500 font-medium mb-2">Tap to highlight what impressed you:</p>
            <div className="flex flex-wrap gap-2">
              {ASPECT_PROMPTS.map((p) => {
                const sel = selectedPrompts.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleTogglePrompt(p.id)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-medium flex items-center gap-1.5 transition cursor-pointer active:scale-95 border ${
                      sel
                        ? "bg-[#2563EB] text-white border-[#2563EB] shadow-sm font-bold"
                        : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    <span>{p.icon}</span>
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action row */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isShuffling}
              className="py-2.5 px-3 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-[#2563EB] font-bold text-[12px] flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              <span className={isShuffling ? "animate-spin inline-block" : ""}>↺</span>
              <span className="truncate">Generate Another</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[12px] flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <span>{copied ? "✓" : "📋"}</span>
              <span>{copied ? "Copied!" : "Copy Text"}</span>
            </button>
          </div>

          {/* Post Review CTA */}
          <div className="pt-1 space-y-2">
            <button
              type="button"
              onClick={handlePostReview}
              className="w-full py-4 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[15px] flex items-center justify-center gap-3 transition shadow-md shadow-blue-500/20 cursor-pointer active:scale-[0.99] group"
            >
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <span>Post Review</span>
              <span className="text-lg group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
            </button>

            <button
              type="button"
              onClick={() => { setIsEditing(true); setTimeout(() => textareaRef.current?.focus(), 50); }}
              className="w-full py-1 text-[12px] font-semibold text-[#2563EB] hover:underline flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>Edit Review Text</span>
            </button>

            <p className="text-[11px] text-center text-slate-400 leading-snug">
              Opens in official Google review page for this business profile.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-[430px] mx-auto px-4 pb-8 text-center space-y-0.5">
        <p className="text-[11px] text-slate-400">Verified Business Review Experience</p>
        <p className="text-[11px] text-slate-400">Powered by <span className="font-semibold text-slate-500">Digital FX ReviewFlow</span></p>
      </footer>

    </div>
  );
}
