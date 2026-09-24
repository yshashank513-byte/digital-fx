"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BusinessProfile } from "@/lib/reviewFlowTypes";
import { CATEGORY_QUESTIONS } from "@/lib/reviewFlowCategories";

interface Props {
  business: BusinessProfile;
}

export default function CustomerReviewClient({ business }: Props) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [customNote, setCustomNote] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [reviewDraft, setReviewDraft] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [step, setStep] = useState<"questions" | "draft">("questions");
  const [sessionId] = useState<string>(() => "sess-" + Math.random().toString(36).substring(2, 10));

  const questions = CATEGORY_QUESTIONS[business.category] || CATEGORY_QUESTIONS["Other"];

  // 1. Record Page Visit on Mount & check for QR scan
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

  // Handle chip selection
  const handleSelectOption = (questionKey: string, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionKey]: prev[questionKey] === option ? "" : option,
    }));
  };

  // Generate Review Draft
  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/reviewflow/generate-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          businessName: business.name,
          category: business.category,
          customerRating: rating,
          answers,
          optionalNotes: customNote,
          sessionId,
        }),
      });

      const data = await res.json();
      if (data.success && data.draft) {
        setReviewDraft(data.draft);
        setStep("draft");
      } else {
        // Fallback draft
        const fallback = `Had a great experience with ${business.name}. The team was very professional, responsive, and reliable. Highly recommended!`;
        setReviewDraft(fallback);
        setStep("draft");
      }
    } catch (err) {
      const fallback = `Had a great experience with ${business.name}. The team was very professional, responsive, and reliable. Highly recommended!`;
      setReviewDraft(fallback);
      setStep("draft");
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy draft to clipboard
  const handleCopyDraft = async () => {
    try {
      await navigator.clipboard.writeText(reviewDraft);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (_) {
      // Fallback copy
      const ta = document.createElement("textarea");
      ta.value = reviewDraft;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Handle Click on Google Review Button
  const handleGoogleReviewClick = () => {
    // 1. Copy draft to clipboard automatically for convenience
    handleCopyDraft();

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
            answers,
            generatedDraft: reviewDraft,
            finalReviewText: reviewDraft,
          },
        }),
      }).catch(() => {});
    } catch (_) {}

    // 3. Open official Google review URL in new tab
    const url = business.googleReviewUrl || `https://search.google.com/local/writereview?placeid=${business.placeId || "digitalfx"}`;
    window.open(url, "_blank", "noopener,noreferrer");
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
      <main className="max-w-xl mx-auto px-4 pt-5">
        
        {/* BUSINESS INFO CARD */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-5 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#207de9]/10 text-[#207de9] text-xs font-bold mb-2">
            <span>📍 {business.category}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#080d24] tracking-tight">
            How was your experience with {business.name}?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {business.address}
          </p>

          {/* STAR RATING PICKER */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col items-center">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Select Your Rating
            </span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
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

        {/* STEP 1: EXPERIENCE QUESTIONS */}
        {step === "questions" ? (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                A Few Quick Details (Tap to select)
              </h3>
              <span className="text-[11px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Takes 20 seconds
              </span>
            </div>

            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs"
              >
                <div className="flex items-start gap-2.5 mb-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#207de9]/15 text-[#207de9] font-black text-xs">
                    {idx + 1}
                  </span>
                  <label className="text-sm font-bold text-slate-800 leading-snug">
                    {q.question}
                  </label>
                </div>

                {/* Options Chips */}
                <div className="flex flex-wrap gap-2 pl-7">
                  {q.options.map((opt) => {
                    const isSelected = answers[q.shortKey] === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelectOption(q.shortKey, opt)}
                        className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all border text-left cursor-pointer ${
                          isSelected
                            ? "bg-[#207de9] border-[#207de9] text-white shadow-xs scale-102"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        {isSelected && <span className="mr-1.5 font-bold">✓</span>}
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Optional Additional Note */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Anything else you loved or want to mention? (Optional)
              </label>
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. Special mention to staff, favorite dish, speedy delivery, or specific experience..."
                rows={2}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#207de9] transition"
              />
            </div>

            {/* GENERATE DRAFT BUTTON */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerateDraft}
                disabled={isGenerating}
                className="w-full py-4 px-6 rounded-2xl font-extrabold text-white text-base bg-gradient-to-r from-[#207de9] to-[#0ea5e9] shadow-lg shadow-blue-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Drafting Your Review...
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    Create My Review Draft
                    <span>→</span>
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-slate-400 font-medium mt-2">
                🔒 You will be able to review and edit the draft before going to Google.
              </p>
            </div>
          </div>
        ) : (
          /* STEP 2: DRAFT REVIEW & POST TO GOOGLE */
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <h3 className="text-sm font-extrabold text-emerald-900 leading-tight">
                  Your Review Draft is Ready!
                </h3>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Feel free to edit or add words below, then post it on Google with 1 click.
                </p>
              </div>
            </div>

            {/* EDITABLE DRAFT TEXTAREA */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Review Text (Editable)
                </span>
                <span className="text-xs font-bold text-amber-500">
                  {"★".repeat(rating)} ({rating}/5)
                </span>
              </div>

              <textarea
                value={reviewDraft}
                onChange={(e) => setReviewDraft(e.target.value)}
                rows={5}
                className="w-full text-sm sm:text-base leading-relaxed p-4 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#207de9] font-normal text-slate-900"
              />

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep("questions")}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                >
                  ← Edit My Answers
                </button>

                <button
                  type="button"
                  onClick={handleCopyDraft}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                    copied
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                  }`}
                >
                  {copied ? "✓ Copied to Clipboard!" : "📋 Copy Draft"}
                </button>
              </div>
            </div>

            {/* PRIMARY GOOGLE REVIEW BUTTON */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Final Step</span>
                <span className="text-[#207de9] font-bold">Opens Official Google Profile</span>
              </div>

              <button
                type="button"
                onClick={handleGoogleReviewClick}
                className="w-full py-4 px-6 rounded-2xl font-black text-white text-base bg-[#4285F4] hover:bg-[#3367d6] shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                {/* Official Google G Icon */}
                <svg className="w-5 h-5 shrink-0 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Review on Google</span>
                <span>↗</span>
              </button>

              {/* Instructions banner */}
              <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-600 space-y-1">
                <p className="font-bold text-slate-800">💡 How it works:</p>
                <ol className="list-decimal pl-4 space-y-0.5">
                  <li>Clicking the button copies your draft and opens Google.</li>
                  <li>In Google, choose your star rating and paste your draft.</li>
                  <li>Click <strong>Post</strong> to publish your genuine review!</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* 3. GOOGLE COMPLIANCE & PRIVACY FOOTER */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 text-center space-y-2">
          <p className="text-[11px] text-slate-500 leading-relaxed max-w-md mx-auto font-normal">
            🛡️ <strong>Google Review Policy Compliance:</strong> ReviewFlow AI assists you in organizing your own genuine thoughts into a draft. We never post reviews automatically, never incentivize ratings, and never restrict critical feedback.
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
