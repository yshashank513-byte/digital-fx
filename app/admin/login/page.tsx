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
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (authError || !data.user) {
        setError("Invalid email address or password. Please verify your credentials.");
        setLoading(false);
        return;
      }

      const userEmail = data.user.email?.toLowerCase();
      const userRole = data.user.user_metadata?.role;

      if (userEmail !== "yshashank513@gmail.com" && userRole !== "admin") {
        await supabase.auth.signOut();
        setError("Access denied. This account does not possess administrator privileges.");
        setLoading(false);
        return;
      }

      localStorage.setItem("digitalfx_admin", "true");
      if (remember) {
        localStorage.setItem("digitalfx_remember", "true");
      } else {
        localStorage.removeItem("digitalfx_remember");
      }

      router.push("/admin");
    } catch (err) {
      console.error("Login unexpected error:", err);
      setError("An unexpected error occurred while connecting to authentication service.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#080d24] flex flex-col justify-center relative font-sans antialiased py-12 px-4 sm:px-6">
      
      <div className="relative z-10 w-full max-w-md mx-auto">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-1 shadow-sm mb-4 border border-slate-200">
            <img
              src="/logo.png"
              alt="Digital FX"
              className="h-14 w-14 object-contain"
            />
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-[#080d24]">
              DIGITAL <span className="text-[#207de9]">FX</span>
            </h1>
            <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md bg-blue-50 text-[#207de9] border border-blue-200">
              Admin Portal
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-500 max-w-xs">
            Enter authorized administrator credentials to access the Digital FX Operations Console.
          </p>
        </div>

        {/* Login Card (Clean Corporate White) */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-[0_12px_40px_rgba(8,13,36,0.06)]">
          
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  ✉
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@digitalfx.in"
                  required
                  autoComplete="email"
                  className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-xs font-medium text-[#080d24] placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-[#207de9] focus:ring-2 focus:ring-[#207de9]/15"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] font-semibold text-[#207de9] hover:underline cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  🔒
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  required
                  autoComplete="current-password"
                  className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-11 text-xs font-medium text-[#080d24] placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-[#207de9] focus:ring-2 focus:ring-[#207de9]/15"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#207de9] focus:ring-[#207de9] accent-[#207de9]"
                />
                <span>Remember session on this device</span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 leading-relaxed font-medium">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#207de9] hover:bg-[#1570ef] text-xs font-bold uppercase tracking-wider text-white shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-6"
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
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-[11px]">
          <span className="text-emerald-600 font-bold">🛡️</span>
          <span>256-Bit SSL Encrypted Enterprise Auth</span>
          <span>•</span>
          <a href="/" className="text-slate-600 hover:text-[#207de9] transition underline font-medium">
            Return to Public Site
          </a>
        </div>

      </div>

    </main>
  );
}
