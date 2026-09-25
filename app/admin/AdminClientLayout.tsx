"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabase";

// High-fidelity SVG icon components for Enterprise SaaS feel
function GridIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function MessageSquareIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function StarIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function BuildingIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
    </svg>
  );
}

function QrCodeIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM17 17h4v4h-4zM14 20h3M20 14v3" />
    </svg>
  );
}

function HourglassIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
    </svg>
  );
}

function MegaphoneIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}

function BarChartIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function SettingsIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function ZapIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function FileTextIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function TruckIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function CreditCardIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function ChevronRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function BellIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [authChecking, setAuthChecking] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email?: string; name?: string }>({
    email: "yshashank513@gmail.com",
    name: "Shashank",
  });
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState<number>(0);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;
    async function fetchPendingCount() {
      try {
        const res = await fetch("/api/reviewflow/businesses?analytics=true");
        const json = await res.json();
        if (json.success && json.analytics) {
          setPendingApprovalsCount(json.analytics.pendingApprovals || 0);
        }
      } catch {}
    }
    fetchPendingCount();
  }, [pathname, isLoginPage]);

  useEffect(() => {
    if (isLoginPage) {
      setAuthChecking(false);
      return;
    }

    async function checkAuth() {
      let sessionUser: any = null;
      try {
        const { data } = await supabase.auth.getSession();
        sessionUser = data.session?.user;
        if (data.session?.access_token) {
          localStorage.setItem("digitalfx_admin_token", data.session.access_token);
        }
      } catch {
        // Session retrieval fallback
      }

      const storedToken =
        typeof window !== "undefined"
          ? localStorage.getItem("digitalfx_admin_token")
          : null;
      const localStorageLoggedIn =
        typeof window !== "undefined" &&
        localStorage.getItem("digitalfx_admin") === "true";

      // If no active session user, attempt Supabase session refresh
      if (!sessionUser && (localStorageLoggedIn || storedToken)) {
        try {
          const { data: refreshData, error } = await supabase.auth.refreshSession();
          if (!error && refreshData?.session?.user) {
            sessionUser = refreshData.session.user;
            if (refreshData.session.access_token) {
              localStorage.setItem(
                "digitalfx_admin_token",
                refreshData.session.access_token
              );
            }
          }
        } catch {
          // ignore refresh error
        }
      }

      // Verify credentials with server-side session API
      let isServerVerified = false;
      try {
        const headers: Record<string, string> = {};
        const activeToken =
          storedToken ||
          (typeof window !== "undefined"
            ? localStorage.getItem("digitalfx_admin_token")
            : "");
        if (activeToken) {
          headers["Authorization"] = `Bearer ${activeToken}`;
        }
        const verifyRes = await fetch("/api/admin/auth/session", {
          headers,
          credentials: "same-origin",
        });
        if (verifyRes.ok) {
          const verifyData = await verifyRes.json();
          if (verifyData.authorized) {
            isServerVerified = true;
            if (!sessionUser && verifyData.user) {
              sessionUser = {
                email: verifyData.user.email,
                user_metadata: {
                  name: verifyData.user.name || "Shashank",
                  role: verifyData.user.role || "admin",
                },
              };
            }
          }
        }
      } catch {
        // ignore server verify failure
      }

      // If neither Supabase session nor server token is valid, redirect cleanly to login
      if (!sessionUser && !isServerVerified) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("digitalfx_admin");
          localStorage.removeItem("digitalfx_admin_token");
        }
        router.replace("/admin/login");
        return;
      }

      if (sessionUser) {
        setAdminUser({
          email: sessionUser.email || "yshashank513@gmail.com",
          name: sessionUser.user_metadata?.name || "Shashank",
        });
      }

      setAuthChecking(false);
    }

    checkAuth();
  }, [pathname, isLoginPage, router]);

  async function handleLogout() {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch {
      // Ignore logout API errors
    }
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore signOut errors
    }
    localStorage.removeItem("digitalfx_admin");
    localStorage.removeItem("digitalfx_remember");
    localStorage.removeItem("digitalfx_admin_token");
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

  interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    active: boolean;
    badge?: number;
  }

  interface NavGroup {
    group: string;
    items: NavItem[];
  }

  const navItems: NavGroup[] = [
    {
      group: "MAIN MENU",
      items: [
        {
          label: "Dashboard",
          href: "/admin",
          icon: <GridIcon className="w-4.5 h-4.5" />,
          active: pathname === "/admin",
        },
        {
          label: "Enquiries",
          href: "/admin/enquiries",
          icon: <MessageSquareIcon className="w-4.5 h-4.5" />,
          active: pathname === "/admin/enquiries",
        },
      ],
    },
    {
      group: "REVIEWFLOW AI",
      items: [
        {
          label: "ReviewFlow Hub",
          href: "/admin/reviewflow",
          icon: <StarIcon className="w-4.5 h-4.5" />,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          active:
            pathname === "/admin/reviewflow" ||
            pathname.startsWith("/admin/businesses") ||
            pathname.startsWith("/admin/review-qr") ||
            pathname.startsWith("/admin/approvals") ||
            pathname.startsWith("/admin/reviewflow/campaigns") ||
            pathname.startsWith("/admin/analytics"),
        },
      ],
    },
    {
      group: "SALES & PROPOSALS",
      items: [
        {
          label: "Website Analyses",
          href: "/admin/analyses",
          icon: <ZapIcon className="w-4.5 h-4.5" />,
          active: pathname === "/admin/analyses",
        },
        {
          label: "Strategic Proposals",
          href: "/admin/proposals",
          icon: <FileTextIcon className="w-4.5 h-4.5" />,
          active: pathname === "/admin/proposals",
        },
        {
          label: "Packers Enquiry",
          href: "/admin/packers-enquiry",
          icon: <TruckIcon className="w-4.5 h-4.5" />,
          active: pathname === "/admin/packers-enquiry",
        },
        {
          label: "Payments",
          href: "/admin/payments",
          icon: <CreditCardIcon className="w-4.5 h-4.5" />,
          active: pathname === "/admin/payments",
        },
      ],
    },
    {
      group: "ADMINISTRATION",
      items: [
        {
          label: "Settings",
          href: "/admin/settings",
          icon: <SettingsIcon className="w-4.5 h-4.5" />,
          active: pathname === "/admin/settings",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#080d24] font-sans antialiased selection:bg-blue-500 selection:text-white">
      
      {/* =========================================================================
          DESKTOP FIXED LEFT SIDEBAR (Clean Enterprise White Style)
          ========================================================================= */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col border-r border-slate-200/90 bg-white text-[#080d24] shadow-xs lg:flex">
        
        {/* Brand Header & Clean Horizontal Rectangular Logo Container */}
        <div className="flex h-[88px] shrink-0 items-center justify-center border-b border-slate-100 px-4 bg-white">
          <Link
            href="/admin"
            className="group flex w-full items-center justify-center rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 shadow-2xs transition-all duration-200 hover:border-[#207de9]/50 hover:shadow-xs"
            title="Digital FX - Business Solutions Admin Console"
          >
            <img
              src="/logo.png"
              alt="Digital FX - Business Solution"
              className="h-10 w-auto max-w-full object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-4 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-slate-200">
          {navItems.map((section) => (
            <div key={section.group} className="space-y-1">
              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-400">
                {section.group}
              </div>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-all duration-150 " +
                    (item.active
                      ? "bg-[#207de9] text-white shadow-xs font-semibold"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-[#080d24]")
                  }
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className={"shrink-0 " + (item.active ? "text-white" : "text-slate-400")}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={
                        "rounded-full px-2 py-0.5 text-[10.5px] font-bold leading-none " +
                        (item.active
                          ? "bg-white text-[#207de9]"
                          : "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse")
                      }
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Live System Indicator */}
        <div className="mx-4 mb-3 rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-600" />
              </span>
              <span className="text-[11px] font-bold text-emerald-950">Database Live</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 font-bold bg-white/95 px-2 py-0.5 rounded-md border border-emerald-200">
              200 OK
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Realtime database sync active
          </p>
        </div>

        {/* Admin Profile Row */}
        <div className="shrink-0 border-t border-slate-100 p-4">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-200/80 group">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#207de9] to-[#1570ef] text-sm font-bold text-white shadow-xs shrink-0">
                {adminUser.name?.charAt(0).toUpperCase() || "S"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-[#080d24]">
                  {adminUser.name || "Shashank"}
                </p>
                <p className="truncate text-[10.5px] text-slate-500">
                  Super Administrator
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* =========================================================================
          MOBILE TOPBAR + SLIDE-OUT DRAWER
          ========================================================================= */}
      <div className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md lg:hidden">
        <Link
          href="/admin"
          className="flex items-center justify-center rounded-xl border border-slate-200/90 bg-white px-3 py-2 shadow-2xs"
          title="Digital FX Admin Console"
        >
          <img src="/logo.png" alt="Digital FX" className="h-8.5 w-auto max-w-full object-contain" />
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
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-xl border border-slate-200/90 bg-white px-3 py-2 shadow-2xs"
                title="Digital FX Admin Console"
              >
                <img src="/logo.png" alt="Digital FX" className="h-8.5 w-auto max-w-full object-contain" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:text-[#080d24]"
              >
                ✕
              </button>
            </div>

            <nav className="mt-6 flex-1 space-y-4 overflow-y-auto">
              {navItems.map((section) => (
                <div key={section.group} className="space-y-1">
                  <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-400">
                    {section.group}
                  </div>
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={
                        "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition " +
                        (item.active
                          ? "bg-[#207de9] text-white shadow-xs font-semibold"
                          : "text-slate-700 hover:bg-slate-100")
                      }
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span className={item.active ? "text-white" : "text-slate-400"}>
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={
                            "rounded-full px-2 py-0.5 text-[10.5px] font-bold leading-none " +
                            (item.active
                              ? "bg-white text-[#207de9]"
                              : "bg-amber-100 text-amber-900 border border-amber-300")
                          }
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>

            <div className="mt-auto pt-4 border-t border-slate-100">
              <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-200">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#207de9] text-xs font-bold text-white">
                  {adminUser.name?.charAt(0) || "S"}
                </div>
                <div className="min-w-0 flex-1 text-xs">
                  <p className="font-bold text-[#080d24] truncate">{adminUser.name}</p>
                  <p className="text-[10px] text-slate-500">Super Administrator</p>
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
        
        {/* Desktop Top Header Strip (Minimal, Professional) */}
        <header className="hidden h-[76px] items-center justify-between border-b border-slate-200/90 bg-white/95 px-8 backdrop-blur-md lg:flex shadow-2xs sticky top-0 z-30">
          <div className="flex items-center gap-2.5 text-sm">
            <span className="font-bold text-[#207de9]">
              Admin Console
            </span>
            <span className="text-slate-300">/</span>
            <span className="font-bold text-[#080d24]">
              {navItems.flatMap((g) => g.items).find((n) => n.active)?.label || "Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct link to public site */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#080d24] transition shadow-2xs"
              title="Open public website in new tab"
            >
              <span className="text-slate-400">🌐</span>
              <span>Live Website</span>
              <span className="text-[11px] text-slate-400">↗</span>
            </a>

            {/* Live System active status */}
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-800">
                System Active
              </span>
            </div>

            {/* User Profile Pill & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200/90 bg-white p-1.5 pr-3 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#207de9] text-xs font-bold text-white">
                  {adminUser.name?.charAt(0).toUpperCase() || "S"}
                </div>
                <div className="text-left text-xs">
                  <p className="font-bold text-[#080d24] leading-tight">
                    {adminUser.name || "Shashank"}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Super Administrator
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 ml-1">▾</span>
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-12 z-50 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-1">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800 truncate">{adminUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{adminUser.email}</p>
                    </div>
                    <Link
                      href="/admin/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="mt-1 flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition"
                    >
                      <SettingsIcon className="w-4 h-4 text-slate-400" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition text-left"
                    >
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
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
