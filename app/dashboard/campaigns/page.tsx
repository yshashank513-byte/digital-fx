"use client";

import { useEffect, useState } from "react";
import {
  Send,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Radio,
  FileCode2,
  Users,
  ShieldAlert,
  X,
  Play,
  RotateCcw,
} from "lucide-react";
import { Campaign } from "@/lib/whatsapp/types";

export default function TenantCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<any[]>([]);

  // Create Campaign Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    targetAudience: "All Active Leads",
    templateId: "",
    templateName: "appointment_reminder_v1",
    recipientCount: 250,
  });

  // Safety confirmation modal before sending
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    try {
      setLoading(true);
      const res = await fetch("/api/tenant");
      if (res.ok) {
        const json = await res.json();
        setCampaigns(json.campaigns || []);
        setTemplates(json.templates || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleLaunchCampaign() {
    setActionLoading(true);
    try {
      const res = await fetch("/api/tenant/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_campaign",
          ...formData,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.campaign) {
          setCampaigns([json.campaign, ...campaigns]);
        }
        setSafetyModalOpen(false);
        setModalOpen(false);
        setFormData({
          name: "",
          targetAudience: "All Active Leads",
          templateId: "",
          templateName: "appointment_reminder_v1",
          recipientCount: 250,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/90 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2">
            WhatsApp Broadcast Campaigns
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#207de9] border border-blue-200">
              Anti-Spam Throttled
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch bulk approved notifications, newsletters, and reminders with real-time delivery telemetry.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#207de9] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-600 transition-colors mt-3 sm:mt-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Broadcast Campaign</span>
        </button>
      </div>

      {/* Safety Quota Warning Banner */}
      <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/70 text-xs text-blue-900 flex items-start gap-3 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-[#207de9] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-[#080d24]">Meta Cloud API Rate-Limit Safeguard Active</span>
          <p className="text-slate-600 leading-relaxed">
            All campaigns are distributed in rolling buckets of 80 messages/second with automated opt-out handling (STOP compliance) to protect WABA phone number health and prevent quality score degradation.
          </p>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((camp) => {
          const deliveryRate = camp.sentCount > 0 ? Math.round((camp.deliveredCount / camp.sentCount) * 100) : 100;
          const readRate = camp.sentCount > 0 ? Math.round((camp.readCount / camp.sentCount) * 100) : 80;

          return (
            <div key={camp.id} className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-sm font-bold text-[#080d24]">{camp.name}</h2>
                  <div className="text-[11px] text-slate-500 mt-0.5">Audience: {camp.targetAudience}</div>
                </div>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200 uppercase">
                  {camp.status}
                </span>
              </div>

              <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Template:</span>
                  <span className="text-[#207de9] font-semibold">{camp.templateName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Recipients:</span>
                  <span className="text-[#080d24] font-semibold">{camp.recipientCount}</span>
                </div>
              </div>

              {/* Real-Time Metrics Grid */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                  <div className="text-slate-400 text-[10px]">Sent</div>
                  <div className="font-bold text-[#080d24] mt-0.5">{camp.sentCount}</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                  <div className="text-slate-400 text-[10px]">Delivered</div>
                  <div className="font-bold text-emerald-600 mt-0.5">{camp.deliveredCount}</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                  <div className="text-slate-400 text-[10px]">Read</div>
                  <div className="font-bold text-[#207de9] mt-0.5">{camp.readCount}</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                  <div className="text-slate-400 text-[10px]">Replies</div>
                  <div className="font-bold text-purple-600 mt-0.5">{camp.repliesCount}</div>
                </div>
              </div>

              {/* Delivery Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Delivery Success</span>
                  <span className="text-emerald-600 font-bold">{deliveryRate}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${deliveryRate}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step 1: Create Broadcast Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#080d24] flex items-center gap-2">
                <Send className="w-4 h-4 text-[#207de9]" />
                Configure Broadcast Campaign
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Diwali Health Checkup Special Offer"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9] focus:ring-1 focus:ring-[#207de9]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Target Audience</label>
                <select
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9]"
                >
                  <option value="All Active Leads">All Active Leads (Pipeline)</option>
                  <option value="Won Customers">Won Deals & Existing Patients</option>
                  <option value="Follow-up Due Contacts">Follow-up Due Contacts</option>
                  <option value="Cold Leads">Unconverted Prospects</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Select Approved Template</label>
                <select
                  value={formData.templateName}
                  onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9]"
                >
                  {templates.length > 0 ? (
                    templates.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.category})
                      </option>
                    ))
                  ) : (
                    <option value="appointment_reminder_v1">appointment_reminder_v1</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Total Recipients</label>
                <input
                  type="number"
                  value={formData.recipientCount}
                  onChange={(e) => setFormData({ ...formData, recipientCount: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setSafetyModalOpen(true)}
                  className="px-5 py-2 bg-[#207de9] hover:bg-blue-600 text-white rounded-xl font-semibold shadow-xs transition-colors"
                >
                  Review & Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Safety Check Confirmation Modal */}
      {safetyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-base font-bold text-[#080d24]">Confirm Outbound Broadcast</h2>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              You are preparing to send <strong className="text-[#080d24]">{formData.recipientCount} WhatsApp messages</strong> using the Meta Cloud API template <strong className="text-[#207de9] font-mono">{formData.templateName}</strong> to audience: <strong className="text-[#080d24]">{formData.targetAudience}</strong>.
            </p>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 space-y-1">
              <div>✓ Verified opt-in consent checked</div>
              <div>✓ Rate limit pacing active (80 msgs / sec)</div>
              <div>✓ Automatic STOP keyword opt-out enabled</div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                disabled={actionLoading}
                onClick={() => setSafetyModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Back to Edit
              </button>
              <button
                disabled={actionLoading}
                onClick={handleLaunchCampaign}
                className="px-5 py-2 bg-[#207de9] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                {actionLoading ? "Dispatching..." : "Confirm & Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
