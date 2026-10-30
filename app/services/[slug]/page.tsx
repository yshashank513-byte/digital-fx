import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CityEnquiryForm from "@/components/CityEnquiryForm";
import FaqAccordion from "@/components/FaqAccordion";
import {
  SERVICES_CATALOG,
  getServiceBySlug,
  getAllServices,
} from "@/lib/servicesData";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];

  for (const service of Object.values(SERVICES_CATALOG)) {
    params.push({ slug: service.slug });
    if (service.aliases) {
      for (const alias of service.aliases) {
        params.push({ slug: alias });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | Digital FX",
      description: "The requested digital marketing service could not be found.",
    };
  }

  const canonicalUrl = `https://www.digitalfx.in/services/${service.slug}`;

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: canonicalUrl,
      siteName: "Digital FX",
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: service.metaTitle,
      description: service.metaDescription,
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  // Schema.org Structured Data
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.shortTitle,
    description: service.metaDescription,
    provider: {
      "@type": "Organization",
      name: "Digital FX",
      url: "https://www.digitalfx.in",
      telephone: "+919319807273",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Shop No. 210, 2nd Floor, Orbit Plaza, Crossings Republik",
        addressLocality: "Ghaziabad",
        addressRegion: "Uttar Pradesh",
        postalCode: "201016",
        addressCountry: "IN",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "128",
        bestRating: "5",
        worstRating: "1",
      },
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.shortTitle} Service Plans`,
      itemListElement: service.pricingTiers.map((tier) => ({
        "@type": "Offer",
        name: tier.name,
        price: tier.price.replace(/[^\d]/g, ""),
        priceCurrency: "INR",
        description: tier.description,
      })),
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

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
        name: "Services",
        item: "https://www.digitalfx.in/services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.shortTitle,
        item: `https://www.digitalfx.in/services/${service.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-[#207de9] selection:text-white">
      {/* Schema.org Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Navbar currentPath={`/services/${service.slug}`} />

      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#080d24] via-[#0b1333] to-[#080d24] text-white pt-14 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#207de9]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 relative z-10">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-white transition">Services</Link>
            <span>/</span>
            <span className="text-[#207de9]">{service.shortTitle}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>{service.heroBadge}</span>
              </div>

              {/* H1 Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black tracking-[-0.03em] leading-[1.12] text-white">
                {service.h1}
              </h1>

              {/* Tagline */}
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
                {service.heroTagline}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <a
                  href="#enquiry-form"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1570ef] hover:bg-[#1258c4] text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5"
                >
                  <span>Request Custom Strategy &amp; Pricing</span>
                  <span>→</span>
                </a>

                <a
                  href="https://wa.me/919319807273?text=Hi%20Digital%20FX%20team,%20I%20want%20to%20discuss%20your%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>WhatsApp Strategy Desk</span>
                </a>

                <a
                  href="tel:+919319807273"
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-slate-300 hover:text-white font-bold text-sm transition"
                >
                  <span>☎ +91 93198 07273</span>
                </a>
              </div>

              {/* Credibility Ribbon */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">★★★★★</span>
                  <span className="font-bold text-slate-200">4.9/5.0 Client Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Google Premier Partner Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Meta Certified Agency</span>
                </div>
              </div>

            </div>

            {/* Right Card: Quick Consultation Box */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-slate-900">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#1570ef]">
                    Fast Track Consultation
                  </span>
                  <h3 className="text-lg font-black text-[#080d24]">
                    Get a 30-Minute Growth Roadmap
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                  FREE
                </span>
              </div>
              <CityEnquiryForm cityName="National" compact={true} />
            </div>

          </div>

        </div>
      </section>

      {/* 2. VERIFIED KEY METRICS STRIP */}
      <section className="bg-slate-50 border-b border-slate-200 py-10">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {service.keyMetrics.map((metric, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#080d24] tracking-tight">
                  {metric.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#1570ef] mt-1">
                  {metric.label}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-snug">
                  {metric.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHY THIS MATTERS & OVERVIEW */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold uppercase tracking-wider">
                Strategic Foundation
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#080d24] tracking-tight leading-tight">
                {service.whyItMatters.heading}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {service.overview}
              </p>
            </div>

            <div className="lg:col-span-6 space-y-4">
              {service.whyItMatters.points.map((point, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#1570ef] font-black text-xs">
                    0{idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {point}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 4. CORE DELIVERABLES GRID */}
      <section className="py-16 sm:py-20 bg-[#f8faff] border-t border-b border-slate-200">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold uppercase tracking-wider mb-3">
              Full Scope of Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#080d24] tracking-tight">
              What We Deliver for Your Business
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Every deliverable is engineered for measurable commercial impact, transparency, and enterprise rigor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.deliverables.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1570ef] font-bold text-lg mb-5 group-hover:bg-[#1570ef] group-hover:text-white transition-colors">
                  0{idx + 1}
                </div>
                <h3 className="text-lg font-bold text-[#080d24] group-hover:text-[#1570ef] transition-colors mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. 4-STEP EXECUTION FRAMEWORK */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold uppercase tracking-wider mb-3">
              Execution Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#080d24] tracking-tight">
              Our 4-Phase Growth Framework
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              How we diagnose, build, launch, and compound your results from week one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.process.map((step, idx) => (
              <div
                key={idx}
                className="relative bg-slate-50 p-6 rounded-3xl border border-slate-200/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-[#1570ef]/40">
                      {step.step}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100/60 text-[#1570ef] text-[11px] font-bold uppercase tracking-wider">
                      {step.phase}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#080d24] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. VERIFIED CASE STUDY SPOTLIGHT */}
      <section className="py-16 bg-[#080d24] text-white">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-slate-900 border border-white/10 rounded-3xl p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                  Verified Client Results • {service.caseStudy.industry}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {service.caseStudy.client}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {service.caseStudy.result}
                </p>
                <div className="pt-2">
                  <Link
                    href={`/case-studies/${service.caseStudy.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition"
                  >
                    <span>Read Full Case Study Breakdown</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Key Metric Achieved
                </div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-2">
                  {service.caseStudy.metric}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Independently audited &amp; verified performance
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 7. TARGET INDUSTRY APPLICATIONS */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold uppercase tracking-wider mb-3">
              Sector Specialization
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#080d24] tracking-tight">
              Engineered for Your Industry
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              How our {service.shortTitle.toLowerCase()} strategy adapts to specific category dynamics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.targetIndustries.map((ind, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-[#1570ef] font-bold flex items-center justify-center text-sm mb-4">
                  ★
                </div>
                <h3 className="text-base font-bold text-[#080d24] mb-2">
                  {ind.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {ind.application}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. TRANSPARENT PRICING & TIERS */}
      <section className="py-16 sm:py-20 bg-[#f8faff] border-t border-b border-slate-200">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold uppercase tracking-wider mb-3">
              Predictable Retainers
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#080d24] tracking-tight">
              Transparent Pricing &amp; Service Tiers
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              No hidden fees, no surprise lock-in contracts. Transparent monthly growth retainers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {service.pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all ${
                  tier.recommended
                    ? "bg-[#080d24] text-white shadow-xl ring-2 ring-[#1570ef] relative"
                    : "bg-white text-slate-900 border border-slate-200 shadow-xs"
                }`}
              >
                {tier.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#1570ef] text-white text-[11px] font-bold uppercase tracking-wider">
                    {tier.badge}
                  </span>
                )}

                <div>
                  <h3 className="text-lg font-bold">{tier.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black">{tier.price}</span>
                    <span className={`text-xs ${tier.recommended ? "text-slate-300" : "text-slate-500"}`}>
                      /{tier.period}
                    </span>
                  </div>
                  <p className={`mt-3 text-xs leading-relaxed ${tier.recommended ? "text-slate-300" : "text-slate-600"}`}>
                    {tier.description}
                  </p>

                  <div className={`my-6 border-t ${tier.recommended ? "border-white/10" : "border-slate-100"}`} />

                  <ul className="space-y-3 text-xs">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <span className="text-emerald-400 font-bold shrink-0">✓</span>
                        <span className={tier.recommended ? "text-slate-200" : "text-slate-700"}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <a
                    href="#enquiry-form"
                    className={`w-full inline-flex items-center justify-center py-3 px-5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      tier.recommended
                        ? "bg-[#1570ef] hover:bg-[#1258c4] text-white shadow-md shadow-blue-500/20"
                        : "bg-slate-900 hover:bg-[#1570ef] text-white"
                    }`}
                  >
                    Select {tier.name}
                  </a>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. SERVICE FAQS ACCORDION */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 md:px-8">
          
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold uppercase tracking-wider mb-3">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080d24] tracking-tight">
              Frequently Asked Questions About {service.shortTitle}
            </h2>
          </div>

          <FaqAccordion faqs={service.faqs} theme="light" />

        </div>
      </section>

      {/* 10. CONVERSION CONSULTATION SECTION */}
      <section id="enquiry-form" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-7 sm:p-10 shadow-lg border border-slate-200/90">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1570ef] mb-3">
                <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse" />
                Dedicated Growth Strategy
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080d24] tracking-tight">
                Request a Custom {service.shortTitle} Roadmap
              </h2>
              <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
                Speak directly with our senior search and performance engineers at our Orbit Plaza office or book a digital video consultation.
              </p>
            </div>
            <CityEnquiryForm cityName="Digital FX Headquarters" />
          </div>
        </div>
      </section>

      {/* 11. RELATED SERVICES & MULTI-CITY INTERNAL LINKS */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-600">
            
            {/* Related Services */}
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-3">
                Complementary Growth Solutions
              </h4>
              <div className="flex flex-wrap gap-2">
                {service.relatedServices.map((rel, idx) => (
                  <Link
                    key={idx}
                    href={`/services/${rel.slug}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#1570ef] transition-colors border border-slate-200/80 font-medium"
                  >
                    {rel.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Top Regional Locations */}
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-3">
                Local Market Coverage (Delhi NCR &amp; Metros)
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { city: "noida", name: "Noida" },
                  { city: "ghaziabad", name: "Ghaziabad" },
                  { city: "delhi", name: "Delhi" },
                  { city: "gurgaon", name: "Gurgaon" },
                  { city: "indirapuram", name: "Indirapuram" },
                  { city: "mumbai", name: "Mumbai" },
                  { city: "bangalore", name: "Bangalore" },
                ].map((loc, idx) => (
                  <Link
                    key={idx}
                    href={`/digital-marketing-agency/${loc.city}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#1570ef] transition-colors border border-slate-200/80 font-medium"
                  >
                    Agency in {loc.name}
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
