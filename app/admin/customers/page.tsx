"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, ExternalLink } from "lucide-react";
import { INITIAL_CUSTOMERS } from "@/lib/whatsapp/mockData";

export default function AdminGlobalCustomersPage() {
  const [customers] = useState(INITIAL_CUSTOMERS);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/90 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2">
            Global Customers Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Super admin record of all authenticated customers across tenant businesses.
          </p>
        </div>
        <Link
          href="/dashboard/customers"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#207de9] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <span>Open Tenant Customers</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200/90 text-slate-500 uppercase font-semibold text-[10px] bg-slate-50/70">
            <tr>
              <th className="py-2.5 px-3">Customer</th>
              <th className="py-2.5 px-3">Business ID</th>
              <th className="py-2.5 px-3">Phone</th>
              <th className="py-2.5 px-3">Company</th>
              <th className="py-2.5 px-3">Deals</th>
              <th className="py-2.5 px-3">Total Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-3 font-semibold text-[#080d24]">{c.name}</td>
                <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{c.businessId}</td>
                <td className="py-3 px-3 text-emerald-600 font-mono">{c.phone}</td>
                <td className="py-3 px-3 text-slate-600">{c.company || "Individual"}</td>
                <td className="py-3 px-3 text-slate-700">{c.totalOrdersOrDeals}</td>
                <td className="py-3 px-3 font-mono text-[#080d24] font-bold">${c.totalSpent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
