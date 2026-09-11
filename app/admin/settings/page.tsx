"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function SettingsPage() {
  const router = useRouter();

  const [adminUser, setAdminUser] = useState({
    name: "Shashank Yadav",
    email: "yshashank513@gmail.com",
    role: "Super Administrator",
  });

  useEffect(() => {
    async function loadAdmin() {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setAdminUser({
          name: data.session.user.user_metadata?.name || "Shashank Yadav",
          email: data.session.user.email || "yshashank513@gmail.com",
          role: "Super Administrator",
        });
      }
    }
    loadAdmin();
  }, []);

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } catch {}
    localStorage.removeItem("digitalfx_admin");
    localStorage.removeItem("digitalfx_remember");
    router.replace("/admin/login");
  }

  return (
    <div className="max-w-4xl space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            System Configuration
          </span>
        </div>
        <h1 className="text-2xl font-black text-[#080d24] mt-1">Admin &amp; Business Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage administrator account information, operational headquarters, and gateway security.
        </p>
      </div>

      {/* Admin Profile Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#207de9] to-[#1570ef] text-xl font-black text-white shadow-xs">
              {adminUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#080d24]">{adminUser.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-[#207de9] border border-blue-200">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{adminUser.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-100 transition cursor-pointer"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              Authentication Provider
            </p>
            <p className="font-semibold text-[#080d24] mt-1">Supabase Auth (Bcrypt Encrypted)</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              Access Role
            </p>
            <p className="font-semibold text-emerald-700 mt-1">Full System Administrator</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              Session Status
            </p>
            <p className="font-semibold text-[#207de9] mt-1">Active Verified</p>
          </div>
        </div>
      </div>

      {/* Business Details Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xs space-y-4">
        <h3 className="text-base font-black text-[#080d24]">
          Operational Headquarters &amp; Physical Entity
        </h3>
        <p className="text-xs text-slate-500">
          Official physical commercial location verified with Google Maps &amp; Ministry of Corporate Affairs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Agency Legal Title</span>
            <p className="font-bold text-[#080d24] mt-1">Digital FX - Premier Digital Marketing Agency</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Office Address</span>
            <p className="font-bold text-[#080d24] mt-1">
              Shop No. 210, 2nd Floor, Orbit Plaza, Crossings Republik, Ghaziabad, UP 201016
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Primary Telephone</span>
            <p className="font-bold text-[#080d24] mt-1 font-mono">+91 84475 83685</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Official Inbound Inbox</span>
            <p className="font-bold text-[#080d24] mt-1 font-mono">yshashank513@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Payment Gateway Security */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-[#080d24]">
              PayU India Payment Gateway Integration
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Production payment checkout terminal verified for RBI compliance.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            ● Gateway Active
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Merchant Key:</span>
            <span className="font-mono font-bold text-[#080d24]">Keiaiw</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
            <span className="text-slate-500">Merchant Salt:</span>
            <span className="font-mono text-slate-400">y1RKvf6Q••••••••••••••••••••</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
            <span className="text-slate-500">Endpoint:</span>
            <span className="font-mono text-[#080d24]">https://secure.payu.in/_payment</span>
          </div>
        </div>
      </div>

    </div>
  );
}
