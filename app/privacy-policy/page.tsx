import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Digital FX",
  description:
    "Official Privacy Policy of Digital FX. Learn how we collect, protect, and process client information and inquiry data in compliance with the DPDP Act 2023.",
  alternates: {
    canonical: "https://www.digitalfx.in/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
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
              Data Privacy &amp; Governance Desk
            </span>
          </div>

          <div className="flex items-center gap-4 text-[12px] font-medium ml-auto sm:ml-0">
            <a href="tel:+918447583685" className="hover:text-white font-bold transition flex items-center gap-1.5">
              <span className="text-[#207de9]">☎</span> +91 84475 83685
            </a>
            <a
              href="mailto:hello@digitalfx.in"
              className="text-slate-300 hover:text-white font-medium transition"
            >
              hello@digitalfx.in
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
              href="https://wa.me/918447583685?text=Hi%20Digital%20FX,%20I%20have%20a%20legal%20or%20privacy%20inquiry."
              target="_blank"
              rel="noopener noreferrer"
              className="h-[42px] px-5 rounded-xl bg-[#207de9] hover:bg-[#1a6bc7] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <span>Contact Privacy Desk</span>
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
          <span className="text-[#207de9] font-bold">Privacy Policy</span>
        </div>
      </div>

      {/* 4. HERO HEADER */}
      <section className="py-14 sm:py-16 border-b border-slate-200 bg-gradient-to-b from-slate-50/70 to-white">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold tracking-wider uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-[#1570ef]" />
            <span>Digital Personal Data Protection (DPDP) Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#080d24] tracking-tight mb-3">
            Privacy Policy &amp; Data Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Effective Date: March 1, 2026 • Last Reviewed: September 12, 2026 • Version 2.4
          </p>
        </div>
      </section>

      {/* 5. LEGAL CONTENT BODY */}
      <section className="py-12 sm:py-16 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-10 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#080d24] tracking-tight">
              1. Overview &amp; Commitment to Data Protection
            </h2>
            <p>
              Digital FX (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), having its principal commercial office at <strong>Shop No. 210, Second Floor, Orbit Plaza, Crossings Republik, Ghaziabad, Uttar Pradesh 201016, India</strong>, is committed to safeguarding the privacy and digital personal data of visitors, clients, and partners accessing our website (<a href="https://www.digitalfx.in" className="text-[#207de9] font-medium underline">https://www.digitalfx.in</a>) and our digital marketing services.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, store, process, and protect your information in full compliance with the <strong>Digital Personal Data Protection (DPDP) Act 2023 (India)</strong>, the Information Technology Act 2000, and international data protection standards.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#080d24] tracking-tight">
              2. Information We Collect
            </h2>
            <p>We collect information you provide directly to us through voluntary interactions on our platform:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li><strong>Contact &amp; Identification Data:</strong> Full name, corporate email address, contact telephone or WhatsApp number, business designation, and company name when submitting inquiry or consultation forms.</li>
              <li><strong>Commercial Business Data:</strong> Target website domain URL, industry sector, target geographic focus (cities/states), search ranking goals, and advertising budget allocations submitted for SEO audits.</li>
              <li><strong>Transactional &amp; Invoice Billing Data:</strong> Payment transaction identifier (txnid), billing entity name, GSTIN (if applicable), billing address, and transaction timestamps processed through our authorized payment gateway partner (PayU India). <em>Note: Digital FX does NOT collect, store, or process raw credit card, debit card, or net banking credentials; all payment tokenization is handled securely by RBI-authorized payment aggregators.</em></li>
              <li><strong>Automated Technical Diagnostics:</strong> IP address, device type, browser specifications, referring URLs, and page navigation patterns collected via technical cookies to improve web performance and Core Web Vitals.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#080d24] tracking-tight">
              3. Purpose &amp; Lawful Basis of Processing
            </h2>
            <p>We process your data strictly for legitimate commercial and technical purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>To prepare and deliver customized SEO, Google Maps 3-Pack, website development, and Generative Engine Optimization (GEO) audit proposals.</li>
              <li>To execute contractual client service agreements and issue official GST tax invoices for digital marketing retainers.</li>
              <li>To communicate strategy updates, campaign milestones, and performance attribution reports via authorized phone, email, or WhatsApp channels.</li>
              <li>To maintain platform security, prevent fraudulent ad clicks, and optimize server-side page response speeds.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#080d24] tracking-tight">
              4. Data Sharing &amp; Third-Party Processors
            </h2>
            <p>
              Digital FX maintains a strict policy against selling, renting, or leasing client personal information to third-party data brokers or marketing aggregators. Information is shared only with trusted infrastructure providers necessary to fulfill client services:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li><strong>Payment Gateway:</strong> PayU Payments Private Limited (authorized by the Reserve Bank of India) for secure payment processing.</li>
              <li><strong>Cloud &amp; Database Infrastructure:</strong> Enterprise-grade database hosting (Supabase / AWS Asia-Pacific Mumbai region) protected by AES-256 encryption at rest and TLS 1.3 in transit.</li>
              <li><strong>Statutory Authorities:</strong> If required by applicable Indian law, court order, or governmental law enforcement agency.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#080d24] tracking-tight">
              5. Data Security &amp; Retention
            </h2>
            <p>
              We implement comprehensive physical, electronic, and procedural safeguards to protect your personal data against unauthorized access, loss, or alteration. Inactive lead inquiry data is purged after 24 months unless an ongoing commercial retainer or statutory GST invoicing record requires extended retention.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#080d24] tracking-tight">
              6. Your Rights Under DPDP Act 2023
            </h2>
            <p>As a data principal, you have statutory rights regarding your personal information:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>Right to access an itemized summary of personal data held by Digital FX.</li>
              <li>Right to correction, completion, and updating of inaccurate data.</li>
              <li>Right to erasure of personal data that is no longer required for contractual or legal compliance.</li>
              <li>Right to nominate an authorized representative in accordance with DPDP rules.</li>
            </ul>
          </div>

          {/* Section 7 */}
          <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <h2 className="text-base sm:text-lg font-extrabold text-[#080d24] tracking-tight">
              7. Grievance Redressal Officer &amp; Contact Information
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              In accordance with the Information Technology Act 2000 and DPDP Act 2023, the details of the designated Data Protection &amp; Grievance Redressal Officer are as follows:
            </p>
            <div className="mt-3 space-y-1 text-xs text-slate-800 font-medium">
              <div><strong>Grievance Officer:</strong> Shashank Yadav</div>
              <div><strong>Entity:</strong> Digital FX (Digital Marketing Agency)</div>
              <div><strong>Office Address:</strong> Shop No. 210, Second Floor, Orbit Plaza, Crossings Republik, Ghaziabad, UP 201016, India</div>
              <div><strong>Email:</strong> <a href="mailto:hello@digitalfx.in" className="text-[#207de9] underline">hello@digitalfx.in</a> / <a href="mailto:billing@digitalfx.in" className="text-[#207de9] underline">billing@digitalfx.in</a></div>
              <div><strong>Helpline:</strong> +91 84475 83685 (Monday to Saturday, 9:30 AM – 7:00 PM IST)</div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. BOTTOM FOOTER BAR */}
      <footer className="py-12 border-t border-slate-200 bg-slate-50">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500 font-medium mb-4">
            <Link href="/privacy-policy" className="text-[#207de9] font-bold">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-[#207de9] transition">Terms &amp; Conditions</Link>
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
