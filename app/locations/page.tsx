import type { Metadata } from "next";
import Link from "next/link";
import { INDIA_STATES_AND_UTS } from "@/lib/indiaLocations";
import { toCitySlug } from "@/lib/citySeoData";

export const metadata: Metadata = {
  title: "Pan-India Local SEO & Digital Marketing Directory | 350+ Cities | Digital FX",
  description:
    "Explore Digital FX's Pan-India local SEO and digital marketing coverage across all 28 Indian States, 8 Union Territories, and 350+ cities. Dominate Google Maps Top 3, scale qualified leads, and outperform competitors in your city.",
  alternates: {
    canonical: "https://www.digitalfx.in/locations",
  },
};

export default function LocationsDirectoryPage() {
  const totalStatesAndUTs = INDIA_STATES_AND_UTS.length;
  const totalCities = INDIA_STATES_AND_UTS.reduce(
    (acc, item) => acc + item.cities.length,
    0
  );

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#207de9] selection:text-white">
      {/* 1. TOP BAR */}
      <div className="bg-[#080d24] text-white py-2 border-b border-white/10 text-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-slate-300 text-[11.5px] font-medium">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Google Premier Partner Certified
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline text-slate-300">
              Pan-India City Authority Directory
            </span>
          </div>

          <div className="flex items-center gap-4 text-[12px] font-medium ml-auto sm:ml-0">
            <a href="tel:+918447583685" className="hover:text-white font-bold transition flex items-center gap-1.5">
              <span className="text-[#207de9]">☎</span> +91 84475 83685
            </a>
            <a
              href="https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20want%20to%20rank%20my%20business%20in%20my%20city."
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-bold transition flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>WhatsApp Strategy Desk</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="max-w-[1400px] mx-auto flex h-[74px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-xs p-0.5 group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="Digital FX" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="text-[20px] sm:text-[22px] font-extrabold leading-none tracking-[-0.03em] text-[#080d24]">
                DIGITAL <span className="text-[#207de9]">FX</span>
              </div>
              <div className="mt-1 text-[8px] sm:text-[8.5px] font-bold uppercase tracking-[1.6px] text-slate-500">
                Pan-India Authority Directory
              </div>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link
              href="/#services"
              className="text-[14px] font-semibold text-slate-700 hover:text-[#207de9] transition"
            >
              Services
            </Link>
            <Link
              href="/#geo-checker"
              className="text-[14px] font-semibold text-slate-700 hover:text-[#207de9] transition inline-flex items-center gap-1.5"
            >
              <span>AI Search (GEO)</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9.5px] font-bold uppercase">
                FREE
              </span>
            </Link>
            <Link
              href="/locations"
              className="text-[14px] font-semibold text-[#207de9] transition inline-flex items-center gap-1.5"
            >
              <span>350+ Cities</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[9.5px] font-extrabold uppercase">
                IN
              </span>
            </Link>
            <Link
              href="/blog"
              className="text-[14px] font-semibold text-slate-700 hover:text-[#207de9] transition"
            >
              Insights &amp; Blog
            </Link>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold text-slate-600 hover:text-[#207de9] transition hidden sm:inline"
            >
              ← Back to Home
            </Link>
            <a
              href="https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20want%20to%20rank%20my%20business%20in%20my%20city."
              target="_blank"
              rel="noopener noreferrer"
              className="h-[42px] px-5 rounded-xl bg-[#207de9] hover:bg-[#1a6bc7] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <span>Speak with Strategist</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </header>

      {/* 3. HERO HEADER (CLEAN WHITE) */}
      <section className="py-16 sm:py-20 border-b border-slate-200 bg-gradient-to-b from-slate-50/80 via-white to-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse" />
            <span>🇮🇳 All 28 States &amp; 8 Union Territories</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#080d24] mb-5 leading-tight">
            Pan-India Local SEO &amp; Digital Marketing <br className="hidden sm:block" />
            <span className="text-[#207de9]">City Authority Directory</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed mb-8">
            Digital FX provides high-converting Google Maps 3-Pack rankings, sub-second Next.js web development, and revenue-driven performance marketing across <strong>{totalCities}+ commercial centers</strong> in India. Select your city below to inspect custom local search data and growth blueprints.
          </p>

          <div className="flex flex-wrap justify-center gap-3.5 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{totalStatesAndUTs} States &amp; UTs Mapped</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>{totalCities}+ Cities Active</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>4.9★ Rating • 128+ Client Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DIRECTORY CONTENT: GROUPED BY STATES AND UTS (WHITE CARDS) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INDIA_STATES_AND_UTS.map((region) => (
            <div
              key={region.name}
              className="rounded-2xl border border-slate-200 bg-white hover:border-[#207de9] hover:shadow-md transition p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                  <h2 className="text-base font-extrabold text-[#080d24] tracking-tight flex items-center gap-2">
                    <span className="text-[#207de9] text-sm">📍</span>
                    <span>{region.name}</span>
                  </h2>
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {region.cities.length} Cities
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {region.cities.map((city) => {
                    const slug = toCitySlug(city);
                    return (
                      <Link
                        key={city}
                        href={`/locations/${slug}`}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-[#207de9] text-slate-700 hover:text-white transition font-medium border border-slate-200/80 hover:border-[#207de9]"
                        title={`Digital Marketing & SEO in ${city}, ${region.name}`}
                      >
                        {city}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Local Search Coverage</span>
                <span className="text-emerald-700 font-bold">Verified Active ✓</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CTA FOOTER BANNER */}
      <section className="py-16 border-t border-slate-200 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#080d24] mb-3 tracking-tight">
            Don&apos;t See Your Specific Tehsil or Town?
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm mb-6 max-w-xl mx-auto leading-relaxed">
            Digital FX serves all regional commercial corridors across India. Speak directly with our Senior Growth Strategist to build a custom local search playbook for your exact business coordinates.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs transition shadow-2xs"
            >
              ← Back to Main Website
            </Link>
            <a
              href="https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20want%20to%20rank%20my%20business."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#207de9] hover:bg-[#1a6bc7] text-white font-bold text-xs transition flex items-center gap-2 shadow-xs"
            >
              <span>Speak with Growth Strategist</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
