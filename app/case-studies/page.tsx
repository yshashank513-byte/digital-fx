import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "The Digital FX Portfolio | Client Case Studies & Verified Revenue ROI",
  description:
    "Explore verified digital marketing case studies and client ROI stories. Over ₹6 Lakh+ client revenue delivered across real estate, healthcare, local services, and B2B.",
  alternates: {
    canonical: "https://www.digitalfx.in/case-studies",
  },
  openGraph: {
    title: "Client Case Studies & Verified Revenue ROI - Digital FX",
    description: "Discover real revenue growth, Google Maps 3-Pack rank proof, and 5.4x ROAS campaign breakdowns.",
    url: "https://www.digitalfx.in/case-studies",
    siteName: "Digital FX",
  },
};

const CASE_STUDIES = [
  {
    client: "Smile Dental Clinic & Implant Centre",
    category: "Local Healthcare & 3-Pack SEO",
    location: "Indirapuram, Ghaziabad",
    timeline: "90-Day Sprint",
    headline: "+312% Growth in High-Value Dental Implant Enquiries",
    metrics: [
      { label: "Google 3-Pack Rank", value: "#1 Top 3" },
      { label: "Monthly Direct Calls", value: "+420 Calls" },
      { label: "Tracked Revenue", value: "₹2.8L+" },
    ],
    summary:
      "Re-engineered Google Business Profile entity signals, published local geo-tagged before/after implant showcases, and eliminated wasted ad spend by shifting budget into high-intent 'dental implant cost in indirapuram' search queries.",
    badge: "Healthcare",
  },
  {
    client: "NCR Luxury Realty Advisors",
    category: "Real Estate & Google Ads PPC",
    location: "Noida & Greater Noida West",
    timeline: "6-Month Engagement",
    headline: "Reduced CPL from ₹1,450 to ₹380 with 6.2x Verified ROAS",
    metrics: [
      { label: "CPL Reduction", value: "73% Lower" },
      { label: "Qualified Site Visits", value: "1,140+" },
      { label: "Attributable Revenue", value: "₹3.5L+" },
    ],
    summary:
      "Replaced leaky 12-field lead capture forms with 1-click WhatsApp property brochure funnels, implemented Google Ads Customer Match audiences, and built dedicated sub-second Next.js landing pages for Expressway luxury launches.",
    badge: "Real Estate",
  },
  {
    client: "Om Logistics & Relocation Desk",
    category: "Enterprise Local SEO & Pan-India Scale",
    location: "Delhi NCR, Pune & Patna",
    timeline: "12-Month Expansion",
    headline: "Dominated Shifting Searches Across 35+ Tier-1 & Tier-2 Hubs",
    metrics: [
      { label: "Organic Monthly Leads", value: "2,400+" },
      { label: "Top 3 Keywords", value: "650+" },
      { label: "Tracked Revenue", value: "₹2.4L+" },
    ],
    summary:
      "Structured hyperlocal city landing pages with JSON-LD LocalBusiness schema, automated Google review collection via WhatsApp API, and achieved #1 organic rankings for high-intent intercity vehicle and household relocation searches.",
    badge: "Logistics",
  },
  {
    client: "The Woodcraft Studio & Modular Living",
    category: "Meta Ads & Generative AI Search (GEO)",
    location: "Crossings Republik & Noida",
    timeline: "4-Month Campaign",
    headline: "Rank #1 AI Recommended Interior Design Brand in Delhi NCR",
    metrics: [
      { label: "AI Overviews Visibility", value: "96% Rate" },
      { label: "Instagram ROAS", value: "5.4x" },
      { label: "Consultation Bookings", value: "185+" },
    ],
    summary:
      "Optimized entity brand citations in ChatGPT Search and Google Gemini AI Overviews. Ran high-converting Instagram video ads with interactive WhatsApp quotation bots.",
    badge: "Interior & D2C",
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-[#207de9] selection:text-white">
      
      {/* Universal Navbar */}
      <Navbar currentPath="/case-studies" />

      {/* 3. HERO SECTION */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-[#f8faff] via-white to-white border-b border-slate-200">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1570ef] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse" />
            Verified Case Studies &amp; Performance ROI
          </span>
          <h1 className="text-[34px] sm:text-[48px] lg:text-[54px] font-extrabold text-[#080d24] tracking-[-0.035em] leading-[1.1]">
            We Don’t Just Deliver Clicks.{" "}
            <span className="text-[#1570ef] block sm:inline font-normal italic font-serif">
              We Engineer Revenue.
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Explore verified growth breakthroughs across Indian healthcare, real estate, B2B services, and local multi-city businesses.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-200/80">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-[#080d24]">₹6 Lakh+</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Client Revenue Generated</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-[#1570ef]">5.4x</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Average Paid ROAS</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">+312%</div>
              <div className="text-xs text-slate-500 font-medium mt-1">YoY Organic Lift</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-amber-500">4.9 ★</div>
              <div className="text-xs text-slate-500 font-medium mt-1">128+ Google Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CASE STUDIES GRID */}
      <section className="py-20 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 max-w-5xl mx-auto">
            {CASE_STUDIES.map((study, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all p-6 sm:p-10 space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-[#1570ef] text-xs font-bold uppercase tracking-wider">
                      {study.badge} • {study.location}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#080d24] mt-2">
                      {study.client}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      {study.category} ({study.timeline})
                    </p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    Verified Outcome ✓
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {study.headline}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                    {study.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {study.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                        {m.label}
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-[#080d24] mt-1">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">100% Attributable CRM Attribution</span>
                  <Link
                    href="/contact"
                    className="text-xs font-bold text-[#1570ef] hover:underline flex items-center gap-1"
                  >
                    <span>Request Similar Strategy For Your Business</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CLOSER BANNER */}
      <section className="py-20 bg-[#080d24] text-white">
        <div className="max-w-[900px] mx-auto px-4 text-center space-y-5">
          <h2 className="text-2xl sm:text-4xl font-extrabold">
            Ready to write your company’s growth story?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-normal max-w-xl mx-auto">
            Book a 30-minute competitor audit call with our senior growth strategists in Orbit Plaza or via Google Meet.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#1570ef] to-[#00f0ff] text-slate-950 font-extrabold text-sm shadow-lg hover:scale-105 transition-transform"
            >
              Request Strategic Proposal →
            </Link>
          </div>
        </div>
      </section>

      {/* UNIVERSAL BRANDED FOOTER */}
      <Footer />

    </div>
  );
}
