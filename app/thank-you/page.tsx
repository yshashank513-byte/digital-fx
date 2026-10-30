import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Thank You | Strategy Request Received | Digital FX",
  description:
    "Your enquiry has been received. Our senior growth engineers will analyze your competitors and reach out within 30 minutes.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-[#207de9] selection:text-white">
      <Navbar currentPath="/thank-you" />

      {/* Main Confirmation Container */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-[#f8faff] via-white to-white border-b border-slate-200">
        <div className="max-w-[800px] w-full mx-auto px-4 sm:px-6 md:px-8 text-center space-y-6">
          
          {/* Animated Success Badge */}
          <div className="w-20 h-20 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-lg shadow-emerald-500/10">
            ✓
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Enquiry Successfully Received</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#080d24] tracking-tight leading-tight">
            We’ve Received Your Details &amp; Are Preparing Your Audit.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            A senior search and performance strategist from our Orbit Plaza office in Crossings Republik is already reviewing your inquiry. We typically reply within <strong>30 minutes</strong> during business hours.
          </p>

          {/* WhatsApp Direct Connect Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/919319807273?text=Hi%20Digital%20FX%20team,%20I%20just%20submitted%20the%20consultation%20form%20on%20your%20website."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
              <span>Connect on WhatsApp Strategy Desk Now</span>
            </a>

            <a
              href="tel:+919319807273"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm shadow-xs transition-all"
            >
              <span>☎ Call Office: +91 93198 07273</span>
            </a>
          </div>

          {/* What Happens Next Card */}
          <div className="mt-12 text-left bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 space-y-4">
            <h3 className="text-base font-bold text-[#080d24]">
              What Happens Next:
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1570ef] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span><strong>Competitor &amp; Keyword Reconnaissance:</strong> We pull organic rankings and paid ad historical spend data for your competitors.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1570ef] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span><strong>Custom Growth Proposal:</strong> We formulate a 90-day roadmap with realistic cost-per-acquisition projections.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1570ef] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span><strong>30-Minute Video or In-Person Call:</strong> We review the teardown with your team and outline exact deliverables.</span>
              </div>
            </div>
          </div>

          {/* Recommended Reading */}
          <div className="pt-8 text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Explore Case Studies While You Wait
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link
                href="/case-studies/ncr-luxury-realty"
                className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#1570ef] hover:border-blue-200 transition"
              >
                Real Estate: 73% Lower CPL →
              </Link>
              <Link
                href="/case-studies/smile-dental"
                className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#1570ef] hover:border-blue-200 transition"
              >
                Healthcare: +312% Inquiries →
              </Link>
              <Link
                href="/case-studies/om-logistics"
                className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#1570ef] hover:border-blue-200 transition"
              >
                Logistics: 2,400+ Organic Leads →
              </Link>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
