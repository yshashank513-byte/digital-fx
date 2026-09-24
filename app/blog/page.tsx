"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { BLOG_POSTS } from "@/lib/blogData";
import BlogPoster from "@/components/BlogPoster";

export default function BlogIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = BLOG_POSTS[0];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-[#207de9] selection:text-white">
      {/* Schema Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.digitalfx.in" },
              { "@type": "ListItem", position: 2, name: "Insights & Blueprints", item: "https://www.digitalfx.in/blog" },
            ],
          }),
        }}
      />

      {/* Universal Navbar */}
      <Navbar currentPath="/blog" />

      {/* 3. HERO & DAILY FEED BANNER */}
      <section className="bg-gradient-to-b from-[#080d24] via-[#0b1333] to-[#080d24] text-white py-14 sm:py-20 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              DAILY DIGITAL MARKETING STRATEGY FEED
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
              Search Engineering &amp;{" "}
              <span className="text-[#207de9] font-serif italic font-normal">Revenue Growth</span> Blueprints
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Practical, battle-tested strategies for Google Maps 3-Pack domination, Generative Engine Optimization (GEO for ChatGPT &amp; Perplexity), Next.js speed, CTV ads, and direct WhatsApp sales funnels.
            </p>

            {/* Search Input Bar */}
            <div className="mt-8 max-w-xl relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g. Google Maps, CTV Ads, Conversion Fix, GEO, Blinkit)..."
                className="w-full px-5 py-3.5 pl-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#207de9] transition shadow-lg"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
                >
                  Clear ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. CATEGORY TABS & FEATURED POST WITH POSTER */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-slate-200">
          {(["All", "Local SEO", "AI & GEO", "Paid Growth", "Programmatic & CTV", "E-Commerce & Q-Commerce", "Web Architecture", "Agency Strategy"] as const).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#207de9] text-white shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* Featured Today's Strategy Poster */}
        {selectedCategory === "All" && !searchQuery && featuredPost && (
          <div className="mb-14">
            <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>TODAY'S FEATURED STRATEGY BLUEPRINT</span>
            </div>
            <Link href={`/blog/${featuredPost.slug}`} className="block group">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-md hover:shadow-2xl transition duration-300">
                <div className="lg:col-span-7">
                  <BlogPoster
                    title={featuredPost.title}
                    category={featuredPost.category}
                    date={featuredPost.publishedAt}
                    readingTime={featuredPost.readingTime}
                  />
                </div>
                <div className="lg:col-span-5 p-2 sm:p-4 space-y-4">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-[#207de9]">
                    <span>Author: {featuredPost.author.name}</span>
                    <span>•</span>
                    <span>{featuredPost.author.location}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-[#207de9] transition leading-snug">
                    {featuredPost.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {featuredPost.description}
                  </p>

                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#080d24] text-white text-xs font-bold group-hover:bg-[#207de9] transition shadow-md">
                      <span>Read Full Practitioner Guide</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* 5. ALL BLOG POSTS GRID WITH DIGITAL FX POSTERS */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">
              {selectedCategory === "All" ? "Latest Digital Marketing Guides" : `${selectedCategory} Blueprints`}
            </h2>
            <span className="text-xs font-bold text-slate-500 bg-slate-200/70 px-2.5 py-1 rounded-full">
              Showing {filteredPosts.length} Articles
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-bold text-slate-900">No articles matching your search</h3>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your category filter or search keywords.</p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-2 bg-[#207de9] text-white font-bold text-xs rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Dynamic Branded Poster Header */}
                  <div className="p-3 bg-slate-900">
                    <BlogPoster
                      title={post.title}
                      category={post.category}
                      date={post.publishedAt}
                      readingTime={post.readingTime}
                      className="min-h-[200px] sm:min-h-[220px] p-4 text-xs"
                    />
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mb-2">
                        <span className="text-[#207de9]">{post.category}</span>
                        <span>•</span>
                        <span>{post.publishedAt}</span>
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#207de9] transition leading-snug line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3 font-normal">
                        {post.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#207de9]">
                      <span>Read Strategy Guide</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. INSTITUTIONAL FOOTER */}
      <footer className="bg-[#080d24] text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            <div>
              <div className="flex items-center">
                <img src="/logo-white.svg" alt="Digital FX" width={154} height={41} style={{ height: "36px", width: "auto" }} className="h-8 sm:h-9 w-auto object-contain shrink-0" />
              </div>
              <p className="mt-4 text-xs text-slate-400 leading-relaxed">
                Digital FX is a premier search engineering &amp; digital marketing agency headquartered at Orbit Plaza, Crossings Republik, Ghaziabad (Delhi NCR). Serving 350+ cities across India and international markets.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white mb-4">Core Divisions</h3>
              <ul className="space-y-2 text-xs font-medium text-slate-400">
                <li><Link href="/services" className="hover:text-white transition">CTV &amp; Programmatic Ads</Link></li>
                <li><Link href="/services" className="hover:text-white transition">Google Maps 3-Pack SEO</Link></li>
                <li><Link href="/services" className="hover:text-white transition">Generative AI Search (GEO)</Link></li>
                <li><Link href="/services" className="hover:text-white transition">Next.js Web Development</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white mb-4">Navigation</h3>
              <ul className="space-y-2 text-xs font-medium text-slate-400">
                <li><Link href="/" className="hover:text-white transition">Home</Link></li>
                <li><Link href="/services" className="hover:text-white transition">Services Hub</Link></li>
                <li><Link href="/locations" className="hover:text-white transition">350+ Cities</Link></li>
                <li><Link href="/blog" className="hover:text-white transition">Insights &amp; Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white mb-4">Headquarters</h3>
              <div className="text-xs text-slate-400 space-y-2 font-medium">
                <div>Shop No. 210, 2nd Floor, Orbit Plaza, Crossings Republik, Ghaziabad, UP 201016</div>
                <div>Phone: <a href="tel:+919319807273" className="text-blue-400 hover:underline">+91 93198 07273</a></div>
              </div>
            </div>
          </div>
          <div className="pt-8 text-center text-xs text-slate-500 font-medium">
            © {new Date().getFullYear()} Digital FX. All rights reserved. Registered Digital Marketing Agency.
          </div>
        </div>
      </footer>
    </main>
  );
}
