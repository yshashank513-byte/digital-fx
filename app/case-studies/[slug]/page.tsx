import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CityEnquiryForm from "@/components/CityEnquiryForm";
import {
  CASE_STUDIES_CATALOG,
  getCaseStudyBySlug,
  getAllCaseStudies,
} from "@/lib/caseStudiesData";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.values(CASE_STUDIES_CATALOG).map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    return {
      title: "Case Study Not Found | Digital FX",
      description: "The requested client case study could not be found.",
    };
  }

  const canonicalUrl = `https://www.digitalfx.in/case-studies/${study.slug}`;

  return {
    title: `${study.client} Case Study | Verified Results | Digital FX`,
    description: study.summary,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${study.client} Case Study | Verified ROI | Digital FX`,
      description: study.summary,
      url: canonicalUrl,
      siteName: "Digital FX",
      type: "article",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${study.client} Case Study | Digital FX`,
      description: study.summary,
    },
  };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.heroHeadline,
    description: study.summary,
    author: {
      "@type": "Organization",
      name: "Digital FX",
      url: "https://www.digitalfx.in",
    },
    publisher: {
      "@type": "Organization",
      name: "Digital FX",
      logo: "https://www.digitalfx.in/logo.svg",
    },
    mainEntityOfPage: `https://www.digitalfx.in/case-studies/${study.slug}`,
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
        name: "Case Studies",
        item: "https://www.digitalfx.in/case-studies",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: study.client,
        item: `https://www.digitalfx.in/case-studies/${study.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-[#207de9] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Navbar currentPath="/case-studies" />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#080d24] via-[#0b1333] to-[#080d24] text-white pt-14 pb-20 sm:pt-20 sm:pb-28">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#207de9]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 relative z-10">
          
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <Link href="/case-studies" className="hover:text-white transition">Case Studies</Link>
            <span>/</span>
            <span className="text-[#207de9]">{study.client}</span>
          </nav>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>{study.badge}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-semibold">
                📍 {study.location}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-semibold">
                ⏱ {study.timeline}
              </span>
            </div>

            <div className="text-sm font-extrabold uppercase tracking-widest text-[#207de9] mb-2">
              {study.client} • {study.industry}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black tracking-[-0.03em] leading-[1.14] text-white">
              {study.heroHeadline}
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-3xl">
              {study.summary}
            </p>

            <div className="pt-8 flex flex-wrap items-center gap-4">
              <a
                href="#consultation"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1570ef] hover:bg-[#1258c4] text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5"
              >
                <span>Replicate These Results</span>
                <span>→</span>
              </a>

              <a
                href="https://wa.me/919319807273?text=Hi%20Digital%20FX%20team,%20I%20saw%20your%20case%20study%20and%20want%20to%20discuss%20a%20similar%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>WhatsApp Strategy Desk</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 2. VERIFIED METRICS STRIP */}
      <section className="bg-slate-50 border-b border-slate-200 py-10">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {study.metrics.map((metric, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#080d24]">
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

      {/* 3. NARRATIVE BODY: CHALLENGE, STRATEGY, EXECUTION */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-[1100px] w-full mx-auto px-4 sm:px-6 md:px-8 space-y-16">
          
          {/* A. CHALLENGE */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-wider">
              01 • The Business Challenge
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080d24] tracking-tight">
              The Roadblocks Facing {study.client}
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              {study.challenge.overview}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {study.challenge.bulletPoints.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
                  <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                  <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* B. STRATEGY */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold uppercase tracking-wider">
              02 • The Strategic Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080d24] tracking-tight">
              How Digital FX Designed The Growth Solution
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              {study.strategy.overview}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {study.strategy.bulletPoints.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <span className="text-[#1570ef] font-bold shrink-0 mt-0.5">✓</span>
                  <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* C. EXECUTION */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              03 • Execution &amp; Rollout
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080d24] tracking-tight">
              Hands-On Implementation &amp; Telemetry
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              {study.execution.overview}
            </p>
            <div className="space-y-3 pt-2">
              {study.execution.bulletPoints.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* D. TESTIMONIAL QUOTE (IF APPLICABLE) */}
          {study.testimonial && (
            <div className="bg-gradient-to-br from-[#080d24] to-[#121c45] text-white p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-xl space-y-4">
              <div className="text-amber-400 text-lg">★★★★★</div>
              <blockquote className="text-lg sm:text-xl font-medium leading-relaxed italic text-slate-200">
                &ldquo;{study.testimonial.quote}&rdquo;
              </blockquote>
              <div className="pt-3 border-t border-white/10">
                <div className="font-extrabold text-white text-base">{study.testimonial.author}</div>
                <div className="text-xs text-blue-300 font-semibold">{study.testimonial.role}</div>
              </div>
            </div>
          )}

          {/* E. CORE TAKEAWAY & SERVICES */}
          <div className="p-8 rounded-3xl bg-[#f8faff] border border-blue-200 space-y-4">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#1570ef]">
              Key Strategic Takeaway
            </div>
            <p className="text-base font-bold text-[#080d24]">
              {study.keyTakeaway}
            </p>
            <div className="pt-4 border-t border-blue-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 mr-2">Services Employed:</span>
              {study.servicesUsed.map((srv, idx) => (
                <Link
                  key={idx}
                  href={`/services/${srv.slug}`}
                  className="px-3 py-1 rounded-lg bg-white border border-blue-200 text-[#1570ef] text-xs font-bold hover:bg-[#1570ef] hover:text-white transition-colors"
                >
                  {srv.name}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 4. CONVERSION FORM SECTION */}
      <section id="consultation" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-7 sm:p-10 shadow-lg border border-slate-200/90">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1570ef] mb-3">
                <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse" />
                Scale Your Revenue
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080d24] tracking-tight">
                Want Similar Results for Your Business?
              </h2>
              <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
                Schedule a confidential 30-minute growth strategy session with our senior engineers in Ghaziabad or via video.
              </p>
            </div>
            <CityEnquiryForm cityName={study.industry} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
