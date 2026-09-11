"use client";

import { adminFetch } from "@/lib/adminFetch";
import { useEffect, useState, useCallback, useMemo } from "react";
import CustomerDrawer, { DrawerRecord } from "../../../components/admin/CustomerDrawer";
import { supabase } from "../../lib/supabase";

type AnalysisItem = {
  id: string;
  url: string;
  title: string | null;
  overall: number;
  ai_visibility: number;
  local_presence: number;
  technical: number;
  insights: string[] | null;
  recommendations: string[] | null;
  created_at: string;
  ai_analysis?: {
    analysis_type?: string;
    customer_name?: string;
    customer_phone?: string;
    customer_email?: string;
    service?: string;
    analysis_status?: string;
  };
};

const FILTERS = ["All", "Free", "Paid", "Completed", "Pending"];

export default function WebsiteAnalysesPage() {
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedRecord, setSelectedRecord] = useState<DrawerRecord | null>(null);

  const loadAnalyses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminFetch("/api/admin/analyses", {
        method: "GET",
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAnalyses(data.data);
      }
    } catch (err) {
      console.error("LOAD ANALYSES ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalyses();

    const channel = supabase
      .channel("admin-analyses-page")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "geo_analyses" },
        () => {
          loadAnalyses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadAnalyses]);

  const filtered = useMemo(() => {
    return analyses.filter((item) => {
      const type = item.ai_analysis?.analysis_type || "free";
      const status = item.ai_analysis?.analysis_status || "completed";

      let matchesFilter = true;
      if (filter === "Free") matchesFilter = type === "free";
      if (filter === "Paid") matchesFilter = type === "paid";
      if (filter === "Completed") matchesFilter = status === "completed";
      if (filter === "Pending") matchesFilter = status === "pending";

      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (item.url || "").toLowerCase().includes(q) ||
        (item.title || "").toLowerCase().includes(q) ||
        (item.ai_analysis?.customer_name || "").toLowerCase().includes(q) ||
        (item.ai_analysis?.customer_phone || "").toLowerCase().includes(q) ||
        (item.ai_analysis?.customer_email || "").toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [analyses, filter, search]);

  function exportCSV() {
    const headers = ["ID", "URL", "Overall Score", "GEO Score", "Local Score", "Type", "Status", "Customer", "Date"];
    const rows = filtered.map((a) => [
      '"' + a.id + '"',
      '"' + (a.url || "") + '"',
      a.overall,
      a.ai_visibility,
      a.local_presence,
      '"' + (a.ai_analysis?.analysis_type || "free") + '"',
      '"' + (a.ai_analysis?.analysis_status || "completed") + '"',
      '"' + (a.ai_analysis?.customer_name || "").replace(/"/g, '""') + '"',
      '"' + (a.created_at ? new Date(a.created_at).toLocaleString("en-IN") : "") + '"',
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "digitalfx_analyses_" + Date.now() + ".csv");
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

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
              Audit Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#080d24] mt-1">Website Analyses</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Realtime AI visibility, Google Maps citation health, and audit audit records.
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
            onClick={loadAnalyses}
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
            placeholder="Search by website URL, customer name, email..."
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
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                "px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer " +
                (filter === f
                  ? "bg-[#207de9] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/60 hover:text-[#080d24]")
              }
            >
              {f}
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
                <th className="py-3.5 px-5">Customer &amp; Website</th>
                <th className="py-3.5 px-4">Scores (Overall / GEO / SEO)</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <span className="inline-block h-5 w-5 border-2 border-slate-200 border-t-[#207de9] rounded-full animate-spin mr-2" />
                    Loading website analyses...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No website analyses found.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr
                    key={a.id}
                    onClick={() =>
                      setSelectedRecord({
                        id: a.id,
                        type: "analysis",
                        name: a.ai_analysis?.customer_name || "Website Visitor",
                        phone: a.ai_analysis?.customer_phone || null,
                        email: a.ai_analysis?.customer_email || null,
                        website: a.url,
                        service: a.ai_analysis?.service || "GEO AI Search Audit",
                        status: a.ai_analysis?.analysis_status || "completed",
                        date: formatDate(a.created_at),
                        overallScore: a.overall,
                        seoScore: a.local_presence,
                        geoScore: a.ai_visibility,
                        performanceScore: a.technical,
                        recommendations: a.recommendations,
                      })
                    }
                    className="hover:bg-slate-50/70 transition group cursor-pointer"
                  >
                    <td className="py-3.5 px-5">
                      <span className="font-bold text-[#080d24] group-hover:text-[#207de9] transition block">
                        {a.ai_analysis?.customer_name || "Website Visitor"}
                      </span>
                      <span className="font-mono text-[11px] text-[#207de9] block truncate">
                        {a.url}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#207de9] font-black border border-blue-200 tabular-nums">
                          {a.overall || 0}/100
                        </span>
                        <span className="text-[11px] text-purple-600 font-bold">
                          GEO {a.ai_visibility || 0}%
                        </span>
                        <span className="text-[11px] text-emerald-600 font-bold">
                          SEO {a.local_presence || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={
                          "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border " +
                          (a.ai_analysis?.analysis_type === "paid"
                            ? "bg-violet-50 text-violet-700 border-violet-200"
                            : "bg-slate-100 text-slate-600 border-slate-200")
                        }
                      >
                        {a.ai_analysis?.analysis_type === "paid" ? "★ Paid Audit" : "Free Audit"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={
                          "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border " +
                          (a.ai_analysis?.analysis_status === "completed" || !a.ai_analysis?.analysis_status
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200")
                        }
                      >
                        {a.ai_analysis?.analysis_status || "Completed"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {formatDate(a.created_at)}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-[#080d24] transition shadow-2xs">
                        Audit Report →
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
      />

    </div>
  );
}
