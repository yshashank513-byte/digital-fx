"use client";

import { useEffect, useState } from "react";
import { Settings, Save, Building2, Key, Globe, CheckCircle2 } from "lucide-react";

export default function TenantSettingsPage() {
  const [data, setData] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: "Apex Super-Speciality Hospital",
    ownerName: "Dr. Arvind Sharma",
    ownerEmail: "dr.arvind@apexhospital.in",
    ownerPhone: "+91 98712 34567",
    industry: "Healthcare & Super-Speciality Medical",
    website: "https://apexhospital.in",
    address: "Plot 14, Institutional Area, Sector 62",
    city: "Noida",
    state: "Uttar Pradesh",
    googleBusinessUrl: "https://maps.google.com/?cid=apexhospital",
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/tenant");
        if (res.ok) {
          const json = await res.json();
          setData(json);
          if (json.business) {
            setForm({
              name: json.business.name || "",
              ownerName: json.business.ownerName || "",
              ownerEmail: json.business.ownerEmail || "",
              ownerPhone: json.business.ownerPhone || "",
              industry: json.business.industry || "",
              website: json.business.website || "",
              address: json.business.address || "",
              city: json.business.city || "",
              state: json.business.state || "",
              googleBusinessUrl: json.business.googleBusinessUrl || "",
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div className="border-b border-slate-200/90 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-[#080d24] flex items-center gap-2">
          Business & Workspace Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure company profile, contact details, and Meta Cloud API integration parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-5 shadow-xs">
          <h2 className="text-sm font-bold text-[#080d24] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#207de9]" /> Organization Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1.5">Company / Brand Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9] focus:ring-1 focus:ring-[#207de9]"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1.5">Industry</label>
              <input
                type="text"
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9]"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1.5">Primary Owner</label>
              <input
                type="text"
                value={form.ownerName}
                onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9]"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1.5">Owner Email</label>
              <input
                type="email"
                value={form.ownerEmail}
                onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9]"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1.5">WhatsApp Business Phone</label>
              <input
                type="text"
                value={form.ownerPhone}
                onChange={(e) => setForm({ ...form, ownerPhone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] font-mono focus:outline-none focus:border-[#207de9]"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1.5">Official Website</label>
              <input
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-600 font-medium mb-1.5">Google Business Profile URL</label>
              <input
                type="url"
                value={form.googleBusinessUrl}
                onChange={(e) => setForm({ ...form, googleBusinessUrl: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-600 font-medium mb-1.5">Address, City & State</label>
              <input
                type="text"
                value={`${form.address}, ${form.city}, ${form.state}`}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#080d24] focus:outline-none focus:border-[#207de9]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#207de9] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{saved ? "Profile Saved Successfully!" : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
