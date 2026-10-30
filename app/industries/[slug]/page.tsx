import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CityEnquiryForm from "@/components/CityEnquiryForm";
import FaqAccordion from "@/components/FaqAccordion";
import {
  INDUSTRIES_CATALOG,
  getIndustryBySlug,
  getAllIndustries,
} from "@/lib/industriesData";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.values(INDUSTRIES_CATALOG).map((ind) => ({
    slug: ind.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);

  if (!industry) {
    return {
      title: "Industry Not Found | Digital FX",
      description: "The requested industry growth playbook could not be found.",
    };
  }

  const canonicalUrl = `https://www.digitalfx.in/industries/${industry.slug}`;

  return {
    title: industry.metaTitle,
    description: industry.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: industry.metaTitle,
      description: industry.metaDescription,
      url: canonicalUrl,
      siteName: "Digital FX",
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: industry.metaTitle,
      description: industry.metaDescription,
    },
  };
}

export default async function IndustryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);

  if (!industry) {
    notFound();
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: industry.title,
    serviceType: `${industry.shortTitle} Digital Marketing`,
    description: industry.metaDescription,
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
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: industry.faqs.map((faq) => ({
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
        name: "Industries",
        item: "https://www.digitalfx.in/industries",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: industry.shortTitle,
        item: `https://www.digitalfx.in/industries/${industry.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-[#207de9] selection:text-white">
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

      <Navbar currentPath={`/industries/${industry.slug}`} />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#080d24] via-[#0b1333] to-[#080d24] text-white pt-14 pb-20 sm:pt-20 sm:pb-28">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#207de9]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 relative z-10">
          
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <Link href="/industries" className="hover:text-white transition">Industries</Link>
            <span>/</span>
            <span className="text-[#207de9]">{industry.shortTitle}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>{industry.heroBadge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-black tracking-[-0.03em] leading-[1.12] text-white">
                {industry.h1}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
                {industry.heroTagline}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <a
                  href="#enquiry-form"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1570ef] hover:bg-[#1258c4] text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5"
                >
                  <span>Request Custom Strategy &amp; Pricing</span>
                  <span>→</span>
                </a>

                <a
                  href="https://wa.me/919319807273?text=Hi%20Digital%20FX%20team,%20I%20want%20to%20discuss%20our%20industry%20strategy."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>WhatsApp Strategy Desk</span>
                </a>
              </div>
            </div>

            {/* Right Card: Quick Consultation Form */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-slate-900">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#1570ef]">
                    Sector Strategy Session
                  </span>
                  <h3 className="text-lg font-black text-[#080d24]">
                    Book a Growth Roadmap
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                  FREE
                </span>
              </div>
              <CityEnquiryForm cityName={industry.shortTitle} compact={true} />
            </div>

          </div>

        </div>
      </section>

      {/* 2. VERIFIED RESULTS STRIP */}
      <section className="bg-slate-50 border-b border-slate-200 py-10">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {industry.results.map((res, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="text-3xl sm:text-4xl font-black text-[#080d24]">{res.metric}</div>
                <div className="text-xs sm:text-sm font-bold text-[#1570ef] mt-1">{res.label}</div>
                <div className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-snug">{res.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. INDUSTRY CHALLENGES */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="max-w-3xl mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-wider mb-3">
              Sector Bottlenecks
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#080d24] tracking-tight">
              Why Generic Marketing Fails in {industry.shortTitle}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              {industry.overview}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {industry.challenges.map((chal, idx) => (
              <div key={idx} className="bg-slate-50 p-7 rounded-3xl border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm mb-4">
                  0{idx + 1}
                </div>
                <h3 className="text-base font-bold text-[#080d24] mb-2">{chal.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{chal.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE 4-STEP INDUSTRY PLAYBOOK */}
      <section className="py-16 sm:py-20 bg-[#f8faff] border-t border-b border-slate-200">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold uppercase tracking-wider mb-3">
              Proven Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#080d24] tracking-tight">
              Our 4-Step {industry.shortTitle} Growth Playbook
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industry.playbook.map((step, idx) => (
              <div key={idx} className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="text-3xl font-black text-[#1570ef]/40 mb-3">{step.step}</div>
                  <h3 className="text-base font-bold text-[#080d24] mb-2">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. CORE RECOMMENDED SERVICES */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold uppercase tracking-wider mb-3">
              Integrated Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#080d24] tracking-tight">
              Recommended Solutions for {industry.shortTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {industry.coreServices.map((srv, idx) => (
              <div key={idx} className="p-7 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#080d24] mb-2">{srv.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">{srv.why}</p>
                </div>
                <Link
                  href={`/services/${srv.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1570ef] hover:underline"
                >
                  <span>Explore {srv.name}</span>
                  <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQS */}
      <section className="py-16 sm:py-20 bg-[#f8faff] border-t border-b border-slate-200">
        <div className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold uppercase tracking-wider mb-3">
              Sector Queries
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080d24] tracking-tight">
              Frequently Asked Questions About {industry.shortTitle} Marketing
            </h2>
          </div>
          <FaqAccordion faqs={industry.faqs} theme="light" />
        </div>
      </section>

      {/* 7. CONVERSION SECTION */}
      <section id="enquiry-form" className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="max-w-3xl mx-auto bg-slate-50 rounded-3xl p-7 sm:p-10 shadow-lg border border-slate-200/90">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1570ef] mb-3">
                <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse" />
                Dedicated Sector Lead
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080d24] tracking-tight">
                Request a Custom {industry.shortTitle} Growth Audit
              </h2>
            </div>
            <CityEnquiryForm cityName={industry.shortTitle} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
