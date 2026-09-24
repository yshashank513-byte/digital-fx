import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Digital Marketing Packages & Pricing | Transparent Growth Plans | Digital FX",
  description:
    "Transparent digital marketing packages, SEO retainers, and performance pricing for Indian and global businesses. Zero lock-in contracts, 100% attributable ROI.",
  alternates: {
    canonical: "https://www.digitalfx.in/pricing",
  },
  openGraph: {
    title: "Digital Marketing Packages & Pricing - Digital FX",
    description: "Predictable monthly growth retainers for local businesses, scaling brands, and enterprise leaders.",
    url: "https://www.digitalfx.in/pricing",
    siteName: "Digital FX",
  },
};

const TIERS = [
  {
    id: "starter",
    name: "Starter Growth",
    tagline: "Local 3-Pack & Organic Search Foundation",
    price: "₹24,999",
    period: "/ month",
    popular: false,
    idealFor: "Local Clinics, Retail Showrooms & Single-City Businesses",
    features: [
      "Google Business Profile (3-Pack) Rank Optimization",
      "Up to 25 Target Local Commercial Keywords",
      "Technical On-Page SEO & Core Web Vitals Fixes",
      "Schema.org JSON-LD LocalBusiness Entity Markup",
      "50+ Verified Local Indian Citations (Justdial, Sulekha, IndiaMART)",
      "Monthly Attributable Call & Lead Reporting Dashboard",
      "Dedicated Account Strategist via WhatsApp Desk",
    ],
    cta: "Start Local Growth",
    accent: "border-slate-200",
  },
  {
    id: "pro",
    name: "Pro Performance",
    tagline: "Full-Funnel Organic + High-ROAS Paid Ads",
    price: "₹49,999",
    period: "/ month",
    popular: true,
    idealFor: "Real Estate Developers, Multi-City Brands & D2C Ecommerce",
    features: [
      "Everything in Starter Growth Plan",
      "Up to 60 Target Competitive Keywords Across 10 Cities",
      "Google Search, Shopping & Meta Ads Performance Management",
      "Generative Engine Optimization (GEO) for ChatGPT & Gemini AI",
      "High-Converting Next.js Landing Page Development",
      "Conversion Rate Optimization (CRO) & WhatsApp API Funnel",
      "Weekly Attribution & Closed-Loop CRM Revenue Reports",
      "Guaranteed Milestone Delivery Horizon",
    ],
    cta: "Scale With Pro Performance",
    accent: "border-[#1570ef] ring-2 ring-[#1570ef]/20",
  },
  {
    id: "enterprise",
    name: "Enterprise Scale",
    tagline: "Multi-Market Domination & Custom Tech Infrastructure",
    price: "₹89,999",
    period: "/ month",
    popular: false,
    idealFor: "Hospital Chains, Large Real Estate Firms & Global Exporters",
    features: [
      "Everything in Pro Performance Plan",
      "Unlimited Keywords Across Pan-India (350+ Cities) + Dubai/US",
      "Programmatic DSP & Connected TV (CTV) Video Ad Management",
      "Dedicated Full-Stack Next.js Custom Web App Engineering",
      "Custom Competitor Intelligence & Daily Rank Scraping API",
      "First-Party Data Onboarding & GA4 BigQuery Data Pipeline",
      "Quarterly Strategy Review with Senior Partners in Orbit Plaza",
      "Priority SLA: Sub-2-Hour Direct Support",
    ],
    cta: "Consult Enterprise Desk",
    accent: "border-slate-200",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-[#207de9] selection:text-white">
      
      {/* 1. UNIVERSAL TOPBAR & MAIN HEADER WITH SERVICES DROPDOWN & MOBILE DRAWER */}
      <Navbar currentPath="/pricing" />

      {/* 3. HERO */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-[#f8faff] via-white to-white border-b border-slate-200 text-center">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1570ef] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse" />
            Predictable Revenue Retainers
          </span>
          <h1 className="text-[34px] sm:text-[48px] lg:text-[54px] font-extrabold text-[#080d24] tracking-[-0.035em] leading-[1.1]">
            Clear, Transparent Packages Built For{" "}
            <span className="text-[#1570ef] block sm:inline font-normal italic font-serif">
              Measurable ROI.
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
            No ambiguous billings or locked annual contracts. Every rupee invested is tracked to phone calls, qualified leads, and attributable revenue.
          </p>
        </div>
      </section>

      {/* 4. PRICING TIERS */}
      <section className="py-20 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-3xl bg-white p-8 sm:p-10 border shadow-sm hover:shadow-xl transition-all flex flex-col justify-between relative ${tier.accent}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#1570ef] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-extrabold text-[#080d24]">{tier.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{tier.tagline}</p>
                  </div>

                  <div className="my-6 pb-6 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black text-[#080d24]">{tier.price}</span>
                      <span className="text-xs font-semibold text-slate-400">{tier.period}</span>
                    </div>
                    <p className="text-[11.5px] text-slate-500 font-medium mt-2">
                      <strong className="text-slate-700">Best for:</strong> {tier.idealFor}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">What’s Included:</div>
                    <ul className="space-y-2.5 text-xs sm:text-[13px] text-slate-700">
                      {tier.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5">
                          <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-100">
                  <Link
                    href={`/contact?plan=${encodeURIComponent(tier.name)}`}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm text-center block transition shadow-md ${
                      tier.popular
                        ? "bg-[#1570ef] hover:bg-[#1362d2] text-white shadow-blue-500/25"
                        : "bg-[#080d24] hover:bg-[#1570ef] text-white"
                    }`}
                  >
                    {tier.cta} →
                  </Link>
                  <p className="text-[10px] text-center text-slate-400 mt-2">
                    Includes GST Invoice • Month-to-month freedom
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. GUARANTEE STRIP */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl">🛡️</div>
              <h3 className="text-base font-bold text-slate-900">Zero Locked Contracts</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Stay with us because you’re growing, not because you’re trapped in a 12-month lock-in. Cancel anytime with 15 days notice.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">📊</div>
              <h3 className="text-base font-bold text-slate-900">100% Attribution Transparency</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Live 24/7 Google Data Studio &amp; GA4 dashboards tracking every rupee spent to closed client revenue.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">📍</div>
              <h3 className="text-base font-bold text-slate-900">Official NCR Office</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Meet your dedicated strategists face-to-face in Orbit Plaza, Crossings Republik, or over weekly Google Meet reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UNIVERSAL BRANDED FOOTER */}
      <Footer />

    </div>
  );
}
