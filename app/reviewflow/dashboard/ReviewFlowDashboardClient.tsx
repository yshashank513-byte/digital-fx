"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BusinessProfile, BusinessCategory, ReviewFlowAnalyticsSummary } from "@/lib/reviewFlowTypes";
import { CATEGORIES_LIST, CATEGORY_QUESTIONS } from "@/lib/reviewFlowCategories";
import BrandedQRCard from "@/components/BrandedQRCard";

export default function ReviewFlowDashboardClient() {
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [analytics, setAnalytics] = useState<ReviewFlowAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"businesses" | "templates" | "analytics">("businesses");

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBiz, setEditingBiz] = useState<BusinessProfile | null>(null);
  const [formName, setFormName] = useState<string>("");
  const [formCategory, setFormCategory] = useState<BusinessCategory>("Packers & Movers");
  const [formAddress, setFormAddress] = useState<string>("");
  const [formCity, setFormCity] = useState<string>("");
  const [formPhone, setFormPhone] = useState<string>("");
  const [formWebsite, setFormWebsite] = useState<string>("");
  const [formGoogleUrl, setFormGoogleUrl] = useState<string>("");
  const [formColor, setFormColor] = useState<string>("#207de9");
  const [formSaving, setFormSaving] = useState<boolean>(false);

  // Standee Print Modal state
  const [standeeBiz, setStandeeBiz] = useState<BusinessProfile | null>(null);

  // Template Inspector Category
  const [inspectorCategory, setInspectorCategory] = useState<BusinessCategory>("Packers & Movers");

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string>("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  // Load Businesses and Analytics
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reviewflow/businesses?analytics=true");
      const data = await res.json();
      if (data.success) {
        setBusinesses(data.businesses || []);
        setAnalytics(data.analytics || null);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Open modal for new business
  const handleOpenAdd = () => {
    setEditingBiz(null);
    setFormName("");
    setFormCategory("Packers & Movers");
    setFormAddress("");
    setFormCity("");
    setFormPhone("");
    setFormWebsite("");
    setFormGoogleUrl("");
    setFormColor("#207de9");
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (biz: BusinessProfile) => {
    setEditingBiz(biz);
    setFormName(biz.name);
    setFormCategory(biz.category);
    setFormAddress(biz.address);
    setFormCity(biz.city || "");
    setFormPhone(biz.phone || "");
    setFormWebsite(biz.website || "");
    setFormGoogleUrl(biz.googleReviewUrl);
    setFormColor(biz.brandColor || "#207de9");
    setIsModalOpen(true);
  };

  // Save business
  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formGoogleUrl) {
      alert("Please provide Business Name and Google Review URL.");
      return;
    }

    setFormSaving(true);
    try {
      const payload: Partial<BusinessProfile> = {
        id: editingBiz ? editingBiz.id : undefined,
        name: formName,
        category: formCategory,
        address: formAddress,
        city: formCity,
        phone: formPhone,
        website: formWebsite,
        googleReviewUrl: formGoogleUrl,
        brandColor: formColor,
      };

      const res = await fetch("/api/reviewflow/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        showToast(editingBiz ? "Business updated successfully!" : "New business added successfully!");
        loadData();
      } else {
        alert(json.error || "Failed to save business.");
      }
    } catch (err: any) {
      alert(err.message || "Network error while saving.");
    } finally {
      setFormSaving(false);
    }
  };

  // Copy Review link to clipboard
  const handleCopyLink = (bizId: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.digitalfx.in";
    const url = `${origin}/r/${bizId}`;
    navigator.clipboard.writeText(url);
    showToast(`Copied ${url} to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#207de9] selection:text-white">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-bounce">
          <span>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="Digital FX" className="h-10 sm:h-11 w-auto object-contain" />
            </Link>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[#080d24]">ReviewFlow AI</span>
              <span className="text-[10px] font-bold bg-[#207de9]/10 text-[#207de9] px-2 py-0.5 rounded-full border border-blue-200">
                Dashboard
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/reviewflow"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 transition hidden sm:inline-block"
            >
              ← Back to Product Page
            </Link>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-white bg-[#207de9] hover:bg-blue-600 px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>+ Add Business</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* BANNER WITH GOOGLE VERIFICATION STATUS */}
        <div className="bg-gradient-to-r from-[#080d24] via-[#0f172a] to-[#1e293b] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Official Google Business Profile Review Engine Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              Google Review QR Generation &amp; Flow Automation
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 font-normal leading-relaxed">
              Customers scan your tabletop QR code, answer tailored questions about their actual visit, receive an AI-assisted natural draft, and post straight to Google in under 30 seconds.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-2 shrink-0">
            <Link
              href="/r/digital-fx?src=qr"
              target="_blank"
              className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition shadow-sm flex items-center gap-1.5"
            >
              <span>📱 Test Digital FX QR</span>
              <span>↗</span>
            </Link>
            <button
              onClick={() => {
                const dfx = businesses.find((b) => b.id === "digital-fx");
                if (dfx) setStandeeBiz(dfx);
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>🖨️ Print Digital FX Standee</span>
            </button>
          </div>
        </div>

        {/* 3. KEY METRICS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Businesses</div>
            <div className="text-2xl sm:text-3xl font-black text-[#080d24] mt-1">{analytics?.totalBusinesses || businesses.length}</div>
            <div className="text-[10px] text-teal-600 font-bold mt-1">Multi-Category Active</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active QR Codes</div>
            <div className="text-2xl sm:text-3xl font-black text-[#207de9] mt-1">{analytics?.totalQRCodes || businesses.length}</div>
            <div className="text-[10px] text-blue-600 font-bold mt-1">High-Res Vectors Ready</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Scans</div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1">{analytics?.totalScans || 725}</div>
            <div className="text-[10px] text-slate-400 font-medium mt-1">From Physical QRs</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Page Visits</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{analytics?.totalVisits || 646}</div>
            <div className="text-[10px] text-slate-400 font-medium mt-1">Mobile Questionnaires</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Drafts Generated</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{analytics?.totalDrafts || 546}</div>
            <div className="text-[10px] text-amber-600 font-bold mt-1">Zero Writer&apos;s Block</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Google Clicks</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{analytics?.totalGoogleClicks || 454}</div>
            <div className="text-[10px] text-emerald-600 font-bold mt-1">{analytics?.conversionRate || 70}% Conversion Rate</div>
          </div>
        </div>

        {/* 4. TABS NAVIGATION */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("businesses")}
            className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === "businesses"
                ? "bg-[#080d24] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            🏢 Businesses &amp; QR Codes ({businesses.length})
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === "templates"
                ? "bg-[#080d24] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            📋 Category Question Templates (14)
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === "analytics"
                ? "bg-[#080d24] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            📊 Live Activity &amp; Conversion Feed
          </button>
        </div>

        {/* 5. TAB 1: BUSINESSES & QR CODES */}
        {activeTab === "businesses" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Configured Business Profiles</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Each business gets a dedicated mobile review link and dynamic high-resolution QR standee.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="self-start sm:self-auto text-xs font-bold bg-white border border-slate-300 hover:border-slate-400 px-4 py-2 rounded-xl shadow-xs transition cursor-pointer"
              >
                + Register New Business
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-400 text-sm">Loading businesses...</div>
            ) : businesses.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
                <div className="text-4xl mb-2">🏢</div>
                <h3 className="text-base font-bold text-slate-800">No businesses added yet</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">Click below to add your first business profile.</p>
                <button
                  onClick={handleOpenAdd}
                  className="px-5 py-2.5 rounded-xl bg-[#207de9] text-white font-bold text-xs"
                >
                  + Add Business Profile
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((biz) => {
                  const reviewUrl = `/r/${biz.id}`;
                  const qrEndpointPng = `/api/reviewflow/qr?businessId=${biz.id}&format=png`;
                  const qrEndpointSvg = `/api/reviewflow/qr?businessId=${biz.id}&format=svg`;

                  return (
                    <div
                      key={biz.id}
                      className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Header badge & Category */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-2.5">
                            {biz.logoUrl ? (
                              <img src={biz.logoUrl} alt={biz.name} className="h-9 w-auto object-contain rounded" />
                            ) : (
                              <div
                                className="h-9 w-9 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-xs"
                                style={{ backgroundColor: biz.brandColor || "#207de9" }}
                              >
                                {biz.name.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <h3 className="text-base font-extrabold text-slate-900 leading-snug line-clamp-1">
                                {biz.name}
                              </h3>
                              <span className="text-[11px] font-semibold text-slate-500">
                                /{biz.id}
                              </span>
                            </div>
                          </div>

                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#207de9] border border-blue-200/80 whitespace-nowrap">
                            {biz.category}
                          </span>
                        </div>

                        {/* Address & Info */}
                        <p className="text-xs text-slate-600 line-clamp-2 mb-4 font-normal">
                          📍 {biz.address}
                        </p>

                        {/* Interactive QR Display */}
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4 mb-4">
                          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs shrink-0">
                            <img
                              src={qrEndpointPng}
                              alt={`${biz.name} QR Code`}
                              className="w-24 h-24 object-contain rounded"
                            />
                          </div>

                          <div className="space-y-1.5 text-xs">
                            <div className="text-slate-500 font-medium">QR Link:</div>
                            <div className="font-mono text-[11px] text-[#207de9] font-bold truncate max-w-[150px]">
                              /r/{biz.id}
                            </div>
                            <div className="flex items-center gap-2 pt-1 text-[11px]">
                              <span className="font-extrabold text-slate-800">{biz.totalScans}</span> scans
                              <span>•</span>
                              <span className="font-extrabold text-emerald-600">{biz.totalGoogleClicks}</span> clicks
                            </div>
                          </div>
                        </div>

                        {/* Quick Action Buttons for QR */}
                        <div className="grid grid-cols-2 gap-2 text-xs font-bold mb-3">
                          <a
                            href={qrEndpointPng}
                            download={`${biz.id}-branded-qr.png`}
                            className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-center transition flex items-center justify-center gap-1 cursor-pointer"
                            title="Download print-ready PNG with company branding"
                          >
                            <span>📥 PNG</span>
                          </a>
                          <a
                            href={qrEndpointSvg}
                            download={`${biz.id}-branded-qr.svg`}
                            className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-center transition flex items-center justify-center gap-1 cursor-pointer"
                            title="Download vector SVG with company branding"
                          >
                            <span>📐 SVG</span>
                          </a>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCopyLink(biz.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                            title="Copy short link"
                          >
                            📋
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(biz)}
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                            title="Edit business profile"
                          >
                            ✏️
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setStandeeBiz(biz)}
                            className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold border border-teal-200 transition cursor-pointer"
                          >
                            🖨️ Standee
                          </button>
                          <Link
                            href={`${reviewUrl}?src=qr`}
                            target="_blank"
                            className="px-3 py-1.5 rounded-xl bg-[#080d24] hover:bg-[#207de9] text-white text-xs font-bold transition"
                          >
                            Test Flow →
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 6. TAB 2: CATEGORY QUESTION TEMPLATES INSPECTOR */}
        {activeTab === "templates" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Category Question &amp; Wording Templates</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ReviewFlow AI adapts its questions dynamically according to the business category to produce natural, authentic drafts.
              </p>
            </div>

            {/* Category Selector Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              {CATEGORIES_LIST.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setInspectorCategory(cat.name)}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer border ${
                    inspectorCategory === cat.name
                      ? "bg-[#207de9] text-white border-[#207de9] shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span className="mr-1">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Questions for selected category */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-sm font-extrabold text-[#080d24]">
                  Active Questionnaire for: <span className="text-[#207de9]">{inspectorCategory}</span>
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {(CATEGORY_QUESTIONS[inspectorCategory] || []).length} Question Prompts
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(CATEGORY_QUESTIONS[inspectorCategory] || []).map((q, idx) => (
                  <div key={q.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-2">
                      <span className="h-5 w-5 rounded-full bg-blue-100 text-[#207de9] flex items-center justify-center font-black text-[11px]">
                        {idx + 1}
                      </span>
                      <span>{q.question}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pl-7">
                      {q.options.map((opt) => (
                        <span key={opt} className="text-[11px] bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. TAB 3: LIVE ANALYTICS & FEEDBACK FEED */}
        {activeTab === "analytics" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Recent Customer Review Sessions &amp; Logs</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time stream of customer QR scans, draft completions, and Google review clicks.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-black tracking-wider">
                    <th className="py-3 px-3">Session</th>
                    <th className="py-3 px-3">Business</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Rating</th>
                    <th className="py-3 px-3">Generated Review Draft</th>
                    <th className="py-3 px-3">Google Clicked</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(analytics?.recentSessions || []).map((sess) => (
                    <tr key={sess.sessionId} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-mono font-bold text-slate-600">{sess.sessionId}</td>
                      <td className="py-3 px-3 font-extrabold text-slate-900">{sess.businessId}</td>
                      <td className="py-3 px-3 font-medium text-slate-600">{sess.category}</td>
                      <td className="py-3 px-3 text-amber-500 font-bold">
                        {"★".repeat(sess.customerRating)} ({sess.customerRating}/5)
                      </td>
                      <td className="py-3 px-3 text-slate-700 italic max-w-sm truncate">
                        &ldquo;{sess.finalReviewText || sess.generatedDraft}&rdquo;
                      </td>
                      <td className="py-3 px-3">
                        {sess.clickedGoogleReview ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            ✓ Post Clicked
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium text-[11px]">Draft Only</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* =========================================================================
          MODAL: ADD / EDIT BUSINESS PROFILE
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl my-8 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingBiz ? "Edit Business Profile" : "Register New Business Profile"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter details to generate your category questions and QR code.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBusiness} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Digital FX, Speedy Packers, Royal Jewellers..."
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#207de9]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Business Category *
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as BusinessCategory)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#207de9] font-medium"
                >
                  {CATEGORIES_LIST.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Google Business Profile Review URL *
                </label>
                <input
                  type="url"
                  required
                  value={formGoogleUrl}
                  onChange={(e) => setFormGoogleUrl(e.target.value)}
                  placeholder="https://g.page/r/... or https://search.google.com/local/writereview?placeid=..."
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#207de9]"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Tip: Get this from your Google Business Profile &gt; &quot;Ask for reviews&quot; button.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    City / Area
                  </label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="e.g. Ghaziabad, Delhi NCR"
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#207de9]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+91 93198 07273"
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#207de9]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Physical Address
                </label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="e.g. Shop No. 210, 2nd Floor, Orbit Plaza, Crossings Republik"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#207de9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={formWebsite}
                    onChange={(e) => setFormWebsite(e.target.value)}
                    placeholder="https://www.digitalfx.in"
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#207de9]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Brand Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formColor}
                      onChange={(e) => setFormColor(e.target.value)}
                      className="h-10 w-12 rounded border border-slate-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={formColor}
                      onChange={(e) => setFormColor(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#207de9] hover:bg-blue-600 text-white font-extrabold shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {formSaving ? "Saving..." : editingBiz ? "Save Changes" : "Create Business Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: TABLETOP TENT CARD & STANDEE PRINT MOCKUP
          ========================================================================= */}
      {standeeBiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl my-8 animate-fadeIn text-center">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Printable Counter Standee
              </span>
              <button
                type="button"
                onClick={() => setStandeeBiz(null)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* STANDEE MOCKUP PREVIEW */}
            <div id="standee-print-area" className="max-w-sm mx-auto">
              <BrandedQRCard
                businessName={standeeBiz.name}
                businessId={standeeBiz.id}
                showActions={false}
              />
            </div>

            {/* Print Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="py-3 px-5 rounded-xl font-extrabold text-white text-xs bg-slate-900 hover:bg-[#207de9] transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>🖨️ Print Standee / Save PDF</span>
              </button>
              <a
                href={`/api/reviewflow/qr?businessId=${standeeBiz.id}&format=png`}
                download={`${standeeBiz.id}-branded-qr.png`}
                className="py-3 px-4 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>📥 PNG</span>
              </a>
              <a
                href={`/api/reviewflow/qr?businessId=${standeeBiz.id}&format=svg`}
                download={`${standeeBiz.id}-branded-qr.svg`}
                className="py-3 px-4 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>📐 SVG</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
