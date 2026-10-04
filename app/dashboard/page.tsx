"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  UserCheck,
  Send,
  Workflow,
  Clock,
  ArrowRight,
  CheckCircle2,
  Smartphone,
} from "lucide-react";

export default function TenantDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
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
    loadData();
  }, []);

  const biz = data?.business || { name: "Apex Super-Speciality Hospital", planTier: "enterprise" };
  const usage = data?.usage || { messagesSent: 42150, messagesDelivered: 41600 };
  const leads = data?.leads || [];
  const conversations = data?.conversations || [];
  const automations = data?.automations || [];
  const followups = data?.followups || [];

  const unreadCount = conversations.reduce((acc: number, c: any) => acc + (c.unreadCount || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2">
            {biz.name}
            <span className="rounded-full bg-blue-50 px-3 py-0.5 text-xs font-bold text-[#207de9] border border-blue-200 uppercase">
              {biz.planTier} Plan
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            WhatsApp Business API communication center, inbound lead capture, and automated workflows.
          </p>
        </div>

        <div className="flex items-center gap-2.5 mt-3 sm:mt-0">
          <Link
            href="/dashboard/campaigns"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#207de9] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-600 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Launch Campaign</span>
          </Link>
          <Link
            href="/dashboard/inbox"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#207de9]" />
            <span>Open Inbox ({unreadCount})</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Messages Delivered */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Messages Sent</span>
            <Send className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold tracking-tight text-[#080d24]">
            {usage.messagesSent?.toLocaleString() || "42,150"}
          </div>
          <div className="mt-1 flex items-center text-[11px] text-emerald-600 font-semibold">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            <span>98.6% delivered</span>
          </div>
        </div>

        {/* Total Inbound Leads */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Pipeline Leads</span>
            <UserCheck className="w-4 h-4 text-[#207de9]" />
          </div>
          <div className="mt-2 text-2xl font-extrabold tracking-tight text-[#080d24]">
            {leads.length}
          </div>
          <div className="mt-1 text-[11px] text-[#207de9] font-medium">
            <span>${leads.reduce((a: number, l: any) => a + (l.estimatedValue || 0), 0).toLocaleString()} pipeline value</span>
          </div>
        </div>

        {/* Active Automations */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Active Workflows</span>
            <Workflow className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold tracking-tight text-[#080d24]">
            {automations.filter((a: any) => a.isActive).length} / {automations.length}
          </div>
          <div className="mt-1 text-[11px] text-cyan-700 font-semibold">
            <span>Auto-reply & triage live</span>
          </div>
        </div>

        {/* Pending Follow-ups */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Pending Follow-ups</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold tracking-tight text-amber-600">
            {followups.filter((f: any) => f.status === "pending").length}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            <span>Action due today</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Inbound Conversations & WhatsApp Health */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Conversations */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#080d24]">Live WhatsApp Inbound Conversations</h2>
              <p className="text-xs text-slate-500">Recent customer chats requiring reply or routing</p>
            </div>
            <Link href="/dashboard/inbox" className="text-xs text-[#207de9] font-bold hover:underline flex items-center gap-1">
              View Inbox <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {conversations.slice(0, 5).map((conv: any) => (
              <Link
                key={conv.id}
                href={`/dashboard/inbox?convoId=${conv.id}`}
                className="flex items-center justify-between py-3 hover:bg-slate-50 px-2 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-xs text-[#207de9]">
                    {conv.customerName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#080d24] group-hover:text-[#207de9] transition-colors flex items-center gap-2">
                      {conv.customerName}
                      {conv.unreadCount > 0 && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-md">{conv.lastMessage}</div>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400">
                  <div>{conv.lastMessageAt?.slice(11, 16)}</div>
                  <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] uppercase font-bold text-slate-600">
                    {conv.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* WhatsApp Health & Quick Connect */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#080d24]">WhatsApp Account Status</h2>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Meta Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Phone:</span>
              <span className="text-[#080d24] font-mono font-semibold">{biz.whatsappNumber || "+91 98101 23456"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Quality Rating:</span>
              <span className="text-emerald-700 font-bold">GREEN (High)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Webhook:</span>
              <span className="text-emerald-700 font-semibold">Verified</span>
            </div>
          </div>

          <Link
            href="/dashboard/whatsapp"
            className="w-full py-2.5 bg-slate-100 hover:bg-[#207de9] hover:text-white text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Manage WhatsApp API</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
