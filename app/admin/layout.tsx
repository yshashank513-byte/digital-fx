"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [authChecking, setAuthChecking] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email?: string; name?: string }>({
    email: "yshashank513@gmail.com",
    name: "Shashank Yadav",
  });

  // If on login page, skip layout shell
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setAuthChecking(false);
      return;
    }

    async function checkAuth() {
      // Check Supabase Auth Session
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user;

      const localStorageLoggedIn =
        typeof window !== "undefined" &&
        localStorage.getItem("digitalfx_admin") === "true";

      if (!sessionUser && !localStorageLoggedIn) {
        router.replace("/admin/login");
        return;
      }

      if (sessionUser) {
        setAdminUser({
          email: sessionUser.email || "yshashank513@gmail.com",
          name: sessionUser.user_metadata?.name || "Shashank Yadav",
        });
      }

      setAuthChecking(false);
    }

    checkAuth();
  }, [pathname, isLoginPage, router]);

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore signOut errors
    }
    localStorage.removeItem("digitalfx_admin");
    localStorage.removeItem("digitalfx_remember");
    router.replace("/admin/login");
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07122d] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[#315df5]" />
          <p className="text-xs font-bold tracking-widest uppercase text-slate-400">
            Verifying Digital FX Credentials...
          </p>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: "▦",
      active: pathname === "/admin",
    },
    {
      label: "Enquiries",
      href: "/admin/enquiries",
      icon: "◉",
      active: pathname === "/admin/enquiries",
    },
    {
      label: "Website Analyses",
      href: "/admin/analyses",
      icon: "⚡",
      active: pathname === "/admin/analyses",
    },
    {
      label: "Strategic Proposals",
      href: "/admin/proposals",
      icon: "📑",
      active: pathname === "/admin/proposals",
    },
    {
      label: "Payments",
      href: "/admin/payments",
      icon: "₹",
      active: pathname === "/admin/payments",
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: "⚙",
      active: pathname === "/admin/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-[#060e22] text-[#f1f5f9] font-sans">
      
      {/* =========================================================================
          DESKTOP LEFT SIDEBAR
          ========================================================================= */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col border-r border-white/10 bg-[#07122d] text-white lg:flex">
        
        {/* Brand Header */}
        <div className="flex h-[82px] shrink-0 items-center border-b border-white/10 px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white p-0.5 shadow-md">
              <img
                src="/logo.png"
                alt="Digital FX"
                className="h-10 w-10 object-contain"
              />
            </div>
            <div className="text-left">
              <div className="text-[17px] font-black tracking-tight text-white">
                DIGITAL <span className="text-[#6f8cff]">FX</span>
              </div>
              <div className="text-[7.5px] font-extrabold uppercase tracking-[2.5px] text-blue-300/60">
                AI OPERATIONS
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
          <div className="px-3 pb-2 text-[9px] font-extrabold uppercase tracking-[2px] text-slate-500">
            Navigation Menu
          </div>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition ${
                item.active
                  ? "bg-[#315df5] text-white shadow-[0_4px_20px_rgba(49,93,245,0.35)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="w-5 text-center text-sm">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Live System Indicator */}
        <div className="mx-4 mb-3 rounded-xl border border-white/5 bg-black/20 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[10px] font-bold text-slate-300">Live Engine</span>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 font-bold">200 OK</span>
          </div>
          <p className="mt-1 text-[9px] text-slate-500">
            Realtime Supabase sync connected
          </p>
        </div>

        {/* Admin Profile & Logout */}
        <div className="shrink-0 border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3 border border-white/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#315df5] to-[#7888ff] text-sm font-black text-white shadow-sm shrink-0">
              {adminUser.name?.charAt(0).toUpperCase() || "S"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">
                {adminUser.name || "Shashank Yadav"}
              </p>
              <p className="truncate text-[9.5px] text-blue-200/50">
                Super Administrator
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition cursor-pointer"
            >
              ↪
            </button>
          </div>
        </div>

      </aside>

      {/* =========================================================================
          MOBILE TOPBAR + SLIDE-OUT DRAWER
          ========================================================================= */}
      <div className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-white/10 bg-[#07122d]/95 px-5 backdrop-blur-md lg:hidden">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white p-0.5">
            <img src="/logo.png" alt="Digital FX" className="h-8 w-8 object-contain" />
          </div>
          <div>
            <span className="text-base font-black text-white">
              DIGITAL <span className="text-[#6f8cff]">FX</span>
            </span>
            <span className="block text-[7px] font-bold tracking-[2px] text-blue-300/60">
              OPERATIONS
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 flex h-full w-[280px] flex-col bg-[#07122d] border-r border-white/10 p-5 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white p-0.5">
                  <img src="/logo.png" alt="Digital FX" className="h-8 w-8 object-contain" />
                </div>
                <span className="text-base font-black text-white">
                  DIGITAL <span className="text-[#6f8cff]">FX</span>
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="h-8 w-8 rounded-lg bg-white/5 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <nav className="mt-6 flex-1 space-y-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition ${
                    item.active
                      ? "bg-[#315df5] text-white"
                      : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <span className="w-5 text-center text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-4 border-t border-white/10">
              <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#315df5] text-xs font-bold text-white">
                  {adminUser.name?.charAt(0) || "S"}
                </div>
                <div className="min-w-0 flex-1 text-xs">
                  <p className="font-bold text-white truncate">{adminUser.name}</p>
                  <p className="text-[10px] text-blue-300/50">Super Admin</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-2.5 text-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DESKTOP MAIN CONTENT WRAPPER
          ========================================================================= */}
      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        
        {/* Desktop Top Header Strip */}
        <header className="hidden h-[82px] items-center justify-between border-b border-white/10 bg-[#07122d]/60 px-8 backdrop-blur-md lg:flex">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-extrabold uppercase tracking-wider text-blue-400">
              ADMIN PORTAL
            </span>
            <span className="text-slate-600">/</span>
            <span className="font-bold text-slate-300">
              {navItems.find((n) => n.active)?.label || "Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Direct link to public site */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <span>🌐 Public Site</span>
              <span className="text-[10px]">↗</span>
            </a>

            {/* Live System active status */}
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-emerald-400">
                SYSTEM ACTIVE
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-5 md:p-8 overflow-x-hidden">
          {children}
        </main>

      </div>

    </div>
  );
}
