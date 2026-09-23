import type { Metadata } from "next";
import Link from "next/link";
import { INDIA_STATES_AND_UTS } from "@/lib/indiaLocations";
import { toCitySlug, GLOBAL_HUBS_LIST, isCanonicalLocation } from "@/lib/citySeoData";

export const metadata: Metadata = {
  title: "Pan-India Local SEO & Digital Marketing Directory (350+ Cities)",
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
                name: "Locations Directory",
                item: "https://www.digitalfx.in/locations",
              },
            ],
          }),
        }}
      />
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
          <Link href="/" className="flex items-center shrink-0 group min-w-0" aria-label="Digital FX Home">
            <img src="/logo.svg" alt="Digital FX - Business Solution" width={154} height={41} style={{ height: "40px", width: "auto" }} className="h-8.5 sm:h-10 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform" />
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

      {/* 3B. INTERNATIONAL & GLOBAL OFFSHORE HUBS (DUBAI FLAGSHIP) */}
      <section className="py-12 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
                <span>🇦🇪</span> Flagship Global Hubs • Dubai, GCC, US &amp; UK
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080d24] tracking-tight">
                International Commercial &amp; Offshore Authority Hubs
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
                Digital FX engineers bespoke search dominance and Next.js platforms for international enterprises. Direct localized landing pages:
              </p>
            </div>
            <Link
              href="/#global-markets"
              className="px-4 py-2 rounded-xl bg-[#080d24] text-white hover:bg-slate-800 text-xs font-bold transition shrink-0"
            >
              1,098+ Global Keywords Explorer →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
            {GLOBAL_HUBS_LIST.map((hub) => (
              <Link
                key={hub.slug}
                href={`/locations/${hub.slug}`}
                className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group text-center"
              >
                <span className="text-3xl mb-1.5 group-hover:scale-110 transition-transform">{hub.flag}</span>
                <span className="font-extrabold text-xs text-[#080d24] group-hover:text-blue-600 transition-colors">{hub.name}</span>
                <span className="text-[10px] text-slate-500 font-medium mt-0.5">{hub.country}</span>
                <span className="mt-2 text-[9.5px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {hub.cta}
                </span>
              </Link>
            ))}
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
                  <Link
                    href={`/locations/${toCitySlug(region.name)}`}
                    className="text-base font-extrabold text-[#080d24] hover:text-[#207de9] tracking-tight flex items-center gap-2 group transition"
                    title={`Explore ${region.name} statewide SEO & digital marketing hub`}
                  >
                    <span className="text-[#207de9] text-sm group-hover:scale-110 transition-transform">📍</span>
                    <span className="group-hover:underline underline-offset-4">{region.name}</span>
                  </Link>
                  <Link
                    href={`/locations/${toCitySlug(region.name)}`}
                    className="text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-[#207de9] border border-blue-200 transition"
                  >
                    {region.cities.length} Cities Hub →
                  </Link>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {region.cities.map((city) => {
                    const slug = toCitySlug(city);
                    const isCanonicalCity = isCanonicalLocation(slug);
                    return isCanonicalCity ? (
                      <Link
                        key={city}
                        href={`/locations/${slug}`}
                        className="text-xs px-2.5 py-1 rounded-lg bg-blue-50/80 hover:bg-[#207de9] text-[#1570ef] hover:text-white transition font-semibold border border-blue-200/80 hover:border-[#207de9]"
                        title={`Digital Marketing & SEO in ${city}, ${region.name}`}
                      >
                        {city} ★
                      </Link>
                    ) : (
                      <Link
                        key={city}
                        href={`/locations/${toCitySlug(region.name)}`}
                        className="text-xs px-2 py-0.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition font-normal border border-slate-200/70"
                        title={`${city} covered under ${region.name} Authority Hub`}
                      >
                        {city}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <Link
                  href={`/locations/${toCitySlug(region.name)}`}
                  className="font-bold text-[#207de9] hover:underline flex items-center gap-1"
                >
                  <span>Explore {region.name} Hub</span>
                  <span>→</span>
                </Link>
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
