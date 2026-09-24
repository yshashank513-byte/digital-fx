import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#207de9] selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-50 text-[#207de9] text-3xl font-black shadow-inner border border-blue-100">
            404
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#207de9]">
              Page Not Found
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#080d24] tracking-tight">
              Lost in the Digital Ether?
            </h1>
            <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
              The page or strategic asset you are seeking might have been moved, renamed, or is temporarily unavailable.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-[#207de9] hover:bg-[#1a6bc7] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
            >
              ← Return to Homepage
            </Link>
            <Link
              href="/services"
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all"
            >
              Explore Growth Services
            </Link>
            <a
              href="https://wa.me/919319807273?text=Hi%20Digital%20FX,%20I%20hit%20a%20404%20error%20on%20your%20site."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
            >
              <span>💬 WhatsApp Support</span>
            </a>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-500">
            <Link href="/case-studies" className="hover:text-[#207de9] transition">Portfolio</Link>
            <Link href="/reviewflow" className="hover:text-[#207de9] transition">ReviewFlow AI</Link>
            <Link href="/tools" className="hover:text-[#207de9] transition">Free AI Tools</Link>
            <Link href="/contact" className="hover:text-[#207de9] transition">Contact Strategy Desk</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
