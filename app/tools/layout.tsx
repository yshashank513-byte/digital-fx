import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free SEO Checker & AI Marketing Tools | Digital FX",
  description:
    "Free online SEO Checker & website audit tool by Digital FX. Analyze on-page SEO, site health, Core Web Vitals, and technical factors in seconds.",
  alternates: {
    canonical: "https://www.digitalfx.in/tools",
  },
  openGraph: {
    title: "Free SEO Checker & AI Marketing Tools - Digital FX",
    description:
      "Get your free SEO report in seconds. Uncover on-page issues, technical factors, site health, and prioritized recommendations to strengthen search visibility.",
    url: "https://www.digitalfx.in/tools",
    siteName: "Digital FX",
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
