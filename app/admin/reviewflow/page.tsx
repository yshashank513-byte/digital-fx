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
  recentSessions?: Array<{
    sessionId: string;
    businessId: string;
    category: string;
    customerRating: number;
    finalReviewText?: string;
    completed: boolean;
    clickedGoogleReview: boolean;
    createdAt: string;
  }>;
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
  const pendingCount = analytics?.pendingApprovals || businesses.filter((b) => b.status === "pending_approval").length;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* =========================================================================
          MODULE HEADER & QUICK ACTIONS
          ========================================================================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-[#207de9] text-base font-black">
              ★
            </span>
            <h1 className="text-2xl font-black tracking-tight text-[#080d24]">
              ReviewFlow AI Command Center
            </h1>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700 border border-emerald-200">
              Live Module
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Unified management for dynamic QR codes, AI-assisted Google reviews, and customer conversion funnels.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/review-qr"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-[#080d24] transition"
          >
            <span>📲</span> QR Code Studio
          </Link>
          <Link
            href="/admin/reviewflow/campaigns"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-[#080d24] transition"
          >
            <span>✉</span> Outreach Campaigns
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
          MODULE SUB-NAVIGATION TABS
          ========================================================================= */}
      <div className="flex overflow-x-auto scrollbar-none gap-2 border-b border-slate-200 pb-2">
        <Link
          href="/admin/reviewflow"
          className="rounded-lg bg-[#207de9] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs"
        >
          Overview
        </Link>
        <Link
          href="/admin/businesses"
          className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
        >
          Businesses ({businesses.length})
        </Link>
        <Link
          href="/admin/review-qr"
          className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
        >
          Branded QR Codes
        </Link>
        <Link
          href="/admin/approvals"
          className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
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
          className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
        >
          Campaigns
        </Link>
        <Link
          href="/admin/analytics"
          className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
        >
          Funnel Analytics
        </Link>
      </div>

      {/* =========================================================================
          PENDING APPROVALS ALERT (IF ANY)
          ========================================================================= */}
      {pendingCount > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white font-bold text-lg">
              ⏳
            </span>
            <div>
              <p className="text-xs font-bold">
                {pendingCount} business profile{pendingCount > 1 ? "s are" : " is"} awaiting administrative approval
              </p>
              <p className="text-[11px] text-amber-800">
                New QR registrations are paused until verified to safeguard customer destination links.
              </p>
            </div>
          </div>
          <Link
            href="/admin/approvals"
            className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-amber-700 transition shrink-0"
          >
            Review Approvals Queue →
          </Link>
        </div>
      )}

      {/* =========================================================================
          KEY PERFORMANCE INDICATORS (KPIs)
          ========================================================================= */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Businesses</p>
          <p className="mt-1 text-2xl font-black text-[#080d24]">{businesses.length}</p>
          <p className="mt-1 text-[10px] text-slate-500">Registered clients</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active QRs</p>
          <p className="mt-1 text-2xl font-black text-emerald-600">
            {businesses.filter((b) => b.status === "active").length}
          </p>
          <p className="mt-1 text-[10px] text-slate-500">Live dynamic destinations</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Scans</p>
          <p className="mt-1 text-2xl font-black text-[#207de9]">{totalScans}</p>
          <p className="mt-1 text-[10px] text-slate-500">Physical QR scans</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Page Visits</p>
          <p className="mt-1 text-2xl font-black text-indigo-600">{totalVisits}</p>
          <p className="mt-1 text-[10px] text-slate-500">Engaged landing views</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">AI Reviews Drafted</p>
          <p className="mt-1 text-2xl font-black text-amber-600">{totalDrafts}</p>
          <p className="mt-1 text-[10px] text-slate-500">Generated review texts</p>
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
          CONVERSION FUNNEL PIPELINE
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
              Full Directory & Controls ({businesses.length}) →
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

      {/* =========================================================================
          MODULE SHORTCUTS & RESOURCES
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/review-qr"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#207de9] hover:shadow-md transition group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#207de9] text-lg font-bold group-hover:bg-[#207de9] group-hover:text-white transition">
            📲
          </div>
          <h3 className="mt-3 text-sm font-black text-[#080d24]">Branded QR Code Studio</h3>
          <p className="mt-1 text-xs text-slate-500">
            Generate high-resolution PNG & SVG marketing QR cards with official Digital FX branding and support number.
          </p>
          <span className="mt-3 inline-flex items-center text-xs font-bold text-[#207de9]">
            Open QR Studio →
          </span>
        </Link>

        <Link
          href="/admin/reviewflow/campaigns"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#207de9] hover:shadow-md transition group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 text-lg font-bold group-hover:bg-emerald-600 group-hover:text-white transition">
            ✉
          </div>
          <h3 className="mt-3 text-sm font-black text-[#080d24]">Review Outreach Campaigns</h3>
          <p className="mt-1 text-xs text-slate-500">
            Send WhatsApp & SMS invitations to past clients with pre-filled templates and customized dynamic links.
          </p>
          <span className="mt-3 inline-flex items-center text-xs font-bold text-emerald-600">
            Create Campaign →
          </span>
        </Link>

        <Link
          href="/admin/reviewflow/settings"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#207de9] hover:shadow-md transition group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 text-lg font-bold group-hover:bg-slate-800 group-hover:text-white transition">
            ⚙
          </div>
          <h3 className="mt-3 text-sm font-black text-[#080d24]">ReviewFlow Global Settings</h3>
          <p className="mt-1 text-xs text-slate-500">
            Configure Google Review Place ID helpers, AI prompt templates, default brand accents, and fallback behavior.
          </p>
          <span className="mt-3 inline-flex items-center text-xs font-bold text-slate-700">
            Configure Settings →
          </span>
        </Link>
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
