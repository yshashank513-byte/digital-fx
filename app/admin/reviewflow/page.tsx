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

  // Derived counts
  const activeCount = analytics?.activeQRCodes ?? businesses.filter((b) => b.status === "active").length;
  const totalQRsCount = analytics?.totalQRCodes ?? businesses.length;
  const pendingCount = analytics?.pendingApprovals ?? businesses.filter((b) => b.status === "pending_approval").length;
  const totalReviewsCount = analytics?.totalGoogleClicks ?? businesses.reduce((acc, b) => acc + (b.totalGoogleClicks || 0), 0);
  const campaignsCount = 0; // Active outreach campaigns

  // The 5 Core Gradient Rectangle Modules (Exact 1:1 match to reference screenshot)
  const modules = [
    {
      title: "Businesses",
      subtitle: "Manage registered businesses and place details",
      href: "/admin/businesses",
      gradient: "from-[#3B82F6] via-[#2563EB] to-[#1D4ED8]",
      arrowColor: "text-[#2563EB]",
      icon: (
        <svg className="w-8 h-8 text-[#2563EB]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 2H9c-1.1 0-2 .9-2 2v2H5c-1.1 0-2 .9-2 2v14h18V4c0-1.1-.9-2-2-2zm-8 2h8v16h-4v-4H9v4H5V8h2V4h4zm-4 6h2v2H7v-2zm0 4h2v2H7v-2zm6-8h2v2h-2V6zm0 4h2v2h-2v-2zm4-4h2v2h-2V6zm0 4h2v2h-2v-2z" />
        </svg>
      ),
      count: activeCount,
      countLabel: "Active Businesses",
    },
    {
      title: "Review QR Codes",
      subtitle: "Create and manage branded QR codes",
      href: "/admin/review-qr",
      gradient: "from-[#A855F7] via-[#9333EA] to-[#7E22CE]",
      arrowColor: "text-[#9333EA]",
      icon: (
        <svg className="w-8 h-8 text-[#9333EA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <path d="M7 7h.01M17 7h.01M7 17h.01M17 17h.01" strokeWidth="3" />
        </svg>
      ),
      count: totalQRsCount,
      countLabel: "Total QR Codes",
    },
    {
      title: "Pending Approvals",
      subtitle: "Review and approve newly added businesses",
      href: "/admin/approvals",
      gradient: "from-[#F59E0B] via-[#EA580C] to-[#D97706]",
      arrowColor: "text-[#EA580C]",
      icon: (
        <svg className="w-8 h-8 text-[#EA580C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
      count: pendingCount,
      countLabel: "In Queue",
    },
    {
      title: "Outreach Campaigns",
      subtitle: "Send WhatsApp, SMS and email review requests",
      href: "/admin/reviewflow/campaigns",
      gradient: "from-[#22C55E] via-[#16A34A] to-[#15803D]",
      arrowColor: "text-[#16A34A]",
      icon: (
        <svg className="w-8 h-8 text-[#16A34A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      ),
      count: campaignsCount,
      countLabel: "Campaigns",
    },
    {
      title: "Analytics & Funnel",
      subtitle: "Track reviews, conversions and overall performance",
      href: "/admin/analytics",
      gradient: "from-[#F43F5E] via-[#E11D48] to-[#BE123C]",
      arrowColor: "text-[#E11D48]",
      icon: (
        <svg className="w-8 h-8 text-[#E11D48]" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="12" width="3.5" height="9" rx="1" />
          <rect x="8.5" y="8" width="3.5" height="13" rx="1" />
          <rect x="14" y="4" width="3.5" height="17" rx="1" />
          <rect x="19.5" y="10" width="3.5" height="11" rx="1" />
        </svg>
      ),
      count: totalReviewsCount,
      countLabel: "Total Reviews",
    },
  ];

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* =========================================================================
          MODULE HEADER & QUICK ACTIONS
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
          THE 5 GRADIENT RECTANGLE MODULES (Exact match to reference screenshot)
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod, idx) => (
          <Link
            key={idx}
            href={mod.href}
            className={`group relative rounded-2xl bg-gradient-to-r ${mod.gradient} text-white shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-1`}
          >
            {/* Top Section */}
            <div className="p-6 flex items-center justify-between gap-4">
              
              {/* White Rounded Square Icon Box */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0">
                {mod.icon}
              </div>

              {/* Title & Subtitle */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white truncate">
                  {mod.title}
                </h3>
                <p className="text-xs text-white/90 font-medium mt-1 leading-snug line-clamp-2">
                  {mod.subtitle}
                </p>
              </div>

              {/* Circular White Arrow Button */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-md flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <svg className={`w-5 h-5 ${mod.arrowColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>

            </div>

            {/* Bottom Darker Metric Strip */}
            <div className="bg-black/15 px-6 py-3 text-xs sm:text-sm font-semibold text-white/95 flex items-center gap-2 border-t border-white/10">
              <span className="font-bold text-white text-sm sm:text-base font-mono">
                {mod.count}
              </span>
              <span>{mod.countLabel}</span>
            </div>
          </Link>
        ))}
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
