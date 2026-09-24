import { Metadata } from "next";
import ReviewFlowLandingClient from "./ReviewFlowLandingClient";

export const metadata: Metadata = {
  title: "ReviewFlow AI | Authentic Google Reviews Automation via QR Codes",
  description:
    "Generate authentic 5-star Google reviews from real customers using intelligent category-specific QR codes. Works for Packers & Movers, Jewellery Stores, Restaurants, Salons, Real Estate, Clinics & Agencies.",
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
};

export default function ReviewFlowLandingPage() {
  return <ReviewFlowLandingClient />;
}
