"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // If already logged in, redirect to /admin
    async function checkExistingSession() {
      const { data } = await supabase.auth.getSession();
      const hasLocalFlag =
        typeof window !== "undefined" &&
        localStorage.getItem("digitalfx_admin") === "true";

      if (data.session?.user || hasLocalFlag) {
        router.replace("/admin");
      }
    }
    checkExistingSession();
  }, [router]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Authenticate with Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (authError || !data.user) {
        // Provide friendly message without leaking system internals
        setError("Invalid email address or password. Please verify your credentials.");
        setLoading(false);
        return;
      }

      // 2. Authorize Admin Access
      const userEmail = data.user.email?.toLowerCase();
      const userRole = data.user.user_metadata?.role;

      if (userEmail !== "yshashank513@gmail.com" && userRole !== "admin") {
        await supabase.auth.signOut();
        setError("Access denied. This account does not possess administrator privileges.");
        setLoading(false);
        return;
      }

      // 3. Store local session flag securely
      localStorage.setItem("digitalfx_admin", "true");
      if (remember) {
        localStorage.setItem("digitalfx_remember", "true");
      } else {
        localStorage.removeItem("digitalfx_remember");
      }

      // 4. Redirect to Admin Command Center
      router.push("/admin");
    } catch (err) {
      console.error("Login unexpected error:", err);
      setError("An unexpected error occurred while connecting to authentication service.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050b1a] text-white flex flex-col justify-center relative overflow-hidden font-sans">
      
      {/* Dynamic Background Glows */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#315df5]/15 blur-[140px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-[500px] w-[500px] translate-x-1/2 translate-y-1/2 rounded-full bg-[#7047f5]/15 blur-[140px]" />
      
      {/* Subtle Grid Lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-auto px-5 py-12 sm:px-6">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-1 shadow-[0_10px_35px_rgba(49,93,245,0.4)] mb-4 border border-white/20">
            <img
              src="/logo.png"
              alt="Digital FX"
              className="h-14 w-14 object-contain"
            />
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">
              DIGITAL <span className="text-[#6f8cff]">FX</span>
            </h1>
            <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md bg-[#315df5]/20 text-[#6f8cff] border border-[#315df5]/30">
              Admin Portal
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-400 max-w-xs">
            Enter authorized administrator credentials to access the Digital FX Intelligence Workspace.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 sm:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                  ✉
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@digitalfx.in"
                  required
                  autoComplete="email"
                  className="w-full h-12 rounded-xl border border-white/15 bg-black/30 pl-11 pr-4 text-xs font-medium text-white placeholder:text-slate-500 outline-none transition focus:border-[#315df5] focus:ring-2 focus:ring-[#315df5]/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] font-semibold text-[#6f8cff] hover:underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                  🔒
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  required
                  autoComplete="current-password"
                  className="w-full h-12 rounded-xl border border-white/15 bg-black/30 pl-11 pr-11 text-xs font-medium text-white placeholder:text-slate-500 outline-none transition focus:border-[#315df5] focus:ring-2 focus:ring-[#315df5]/20"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-black/40 accent-[#315df5]"
                />
                <span>Remember session on this device</span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-400 leading-relaxed">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#315df5] to-[#5842f4] text-xs font-bold uppercase tracking-wider text-white shadow-[0_10px_30px_rgba(49,93,245,0.35)] hover:shadow-[0_12px_35px_rgba(49,93,245,0.5)] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <span>→</span>
                </>
              )}
            </button>

          </form>

        </div>

        {/* Security Assurance Strip */}
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-[11px]">
          <span className="text-emerald-400">🛡️</span>
          <span>256-Bit SSL Encrypted Enterprise Auth</span>
          <span>•</span>
          <a href="/" className="text-slate-400 hover:text-white transition underline">
            Return to Public Site
          </a>
        </div>

      </div>

    </main>
  );
}