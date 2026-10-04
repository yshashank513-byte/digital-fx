"use client";

import { Bell, CheckCircle2, Info, AlertTriangle } from "lucide-react";

export default function AdminNotificationsPage() {
  const notifications = [
    { id: 1, title: "Webhook Health 100%", desc: "All 5 tenant webhooks responded within 200ms", time: "10 mins ago", type: "success" },
    { id: 2, title: "New Lead Spike", desc: "Velocita Motors received 12 WhatsApp inbound leads today", time: "1 hour ago", type: "info" },
    { id: 3, title: "Daily Quota 75%", desc: "Apex Hospital has reached 75% of their daily tier allocation", time: "4 hours ago", type: "warning" },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div className="border-b border-slate-200/90 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2">
          System Alerts & Notifications
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          High-priority notifications across multi-tenant infrastructure and billing events.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className="p-4 rounded-2xl border border-slate-200/90 bg-white flex items-start gap-3.5 shadow-xs">
            <div className={`p-2.5 rounded-xl ${
              n.type === "success"
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : n.type === "warning"
                ? "bg-amber-50 text-amber-600 border border-amber-200"
                : "bg-blue-50 text-[#207de9] border border-blue-200"
            }`}>
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-[#080d24]">{n.title}</h2>
                <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
