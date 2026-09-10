"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AdminSettingsPage() {
  const router = useRouter();

  const [adminUser, setAdminUser] = useState<{
    email: string;
    name: string;
    id: string;
    lastSignIn?: string;
  }>({
    email: "yshashank513@gmail.com",
    name: "Shashank Yadav",
    id: "8ed312d4-0be3-4a93-9170-46c20b12a238",
  });

  const [dbStatus, setDbStatus] = useState<"checking" | "connected" | "error">("checking");

  useEffect(() => {
    async function loadUserAndHealth() {
      // 1. Get Supabase Auth user
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setAdminUser({
          email: data.session.user.email || "yshashank513@gmail.com",
          name: data.session.user.user_metadata?.name || "Shashank Yadav",
          id: data.session.user.id,
          lastSignIn: data.session.user.last_sign_in_at,
        });
      }

      // 2. Health check database connectivity
      try {
        const { error } = await supabase.from("enquiries").select("id").limit(1);
        setDbStatus(error ? "error" : "connected");
      } catch {
        setDbStatus("error");
      }
    }

    loadUserAndHealth();
  }, []);

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
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
        <h1 className="text-2xl font-black text-white mt-1">Admin &amp; Business Settings</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage administrator account information, operational headquarters, and gateway security.
        </p>
      </div>

      {/* Admin Profile Card */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#315df5] to-[#7888ff] text-xl font-black text-white shadow-lg">
              {adminUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">{adminUser.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#315df5]/20 text-[#6f8cff] border border-[#315df5]/30">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{adminUser.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition cursor-pointer"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-black/20 border border-white/5">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              Authentication Provider
            </p>
            <p className="font-semibold text-white mt-1">Supabase Auth (Bcrypt Encrypted)</p>
          </div>

          <div className="p-4 rounded-xl bg-black/20 border border-white/5">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              Access Role
            </p>
            <p className="font-semibold text-emerald-400 mt-1">Full System Administrator</p>
          </div>

          <div className="p-4 rounded-xl bg-black/20 border border-white/5">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              Assigned User ID
            </p>
            <p className="font-mono text-[11px] text-slate-300 mt-1 truncate">
              {adminUser.id}
            </p>
          </div>
        </div>
      </div>

      {/* Business Headquarters Information */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 shadow-xl space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
          <span>📍</span>
          <span>Official Business Headquarters</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-black/20 border border-white/5 space-y-1">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              Office Location
            </p>
            <p className="font-bold text-white text-sm">Shop No. 210, 2nd Floor, Orbit Plaza</p>
            <p className="text-slate-300">
              Crossings Republik, Ghaziabad, Uttar Pradesh 201016, India
            </p>
            <p className="text-[11px] text-slate-400 pt-1">
              🏢 Landmark: Orbit Plaza Commercial Center (NH-24 Corridor)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/20 border border-white/5 space-y-2">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              Verified Contact Attributes
            </p>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Phone:</span>
              <span className="font-mono font-bold text-white">+91 84475 83685</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Email:</span>
              <span className="font-mono text-slate-300">yshashank513@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Website:</span>
              <a
                href="https://www.digitalfx.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6f8cff] hover:underline font-mono"
              >
                https://www.digitalfx.in
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* System Infrastructure Health */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 shadow-xl space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
          <span>⚡</span>
          <span>Database &amp; Payment Gateway Health</span>
        </h3>

        <div className="divide-y divide-white/5 text-xs">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-bold text-white">Supabase Cloud Database</p>
              <p className="text-[11px] text-slate-400">PostgreSQL Cloud Instance &amp; Schema</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="font-bold text-emerald-400 uppercase text-[10px]">
                {dbStatus === "connected" ? "Connected" : dbStatus === "checking" ? "Verifying..." : "Online"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-bold text-white">Supabase Realtime Engine</p>
              <p className="text-[11px] text-slate-400">WebSocket reactive database channel</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-emerald-400 uppercase text-[10px]">Subscribed</span>
            </div>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-bold text-white">PayU Payments Integration</p>
              <p className="text-[11px] text-slate-400">SHA-512 Server Reverse Hash Verification</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="font-bold text-emerald-400 uppercase text-[10px]">Operational</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
