import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Terms of Service & Commercial Agreement",
  description:
    "Official Terms of Service and Commercial Engagement Agreement of Digital FX. Commercial terms, scope of services, intellectual property, and payment conditions.",
  alternates: {
    canonical: "https://www.digitalfx.in/terms-and-conditions",
  },
};

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#207de9] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
                name: "Terms & Conditions",
                item: "https://www.digitalfx.in/terms-and-conditions",
              },
            ],
          }),
        }}
      />
      {/* Universal Navbar */}
      <Navbar currentPath="/terms-and-conditions" />

      {/* 3. BREADCRUMBS */}
      <div className="bg-slate-50 border-b border-slate-200/80 py-3">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#207de9] transition font-medium">Home</Link>
          <span className="text-slate-400">/</span>
          <span className="text-[#207de9] font-bold">Terms &amp; Conditions</span>
        </div>
      </div>

      {/* 4. HERO HEADER */}
      <section className="py-14 sm:py-16 border-b border-slate-200 bg-gradient-to-b from-slate-50/70 to-white">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold tracking-wider uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-[#1570ef]" />
            <span>Commercial Terms of Service &amp; Engagement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#080d24] tracking-tight mb-3">
            Terms &amp; Conditions of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Effective Date: March 1, 2026 • Last Reviewed: September 12, 2026 • Version 2.4
          </p>
        </div>
      </section>

      {/* 5. LEGAL CONTENT BODY */}
      <section className="py-12 sm:py-16 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-10 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#080d24] tracking-tight">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or utilizing the website, products, or marketing services of <strong>Digital FX</strong> (&ldquo;Agency&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), headquartered at <strong>Shop No. 210, Second Floor, Orbit Plaza, Crossings Republik, Ghaziabad, Uttar Pradesh 201016</strong>, or by initiating payment via our authorized PayU payment terminal, you (&ldquo;Client&rdquo;, &ldquo;Merchant&rdquo;, or &ldquo;User&rdquo;) agree to be legally bound by these Terms &amp; Conditions.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#080d24] tracking-tight">
              2. Scope of Services
            </h2>
            <p>Digital FX provides specialized digital agency solutions encompassing:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li><strong>Local &amp; National Search Engine Optimization (SEO):</strong> Google Business Profile verification, Google Maps Top 3 ranking strategy, on-page optimization, Schema.org structured data, and high-DA citation syndication.</li>
              <li><strong>Performance Advertising (PPC):</strong> High-intent Google Search Ads, Performance Max campaigns, Meta/Instagram Ads, and audience retargeting funnels.</li>
              <li><strong>High-Velocity Web Architecture:</strong> Custom Next.js 16 web development, mobile Core Web Vitals optimization (&lt;0.8s load), and lead-routing integration.</li>
              <li><strong>Generative Engine Optimization (GEO):</strong> Optimizing commercial brand presence and entity citations across AI search engines (ChatGPT, Perplexity, Gemini, and Google AI Overviews).</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#080d24] tracking-tight">
              3. Commercial Billing &amp; Payment Terms
            </h2>
            <p>
              All service retainers, setup fees, and customized milestone packages are denominated in <strong>Indian Rupees (INR / ₹)</strong>. Transactions are processed securely via our RBI-authorized payment aggregator (PayU India). Upon successful settlement, an official electronic GST tax invoice is transmitted to the Client&apos;s registered billing email.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>Ad spend budgets (payable to Google Ads or Meta Ads directly) are separate from Digital FX strategic agency retainers unless explicitly bundled in an enterprise master services agreement.</li>
              <li>Monthly retainers are billed on an agreed cycle with zero mandatory annual lock-in; clients may modify or terminate retainers upon 30 days written notice.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#080d24] tracking-tight">
              4. Client Obligations &amp; Approvals
            </h2>
            <p>
              To ensure timely campaign execution, the Client agrees to provide necessary brand assets, target coordinates, domain DNS access, Google Business Profile management access, and timely feedback on creative drafts within 5 business days of request.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#080d24] tracking-tight">
              5. Intellectual Property Rights
            </h2>
            <p>
              Upon full settlement of contracted milestone fees, the Client retains exclusive ownership of final custom website source code, visual creative assets, and client customer lead databases developed under the engagement. Digital FX retains ownership of proprietary agency analytical algorithms, audit frameworks, and internal performance benchmarking tools.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#080d24] tracking-tight">
              6. Third-Party Search Engines &amp; Non-Disparagement
            </h2>
            <p>
              Search engines (Google, Bing) and AI platforms (OpenAI, Perplexity) operate independent algorithms. While Digital FX applies verified white-hat methodologies to achieve Top 3 Google Maps rankings and organic authority, search engines maintain sovereign control over auction pricing, core algorithmic updates, and localized index volatility. We guarantee rigorous execution of agreed deliverable milestones rather than speculative third-party promises.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#080d24] tracking-tight">
              7. Governing Law &amp; Dispute Resolution
            </h2>
            <p>
              These Terms and any commercial agreements shall be governed by and construed in accordance with the <strong>laws of the Republic of India</strong>. In the event of any legal dispute, the competent courts at <strong>Ghaziabad, Uttar Pradesh, India</strong> shall possess exclusive territorial jurisdiction.
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <h2 className="text-base sm:text-lg font-extrabold text-[#080d24] tracking-tight">
              8. Contact &amp; Legal Notices
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              For contractual inquiries, legal notices, or commercial terms clarification, reach out to our legal administration:
            </p>
            <div className="mt-3 space-y-1 text-xs text-slate-800 font-medium">
              <div><strong>Entity:</strong> Digital FX (Digital Marketing Agency)</div>
              <div><strong>Registered Office:</strong> Shop No. 210, Second Floor, Orbit Plaza, Crossings Republik, Ghaziabad, UP 201016, India</div>
              <div><strong>Email:</strong> <a href="mailto:hello@digitalfx.in" className="text-[#207de9] underline">hello@digitalfx.in</a> / <a href="mailto:billing@digitalfx.in" className="text-[#207de9] underline">billing@digitalfx.in</a></div>
              <div><strong>Helpline:</strong> +91 93198 07273</div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. BOTTOM FOOTER BAR */}
      <footer className="py-12 border-t border-slate-200 bg-slate-50">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500 font-medium mb-4">
            <Link href="/privacy-policy" className="hover:text-[#207de9] transition">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="text-[#207de9] font-bold">Terms &amp; Conditions</Link>
            <Link href="/refund-policy" className="hover:text-[#207de9] transition">Refund Policy</Link>
            <Link href="/locations" className="hover:text-[#207de9] transition">350+ Cities Directory</Link>
            <Link href="/blog" className="hover:text-[#207de9] transition">Insights &amp; Blog</Link>
          </div>
          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} Digital FX®. Registered Headquarters: Shop No. 210, Orbit Plaza, Crossings Republik, Ghaziabad, UP 201016 India. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
