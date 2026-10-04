"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileCode2, ExternalLink } from "lucide-react";
import { INITIAL_TEMPLATES } from "@/lib/whatsapp/mockData";

export default function AdminGlobalTemplatesPage() {
  const [templates] = useState(INITIAL_TEMPLATES);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/90 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2">
            Message Templates (Meta Approved)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official Meta WhatsApp template catalog and approval state across all client accounts.
          </p>
        </div>
        <Link
          href="/dashboard/templates"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#207de9] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <span>Open Tenant Template Studio</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <div key={t.id} className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 font-bold">{t.businessId}</span>
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                {t.status}
              </span>
            </div>

            <div>
              <h2 className="text-sm font-bold text-[#080d24]">{t.name}</h2>
              <span className="text-[10px] uppercase font-mono text-slate-400">{t.category} • {t.language}</span>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono leading-relaxed">
              {t.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
