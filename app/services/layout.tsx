import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Marketing & SEO Services",
  description:
    "Full-funnel digital marketing services including search engine optimization (SEO), Google Ads PPC, local search, social media, and custom web development.",
  alternates: {
    canonical: "https://www.digitalfx.in/services",
  },
  openGraph: {
    title: "Digital Marketing & SEO Services",
    description:
      "Full-funnel digital marketing services including search engine optimization (SEO), Google Ads PPC, local search, social media, and custom web development.",
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
