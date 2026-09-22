import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO & Digital Marketing Services | Full-Funnel Growth | Digital FX",
  description:
    "Explore full-funnel digital marketing services: Connected TV (CTV), Technical SEO, Google Maps 3-Pack, Google Ads PPC, Next.js Development, and AI Search Optimization.",
  alternates: {
    canonical: "https://www.digitalfx.in/services",
  },
  openGraph: {
    title: "SEO & Digital Marketing Services - Digital FX",
    description:
      "Explore full-funnel digital marketing services: Connected TV (CTV), Technical SEO, Google Maps 3-Pack, Google Ads PPC, Next.js Development, and AI Search Optimization.",
    url: "https://www.digitalfx.in/services",
    siteName: "Digital FX",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
