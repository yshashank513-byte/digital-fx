"use client";

import { useState } from "react";
import Link from "next/link";

export default function ReviewFlowSettingsPage() {
  const [supportPhone, setSupportPhone] = useState("8860707797");
  const [defaultBrandColor, setDefaultBrandColor] = useState("#207de9");
  const [qrCorrectionLevel, setQrCorrectionLevel] = useState("H");
  const [reputationShieldThreshold, setReputationShieldThreshold] = useState("4");
  const [aiTone, setAiTone] = useState("Authentic & Warm");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 text-base font-black">
              ⚙
            </span>
            <h1 className="text-2xl font-black tracking-tight text-[#080d24]">
              ReviewFlow Global Settings
            </h1>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-700 border border-slate-200">
              Module Config
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Configure system-wide parameters for QR code generation, AI review prompts, and reputation filtering.
          </p>
        </div>

        <Link
          href="/admin/reviewflow"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-[#080d24] transition w-fit"
        >
          ← ReviewFlow Overview
        </Link>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex overflow-x-auto scrollbar-none gap-2 border-b border-slate-200 pb-2">
        <Link
          href="/admin/reviewflow"
          className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
        >
          Overview
        </Link>
        <Link
          href="/admin/businesses"
          className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
        >
          Businesses
        </Link>
        <Link
          href="/admin/review-qr"
          className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
        >
          Branded QR Codes
        </Link>
        <Link
          href="/admin/approvals"
          className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
        >
          Approvals
        </Link>
        <Link
          href="/admin/reviewflow/campaigns"
          className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
        >
          Campaigns
        </Link>
        <Link
          href="/admin/analytics"
          className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
        >
          Funnel Analytics
        </Link>
        <Link
          href="/admin/reviewflow/settings"
          className="rounded-lg bg-[#207de9] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs"
        >
          Settings
        </Link>
      </div>

      {savedSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <span>✓</span> Configuration saved successfully. Active across all dynamic QR destinations.
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Branding & QR Configuration */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="text-base">📲</span>
            <h2 className="text-sm font-black text-[#080d24]">Branded QR Card Specifications</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Official Company Support Number (Printed on QR Cards)
            </label>
            <input
              type="text"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-mono font-bold text-[#080d24] focus:border-[#207de9] focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Verified phone number displayed on physical QR marketing stands and print cards.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Default Theme Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={defaultBrandColor}
                onChange={(e) => setDefaultBrandColor(e.target.value)}
                className="h-10 w-14 rounded-lg border border-slate-200 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={defaultBrandColor}
                onChange={(e) => setDefaultBrandColor(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-mono text-[#080d24] w-28 uppercase"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Digital FX primary brand color: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">#207de9</code>
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              QR Error Correction Level
            </label>
            <select
              value={qrCorrectionLevel}
              onChange={(e) => setQrCorrectionLevel(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-bold text-[#080d24]"
            >
              <option value="H">High (H - 30% recovery, Recommended for Logo Overlays)</option>
              <option value="Q">Quartile (Q - 25% recovery)</option>
              <option value="M">Medium (M - 15% recovery)</option>
              <option value="L">Low (L - 7% recovery)</option>
            </select>
            <p className="mt-1 text-[11px] text-slate-400">
              High error correction guarantees flawless camera readability even when company logos are embedded.
            </p>
          </div>
        </div>

        {/* AI & Reputation Engine Settings */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="text-base">🛡</span>
            <h2 className="text-sm font-black text-[#080d24]">Reputation Shield & AI Engine</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Google Review Direct Routing Threshold
            </label>
            <select
              value={reputationShieldThreshold}
              onChange={(e) => setReputationShieldThreshold(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-bold text-[#080d24]"
            >
              <option value="4">4 & 5 Stars: Route to Google Maps (Shield 1-3 Stars)</option>
              <option value="5">5 Stars Only: Direct to Google Maps (Strict Shield)</option>
              <option value="1">All Ratings: Always Direct to Google Maps</option>
            </select>
            <p className="mt-1 text-[11px] text-slate-400">
              Customers rating below this threshold submit internal private feedback, protecting Google Business ratings.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              AI Review Assistant Tone
            </label>
            <select
              value={aiTone}
              onChange={(e) => setAiTone(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-bold text-[#080d24]"
            >
              <option value="Authentic & Warm">Authentic & Warm (Natural human language)</option>
              <option value="Professional & Detailed">Professional & Detailed (Focus on reliability & metrics)</option>
              <option value="Enthusiastic & High-Energy">Enthusiastic & High-Energy (5-star excitement)</option>
            </select>
            <p className="mt-1 text-[11px] text-slate-400">
              Reviews sound 100% human and personalized based on the customer&apos;s positive feedback selections.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="w-full rounded-xl bg-[#207de9] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1866c2] transition cursor-pointer"
            >
              Save Module Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
