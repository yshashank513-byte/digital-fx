import { Metadata } from "next";
import ReviewFlowDashboardClient from "./ReviewFlowDashboardClient";

export const metadata: Metadata = {
  title: "ReviewFlow AI | Business & QR Management Dashboard",
  description:
    "Manage your businesses, customize category-specific question templates, download high-resolution Google Review QR codes, and monitor scan conversions.",
  robots: { index: false, follow: false },
};

export default function ReviewFlowDashboardPage() {
  return <ReviewFlowDashboardClient />;
}
