"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserCheck, Search, Filter, ExternalLink } from "lucide-react";
import { INITIAL_LEADS } from "@/lib/whatsapp/mockData";

export default function AdminGlobalLeadsPage() {
  const [leads] = useState(INITIAL_LEADS);
  const [search, setSearch] = useState("");

  const filtered = leads.filter(
    (l) => l.name.toLowerCase().includes(search.toLowerCase()) || l.requirement.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/90 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2">
            Global Leads Aggregator
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Super admin view of all leads captured across tenant WhatsApp pipelines.
          </p>
        </div>
        <Link
          href="/dashboard/leads"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#207de9] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <span>Open Tenant Leads CRM</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#080d24] placeholder-slate-400 focus:outline-none focus:border-[#207de9]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200/90 text-slate-500 uppercase font-semibold text-[10px] bg-slate-50/70">
              <tr>
                <th className="py-2.5 px-3">Lead Name</th>
                <th className="py-2.5 px-3">Tenant ID</th>
                <th className="py-2.5 px-3">Phone</th>
                <th className="py-2.5 px-3">Requirement</th>
                <th className="py-2.5 px-3">Est. Value</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-semibold text-[#080d24]">{l.name}</td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{l.businessId}</td>
                  <td className="py-3 px-3 text-emerald-600 font-mono">{l.phone}</td>
                  <td className="py-3 px-3 text-slate-600">{l.requirement}</td>
                  <td className="py-3 px-3 font-mono font-bold text-[#080d24]">${l.estimatedValue.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[#207de9] border border-blue-200">
                      {l.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{l.assignedToAgentName || "Unassigned"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
