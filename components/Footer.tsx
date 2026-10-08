"use client";

import React, { useState } from "react";
import Link from "next/link";

// -----------------------------------------------------------------------------
// High-Fidelity SVG Brand Icons & Assets (Official Logos)
// -----------------------------------------------------------------------------

function ChevronBlue({ className = "w-3 h-3 text-[#155EEF] shrink-0 mt-1" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function GoogleGIcon({ className = "w-4.5 h-4.5 shrink-0" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}

function PhoneIconBlue({ className = "w-4 h-4 text-[#155EEF] shrink-0" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-4 h-4 fill-current shrink-0" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

function LocationPinIcon({ className = "w-4 h-4 text-[#1570ef] shrink-0 mt-0.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function PhoneIconFooter({ className = "w-4 h-4 text-[#1570ef] shrink-0" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Official Social Platform Vector Logos
// -----------------------------------------------------------------------------

function FacebookLogo({ className = "w-5 h-5 fill-white shrink-0" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function XTwitterLogo({ className = "w-4 h-4 fill-white shrink-0" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInLogo({ className = "w-4.5 h-4.5 fill-white shrink-0" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function InstagramLogo({ className = "w-4.5 h-4.5 fill-white shrink-0" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function YouTubeLogo({ className = "w-5 h-5 fill-white shrink-0" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// CTA Right-Side Subtle Blueprint Grid Background
// -----------------------------------------------------------------------------
function CtaBackgroundIllustration() {
  return (
    <div
      className="absolute right-0 top-0 h-full w-[320px] sm:w-[500px] lg:w-[620px] pointer-events-none select-none overflow-hidden opacity-25"
      aria-hidden="true"
    >
      <svg className="w-full h-full" viewBox="0 0 620 260" fill="none">
        <defs>
          <pattern id="footerGridPattern" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#2563eb" strokeWidth="0.75" strokeOpacity="0.3" />
          </pattern>
        </defs>
        <rect width="620" height="260" fill="url(#footerGridPattern)" />
      </svg>
    </div>
  );
}

// -----------------------------------------------------------------------------
// MAIN COMPONENT: Institutional Branded Footer
// -----------------------------------------------------------------------------
export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSuccess(true);
    setNewsletterEmail("");
    setTimeout(() => setNewsletterSuccess(false), 5000);
  };

  return (
    <>
      {/* =========================================================================
          1. TOP CTA CONVERSION STRIP
          ========================================================================= */}
      <section className="relative bg-[#f8faff] border-t border-b border-slate-200 overflow-hidden font-sans w-full max-w-full box-border">
        {/* Subtle Ambient Accent */}
        <div className="absolute -left-16 -top-16 w-80 h-80 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />

        {/* Right-Side Blueprint Grid */}
        <CtaBackgroundIllustration />

        {/* Centered Max-Width Container */}
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-12 sm:py-14 flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10 box-border">
          
          {/* Left Text & Credibility */}
          <div className="max-w-2xl w-full text-center lg:text-left min-w-0">
            {/* Blue Rounded Credibility Badge with Pulse */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold tracking-wider uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse shrink-0" />
              <span>DELHI NCR&apos;S PREMIER SEARCH &amp; GROWTH FIRM</span>
            </div>

            {/* Bold Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold text-[#080d24] tracking-tight leading-[1.2]">
              Ready to dominate <span className="text-[#1570ef]">Google Maps 3-Pack</span> &amp; scale revenue?
            </h2>

            {/* Supporting Description */}
            <p className="mt-2.5 text-sm sm:text-[15px] text-slate-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              Meet your dedicated strategists in Orbit Plaza, Crossings Republik, or request a customized competitor analysis today.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-end gap-3 w-full sm:w-auto shrink-0 z-20">
            {/* 1. Call Button */}
            <a
              href="tel:+919319807273"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#080d24] text-xs sm:text-sm font-bold border border-slate-200 shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <PhoneIconBlue className="w-4 h-4 text-[#1570ef] shrink-0" />
              <span>Call +91 93198 07273</span>
            </a>

            {/* 2. WhatsApp Button */}
            <a
              href="https://wa.me/919319807273?text=Hi%20Digital%20FX%20team,%20I%20want%20to%20discuss%20a%20growth%20strategy."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
              <span>WhatsApp Strategy</span>
            </a>

            {/* 3. Get Free Proposal Button */}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1570ef] hover:bg-[#1258c4] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <span>Get Free Proposal →</span>
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. DEEP NAVY INSTITUTIONAL FOOTER
          ========================================================================= */}
      <footer className="w-full max-w-full overflow-x-hidden bg-[#080d24] text-[#F8FAFC] pt-14 sm:pt-16 pb-12 border-t border-slate-800 font-sans box-border">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 box-border">
          
          {/* Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 sm:pb-14 border-b border-white/10 w-full min-w-0">
            
            {/* COLUMN 1: Original Brand Logo, Description, Trust Badges, Address */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-3 space-y-5 w-full min-w-0">
              
              {/* Original Digital FX Logo */}
              <div className="flex items-center">
                <Link href="/" className="inline-block group max-w-full" aria-label="Digital FX Home">
                  <img
                    src="/logo-white.svg"
                    alt="Digital FX - Business Solution"
                    width={290}
                    height={76}
                    loading="lazy"
                    decoding="async"
                    style={{ height: "64px", width: "auto" }}
                    className="h-12 sm:h-14 lg:h-[64px] w-auto max-w-full object-contain shrink-0 transition-transform group-hover:scale-[1.02]"
                  />
                </Link>
              </div>

              {/* Company Description */}
              <p className="text-[13.5px] text-slate-300 leading-[1.6] font-normal break-words w-full">
                We are the digital advertising &amp; search engineering company that turns search visibility into measurable revenue. Dominating Google Maps 3-Pack, Generative AI Search (GEO), and performance marketing across India and global markets.
              </p>

              {/* Unified Rating Badges */}
              <div className="space-y-2 pt-1 w-full min-w-0">
                {/* Google 4.9/5.0 Badge */}
                <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl shadow-xs w-full max-w-full min-w-0 box-border">
                  <GoogleGIcon className="w-4.5 h-4.5 shrink-0" />
                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                    <span className="text-amber-400 text-xs tracking-wider shrink-0">★★★★★</span>
                    <span className="text-xs font-bold text-slate-200 truncate">4.9/5.0 (128+ Reviews)</span>
                  </div>
                </div>

                {/* Amazing Workplaces Certified */}
                <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl text-slate-300 text-xs font-bold tracking-wider uppercase shadow-xs w-full max-w-full min-w-0 box-border">
                  <span className="text-amber-400 shrink-0">★</span>
                  <span className="break-words min-w-0">Amazing Workplaces Certified India</span>
                </div>

                {/* Glassdoor Badge */}
                <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl text-xs shadow-xs w-full max-w-full min-w-0 box-border">
                  <span className="font-extrabold text-emerald-400 tracking-wider uppercase shrink-0">GLASSDOOR</span>
                  <span className="font-bold text-slate-200">4.5</span>
                  <span className="text-amber-400 text-xs tracking-wider shrink-0">★★★★★</span>
                </div>
              </div>

              {/* Office Address & Phone */}
              <div className="pt-2 space-y-2.5 text-xs text-slate-300 w-full min-w-0">
                <div className="flex items-start gap-2.5 w-full min-w-0">
                  <LocationPinIcon className="w-4 h-4 text-[#1570ef] shrink-0 mt-0.5" />
                  <span className="leading-relaxed break-words w-full min-w-0">
                    Shop No. 210, 2nd Floor, Orbit Plaza, Crossings Republik, Ghaziabad, UP 201016
                  </span>
                </div>
                <div className="flex items-center gap-2.5 w-full min-w-0">
                  <PhoneIconFooter className="w-4 h-4 text-[#1570ef] shrink-0" />
                  <a href="tel:+919319807273" className="text-white hover:text-blue-400 transition-colors font-bold break-all">
                    +91 93198 07273
                  </a>
                </div>
              </div>

            </div>

            {/* COLUMN 2: Quick Links & Tools */}
            <div className="col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2 w-full min-w-0">
              <h3 className="text-[17px] font-bold text-[#F8FAFC]">
                Quick Links &amp; Tools
              </h3>
              <div className="w-8 h-[2.5px] bg-[#155EEF] rounded-full mt-2 mb-4" />
              
              <ul className="space-y-2 text-[13.5px] sm:text-[14px] text-[#B8C5D9] font-medium w-full min-w-0">
                <li className="w-full min-w-0">
                  <Link href="/" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">Home</span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">SEO &amp; Growth Services</span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/case-studies" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">The Digital FX Portfolio</span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/pricing" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">Digital Marketing Packages</span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/reviewflow" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">
                      ReviewFlow AI (Smart QR){" "}
                      <span className="bg-[#155EEF] text-white text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase leading-none inline-block ml-1">
                        NEW
                      </span>
                    </span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/tools" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">
                      <span className="text-[#08C568]">Free AI Search &amp; GEO Tool</span>{" "}
                      <span className="bg-[#08C568] text-white text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase leading-none inline-block ml-1">
                        FREE
                      </span>
                    </span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/careers" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">Careers (We Are Hiring!)</span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/contact" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">Contact &amp; Strategy Desk</span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/blog" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">Blog &amp; SEO Insights</span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/privacy-policy" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">Privacy Policy</span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/terms-and-conditions" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">Terms &amp; Conditions</span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/refund-policy" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">Refund Policy</span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/sitemap.xml" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">XML Sitemap</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* COLUMN 3: Solutions & Services */}
            <div className="col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2 w-full min-w-0">
              <h3 className="text-[17px] font-bold text-[#F8FAFC]">
                Solutions &amp; Services
              </h3>
              <div className="w-8 h-[2.5px] bg-[#155EEF] rounded-full mt-2 mb-4" />

              <ul className="space-y-2 text-[13.5px] sm:text-[14px] text-[#B8C5D9] font-medium w-full min-w-0">
                <li className="w-full min-w-0">
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">Google Maps 3–Pack &amp; Local SEO</span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">Generative AI Search &amp; GEO</span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">Website &amp; App Development</span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">Pay Per Click (PPC / Google Ads)</span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">CTV &amp; Programmatic Advertising</span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">Rich Media Innovation</span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">Media Planning &amp; Buying</span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">Content Marketing</span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">Social Media Marketing</span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">Reputation Management (ORM)</span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">Influencer Marketing</span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">Email Marketing (₹4,999)</span>
                  </Link>
                </li>
                <li className="w-full min-w-0">
                  <Link href="/contact" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors w-full min-w-0 py-0.5 leading-[1.6]">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                    <span className="break-words min-w-0 flex-1">WhatsApp Lead Automation</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* COLUMN 4: Industries We Scale */}
            <div className="col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2 w-full min-w-0">
              <h3 className="text-[17px] font-bold text-[#F8FAFC]">
                Industries We Scale
              </h3>
              <div className="w-8 h-[2.5px] bg-[#155EEF] rounded-full mt-2 mb-4" />

              <ul className="space-y-2 text-[13.5px] sm:text-[14px] text-[#B8C5D9] font-medium w-full min-w-0">
                <li className="w-full min-w-0 group flex items-start gap-2 py-0.5 leading-[1.6]">
                  <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                  <span className="hover:text-[#F8FAFC] transition-colors cursor-default break-words min-w-0 flex-1">Hospitals &amp; Healthcare</span>
                </li>
                <li className="w-full min-w-0 group flex items-start gap-2 py-0.5 leading-[1.6]">
                  <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                  <span className="hover:text-[#F8FAFC] transition-colors cursor-default break-words min-w-0 flex-1">Automobile &amp; Detailing</span>
                </li>
                <li className="w-full min-w-0 group flex items-start gap-2 py-0.5 leading-[1.6]">
                  <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                  <span className="hover:text-[#F8FAFC] transition-colors cursor-default break-words min-w-0 flex-1">Real Estate &amp; Builders</span>
                </li>
                <li className="w-full min-w-0 group flex items-start gap-2 py-0.5 leading-[1.6]">
                  <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                  <span className="hover:text-[#F8FAFC] transition-colors cursor-default break-words min-w-0 flex-1">Travel &amp; Hospitality</span>
                </li>
                <li className="w-full min-w-0 group flex items-start gap-2 py-0.5 leading-[1.6]">
                  <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                  <span className="hover:text-[#F8FAFC] transition-colors cursor-default break-words min-w-0 flex-1">FMCG &amp; FMCD Brands</span>
                </li>
                <li className="w-full min-w-0 group flex items-start gap-2 py-0.5 leading-[1.6]">
                  <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                  <span className="hover:text-[#F8FAFC] transition-colors cursor-default break-words min-w-0 flex-1">Education &amp; Institutes</span>
                </li>
                <li className="w-full min-w-0 group flex items-start gap-2 py-0.5 leading-[1.6]">
                  <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                  <span className="hover:text-[#F8FAFC] transition-colors cursor-default break-words min-w-0 flex-1">E-Commerce &amp; D2C</span>
                </li>
                <li className="w-full min-w-0 group flex items-start gap-2 py-0.5 leading-[1.6]">
                  <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                  <span className="hover:text-[#F8FAFC] transition-colors cursor-default break-words min-w-0 flex-1">Security &amp; Legal Services</span>
                </li>
                <li className="w-full min-w-0 group flex items-start gap-2 py-0.5 leading-[1.6]">
                  <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                  <span className="hover:text-[#F8FAFC] transition-colors cursor-default break-words min-w-0 flex-1">Information Technology</span>
                </li>
                <li className="w-full min-w-0 group flex items-start gap-2 py-0.5 leading-[1.6]">
                  <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0 mt-1.5" />
                  <span className="hover:text-[#F8FAFC] transition-colors cursor-default break-words min-w-0 flex-1">Banking &amp; Financial Services</span>
                </li>
              </ul>
            </div>

            {/* COLUMN 5: Follow Digital FX & Newsletter Card */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-3 w-full min-w-0">
              <h3 className="text-[17px] font-bold text-[#F8FAFC]">
                Follow Digital FX
              </h3>
              <div className="w-8 h-[2.5px] bg-[#155EEF] rounded-full mt-2 mb-4" />

              {/* Official Social Brand Icons Row */}
              <div className="flex flex-wrap items-center gap-3">
                {/* 1. Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow-xs hover:opacity-90 hover:scale-105 transition-all active:scale-95 cursor-pointer"
                >
                  <FacebookLogo />
                </a>

                {/* 2. X (Twitter) */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="w-10 h-10 rounded-xl bg-black border border-white/20 text-white flex items-center justify-center shadow-xs hover:opacity-90 hover:scale-105 transition-all active:scale-95 cursor-pointer"
                >
                  <XTwitterLogo />
                </a>

                {/* 3. LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-10 h-10 rounded-xl bg-[#0A66C2] text-white flex items-center justify-center shadow-xs hover:opacity-90 hover:scale-105 transition-all active:scale-95 cursor-pointer"
                >
                  <LinkedInLogo />
                </a>

                {/* 4. Instagram */}
                <a
                  href="https://www.instagram.com/digitalfx.in?stkn=Y2owZTN4ZTd2cm5p"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Digital FX on Instagram"
                  className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shadow-xs hover:opacity-90 hover:scale-105 transition-all active:scale-95 cursor-pointer"
                >
                  <InstagramLogo />
                </a>

                {/* 5. YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-10 h-10 rounded-xl bg-[#FF0000] text-white flex items-center justify-center shadow-xs hover:opacity-90 hover:scale-105 transition-all active:scale-95 cursor-pointer"
                >
                  <YouTubeLogo />
                </a>
              </div>

              {/* Get Marketing Insights Newsletter Card */}
              <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-[#0B1E38]/90 border border-[#1E3A5F] shadow-sm w-full max-w-full box-border">
                <h4 className="text-[15px] font-bold text-[#F8FAFC]">
                  Get Marketing Insights
                </h4>
                <p className="text-xs text-[#B8C5D9] mt-1 mb-4 leading-relaxed font-normal">
                  Tips, updates and growth strategies directly in your inbox.
                </p>

                {newsletterSuccess ? (
                  <div className="py-2.5 px-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
                    <span>✓</span> Subscribed! Thank you for joining.
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2 w-full min-w-0">
                    <div className="relative flex-1 min-w-0">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">✉</span>
                      <input
                        type="email"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full h-10 rounded-xl bg-[#07172D]/90 border border-[#1E3A5F] pl-8 pr-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#155EEF] transition min-w-0"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      aria-label="Subscribe"
                      className="w-10 h-10 rounded-xl bg-[#155EEF] hover:bg-[#1250cf] text-white flex items-center justify-center transition shrink-0 font-bold active:scale-95 cursor-pointer shadow-xs"
                    >
                      →
                    </button>
                  </form>
                )}
              </div>

            </div>

          </div>

          {/* =======================================================================
              2.5 REGIONAL AUTHORITY HUBS (Direct Internal Link Equity for Indexing)
              ======================================================================= */}
          <div className="pt-8 pb-4 border-t border-slate-800/90 text-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
              <span className="text-[12.5px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1570ef]" />
                Top Commercial Hubs &amp; Regional Presence
              </span>
              <Link
                href="/locations"
                className="text-[#1570ef] hover:text-blue-400 font-bold transition flex items-center gap-1 text-[12px]"
              >
                <span>Explore All 350+ Cities Directory</span>
                <span>→</span>
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[#94a3b8] text-[11.5px] font-medium leading-relaxed">
              {[
                { name: "Dubai", slug: "dubai" },
                { name: "Abu Dhabi", slug: "abu-dhabi" },
                { name: "Delhi", slug: "delhi" },
                { name: "Noida", slug: "noida" },
                { name: "Greater Noida", slug: "greater-noida" },
                { name: "Ghaziabad", slug: "ghaziabad" },
                { name: "Gurugram", slug: "gurugram" },
                { name: "Faridabad", slug: "faridabad" },
                { name: "Mumbai", slug: "mumbai" },
                { name: "Bengaluru", slug: "bengaluru" },
                { name: "Hyderabad", slug: "hyderabad" },
                { name: "Ahmedabad", slug: "ahmedabad" },
                { name: "Pune", slug: "pune" },
                { name: "Chandigarh", slug: "chandigarh" },
                { name: "Mohali", slug: "mohali" },
                { name: "Lucknow", slug: "lucknow" },
                { name: "Jaipur", slug: "jaipur" },
                { name: "Kolkata", slug: "kolkata" },
                { name: "Chennai", slug: "chennai" },
                { name: "Indore", slug: "indore" },
                { name: "Bhopal", slug: "bhopal" },
                { name: "Coimbatore", slug: "coimbatore" },
                { name: "Dehradun", slug: "dehradun" },
                { name: "Amritsar", slug: "amritsar" },
                { name: "Surat", slug: "surat" },
                { name: "Patna", slug: "patna" },
                { name: "Kochi", slug: "kochi" },
                { name: "Nagpur", slug: "nagpur" },
                { name: "Visakhapatnam", slug: "visakhapatnam" },
                { name: "Bhubaneswar", slug: "bhubaneswar" },
                { name: "Ludhiana", slug: "ludhiana" },
                { name: "Vadodara", slug: "vadodara" },
                { name: "Varanasi", slug: "varanasi" },
              ].map((hub, idx, arr) => (
                <span key={hub.slug} className="inline-flex items-center gap-2">
                  <Link
                    href={`/locations/${hub.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    SEO in {hub.name}
                  </Link>
                  {idx < arr.length - 1 && <span className="text-slate-700">•</span>}
                </span>
              ))}
            </div>
          </div>

          {/* =======================================================================
              3. BOTTOM COPYRIGHT & LEGAL BAR
              ======================================================================= */}
          <div className="pt-6 flex flex-col md:flex-row items-center md:items-start justify-between text-xs text-[#8F9EAF] gap-4 font-normal w-full min-w-0">
            <div className="text-center md:text-left leading-relaxed w-full md:w-auto break-words min-w-0">
              © {new Date().getFullYear()} Digital FX®. All rights reserved. Registered Office: Shop No. 210, Orbit Plaza, Crossings Republik, Ghaziabad.
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-2 sm:gap-x-6 w-full md:w-auto text-center min-w-0">
              <Link href="/blog" className="hover:text-white transition-colors whitespace-nowrap">
                Blog
              </Link>
              <Link href="/reviewflow" className="hover:text-white transition-colors whitespace-nowrap">
                ReviewFlow AI
              </Link>
              <Link href="/privacy-policy" className="hover:text-white transition-colors whitespace-nowrap">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="hover:text-white transition-colors whitespace-nowrap">
                Terms of Service
              </Link>
              <Link href="/refund-policy" className="hover:text-white transition-colors whitespace-nowrap">
                Refund Policy
              </Link>
              <Link href="/admin/login" className="hover:text-slate-200 transition-colors text-slate-400 whitespace-nowrap">
                Admin Panel
              </Link>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}
