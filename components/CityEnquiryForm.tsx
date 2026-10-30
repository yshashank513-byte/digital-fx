"use client";

import { useState, FormEvent } from "react";
import { trackEnquirySubmit, trackWhatsAppClick } from "@/lib/analytics";

interface CityEnquiryFormProps {
  cityName: string;
  stateName?: string;
  compact?: boolean;
}

export default function CityEnquiryForm({
  cityName,
  stateName,
  compact = false,
}: CityEnquiryFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [service, setService] = useState("Google Business + Local SEO");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setError("Please provide a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          website: website.trim(),
          service: `${service} (${cityName})`,
          message:
            message.trim() ||
            `Consultation request from /digital-marketing-agency/${cityName.toLowerCase().replace(/\s+/g, "-")} landing page.`,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit enquiry.");
      }

      setSubmitted(true);
      trackEnquirySubmit(service, cityName);
    } catch (err: any) {
      setError(err.message || "Failed to send enquiry. Please contact +91 93198 07273 directly.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold">
          ✓
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          Growth Consultation Request Received!
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Thank you, <strong className="text-slate-900">{name}</strong>. Our senior digital growth strategist for{" "}
          <strong className="text-slate-900">{cityName}</strong> will review your website and call you within 30 minutes.
        </p>
        <div className="pt-2">
          <a
            href={`https://wa.me/919319807273?text=Hi%20Digital%20FX%20team,%20I%20just%20submitted%20a%20consultation%20form%20for%20my%20business%20in%20${encodeURIComponent(cityName)}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <span>💬 Connect on WhatsApp Immediately</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1570ef] transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Phone / WhatsApp <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 98123 45678"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1570ef] transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Work Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. rahul@company.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1570ef] transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Website or Business Name
          </label>
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="e.g. yourbusiness.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1570ef] transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Service Needed
        </label>
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1570ef] transition"
        >
          <option value="Google Business + Local SEO">Google Business Profile (Maps 3-Pack) + Local SEO</option>
          <option value="Website Development (Next.js 16)">High-Speed Website Development (Next.js 16)</option>
          <option value="Google Ads (PPC) & Meta Ads">Performance Paid Advertising (Google & Meta Ads)</option>
          <option value="Generative Engine Optimization (GEO)">Generative Engine Optimization (AI Search / GEO)</option>
          <option value="ReviewFlow AI & NFC Tap-to-Review">ReviewFlow AI & Customer Review Standees</option>
          <option value="Full 360° Agency Retainer">Full 360° Digital Marketing Growth Retainer</option>
        </select>
      </div>

      {!compact && (
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Growth Goals or Challenges in {cityName}
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Tell us about your business in ${cityName} and what results you want to achieve...`}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1570ef] transition resize-none"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#1570ef] to-[#0d5ac9] hover:from-[#1264d8] hover:to-[#0a4bb0] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Analyzing Your Market in {cityName}...</span>
          </>
        ) : (
          <>
            <span>Get Free {cityName} Growth Audit &amp; Strategy</span>
            <span>→</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-4 pt-1 text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          No spam guarantee
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          30-minute callback
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Zero lock-in contracts
        </span>
      </div>
    </form>
  );
}
