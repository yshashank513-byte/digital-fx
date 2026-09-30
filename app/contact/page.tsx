"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          website: website.trim(),
          message: message.trim() || "Consultation request from /contact page",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit request.");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please call +91 93198 07273 directly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-[#207de9] selection:text-white">
      
      {/* Universal Navbar */}
      <Navbar currentPath="/contact" />

      {/* 3. MAIN SECTION */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#f8faff] via-white to-white border-b border-slate-200">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1570ef] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse" />
              Strategic Growth Advisory
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#080d24] tracking-tight">
              Connect With Our Senior Strategists
            </h1>
            <p className="mt-3 text-base text-slate-600 font-normal">
              Visit our NCR office in Orbit Plaza, Crossings Republik, or request a customized competitor audit below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-7xl mx-auto">
            
            {/* Left: Office & Contact Info */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold text-[#080d24]">Agency Headquarters</h3>
                  <p className="text-xs text-slate-500 mt-1">Crossings Republik Commercial Corridor, NCR</p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-[#1570ef] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <strong className="text-slate-900 block font-bold">Physical Address</strong>
                      <span className="text-slate-600">Shop No. 210, 2nd Floor, Orbit Plaza, Crossings Republik, Ghaziabad, UP 201016, India</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-[#1570ef] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <strong className="text-slate-900 block font-bold">Direct Phone Desk</strong>
                      <a href="tel:+919319807273" className="text-[#1570ef] font-bold text-base hover:underline block font-mono">
                        +91 93198 07273
                      </a>
                      <span className="text-[11px] text-slate-500">Available Mon–Sat: 9:30 AM – 7:30 PM IST</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-[#1570ef] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <strong className="text-slate-900 block font-bold">Email Desk</strong>
                      <a href="mailto:hello@digitalfx.in" className="text-[#1570ef] font-semibold hover:underline block">
                        hello@digitalfx.in / strategy@digitalfx.in
                      </a>
                      <span className="text-[11px] text-slate-500">Guaranteed response within 24 hours</span>
                    </div>
                  </div>

                  <a
                    href="https://www.instagram.com/digitalfx.in?stkn=Y2owZTN4ZTd2cm5p"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-[#1570ef] flex items-center justify-center shrink-0 group-hover:bg-[#1570ef] group-hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <strong className="text-slate-900 block font-bold group-hover:text-[#1570ef] transition-colors">Official Instagram</strong>
                      <span className="text-[#1570ef] font-bold text-sm block">
                        @digitalfx.in ↗
                      </span>
                      <span className="text-[11px] text-slate-500">Follow us for real-time marketing breakdowns &amp; client results</span>
                    </div>
                  </a>
                </div>

                {/* Google Map Embed & Verified Listing Button */}
                <div className="space-y-3">
                  <div className="rounded-2xl overflow-hidden border border-slate-200 h-64 w-full shadow-inner">
                    <iframe
                      title="Digital FX Office Map"
                      src="https://maps.google.com/maps?q=Orbit+Plaza,+Crossings+Republik,+Ghaziabad,+Uttar+Pradesh+201016&t=&z=16&ie=UTF8&iwloc=&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>

                  <a
                    href="https://share.google/EIVnaRy9WhkPCi8U8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200 text-blue-900 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#1570ef] shadow-xs font-bold text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </span>
                      <div className="text-left">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                          Digital FX Verified Google Maps Listing
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium">
                          Orbit Plaza, Crossings Republik • View Directions &amp; Reviews
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#1570ef] group-hover:translate-x-1 transition-transform">
                      Open Profile ↗
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Consultation Proposal Request Form */}
            <div className="lg:col-span-6">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1570ef] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                      Free Strategy Proposal
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Response &lt; 24h</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#080d24]">Request 1-on-1 Consultation</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Tell us about your target market. We will analyze your search competition and map out an attributable plan.
                  </p>
                </div>

                <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shadow-xs">
                  <img
                    src="/strategy-consultation-vector.jpg"
                    alt="Digital FX Growth Consultation & Strategic Advisory"
                    className="w-full aspect-[16/9] object-cover"
                  />
                </div>

                {submitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <div className="text-2xl">✓</div>
                    <h4 className="font-bold text-emerald-900 text-base">Strategy Request Received</h4>
                    <p className="text-xs text-emerald-700">
                      Thank you. Our senior strategist will review your domain and reach out to your phone/email with an actionable audit report.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1570ef] focus:bg-white text-slate-800 font-medium transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1570ef] focus:bg-white text-slate-800 font-medium transition"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          Work Email *
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="rahul@company.com"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1570ef] focus:bg-white text-slate-800 font-medium transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Website Domain
                      </label>
                      <input
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="e.g. yourcompany.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1570ef] focus:bg-white text-slate-800 font-medium transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Growth Goals / Note
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="e.g. Looking to improve our Google Maps 3-Pack rank and reduce Google Ads CPA."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1570ef] focus:bg-white text-slate-800 font-medium transition resize-none"
                      />
                    </div>

                    {error && (
                      <p className="text-xs font-semibold text-red-600">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-xl bg-[#1570ef] hover:bg-[#105fc7] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {loading ? "Transmitting Proposal Request..." : "Request Free Strategic Proposal →"}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* UNIVERSAL BRANDED FOOTER */}
      <Footer />

    </div>
  );
}
