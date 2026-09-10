"use client";

import { useState } from "react";

export type DrawerRecord = {
  id: string | number;
  type: "enquiry" | "proposal" | "analysis" | "payment";
  name: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  service?: string | null;
  status: string;
  date: string;
  message?: string | null;
  // Analysis specific
  overallScore?: number;
  seoScore?: number;
  geoScore?: number;
  mobileScore?: number;
  performanceScore?: number;
  recommendations?: string[] | null;
  title?: string | null;
  // Payment specific
  amount?: number | string | null;
  txnid?: string | null;
  planId?: string | null;
  productName?: string | null;
  updatedAt?: string | null;
};

type CustomerDrawerProps = {
  record: DrawerRecord | null;
  onClose: () => void;
  onStatusChange?: (id: string | number, newStatus: string) => Promise<void> | void;
};

const STATUS_OPTIONS = [
  "New",
  "Contacted",
  "In Progress",
  "Proposal Sent",
  "Converted",
  "Closed",
];

export default function CustomerDrawer({
  record,
  onClose,
  onStatusChange,
}: CustomerDrawerProps) {
  const [updating, setUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(record?.status || "New");

  if (!record) return null;

  async function handleStatusSelect(status: string) {
    setCurrentStatus(status);
    if (onStatusChange && record) {
      try {
        setUpdating(true);
        await onStatusChange(record.id, status);
      } catch (err) {
        console.error("Status update error:", err);
      } finally {
        setUpdating(false);
      }
    }
  }

  function getStatusColor(st: string) {
    switch (st.toLowerCase()) {
      case "converted":
      case "success":
      case "paid":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "in progress":
      case "proposal sent":
        return "bg-violet-500/15 text-violet-400 border-violet-500/30";
      case "contacted":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "closed":
      case "failed":
        return "bg-slate-700 text-slate-300 border-slate-600";
      default:
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
    }
  }

  const cleanPhone = (record.phone || "").replace(/[^0-9]/g, "");
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : "91" + cleanPhone}?text=${encodeURIComponent(
        `Hi ${record.name}, Digital FX here regarding your ${record.service || "digital growth enquiry"}.`
      )}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative z-10 flex h-full w-full max-w-xl flex-col bg-[#07122d] border-l border-white/10 text-white shadow-2xl overflow-y-auto animate-slideLeft">
        
        {/* Top Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#07122d]/95 px-6 py-5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#315df5] to-[#7888ff] text-base font-black text-white shadow-lg">
              {record.name.charAt(0).toUpperCase() || "C"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white">
                  {record.name}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(
                    currentStatus
                  )}`}
                >
                  {currentStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Type: <span className="font-semibold uppercase text-blue-300">{record.type}</span> • Added {record.date}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition"
            aria-label="Close drawer"
          >
            ✕
          </button>
        </div>

        {/* Action Bar: Call & WhatsApp */}
        <div className="grid grid-cols-2 gap-3 border-b border-white/10 bg-black/20 p-5">
          {record.phone ? (
            <a
              href={`tel:${record.phone}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#315df5] py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#254cd6] transition"
            >
              <span>📞 Call Now</span>
              <span className="font-mono text-[11px] opacity-80">{record.phone}</span>
            </a>
          ) : (
            <button
              disabled
              className="flex items-center justify-center gap-2 rounded-xl bg-white/5 py-2.5 text-xs font-bold text-slate-500 cursor-not-allowed"
            >
              No Phone Available
            </button>
          )}

          {waUrl ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition"
            >
              <span>💬 WhatsApp</span>
            </a>
          ) : (
            <button
              disabled
              className="flex items-center justify-center gap-2 rounded-xl bg-white/5 py-2.5 text-xs font-bold text-slate-500 cursor-not-allowed"
            >
              No WhatsApp
            </button>
          )}
        </div>

        {/* Body Content */}
        <div className="space-y-6 p-6">
          
          {/* Status Updater */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
                Update Lead Status
              </span>
              {updating && (
                <span className="text-[11px] text-blue-400 font-semibold animate-pulse">
                  Saving to database...
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusSelect(st)}
                  disabled={updating}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition ${
                    currentStatus.toLowerCase() === st.toLowerCase()
                      ? "bg-[#315df5] border-[#315df5] text-white shadow-md"
                      : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Profile Card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Customer Contact Attributes
            </h4>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400 text-[11px]">Full Name</p>
                <p className="font-bold text-white mt-0.5">{record.name}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[11px]">Phone Number</p>
                <p className="font-mono font-bold text-white mt-0.5">
                  {record.phone || "—"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-slate-400 text-[11px]">Email Address</p>
                <p className="font-mono font-medium text-slate-200 mt-0.5">
                  {record.email || "—"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-slate-400 text-[11px]">Service Requested</p>
                <p className="font-bold text-blue-300 mt-0.5">
                  {record.service || "General Enquiry"}
                </p>
              </div>
            </div>
          </div>

          {/* Website / Target URL */}
          {record.website && record.website !== "—" && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Target Website URL
                </h4>
                <a
                  href={
                    record.website.startsWith("http")
                      ? record.website
                      : `https://${record.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#6f8cff] hover:underline flex items-center gap-1"
                >
                  <span>Visit Site</span>
                  <span>↗</span>
                </a>
              </div>
              <p className="mt-2 font-mono text-sm font-bold text-white break-all">
                {record.website}
              </p>
            </div>
          )}

          {/* Analysis Diagnostic Scores (if available) */}
          {(record.overallScore !== undefined || record.seoScore !== undefined) && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Audit &amp; Intelligence Scores
                </h4>
                <span className="text-lg font-black text-emerald-400">
                  {record.overallScore || 0}/100
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: "GEO AI Score", val: record.geoScore ?? 80, col: "#1570ef" },
                  { label: "Technical SEO", val: record.seoScore ?? 85, col: "#00b894" },
                  { label: "Mobile Crawl", val: record.mobileScore ?? 90, col: "#10b981" },
                  { label: "Speed & Perf", val: record.performanceScore ?? 75, col: "#a855f7" },
                ].map((s) => (
                  <div key={s.label} className="p-3 rounded-xl bg-black/20 border border-white/5">
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-slate-400 text-[11px]">{s.label}</span>
                      <span style={{ color: s.col }}>{s.val}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${s.val}%`, backgroundColor: s.col }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {record.recommendations && record.recommendations.length > 0 && (
                <div className="pt-3 border-t border-white/10">
                  <p className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Diagnostic Recommendations:
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {record.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Payment Attributes (if payment) */}
          {(record.amount !== undefined || record.txnid) && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3 text-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Payment &amp; Transaction Details
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-slate-400 text-[11px]">Amount Paid / Due</p>
                  <p className="text-lg font-black text-white mt-0.5">
                    ₹{Number(record.amount || 0).toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px]">Payment Status</p>
                  <span
                    className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(
                      record.status
                    )}`}
                  >
                    {record.status}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400 text-[11px]">Transaction ID (TxnID)</p>
                  <p className="font-mono text-xs text-slate-300 mt-0.5 break-all">
                    {record.txnid || "—"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400 text-[11px]">Product / Scope</p>
                  <p className="font-semibold text-white mt-0.5">
                    {record.productName || record.planId || "Bespoke Package"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Message / Requirement Notes */}
          {record.message && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Original Requirement / Message
              </h4>
              <p className="text-xs leading-relaxed text-slate-200 whitespace-pre-line bg-black/20 p-3.5 rounded-xl border border-white/5">
                {record.message}
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
