"use client";

import { useEffect, useState, useTransition, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  MessageSquare,
  UserCheck,
  Users,
  Smartphone,
  Workflow,
  FileCode2,
  Send,
  Radio,
  CalendarClock,
  BarChart3,
  Users2,
  CreditCard,
  Settings,
  ChevronDown,
  Building2,
  Sparkles,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  Menu,
  ExternalLink,
} from "lucide-react";

function QueryBizSync({ onSync }: { onSync: (id: string | null) => void }) {
  const searchParams = useSearchParams();
  const queryBizId = searchParams.get("businessId");

  useEffect(() => {
    if (queryBizId) {
      onSync(queryBizId);
    }
  }, [queryBizId, onSync]);

  return null;
}

export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [tenantData, setTenantData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  useEffect(() => {
    fetchTenant();
  }, []);

  async function fetchTenant(bizId?: string) {
    try {
      setLoading(true);
      const url = bizId ? `/api/tenant?businessId=${bizId}` : "/api/tenant";
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setTenantData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSwitchTenant(bizId: string) {
    setSwitcherOpen(false);
    try {
      const res = await fetch("/api/tenant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "switch_tenant", businessId: bizId }),
      });
      if (res.ok) {
        startTransition(() => {
          fetchTenant(bizId);
          router.refresh();
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  const currentBiz = tenantData?.business || {
    id: "biz_apex_health",
    name: "Apex Super-Speciality Hospital",
    planTier: "enterprise",
    whatsappNumber: "+91 98101 23456",
    whatsappConnected: true,
  };

  const allBusinesses = tenantData?.allBusinesses || [
    { id: "biz_apex_health", name: "Apex Super-Speciality Hospital", industry: "Healthcare", planTier: "enterprise" },
    { id: "biz_urbannest", name: "UrbanNest Luxury Real Estate", industry: "Real Estate", planTier: "business" },
    { id: "biz_nexora", name: "Nexora Cloud Technologies", industry: "SaaS & Tech", planTier: "growth" },
    { id: "biz_spicecraft", name: "SpiceCraft Gourmet Dining Group", industry: "Hospitality & F&B", planTier: "starter" },
    { id: "biz_velocita", name: "Velocita Premium Motors", industry: "Automotive", planTier: "business" },
  ];

  interface TenantNavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    active: boolean;
    badge?: string;
  }

  const navItems: TenantNavItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-4.5 h-4.5" />,
      active: pathname === "/dashboard",
    },
    {
      label: "WhatsApp Inbox",
      href: "/dashboard/inbox",
      icon: <MessageSquare className="w-4.5 h-4.5" />,
      active: pathname.startsWith("/dashboard/inbox"),
      badge: "3",
    },
    {
      label: "Leads CRM",
      href: "/dashboard/leads",
      icon: <UserCheck className="w-4.5 h-4.5" />,
      active: pathname.startsWith("/dashboard/leads"),
    },
    {
      label: "Customers",
      href: "/dashboard/customers",
      icon: <Users className="w-4.5 h-4.5" />,
      active: pathname.startsWith("/dashboard/customers"),
    },
    {
      label: "WhatsApp API",
      href: "/dashboard/whatsapp",
      icon: <Smartphone className="w-4.5 h-4.5" />,
      active: pathname.startsWith("/dashboard/whatsapp"),
    },
    {
      label: "Automations",
      href: "/dashboard/automations",
      icon: <Workflow className="w-4.5 h-4.5" />,
      active: pathname.startsWith("/dashboard/automations"),
    },
    {
      label: "Templates",
      href: "/dashboard/templates",
      icon: <FileCode2 className="w-4.5 h-4.5" />,
      active: pathname.startsWith("/dashboard/templates"),
    },
    {
      label: "Campaigns",
      href: "/dashboard/campaigns",
      icon: <Send className="w-4.5 h-4.5" />,
      active: pathname.startsWith("/dashboard/campaigns"),
    },
    {
      label: "Broadcasts",
      href: "/dashboard/broadcasts",
      icon: <Radio className="w-4.5 h-4.5" />,
      active: pathname.startsWith("/dashboard/broadcasts"),
    },
    {
      label: "Follow-ups",
      href: "/dashboard/follow-ups",
      icon: <CalendarClock className="w-4.5 h-4.5" />,
      active: pathname.startsWith("/dashboard/follow-ups"),
    },
    {
      label: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart3 className="w-4.5 h-4.5" />,
      active: pathname.startsWith("/dashboard/analytics"),
    },
    {
      label: "Team",
      href: "/dashboard/team",
      icon: <Users2 className="w-4.5 h-4.5" />,
      active: pathname.startsWith("/dashboard/team"),
    },
    {
      label: "Billing",
      href: "/dashboard/billing",
      icon: <CreditCard className="w-4.5 h-4.5" />,
      active: pathname.startsWith("/dashboard/billing"),
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="w-4.5 h-4.5" />,
      active: pathname.startsWith("/dashboard/settings"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#080d24] font-sans antialiased selection:bg-blue-500 selection:text-white">
      <Suspense fallback={null}>
        <QueryBizSync onSync={(id) => fetchTenant(id || undefined)} />
      </Suspense>

      {/* =========================================================================
          DESKTOP FIXED LEFT SIDEBAR (Digital FX Style)
          ========================================================================= */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col border-r border-slate-200/90 bg-white text-[#080d24] shadow-xs lg:flex">
        {/* Brand Header & Digital FX Logo */}
        <div className="flex h-[88px] shrink-0 items-center justify-center border-b border-slate-100 px-4 bg-white">
          <Link
            href="/dashboard"
            className="group flex w-full items-center justify-center rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 shadow-2xs transition-all duration-200 hover:border-[#207de9]/50 hover:shadow-xs"
            title="Digital FX - WhatsApp CRM Tenant Workspace"
          >
            <img
              src="/logo.png"
              alt="Digital FX"
              className="h-10 w-auto max-w-full object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </Link>
        </div>

        {/* Tenant Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-slate-200">
          <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-400">
            BUSINESS WORKSPACE
          </div>
          {navItems.map((item) => (
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
        </nav>

        {/* Current Tenant Footer */}
        <div className="mx-4 mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-2xs">
          <div className="font-bold text-xs text-[#080d24] truncate">{currentBiz.name}</div>
          <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Isolated Tenant Storage</span>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          DESKTOP MAIN CONTENT WRAPPER
          ========================================================================= */}
      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        {/* Top Header Bar with Tenant Switcher */}
        <header className="hidden h-[76px] items-center justify-between border-b border-slate-200/90 bg-white/95 px-8 backdrop-blur-md lg:flex shadow-2xs sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Business Tenant Dropdown Switcher */}
            <div className="relative">
              <button
                onClick={() => setSwitcherOpen(!switcherOpen)}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-[#080d24] hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-[#207de9] text-[10px] font-bold text-white">
                  {currentBiz.name?.slice(0, 1) || "B"}
                </div>
                <span className="max-w-[180px] sm:max-w-[240px] truncate text-left">{currentBiz.name}</span>
                <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[9px] uppercase font-bold text-[#207de9] border border-blue-200">
                  {currentBiz.planTier}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {switcherOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Active Business Workspace
                  </div>
                  <div className="space-y-1">
                    {allBusinesses.map((b: any) => (
                      <button
                        key={b.id}
                        onClick={() => handleSwitchTenant(b.id)}
                        className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                          currentBiz.id === b.id
                            ? "bg-blue-50 text-[#207de9] font-bold border border-blue-200"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div className="truncate">
                          <div className="truncate font-semibold">{b.name}</div>
                          <div className="text-[10px] text-slate-400">{b.industry}</div>
                        </div>
                        <span className="text-[9px] font-mono uppercase bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 ml-2">
                          {b.planTier}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* WhatsApp Status Pill */}
            <div className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>WABA:</span>
              <span className="font-mono text-slate-800">{currentBiz.whatsappNumber || "+91 98101 23456"}</span>
            </div>

            {/* Link back to Digital FX Admin Console */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>Super Admin Console</span>
            </Link>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
          <Link href="/dashboard">
            <img src="/logo.png" alt="Digital FX" className="h-8 w-auto" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            ☰
          </button>
        </header>

        {/* Tenant Viewport */}
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden bg-[#f8fafc]">
          {children}
        </main>
      </div>
    </div>
  );
}
