"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, ExternalLink } from "lucide-react";
import { INITIAL_CONVERSATIONS } from "@/lib/whatsapp/mockData";

export default function AdminGlobalConversationsPage() {
  const [conversations] = useState(INITIAL_CONVERSATIONS);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/90 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2">
            Active WhatsApp Conversations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Super admin overview of active threads across all client instances.
          </p>
        </div>
        <Link
          href="/dashboard/inbox"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#207de9] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <span>Open Live WhatsApp Inbox</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200/90 text-slate-500 uppercase font-semibold text-[10px] bg-slate-50/70">
            <tr>
              <th className="py-2.5 px-3">Contact</th>
              <th className="py-2.5 px-3">Business ID</th>
              <th className="py-2.5 px-3">Phone</th>
              <th className="py-2.5 px-3">Last Message</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Assigned Agent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {conversations.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-3 font-semibold text-[#080d24]">{c.customerName}</td>
                <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{c.businessId}</td>
                <td className="py-3 px-3 text-emerald-600 font-mono">{c.customerPhone}</td>
                <td className="py-3 px-3 text-slate-600 max-w-sm truncate">{c.lastMessage}</td>
                <td className="py-3 px-3">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] uppercase font-bold text-slate-600 border border-slate-200">
                    {c.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-500">{c.assignedAgentName || "Automated Bot"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
