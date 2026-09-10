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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
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
                {profile.name} Growth Desk
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/locations"
              className="text-xs font-semibold text-slate-300 hover:text-white transition hidden md:inline"
            >
              ← All Cities
            </Link>
            <a
              href={`https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20want%20to%20rank%20my%20business%20in%20${encodeURIComponent(profile.name)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition flex items-center gap-1.5 shadow-xs"
            >
              <span>WhatsApp Strategist</span>
            </a>
          </div>
        </div>
      </header>

      {/* Breadcrumb Trail */}
      <div className="border-b border-white/5 bg-slate-900/60 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-400 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <span>/</span>
          <Link href="/locations" className="hover:text-white transition">Locations</Link>
          <span>/</span>
          <span className="text-slate-300">{profile.state}</span>
          <span>/</span>
          <span className="text-blue-400 font-bold">{profile.name}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 border-b border-white/10 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-5">
            <span>📍 Local SEO &amp; Performance Marketing • {profile.name}, {profile.state}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-[1.15]">
            Best Digital Marketing Agency in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
              {profile.name}
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed mb-8">
            Digital FX helps commercial enterprises, retail brands, healthcare centers, and manufacturers in <strong>{profile.name}</strong> capture Rank #1 on Google Maps 3-Pack, build sub-second websites, and convert high-intent buyers into paying clients.
          </p>

          <div className="flex flex-wrap justify-center gap-3.5 mb-10">
            <a
              href={`https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20need%20a%20local%20SEO%20proposal%20for%20my%20business%20in%20${encodeURIComponent(profile.name)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm transition shadow-lg shadow-blue-500/25 flex items-center gap-2"
            >
              <span>Get Free {profile.name} Proposal</span>
              <span>→</span>
            </a>

            <Link
              href="/#geo-checker"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition border border-white/15 flex items-center gap-2"
            >
              <span>⚡ Run AI Geo-Audit</span>
            </Link>
          </div>

          {/* Key Proof Points */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-white/10 text-left">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-xl font-black text-white">4.9 ★</div>
              <div className="text-[11px] text-slate-400 mt-0.5">128+ Verified Reviews</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-xl font-black text-emerald-400">&lt; 0.8s</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Next.js Mobile Speed</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-xl font-black text-blue-400">45-90 Days</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Google Maps 3-Pack Target</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-xl font-black text-purple-400">100% ROI</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Attributable Pipeline Focus</div>
            </div>
          </div>
        </div>
      </section>

      {/* Local Commercial Landscape & Challenges */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Market Intelligence</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              The Digital Reality for Businesses in {profile.name}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Consumer behavior in {profile.name} has fundamentally changed. Whether it&apos;s a healthcare patient, a commercial B2B buyer, or a retail shopper, over 85% of purchases now begin with a mobile search for <em>&ldquo;best near me&rdquo;</em> on Google Maps or generative search engines like ChatGPT and Perplexity.
            </p>
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200 leading-relaxed">
              <strong>Key Corridors Targeted in {profile.name}:</strong>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {profile.landmarks.map((landmark) => (
                  <span key={landmark} className="px-2 py-0.5 rounded bg-blue-900/60 border border-blue-700/50 text-[11px]">
                    {landmark}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
              Common Growth Bottlenecks Faced by {profile.name} Companies:
            </h3>
            {profile.localChallenges.map((challenge, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-3.5"
              >
                <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ✕
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {challenge}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Stage Agency Execution System */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Proven Playbook</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Our 4-Stage Local Dominance Framework in {profile.name}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            No vanity impressions. We execute the exact technical signals Google requires to place your business at the top of organic results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.localStrategyPoints.map((point, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-blue-500/50 transition group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black text-xs">
                  0{idx + 1}
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition">
                  {point.split(":")[0]}
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {point.split(":")[1] || point}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Verified Local Case Study */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-900 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>✓ Verified Case Study Benchmark • {profile.name} Region</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
            {profile.sampleCaseStudy.clientType}
          </h2>
          <div className="text-xs text-slate-400 mb-4">
            Corridor: <span className="text-slate-200 font-semibold">{profile.sampleCaseStudy.neighborhood}</span>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 mb-4 inline-block">
            <span className="text-xs text-slate-400 block mb-1">Impact Metric:</span>
            <span className="text-lg sm:text-xl font-extrabold text-emerald-400">
              {profile.sampleCaseStudy.metrics}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {profile.sampleCaseStudy.result}
          </p>
        </div>
      </section>

      {/* Transparent Pricing Packages */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Transparent Investment</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Service Packages for {profile.name}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Clear deliverables with zero lock-in contracts. Pay securely via RBI-authorized PayU terminal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1 */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Tier 01</div>
              <h3 className="text-lg font-black text-white mt-1">Google Maps Local Growth</h3>
              <div className="mt-3 mb-4">
                <span className="text-2xl font-black text-white">₹2,000</span>
                <span className="text-xs text-slate-400 font-normal"> / month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2">✓ Complete GBP Audit &amp; Optimization</li>
                <li className="flex items-center gap-2">✓ 30 High-DA Local Indian Citations</li>
                <li className="flex items-center gap-2">✓ Review Capture Guidance</li>
                <li className="flex items-center gap-2">✓ Monthly Rank Tracking Report</li>
              </ul>
            </div>
            <a
              href={`https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20want%20the%20₹2,000/mo%20Google%20Maps%20Growth%20plan%20for%20${encodeURIComponent(profile.name)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs text-center transition"
            >
              Select Plan
            </a>
          </div>

          {/* Tier 2 - Featured */}
          <div className="p-6 rounded-2xl bg-blue-950/40 border-2 border-blue-500 flex flex-col justify-between relative shadow-xl shadow-blue-500/10">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider">
              Most Popular
            </div>
            <div>
              <div className="text-xs font-bold text-blue-300 uppercase tracking-wider">Tier 02</div>
              <h3 className="text-lg font-black text-white mt-1">Next.js Web Architecture</h3>
              <div className="mt-3 mb-4">
                <span className="text-2xl font-black text-white">₹10,000</span>
                <span className="text-xs text-slate-400 font-normal"> one-time</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-200 mb-6">
                <li className="flex items-center gap-2">✓ Sub-second (&lt; 0.8s) Mobile Speed</li>
                <li className="flex items-center gap-2">✓ 1-Click WhatsApp Conversion Engine</li>
                <li className="flex items-center gap-2">✓ Full Schema.org JSON-LD Markup</li>
                <li className="flex items-center gap-2">✓ Free SSL &amp; High-Speed CDN Hosting</li>
              </ul>
            </div>
            <a
              href={`https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20want%20a%20Next.js%20Website%20for%20my%20business%20in%20${encodeURIComponent(profile.name)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center transition shadow-md"
            >
              Build My Website
            </a>
          </div>

          {/* Tier 3 */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">Tier 03</div>
              <h3 className="text-lg font-black text-white mt-1">360° Growth Partner Retainer</h3>
              <div className="mt-3 mb-4">
                <span className="text-2xl font-black text-white">₹25,000</span>
                <span className="text-xs text-slate-400 font-normal"> / month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2">✓ Google Maps + Organic SEO Domination</li>
                <li className="flex items-center gap-2">✓ Google Search Ads &amp; Meta Funnels</li>
                <li className="flex items-center gap-2">✓ GEO &amp; AI Search Engine Placement</li>
                <li className="flex items-center gap-2">✓ Dedicated Senior Strategist Desk</li>
              </ul>
            </div>
            <a
              href={`https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20want%20to%20discuss%20the%20360°%20Growth%20Retainer%20for%20${encodeURIComponent(profile.name)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs text-center transition"
            >
              Book Consultation
            </a>
          </div>
        </div>
      </section>

      {/* Local FAQs */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Questions &amp; Answers</span>
          <h2 className="text-2xl font-black text-white mt-1">
            Frequently Asked Questions by {profile.name} Clients
          </h2>
        </div>

        <div className="space-y-4">
          {profile.faqs.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
              <h3 className="text-sm font-bold text-white mb-2">
                {faq.question}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">
          Ready to Dominate Local Search in {profile.name}?
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto mb-8">
          Get a complimentary, no-obligation AI Geo-Audit report analyzing your business against top {profile.name} competitors on Google Maps and organic search.
        </p>
        <div className="flex flex-wrap justify-center gap-3.5">
          <Link
            href="/#geo-checker"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
          >
            ⚡ Free AI Geo-Audit on Homepage
          </Link>
          <a
            href={`https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20am%20from%20${encodeURIComponent(profile.name)}%20and%20want%20to%20grow%20my%20business.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition"
          >
            Chat with Strategist on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
