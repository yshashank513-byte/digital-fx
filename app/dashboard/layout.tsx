import { Suspense } from "react";
import DashboardClientLayout from "./DashboardClientLayout";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Tenant Portal | WhatsApp Automation CRM",
  description: "B2B Multi-tenant WhatsApp Automation and CRM Console",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs font-semibold tracking-wider uppercase">
          Loading SaaS Portal...
        </div>
      }
    >
      <DashboardClientLayout>{children}</DashboardClientLayout>
    </Suspense>
  );
}
