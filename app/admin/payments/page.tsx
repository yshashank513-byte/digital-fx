"use client";

import { adminFetch } from "@/lib/adminFetch";

import { useEffect, useState, useCallback, useMemo } from "react";
import CustomerDrawer, { DrawerRecord } from "../../../components/admin/CustomerDrawer";
import { supabase } from "../../lib/supabase";

type Payment = {
  id?: string;
  txnid: string;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  plan_id?: string | null;
  product_name?: string | null;
  amount?: number | string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const FILTERS = ["All", "Paid", "Pending", "Failed"];

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedRecord, setSelectedRecord] = useState<DrawerRecord | null>(null);

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminFetch("/api/admin/payments", {
        method: "GET",
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPayments(data.data);
      }
    } catch (err) {
      console.error("LOAD PAYMENTS ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();

    const channel = supabase
      .channel("admin-payments-page")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "payments" },
        () => {
          loadPayments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadPayments]);

  // Verified Revenue calculation (Successful payments ONLY)
  const verifiedRevenue = useMemo(() => {
    return payments
      .filter((p) => {
        const s = (p.status || "").toLowerCase();
        return s === "success" || s === "paid";
      })
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
  }, [payments]);

  const pendingCount = useMemo(() => {
    return payments.filter((p) => (p.status || "").toLowerCase() === "pending").length;
  }, [payments]);

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const s = (p.status || "").toLowerCase();
      let matchesFilter = true;
      if (filter === "Paid") matchesFilter = s === "success" || s === "paid";
      if (filter === "Pending") matchesFilter = s === "pending";
      if (filter === "Failed") matchesFilter = s === "failed" || s === "failure";

      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (p.customer_name || "").toLowerCase().includes(q) ||
        (p.customer_email || "").toLowerCase().includes(q) ||
        (p.customer_phone || "").toLowerCase().includes(q) ||
        (p.txnid || "").toLowerCase().includes(q) ||
        (p.product_name || "").toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [payments, filter, search]);

  function exportCSV() {
    const headers = [
      "Txn ID",
      "Customer",
      "Phone",
      "Email",
      "Product / Scope",
      "Amount",
      "Status",
      "Date",
    ];
    const rows = filtered.map((p) => [
      `"${p.txnid || ""}"`,
      `"${(p.customer_name || "").replace(/"/g, '""')}"`,
      `"${p.customer_phone || ""}"`,
      `"${p.customer_email || ""}"`,
      `"${(p.product_name || p.plan_id || "").replace(/"/g, '""')}"`,
      p.amount || 0,
      `"${p.status || ""}"`,
      `"${p.created_at ? new Date(p.created_at).toLocaleString("en-IN") : ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `digitalfx_payments_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function formatDate(iso?: string | null) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getStatusStyle(st?: string | null) {
    switch ((st || "").toLowerCase()) {
      case "success":
      case "paid":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "pending":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      default:
        return "bg-red-500/15 text-red-400 border-red-500/30";
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
              Financial Operations
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Payment Transactions</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified gateway transactions, invoice settlement, and real attributable revenue.
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
            onClick={loadPayments}
            className="flex items-center gap-2 rounded-xl bg-[#315df5] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#234bd6] transition"
          >
            <span>↻ Refresh</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.05]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            Total Verified Revenue
          </span>
          <p className="mt-2 text-2xl font-black text-emerald-400 tabular-nums">
            ₹{verifiedRevenue.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-[10px] text-emerald-400/60">
            Calculated exclusively from successful payments
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Transactions Recorded
          </span>
          <p className="mt-2 text-2xl font-black text-white tabular-nums">
            {payments.length}
          </p>
          <p className="mt-1 text-[10px] text-slate-500">
            All gateway checkout events
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/[0.04]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
            Pending Checkouts
          </span>
          <p className="mt-2 text-2xl font-black text-amber-400 tabular-nums">
            {pendingCount}
          </p>
          <p className="mt-1 text-[10px] text-amber-400/60">
            Awaiting customer completion
          </p>
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
            placeholder="Search payments by customer, transaction ID, email..."
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
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-4">Package / Scope</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Txn ID</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <span className="inline-block h-5 w-5 border-2 border-white/30 border-t-emerald-500 rounded-full animate-spin mr-2" />
                    Loading payment records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No payment records match the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr
                    key={p.id || p.txnid}
                    onClick={() =>
                      setSelectedRecord({
                        id: p.id || p.txnid,
                        type: "payment",
                        name: p.customer_name || "Customer",
                        phone: p.customer_phone,
                        email: p.customer_email,
                        service: p.product_name || p.plan_id || "Package",
                        status: p.status === "success" ? "Paid" : p.status || "Pending",
                        date: formatDate(p.created_at),
                        amount: p.amount,
                        txnid: p.txnid,
                        productName: p.product_name,
                        planId: p.plan_id,
                      })
                    }
                    className="hover:bg-white/[0.03] transition cursor-pointer group"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-xs font-black text-white shadow-sm shrink-0">
                          ₹
                        </div>
                        <div>
                          <p className="font-bold text-sm text-white group-hover:text-emerald-300 transition">
                            {p.customer_name || "Customer"}
                          </p>
                          {p.customer_phone && (
                            <p className="text-[11px] text-slate-400 font-mono">
                              {p.customer_phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-200 max-w-[200px] truncate">
                      {p.product_name || p.plan_id || "Bespoke Service"}
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-white text-sm whitespace-nowrap">
                      ₹{Number(p.amount || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="py-4 px-4 font-mono text-[11px] text-blue-300 max-w-[150px] truncate">
                      {p.txnid}
                    </td>

                    <td className="py-4 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {formatDate(p.created_at)}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(
                          p.status
                        )}`}
                      >
                        {p.status === "success" ? "Paid" : p.status || "Pending"}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <button className="text-xs font-bold text-emerald-400 hover:text-white transition">
                        Receipt →
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