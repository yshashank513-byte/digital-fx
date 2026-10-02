import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Digital Marketing & SEO Agency in Ghaziabad",
  description:
    "Get in touch with Digital FX at Orbit Plaza, Crossings Republik, Ghaziabad. Request a free digital marketing consultation and SEO audit today.",
  alternates: {
    canonical: "https://www.digitalfx.in/contact",
  },
  openGraph: {
    title: "Contact Digital Marketing & SEO Agency in Ghaziabad",
    description:
      "Get in touch with Digital FX at Orbit Plaza, Crossings Republik, Ghaziabad. Request a free digital marketing consultation and SEO audit today.",
    url: "https://www.digitalfx.in/contact",
    siteName: "Digital FX",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
