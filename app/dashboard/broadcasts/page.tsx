"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Radio, Plus, CheckCircle2, Send, ArrowRight } from "lucide-react";

export default function TenantBroadcastsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/tenant");
        if (res.ok) {
          const json = await res.json();
          setCampaigns(json.campaigns || []);
        }
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/90 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2">
            Instant WhatsApp Broadcasts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Send instant broadcast alerts to segmented groups and track live deliverability.
          </p>
        </div>

        <Link
          href="/dashboard/campaigns"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#207de9] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Launch New Broadcast</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200/90 text-slate-500 uppercase font-semibold text-[10px] bg-slate-50/70">
              <tr>
                <th className="py-3 px-3">Broadcast Name</th>
                <th className="py-3 px-3">Template</th>
                <th className="py-3 px-3">Target Audience</th>
                <th className="py-3 px-3">Recipients</th>
                <th className="py-3 px-3">Delivered</th>
                <th className="py-3 px-3">Read Rate</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-[#080d24] font-sans">{c.name}</td>
                  <td className="py-3.5 px-3 text-[#207de9]">{c.templateName}</td>
                  <td className="py-3.5 px-3 text-slate-600 font-sans">{c.targetAudience}</td>
                  <td className="py-3.5 px-3 text-[#080d24] font-bold">{c.recipientCount}</td>
                  <td className="py-3.5 px-3 text-emerald-600 font-semibold">{c.deliveredCount}</td>
                  <td className="py-3.5 px-3 text-[#207de9] font-semibold">{c.sentCount > 0 ? Math.round((c.readCount / c.sentCount) * 100) : 100}%</td>
                  <td className="py-3.5 px-3 font-sans">
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700 font-semibold border border-emerald-200 uppercase">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
