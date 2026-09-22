import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Digital FX | Strategy Advisory Desk & Orbit Plaza Office",
  description:
    "Get in touch with Digital FX headquarters at Orbit Plaza, Crossings Republik, Ghaziabad. Request a free digital marketing audit or schedule a strategy consultation with our growth leaders.",
  alternates: {
    canonical: "https://www.digitalfx.in/contact",
  },
  openGraph: {
    title: "Contact Digital FX - Strategy Advisory & Consultation Desk",
    description:
      "Schedule a 1-on-1 growth consultation with Digital FX. Headquarters at Shop No. 210, Orbit Plaza, Crossings Republik, Ghaziabad.",
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
