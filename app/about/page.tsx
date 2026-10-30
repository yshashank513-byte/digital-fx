import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CityEnquiryForm from "@/components/CityEnquiryForm";

export const metadata: Metadata = {
  title: "About Digital FX | Performance Marketing & Search Engineering Agency",
  description:
    "Learn about Digital FX, founded by Shashank Yadav at Orbit Plaza, Crossings Republik, Ghaziabad. Certified Google Premier Partner and search engineering agency.",
  alternates: {
    canonical: "https://www.digitalfx.in/about",
  },
  openGraph: {
    title: "About Digital FX | Performance Marketing & Search Engineering Agency",
    description:
      "Learn about Digital FX, founded by Shashank Yadav at Orbit Plaza, Crossings Republik, Ghaziabad. Certified Google Premier Partner and search engineering agency.",
    url: "https://www.digitalfx.in/about",
    siteName: "Digital FX",
    locale: "en_IN",
    type: "website",
  },
};

export default function AboutPage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    mainEntity: {
      "@type": "Organization",
      name: "Digital FX",
      url: "https://www.digitalfx.in",
      logo: "https://www.digitalfx.in/logo.svg",
      founder: {
        "@type": "Person",
        name: "Shashank Yadav",
        jobTitle: "Founder & Principal Growth Architect",
      },
      foundingLocation: {
        "@type": "Place",
        name: "Ghaziabad, Uttar Pradesh, India",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Shop No. 210, 2nd Floor, Orbit Plaza, Crossings Republik",
        addressLocality: "Ghaziabad",
        addressRegion: "Uttar Pradesh",
        postalCode: "201016",
        addressCountry: "IN",
      },
      telephone: "+919319807273",
      email: "contact@digitalfx.in",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "128",
        bestRating: "5",
        worstRating: "1",
      },
    },
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-[#207de9] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <Navbar currentPath="/about" />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#080d24] via-[#0b1333] to-[#080d24] text-white pt-14 pb-20 sm:pt-20 sm:pb-28">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#207de9]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 relative z-10">
          
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>About Digital FX • Est. Ghaziabad &amp; Delhi NCR</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-[-0.03em] leading-[1.12] text-white">
              We Bridge The Gap Between Search Visibility &amp; Bottom-Line Revenue.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
              Digital FX is an institutional performance marketing and search engineering firm headquartered in Orbit Plaza, Crossings Republik, Ghaziabad. We combine sub-second software engineering, entity SEO, and high-ROAS paid acquisition to scale ambitious businesses across India and global markets.
            </p>

            <div className="pt-8 flex flex-wrap items-center gap-4">
              <a
                href="#consultation"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1570ef] hover:bg-[#1258c4] text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5"
              >
                <span>Schedule an Office Consultation</span>
                <span>→</span>
              </a>

              <a
                href="https://wa.me/919319807273?text=Hi%20Shashank,%20I%20want%20to%20discuss%20a%20growth%20strategy."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>WhatsApp Founder Desk</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 2. VERIFIED MILESTONES & NUMBERS */}
      <section className="bg-slate-50 border-b border-slate-200 py-10">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-3xl sm:text-4xl font-black text-[#080d24]">₹6Cr+</div>
              <div className="text-xs sm:text-sm font-bold text-[#1570ef] mt-1">Verified Client Pipeline</div>
              <div className="text-[11px] text-slate-500 mt-1">Directly tracked in CRM systems</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-3xl sm:text-4xl font-black text-[#080d24]">4.9★</div>
              <div className="text-xs sm:text-sm font-bold text-[#1570ef] mt-1">Client Satisfaction</div>
              <div className="text-[11px] text-slate-500 mt-1">128+ verified Google reviews</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-3xl sm:text-4xl font-black text-[#080d24]">850+</div>
              <div className="text-xs sm:text-sm font-bold text-[#1570ef] mt-1">Page One Keywords</div>
              <div className="text-[11px] text-slate-500 mt-1">Ranking in top 3 Google search spots</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-3xl sm:text-4xl font-black text-[#080d24]">100%</div>
              <div className="text-xs sm:text-sm font-bold text-[#1570ef] mt-1">In-House Engineering</div>
              <div className="text-[11px] text-slate-500 mt-1">Zero outsourced black-box contractors</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR STORY & FOUNDER SPOTLIGHT */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Story */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold uppercase tracking-wider">
                The Digital FX Story
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#080d24] tracking-tight leading-tight">
                Built to Eliminate Marketing Vanity Metrics
              </h2>
              <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                <p>
                  Most traditional digital agencies operate on vanity metrics: they celebrate millions of impressions, clicks from non-buyers, and arbitrary aesthetic updates while client bank balances remain unchanged.
                </p>
                <p>
                  Digital FX was founded with a singular conviction: <strong>marketing should be an engineering discipline with verifiable financial attribution.</strong>
                </p>
                <p>
                  From our headquarters in Orbit Plaza, Crossings Republik, we began by helping local clinics, industrial manufacturers in Sahibabad, and real estate developers along the Noida Expressway dominate their local Google search results. Today, our custom Next.js web applications, Google Premier Partner PPC campaigns, and proprietary ReviewFlow AI NFC systems power businesses across 20+ major metropolitan hubs in India.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-4 border-t border-slate-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#080d24] to-[#1570ef] flex items-center justify-center text-white font-bold text-lg">
                  SY
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-base">Shashank Yadav</div>
                  <div className="text-xs text-[#1570ef] font-semibold">Founder &amp; Principal Growth Strategist</div>
                </div>
              </div>
            </div>

            {/* Credibility & Certifications Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-[#080d24] text-white p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-xl space-y-6">
              <div className="text-xs uppercase font-extrabold text-blue-400 tracking-wider">
                Our Institutional Standards
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Engineered for High-Stakes Performance
              </h3>
              
              <ul className="space-y-4 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold shrink-0 mt-0.5">✓</span>
                  <span><strong>Google Premier Partner Certified:</strong> Direct access to advanced Google Ads bidding telemetry and priority beta ad formats.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold shrink-0 mt-0.5">✓</span>
                  <span><strong>Meta Certified Agency:</strong> Mastery in Server-Side Conversions API (CAPI) and high-scale Reels direct-response creative frameworks.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold shrink-0 mt-0.5">✓</span>
                  <span><strong>Sub-Second Next.js Engineering:</strong> 100% Core Web Vitals compliance eliminating mobile drop-offs.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold shrink-0 mt-0.5">✓</span>
                  <span><strong>Proprietary ReviewFlow AI:</strong> Hardware NFC tap technology that automates Google 5-star customer reputation collection.</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>Headquarters: Ghaziabad, UP</span>
                <span className="text-emerald-400 font-semibold">● Active Operations</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. OUR CORE PRINCIPLES */}
      <section className="py-16 sm:py-20 bg-[#f8faff] border-t border-b border-slate-200">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold uppercase tracking-wider mb-3">
              Guiding Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#080d24] tracking-tight">
              The 4 Pillars of Digital FX Engineering
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="text-2xl font-black text-[#1570ef] mb-3">01</div>
              <h3 className="text-base font-bold text-[#080d24] mb-2">Zero Vanity Metrics</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We never report impressions or raw views as success. Every campaign is tied to cost-per-lead, pipeline appointments, and closed sales.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="text-2xl font-black text-[#1570ef] mb-3">02</div>
              <h3 className="text-base font-bold text-[#080d24] mb-2">Sub-Second Speed</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Slow websites leak revenue. We build modern React &amp; Next.js 16 architectures that load in under 1 second on mobile networks.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="text-2xl font-black text-[#1570ef] mb-3">03</div>
              <h3 className="text-base font-bold text-[#080d24] mb-2">AI Search Native (GEO)</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We optimize your brand for ChatGPT Search, Google Gemini Overviews, and Perplexity so your business is cited by AI engines.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="text-2xl font-black text-[#1570ef] mb-3">04</div>
              <h3 className="text-base font-bold text-[#080d24] mb-2">Radical Transparency</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You retain 100% ownership of your ad accounts, codebase, and customer data. Real-time dashboards provide continuous accountability.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. PHYSICAL OFFICE LOCATION & VISITS */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold uppercase tracking-wider">
                  Our Headquarters
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#080d24]">
                  Visit Us at Orbit Plaza, Crossings Republik
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  We welcome business founders, marketing heads, and entrepreneurs to visit our physical strategy desk in Crossings Republik, Ghaziabad. Discuss your growth hurdles over a cup of coffee and receive a live competitor search teardown.
                </p>
                <div className="pt-2 text-xs sm:text-sm text-slate-700 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#1570ef] font-bold">📍 Address:</span>
                    <span>Shop No. 210, 2nd Floor, Orbit Plaza, Crossings Republik, Ghaziabad, UP 201016</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#1570ef] font-bold">⏰ Visiting Hours:</span>
                    <span>Monday to Saturday: 10:00 AM – 7:30 PM (By Prior Appointment)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#1570ef] font-bold">☎ Contact Desk:</span>
                    <a href="tel:+919319807273" className="font-bold text-[#1570ef] hover:underline">
                      +91 93198 07273
                    </a>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
                <div className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
                  Need Immediate Navigation?
                </div>
                <div className="text-lg font-bold text-[#080d24]">
                  Get Instant Google Maps Directions
                </div>
                <p className="text-xs text-slate-500">
                  Easily accessible from NH-24 / Delhi-Meerut Expressway, Noida Sector 62, and Greater Noida West.
                </p>
                <a
                  href="https://maps.google.com/?q=Orbit+Plaza+Crossings+Republik+Ghaziabad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-slate-900 hover:bg-[#1570ef] text-white text-xs font-bold transition-all"
                >
                  <span>Open in Google Maps</span>
                  <span>↗</span>
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 6. CONSULTATION SECTION */}
      <section id="consultation" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-7 sm:p-10 shadow-lg border border-slate-200/90">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1570ef] mb-3">
                <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse" />
                Let&apos;s Build Together
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080d24] tracking-tight">
                Schedule a Direct Growth Strategy Session
              </h2>
              <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
                Discuss your customer acquisition cost, search rankings, or web performance directly with our senior team.
              </p>
            </div>
            <CityEnquiryForm cityName="Digital FX Headquarters" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
