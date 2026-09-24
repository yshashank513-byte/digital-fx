"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES_LIST, CATEGORY_QUESTIONS } from "@/lib/reviewFlowCategories";

export default function ReviewFlowLandingClient() {
  const [selectedCatId, setSelectedCatId] = useState<string>("packers-movers");

  const currentCat = CATEGORIES_LIST.find((c) => c.id === selectedCatId) || CATEGORIES_LIST[0];
  const catQuestions = CATEGORY_QUESTIONS[currentCat.name] || CATEGORY_QUESTIONS["Packers & Movers"];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#207de9] selection:text-white">
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="Digital FX" className="h-9 w-auto object-contain" />
            </Link>
            <span className="hidden sm:inline-block text-slate-300">|</span>
            <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60">
              <span className="text-xs font-black tracking-wider text-[#207de9] uppercase">ReviewFlow AI</span>
              <span className="text-[10px] font-bold bg-[#207de9] text-white px-1.5 py-0.2 rounded">SaaS</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/reviewflow/dashboard"
              className="text-xs sm:text-sm font-bold text-slate-700 hover:text-[#207de9] transition"
            >
              Business Dashboard
            </Link>
            <Link
              href="/r/digital-fx?src=qr"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-[#0d9488] bg-teal-50 px-3 py-2 rounded-xl border border-teal-200 hover:bg-teal-100 transition"
            >
              <span>📱</span> Test Customer Flow
            </Link>
            <Link
              href="/reviewflow/dashboard"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-white bg-[#080d24] hover:bg-[#207de9] px-4 sm:px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>+ Add Your Business</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-blue-50/40 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-bold mb-6">
              <span className="flex h-2 w-2 rounded-full bg-[#207de9] animate-pulse" />
              100% Google Anti-Review-Gating Policy Compliant
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#080d24] tracking-tight leading-[1.12]">
              Turn Happy Customers Into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#207de9] via-teal-600 to-indigo-600">
                5-Star Google Reviews
              </span>{" "}
              via Smart QR Codes
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Most customers want to leave a review but don&apos;t know what to write.{" "}
              <strong>ReviewFlow AI</strong> asks 3-4 simple tap-to-answer questions about their actual experience, turns their genuine feedback into a natural review draft, and opens your Google review window in 1 click.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/reviewflow/dashboard"
                className="py-4 px-8 rounded-2xl font-black text-white text-base bg-gradient-to-r from-[#207de9] to-[#0ea5e9] shadow-lg shadow-blue-500/25 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>🚀 Launch Business Dashboard</span>
                <span>→</span>
              </Link>
              <Link
                href="/r/digital-fx?src=qr"
                target="_blank"
                className="py-4 px-6 rounded-2xl font-bold text-slate-800 text-base bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 shadow-xs transition-all flex items-center gap-2"
              >
                <span>📱 Scan / Test Digital FX QR</span>
                <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded font-black">Live</span>
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-200">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-[#080d24]">3.8x</div>
                <div className="text-xs text-slate-500 font-semibold mt-0.5">More Reviews Collected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">30 Sec</div>
                <div className="text-xs text-slate-500 font-semibold mt-0.5">Average Customer Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-[#207de9]">14+</div>
                <div className="text-xs text-slate-500 font-semibold mt-0.5">Business Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-indigo-600">100%</div>
                <div className="text-xs text-slate-500 font-semibold mt-0.5">Authentic &amp; Compliant</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. INTERACTIVE CATEGORY SIMULATOR */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#207de9] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Interactive Live Simulator
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#080d24] mt-3">
              See How It Works For Any Business Category
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Select your business type below to test the category-specific questions and natural review draft generation.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-5xl mx-auto">
            {CATEGORIES_LIST.map((cat) => {
              const isActive = cat.id === selectedCatId;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCatId(cat.id)}
                  className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isActive
                      ? "bg-[#080d24] text-white border-[#080d24] shadow-md scale-105"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Simulator Visual Display (Split View) */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            
            {/* Left Col (5 cols): Standee & QR Mockup */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-center flex flex-col items-center">
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full mb-3">
                <span>📍 Category:</span>
                <span className="text-[#207de9] font-extrabold">{currentCat.name}</span>
              </div>

              <h3 className="text-lg font-black text-slate-900 leading-snug">
                Tabletop Tent Card &amp; QR Standee
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Place this at billing desks, packaging, or receipts.
              </p>

              {/* QR Box with Live Endpoint */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 w-full max-w-[280px] shadow-xl flex flex-col items-center border border-slate-800">
                <div className="text-xs font-black uppercase tracking-wider text-amber-400 mb-1">
                  Rate Your Experience
                </div>
                <div className="text-[11px] text-slate-300 font-semibold mb-3">
                  Scan with your phone camera
                </div>

                <div className="bg-white p-3 rounded-xl shadow-inner">
                  {/* Generated QR Image */}
                  <img
                    src={`/api/reviewflow/qr?businessId=${selectedCatId === "digital-marketing" ? "digital-fx" : selectedCatId === "packers-movers" ? "speedy-packers" : "shree-jewellers"}&format=png`}
                    alt="Review QR Code"
                    className="w-40 h-40 object-contain rounded"
                  />
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                  <span>★ ★ ★ ★ ★</span>
                  <span className="text-white text-[11px] font-normal">Review on Google</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2 w-full max-w-[280px]">
                <Link
                  href={`/r/${selectedCatId === "digital-marketing" ? "digital-fx" : selectedCatId === "packers-movers" ? "speedy-packers" : "shree-jewellers"}?src=qr`}
                  target="_blank"
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#207de9] text-white hover:bg-blue-600 transition flex items-center justify-center gap-1.5"
                >
                  <span>📱 Open Mobile Review</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>

            {/* Right Col (7 cols): What Customer Experiences */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                  Step-by-Step Experience
                </span>
                <h4 className="text-2xl font-black text-slate-900 mt-1">
                  Questions Customized For &quot;{currentCat.name}&quot;
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {currentCat.description}
                </p>
              </div>

              {/* Questions Sample Cards */}
              <div className="space-y-3">
                {catQuestions.slice(0, 3).map((q, idx) => (
                  <div key={q.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
                    <div className="text-xs font-extrabold text-slate-800 flex items-center gap-2 mb-2">
                      <span className="h-4.5 w-4.5 rounded-full bg-blue-100 text-[#207de9] text-[10px] flex items-center justify-center font-black">
                        {idx + 1}
                      </span>
                      <span>{q.question}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pl-6">
                      {q.options.map((opt, oIdx) => (
                        <span
                          key={opt}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${
                            oIdx === 0
                              ? "bg-blue-50 text-[#207de9] border-blue-200 font-bold"
                              : "bg-slate-50 text-slate-600 border-slate-200"
                          }`}
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Generated Draft Box Preview */}
              <div className="bg-white rounded-xl p-4 border-2 border-emerald-300 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span>✨</span> Resulting AI Review Draft (Natural &amp; Customer-Authored):
                  </span>
                  <span className="text-amber-500">★★★★★</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 italic leading-relaxed bg-emerald-50/50 p-3 rounded-lg border border-emerald-100 font-medium">
                  &ldquo;{currentCat.sampleDraft}&rdquo;
                </p>
                <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>✓ 100% editable by customer before posting</span>
                  <span className="font-bold text-[#4285F4]">→ Opens Google Review Window</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. THE 5-STEP CORE WORKFLOW */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Frictionless Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#080d24] mt-3">
              How ReviewFlow AI Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Designed to eliminate the #1 reason customers don&apos;t leave reviews: writer&apos;s block and complicated steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
              <span className="text-2xl font-black text-blue-500/20 absolute top-4 right-4">01</span>
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-[#207de9] flex items-center justify-center text-xl font-bold mb-4">
                ⚙️
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Setup Business</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed font-normal">
                Enter your business name, pick your category, and paste your Google Business Profile review link.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
              <span className="text-2xl font-black text-teal-500/20 absolute top-4 right-4">02</span>
              <div className="h-12 w-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl font-bold mb-4">
                🖨️
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Download QR</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed font-normal">
                Download your printable tabletop tent card, counter standee, or digital vector QR code.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
              <span className="text-2xl font-black text-indigo-500/20 absolute top-4 right-4">03</span>
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold mb-4">
                📱
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Customer Scans</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed font-normal">
                Customer scans the QR code. A blazing-fast mobile questionnaire tailored to their visit opens.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
              <span className="text-2xl font-black text-amber-500/20 absolute top-4 right-4">04</span>
              <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold mb-4">
                ✨
              </div>
              <h3 className="text-base font-extrabold text-slate-900">AI Drafts Review</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed font-normal">
                Based strictly on the customer&apos;s genuine answers, AI synthesizes a clear, helpful 2-sentence draft.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
              <span className="text-2xl font-black text-emerald-500/20 absolute top-4 right-4">05</span>
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold mb-4">
                🚀
              </div>
              <h3 className="text-base font-extrabold text-slate-900">1-Click Google Post</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed font-normal">
                Customer clicks &quot;Review on Google&quot;, pastes their draft, and publishes to your Google Profile!
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. GOOGLE POLICY COMPLIANCE GUARANTEE */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-[#080d24] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-4">
                <span>🛡️ Strict Policy Compliance</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                Built For Longevity: Never Risk Your Google Business Profile
              </h3>
              <p className="text-sm text-slate-300 mt-3 max-w-2xl leading-relaxed">
                Many shady review tools use fake bots or illegal &quot;review gating&quot; (blocking unhappy customers from reviewing on Google), which gets business profiles suspended by Google. <strong>ReviewFlow AI is 100% compliant:</strong>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-xs text-slate-200">
                <div className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Zero Fake Reviews:</strong> Reviews are authored and posted directly by verified customer accounts.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Anti-Gating Policy:</strong> Customers are never blocked from reviewing, regardless of their star rating.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>No Auto-Posting:</strong> Customers review and edit the draft on their own device before submitting to Google.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Natural Local SEO NLP:</strong> Reviews contain natural location and service keywords that boost Google Maps ranking.</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-slate-400 font-medium">
                  Integrated with Digital FX Search Engineering &amp; Local Maps 3-Pack Architecture
                </span>
                <Link
                  href="/reviewflow/dashboard"
                  className="text-xs font-black text-white bg-[#207de9] hover:bg-blue-600 px-5 py-2.5 rounded-xl transition"
                >
                  Manage Your Businesses Now →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo-white.svg" alt="Digital FX" className="h-8 w-auto object-contain" />
            <span className="text-slate-600">•</span>
            <span>ReviewFlow AI Enterprise Suite</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/" className="hover:text-white transition">Digital FX Home</Link>
            <Link href="/services" className="hover:text-white transition">SEO &amp; Growth Services</Link>
            <Link href="/reviewflow/dashboard" className="hover:text-white transition">Business Dashboard</Link>
            <Link href="/r/digital-fx" className="hover:text-white transition">Digital FX Review Desk</Link>
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
          </div>

          <div>
            © {new Date().getFullYear()} Digital FX®. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
