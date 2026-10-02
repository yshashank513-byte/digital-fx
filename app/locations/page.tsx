import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { INDIA_STATES_AND_UTS } from "@/lib/indiaLocations";
import { toCitySlug, GLOBAL_HUBS_LIST, isCanonicalLocation } from "@/lib/citySeoData";

export const metadata: Metadata = {
  title: "Digital Marketing & Local SEO Locations Directory",
  description:
    "Browse Digital FX location directories across Indian states, union territories, and commercial hubs for local SEO, Google Ads, and web development services.",
  alternates: {
    canonical: "https://www.digitalfx.in/locations",
  },
  openGraph: {
    title: "Digital Marketing & Local SEO Locations Directory",
    description:
      "Browse Digital FX location directories across Indian states, union territories, and commercial hubs for local SEO, Google Ads, and web development services.",
    url: "https://www.digitalfx.in/locations",
    siteName: "Digital FX",
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
      {/* Universal Navbar */}
      <Navbar currentPath="/locations" />

      {/* 3. HERO HEADER (CLEAN WHITE) */}
      <section className="py-16 sm:py-20 border-b border-slate-200 bg-gradient-to-b from-slate-50/80 via-white to-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="badge-eyebrow mb-4">
            <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse" />
            <span>All 28 States &amp; 8 Union Territories</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#080d24] mb-5 leading-tight">
            Pan-India Local SEO &amp; Digital Marketing <br className="hidden sm:block" />
            <span className="text-[#1570ef]">City Authority Directory</span>
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
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold uppercase tracking-wider mb-2">
                <span>Flagship Global Hubs • Dubai, GCC, US &amp; UK</span>
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
                className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-2xl hover:border-[#1570ef] hover:shadow-md transition-all group text-center"
              >
                <span className="text-3xl mb-1.5 group-hover:scale-110 transition-transform">{hub.flag}</span>
                <span className="font-extrabold text-xs text-[#080d24] group-hover:text-[#1570ef] transition-colors">{hub.name}</span>
                <span className="text-[10px] text-slate-500 font-medium mt-0.5">{hub.country}</span>
                <span className="mt-2 text-[9.5px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {hub.cta}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3C. TOP INDIAN COMMERCIAL & METROPOLITAN HUBS (DIRECT CRAWL EQUITY) */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="mb-6">
            <span className="badge-eyebrow mb-2">
              <span>Primary Commercial Corridors</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080d24] tracking-tight">
              Top Metropolitan &amp; Commercial Authority Hubs
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
              Direct access to verified localized search blueprints, local ranking telemetry, and pricing across major economic hubs:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { name: "Delhi", slug: "delhi", label: "National Capital" },
              { name: "Noida", slug: "noida", label: "IT & Commercial" },
              { name: "Ghaziabad", slug: "ghaziabad", label: "HQ Flagship" },
              { name: "Gurugram", slug: "gurugram", label: "Cyber City" },
              { name: "Faridabad", slug: "faridabad", label: "Industrial Belt" },
              { name: "Mumbai", slug: "mumbai", label: "Financial Capital" },
              { name: "Bengaluru", slug: "bengaluru", label: "Silicon Valley" },
              { name: "Hyderabad", slug: "hyderabad", label: "Cyberabad" },
              { name: "Ahmedabad", slug: "ahmedabad", label: "Commercial Hub" },
              { name: "Pune", slug: "pune", label: "Tech Corridor" },
              { name: "Chandigarh", slug: "chandigarh", label: "Tri-City Hub" },
              { name: "Mohali", slug: "mohali", label: "IT City" },
              { name: "Lucknow", slug: "lucknow", label: "UP Capital" },
              { name: "Jaipur", slug: "jaipur", label: "Commercial Center" },
              { name: "Kolkata", slug: "kolkata", label: "East Hub" },
              { name: "Chennai", slug: "chennai", label: "South Hub" },
              { name: "Indore", slug: "indore", label: "Central Hub" },
              { name: "Bhopal", slug: "bhopal", label: "MP Capital" },
              { name: "Coimbatore", slug: "coimbatore", label: "Industrial Hub" },
              { name: "Dehradun", slug: "dehradun", label: "Uttarakhand Hub" },
              { name: "Amritsar", slug: "amritsar", label: "Commercial City" },
              { name: "Surat", slug: "surat", label: "Diamond & Textile" },
              { name: "Patna", slug: "patna", label: "Bihar Capital" },
              { name: "Kochi", slug: "kochi", label: "Kerala Commercial" },
            ].map((metro) => (
              <Link
                key={metro.slug}
                href={`/locations/${metro.slug}`}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-[#1570ef] hover:bg-blue-50/50 hover:shadow-xs transition group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-[#080d24] group-hover:text-[#1570ef] transition">
                    {metro.name}
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-[#1570ef]">→</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium mt-1">
                  {metro.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DIRECTORY CONTENT: GROUPED BY STATES AND UTS (WHITE CARDS) */}
      <section className="py-16 max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INDIA_STATES_AND_UTS.map((region) => (
            <div
              key={region.name}
              className="rounded-2xl border border-slate-200 bg-white hover:border-[#1570ef] hover:shadow-md transition p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                  <Link
                    href={`/locations/${toCitySlug(region.name)}`}
                    className="text-base font-extrabold text-[#080d24] hover:text-[#1570ef] tracking-tight flex items-center gap-2 group transition"
                    title={`Explore ${region.name} statewide SEO & digital marketing hub`}
                  >
                    <span className="text-[#1570ef] text-sm group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    <span className="group-hover:underline underline-offset-4">{region.name}</span>
                  </Link>
                  <Link
                    href={`/locations/${toCitySlug(region.name)}`}
                    className="text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-[#1570ef] border border-blue-200 transition"
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
                        className="text-xs px-2.5 py-1 rounded-lg bg-blue-50/80 hover:bg-[#1570ef] text-[#1570ef] hover:text-white transition font-semibold border border-blue-200/80 hover:border-[#1570ef]"
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
                  className="font-bold text-[#1570ef] hover:underline flex items-center gap-1"
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
              href="https://wa.me/919319807273?text=Hi%20Digital%20FX,%20I%20want%20to%20rank%20my%20business."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#1570ef] hover:bg-[#105fc7] text-white font-bold text-xs transition flex items-center gap-2 shadow-xs"
            >
              <span>Speak with Growth Strategist</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
