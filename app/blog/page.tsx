import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blogData";

export const metadata: Metadata = {
  title: "Insights & Search Engineering Blog | Digital FX",
  description:
    "Battle-tested insights, real Indian market benchmarks, and architectural blueprints for Google Maps 3-Pack domination, Next.js web performance, Generative Engine Optimization (GEO), and high-ROI digital marketing.",
  alternates: {
    canonical: "https://www.digitalfx.in/blog",
  },
  openGraph: {
    title: "Digital FX Insights & Search Engineering Blog",
    description:
      "Practitioner-grade playbooks for Google Maps SEO, Next.js speed, and Generative AI search optimization from Delhi NCR's #1 digital agency.",
    url: "https://www.digitalfx.in/blog",
    siteName: "Digital FX",
    images: [{ url: "/logo.png", width: 1024, height: 1024, alt: "Digital FX Insights" }],
  },
};

export default function BlogIndexPage() {
  const featuredPost = BLOG_POSTS[0];
  const regularPosts = BLOG_POSTS.slice(1);

  return (
    <main className="min-h-screen bg-[#080d24] text-white">
      {/* Top Header */}
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
                Insights &amp; Blueprints
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-300 hover:text-white transition hidden sm:inline"
            >
              ← Home
            </Link>
            <Link
              href="/locations"
              className="text-xs font-semibold text-slate-300 hover:text-white transition hidden md:inline"
            >
              Pan-India Locations
            </Link>
            <a
              href="https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20read%20your%20blog%20and%20want%20to%20consult."
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition flex items-center gap-1.5 shadow-xs"
            >
              <span>WhatsApp Strategist</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 border-b border-white/10 bg-gradient-to-b from-[#0d163a] to-[#080d24]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <span>📚 Practitioner Knowledge Base</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
            Digital Growth &amp; Search Engineering{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
              Blueprints
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Zero fluff, zero generic regurgitation. Unfiltered, practitioner-tested playbooks on Google Maps 3-Pack domination, Next.js web speed, Generative AI Search (GEO), and paid advertising in India.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Post Hero Card */}
        {featuredPost && (
          <div className="mb-14">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] hover:border-blue-500/40 transition p-6 sm:p-10 relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold uppercase tracking-wider">
                  Featured Blueprint
                </span>
                <span className="text-xs text-slate-400">{featuredPost.publishedAt}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">{featuredPost.readingTime}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white group-hover:text-blue-400 transition mb-4 leading-tight">
                <Link href={`/blog/${featuredPost.slug}`}>
                  {featuredPost.title}
                </Link>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
                {featuredPost.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs font-bold text-blue-400">
                    SY
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{featuredPost.author.name}</p>
                    <p className="text-[11px] text-slate-400">{featuredPost.author.role}</p>
                  </div>
                </div>

                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md"
                >
                  <span>Read Full Blueprint</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Regular Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {regularPosts.map((post) => (
            <article
              key={post.slug}
              className="rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition p-6 sm:p-8 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-3 mb-3 text-xs text-slate-400">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                    {post.category}
                  </span>
                  <span>{post.publishedAt}</span>
                  <span>•</span>
                  <span>{post.readingTime}</span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition mb-3 leading-snug">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>

                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                  {post.description}
                </p>

                {/* Key Takeaway Snippet */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 mb-6 text-xs text-slate-300">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    Key Actionable Takeaway:
                  </span>
                  <p className="line-clamp-2">{post.keyTakeaways[0]}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs">
                <span className="text-slate-400">{post.author.name}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-blue-400 font-bold group-hover:translate-x-1 transition flex items-center gap-1"
                >
                  <span>Read Article</span>
                  <span>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA Card */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Want Us to Execute These Blueprints For Your Business?
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mb-6 max-w-xl mx-auto leading-relaxed">
            Run a complimentary AI Geo-Audit on your website or speak directly with our Senior Growth Strategist at Orbit Plaza, Crossings Republik, Ghaziabad.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/#geo-checker"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md"
            >
              ⚡ Free AI Geo-Audit
            </Link>
            <a
              href="https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20want%20to%20discuss%20a%20growth%20strategy."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition flex items-center gap-2"
            >
              <span>Chat on WhatsApp</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
