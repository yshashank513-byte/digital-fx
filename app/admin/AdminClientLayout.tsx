"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import {
  LayoutDashboard,
  Building2,
  Smartphone,
  UserCheck,
  Users,
  MessageSquare,
  Workflow,
  FileCode2,
  Send,
  Radio,
  CreditCard,
  Receipt,
  Gauge,
  LifeBuoy,
  Bell,
  Settings,
  ShieldCheck,
  ExternalLink,
  QrCode,
  Zap,
  FileText,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

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
  const [resettingDemo, setResettingDemo] = useState(false);

  const isLoginPage = pathname === "/admin/login";

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
        if (data.session?.access_token && typeof window !== "undefined") {
          localStorage.setItem("digitalfx_admin_token", data.session.access_token);
        }
      } catch {}

      const storedToken =
        typeof window !== "undefined"
          ? localStorage.getItem("digitalfx_admin_token")
          : null;
      const localStorageLoggedIn =
        typeof window !== "undefined" &&
        localStorage.getItem("digitalfx_admin") === "true";

      if (!sessionUser && (localStorageLoggedIn || storedToken)) {
        try {
          const { data: refreshData, error } = await supabase.auth.refreshSession();
          if (!error && refreshData?.session?.user) {
            sessionUser = refreshData.session.user;
          }
        } catch {}
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
    } catch {}
    try {
      await supabase.auth.signOut();
    } catch {}
    if (typeof window !== "undefined") {
      localStorage.removeItem("digitalfx_admin");
      localStorage.removeItem("digitalfx_remember");
      localStorage.removeItem("digitalfx_admin_token");
    }
    router.replace("/admin/login");
  }

  async function handleResetDemo() {
    if (!confirm("Are you sure you want to reset demo data to initial state?")) return;
    setResettingDemo(true);
    try {
      const res = await fetch("/api/admin/saas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_all_demo" }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch {
      alert("Failed to reset demo data");
    } finally {
      setResettingDemo(false);
    }
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-[#080d24]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-[#207de9]" />
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
    badge?: string;
  }

  interface NavGroup {
    group: string;
    items: NavItem[];
  }

  const navGroups: NavGroup[] = [
    {
      group: "WHATSAPP AUTOMATION SAAS",
      items: [
        {
          label: "Dashboard",
          href: "/admin",
          icon: <LayoutDashboard className="w-4.5 h-4.5" />,
          active: pathname === "/admin",
        },
        {
          label: "Businesses",
          href: "/admin/businesses",
          icon: <Building2 className="w-4.5 h-4.5" />,
          active: pathname.startsWith("/admin/businesses"),
          badge: "5",
        },
        {
          label: "WhatsApp Accounts",
          href: "/admin/whatsapp-accounts",
          icon: <Smartphone className="w-4.5 h-4.5" />,
          active: pathname.startsWith("/admin/whatsapp-accounts"),
        },
        {
          label: "Leads CRM",
          href: "/admin/leads",
          icon: <UserCheck className="w-4.5 h-4.5" />,
          active: pathname.startsWith("/admin/leads"),
        },
        {
          label: "Customers",
          href: "/admin/customers",
          icon: <Users className="w-4.5 h-4.5" />,
          active: pathname.startsWith("/admin/customers"),
        },
        {
          label: "Conversations",
          href: "/admin/conversations",
          icon: <MessageSquare className="w-4.5 h-4.5" />,
          active: pathname.startsWith("/admin/conversations"),
        },
        {
          label: "Automations",
          href: "/admin/automations",
          icon: <Workflow className="w-4.5 h-4.5" />,
          active: pathname.startsWith("/admin/automations"),
        },
        {
          label: "Message Templates",
          href: "/admin/templates",
          icon: <FileCode2 className="w-4.5 h-4.5" />,
          active: pathname.startsWith("/admin/templates"),
        },
        {
          label: "Campaigns",
          href: "/admin/campaigns",
          icon: <Send className="w-4.5 h-4.5" />,
          active: pathname.startsWith("/admin/campaigns"),
        },
        {
          label: "Broadcasts",
          href: "/admin/broadcasts",
          icon: <Radio className="w-4.5 h-4.5" />,
          active: pathname.startsWith("/admin/broadcasts"),
        },
      ],
    },
    {
      group: "BILLING & USAGE",
      items: [
        {
          label: "Subscriptions",
          href: "/admin/subscriptions",
          icon: <CreditCard className="w-4.5 h-4.5" />,
          active: pathname.startsWith("/admin/subscriptions"),
        },
        {
          label: "Payments",
          href: "/admin/payments",
          icon: <Receipt className="w-4.5 h-4.5" />,
          active: pathname.startsWith("/admin/payments"),
        },
        {
          label: "Usage & Limits",
          href: "/admin/usage",
          icon: <Gauge className="w-4.5 h-4.5" />,
          active: pathname.startsWith("/admin/usage"),
        },
        {
          label: "Support Tickets",
          href: "/admin/support-tickets",
          icon: <LifeBuoy className="w-4.5 h-4.5" />,
          active: pathname.startsWith("/admin/support-tickets"),
        },
        {
          label: "Notifications",
          href: "/admin/notifications",
          icon: <Bell className="w-4.5 h-4.5" />,
          active: pathname.startsWith("/admin/notifications"),
        },
        {
          label: "System Settings",
          href: "/admin/system-settings",
          icon: <Settings className="w-4.5 h-4.5" />,
          active: pathname.startsWith("/admin/system-settings"),
        },
        {
          label: "Audit Logs",
          href: "/admin/audit-logs",
          icon: <ShieldCheck className="w-4.5 h-4.5" />,
          active: pathname.startsWith("/admin/audit-logs"),
        },
      ],
    },
    {
      group: "DIGITAL FX TOOLS",
      items: [
        {
          label: "Review QR Codes",
          href: "/admin/review-qr",
          icon: <QrCode className="w-4.5 h-4.5" />,
          active: pathname.startsWith("/admin/review-qr"),
        },
        {
          label: "Enquiries",
          href: "/admin/enquiries",
          icon: <MessageSquare className="w-4.5 h-4.5" />,
          active: pathname === "/admin/enquiries",
        },
        {
          label: "Website Analyses",
          href: "/admin/analyses",
          icon: <Zap className="w-4.5 h-4.5" />,
          active: pathname === "/admin/analyses",
        },
        {
          label: "Strategic Proposals",
          href: "/admin/proposals",
          icon: <FileText className="w-4.5 h-4.5" />,
          active: pathname === "/admin/proposals",
        },
        {
          label: "Packers Enquiry",
          href: "/admin/packers-enquiry",
          icon: <Truck className="w-4.5 h-4.5" />,
          active: pathname === "/admin/packers-enquiry",
        },
        {
          label: "General Settings",
          href: "/admin/settings",
          icon: <Settings className="w-4.5 h-4.5" />,
          active: pathname === "/admin/settings",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#080d24] font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* =========================================================================
          DESKTOP FIXED LEFT SIDEBAR (Original Digital FX White Enterprise Design)
          ========================================================================= */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col border-r border-slate-200/90 bg-white text-[#080d24] shadow-xs lg:flex">
        {/* Brand Header & Digital FX Logo */}
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
          {navGroups.map((section) => (
            <div key={section.group} className="space-y-1">
              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-400">
                {section.group}
              </div>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all duration-150 " +
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
                  {item.badge && (
                    <span
                      className={
                        "rounded-full px-2 py-0.5 text-[10px] font-bold " +
                        (item.active
                          ? "bg-white text-[#207de9]"
                          : "bg-blue-100 text-blue-800")
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
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-800">
                WhatsApp API Active
              </span>
            </div>
            <button
              onClick={handleResetDemo}
              disabled={resettingDemo}
              className="text-[10px] text-slate-500 hover:text-emerald-700 font-semibold"
              title="Reset Demo Data"
            >
              Reset Data
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          DESKTOP MAIN CONTENT WRAPPER
          ========================================================================= */}
      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        {/* Desktop Top Header Strip */}
        <header className="hidden h-[76px] items-center justify-between border-b border-slate-200/90 bg-white/95 px-8 backdrop-blur-md lg:flex shadow-2xs sticky top-0 z-30">
          <div className="flex items-center gap-2.5 text-sm">
            <span className="font-bold text-[#207de9]">Digital FX</span>
            <span className="text-slate-300">/</span>
            <span className="font-bold text-[#080d24]">
              {navGroups.flatMap((g) => g.items).find((n) => n.active)?.label || "Admin Console"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Link to Tenant View */}
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/70 px-3.5 py-2 text-xs font-semibold text-[#207de9] hover:bg-blue-100/70 transition shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#207de9]" />
              <span>Open Business Tenant View</span>
              <ExternalLink className="w-3 h-3 text-[#207de9] ml-0.5" />
            </Link>

            {/* Direct link to public site */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#080d24] transition shadow-2xs"
            >
              <span>Live Website ↗</span>
            </a>

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
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-12 z-50 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800 truncate">{adminUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{adminUser.email}</p>
                    </div>
                    <Link
                      href="/admin/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="mt-1 flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
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

        {/* Mobile Header */}
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
          <Link href="/admin">
            <img src="/logo.png" alt="Digital FX" className="h-8 w-auto" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            ☰
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden bg-[#f8fafc]">
          {children}
        </main>
      </div>
    </div>
  );
}
