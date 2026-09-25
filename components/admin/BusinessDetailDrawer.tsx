"use client";

import { useState } from "react";
import { BusinessProfile } from "@/lib/reviewFlowTypes";
import BrandedQRCard from "@/components/BrandedQRCard";

interface BusinessDetailDrawerProps {
  business: BusinessProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (biz: BusinessProfile) => void;
  onApprove: (biz: BusinessProfile) => void;
  onReject: (biz: BusinessProfile) => void;
  onActivate: (biz: BusinessProfile) => void;
  onDeactivate: (biz: BusinessProfile) => void;
  onDelete: (biz: BusinessProfile) => void;
  onRegenerateQR: (biz: BusinessProfile) => void;
}

export default function BusinessDetailDrawer({
  business,
  isOpen,
  onClose,
  onEdit,
  onApprove,
  onReject,
  onActivate,
  onDeactivate,
  onDelete,
  onRegenerateQR,
}: BusinessDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<"info" | "qr" | "analytics">("info");
  const [copied, setCopied] = useState(false);

  if (!isOpen || !business) return null;

  const siteOrigin = typeof window !== "undefined" ? window.location.origin : "https://www.digitalfx.in";
  const reviewUrl = `${siteOrigin}/review/${business.qrId || business.id}`;
  const shortReviewUrl = `${siteOrigin}/r/${business.qrId || business.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reviewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello! Please leave a review for ${business.name} on Google: ${reviewUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  // Status Badge Helper
  const renderStatusBadge = () => {
    switch (business.status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active QR
          </span>
        );
      case "pending_approval":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-700 border border-amber-300 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Pending Approval
          </span>
        );
      case "deactivated":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 border border-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Deactivated
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-extrabold text-rose-700 border border-rose-200">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Rejected
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 border border-sky-200">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            Draft
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-xl h-full bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 bg-gradient-to-r from-slate-50 to-white">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏢</span>
              <h2 className="text-base font-extrabold text-[#080d24] truncate">
                {business.name}
              </h2>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              <span>{business.category}</span>
              <span>•</span>
              <span>{business.city || "NCR"}</span>
              <span>•</span>
              {renderStatusBadge()}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition ml-3"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab("info")}
            className={`py-3 text-xs font-bold transition border-b-2 mr-6 ${
              activeTab === "info"
                ? "border-[#207de9] text-[#207de9]"
                : "border-transparent text-slate-500 hover:text-[#080d24]"
            }`}
          >
            📋 Business Info
          </button>
          <button
            onClick={() => setActiveTab("qr")}
            className={`py-3 text-xs font-bold transition border-b-2 mr-6 ${
              activeTab === "qr"
                ? "border-[#207de9] text-[#207de9]"
                : "border-transparent text-slate-500 hover:text-[#080d24]"
            }`}
          >
            📲 Dynamic QR &amp; Branding
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`py-3 text-xs font-bold transition border-b-2 ${
              activeTab === "analytics"
                ? "border-[#207de9] text-[#207de9]"
                : "border-transparent text-slate-500 hover:text-[#080d24]"
            }`}
          >
            📊 Scan Analytics
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: BUSINESS INFO */}
          {activeTab === "info" && (
            <div className="space-y-5">
              {/* Contact Card */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4.5 space-y-3">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#207de9]">
                  Primary Contact Details
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Owner / Manager</span>
                    <span className="font-bold text-[#080d24]">{business.ownerName || "—"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Mobile Phone</span>
                    <a href={`tel:${business.phone}`} className="font-bold text-[#207de9] hover:underline">
                      {business.phone || "—"}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Email Address</span>
                    <span className="font-bold text-[#080d24] truncate block">
                      {business.email || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Website</span>
                    {business.website ? (
                      <a href={business.website} target="_blank" rel="noreferrer" className="font-bold text-[#207de9] hover:underline truncate block">
                        {business.website.replace(/^https?:\/\//, "")}
                      </a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Card */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4.5 space-y-3">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#207de9]">
                  Physical Business Location
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-[#080d24]">{business.address}</div>
                  <div className="text-slate-500">
                    {[business.city, business.state, business.pincode].filter(Boolean).join(", ")}
                  </div>
                </div>
              </div>

              {/* Google Review Destination */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#207de9]">
                    Google Business Profile Review Destination
                  </span>
                  <a
                    href={business.googleReviewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-[#207de9] hover:underline flex items-center gap-1"
                  >
                    <span>Test Link</span>
                    <span>↗</span>
                  </a>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-[11px] text-slate-700 break-all select-all">
                  {business.googleReviewUrl}
                </div>
              </div>

              {/* Lifecycle & Dates */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4.5 space-y-3">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Lifecycle Audit Trail
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">System ID</span>
                    <span className="font-mono text-slate-600 font-bold">{business.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Dynamic QR Token</span>
                    <span className="font-mono text-[#207de9] font-bold">{business.qrId || business.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Registered Date</span>
                    <span className="text-slate-700">
                      {new Date(business.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Approved Date</span>
                    <span className="text-slate-700">
                      {business.approvalDate
                        ? new Date(business.approvalDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Not approved yet"}
                    </span>
                  </div>
                </div>

                {business.deactivatedReason && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                    <strong>Deactivation Note:</strong> {business.deactivatedReason}
                  </div>
                )}

                {business.rejectionReason && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                    <strong>Rejection Reason:</strong> {business.rejectionReason}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: QR & BRANDING */}
          {activeTab === "qr" && (
            <div className="space-y-6">
              {/* Dynamic Links Box */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4.5 space-y-3">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#207de9]">
                  Live Dynamic Customer Review URL
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={reviewUrl}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono text-slate-800 outline-none select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`rounded-xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                      copied
                        ? "bg-emerald-600 text-white"
                        : "bg-[#207de9] text-white hover:bg-blue-600"
                    }`}
                  >
                    <span>{copied ? "✓ Copied" : "Copy"}</span>
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={handleShareWhatsApp}
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>💬 Share on WhatsApp</span>
                  </button>
                  <a
                    href={reviewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5"
                  >
                    <span>Test Customer Screen ↗</span>
                  </a>
                  <button
                    onClick={() => onRegenerateQR(business)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition flex items-center gap-1 cursor-pointer"
                    title="Generate new unique QR link token if compromised"
                  >
                    <span>🔄 Regenerate QR Token</span>
                  </button>
                </div>
              </div>

              {/* Branded Marketing QR Card Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Official Branded Marketing QR Card Preview
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`/api/reviewflow/qr?businessId=${business.id}&format=png`}
                      download={`${business.id}-review-qr.png`}
                      className="rounded-xl bg-[#080d24] px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition"
                    >
                      Download PNG
                    </a>
                    <a
                      href={`/api/reviewflow/qr?businessId=${business.id}&format=svg`}
                      download={`${business.id}-review-qr.svg`}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                    >
                      Download SVG
                    </a>
                  </div>
                </div>

                <div className="flex justify-center p-4 bg-slate-100/60 rounded-2xl border border-slate-200">
                  <BrandedQRCard
                    businessId={business.id}
                    businessName={business.name}
                    category={business.category}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCAN ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Total QR Scans
                  </span>
                  <div className="mt-1 text-2xl font-black text-[#080d24]">
                    {business.totalScans}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">Physical QR code scans</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Desk Visits
                  </span>
                  <div className="mt-1 text-2xl font-black text-[#080d24]">
                    {business.totalVisits}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">Customer feedback visits</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Drafts Generated
                  </span>
                  <div className="mt-1 text-2xl font-black text-[#207de9]">
                    {business.totalDrafts}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">AI review drafts formulated</p>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    Google Review Clicks
                  </span>
                  <div className="mt-1 text-2xl font-black text-emerald-700">
                    {business.totalGoogleClicks}
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-600">Customers routed to Google</p>
                </div>
              </div>

              {/* Conversion Rate Meter */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#080d24]">Scan to Google Review Conversion</span>
                  <span className="font-mono font-black text-emerald-600">
                    {business.totalVisits > 0
                      ? Math.round((business.totalGoogleClicks / business.totalVisits) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#207de9] to-emerald-500 transition-all duration-500"
                    style={{
                      width: `${
                        business.totalVisits > 0
                          ? Math.min(100, Math.round((business.totalGoogleClicks / business.totalVisits) * 100))
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Action Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(business)}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              ✏️ Edit Info
            </button>
            <button
              onClick={() => onDelete(business)}
              className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition cursor-pointer"
            >
              🗑 Delete
            </button>
          </div>

          <div className="flex items-center gap-2">
            {business.status === "pending_approval" && (
              <>
                <button
                  onClick={() => onReject(business)}
                  className="rounded-xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  ✕ Reject
                </button>
                <button
                  onClick={() => onApprove(business)}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-700 transition shadow-xs cursor-pointer"
                >
                  ✓ Approve &amp; Activate QR
                </button>
              </>
            )}

            {business.status === "active" && (
              <button
                onClick={() => onDeactivate(business)}
                className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-extrabold text-amber-800 hover:bg-amber-100 transition cursor-pointer"
              >
                ⏸ Deactivate QR
              </button>
            )}

            {(business.status === "deactivated" || business.status === "rejected" || business.status === "draft") && (
              <button
                onClick={() => onActivate(business)}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-700 transition shadow-xs cursor-pointer"
              >
                ▶ Activate QR
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
