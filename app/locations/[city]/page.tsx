import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCitySeoProfile, toCitySlug, ALL_CITIES_FLAT } from "@/lib/citySeoData";

interface PageProps {
  params: Promise<{
    city: string;
  }>;
}

// Pre-render top 35 high-impact commercial hubs across India
export async function generateStaticParams() {
  const topCities = [
    "ghaziabad",
    "noida",
    "delhi",
    "gurugram",
    "faridabad",
    "mumbai",
    "pune",
    "bengaluru",
    "hyderabad",
    "ahmedabad",
    "chennai",
    "kolkata",
    "jaipur",
    "lucknow",
    "kanpur",
    "indore",
    "bhopal",
    "chandigarh",
    "mohali",
    "kochi",
    "patna",
    "surat",
    "nagpur",
    "visakhapatnam",
    "bhubaneswar",
    "ludhiana",
    "dehradun",
    "vadodara",
    "coimbatore",
    "varanasi",
    "agra",
    "prayagraj",
    "meerut",
    "amritsar",
    "nashik",
    "rajkot",
  ];

  return topCities.map((slug) => ({ city: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const profile = getCitySeoProfile(resolvedParams.city);

  if (!profile) {
    return {
      title: "City Not Found | Digital FX",
    };
  }

  return {
    title: profile.metaTitle,
    description: profile.metaDescription,
    keywords: profile.keywords,
    alternates: {
      canonical: `https://www.digitalfx.in/locations/${profile.slug}`,
    },
    openGraph: {
      title: profile.metaTitle,
      description: profile.metaDescription,
      url: `https://www.digitalfx.in/locations/${profile.slug}`,
      siteName: "Digital FX",
      images: [
        {
          url: "/logo.png",
          width: 1024,
          height: 1024,
          alt: `Digital FX in ${profile.name}`,
        },
      ],
    },
  };
}

export default async function CityLocationPage({ params }: PageProps) {
  const resolvedParams = await params;
  const profile = getCitySeoProfile(resolvedParams.city);

  if (!profile) {
    notFound();
  }

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": `https://www.digitalfx.in/locations/${profile.slug}#localbusiness`,
      name: `Digital FX — Best Digital Marketing Agency in ${profile.name}`,
      url: `https://www.digitalfx.in/locations/${profile.slug}`,
      logo: "https://www.digitalfx.in/logo.png",
      image: "https://www.digitalfx.in/logo.png",
      description: profile.metaDescription,
      telephone: "+91 84475 83685",
      priceRange: "₹₹ - ₹₹₹₹",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Shop No. 210, Second Floor, Orbit Plaza, Crossings Republik",
        addressLocality: "Ghaziabad",
        addressRegion: "Uttar Pradesh",
        postalCode: "201016",
        addressCountry: "IN",
      },
      areaServed: [
        {
          "@type": "City",
          name: profile.name,
        },
        {
          "@type": "State",
          name: profile.state,
        },
      ],
      geo: {
        "@type": "GeoCoordinates",
        latitude: profile.coordinates.lat,
        longitude: profile.coordinates.lng,
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "128",
        bestRating: "5",
        worstRating: "1",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: profile.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    {
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
          name: "Locations",
          item: "https://www.digitalfx.in/locations",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: profile.state,
          item: "https://www.digitalfx.in/locations",
        },
        {
          "@type": "ListItem",
          position: 4,
          name: profile.name,
          item: `https://www.digitalfx.in/locations/${profile.slug}`,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#207de9] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. TOP INSTITUTIONAL BAR */}
      <div className="bg-[#080d24] text-white py-2 border-b border-white/10 text-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-slate-300 text-[11.5px] font-medium">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Google Premier Partner Certified
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline text-slate-300">
              {profile.name}, {profile.state} Growth Desk
            </span>
          </div>

          <div className="flex items-center gap-4 text-[12px] font-medium ml-auto sm:ml-0">
            <a href="tel:+918447583685" className="hover:text-white font-bold transition flex items-center gap-1.5">
              <span className="text-[#207de9]">☎</span> +91 84475 83685
            </a>
            <a
              href={`https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20am%20from%20${encodeURIComponent(profile.name)}%20and%20need%20a%20strategy.`}
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

      {/* 2. MAIN HEADER (MATCHES HOMEPAGE DESIGN) */}
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
                {profile.name} Local Search Architecture
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
              href="/locations"
              className="text-xs font-bold text-slate-600 hover:text-[#207de9] transition hidden sm:inline"
            >
              ← All Locations
            </Link>
            <a
              href={`https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20want%20to%20rank%20my%20business%20in%20${encodeURIComponent(profile.name)}.`}
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

      {/* 3. BREADCRUMBS */}
      <div className="bg-slate-50 border-b border-slate-200/80 py-3">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#207de9] transition font-medium">Home</Link>
          <span className="text-slate-400">/</span>
          <Link href="/locations" className="hover:text-[#207de9] transition font-medium">Locations</Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600 font-medium">{profile.state}</span>
          <span className="text-slate-400">/</span>
          <span className="text-[#207de9] font-bold">{profile.name}</span>
        </div>
      </div>

      {/* 4. HERO SECTION (WHITE CORPORATE AGENCY STYLE) */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-50/80 via-white to-white border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#1570ef] text-xs font-bold tracking-wider uppercase mb-5">
            <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse" />
            <span>Local SEO &amp; Performance Marketing Hub • {profile.name}, {profile.state}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#080d24] leading-[1.14] mb-6">
            Best Digital Marketing Agency in{" "}
            <span className="text-[#207de9] underline decoration-blue-200 underline-offset-8">
              {profile.name}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto mb-8">
            Digital FX helps commercial enterprises, retail brands, healthcare clinics, immigration firms, and manufacturing businesses in <strong>{profile.name}</strong> capture Rank #1 on Google Maps 3-Pack, build sub-second Next.js web applications, and generate high-intent customer inquiries that convert into revenue.
          </p>

          {/* Action Buttons with Full Details Open */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-2xl mx-auto mb-10">
            <a
              href={`https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20am%20from%20${encodeURIComponent(profile.name)}%20and%20want%20a%20free%20growth%20audit.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              <span>💬 Chat with Senior Strategist (WhatsApp)</span>
              <span>→</span>
            </a>

            <Link
              href="/#geo-checker"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#207de9] hover:bg-[#1a6bc7] text-white font-extrabold text-xs sm:text-sm transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <span>⚡ Run Free AI Geo-Audit for {profile.name}</span>
            </Link>
          </div>

          {/* Proof Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-slate-200 text-left">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xl font-extrabold text-[#080d24]">4.9 ★★★★★</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">128+ Verified Reviews</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xl font-extrabold text-emerald-600">&lt; 0.8s</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Sub-Second Mobile Load</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xl font-extrabold text-[#207de9]">45-90 Days</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Google Maps 3-Pack Target</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xl font-extrabold text-purple-600">Zero Lock-In</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Cancel Anytime Retainers</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LOCAL MARKET REALITY & CORRIDORS */}
      <section className="py-16 sm:py-20 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#207de9] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Commercial Intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080d24] leading-tight tracking-tight">
              The Digital Reality for Growing Businesses in {profile.name}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Consumer behavior in {profile.name} has fundamentally changed. Whether it&apos;s a healthcare patient, a commercial B2B buyer, or an overseas visa applicant, over 85% of purchases now begin with a mobile search for <em>&ldquo;best near me&rdquo;</em> on Google Maps or generative search engines like ChatGPT and Perplexity.
            </p>

            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-slate-800 space-y-2">
              <strong className="text-[#080d24] font-bold block text-sm">
                Primary Commercial Corridors Targeted in {profile.name}:
              </strong>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {profile.landmarks.map((landmark) => (
                  <span key={landmark} className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-[#080d24] text-xs font-semibold shadow-2xs">
                    📍 {landmark}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Core Growth Bottlenecks Faced by Businesses in {profile.name}:
            </h3>
            {profile.localChallenges.map((challenge, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5 shadow-2xs"
              >
                <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ✕
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {challenge}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PROVEN 4-STAGE EXECUTION SYSTEM (DETAILS FULLY OPEN) */}
      <section className="py-16 sm:py-20 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#207de9] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Engineered Playbook
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080d24] mt-3 tracking-tight">
            Our 4-Stage Local Dominance Framework in {profile.name}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2">
            Every step is transparent with clear deliverable milestones. No hidden fluff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.localStrategyPoints.map((point, idx) => {
            const [title, desc] = point.includes(":") ? point.split(":") : [`Stage 0${idx + 1}`, point];
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#207de9] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#207de9] border border-blue-200 flex items-center justify-center font-black text-xs">
                      0{idx + 1}
                    </div>
                    <h3 className="text-base font-bold text-[#080d24]">
                      {title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {desc || point}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <span>Implementation Phase</span>
                  <span className="text-emerald-700 font-bold">Verified Deliverable ✓</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. VERIFIED LOCAL CASE STUDY */}
      <section className="py-16 sm:py-20 max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/40 via-white to-blue-50/30 p-7 sm:p-10 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <span>✓ Verified Case Study Benchmark • {profile.name} Region</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#080d24] mb-2 tracking-tight">
            {profile.sampleCaseStudy.clientType}
          </h2>
          <div className="text-xs text-slate-500 mb-5">
            Commercial Corridor: <strong className="text-slate-800">{profile.sampleCaseStudy.neighborhood}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-emerald-200 mb-5 inline-block shadow-xs">
            <span className="text-xs text-slate-500 block mb-1 font-medium">Attributable Growth Metric:</span>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-700">
              {profile.sampleCaseStudy.metrics}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            {profile.sampleCaseStudy.result}
          </p>
        </div>
      </section>

      {/* 8. TRANSPARENT PRICING TIERS (ALL DETAILS ADDED & BUTTONS OPEN) */}
      <section className="py-16 sm:py-20 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#207de9] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Clear Investment
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080d24] mt-3 tracking-tight">
            Transparent Pricing &amp; Packages for {profile.name}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2">
            All details, deliverables, and terms are fully listed below. Zero hidden charges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan 1 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tier 01</span>
              <h3 className="text-lg font-black text-[#080d24] mt-1">Google Maps Local Growth</h3>
              <div className="mt-3 mb-5">
                <span className="text-3xl font-black text-[#080d24]">₹2,000</span>
                <span className="text-xs text-slate-500 font-medium"> / month</span>
              </div>

              {/* Full Inclusions Open */}
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                What&apos;s Included (Full Deliverables):
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Complete GBP Category &amp; NAP Audit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>30 High-DA Local Indian Citations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Automated WhatsApp Review Capture Playbook</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Geo-Tagged Storefront Photo Optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Monthly Local Search Rank Tracking Report</span>
                </li>
              </ul>
            </div>

            {/* Button with Details */}
            <a
              href={`https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20want%20to%20activate%20the%20₹2,000/mo%20Google%20Maps%20Growth%20plan%20for%20${encodeURIComponent(profile.name)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-[#207de9] text-white font-bold text-xs text-center transition shadow-xs flex flex-col items-center justify-center gap-0.5 cursor-pointer"
            >
              <span>Activate Plan on WhatsApp</span>
              <span className="text-[10px] text-slate-300 font-normal">₹2,000/mo • Instant Onboarding</span>
            </a>
          </div>

          {/* Plan 2 - Featured */}
          <div className="p-6 sm:p-7 rounded-2xl bg-blue-50/40 border-2 border-[#207de9] shadow-md flex flex-col justify-between relative">
            <div className="absolute -top-3 right-5 px-3 py-0.5 rounded-full bg-[#207de9] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
              Most Popular
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#207de9]">Tier 02</span>
              <h3 className="text-lg font-black text-[#080d24] mt-1">Next.js Web Architecture</h3>
              <div className="mt-3 mb-5">
                <span className="text-3xl font-black text-[#080d24]">₹10,000</span>
                <span className="text-xs text-slate-500 font-medium"> one-time</span>
              </div>

              {/* Full Inclusions Open */}
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                What&apos;s Included (Full Deliverables):
              </div>
              <ul className="space-y-2.5 text-xs text-slate-800 mb-8 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-[#207de9] font-bold">✓</span>
                  <span>Sub-Second (&lt; 0.8s) Mobile Load Speed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#207de9] font-bold">✓</span>
                  <span>1-Click WhatsApp Floating Conversion Engine</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#207de9] font-bold">✓</span>
                  <span>Complete Schema.org JSON-LD Structured Data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#207de9] font-bold">✓</span>
                  <span>Free SSL, Domain Setup &amp; Edge CDN Hosting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#207de9] font-bold">✓</span>
                  <span>Delivered in 7 Days with 100% Mobile Score</span>
                </li>
              </ul>
            </div>

            {/* Button with Details */}
            <a
              href={`https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20want%20to%20build%20a%20Next.js%20Website%20for%20my%20business%20in%20${encodeURIComponent(profile.name)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-[#207de9] hover:bg-[#1a6bc7] text-white font-bold text-xs text-center transition shadow-md shadow-blue-500/25 flex flex-col items-center justify-center gap-0.5 cursor-pointer"
            >
              <span>Build My Website</span>
              <span className="text-[10px] text-blue-100 font-normal">₹10,000 One-Time • 7-Day Launch</span>
            </a>
          </div>

          {/* Plan 3 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Tier 03</span>
              <h3 className="text-lg font-black text-[#080d24] mt-1">360° Growth Retainer</h3>
              <div className="mt-3 mb-5">
                <span className="text-3xl font-black text-[#080d24]">₹25,000</span>
                <span className="text-xs text-slate-500 font-medium"> / month</span>
              </div>

              {/* Full Inclusions Open */}
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                What&apos;s Included (Full Deliverables):
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">✓</span>
                  <span>Google Maps 3-Pack + National SEO Domination</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">✓</span>
                  <span>High-Intent Google Search Ads + Meta Retargeting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">✓</span>
                  <span>Generative Engine Optimization (GEO for AI Search)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">✓</span>
                  <span>Dedicated Senior Growth Strategist Phone Desk</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">✓</span>
                  <span>Weekly Closed-Loop Lead Attribution Reports</span>
                </li>
              </ul>
            </div>

            {/* Button with Details */}
            <a
              href={`https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20want%20to%20discuss%20the%20360°%20Growth%20Retainer%20for%20${encodeURIComponent(profile.name)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-purple-700 text-white font-bold text-xs text-center transition shadow-xs flex flex-col items-center justify-center gap-0.5 cursor-pointer"
            >
              <span>Retain Growth Strategist</span>
              <span className="text-[10px] text-slate-300 font-normal">₹25,000/mo • Dedicated Line</span>
            </a>
          </div>
        </div>
      </section>

      {/* 9. LOCAL FAQS - ALL QUESTIONS & ANSWERS FULLY OPEN */}
      <section className="py-16 sm:py-20 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#207de9] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Frequently Answered Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080d24] mt-3 tracking-tight">
            Client Inquiries &amp; Answers for {profile.name}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            All details are fully visible below. Click nothing to read.
          </p>
        </div>

        <div className="space-y-4">
          {profile.faqs.map((faq, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200">
              <h3 className="text-base font-bold text-[#080d24] mb-2 flex items-start gap-2.5">
                <span className="text-[#207de9] font-black">Q{idx + 1}.</span>
                <span>{faq.question}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6 font-normal">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. BOTTOM CONSULTATION BANNER */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-[1000px] mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#080d24] mb-3 tracking-tight">
            Ready to Dominate Local Search in {profile.name}?
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto mb-8 leading-relaxed">
            Get a complimentary, no-obligation AI Geo-Audit report analyzing your business against top {profile.name} competitors on Google Maps and organic search.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/#geo-checker"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#207de9] hover:bg-[#1a6bc7] text-white font-bold text-xs sm:text-sm transition shadow-sm"
            >
              ⚡ Run Free AI Geo-Audit on Homepage
            </Link>
            <a
              href={`https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20am%20from%20${encodeURIComponent(profile.name)}%20and%20want%20to%20consult.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition shadow-sm"
            >
              Chat on WhatsApp (+91 84475 83685)
            </a>
          </div>

          <div className="mt-8 text-xs text-slate-500 font-medium">
            Official Headquarters: Shop No. 210, Orbit Plaza, Crossings Republik, Ghaziabad • Serving {profile.name} &amp; Pan-India
          </div>
        </div>
      </section>
    </div>
  );
}
