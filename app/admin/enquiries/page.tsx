"use client";

import { adminFetch } from "@/lib/adminFetch";

import { useEffect, useState, useCallback, useMemo } from "react";
import CustomerDrawer, { DrawerRecord } from "../../../components/admin/CustomerDrawer";
import { supabase } from "../../lib/supabase";

type Enquiry = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  service: string;
  message: string | null;
  status: string;
  created_at: string;
};

const STATUSES = ["All", "New", "Contacted", "In Progress", "Converted", "Closed"];

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRecord, setSelectedRecord] = useState<DrawerRecord | null>(null);

  const loadEnquiries = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminFetch("/api/admin/enquiries", {
        method: "GET",
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setEnquiries(data.data);
      }
    } catch (err) {
      console.error("LOAD ENQUIRIES ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEnquiries();

    // Supabase realtime subscription
    const channel = supabase
      .channel("admin-enquiries-page")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "enquiries" },
        () => {
          loadEnquiries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadEnquiries]);

  // Filtered & Searched Data
  const filtered = useMemo(() => {
    return enquiries.filter((item) => {
      const matchesStatus =
        statusFilter === "All" ||
        item.status?.toLowerCase() === statusFilter.toLowerCase();

      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (item.name || "").toLowerCase().includes(q) ||
        (item.phone || "").toLowerCase().includes(q) ||
        (item.email || "").toLowerCase().includes(q) ||
        (item.service || "").toLowerCase().includes(q) ||
        (item.message || "").toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [enquiries, statusFilter, search]);

  async function handleStatusChange(id: string | number, newStatus: string) {
    const numId = Number(id);
    const res = await adminFetch("/api/admin/enquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: numId, status: newStatus }),
    });

    if (res.ok) {
      setEnquiries((prev) =>
        prev.map((item) => (item.id === numId ? { ...item, status: newStatus } : item))
      );
    }
  }

  function exportCSV() {
    const headers = ["ID", "Name", "Phone", "Email", "Service", "Status", "Date", "Message"];
    const rows = filtered.map((e) => [
      e.id,
      `"${(e.name || "").replace(/"/g, '""')}"`,
      `"${e.phone || ""}"`,
      `"${e.email || ""}"`,
      `"${(e.service || "").replace(/"/g, '""')}"`,
      `"${e.status || ""}"`,
      `"${new Date(e.created_at).toLocaleString("en-IN")}"`,
      `"${(e.message || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `digitalfx_enquiries_${Date.now()}.csv`);
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
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400">
              Customer Acquisition
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Customer Enquiries</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage incoming contact requests and lead statuses in real time.
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
            onClick={loadEnquiries}
            className="flex items-center gap-2 rounded-xl bg-[#315df5] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#234bd6] transition"
          >
            <span>↻ Refresh</span>
          </button>
        </div>
      </div>

      {/* Controls: Search & Status Filter */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone, email, service..."
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

      {/* Data Table */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-black/30 text-[10.5px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-4">Contact</th>
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
                    <span className="inline-block h-5 w-5 border-2 border-white/30 border-t-blue-500 rounded-full animate-spin mr-2" />
                    Loading enquiries from database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No enquiries match the selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr
                    key={e.id}
                    onClick={() =>
                      setSelectedRecord({
                        id: e.id,
                        type: "enquiry",
                        name: e.name,
                        phone: e.phone,
                        email: e.email,
                        service: e.service,
                        status: e.status,
                        date: formatDate(e.created_at),
                        message: e.message,
                        website:
                          e.message?.match(/Target Website:\s*([^\s\n]+)/i)?.[1] ||
                          e.message?.match(/Website:\s*([^\s\n|]+)/i)?.[1] ||
                          null,
                      })
                    }
                    className="hover:bg-white/[0.03] transition cursor-pointer group"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#315df5] to-[#7888ff] text-xs font-black text-white shadow-sm shrink-0">
                          {e.name?.charAt(0).toUpperCase() || "C"}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-white group-hover:text-blue-300 transition">
                            {e.name}
                          </p>
                          {e.email && (
                            <p className="text-[11px] text-slate-400 font-mono">
                              {e.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-200">
                      {e.phone}
                    </td>

                    <td className="py-4 px-4 text-slate-300 max-w-[200px] truncate">
                      {e.service}
                    </td>

                    <td className="py-4 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {formatDate(e.created_at)}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(
                          e.status
                        )}`}
                      >
                        {e.status}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <button className="text-xs font-bold text-[#6f8cff] hover:text-white transition">
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))
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