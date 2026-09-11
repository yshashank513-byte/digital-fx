"use client";

import { adminFetch } from "@/lib/adminFetch";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import CustomerDrawer, { DrawerRecord } from "../../components/admin/CustomerDrawer";

type Stats = {
  totalEnquiries: number;
  freeAnalyses: number;
  paidAnalyses: number;
  strategicProposals: number;
  totalRevenue: number;
  pendingPayments: number;
};

type ActivityItem = {
  id: string;
  type: "analysis" | "enquiry" | "proposal" | "payment";
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

  const loadData = useCallback(async () => {
    try {
      setError("");
      const res = await adminFetch("/api/admin/stats", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to load dashboard metrics (HTTP " + res.status + ").");
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Unable to load dashboard data.");
      }

      setStats({
        totalEnquiries: data.stats.totalEnquiries || 0,
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
    setSelectedRecord({
      id: act.id,
      type: act.type,
      name: act.customer,
      website: act.website,
      service: act.service,
      status: act.status,
      date: formatDate(act.timestamp),
      amount: act.amount,
      overallScore: act.score,
    });
  }

  function getStatusBadge(status: string) {
    const s = (status || "").toLowerCase();
    if (s === "converted" || s === "paid" || s === "success" || s === "completed") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold";
    }
    if (s === "in progress" || s === "proposal sent") {
      return "bg-blue-50 text-blue-700 border-blue-200 font-bold";
    }
    if (s === "contacted" || s === "pending" || s === "payment pending") {
      return "bg-amber-50 text-amber-700 border-amber-200 font-bold";
    }
    if (s === "closed" || s === "failed") {
      return "bg-rose-50 text-rose-700 border-rose-200 font-bold";
    }
    return "bg-slate-100 text-slate-700 border-slate-200 font-bold";
  }

  async function handleStatusChange(id: string | number, newStatus: string) {
    const numId = typeof id === "string" ? parseInt(id.replace(/\D/g, ""), 10) : id;
    if (numId) {
      await adminFetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: numId, status: newStatus }),
      });
      loadData();
    }
  }

  return (
    <div className="space-y-8">
      
      {/* Top Banner & Refresh */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#207de9] animate-pulse" />
            <span className="text-[10.5px] font-extrabold uppercase tracking-widest text-[#207de9]">
              Executive Command Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#080d24] mt-1">
            Business Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time customer enquiries, website audit analyses, and verified revenue collections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setLoading(true);
              loadData();
            }}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#080d24] shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <span className={loading ? "animate-spin" : ""}>↻</span>
            <span>Refresh Live Data</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 font-medium">
          {error}
        </div>
      )}

      {/* =========================================================================
          TOP 6 KPI CARDS (Clean Corporate White Style)
          ========================================================================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        
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
          <p className="mt-1 text-[10px] text-slate-500 flex items-center gap-1">
            <span>Customer leads</span>
            <span className="text-[#207de9] opacity-0 group-hover:opacity-100 transition">→</span>
          </p>
        </Link>

        {/* Card 2: Free Website Analyses */}
        <Link
          href="/admin/analyses"
          className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-emerald-500/50 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Free Analyses
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-xs text-emerald-600 font-bold">
              ⚡
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-[#080d24] tabular-nums">
            {loading ? "..." : stats.freeAnalyses}
          </p>
          <p className="mt-1 text-[10px] text-slate-500 flex items-center gap-1">
            <span>Audited websites</span>
            <span className="text-emerald-600 opacity-0 group-hover:opacity-100 transition">→</span>
          </p>
        </Link>

        {/* Card 3: Paid Analyses */}
        <Link
          href="/admin/analyses?filter=paid"
          className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-violet-500/50 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Paid Analyses
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-xs text-violet-600 font-bold">
              ★
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-[#080d24] tabular-nums">
            {loading ? "..." : stats.paidAnalyses}
          </p>
          <p className="mt-1 text-[10px] text-slate-500 flex items-center gap-1">
            <span>Premium audits</span>
            <span className="text-violet-600 opacity-0 group-hover:opacity-100 transition">→</span>
          </p>
        </Link>

        {/* Card 4: Strategic Proposals */}
        <Link
          href="/admin/proposals"
          className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-cyan-500/50 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Proposals
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-50 text-xs text-cyan-600 font-bold">
              📑
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-[#080d24] tabular-nums">
            {loading ? "..." : stats.strategicProposals}
          </p>
          <p className="mt-1 text-[10px] text-slate-500 flex items-center gap-1">
            <span>High-intent requests</span>
            <span className="text-cyan-600 opacity-0 group-hover:opacity-100 transition">→</span>
          </p>
        </Link>

        {/* Card 5: Total Revenue */}
        <Link
          href="/admin/payments"
          className="group relative rounded-2xl border border-emerald-300 bg-emerald-50/30 p-5 shadow-xs transition hover:border-emerald-500 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Verified Revenue
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-xs text-emerald-700 font-black">
              ₹
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-emerald-700 tabular-nums">
            {loading ? "..." : "₹" + stats.totalRevenue.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-[10px] text-emerald-700/80 flex items-center gap-1">
            <span>Successful PayU payments</span>
            <span className="opacity-0 group-hover:opacity-100 transition">→</span>
          </p>
        </Link>

        {/* Card 6: Pending Payments */}
        <Link
          href="/admin/payments?status=pending"
          className="group relative rounded-2xl border border-amber-300 bg-amber-50/30 p-5 shadow-xs transition hover:border-amber-500 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
              Pending Orders
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-xs text-amber-700 font-bold">
              ⏳
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-amber-800 tabular-nums">
            {loading ? "..." : stats.pendingPayments}
          </p>
          <p className="mt-1 text-[10px] text-amber-700/80 flex items-center gap-1">
            <span>Checkout initiated</span>
            <span className="opacity-0 group-hover:opacity-100 transition">→</span>
          </p>
        </Link>

      </div>

      {/* =========================================================================
          CONVERSION FUNNEL (Clean Corporate White Card)
          ========================================================================= */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-[#080d24]">
              Customer Growth &amp; Conversion Funnel
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Attributable progression from free audit users to verified paid contracts.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Real Database Records
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              1. Free Analyses
            </span>
            <p className="text-xl font-black text-[#080d24] mt-1 tabular-nums">
              {stats.freeAnalyses}
            </p>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#207de9] h-full w-full rounded-full" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              2. Proposals Requested
            </span>
            <p className="text-xl font-black text-cyan-600 mt-1 tabular-nums">
              {stats.strategicProposals}
            </p>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-cyan-500 h-full rounded-full"
                style={{
                  width:
                    stats.freeAnalyses > 0
                      ? Math.min(100, Math.round((stats.strategicProposals / stats.freeAnalyses) * 100)) + "%"
                      : "40%",
                }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              3. Enquiries Received
            </span>
            <p className="text-xl font-black text-violet-600 mt-1 tabular-nums">
              {stats.totalEnquiries}
            </p>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-violet-500 h-full w-3/4 rounded-full" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              4. Converted Revenue
            </span>
            <p className="text-xl font-black text-emerald-700 mt-1 tabular-nums">
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </p>
            <div className="w-full bg-emerald-200 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-600 h-full w-full rounded-full" />
            </div>
          </div>
        </div>
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
                <span>Recent Business Activity</span>
                <span className="text-[10px] font-extrabold bg-blue-50 text-[#207de9] border border-blue-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  LIVE STREAM
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time chronological events from audits, enquiries, proposals, and payments.
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
                          : act.type === "analysis"
                          ? "bg-violet-50 text-violet-600 border-violet-200"
                          : "bg-blue-50 text-[#207de9] border-blue-200")
                      }
                    >
                      {act.type === "payment"
                        ? "₹"
                        : act.type === "proposal"
                        ? "📑"
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
                          • {act.type}
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

        {/* Right: Quick Strategic Proposals Table (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-black text-[#080d24]">
                Latest Proposals
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Strategic proposal requests
              </p>
            </div>
            <Link
              href="/admin/proposals"
              className="text-xs font-bold text-[#207de9] hover:underline"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-12 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : recentProposals.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
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
                  className="py-3 px-2 -mx-2 rounded-xl hover:bg-slate-50 transition cursor-pointer group"
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

      {/* Detail Slide-Over Drawer */}
      <CustomerDrawer
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onStatusChange={handleStatusChange}
      />

    </div>
  );
}
