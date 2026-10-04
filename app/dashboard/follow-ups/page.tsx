"use client";

import { useEffect, useState } from "react";
import {
  CalendarClock,
  Plus,
  CheckCircle2,
  Clock,
  UserCheck,
  Phone,
  AlertCircle,
  X,
} from "lucide-react";
import { Followup } from "@/lib/whatsapp/types";

export default function TenantFollowupsPage() {
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    notes: "",
    dueAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    assignedAgentName: "Dr. Arvind Sharma",
  });

  useEffect(() => {
    fetchFollowups();
  }, []);

  async function fetchFollowups() {
    try {
      setLoading(true);
      const res = await fetch("/api/tenant");
      if (res.ok) {
        const json = await res.json();
        setFollowups(json.followups || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(fup: Followup) {
    const updatedStatus = fup.status === "completed" ? "pending" : "completed";
    setFollowups((prev) =>
      prev.map((f) => (f.id === fup.id ? { ...f, status: updatedStatus } : f))
    );

    try {
      await fetch("/api/tenant/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_followup",
          followupId: fup.id,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreateFollowup(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.customerName || !formData.notes) return;

    try {
      const res = await fetch("/api/tenant/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_followup",
          ...formData,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.followup) {
          setFollowups([json.followup, ...followups]);
        }
        setModalOpen(false);
        setFormData({
          customerName: "",
          customerPhone: "",
          notes: "",
          dueAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
          assignedAgentName: "Dr. Arvind Sharma",
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/90 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2">
            Scheduled WhatsApp Follow-ups
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
              {followups.filter((f) => f.status === "pending").length} Pending
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated calendar reminders and agent follow-up triggers for high-intent leads.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#207de9] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-600 transition-colors mt-3 sm:mt-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Follow-up</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {followups.map((fup) => (
          <div
            key={fup.id}
            className={`p-5 rounded-2xl border transition-all space-y-3 shadow-xs ${
              fup.status === "completed"
                ? "border-slate-200 bg-slate-50/70 opacity-70"
                : "border-slate-200/90 bg-white"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#080d24]">{fup.customerName}</h2>
                <div className="text-xs font-mono font-medium text-emerald-600 mt-0.5">{fup.customerPhone}</div>
              </div>
              <button
                onClick={() => handleToggleStatus(fup)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                  fup.status === "completed"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                }`}
              >
                {fup.status}
              </button>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed">
              "{fup.notes}"
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{new Date(fup.dueAt).toLocaleDateString()} at {new Date(fup.dueAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <span className="text-slate-600 font-medium">{fup.assignedAgentName}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#080d24]">Schedule WhatsApp Follow-up</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateFollowup} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Customer / Lead Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9] focus:ring-1 focus:ring-[#207de9]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">WhatsApp Phone Number</label>
                <input
                  type="text"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="+91 98..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] font-mono focus:outline-none focus:border-[#207de9] focus:ring-1 focus:ring-[#207de9]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Follow-up Due Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.dueAt}
                  onChange={(e) => setFormData({ ...formData, dueAt: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Reminder Notes / Action Plan *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g., Check if MRI scan was scheduled and confirm attendance..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9] focus:ring-1 focus:ring-[#207de9]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Assigned Agent</label>
                <select
                  value={formData.assignedAgentName}
                  onChange={(e) => setFormData({ ...formData, assignedAgentName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9]"
                >
                  <option value="Dr. Arvind Sharma">Dr. Arvind Sharma</option>
                  <option value="Rohan Verma">Rohan Verma</option>
                  <option value="Sneha Rao">Sneha Rao</option>
                </select>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#207de9] hover:bg-blue-600 text-white rounded-xl font-semibold shadow-xs transition-colors"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
