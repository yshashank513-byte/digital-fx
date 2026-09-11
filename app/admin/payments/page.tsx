"use client";

import { adminFetch } from "@/lib/adminFetch";
import { useEffect, useState, useCallback, useMemo } from "react";
import CustomerDrawer, { DrawerRecord } from "../../../components/admin/CustomerDrawer";
import { supabase } from "../../lib/supabase";

type Payment = {
  id: string;
  txnid: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  amount: number;
  status: string;
  plan_id: string | null;
  product_name: string | null;
  created_at: string;
  updated_at?: string;
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
      '"' + (p.txnid || "") + '"',
      '"' + (p.customer_name || "").replace(/"/g, '""') + '"',
      '"' + (p.customer_phone || "") + '"',
      '"' + (p.customer_email || "") + '"',
      '"' + (p.product_name || p.plan_id || "").replace(/"/g, '""') + '"',
      p.amount || 0,
      '"' + (p.status || "") + '"',
      '"' + (p.created_at ? new Date(p.created_at).toLocaleString("en-IN") : "") + '"',
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "digitalfx_payments_" + Date.now() + ".csv");
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
        return "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200 font-bold";
      default:
        return "bg-rose-50 text-rose-700 border-rose-200 font-bold";
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
              Financial Operations
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#080d24] mt-1">Payment Transactions</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified gateway transactions, invoice settlement, and real attributable revenue.
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
            onClick={loadPayments}
            className="flex items-center gap-2 rounded-xl bg-[#207de9] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1570ef] shadow-xs transition cursor-pointer"
          >
            <span>↻ Refresh</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards (Clean Corporate White) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-emerald-300 bg-emerald-50/30 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
            Total Verified Revenue
          </span>
          <p className="mt-2 text-2xl font-black text-emerald-700 tabular-nums">
            ₹{verifiedRevenue.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-[10px] text-emerald-700/80">
            Calculated exclusively from successful payments
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Transactions Recorded
          </span>
          <p className="mt-2 text-2xl font-black text-[#080d24] tabular-nums">
            {payments.length}
          </p>
          <p className="mt-1 text-[10px] text-slate-500">
            All gateway checkout events
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-amber-300 bg-amber-50/30 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
            Pending Checkouts
          </span>
          <p className="mt-2 text-2xl font-black text-amber-800 tabular-nums">
            {pendingCount}
          </p>
          <p className="mt-1 text-[10px] text-amber-700/80">
            Awaiting customer completion
          </p>
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
            placeholder="Search payments by customer, transaction ID, email..."
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
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Product / Plan</th>
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
                    Loading payment records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No payment records found.
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
                        status: p.status,
                        date: formatDate(p.created_at),
                        amount: p.amount,
                        txnid: p.txnid,
                        planId: p.plan_id,
                        productName: p.product_name,
                      })
                    }
                    className="hover:bg-slate-50/70 transition group cursor-pointer"
                  >
                    <td className="py-3.5 px-5">
                      <span className="font-bold text-[#080d24] group-hover:text-[#207de9] transition block">
                        {p.customer_name || "Customer"}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400 block truncate">
                        {p.txnid}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-black text-base text-[#080d24] tabular-nums">
                        ₹{Number(p.amount || 0).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#080d24]">
                      {p.product_name || p.plan_id || "Package Payment"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={
                          "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border " +
                          getStatusStyle(p.status)
                        }
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {formatDate(p.created_at)}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-[#080d24] transition shadow-2xs">
                        Invoice →
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
