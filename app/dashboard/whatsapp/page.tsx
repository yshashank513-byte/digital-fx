"use client";

import { useEffect, useState } from "react";
import {
  Smartphone,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export default function TenantWhatsAppConnectionPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    fetchStatus();
  }, []);

  async function fetchStatus() {
    try {
      setLoading(true);
      const res = await fetch("/api/tenant");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleTestConnection() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/whatsapp/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: data?.business?.id }),
      });
      const result = await res.json();
      setTestResult(result);
    } catch (err: any) {
      setTestResult({ success: false, status: "DISCONNECTED", message: err.message });
    } finally {
      setTesting(false);
    }
  }

  const biz = data?.business || { name: "Apex Super-Speciality Hospital" };
  const acc = data?.whatsappAccount || {
    wabaId: "waba_99182736450",
    phoneNumberId: "phone_id_881726354",
    displayPhoneNumber: "+91 98101 23456",
    verifiedName: biz.name,
    qualityRating: "GREEN",
    status: "CONNECTED",
    webhookStatus: "VERIFIED",
    messagingLimitTier: "TIER_10K",
    dailyMessagesSentToday: 1420,
    dailyMessagesLimit: 10000,
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2.5">
            WhatsApp Business API Connection
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-[#207de9] border border-blue-200">
              Meta Cloud API v21.0
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise connectivity status, Phone Number ID, and webhook event streaming.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestConnection}
            disabled={testing}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#207de9] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? "animate-spin" : ""}`} />
            <span>Test Connection</span>
          </button>
          <button
            onClick={() => {
              setConnected(!connected);
              alert(connected ? "WhatsApp disconnected" : "WhatsApp reconnected");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
              connected
                ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                : "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
            }`}
          >
            {connected ? "Disconnect" : "Reconnect WhatsApp"}
          </button>
        </div>
      </div>

      {/* Test Alert */}
      {testResult && (
        <div className={`p-4 rounded-2xl border ${
          testResult.success
            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
            : "border-rose-200 bg-rose-50 text-rose-900"
        } text-xs flex items-start gap-3 shadow-2xs`}>
          {testResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
          <div>
            <div className="font-bold text-sm">
              {testResult.success ? "Connection Verified Successfully" : "Connection Test Failed"}
            </div>
            <div className="mt-1 space-y-0.5 text-[11px] font-mono">
              <div>Status: {testResult.status}</div>
              {testResult.verifiedName && <div>Verified Name: {testResult.verifiedName}</div>}
              {testResult.phoneNumber && <div>Display Number: {testResult.phoneNumber}</div>}
              {testResult.qualityRating && <div>Quality Rating: {testResult.qualityRating}</div>}
              <div>{testResult.message}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Connection Details Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#207de9]">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#080d24]">{acc.verifiedName || biz.name}</h2>
              <div className="text-xs font-mono text-[#207de9] font-bold">{acc.displayPhoneNumber}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {connected ? "LIVE & CONNECTED" : "OFFLINE"}
            </span>
          </div>
        </div>

        {/* Technical IDs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-sans font-bold">
              WhatsApp Business Account (WABA) ID
            </span>
            <div className="text-[#080d24] font-bold text-sm">{acc.wabaId}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-sans font-bold">
              Phone Number ID
            </span>
            <div className="text-[#080d24] font-bold text-sm">{acc.phoneNumberId}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-sans font-bold">
              Webhook Status
            </span>
            <div className="text-emerald-700 font-bold text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{acc.webhookStatus} (HMAC-SHA256)</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-sans font-bold">
              Meta Quality Rating & Messaging Tier
            </span>
            <div className="text-[#080d24] font-bold text-sm">
              {acc.qualityRating} Rating • {acc.messagingLimitTier}
            </div>
          </div>
        </div>

        {/* Quota Usage Meter */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-700 font-semibold">Daily Broadcast & Outbound Messaging Quota</span>
            <span className="font-mono text-[#207de9] font-bold">
              {acc.dailyMessagesSentToday.toLocaleString()} / {acc.dailyMessagesLimit.toLocaleString()} messages
            </span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#207de9]"
              style={{ width: `${Math.round((acc.dailyMessagesSentToday / acc.dailyMessagesLimit) * 100)}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between">
            <span>Resets daily at 00:00 UTC</span>
            <span>Meta Anti-Spam Safe Tier</span>
          </div>
        </div>
      </div>

      {/* Security Architecture Box */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-2 shadow-2xs">
        <h3 className="text-xs font-bold text-[#080d24] uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Digital FX Security & Credential Isolation
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Access tokens (`WHATSAPP_ACCESS_TOKEN`), secrets (`WHATSAPP_APP_SECRET`), and webhook verify tokens (`WEBHOOK_VERIFY_TOKEN`) are strictly managed on the server side via environment variables and never exposed to client browsers or localStorage.
        </p>
      </div>
    </div>
  );
}
