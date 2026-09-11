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
    <main className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#207de9] selection:text-white">
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
              Digital FX Search Engineering &amp; Growth Insights
            </span>
          </div>

          <div className="flex items-center gap-4 text-[12px] font-medium ml-auto sm:ml-0">
            <a href="tel:+918447583685" className="hover:text-white font-bold transition flex items-center gap-1.5">
              <span className="text-[#207de9]">☎</span> +91 84475 83685
            </a>
            <a
              href="https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20read%20your%20blog%20and%20want%20to%20consult."
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
                Insights &amp; Blueprints
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
              className="text-[14px] font-semibold text-slate-700 hover:text-[#207de9] transition inline-flex items-center gap-1.5"
            >
              <span>350+ Cities</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[9.5px] font-extrabold uppercase">
                IN
              </span>
            </Link>
            <Link
              href="/blog"
              className="text-[14px] font-semibold text-[#207de9] transition"
            >
              Insights &amp; Blog
            </Link>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold text-slate-600 hover:text-[#207de9] transition hidden sm:inline"
            >
              ← Back to Home
            </Link>
            <a
              href="https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20read%20your%20blog%20and%20want%20to%20consult."
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

      {/* 3. HERO SECTION (CLEAN WHITE) */}
      <section className="py-16 sm:py-20 border-b border-slate-200 bg-gradient-to-b from-slate-50/80 via-white to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse" />
            <span>Practitioner Knowledge Base</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#080d24] mb-4 leading-tight">
            Digital Growth &amp; Search Engineering{" "}
            <span className="text-[#207de9]">Blueprints</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Zero fluff, zero generic regurgitation. Unfiltered, practitioner-tested playbooks on Google Maps 3-Pack domination, Next.js web speed, Generative AI Search (GEO), and paid advertising in India.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Featured Post Card (White with Blue Accent) */}
        {featuredPost && (
          <div className="mb-14">
            <div className="rounded-3xl border-2 border-blue-200 bg-white hover:border-[#207de9] hover:shadow-lg transition p-6 sm:p-10 relative overflow-hidden group shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#207de9] border border-blue-200 text-[11px] font-bold uppercase tracking-wider">
                  Featured Blueprint
                </span>
                <span className="text-xs text-slate-500 font-medium">{featuredPost.publishedAt}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">{featuredPost.readingTime}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#080d24] group-hover:text-[#207de9] transition mb-4 leading-tight">
                <Link href={`/blog/${featuredPost.slug}`}>
                  {featuredPost.title}
                </Link>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
                {featuredPost.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-bold text-[#207de9]">
                    SY
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#080d24]">{featuredPost.author.name}</p>
                    <p className="text-[11px] text-slate-500">{featuredPost.author.role}</p>
                  </div>
                </div>

                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#207de9] hover:bg-[#1a6bc7] text-white text-xs font-bold transition shadow-xs"
                >
                  <span>Read Full Blueprint</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Regular Articles Grid (White Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {regularPosts.map((post) => (
            <article
              key={post.slug}
              className="rounded-2xl border border-slate-200 bg-white hover:border-[#207de9] hover:shadow-md transition p-6 sm:p-8 flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                    {post.category}
                  </span>
                  <span>{post.publishedAt}</span>
                  <span>•</span>
                  <span>{post.readingTime}</span>
                </div>

                <h3 className="text-xl font-bold text-[#080d24] group-hover:text-[#207de9] transition mb-3 leading-snug">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                  {post.description}
                </p>

                {/* Key Takeaway Snippet */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6 text-xs text-slate-700">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                    Key Actionable Takeaway:
                  </span>
                  <p className="line-clamp-2">{post.keyTakeaways[0]}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">{post.author.name}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-[#207de9] font-bold group-hover:translate-x-1 transition flex items-center gap-1"
                >
                  <span>Read Article</span>
                  <span>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA Card (Clean Light Style) */}
        <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50/70 via-white to-slate-50 p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-xs">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#080d24] mb-3 tracking-tight">
            Want Us to Execute These Blueprints For Your Business?
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm mb-6 max-w-xl mx-auto leading-relaxed">
            Run a complimentary AI Geo-Audit on your website or speak directly with our Senior Growth Strategist at Orbit Plaza, Crossings Republik, Ghaziabad.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/#geo-checker"
              className="px-5 py-2.5 rounded-xl bg-[#207de9] hover:bg-[#1a6bc7] text-white font-bold text-xs transition shadow-xs"
            >
              ⚡ Free AI Geo-Audit
            </Link>
            <a
              href="https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20want%20to%20discuss%20a%20growth%20strategy."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-2 shadow-xs"
            >
              <span>Chat on WhatsApp (+91 84475 83685)</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
