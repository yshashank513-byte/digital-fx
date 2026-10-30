"use client";

import { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
  theme?: "light" | "navy";
}

export default function FaqAccordion({ faqs, theme = "light" }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const isLight = theme === "light";

  return (
    <div className="space-y-3.5">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`rounded-2xl border transition-all overflow-hidden ${
              isLight
                ? "bg-white border-slate-200/90 shadow-xs hover:border-blue-200"
                : "bg-slate-900/80 border-slate-800 text-white hover:border-slate-700"
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className={`w-full flex items-center justify-between p-5 text-left font-bold transition-colors cursor-pointer gap-4 ${
                isLight
                  ? "text-[#080d24] hover:text-[#1570ef]"
                  : "text-slate-100 hover:text-blue-400"
              }`}
              aria-expanded={isOpen}
            >
              <span className="text-[14.5px] sm:text-[16px] leading-snug">{faq.question}</span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200 font-bold text-sm ${
                  isOpen
                    ? "rotate-180 bg-blue-50 text-[#1570ef]"
                    : isLight
                    ? "bg-slate-100 text-slate-500"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                ↓
              </span>
            </button>
            {isOpen && (
              <div
                className={`px-5 pb-5 text-xs sm:text-[14px] leading-relaxed border-t pt-3.5 ${
                  isLight
                    ? "text-slate-600 border-slate-100"
                    : "text-slate-300 border-slate-800"
                }`}
              >
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
