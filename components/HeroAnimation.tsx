"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { initGsap, prefersReducedMotion } from "@/lib/gsap";

interface HeroAnimationProps {
  onOpenProposal?: (url?: string, service?: string) => void;
  initialWebsite?: string;
  onAnalyze?: (url: string) => void;
  headlineLine1?: string;
  headlineLine2?: string;
  headlineAccent?: string;
  badgeText?: string;
  subtitleText?: string;
}

export default function HeroAnimation({
  onOpenProposal,
  initialWebsite = "",
  onAnalyze,
  headlineLine1 = "Digital Marketing & SEO",
  headlineLine2 = "Agency in Ghaziabad —",
  headlineAccent = "Your Revenue Partner in the AI Era.",
  badgeText = "128+ Reviews • Best Digital Marketing Agency in Ghaziabad - Delhi NCR",
  subtitleText = "Most agencies report vanity metrics like impressions and clicks. Digital FX engineers synchronized customer acquisition systems combining Google Maps 3-Pack rankings, sub-second Next.js web applications, and high-ROAS paid funnels for businesses across India.",
}: HeroAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [website, setWebsite] = React.useState(initialWebsite);

  useEffect(() => {
    if (initialWebsite) {
      setWebsite(initialWebsite);
    }
  }, [initialWebsite]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const { gsap } = initGsap();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
      });

      // 1. Badge fade in
      tl.fromTo(
        ".hero-badge-elem",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7 }
      );

      // 2. Line by line text split reveal
      tl.fromTo(
        ".hero-text-line",
        { y: "115%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.1, stagger: 0.14 },
        "-=0.4"
      );

      // 3. Subtitle smooth fade
      tl.fromTo(
        ".hero-subtitle-elem",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9 },
        "-=0.6"
      );

      // 4. Input & CTA bar
      tl.fromTo(
        ".hero-cta-elem",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
        "-=0.6"
      );

      // 5. Trust signals & badges
      tl.fromTo(
        ".hero-trust-elem",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.4"
      );

      // 6. Right-side interactive flywheel
      tl.fromTo(
        ".hero-visual-elem",
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" },
        "-=1.0"
      );

      // 7. Scroll indicator
      tl.fromTo(
        ".hero-scroll-indicator",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.3"
      );

      // Subtle ambient glow movement
      gsap.to(".hero-glow-orb-1", {
        x: 35,
        y: -25,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".hero-glow-orb-2", {
        x: -30,
        y: 30,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAnalyze && website.trim()) {
      onAnalyze(website.trim());
    } else if (onOpenProposal) {
      onOpenProposal(website.trim(), "AI Growth Roadmap");
    }
  };

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* Background Animated Ambient Orbs */}
      <div
        className="hero-glow-orb-1 absolute -top-24 right-1/4 w-[480px] h-[480px] rounded-full bg-blue-500/10 blur-[130px] pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="hero-glow-orb-2 absolute bottom-0 left-10 w-[420px] h-[420px] rounded-full bg-[#1570ef]/10 blur-[110px] pointer-events-none z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-[1400px] w-full px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Line-by-Line Editorial Typography */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left w-full min-w-0">
            
            {/* Overline Badge */}
            <div className="hero-badge-elem mb-5 inline-flex flex-wrap items-center gap-2 rounded-full border border-blue-200/90 bg-blue-50/90 px-3.5 py-1.5 text-[10.5px] sm:text-[11.5px] font-bold text-[#1570ef] shadow-xs max-w-full w-fit">
              <span className="flex items-center gap-1 shrink-0">
                <span className="text-amber-500 text-xs">★★★★★</span>
                <span className="font-extrabold text-[#080d24]">4.9</span>
              </span>
              <span className="text-blue-300">•</span>
              <span className="text-slate-700 uppercase tracking-wider text-[10px] sm:text-[10.5px]">
                {badgeText}
              </span>
            </div>

            {/* Split-Text Line by Line Animated Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[54px] font-heading font-black leading-[1.08] tracking-[-0.04em] text-[#080d24] text-left">
              <span className="block overflow-hidden pb-1">
                <span className="hero-text-line block">
                  {headlineLine1}
                </span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span className="hero-text-line block">
                  {headlineLine2}
                </span>
              </span>
              <span className="block overflow-hidden pt-1">
                <span className="hero-text-line block text-[#1570ef] font-display font-bold">
                  {headlineAccent}
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle-elem mt-5 sm:mt-6 text-[15px] sm:text-[17px] leading-[1.65] text-slate-600 font-normal max-w-xl text-left">
              {subtitleText}
            </p>

            {/* Proposal / Website Analysis Bar */}
            <div className="hero-cta-elem mt-6 sm:mt-8 w-full max-w-[580px]">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-stretch w-full bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-xs hover:border-[#1570ef] focus-within:border-[#1570ef] focus-within:ring-2 focus-within:ring-blue-100 transition-all min-w-0"
              >
                <div className="flex-1 flex items-center px-4 h-13 sm:h-14 bg-transparent min-w-0">
                  <svg className="w-5 h-5 text-slate-400 mr-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a8.997 8.997 0 01-7.843-4.582M12 3a8.997 8.997 0 017.843 4.582M12 3v18" />
                  </svg>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="Enter your website (e.g. yourcompany.com)"
                    className="w-full h-full text-[13.5px] sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent font-medium min-w-0"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-7 bg-[#080d24] hover:bg-[#1570ef] text-white font-bold text-[13.5px] sm:text-sm tracking-wide transition-colors whitespace-nowrap cursor-pointer shadow-xs flex items-center justify-center text-center shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200"
                >
                  <span>Analyze Growth Potential</span>
                  <span className="ml-2 text-base">→</span>
                </button>
              </form>

              {/* Quick links below search */}
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500 font-medium">
                {onOpenProposal && (
                  <button
                    type="button"
                    onClick={() => onOpenProposal(website, "Enterprise Growth Roadmap")}
                    className="text-[#1570ef] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Request Strategic Proposal</span>
                    <span>→</span>
                  </button>
                )}
                {onOpenProposal && <span className="text-slate-300">•</span>}
                <a
                  href="https://wa.me/919319807273?text=Hi%20Digital%20FX%20team,%20I%20want%20to%20discuss%20a%20growth%20strategy."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-[#1570ef] font-semibold inline-flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>WhatsApp Strategy Desk (+91 93198 07273)</span>
                </a>
              </div>
            </div>

            {/* Trust Ribbons */}
            <div className="hero-trust-elem pt-7 mt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Google Premier Partner Certified</span>
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Meta Certified Agency</span>
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#1570ef]" />
                <span>Next.js 16 Edge Architecture</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Revenue Engine Matrix */}
          <div className="hero-visual-elem lg:col-span-5 w-full">
            <div className="relative bg-gradient-to-br from-[#080d24] via-[#0d1738] to-[#080d24] rounded-3xl p-7 sm:p-9 text-white shadow-2xl border border-white/10 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#1570ef]/20 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-400">
                    Proprietary Stack
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    Integrated Revenue Engine
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                  LIVE TELEMETRY
                </span>
              </div>

              {/* 4 Performance Vectors */}
              <div className="space-y-3.5">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                      01
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">Google Maps 3-Pack SEO</div>
                      <div className="text-[11px] text-slate-400">Proximity &amp; ReviewFlow AI</div>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-400">#1 Top 3</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                      02
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">Next.js Edge Speed</div>
                      <div className="text-[11px] text-slate-400">Sub-Second Mobile SSR</div>
                    </div>
                  </div>
                  <span className="text-xs font-black text-blue-400">&lt;0.8s LCP</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                      03
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">Server-Side Meta CAPI</div>
                      <div className="text-[11px] text-slate-400">100% Signal Attribution</div>
                    </div>
                  </div>
                  <span className="text-xs font-black text-purple-400">4.8x ROAS</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                      04
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">Generative Engine Optimization</div>
                      <div className="text-[11px] text-slate-400">ChatGPT &amp; Gemini Citations</div>
                    </div>
                  </div>
                  <span className="text-xs font-black text-amber-400">96% Cited</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400">Headquartered in Ghaziabad, UP</span>
                <Link
                  href="/services"
                  className="text-xs font-bold text-[#207de9] hover:text-white transition flex items-center gap-1"
                >
                  <span>Explore Capabilities</span>
                  <span>→</span>
                </Link>
              </div>

            </div>
          </div>

        </div>

        {/* Elegant Scroll Indicator */}
        <div className="hero-scroll-indicator mt-12 sm:mt-16 pb-4 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">
            SCROLL TO DISCOVER
          </span>
          <div className="w-5 h-9 rounded-full border-2 border-slate-300 flex items-start justify-center p-1">
            <span className="w-1 h-2 rounded-full bg-[#1570ef] animate-bounce" />
          </div>
        </div>

      </div>
    </div>
  );
}
