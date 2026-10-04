"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Search, Filter } from "lucide-react";
import { INITIAL_AUDIT_LOGS } from "@/lib/whatsapp/mockData";

export default function AdminAuditLogsPage() {
  const [logs] = useState(INITIAL_AUDIT_LOGS);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="border-b border-slate-200/90 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2">
          Security & Audit Logs
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Immutable trail of administrative operations, tenant impersonation, and credential mutations.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-4 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200/90 text-slate-500 uppercase font-semibold text-[10px] bg-slate-50/70">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor Email</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Target Tenant</th>
                <th className="py-2.5 px-3">IP Address</th>
                <th className="py-2.5 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px] text-slate-700">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 text-slate-500">{log.timestamp.replace("T", " ").slice(0, 19)}</td>
                  <td className="py-3 px-3 text-[#080d24] font-medium">{log.actorEmail}</td>
                  <td className="py-3 px-3">
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] text-[#207de9] uppercase font-bold border border-blue-200">
                      {log.actorRole}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#080d24]">{log.action}</td>
                  <td className="py-3 px-3 text-slate-600 font-sans">{log.businessName || "System-Wide"}</td>
                  <td className="py-3 px-3 text-slate-400">{log.ipAddress || "127.0.0.1"}</td>
                  <td className="py-3 px-3 text-slate-500 font-sans max-w-xs truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
