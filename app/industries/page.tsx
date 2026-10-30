import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CityEnquiryForm from "@/components/CityEnquiryForm";
import { getAllIndustries } from "@/lib/industriesData";

export const metadata: Metadata = {
  title: "Industry Verticals & Sector Specializations | Digital FX",
  description:
    "Explore how Digital FX engineers specialized digital marketing, local SEO, and paid media acquisition funnels across Real Estate, Healthcare, B2B, D2C, Education, and Hospitality.",
  alternates: {
    canonical: "https://www.digitalfx.in/industries",
  },
  openGraph: {
    title: "Industry Verticals & Sector Specializations | Digital FX",
    description:
      "Explore how Digital FX engineers specialized digital marketing, local SEO, and paid media acquisition funnels across Real Estate, Healthcare, B2B, D2C, Education, and Hospitality.",
    url: "https://www.digitalfx.in/industries",
    siteName: "Digital FX",
    locale: "en_IN",
    type: "website",
  },
};

export default function IndustriesIndexPage() {
  const industries = getAllIndustries();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-[#207de9] selection:text-white">
      <Navbar currentPath="/industries" />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#080d24] via-[#0b1333] to-[#080d24] text-white pt-14 pb-20 sm:pt-20 sm:pb-28">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#207de9]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Specialized Growth Playbooks</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-[-0.03em] leading-[1.12] text-white">
              Digital Marketing Tailored to Your Industry Nuances
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Generic marketing playbooks fail because different industries operate on fundamentally different unit economics, regulatory boundaries, and buyer journeys. Explore our sector-specific architectures.
            </p>
          </div>
        </div>
      </section>

      {/* 2. INDUSTRIES GRID */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((ind, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:shadow-xl transition-all hover:-translate-y-1.5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-blue-50 text-[#1570ef] flex items-center justify-center font-bold text-sm">
                      0{idx + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                      {ind.shortTitle}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#080d24] group-hover:text-[#1570ef] transition-colors mb-3">
                    {ind.shortTitle}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {ind.heroTagline}
                  </p>

                  {/* Highlighted Results Strip */}
                  <div className="grid grid-cols-2 gap-3 py-4 border-t border-b border-slate-100 mb-6 bg-slate-50/70 rounded-2xl p-3">
                    {ind.results.slice(0, 2).map((res, rIdx) => (
                      <div key={rIdx}>
                        <div className="text-lg font-black text-[#080d24]">{res.metric}</div>
                        <div className="text-[10px] font-bold text-[#1570ef] uppercase">{res.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Core Services Used */}
                  <div className="space-y-2 mb-6">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Tailored Solutions:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {ind.coreServices.map((srv, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                        >
                          {srv.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/industries/${ind.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#080d24] hover:bg-[#1570ef] text-white font-bold text-xs sm:text-sm transition-all"
                  >
                    <span>View {ind.shortTitle} Playbook</span>
                    <span>→</span>
                  </Link>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. CONVERSION SECTION */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="max-w-3xl mx-auto bg-slate-50 rounded-3xl p-7 sm:p-10 shadow-md border border-slate-200">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1570ef] mb-3">
                <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse" />
                Industry Consultation
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080d24] tracking-tight">
                Request an Industry-Specific Growth Audit
              </h2>
              <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
                Discover the exact customer acquisition bottlenecks and keyword opportunities in your specialized sector.
              </p>
            </div>
            <CityEnquiryForm cityName="Industry Specialist Desk" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
