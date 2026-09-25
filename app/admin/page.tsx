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

// Clean SVG Icons for KPI Cards & Sections
function UsersIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function BuildingIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
    </svg>
  );
}

function HourglassIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
    </svg>
  );
}

function QrCodeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM17 17h4v4h-4zM14 20h3M20 14v3" />
    </svg>
  );
}

function LinkIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function StarIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function RupeeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a4.5 4.5 0 0 0 0-9" />
    </svg>
  );
}

function BarChartIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function ChevronRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function LightningIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function MessageBubbleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function DocumentIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

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

  // Format Date for UI matching design: "24 Sept, 07:59 PM"
  function formatDate(isoString?: string) {
    if (!isoString) return "—";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
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
      case "completed":
      case "posted to google":
      case "won":
      case "success":
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "new":
        return "bg-blue-50 text-blue-700 border-blue-200/80";
      case "contacted":
        return "bg-amber-50 text-amber-700 border-amber-200/80";
      case "in discussion":
      case "in review":
        return "bg-purple-50 text-purple-700 border-purple-200/80";
      case "lost":
      case "failed":
        return "bg-rose-50 text-rose-700 border-rose-200/80";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      
      {/* =========================================================================
          MAIN DASHBOARD HEADER
          ========================================================================= */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#207de9]" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#207de9]">
              UNIFIED ENTERPRISE DASHBOARD
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#080d24] mt-1">
            Executive Command Center
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl font-normal leading-relaxed">
            Centralized operations hub for customer enquiries, ReviewFlow AI SaaS, Dynamic QR lifecycle, and revenue.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAddBusinessModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#207de9] px-4.5 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-blue-600 transition cursor-pointer"
          >
            <span className="text-base leading-none">+</span>
            <span>Add Business</span>
          </button>

          <Link
            href="/admin/enquiries"
            className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <span className="text-slate-400">≡</span>
            <span>View Enquiries</span>
          </Link>

          <button
            onClick={() => {
              setLoading(true);
              loadData();
            }}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition cursor-pointer disabled:opacity-50"
          >
            <span className={`text-slate-400 ${loading ? "animate-spin" : ""}`}>↻</span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Pending Approvals Urgent Attention Banner */}
      {stats.pendingApprovals > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 via-white to-amber-50/50 p-5 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white font-black text-xl shadow-xs">
              ⏳
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-amber-950">
                  {stats.pendingApprovals} Business Profile{stats.pendingApprovals > 1 ? "s" : ""} Pending Approval
                </h3>
                <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-[10.5px] font-black text-amber-900 uppercase">
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
            className="rounded-xl bg-amber-600 hover:bg-amber-700 px-5 py-2.5 text-xs font-extrabold text-white transition shadow-xs shrink-0 text-center"
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
          8 KPI CARDS (2 ROWS OF 4 COLUMNS)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: TOTAL ENQUIRIES */}
        <Link
          href="/admin/enquiries"
          className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-[#207de9]/50 hover:shadow-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
                <UsersIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  TOTAL ENQUIRIES
                </span>
                <p className="text-3xl font-black text-[#080d24] tabular-nums tracking-tight mt-0.5">
                  {loading ? "..." : stats.totalEnquiries}
                </p>
              </div>
            </div>
            <span className="text-slate-300 group-hover:text-[#207de9] transition">
              <ChevronRightIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100/80 text-[12px] text-slate-500 font-medium">
            <span>{stats.newEnquiries} New Lead{stats.newEnquiries === 1 ? "" : "s"}</span>
          </div>
        </Link>

        {/* Card 2: TOTAL BUSINESSES */}
        <Link
          href="/admin/businesses"
          className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-purple-400/50 hover:shadow-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 shrink-0">
                <BuildingIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  TOTAL BUSINESSES
                </span>
                <p className="text-3xl font-black text-[#080d24] tabular-nums tracking-tight mt-0.5">
                  {loading ? "..." : stats.totalBusinesses}
                </p>
              </div>
            </div>
            <span className="text-slate-300 group-hover:text-purple-600 transition">
              <ChevronRightIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100/80 text-[12px] text-slate-500 font-medium">
            <span>ReviewFlow Registered</span>
          </div>
        </Link>

        {/* Card 3: PENDING APPROVALS */}
        <Link
          href="/admin/approvals"
          className={`group relative rounded-2xl border p-5 shadow-xs transition hover:shadow-md flex flex-col justify-between ${
            stats.pendingApprovals > 0
              ? "border-amber-300 bg-amber-50/60"
              : "border-slate-200/90 bg-white hover:border-amber-400/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shrink-0">
                <HourglassIcon className="w-6 h-6" />
              </div>
              <div>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${
                  stats.pendingApprovals > 0 ? "text-amber-800" : "text-slate-400"
                }`}>
                  PENDING APPROVALS
                </span>
                <p className={`text-3xl font-black tabular-nums tracking-tight mt-0.5 ${
                  stats.pendingApprovals > 0 ? "text-amber-900" : "text-[#080d24]"
                }`}>
                  {loading ? "..." : stats.pendingApprovals}
                </p>
              </div>
            </div>
            <span className="text-slate-300 group-hover:text-amber-600 transition">
              <ChevronRightIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100/80 text-[12px] text-slate-500 font-medium">
            <span className={stats.pendingApprovals > 0 ? "text-amber-800 font-semibold" : ""}>
              {stats.pendingApprovals > 0 ? "Requires Action" : "Queue Empty"}
            </span>
          </div>
        </Link>

        {/* Card 4: ACTIVE QR CODES */}
        <Link
          href="/admin/review-qr?status=active"
          className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-emerald-400/50 hover:shadow-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <QrCodeIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  ACTIVE QR CODES
                </span>
                <p className="text-3xl font-black text-[#080d24] tabular-nums tracking-tight mt-0.5">
                  {loading ? "..." : stats.activeQRCodes}
                </p>
              </div>
            </div>
            <span className="text-slate-300 group-hover:text-emerald-600 transition">
              <ChevronRightIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100/80 text-[12px] text-slate-500 font-medium">
            <span>{stats.deactivatedQRCodes} Paused</span>
          </div>
        </Link>

        {/* Card 5: TOTAL LINK SCANS */}
        <Link
          href="/admin/analytics"
          className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-indigo-400/50 hover:shadow-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 shrink-0">
                <LinkIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  TOTAL LINK SCANS
                </span>
                <p className="text-3xl font-black text-[#080d24] tabular-nums tracking-tight mt-0.5">
                  {loading ? "..." : stats.totalScans}
                </p>
              </div>
            </div>
            <span className="text-slate-300 group-hover:text-violet-600 transition">
              <ChevronRightIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100/80 text-[12px] text-slate-500 font-medium">
            <span>Customer QR Scans</span>
          </div>
        </Link>

        {/* Card 6: REVIEWS GENERATED */}
        <Link
          href="/admin/analytics"
          className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-pink-400/50 hover:shadow-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 text-pink-600 shrink-0">
                <StarIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  REVIEWS GENERATED
                </span>
                <p className="text-3xl font-black text-[#080d24] tabular-nums tracking-tight mt-0.5">
                  {loading ? "..." : stats.reviewsGenerated}
                </p>
              </div>
            </div>
            <span className="text-slate-300 group-hover:text-pink-600 transition">
              <ChevronRightIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100/80 text-[12px] text-slate-500 font-medium">
            <span>{stats.conversionRate}% Conversion Rate</span>
          </div>
        </Link>

        {/* Card 7: VERIFIED REVENUE */}
        <Link
          href="/admin/payments"
          className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-emerald-400 hover:shadow-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                <RupeeIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  VERIFIED REVENUE
                </span>
                <p className="text-3xl font-black text-emerald-700 tabular-nums tracking-tight mt-0.5">
                  {loading ? "..." : "₹" + stats.totalRevenue.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
            <span className="text-slate-300 group-hover:text-emerald-700 transition">
              <ChevronRightIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100/80 text-[12px] text-slate-500 font-medium">
            <span>Successful Payments</span>
          </div>
        </Link>

        {/* Card 8: STRATEGIC PROPOSALS */}
        <Link
          href="/admin/proposals"
          className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-blue-400/50 hover:shadow-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
                <BarChartIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  STRATEGIC PROPOSALS
                </span>
                <p className="text-3xl font-black text-[#080d24] tabular-nums tracking-tight mt-0.5">
                  {loading ? "..." : stats.strategicProposals}
                </p>
              </div>
            </div>
            <span className="text-slate-300 group-hover:text-blue-600 transition">
              <ChevronRightIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100/80 text-[12px] text-slate-500 font-medium">
            <span>High-Intent Leads</span>
          </div>
        </Link>

      </div>

      {/* =========================================================================
          OPERATIONS LIVE STREAM & RIGHT WIDGETS
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Unified Operations Live Stream */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-[#080d24]">
                  Unified Operations Live Stream
                </h2>
                <span className="text-[10px] font-extrabold bg-blue-50 text-[#207de9] border border-blue-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  REALTIME
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Real-time chronological events from customer enquiries, proposals, ReviewFlow QR drafts, and payments.
              </p>
            </div>

            <Link
              href="/admin/enquiries"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#207de9] border border-slate-200 rounded-xl px-3 py-1.5 transition shadow-2xs self-start sm:self-auto"
            >
              <span>View All</span>
              <span>→</span>
            </Link>
          </div>

          {/* Activity Rows */}
          {loading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="py-14 text-center text-slate-400 text-xs">
              No recent activity recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentActivity.map((act) => (
                <div
                  key={act.id}
                  onClick={() => openActivityDrawer(act)}
                  className="flex items-center justify-between py-3.5 px-3 -mx-3 rounded-xl hover:bg-slate-50/80 transition cursor-pointer group"
                >
                  {/* Left: Icon & Description */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={
                        "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold shrink-0 border " +
                        (act.type === "payment"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200/80"
                          : act.type === "proposal"
                          ? "bg-cyan-50 text-cyan-600 border-cyan-200/80"
                          : act.type === "review"
                          ? "bg-purple-50 text-purple-600 border-purple-200/80"
                          : act.type === "analysis"
                          ? "bg-amber-50 text-amber-500 border-amber-200/80"
                          : "bg-blue-50 text-blue-600 border-blue-200/80")
                      }
                    >
                      {act.type === "payment" ? (
                        <RupeeIcon className="w-4 h-4" />
                      ) : act.type === "proposal" ? (
                        <DocumentIcon className="w-4 h-4" />
                      ) : act.type === "review" ? (
                        <StarIcon className="w-4 h-4" />
                      ) : act.type === "analysis" ? (
                        <LightningIcon className="w-4 h-4" />
                      ) : (
                        <MessageBubbleIcon className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[#080d24] group-hover:text-[#207de9] transition truncate">
                          {act.customer}
                        </span>
                        <span
                          className={
                            "text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border tracking-wide " +
                            (act.type === "review"
                              ? "bg-purple-50 text-purple-700 border-purple-200/60"
                              : act.type === "analysis"
                              ? "bg-blue-50 text-blue-700 border-blue-200/60"
                              : act.type === "enquiry"
                              ? "bg-amber-50 text-amber-800 border-amber-200/60"
                              : act.type === "payment"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200/60"
                              : "bg-cyan-50 text-cyan-800 border-cyan-200/60")
                          }
                        >
                          {act.type === "review" ? "GOOGLE REVIEW" : act.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {act.website && act.website !== "—" ? (
                          <span className="font-mono text-slate-700">{act.website} • </span>
                        ) : null}
                        <span>{act.service}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Status Pill & Timestamp */}
                  <div className="text-right shrink-0 ml-4">
                    <span
                      className={
                        "inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border " +
                        getStatusBadge(act.status)
                      }
                    >
                      {act.amount ? "₹" + act.amount + " • " + act.status : act.status}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {formatDate(act.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Quick Action QR Hub & Latest Proposals */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: ReviewFlow QR Hub */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <QrCodeIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#080d24]">ReviewFlow QR Hub</h3>
                <p className="text-xs text-slate-500">Fast management shortcuts</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => setIsAddBusinessModalOpen(true)}
                className="w-full flex items-center justify-between rounded-xl bg-white border border-slate-200/90 p-3 text-xs font-bold text-slate-700 hover:border-[#207de9] hover:text-[#207de9] hover:bg-blue-50/20 transition cursor-pointer shadow-2xs group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-black text-sm">
                    +
                  </span>
                  <span>Register New Business</span>
                </div>
                <span className="text-slate-400 group-hover:text-[#207de9] transition">
                  <ChevronRightIcon className="w-3.5 h-3.5" />
                </span>
              </button>

              <Link
                href="/admin/review-qr"
                className="w-full flex items-center justify-between rounded-xl bg-white border border-slate-200/90 p-3 text-xs font-bold text-slate-700 hover:border-[#207de9] hover:text-[#207de9] hover:bg-blue-50/20 transition shadow-2xs group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    📥
                  </span>
                  <span>Download Branded Cards</span>
                </div>
                <span className="text-slate-400 group-hover:text-[#207de9] transition">
                  <ChevronRightIcon className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link
                href="/admin/analytics"
                className="w-full flex items-center justify-between rounded-xl bg-white border border-slate-200/90 p-3 text-xs font-bold text-slate-700 hover:border-[#207de9] hover:text-[#207de9] hover:bg-blue-50/20 transition shadow-2xs group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    📈
                  </span>
                  <span>Conversion Analytics</span>
                </div>
                <span className="text-slate-400 group-hover:text-[#207de9] transition">
                  <ChevronRightIcon className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>

          {/* Card 2: Latest Proposals */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <DocumentIcon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#080d24]">
                    Latest Proposals
                  </h3>
                  <p className="text-xs text-slate-500">
                    High-intent client quotes
                  </p>
                </div>
              </div>
              <Link
                href="/admin/proposals"
                className="text-xs font-bold text-[#207de9] hover:underline"
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
              /* High-fidelity Empty State matching Screenshot */
              <div className="py-10 text-center flex flex-col items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 border border-slate-200/80 mb-3 shadow-2xs">
                  <DocumentIcon className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  No proposal requests yet.
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                  When customers request quotes, they will appear here.
                </p>
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
                    <p className="text-xs text-slate-500 truncate mt-0.5">
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
