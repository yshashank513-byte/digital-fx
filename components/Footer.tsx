import Link from "next/link";

export default function Footer() {
  return (
    <>
      {/* Upper Half: Premium Brand Strategy & Conversion Band */}
      <div className="bg-gradient-to-r from-[#080d24] via-[#102766] to-[#1570ef] text-white border-t border-b border-blue-400/20 py-10 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-[var(--font-plus-jakarta)]">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        
        <div className="max-w-[1360px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 relative z-10">
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-black tracking-wider uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Delhi NCR&apos;s #1 Search Engineering Firm</span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
              Ready to dominate Google Maps 3-Pack &amp; 10x your inquiries?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-blue-100/90 font-normal leading-relaxed">
              Meet your dedicated strategists face-to-face in Orbit Plaza, Crossings Republik, or request a customized competitor audit today.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 shrink-0">
            <a
              href="tel:+919319807273"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#080d24] hover:bg-blue-50 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>📞 Call +91 93198 07273</span>
            </a>
            <a
              href="https://wa.me/919319807273?text=Hi%20Digital%20FX%20team,%20I%20want%20to%20discuss%20a%20growth%20strategy."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>WhatsApp Strategy Desk</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600/60 hover:bg-blue-600 border border-white/20 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <span>Get Free Proposal →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Lower Half: Institutional Midnight Navy Footer Grid */}
      <footer className="bg-[#080d24] text-slate-300 pt-16 pb-12 font-[var(--font-plus-jakarta)] border-t border-slate-800">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* 4 Professional Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-slate-800">
            
            {/* Column 1: Brand Logo, Description, Badges & Registered Office */}
            <div className="space-y-5">
              {/* Brand Logo - Significantly Bigger (52px), High Contrast, 100% Crisp */}
              <div className="flex items-center">
                <Link href="/" className="inline-flex items-center group" aria-label="Digital FX Home">
                  <img
                    src="/logo-white.svg"
                    alt="Digital FX - Business Solution"
                    width={220}
                    height={58}
                    loading="lazy"
                    decoding="async"
                    style={{ height: "52px", width: "auto" }}
                    className="h-11 sm:h-[52px] w-auto object-contain shrink-0 transition-transform group-hover:scale-105"
                  />
                </Link>
              </div>

              {/* Company Tagline / Description */}
              <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed font-normal">
                We are the leading digital advertising &amp; search engineering company that turns bold ideas into measurable revenue. Dominating Google Maps 3-Pack, Generative AI Search (GEO), and performance marketing across India and global markets.
              </p>

              {/* Certified Trust Badges Row (Google 5-Star, Amazing Workplaces, Glassdoor) */}
              <div className="space-y-2.5 pt-1">
                {/* Badge 1: Google Verified 5-Star Badge */}
                <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-amber-400 text-xs">★ ★ ★ ★ ★</div>
                    <span className="text-[11px] font-bold text-white">4.9/5.0 (128+ Reviews)</span>
                  </div>
                </div>

                {/* Badge 2: Amazing Workplaces Certified */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-400/10 text-amber-300 font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider border border-amber-400/30">
                  <span>🏆</span>
                  <span>AMAZING WORKPLACES CERTIFIED INDIA</span>
                </div>

                {/* Badge 3: Glassdoor 4.5 Badge */}
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-400/20 px-3 py-1.5 rounded-xl text-xs">
                  <span className="font-extrabold text-emerald-400 font-mono tracking-wider">GLASSDOOR</span>
                  <span className="font-bold text-white">4.5</span>
                  <div className="flex text-amber-400 text-xs">★ ★ ★ ★ ★</div>
                </div>
              </div>

              {/* Headquarters Office & Direct Reach */}
              <div className="pt-2 space-y-2 text-xs text-slate-400 border-t border-slate-800">
                <div className="flex items-start gap-2">
                  <span className="text-[#207de9] shrink-0 mt-0.5">📍</span>
                  <span>Shop No. 210, 2nd Floor, Orbit Plaza, Crossings Republik, Ghaziabad, UP 201016</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#207de9] shrink-0">📞</span>
                  <a href="tel:+919319807273" className="text-white hover:text-[#207de9] transition font-bold">+91 93198 07273</a>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links & Tools */}
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white mb-4">
                Quick Links &amp; Tools
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400 font-normal">
                <li><Link href="/" className="hover:text-white transition">Home</Link></li>
                <li><Link href="/services" className="hover:text-white transition font-semibold text-slate-200">SEO &amp; Growth Services</Link></li>
                <li><Link href="/case-studies" className="hover:text-white transition font-semibold text-slate-200">The Digital FX Portfolio</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition font-semibold text-slate-200">Digital Marketing Packages</Link></li>
                <li>
                  <Link href="/reviewflow" className="hover:text-white transition font-semibold text-[#60a5fa] inline-flex items-center gap-1.5">
                    <span>ReviewFlow AI (Smart QR)</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/40 text-[9px] font-bold">NEW</span>
                  </Link>
                </li>
                <li>
                  <Link href="/tools" className="hover:text-white transition font-semibold text-emerald-400 inline-flex items-center gap-1.5">
                    <span>Free AI Search &amp; GEO Tool</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[9px] font-bold">FREE</span>
                  </Link>
                </li>
                <li><Link href="/careers" className="hover:text-white transition font-semibold text-blue-400">Careers (We Are Hiring!)</Link></li>
                <li><Link href="/contact" className="hover:text-white transition font-semibold text-slate-200">Contact &amp; Strategy Desk</Link></li>
                <li><Link href="/blog" className="hover:text-white transition">Blog &amp; SEO Insights</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/terms-and-conditions" className="hover:text-white transition">Terms &amp; Conditions</Link></li>
                <li><Link href="/refund-policy" className="hover:text-white transition">Refund Policy</Link></li>
                <li><Link href="/sitemap.xml" className="hover:text-white transition">XML Sitemap</Link></li>
              </ul>

              {/* Follow Us Sub-section */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <h5 className="text-xs font-bold text-white mb-3">
                  Follow Digital FX
                </h5>
                <div className="flex items-center gap-2">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-8 h-8 rounded-lg bg-[#1877f2] text-white flex items-center justify-center font-bold text-xs hover:opacity-90 transition">f</a>
                  <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="w-8 h-8 rounded-lg bg-slate-900 border border-white/20 text-white flex items-center justify-center font-bold text-xs hover:opacity-90 transition">𝕏</a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-8 h-8 rounded-lg bg-[#0a66c2] text-white flex items-center justify-center font-bold text-xs hover:opacity-90 transition">in</a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs hover:opacity-90 transition">📷</a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-8 h-8 rounded-lg bg-[#ff0000] text-white flex items-center justify-center font-bold text-xs hover:opacity-90 transition">►</a>
                </div>
              </div>
            </div>

            {/* Column 3: Solutions & Services */}
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white mb-4">
                Solutions &amp; Services
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400 font-normal">
                <li><Link href="/services" className="hover:text-white transition font-semibold text-slate-200">Google Maps 3-Pack &amp; Local SEO</Link></li>
                <li><Link href="/services" className="hover:text-white transition font-semibold text-slate-200">Generative AI Search &amp; GEO</Link></li>
                <li><Link href="/services" className="hover:text-white transition font-semibold text-slate-200">Website &amp; App Development</Link></li>
                <li><Link href="/services" className="hover:text-white transition">Pay Per Click (PPC / Google Ads)</Link></li>
                <li><Link href="/services" className="hover:text-white transition">CTV &amp; Programmatic Advertising</Link></li>
                <li><Link href="/services" className="hover:text-white transition">Rich Media Innovation</Link></li>
                <li><Link href="/services" className="hover:text-white transition">Media Planning &amp; Buying</Link></li>
                <li><Link href="/services" className="hover:text-white transition">Content Marketing</Link></li>
                <li><Link href="/services" className="hover:text-white transition">Social Media Marketing</Link></li>
                <li><Link href="/services" className="hover:text-white transition">Reputation Management (ORM)</Link></li>
                <li><Link href="/services" className="hover:text-white transition">Influencer Marketing</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">WhatsApp Lead Automation</Link></li>
              </ul>
            </div>

            {/* Column 4: Industries */}
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white mb-4">
                Industries We Scale
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400 font-normal">
                <li className="flex items-center gap-1.5"><span className="text-[#207de9]">›</span><span className="hover:text-white transition cursor-default">Hospitals &amp; Healthcare</span></li>
                <li className="flex items-center gap-1.5"><span className="text-[#207de9]">›</span><span className="hover:text-white transition cursor-default">Automobile &amp; Detailing</span></li>
                <li className="flex items-center gap-1.5"><span className="text-[#207de9]">›</span><span className="hover:text-white transition cursor-default">Real Estate &amp; Builders</span></li>
                <li className="flex items-center gap-1.5"><span className="text-[#207de9]">›</span><span className="hover:text-white transition cursor-default">Travel &amp; Hospitality</span></li>
                <li className="flex items-center gap-1.5"><span className="text-[#207de9]">›</span><span className="hover:text-white transition cursor-default">FMCG &amp; FMCD Brands</span></li>
                <li className="flex items-center gap-1.5"><span className="text-[#207de9]">›</span><span className="hover:text-white transition cursor-default">Education &amp; Institutes</span></li>
                <li className="flex items-center gap-1.5"><span className="text-[#207de9]">›</span><span className="hover:text-white transition cursor-default">E-Commerce &amp; D2C</span></li>
                <li className="flex items-center gap-1.5"><span className="text-[#207de9]">›</span><span className="hover:text-white transition cursor-default">Security &amp; Legal Services</span></li>
                <li className="flex items-center gap-1.5"><span className="text-[#207de9]">›</span><span className="hover:text-white transition cursor-default">Information Technology</span></li>
                <li className="flex items-center gap-1.5"><span className="text-[#207de9]">›</span><span className="hover:text-white transition cursor-default">Banking &amp; Financial Services</span></li>
              </ul>
            </div>

          </div>

          {/* Bottom Sub-footer Bar */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4 font-normal">
            <div>
              © {new Date().getFullYear()} Digital FX®. All rights reserved. Registered Office: Shop No. 210, Orbit Plaza, Crossings Republik, Ghaziabad.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <Link href="/blog" className="hover:text-white transition">Blog</Link>
              <Link href="/reviewflow" className="hover:text-white transition">ReviewFlow AI</Link>
              <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="hover:text-white transition">Terms of Service</Link>
              <Link href="/refund-policy" className="hover:text-white transition">Refund Policy</Link>
              <a href="/admin/login" className="hover:text-slate-300 transition text-slate-500">Admin Login</a>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}
