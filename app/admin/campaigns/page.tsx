"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Send, ExternalLink } from "lucide-react";
import { INITIAL_CAMPAIGNS } from "@/lib/whatsapp/mockData";

export default function AdminGlobalCampaignsPage() {
  const [campaigns] = useState(INITIAL_CAMPAIGNS);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/90 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2">
            Broadcast Campaigns Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global campaign analytics, throughput tracking, and recipient deliverability.
          </p>
        </div>
        <Link
          href="/dashboard/campaigns"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#207de9] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <span>Open Tenant Broadcast Manager</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((c) => (
          <div key={c.id} className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 font-bold">{c.businessId}</span>
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase border border-emerald-200">
                {c.status}
              </span>
            </div>

            <h2 className="text-sm font-bold text-[#080d24]">{c.name}</h2>
            <div className="text-xs text-slate-500">Audience: {c.targetAudience}</div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                <div className="text-slate-400 text-[10px]">Sent</div>
                <div className="font-bold text-[#080d24] mt-0.5">{c.sentCount}</div>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                <div className="text-slate-400 text-[10px]">Delivered</div>
                <div className="font-bold text-emerald-600 mt-0.5">{c.deliveredCount}</div>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                <div className="text-slate-400 text-[10px]">Read</div>
                <div className="font-bold text-[#207de9] mt-0.5">{c.readCount}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
