"use client";

import React, { useState, useEffect } from "react";
import { BusinessProfile } from "@/lib/reviewFlowTypes";
import { structureCustomerReview } from "@/lib/humanReviewEngine";

interface Props {
  business: BusinessProfile;
}

const PROMPT_CHIPS = ["Service", "Staff", "Quality", "Experience", "Value"];

export default function LiveCustomerPhoneMockup({ business }: Props) {
  const [rating, setRating] = useState<number>(5);
  const [selectedChips, setSelectedChips] = useState<string[]>(["Service", "Staff"]);
  const [reviewText, setReviewText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [toast, setToast] = useState<string>("");

  // Update preview review text when business, rating or chips change
  useEffect(() => {
    const text = structureCustomerReview({
      businessName: business.name,
      category: business.category,
      rating,
      keywords: selectedChips,
      language: "en",
    });
    setReviewText(text);
  }, [business.name, business.category, rating, selectedChips]);

  const toggleChip = (chip: string) => {
    if (selectedChips.includes(chip)) {
      setSelectedChips(selectedChips.filter((c) => c !== chip));
    } else {
      setSelectedChips([...selectedChips, chip]);
    }
  };

  const handlePostReviewClick = async () => {
    try {
      await navigator.clipboard.writeText(reviewText);
      setCopied(true);
      setToast("Review copied! Opening destination...");
      setTimeout(() => {
        setCopied(false);
        setToast("");
      }, 2500);
    } catch (_) {}

    const targetUrl = business.googleReviewUrl || "https://www.google.com/maps";
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Top Banner Indicator */}
      <div className="w-full mb-3 flex items-center justify-between text-xs px-1">
        <span className="font-bold text-slate-700 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Customer Phone Preview</span>
        </span>
        <span className="text-[11px] text-slate-400 font-mono">
          Interactive Mockup
        </span>
      </div>

      {/* Realistic Mobile Device Frame */}
      <div className="w-full max-w-[340px] rounded-[36px] bg-slate-900 p-3 shadow-2xl border-4 border-slate-800 relative">
        
        {/* Phone Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-950 rounded-full z-20 flex items-center justify-center">
          <div className="w-8 h-1 bg-slate-800 rounded-full" />
        </div>

        {/* Screen Content */}
        <div className="rounded-[28px] bg-white text-slate-900 overflow-hidden min-h-[580px] flex flex-col justify-between pt-7 pb-4 px-4 relative">
          
          {/* Mockup Notification Toast */}
          {toast && (
            <div className="absolute top-8 left-3 right-3 z-30 bg-slate-900 text-white text-[11px] font-semibold py-2 px-3 rounded-xl shadow-lg flex items-center gap-2 border border-slate-700 animate-in fade-in">
              <span className="text-emerald-400">✓</span>
              <span>{toast}</span>
            </div>
          )}

          <div className="space-y-4">
            
            {/* Header: Business Logo + Name */}
            <div className="text-center pt-2">
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt={business.name}
                  className="h-10 w-auto max-w-[120px] object-contain mx-auto rounded-lg mb-1.5"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-xs mx-auto mb-1.5"
                  style={{ backgroundColor: business.brandColor || "#2563EB" }}
                >
                  {business.name.substring(0, 2).toUpperCase()}
                </div>
              )}
              
              <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                {business.name}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                How was your experience?
              </p>
            </div>

            {/* 5 Large Clickable Star Buttons */}
            <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100 text-center">
              <div className="flex items-center justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition hover:scale-125 focus:outline-none cursor-pointer"
                  >
                    <span
                      className={`text-2xl transition ${
                        rating >= star ? "text-amber-400" : "text-slate-200"
                      }`}
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
              <div className="text-[10px] font-bold text-slate-500 mt-1">
                You rated us {rating} out of 5
              </div>
            </div>

            {/* Review Text Box (AI Structured) */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Tell us about your experience
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 leading-relaxed outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* Aspect Prompt Chips: Service, Staff, Quality, Experience, Value */}
            <div className="space-y-1 text-left">
              <span className="text-[10px] text-slate-400 font-semibold block">
                Tap prompts to add points:
              </span>
              <div className="flex flex-wrap gap-1">
                {PROMPT_CHIPS.map((chip) => {
                  const active = selectedChips.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => toggleChip(chip)}
                      className={`px-2 py-1 rounded-lg text-[10.5px] font-semibold transition cursor-pointer ${
                        active
                          ? "bg-[#2563EB] text-white shadow-2xs font-bold"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Post Review CTA */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handlePostReviewClick}
                className="w-full py-2.5 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs active:scale-98"
              >
                <span>Post Review</span>
                <span className="text-sm">↗</span>
              </button>
              
              <div className="text-[9.5px] text-center text-slate-400 mt-1">
                Opens configured destination ({business.googleReviewUrl ? "Google Business" : "Review URL"})
              </div>
            </div>

          </div>

          {/* Device Home Indicator Bar */}
          <div className="w-24 h-1 bg-slate-300 rounded-full mx-auto mt-4" />

        </div>

      </div>

    </div>
  );
}
