"use client";

import { useEffect, useState } from "react";
import { Gauge, AlertCircle, CheckCircle, BarChart3 } from "lucide-react";
import { INITIAL_USAGE } from "@/lib/whatsapp/mockData";

export default function AdminUsageLimitsPage() {
  const [usageList, setUsageList] = useState(INITIAL_USAGE);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="border-b border-slate-200/90 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2">
          Usage & Quota Limits
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor message volumes, API rate thresholds, and plan limits enforcement across all tenants.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-4 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200/90 text-slate-500 uppercase font-semibold text-[10px] bg-slate-50/70">
              <tr>
                <th className="py-3 px-3">Business ID</th>
                <th className="py-3 px-3">Billing Cycle</th>
                <th className="py-3 px-3">Messages Sent</th>
                <th className="py-3 px-3">Delivered</th>
                <th className="py-3 px-3">Failed</th>
                <th className="py-3 px-3">Contacts</th>
                <th className="py-3 px-3">Automations</th>
                <th className="py-3 px-3">API Requests</th>
                <th className="py-3 px-3">Quota Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
              {usageList.map((u) => {
                const limit = u.businessId === "biz-001" ? 100000 : u.businessId === "biz-002" ? 25000 : 10000;
                const percent = Math.min(100, Math.round((u.messagesSent / limit) * 100));

                return (
                  <tr key={u.businessId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-[#080d24] font-sans">{u.businessId}</td>
                    <td className="py-3.5 px-3 text-slate-500">{u.month}</td>
                    <td className="py-3.5 px-3 text-emerald-600 font-bold">{u.messagesSent.toLocaleString()}</td>
                    <td className="py-3.5 px-3 text-slate-700">{u.messagesDelivered.toLocaleString()}</td>
                    <td className="py-3.5 px-3 text-rose-500">{u.messagesFailed.toLocaleString()}</td>
                    <td className="py-3.5 px-3 text-slate-700">{u.contactsTotal}</td>
                    <td className="py-3.5 px-3 text-slate-700">{u.automationsActive}</td>
                    <td className="py-3.5 px-3 text-[#207de9]">{u.apiRequests.toLocaleString()}</td>
                    <td className="py-3.5 px-3 font-sans">
                      <div className="w-28 space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>{percent}%</span>
                          <span>{u.messagesSent}/{limit / 1000}k</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${percent > 90 ? "bg-rose-500" : percent > 75 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
