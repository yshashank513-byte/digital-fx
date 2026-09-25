"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/adminFetch";
import { BusinessProfile } from "@/lib/reviewFlowTypes";
import AddBusinessModal from "@/components/admin/AddBusinessModal";

interface ReviewFlowAnalytics {
  totalBusinesses: number;
  totalQRCodes: number;
  pendingApprovals: number;
  activeQRCodes: number;
  deactivatedQRCodes: number;
  totalScans: number;
  totalVisits: number;
  totalDrafts: number;
  totalGoogleClicks: number;
  conversionRate: number;
}

export default function ReviewFlowOverviewPage() {
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [analytics, setAnalytics] = useState<ReviewFlowAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchOverview = useCallback(async () => {
    try {
      setError("");
      const res = await adminFetch("/api/reviewflow/businesses?analytics=true");
      if (!res.ok) {
        throw new Error(`Failed to load ReviewFlow data (HTTP ${res.status})`);
      }
      const data = await res.json();
      if (data.success) {
        setBusinesses(data.businesses || []);
        setAnalytics(data.analytics || null);
      } else {
        throw new Error(data.error || "Failed to fetch ReviewFlow analytics");
      }
    } catch (err: any) {
      console.error("ReviewFlow Overview fetch error:", err);
      setError(err.message || "Failed to load ReviewFlow module metrics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  // Derived calculations
  const totalScans = analytics?.totalScans || businesses.reduce((acc, b) => acc + (b.totalScans || 0), 0);
  const totalVisits = analytics?.totalVisits || businesses.reduce((acc, b) => acc + (b.totalVisits || 0), 0);
  const totalDrafts = analytics?.totalDrafts || businesses.reduce((acc, b) => acc + (b.totalDrafts || 0), 0);
  const totalGoogleClicks = analytics?.totalGoogleClicks || businesses.reduce((acc, b) => acc + (b.totalGoogleClicks || 0), 0);
  const overallConversionRate = totalScans > 0 ? Math.round((totalGoogleClicks / totalScans) * 100) : 0;
  const pendingCount = analytics?.pendingApprovals ?? businesses.filter((b) => b.status === "pending_approval").length;
  const activeCount = analytics?.activeQRCodes ?? businesses.filter((b) => b.status === "active").length;

  // The 5 Core Rectangle Modules requested by user
  const modules = [
    {
      title: "Businesses",
      subtitle: "Verified Directory & Place IDs",
      href: "/admin/businesses",
      icon: (
        <svg className="w-6 h-6 text-[#207de9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M9 22v-4h6v4" />
          <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
        </svg>
      ),
      iconBg: "bg-blue-50 border-blue-200",
      accentBorder: "hover:border-[#207de9]",
      badge: `${businesses.length} Registered`,
      badgeColor: "bg-blue-50 text-[#207de9] border-blue-200",
      description: "Manage registered business profiles, Google Maps Place IDs, brand colors, contact details, and custom review landing pages.",
      highlights: [
        { label: "Active Profiles", value: activeCount },
        { label: "Pending", value: pendingCount },
      ],
      ctaText: "Open Businesses Page →",
      btnColor: "bg-[#207de9] text-white hover:bg-[#1866c2]",
    },
    {
      title: "Review QR Codes",
      subtitle: "Branded QR Studio & Printables",
      href: "/admin/review-qr",
      icon: (
        <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      iconBg: "bg-indigo-50 border-indigo-200",
      accentBorder: "hover:border-indigo-500",
      badge: `${activeCount} Live QRs`,
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      description: "Generate high-resolution SVG & PNG marketing QR codes with custom Digital FX frames, download print cards, and test live customer flows.",
      highlights: [
        { label: "Total Scans", value: totalScans },
        { label: "Print Ready", value: "SVG / PNG" },
      ],
      ctaText: "Open Review QR Codes →",
      btnColor: "bg-indigo-600 text-white hover:bg-indigo-700",
    },
    {
      title: "Pending Approvals",
      subtitle: "Safety & Link Verification",
      href: "/admin/approvals",
      icon: (
        <svg className="w-6 h-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      iconBg: "bg-amber-50 border-amber-200",
      accentBorder: "hover:border-amber-500",
      badge: pendingCount > 0 ? `${pendingCount} Pending` : "Queue Clear",
      badgeColor: pendingCount > 0 ? "bg-amber-100 text-amber-900 border-amber-300 animate-pulse font-bold" : "bg-emerald-50 text-emerald-700 border-emerald-200",
      description: "Administrative safety gate for newly added businesses. Verify Google Place IDs and customer routing before QR codes are made public.",
      highlights: [
        { label: "Queue Count", value: pendingCount },
        { label: "Approval Status", value: pendingCount > 0 ? "Action Needed" : "All Clear" },
      ],
      ctaText: "Open Pending Approvals →",
      btnColor: "bg-amber-600 text-white hover:bg-amber-700",
    },
    {
      title: "Outreach Campaigns",
      subtitle: "Automated WhatsApp & SMS Invites",
      href: "/admin/reviewflow/campaigns",
      icon: (
        <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      iconBg: "bg-emerald-50 border-emerald-200",
      accentBorder: "hover:border-emerald-500",
      badge: "Multi-Channel",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      description: "Dispatch automated WhatsApp, SMS, and email review invitation campaigns to past customers with personalized AI-assisted shortlinks.",
      highlights: [
        { label: "Channels", value: "WhatsApp / SMS" },
        { label: "Smart Gating", value: "Active" },
      ],
      ctaText: "Open Outreach Campaigns →",
      btnColor: "bg-emerald-600 text-white hover:bg-emerald-700",
    },
    {
      title: "Analytics & Funnel",
      subtitle: "Full-Funnel Conversion Intelligence",
      href: "/admin/analytics",
      icon: (
        <svg className="w-6 h-6 text-[#207de9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      iconBg: "bg-cyan-50 border-cyan-200",
      accentBorder: "hover:border-cyan-500",
      badge: `${overallConversionRate}% Conv. Rate`,
      badgeColor: "bg-cyan-50 text-cyan-800 border-cyan-200",
      description: "End-to-end 4-stage funnel tracking: QR Scans → Customer Sentiment Experience → AI Draft Generated → Google Review Published.",
      highlights: [
        { label: "AI Drafts", value: totalDrafts },
        { label: "Google Clicks", value: totalGoogleClicks },
      ],
      ctaText: "Open Analytics & Funnel →",
      btnColor: "bg-slate-900 text-white hover:bg-slate-800",
    },
  ];

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* =========================================================================
          MODULE HEADER & ACTIONS
          ========================================================================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 border border-blue-200 text-[#207de9] text-base font-black shadow-xs">
              ★
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#080d24]">
                  ReviewFlow Hub
                </h1>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700 border border-emerald-200">
                  Operations Center
                </span>
              </div>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
                Centralized dashboard for business review management, branded QR codes, approvals, outreach campaigns, and funnel analytics.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/reviewflow/settings"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-[#080d24] transition"
          >
            <span>⚙</span> Global Settings
          </Link>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#207de9] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1866c2] transition cursor-pointer"
          >
            <span>+</span> Add Business
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODULE SUB-NAVIGATION TABS BAR
          ========================================================================= */}
      <div className="flex overflow-x-auto scrollbar-none gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <Link
          href="/admin/reviewflow"
          className="rounded-lg bg-[#207de9] px-3.5 py-1.5 text-white shadow-xs"
        >
          ReviewFlow Hub
        </Link>
        <Link
          href="/admin/businesses"
          className="rounded-lg px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition flex items-center gap-1.5"
        >
          <span>Businesses</span>
          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded text-[10px]">
            {businesses.length}
          </span>
        </Link>
        <Link
          href="/admin/review-qr"
          className="rounded-lg px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
        >
          Review QR Codes
        </Link>
        <Link
          href="/admin/approvals"
          className="rounded-lg px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition flex items-center gap-1.5"
        >
          <span>Pending Approvals</span>
          {pendingCount > 0 && (
            <span className="rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] font-black text-white">
              {pendingCount}
            </span>
          )}
        </Link>
        <Link
          href="/admin/reviewflow/campaigns"
          className="rounded-lg px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
        >
          Outreach Campaigns
        </Link>
        <Link
          href="/admin/analytics"
          className="rounded-lg px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
        >
          Analytics &amp; Funnel
        </Link>
      </div>

      {/* =========================================================================
          THE 5 CORE RECTANGLE MODULES (Requested by user)
          ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-extrabold text-[#080d24]">
              ReviewFlow AI Modules
            </h2>
            <p className="text-xs text-slate-500">
              Click any rectangle module below to open its respective full management page.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            5 Dedicated Modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod, idx) => (
            <Link
              key={idx}
              href={mod.href}
              className={`group relative rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${mod.accentBorder}`}
            >
              <div>
                {/* Card Top: Icon & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform ${mod.iconBg}`}>
                    {mod.icon}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${mod.badgeColor}`}>
                    {mod.badge}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-lg font-black text-[#080d24] group-hover:text-[#207de9] transition tracking-tight">
                  {mod.title}
                </h3>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                  {mod.subtitle}
                </p>

                {/* Description */}
                <p className="mt-2.5 text-xs text-slate-600 leading-relaxed font-normal">
                  {mod.description}
                </p>

                {/* Metric Highlights */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  {mod.highlights.map((h, i) => (
                    <div key={i} className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {h.label}
                      </span>
                      <span className="block text-sm font-extrabold text-[#080d24] mt-0.5">
                        {h.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-[#207de9] group-hover:underline flex items-center gap-1">
                  <span>{mod.ctaText}</span>
                </span>
                <span className="text-slate-400 group-hover:text-[#207de9] group-hover:translate-x-1 transition-transform text-sm">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* =========================================================================
          KEY PERFORMANCE INDICATORS (KPIs)
          ========================================================================= */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Businesses</p>
          <p className="mt-1 text-2xl font-black text-[#080d24]">{businesses.length}</p>
          <p className="mt-1 text-[10px] text-slate-500">Registered profiles</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active QRs</p>
          <p className="mt-1 text-2xl font-black text-emerald-600">{activeCount}</p>
          <p className="mt-1 text-[10px] text-slate-500">Live dynamic links</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Scans</p>
          <p className="mt-1 text-2xl font-black text-[#207de9]">{totalScans}</p>
          <p className="mt-1 text-[10px] text-slate-500">Physical QR scans</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Page Visits</p>
          <p className="mt-1 text-2xl font-black text-indigo-600">{totalVisits}</p>
          <p className="mt-1 text-[10px] text-slate-500">Landing views</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">AI Reviews</p>
          <p className="mt-1 text-2xl font-black text-amber-600">{totalDrafts}</p>
          <p className="mt-1 text-[10px] text-slate-500">Drafted copies</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Google Clicks</p>
          <p className="mt-1 text-2xl font-black text-emerald-700">{totalGoogleClicks}</p>
          <div className="mt-1 flex items-center gap-1">
            <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800">
              {overallConversionRate}% Conv.
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4-STAGE CONVERSION FUNNEL PIPELINE
          ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h2 className="text-sm font-black text-[#080d24]">ReviewFlow 4-Stage Conversion Funnel</h2>
            <p className="text-xs text-slate-500">End-to-end journey from customer QR scan to published Google review</p>
          </div>
          <Link
            href="/admin/analytics"
            className="text-xs font-bold text-[#207de9] hover:underline mt-2 sm:mt-0"
          >
            Detailed Funnel Analytics →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Step 1 */}
          <div className="relative rounded-xl border border-blue-200 bg-blue-50/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase text-blue-700">Step 1: Scan</span>
              <span className="text-[10px] font-bold bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full">100%</span>
            </div>
            <p className="mt-2 text-2xl font-black text-[#080d24]">{totalScans}</p>
            <p className="text-[11px] text-slate-500">Customer scans branded QR code</p>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-xl border border-indigo-200 bg-indigo-50/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase text-indigo-700">Step 2: Experience</span>
              <span className="text-[10px] font-bold bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-full">
                {totalScans > 0 ? Math.round((totalVisits / totalScans) * 100) : 0}%
              </span>
            </div>
            <p className="mt-2 text-2xl font-black text-[#080d24]">{totalVisits}</p>
            <p className="text-[11px] text-slate-500">Customer rates service & answers</p>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-xl border border-amber-200 bg-amber-50/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase text-amber-700">Step 3: AI Draft</span>
              <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                {totalVisits > 0 ? Math.round((totalDrafts / totalVisits) * 100) : 0}%
              </span>
            </div>
            <p className="mt-2 text-2xl font-black text-[#080d24]">{totalDrafts}</p>
            <p className="text-[11px] text-slate-500">AI crafts authentic review copy</p>
          </div>

          {/* Step 4 */}
          <div className="relative rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase text-emerald-700">Step 4: Google Click</span>
              <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                {overallConversionRate}%
              </span>
            </div>
            <p className="mt-2 text-2xl font-black text-emerald-800">{totalGoogleClicks}</p>
            <p className="text-[11px] text-slate-500">Customer pastes review on Google</p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          REGISTERED BUSINESSES QUICK TABLE & ACTIONS
          ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 p-5 gap-3">
          <div>
            <h2 className="text-sm font-black text-[#080d24]">Active Business Registrations</h2>
            <p className="text-xs text-slate-500">Dynamic QR configurations and real-time performance</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/businesses"
              className="text-xs font-bold text-[#207de9] hover:underline"
            >
              Full Directory &amp; Controls ({businesses.length}) →
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading ReviewFlow data...</div>
        ) : businesses.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-bold text-slate-700">No businesses registered yet</p>
            <p className="mt-1 text-xs text-slate-500">Click &quot;Add Business&quot; to generate your first dynamic QR code.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#207de9] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1866c2]"
            >
              + Register Business Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-bold">Business</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-center">Scans</th>
                  <th className="py-3 px-4 font-bold text-center">AI Drafts</th>
                  <th className="py-3 px-4 font-bold text-center">Google Clicks</th>
                  <th className="py-3 px-4 font-bold text-center">Conv. Rate</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {businesses.slice(0, 10).map((biz) => {
                  const scans = biz.totalScans || 0;
                  const clicks = biz.totalGoogleClicks || 0;
                  const rate = scans > 0 ? Math.round((clicks / scans) * 100) : 0;

                  return (
                    <tr key={biz.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-bold text-[#080d24]">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full shrink-0"
                            style={{ backgroundColor: biz.brandColor || "#207de9" }}
                          />
                          <span className="truncate max-w-[200px]">{biz.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{biz.category}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            biz.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : biz.status === "pending_approval"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {biz.status === "active" ? "Active" : biz.status === "pending_approval" ? "Pending" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-slate-700">{scans}</td>
                      <td className="py-3 px-4 text-center font-semibold text-amber-600">{biz.totalDrafts || 0}</td>
                      <td className="py-3 px-4 text-center font-black text-emerald-700">{clicks}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-800">
                          {rate}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link
                          href={`/admin/review-qr?id=${biz.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition shadow-xs"
                          title="Generate & Download QR Code"
                        >
                          📲 QR
                        </Link>
                        <a
                          href={`/r/${biz.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-50 transition shadow-xs"
                          title="Open Customer Landing View"
                        >
                          ↗ Test Link
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Business Modal */}
      {isAddModalOpen && (
        <AddBusinessModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            fetchOverview();
          }}
        />
      )}
    </div>
  );
}
