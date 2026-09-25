import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Careers at Digital FX | We Are Hiring Top Growth & Tech Talent",
  description:
    "Join Digital FX, India's leading enterprise performance marketing and search engineering agency. Explore open roles for SEO architects, full-stack Next.js engineers, and media buyers.",
  alternates: {
    canonical: "https://www.digitalfx.in/careers",
  },
  openGraph: {
    title: "Careers (We Are Hiring!) - Digital FX",
    description:
      "Join our award-winning search engineering and performance team at Orbit Plaza, Crossings Republik.",
    url: "https://www.digitalfx.in/careers",
    siteName: "Digital FX",
    images: [{ url: "/agency-team-illustration.png", width: 1200, height: 630 }],
  },
};

const OPEN_ROLES = [
  {
    id: "senior-seo-architect",
    title: "Senior Technical SEO Architect",
    department: "Organic Search & GEO",
    location: "Ghaziabad / Delhi NCR (Hybrid)",
    type: "Full-Time",
    experience: "3–6 Years",
    desc: "Lead enterprise search campaigns, Generative Engine Optimization (GEO), structured entity schema, and Google Maps 3-Pack domination for top Indian brands.",
    skills: ["Technical SEO", "Schema.org JSON-LD", "Ahrefs/Semrush", "Google Search Console", "Python/Automation"],
  },
  {
    id: "fullstack-nextjs-developer",
    title: "Full-Stack Next.js / React Engineer",
    department: "Engineering & Performance Web",
    location: "Ghaziabad / Delhi NCR (Hybrid)",
    type: "Full-Time",
    experience: "2–5 Years",
    desc: "Build ultra-fast, sub-second web applications, interactive audit tools, and high-converting landing pages with Next.js 15, Tailwind CSS, and TypeScript.",
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Core Web Vitals"],
  },
  {
    id: "paid-media-buyer",
    title: "Performance Paid Media Strategist (Google & Meta)",
    department: "Paid Acquisition & ROAS",
    location: "Ghaziabad / Delhi NCR (Hybrid)",
    type: "Full-Time",
    experience: "2–5 Years",
    desc: "Manage high-budget Google Search, Shopping, YouTube, and Meta Ads funnels with first-party CRM attribution and strict CPA reduction benchmarks.",
    skills: ["Google Ads", "Meta Ads Manager", "Google Analytics 4", "ROAS Optimization", "Conversion API"],
  },
  {
    id: "conversational-cro-specialist",
    title: "Conversion Rate Optimization (CRO) & Content Lead",
    department: "Growth Strategy",
    location: "Ghaziabad / Delhi NCR (Hybrid)",
    type: "Full-Time",
    experience: "2–4 Years",
    desc: "Design high-converting page layouts, A/B tests, conversational AI copy, and direct WhatsApp lead funnels that maximize revenue per visitor.",
    skills: ["A/B Testing", "Copywriting", "UI/UX Heuristics", "Google Tag Manager", "Funnel Analytics"],
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-[#207de9] selection:text-white">
      
      {/* Universal Navbar */}
      <Navbar currentPath="/careers" />

      {/* 3. HERO BANNER */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-[#f8faff] via-white to-white border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1570ef]">
                <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse" />
                Careers (We Are Hiring!)
              </span>
              <h1 className="text-[34px] sm:text-[48px] lg:text-[54px] font-extrabold text-[#080d24] tracking-[-0.035em] leading-[1.1]">
                Build The Future Of Search &amp;{" "}
                <span className="text-[#1570ef] block sm:inline font-normal italic font-serif">
                  Performance Marketing
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
                We’re a team of search engineers, performance media buyers, and full-stack builders who engineer real, attributable revenue for 120+ high-growth brands. Join us at our Crossings Republik headquarters or remote hybrid desk.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#openings"
                  className="px-6 py-3.5 rounded-xl bg-[#080d24] hover:bg-[#1570ef] text-white font-bold text-sm shadow-md transition"
                >
                  Explore 4 Open Positions →
                </a>
                <a
                  href="mailto:careers@digitalfx.in?subject=Direct%20Talent%20Application%20at%20Digital%20FX"
                  className="px-6 py-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-sm shadow-xs transition"
                >
                  Send Direct Resume
                </a>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 max-w-lg text-center sm:text-left">
                <div>
                  <div className="text-2xl font-black text-[#080d24]">100%</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">High-Impact Work</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#1570ef]">₹6 Lakh+</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Revenue Impacted</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-600">4.9 ★</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Team &amp; Client Score</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="rounded-3xl overflow-hidden bg-white p-3 shadow-xl border border-slate-200/90 group hover:scale-[1.02] transition-transform duration-300">
                <img
                  src="/agency-team-illustration.png"
                  alt="Digital FX Collaborative Agency Team"
                  className="w-full h-auto object-contain rounded-2xl"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. CULTURE & BENEFITS */}
      <section className="py-16 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1570ef]">Why Join Digital FX</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080d24] mt-2">
              Where Engineering Meets High-Velocity Revenue
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-[#1570ef] flex items-center justify-center text-lg font-bold">
                ⚡
              </div>
              <h3 className="text-lg font-bold text-slate-900">Modern Tech Stack</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                No clunky WordPress plugins. We build with Next.js 15, TypeScript, Tailwind, Google Cloud, and live AI Search crawlers.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center text-lg font-bold">
                📈
              </div>
              <h3 className="text-lg font-bold text-slate-900">Merit-Based Growth</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Quarterly performance bonuses, direct client attribution sharing, and rapid career progression based on real outcomes.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center text-lg font-bold">
                🤝
              </div>
              <h3 className="text-lg font-bold text-slate-900">Collaborative NCR Hub</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Modern headquarters in Orbit Plaza, Crossings Republik (NH-24 corridor) with hybrid flexibility and top-tier gear.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OPEN ROLES LISTING */}
      <section id="openings" className="py-20 bg-white border-b border-slate-200 scroll-mt-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1570ef]">Current Opportunities</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#080d24] mt-1">
                Explore Open Positions
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Showing 4 verified full-time openings
            </span>
          </div>

          <div className="space-y-4">
            {OPEN_ROLES.map((role) => (
              <div
                key={role.id}
                className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1570ef] border border-blue-200 text-[10.5px] font-bold uppercase">
                      {role.department}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-600">{role.location}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-600">{role.experience}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#080d24] group-hover:text-[#1570ef] transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                    {role.desc}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {role.skills.map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10.5px] font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  <a
                    href={`mailto:careers@digitalfx.in?subject=Application%20for%20${encodeURIComponent(role.title)}`}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1570ef] hover:bg-[#1362d2] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all"
                  >
                    <span>Apply For Role</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CLOSER CTA BANNER */}
      <section className="py-16 bg-gradient-to-br from-[#080d24] via-[#0c1638] to-[#080d24] text-white">
        <div className="max-w-[1000px] mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Don’t see your exact role listed?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto font-normal">
            We are always eager to meet exceptional SEO analysts, media buyers, and engineers. Send your GitHub, portfolio, or resume directly to our talent desk.
          </p>
          <div className="pt-2">
            <a
              href="mailto:careers@digitalfx.in?subject=General%20Talent%20Inquiry%20at%20Digital%20FX"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#1570ef] to-[#00f0ff] text-slate-950 font-extrabold text-sm shadow-lg hover:scale-105 transition-transform"
            >
              Send General Application →
            </a>
          </div>
        </div>
      </section>

      {/* UNIVERSAL BRANDED FOOTER */}
      <Footer />

    </div>
  );
}
