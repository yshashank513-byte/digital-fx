"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { generateNaturalHumanReview, SUPPORTED_LANGUAGES, SupportedLanguage } from "@/lib/humanReviewEngine";

interface AiReviewStandeeToolProps {
  onBackToTools?: () => void;
}

const PRESET_BUSINESSES = [
  {
    name: "Dr. Sharma Dental & Implant Clinic",
    category: "Clinic",
    city: "Noida, Sector 18",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJsharma_dental_noida",
    color: "#0284c7",
  },
  {
    name: "The Spice Route Family Restaurant",
    category: "Restaurant",
    city: "Indirapuram, Ghaziabad",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJspice_route_indirapuram",
    color: "#e11d48",
  },
  {
    name: "Digital FX - Performance Marketing",
    category: "Digital Marketing Agency",
    city: "Orbit Plaza, Crossings Republik",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJr8q_Orbit_Plaza_DigitalFX",
    color: "#207de9",
  },
  {
    name: "Speedy Packers & Movers NCR",
    category: "Packers & Movers",
    city: "Delhi NCR",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJspeedy_packers_ncr",
    color: "#16a34a",
  },
];

export default function AiReviewStandeeTool({ onBackToTools }: AiReviewStandeeToolProps) {
  // Standee Customization State
  const [businessName, setBusinessName] = useState("Dr. Sharma Dental & Implant Clinic");
  const [category, setCategory] = useState("Clinic");
  const [city, setCity] = useState("Noida, Sector 18");
  const [reviewUrl, setReviewUrl] = useState("https://search.google.com/local/writereview?placeid=ChIJsharma_dental_noida");
  const [theme, setTheme] = useState<"google-white" | "luxury-black">("google-white");
  const [downloading, setDownloading] = useState<string | null>(null);

  // Customer Scan Experience Simulator State
  const [simRating, setSimRating] = useState<number>(5);
  const [simHover, setSimHover] = useState<number>(0);
  const [simLang, setSimLang] = useState<SupportedLanguage>("en");
  const [simReview, setSimReview] = useState<string>("");
  const [simCopied, setSimCopied] = useState<boolean>(false);
  const [simShuffling, setSimShuffling] = useState<boolean>(false);

  // Generate review on mount or when business / rating / language changes
  const updateSimReview = useCallback(
    (name: string, cat: string, lang: SupportedLanguage = simLang, rating: number = simRating) => {
      setSimShuffling(true);
      const generated = generateNaturalHumanReview(name, cat, lang, Date.now() + Math.random() * 1000, rating);
      setSimReview(generated);
      setTimeout(() => setSimShuffling(false), 150);
    },
    [simLang, simRating]
  );

  useEffect(() => {
    updateSimReview(businessName, category, simLang, simRating);
  }, [businessName, category]);

  const handleSimRatingChange = (newRating: number) => {
    setSimRating(newRating);
    updateSimReview(businessName, category, simLang, newRating);
  };

  const handleSimLangChange = (newLang: SupportedLanguage) => {
    setSimLang(newLang);
    updateSimReview(businessName, category, newLang, simRating);
  };

  const handleApplyPreset = (preset: typeof PRESET_BUSINESSES[0]) => {
    setBusinessName(preset.name);
    setCategory(preset.category);
    setCity(preset.city);
    setReviewUrl(preset.reviewUrl);
    updateSimReview(preset.name, preset.category, simLang, simRating);
  };

  const handleSimCopyAndPost = async () => {
    try {
      await navigator.clipboard.writeText(simReview);
      setSimCopied(true);
      setTimeout(() => setSimCopied(false), 2500);
    } catch (_) {}

    // Open target review destination
    setTimeout(() => {
      window.open(reviewUrl || "https://www.google.com/maps", "_blank", "noopener,noreferrer");
    }, 200);
  };

  const handleDownloadStandee = async (format: "png" | "svg") => {
    setDownloading(format);
    try {
      const slug = businessName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
      const url = `/api/reviewflow/qr?businessId=${encodeURIComponent(slug || "review")}&format=${format}`;
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${slug || "google"}-standee.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error(`Failed to download ${format}:`, err);
    } finally {
      setDownloading(null);
    }
  };

  const handlePrintStandee = () => {
    window.print();
  };

  // Dynamic slug for current business
  const businessSlug =
    businessName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "review";

  // Construct origin for smart review portal link
  const [portalOrigin, setPortalOrigin] = useState("http://localhost:3000");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPortalOrigin(window.location.origin);
    }
  }, []);

  // Smart Review Portal URL: Opens the AI review flow (Stars -> AI Draft -> 1-click Google Maps redirect)
  const portalPath = `/r/${businessSlug}?name=${encodeURIComponent(businessName)}&cat=${encodeURIComponent(category)}&city=${encodeURIComponent(city)}&reviewUrl=${encodeURIComponent(reviewUrl)}`;
  const fullPortalUrl = `${portalOrigin}${portalPath}`;

  const [qrDisplayUrl, setQrDisplayUrl] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(fullPortalUrl, {
      width: 450,
      margin: 1,
      errorCorrectionLevel: "H",
      color: {
        dark: theme === "luxury-black" ? "#0F172A" : "#0284c7",
        light: "#FFFFFF",
      },
    })
      .then((url) => {
        if (isMounted) setQrDisplayUrl(url);
      })
      .catch((err) => {
        console.error("Tool QR generation error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [fullPortalUrl, theme]);

  const isDark = theme === "luxury-black";

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      
      {/* 1. TOP HEADER & NAVIGATION */}
      <section className="bg-gradient-to-b from-[#080d24] via-[#0e1738] to-[#080d24] text-white pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 relative z-10">
          {onBackToTools && (
            <div className="mb-4">
              <button
                type="button"
                onClick={onBackToTools}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
              >
                <span>←</span>
                <span>Back to All AI Tools</span>
              </button>
            </div>
          )}

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Google Business Acrylic Standee &amp; 1-Click AI Review Engine</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.14]">
              Official Google Business Standee &amp;{" "}
              <span className="text-[#38bdf8] font-serif italic font-normal">
                AI Review QR
              </span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Generate an official Google Business tabletop counter standee for your shop, clinic, or restaurant. Customers scan, tap 4 or 5 stars, get an instant personalized AI review, and copy &amp; post in under 15 seconds.
            </p>
          </div>
        </div>
      </section>

      {/* 2. MAIN TOOL WORKSPACE: 2-COLUMN WORKSPACE (CONTROLS + LIVE STANDEE) */}
      <section className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: BUSINESS CUSTOMIZER & PRINT CONTROLS */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Quick Demo Presets */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Quick Demo Businesses:
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">Click to test instant preview</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_BUSINESSES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition flex flex-col justify-between cursor-pointer ${
                      businessName === preset.name
                        ? "bg-blue-50 border-[#207de9] text-[#207de9] shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                    }`}
                  >
                    <span className="truncate">{preset.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium mt-1">{preset.category} • {preset.city}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input Form */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-wider text-[#080d24]">
                  Customize Your Standee
                </h2>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Live Sync
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Business / Store / Clinic Name:
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Apex Multispecialty Dental Hospital"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#207de9] bg-slate-50/60 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Category:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#207de9] bg-slate-50/60 focus:bg-white transition cursor-pointer"
                  >
                    <option value="Clinic">Clinic / Healthcare</option>
                    <option value="Restaurant">Restaurant / Cafe</option>
                    <option value="Salon">Salon &amp; Spa</option>
                    <option value="Packers & Movers">Packers &amp; Movers</option>
                    <option value="Jewellery Store">Jewellery Store</option>
                    <option value="Hotel">Hotel &amp; Banquets</option>
                    <option value="Real Estate">Real Estate &amp; Builders</option>
                    <option value="Clothing Store">Retail / Clothing Store</option>
                    <option value="Digital Marketing Agency">Marketing Agency</option>
                    <option value="Other">Other Business</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    City / Neighborhood:
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Sector 18 Noida"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#207de9] bg-slate-50/60 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Google Maps Review Link / Place ID:
                </label>
                <input
                  type="text"
                  value={reviewUrl}
                  onChange={(e) => setReviewUrl(e.target.value)}
                  placeholder="https://search.google.com/local/writereview?placeid=..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#207de9] bg-slate-50/60 focus:bg-white transition text-xs"
                />
                <p className="text-[11px] text-slate-400 mt-1 font-medium">
                  Direct Google Maps &ldquo;Write a Review&rdquo; link paste karein jaha customer review de sake.
                </p>
              </div>

              {/* Theme Switcher */}
              <div className="pt-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Choose Standee Theme:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTheme("google-white")}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      theme === "google-white"
                        ? "bg-white border-[#207de9] text-[#207de9] shadow-md ring-2 ring-blue-100"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>⚪</span>
                    <span>Classic Google White</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme("luxury-black")}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      theme === "luxury-black"
                        ? "bg-[#0b1021] border-amber-400 text-amber-300 shadow-md ring-2 ring-amber-400/20"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <span>⚫</span>
                    <span>Luxury Matte Black &amp; Gold</span>
                  </button>
                </div>
              </div>

              {/* Print & Download Action Row */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={handlePrintStandee}
                  className="py-3 px-3 rounded-2xl bg-[#080d24] hover:bg-[#1570ef] text-white text-xs font-bold text-center transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                >
                  <span>🖨️</span>
                  <span>Print Standee</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadStandee("png")}
                  disabled={downloading === "png"}
                  className="py-3 px-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-[#207de9] border border-blue-200 text-xs font-bold text-center transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  <span>{downloading === "png" ? "⏳" : "📥"}</span>
                  <span>High-Res PNG</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadStandee("svg")}
                  disabled={downloading === "svg"}
                  className="py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold text-center transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  <span>📐</span>
                  <span>Vector SVG</span>
                </button>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: THE LIVE OFFICIAL GOOGLE BUSINESS STANDEE */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            <div className="w-full text-center mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Official Acrylic Tabletop Standee (A5 Tent Card Format)
              </span>
            </div>

            {/* THE STANDEE CARD */}
            <div
              className={`w-full max-w-[420px] rounded-3xl p-7 sm:p-8 border-2 shadow-2xl flex flex-col items-center text-center relative overflow-hidden transition-all duration-300 ${
                isDark
                  ? "bg-gradient-to-b from-[#0a0f1f] via-[#080c1a] to-[#04060c] text-white border-amber-400/40 shadow-amber-500/10"
                  : "bg-gradient-to-b from-white via-white to-slate-50 text-slate-900 border-slate-200/90 shadow-slate-300/40"
              }`}
            >
              {/* Google 4-Color Signature Top Stripe */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />

              {/* 1. Official Google Header */}
              <div className="pt-2 mb-2 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                  {/* Google Multi-Color G Icon */}
                  <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className={`text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-[#1f2937]"}`}>
                    Google
                  </span>
                </div>

                <h3 className={`text-lg font-black tracking-wide uppercase ${isDark ? "text-amber-300" : "text-[#1a73e8]"}`}>
                  REVIEW US ON GOOGLE
                </h3>

                {/* 5 3D Golden Stars */}
                <div className="flex items-center justify-center gap-1.5 text-amber-400 text-2xl mt-0.5 drop-shadow-sm">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                </div>
              </div>

              {/* 2. Client Business Badge */}
              <div
                className="my-2.5 py-2.5 px-4 rounded-2xl w-full border border-dashed flex flex-col items-center justify-center gap-0.5 bg-slate-50/60"
                style={{ borderColor: isDark ? "rgba(251, 191, 36, 0.2)" : "rgba(203, 213, 225, 0.8)" }}
              >
                <span className={`text-base font-black truncate max-w-[280px] ${isDark ? "text-white" : "text-[#080d24]"}`}>
                  {businessName || "Your Business Name"}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {category} • {city || "Local Verified Hub"}
                </span>
              </div>

              {/* 3. High-Definition QR Code Card */}
              <div className="bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-md my-3 relative group">
                <img
                  src={qrDisplayUrl}
                  alt={`${businessName} Google Review QR`}
                  className="w-52 h-52 sm:w-56 sm:h-56 object-contain rounded-xl"
                />

                {/* Central Google "G" Watermark Badge */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-xl border-2 border-slate-100 flex items-center justify-center p-2">
                    <svg className="w-full h-full" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 4. Camera Callout */}
              <div className="mt-1 space-y-1.5">
                <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black tracking-tight">
                  <span>📷</span>
                  <span>POINT YOUR PHONE CAMERA TO SCAN</span>
                </div>

                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                  isDark
                    ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                    : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                }`}>
                  <span>⚡ Takes Only 15 Seconds • No App Needed</span>
                </div>
              </div>

              {/* 5. Footer NFC & Digital FX Badge */}
              <div className={`mt-4 pt-3.5 border-t w-full flex flex-col items-center text-[10px] sm:text-[11px] ${
                isDark ? "border-white/10 text-slate-400" : "border-slate-100 text-slate-500"
              }`}>
                <div className="flex items-center gap-2 font-semibold">
                  <span>(( 📲 Tap Phone for NFC ))</span>
                  <span>•</span>
                  <span className="font-mono font-bold text-[#207de9]">
                    Scan or Tap
                  </span>
                </div>

                <div className="mt-1 font-medium flex items-center justify-center gap-1.5">
                  <span>Google Business Partner • ReviewFlow AI</span>
                  <span>•</span>
                  <strong className={isDark ? "text-slate-200" : "text-slate-800"}>Digital FX</strong>
                </div>
              </div>

            </div>

            {/* Live Scan & Test Bar */}
            <div className="mt-4 w-full max-w-[420px] bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>QR Scan Flow:</span>
                </span>
                <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 truncate max-w-[190px]">
                  1. AI Review → 2. Google Maps
                </span>
              </div>

              <p className="text-[11px] text-slate-500 leading-normal">
                Customer camera scan karega toh pehle <strong>AI Review Portal</strong> khulega (Stars + AI draft), fir &quot;Copy &amp; Post&quot; par Google Maps review dialog open hoga.
              </p>
              
              <a
                href={fullPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs active:scale-98"
              >
                <span>📱 Test Live QR Flow (Open in New Tab)</span>
                <span>↗</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          3. LIVE CUSTOMER SCANNING EXPERIENCE SIMULATOR
          ======================================================== */}
      <section className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 md:px-8 mt-16 pt-12 border-t border-slate-200">
        
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <span>📲 Customer View Simulator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#080d24] tracking-tight">
            See What Customers Experience On Their Phone
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Test the live review flow below: Tap any star (e.g. 4★ or 5★) to see the review auto-generate, then test <strong>&ldquo;Copy &amp; Post to Google&rdquo;</strong>!
          </p>
        </div>

        {/* Floating Copied Toast in Simulator */}
        {simCopied && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs sm:text-sm font-bold animate-bounce border border-emerald-400">
            <span className="text-base">✓</span>
            <span>Review text copied! Opening Google Maps review desk...</span>
          </div>
        )}

        {/* Phone Mockup Frame */}
        <div className="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-300 shadow-xl space-y-5 relative">
          
          {/* Mockup Top Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#207de9] font-black text-xs flex items-center justify-center border border-blue-200">
                {businessName.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-left">
                <h3 className="text-xs font-black text-[#080d24] truncate max-w-[190px]">
                  {businessName}
                </h3>
                <span className="text-[10px] text-slate-500 font-medium">Verified Google Review Portal</span>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
              Verified 5★
            </span>
          </div>

          {/* STEP 1: SABSE PEHLE STAR RATING */}
          <div className="text-center py-2">
            <h4 className="text-base font-black text-[#080d24]">
              How was your experience?
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Tap a star to rate <strong className="text-slate-800">{businessName}</strong>:
            </p>

            {/* 5 Big Interactive Stars */}
            <div className="mt-3 flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isLit = (simHover || simRating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleSimRatingChange(star)}
                    onMouseEnter={() => setSimHover(star)}
                    onMouseLeave={() => setSimHover(0)}
                    className="p-1 transition-transform hover:scale-125 active:scale-95 cursor-pointer"
                  >
                    <span
                      className={`text-4xl transition-colors ${
                        isLit ? "text-amber-400 drop-shadow-xs" : "text-slate-200"
                      }`}
                    >
                      ★
                    </span>
                  </button>
                );
              })}
            </div>

            <span className="mt-2 inline-block px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
              {simRating} ★ ({simRating === 5 ? "Excellent / Loved it!" : simRating === 4 ? "Very Good Experience!" : simRating === 3 ? "Satisfactory" : "Needs Improvement"})
            </span>
          </div>

          {/* STEP 2: AUTO-GENERATED AI REVIEW ACCORDING TO STAR RATING */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
                ✨ Review for {simRating}★ Rating:
              </span>

              {/* Language Selector */}
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSimLangChange(lang.code)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                      simLang === lang.code
                        ? "bg-[#207de9] text-white shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {lang.flag}
                  </button>
                ))}
              </div>
            </div>

            {/* Editable Review Box */}
            <textarea
              value={simReview}
              onChange={(e) => setSimReview(e.target.value)}
              rows={3}
              className={`w-full text-xs leading-relaxed p-3 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#207de9] transition ${
                simShuffling ? "opacity-40" : "opacity-100"
              }`}
            />

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => updateSimReview(businessName, category, simLang, simRating)}
                className="text-[11px] font-bold text-[#207de9] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>🔄</span>
                <span>दूसरा सुझाव देखें</span>
              </button>
              <span className="text-[10px] text-slate-400">100% genuine tone</span>
            </div>
          </div>

          {/* STEP 3: "COPY & POST TO GOOGLE" BUTTON */}
          <div>
            <button
              type="button"
              onClick={handleSimCopyAndPost}
              className="w-full py-3.5 px-5 rounded-2xl font-black text-white text-sm bg-[#4285F4] hover:bg-[#3367d6] shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>📋</span>
              <span>COPY &amp; POST TO GOOGLE</span>
              <span>↗</span>
            </button>
            <p className="text-center text-[10.5px] text-slate-400 mt-2 font-medium">
              Click karte hi review copy ho jayega aur Google review page khulega!
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
