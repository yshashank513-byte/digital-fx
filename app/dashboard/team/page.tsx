"use client";

import { useEffect, useState } from "react";
import { Users2, Plus, ShieldCheck, Mail, Phone, X } from "lucide-react";
import { TeamMember } from "@/lib/whatsapp/types";

export default function TenantTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "agent" as any,
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  async function fetchTeam() {
    try {
      setLoading(true);
      const res = await fetch("/api/tenant");
      if (res.ok) {
        const json = await res.json();
        setMembers(json.teamMembers || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    try {
      const res = await fetch("/api/tenant/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_team_member",
          ...formData,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.teamMember) {
          setMembers([...members, json.teamMember]);
        }
        setModalOpen(false);
        setFormData({ name: "", email: "", phone: "", role: "agent" });
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
            Team Members & Role-Based Access Control (RBAC)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage agent permissions, conversation routing assignments, and administrator rights.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#207de9] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-600 transition-colors mt-3 sm:mt-0"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200/90 bg-slate-50/70 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Active Chats Assigned</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {members.map((tm) => (
                <tr key={tm.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#080d24]">{tm.name}</td>
                  <td className="py-3.5 px-3 text-slate-500">{tm.email}</td>
                  <td className="py-3.5 px-3">
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] uppercase font-bold text-[#207de9] border border-blue-200">
                      {tm.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-700 font-mono font-medium">{tm.assignedConversationsCount}</td>
                  <td className="py-3.5 px-3">
                    <span className="text-emerald-600 font-semibold">{tm.status}</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 font-mono">{tm.joinedAt?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#080d24]">Invite Team Member</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9] focus:ring-1 focus:ring-[#207de9]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Role & Permissions</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9]"
                >
                  <option value="agent">Agent (Inbox & Leads Only)</option>
                  <option value="manager">Manager (Campaigns & Automations)</option>
                  <option value="admin">Admin (Full Workspace Management)</option>
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
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
