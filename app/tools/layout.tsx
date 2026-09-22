import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI Search & GEO Audit Tool | Google Maps Checker | Digital FX",
  description:
    "Free online AI search & Generative Engine Optimization (GEO) audit tool. Analyze your website's visibility in ChatGPT, Google Gemini, Perplexity, and Google Maps in 60 seconds.",
  alternates: {
    canonical: "https://www.digitalfx.in/tools",
  },
  openGraph: {
    title: "Free AI Search & GEO Audit Tool - Digital FX",
    description:
      "Run an instant 60-second AI & SEO audit of your business website and Google Maps entity. Check ChatGPT, Gemini, and Perplexity visibility scores.",
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
