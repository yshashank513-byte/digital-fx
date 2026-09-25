"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { BusinessProfile, QRStatus, BusinessCategory } from "@/lib/reviewFlowTypes";
import { CATEGORIES_LIST } from "@/lib/reviewFlowCategories";
import AddBusinessModal from "@/components/admin/AddBusinessModal";
import BusinessDetailDrawer from "@/components/admin/BusinessDetailDrawer";
import DeactivateModal from "@/components/admin/DeactivateModal";

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal / Drawer states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBiz, setEditingBiz] = useState<BusinessProfile | null>(null);
  const [drawerBiz, setDrawerBiz] = useState<BusinessProfile | null>(null);
  const [deactivatingBiz, setDeactivatingBiz] = useState<BusinessProfile | null>(null);

  // Toast
  const [toastMsg, setToastMsg] = useState("");
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/reviewflow/businesses?analytics=true", {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success) {
        setBusinesses(data.businesses || []);
      } else {
        throw new Error(data.error || "Unable to fetch businesses.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load businesses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derived Counts
  const counts = useMemo(() => {
    let pending = 0;
    let active = 0;
    let deactivated = 0;
    let draft = 0;
    let rejected = 0;

    for (const b of businesses) {
      if (b.status === "pending_approval") pending++;
      else if (b.status === "active") active++;
      else if (b.status === "deactivated") deactivated++;
      else if (b.status === "draft") draft++;
      else if (b.status === "rejected") rejected++;
    }

    return {
      all: businesses.length,
      pending,
      active,
      deactivated,
      draft,
      rejected,
    };
  }, [businesses]);

  // Filtered List
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      // Status filter
      if (statusFilter !== "all" && b.status !== statusFilter) {
        return false;
      }
      // Category filter
      if (categoryFilter !== "all" && b.category !== categoryFilter) {
        return false;
      }
      // Search term
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = b.name.toLowerCase().includes(q);
        const matchOwner = b.ownerName?.toLowerCase().includes(q);
        const matchPhone = b.phone?.toLowerCase().includes(q);
        const matchCity = b.city?.toLowerCase().includes(q);
        if (!matchName && !matchOwner && !matchPhone && !matchCity) {
          return false;
        }
      }
      return true;
    });
  }, [businesses, statusFilter, categoryFilter, searchQuery]);

  // Actions
  const handleApprove = async (biz: BusinessProfile) => {
    try {
      const res = await fetch("/api/reviewflow/businesses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: biz.id, action: "approve" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Approved "${biz.name}". Dynamic QR is now active!`);
        loadData();
        if (drawerBiz?.id === biz.id) setDrawerBiz(data.business);
      } else {
        alert(data.error || "Approval failed.");
      }
    } catch {
      alert("Network error approving business.");
    }
  };

  const handleReject = async (biz: BusinessProfile) => {
    const reason = prompt(`Enter rejection reason for "${biz.name}":`, "Incomplete business credentials");
    if (reason === null) return;

    try {
      const res = await fetch("/api/reviewflow/businesses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: biz.id, action: "reject", reason }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Rejected "${biz.name}".`);
        loadData();
        if (drawerBiz?.id === biz.id) setDrawerBiz(data.business);
      }
    } catch {
      alert("Network error rejecting business.");
    }
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
        showToast(`QR for "${biz.name}" activated.`);
        loadData();
        if (drawerBiz?.id === biz.id) setDrawerBiz(data.business);
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
        if (drawerBiz?.id === deactivatingBiz.id) setDrawerBiz(data.business);
      }
    } catch {
      alert("Error deactivating QR.");
    }
  };

  const handleRegenerateQR = async (biz: BusinessProfile) => {
    const confirmRegen = confirm(
      `Regenerate unique QR token for "${biz.name}"? Previous QR URLs will point to the new token.`
    );
    if (!confirmRegen) return;

    try {
      const res = await fetch("/api/reviewflow/businesses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: biz.id, action: "regenerate_qr" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`New dynamic QR token generated for "${biz.name}".`);
        loadData();
        if (drawerBiz?.id === biz.id) setDrawerBiz(data.business);
      }
    } catch {
      alert("Error regenerating QR.");
    }
  };

  const copyReviewLink = (biz: BusinessProfile) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.digitalfx.in";
    const url = `${origin}/review/${biz.qrId || biz.id}`;
    navigator.clipboard.writeText(url);
    showToast(`Copied: ${url}`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-[#080d24] text-white px-5 py-3 text-xs font-bold shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-3">
          <span className="text-emerald-400">✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <Link
          href="/admin/reviewflow"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#207de9] mb-3 transition"
        >
          <span>←</span>
          <span>Back to ReviewFlow Hub</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏢</span>
              <h1 className="text-xl md:text-2xl font-black text-[#080d24] tracking-tight">
                Businesses &amp; Dynamic QR Management
              </h1>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Create and manage verified business profiles, generate branded QR codes, monitor reviews, and control lifecycle approvals.
            </p>
          </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingBiz(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-[#207de9] px-4.5 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-blue-600 transition cursor-pointer"
          >
            <span>+ Add Business</span>
          </button>
        </div>
      </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Total Businesses
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#080d24]">{counts.all}</span>
            <span className="text-[11px] font-bold text-slate-500">Registered</span>
          </div>
        </div>

        <div className={`rounded-2xl border p-4.5 shadow-xs ${
          counts.pending > 0
            ? "border-amber-300 bg-amber-50/70"
            : "border-slate-200/90 bg-white"
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
              counts.pending > 0 ? "text-amber-800" : "text-slate-400"
            }`}>
              Pending Approvals
            </span>
            {counts.pending > 0 && (
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className={`text-2xl font-black ${
              counts.pending > 0 ? "text-amber-900" : "text-[#080d24]"
            }`}>
              {counts.pending}
            </span>
            <span className="text-[11px] font-bold text-amber-700">Requires Action</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Active QR Codes
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600">{counts.active}</span>
            <span className="text-[11px] font-bold text-emerald-700">Live Scannable</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Deactivated QRs
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-600">{counts.deactivated}</span>
            <span className="text-[11px] font-bold text-slate-500">Paused Desk</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: "All Businesses", count: counts.all },
              { id: "pending_approval", label: "Pending Approvals", count: counts.pending, alert: counts.pending > 0 },
              { id: "active", label: "Active QRs", count: counts.active },
              { id: "deactivated", label: "Deactivated", count: counts.deactivated },
              { id: "draft", label: "Drafts", count: counts.draft },
              { id: "rejected", label: "Rejected", count: counts.rejected },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  statusFilter === tab.id
                    ? "bg-[#207de9] text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                    statusFilter === tab.id
                      ? "bg-white/20 text-white"
                      : tab.alert
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
            >
              <option value="all">All Categories</option>
              {CATEGORIES_LIST.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by business name, owner, mobile number, or city..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-4 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:border-[#207de9]"
          />
          <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Businesses Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#207de9] mx-auto" />
            <p className="text-xs font-bold text-slate-500">Loading business registry...</p>
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="text-4xl">🏢</div>
            <h3 className="text-sm font-extrabold text-[#080d24]">No businesses found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                ? "Try clearing your search query or adjusting your filters."
                : "Register your first business to generate an automated ReviewFlow QR card."}
            </p>
            <button
              onClick={() => {
                setStatusFilter("all");
                setCategoryFilter("all");
                setSearchQuery("");
                setIsAddModalOpen(true);
              }}
              className="mt-2 rounded-xl bg-[#207de9] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-600 transition cursor-pointer"
            >
              + Add First Business
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-5">Business &amp; Category</th>
                  <th className="py-3.5 px-4">Contact Person</th>
                  <th className="py-3.5 px-4">Dynamic Review URL</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Scans / Reviews</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredBusinesses.map((biz) => {
                  const origin = typeof window !== "undefined" ? window.location.origin : "";
                  const reviewUrl = `${origin}/review/${biz.qrId || biz.id}`;

                  return (
                    <tr
                      key={biz.id}
                      className="hover:bg-slate-50/60 transition duration-150"
                    >
                      {/* Business & Category */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-xs"
                            style={{ backgroundColor: biz.brandColor || "#207de9" }}
                          >
                            {biz.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <button
                              onClick={() => setDrawerBiz(biz)}
                              className="font-extrabold text-[#080d24] hover:text-[#207de9] transition text-left truncate block max-w-[200px] cursor-pointer"
                            >
                              {biz.name}
                            </button>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                              <span className="font-semibold text-slate-700">{biz.category}</span>
                              {biz.city && (
                                <>
                                  <span>•</span>
                                  <span>{biz.city}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Person */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-800">
                          {biz.ownerName || "—"}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {biz.phone || "—"}
                        </div>
                      </td>

                      {/* Dynamic Review URL */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <code className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-700 max-w-[170px] truncate block">
                            /review/{biz.qrId || biz.id}
                          </code>
                          <button
                            onClick={() => copyReviewLink(biz)}
                            title="Copy Dynamic Review Link"
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-[#207de9] hover:bg-slate-50 transition cursor-pointer"
                          >
                            📋
                          </button>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4 text-center">
                        {biz.status === "active" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        )}
                        {biz.status === "pending_approval" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-300 animate-pulse">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            Pending
                          </span>
                        )}
                        {biz.status === "deactivated" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 border border-slate-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                            Paused
                          </span>
                        )}
                        {biz.status === "rejected" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200">
                            Rejected
                          </span>
                        )}
                        {biz.status === "draft" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-sky-700 border border-sky-200">
                            Draft
                          </span>
                        )}
                      </td>

                      {/* Scans / Reviews */}
                      <td className="py-4 px-4 text-center">
                        <div className="font-extrabold text-[#080d24]">
                          {biz.totalScans || 0} scans
                        </div>
                        <div className="text-[11px] text-emerald-600 font-semibold">
                          {biz.totalGoogleClicks || 0} reviews posted
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {biz.status === "pending_approval" ? (
                            <>
                              <button
                                onClick={() => handleApprove(biz)}
                                className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 transition cursor-pointer"
                                title="Approve Business & Activate QR"
                              >
                                ✓ Approve
                              </button>
                              <button
                                onClick={() => handleReject(biz)}
                                className="rounded-lg border border-rose-200 px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                title="Reject Registration"
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <>
                              {biz.status === "active" ? (
                                <button
                                  onClick={() => setDeactivatingBiz(biz)}
                                  className="rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800 hover:bg-amber-100 transition cursor-pointer"
                                  title="Deactivate QR"
                                >
                                  ⏸ Pause
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleActivate(biz)}
                                  className="rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
                                  title="Reactivate QR"
                                >
                                  ▶ Activate
                                </button>
                              )}
                            </>
                          )}

                          <button
                            onClick={() => setDrawerBiz(biz)}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            title="View Full Management Details & QR"
                          >
                            Details
                          </button>

                          <button
                            onClick={() => {
                              setEditingBiz(biz);
                              setIsAddModalOpen(true);
                            }}
                            className="rounded-lg border border-slate-200 bg-white p-1 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                            title="Edit Business"
                          >
                            ✏️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Business Modal */}
      <AddBusinessModal
        isOpen={isAddModalOpen}
        editingBusiness={editingBiz}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingBiz(null);
        }}
        onSuccess={(saved) => {
          showToast(
            editingBiz
              ? `Business "${saved.name}" updated successfully.`
              : `Business "${saved.name}" added to review registry.`
          );
          loadData();
        }}
      />

      {/* Details Slide-Over Drawer */}
      <BusinessDetailDrawer
        isOpen={Boolean(drawerBiz)}
        business={drawerBiz}
        onClose={() => setDrawerBiz(null)}
        onEdit={(biz) => {
          setEditingBiz(biz);
          setIsAddModalOpen(true);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
        onActivate={handleActivate}
        onDeactivate={(biz) => setDeactivatingBiz(biz)}
        onRegenerateQR={handleRegenerateQR}
      />

      {/* Confirmation Modals */}
      <DeactivateModal
        isOpen={Boolean(deactivatingBiz)}
        business={deactivatingBiz}
        onClose={() => setDeactivatingBiz(null)}
        onConfirm={handleConfirmDeactivate}
      />
    </div>
  );
}
