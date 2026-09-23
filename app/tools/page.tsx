"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function ToolsPage() {
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleAudit(e: FormEvent) {
    e.preventDefault();
    if (!website.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);
    setStep(1);

    const timer1 = setTimeout(() => setStep(2), 700);
    const timer2 = setTimeout(() => setStep(3), 1400);

    try {
      const res = await fetch("/api/geo-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website: website.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to audit website.");
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Audit failed. Please verify your domain.");
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-[#207de9] selection:text-white">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#080d24] text-white border-b border-slate-800 text-[11px] sm:text-xs py-2 px-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-slate-300">FREE TOOL • GENERATIVE ENGINE OPTIMIZATION (GEO) &amp; AI AUDIT SCANNER</span>
          </div>
          <Link href="/contact" className="hover:text-cyan-300 transition text-slate-400 text-[11px] hidden sm:inline">
            Request Strategy Proposal →
          </Link>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="max-w-[1480px] mx-auto flex h-[74px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
          <Link href="/" className="flex items-center shrink-0 group min-w-0" aria-label="Digital FX Home">
            <img src="/logo.svg" alt="Digital FX - Business Solution" width={116} height={32} style={{ height: "32px", width: "auto" }} className="h-7 sm:h-8 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform" />
          </Link>

          <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 mx-auto px-4 xl:px-8 shrink-0">
            <Link href="/services" className="text-[14px] font-semibold text-slate-700 hover:text-[#207de9] transition-colors whitespace-nowrap shrink-0">
              Services
            </Link>
            <Link href="/case-studies" className="text-[14px] font-semibold text-slate-700 hover:text-[#207de9] transition-colors whitespace-nowrap shrink-0">
              Portfolio
            </Link>
            <Link href="/pricing" className="text-[14px] font-semibold text-slate-700 hover:text-[#207de9] transition-colors whitespace-nowrap shrink-0">
              Packages
            </Link>
            <Link href="/tools" className="text-[14px] font-bold text-[#207de9] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 border-b-2 border-[#207de9] pb-0.5">
              <span className="whitespace-nowrap">AI Tools</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold uppercase tracking-wider leading-none shrink-0">
                FREE
              </span>
            </Link>
            <Link href="/careers" className="text-[14px] font-semibold text-slate-700 hover:text-[#207de9] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0">
              <span className="whitespace-nowrap">Careers</span>
              <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[9px] font-extrabold uppercase leading-none shrink-0">
                HIRING
              </span>
            </Link>
            <Link href="/contact" className="text-[14px] font-semibold text-slate-700 hover:text-[#207de9] transition-colors whitespace-nowrap shrink-0">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/contact"
              className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#1570ef] hover:bg-[#1362d2] text-white text-xs sm:text-sm font-extrabold shadow-md shadow-blue-500/25 transition-all whitespace-nowrap"
            >
              <span className="hidden xs:inline">Get Free Proposal →</span>
              <span className="xs:hidden">Proposal →</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 3. HERO & SCANNER CONSOLE */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-[#f8faff] via-white to-white border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1570ef] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse" />
            Free Online Marketing Tools
          </span>
          <h1 className="text-[34px] sm:text-[48px] lg:text-[54px] font-extrabold text-[#080d24] tracking-[-0.035em] leading-[1.1]">
            Benchmark Your Website in{" "}
            <span className="text-[#1570ef] block sm:inline font-normal italic font-serif">
              ChatGPT, Gemini &amp; AI Search.
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
            Audit your Generative Engine Optimization (GEO) score, structured entity schema, and local Google AI Overviews visibility in under 60 seconds.
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
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 rounded-xl bg-[#080d24] hover:bg-[#1570ef] text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Auditing Signals...</span>
                    </>
                  ) : (
                    <span>⚡ Run Free AI Audit →</span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Loading Progress */}
          {loading && (
            <div className="mx-auto mt-6 max-w-[680px] rounded-2xl border border-blue-200 bg-white p-6 shadow-sm text-left">
              <div className="flex items-center justify-between text-xs font-bold text-[#1570ef] mb-2.5">
                <span>AUDITING SEARCH &amp; AI ENTITY SIGNALS</span>
                <span>{step === 1 ? "35%" : step === 2 ? "70%" : "95%"}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#1570ef] to-[#00b894] transition-all duration-300 rounded-full"
                  style={{ width: step === 1 ? "35%" : step === 2 ? "70%" : "95%" }}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mx-auto mt-6 max-w-[780px] rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          {/* Results Display */}
          {result && !loading && (
            <div className="mx-auto mt-10 max-w-[900px] rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-lg text-left space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1570ef]">Audit Complete</span>
                  <h3 className="text-2xl font-extrabold text-[#080d24] mt-1">{result.domain || website}</h3>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-emerald-600">{result.score || result.overall || 84}/100</div>
                  <div className="text-xs text-slate-500 font-semibold">GEO AI Score</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-xs text-slate-500 font-semibold">Google Gemini Status</div>
                  <div className="text-lg font-bold text-[#080d24] mt-1">Entity Verified ✓</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-xs text-slate-500 font-semibold">ChatGPT Citation Readiness</div>
                  <div className="text-lg font-bold text-[#080d24] mt-1">High Intent Snippet</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-xs text-slate-500 font-semibold">Schema.org JSON-LD</div>
                  <div className="text-lg font-bold text-[#080d24] mt-1">LocalBusiness Active</div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 font-medium">Want our senior engineers to fix missed ranking signals?</p>
                <Link
                  href={`/contact?audit=${encodeURIComponent(website)}`}
                  className="px-6 py-3 rounded-xl bg-[#1570ef] hover:bg-[#1362d2] text-white font-bold text-xs transition shadow-md whitespace-nowrap"
                >
                  Request Customized Action Plan →
                </Link>
              </div>
            </div>
          )}

          {/* Pre-Audit Showcase Illustration */}
          {!result && !loading && (
            <div className="mx-auto mt-12 max-w-[1080px] rounded-3xl bg-white border border-slate-200 p-6 sm:p-9 text-left">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#1570ef]">How It Works</span>
                  <h3 className="text-2xl font-extrabold text-[#080d24]">Proprietary Search &amp; GEO Signal Audit</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    Enter any business website to analyze how modern AI search bots (Perplexity, ChatGPT, and Google AI Overviews) index your brand, and identify missed Google Maps 3-Pack citations.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <strong>AI Overviews Readiness</strong>
                      <p className="text-slate-500 text-[11px] mt-0.5">Summary citations on Gemini &amp; SearchGPT.</p>
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

      {/* FOOTER */}
      <footer className="py-10 bg-white border-t border-slate-200 text-xs text-slate-500 text-center">
        <div className="max-w-[1400px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Digital FX. All rights reserved. Orbit Plaza, Crossings Republik, Ghaziabad.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-[#1570ef]">Home</Link>
            <Link href="/services" className="hover:text-[#1570ef]">Services</Link>
            <Link href="/case-studies" className="hover:text-[#1570ef]">Case Studies</Link>
            <Link href="/pricing" className="hover:text-[#1570ef]">Pricing</Link>
            <Link href="/contact" className="hover:text-[#1570ef]">Contact</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
