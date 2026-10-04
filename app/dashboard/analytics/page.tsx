"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, CheckCircle2, Clock, Send, Users } from "lucide-react";

export default function TenantAnalyticsPage() {
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

  const weeklyData = [
    { day: "Mon", sent: 1820, delivered: 1790, read: 1420 },
    { day: "Tue", sent: 2100, delivered: 2060, read: 1680 },
    { day: "Wed", sent: 1950, delivered: 1910, read: 1540 },
    { day: "Thu", sent: 2400, delivered: 2360, read: 1920 },
    { day: "Fri", sent: 2850, delivered: 2800, read: 2340 },
    { day: "Sat", sent: 1600, delivered: 1580, read: 1290 },
    { day: "Sun", sent: 1100, delivered: 1090, read: 890 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="border-b border-slate-200/90 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2">
          WhatsApp Deliverability & Conversion Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed metrics on inbound message response speeds, campaign engagement, and pipeline conversion.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="text-xs text-slate-500">Avg First Response Time</div>
          <div className="text-2xl font-extrabold text-[#080d24] mt-1.5">1m 42s</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">85% automated reply</div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="text-xs text-slate-500">Message Delivery Rate</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1.5">98.4%</div>
          <div className="text-[11px] text-slate-500 mt-1">Meta Cloud API</div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="text-xs text-slate-500">Message Read Rate</div>
          <div className="text-2xl font-extrabold text-[#207de9] mt-1.5">82.1%</div>
          <div className="text-[11px] text-slate-500 mt-1">High customer engagement</div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="text-xs text-slate-500">Lead Conversion Rate</div>
          <div className="text-2xl font-extrabold text-purple-600 mt-1.5">32.6%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">+4.2% this week</div>
        </div>
      </div>

      {/* Weekly Message Volume Chart */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#080d24]">Weekly WhatsApp Throughput (Sent vs Read)</h2>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Sent</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#207de9]" /> Read</span>
          </div>
        </div>

        <div className="h-60 w-full flex items-end gap-4 pt-6 pb-2 px-2 border-b border-slate-100">
          {weeklyData.map((d, i) => {
            const heightSent = Math.round((d.sent / 3000) * 100);
            const heightRead = Math.round((d.read / 3000) * 100);

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="flex items-end gap-1.5 w-full justify-center" style={{ height: "100%" }}>
                  <div className="w-5 bg-emerald-500 rounded-t-md transition-all hover:bg-emerald-600" style={{ height: `${heightSent}%` }} title={`Sent: ${d.sent}`} />
                  <div className="w-5 bg-[#207de9] rounded-t-md transition-all hover:bg-blue-600" style={{ height: `${heightRead}%` }} title={`Read: ${d.read}`} />
                </div>
                <span className="text-[11px] font-medium text-slate-500">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
