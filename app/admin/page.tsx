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
        throw new Error(`Failed to load dashboard metrics (HTTP ${res.status}).`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Unable to load dashboard data.");
      }

      setStats(data.stats);
      setRecentActivity(data.recentActivity || []);
      setRecentEnquiries(data.recentEnquiries || []);
      setRecentProposals(data.recentProposals || []);
    } catch (err) {
      console.error("DASHBOARD DATA LOAD ERROR:", err);
      setError(err instanceof Error ? err.message : "Unable to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // =========================================================================
    // SUPABASE REALTIME SUBSCRIPTIONS
    // Live reactive updates for enquiries, geo_analyses, and payments
    // =========================================================================
    const channel = supabase
      .channel("admin-dashboard-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "enquiries" },
        () => {
          console.log("Realtime event on enquiries: reloading stats");
          loadData();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "geo_analyses" },
        () => {
          console.log("Realtime event on geo_analyses: reloading stats");
          loadData();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "payments" },
        () => {
          console.log("Realtime event on payments: reloading stats");
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
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    }
    if (s === "in progress" || s === "proposal sent") {
      return "bg-violet-500/15 text-violet-400 border-violet-500/30";
    }
    if (s === "contacted" || s === "pending" || s === "payment pending") {
      return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    }
    return "bg-blue-500/15 text-blue-400 border-blue-500/30";
  }

  async function handleStatusChange(id: string | number, newStatus: string) {
    // If it's an enquiry/proposal id
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
            <span className="h-2 w-2 rounded-full bg-[#315df5] animate-pulse" />
            <span className="text-[10.5px] font-extrabold uppercase tracking-widest text-[#6f8cff]">
              Digital FX Executive Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Business Operations Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live metrics, customer enquiries, website analyses, and revenue tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setLoading(true);
              loadData();
            }}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition cursor-pointer disabled:opacity-50"
          >
            <span className={loading ? "animate-spin" : ""}>↻</span>
            <span>Refresh Live Data</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* =========================================================================
          TOP 6 KPI CARDS (Real Database Data)
          ========================================================================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        
        {/* Card 1: Total Enquiries */}
        <Link
          href="/admin/enquiries"
          className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-lg transition hover:border-[#315df5]/50 hover:bg-white/[0.05]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Enquiries
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-xs text-[#6f8cff]">
              ◉
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-white tabular-nums">
            {loading ? "..." : stats.totalEnquiries}
          </p>
          <p className="mt-1 text-[10px] text-slate-400 flex items-center gap-1">
            <span>Customer leads</span>
            <span className="text-[#6f8cff] opacity-0 group-hover:opacity-100 transition">→</span>
          </p>
        </Link>

        {/* Card 2: Free Website Analyses */}
        <Link
          href="/admin/analyses"
          className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-lg transition hover:border-emerald-500/50 hover:bg-white/[0.05]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Free Analyses
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-xs text-emerald-400">
              ⚡
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-white tabular-nums">
            {loading ? "..." : stats.freeAnalyses}
          </p>
          <p className="mt-1 text-[10px] text-slate-400 flex items-center gap-1">
            <span>Audited websites</span>
            <span className="text-emerald-400 opacity-0 group-hover:opacity-100 transition">→</span>
          </p>
        </Link>

        {/* Card 3: Paid Analyses */}
        <Link
          href="/admin/analyses?filter=paid"
          className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-lg transition hover:border-violet-500/50 hover:bg-white/[0.05]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Paid Analyses
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-xs text-violet-400">
              💎
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-white tabular-nums">
            {loading ? "..." : stats.paidAnalyses}
          </p>
          <p className="mt-1 text-[10px] text-slate-400 flex items-center gap-1">
            <span>Deep audits unlocked</span>
            <span className="text-violet-400 opacity-0 group-hover:opacity-100 transition">→</span>
          </p>
        </Link>

        {/* Card 4: Strategic Proposals */}
        <Link
          href="/admin/proposals"
          className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-lg transition hover:border-cyan-500/50 hover:bg-white/[0.05]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Proposals
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-xs text-cyan-400">
              📑
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-white tabular-nums">
            {loading ? "..." : stats.strategicProposals}
          </p>
          <p className="mt-1 text-[10px] text-slate-400 flex items-center gap-1">
            <span>High-intent requests</span>
            <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition">→</span>
          </p>
        </Link>

        {/* Card 5: Total Revenue */}
        <Link
          href="/admin/payments"
          className="group relative rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.05] p-5 shadow-lg transition hover:border-emerald-500/60 hover:bg-emerald-500/[0.08]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Verified Revenue
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-xs text-emerald-400 font-black">
              ₹
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-emerald-400 tabular-nums">
            {loading ? "..." : `₹${stats.totalRevenue.toLocaleString("en-IN")}`}
          </p>
          <p className="mt-1 text-[10px] text-emerald-300/70 flex items-center gap-1">
            <span>Successful PayU payments</span>
            <span className="opacity-0 group-hover:opacity-100 transition">→</span>
          </p>
        </Link>

        {/* Card 6: Pending Payments */}
        <Link
          href="/admin/payments?status=pending"
          className="group relative rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] p-5 shadow-lg transition hover:border-amber-500/60 hover:bg-amber-500/[0.07]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
              Pending Orders
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-xs text-amber-400">
              ⏳
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-amber-400 tabular-nums">
            {loading ? "..." : stats.pendingPayments}
          </p>
          <p className="mt-1 text-[10px] text-amber-300/70 flex items-center gap-1">
            <span>Checkout initiated</span>
            <span className="opacity-0 group-hover:opacity-100 transition">→</span>
          </p>
        </Link>

      </div>

      {/* =========================================================================
          CONVERSION FUNNEL (Requirement 32)
          ========================================================================= */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Customer Growth &amp; Conversion Funnel
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Attributable progression from free audit users to verified paid contracts.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
            Real Database Records
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
          <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              1. Free Analyses
            </span>
            <p className="text-xl font-black text-white mt-1 tabular-nums">
              {stats.freeAnalyses}
            </p>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#315df5] h-full w-full rounded-full" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              2. Proposals Requested
            </span>
            <p className="text-xl font-black text-cyan-400 mt-1 tabular-nums">
              {stats.strategicProposals}
            </p>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full"
                style={{
                  width: `${
                    stats.freeAnalyses > 0
                      ? Math.min(100, Math.round((stats.strategicProposals / stats.freeAnalyses) * 100))
                      : 40
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              3. Enquiries Received
            </span>
            <p className="text-xl font-black text-violet-400 mt-1 tabular-nums">
              {stats.totalEnquiries}
            </p>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-violet-400 h-full w-3/4 rounded-full" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              4. Converted Revenue
            </span>
            <p className="text-xl font-black text-emerald-400 mt-1 tabular-nums">
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </p>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-400 h-full w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          RECENT ACTIVITY & QUICK OVERVIEW (Requirements 6 & 25)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Recent Activity Feed (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>Recent Business Activity</span>
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
                  LIVE STREAM
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time chronological events from audits, enquiries, proposals, and payments.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-14 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No recent activity recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentActivity.map((act) => (
                <div
                  key={act.id}
                  onClick={() => openActivityDrawer(act)}
                  className="flex items-center justify-between py-3.5 px-3 -mx-3 rounded-xl hover:bg-white/[0.03] transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black shrink-0 ${
                        act.type === "payment"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : act.type === "proposal"
                          ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                          : act.type === "analysis"
                          ? "bg-violet-500/15 text-violet-400 border border-violet-500/30"
                          : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                      }`}
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
                        <span className="font-bold text-sm text-white group-hover:text-blue-300 transition truncate">
                          {act.customer}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase">
                          • {act.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">
                        {act.website && act.website !== "—" ? (
                          <span className="font-mono text-slate-300">{act.website} • </span>
                        ) : null}
                        <span>{act.service}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(
                        act.status
                      )}`}
                    >
                      {act.amount ? `₹${act.amount} • ${act.status}` : act.status}
                    </span>
                    <p className="text-[10.5px] text-slate-500 mt-1">
                      {formatDate(act.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick Strategic Proposals Table (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-sm font-black text-white">
                Latest Proposals
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Strategic proposal requests
              </p>
            </div>
            <Link
              href="/admin/proposals"
              className="text-xs font-bold text-[#6f8cff] hover:underline"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-12 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : recentProposals.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No proposal requests yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentProposals.map((prop) => (
                <div
                  key={prop.id}
                  onClick={() =>
                    setSelectedRecord({
                      id: prop.id,
                      type: "proposal",
                      name: prop.name,
                      phone: prop.phone,
                      email: prop.email,
                      service: prop.service,
                      status: prop.status,
                      date: formatDate(prop.created_at),
                      message: prop.message,
                      website:
                        prop.message?.match(/Target Website:\s*([^\s\n]+)/i)?.[1] ||
                        prop.message?.match(/Website:\s*([^\s\n|]+)/i)?.[1] ||
                        null,
                    })
                  }
                  className="p-3.5 rounded-2xl bg-black/20 border border-white/5 hover:border-white/20 transition cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-xs text-white truncate">{prop.name}</p>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getStatusBadge(
                        prop.status
                      )}`}
                    >
                      {prop.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-300 font-mono mt-1 truncate">
                    {prop.phone}
                  </p>
                  <p className="text-[10.5px] text-slate-400 mt-0.5 truncate">
                    {prop.service}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Customer Detail Drawer */}
      <CustomerDrawer
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onStatusChange={handleStatusChange}
      />

    </div>
  );
}