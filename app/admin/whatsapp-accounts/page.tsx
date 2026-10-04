"use client";

import { useEffect, useState } from "react";
import { Smartphone, CheckCircle2, ShieldCheck, RefreshCw, AlertTriangle, Key } from "lucide-react";

export default function AdminWhatsAppAccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/saas");
        if (res.ok) {
          const json = await res.json();
          setAccounts(json.whatsappAccounts || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleTest(businessId: string) {
    setTestingId(businessId);
    try {
      const res = await fetch("/api/whatsapp/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Connection Healthy!\nVerified Name: ${data.verifiedName}\nStatus: ${data.status}\nQuality: ${data.qualityRating}`);
      } else {
        alert(`Connection Failed: ${data.message || data.error}`);
      }
    } catch {
      alert("Error testing connection");
    } finally {
      setTestingId(null);
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/90 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2.5">
            Connected WhatsApp Accounts
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#207de9] border border-blue-200">
              Meta Cloud API
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global monitoring for all tenant WhatsApp Business Accounts (WABA), phone number IDs, and webhook health.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => (
          <div key={acc.id} className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-bold text-[#080d24] text-sm">{acc.businessName}</h2>
                <span className="text-[11px] font-mono text-emerald-600 font-semibold">{acc.displayPhoneNumber}</span>
              </div>
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200 uppercase">
                {acc.status}
              </span>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono">
              <div className="flex justify-between text-slate-500">
                <span>WABA ID:</span>
                <span className="text-slate-700">{acc.wabaId}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Phone Number ID:</span>
                <span className="text-slate-700">{acc.phoneNumberId}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Quality Rating:</span>
                <span className="text-emerald-600 font-bold">{acc.qualityRating}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Messaging Tier:</span>
                <span className="text-[#207de9] font-bold">{acc.messagingLimitTier}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Daily Limit:</span>
                <span className="text-[#080d24] font-medium">{acc.dailyMessagesSentToday} / {acc.dailyMessagesLimit}</span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Webhook: {acc.webhookStatus}
              </span>
              <button
                onClick={() => handleTest(acc.businessId)}
                disabled={testingId === acc.businessId}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-xs font-semibold text-[#207de9] border border-blue-200 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${testingId === acc.businessId ? "animate-spin" : ""}`} />
                <span>Test Health</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
