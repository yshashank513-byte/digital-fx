"use client";

import { adminFetch } from "@/lib/adminFetch";

import { useEffect, useState, useCallback, useMemo } from "react";
import CustomerDrawer, { DrawerRecord } from "../../../components/admin/CustomerDrawer";
import { supabase } from "../../lib/supabase";

type AnalysisItem = {
  id: number;
  url: string;
  seo: number;
  performance: number;
  mobile: number;
  content: number;
  geo: number;
  overall: number;
  title: string | null;
  description: string | null;
  recommendations: string[] | null;
  ai_analysis: {
    customer_name?: string;
    customer_phone?: string;
    customer_email?: string;
    service?: string;
    analysis_type?: string;
    analysis_status?: string;
    payment_status?: string;
  } | null;
  created_at: string;
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

  // Filter & Search Logic
  const filtered = useMemo(() => {
    return analyses.filter((item) => {
      const type = (item.ai_analysis?.analysis_type || "free").toLowerCase();
      const status = (item.ai_analysis?.analysis_status || "completed").toLowerCase();

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
        (item.ai_analysis?.customer_email || "").toLowerCase().includes(q) ||
        (item.ai_analysis?.customer_phone || "").toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [analyses, filter, search]);

  function exportCSV() {
    const headers = [
      "ID",
      "Customer",
      "Phone",
      "Email",
      "Website",
      "Overall Score",
      "GEO Score",
      "SEO Score",
      "Type",
      "Status",
      "Date",
    ];
    const rows = filtered.map((a) => [
      a.id,
      `"${(a.ai_analysis?.customer_name || "Website Visitor").replace(/"/g, '""')}"`,
      `"${a.ai_analysis?.customer_phone || ""}"`,
      `"${a.ai_analysis?.customer_email || ""}"`,
      `"${(a.url || "").replace(/"/g, '""')}"`,
      a.overall || 0,
      a.geo || 0,
      a.seo || 0,
      `"${a.ai_analysis?.analysis_type || "free"}"`,
      `"${a.ai_analysis?.analysis_status || "completed"}"`,
      `"${new Date(a.created_at).toLocaleString("en-IN")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `digitalfx_analyses_${Date.now()}.csv`);
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

  function getScoreColor(score: number) {
    if (score >= 80) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 60) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-red-400 bg-red-500/10 border-red-500/20";
  }

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
              Intelligence Audit Pipeline
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Website &amp; GEO Analyses</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor and review website audit submissions, generative AI search scores, and diagnostic health.
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
            onClick={loadAnalyses}
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
            placeholder="Search by website URL, customer name, email..."
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
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filter === f
                  ? "bg-[#315df5] text-white"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
              }`}
            >
              {f}
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
                <th className="py-3.5 px-5">Customer &amp; Website</th>
                <th className="py-3.5 px-4">Scores (Overall / GEO / SEO)</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <span className="inline-block h-5 w-5 border-2 border-white/30 border-t-emerald-500 rounded-full animate-spin mr-2" />
                    Loading website analyses...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
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
                        seoScore: a.seo,
                        geoScore: a.geo,
                        mobileScore: a.mobile,
                        performanceScore: a.performance,
                        recommendations: a.recommendations,
                        title: a.title,
                      })
                    }
                    className="hover:bg-white/[0.03] transition cursor-pointer group"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-xs font-black text-white shadow-sm shrink-0">
                          ⚡
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-white group-hover:text-emerald-400 transition truncate">
                            {a.ai_analysis?.customer_name || "Website Visitor"}
                          </p>
                          <p className="text-[11px] text-blue-300 font-mono truncate">
                            {a.url}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-md font-mono font-bold text-xs border ${getScoreColor(
                            a.overall || 0
                          )}`}
                        >
                          {a.overall || 0}/100
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          (G:{a.geo || 0}% • S:{a.seo || 0}%)
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          (a.ai_analysis?.analysis_type || "free") === "paid"
                            ? "bg-violet-500/15 text-violet-400 border-violet-500/30"
                            : "bg-blue-500/15 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {a.ai_analysis?.analysis_type || "free"}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                        {a.ai_analysis?.analysis_status || "completed"}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {formatDate(a.created_at)}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <button className="text-xs font-bold text-emerald-400 hover:text-white transition">
                        Full Audit →
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
      />

    </div>
  );
}
