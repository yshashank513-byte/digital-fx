import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Marketing & SEO Blog",
  description:
    "Practical guides and blueprints on local SEO, Google Ads, Generative Engine Optimization, and digital marketing strategies for growing businesses.",
  alternates: {
    canonical: "https://www.digitalfx.in/blog",
  },
  openGraph: {
    title: "Digital Marketing & SEO Blog",
    description:
      "Practical guides and blueprints on local SEO, Google Ads, Generative Engine Optimization, and digital marketing strategies for growing businesses.",
    url: "https://www.digitalfx.in/blog",
    siteName: "Digital FX",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
