"use client";

import React, { useState } from "react";
import type { PageSpeedAuditData, MetricDetail } from "@/app/api/pagespeed/route";

interface PageSpeedAuditReportProps {
  data: PageSpeedAuditData;
  isLoading?: boolean;
  onStrategyChange: (strategy: "mobile" | "desktop") => void;
  onRequestProposal?: () => void;
}

export default function PageSpeedAuditReport({
  data,
  isLoading = false,
  onStrategyChange,
  onRequestProposal,
}: PageSpeedAuditReportProps) {
  const [selectedCategory, setSelectedCategory] = useState<"performance" | "accessibility" | "bestPractices" | "seo">("performance");
  const [expandMetrics, setExpandMetrics] = useState(false);
  const [expandedOpportunity, setExpandedOpportunity] = useState<string | null>(null);

  const { strategy, scores, screenshot, metrics, opportunities, diagnostics, capturedAt, device, url } = data;

  const getScoreColor = (score: number) => {
    if (score >= 90) return { stroke: "#0c8b44", bg: "#e6f4ea", text: "#0c8b44", badge: "bg-emerald-50 text-emerald-800 border-emerald-200" };
    if (score >= 50) return { stroke: "#ea8600", bg: "#fef7e0", text: "#ea8600", badge: "bg-amber-50 text-amber-800 border-amber-200" };
    return { stroke: "#c5221f", bg: "#fce8e6", text: "#c5221f", badge: "bg-rose-50 text-rose-800 border-rose-200" };
  };

  const getMetricIcon = (category: MetricDetail["category"]) => {
    if (category === "good") return <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#0c8b44]" title="Good" />;
    if (category === "needs-improvement") return <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#ea8600]" title="Needs Improvement" />;
    return <span className="inline-block w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[9px] border-b-[#c5221f]" title="Poor" />;
  };

  const activeScore = scores[selectedCategory];
  const activeColor = getScoreColor(activeScore);

  const categoriesConfig = [
    { key: "performance" as const, label: "Performance", score: scores.performance },
    { key: "accessibility" as const, label: "Accessibility", score: scores.accessibility },
    { key: "bestPractices" as const, label: "Best Practices", score: scores.bestPractices },
    { key: "seo" as const, label: "SEO", score: scores.seo },
  ];

  return (
    <div className="w-full max-w-[1120px] mx-auto font-sans antialiased text-[#202124]">
      
      {/* 1. TOP TABS: MOBILE vs DESKTOP */}
      <div className="flex items-center justify-center border-b border-slate-200 mb-6 sm:mb-8">
        <button
          type="button"
          onClick={() => onStrategyChange("mobile")}
          disabled={isLoading}
          className={`flex items-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-semibold transition-colors relative cursor-pointer ${
            strategy === "mobile"
              ? "text-[#1a73e8] font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {/* Mobile phone icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
          <span>Mobile</span>
          {strategy === "mobile" && (
            <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1a73e8] rounded-t-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onStrategyChange("desktop")}
          disabled={isLoading}
          className={`flex items-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-semibold transition-colors relative cursor-pointer ${
            strategy === "desktop"
              ? "text-[#1a73e8] font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {/* Desktop monitor icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span>Desktop</span>
          {strategy === "desktop" && (
            <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1a73e8] rounded-t-full" />
          )}
        </button>
      </div>

      {/* 2. SECTION 1: DISCOVER WHAT YOUR REAL USERS ARE EXPERIENCING */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 px-2 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-[#1a73e8]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-[#202124]">
            Discover what your real users are experiencing
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#5f6368] font-medium pl-10 sm:pl-0">
          <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>Chrome UX Report: <strong className="text-slate-700">No field data (sample threshold)</strong></span>
        </div>
      </div>

      {/* 3. SECTION 2: DIAGNOSE PERFORMANCE ISSUES */}
      <div className="flex items-center gap-3 py-2 px-2 mb-2">
        <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-[#1a73e8]">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        </div>
        <h3 className="text-base sm:text-lg font-medium text-[#202124]">
          Diagnose performance issues
        </h3>
      </div>

      {/* 4. MAIN AUDIT CARD CONTAINER */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-8 shadow-sm">
        
        {/* TOP ROW: 4 SCORE GAUGES + AGENTIC BROWSING */}
        <div className="flex flex-wrap items-center justify-around gap-4 pb-6 border-b border-slate-100">
          {categoriesConfig.map((cat) => {
            const colors = getScoreColor(cat.score);
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex flex-col items-center group cursor-pointer transition-all p-2 rounded-xl ${
                  isSelected ? "bg-slate-50 ring-1 ring-slate-200" : "hover:bg-slate-50/50"
                }`}
              >
                {/* Circular Gauge */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill={colors.bg}
                      stroke="#f1f3f4"
                      strokeWidth="6"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={colors.stroke}
                      strokeWidth="6"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * cat.score) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <span
                    className="absolute text-xl sm:text-2xl font-bold tabular-nums"
                    style={{ color: colors.text }}
                  >
                    {cat.score}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 mt-2 text-center group-hover:text-[#1a73e8] transition-colors">
                  {cat.label}
                </span>
              </button>
            );
          })}

          {/* 5th Pillar: Agentic Browsing (GEO / AI Overviews readiness) */}
          <div className="flex flex-col items-center p-2 rounded-xl">
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-2xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-1.5 text-base sm:text-lg font-bold text-amber-800">
                <span className="w-3 h-3 rounded-xs bg-amber-500 inline-block" />
                <span>{scores.agenticBrowsing.ratio}</span>
              </div>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-700 mt-2 text-center">
              Agentic browsing
            </span>
          </div>
        </div>

        {/* CARD BODY: LARGE SELECTED GAUGE (LEFT) + LIVE SCREENSHOT (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-8">
          
          {/* Left Column: Big Gauge + Scale Legend */}
          <div className="lg:col-span-6 flex flex-col items-center text-center px-4">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill={activeColor.bg}
                  stroke="#f1f3f4"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke={activeColor.stroke}
                  strokeWidth="8"
                  strokeDasharray={301.6}
                  strokeDashoffset={301.6 - (301.6 * activeScore) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span
                className="absolute text-4xl sm:text-5xl font-extrabold tabular-nums tracking-tight"
                style={{ color: activeColor.text }}
              >
                {activeScore}
              </span>
            </div>

            <h4 className="text-xl sm:text-2xl font-bold text-[#202124] capitalize">
              {selectedCategory === "bestPractices" ? "Best Practices" : selectedCategory}
            </h4>

            <p className="text-xs text-slate-500 mt-2 max-w-[340px] leading-relaxed">
              Values are estimated and may vary. The{" "}
              <a
                href="https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1a73e8] hover:underline"
              >
                performance score is calculated
              </a>{" "}
              directly from these metrics.{" "}
              <a
                href="https://googlechrome.github.io/lighthouse/scorecalc/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1a73e8] hover:underline"
              >
                See calculator.
              </a>
            </p>

            {/* Official Google Score Scale Legend */}
            <div className="flex items-center justify-center gap-5 mt-6 text-xs text-[#5f6368] font-medium select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-[#c5221f]" />
                <span>0–49</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#ea8600]" />
                <span>50–89</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0c8b44]" />
                <span>90–100</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Screenshot Preview */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            {screenshot ? (
              <div
                className={`overflow-hidden border border-slate-200 bg-white shadow-md transition-all ${
                  strategy === "mobile"
                    ? "w-[220px] sm:w-[250px] rounded-3xl p-2.5 border-slate-300 shadow-xl"
                    : "w-full max-w-[480px] rounded-xl border-slate-300 shadow-xl"
                }`}
              >
                {/* Mock browser top bar for desktop */}
                {strategy === "desktop" && (
                  <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                    <span className="text-[10px] text-slate-500 font-mono ml-2 truncate">
                      {url}
                    </span>
                  </div>
                )}
                <img
                  src={screenshot}
                  alt={`Google Lighthouse Screenshot of ${url}`}
                  className={`w-full h-auto object-contain ${
                    strategy === "mobile" ? "rounded-2xl" : "rounded-b-lg"
                  }`}
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="w-[240px] h-[340px] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 text-center text-slate-400">
                <svg className="w-8 h-8 mb-2 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="text-xs font-medium">Screenshot Captured</span>
                <span className="text-[10px] text-slate-400 mt-1">{url}</span>
              </div>
            )}
            <span className="text-[11px] text-slate-400 mt-3 font-mono">
              Final Lighthouse Render ({strategy})
            </span>
          </div>

        </div>

        {/* METRICS HEADING & TOGGLE */}
        <div className="border-t border-slate-200 pt-6 mt-2">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              METRICS
            </h5>
            <button
              type="button"
              onClick={() => setExpandMetrics(!expandMetrics)}
              className="text-xs font-semibold text-[#1a73e8] hover:underline cursor-pointer"
            >
              {expandMetrics ? "Collapse view" : "Expand view"}
            </button>
          </div>

          {/* 5 Core Web Vitals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { key: "fcp", data: metrics.fcp, desc: "Marks the time at which the first text or image is painted." },
              { key: "lcp", data: metrics.lcp, desc: "Marks the time at which the largest text or image is painted." },
              { key: "tbt", data: metrics.tbt, desc: "Sum of all time periods between FCP and TTI when task length exceeded 50ms." },
              { key: "cls", data: metrics.cls, desc: "Measures visual stability and unexpected layout shifts." },
              { key: "si", data: metrics.si, desc: "Shows how quickly the contents of a page are visibly populated." },
            ].map((m) => (
              <div
                key={m.key}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-600 flex items-center gap-2">
                    {getMetricIcon(m.data.category)}
                    <span>{m.data.title}</span>
                  </span>
                  <span className="text-sm font-bold text-slate-900 tabular-nums">
                    {m.data.displayValue}
                  </span>
                </div>
                {expandMetrics && (
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug font-normal">
                    {m.desc}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Device & Timestamp Info */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>Captured at {capturedAt}</span>
            <span>{device}</span>
          </div>
        </div>

      </div>

      {/* 5. OPPORTUNITIES & DIAGNOSTICS */}
      {opportunities.length > 0 && (
        <div className="mt-8 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-base sm:text-lg font-bold text-[#202124]">
              Opportunities
            </h4>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1a73e8]">
              {opportunities.length} Improvements Found
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            These suggestions can help your page load faster and rank higher on Google Search &amp; AI Overviews.
          </p>

          <div className="divide-y divide-slate-100">
            {opportunities.map((opp) => (
              <div key={opp.id} className="py-3">
                <button
                  type="button"
                  onClick={() => setExpandedOpportunity(expandedOpportunity === opp.id ? null : opp.id)}
                  className="w-full flex items-center justify-between gap-3 text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-xs bg-[#ea8600]" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-[#1a73e8] transition-colors">
                      {opp.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {opp.displayValue && (
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {opp.displayValue}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      {expandedOpportunity === opp.id ? "▲" : "▼"}
                    </span>
                  </div>
                </button>
                {expandedOpportunity === opp.id && (
                  <div className="mt-2 pl-4 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p>{opp.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. CALL TO ACTION BANNER */}
      <div className="mt-8 rounded-2xl bg-gradient-to-r from-[#080d24] to-[#121c4b] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 rounded-full">
            CORE WEB VITALS BOOST
          </span>
          <h4 className="text-lg sm:text-xl font-extrabold text-white mt-1.5 tracking-tight">
            Need Digital FX to achieve a 95+ PageSpeed Score?
          </h4>
          <p className="text-xs text-slate-300 mt-0.5 max-w-[540px] font-normal">
            We eliminate render-blocking scripts, optimize LCP/TBT metrics, and implement institutional entity schema to guarantee top performance.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
          <a
            href={`https://wa.me/918447583685?text=${encodeURIComponent(
              `Hi Digital FX, I just ran a Google PageSpeed audit on ${url} (Performance: ${scores.performance}/100, FCP: ${metrics.fcp.displayValue}, LCP: ${metrics.lcp.displayValue}). Please share your Core Web Vitals optimization plan.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs text-center shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>💬 Fix on WhatsApp (15% OFF)</span>
            <span>→</span>
          </a>
          {onRequestProposal && (
            <button
              type="button"
              onClick={onRequestProposal}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#207de9] hover:bg-[#1866c2] text-white font-bold text-xs text-center transition cursor-pointer shadow-md whitespace-nowrap"
            >
              Request Strategic Proposal →
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
