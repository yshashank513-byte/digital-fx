import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | Digital FX",
  description:
    "Official Cancellation and Refund Policy of Digital FX. Transparent refund timelines, deliverable milestone guidelines, and RBI/PayU compliance standards.",
  alternates: {
    canonical: "https://www.digitalfx.in/refund-policy",
  },
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#207de9] selection:text-white">
      {/* 1. TOP INSTITUTIONAL BAR */}
      <div className="bg-[#080d24] text-white py-2 border-b border-white/10 text-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-slate-300 text-[11.5px] font-medium">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Official Institutional Documentation
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline text-slate-300">
              Client Billing &amp; Refund Governance
            </span>
          </div>

          <div className="flex items-center gap-4 text-[12px] font-medium ml-auto sm:ml-0">
            <a href="tel:+918447583685" className="hover:text-white font-bold transition flex items-center gap-1.5">
              <span className="text-[#207de9]">☎</span> +91 84475 83685
            </a>
            <a
              href="mailto:billing@digitalfx.in"
              className="text-slate-300 hover:text-white font-medium transition"
            >
              billing@digitalfx.in
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
                Corporate Governance &amp; Legal
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
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
              className="text-[14px] font-semibold text-slate-700 hover:text-[#207de9] transition"
            >
              Insights &amp; Blog
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold text-slate-600 hover:text-[#207de9] transition hidden sm:inline"
            >
              ← Back to Main Website
            </Link>
            <a
              href="https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20have%20a%20billing%20or%20refund%20inquiry."
              target="_blank"
              rel="noopener noreferrer"
              className="h-[42px] px-5 rounded-xl bg-[#207de9] hover:bg-[#1a6bc7] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <span>Billing Support Desk</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </header>

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
              <div><strong>Direct Support Line:</strong> +91 84475 83685 (9:30 AM – 7:00 PM IST)</div>
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
