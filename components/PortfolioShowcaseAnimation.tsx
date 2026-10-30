"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { initGsap, prefersReducedMotion } from "@/lib/gsap";
import { getAllCaseStudies, CaseStudyItem } from "@/lib/caseStudiesData";

const CATEGORIES = [
  "All",
  "Healthcare",
  "Real Estate",
  "Logistics",
  "Interior & D2C",
  "B2B Manufacturing",
];

export default function PortfolioShowcaseAnimation() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const caseStudies = getAllCaseStudies();

  const filteredStudies =
    activeCategory === "All"
      ? caseStudies
      : caseStudies.filter((item) =>
          item.industry.toLowerCase().includes(activeCategory.toLowerCase()) ||
          item.badge.toLowerCase().includes(activeCategory.toLowerCase())
        );

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const { gsap, ScrollTrigger } = initGsap();
    const ctx = gsap.context(() => {
      // Staggered card reveal with clip-path/opacity on scroll
      gsap.fromTo(
        ".portfolio-card-item",
        {
          opacity: 0,
          y: 40,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [activeCategory]);

  const handleNext = () => {
    setCarouselIndex((prev) => (prev + 1) % filteredStudies.length);
  };

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev - 1 + filteredStudies.length) % filteredStudies.length);
  };

  return (
    <section ref={containerRef} className="py-24 bg-white border-b border-slate-200 overflow-hidden">
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1570ef] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse" />
              Verified Client Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-[#080d24] tracking-tight leading-[1.12]">
              Engineered Results Across High-Stakes Industries
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              Explore how our search engineering, sub-second web platforms, and paid acquisition funnels compound into verifiable bottom-line revenue.
            </p>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setCarouselIndex(0);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#080d24] text-white shadow-md shadow-slate-900/10 scale-105"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 1. INTERACTIVE EDITORIAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStudies.map((study, idx) => (
            <article
              key={study.slug}
              className="portfolio-card-item group relative rounded-3xl bg-slate-50 border border-slate-200/90 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-2xl hover:border-[#1570ef] transition-all duration-300 hover:-translate-y-1.5"
            >
              {/* Card Media / Thumbnail Mockup Area with Smooth Hover Scale */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-[#080d24] via-[#0d1738] to-[#122254] p-6 flex flex-col justify-between">
                {/* Ambient glow accent */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                {/* Top Tags */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[10.5px] font-bold uppercase tracking-wider border border-white/15">
                    {study.industry}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-300">
                    📍 {study.location}
                  </span>
                </div>

                {/* Center Hero Metric Graphic */}
                <div className="relative z-10 my-auto text-center transform transition-transform duration-300 group-hover:scale-105">
                  <div className="text-3xl sm:text-4xl lg:text-[42px] font-black font-display text-white tracking-tight leading-none drop-shadow-md">
                    {study.metrics[0]?.value}
                  </div>
                  <div className="text-xs font-bold text-blue-300 mt-1 uppercase tracking-wider">
                    {study.metrics[0]?.label}
                  </div>
                </div>

                {/* Bottom Timeline Pill */}
                <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Sprint: {study.timeline}</span>
                  <span className="text-emerald-400 font-bold">Verified ROI ✓</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-[#1570ef] mb-1">
                    {study.client}
                  </div>
                  <h3 className="text-lg sm:text-xl font-heading font-black text-[#080d24] group-hover:text-[#1570ef] transition-colors leading-snug mb-3">
                    {study.heroHeadline}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-6">
                    {study.summary}
                  </p>
                </div>

                {/* Bottom Action Strip */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {study.servicesUsed.slice(0, 2).map((srv, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10.5px] font-medium"
                      >
                        {srv.name}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#080d24] group-hover:text-[#1570ef] transition-colors shrink-0"
                  >
                    <span>View Breakdown</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Interactive Carousel Bar */}
        <div className="mt-14 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Viewing {filteredStudies.length} Verified Case Studies
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#1570ef] text-white text-xs font-bold transition-all shadow-xs"
            >
              <span>Explore All Client Work</span>
              <span>→</span>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all shadow-xs"
            >
              <span>Request Strategic Proposal</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
