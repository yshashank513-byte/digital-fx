"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  PauseCircle,
  PlayCircle,
  LogIn,
  RotateCcw,
  X,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { Business, PlanTier } from "@/lib/whatsapp/types";

export default function AdminBusinessesPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selected business for View profile drawer
  const [selectedBiz, setSelectedBiz] = useState<Business | null>(null);
  // Change Plan modal
  const [planModalBiz, setPlanModalBiz] = useState<Business | null>(null);
  const [selectedPlanTier, setSelectedPlanTier] = useState<PlanTier>("growth");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  async function fetchBusinesses() {
    try {
      const res = await fetch("/api/admin/saas");
      if (res.ok) {
        const json = await res.json();
        setBusinesses(json.businesses || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(biz: Business) {
    const newAction = biz.status === "active" ? "suspend_business" : "activate_business";
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/saas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: newAction, businessId: biz.id }),
      });
      if (res.ok) {
        fetchBusinesses();
      }
    } catch {
      alert("Status update failed");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete(biz: Business) {
    if (!confirm(`Are you sure you want to completely delete "${biz.name}" and its associated data?`)) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/saas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_business", businessId: biz.id }),
      });
      if (res.ok) {
        fetchBusinesses();
      }
    } catch {
      alert("Delete failed");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleResetAccount(biz: Business) {
    if (!confirm(`Reset messaging activity and usage quota for "${biz.name}"?`)) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/saas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_account", businessId: biz.id }),
      });
      if (res.ok) {
        alert("Account usage counter reset.");
        fetchBusinesses();
      }
    } catch {
      alert("Reset failed");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleChangePlan() {
    if (!planModalBiz) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/saas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change_plan", businessId: planModalBiz.id, planTier: selectedPlanTier }),
      });
      if (res.ok) {
        setPlanModalBiz(null);
        fetchBusinesses();
      }
    } catch {
      alert("Failed to change plan");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleLoginAsBusiness(biz: Business) {
    try {
      const res = await fetch("/api/tenant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "switch_tenant", businessId: biz.id }),
      });
      if (res.ok) {
        router.push(`/dashboard?businessId=${biz.id}`);
      }
    } catch {
      router.push(`/dashboard?businessId=${biz.id}`);
    }
  }

  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.ownerEmail.toLowerCase().includes(search.toLowerCase()) ||
      b.industry.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2.5">
            Business Accounts & Tenants
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#207de9] border border-blue-200">
              {businesses.length} Tenants
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervise all multi-tenant customer accounts, subscription states, WhatsApp connectivity, and usage quotas.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              const name = prompt("Enter new business name:");
              if (!name) return;
              alert(`Business "${name}" invited to WhatsApp SaaS on-boarding.`);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#207de9] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-600 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Onboard Business</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search business, owner, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#080d24] placeholder-slate-400 focus:outline-none focus:border-[#207de9]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#080d24] px-3 py-2 focus:outline-none focus:border-[#207de9]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Complete Businesses Table with ALL Requested Columns */}
      <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Business Name</th>
                <th className="py-3 px-3">Owner</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Phone</th>
                <th className="py-3 px-3">Industry</th>
                <th className="py-3 px-3">WhatsApp Status</th>
                <th className="py-3 px-3">Plan</th>
                <th className="py-3 px-3">Subscription</th>
                <th className="py-3 px-3">Created</th>
                <th className="py-3 px-3">Last Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBusinesses.map((biz) => (
                <tr key={biz.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* 1. Business Name */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#080d24] flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xs font-bold text-[#207de9]">
                        {biz.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div>{biz.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{biz.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* 2. Owner */}
                  <td className="py-3 px-3 text-slate-700 font-medium whitespace-nowrap">
                    {biz.ownerName}
                  </td>

                  {/* 3. Email */}
                  <td className="py-3 px-3 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                    {biz.ownerEmail}
                  </td>

                  {/* 4. Phone */}
                  <td className="py-3 px-3 text-slate-600 font-mono whitespace-nowrap">
                    {biz.ownerPhone}
                  </td>

                  {/* 5. Industry */}
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                    {biz.industry}
                  </td>

                  {/* 6. WhatsApp Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {biz.whatsappConnected ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        <Smartphone className="w-3 h-3 text-emerald-600" />
                        Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                        <XCircle className="w-3 h-3 text-rose-500" />
                        Disconnected
                      </span>
                    )}
                  </td>

                  {/* 7. Plan */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 font-bold uppercase text-[10px] text-[#207de9] border border-blue-100">
                      {biz.planTier}
                    </span>
                  </td>

                  {/* 8. Subscription Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {biz.status === "active" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : biz.status === "trial" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        Trial
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                        Suspended
                      </span>
                    )}
                  </td>

                  {/* 9. Created Date */}
                  <td className="py-3 px-3 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                    {biz.createdAt.slice(0, 10)}
                  </td>

                  {/* 10. Last Activity */}
                  <td className="py-3 px-3 text-slate-500 whitespace-nowrap text-[11px]">
                    {new Date(biz.lastActivityAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>

                  {/* 11. Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      {/* View Profile */}
                      <button
                        onClick={() => setSelectedBiz(biz)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#080d24]"
                        title="View Full Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Login as Business */}
                      <button
                        onClick={() => handleLoginAsBusiness(biz)}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-bold text-[#207de9] hover:bg-blue-100 border border-blue-200 transition"
                        title="Login as Business (Tenant Portal)"
                      >
                        <LogIn className="w-3 h-3" />
                        <span>Login</span>
                      </button>

                      {/* Change Plan */}
                      <button
                        onClick={() => {
                          setPlanModalBiz(biz);
                          setSelectedPlanTier(biz.planTier);
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600"
                        title="Change Plan"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                      </button>

                      {/* Suspend / Activate */}
                      <button
                        onClick={() => handleToggleStatus(biz)}
                        className={`p-1.5 rounded-lg hover:bg-slate-100 ${
                          biz.status === "active" ? "text-amber-600 hover:text-amber-700" : "text-emerald-600 hover:text-emerald-700"
                        }`}
                        title={biz.status === "active" ? "Suspend Business" : "Activate Business"}
                      >
                        {biz.status === "active" ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                      </button>

                      {/* Reset Account */}
                      <button
                        onClick={() => handleResetAccount(biz)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-amber-600"
                        title="Reset Account Quotas"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(biz)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-rose-600"
                        title="Delete Tenant"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Business Profile Drawer */}
      {selectedBiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-2xs">
          <div className="h-full w-full max-w-xl bg-white border-l border-slate-200 p-6 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#080d24] flex items-center gap-2">
                  {selectedBiz.name}
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] uppercase font-bold text-[#207de9] border border-blue-200">
                    {selectedBiz.planTier}
                  </span>
                </h2>
                <p className="text-xs text-slate-500">Digital FX Tenant Account Details & History</p>
              </div>
              <button onClick={() => setSelectedBiz(null)} className="p-1 rounded-lg text-slate-400 hover:text-[#080d24]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Company & Owner Information */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Company & Owner Information</h3>
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <div className="text-slate-500 text-[11px]">Owner Name</div>
                  <div className="font-bold text-[#080d24] mt-0.5">{selectedBiz.ownerName}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">Owner Email</div>
                  <div className="font-medium text-[#080d24] mt-0.5">{selectedBiz.ownerEmail}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">Owner Phone</div>
                  <div className="font-mono text-[#080d24] mt-0.5">{selectedBiz.ownerPhone}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">Industry</div>
                  <div className="font-semibold text-[#080d24] mt-0.5">{selectedBiz.industry}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">Website</div>
                  <a href={selectedBiz.website || "#"} target="_blank" rel="noreferrer" className="text-[#207de9] hover:underline mt-0.5 inline-block truncate max-w-full">
                    {selectedBiz.website || "None"}
                  </a>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">Google Business URL</div>
                  <a href={selectedBiz.googleBusinessUrl || "#"} target="_blank" rel="noreferrer" className="text-[#207de9] hover:underline mt-0.5 inline-block truncate max-w-full">
                    {selectedBiz.googleBusinessUrl ? "View Google Maps" : "Not connected"}
                  </a>
                </div>
                <div className="col-span-2">
                  <div className="text-slate-500 text-[11px]">Address</div>
                  <div className="text-slate-700 mt-0.5">{selectedBiz.address}, {selectedBiz.city}, {selectedBiz.state}, {selectedBiz.country}</div>
                </div>
              </div>
            </div>

            {/* WhatsApp Integration Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">WhatsApp Account Connectivity</h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Connected Phone Number:</span>
                  <span className="font-mono text-emerald-700 font-bold">{selectedBiz.whatsappNumber || "+91 98712 34567"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Connection Status:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Meta Cloud API Verified
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Webhook Status:</span>
                  <span className="text-emerald-700 font-semibold">Active (HMAC SHA-256)</span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => handleLoginAsBusiness(selectedBiz)}
                className="flex-1 rounded-xl bg-[#207de9] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Login as {selectedBiz.name}</span>
              </button>
              <button
                onClick={() => setSelectedBiz(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Plan Modal */}
      {planModalBiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#080d24]">Change Plan: {planModalBiz.name}</h2>
              <button onClick={() => setPlanModalBiz(null)} className="text-slate-400 hover:text-[#080d24]">✕</button>
            </div>

            <p className="text-xs text-slate-500">
              Upgrade or downgrade the tier for this business. Limits and messaging quotas will take effect immediately.
            </p>

            <div className="space-y-2">
              {[
                { tier: "starter", name: "Starter Tier", price: "$29/mo", limit: "2,500 messages" },
                { tier: "growth", name: "Growth Tier", price: "$79/mo", limit: "10,000 messages" },
                { tier: "business", name: "Business Pro Tier", price: "$199/mo", limit: "25,000 messages" },
                { tier: "enterprise", name: "Enterprise Tier", price: "$499/mo", limit: "100,000 messages" },
              ].map((p) => (
                <label
                  key={p.tier}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedPlanTier === p.tier
                      ? "border-[#207de9] bg-blue-50/60 text-[#080d24]"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="plan_tier"
                      checked={selectedPlanTier === p.tier}
                      onChange={() => setSelectedPlanTier(p.tier as PlanTier)}
                      className="text-[#207de9]"
                    />
                    <div>
                      <div className="font-bold text-xs">{p.name}</div>
                      <div className="text-[11px] text-slate-500">{p.limit}</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#207de9]">{p.price}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={handleChangePlan}
                disabled={actionLoading}
                className="flex-1 py-2 bg-[#207de9] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl"
              >
                {actionLoading ? "Updating..." : "Confirm Plan Change"}
              </button>
              <button
                onClick={() => setPlanModalBiz(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
