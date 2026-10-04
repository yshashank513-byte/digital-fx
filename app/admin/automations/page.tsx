"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Workflow, ExternalLink, Play, Pause } from "lucide-react";
import { INITIAL_AUTOMATIONS } from "@/lib/whatsapp/mockData";

export default function AdminGlobalAutomationsPage() {
  const [automations] = useState(INITIAL_AUTOMATIONS);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/90 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2">
            Automations & Workflows
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visual workflow execution engine and global automation stats across tenants.
          </p>
        </div>
        <Link
          href="/dashboard/automations"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#207de9] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <span>Open Visual Workflow Builder</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {automations.map((a) => (
          <div key={a.id} className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 font-bold">{a.businessId}</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${a.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-600"}`}>
                {a.isActive ? "ACTIVE" : "PAUSED"}
              </span>
            </div>

            <h2 className="text-sm font-bold text-[#080d24]">{a.name}</h2>
            <p className="text-xs text-slate-500 leading-relaxed">{a.description}</p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Runs: {a.totalRuns.toLocaleString()}</span>
              <span className="text-emerald-600 font-semibold">Success: {a.successRuns.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
