"use client";

import { adminFetch } from "@/lib/adminFetch";
import { useEffect, useState, useCallback, useMemo } from "react";
import CustomerDrawer, { DrawerRecord } from "../../../components/admin/CustomerDrawer";
import { supabase } from "../../lib/supabase";

type Proposal = {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string | null;
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
        (p.status || "").toLowerCase() === statusFilter.toLowerCase();

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
    const headers = ["ID", "Name", "Email", "Phone", "Service", "Status", "Date", "Requirements"];
    const rows = filtered.map((p) => [
      p.id,
      '"' + (p.name || "").replace(/"/g, '""') + '"',
      '"' + (p.email || "") + '"',
      '"' + (p.phone || "") + '"',
      '"' + (p.service || "").replace(/"/g, '""') + '"',
      '"' + (p.status || "") + '"',
      '"' + (p.created_at ? new Date(p.created_at).toLocaleString("en-IN") : "") + '"',
      '"' + (p.message || "").replace(/"/g, '""') + '"',
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "digitalfx_proposals_" + Date.now() + ".csv");
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
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "proposal sent":
      case "in progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "contacted":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "closed":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-600">
              High-Value Pipeline
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#080d24] mt-1">Strategic Proposals</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Enterprise proposal requests, scope analyses, and contract negotiations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition disabled:opacity-40 cursor-pointer"
          >
            <span>📥 Export CSV</span>
          </button>
          <button
            onClick={loadProposals}
            className="flex items-center gap-2 rounded-xl bg-[#207de9] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1570ef] shadow-xs transition cursor-pointer"
          >
            <span>↻ Refresh</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search proposals by company, customer, phone..."
            className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-xs font-medium text-[#080d24] placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#207de9] transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
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
              className={
                "px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer " +
                (statusFilter === st
                  ? "bg-[#207de9] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/60 hover:text-[#080d24]")
              }
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10.5px] uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="py-3.5 px-5">Target Prospect</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Scope / Objective</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <span className="inline-block h-5 w-5 border-2 border-slate-200 border-t-[#207de9] rounded-full animate-spin mr-2" />
                    Loading strategic proposals...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No strategic proposal requests recorded.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const targetWebsite =
                    p.message?.match(/Target Website:\s*([^\s\n]+)/i)?.[1] || "—";
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/70 transition group cursor-pointer"
                      onClick={() =>
                        setSelectedRecord({
                          id: p.id,
                          type: "proposal",
                          name: p.name,
                          email: p.email,
                          phone: p.phone,
                          service: p.service,
                          website: targetWebsite,
                          status: p.status || "New",
                          date: formatDate(p.created_at),
                          message: p.message,
                        })
                      }
                    >
                      <td className="py-3.5 px-5">
                        <span className="font-bold text-[#080d24] group-hover:text-[#207de9] transition block">
                          {p.name}
                        </span>
                        {targetWebsite !== "—" && (
                          <span className="text-[11px] font-mono text-[#207de9] block truncate">
                            {targetWebsite}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div>{p.phone || "—"}</div>
                        <div className="text-[11px] text-slate-400">{p.email}</div>
                      </td>
                      <td className="py-3.5 px-4 text-[#080d24]">
                        {p.service || "Strategic Growth Proposal"}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {formatDate(p.created_at)}
                      </td>
                      <td className="py-3.5 px-4" onClick={(ev) => ev.stopPropagation()}>
                        <select
                          value={p.status || "New"}
                          onChange={(ev) => handleStatusChange(p.id, ev.target.value)}
                          className={
                            "text-xs font-bold rounded-lg border px-2.5 py-1 outline-none cursor-pointer " +
                            getStatusStyle(p.status)
                          }
                        >
                          {STATUSES.filter((s) => s !== "All").map((s) => (
                            <option key={s} value={s} className="bg-white text-[#080d24]">
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-5 text-right" onClick={(ev) => ev.stopPropagation()}>
                        <button
                          onClick={() =>
                            setSelectedRecord({
                              id: p.id,
                              type: "proposal",
                              name: p.name,
                              email: p.email,
                              phone: p.phone,
                              service: p.service,
                              website: targetWebsite,
                              status: p.status || "New",
                              date: formatDate(p.created_at),
                              message: p.message,
                            })
                          }
                          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-[#080d24] transition shadow-2xs"
                        >
                          Details →
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

      <CustomerDrawer
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onStatusChange={handleStatusChange}
      />

    </div>
  );
}
