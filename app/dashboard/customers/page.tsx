"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  DollarSign,
  Tag,
  Building,
  Calendar,
  X,
  MessageSquare,
} from "lucide-react";
import { Customer } from "@/lib/whatsapp/types";

export default function TenantCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      setLoading(true);
      const res = await fetch("/api/tenant");
      if (res.ok) {
        const json = await res.json();
        setCustomers(json.customers || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCustomer(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    try {
      const res = await fetch("/api/tenant/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_customer",
          ...formData,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.customer) {
          setCustomers([json.customer, ...customers]);
        }
        setAddModalOpen(false);
        setFormData({ name: "", phone: "", email: "", company: "" });
      }
    } catch (err) {
      console.error(err);
    }
  }

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/90 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2">
            Customers & Contact Book
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#207de9] border border-blue-200">
              {filteredCustomers.length} Contacts
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Verified customer profiles with conversation history, lifetime value, and WhatsApp tags.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#207de9] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-600 transition-colors mt-3 sm:mt-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search customers by name, phone or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#080d24] placeholder-slate-400 focus:outline-none focus:border-[#207de9] focus:ring-1 focus:ring-[#207de9]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200/90 bg-slate-50/70 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-3">WhatsApp Phone</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Company / Org</th>
                <th className="py-3 px-3">Deals Closed</th>
                <th className="py-3 px-3">Lifetime Value</th>
                <th className="py-3 px-3">Tags</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#080d24] flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-xs text-[#207de9]">
                        {cust.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span>{cust.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-medium text-emerald-600">{cust.phone}</td>
                  <td className="py-3.5 px-3 text-slate-500">{cust.email || "—"}</td>
                  <td className="py-3.5 px-3 text-slate-600">{cust.company || "Individual"}</td>
                  <td className="py-3.5 px-3 font-mono text-slate-700">{cust.totalOrdersOrDeals || 1}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-[#080d24]">${(cust.totalSpent || 500).toLocaleString()}</td>
                  <td className="py-3.5 px-3">
                    <div className="flex gap-1 flex-wrap">
                      {cust.tags.map((t, idx) => (
                        <span key={idx} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={`/dashboard/inbox?convoId=conv-001`}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-xs font-semibold text-[#207de9] transition-colors"
                    >
                      Chat
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#080d24]">Add Customer Contact</h2>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9] focus:ring-1 focus:ring-[#207de9]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">WhatsApp Phone *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] font-mono focus:outline-none focus:border-[#207de9] focus:ring-1 focus:ring-[#207de9]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9]"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#207de9] hover:bg-blue-600 text-white rounded-xl font-semibold shadow-xs transition-colors"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
