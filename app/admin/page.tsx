"use client";

import { adminFetch } from "@/lib/adminFetch";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import CustomerDrawer, { DrawerRecord } from "../../components/admin/CustomerDrawer";
import AddBusinessModal from "../../components/admin/AddBusinessModal";

type Stats = {
  totalEnquiries: number;
  newEnquiries: number;
  totalBusinesses: number;
  pendingApprovals: number;
  activeQRCodes: number;
  deactivatedQRCodes: number;
  totalScans: number;
  reviewsGenerated: number;
  conversionRate: number;
  freeAnalyses: number;
  paidAnalyses: number;
  strategicProposals: number;
  totalRevenue: number;
  pendingPayments: number;
};

type ActivityItem = {
  id: string;
  type: "analysis" | "enquiry" | "proposal" | "payment" | "review";
  customer: string;
  website: string;
  service: string;
  timestamp: string;
  status: string;
  amount?: number;
  score?: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalEnquiries: 0,
    newEnquiries: 0,
    totalBusinesses: 0,
    pendingApprovals: 0,
    activeQRCodes: 0,
    deactivatedQRCodes: 0,
    totalScans: 0,
    reviewsGenerated: 0,
    conversionRate: 0,
    freeAnalyses: 0,
    paidAnalyses: 0,
    strategicProposals: 0,
    totalRevenue: 0,
    pendingPayments: 0,
  });

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [recentProposals, setRecentProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<DrawerRecord | null>(null);
  const [isAddBusinessModalOpen, setIsAddBusinessModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setError("");
      const res = await adminFetch("/api/admin/stats", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Administrative session expired. Redirecting to login portal...");
          if (typeof window !== "undefined") {
            setTimeout(() => {
              window.location.href = "/admin/login?expired=true";
            }, 1000);
          }
          return;
        }
        throw new Error("Failed to load dashboard metrics (HTTP " + res.status + ").");
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Unable to load dashboard data.");
      }

      setStats({
        totalEnquiries: data.stats.totalEnquiries || 0,
        newEnquiries: data.stats.newEnquiries || 0,
        totalBusinesses: data.stats.totalBusinesses || 0,
        pendingApprovals: data.stats.pendingApprovals || 0,
        activeQRCodes: data.stats.activeQRCodes || 0,
        deactivatedQRCodes: data.stats.deactivatedQRCodes || 0,
        totalScans: data.stats.totalScans || 0,
        reviewsGenerated: data.stats.reviewsGenerated || 0,
        conversionRate: data.stats.conversionRate || 0,
        freeAnalyses: data.stats.freeAnalyses || 0,
        paidAnalyses: data.stats.paidAnalyses || 0,
        strategicProposals: data.stats.strategicProposals || 0,
        totalRevenue: data.stats.totalRevenue || 0,
        pendingPayments: data.stats.pendingPayments || 0,
      });

      setRecentActivity(data.recentActivity || []);
      setRecentEnquiries(data.recentEnquiries || []);
      setRecentProposals(data.recentProposals || []);
    } catch (err: any) {
      console.error("DASHBOARD DATA FETCH ERROR:", err);
      setError(err.message || "Failed to connect to administrative database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // SUPABASE REALTIME SUBSCRIPTIONS
    const channel = supabase
      .channel("admin-dashboard-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "enquiries" },
        () => {
          loadData();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "geo_analyses" },
        () => {
          loadData();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "payments" },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadData]);

  // Format Date for UI
  function formatDate(isoString?: string) {
    if (!isoString) return "—";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Activity click to open drawer
  function openActivityDrawer(act: ActivityItem) {
    if (act.type === "enquiry" || act.type === "proposal") {
      const numericId = act.id.replace(/^(enquiry|proposal)-/, "");
      const fullRecord =
        recentEnquiries.find((e) => String(e.id) === numericId) ||
        recentProposals.find((p) => String(p.id) === numericId);

      setSelectedRecord({
        id: numericId,
        type: act.type,
        name: act.customer,
        email: fullRecord?.email || "",
        phone: fullRecord?.phone || "",
        service: act.service,
        website: act.website,
        status: act.status,
        date: formatDate(act.timestamp),
        message: fullRecord?.message || `Service requested: ${act.service}`,
      });
    } else if (act.type === "review") {
      window.location.href = "/admin/businesses";
    }
  }

  function handleStatusChange(id: string | number, newStatus: string) {
    const strId = String(id);
    setRecentEnquiries((prev) =>
      prev.map((e) => (String(e.id) === strId ? { ...e, status: newStatus } : e))
    );
    setRecentProposals((prev) =>
      prev.map((p) => (String(p.id) === strId ? { ...p, status: newStatus } : p))
    );
    setRecentActivity((prev) =>
      prev.map((a) =>
        a.id.endsWith(`-${strId}`) ? { ...a, status: newStatus } : a
      )
    );
    loadData();
  }

  function getStatusBadge(status?: string) {
    switch (status?.toLowerCase()) {
      case "new":
        return "bg-blue-50 text-[#207de9] border-blue-200";
      case "contacted":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "in discussion":
      case "in review":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "won":
      case "success":
      case "paid":
      case "posted to google":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "lost":
      case "failed":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#207de9] animate-pulse" />
            <span className="text-[10.5px] font-extrabold uppercase tracking-widest text-[#207de9]">
              Unified Enterprise Dashboard
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#080d24] mt-1">
            Executive Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized operations hub for Customer Enquiries, ReviewFlow AI SaaS, Dynamic QR Lifecycle, and Revenue.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddBusinessModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#207de9] px-4 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-blue-600 transition cursor-pointer"
          >
            <span>+ Add Business</span>
          </button>

          <Link
            href="/admin/enquiries"
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            View Enquiries
          </Link>

          <button
            onClick={() => {
              setLoading(true);
              loadData();
            }}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <span className={loading ? "animate-spin" : ""}>↻</span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Pending Approvals Urgent Attention Banner */}
      {stats.pendingApprovals > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 via-white to-amber-50/50 p-5 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white font-black text-lg shadow-xs">
              ⏳
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-amber-950">
                  {stats.pendingApprovals} Business Profile{stats.pendingApprovals > 1 ? "s" : ""} Pending Approval
                </h3>
                <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-black text-amber-900 uppercase">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                Review submitted business details and approve to activate dynamic QR codes and customer review flows.
              </p>
            </div>
          </div>

          <Link
            href="/admin/approvals"
            className="rounded-xl bg-amber-600 hover:bg-amber-700 px-4.5 py-2 text-xs font-extrabold text-white transition shadow-xs shrink-0 text-center"
          >
            Open Approval Queue →
          </Link>
        </div>
      )}

      {error && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 font-medium shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-base">⚠️</span>
            <span>{error}</span>
          </div>
          {error.toLowerCase().includes("expired") || error.includes("401") ? (
            <Link
              href="/admin/login?expired=true"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition shrink-0"
            >
              Sign In Again →
            </Link>
          ) : (
            <button
              onClick={() => {
                setLoading(true);
                loadData();
              }}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white border border-rose-200 text-rose-700 font-bold text-xs hover:bg-rose-100 transition shrink-0 cursor-pointer"
            >
              Try Again ↻
            </button>
          )}
        </div>
      )}

      {/* =========================================================================
          UNIFIED 8 SAAS KPI SUMMARY CARDS
          ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Enquiries */}
        <Link
          href="/admin/enquiries"
          className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-[#207de9]/50 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Enquiries
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs text-[#207de9] font-bold">
              ◉
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-[#080d24] tabular-nums">
            {loading ? "..." : stats.totalEnquiries}
          </p>
          <div className="mt-1 flex items-center justify-between text-[10.5px] text-slate-500">
            <span>{stats.newEnquiries} New Leads</span>
            <span className="text-[#207de9] font-bold opacity-0 group-hover:opacity-100 transition">
              Manage →
            </span>
          </div>
        </Link>

        {/* Card 2: Businesses Registered */}
        <Link
          href="/admin/businesses"
          className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-[#207de9]/50 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Businesses
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-xs text-indigo-600 font-bold">
              🏢
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-[#080d24] tabular-nums">
            {loading ? "..." : stats.totalBusinesses}
          </p>
          <div className="mt-1 flex items-center justify-between text-[10.5px] text-slate-500">
            <span>ReviewFlow Registered</span>
            <span className="text-indigo-600 font-bold opacity-0 group-hover:opacity-100 transition">
              Directory →
            </span>
          </div>
        </Link>

        {/* Card 3: Pending Approvals */}
        <Link
          href="/admin/approvals"
          className={`group relative rounded-2xl border p-5 shadow-xs transition hover:shadow-md ${
            stats.pendingApprovals > 0
              ? "border-amber-300 bg-amber-50/60"
              : "border-slate-200/90 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              stats.pendingApprovals > 0 ? "text-amber-800" : "text-slate-400"
            }`}>
              Pending Approvals
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-xs text-amber-700 font-bold">
              ⏳
            </span>
          </div>
          <p className={`mt-3 text-2xl font-black tabular-nums ${
            stats.pendingApprovals > 0 ? "text-amber-900" : "text-[#080d24]"
          }`}>
            {loading ? "..." : stats.pendingApprovals}
          </p>
          <div className="mt-1 flex items-center justify-between text-[10.5px] text-slate-500">
            <span className={stats.pendingApprovals > 0 ? "text-amber-800 font-semibold" : ""}>
              {stats.pendingApprovals > 0 ? "Requires Verification" : "Queue Empty"}
            </span>
            <span className="text-amber-700 font-bold opacity-0 group-hover:opacity-100 transition">
              Review →
            </span>
          </div>
        </Link>

        {/* Card 4: Active QR Codes */}
        <Link
          href="/admin/review-qr?status=active"
          className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-emerald-500/50 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active QR Codes
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-xs text-emerald-600 font-bold">
              📲
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-emerald-600 tabular-nums">
            {loading ? "..." : stats.activeQRCodes}
          </p>
          <div className="mt-1 flex items-center justify-between text-[10.5px] text-slate-500">
            <span>{stats.deactivatedQRCodes} Paused</span>
            <span className="text-emerald-600 font-bold opacity-0 group-hover:opacity-100 transition">
              QR Hub →
            </span>
          </div>
        </Link>

        {/* Card 5: Review Link Visits / Scans */}
        <Link
          href="/admin/analytics"
          className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-blue-500/50 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Link Scans
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs text-[#207de9] font-bold">
              🔍
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-[#080d24] tabular-nums">
            {loading ? "..." : stats.totalScans}
          </p>
          <div className="mt-1 flex items-center justify-between text-[10.5px] text-slate-500">
            <span>Customer QR scans</span>
            <span className="text-[#207de9] font-bold opacity-0 group-hover:opacity-100 transition">
              Funnel →
            </span>
          </div>
        </Link>

        {/* Card 6: Customer Reviews Formulated */}
        <Link
          href="/admin/analytics"
          className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-indigo-500/50 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Reviews Generated
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-xs text-indigo-600 font-bold">
              ★
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-indigo-600 tabular-nums">
            {loading ? "..." : stats.reviewsGenerated}
          </p>
          <div className="mt-1 flex items-center justify-between text-[10.5px] text-slate-500">
            <span>{stats.conversionRate}% Conversion</span>
            <span className="text-indigo-600 font-bold opacity-0 group-hover:opacity-100 transition">
              Stats →
            </span>
          </div>
        </Link>

        {/* Card 7: Verified Revenue */}
        <Link
          href="/admin/payments"
          className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-emerald-500 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Verified Revenue
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-xs text-emerald-700 font-black">
              ₹
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-emerald-700 tabular-nums">
            {loading ? "..." : "₹" + stats.totalRevenue.toLocaleString("en-IN")}
          </p>
          <div className="mt-1 flex items-center justify-between text-[10.5px] text-slate-500">
            <span>Successful Payments</span>
            <span className="text-emerald-700 font-bold opacity-0 group-hover:opacity-100 transition">
              Payments →
            </span>
          </div>
        </Link>

        {/* Card 8: Strategic Proposals */}
        <Link
          href="/admin/proposals"
          className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-cyan-500/50 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Strategic Proposals
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-50 text-xs text-cyan-600 font-bold">
              📑
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-[#080d24] tabular-nums">
            {loading ? "..." : stats.strategicProposals}
          </p>
          <div className="mt-1 flex items-center justify-between text-[10.5px] text-slate-500">
            <span>High-Intent Leads</span>
            <span className="text-cyan-600 font-bold opacity-0 group-hover:opacity-100 transition">
              Proposals →
            </span>
          </div>
        </Link>
      </div>

      {/* =========================================================================
          RECENT ACTIVITY & QUICK OVERVIEW
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Activity Feed (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-black text-[#080d24] flex items-center gap-2">
                <span>Unified Operations Live Stream</span>
                <span className="text-[10px] font-extrabold bg-blue-50 text-[#207de9] border border-blue-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  REALTIME
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time chronological events from customer enquiries, proposals, ReviewFlow QR drafts, and payments.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-14 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No recent activity recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentActivity.map((act) => (
                <div
                  key={act.id}
                  onClick={() => openActivityDrawer(act)}
                  className="flex items-center justify-between py-3.5 px-3 -mx-3 rounded-xl hover:bg-slate-50 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={
                        "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black shrink-0 border " +
                        (act.type === "payment"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : act.type === "proposal"
                          ? "bg-cyan-50 text-cyan-600 border-cyan-200"
                          : act.type === "review"
                          ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                          : act.type === "analysis"
                          ? "bg-violet-50 text-violet-600 border-violet-200"
                          : "bg-blue-50 text-[#207de9] border-blue-200")
                      }
                    >
                      {act.type === "payment"
                        ? "₹"
                        : act.type === "proposal"
                        ? "📑"
                        : act.type === "review"
                        ? "★"
                        : act.type === "analysis"
                        ? "⚡"
                        : "◉"}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#080d24] group-hover:text-[#207de9] transition truncate">
                          {act.customer}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                          • {act.type === "review" ? "Google Review" : act.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {act.website && act.website !== "—" ? (
                          <span className="font-mono text-slate-700">{act.website} • </span>
                        ) : null}
                        <span>{act.service}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-4">
                    <span
                      className={
                        "inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border " +
                        getStatusBadge(act.status)
                      }
                    >
                      {act.amount ? "₹" + act.amount + " • " + act.status : act.status}
                    </span>
                    <p className="text-[10.5px] text-slate-400 mt-1">
                      {formatDate(act.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick Action Hub & Strategic Proposals (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick ReviewFlow QR Hub Card */}
          <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/70 via-white to-slate-50 p-5 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">📲</span>
              <div>
                <h3 className="text-sm font-black text-[#080d24]">ReviewFlow QR Hub</h3>
                <p className="text-[11px] text-slate-500">Fast management shortcuts</p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => setIsAddBusinessModalOpen(true)}
                className="w-full flex items-center justify-between rounded-xl bg-white border border-slate-200 p-2.5 text-xs font-bold text-slate-700 hover:border-[#207de9] hover:text-[#207de9] transition cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span>➕</span>
                  <span>Register New Business</span>
                </div>
                <span>→</span>
              </button>

              <Link
                href="/admin/review-qr"
                className="w-full flex items-center justify-between rounded-xl bg-white border border-slate-200 p-2.5 text-xs font-bold text-slate-700 hover:border-[#207de9] hover:text-[#207de9] transition shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span>📥</span>
                  <span>Download Branded Cards</span>
                </div>
                <span>→</span>
              </Link>

              <Link
                href="/admin/analytics"
                className="w-full flex items-center justify-between rounded-xl bg-white border border-slate-200 p-2.5 text-xs font-bold text-slate-700 hover:border-[#207de9] hover:text-[#207de9] transition shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span>📈</span>
                  <span>Conversion Analytics</span>
                </div>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Strategic Proposals Box */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-extrabold text-[#080d24] uppercase tracking-wider">
                  Latest Proposals
                </h3>
                <p className="text-[11px] text-slate-500">
                  High-intent client quotes
                </p>
              </div>
              <Link
                href="/admin/proposals"
                className="text-[11px] font-bold text-[#207de9] hover:underline"
              >
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-2 py-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-10 rounded-xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : recentProposals.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs">
                No proposal requests yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentProposals.slice(0, 5).map((p) => (
                  <div
                    key={p.id}
                    onClick={() =>
                      setSelectedRecord({
                        id: p.id,
                        type: "proposal",
                        name: p.name,
                        email: p.email,
                        phone: p.phone,
                        service: p.service,
                        website:
                          p.message?.match(/Target Website:\s*([^\s\n]+)/i)?.[1] || "—",
                        status: p.status || "New",
                        date: formatDate(p.created_at),
                        message: p.message,
                      })
                    }
                    className="py-2.5 px-2 -mx-2 rounded-xl hover:bg-slate-50 transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#080d24] group-hover:text-[#207de9] transition truncate">
                        {p.name}
                      </p>
                      <span
                        className={
                          "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border " +
                          getStatusBadge(p.status || "New")
                        }
                      >
                        {p.status || "New"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {p.phone || p.email}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Drawer for enquiry / proposal details */}
      <CustomerDrawer
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onStatusChange={handleStatusChange}
      />

      {/* Add Business Modal */}
      <AddBusinessModal
        isOpen={isAddBusinessModalOpen}
        onClose={() => setIsAddBusinessModalOpen(false)}
        onSuccess={() => {
          loadData();
          setIsAddBusinessModalOpen(false);
        }}
      />
    </div>
  );
}
