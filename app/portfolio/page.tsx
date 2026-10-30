import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CityEnquiryForm from "@/components/CityEnquiryForm";
import { getAllCaseStudies } from "@/lib/caseStudiesData";

export const metadata: Metadata = {
  title: "Client Portfolio & Verified Growth Results | Digital FX",
  description:
    "Explore real client results, verified ROAS, and performance marketing case studies across Healthcare, Real Estate, B2B Manufacturing, and D2C brands.",
  alternates: {
    canonical: "https://www.digitalfx.in/portfolio",
  },
  openGraph: {
    title: "Client Portfolio & Verified Growth Results | Digital FX",
    description:
      "Explore real client results, verified ROAS, and performance marketing case studies across Healthcare, Real Estate, B2B Manufacturing, and D2C brands.",
    url: "https://www.digitalfx.in/portfolio",
    siteName: "Digital FX",
    locale: "en_IN",
    type: "website",
  },
};

export default function PortfolioPage() {
  const caseStudies = getAllCaseStudies();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-[#207de9] selection:text-white">
      <Navbar currentPath="/portfolio" />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#080d24] via-[#0b1333] to-[#080d24] text-white pt-14 pb-20 sm:pt-20 sm:pb-28">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#207de9]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Verified Client Results &amp; ROI</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-[-0.03em] leading-[1.12] text-white">
              Work That Compounds Into Measurable Revenue
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              We judge our work by client financial outcomes, not awards or vanity metrics. Explore our verified case studies across search dominance, paid advertising, and conversion engineering.
            </p>
          </div>
        </div>
      </section>

      {/* 2. STATS STRIP */}
      <section className="bg-slate-50 border-b border-slate-200 py-10">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-3xl sm:text-4xl font-black text-[#080d24]">₹6Cr+</div>
              <div className="text-xs sm:text-sm font-bold text-[#1570ef] mt-1">Client Revenue Generated</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-3xl sm:text-4xl font-black text-[#080d24]">4.8x</div>
              <div className="text-xs sm:text-sm font-bold text-[#1570ef] mt-1">Average Managed ROAS</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-3xl sm:text-4xl font-black text-[#080d24]">42%</div>
              <div className="text-xs sm:text-sm font-bold text-[#1570ef] mt-1">Average CPL Reduction</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-3xl sm:text-4xl font-black text-[#080d24]">4.9★</div>
              <div className="text-xs sm:text-sm font-bold text-[#1570ef] mt-1">128+ Verified Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CASE STUDIES PORTFOLIO GRID */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((study, idx) => (
              <div
                key={idx}
                className="bg-slate-50/70 rounded-3xl p-8 border border-slate-200 shadow-xs hover:shadow-xl transition-all hover:-translate-y-1.5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-blue-100/70 text-[#1570ef] text-[11px] font-bold uppercase tracking-wider">
                      {study.industry}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      📍 {study.location}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#080d24] group-hover:text-[#1570ef] transition-colors mb-2">
                    {study.client}
                  </h3>

                  <div className="text-sm font-black text-[#1570ef] mb-3 leading-snug">
                    {study.heroHeadline}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {study.summary}
                  </p>

                  {/* Metrics Box */}
                  <div className="grid grid-cols-2 gap-3 py-4 border-t border-b border-slate-200/80 mb-6 bg-white rounded-2xl p-3">
                    {study.metrics.slice(0, 2).map((met, mIdx) => (
                      <div key={mIdx}>
                        <div className="text-lg font-black text-[#080d24]">{met.value}</div>
                        <div className="text-[10px] font-bold text-[#1570ef] uppercase">{met.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Services Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {study.servicesUsed.map((srv, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium"
                      >
                        {srv.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#080d24] hover:bg-[#1570ef] text-white font-bold text-xs sm:text-sm transition-all"
                  >
                    <span>Read Full Case Study</span>
                    <span>→</span>
                  </Link>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. CONVERSION CONSULTATION */}
      <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-7 sm:p-10 shadow-lg border border-slate-200/90">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1570ef] mb-3">
                <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse" />
                Start Your Sprint
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080d24] tracking-tight">
                Ready to Build Your Case Study With Us?
              </h2>
              <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
                Discuss your business objectives with our growth engineers and get a tailored strategy blueprint.
              </p>
            </div>
            <CityEnquiryForm cityName="Portfolio Enquiry" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
