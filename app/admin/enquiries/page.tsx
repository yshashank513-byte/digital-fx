"use client";

import { adminFetch } from "@/lib/adminFetch";
import { useEffect, useState, useCallback, useMemo } from "react";
import CustomerDrawer, { DrawerRecord } from "../../../components/admin/CustomerDrawer";
import { supabase } from "../../lib/supabase";

type Enquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string | null;
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

  const filtered = useMemo(() => {
    return enquiries.filter((item) => {
      const matchesStatus =
        statusFilter === "All" ||
        (item.status || "").toLowerCase() === statusFilter.toLowerCase();

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
    const headers = ["ID", "Name", "Email", "Phone", "Service", "Status", "Date", "Message"];
    const rows = filtered.map((e) => [
      e.id,
      '"' + (e.name || "").replace(/"/g, '""') + '"',
      '"' + (e.email || "") + '"',
      '"' + (e.phone || "") + '"',
      '"' + (e.service || "").replace(/"/g, '""') + '"',
      '"' + (e.status || "") + '"',
      '"' + (e.created_at ? new Date(e.created_at).toLocaleString("en-IN") : "") + '"',
      '"' + (e.message || "").replace(/"/g, '""') + '"',
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "digitalfx_enquiries_" + Date.now() + ".csv");
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
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#207de9]">
              Customer Acquisition
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#080d24] mt-1">Customer Enquiries</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage incoming contact requests and lead statuses in real time.
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
            onClick={loadEnquiries}
            className="flex items-center gap-2 rounded-xl bg-[#207de9] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1570ef] shadow-xs transition cursor-pointer"
          >
            <span>↻ Refresh</span>
          </button>
        </div>
      </div>

      {/* Controls: Search & Status Filter */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone, email, service..."
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

      {/* Data Table Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10.5px] uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Service</th>
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
                    Loading enquiries from database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No enquiries found.
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr
                    key={e.id}
                    className="hover:bg-slate-50/70 transition group cursor-pointer"
                    onClick={() =>
                      setSelectedRecord({
                        id: e.id,
                        type: "enquiry",
                        name: e.name,
                        email: e.email,
                        phone: e.phone,
                        service: e.service,
                        website: e.message?.match(/Target Website:\s*([^\s\n]+)/i)?.[1] || "—",
                        status: e.status || "New",
                        date: formatDate(e.created_at),
                        message: e.message,
                      })
                    }
                  >
                    <td className="py-3.5 px-5">
                      <span className="font-bold text-[#080d24] group-hover:text-[#207de9] transition block">
                        {e.name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{e.phone || "—"}</div>
                      <div className="text-[11px] text-slate-400">{e.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#080d24]">
                      {e.service || "General Growth Enquiry"}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {formatDate(e.created_at)}
                    </td>
                    <td className="py-3.5 px-4" onClick={(ev) => ev.stopPropagation()}>
                      <select
                        value={e.status || "New"}
                        onChange={(ev) => handleStatusChange(e.id, ev.target.value)}
                        className={
                          "text-xs font-bold rounded-lg border px-2.5 py-1 outline-none cursor-pointer " +
                          getStatusStyle(e.status)
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
                            id: e.id,
                            type: "enquiry",
                            name: e.name,
                            email: e.email,
                            phone: e.phone,
                            service: e.service,
                            website: e.message?.match(/Target Website:\s*([^\s\n]+)/i)?.[1] || "—",
                            status: e.status || "New",
                            date: formatDate(e.created_at),
                            message: e.message,
                          })
                        }
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-[#080d24] transition shadow-2xs"
                      >
                        Details →
                      </button>
                    </td>
                  </tr>
                ))
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
