"use client";

import { useEffect, useState } from "react";
import { LifeBuoy, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { INITIAL_SUPPORT_TICKETS } from "@/lib/whatsapp/mockData";

export default function AdminSupportTicketsPage() {
  const [tickets] = useState(INITIAL_SUPPORT_TICKETS);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="border-b border-slate-200/90 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2">
          Tenant Support Tickets
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Respond to customer questions regarding Meta Cloud API, webhook configurations, and billing inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tickets.map((t) => (
          <div key={t.id} className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 font-bold">{t.id}</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                t.priority === "HIGH" ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}>
                {t.priority}
              </span>
            </div>

            <h2 className="text-sm font-bold text-[#080d24]">{t.subject}</h2>
            <div className="text-xs text-slate-500">
              <span className="text-slate-700 font-medium">{t.businessName}</span> • {t.category}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-semibold">{t.status}</span>
              <button
                onClick={() => alert(`Opening ticket ${t.id}`)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
              >
                Respond
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
