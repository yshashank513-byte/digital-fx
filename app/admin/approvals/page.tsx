"use client";

import { useState, useEffect, useCallback } from "react";
import { BusinessProfile } from "@/lib/reviewFlowTypes";
import BusinessDetailDrawer from "@/components/admin/BusinessDetailDrawer";
import AddBusinessModal from "@/components/admin/AddBusinessModal";

export default function AdminApprovalsPage() {
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  const [drawerBiz, setDrawerBiz] = useState<BusinessProfile | null>(null);
  const [editingBiz, setEditingBiz] = useState<BusinessProfile | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reviewflow/businesses?status=pending_approval", {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success) {
        setBusinesses(data.businesses || []);
      }
    } catch (err) {
      console.error("Error loading pending approvals:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
        if (drawerBiz?.id === biz.id) setDrawerBiz(null);
      } else {
        alert(data.error || "Approval failed.");
      }
    } catch {
      alert("Error approving business.");
    }
  };

  const handleReject = async (biz: BusinessProfile) => {
    const reason = prompt(`Enter rejection reason for "${biz.name}":`, "Incomplete or unverifiable business profile");
    if (reason === null) return;

    try {
      const res = await fetch("/api/reviewflow/businesses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: biz.id, action: "reject", reason }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Rejected registration for "${biz.name}".`);
        loadData();
        if (drawerBiz?.id === biz.id) setDrawerBiz(null);
      }
    } catch {
      alert("Error rejecting business.");
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
            <span className="text-2xl">⏳</span>
            <h1 className="text-xl md:text-2xl font-black text-[#080d24] tracking-tight">
              Pending Approvals Queue
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Review submitted businesses before dynamic QR codes and customer review flows become active.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/admin/businesses"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-xs"
          >
            All Businesses
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#207de9] mx-auto" />
            <p className="text-xs font-bold text-slate-500">Loading pending requests...</p>
          </div>
        ) : businesses.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 text-3xl font-bold flex items-center justify-center mx-auto">
              ✓
            </div>
            <h3 className="text-base font-extrabold text-[#080d24]">
              All Businesses Approved!
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are currently no businesses pending approval. Newly registered business records will appear here for verification.
            </p>
            <div className="pt-2">
              <a
                href="/admin/businesses"
                className="rounded-xl bg-[#207de9] px-4 py-2 text-xs font-bold text-white hover:bg-blue-600 transition"
              >
                Go to Business Directory
              </a>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {businesses.map((biz) => (
              <div
                key={biz.id}
                className="p-5 md:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 hover:bg-slate-50/60 transition"
              >
                {/* Business Information Column */}
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-base font-extrabold text-[#080d24]">
                      {biz.name}
                    </h3>
                    <span className="rounded-lg bg-blue-50 text-[#207de9] font-bold text-[11px] px-2.5 py-0.5 border border-blue-100">
                      {biz.category}
                    </span>
                    <span className="rounded-full bg-amber-50 text-amber-700 font-extrabold text-[10px] px-2.5 py-0.5 border border-amber-300 animate-pulse">
                      Pending Approval
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 pt-1">
                    <div>
                      <span className="text-slate-400 font-medium">Contact:</span>{" "}
                      <span className="font-bold text-slate-800">{biz.ownerName || "—"}</span> ({biz.phone})
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Location:</span>{" "}
                      <span className="font-semibold text-slate-800">{biz.city || "NCR"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Submitted:</span>{" "}
                      <span className="text-slate-700">
                        {new Date(biz.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500">
                    <span className="text-slate-400 font-medium">Address:</span> {biz.address}
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <span className="text-slate-400 font-medium shrink-0">Google Review URL:</span>
                    <a
                      href={biz.googleReviewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[#207de9] hover:underline truncate max-w-md block"
                    >
                      {biz.googleReviewUrl} ↗
                    </a>
                  </div>
                </div>

                {/* Approval Action Buttons */}
                <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <button
                    onClick={() => setDrawerBiz(biz)}
                    className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => handleReject(biz)}
                    className="rounded-xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  >
                    ✕ Reject
                  </button>

                  <button
                    onClick={() => handleApprove(biz)}
                    className="rounded-xl bg-emerald-600 px-4.5 py-2 text-xs font-extrabold text-white hover:bg-emerald-700 transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>✓ Approve &amp; Activate QR</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drawer */}
      <BusinessDetailDrawer
        isOpen={Boolean(drawerBiz)}
        business={drawerBiz}
        onClose={() => setDrawerBiz(null)}
        onEdit={(biz) => {
          setEditingBiz(biz);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
        onActivate={() => {}}
        onDeactivate={() => {}}
        onDelete={() => {}}
        onRegenerateQR={() => {}}
      />

      <AddBusinessModal
        isOpen={Boolean(editingBiz)}
        editingBusiness={editingBiz}
        onClose={() => setEditingBiz(null)}
        onSuccess={() => {
          loadData();
          setEditingBiz(null);
        }}
      />
    </div>
  );
}
