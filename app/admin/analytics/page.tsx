"use client";

import { useState, useEffect, useCallback } from "react";
import { ReviewFlowAnalyticsSummary } from "@/lib/reviewFlowTypes";

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<ReviewFlowAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reviewflow/businesses?analytics=true", {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success && data.analytics) {
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error("Error loading analytics:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="p-16 text-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#207de9] mx-auto" />
        <p className="text-xs font-bold text-slate-500">Loading conversion analytics...</p>
      </div>
    );
  }

  const visits = analytics?.totalVisits || 0;
  const drafts = analytics?.totalDrafts || 0;
  const googleClicks = analytics?.totalGoogleClicks || 0;
  const scans = analytics?.totalScans || 0;

  const draftRate = visits > 0 ? Math.round((drafts / visits) * 100) : 0;
  const googleRate = visits > 0 ? Math.round((googleClicks / visits) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📈</span>
            <h1 className="text-xl md:text-2xl font-black text-[#080d24] tracking-tight">
              ReviewFlow AI Conversion &amp; Scan Funnel
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Realtime customer scan conversion rates, AI draft formulations, and Google Review redirection metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>🔄 Refresh</span>
          </button>
        </div>
      </div>

      {/* 4-Stage Conversion Funnel */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-[#080d24]">Customer Feedback Conversion Funnel</h3>
            <p className="text-xs text-slate-400">Step-by-step progression from QR code scan to verified Google review click</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 font-mono text-xs font-black text-emerald-700 border border-emerald-200">
            {googleRate}% Overall Conversion
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Stage 1 • Scans
            </span>
            <div className="text-2xl font-black text-[#080d24]">{scans}</div>
            <p className="text-[11px] text-slate-500">Total QR scans captured</p>
            <div className="h-1.5 w-full bg-slate-200 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-slate-400 w-full rounded-full" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#207de9]">
              Stage 2 • Desk Visits
            </span>
            <div className="text-2xl font-black text-[#207de9]">{visits}</div>
            <p className="text-[11px] text-slate-500">
              {scans > 0 ? Math.round((visits / scans) * 100) : 100}% page open rate
            </p>
            <div className="h-1.5 w-full bg-blue-100 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-[#207de9] rounded-full"
                style={{ width: `${scans > 0 ? Math.min(100, Math.round((visits / scans) * 100)) : 100}%` }}
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
              Stage 3 • Drafts Made
            </span>
            <div className="text-2xl font-black text-indigo-700">{drafts}</div>
            <p className="text-[11px] text-slate-500">{draftRate}% draft completion rate</p>
            <div className="h-1.5 w-full bg-indigo-100 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${Math.min(100, draftRate)}%` }}
              />
            </div>
          </div>

          {/* Step 4 */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
              Stage 4 • Google Clicks
            </span>
            <div className="text-2xl font-black text-emerald-700">{googleClicks}</div>
            <p className="text-[11px] text-emerald-600 font-semibold">{googleRate}% direct review intent</p>
            <div className="h-1.5 w-full bg-emerald-200 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full"
                style={{ width: `${Math.min(100, googleRate)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Business Counts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-[#080d24]">Business Categories Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(analytics?.categoryBreakdown || {}).map(([cat, count]) => {
              const total = analytics?.totalBusinesses || 1;
              const pct = Math.round((count / total) * 100);

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">{cat}</span>
                    <span className="font-mono text-slate-500 font-semibold">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#207de9] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operational Status Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-[#080d24]">System Operational Status</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Active QRs</span>
              <span className="text-xl font-black text-emerald-900">{analytics?.activeQRCodes}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Pending Approvals</span>
              <span className="text-xl font-black text-amber-900">{analytics?.pendingApprovals}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Deactivated Desks</span>
              <span className="text-xl font-black text-slate-800">{analytics?.deactivatedQRCodes}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] font-bold text-[#207de9] uppercase block">Total Businesses</span>
              <span className="text-xl font-black text-[#207de9]">{analytics?.totalBusinesses}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sessions Audit Log */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-[#080d24]">Recent Customer Review Drafts</h3>
        {(!analytics?.recentSessions || analytics.recentSessions.length === 0) ? (
          <p className="text-xs text-slate-400 py-4 text-center">No customer review sessions recorded yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {analytics.recentSessions.map((s) => (
              <div key={s.sessionId} className="py-3.5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#080d24]">{s.businessId}</span>
                    <span className="text-amber-500 font-bold">{"★".repeat(s.customerRating)}</span>
                    <span className="rounded-full bg-slate-100 text-slate-600 px-2 py-0.2 text-[10px] font-bold">
                      {s.category}
                    </span>
                  </div>
                  <span className="text-[10.5px] text-slate-400 font-mono">
                    {new Date(s.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-slate-600 italic bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                  &quot;{s.finalReviewText || s.generatedDraft}&quot;
                </p>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className={s.clickedGoogleReview ? "text-emerald-600 font-bold" : "text-slate-400"}>
                    {s.clickedGoogleReview ? "✓ Clicked to Post on Google" : "Draft Formulation Only"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
