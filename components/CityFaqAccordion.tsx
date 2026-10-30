"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface CityFaqAccordionProps {
  faqs: FaqItem[];
  cityName: string;
}

export default function CityFaqAccordion({ faqs, cityName }: CityFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden transition-all shadow-xs hover:border-blue-200"
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-900 hover:text-[#1570ef] transition-colors cursor-pointer gap-4"
              aria-expanded={isOpen}
            >
              <span className="text-sm sm:text-base leading-snug">{faq.question}</span>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-transform duration-200 font-black text-sm ${
                  isOpen ? "rotate-180 bg-blue-50 text-[#1570ef]" : ""
                }`}
              >
                ↓
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
