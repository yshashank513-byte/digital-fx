import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free SEO Checker & Website Audit Tool",
  description:
    "Audit your website with our free SEO checker. Analyze on-page factors, technical performance, and search visibility recommendations in seconds.",
  alternates: {
    canonical: "https://www.digitalfx.in/tools",
  },
  openGraph: {
    title: "Free SEO Checker & Website Audit Tool",
    description:
      "Audit your website with our free SEO checker. Analyze on-page factors, technical performance, and search visibility recommendations in seconds.",
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
