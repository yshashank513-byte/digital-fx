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

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setAuthChecking(false);
      return;
    }

    async function checkAuth() {
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
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-[#080d24]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-[#207de9]" />
          <p className="text-xs font-bold tracking-widest uppercase text-slate-500">
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
    <div className="min-h-screen bg-[#f8fafc] text-[#080d24] font-sans antialiased">
      
      {/* =========================================================================
          DESKTOP LEFT SIDEBAR (Corporate White Style matching Website)
          ========================================================================= */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col border-r border-slate-200 bg-white text-[#080d24] shadow-xs lg:flex">
        
        {/* Brand Header */}
        <div className="flex h-[76px] shrink-0 items-center border-b border-slate-100 px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-slate-200/90 bg-white p-0.5 shadow-xs">
              <img
                src="/logo.png"
                alt="Digital FX"
                className="h-9 w-9 object-contain"
              />
            </div>
            <div className="text-left">
              <div className="text-[17px] font-black tracking-tight text-[#080d24]">
                DIGITAL <span className="text-[#207de9]">FX</span>
              </div>
              <div className="text-[8px] font-extrabold uppercase tracking-[2.5px] text-slate-400">
                MANAGEMENT PORTAL
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <div className="px-3 pb-2 text-[9px] font-extrabold uppercase tracking-[2px] text-slate-400">
            Workspace Navigation
          </div>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                "flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition duration-150 " +
                (item.active
                  ? "bg-[#207de9] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-[#080d24]")
              }
            >
              <span className="w-5 text-center text-sm">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Live System Indicator */}
        <div className="mx-4 mb-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-600" />
              </span>
              <span className="text-[10px] font-bold text-emerald-900">Database Live</span>
            </div>
            <span className="text-[9px] font-mono text-emerald-700 font-bold bg-white/90 px-2 py-0.5 rounded-md border border-emerald-200">200 OK</span>
          </div>
          <p className="mt-1 text-[9.5px] text-slate-500">
            Realtime database sync active
          </p>
        </div>

        {/* Admin Profile & Logout */}
        <div className="shrink-0 border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-200/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#207de9] to-[#1570ef] text-sm font-black text-white shadow-xs shrink-0">
              {adminUser.name?.charAt(0).toUpperCase() || "S"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-[#080d24]">
                {adminUser.name || "Shashank Yadav"}
              </p>
              <p className="truncate text-[10px] text-slate-500">
                Super Administrator
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
            >
              ↪
            </button>
          </div>
        </div>

      </aside>

      {/* =========================================================================
          MOBILE TOPBAR + SLIDE-OUT DRAWER
          ========================================================================= */}
      <div className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur-md lg:hidden">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white p-0.5 shadow-xs">
            <img src="/logo.png" alt="Digital FX" className="h-8 w-8 object-contain" />
          </div>
          <div>
            <span className="text-base font-black text-[#080d24]">
              DIGITAL <span className="text-[#207de9]">FX</span>
            </span>
            <span className="block text-[7px] font-bold tracking-[2px] text-slate-400">
              MANAGEMENT
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[#080d24]"
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
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 flex h-full w-[280px] flex-col bg-white border-r border-slate-200 p-5 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white p-0.5 shadow-xs">
                  <img src="/logo.png" alt="Digital FX" className="h-8 w-8 object-contain" />
                </div>
                <span className="text-base font-black text-[#080d24]">
                  DIGITAL <span className="text-[#207de9]">FX</span>
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="h-8 w-8 rounded-lg bg-slate-100 text-slate-600 hover:text-[#080d24]"
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
                  className={
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition " +
                    (item.active
                      ? "bg-[#207de9] text-white"
                      : "text-slate-700 hover:bg-slate-100")
                  }
                >
                  <span className="w-5 text-center text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-4 border-t border-slate-100">
              <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-200">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#207de9] text-xs font-bold text-white">
                  {adminUser.name?.charAt(0) || "S"}
                </div>
                <div className="min-w-0 flex-1 text-xs">
                  <p className="font-bold text-[#080d24] truncate">{adminUser.name}</p>
                  <p className="text-[10px] text-slate-500">Super Admin</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-2.5 text-center rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-100 transition"
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
        <header className="hidden h-[76px] items-center justify-between border-b border-slate-200/90 bg-white/90 px-8 backdrop-blur-md lg:flex shadow-xs">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-extrabold uppercase tracking-wider text-[#207de9]">
              ADMIN CONSOLE
            </span>
            <span className="text-slate-300">/</span>
            <span className="font-bold text-[#080d24]">
              {navItems.find((n) => n.active)?.label || "Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Direct link to public site */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#080d24] transition shadow-xs"
            >
              <span>🌐 Public Site</span>
              <span className="text-[10px]">↗</span>
            </a>

            {/* Live System active status */}
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-emerald-700">
                SYSTEM ACTIVE
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden bg-[#f8fafc]">
          {children}
        </main>

      </div>

    </div>
  );
}
