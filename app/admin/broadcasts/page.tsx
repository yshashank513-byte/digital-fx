"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Radio, ExternalLink } from "lucide-react";
import { INITIAL_CAMPAIGNS } from "@/lib/whatsapp/mockData";

export default function AdminGlobalBroadcastsPage() {
  const [broadcasts] = useState(INITIAL_CAMPAIGNS);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/90 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2">
            Global WhatsApp Broadcasts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Super admin real-time broadcast monitoring and delivery status.
          </p>
        </div>
        <Link
          href="/dashboard/broadcasts"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#207de9] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <span>Open Tenant Broadcasts</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200/90 text-slate-500 uppercase font-semibold text-[10px] bg-slate-50/70">
            <tr>
              <th className="py-2.5 px-3">Broadcast Name</th>
              <th className="py-2.5 px-3">Tenant</th>
              <th className="py-2.5 px-3">Target Audience</th>
              <th className="py-2.5 px-3">Recipients</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Delivery Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
            {broadcasts.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-3 font-semibold text-[#080d24] font-sans">{b.name}</td>
                <td className="py-3 px-3 text-slate-500">{b.businessId}</td>
                <td className="py-3 px-3 text-slate-600 font-sans">{b.targetAudience}</td>
                <td className="py-3 px-3 text-[#080d24] font-bold">{b.recipientCount}</td>
                <td className="py-3 px-3 font-sans">
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700 font-semibold border border-emerald-200">
                    {b.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-emerald-600 font-bold">
                  {Math.round((b.deliveredCount / b.sentCount) * 100)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
