"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface NavbarProps {
  currentPath?: string;
  onOpenProposal?: () => void;
  onOpenCheckout?: () => void;
}

export default function Navbar({
  currentPath = "/",
  onOpenProposal,
  onOpenCheckout,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile drawer on Escape key & disable body scroll
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setServicesDropdownOpen(false);
      }
    }
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setServicesDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(false);
    }, 200);
  };

  const closeMobileMenu = () => setMobileOpen(false);

  const FEATURED_SERVICES = [
    {
      title: "Google Maps 3-Pack & Local SEO",
      desc: "Rank #1 across Ghaziabad & Delhi NCR with verified citations & review automation.",
      href: "/services",
      icon: "📍",
      badge: "High Intent",
    },
    {
      title: "Performance Google & Meta Ads",
      desc: "High-ROAS search, shopping, and Instagram campaigns with surgical lead tracking.",
      href: "/services",
      icon: "🚀",
      badge: "Paid Media",
    },
    {
      title: "High-Speed Next.js Web Development",
      desc: "Sub-second load times, mobile conversion CRO, and certified Core Web Vitals.",
      href: "/services",
      icon: "⚡",
      badge: "Tech & CRO",
    },
    {
      title: "Generative AI Search & GEO",
      desc: "Structured schema & knowledge graphs for recommendations in ChatGPT & Gemini.",
      href: "/services",
      icon: "🧠",
      badge: "AI Optimization",
    },
    {
      title: "WhatsApp Funnels & CRM Automation",
      desc: "Automated 1-click WhatsApp customer routing, lead qualification, and bookings.",
      href: "/services",
      icon: "💬",
      badge: "Automation",
    },
    {
      title: "Attributable Revenue Analytics",
      desc: "Closed-loop pipeline reporting connecting marketing spend to real client revenue.",
      href: "/services",
      icon: "📊",
      badge: "ROI Reporting",
    },
  ];

  return (
    <>
      {/* 1. TOP ACCREDITATION & DESK BAR */}
      <div id="fxtopbar" className="bg-[#080d24] text-white py-2 border-b border-white/10 block w-full overflow-hidden">
        <div className="mx-auto flex h-auto min-h-[34px] max-w-[1680px] w-full flex-wrap items-center justify-between gap-y-2 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 text-xs">
          
          {/* Left: Certifications & Regional Presence */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-slate-300 text-[11px] sm:text-[11.5px] font-medium">
            <span className="inline-flex items-center gap-1.5 text-slate-300 font-semibold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Google Premier Partner Certified
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-300">
              Meta Certified Agency
            </span>
            <span className="hidden lg:inline text-slate-600">•</span>
            <span className="hidden lg:inline-flex items-center gap-1.5 text-slate-400">
              Crossings Republik, Ghaziabad &amp; Delhi NCR
            </span>
          </div>

          {/* Right: Checkout Portal & Contacts */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-4 text-[11px] sm:text-[12px] font-medium text-slate-300 w-full sm:w-auto">
            {onOpenCheckout ? (
              <button
                type="button"
                onClick={onOpenCheckout}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white text-[10.5px] sm:text-[11.5px] font-bold transition-all cursor-pointer shadow-xs hover:border-blue-400/50 shrink-0"
                title="Client Checkout & Packages"
              >
                <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Client Checkout Portal</span>
              </button>
            ) : (
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white text-[10.5px] sm:text-[11.5px] font-bold transition-all cursor-pointer shadow-xs hover:border-blue-400/50 shrink-0"
              >
                <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Client Checkout Portal</span>
              </Link>
            )}

            <a href="tel:+919319807273" className="hidden sm:inline-flex items-center gap-1.5 text-[12px] hover:text-white font-bold transition">
              <span className="text-[#207de9]">☎</span> +91 93198 07273
            </a>

            <a
              href="https://wa.me/919319807273?text=Hi%20Digital%20FX%20team,%20I%20want%20to%20discuss%20a%20growth%20strategy."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] font-bold text-emerald-400 hover:text-emerald-300 transition shrink-0"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block shrink-0" />
              <span>WhatsApp Strategy Desk</span>
            </a>
          </div>

        </div>
      </div>

      {/* 2. STICKY MAIN HEADER WITH SERVICES DROPDOWN */}
      <header id="fxheader" className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs transition-all w-full">
        <div className="mx-auto flex h-[74px] max-w-[1680px] w-full items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          
          {/* Brand Logo - Official Digital FX Logo Always Linking Cleanly to "/" */}
          <Link href="/" className="flex items-center shrink-0 group min-w-0" aria-label="Digital FX Home">
            <img
              src="/logo.svg"
              alt="Digital FX - Business Solution"
              width={180}
              height={48}
              decoding="async"
              style={{ height: "48px", width: "auto" }}
              className="h-10 sm:h-12 w-auto object-contain shrink-0 transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center gap-5 xl:gap-7 mx-auto px-4 shrink-0">
            
            {/* Explicit Home Button */}
            <Link
              href="/"
              className={`text-[15.5px] xl:text-[16px] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentPath === "/"
                  ? "font-bold text-[#207de9] border-b-2 border-[#207de9] pb-0.5"
                  : "font-semibold text-slate-700 hover:text-[#207de9]"
              }`}
            >
              Home
            </Link>

            {/* Services with Interactive Top Dropdown Menu */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className={`text-[15.5px] xl:text-[16px] transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1.5 ${
                  currentPath.startsWith("/services")
                    ? "font-bold text-[#207de9] border-b-2 border-[#207de9] pb-0.5"
                    : "font-semibold text-slate-700 hover:text-[#207de9]"
                }`}
                aria-expanded={servicesDropdownOpen}
              >
                <span>Services</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    servicesDropdownOpen ? "rotate-180 text-[#207de9]" : "text-slate-400"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* SERVICES DROPDOWN PANEL (Opens Smoothly at Top) */}
              {servicesDropdownOpen && (
                <div
                  style={{ width: "680px", maxWidth: "90vw" }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-3 bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-5 z-[70] animate-fadeIn transition-all text-left"
                >
                  
                  {/* Dropdown Header */}
                  <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-100 px-1">
                    <div>
                      <div className="text-xs font-black uppercase tracking-wider text-[#207de9]">
                        Core Growth Capabilities
                      </div>
                      <div className="text-[13px] font-bold text-slate-900 mt-0.5">
                        Performance Marketing &amp; Search Engineering
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#1570ef] px-2.5 py-1 rounded-full border border-blue-200">
                      13 Divisions
                    </span>
                  </div>

                  {/* 2-Column Grid of Core Services */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {FEATURED_SERVICES.map((s, idx) => (
                      <Link
                        key={idx}
                        href={s.href}
                        onClick={() => setServicesDropdownOpen(false)}
                        className="group flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all"
                      >
                        <div className="w-9 h-9 rounded-xl bg-blue-50 group-hover:bg-[#207de9] group-hover:text-white flex items-center justify-center text-lg shrink-0 transition-colors">
                          {s.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-[#207de9] transition-colors leading-tight">
                              {s.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug font-normal">
                            {s.desc}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Dropdown Bottom Banner */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between px-2">
                    <span className="text-[11px] text-slate-500 font-medium">
                      All services backed by verifiable ROI dashboards.
                    </span>
                    <Link
                      href="/services"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#207de9] hover:text-[#1570ef] hover:underline"
                    >
                      <span>Explore All 13 Services</span>
                      <span>→</span>
                    </Link>
                  </div>

                </div>
              )}
            </div>

            {/* Portfolio */}
            <Link
              href="/case-studies"
              className={`text-[15.5px] xl:text-[16px] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentPath.startsWith("/case-studies")
                  ? "font-bold text-[#207de9] border-b-2 border-[#207de9] pb-0.5"
                  : "font-semibold text-slate-700 hover:text-[#207de9]"
              }`}
            >
              Portfolio
            </Link>

            {/* AI Tools */}
            <Link
              href="/tools"
              className={`text-[15.5px] xl:text-[16px] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                currentPath.startsWith("/tools")
                  ? "font-bold text-[#207de9] border-b-2 border-[#207de9] pb-0.5"
                  : "font-semibold text-slate-700 hover:text-[#207de9]"
              }`}
            >
              <span className="whitespace-nowrap">AI Tools</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider leading-none shrink-0">
                FREE
              </span>
            </Link>

            {/* ReviewFlow AI */}
            <Link
              href="/reviewflow"
              className={`text-[15.5px] xl:text-[16px] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                currentPath.startsWith("/reviewflow") || currentPath.startsWith("/r/")
                  ? "font-bold text-[#207de9] border-b-2 border-[#207de9] pb-0.5"
                  : "font-semibold text-slate-700 hover:text-[#207de9]"
              }`}
            >
              <span className="whitespace-nowrap">ReviewFlow AI</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#207de9] border border-blue-200 text-[10px] font-extrabold uppercase tracking-wider leading-none shrink-0">
                NEW
              </span>
            </Link>

            {/* Insights */}
            <Link
              href="/blog"
              className={`hidden 2xl:inline-flex text-[15.5px] xl:text-[16px] transition-colors whitespace-nowrap shrink-0 ${
                currentPath.startsWith("/blog")
                  ? "font-bold text-[#207de9] border-b-2 border-[#207de9] pb-0.5"
                  : "font-semibold text-slate-700 hover:text-[#207de9]"
              }`}
            >
              Insights
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              className={`text-[15.5px] xl:text-[16px] transition-colors whitespace-nowrap shrink-0 ${
                currentPath.startsWith("/contact")
                  ? "font-bold text-[#207de9] border-b-2 border-[#207de9] pb-0.5"
                  : "font-semibold text-slate-700 hover:text-[#207de9]"
              }`}
            >
              Contact
            </Link>

          </nav>

          {/* Right Action & Menu Trigger */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            {onOpenProposal ? (
              <button
                type="button"
                onClick={onOpenProposal}
                className="hidden sm:inline-flex h-[42px] items-center gap-2 rounded-xl bg-[#207de9] hover:bg-[#1a6bc7] px-5 text-[13px] font-bold text-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer shrink-0 whitespace-nowrap tracking-wide"
              >
                <span>Get Free Proposal</span>
                <span className="text-sm font-bold">→</span>
              </button>
            ) : (
              <Link
                href="/contact"
                className="hidden sm:inline-flex h-[42px] items-center gap-2 rounded-xl bg-[#207de9] hover:bg-[#1a6bc7] px-5 text-[13px] font-bold text-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer shrink-0 whitespace-nowrap tracking-wide"
              >
                <span>Get Free Proposal</span>
                <span className="text-sm font-bold">→</span>
              </Link>
            )}

            {/* Mobile Quick-Call Tap Button */}
            <a
              href="tel:+919319807273"
              aria-label="Call +91 93198 07273"
              className="sm:hidden flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
              title="Call +91 93198 07273"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>

            {/* 3-LINE MENU BUTTON (Opens Complete Navigation Drawer on Any Screen) */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open Navigation Menu"
              className="flex h-[42px] min-w-[42px] items-center justify-center gap-2 px-3 sm:px-4 rounded-xl border border-slate-300 bg-slate-50 hover:bg-white hover:border-[#207de9] shadow-xs transition-all cursor-pointer group shrink-0"
            >
              <span className="flex flex-col gap-[4.5px] items-center justify-center">
                <span className="h-[2.5px] w-5 bg-[#080d24] group-hover:bg-[#207de9] rounded-full transition-colors" />
                <span className="h-[2.5px] w-5 bg-[#080d24] group-hover:bg-[#207de9] rounded-full transition-colors" />
                <span className="h-[2.5px] w-3.5 bg-[#207de9] rounded-full ml-auto" />
              </span>
              <span className="text-[13px] font-bold text-[#080d24] group-hover:text-[#207de9] transition-colors tracking-tight hidden xs:inline">
                Menu
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* 3. UNIVERSAL RIGHT SLIDE-OVER NAVIGATION DRAWER */}
      {mobileOpen && (
        <>
          <button
            type="button"
            onClick={closeMobileMenu}
            className="fixed inset-0 z-[150] bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fadeIn cursor-pointer"
            aria-label="Close menu backdrop"
          />
          <aside className="fixed right-0 top-0 z-[160] h-full w-[92%] max-w-[420px] border-l border-slate-200 bg-white shadow-2xl flex flex-col justify-between p-6 sm:p-7 overflow-y-auto animate-slideInRight">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex items-center">
                  <img src="/logo.svg" alt="Digital FX" width={168} height={44} decoding="async" style={{ height: "44px", width: "auto" }} className="h-11 w-auto object-contain shrink-0" />
                </div>
                <button
                  type="button"
                  onClick={closeMobileMenu}
                  aria-label="Close menu"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-400 text-lg font-bold transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Section Title */}
              <div className="mt-5 mb-2 px-1 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Navigation Directory</span>
                <span>Directory &amp; All Pages</span>
              </div>

              {/* Primary Navigation Links */}
              <nav className="space-y-1">
                {/* Home */}
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-blue-50 text-slate-500 group-hover:text-[#207de9] transition">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#080d24] group-hover:text-[#207de9] transition">
                        Home
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Agency overview &amp; revenue metrics
                      </div>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-[#207de9] group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                </Link>

                {/* Services */}
                <Link
                  href="/services"
                  onClick={closeMobileMenu}
                  className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-blue-50 text-slate-500 group-hover:text-[#207de9] transition">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#080d24] group-hover:text-[#207de9] transition">
                        SEO &amp; Growth Services
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        SEO, CTV, Paid Media &amp; Full-Funnel Growth
                      </div>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-[#207de9] group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                </Link>

                {/* Portfolio & Case Studies */}
                <Link
                  href="/case-studies"
                  onClick={closeMobileMenu}
                  className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-blue-50 text-slate-500 group-hover:text-[#207de9] transition">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#080d24] group-hover:text-[#207de9] transition">
                        The Digital FX Portfolio
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        ₹6 Lakh+ documented client revenue &amp; case studies
                      </div>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-[#207de9] group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                </Link>

                {/* Packages & Pricing */}
                <Link
                  href="/pricing"
                  onClick={closeMobileMenu}
                  className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-blue-50/60 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#207de9] transition">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#080d24] group-hover:text-[#207de9] transition">
                        Packages &amp; Retainers
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Transparent pricing from ₹24,999/month
                      </div>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-[#207de9] group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                </Link>

                {/* ReviewFlow AI - Smart Google Review QR */}
                <Link
                  href="/reviewflow"
                  onClick={closeMobileMenu}
                  className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-blue-50/60 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#207de9] transition">
                      <span className="text-sm">⭐</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#080d24] group-hover:text-[#207de9] transition flex items-center gap-1.5">
                        <span>ReviewFlow AI</span>
                        <span className="text-[9px] font-black uppercase tracking-wider bg-blue-100 text-[#207de9] px-1.5 py-0.5 rounded">NEW</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Smart QR Codes for Authentic Google Reviews
                      </div>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-[#207de9] group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                </Link>

                {/* Free Website & SEO Speed Audit */}
                <Link
                  href="/tools"
                  onClick={closeMobileMenu}
                  className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-emerald-50/60 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#080d24] group-hover:text-emerald-700 transition">
                        Free Website &amp; SEO Speed Audit
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Instant 60s Core Web Vitals &amp; speed scan
                      </div>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                </Link>

                {/* Contact & Consultation Desk */}
                <Link
                  href="/contact"
                  onClick={closeMobileMenu}
                  className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-cyan-50/60 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 transition">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#080d24] group-hover:text-cyan-700 transition">
                        Contact &amp; Strategy Desk
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Orbit Plaza Office &amp; Free Growth Proposal
                      </div>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                </Link>

                {/* Frequently Asked Questions (FAQ) */}
                <Link
                  href="/#faq"
                  onClick={closeMobileMenu}
                  className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-emerald-50/60 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition">
                      <span className="text-xs font-black">?</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#080d24] group-hover:text-emerald-700 transition">
                        Ghaziabad SEO &amp; FAQs
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Ratings, Maps ranking &amp; timeline
                      </div>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                </Link>

                {/* Pan-India 350+ Cities Directory */}
                <Link
                  href="/locations"
                  onClick={closeMobileMenu}
                  className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-blue-50 text-slate-500 group-hover:text-[#207de9] transition">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#080d24] group-hover:text-[#207de9] flex items-center gap-2 transition">
                        <span>Pan-India 350+ Cities</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[9px] font-black uppercase">
                          28 STATES
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Local SEO directory &amp; city blueprints
                      </div>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-[#207de9] group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                </Link>

                {/* Global Markets & Dubai */}
                <Link
                  href="/global-markets"
                  onClick={closeMobileMenu}
                  className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-blue-50 text-slate-500 group-hover:text-[#207de9] transition">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a8.997 8.997 0 01-7.843-4.582M12 3a8.997 8.997 0 017.843 4.582M12 3v18" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#080d24] group-hover:text-[#207de9] flex items-center gap-2 transition">
                        <span>Global Hubs &amp; Dubai</span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[9px] font-black uppercase">
                          10 COUNTRIES
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Dubai AE, USA, UK, KSA • 1,098+ keywords
                      </div>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-[#207de9] group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                </Link>

                {/* Insights Blog */}
                <Link
                  href="/blog"
                  onClick={closeMobileMenu}
                  className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-blue-50 text-slate-500 group-hover:text-[#207de9] transition">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#080d24] group-hover:text-[#207de9] transition">
                        Insights &amp; Blueprints Blog
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Google 3–Pack, Next.js 16 &amp; AI Search
                      </div>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-[#207de9] group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                </Link>

                {/* Direct Google Maps Profile Link */}
                <a
                  href="https://share.google/EIVnaRy9WhkPCi8U8"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenu}
                  className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-blue-50/60 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#207de9] transition">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#080d24] group-hover:text-[#207de9] transition">
                        Official Google Maps Profile
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Orbit Plaza, Ghaziabad • Live GPS Directions
                      </div>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-[#207de9] group-hover:translate-x-0.5 transition text-xs font-bold">↗</span>
                </a>
              </nav>

              {/* Agency Office & Regional Desk */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Regional Strategy Desk
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-[#080d24]">Ghaziabad &amp; Delhi NCR</div>
                    <div className="text-[11px] text-slate-500">Mon – Sat • 9:30 AM to 7:30 PM</div>
                  </div>
                  <a
                    href="tel:+919319807273"
                    className="text-xs font-bold text-[#207de9] hover:underline whitespace-nowrap"
                  >
                    +91 93198 07273
                  </a>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Action */}
            <div className="pt-5 border-t border-slate-100">
              <a
                href="https://wa.me/919319807273?text=Hi%20Digital%20FX%20team,%20I%20want%20to%20discuss%20a%20growth%20strategy."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#080d24] hover:bg-[#1570ef] py-3 text-center text-xs font-black text-white shadow-xs transition cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Chat with Senior Strategist (WhatsApp)</span>
                <span>→</span>
              </a>
              <p className="mt-2 text-center text-[10px] text-slate-400 font-medium">
                © {new Date().getFullYear()} Digital FX®. All rights reserved.
              </p>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
