"use client";

import { useEffect, useState } from "react";
import { CreditCard, Check, Shield, DollarSign, ArrowUpRight } from "lucide-react";
import { INITIAL_PLANS } from "@/lib/whatsapp/mockData";

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await fetch("/api/admin/saas");
        if (res.ok) {
          const json = await res.json();
          setInvoices(json.invoices || []);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchInvoices();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <div className="border-b border-slate-200/90 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2">
          SaaS Plans & Subscription Management
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure pricing tiers, quotas, feature gating, and billing invoices.
        </p>
      </div>

      {/* 4 Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((p) => (
          <div key={p.id} className="rounded-2xl border border-slate-200/90 bg-white p-5 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#207de9]">{p.name}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-semibold">
                  {p.tier}
                </span>
              </div>

              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-extrabold text-[#080d24]">${p.priceMonthly}</span>
                <span className="text-xs text-slate-500 ml-1">/month</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{p.description}</p>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="font-semibold text-slate-700 text-[11px] uppercase">Quotas & Limits:</div>
                <div className="text-slate-600 flex justify-between">
                  <span>Messages:</span>
                  <span className="text-[#080d24] font-semibold font-mono">{p.limits.monthlyMessages.toLocaleString()} / mo</span>
                </div>
                <div className="text-slate-600 flex justify-between">
                  <span>Automations:</span>
                  <span className="text-[#080d24] font-semibold font-mono">{p.limits.automations} workflows</span>
                </div>
                <div className="text-slate-600 flex justify-between">
                  <span>Contacts:</span>
                  <span className="text-[#080d24] font-semibold font-mono">{p.limits.contacts.toLocaleString()}</span>
                </div>
                <div className="text-slate-600 flex justify-between">
                  <span>Seats:</span>
                  <span className="text-[#080d24] font-semibold font-mono">{p.limits.users} users</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="font-semibold text-slate-700 text-[11px] uppercase mb-2">Features:</div>
                {p.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-600 text-[11px]">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => alert(`Plan "${p.name}" configuration updated.`)}
                className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
              >
                Edit Plan Settings
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Invoices */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-4 shadow-xs">
        <h2 className="text-sm font-bold text-[#080d24]">Recent Subscription Invoices</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200/90 text-slate-500 uppercase font-semibold text-[10px] bg-slate-50/70">
              <tr>
                <th className="py-2.5 px-3">Invoice #</th>
                <th className="py-2.5 px-3">Business</th>
                <th className="py-2.5 px-3">Plan Tier</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Payment Method</th>
                <th className="py-2.5 px-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 text-[#207de9] font-semibold">{inv.id}</td>
                  <td className="py-3 px-3 text-[#080d24] font-sans font-medium">{inv.businessName}</td>
                  <td className="py-3 px-3 text-slate-600 font-sans">{inv.planName}</td>
                  <td className="py-3 px-3 text-[#080d24] font-bold">${inv.amount} USD</td>
                  <td className="py-3 px-3">
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700 font-sans font-semibold border border-emerald-200">
                      PAID
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-sans">{inv.paymentMethod}</td>
                  <td className="py-3 px-3 text-slate-400">{inv.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
