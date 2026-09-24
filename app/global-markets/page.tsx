import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalKeywordsSection from "@/components/GlobalKeywordsSection";

export const metadata: Metadata = {
  title: "Global Search Engineering & Dubai GCC SEO Hub (1,000+ Keywords) | Digital FX",
  description:
    "Explore Digital FX's global SEO architecture, Dubai flagship hub, and 1,098+ verified high-intent search keywords across UAE (Dubai, Abu Dhabi), USA, UK, Saudi Arabia, Canada, Australia, and Singapore. Dual-index Maps 3-Pack and sub-second Next.js web portals.",
  alternates: {
    canonical: "https://www.digitalfx.in/global-markets",
  },
  openGraph: {
    title: "Global Search Engineering & Dubai GCC SEO Hub | Digital FX",
    description:
      "Explore Digital FX's global SEO architecture, Dubai flagship hub, and 1,098+ verified high-intent keywords across UAE, USA, UK, KSA, and Singapore.",
    url: "https://www.digitalfx.in/global-markets",
    siteName: "Digital FX",
    type: "website",
  },
};

export default function GlobalMarketsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#207de9] selection:text-white">
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.digitalfx.in",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Global Markets & Keywords Explorer",
                item: "https://www.digitalfx.in/global-markets",
              },
            ],
          }),
        }}
      />

      {/* Universal Navbar */}
      <Navbar currentPath="/global-markets" />

      {/* 3. HERO INTRO */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-slate-900 via-[#080d24] to-[#0d163d] text-white border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Dubai, GCC, USA, UK &amp; APAC Global Expansion Desk</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            International Search Engine Domination <br className="hidden sm:block" />
            <span className="text-[#207de9]">&amp; 1,098+ High-Intent Keywords</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed mb-6 font-light">
            Headquartered in India with a dedicated international offshore desk, Digital FX delivers sub-second Next.js web applications, Google Maps 3-Pack authority, and high-ROI digital marketing in high-CPC commercial centers worldwide. Explore our verified global keyword database and city hubs below.
          </p>

          <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 text-xs font-semibold">
            <Link
              href="/locations/dubai"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition"
            >
              <span>🇦🇪</span>
              <span>Dubai Flagship (AED 2,500/mo)</span>
            </Link>
            <Link
              href="/locations/abu-dhabi"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition"
            >
              <span>🇦🇪</span>
              <span>Abu Dhabi &amp; ADGM</span>
            </Link>
            <Link
              href="/locations/riyadh"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition"
            >
              <span>🇸🇦</span>
              <span>Riyadh &amp; GCC</span>
            </Link>
            <Link
              href="/locations/new-york"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition"
            >
              <span>🇺🇸</span>
              <span>New York &amp; US</span>
            </Link>
            <Link
              href="/locations/london"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition"
            >
              <span>🇬🇧</span>
              <span>London &amp; UK</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE GLOBAL KEYWORDS SECTION */}
      <GlobalKeywordsSection />

      {/* 5. FOOTER CTA */}
      <section className="py-16 border-t border-slate-200 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#080d24] mb-3 tracking-tight">
            Ready to Outrank Competitors in Dubai or Globally?
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm mb-6 max-w-xl mx-auto leading-relaxed">
            Schedule a direct strategy consultation with our International Growth Lead. We analyze your commercial target market, estimate organic acquisition cost, and deliver an actionable 90-day search blueprint.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs transition shadow-2xs"
            >
              ← Back to Main Website
            </Link>
            <Link
              href="/locations/dubai"
              className="px-5 py-2.5 rounded-xl bg-[#080d24] hover:bg-[#0d163d] text-white font-bold text-xs transition flex items-center gap-2 shadow-xs"
            >
              <span>🇦🇪 View Dubai Hub Blueprint</span>
              <span>→</span>
            </Link>
            <a
              href="https://wa.me/919319807273?text=Hi%20Digital%20FX,%20I%20want%20to%20consult%20regarding%20Dubai%20and%20Global%20SEO."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#207de9] hover:bg-[#1a6bc7] text-white font-bold text-xs transition flex items-center gap-2 shadow-xs"
            >
              <span>WhatsApp Strategy Desk</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* UNIVERSAL BRANDED FOOTER */}
      <Footer />
    </main>
  );
}
