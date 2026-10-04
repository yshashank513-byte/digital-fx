"use client";

import { useState } from "react";
import { Settings, Save, Shield, Key, Bell, Globe } from "lucide-react";

export default function AdminSystemSettingsPage() {
  const [metaApiVersion, setMetaApiVersion] = useState("v21.0");
  const [webhookToken, setWebhookToken] = useState("digitalfx_whatsapp_webhook_token_2026");
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div className="border-b border-slate-200/90 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2">
          Global System Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Master Meta Cloud API configuration, webhook endpoints, and platform variables.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-6 shadow-xs">
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#080d24] flex items-center gap-2">
            <Key className="w-4 h-4 text-[#207de9]" /> WhatsApp Cloud API Master Parameters
          </h2>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1.5">Graph API Version</label>
              <input
                type="text"
                value={metaApiVersion}
                onChange={(e) => setMetaApiVersion(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[#080d24] font-mono focus:outline-none focus:border-[#207de9]"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1.5">Webhook Verify Token (Secret)</label>
              <input
                type="text"
                value={webhookToken}
                onChange={(e) => setWebhookToken(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[#080d24] font-mono focus:outline-none focus:border-[#207de9]"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1.5">Live Webhook Callback URL</label>
              <input
                type="text"
                readOnly
                value="https://digitalfx.in/api/whatsapp/webhook"
                className="w-full bg-slate-100/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-emerald-700 font-mono font-medium"
              />
              <p className="text-[11px] text-slate-400 mt-1.5">Configure this URL inside Meta Developer App &gt; WhatsApp &gt; Configuration</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 2500);
            }}
            className="px-5 py-2.5 bg-[#207de9] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saved ? "Settings Saved Successfully!" : "Save System Config"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
