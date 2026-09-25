"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { BusinessProfile } from "@/lib/reviewFlowTypes";
import BrandedQRCard from "@/components/BrandedQRCard";
import DeactivateModal from "@/components/admin/DeactivateModal";

export default function AdminReviewQRPage() {
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [deactivatingBiz, setDeactivatingBiz] = useState<BusinessProfile | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reviewflow/businesses", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setBusinesses(data.businesses || []);
      }
    } catch (err) {
      console.error("Error loading QR codes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredQRs = useMemo(() => {
    return businesses.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          b.name.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          (b.city && b.city.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [businesses, statusFilter, searchQuery]);

  const copyLink = (biz: BusinessProfile) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.digitalfx.in";
    const url = `${origin}/review/${biz.qrId || biz.id}`;
    navigator.clipboard.writeText(url);
    showToast(`Copied review link for "${biz.name}"!`);
  };

  const shareWhatsApp = (biz: BusinessProfile) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.digitalfx.in";
    const url = `${origin}/review/${biz.qrId || biz.id}`;
    const text = encodeURIComponent(
      `Hello! Please take 30 seconds to share your experience with ${biz.name} on Google: ${url}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleActivate = async (biz: BusinessProfile) => {
    try {
      const res = await fetch("/api/reviewflow/businesses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: biz.id, action: "activate" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`QR for "${biz.name}" activated!`);
        loadData();
      }
    } catch {
      alert("Error activating QR.");
    }
  };

  const handleConfirmDeactivate = async (reason: string) => {
    if (!deactivatingBiz) return;
    try {
      const res = await fetch("/api/reviewflow/businesses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deactivatingBiz.id, action: "deactivate", reason }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`QR for "${deactivatingBiz.name}" deactivated.`);
        loadData();
      }
    } catch {
      alert("Error deactivating QR.");
    }
  };

  const handleRegenerateQR = async (biz: BusinessProfile) => {
    const conf = confirm(
      `Regenerate unique QR token for "${biz.name}"? This assigns a fresh review identifier.`
    );
    if (!conf) return;

    try {
      const res = await fetch("/api/reviewflow/businesses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: biz.id, action: "regenerate_qr" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Fresh dynamic QR token generated for "${biz.name}".`);
        loadData();
      }
    } catch {
      alert("Error regenerating QR.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-[#080d24] text-white px-5 py-3 text-xs font-bold shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-3">
          <span className="text-emerald-400">✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📲</span>
            <h1 className="text-xl md:text-2xl font-black text-[#080d24] tracking-tight">
              ReviewFlow Dynamic QR Codes
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Preview, download high-resolution marketing cards, copy customer links, and control live QR availability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/admin/businesses"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-xs"
          >
            Manage Businesses
          </a>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All QR Codes" },
            { id: "active", label: "Active QRs" },
            { id: "pending_approval", label: "Pending Approvals" },
            { id: "deactivated", label: "Deactivated" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[#207de9] text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search QRs..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-8 pr-3 py-1.5 text-xs outline-none focus:bg-white focus:border-[#207de9]"
          />
          <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
        </div>
      </div>

      {/* QR Cards Grid */}
      {loading ? (
        <div className="p-16 text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#207de9] mx-auto" />
          <p className="text-xs font-bold text-slate-500">Loading branded QR cards...</p>
        </div>
      ) : filteredQRs.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-slate-200 bg-white space-y-3">
          <div className="text-4xl">📲</div>
          <h3 className="text-sm font-extrabold text-[#080d24]">No QR codes found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== "all"
              ? "Try resetting your search or filter."
              : "Register a business to generate your first branded marketing QR code."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredQRs.map((biz) => {
            const origin = typeof window !== "undefined" ? window.location.origin : "https://www.digitalfx.in";
            const reviewUrl = `${origin}/review/${biz.qrId || biz.id}`;

            return (
              <div
                key={biz.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition duration-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-extrabold text-[#080d24] truncate">
                      {biz.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                      <span>{biz.category}</span>
                      {biz.city && (
                        <>
                          <span>•</span>
                          <span>{biz.city}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {biz.status === "active" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-700 border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  ) : biz.status === "pending_approval" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10.5px] font-bold text-amber-700 border border-amber-300">
                      Pending
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10.5px] font-bold text-slate-600 border border-slate-200">
                      Paused
                    </span>
                  )}
                </div>

                {/* Branded Marketing QR Card Preview */}
                <div className="flex justify-center p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
                  <div className="scale-85 origin-center -my-6">
                    <BrandedQRCard
                      businessId={biz.id}
                      businessName={biz.name}
                      category={biz.category}
                    />
                  </div>
                </div>

                {/* Dynamic Link Strip */}
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <span>Dynamic Review URL</span>
                    <span className="font-mono text-slate-500 font-normal">
                      Token: {biz.qrId || biz.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      readOnly
                      value={reviewUrl}
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-mono text-slate-800 outline-none select-all"
                    />
                    <button
                      onClick={() => copyLink(biz)}
                      className="rounded-lg bg-slate-200 hover:bg-slate-300 px-2.5 py-1 text-[11px] font-bold text-slate-700 transition cursor-pointer"
                      title="Copy URL"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {/* Operational Metrics */}
                <div className="grid grid-cols-3 gap-2 py-1 text-center text-xs border-y border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Scans</span>
                    <span className="font-extrabold text-[#080d24]">{biz.totalScans || 0}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Visits</span>
                    <span className="font-extrabold text-[#080d24]">{biz.totalVisits || 0}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Reviews</span>
                    <span className="font-extrabold text-emerald-600">{biz.totalGoogleClicks || 0}</span>
                  </div>
                </div>

                {/* Download & Action Buttons */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`/api/reviewflow/qr?businessId=${biz.id}&format=png`}
                      download={`${biz.id}-review-qr.png`}
                      className="rounded-xl bg-[#080d24] py-2 text-center text-xs font-bold text-white hover:bg-slate-800 transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>📥 PNG</span>
                    </a>
                    <a
                      href={`/api/reviewflow/qr?businessId=${biz.id}&format=svg`}
                      download={`${biz.id}-review-qr.svg`}
                      className="rounded-xl border border-slate-200 bg-white py-2 text-center text-xs font-bold text-slate-700 hover:bg-slate-100 transition flex items-center justify-center gap-1.5"
                    >
                      <span>📐 SVG</span>
                    </a>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => shareWhatsApp(biz)}
                      className="flex-1 rounded-xl border border-emerald-200 bg-emerald-50 py-1.5 text-center text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
                    >
                      💬 WhatsApp
                    </button>

                    {biz.status === "active" ? (
                      <button
                        onClick={() => setDeactivatingBiz(biz)}
                        className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-800 hover:bg-amber-100 transition cursor-pointer"
                        title="Pause this QR desk"
                      >
                        ⏸ Pause
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivate(biz)}
                        className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
                        title="Reactivate this QR desk"
                      >
                        ▶ Activate
                      </button>
                    )}

                    <button
                      onClick={() => handleRegenerateQR(biz)}
                      className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                      title="Generate new unique QR link token"
                    >
                      🔄
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Deactivate Modal */}
      <DeactivateModal
        isOpen={Boolean(deactivatingBiz)}
        business={deactivatingBiz}
        onClose={() => setDeactivatingBiz(null)}
        onConfirm={handleConfirmDeactivate}
      />
    </div>
  );
}
