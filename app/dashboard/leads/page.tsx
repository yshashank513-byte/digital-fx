"use client";

import { useEffect, useState } from "react";
import {
  UserCheck,
  Search,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  X,
  Filter,
} from "lucide-react";
import { Lead, LeadStatus } from "@/lib/whatsapp/types";

const STAGES: { id: LeadStatus; label: string; color: string }[] = [
  { id: "new", label: "New Leads", color: "text-blue-600 bg-blue-50 border-blue-200" },
  { id: "contacted", label: "Contacted", color: "text-cyan-600 bg-cyan-50 border-cyan-200" },
  { id: "qualified", label: "Qualified", color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
  { id: "quotation_sent", label: "Quotation Sent", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { id: "negotiation", label: "Negotiation", color: "text-purple-600 bg-purple-50 border-purple-200" },
  { id: "won", label: "Won", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { id: "lost", label: "Lost", color: "text-rose-700 bg-rose-50 border-rose-200" },
];

export default function TenantLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    source: "WhatsApp Inbound",
    requirement: "",
    estimatedValue: 500,
    status: "new" as LeadStatus,
    assignedToAgentName: "Dr. Arvind Sharma",
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      setLoading(true);
      const res = await fetch("/api/tenant");
      if (res.ok) {
        const json = await res.json();
        setLeads(json.leads || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddLead(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    try {
      const res = await fetch("/api/tenant/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_lead",
          ...formData,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.lead) {
          setLeads((prev) => [json.lead, ...prev]);
        }
        setAddModalOpen(false);
        setFormData({
          name: "",
          phone: "",
          email: "",
          source: "WhatsApp Inbound",
          requirement: "",
          estimatedValue: 500,
          status: "new",
          assignedToAgentName: "Dr. Arvind Sharma",
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpdateStatus(leadId: string, newStatus: LeadStatus) {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }

    try {
      await fetch("/api/tenant/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_lead_status",
          leadId,
          status: newStatus,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  }

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      l.requirement.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalValue = filteredLeads.reduce((a, b) => a + (b.estimatedValue || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2">
            Leads Pipeline CRM
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-[#207de9] border border-blue-200">
              {filteredLeads.length} Leads
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Total Pipeline Value: <span className="font-bold text-[#080d24] font-mono">${totalValue.toLocaleString()}</span> across 7 qualification stages.
          </p>
        </div>

        <div className="flex items-center gap-2.5 mt-3 sm:mt-0">
          <div className="flex rounded-xl bg-white border border-slate-200 p-0.5 shadow-2xs">
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-2 rounded-lg ${
                viewMode === "kanban" ? "bg-[#207de9] text-white shadow-xs" : "text-slate-500 hover:text-[#080d24]"
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg ${
                viewMode === "table" ? "bg-[#207de9] text-white shadow-xs" : "text-slate-500 hover:text-[#080d24]"
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#207de9] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads by name, phone or requirement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#080d24] placeholder-slate-400 focus:outline-none focus:border-[#207de9]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5" /> Stage:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#080d24] px-3 py-2 focus:outline-none focus:border-[#207de9]"
          >
            <option value="all">All Stages</option>
            {STAGES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW 1: KANBAN BOARD */}
      {viewMode === "kanban" ? (
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-200">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage.id);
            const stageTotal = stageLeads.reduce((a, b) => a + (b.estimatedValue || 0), 0);

            return (
              <div
                key={stage.id}
                className="w-72 shrink-0 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col max-h-[750px]"
              >
                <div className="p-3.5 border-b border-slate-200/80 bg-white rounded-t-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${stage.color}`}>
                      {stage.label}
                    </span>
                    <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 flex items-center justify-center">
                      {stageLeads.length}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    ${stageTotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-200">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#207de9] cursor-pointer transition-all space-y-2.5 shadow-2xs group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="font-bold text-xs text-[#080d24] group-hover:text-[#207de9] transition-colors">
                          {lead.name}
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-600">
                          ${lead.estimatedValue}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {lead.requirement}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                        <span className="font-mono text-[#207de9] font-semibold">{lead.phone}</span>
                        <span>{lead.source}</span>
                      </div>

                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 truncate max-w-[100px]">{lead.assignedToAgentName || "Unassigned"}</span>
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateStatus(lead.id, e.target.value as LeadStatus)}
                            className="bg-slate-50 border border-slate-200 text-[10px] text-slate-700 font-semibold rounded-lg px-2 py-0.5 focus:outline-none"
                          >
                            {STAGES.map((s) => (
                              <option key={s.id} value={s.id}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW 2: TABLE */
        <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-slate-500 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Source</th>
                  <th className="py-3 px-3">Requirement</th>
                  <th className="py-3 px-3">Estimated Value</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Assigned Agent</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#080d24]">{lead.name}</td>
                    <td className="py-3 px-3 font-mono text-[#207de9] font-semibold">{lead.phone}</td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{lead.email || "—"}</td>
                    <td className="py-3 px-3 text-slate-600">{lead.source}</td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">{lead.requirement}</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#080d24]">${lead.estimatedValue}</td>
                    <td className="py-3 px-3">
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateStatus(lead.id, e.target.value as LeadStatus)}
                        className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-lg px-2.5 py-1"
                      >
                        {STAGES.map((s) => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{lead.assignedToAgentName || "Unassigned"}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#207de9] hover:text-white text-xs font-semibold text-slate-700 transition"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected Lead Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-2xs">
          <div className="h-full w-full max-w-md bg-white border-l border-slate-200 p-6 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#080d24]">{selectedLead.name}</h2>
                <div className="text-xs text-[#207de9] font-mono mt-0.5 font-semibold">{selectedLead.phone}</div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-1 rounded-lg text-slate-400 hover:text-[#080d24]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Pipeline Stage:</span>
                  <span className="font-bold uppercase text-[#207de9]">{selectedLead.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Deal Value:</span>
                  <span className="font-mono text-[#080d24] font-bold">${selectedLead.estimatedValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lead Source:</span>
                  <span className="text-slate-700">{selectedLead.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Agent:</span>
                  <span className="text-slate-700">{selectedLead.assignedToAgentName}</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-400 uppercase text-[10px] mb-1">Requirement / Notes</h3>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedLead.requirement}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <a
                href={`/dashboard/inbox?convoId=conv_101`}
                className="flex-1 py-2 bg-[#207de9] hover:bg-blue-600 text-white text-xs font-bold rounded-xl text-center shadow-xs"
              >
                Open WhatsApp Chat
              </a>
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#080d24]">Create New Lead</h2>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-[#080d24]">✕</button>
            </div>

            <form onSubmit={handleAddLead} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24]"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">WhatsApp Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24]"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Lead Source</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24]"
                  >
                    <option value="WhatsApp Inbound">WhatsApp Inbound</option>
                    <option value="Website Ad">Website Ad</option>
                    <option value="Google Maps">Google Maps</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Estimated Value ($)</label>
                <input
                  type="number"
                  value={formData.estimatedValue}
                  onChange={(e) => setFormData({ ...formData, estimatedValue: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Requirement *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.requirement}
                  onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24]"
                  placeholder="Detail client requirement or service request..."
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#207de9] hover:bg-blue-600 text-white rounded-xl font-bold shadow-xs"
                >
                  Create Lead
                </button>
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
