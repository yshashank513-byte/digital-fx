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
                Search Architecture
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              ← All Insights
            </Link>
            <a
              href="https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20want%20to%20discuss%20an%20SEO%20strategy."
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition flex items-center gap-1.5 shadow-xs"
            >
              <span>WhatsApp Strategist</span>
            </a>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="border-b border-white/5 bg-slate-900/40 py-3">
        <div className="max-w-4xl mx-auto px-4 text-xs text-slate-400 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-white transition">Insights</Link>
          <span>/</span>
          <span className="text-blue-400 font-medium truncate max-w-[280px] sm:max-w-none">
            {post.title}
          </span>
        </div>
      </div>

      {/* Article Content Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Metadata Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4 text-xs">
            <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/25 font-bold uppercase tracking-wider text-[11px]">
              {post.category}
            </span>
            <span className="text-slate-400">{post.publishedAt}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{post.readingTime}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-6">
            {post.title}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
            {post.description}
          </p>

          {/* Author Card */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-sm">
                SY
              </div>
              <div>
                <p className="text-sm font-bold text-white">{post.author.name}</p>
                <p className="text-xs text-slate-400">{post.author.role} • {post.author.location}</p>
              </div>
            </div>

            <a
              href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition flex items-center gap-1.5 border border-white/10"
              title="Share via WhatsApp"
            >
              <span>Share</span>
              <span>↗</span>
            </a>
          </div>
        </header>

        {/* Key Takeaways Callout Box */}
        <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 mb-12">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>⚡ Practitioner Summary &amp; Key Takeaways</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200">
            {post.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span className="leading-relaxed">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Table of Contents */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Table of Contents
          </p>
          <div className="space-y-2 text-xs sm:text-sm">
            {post.tableOfContents.map((toc) => (
              <a
                key={toc.id}
                href={`#${toc.id}`}
                className="block text-slate-300 hover:text-blue-400 transition"
              >
                {toc.title}
              </a>
            ))}
          </div>
        </div>

        {/* Body Sections */}
        <div className="space-y-12 text-slate-300 leading-relaxed text-sm sm:text-base">
          {post.sections.map((sec) => (
            <section key={sec.id} id={sec.id} className="scroll-mt-24 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight border-b border-white/10 pb-2">
                {sec.heading}
              </h2>

              {sec.body.map((para, pIdx) => (
                <p key={pIdx} className="leading-relaxed text-slate-300">
                  {para}
                </p>
              ))}

              {/* Callout if present */}
              {sec.callout && (
                <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-800/40 my-4 text-xs sm:text-sm">
                  <div className="font-bold text-blue-300 mb-1">{sec.callout.title}</div>
                  <div className="text-blue-100/90 leading-relaxed">{sec.callout.text}</div>
                </div>
              )}

              {/* Table if present */}
              {sec.table && (
                <div className="overflow-x-auto my-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-white/5 border-b border-white/10 text-white font-bold">
                      <tr>
                        {sec.table.headers.map((h, hIdx) => (
                          <th key={hIdx} className="p-3.5 sm:p-4">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {sec.table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-white/[0.02] transition">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-3.5 sm:p-4 leading-normal">
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
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 my-4 space-y-2.5 text-xs sm:text-sm">
                  {sec.checklist.map((item, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-2.5 text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                        {cIdx + 1}
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Bottom CTA Block */}
        <div className="mt-16 pt-10 border-t border-white/10">
          <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-950/50 via-slate-900 to-slate-950 p-8 sm:p-10 text-center">
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
              Need a Custom Growth Strategy for Your Business?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto mb-6 leading-relaxed">
              Skip generic templates. Partner with Digital FX to execute verified Google Maps 3-Pack rankings and custom Next.js web development.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/#geo-checker"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
              >
                ⚡ Free AI Geo-Audit
              </Link>
              <a
                href="https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20read%20your%20blog%20post%20and%20want%20to%20consult."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition flex items-center gap-1.5"
              >
                <span>WhatsApp Strategist Desk</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
