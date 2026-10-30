"use client";

import React from "react";
import Link from "next/link";

interface MarqueeItem {
  label: string;
  href: string;
  badge?: string;
}

const MARQUEE_ITEMS: MarqueeItem[] = [
  { label: "DIGITAL MARKETING", href: "/services/digital-marketing" },
  { label: "SEARCH ENGINE OPTIMIZATION", href: "/services/seo" },
  { label: "GOOGLE MAPS 3-PACK", href: "/services/local-seo", badge: "LOCAL" },
  { label: "BRAND IDENTITY & CREATIVE", href: "/services/branding" },
  { label: "NEXT.JS WEB DEVELOPMENT", href: "/services/web-development", badge: "SUB-SECOND" },
  { label: "PERFORMANCE MARKETING", href: "/services/google-ads" },
  { label: "REVIEWFLOW AI", href: "/reviewflow", badge: "NEW" },
  { label: "META ADS & REELS", href: "/services/meta-ads" },
  { label: "GENERATIVE AI SEARCH (GEO)", href: "/tools", badge: "AI" },
  { label: "HIGH-TICKET LEAD GENERATION", href: "/services/lead-generation" },
  { label: "TECHNICAL SEO & CORE WEB VITALS", href: "/services/technical-seo" },
  { label: "E-COMMERCE & SHOPIFY STORES", href: "/services/ecommerce-development" },
];

export default function TopMarquee() {
  return (
    <div
      className="relative w-full overflow-hidden bg-[#080d24] text-white py-3 sm:py-3.5 border-y border-white/10 select-none z-30"
      aria-label="Core Services Marquee"
    >
      {/* Subtle edge gradient masks for cinematic fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#080d24] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#080d24] to-transparent z-10 pointer-events-none" />

      {/* Infinite loop track */}
      <div className="animate-infinite-marquee flex items-center">
        {/* Track 1 */}
        <div className="flex items-center shrink-0 gap-6 sm:gap-10 pr-6 sm:pr-10">
          {MARQUEE_ITEMS.map((item, idx) => (
            <Link
              key={`t1-${idx}`}
              href={item.href}
              className="group inline-flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-display font-bold tracking-wider text-slate-300 hover:text-white transition-colors uppercase whitespace-nowrap cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#1570ef] group-hover:scale-150 group-hover:shadow-[0_0_8px_#1570ef] transition-all" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-[#207de9] text-[9.5px] font-black uppercase tracking-widest border border-blue-400/30">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Track 2 (Exact Duplicate for Seamless Infinity) */}
        <div className="flex items-center shrink-0 gap-6 sm:gap-10 pr-6 sm:pr-10" aria-hidden="true">
          {MARQUEE_ITEMS.map((item, idx) => (
            <Link
              key={`t2-${idx}`}
              href={item.href}
              tabIndex={-1}
              className="group inline-flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-display font-bold tracking-wider text-slate-300 hover:text-white transition-colors uppercase whitespace-nowrap cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#1570ef] group-hover:scale-150 group-hover:shadow-[0_0_8px_#1570ef] transition-all" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-[#207de9] text-[9.5px] font-black uppercase tracking-widest border border-blue-400/30">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
