import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy",
  description:
    "Official Cancellation and Refund Policy of Digital FX. Transparent refund timelines, deliverable milestone guidelines, and RBI/PayU compliance standards.",
  alternates: {
    canonical: "https://www.digitalfx.in/refund-policy",
  },
};

export default function RefundPolicyPage() {
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
                name: "Refund Policy",
                item: "https://www.digitalfx.in/refund-policy",
              },
            ],
          }),
        }}
      />
      {/* Universal Navbar */}
      <Navbar currentPath="/refund-policy" />

      {/* 3. BREADCRUMBS */}
      <div className="bg-slate-50 border-b border-slate-200/80 py-3">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#207de9] transition font-medium">Home</Link>
          <span className="text-slate-400">/</span>
          <span className="text-[#207de9] font-bold">Refund Policy</span>
        </div>
      </div>

      {/* 4. HERO HEADER */}
      <section className="py-14 sm:py-16 border-b border-slate-200 bg-gradient-to-b from-slate-50/70 to-white">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold tracking-wider uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-[#1570ef]" />
            <span>RBI &amp; PayU Merchant Settlement Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#080d24] tracking-tight mb-3">
            Cancellation &amp; Refund Policy
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
              1. Policy Overview
            </h2>
            <p>
              At <strong>Digital FX</strong>, we strive to provide exceptional value in local SEO, Google Maps 3-Pack domination, Next.js web engineering, and performance marketing. This Cancellation &amp; Refund Policy outlines the terms under which refunds, project cancellations, and billing adjustments are processed, ensuring full transparency in alignment with <strong>Reserve Bank of India (RBI)</strong> consumer guidelines and our payment aggregator (PayU India) standards.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#080d24] tracking-tight">
              2. Website Development Services (One-Time Projects)
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li><strong>Prior to Work Commencement:</strong> If a client requests cancellation within <strong>48 hours</strong> of invoice settlement and before technical discovery, wireframing, or domain setup has begun, a <strong>100% full refund</strong> will be issued (minus standard payment gateway transaction surcharges of ~2%).</li>
              <li><strong>Post Work Commencement:</strong> Once technical design, custom Next.js coding, or copywriting has commenced, refunds are calculated pro-rata based on verified deliverable milestones completed.</li>
              <li><strong>Final Delivery &amp; Deployment:</strong> Once final website files, DNS live deployment, or administrative control has been transferred to the client, the project fee is deemed fully earned and non-refundable.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#080d24] tracking-tight">
              3. Monthly SEO &amp; Growth Retainers
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li><strong>Zero Long-Term Lock-In:</strong> Clients may cancel recurring monthly SEO or paid marketing retainers at any point by sending an email to <a href="mailto:billing@digitalfx.in" className="text-[#207de9] font-medium underline">billing@digitalfx.in</a> with at least <strong>15 days notice</strong> prior to the next scheduled billing cycle.</li>
              <li>Once a monthly retainer cycle begins, fees for that active 30-day period cover dedicated strategist hours, citation submissions, and ad optimizations already rendered, and are non-refundable.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#080d24] tracking-tight">
              4. Custom Invoice &amp; Ad Budget Deposits
            </h2>
            <p>
              Payments processed via our Custom Invoice terminal for agreed advertising pass-through budgets (Google Ads / Meta Ads) are strictly non-refundable once disbursed to third-party ad networks, as those funds are credited directly to the client&apos;s ad inventory accounts.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#080d24] tracking-tight">
              5. Refund Timeline &amp; Method of Reversal
            </h2>
            <p>
              Approved refunds are initiated within <strong>2 business days</strong> of written confirmation. Per RBI inter-bank clearing guidelines and PayU settlement rules:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li><strong>UPI Payments:</strong> Funds reflect in the source bank account within 24 to 48 hours.</li>
              <li><strong>Net Banking &amp; Debit Cards:</strong> Funds reflect within 3 to 5 business days.</li>
              <li><strong>Credit Cards:</strong> Funds reflect in the credit statement within 5 to 7 business days, depending on the issuing bank&apos;s billing cycle.</li>
            </ul>
          </div>

          <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <h2 className="text-base sm:text-lg font-extrabold text-[#080d24] tracking-tight">
              6. Billing Disputes &amp; Chargeback Assistance
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              If you observe an unexpected charge or have an inquiry regarding a PayU transaction receipt, please contact our billing helpdesk directly before initiating a bank dispute:
            </p>
            <div className="mt-3 space-y-1 text-xs text-slate-800 font-medium">
              <div><strong>Billing Desk:</strong> Digital FX Finance &amp; Accounts</div>
              <div><strong>Direct Support Line:</strong> +91 93198 07273 (9:30 AM – 7:00 PM IST)</div>
              <div><strong>Email:</strong> <a href="mailto:billing@digitalfx.in" className="text-[#207de9] underline">billing@digitalfx.in</a> / <a href="mailto:hello@digitalfx.in" className="text-[#207de9] underline">hello@digitalfx.in</a></div>
              <div><strong>Office Address:</strong> Shop No. 210, Second Floor, Orbit Plaza, Crossings Republik, Ghaziabad, UP 201016, India</div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. BOTTOM FOOTER BAR */}
      <footer className="py-12 border-t border-slate-200 bg-slate-50">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500 font-medium mb-4">
            <Link href="/privacy-policy" className="hover:text-[#207de9] transition">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-[#207de9] transition">Terms &amp; Conditions</Link>
            <Link href="/refund-policy" className="text-[#207de9] font-bold">Refund Policy</Link>
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
