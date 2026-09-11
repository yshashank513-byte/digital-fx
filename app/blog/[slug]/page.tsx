import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getBlogPost } from "@/lib/blogData";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getBlogPost(resolvedParams.slug);

  if (!post) {
    return {
      title: "Article Not Found | Digital FX",
    };
  }

  return {
    title: `${post.title} | Digital FX Insights`,
    description: post.description,
    alternates: {
      canonical: `https://www.digitalfx.in/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      url: `https://www.digitalfx.in/blog/${post.slug}`,
      siteName: "Digital FX",
      images: [
        {
          url: "/logo.png",
          width: 1024,
          height: 1024,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["/logo.png"],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = getBlogPost(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `https://www.digitalfx.in/blog/${post.slug}#article`,
    headline: post.title,
    description: post.description,
    datePublished: "2026-03-01T00:00:00+05:30",
    dateModified: "2026-03-04T00:00:00+05:30",
    mainEntityOfPage: `https://www.digitalfx.in/blog/${post.slug}`,
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role,
      worksFor: {
        "@type": "Organization",
        name: "Digital FX",
        url: "https://www.digitalfx.in",
      },
    },
    publisher: {
      "@type": "Organization",
      name: "Digital FX",
      url: "https://www.digitalfx.in",
      logo: {
        "@type": "ImageObject",
        url: "https://www.digitalfx.in/logo.png",
      },
    },
    image: "https://www.digitalfx.in/logo.png",
  };

  const shareText = encodeURIComponent(`Check out this blueprint from Digital FX: ${post.title}`);
  const shareUrl = encodeURIComponent(`https://www.digitalfx.in/blog/${post.slug}`);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#207de9] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
              Digital FX Search Engineering Insights
            </span>
          </div>

          <div className="flex items-center gap-4 text-[12px] font-medium ml-auto sm:ml-0">
            <a href="tel:+918447583685" className="hover:text-white font-bold transition flex items-center gap-1.5">
              <span className="text-[#207de9]">☎</span> +91 84475 83685
            </a>
            <a
              href="https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20want%20to%20consult."
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
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-xs p-0.5 group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="Digital FX" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="text-[20px] sm:text-[22px] font-extrabold leading-none tracking-[-0.03em] text-[#080d24]">
                DIGITAL <span className="text-[#207de9]">FX</span>
              </div>
              <div className="mt-1 text-[8px] sm:text-[8.5px] font-bold uppercase tracking-[1.6px] text-slate-500">
                Search Architecture
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/blog"
              className="text-xs font-bold text-slate-600 hover:text-[#207de9] transition"
            >
              ← All Insights
            </Link>
            <a
              href="https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20want%20to%20discuss%20an%20SEO%20strategy."
              target="_blank"
              rel="noopener noreferrer"
              className="h-[40px] px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
            >
              <span>WhatsApp Strategist</span>
            </a>
          </div>
        </div>
      </header>

      {/* 3. BREADCRUMBS */}
      <div className="bg-slate-50 border-b border-slate-200/80 py-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-xs text-slate-500 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#207de9] transition font-medium">Home</Link>
          <span className="text-slate-400">/</span>
          <Link href="/blog" className="hover:text-[#207de9] transition font-medium">Insights</Link>
          <span className="text-slate-400">/</span>
          <span className="text-[#207de9] font-semibold truncate max-w-[280px] sm:max-w-none">
            {post.title}
          </span>
        </div>
      </div>

      {/* 4. ARTICLE CONTAINER */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Metadata Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4 text-xs">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-[#207de9] border border-blue-200 font-bold uppercase tracking-wider text-[11px]">
              {post.category}
            </span>
            <span className="text-slate-500 font-medium">{post.publishedAt}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">{post.readingTime}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#080d24] leading-tight tracking-tight mb-6">
            {post.title}
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 font-normal">
            {post.description}
          </p>

          {/* Author Card */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-extrabold text-white text-sm shadow-xs">
                SY
              </div>
              <div>
                <p className="text-sm font-bold text-[#080d24]">{post.author.name}</p>
                <p className="text-xs text-slate-500">{post.author.role} • {post.author.location}</p>
              </div>
            </div>

            <a
              href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 transition flex items-center gap-1.5 border border-slate-200 shadow-2xs"
              title="Share via WhatsApp"
            >
              <span>Share</span>
              <span>↗</span>
            </a>
          </div>
        </header>

        {/* Key Takeaways Box (Light Emerald) */}
        <div className="p-6 sm:p-7 rounded-2xl bg-emerald-50/70 border border-emerald-200 mb-12 shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <span>⚡ Practitioner Summary &amp; Key Action Items</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800">
            {post.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span className="leading-relaxed font-medium">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Table of Contents */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Table of Contents
          </p>
          <div className="space-y-2 text-xs sm:text-sm">
            {post.tableOfContents.map((toc) => (
              <a
                key={toc.id}
                href={`#${toc.id}`}
                className="block text-slate-700 hover:text-[#207de9] font-medium transition"
              >
                {toc.title}
              </a>
            ))}
          </div>
        </div>

        {/* Body Sections */}
        <div className="space-y-12 text-slate-700 leading-relaxed text-sm sm:text-base">
          {post.sections.map((sec) => (
            <section key={sec.id} id={sec.id} className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#080d24] tracking-tight border-b border-slate-200 pb-2">
                {sec.heading}
              </h2>

              {sec.body.map((para, pIdx) => (
                <p key={pIdx} className="leading-relaxed text-slate-700">
                  {para}
                </p>
              ))}

              {/* Callout if present */}
              {sec.callout && (
                <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 my-4 text-xs sm:text-sm">
                  <div className="font-bold text-[#080d24] mb-1">{sec.callout.title}</div>
                  <div className="text-slate-700 leading-relaxed">{sec.callout.text}</div>
                </div>
              )}

              {/* Table if present */}
              {sec.table && (
                <div className="overflow-x-auto my-6 rounded-2xl border border-slate-200 bg-white shadow-2xs">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[#080d24] font-bold">
                      <tr>
                        {sec.table.headers.map((h, hIdx) => (
                          <th key={hIdx} className="p-3.5 sm:p-4">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {sec.table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/50 transition">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-3.5 sm:p-4 leading-normal font-medium">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Checklist if present */}
              {sec.checklist && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 my-4 space-y-2.5 text-xs sm:text-sm">
                  {sec.checklist.map((item, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-2.5 text-slate-800">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-[#207de9] flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                        {cIdx + 1}
                      </span>
                      <span className="leading-relaxed font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Bottom CTA Block */}
        <div className="mt-16 pt-10 border-t border-slate-200">
          <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50/70 via-white to-slate-50 p-8 sm:p-10 text-center shadow-xs">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#080d24] mb-3 tracking-tight">
              Need a Custom Growth Strategy for Your Business?
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto mb-6 leading-relaxed">
              Skip generic templates. Partner with Digital FX to execute verified Google Maps 3-Pack rankings and custom Next.js web development.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/#geo-checker"
                className="px-5 py-2.5 rounded-xl bg-[#207de9] hover:bg-[#1a6bc7] text-white font-bold text-xs transition shadow-xs"
              >
                ⚡ Free AI Geo-Audit
              </Link>
              <a
                href="https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20read%20your%20blog%20post%20and%20want%20to%20consult."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
              >
                <span>WhatsApp Strategist (+91 84475 83685)</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
