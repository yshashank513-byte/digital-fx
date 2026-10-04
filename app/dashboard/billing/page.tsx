"use client";

import { useEffect, useState } from "react";
import { CreditCard, Check, Zap, ArrowUpRight, Receipt, ShieldCheck } from "lucide-react";

export default function TenantBillingPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/tenant");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const biz = data?.business || { name: "Apex Hospital", planTier: "growth" };
  const plan = data?.plan || {
    name: "Growth Tier",
    tier: "growth",
    priceMonthly: 79,
    limits: { monthlyMessages: 10000, automations: 10, contacts: 5000, users: 5 },
  };

  const usage = data?.usage || { messagesSent: 6840 };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="border-b border-slate-200/90 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2">
          Subscription & Billing Overview
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage payment methods, plan tiers, and usage quotas for this tenant workspace.
        </p>
      </div>

      {/* Active Plan Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#080d24] uppercase">{plan.name}</span>
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                ACTIVE
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1">Renews automatically on November 1, 2026</div>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-[#080d24]">${plan.priceMonthly}</span>
            <span className="text-xs text-slate-500 font-medium">/ month</span>
          </div>
        </div>

        {/* Quota Usage Meters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 font-medium">WhatsApp Messages Quota</span>
              <span className="font-mono text-emerald-600 font-bold">
                {usage.messagesSent?.toLocaleString()} / {plan.limits?.monthlyMessages?.toLocaleString()}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.round((usage.messagesSent / (plan.limits?.monthlyMessages || 10000)) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 font-medium">Active Automations Quota</span>
              <span className="font-mono text-[#207de9] font-bold">3 / {plan.limits?.automations || 10}</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#207de9] rounded-full" style={{ width: "30%" }} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => alert("Redirecting to Razorpay / Stripe Billing Portal...")}
            className="px-5 py-2.5 bg-[#207de9] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            Upgrade Plan Tier
          </button>
        </div>
      </div>

      {/* Invoice History */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-4 shadow-xs">
        <h2 className="text-sm font-bold text-[#080d24]">Billing Invoices</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-slate-100 text-slate-500 uppercase text-[10px] font-sans bg-slate-50/70">
              <tr>
                <th className="py-2.5 px-3">Invoice ID</th>
                <th className="py-2.5 px-3">Billing Period</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-3 text-[#207de9] font-semibold">INV-2026-10-01</td>
                <td className="py-3 px-3 text-slate-600 font-sans">October 2026 ({plan.name})</td>
                <td className="py-3 px-3 text-[#080d24] font-bold">${plan.priceMonthly} USD</td>
                <td className="py-3 px-3 text-emerald-600 font-sans font-semibold">PAID</td>
                <td className="py-3 px-3 text-slate-500 underline cursor-pointer hover:text-slate-800">Download PDF</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
