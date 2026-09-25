"use client";

import { useState, useEffect, useRef, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoCheckerTool from "@/components/SeoCheckerTool";
import PageSpeedAuditReport from "@/components/PageSpeedAuditReport";
import type { PageSpeedAuditData } from "@/app/api/pagespeed/route";

function ToolsContent() {
  const searchParams = useSearchParams();
  const initialToolParam = searchParams.get("tool");
  
  // Default to 'seo' so user immediately sees the requested SEO Checker experience
  const [activeTool, setActiveTool] = useState<"seo" | "pagespeed" | "overview">(
    initialToolParam === "pagespeed" ? "pagespeed" : "seo"
  );

  // Sync with searchParams if query string changes
  useEffect(() => {
    const t = searchParams.get("tool");
    if (t === "pagespeed") {
      setActiveTool("pagespeed");
    } else if (t === "seo") {
      setActiveTool("seo");
    } else if (t === "overview") {
      setActiveTool("overview");
    }
  }, [searchParams]);

  // PageSpeed Audit State (100% preserved)
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [pageSpeedData, setPageSpeedData] = useState<PageSpeedAuditData | null>(null);
  const [pageSpeedLoading, setPageSpeedLoading] = useState(false);
  const [pageSpeedStrategy, setPageSpeedStrategy] = useState<"mobile" | "desktop">("mobile");
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditStageText, setAuditStageText] = useState("");
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAuditProgress = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setAuditProgress(1);
    setAuditStageText("Initializing multi-factor browser emulation...");

    progressIntervalRef.current = setInterval(() => {
      setAuditProgress((prev) => {
        if (prev < 25) {
          setAuditStageText("Resolving DNS & SSL handshake...");
          return prev + 3;
        } else if (prev < 50) {
          setAuditStageText("Emulating mobile viewport & rendering DOM paint...");
          return prev + 2;
        } else if (prev < 78) {
          setAuditStageText("Benchmarking Core Web Vitals: LCP, FCP, TBT & CLS...");
          return prev + 2;
        } else if (prev < 96) {
          setAuditStageText("Synthesizing speed diagnostics & technical recommendations...");
          return prev + 1;
        } else {
          setAuditStageText("Finalizing telemetry metrics & snapshot...");
          return 98;
        }
      });
    }, 380);
  };

  const finishAuditProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setAuditProgress(100);
    setAuditStageText("Telemetry audit complete! Rendering report...");
  };

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  async function handlePageSpeedStrategyChange(newStrategy: "mobile" | "desktop") {
    setPageSpeedStrategy(newStrategy);
    const site = website.trim();
    if (!site) return;
    setPageSpeedLoading(true);
    startAuditProgress();
    try {
      const res = await fetch(
        `/api/pagespeed?url=${encodeURIComponent(site)}&strategy=${newStrategy}`
      );
      const json = await res.json();
      if (json.success && json.data) {
        finishAuditProgress();
        setTimeout(() => {
          setPageSpeedData(json.data);
          setPageSpeedLoading(false);
        }, 350);
      } else {
        finishAuditProgress();
        setPageSpeedLoading(false);
      }
    } catch (e) {
      console.error("Strategy change failed", e);
      finishAuditProgress();
      setPageSpeedLoading(false);
    }
  }

  async function triggerAudit(siteInput?: string) {
    const site = (siteInput || website).trim();
    if (!site) return;
    setWebsite(site);
    setError("");
    setPageSpeedLoading(true);
    setPageSpeedData(null);
    startAuditProgress();

    try {
      const res = await fetch(`/api/pagespeed?url=${encodeURIComponent(site)}&strategy=${pageSpeedStrategy}`);
      const json = await res.json();
      if (json.success && json.data) {
        finishAuditProgress();
        setTimeout(() => {
          setPageSpeedData(json.data);
          setPageSpeedLoading(false);
        }, 350);
      } else {
        throw new Error(json.error || "Unable to complete telemetry scan.");
      }
    } catch (err: any) {
      finishAuditProgress();
      setPageSpeedLoading(false);
      setError(err.message || "Audit failed. Please verify your domain.");
    }
  }

  async function handleAudit(e: FormEvent) {
    e.preventDefault();
    triggerAudit(website);
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-[#207de9] selection:text-white">
      
      {/* Universal Navbar */}
      <Navbar currentPath="/tools" />

      {/* Persistent AI Tools Suite Navigation Bar */}
      <div className="border-b border-slate-200 bg-[#F8FAFC]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Left: Suite Identity */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Digital FX AI Tools Ecosystem
              </span>
            </div>

            {/* Right: Quick Switcher Tabs */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTool("seo")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  activeTool === "seo"
                    ? "bg-[#2563EB] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <span>🔍</span>
                <span>SEO Checker</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                  activeTool === "seo" ? "bg-white/20 text-white" : "bg-blue-50 text-[#2563EB]"
                }`}>
                  New
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTool("pagespeed")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  activeTool === "pagespeed"
                    ? "bg-[#080d24] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <span>⚡</span>
                <span>PageSpeed &amp; Web Vitals</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTool("overview")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  activeTool === "overview"
                    ? "bg-slate-800 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <span>🎛️</span>
                <span>All Tools</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================
          VIEW 1: SEO CHECKER (Native Reference Experience)
         ======================================================== */}
      {activeTool === "seo" && (
        <SeoCheckerTool onBackToTools={() => setActiveTool("overview")} />
      )}

      {/* ========================================================
          VIEW 2: SUITE OVERVIEW (All AI Tool Cards Grid)
         ======================================================== */}
      {activeTool === "overview" && (
        <section className="py-16 sm:py-24 bg-gradient-to-b from-[#f8faff] via-white to-white">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-6 text-center">
            
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1570ef] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse" />
              Digital FX AI Tools Suite
            </span>

            <h1 className="text-[34px] sm:text-[48px] lg:text-[52px] font-extrabold text-[#080d24] tracking-[-0.035em] leading-[1.1]">
              Explore Our Free AI &amp;{" "}
              <span className="text-[#2563EB] font-normal italic font-serif">
                Search Engineering Suite.
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
              Select an AI tool below to diagnose on-page SEO, benchmark live Core Web Vitals, evaluate Google Maps 3-Pack visibility, or automate customer reviews.
            </p>

            {/* AI Tools Cards Grid */}
            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              
              {/* Card 1: SEO Checker (Required New Tool) */}
              <div
                onClick={() => setActiveTool("seo")}
                className="group relative rounded-3xl border-2 border-[#2563EB]/40 hover:border-[#2563EB] bg-gradient-to-b from-blue-50/40 via-white to-white p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] text-xl group-hover:scale-110 transition-transform">
                      🔍
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#2563EB] text-white text-[11px] font-bold uppercase tracking-wider">
                      NEW • POPULAR
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#2563EB] transition">
                    SEO Checker
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    Analyze your website SEO and discover actionable opportunities to improve search visibility.
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>✓ Site Health</span>
                    <span>•</span>
                    <span>✓ On-Page Tags</span>
                    <span>•</span>
                    <span>✓ Core Vitals</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2563EB] group-hover:translate-x-1 transition-transform">
                    <span>Check SEO →</span>
                  </span>
                </div>
              </div>

              {/* Card 2: PageSpeed & Web Vitals Audit */}
              <div
                onClick={() => setActiveTool("pagespeed")}
                className="group relative rounded-3xl border border-slate-200 hover:border-slate-400 bg-white p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 text-xl group-hover:scale-110 transition-transform">
                      ⚡
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider border border-slate-200">
                      LIVE TELEMETRY
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#1570ef] transition">
                    PageSpeed &amp; Web Vitals
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    Audit real-time Core Web Vitals (FCP, LCP, TBT, CLS), mobile viewport responsiveness, and live DOM rendering performance.
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>✓ Mobile Viewport</span>
                    <span>•</span>
                    <span>✓ LCP/CLS</span>
                    <span>•</span>
                    <span>✓ DOM Benchmarks</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-800 group-hover:text-[#1570ef] group-hover:translate-x-1 transition-transform">
                    <span>Run Speed Audit →</span>
                  </span>
                </div>
              </div>

              {/* Card 3: ReviewFlow AI Engine */}
              <Link
                href="/reviewflow"
                className="group relative rounded-3xl border border-slate-200 hover:border-[#10B981] bg-white p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-xl group-hover:scale-110 transition-transform">
                      ⭐
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider border border-emerald-200">
                      REPUTATION AI
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition">
                    ReviewFlow AI Engine
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    Smart QR review gating and automated multi-platform Google review generation for local establishments.
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>✓ QR Review Gating</span>
                    <span>•</span>
                    <span>✓ AI Prompts</span>
                    <span>•</span>
                    <span>✓ Google Maps Sync</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-800 group-hover:text-emerald-600 group-hover:translate-x-1 transition-transform">
                    <span>Explore ReviewFlow →</span>
                  </span>
                </div>
              </Link>

            </div>

          </div>
        </section>
      )}

      {/* ========================================================
          VIEW 3: PAGESPEED & WEB VITALS AUDIT (Preserved 100%)
         ======================================================== */}
      {activeTool === "pagespeed" && (
        <section className="py-16 sm:py-24 bg-gradient-to-b from-[#f8faff] via-white to-white border-b border-slate-200">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-6 text-center">
            
            <div className="mb-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTool("overview")}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#1570ef] transition cursor-pointer"
              >
                <span>←</span>
                <span>Back to All AI Tools</span>
              </button>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1570ef] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse" />
              Live Telemetry Audit
            </span>
            <h1 className="text-[34px] sm:text-[48px] lg:text-[54px] font-extrabold text-[#080d24] tracking-[-0.035em] leading-[1.1]">
              Analyze Your Real-Time Speed &amp;{" "}
              <span className="text-[#1570ef] block sm:inline font-normal italic font-serif">
                Core Web Vitals Performance.
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
              Scan your website in real-time to audit Core Web Vitals (FCP, LCP, TBT, CLS), mobile viewport responsiveness, and live DOM rendering performance.
            </p>

            {/* Search Console */}
            <div className="mx-auto mt-10 max-w-[780px]">
              <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm hover:border-slate-300 transition-all">
                <form onSubmit={handleAudit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
                  <div className="relative flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-1 focus-within:border-[#1570ef] focus-within:bg-white transition">
                    <span className="text-slate-400 text-xs font-bold mr-2 select-none">https://</span>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="yourbusiness.com"
                      required
                      className="flex-1 bg-transparent py-3 text-sm text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none"
                    />
                    {website && (
                      <button
                        type="button"
                        onClick={() => setWebsite("")}
                        className="text-slate-400 hover:text-slate-700 text-xs px-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={pageSpeedLoading}
                    className="px-8 py-3.5 rounded-xl bg-[#080d24] hover:bg-[#1570ef] text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap shadow-xs"
                  >
                    {pageSpeedLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Auditing Telemetry...</span>
                      </>
                    ) : (
                      <>
                        <span>⚡ Run Free Audit</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Sample Domain Chips */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 px-1 text-[11.5px] text-slate-500">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-medium text-slate-600">Sample Websites:</span>
                    {["thewoodcraftstudio.in", "smiledentalindirapuram.com", "bansaltaxncr.in"].map((sample) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => {
                          setWebsite(sample);
                          triggerAudit(sample);
                        }}
                        className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-[#1570ef] text-[11px] font-semibold transition cursor-pointer"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                    <span>✓ 100% Free</span>
                    <span>✓ No Signup Required</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Animated High-Tech Telemetry Progress State */}
            {pageSpeedLoading && (
              <div className="mx-auto mt-8 max-w-[760px] rounded-3xl border border-blue-200/90 bg-white p-6 sm:p-10 shadow-xl animate-fadeIn text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1570ef] shrink-0">
                      <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-ping" />
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1570ef]">
                          Deep Telemetry Emulation Active
                        </span>
                      </div>
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                        Auditing <span className="font-mono text-[#1570ef]">{website || "Target Website"}</span>
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1.5 self-start sm:self-auto bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-2xl">
                    <span className="text-3xl sm:text-4xl font-black text-[#1570ef] font-mono tabular-nums">
                      {auditProgress}%
                    </span>
                    <span className="text-xs text-slate-500 font-semibold uppercase">Done</span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
                    <span className="text-[#1570ef] font-bold">{auditStageText || "Initializing deep DOM benchmarks..."}</span>
                    <span className="text-slate-400 font-mono text-[11px]">Est. ~15-20s</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                    <div
                      className="h-full bg-gradient-to-r from-[#1570ef] via-[#207de9] to-[#00b894] transition-all duration-300 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(2, auditProgress))}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mx-auto mt-6 max-w-[780px] rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            {/* Verified PageSpeed & Core Web Vitals Audit Report */}
            {pageSpeedData && !pageSpeedLoading && (
              <div className="mx-auto mt-10 max-w-[1120px] animate-fadeIn text-left">
                <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-8 shadow-xl">
                  <PageSpeedAuditReport
                    data={pageSpeedData}
                    isLoading={pageSpeedLoading}
                    onStrategyChange={handlePageSpeedStrategyChange}
                    onRequestProposal={() => window.location.href = `/contact?audit=${encodeURIComponent(website)}`}
                  />
                </div>
              </div>
            )}

            {/* Pre-Audit Showcase Illustration */}
            {!pageSpeedData && !pageSpeedLoading && (
              <div className="mx-auto mt-12 max-w-[1080px] rounded-3xl bg-white border border-slate-200 p-6 sm:p-9 text-left">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#1570ef]">How It Works</span>
                    <h3 className="text-2xl font-extrabold text-[#080d24]">Proprietary Speed &amp; Search Signal Audit</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      Enter any business website to analyze your technical Core Web Vitals, mobile viewport responsiveness, DOM performance, and discover missed local search ranking opportunities.
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <strong>Core Web Vitals Telemetry</strong>
                        <p className="text-slate-500 text-[11px] mt-0.5">LCP, FID/INP, and CLS performance analysis.</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <strong>Google 3-Pack Signals</strong>
                        <p className="text-slate-500 text-[11px] mt-0.5">Local citations &amp; NAP consistency check.</p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex items-center justify-center">
                    <div className="rounded-2xl overflow-hidden bg-white p-2 shadow-md border border-slate-100">
                      <img
                        src="/ai-seo-audit-vector.jpg"
                        alt="Digital FX AI Search & GEO Audit Engine"
                        className="w-full h-auto rounded-xl object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </section>
      )}

      {/* UNIVERSAL BRANDED FOOTER */}
      <Footer />

    </div>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    }>
      <ToolsContent />
    </Suspense>
  );
}
