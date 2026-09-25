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

function LocationPinPink({ className = "w-4 h-4 text-[#F43F5E] shrink-0 mt-0.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

function PhoneIconPink({ className = "w-4 h-4 text-[#F43F5E] shrink-0" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

function PaperPlaneIcon({ className = "w-4.5 h-4.5 text-[#238BFF] shrink-0" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
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
// CTA Right-Side Background Illustration (Dotted Map + Google Pin + 3D Bars + Growth Arrow)
// -----------------------------------------------------------------------------
function CtaBackgroundIllustration() {
  return (
    <svg
      className="absolute right-0 top-0 h-full w-[460px] md:w-[540px] lg:w-[620px] pointer-events-none select-none overflow-hidden opacity-95 transition-opacity"
      viewBox="0 0 620 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="arrowGrad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <radialGradient id="glowPin" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="maskGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="25%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
        </linearGradient>
        <mask id="dotMask">
          <rect x="0" y="0" width="620" height="260" fill="url(#maskGrad)" />
        </mask>
        
        {/* Dot Matrix Pattern */}
        <pattern id="dotPattern" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.45" fill="#7DD3FC" fillOpacity="0.55" />
        </pattern>
      </defs>

      {/* Dotted Grid Background */}
      <rect x="0" y="0" width="620" height="260" fill="url(#dotPattern)" mask="url(#dotMask)" />

      {/* Ambient Radial Glow behind the Google Pin */}
      <circle cx="215" cy="85" r="95" fill="url(#glowPin)" />

      {/* Google Maps Pin Marker */}
      <g transform="translate(190, 25) scale(1.18)">
        {/* Pin shadow */}
        <ellipse cx="20" cy="46" rx="12" ry="3.5" fill="#0284C7" fillOpacity="0.25" />
        
        {/* Outer Pin Body */}
        <path
          d="M20 0C8.954 0 0 8.954 0 20C0 32 17 48 20 50C23 48 40 32 40 20C40 8.954 31.046 0 20 0Z"
          fill="#1A73E8"
          filter="drop-shadow(0 4px 10px rgba(26,115,232,0.35))"
        />
        {/* Inner White Core */}
        <circle cx="20" cy="20" r="13" fill="#FFFFFF" />
        
        {/* Google G Logo inside Pin */}
        <g transform="translate(11.5, 11.5) scale(0.72)">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </g>
      </g>

      {/* 5 Rising 3D Chart Bars */}
      <g transform="translate(385, 65)">
        {/* Bar 1 */}
        <rect x="0" y="115" width="22" height="80" rx="6" fill="url(#barGrad1)" opacity="0.88" />
        <rect x="2" y="117" width="18" height="76" rx="4" fill="#60A5FA" opacity="0.25" />

        {/* Bar 2 */}
        <rect x="34" y="85" width="24" height="110" rx="6" fill="url(#barGrad1)" opacity="0.92" />
        <rect x="36" y="87" width="20" height="106" rx="4" fill="#60A5FA" opacity="0.25" />

        {/* Bar 3 */}
        <rect x="70" y="52" width="26" height="143" rx="7" fill="url(#barGrad2)" opacity="0.96" />
        <rect x="72" y="54" width="22" height="139" rx="5" fill="#93C5FD" opacity="0.3" />

        {/* Bar 4 */}
        <rect x="108" y="22" width="28" height="173" rx="8" fill="url(#barGrad2)" />
        <rect x="110" y="24" width="24" height="169" rx="6" fill="#93C5FD" opacity="0.35" />

        {/* Bar 5 */}
        <rect x="148" y="0" width="30" height="195" rx="8" fill="#1D4ED8" />
        <rect x="150" y="2" width="26" height="191" rx="6" fill="#60A5FA" opacity="0.3" />
      </g>

      {/* Dynamic 3D Growth Arrow Curving Upward */}
      <path
        d="M315 225 C370 215, 440 155, 520 55 L495 50 L560 30 L552 90 L532 65 C475 155, 400 210, 315 225 Z"
        fill="url(#arrowGrad)"
        filter="drop-shadow(0 8px 16px rgba(29,78,216,0.35))"
      />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// MAIN UNIVERSAL FOOTER COMPONENT
// -----------------------------------------------------------------------------
export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.trim())) {
      alert("Please enter a valid email address.");
      return;
    }
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterEmail("");
      setNewsletterSuccess(false);
    }, 4000);
  };

  return (
    <>
      {/* =========================================================================
          1. TOP CTA SECTION (Light Blue to White SaaS Strip Matching Reference Image)
          ========================================================================= */}
      <section className="relative bg-gradient-to-r from-[#F7FBFF] via-[#F0F7FF] to-[#EAF4FF] border-t border-b border-blue-100 overflow-hidden font-sans">
        
        {/* Subtle Ambient Glow On Left */}
        <div className="absolute -left-16 -top-16 w-80 h-80 rounded-full bg-blue-200/35 blur-3xl pointer-events-none" />
        <div className="absolute left-10 -bottom-16 w-72 h-72 rounded-full bg-indigo-200/20 blur-3xl pointer-events-none" />

        {/* Right-Side Visual Background: Google Pin, Dot-matrix, 3D Bars & Arrow */}
        <CtaBackgroundIllustration />

        {/* Centered Max-Width Container (1500px) */}
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12 min-h-[230px] lg:min-h-[250px] flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 relative z-10">
          
          {/* Left Text & Credibility */}
          <div className="max-w-3xl text-center lg:text-left">
            {/* Blue Rounded Credibility Badge with Green Status Dot */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#155EEF] text-white text-xs sm:text-[13px] font-black tracking-wider uppercase mb-3 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#08C568] animate-pulse shrink-0" />
              <span>DELHI NCR&apos;S #1 SEARCH ENGINEERING FIRM</span>
            </div>

            {/* Bold Hero Heading Matching Exact Reference Layout */}
            <h2 className="text-2xl sm:text-3xl lg:text-[38px] xl:text-[40px] font-black text-[#101D3A] tracking-tight leading-[1.18]">
              <span className="block">Ready to dominate</span>
              <span className="text-[#155EEF]">Google Maps 3-Pack &amp; 10x</span> your inquiries?
            </h2>

            {/* Supporting Description */}
            <p className="mt-2.5 text-xs sm:text-sm lg:text-[15px] text-[#475467] font-medium leading-relaxed max-w-2xl">
              Meet your dedicated strategists face-to-face in Orbit Plaza, Crossings Republik, or request a customized competitor audit today.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 sm:gap-3.5 shrink-0 z-20">
            {/* 1. Call Button */}
            <a
              href="tel:+919319807273"
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#101D3A] text-xs sm:text-[13.5px] font-bold border border-slate-200/90 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
            >
              <PhoneIconBlue className="w-4 h-4 text-[#155EEF] shrink-0" />
              <span>Call +91 93198 07273</span>
            </a>

            {/* 2. WhatsApp Button */}
            <a
              href="https://wa.me/919319807273?text=Hi%20Digital%20FX%20team,%20I%20want%20to%20discuss%20a%20growth%20strategy."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#08C568] hover:bg-[#07B05D] text-white text-xs sm:text-[13.5px] font-bold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
              <span>WhatsApp Strategy Desk</span>
            </a>

            {/* 3. Get Free Proposal Button */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#155EEF] hover:bg-[#1250cf] text-white text-xs sm:text-[13.5px] font-bold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Get Free Proposal →</span>
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. DEEP NAVY INSTITUTIONAL FOOTER (5-Column Layout Matching Reference Image)
          ========================================================================= */}
      <footer className="bg-gradient-to-b from-[#07172D] to-[#0A1932] text-[#F8FAFC] pt-16 pb-10 border-t border-slate-800/80 font-sans">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10">
          
          {/* 5-Column Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10 pb-14 border-b border-white/10">
            
            {/* COLUMN 1: Original Brand Logo (Enlarged), Description, Trust Badges, Address (3 Cols) */}
            <div className="lg:col-span-3 xl:col-span-3 space-y-5">
              
              {/* Original Digital FX Logo - Significantly Bigger & Crisp as requested */}
              <div className="flex items-center">
                <Link href="/" className="inline-block group" aria-label="Digital FX Home">
                  <img
                    src="/logo-white.svg"
                    alt="Digital FX - Business Solution"
                    width={260}
                    height={68}
                    loading="lazy"
                    decoding="async"
                    style={{ height: "62px", width: "auto" }}
                    className="h-13 sm:h-15 lg:h-[62px] w-auto max-w-[280px] object-contain shrink-0 transition-transform group-hover:scale-[1.02]"
                  />
                </Link>
              </div>

              {/* Company Description */}
              <p className="text-[14px] text-[#B8C5D9] leading-[1.6] font-normal">
                We are the leading digital advertising &amp; search engineering company that turns bold ideas into measurable revenue. Dominating Google Maps 3-Pack, Generative AI Search (GEO), and performance marketing across India and global markets.
              </p>

              {/* Compact Rounded Horizontal Rating / Credibility Badges */}
              <div className="space-y-2.5 pt-1">
                {/* 1. Google 4.9/5.0 Badge */}
                <div className="flex items-center gap-2.5 bg-[#0D223F]/90 border border-[#1E3A5F] px-4 py-2 rounded-xl shadow-2xs max-w-full">
                  <GoogleGIcon className="w-5 h-5 shrink-0" />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-amber-400 text-xs tracking-wider">★★★★★</span>
                    <span className="text-[12px] font-bold text-[#F8FAFC]">4.9/5.0 (128+ Reviews)</span>
                  </div>
                </div>

                {/* 2. Amazing Workplaces Certified India */}
                <div className="flex items-center gap-2.5 bg-[#171c26]/90 border border-amber-500/40 px-4 py-2 rounded-xl text-amber-400 text-xs font-black tracking-wider uppercase shadow-2xs max-w-full">
                  <span className="text-sm">🏆</span>
                  <span>AMAZING WORKPLACES CERTIFIED INDIA</span>
                </div>

                {/* 3. Glassdoor 4.5 Badge */}
                <div className="flex items-center gap-2 bg-[#092b33]/80 border border-teal-500/30 px-4 py-2 rounded-xl text-xs shadow-2xs max-w-full">
                  <span className="font-extrabold text-[#08C568] tracking-wider uppercase">GLASSDOOR</span>
                  <span className="font-bold text-[#F8FAFC]">4.5</span>
                  <span className="text-amber-400 text-xs tracking-wider">★★★★★</span>
                </div>
              </div>

              {/* Office Address & Phone with Pink/Magenta Icons matching Reference */}
              <div className="pt-2 space-y-2.5 text-xs text-[#B8C5D9]">
                <div className="flex items-start gap-2.5">
                  <LocationPinPink className="w-4 h-4 text-[#F43F5E] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">Shop No. 210, 2nd Floor, Orbit Plaza, Crossings Republik, Ghaziabad, UP 201016</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <PhoneIconPink className="w-4 h-4 text-[#F43F5E] shrink-0" />
                  <a href="tel:+919319807273" className="text-[#F8FAFC] hover:text-[#238BFF] transition-colors font-bold">+91 93198 07273</a>
                </div>
              </div>

            </div>

            {/* COLUMN 2: Quick Links & Tools (2 Cols) */}
            <div className="lg:col-span-2 xl:col-span-2">
              <h3 className="text-[17px] font-bold text-[#F8FAFC]">
                Quick Links &amp; Tools
              </h3>
              <div className="w-8 h-[2.5px] bg-[#155EEF] rounded-full mt-2 mb-4" />
              
              <ul className="space-y-2.5 text-[14px] text-[#B8C5D9] font-medium">
                <li>
                  <Link href="/" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>SEO &amp; Growth Services</span>
                  </Link>
                </li>
                <li>
                  <Link href="/case-studies" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>The Digital FX Portfolio</span>
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>Digital Marketing Packages</span>
                  </Link>
                </li>
                <li>
                  <Link href="/reviewflow" className="group flex items-center gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0" />
                    <span>ReviewFlow AI (Smart QR)</span>
                    <span className="bg-[#155EEF] text-white text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase leading-none shrink-0">
                      NEW
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/tools" className="group flex items-center gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue className="w-3 h-3 text-[#155EEF] shrink-0" />
                    <span className="text-[#08C568]">Free AI Search &amp; GEO Tool</span>
                    <span className="bg-[#08C568] text-white text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase leading-none shrink-0">
                      FREE
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>Careers (We Are Hiring!)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>Contact &amp; Strategy Desk</span>
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>Blog &amp; SEO Insights</span>
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-conditions" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>Terms &amp; Conditions</span>
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>Refund Policy</span>
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap.xml" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>XML Sitemap</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* COLUMN 3: Solutions & Services (2 Cols) */}
            <div className="lg:col-span-2 xl:col-span-2">
              <h3 className="text-[17px] font-bold text-[#F8FAFC]">
                Solutions &amp; Services
              </h3>
              <div className="w-8 h-[2.5px] bg-[#155EEF] rounded-full mt-2 mb-4" />

              <ul className="space-y-2.5 text-[14px] text-[#B8C5D9] font-medium">
                <li>
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>Google Maps 3–Pack &amp; Local SEO</span>
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>Generative AI Search &amp; GEO</span>
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>Website &amp; App Development</span>
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>Pay Per Click (PPC / Google Ads)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>CTV &amp; Programmatic Advertising</span>
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>Rich Media Innovation</span>
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>Media Planning &amp; Buying</span>
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>Content Marketing</span>
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>Social Media Marketing</span>
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>Reputation Management (ORM)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>Influencer Marketing</span>
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>Email Marketing (₹4,999)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="group flex items-start gap-2 hover:text-[#F8FAFC] transition-colors">
                    <ChevronBlue />
                    <span>WhatsApp Lead Automation</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* COLUMN 4: Industries We Scale (2 Cols) */}
            <div className="lg:col-span-2 xl:col-span-2">
              <h3 className="text-[17px] font-bold text-[#F8FAFC]">
                Industries We Scale
              </h3>
              <div className="w-8 h-[2.5px] bg-[#155EEF] rounded-full mt-2 mb-4" />

              <ul className="space-y-2.5 text-[14px] text-[#B8C5D9] font-medium">
                <li className="group flex items-start gap-2">
                  <ChevronBlue />
                  <span className="hover:text-[#F8FAFC] transition-colors cursor-default">Hospitals &amp; Healthcare</span>
                </li>
                <li className="group flex items-start gap-2">
                  <ChevronBlue />
                  <span className="hover:text-[#F8FAFC] transition-colors cursor-default">Automobile &amp; Detailing</span>
                </li>
                <li className="group flex items-start gap-2">
                  <ChevronBlue />
                  <span className="hover:text-[#F8FAFC] transition-colors cursor-default">Real Estate &amp; Builders</span>
                </li>
                <li className="group flex items-start gap-2">
                  <ChevronBlue />
                  <span className="hover:text-[#F8FAFC] transition-colors cursor-default">Travel &amp; Hospitality</span>
                </li>
                <li className="group flex items-start gap-2">
                  <ChevronBlue />
                  <span className="hover:text-[#F8FAFC] transition-colors cursor-default">FMCG &amp; FMCD Brands</span>
                </li>
                <li className="group flex items-start gap-2">
                  <ChevronBlue />
                  <span className="hover:text-[#F8FAFC] transition-colors cursor-default">Education &amp; Institutes</span>
                </li>
                <li className="group flex items-start gap-2">
                  <ChevronBlue />
                  <span className="hover:text-[#F8FAFC] transition-colors cursor-default">E-Commerce &amp; D2C</span>
                </li>
                <li className="group flex items-start gap-2">
                  <ChevronBlue />
                  <span className="hover:text-[#F8FAFC] transition-colors cursor-default">Security &amp; Legal Services</span>
                </li>
                <li className="group flex items-start gap-2">
                  <ChevronBlue />
                  <span className="hover:text-[#F8FAFC] transition-colors cursor-default">Information Technology</span>
                </li>
                <li className="group flex items-start gap-2">
                  <ChevronBlue />
                  <span className="hover:text-[#F8FAFC] transition-colors cursor-default">Banking &amp; Financial Services</span>
                </li>
              </ul>
            </div>

            {/* COLUMN 5: Follow Digital FX & Newsletter Card (3 Cols) */}
            <div className="lg:col-span-3 xl:col-span-3">
              <h3 className="text-[17px] font-bold text-[#F8FAFC]">
                Follow Digital FX
              </h3>
              <div className="w-8 h-[2.5px] bg-[#155EEF] rounded-full mt-2 mb-4" />

              {/* Official Social Brand Icons Row - Facebook, X, LinkedIn, Instagram, YouTube */}
              <div className="flex items-center gap-3">
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
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
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
              <div className="mt-6 p-5 rounded-2xl bg-[#0B1E38]/90 border border-[#1E3A5F] shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="text-[15px] font-bold text-[#F8FAFC]">
                    Get Marketing Insights
                  </h4>
                  <PaperPlaneIcon />
                </div>
                <p className="text-xs text-[#B8C5D9] mt-1 mb-4 leading-relaxed font-normal">
                  Tips, updates and growth strategies directly in your inbox.
                </p>

                {newsletterSuccess ? (
                  <div className="py-2.5 px-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
                    <span>✓</span> Subscribed! Thank you for joining.
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">✉</span>
                      <input
                        type="email"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full h-10 rounded-xl bg-[#07172D]/90 border border-[#1E3A5F] pl-8 pr-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#155EEF] transition"
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
              3. BOTTOM COPYRIGHT & LEGAL BAR
              ======================================================================= */}
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-[#8F9EAF] gap-4 font-normal">
            <div className="text-center md:text-left">
              © {new Date().getFullYear()} Digital FX®. All rights reserved. Registered Office: Shop No. 210, Orbit Plaza, Crossings Republik, Ghaziabad.
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <Link href="/blog" className="hover:text-white transition-colors">
                Blog
              </Link>
              <Link href="/reviewflow" className="hover:text-white transition-colors">
                ReviewFlow AI
              </Link>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/refund-policy" className="hover:text-white transition-colors">
                Refund Policy
              </Link>
              <Link href="/admin" className="hover:text-slate-200 transition-colors text-slate-400">
                Admin Panel
              </Link>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}
