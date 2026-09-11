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
      } finally {
        setUpdating(false);
      }
    }
  }

  function getStatusColor(st: string) {
    switch ((st || "").toLowerCase()) {
      case "converted":
      case "paid":
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "in progress":
      case "proposal sent":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "contacted":
      case "pending":
      case "payment pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "closed":
      case "failed":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  }

  const cleanPhone = (record.phone || "").replace(/[^0-9]/g, "");
  const waUrl = cleanPhone
    ? "https://wa.me/" + (cleanPhone.startsWith("91") ? cleanPhone : "91" + cleanPhone) + "?text=" + encodeURIComponent(
        "Hi " + record.name + ", Digital FX here regarding your " + (record.service || "digital growth enquiry") + "."
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
      />

      {/* Drawer content (Corporate White) */}
      <div className="relative z-10 flex h-full w-full max-w-xl flex-col bg-white border-l border-slate-200 text-[#080d24] shadow-2xl overflow-y-auto">
        
        {/* Top Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#207de9] to-[#1570ef] text-base font-black text-white shadow-xs">
              {record.name.charAt(0).toUpperCase() || "C"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-[#080d24]">
                  {record.name}
                </h3>
                <span
                  className={
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border " +
                    getStatusColor(currentStatus)
                  }
                >
                  {currentStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Type: <span className="font-semibold uppercase text-[#207de9]">{record.type}</span> • Added {record.date}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-[#080d24] transition cursor-pointer"
            aria-label="Close drawer"
          >
            ✕
          </button>
        </div>

        {/* Action Bar: Call & WhatsApp */}
        <div className="grid grid-cols-2 gap-3 border-b border-slate-200 bg-slate-50 p-5">
          {record.phone ? (
            <a
              href={"tel:" + record.phone}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#207de9] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1570ef] transition"
            >
              <span>📞 Call Now</span>
              <span className="font-mono text-[11px] opacity-90">{record.phone}</span>
            </a>
          ) : (
            <button
              disabled
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-200/60 py-2.5 text-xs font-bold text-slate-400 cursor-not-allowed"
            >
              No Phone Available
            </button>
          )}

          {waUrl ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <span>💬 WhatsApp</span>
            </a>
          ) : (
            <button
              disabled
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-200/60 py-2.5 text-xs font-bold text-slate-400 cursor-not-allowed"
            >
              No WhatsApp
            </button>
          )}
        </div>

        {/* Body Content */}
        <div className="space-y-6 p-6">
          
          {/* Status Updater */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
                Update Lead Status
              </span>
              {updating && (
                <span className="text-[11px] text-[#207de9] font-semibold animate-pulse">
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
                  className={
                    "rounded-xl py-2 px-2 text-center text-xs font-bold transition border cursor-pointer " +
                    (currentStatus.toLowerCase() === st.toLowerCase()
                      ? "bg-[#207de9] text-white border-[#207de9] shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300")
                  }
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Lead / Customer Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Customer Details
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10.5px] uppercase font-bold tracking-wider">Email Address</span>
                <p className="font-semibold text-[#080d24] mt-0.5 truncate">
                  {record.email || "—"}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10.5px] uppercase font-bold tracking-wider">Contact Number</span>
                <p className="font-semibold text-[#080d24] mt-0.5">
                  {record.phone || "—"}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10.5px] uppercase font-bold tracking-wider">Requested Service</span>
                <p className="font-semibold text-[#080d24] mt-0.5">
                  {record.service || "General Growth Enquiry"}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10.5px] uppercase font-bold tracking-wider">Target Website</span>
                <p className="font-semibold text-[#207de9] mt-0.5 truncate">
                  {record.website && record.website !== "—" ? (
                    <a
                      href={record.website.startsWith("http") ? record.website : "https://" + record.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {record.website} ↗
                    </a>
                  ) : (
                    "—"
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Details Section (if record is payment) */}
          {record.type === "payment" && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800">
                Payment Breakdown
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-emerald-700/80 text-[10.5px] block font-bold uppercase">Amount Paid</span>
                  <p className="text-xl font-black text-emerald-700 mt-0.5 tabular-nums">
                    ₹{Number(record.amount || 0).toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <span className="text-emerald-700/80 text-[10.5px] block font-bold uppercase">Gateway Txn ID</span>
                  <p className="font-mono text-[11px] text-[#080d24] mt-0.5 truncate">
                    {record.txnid || "—"}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-emerald-700/80 text-[10.5px] block font-bold uppercase">Package / Plan Scope</span>
                  <p className="font-semibold text-[#080d24] mt-0.5">
                    {record.productName || record.planId || "Digital Marketing Retainer"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Website Analysis Details Section (if record is analysis) */}
          {record.type === "analysis" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                AI Search &amp; GEO Scores
              </h4>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold">Overall</span>
                  <span className="text-base font-black text-[#207de9] tabular-nums">
                    {record.overallScore || 78}/100
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold">GEO AI</span>
                  <span className="text-base font-black text-purple-600 tabular-nums">
                    {record.geoScore || 82}%
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold">Local Maps</span>
                  <span className="text-base font-black text-emerald-600 tabular-nums">
                    {record.seoScore || 74}%
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold">Speed</span>
                  <span className="text-base font-black text-amber-600 tabular-nums">
                    {record.performanceScore || 91}%
                  </span>
                </div>
              </div>

              {record.recommendations && record.recommendations.length > 0 && (
                <div>
                  <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Action Recommendations
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {record.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#207de9] font-bold mt-0.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Raw Message / Additional Request Details */}
          {record.message && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block">
                Customer Message &amp; Requirements
              </span>
              <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                {record.message}
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
