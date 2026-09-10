"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AnalysisData = {
  url: string;
  seo: number;
  performance: number;
  mobile: number;
  content: number;
  geo: number;
  overall: number;
  title: string;
  description: string;
  h1Count: number;
  imageCount: number;
  imagesWithoutAlt: number;
  hasViewport: boolean;
  hasCanonical: boolean;
  hasRobots: boolean;
  responseTime: number;
  recommendations: string[];
};

type AIData = {
  summary: string;
  priority: string;
  opportunities: string[];
  actions: string[];
  aiEngineBreakdown?: {
    chatgpt: { score: number; status: string; diagnosis: string };
    gemini: { score: number; status: string; diagnosis: string };
    perplexity: { score: number; status: string; diagnosis: string };
  };
  trafficIntelligence?: {
    estimatedMonthlyVisits: string;
    trafficTier: string;
    channelSplit: {
      organicSearch: number;
      localMaps: number;
      directBrand: number;
      aiCitations: number;
    };
    missedTrafficMonthly: string;
    projectedTrafficMonthly: string;
  };
  googleRatingIntelligence?: {
    rating: number;
    reviewCountText: string;
    gbpStatus: string;
    sentiment: number;
    localPackImpact: string;
    hasReviewSchema: boolean;
  };
  projectedGrowth?: {
    estimatedScoreAfterFixes: number;
    potentialTrafficIncrease: string;
  };
  engineUsed?: string;
};

export default function GeoCheckerPage() {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [error, setError] = useState("");
  const [aiError, setAiError] = useState("");

  const [result, setResult] =
    useState<AnalysisData | null>(null);

  const [aiResult, setAiResult] =
    useState<AIData | null>(null);

  // =====================================================
  // ANALYZE WEBSITE
  // =====================================================

  async function analyzeWebsite() {
    const cleanUrl = url.trim();

    if (!cleanUrl) {
      setError("Please enter a website URL.");
      return;
    }

    setLoading(true);
    setError("");
    setAiError("");
    setResult(null);
    setAiResult(null);

    try {
      const response = await fetch(
        "/api/geo-check",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: cleanUrl,
          }),
        }
      );

      const text = await response.text();

      let data: any;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Geo Checker API returned an invalid response. Check /api/geo-check/route.ts."
        );
      }

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.error ||
            `Geo analysis failed with status ${response.status}.`
        );
      }

      setResult(data.data);

      // ===============================================
      // START AI ANALYSIS
      // ===============================================

      await runAIAnalysis(data.data);
    } catch (err) {
      console.error(
        "GEO analysis error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to analyze website."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // AI ANALYSIS
  // =====================================================

  async function runAIAnalysis(
    analysis: AnalysisData
  ) {
    setAiLoading(true);
    setAiError("");

    try {
      const response = await fetch(
        "/api/ai-analysis",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: analysis.url,
            seo: analysis.seo,
            performance:
              analysis.performance,
            mobile: analysis.mobile,
            content: analysis.content,
            geo: analysis.geo,
            overall: analysis.overall,
            recommendations:
              analysis.recommendations,
            title: analysis.title,
            description: analysis.description,
            responseTime: analysis.responseTime,
          }),
        }
      );

      const text = await response.text();

      let data: any;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "AI API returned an invalid response."
        );
      }

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.error ||
            `AI analysis failed with status ${response.status}.`
        );
      }

      setAiResult(data.data);
    } catch (err) {
      console.error(
        "AI analysis error:",
        err
      );

      setAiError(
        err instanceof Error
          ? err.message
          : "Unable to generate AI analysis."
      );
    } finally {
      setAiLoading(false);
    }
  }

  // =====================================================
  // SCORE COLOR
  // =====================================================

  function scoreColor(score: number) {
    if (score >= 80) {
      return "text-emerald-600";
    }

    if (score >= 60) {
      return "text-amber-600";
    }

    return "text-red-600";
  }

  function scoreBg(score: number) {
    if (score >= 80) {
      return "bg-emerald-50";
    }

    if (score >= 60) {
      return "bg-amber-50";
    }

    return "bg-red-50";
  }

  function scoreLabel(score: number) {
    if (score >= 80) {
      return "Excellent";
    }

    if (score >= 60) {
      return "Needs Improvement";
    }

    return "Needs Attention";
  }

  // =====================================================
  // STATUS
  // =====================================================

  function statusIcon(value: boolean) {
    return value ? "✓" : "×";
  }

  function statusClass(value: boolean) {
    return value
      ? "bg-emerald-50 text-emerald-600"
      : "bg-red-50 text-red-600";
  }

  // =====================================================
  // LOGOUT
  // =====================================================

  function logout() {
    localStorage.removeItem(
      "digitalfx_admin"
    );

    localStorage.removeItem(
      "digitalfx_remember"
    );

    router.push("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#071534]">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside className="fixed left-0 top-0 hidden h-screen w-[260px] flex-col bg-[#071534] text-white lg:flex">

        <div className="flex h-[82px] items-center border-b border-white/10 px-5">

          <button
            onClick={() =>
              router.push("/admin")
            }
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white">
              <img
                src="/logo.png"
                alt="Digital FX"
                className="h-10 w-10 object-contain"
              />
            </div>

            <div className="text-left">

              <div className="text-[18px] font-extrabold">
                DIGITAL{" "}
                <span className="text-[#6f8cff]">
                  FX
                </span>
              </div>

              <div className="mt-0.5 text-[7px] font-bold tracking-[2px] text-blue-100/40">
                ADMIN PANEL
              </div>

            </div>

          </button>

        </div>

        <nav className="flex-1 overflow-y-auto p-4">

          <button
            onClick={() =>
              router.push("/admin")
            }
            className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white"
          >
            <span className="w-5 text-center">
              ▦
            </span>
            Dashboard
          </button>

          <button
            onClick={() =>
              router.push(
                "/admin/enquiries"
              )
            }
            className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white"
          >
            <span className="w-5 text-center">
              ◉
            </span>
            Enquiries
          </button>

          <button className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white">
            <span className="w-5 text-center">
              ◇
            </span>
            Services
          </button>

          <button className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white">
            <span className="w-5 text-center">
              ▣
            </span>
            Projects
          </button>

          <button className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white">
            <span className="w-5 text-center">
              ◒
            </span>
            Analytics
          </button>

          {/* GEO CHECKER ACTIVE */}

          <button
            className="mb-1.5 flex w-full items-center gap-3 rounded-xl bg-[#315df5] px-4 py-3 text-sm font-bold text-white"
          >
            <span className="w-5 text-center">
              ⌖
            </span>
            Geo Checker
          </button>

          <button
            onClick={() =>
              router.push(
                "/admin/enquiries"
              )
            }
            className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white"
          >
            <span className="w-5 text-center">
              ✉
            </span>
            Subscribers
          </button>

          <button className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white">
            <span className="w-5 text-center">
              ⚙
            </span>
            Settings
          </button>

        </nav>

        <div className="border-t border-white/10 p-4">

          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#315df5] text-sm font-extrabold">
              A
            </div>

            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-bold">
                Admin User
              </p>

              <p className="text-[10px] text-blue-100/40">
                Super Admin
              </p>

            </div>

            <button
              onClick={logout}
              className="text-lg text-white/40 hover:text-white"
            >
              ↪
            </button>

          </div>

        </div>

      </aside>

      {/* =====================================================
          MOBILE / MAIN
      ====================================================== */}

      <div className="lg:ml-[260px]">

        {/* HEADER */}

        <header className="flex min-h-[82px] items-center justify-between border-b border-gray-100 bg-white px-5 md:px-8">

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[1.6px] text-[#315df5]">
              WEBSITE ANALYSIS
            </p>

            <h1 className="mt-1 text-xl font-extrabold md:text-2xl">
              GEO Checker
            </h1>

          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() =>
                router.push(
                  "/admin/enquiries"
                )
              }
              className="hidden h-10 rounded-xl border border-gray-200 px-4 text-xs font-bold text-gray-600 hover:bg-gray-50 sm:block"
            >
              Enquiries
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-extrabold text-blue-600">
              A
            </div>

          </div>

        </header>

        {/* =====================================================
            CONTENT
        ====================================================== */}

        <section className="p-5 md:p-8">

          {/* TITLE */}

          <div className="mb-7">

            <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#315df5]">
              DIGITAL FX ANALYZER
            </p>

            <h2 className="mt-2 text-[28px] font-extrabold tracking-[-.8px] md:text-[34px]">
              Website GEO & SEO Checker
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Analyze your website's SEO,
              performance, mobile readiness,
              content quality and local GEO
              signals.
            </p>

          </div>

          {/* =====================================================
              URL INPUT
          ====================================================== */}

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_3px_16px_rgba(16,24,40,.035)] md:p-6">

            <div className="mb-3">

              <p className="text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                WEBSITE URL
              </p>

            </div>

            <div className="flex flex-col gap-3 md:flex-row">

              <input
                type="text"
                value={url}
                onChange={(e) =>
                  setUrl(e.target.value)
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !loading
                  ) {
                    analyzeWebsite();
                  }
                }}
                placeholder="https://example.com"
                className="h-13 flex-1 rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-sm font-medium outline-none transition placeholder:text-gray-400 focus:border-[#315df5] focus:bg-white focus:ring-4 focus:ring-blue-50"
              />

              <button
                onClick={analyzeWebsite}
                disabled={loading}
                className="h-13 rounded-xl bg-[#315df5] px-7 text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(49,93,245,.2)] transition hover:bg-[#2449d6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Analyzing..."
                  : "Analyze Website"}
              </button>

            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
                {error}
              </div>
            )}

          </div>

          {/* =====================================================
              LOADING
          ====================================================== */}

          {loading && (
            <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-10 text-center">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-[#315df5]" />

              <p className="mt-4 text-sm font-extrabold">
                Analyzing website...
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Checking SEO, GEO, content,
                mobile and performance signals.
              </p>

            </div>
          )}

          {/* =====================================================
              RESULTS
          ====================================================== */}

          {result && !loading && (
            <div className="mt-6 space-y-5">

              {/* URL */}

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_3px_16px_rgba(16,24,40,.035)]">

                <p className="text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                  ANALYZED WEBSITE
                </p>

                <p className="mt-2 break-all text-sm font-extrabold text-[#315df5]">
                  {result.url}
                </p>

                <p className="mt-2 text-[10px] text-gray-400">
                  Response time:{" "}
                  <strong className="text-gray-600">
                    {result.responseTime} ms
                  </strong>
                </p>

              </div>

              {/* =================================================
                  OVERALL
              ================================================== */}

              <div className="grid gap-5 lg:grid-cols-[260px_1fr]">

                <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-[0_3px_16px_rgba(16,24,40,.035)]">

                  <p className="text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                    OVERALL SCORE
                  </p>

                  <div className="mx-auto mt-5 flex h-36 w-36 items-center justify-center rounded-full border-[12px] border-blue-100">

                    <div>

                      <p
                        className={`text-4xl font-extrabold ${scoreColor(
                          result.overall
                        )}`}
                      >
                        {result.overall}
                      </p>

                      <p className="mt-1 text-[9px] font-bold text-gray-400">
                        / 100
                      </p>

                    </div>

                  </div>

                  <p
                    className={`mt-5 text-sm font-extrabold ${scoreColor(
                      result.overall
                    )}`}
                  >
                    {scoreLabel(
                      result.overall
                    )}
                  </p>

                </div>


                {/* SCORE GRID */}

                <div className="grid gap-4 sm:grid-cols-2">

                  {[
                    [
                      "SEO",
                      result.seo,
                      "Search optimization",
                    ],
                    [
                      "Performance",
                      result.performance,
                      "Loading signal",
                    ],
                    [
                      "Mobile",
                      result.mobile,
                      "Responsive readiness",
                    ],
                    [
                      "Content",
                      result.content,
                      "Content quality",
                    ],
                    [
                      "GEO",
                      result.geo,
                      "Local relevance",
                    ],
                  ].map(
                    ([label, score, desc]) => {

                      const value =
                        Number(score);

                      return (
                        <div
                          key={String(label)}
                          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_3px_16px_rgba(16,24,40,.035)]"
                        >

                          <div className="flex items-start justify-between">

                            <div>

                              <p className="text-sm font-extrabold">
                                {label}
                              </p>

                              <p className="mt-1 text-[9px] text-gray-400">
                                {desc}
                              </p>

                            </div>

                            <div
                              className={`rounded-xl px-3 py-2 text-lg font-extrabold ${scoreBg(
                                value
                              )} ${scoreColor(
                                value
                              )}`}
                            >
                              {value}
                            </div>

                          </div>

                          <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">

                            <div
                              className={`h-full rounded-full ${
                                value >= 80
                                  ? "bg-emerald-500"
                                  : value >= 60
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                              }`}
                              style={{
                                width: `${value}%`,
                              }}
                            />

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>


              {/* =================================================
                  TECHNICAL DETAILS
              ================================================== */}

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_3px_16px_rgba(16,24,40,.035)]">

                <div className="mb-5">

                  <h3 className="text-sm font-extrabold">
                    Technical Analysis
                  </h3>

                  <p className="mt-1 text-[10px] text-gray-400">
                    Basic technical signals detected
                    from the website.
                  </p>

                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                  {[
                    [
                      "Page Title",
                      Boolean(result.title),
                      result.title ||
                        "Not detected",
                    ],
                    [
                      "Meta Description",
                      Boolean(
                        result.description
                      ),
                      result.description ||
                        "Not detected",
                    ],
                    [
                      "Viewport",
                      result.hasViewport,
                      result.hasViewport
                        ? "Detected"
                        : "Missing",
                    ],
                    [
                      "Canonical",
                      result.hasCanonical,
                      result.hasCanonical
                        ? "Detected"
                        : "Missing",
                    ],
                    [
                      "Robots",
                      result.hasRobots,
                      result.hasRobots
                        ? "Detected"
                        : "Missing",
                    ],
                    [
                      "H1 Headings",
                      result.h1Count > 0,
                      `${result.h1Count} detected`,
                    ],
                    [
                      "Images",
                      result.imageCount >= 0,
                      `${result.imageCount} detected`,
                    ],
                    [
                      "Images without ALT",
                      result.imagesWithoutAlt ===
                        0,
                      `${result.imagesWithoutAlt} missing`,
                    ],
                  ].map(
                    ([label, good, value]) => {

                      const isGood =
                        Boolean(good);

                      return (
                        <div
                          key={String(label)}
                          className="rounded-xl border border-gray-100 bg-[#fafbfc] p-4"
                        >

                          <div className="flex items-center justify-between gap-3">

                            <p className="text-xs font-bold text-gray-600">
                              {label}
                            </p>

                            <span
                              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold ${statusClass(
                                isGood
                              )}`}
                            >
                              {statusIcon(
                                isGood
                              )}
                            </span>

                          </div>

                          <p className="mt-3 line-clamp-2 break-words text-[10px] leading-5 text-gray-400">
                            {String(value)}
                          </p>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>


              {/* =================================================
                  RECOMMENDATIONS
              ================================================== */}

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_3px_16px_rgba(16,24,40,.035)]">

                <div className="mb-5">

                  <h3 className="text-sm font-extrabold">
                    Recommendations
                  </h3>

                  <p className="mt-1 text-[10px] text-gray-400">
                    Technical improvements detected
                    during the analysis.
                  </p>

                </div>

                <div className="space-y-3">

                  {result.recommendations.map(
                    (item, index) => (
                      <div
                        key={`${item}-${index}`}
                        className="flex gap-3 rounded-xl border border-gray-100 bg-[#fafbfc] p-4"
                      >

                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[10px] font-extrabold text-blue-600">
                          {index + 1}
                        </div>

                        <p className="text-xs leading-5 text-gray-600">
                          {item}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>


              {/* =================================================
                  AI ANALYSIS
              ================================================== */}

              <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-[0_3px_20px_rgba(16,24,40,.05)]">

                <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-6">

                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div>

                      <div className="flex items-center gap-2">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                          AI
                        </div>

                        <div>

                          <p className="text-[9px] font-bold uppercase tracking-[1px] text-indigo-500">
                            ARTIFICIAL INTELLIGENCE
                          </p>

                          <h3 className="text-lg font-extrabold text-[#071534]">
                            AI Website Analysis
                          </h3>

                        </div>

                      </div>

                      <p className="mt-3 text-xs leading-5 text-gray-500">
                        {aiResult?.engineUsed
                          ? `Powered by ${aiResult.engineUsed}`
                          : "AI-powered insights based on your website analysis scores."}
                      </p>

                    </div>

                    {aiResult && (
                      <div className="rounded-xl bg-white px-4 py-3 shadow-sm">

                        <p className="text-[8px] font-bold uppercase tracking-[1px] text-gray-400">
                          PRIORITY
                        </p>

                        <p
                          className={`mt-1 text-sm font-extrabold ${
                            aiResult.priority
                              ?.toLowerCase()
                              .includes("high")
                              ? "text-red-600"
                              : aiResult.priority
                                  ?.toLowerCase()
                                  .includes(
                                    "medium"
                                  )
                              ? "text-amber-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {aiResult.priority}
                        </p>

                      </div>
                    )}

                  </div>

                </div>


                <div className="p-6">

                  {aiLoading && (
                    <div className="py-10 text-center">

                      <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-indigo-100 border-t-indigo-600" />

                      <p className="mt-4 text-sm font-extrabold">
                        AI is analyzing your website...
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Generating opportunities and
                        recommended actions.
                      </p>

                    </div>
                  )}


                  {aiError && !aiLoading && (
                    <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">

                      <p className="text-xs font-extrabold text-amber-700">
                        AI analysis could not be completed.
                      </p>

                      <p className="mt-2 text-xs leading-5 text-amber-600">
                        {aiError}
                      </p>

                      <button
                        onClick={() =>
                          runAIAnalysis(result)
                        }
                        className="mt-4 rounded-lg bg-amber-600 px-4 py-2 text-[10px] font-extrabold text-white hover:bg-amber-700"
                      >
                        Try Again
                      </button>

                    </div>
                  )}


                  {aiResult &&
                    !aiLoading && (
                      <div className="space-y-5">

                        {/* SUMMARY */}

                        <div className="rounded-xl border border-gray-100 bg-[#fafbfc] p-5">

                          <p className="text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                            AI SUMMARY
                          </p>

                          <p className="mt-3 text-sm leading-6 text-gray-600">
                            {aiResult.summary}
                          </p>

                        </div>

                        {/* AI SEARCH ENGINE CITATION BENCHMARKS */}
                        {aiResult.aiEngineBreakdown && (
                          <div>
                            <p className="mb-3 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                              AI SEARCH ENGINE CITATION BENCHMARKS
                            </p>

                            <div className="grid gap-3 md:grid-cols-3">
                              <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-800">ChatGPT Citation</span>
                                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                                    {aiResult.aiEngineBreakdown.chatgpt.score}%
                                  </span>
                                </div>
                                <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
                                  {aiResult.aiEngineBreakdown.chatgpt.status}
                                </span>
                                <p className="mt-2 text-xs leading-5 text-gray-600">
                                  {aiResult.aiEngineBreakdown.chatgpt.diagnosis}
                                </p>
                              </div>

                              <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-800">Google Gemini</span>
                                  <span className="text-xs font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                                    {aiResult.aiEngineBreakdown.gemini.score}%
                                  </span>
                                </div>
                                <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
                                  {aiResult.aiEngineBreakdown.gemini.status}
                                </span>
                                <p className="mt-2 text-xs leading-5 text-gray-600">
                                  {aiResult.aiEngineBreakdown.gemini.diagnosis}
                                </p>
                              </div>

                              <div className="rounded-xl border border-cyan-100 bg-cyan-50/40 p-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-800">Perplexity AI</span>
                                  <span className="text-xs font-extrabold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded">
                                    {aiResult.aiEngineBreakdown.perplexity.score}%
                                  </span>
                                </div>
                                <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
                                  {aiResult.aiEngineBreakdown.perplexity.status}
                                </span>
                                <p className="mt-2 text-xs leading-5 text-gray-600">
                                  {aiResult.aiEngineBreakdown.perplexity.diagnosis}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* PROJECTED GROWTH */}
                        {aiResult.projectedGrowth && (
                          <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs">
                                ↗
                              </span>
                              <div>
                                <p className="text-xs font-bold text-slate-800">Projected Post-Optimization Score</p>
                                <p className="text-[10px] text-gray-500">Target score after implementing Schema &amp; FAQ clusters</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-extrabold text-emerald-600">
                                {aiResult.projectedGrowth.estimatedScoreAfterFixes}/100
                              </span>
                              <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full">
                                {aiResult.projectedGrowth.potentialTrafficIncrease} Traffic Uplift
                              </span>
                            </div>
                          </div>
                        )}

                        {/* ESTIMATED TRAFFIC & GOOGLE RATING INTELLIGENCE */}
                        {(aiResult.trafficIntelligence || aiResult.googleRatingIntelligence) && (
                          <div className="grid gap-4 md:grid-cols-2">
                            {aiResult.trafficIntelligence && (
                              <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-[1px] text-blue-600">
                                    ESTIMATED MONTHLY TRAFFIC
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                                    {aiResult.trafficIntelligence.trafficTier}
                                  </span>
                                </div>
                                <p className="mt-2 text-2xl font-extrabold text-[#071534]">
                                  {aiResult.trafficIntelligence.estimatedMonthlyVisits}
                                  <span className="text-xs font-normal text-gray-500 ml-2">visits/mo</span>
                                </p>
                                <div className="mt-3 text-xs text-gray-600 space-y-1">
                                  <div className="flex justify-between">
                                    <span>Google Search:</span>
                                    <strong className="text-gray-800">{aiResult.trafficIntelligence.channelSplit.organicSearch}%</strong>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Google Maps 3-Pack:</span>
                                    <strong className="text-gray-800">{aiResult.trafficIntelligence.channelSplit.localMaps}%</strong>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>AI Citations:</span>
                                    <strong className="text-gray-800">{aiResult.trafficIntelligence.channelSplit.aiCitations}%</strong>
                                  </div>
                                </div>
                                <div className="mt-3 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded-lg">
                                  ⚠️ {aiResult.trafficIntelligence.missedTrafficMonthly}
                                </div>
                              </div>
                            )}

                            {aiResult.googleRatingIntelligence && (
                              <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-[1px] text-amber-700">
                                    GOOGLE RATING &amp; REPUTATION
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                                    {aiResult.googleRatingIntelligence.gbpStatus}
                                  </span>
                                </div>
                                <div className="mt-2 flex items-baseline gap-2">
                                  <span className="text-2xl font-extrabold text-[#071534]">
                                    {aiResult.googleRatingIntelligence.rating}
                                  </span>
                                  <span className="text-amber-400 text-base">★★★★★</span>
                                  <span className="text-xs text-gray-500">
                                    ({aiResult.googleRatingIntelligence.reviewCountText})
                                  </span>
                                </div>
                                <div className="mt-3 text-xs text-gray-600 space-y-1">
                                  <div className="flex justify-between">
                                    <span>Customer Sentiment:</span>
                                    <strong className="text-emerald-700">{aiResult.googleRatingIntelligence.sentiment}% Positive</strong>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Google Maps Rank Impact:</span>
                                    <strong className="text-blue-700 text-[11px]">{aiResult.googleRatingIntelligence.localPackImpact}</strong>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Review Schema:</span>
                                    <strong className={aiResult.googleRatingIntelligence.hasReviewSchema ? "text-emerald-700" : "text-amber-700"}>
                                      {aiResult.googleRatingIntelligence.hasReviewSchema ? "Active" : "Needs Sync"}
                                    </strong>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* OPPORTUNITIES */}

                        <div>

                          <p className="mb-3 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                            OPPORTUNITIES
                          </p>

                          <div className="grid gap-3 md:grid-cols-3">

                            {aiResult.opportunities.map(
                              (
                                item,
                                index
                              ) => (
                                <div
                                  key={`${item}-${index}`}
                                  className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4"
                                >

                                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-[10px] font-extrabold text-indigo-600">
                                    {index + 1}
                                  </div>

                                  <p className="mt-3 text-xs leading-5 text-gray-600">
                                    {item}
                                  </p>

                                </div>
                              )
                            )}

                          </div>

                        </div>


                        {/* ACTION PLAN */}

                        <div>

                          <p className="mb-3 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                            RECOMMENDED ACTION PLAN
                          </p>

                          <div className="space-y-3">

                            {aiResult.actions.map(
                              (
                                item,
                                index
                              ) => (
                                <div
                                  key={`${item}-${index}`}
                                  className="flex gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                                >

                                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-extrabold text-emerald-600">
                                    {index + 1}
                                  </div>

                                  <p className="text-xs leading-5 text-gray-600">
                                    {item}
                                  </p>

                                </div>
                              )
                            )}

                          </div>

                        </div>

                      </div>
                    )}

                </div>

              </div>

            </div>
          )}

          {/* =====================================================
              EMPTY STATE
          ====================================================== */}

          {!result &&
            !loading &&
            !error && (
              <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                  ⌖
                </div>

                <h3 className="mt-5 text-lg font-extrabold">
                  Ready to analyze
                </h3>

                <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-gray-400">
                  Enter any public website URL above
                  and start a complete SEO, GEO,
                  performance and AI analysis.
                </p>

              </div>
            )}

        </section>

      </div>

    </main>
  );
}