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
    <main className="min-h-screen bg-[#080d24] text-white">
      {/* Top Navigation Bar */}
      <header className="border-b border-white/10 bg-[#080d24]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-0.5 border border-slate-200">
              <img src="/logo.png" alt="Digital FX" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white group-hover:text-blue-400 transition">
                DIGITAL <span className="text-blue-400">FX</span>
              </span>
              <span className="block text-[8.5px] font-bold tracking-[1.8px] text-slate-400 uppercase">
                Pan-India Directory
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/#geo-checker"
              className="hidden sm:inline-flex text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition"
            >
              ⚡ Free AI Geo-Audit
            </Link>
            <a
              href="https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20want%20to%20rank%20my%20business%20in%20my%20city."
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition flex items-center gap-1.5"
            >
              <span>WhatsApp Strategy</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="py-16 sm:py-20 border-b border-white/10 bg-gradient-to-b from-[#0d163a] to-[#080d24]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <span>🇮🇳 All 28 States &amp; 8 Union Territories</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-5 leading-tight">
            Pan-India Local SEO &amp; Digital Marketing <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
              City Authority Directory
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed mb-8">
            Digital FX provides high-converting Google Maps 3-Pack rankings, sub-second Next.js web development, and revenue-driven performance marketing across <strong>{totalCities}+ commercial centers</strong> in India. Select your city below to inspect custom local search data and growth blueprints.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{totalStatesAndUTs} States &amp; UTs Mapped</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>{totalCities}+ Cities Active</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>4.9★ Rating • 128+ Client Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Directory Content: Grouped by States and UTs */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INDIA_STATES_AND_UTS.map((region) => (
            <div
              key={region.name}
              className="rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
                  <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <span className="text-blue-400 text-sm">📍</span>
                    <span>{region.name}</span>
                  </h2>
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
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
                        className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-blue-600 hover:text-white text-slate-300 transition font-medium border border-white/5 hover:border-blue-500"
                        title={`Digital Marketing & SEO in ${city}, ${region.name}`}
                      >
                        {city}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                <span>Local Search Coverage</span>
                <span className="text-emerald-400 font-semibold">Verified Active ✓</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-12 border-t border-white/10 bg-[#060a1d]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-xl sm:text-2xl font-black text-white mb-3">
            Don&apos;t See Your Specific Tehsil or Town?
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm mb-6 max-w-xl mx-auto">
            Digital FX serves all regional commercial corridors across India. Speak directly with our Senior Growth Strategist to build a custom local search playbook for your exact business coordinates.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition"
            >
              ← Back to Main Website
            </Link>
            <a
              href="https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20want%20to%20rank%20my%20business."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center gap-2"
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
