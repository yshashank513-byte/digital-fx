"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { BusinessProfile } from "@/lib/reviewFlowTypes";
import DeactivateModal from "@/components/admin/DeactivateModal";
import PrintableReviewStandee from "@/components/admin/PrintableReviewStandee";
import LiveCustomerPhoneMockup from "@/components/admin/LiveCustomerPhoneMockup";
import AddBusinessModal from "@/components/admin/AddBusinessModal";

export default function AdminReviewQRPage() {
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  
  // Selected Business for Live Preview & Standee
  const [selectedBiz, setSelectedBiz] = useState<BusinessProfile | null>(null);
  
  // Right Column Mode: "phone" | "standee"
  const [rightPanelTab, setRightPanelTab] = useState<"phone" | "standee">("phone");
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBiz, setEditingBiz] = useState<BusinessProfile | null>(null);
  const [standeeModalBiz, setStandeeModalBiz] = useState<BusinessProfile | null>(null);
  const [editDestBiz, setEditDestBiz] = useState<BusinessProfile | null>(null);
  const [editDestUrl, setEditDestUrl] = useState("");
  const [savingDest, setSavingDest] = useState(false);
  const [deactivatingBiz, setDeactivatingBiz] = useState<BusinessProfile | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3200);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reviewflow/businesses", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        const list = data.businesses || [];
        setBusinesses(list);
        if (list.length > 0 && !selectedBiz) {
          setSelectedBiz(list[0]);
        }
      }
    } catch (err) {
      console.error("Error loading QR codes:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedBiz]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Keep selectedBiz synced if list reloads
  useEffect(() => {
    if (selectedBiz && businesses.length > 0) {
      const refreshed = businesses.find((b) => b.id === selectedBiz.id);
      if (refreshed) setSelectedBiz(refreshed);
    }
  }, [businesses]);

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

  // Summary Metrics
  const totalScans = useMemo(() => businesses.reduce((sum, b) => sum + (b.totalScans || 0), 0), [businesses]);
  const totalVisits = useMemo(() => businesses.reduce((sum, b) => sum + (b.totalVisits || 0), 0), [businesses]);
  const totalPosts = useMemo(() => businesses.reduce((sum, b) => sum + (b.totalGoogleClicks || 0), 0), [businesses]);
  const activeCount = useMemo(() => businesses.filter((b) => b.status === "active").length, [businesses]);

  const copyReviewLink = (biz: BusinessProfile) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.digitalfx.in";
    const url = `${origin}/r/${biz.qrId || biz.id}`;
    navigator.clipboard.writeText(url);
    showToast(`Copied review link for "${biz.name}"!`);
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

  const openEditDestination = (biz: BusinessProfile) => {
    setEditDestBiz(biz);
    setEditDestUrl(biz.googleReviewUrl || "");
  };

  const handleSaveDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDestBiz) return;
    setSavingDest(true);
    try {
      const res = await fetch("/api/reviewflow/businesses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editDestBiz.id,
          googleReviewUrl: editDestUrl.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Review destination updated for "${editDestBiz.name}"!`);
        setEditDestBiz(null);
        loadData();
      } else {
        alert(data.error || "Failed to update review destination.");
      }
    } catch {
      alert("Network error updating destination.");
    } finally {
      setSavingDest(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-[#0F172A] text-white px-5 py-3 text-xs font-bold shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-in fade-in slide-in-from-bottom-3">
          <span className="text-emerald-400 font-bold">✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. TOP HEADER & METRIC SUMMARY CARDS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📲</span>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Review QR Codes &amp; Standees
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Generate, manage, and print official Google-Business-style review standees and dynamic QR codes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingBiz(null);
              setIsAddModalOpen(true);
            }}
            className="rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3.5 py-2 text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>+</span>
            <span>Add Business</span>
          </button>
          <Link
            href="/admin/businesses"
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            Manage All
          </Link>
          <button
            type="button"
            onClick={() => {
              if (selectedBiz) setStandeeModalBiz(selectedBiz);
            }}
            disabled={!selectedBiz}
            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 px-3.5 py-2 text-xs font-bold transition shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>🖨️</span>
            <span>Print Standee</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar (Stripe-Style Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total QRs</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{businesses.length}</div>
          <span className="text-[10.5px] text-emerald-600 font-semibold">{activeCount} Active</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Scans</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalScans}</div>
          <span className="text-[10.5px] text-slate-500 font-medium">Camera QR Scans</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reviews Started</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalVisits}</div>
          <span className="text-[10.5px] text-blue-600 font-medium">Rating Opened</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Review Posts</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{totalPosts}</div>
          <span className="text-[10.5px] text-slate-500 font-medium">
            {totalScans > 0 ? `${Math.round((totalPosts / totalScans) * 100)}% Conversion` : "Direct Clicks"}
          </span>
        </div>
      </div>

      {/* ========================================================
          2. MAIN SPLIT-PANE WORKSPACE: TABLE (LEFT) + PREVIEW (RIGHT)
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: QR CODES MANAGEMENT TABLE (8 COLS) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          
          {/* Filter Tabs & Search */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: "All QRs" },
                { id: "active", label: "Active" },
                { id: "pending_approval", label: "Pending" },
                { id: "deactivated", label: "Disabled" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                    statusFilter === tab.id
                      ? "bg-[#2563EB] text-white shadow-2xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-56">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search business..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-8 pr-3 py-1.5 text-xs outline-none focus:bg-white focus:border-[#2563EB]"
              />
              <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
            </div>
          </div>

          {/* Table Container */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
            {loading ? (
              <div className="p-16 text-center space-y-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#2563EB] mx-auto" />
                <p className="text-xs font-bold text-slate-500">Loading Review QR dashboard...</p>
              </div>
            ) : filteredQRs.length === 0 ? (
              <div className="p-16 text-center space-y-2">
                <div className="text-3xl">📲</div>
                <h3 className="text-sm font-bold text-slate-900">No QR codes found</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Try adjusting your search query or registering a new business.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3 px-4">Business</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Review Destination</th>
                      <th className="py-3 px-3 text-center">Scans</th>
                      <th className="py-3 px-3 text-center">Posts</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredQRs.map((biz) => {
                      const isSelected = selectedBiz?.id === biz.id;
                      return (
                        <tr
                          key={biz.id}
                          onClick={() => setSelectedBiz(biz)}
                          className={`hover:bg-blue-50/40 transition cursor-pointer ${
                            isSelected ? "bg-blue-50/70 font-medium" : ""
                          }`}
                        >
                          {/* Business Logo & Name */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5 min-w-[160px]">
                              {biz.logoUrl ? (
                                <img
                                  src={biz.logoUrl}
                                  alt={biz.name}
                                  className="h-8 w-8 rounded-lg object-contain bg-slate-50 border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div
                                  className="h-8 w-8 rounded-lg flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-2xs"
                                  style={{ backgroundColor: biz.brandColor || "#2563EB" }}
                                >
                                  {biz.name.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 truncate max-w-[150px] sm:max-w-[190px]">
                                  {biz.name}
                                </div>
                                <div className="text-[10.5px] text-slate-400 truncate">
                                  {biz.category} {biz.city ? `• ${biz.city}` : ""}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                                biz.status === "active"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : biz.status === "pending_approval"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-slate-100 text-slate-600 border border-slate-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  biz.status === "active"
                                    ? "bg-emerald-500"
                                    : biz.status === "pending_approval"
                                    ? "bg-amber-500"
                                    : "bg-slate-400"
                                }`}
                              />
                              <span className="capitalize">{biz.status || "active"}</span>
                            </span>
                          </td>

                          {/* Review Destination URL */}
                          <td className="py-3.5 px-3 min-w-[160px]">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] text-slate-600 truncate max-w-[130px] font-mono block">
                                {biz.googleReviewUrl ? "Google Business" : "Not Set"}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditDestination(biz);
                                }}
                                className="text-[10.5px] text-[#2563EB] hover:underline font-semibold shrink-0"
                                title="Edit Destination URL"
                              >
                                ✏️
                              </button>
                            </div>
                          </td>

                          {/* Scans */}
                          <td className="py-3.5 px-3 text-center whitespace-nowrap font-bold text-slate-800">
                            {biz.totalScans || 0}
                          </td>

                          {/* Posts */}
                          <td className="py-3.5 px-3 text-center whitespace-nowrap font-bold text-emerald-600">
                            {biz.totalGoogleClicks || 0}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                              
                              {/* Preview / Select */}
                              <button
                                type="button"
                                onClick={() => setSelectedBiz(biz)}
                                className={`px-2 py-1 rounded-lg text-xs font-semibold transition ${
                                  isSelected
                                    ? "bg-blue-600 text-white shadow-2xs"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`}
                                title="View in live preview"
                              >
                                👁️ Preview
                              </button>

                              {/* Standee Modal */}
                              <button
                                type="button"
                                onClick={() => setStandeeModalBiz(biz)}
                                className="px-2 py-1 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                                title="Print Standee"
                              >
                                🖨️ Standee
                              </button>

                              {/* Copy Link */}
                              <button
                                type="button"
                                onClick={() => copyReviewLink(biz)}
                                className="px-2 py-1 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                                title="Copy Review Link"
                              >
                                📋
                              </button>

                              {/* Status Toggle */}
                              {biz.status === "active" ? (
                                <button
                                  type="button"
                                  onClick={() => setDeactivatingBiz(biz)}
                                  className="px-2 py-1 rounded-lg text-[11px] font-semibold text-amber-700 hover:bg-amber-50 transition"
                                  title="Disable QR"
                                >
                                  Disable
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleActivate(biz)}
                                  className="px-2 py-1 rounded-lg text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50 transition"
                                  title="Activate QR"
                                >
                                  Activate
                                </button>
                              )}

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

        </div>

        {/* RIGHT COLUMN: LIVE DUAL PREVIEW PANEL (4 COLS) */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-6 space-y-4">
          
          {selectedBiz ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
              
              {/* Dual Tab Switcher: Phone vs Standee */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setRightPanelTab("phone")}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                      rightPanelTab === "phone"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>📱</span>
                    <span>Customer View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRightPanelTab("standee")}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                      rightPanelTab === "standee"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>🪧</span>
                    <span>Print Standee</span>
                  </button>
                </div>

                <span className="text-[11px] font-semibold text-slate-400 truncate max-w-[100px]">
                  {selectedBiz.name}
                </span>
              </div>

              {/* View 1: Customer Phone Simulator */}
              {rightPanelTab === "phone" && (
                <LiveCustomerPhoneMockup business={selectedBiz} />
              )}

              {/* View 2: Printable Standee Preview */}
              {rightPanelTab === "standee" && (
                <PrintableReviewStandee business={selectedBiz} initialSize="A5" />
              )}

            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-400 space-y-2">
              <span className="text-3xl">📱</span>
              <p className="text-xs font-semibold">Select a business from the table to see its live preview &amp; standee.</p>
            </div>
          )}

        </div>

      </div>

      {/* ========================================================
          3. MODAL: EDIT REVIEW DESTINATION
         ======================================================== */}
      {editDestBiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Configure Review Destination
                </h3>
                <p className="text-xs text-slate-500">
                  {editDestBiz.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditDestBiz(null)}
                className="text-slate-400 hover:text-slate-700 text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDestination} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Google Review URL / Destination Link:
                </label>
                <input
                  type="url"
                  value={editDestUrl}
                  onChange={(e) => setEditDestUrl(e.target.value)}
                  placeholder="https://search.google.com/local/writereview?placeid=..."
                  required
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-[#2563EB] outline-none text-slate-800"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  When customers tap &ldquo;Post Review&rdquo;, they are redirected directly to this link with their structured review text already copied.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditDestBiz(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingDest}
                  className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {savingDest ? "Saving..." : "Save Destination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          4. MODAL: FULL STAND PRINT & PREVIEW
         ======================================================== */}
      {standeeModalBiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Official Google Review Standee
                </h3>
                <p className="text-xs text-slate-500">
                  Print-ready A4/A5 tabletop counter standee for {standeeModalBiz.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStandeeModalBiz(null)}
                className="text-slate-400 hover:text-slate-700 text-base p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-center py-2">
              <PrintableReviewStandee
                business={standeeModalBiz}
                initialSize="A5"
                onClose={() => setStandeeModalBiz(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. MODAL: DEACTIVATE QR
         ======================================================== */}
      {deactivatingBiz && (
        <DeactivateModal
          isOpen={true}
          business={deactivatingBiz}
          onClose={() => setDeactivatingBiz(null)}
          onConfirm={handleConfirmDeactivate}
        />
      )}

      {/* ========================================================
          6. MODAL: ADD / EDIT BUSINESS
         ======================================================== */}
      <AddBusinessModal
        isOpen={isAddModalOpen}
        editingBusiness={editingBiz}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingBiz(null);
        }}
        onSuccess={(savedBiz) => {
          setIsAddModalOpen(false);
          setEditingBiz(null);
          showToast(`Business "${savedBiz.name}" saved! Dynamic QR generated.`);
          loadData();
          setSelectedBiz(savedBiz);
        }}
      />

    </div>
  );
}
