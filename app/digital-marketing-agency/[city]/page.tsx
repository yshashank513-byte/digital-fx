import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CityEnquiryForm from "@/components/CityEnquiryForm";
import CityFaqAccordion from "@/components/CityFaqAccordion";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getCitySeoProfile,
  toCitySlug,
  CANONICAL_LOCATION_SLUGS,
  PRIORITY_20_SEO_CITIES,
  isCanonicalLocation,
  getParentStateSlugForCity,
} from "@/lib/citySeoData";

interface PageProps {
  params: Promise<{
    city: string;
  }>;
}

// Pre-render all 20 Focus Cities + all Canonical Authority Hubs
export async function generateStaticParams() {
  const combined = Array.from(new Set([...PRIORITY_20_SEO_CITIES, ...CANONICAL_LOCATION_SLUGS]));
  return combined.map((slug) => ({ city: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.city.toLowerCase().trim();

  // Canonicalize aliases
  if (rawSlug === "gurugram") {
    permanentRedirect("/digital-marketing-agency/gurgaon");
  }
  if (rawSlug === "bengaluru") {
    permanentRedirect("/digital-marketing-agency/bangalore");
  }

  const profile = getCitySeoProfile(rawSlug);

  if (!profile) {
    return {
      title: "Digital Marketing Agency | Location Not Found",
    };
  }

  const canonicalUrl = `https://www.digitalfx.in/digital-marketing-agency/${profile.slug}`;

  return {
    title: profile.metaTitle,
    description: profile.metaDescription,
    keywords: profile.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: profile.metaTitle,
      description: profile.metaDescription,
      url: canonicalUrl,
      siteName: "Digital FX",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: `Digital Marketing Agency in ${profile.name} - Digital FX`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: profile.metaTitle,
      description: profile.metaDescription,
      images: ["/logo.png"],
    },
  };
}

export default async function DigitalMarketingAgencyCityPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.city.toLowerCase().trim();

  // Handle aliases with 301 permanent redirects
  if (rawSlug === "gurugram") {
    permanentRedirect("/digital-marketing-agency/gurgaon");
  }
  if (rawSlug === "bengaluru") {
    permanentRedirect("/digital-marketing-agency/bangalore");
  }

  // If a secondary minor town is accessed, consolidate to parent state hub
  if (!isCanonicalLocation(rawSlug)) {
    const parentState = getParentStateSlugForCity(rawSlug);
    if (parentState && parentState !== rawSlug) {
      permanentRedirect(`/digital-marketing-agency/${parentState}`);
    } else {
      notFound();
    }
  }

  const profile = getCitySeoProfile(rawSlug);

  if (!profile) {
    notFound();
  }

  const canonicalUrl = `https://www.digitalfx.in/digital-marketing-agency/${profile.slug}`;

  // Structured Data (JSON-LD)
  const breadcrumbSchema = {
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
        name: "Digital Marketing Agency",
        item: "https://www.digitalfx.in/digital-marketing-agency",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: profile.name,
        item: canonicalUrl,
      },
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${canonicalUrl}#organization`,
    name: `Digital FX — Best Digital Marketing Agency in ${profile.name}`,
    url: canonicalUrl,
    logo: "https://www.digitalfx.in/logo.png",
    image: "https://www.digitalfx.in/logo.png",
    description: profile.metaDescription,
    telephone: "+91 93198 07273",
    email: "hello@digitalfx.in",
    priceRange: "₹₹ - ₹₹₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Shop No. 210, Second Floor, Orbit Plaza, Crossings Republik",
      addressLocality: "Ghaziabad",
      addressRegion: "Uttar Pradesh",
      postalCode: "201016",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: profile.coordinates.lat,
      longitude: profile.coordinates.lng,
    },
    areaServed: {
      "@type": profile.isState ? "State" : "City",
      name: profile.name,
    },
    hasMap: "https://share.google/EIVnaRy9WhkPCi8U8",
    sameAs: [
      "https://share.google/EIVnaRy9WhkPCi8U8",
      "https://wa.me/919319807273",
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:30",
        closes: "19:00",
      },
    ],
  };

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Digital Marketing, Local SEO & Web Development",
    provider: {
      "@type": "LocalBusiness",
      name: "Digital FX",
      telephone: "+91 93198 07273",
      url: "https://www.digitalfx.in",
    },
    areaServed: {
      "@type": profile.isState ? "State" : "City",
      name: profile.name,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Digital Marketing Services in ${profile.name}`,
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `Google Maps 3-Pack & Local SEO in ${profile.name}`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `High-Speed Next.js 16 Web Development in ${profile.name}`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `Google Ads PPC & Meta Performance Marketing in ${profile.name}`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `Generative Engine Optimization (GEO) & AI Search in ${profile.name}`,
          },
        },
      ],
    },
  };

  const faqSchema = {
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
  };

  const jsonLd = [breadcrumbSchema, localBusinessSchema, servicesSchema, faqSchema];

  // NCR and Indian Metro Quick Link Arrays
  const ncrHubs = [
    { name: "Noida", slug: "noida" },
    { name: "Ghaziabad", slug: "ghaziabad" },
    { name: "Delhi", slug: "delhi" },
    { name: "Greater Noida", slug: "greater-noida" },
    { name: "Gurgaon", slug: "gurgaon" },
    { name: "Faridabad", slug: "faridabad" },
    { name: "Indirapuram", slug: "indirapuram" },
    { name: "Vaishali", slug: "vaishali" },
    { name: "Vasundhara", slug: "vasundhara" },
    { name: "Raj Nagar Extension", slug: "raj-nagar-extension" },
  ];

  const metroHubs = [
    { name: "Mumbai", slug: "mumbai" },
    { name: "Bangalore", slug: "bangalore" },
    { name: "Hyderabad", slug: "hyderabad" },
    { name: "Pune", slug: "pune" },
    { name: "Jaipur", slug: "jaipur" },
    { name: "Lucknow", slug: "lucknow" },
    { name: "Chandigarh", slug: "chandigarh" },
    { name: "Ahmedabad", slug: "ahmedabad" },
    { name: "Kolkata", slug: "kolkata" },
    { name: "Chennai", slug: "chennai" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#1570ef] selection:text-white">
      {/* 1. JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 2. Global Navbar */}
      <Navbar currentPath="/digital-marketing-agency" />

      {/* 3. Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="bg-slate-50 border-b border-slate-200/80 py-3">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 text-xs text-slate-500 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#1570ef] transition font-medium">
            Home
          </Link>
          <span className="text-slate-400">/</span>
          <Link
            href="/digital-marketing-agency"
            className="hover:text-[#1570ef] transition font-medium"
          >
            Digital Marketing Agency
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-[#1570ef] font-bold">{profile.name}</span>
        </div>
      </nav>

      <main>
        {/* 4. HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-[#080d24] to-[#080d24] text-white pt-14 pb-20 sm:pt-20 sm:pb-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(21,112,239,0.18),transparent_50%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.12),transparent_50%)] pointer-events-none" />

          <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              
              {/* Location Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-semibold text-slate-200 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  📍 Strategic Growth Partner • {profile.name}, {profile.state}
                </span>
              </div>

              {/* H1 Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                Best Digital Marketing Agency in{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                  {profile.name}
                </span>
              </h1>

              {/* Value Proposition Subtitle */}
              <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
                {profile.heroTagline}. We engineer Google Maps 3-Pack domination, sub-second Next.js web applications, and high-ROI Google &amp; Meta ad funnels that generate qualified customer calls, walk-ins, and attributable revenue.
              </p>

              {/* Verified Trust Bar */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-400 font-medium">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <span className="text-emerald-400">✓</span> Verified Google Partner
                </span>
                <span className="flex items-center gap-1.5 text-slate-200">
                  <span className="text-emerald-400">✓</span> 0.8s Sub-Second Speed
                </span>
                <span className="flex items-center gap-1.5 text-slate-200">
                  <span className="text-emerald-400">✓</span> ₹6L+ Documented Client Revenue
                </span>
                <span className="flex items-center gap-1.5 text-slate-200">
                  <span className="text-emerald-400">✓</span> Zero Lock-In Contracts
                </span>
              </div>

              {/* Action CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#audit-form"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#1570ef] to-[#0d5ac9] hover:from-[#1264d8] hover:to-[#0a4bb0] text-white font-black text-sm sm:text-base shadow-xl shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer text-center"
                >
                  Get Free {profile.name} Growth Audit →
                </a>

                <a
                  href={`https://wa.me/919319807273?text=Hi%20Digital%20FX%20team,%20I%20want%20to%20discuss%20growing%20my%20business%20in%20${encodeURIComponent(profile.name)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>💬 WhatsApp Strategy Desk</span>
                </a>

                <a
                  href="tel:+919319807273"
                  className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm sm:text-base transition-all text-center"
                >
                  ☎ +91 93198 07273
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 5. LOCAL BUSINESS CHALLENGES IN CITY */}
        <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
              <span className="text-xs font-black uppercase tracking-wider text-[#1570ef]">
                Local Market Realities
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Why Most Businesses in {profile.name} Struggle Online
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Operating a commercial business in {profile.name} comes with hyper-local competitive hurdles. Traditional agency tactics fail to address these three critical realities:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {profile.localChallenges.map((challenge, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-slate-200/90 p-7 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 font-black flex items-center justify-center text-sm border border-red-100">
                      0{idx + 1}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {idx === 0
                        ? `Google Maps 3-Pack Loss in ${profile.name}`
                        : idx === 1
                        ? "Slow Websites & High Mobile Bounce"
                        : "Wasted Paid Ad Budgets"}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {challenge}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-[#1570ef] flex items-center gap-1">
                    <span>How Digital FX Solves This</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. FULL-FUNNEL DIGITAL MARKETING SERVICES FOR CITY */}
        <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
              <span className="text-xs font-black uppercase tracking-wider text-[#1570ef]">
                Comprehensive Growth Stack
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Our Digital Marketing Services in {profile.name}
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                From hyper-local Google Business Profile domination to custom Next.js 16 web development and high-ROI paid media, every deliverable is engineered for verifiable revenue growth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              
              {/* Service 1 */}
              <div className="rounded-2xl border border-slate-200/90 p-7 hover:border-blue-300 hover:shadow-lg transition-all space-y-4 bg-white flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1570ef] flex items-center justify-center text-xl font-bold">
                    📍
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Google Maps 3-Pack &amp; Local SEO
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Secure top 3 placement on Google Maps for high-intent customer searches in {profile.name}. We optimize GBP categories, eradicate duplicate pins, syndication citations across 50+ high-DA directories, and generate authentic customer reviews.
                  </p>
                </div>
                <ul className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5 font-medium">
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> GBP Verification &amp; Geo-Tagged Photos
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> 50+ Local NAP Directory Citations
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> ReviewFlow AI Tap-to-Review System
                  </li>
                </ul>
              </div>

              {/* Service 2 */}
              <div className="rounded-2xl border border-slate-200/90 p-7 hover:border-blue-300 hover:shadow-lg transition-all space-y-4 bg-white flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
                    ⚡
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Sub-Second Next.js 16 Web Development
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Custom web platforms built on Next.js 16 and Tailwind CSS that load in under 0.8 seconds on 4G/5G mobile devices in {profile.name}. Zero layout shift, 100% Core Web Vitals pass, and instant WhatsApp conversion triggers.
                  </p>
                </div>
                <ul className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5 font-medium">
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> Sub-0.8s Largest Contentful Paint (LCP)
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> Full Schema.org LocalBusiness Markup
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> Instant 1-Click WhatsApp &amp; Call Buttons
                  </li>
                </ul>
              </div>

              {/* Service 3 */}
              <div className="rounded-2xl border border-slate-200/90 p-7 hover:border-blue-300 hover:shadow-lg transition-all space-y-4 bg-white flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl font-bold">
                    🎯
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    High-ROI Google Ads (PPC) &amp; Meta Ads
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Laser-focused Google Search campaigns targeting buyers in {profile.name} who are ready to purchase today. Rigorous negative keyword sculpting prevents wasted spend, while hyper-local Meta funnels deliver low-cost leads.
                  </p>
                </div>
                <ul className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5 font-medium">
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> Exact-Match Search Query Intent
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> 4x - 8x Attributable ROAS Target
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> Live Lead Notification to Your WhatsApp
                  </li>
                </ul>
              </div>

              {/* Service 4 */}
              <div className="rounded-2xl border border-slate-200/90 p-7 hover:border-blue-300 hover:shadow-lg transition-all space-y-4 bg-white flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold">
                    🤖
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Generative Engine Optimization (GEO)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Make your {profile.name} business the default recommendation in AI search engines. We format your entity footprint so ChatGPT, Perplexity, and Google AI Overviews cite your brand when buyers search for solutions.
                  </p>
                </div>
                <ul className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5 font-medium">
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> Google AI Overview Citation Structuring
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> Perplexity &amp; ChatGPT Brand Citations
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> Knowledge Graph Entity Linking
                  </li>
                </ul>
              </div>

              {/* Service 5 */}
              <div className="rounded-2xl border border-slate-200/90 p-7 hover:border-blue-300 hover:shadow-lg transition-all space-y-4 bg-white flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
                    📈
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    ReviewFlow AI &amp; Customer Reviews
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Collect verified 5-star Google reviews effortlessly with our physical NFC standees and AI review generator. Turn happy customers in {profile.name} into your strongest organic search ranking asset.
                  </p>
                </div>
                <ul className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5 font-medium">
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> Physical NFC + QR Counter Standees
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> 1-Click Tap to Review Flow
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> AI Review Suggestion Engine
                  </li>
                </ul>
              </div>

              {/* Service 6 */}
              <div className="rounded-2xl border border-slate-200/90 p-7 hover:border-blue-300 hover:shadow-lg transition-all space-y-4 bg-white flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold">
                    🚀
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    B2B &amp; B2C Lead Generation Retainers
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Full-service performance retainers connecting paid traffic, organic SEO, and automated CRM funnels to scale your business in {profile.name} with predictable monthly customer acquisition.
                  </p>
                </div>
                <ul className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5 font-medium">
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> Dedicated Senior Strategist
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> Bi-Weekly Performance &amp; ROI Calls
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> Transparent Cost-Per-Acquisition (CPA)
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* 7. LOCAL CASE STUDY & VERIFIED PROOF */}
        <section className="py-16 sm:py-24 bg-slate-900 text-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 p-8 sm:p-12 shadow-2xl space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-6">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-blue-400">
                    Verified Local Result in {profile.name}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    {profile.sampleCaseStudy.clientType}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Location: {profile.sampleCaseStudy.neighborhood}
                  </p>
                </div>
                <div className="px-5 py-3 rounded-2xl bg-blue-500/10 border border-blue-400/30 text-blue-300 font-extrabold text-base sm:text-lg shrink-0">
                  {profile.sampleCaseStudy.metrics}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-200">Execution &amp; Strategy:</h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {profile.sampleCaseStudy.result}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-700/80 text-center">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">0.7s</div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Page Load Speed</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400">#1</div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Google Maps Rank</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">100%</div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Real Attribution</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-blue-400">0 Days</div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Lock-In Contracts</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. COMMERCIAL AREAS & LANDMARKS SERVED */}
        <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
              <span className="text-xs font-black uppercase tracking-wider text-[#1570ef]">
                Hyperlocal Reach
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Commercial Corridors &amp; Hubs Served in {profile.name}
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Digital FX provides on-ground and digital local search dominance across all major business sectors, high-streets, and industrial belts in {profile.name}:
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto">
              {profile.landmarks.map((landmark, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 border border-slate-200/80 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#1570ef] transition-colors"
                >
                  📍 {landmark}
                </span>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-blue-50/70 border border-blue-100 max-w-4xl mx-auto text-center text-xs sm:text-sm text-slate-600 space-y-2">
              <div className="font-bold text-slate-900">
                Primary Industries Scaled in {profile.name}:
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-slate-700 font-medium">
                {profile.primaryIndustries.map((ind, i) => (
                  <span key={i} className="inline-flex items-center gap-1">
                    <span>•</span>
                    <span>{ind}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 9. CITY FAQS ACCORDION */}
        <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
              <span className="text-xs font-black uppercase tracking-wider text-[#1570ef]">
                Frequently Asked Questions
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Questions About Digital Marketing in {profile.name}
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Transparent answers regarding local SEO timelines, pricing packages, and measurable business growth.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <CityFaqAccordion faqs={profile.faqs} cityName={profile.name} />
            </div>
          </div>
        </section>

        {/* 10. INTERACTIVE AUDIT & LEAD CAPTURE FORM */}
        <section id="audit-form" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="max-w-2xl mx-auto rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-12 shadow-xl space-y-6">
              <div className="text-center space-y-2">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#1570ef] text-xs font-extrabold uppercase tracking-wider">
                  Direct Strategy Desk
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Request Your Free {profile.name} Growth Audit
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Receive a detailed breakdown of your local Google Maps positioning, competitors, and website performance.
                </p>
              </div>

              <CityEnquiryForm cityName={profile.name} stateName={profile.state} />
            </div>
          </div>
        </section>

        {/* 11. INTERNAL LINKING ARCHITECTURE: DELHI NCR & TOP METROS */}
        <section className="py-16 sm:py-20 bg-slate-900 text-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 space-y-12">
            
            {/* Delhi NCR Hubs */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1570ef]" />
                <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-200">
                  Delhi NCR Digital Marketing Agency Network
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 text-xs">
                {ncrHubs.map((hub) => (
                  <Link
                    key={hub.slug}
                    href={`/digital-marketing-agency/${hub.slug}`}
                    className={`px-3 py-2.5 rounded-xl border transition-all ${
                      hub.slug === profile.slug
                        ? "bg-[#1570ef] border-[#1570ef] text-white font-bold"
                        : "bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white"
                    }`}
                  >
                    Agency in {hub.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Other Indian Metros */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-200">
                  Top Indian Metro Agency Network
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 text-xs">
                {metroHubs.map((hub) => (
                  <Link
                    key={hub.slug}
                    href={`/digital-marketing-agency/${hub.slug}`}
                    className={`px-3 py-2.5 rounded-xl border transition-all ${
                      hub.slug === profile.slug
                        ? "bg-emerald-600 border-emerald-600 text-white font-bold"
                        : "bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white"
                    }`}
                  >
                    Agency in {hub.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Core Growth Services & Solutions */}
            <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
              <Link href="/services" className="hover:text-white transition">
                All Agency Services
              </Link>
              <span>•</span>
              <Link href="/pricing" className="hover:text-white transition">
                Growth Packages &amp; Retainers
              </Link>
              <span>•</span>
              <Link href="/case-studies" className="hover:text-white transition">
                Verified Portfolio
              </Link>
              <span>•</span>
              <Link href="/reviewflow" className="hover:text-white transition">
                ReviewFlow AI Tap-to-Review
              </Link>
              <span>•</span>
              <Link href="/tools" className="hover:text-white transition">
                Free AI Search Audit Tool
              </Link>
              <span>•</span>
              <Link href="/blog" className="hover:text-white transition">
                SEO &amp; Growth Insights
              </Link>
              <span>•</span>
              <Link href="/contact" className="hover:text-white transition">
                Contact Strategy Desk
              </Link>
            </div>

          </div>
        </section>
      </main>

      {/* 12. Floating WhatsApp & Call Buttons for Immediate Mobile Conversion */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <a
          href={`https://wa.me/919319807273?text=Hi%20Digital%20FX%20team,%20I%20want%20to%20discuss%20growing%20my%20business%20in%20${encodeURIComponent(profile.name)}.`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chat with Digital FX on WhatsApp for ${profile.name}`}
          className="flex h-13 w-13 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:scale-105 transition-all"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </a>
      </div>

      {/* Universal Footer */}
      <Footer />
    </div>
  );
}
