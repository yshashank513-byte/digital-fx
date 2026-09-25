"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/adminFetch";
import { BusinessProfile } from "@/lib/reviewFlowTypes";

interface CampaignTemplate {
  id: string;
  name: string;
  type: "whatsapp" | "sms" | "email";
  subject?: string;
  body: string;
}

const TEMPLATES: CampaignTemplate[] = [
  {
    id: "thank-you-whatsapp",
    name: "Post-Service Thank You (WhatsApp - High Response)",
    type: "whatsapp",
    body: "Hi {{customer_name}}, thank you for choosing {{business_name}}! ⭐ We hope you had a 5-star experience with us. Could you take 10 seconds to share your feedback? Our AI assistant will help you craft your review in one tap:\n\n👉 {{review_link}}\n\nThank you for supporting our local business! 🙏",
  },
  {
    id: "quick-rating-sms",
    name: "Quick Rating (SMS - Concise)",
    type: "sms",
    body: "Hi {{customer_name}}, thank you for visiting {{business_name}}. Rate your experience & write a quick review in 10s: {{review_link}} - {{business_name}}",
  },
  {
    id: "vip-customer",
    name: "VIP / Returning Customer Appreciation",
    type: "whatsapp",
    body: "Dear {{customer_name}}, we truly value having you as a valued patron of {{business_name}}. Would you mind leaving us a quick Google review? It helps other people in our community find us:\n\n✨ Tap here: {{review_link}}\n\nIt takes less than 30 seconds with our smart review assistant. Much appreciated! 🙌",
  },
  {
    id: "gentle-followup",
    name: "Friendly Follow-Up Reminder",
    type: "whatsapp",
    body: "Hi {{customer_name}}, just checking in to see if you had a moment to share your experience with {{business_name}}? Here is your personalized link: {{review_link}} ⭐ Thank you!",
  },
];

export default function ReviewFlowCampaignsPage() {
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [selectedBizId, setSelectedBizId] = useState<string>("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(TEMPLATES[0].id);
  const [customerName, setCustomerName] = useState<string>("Valued Customer");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBusinesses = useCallback(async () => {
    try {
      const res = await adminFetch("/api/reviewflow/businesses");
      const data = await res.json();
      if (data.success && data.businesses?.length > 0) {
        setBusinesses(data.businesses);
        setSelectedBizId(data.businesses[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch businesses for campaigns:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const activeBiz = businesses.find((b) => b.id === selectedBizId) || businesses[0];
  const activeTemplate = TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0];

  // Generate populated review link
  const reviewLink = typeof window !== "undefined" && activeBiz
    ? `${window.location.origin}/r/${activeBiz.id}`
    : `https://www.digitalfx.in/r/${activeBiz?.id || "digital-fx"}`;

  // Populate dynamic variables
  const populatedMessage = (customMessage || activeTemplate.body)
    .replace(/\{\{business_name\}\}/g, activeBiz?.name || "Our Business")
    .replace(/\{\{customer_name\}\}/g, customerName || "Customer")
    .replace(/\{\{review_link\}\}/g, reviewLink);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(populatedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendWhatsApp = () => {
    const encoded = encodeURIComponent(populatedMessage);
    const cleanPhone = customerPhone.replace(/\D/g, "");
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : "91" + cleanPhone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 text-base font-black">
              ✉
            </span>
            <h1 className="text-2xl font-black tracking-tight text-[#080d24]">
              Review Outreach Campaigns
            </h1>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#207de9] border border-blue-200">
              Outreach Studio
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Dispatch customized WhatsApp & SMS review requests directly to past customers with one-click links.
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
          Businesses ({businesses.length})
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
          className="rounded-lg bg-[#207de9] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs"
        >
          Campaigns
        </Link>
        <Link
          href="/admin/analytics"
          className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
        >
          Funnel Analytics
        </Link>
      </div>

      {/* Main Campaign Builder Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Settings */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-black text-[#080d24]">1. Campaign Setup</h2>

            {/* Target Business Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Target Business
              </label>
              {loading ? (
                <div className="text-xs text-slate-400">Loading business accounts...</div>
              ) : (
                <select
                  value={selectedBizId}
                  onChange={(e) => setSelectedBizId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-bold text-[#080d24] focus:border-[#207de9] focus:outline-none"
                >
                  {businesses.map((biz) => (
                    <option key={biz.id} value={biz.id}>
                      {biz.name} ({biz.category})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Review Outreach Template
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => {
                      setSelectedTemplateId(tmpl.id);
                      setCustomMessage("");
                    }}
                    className={`text-left p-3 rounded-xl border text-xs transition cursor-pointer ${
                      selectedTemplateId === tmpl.id
                        ? "border-[#207de9] bg-blue-50/50 text-[#080d24] font-bold"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{tmpl.type === "whatsapp" ? "💬" : "📱"}</span>
                      <span className="truncate">{tmpl.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Personalization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer Name (Optional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-[#080d24] focus:border-[#207de9] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer WhatsApp Number (Optional)
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-[#080d24] focus:border-[#207de9] focus:outline-none"
                />
              </div>
            </div>

            {/* Custom Message Editor */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Customize Message Copy
              </label>
              <textarea
                rows={5}
                value={customMessage || activeTemplate.body}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-[#080d24] font-mono leading-relaxed focus:border-[#207de9] focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Variables: <code className="bg-slate-100 px-1 rounded">{"{{business_name}}"}</code>, <code className="bg-slate-100 px-1 rounded">{"{{customer_name}}"}</code>, <code className="bg-slate-100 px-1 rounded">{"{{review_link}}"}</code>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Live Mobile Preview & Dispatch Actions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-black text-[#080d24]">2. Live Customer Message Preview</h2>

            {/* Mock Chat Bubble */}
            <div className="rounded-2xl bg-emerald-900/5 p-4 border border-emerald-950/10">
              <div className="flex items-center gap-2 border-b border-emerald-950/10 pb-2 mb-3">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold text-emerald-900">WhatsApp Message View</span>
              </div>

              <div className="rounded-xl bg-white p-3.5 shadow-xs border border-emerald-100 text-xs text-[#080d24] leading-relaxed whitespace-pre-line">
                {populatedMessage}
              </div>

              <div className="mt-2 text-right text-[10px] text-slate-400 font-mono">
                Delivered via ReviewFlow AI Smart Link
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleSendWhatsApp}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-black text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer"
              >
                <span>💬</span>
                {customerPhone ? `Send to +91 ${customerPhone}` : "Open in WhatsApp Web"}
              </button>

              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <span>📋</span>
                {copied ? "Copied to Clipboard! ✓" : "Copy Message Text"}
              </button>

              <a
                href={reviewLink}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50/50 px-4 py-2 text-xs font-bold text-[#207de9] hover:bg-blue-100/60 transition"
              >
                <span>↗</span> Test Customer Link ({reviewLink})
              </a>
            </div>
          </div>

          {/* Tips Card */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-xs text-blue-900">
            <p className="font-bold flex items-center gap-1.5">
              <span>💡</span> Review Outreach Best Practices
            </p>
            <ul className="mt-2 space-y-1 text-[11px] text-blue-800 list-disc list-inside">
              <li>Send review requests within 1-2 hours of completed service for a 3x higher conversion rate.</li>
              <li>Customers who rate 5 stars are automatically navigated to Google Reviews with 1-click text copy.</li>
              <li>Customers with constructive feedback (1-3 stars) provide private feedback to protect your public rating.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
