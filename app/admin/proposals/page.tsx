"use client";

import { adminFetch } from "@/lib/adminFetch";

import { useEffect, useState, useCallback, useMemo } from "react";
import CustomerDrawer, { DrawerRecord } from "../../../components/admin/CustomerDrawer";
import { supabase } from "../../lib/supabase";

type Proposal = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  service: string;
  message: string | null;
  status: string;
  created_at: string;
};

const STATUSES = ["All", "New", "Contacted", "Proposal Sent", "Converted", "Closed"];

export default function StrategicProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRecord, setSelectedRecord] = useState<DrawerRecord | null>(null);

  const loadProposals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminFetch("/api/admin/proposals", {
        method: "GET",
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProposals(data.data);
      }
    } catch (err) {
      console.error("LOAD PROPOSALS ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProposals();

    const channel = supabase
      .channel("admin-proposals-page")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "enquiries" },
        () => {
          loadProposals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadProposals]);

  const filtered = useMemo(() => {
    return proposals.filter((p) => {
      const matchesStatus =
        statusFilter === "All" ||
        p.status?.toLowerCase() === statusFilter.toLowerCase();

      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (p.name || "").toLowerCase().includes(q) ||
        (p.phone || "").toLowerCase().includes(q) ||
        (p.email || "").toLowerCase().includes(q) ||
        (p.service || "").toLowerCase().includes(q) ||
        (p.message || "").toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [proposals, statusFilter, search]);

  async function handleStatusChange(id: string | number, newStatus: string) {
    const numId = Number(id);
    const res = await adminFetch("/api/admin/proposals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: numId, status: newStatus }),
    });

    if (res.ok) {
      setProposals((prev) =>
        prev.map((p) => (p.id === numId ? { ...p, status: newStatus } : p))
      );
    }
  }

  function exportCSV() {
    const headers = [
      "ID",
      "Customer",
      "Phone",
      "Email",
      "Service",
      "Target Website",
      "Status",
      "Date",
      "Requirement",
    ];
    const rows = filtered.map((p) => {
      const website =
        p.message?.match(/Target Website:\s*([^\s\n]+)/i)?.[1] ||
        p.message?.match(/Website:\s*([^\s\n|]+)/i)?.[1] ||
        "N/A";
      return [
        p.id,
        `"${(p.name || "").replace(/"/g, '""')}"`,
        `"${p.phone || ""}"`,
        `"${p.email || ""}"`,
        `"${(p.service || "").replace(/"/g, '""')}"`,
        `"${website}"`,
        `"${p.status || ""}"`,
        `"${new Date(p.created_at).toLocaleString("en-IN")}"`,
        `"${(p.message || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `digitalfx_proposals_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function formatDate(iso?: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getStatusStyle(st: string) {
    switch ((st || "").toLowerCase()) {
      case "converted":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "proposal sent":
        return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
      case "in progress":
        return "bg-violet-500/15 text-violet-400 border-violet-500/30";
      case "contacted":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "closed":
        return "bg-slate-700 text-slate-300 border-slate-600";
      default:
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">
              Enterprise Pipeline
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Strategic Proposals</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review custom proposal submissions, business requirements, and conversion stages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-white/10 transition disabled:opacity-40"
          >
            <span>📥 Export CSV</span>
          </button>
          <button
            onClick={loadProposals}
            className="flex items-center gap-2 rounded-xl bg-[#315df5] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#234bd6] transition"
          >
            <span>↻ Refresh</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search proposals by customer, website, requirement..."
            className="w-full h-10 rounded-xl border border-white/10 bg-black/20 pl-9 pr-4 text-xs font-medium text-white placeholder:text-slate-500 outline-none focus:border-[#315df5]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {STATUSES.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === st
                  ? "bg-[#315df5] text-white"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-black/30 text-[10.5px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-4">Website</th>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <span className="inline-block h-5 w-5 border-2 border-white/30 border-t-cyan-500 rounded-full animate-spin mr-2" />
                    Loading strategic proposals...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No strategic proposal requests recorded.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const website =
                    p.message?.match(/Target Website:\s*([^\s\n]+)/i)?.[1] ||
                    p.message?.match(/Website:\s*([^\s\n|]+)/i)?.[1] ||
                    null;

                  return (
                    <tr
                      key={p.id}
                      onClick={() =>
                        setSelectedRecord({
                          id: p.id,
                          type: "proposal",
                          name: p.name,
                          phone: p.phone,
                          email: p.email,
                          service: p.service,
                          status: p.status,
                          date: formatDate(p.created_at),
                          message: p.message,
                          website: website,
                        })
                      }
                      className="hover:bg-white/[0.03] transition cursor-pointer group"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-black text-white shadow-sm shrink-0">
                            📑
                          </div>
                          <div>
                            <p className="font-bold text-sm text-white group-hover:text-cyan-300 transition">
                              {p.name}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {p.phone}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-cyan-300 max-w-[180px] truncate">
                        {website || "—"}
                      </td>

                      <td className="py-4 px-4 text-slate-300 max-w-[220px] truncate">
                        {p.service}
                      </td>

                      <td className="py-4 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                        {formatDate(p.created_at)}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(
                            p.status
                          )}`}
                        >
                          {p.status}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <button className="text-xs font-bold text-cyan-400 hover:text-white transition">
                          Review →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer */}
      <CustomerDrawer
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onStatusChange={handleStatusChange}
      />

    </div>
  );
}
