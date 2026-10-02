import { Metadata } from "next";
import ReviewFlowLandingClient from "./ReviewFlowLandingClient";

export const metadata: Metadata = {
  title: "ReviewFlow AI - Google Review Management & QR Codes",
  description:
    "Generate authentic Google reviews from real customers using smart QR codes. Automate customer review collection for local businesses and clinics.",
  keywords: [
    "Google Review QR Code",
    "ReviewFlow AI",
    "Authentic Google Reviews",
    "Google Business Profile QR Standee",
    "Customer Review Generator",
    "Local SEO Review Automation",
  ],
  alternates: {
    canonical: "https://www.digitalfx.in/reviewflow",
  },
  openGraph: {
    title: "ReviewFlow AI - Google Review Management & QR Codes",
    description:
      "Generate authentic Google reviews from real customers using smart QR codes. Automate customer review collection for local businesses and clinics.",
    url: "https://www.digitalfx.in/reviewflow",
    siteName: "Digital FX",
  },
};

export default function ReviewFlowLandingPage() {
  return <ReviewFlowLandingClient />;
}
