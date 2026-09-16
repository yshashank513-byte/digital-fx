"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { GLOBAL_TARGET_MARKETS, GLOBAL_KEYWORDS_DATABASE, GlobalKeywordItem } from "@/lib/globalKeywordsData";

export default function GlobalKeywordsSection() {
  const [selectedCountry, setSelectedCountry] = useState<string>("AE");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "SEO & Organic Search",
    "Google Maps & Local 3-Pack",
    "GEO & AI Search Optimization",
    "Google Ads & Performance PPC",
    "Offshore Agency & B2B Retainers",
    "High-Speed Web & Next.js"
  ];

  const filteredKeywords = useMemo(() => {
    return GLOBAL_KEYWORDS_DATABASE.filter((item: GlobalKeywordItem) => {
      const matchCountry = selectedCountry === "ALL" || item.countryCode === selectedCountry;
      const matchCategory = selectedCategory === "All" || item.serviceCategory === selectedCategory;
      const matchSearch =
        searchTerm.trim() === "" ||
        item.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serviceCategory.toLowerCase().includes(searchTerm.toLowerCase());

      return matchCountry && matchCategory && matchSearch;
    });
  }, [selectedCountry, selectedCategory, searchTerm]);

  const dubaiStats = useMemo(() => {
    return GLOBAL_KEYWORDS_DATABASE.filter(k => k.countryCode === "AE").length;
  }, []);

  return (
    <section id="global-markets" className="scroll-mt-20 py-20 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50/70 border-b border-slate-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Badge & Title */}
        <div className="text-center max-w-[920px] mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold tracking-wider uppercase mb-3.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Global Search Engineering • Dubai &amp; GCC Expansion Hub
          </div>
          <h2 className="text-[30px] sm:text-[44px] lg:text-[48px] font-extrabold text-[#080d24] tracking-tight leading-[1.12]">
            Dominating Search In Global High-CPC Markets —{" "}
            <span className="webfx-serif text-[#207de9] block sm:inline font-normal">
              Dubai, USA, UK &amp; Beyond.
            </span>
          </h2>
          <p className="mt-4 text-[15px] sm:text-[17px] text-slate-600 font-normal leading-relaxed max-w-[820px] mx-auto">
            While physically headquartered in Delhi NCR, Digital FX provides full-funnel search optimization, Google Maps dominance, and high-converting Next.js web applications for international brands across 10 top commercial countries. Explore our active 1,098+ verified global keyword clusters below.
          </p>
        </div>

        {/* Dubai Flagship Highlight Card */}
        <div className="mb-12 bg-gradient-to-br from-[#080d24] via-[#0e1738] to-[#121c45] rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-blue-900/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
                <span>🇦🇪</span> Flagship Global Hub • Dubai &amp; UAE Focus
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                High-ROI Digital Marketing &amp; Google Maps 3-Pack in Dubai
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-light max-w-[700px]">
                Targeting high-ticket clients across <strong className="text-white font-semibold">Downtown Dubai, Business Bay, DIFC, Dubai Marina, and Palm Jumeirah</strong>. We solve sky-high Google Ads CPCs (often AED 45–120/click) by building sub-second Next.js web portals and organic 3-Pack authority that convert high-net-worth investors, aesthetic clinic patients, and corporate B2B clients.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-xs font-semibold text-slate-200 border border-white/10">
                  <span className="text-amber-400">🏢</span> Off-Plan Real Estate
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-xs font-semibold text-slate-200 border border-white/10">
                  <span className="text-pink-400">✨</span> Aesthetic &amp; Plastic Surgery
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-xs font-semibold text-slate-200 border border-white/10">
                  <span className="text-blue-400">⚖️</span> DIFC Law &amp; Wealth
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-xs font-semibold text-slate-200 border border-white/10">
                  <span className="text-emerald-400">🛥️</span> Luxury Yacht Rentals
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-xs font-semibold text-slate-200 border border-white/10">
                  <span className="text-purple-400">⚡</span> Crypto &amp; Web3 Ventures
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Dubai Monthly Retainer</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">AED 2,500</span>
                  <span className="text-xs text-slate-400 font-medium">/ month onwards</span>
                </div>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Includes localized Google Business Profile management, English &amp; Arabic SEO architecture, and PayU / International Card terminal billing.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  href="/locations/dubai"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#207de9] hover:bg-[#1a6bc7] text-white font-bold text-sm transition-all shadow-md hover:shadow-blue-500/30"
                >
                  <span>Explore Dubai Authority Page</span>
                  <span>→</span>
                </Link>
                <a
                  href="https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20want%20to%20consult%20regarding%20Dubai%20UAE%20digital%20marketing."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 font-bold text-xs transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Dubai WhatsApp Strategy Desk</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Global Hub Navigation Cards */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#080d24] uppercase tracking-wider text-xs">
              Direct International Hub Portals:
            </h3>
            <span className="text-xs text-slate-500 font-medium">Click to view local landing page</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { name: "Dubai", slug: "dubai", flag: "🇦🇪", currency: "AED" },
              { name: "Abu Dhabi", slug: "abu-dhabi", flag: "🇦🇪", currency: "AED" },
              { name: "Riyadh", slug: "riyadh", flag: "🇸🇦", currency: "SAR" },
              { name: "New York", slug: "new-york", flag: "🇺🇸", currency: "USD" },
              { name: "London", slug: "london", flag: "🇬🇧", currency: "GBP" },
              { name: "Toronto", slug: "toronto", flag: "🇨🇦", currency: "CAD" },
              { name: "Sydney", slug: "sydney", flag: "🇦🇺", currency: "AUD" },
              { name: "Singapore", slug: "singapore", flag: "🇸🇬", currency: "SGD" },
            ].map(hub => (
              <Link
                key={hub.slug}
                href={`/locations/${hub.slug}`}
                className="flex flex-col items-center justify-center p-3.5 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all group text-center"
              >
                <span className="text-2xl mb-1.5">{hub.flag}</span>
                <span className="font-bold text-xs text-[#080d24] group-hover:text-blue-600 transition-colors">{hub.name}</span>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{hub.currency} Market</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Interactive Country Tabs */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            {/* Country Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {[
                { label: "🇦🇪 UAE & Dubai", code: "AE" },
                { label: "🇺🇸 USA", code: "US" },
                { label: "🇬🇧 UK", code: "GB" },
                { label: "🇸🇦 Saudi / GCC", code: "SA" },
                { label: "🇨🇦 Canada", code: "CA" },
                { label: "🇦🇺 Australia", code: "AU" },
                { label: "🇸🇬 Singapore", code: "SG" },
                { label: "🌍 All Markets", code: "ALL" },
              ].map(c => {
                const active = selectedCountry === c.code;
                return (
                  <button
                    key={c.code}
                    onClick={() => setSelectedCountry(c.code)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      active
                        ? "bg-[#080d24] text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            {/* Keyword Search Input */}
            <div className="relative w-full lg:w-72 shrink-0">
              <input
                type="text"
                placeholder="Search 1,098+ global keywords..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 transition-colors"
              />
              <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-none border-b border-slate-100">
            <span className="text-[11px] font-bold uppercase text-slate-400 shrink-0 mr-1">Filter:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-[11.5px] font-semibold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results Counter & Live Keywords Grid */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pb-3">
            <span>Showing <strong>{filteredKeywords.length}</strong> verified target keywords</span>
            <span className="hidden sm:inline">Search Intent: Transactional &amp; Commercial</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredKeywords.slice(0, 36).map((item: GlobalKeywordItem) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      {item.region}
                    </span>
                    <span className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
                      {item.intent}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#080d24] leading-snug">
                    {item.keyword}
                  </h4>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-500">
                  <span>{item.serviceCategory}</span>
                  <span className="text-emerald-600 font-bold">{item.priority}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredKeywords.length > 36 && (
            <div className="mt-4 pt-3 text-center border-t border-slate-100">
              <span className="text-xs text-slate-500">
                + {filteredKeywords.length - 36} more indexed keywords in database. Use search box above to filter specific niches.
              </span>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
