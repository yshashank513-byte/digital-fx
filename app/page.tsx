"use client";

import { FormEvent, useEffect, useState } from "react";
import { Manrope } from "next/font/google";
import { supabase } from "./lib/supabase";
import DigitalFXIntro from "../components/DigitalFXIntro";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

type Service = {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  status: boolean;
};

type GeoResult = {
  score?: number;
  overall?: number;
  grade?: string;
  aiVisibility?: number;
  localPresence?: number;
  contentReadiness?: number;
  technicalSignals?: number;
  insights?: string[];
};

type PaymentPlan = {
  id: "google_listing" | "website" | "growth";
  name: string;
  amount: string;
};

const fallbackServices: Service[] = [
  {
    id: 1,
    name: "SEO (Search Engine Optimization)",
    description:
      "On-page, off-page and local SEO to improve rankings, visibility and qualified organic traffic.",
    icon: "⌕",
    status: true,
  },
  {
    id: 2,
    name: "Social Media Marketing (SMM)",
    description:
      "Instagram, Facebook and LinkedIn management with content calendars and consistent posting.",
    icon: "✦",
    status: true,
  },
  {
    id: 3,
    name: "Paid Ads Management",
    description:
      "Google Search & Display Ads plus Meta Ads for Facebook and Instagram.",
    icon: "↗",
    status: true,
  },
  {
    id: 4,
    name: "Website Design & Development",
    description:
      "High-quality landing pages, business websites and e-commerce experiences built for conversion.",
    icon: "◇",
    status: true,
  },
  {
    id: 5,
    name: "Content Marketing",
    description:
      "Blog writing, social content and video/reels content designed to attract and educate customers.",
    icon: "✎",
    status: true,
  },
  {
    id: 6,
    name: "Lead Generation",
    description:
      "Lead funnels with WhatsApp and CRM integrations to capture, qualify and manage enquiries.",
    icon: "◎",
    status: true,
  },
  {
    id: 7,
    name: "Analytics & Reporting",
    description:
      "Monthly performance reports and a growth tracking dashboard focused on measurable progress.",
    icon: "▥",
    status: true,
  },
  {
    id: 8,
    name: "Branding",
    description:
      "Logo, brand identity and business profile setup across Google, Justdial and relevant platforms.",
    icon: "★",
    status: true,
  },
];

const pricingPlans = [
  {
    name: "Google Business Profile Setup",
    price: "2,999",
    description:
      "Get your business properly set up and visible across Google Search and Maps.",
    features: [
      "Google Business Profile setup",
      "Google Maps presence",
      "Business information setup",
      "Category & service setup",
      "Basic local optimization",
      "Verification guidance",
    ],
    button: "Get Started",
    popular: false,
  },
  {
    name: "Website Development",
    price: "5,999",
    description:
      "A professional business website designed to build trust and generate enquiries.",
    features: [
      "Professional business website",
      "Mobile responsive design",
      "WhatsApp integration",
      "Enquiry form",
      "Basic SEO setup",
      "Contact & business sections",
    ],
    button: "Build My Website",
    popular: false,
  },
  {
    name: "Business Growth Package",
    price: "9,999",
    description:
      "A complete digital foundation combining website, Google visibility and lead capture.",
    features: [
      "Professional business website",
      "Google Business Profile setup",
      "Local search optimization",
      "WhatsApp lead integration",
      "Social media profile setup",
      "Ongoing growth guidance",
    ],
    button: "Choose Growth Package",
    popular: true,
  },
];

const testimonials = [
  {
    quote:
      "Digital FX helped our business get discovered locally in Ghaziabad. Our Google listing visibility and inbound customer calls increased significantly within a few weeks.",
    author: "Local Business Owner",
    business: "Retail Store, Ghaziabad",
    rating: 5,
  },
  {
    quote:
      "The website they built for us looks clean, loads fast and works smoothly on mobile. More importantly, it actually brings enquiries through WhatsApp.",
    author: "Service Provider",
    business: "Home Services, NCR",
    rating: 5,
  },
  {
    quote:
      "Clear communication, sensible pricing and practical guidance. They focus on what works for a growing business without overcomplicating things.",
    author: "Healthcare Clinic",
    business: "Clinic, Uttar Pradesh",
    rating: 5,
  },
];

const industries = [
  "Retail & Local Shops",
  "Doctors & Clinics",
  "Lawyers & Professional Services",
  "Restaurants & Cafes",
  "Real Estate & Property",
  "Coaching & Education",
  "Home Services & Contractors",
  "Manufacturing & B2B",
  "Fitness & Wellness",
  "Beauty & Salons",
  "Automotive & Repair",
  "Travel & Hospitality",
];

const paymentPlans: PaymentPlan[] = [
  {
    id: "google_listing",
    name: "Google Business Profile Setup",
    amount: "2999",
  },
  {
    id: "website",
    name: "Website Development",
    amount: "5999",
  },
  {
    id: "growth",
    name: "Business Growth Package",
    amount: "9999",
  },
];

export default function Home() {
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeGrowthPillar, setActiveGrowthPillar] = useState<string | null>(null);
  const [activePillarTab, setActivePillarTab] = useState(0);
  const [activeFlywheelQuadrant, setActiveFlywheelQuadrant] = useState(0);

  const [geoWebsite, setGeoWebsite] = useState("");
  const [geoKeyword, setGeoKeyword] = useState("");
  const [geoCity, setGeoCity] = useState("");
  const [geoResult, setGeoResult] = useState<GeoResult | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");

  const [formLoading, setFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: "user" | "ai"; text: string }>
  >([
    {
      sender: "ai",
      text: "Hello! Welcome to Digital FX. How can we help grow your business?",
    },
  ]);

  const [selectedPaymentPlan, setSelectedPaymentPlan] =
    useState<PaymentPlan | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentName, setPaymentName] = useState("");
  const [paymentEmail, setPaymentEmail] = useState("");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const [showScrollControls, setShowScrollControls] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setShowScrollControls(window.scrollY > 250);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function scrollToBottom() {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    async function loadServices() {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .order("id", { ascending: true });

        if (!error && data && data.length > 0) {
          setServices(data);
        }
      } catch {
        // keep fallback
      }
    }

    loadServices();
  }, []);

  async function handleGeoCheck(e: FormEvent) {
    e.preventDefault();
    setGeoLoading(true);
    setGeoError("");
    setGeoResult(null);

    try {
      const response = await fetch("/api/geo-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: geoWebsite,
          keyword: geoKeyword,
          city: geoCity,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to analyze your website.");
      }

      setGeoResult(data);
    } catch (err) {
      setGeoError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setGeoLoading(false);
    }
  }

  function handleHeroAuditSubmit(e: FormEvent) {
    e.preventDefault();
    if (!geoWebsite) return;
    const target = document.getElementById("geo-checker");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  async function handleEnquiry(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      service: String(formData.get("service") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "Unable to save enquiry.");
      }

      form.reset();
      setSuccessMessage("Thank you! Your enquiry has been submitted successfully.");

      const whatsappNumber = "919876543210";
      const whatsappText =
        `New enquiry from ${payload.name}. ` +
        `Service: ${payload.service}. ` +
        `Phone: ${payload.phone}.`;

      window.open(
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`,
        "_blank"
      );
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    } finally {
      setFormLoading(false);
    }
  }

  function sendChatMessage() {
    const message = chatMessage.trim();
    if (!message) return;

    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: message },
    ]);

    setChatMessage("");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            "Thanks! I can help you with SEO, website development, Google visibility, social media, PPC and digital growth. For a personalized strategy, submit your enquiry and our team will contact you.",
        },
      ]);
    }, 700);
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  function openPaymentModal(planId: PaymentPlan["id"]) {
    const plan = paymentPlans.find((item) => item.id === planId);
    if (!plan) return;

    setSelectedPaymentPlan(plan);
    setPaymentName("");
    setPaymentEmail("");
    setPaymentPhone("");
    setPaymentError("");
    setPaymentOpen(true);
  }

  function closePaymentModal() {
    if (paymentLoading) return;
    setPaymentOpen(false);
    setPaymentError("");
  }

  async function startPayUPayment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedPaymentPlan) {
      setPaymentError("Please select a package.");
      return;
    }

    const name = paymentName.trim();
    const email = paymentEmail.trim();
    const phone = paymentPhone.trim();

    if (!name || !email || !phone) {
      setPaymentError("Please fill in your name, email and mobile number.");
      return;
    }

    setPaymentLoading(true);
    setPaymentError("");

    try {
      const response = await fetch("/api/payu/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPaymentPlan.id,
          firstname: name,
          email,
          phone,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Unable to start PayU payment.");
      }

      const payment = result?.data;
      if (!payment?.action) {
        throw new Error("Payment gateway URL was not returned.");
      }

      const form = document.createElement("form");
      form.method = "POST";
      form.action = payment.action;
      form.style.display = "none";

      const fields: Record<string, string> = {
        key: String(payment.key ?? ""),
        txnid: String(payment.txnid ?? ""),
        amount: String(payment.amount ?? selectedPaymentPlan.amount),
        productinfo: String(payment.productinfo ?? selectedPaymentPlan.name),
        firstname: String(payment.firstname ?? name),
        email: String(payment.email ?? email),
        phone: String(payment.phone ?? phone),
        surl: String(payment.surl ?? ""),
        furl: String(payment.furl ?? ""),
        hash: String(payment.hash ?? ""),
      };

      Object.entries(fields).forEach(([k, v]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = v;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("PAYU PAYMENT ERROR:", error);
      setPaymentError(
        error instanceof Error ? error.message : "Unable to start payment. Please try again."
      );
      setPaymentLoading(false);
    }
  }

  function choosePackage(packageName: string) {
    const section = document.getElementById("contact");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }

    setTimeout(() => {
      const serviceSelect = document.querySelector(
        'select[name="service"]'
      ) as HTMLSelectElement | null;

      if (serviceSelect) {
        serviceSelect.value = packageName;
        serviceSelect.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, 500);
  }

  const flywheelData = [
    {
      title: "Stage 01: Acquisition",
      desc: "Drive targeted organic search, Google Ads PPC, and local map discovery to capture high-intent buyers.",
    },
    {
      title: "Stage 02: Pipeline",
      desc: "Generate qualified phone leads, high-intent enquiries, and automated WhatsApp conversations.",
    },
    {
      title: "Stage 03: AI Intelligence",
      desc: "Generative Engine Optimization (GEO) ensuring ChatGPT, Perplexity & Gemini recommend your brand.",
    },
    {
      title: "Stage 04: Revenue",
      desc: "Measure attributable revenue, closed deals, and compound ROI across every digital rupee spent.",
    },
  ];

  const pillarData = [
    {
      prehead: "PILLAR 01 • PROPRIETARY PLATFORM",
      heading: "Attributable ROI From Every Marketing Channel",
      bullets: [
        "We integrate automated WhatsApp enquiry routing and lead management with zero technical effort required from your end.",
        "Every marketing rupee spent is tied directly to pipeline and revenue so you get total transparency on ROI.",
        "Businesses who implement our full conversion infrastructure experience an average of 15% to 40% higher lead close rates.",
      ],
    },
    {
      prehead: "PILLAR 02 • STRATEGIC EXECUTION",
      heading: "Specialist Teams Driving High-Intent Pipeline",
      bullets: [
        "Your dedicated team comprises channel specialists in Google Search, Meta Ads, and Conversion Rate Optimization.",
        "We prioritize revenue-producing keywords over high-volume vanity terms that never convert.",
        "Bi-weekly performance sprint calls keep you 100% informed on actions taken and new revenue booked.",
      ],
    },
    {
      prehead: "PILLAR 03 • AI INTELLIGENCE (GEO)",
      heading: "Generative Engine Optimization For Tomorrow's Search",
      bullets: [
        "Algorithms analyze search patterns across AI models (ChatGPT, Copilot, Perplexity, Gemini).",
        "Entity authority structuring ensures AI engines cite and recommend your brand first.",
        "Predictive keyword forecasting helps you capitalize on seasonal demand weeks ahead of competitors.",
      ],
    },
  ];

  return (
    <>
      <DigitalFXIntro />

      {/* ==========================================================================
          WEBFX SIGNATURE GLOBAL CSS & TYPOGRAPHY
          ========================================================================== */}
      <style jsx global>{`
        :root {
          --fx-blue: #207de9;
          --fx-blue-hover: #1a6bc7;
          --fx-navy: #080d24;
          --fx-dark: #0f172a;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          background-color: #ffffff;
          color: #101828;
          font-family: var(--font-manrope), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* WebFX Signature Editorial Italic Serif Accent */
        .webfx-serif {
          font-family: Georgia, 'Times New Roman', Cambria, serif !important;
          font-style: italic !important;
          font-weight: 400 !important;
          letter-spacing: -0.015em !important;
        }

        /* Subtle Radar Breathing */
        @keyframes radarBreathing {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.025); opacity: 0.35; }
        }

        @keyframes beamFlowActive {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes pulseDotEmerald {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); }
          50% { transform: scale(1.2); box-shadow: 0 0 0 7px rgba(16, 185, 129, 0); }
        }

        .pulse-orbit-1 { transform-origin: center; animation: radarBreathing 7s ease-in-out infinite; }
        .pulse-orbit-2 { transform-origin: center; animation: radarBreathing 9s ease-in-out infinite 1s; }
        .pulse-orbit-3 { transform-origin: center; animation: radarBreathing 11s ease-in-out infinite 2s; }

        .pulse-emerald {
          animation: pulseDotEmerald 2.2s infinite cubic-bezier(0.4, 0, 0.6, 1);
        }

        .active-spoke-flow {
          stroke-dasharray: 6 4 !important;
          stroke-width: 2.5px !important;
          animation: beamFlowActive 1s linear infinite !important;
          opacity: 1 !important;
        }

        .hover-lift {
          transition: all 0.24s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 35px -8px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(32, 125, 233, 0.25);
        }

        .gradient-closer-cta {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(32, 125, 233, 0.12) 100%);
        }
      `}</style>

      <main className={`${manrope.variable} min-h-screen overflow-x-hidden font-[var(--font-manrope)] text-[#101828] antialiased`}>

        {/* ==========================================================================
            1. WEBFX TOP BAR (#fxtopbar)
            ========================================================================== */}
        <div id="fxtopbar" className="hidden bg-[#080d24] text-white py-2 border-b border-white/10 md:block">
          <div className="mx-auto flex h-[34px] max-w-[1360px] items-center justify-between px-6 lg:px-10 text-xs">
            
            {/* Live Client Revenue Metric */}
            <a href="#case-studies" className="flex items-center gap-2.5 group">
              <span className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-slate-400 group-hover:text-slate-200 transition">
                REVENUE DRIVEN FOR OUR CLIENTS
              </span>
              <span className="flex items-center gap-1.5 font-black text-white text-[13px] bg-white/10 px-2.5 py-0.5 rounded border border-white/15">
                <span className="text-[#207de9]">📈</span>
                <span className="text-emerald-400">₹12,485,350+</span>
              </span>
            </a>

            {/* Direct Phone, WhatsApp & Proposal */}
            <div className="flex items-center gap-6 text-[12px] font-medium text-slate-300">
              <span className="hidden lg:flex items-center gap-1.5 text-slate-400">
                <span className="text-emerald-400">●</span> Ghaziabad & NCR, India
              </span>
              <a href="tel:+919876543210" className="flex items-center gap-1.5 hover:text-white font-bold transition">
                <span className="text-[#207de9]">☎</span> +91 98765 43210
              </a>
              <a
                href="https://wa.me/919876543210?text=Hi%20Digital%20FX%20team,%20I%20want%20to%20discuss%20a%20growth%20strategy."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-bold text-emerald-400 hover:text-emerald-300 transition"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-emerald inline-block" />
                WhatsApp Us
              </a>
              <a
                href="#contact"
                className="bg-[#207de9] hover:bg-[#1a6bc7] text-white px-3.5 py-1 rounded font-bold text-[11.5px] transition"
              >
                Get a Proposal
              </a>
            </div>

          </div>
        </div>

        {/* ==========================================================================
            2. WEBFX MAIN HEADER & NAVIGATION (#fxheader)
            ========================================================================== */}
        <header id="fxheader" className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs transition-all">
          <div className="mx-auto flex h-[76px] max-w-[1360px] items-center justify-between px-6 lg:px-10">

            {/* Brand Logo with WebFX Subtitle */}
            <a href="#home" className="flex items-center gap-3.5 group">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#080d24] to-[#207de9] text-white font-black text-xl shadow-sm transition-transform group-hover:scale-105">
                FX
              </div>
              <div>
                <div className="text-[23px] font-black leading-none tracking-[-0.04em] text-[#080d24]">
                  DIGITAL <span className="text-[#207de9]">FX</span>
                </div>
                <div className="mt-1 text-[8.5px] font-extrabold uppercase tracking-[2px] text-slate-500">
                  Digital Marketing That Drives Revenue®
                </div>
              </div>
            </a>

            {/* Desktop Nav Links */}
            <nav className="hidden xl:flex items-center gap-7 text-[14px] font-bold text-[#222]">
              <a href="#services" className="hover:text-[#207de9] transition flex items-center gap-1">
                <span>Services</span>
                <span className="text-[10px] text-slate-400">▾</span>
              </a>
              <a href="#growth-dashboard" className="hover:text-[#207de9] transition flex items-center gap-1.5">
                <span>Revenue Engine 360°</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-[#207de9] text-[9px] font-black">PRO</span>
              </a>
              <a href="#geo-checker" className="hover:text-[#207de9] transition flex items-center gap-1.5">
                <span>GEO AI Audit</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-black">FREE</span>
              </a>
              <a href="#comparison" className="hover:text-[#207de9] transition">
                Why Revenue Marketing
              </a>
              <a href="#pricing" className="hover:text-[#207de9] transition">
                Pricing
              </a>
              <a href="#case-studies" className="hover:text-[#207de9] transition">
                Results & Proof
              </a>
              <a href="#contact" className="hover:text-[#207de9] transition">
                Contact
              </a>
            </nav>

            {/* Right Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <a href="tel:+919876543210" className="flex flex-col text-right">
                <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">Direct Consultation</span>
                <span className="text-[14px] font-black text-[#080d24]">+91 98765 43210</span>
              </a>
              <a
                href="#pricing"
                className="flex h-[42px] items-center gap-2 rounded bg-[#207de9] hover:bg-[#1a6bc7] px-5 text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(32,125,233,0.25)] transition hover:-translate-y-0.5"
              >
                <span>Get My Free Proposal</span>
                <span>→</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="xl:hidden flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-xs hover:border-[#207de9]"
            >
              <span className="flex flex-col gap-[5px]">
                <span className="h-[2px] w-5 bg-slate-800 rounded-full" />
                <span className="h-[2px] w-5 bg-slate-800 rounded-full" />
                <span className="h-[2px] w-3 bg-[#207de9] rounded-full ml-auto" />
              </span>
            </button>

          </div>
        </header>

        {/* ==========================================================================
            MOBILE MENU DRAWER
            ========================================================================== */}
        {mobileOpen && (
          <>
            <button
              type="button"
              onClick={closeMobileMenu}
              className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-xs"
            />
            <aside className="fixed right-0 top-0 z-[70] h-full w-[86%] max-w-[400px] border-l border-slate-200 bg-white shadow-2xl flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#207de9] text-white flex items-center justify-center font-black">
                      FX
                    </div>
                    <div>
                      <p className="text-lg font-black text-[#080d24]">
                        DIGITAL <span className="text-[#207de9]">FX</span>
                      </p>
                      <p className="text-[8.5px] font-bold tracking-[1.8px] text-slate-400 uppercase">
                        Digital Marketing Agency
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeMobileMenu}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <nav className="mt-6 space-y-1">
                  {[
                    ["Home", "#home"],
                    ["Services", "#services"],
                    ["Revenue Engine 360°", "#growth-dashboard"],
                    ["Why Revenue Marketing", "#comparison"],
                    ["Pricing Packages", "#pricing"],
                    ["Free GEO AI Score", "#geo-checker"],
                    ["Results & Proof", "#case-studies"],
                    ["Contact Strategy Team", "#contact"],
                  ].map(([name, href]) => (
                    <a
                      key={name}
                      href={href}
                      onClick={closeMobileMenu}
                      className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-[#207de9] transition"
                    >
                      <span>{name}</span>
                      <span>→</span>
                    </a>
                  ))}
                </nav>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <a
                  href="#pricing"
                  onClick={closeMobileMenu}
                  className="block w-full rounded-xl bg-[#207de9] py-3.5 text-center text-sm font-black text-white shadow-md hover:bg-[#1a6bc7]"
                >
                  View Packages & Pricing →
                </a>
              </div>
            </aside>
          </>
        )}

        {/* ==========================================================================
            3. WEBFX HERO SECTION (2-Column: Copy + Proposal Form / Flywheel)
            ========================================================================== */}
        <section
          id="home"
          className="relative overflow-hidden bg-gradient-to-b from-[#f8faff] via-white to-[#f4f7fb] pt-12 lg:pt-16 pb-20 border-b border-slate-200"
        >
          {/* Blueprint Grid Overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(#080d24 1px, transparent 1px), linear-gradient(90deg, #080d24 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative mx-auto grid max-w-[1360px] items-center gap-12 px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-10">
            
            {/* Left Column: WebFX Copy & Proposal Form */}
            <div>
              
              {/* Overline Badge */}
              <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-blue-200/80 bg-blue-50 px-3.5 py-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#207de9] pulse-emerald" />
                <span className="text-[11px] font-black uppercase tracking-[2px] text-[#207de9]">
                  DIGITAL FX GROWTH AGENCY • GHAZIABAD
                </span>
              </div>

              {/* WebFX Signature Headline (Grotesk + Georgia Italic Accent) */}
              <h1 className="max-w-[760px] text-[44px] sm:text-[58px] lg:text-[68px] font-black leading-[1.03] tracking-[-0.045em] text-[#080d24]">
                Your Revenue Growth Partner{" "}
                <span className="webfx-serif text-[#207de9] block mt-1 font-normal">
                  in the AI Era.
                </span>
              </h1>

              <p className="mt-6 max-w-[620px] text-[17px] sm:text-[19px] leading-[1.6] text-[#475467] font-normal">
                For business leaders and marketing teams who need to prove revenue impact, not just report vanity clicks. Digital FX connects expert execution, AI search optimization (GEO), and high-converting infrastructure to drive measurable growth in 2026 and beyond.
              </p>

              {/* WebFX Proposal / Website Input Form */}
              <div className="mt-8 max-w-[580px] rounded-xl border border-slate-300/80 bg-white p-2 shadow-[0_12px_32px_-6px_rgba(32,125,233,0.12)]">
                <form onSubmit={handleHeroAuditSubmit} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={geoWebsite}
                    onChange={(e) => setGeoWebsite(e.target.value)}
                    placeholder="Enter your website (e.g. yourbusiness.com)"
                    required
                    className="flex-1 px-4 py-3 text-[15px] font-medium text-slate-800 placeholder-slate-400 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#207de9]/30"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-[#207de9] hover:bg-[#1a6bc7] px-6 py-3 text-[14px] font-extrabold text-white flex items-center justify-center gap-2 whitespace-nowrap shadow-sm transition"
                  >
                    <span>Get My Proposal</span>
                    <span>→</span>
                  </button>
                </form>
              </div>

              {/* Micro-Trust Markers */}
              <div className="mt-4 flex flex-wrap items-center gap-5 text-[12px] font-semibold text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <span className="text-emerald-500">✓</span> Free 60-Second Instant Audit
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-blue-500">✓</span> 1,200+ Growth Signals Evaluated
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-slate-400">✓</span> No Credit Card Required
                </span>
              </div>

              {/* Social Proof Numbers */}
              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-slate-200 pt-7 max-w-[540px]">
                <div>
                  <p className="text-[32px] sm:text-[36px] font-black text-[#080d24] tracking-tight leading-none">
                    ₹12.4Cr+
                  </p>
                  <p className="text-[12px] font-bold text-slate-500 mt-1.5">
                    Client Revenue Driven
                  </p>
                </div>
                <div>
                  <p className="text-[32px] sm:text-[36px] font-black text-[#080d24] tracking-tight leading-none">
                    350+
                  </p>
                  <p className="text-[12px] font-bold text-slate-500 mt-1.5">
                    Projects Delivered
                  </p>
                </div>
                <div>
                  <p className="text-[32px] sm:text-[36px] font-black text-[#207de9] tracking-tight leading-none">
                    4.9 / 5
                  </p>
                  <p className="text-[12px] font-bold text-slate-500 mt-1.5">
                    Rating (150+ Reviews)
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: WebFX Revenue Flywheel & Central Hub */}
            <div className="flex justify-center">
              <div className="w-full max-w-[480px] rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.1)] relative">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#207de9]" />
                    <span className="text-xs font-black uppercase tracking-[1.5px] text-[#080d24]">
                      Digital FX Revenue Flywheel
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-emerald" />
                    LIVE ENGINE
                  </span>
                </div>

                {/* 4-Quadrant Visual Container */}
                <div className="relative w-[300px] sm:w-[340px] h-[300px] sm:h-[340px] mx-auto">
                  
                  {/* Concentric Orbit Circles */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 340 340">
                    <circle cx="170" cy="170" r="160" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" className="pulse-orbit-3" />
                    <circle cx="170" cy="170" r="120" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="6 4" className="pulse-orbit-2" />
                    <circle cx="170" cy="170" r="80" fill="none" stroke="#93c5fd" strokeWidth="1.5" className="pulse-orbit-1" />
                  </svg>

                  {/* Quadrant 0: Acquisition */}
                  <div
                    onMouseEnter={() => setActiveFlywheelQuadrant(0)}
                    className={`flywheel-quadrant absolute top-2 left-2 w-[140px] h-[140px] bg-gradient-to-br from-[#207de9] to-[#1a6bc7] rounded-tl-[90px] rounded-tr-md rounded-bl-md rounded-br-md p-3.5 text-white flex flex-col justify-start shadow-md cursor-pointer transition hover:scale-105 ${
                      activeFlywheelQuadrant === 0 ? "ring-2 ring-blue-300" : ""
                    }`}
                  >
                    <span className="text-[9px] font-black uppercase tracking-wider text-blue-100">STAGE 01</span>
                    <span className="text-sm font-black mt-1">Acquisition</span>
                    <span className="text-[10px] text-blue-100/90 leading-tight mt-0.5">SEO & Paid Ads</span>
                  </div>

                  {/* Quadrant 1: Pipeline */}
                  <div
                    onMouseEnter={() => setActiveFlywheelQuadrant(1)}
                    className={`flywheel-quadrant absolute top-2 right-2 w-[140px] h-[140px] bg-gradient-to-bl from-[#4dc1b9] to-[#259b93] rounded-tr-[90px] rounded-tl-md rounded-br-md rounded-bl-md p-3.5 text-white flex flex-col items-end text-right shadow-md cursor-pointer transition hover:scale-105 ${
                      activeFlywheelQuadrant === 1 ? "ring-2 ring-teal-300" : ""
                    }`}
                  >
                    <span className="text-[9px] font-black uppercase tracking-wider text-teal-100">STAGE 02</span>
                    <span className="text-sm font-black mt-1">Pipeline</span>
                    <span className="text-[10px] text-teal-100/90 leading-tight mt-0.5">Qualified Leads</span>
                  </div>

                  {/* Quadrant 2: AI Intelligence */}
                  <div
                    onMouseEnter={() => setActiveFlywheelQuadrant(2)}
                    className={`flywheel-quadrant absolute bottom-2 left-2 w-[140px] h-[140px] bg-gradient-to-tr from-[#af3fac] to-[#882585] rounded-bl-[90px] rounded-tl-md rounded-br-md rounded-tr-md p-3.5 text-white flex flex-col justify-end shadow-md cursor-pointer transition hover:scale-105 ${
                      activeFlywheelQuadrant === 2 ? "ring-2 ring-purple-300" : ""
                    }`}
                  >
                    <span className="text-[9px] font-black uppercase tracking-wider text-purple-100">STAGE 03</span>
                    <span className="text-sm font-black mt-1">AI Intelligence</span>
                    <span className="text-[10px] text-purple-100/90 leading-tight mt-0.5">Smart Decision</span>
                  </div>

                  {/* Quadrant 3: Revenue */}
                  <div
                    onMouseEnter={() => setActiveFlywheelQuadrant(3)}
                    className={`flywheel-quadrant absolute bottom-2 right-2 w-[140px] h-[140px] bg-gradient-to-tl from-[#41d48c] to-[#1ea864] rounded-br-[90px] rounded-tr-md rounded-bl-md rounded-tl-md p-3.5 text-white flex flex-col items-end text-right justify-end shadow-md cursor-pointer transition hover:scale-105 ${
                      activeFlywheelQuadrant === 3 ? "ring-2 ring-emerald-300" : ""
                    }`}
                  >
                    <span className="text-[9px] font-black uppercase tracking-wider text-emerald-100">STAGE 04</span>
                    <span className="text-sm font-black mt-1">Revenue</span>
                    <span className="text-[10px] text-emerald-100/90 leading-tight mt-0.5">Compound ROI</span>
                  </div>

                  {/* Center Core */}
                  <div className="absolute inset-0 m-auto w-[120px] h-[120px] rounded-full bg-[#080d24] text-white p-3 flex flex-col items-center justify-center text-center shadow-xl border-4 border-white z-20">
                    <span className="text-[8px] font-black text-blue-300 tracking-widest uppercase">DIGITAL FX</span>
                    <span className="text-[12px] font-black leading-tight mt-0.5">Revenue Engine</span>
                    <span className="text-[10px] font-extrabold text-emerald-400 mt-1">+184% ROI</span>
                  </div>

                </div>

                {/* Dynamic Info for Selected Quadrant */}
                <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <span className="font-bold text-[#080d24]">
                    {flywheelData[activeFlywheelQuadrant].title}
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    {flywheelData[activeFlywheelQuadrant].desc}
                  </p>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ==========================================================================
            4. CLIENT TRUST & AUTHORITY STRIP (WebFX Partner Bar)
            ========================================================================== */}
        <section className="bg-white py-10 border-b border-slate-200">
          <div className="max-w-[1360px] mx-auto px-6">
            <p className="text-center text-[11px] font-black uppercase tracking-[2.4px] text-slate-400 mb-8">
              TRUSTED BY 250+ GROWTH-FOCUSED BRANDS & INDUSTRY LEADERS
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center justify-center text-center">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col items-center justify-center hover-lift">
                <span className="text-xl font-black text-[#4285F4]">Google</span>
                <span className="text-[10px] font-extrabold uppercase text-slate-500 mt-1 tracking-wider">Premier Partner</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col items-center justify-center hover-lift">
                <span className="text-xl font-black text-[#0081FB]">Meta</span>
                <span className="text-[10px] font-extrabold uppercase text-slate-500 mt-1 tracking-wider">Certified Agency</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col items-center justify-center hover-lift">
                <span className="text-xl font-black text-[#101828]">Clutch</span>
                <span className="text-[10px] font-extrabold uppercase text-amber-600 mt-1 tracking-wider">★ 4.9 Top Rated</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col items-center justify-center hover-lift">
                <span className="text-xl font-black text-[#FF6600]">Justdial</span>
                <span className="text-[10px] font-extrabold uppercase text-slate-500 mt-1 tracking-wider">5.0★ Verified</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col items-center justify-center hover-lift col-span-2 md:col-span-1">
                <span className="text-xl font-black text-[#207de9]">ISO 9001</span>
                <span className="text-[10px] font-extrabold uppercase text-slate-500 mt-1 tracking-wider">Quality Certified</span>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            5. WEBFX COMPARISON: "Move From Clicks to Revenue"
            ========================================================================== */}
        <section id="comparison" className="py-24 bg-[#f8faff] border-b border-slate-200">
          <div className="max-w-[1360px] mx-auto px-6">
            
            <div className="text-center max-w-[820px] mx-auto mb-14">
              <span className="text-[11px] font-black uppercase tracking-[2px] text-[#207de9] bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full">
                THE WEBFX REVENUE PHILOSOPHY
              </span>
              <h2 className="mt-4 text-[34px] sm:text-[46px] lg:text-[52px] font-black text-[#080d24] tracking-[-0.04em] leading-[1.08]">
                Move From Marketing That Reports Clicks to
                <span className="webfx-serif text-[#207de9] block font-normal mt-1">
                  Marketing That Reports Revenue.
                </span>
              </h2>
              <p className="mt-4 text-[16px] text-slate-600 font-normal">
                Traditional marketing optimizes for channel vanity metrics. Revenue marketing optimizes for business bottom line. Connected revenue marketing through Digital FX leads to <strong className="text-slate-900">1.8X faster lead growth than industry average</strong>.
              </p>
            </div>

            {/* Side-by-Side Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1060px] mx-auto">
              
              {/* Traditional Agency */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-rose-500">THE OLD WAY</span>
                    <h3 className="text-2xl font-black text-slate-800 mt-1">Traditional Agency</h3>
                  </div>
                  <span className="w-9 h-9 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-black text-lg">
                    ✕
                  </span>
                </div>

                <ul className="mt-6 space-y-4 text-[14.5px] text-slate-600">
                  <li className="flex items-start gap-3">
                    <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                    <span>Reports on impressions, click counts and vanity page views with no sales link.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                    <span>Isolated campaigns run in silos (SEO team doesn't talk to Web dev or Ads).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                    <span>Slow monthly PDF reports delivered weeks after the month has already ended.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                    <span>Ignores new AI Search engines (ChatGPT, Perplexity, Google AI Overviews).</span>
                  </li>
                </ul>

                <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-500">
                  Outcome: Wasted ad spend, unclear returns, and high frustration.
                </div>
              </div>

              {/* Digital FX Revenue Engine */}
              <div className="bg-white rounded-3xl p-8 border-2 border-[#207de9] shadow-[0_20px_45px_-10px_rgba(32,125,233,0.18)] relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#207de9] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">
                  RECOMMENDED
                </div>

                <div className="flex items-center justify-between border-b border-blue-50 pb-5">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-[#207de9]">THE DIGITAL FX WAY</span>
                    <h3 className="text-2xl font-black text-[#080d24] mt-1">Revenue Marketing Engine</h3>
                  </div>
                  <span className="w-9 h-9 rounded-full bg-blue-50 text-[#207de9] flex items-center justify-center font-black text-lg">
                    ✓
                  </span>
                </div>

                <ul className="mt-6 space-y-4 text-[14.5px] text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                    <span><strong>Closed-Loop Attribution:</strong> Connects every lead directly to your WhatsApp, phone & CRM.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                    <span><strong>AI Search Dominance (GEO):</strong> Optimizes your business to be recommended by AI assistants.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                    <span><strong>Transparent ROI Tracking:</strong> Live dashboard with actionable visibility and pipeline reporting.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                    <span><strong>Dedicated Multi-Discipline Team:</strong> SEO, PPC, Copywriting, Web dev working as one unit.</span>
                  </li>
                </ul>

                <div className="mt-8 p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs font-bold text-[#083a74] flex items-center justify-between">
                  <span>Outcome: +184% Average Verified Client Revenue Growth</span>
                  <a href="#pricing" className="text-[#207de9] hover:underline font-extrabold">Explore Plans →</a>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ==========================================================================
            6. WEBFX ROTATING 3 PILLARS ("Uniquely Positioned to Power Real Revenue Growth")
            ========================================================================== */}
        <section className="py-24 bg-white border-b border-slate-200">
          <div className="max-w-[1360px] mx-auto px-6">
            
            <div className="text-center max-w-[820px] mx-auto mb-14">
              <span className="text-[11px] font-black uppercase tracking-[2px] text-[#207de9] bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full">
                CONNECTED GROWTH ARCHITECTURE
              </span>
              <h2 className="mt-4 text-[34px] sm:text-[46px] lg:text-[52px] font-black text-[#080d24] tracking-[-0.04em] leading-[1.08]">
                Uniquely Positioned to
                <span className="webfx-serif text-[#207de9] block font-normal mt-1">
                  Power Real Revenue Growth.
                </span>
              </h2>
              <p className="mt-4 text-[16px] text-slate-600 font-normal">
                Every result our digital marketing agency delivers is powered by three connected pillars — proprietary technology, strategic expert execution, and AI-powered intelligence.
              </p>
            </div>

            {/* 3 Tabs with mobile-friendly horizontal scroll */}
            <div className="flex overflow-x-auto justify-start sm:justify-center max-w-[720px] mx-auto mb-10 border-b border-slate-200 gap-1 sm:gap-0 pb-1 sm:pb-0">
              {["01 Revenue Platform", "02 Strategic Execution", "03 AI Intelligence (GEO)"].map(
                (tabLabel, idx) => (
                  <button
                    key={tabLabel}
                    onClick={() => setActivePillarTab(idx)}
                    className={`whitespace-nowrap px-4 pb-4 text-center font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 border-b-2 shrink-0 sm:flex-1 ${
                      activePillarTab === idx
                        ? "text-[#207de9] border-[#207de9]"
                        : "text-slate-500 hover:text-slate-900 border-transparent"
                    }`}
                  >
                    {tabLabel}
                  </button>
                )
              )}
            </div>

            {/* Active Pillar Card */}
            <div className="bg-[#f8faff] rounded-3xl p-8 sm:p-12 border border-slate-200 max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <span className="text-[11px] font-black uppercase tracking-[2px] text-[#207de9]">
                  {pillarData[activePillarTab].prehead}
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-[#080d24] mt-2 tracking-tight">
                  {pillarData[activePillarTab].heading}
                </h3>
                <ul className="mt-6 space-y-4 text-[15px] text-slate-700">
                  {pillarData[activePillarTab].bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#207de9] mt-2 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <a
                    href="#pricing"
                    className="bg-[#207de9] hover:bg-[#1a6bc7] text-white px-6 py-3 rounded-lg text-sm font-extrabold inline-flex items-center gap-2 transition"
                  >
                    <span>View Packages & Pricing</span>
                    <span>→</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
                <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                  LIVE SYSTEM TELEMETRY
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">Lead Funnel Speed</span>
                    <span className="text-sm font-black text-emerald-600">&lt; 1.2s</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">WhatsApp Lead Sync</span>
                    <span className="text-sm font-black text-emerald-600">100% Automated</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">PayU Payment Integration</span>
                    <span className="text-sm font-black text-[#207de9]">Active & Instant</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ==========================================================================
            7. 360° GROWTH ENGINE RADAR INFOGRAPHIC SECTION
            ========================================================================== */}
        <section id="growth-dashboard" className="py-24 bg-[#ede9e1] border-b border-slate-300 relative overflow-hidden">
          <div className="max-w-[1360px] mx-auto px-6 relative z-10">
            
            <div className="text-center max-w-[820px] mx-auto mb-14">
              <span className="text-[11px] font-black uppercase tracking-[2px] text-[#207de9] bg-white px-3.5 py-1.5 rounded-full border border-slate-300">
                GROWTH ENGINE 360° STRATEGY
              </span>
              <h2 className="mt-4 text-[34px] sm:text-[46px] lg:text-[52px] font-black text-[#080d24] tracking-[-0.04em] leading-[1.08]">
                One Connected System.
                <span className="webfx-serif text-[#207de9] block font-normal mt-1">
                  Built To Scale Your Business.
                </span>
              </h2>
              <p className="mt-4 text-[16px] text-slate-600 font-normal">
                Hover over any growth pillar on the left to see the radar orbital nodes dynamically synchronize and activate the connecting spoke lines.
              </p>
            </div>

            {/* Grid: 4 Left Cards + Right Radar Diagram */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column: 4 Feature Pillar Cards */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                
                <div
                  onMouseEnter={() => setActiveGrowthPillar("visibility")}
                  onMouseLeave={() => setActiveGrowthPillar(null)}
                  className={`hover-lift bg-white rounded-2xl p-6 border border-black/5 shadow-sm cursor-pointer transition ${
                    activeGrowthPillar === "visibility" ? "ring-2 ring-[#207de9] translate-x-1" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-black text-lg">
                        ◎
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-400">01</span>
                        <h3 className="text-lg font-black text-[#080d24]">Visibility</h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    Get discovered across Google Search, Google Maps, and AI answer engines when customers look for your services.
                  </p>
                </div>

                <div
                  onMouseEnter={() => setActiveGrowthPillar("acquisition")}
                  onMouseLeave={() => setActiveGrowthPillar(null)}
                  className={`hover-lift bg-white rounded-2xl p-6 border border-black/5 shadow-sm cursor-pointer transition ${
                    activeGrowthPillar === "acquisition" ? "ring-2 ring-purple-500 translate-x-1" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-black text-lg">
                        ↗
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-400">02</span>
                        <h3 className="text-lg font-black text-[#080d24]">Acquisition</h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    Targeted Google PPC Ads & Meta advertising funnels that convert cold searchers into warm, qualified prospects.
                  </p>
                </div>

                <div
                  onMouseEnter={() => setActiveGrowthPillar("conversion")}
                  onMouseLeave={() => setActiveGrowthPillar(null)}
                  className={`hover-lift bg-white rounded-2xl p-6 border border-black/5 shadow-sm cursor-pointer transition ${
                    activeGrowthPillar === "conversion" ? "ring-2 ring-emerald-500 translate-x-1" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-lg">
                        ◇
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-400">03</span>
                        <h3 className="text-lg font-black text-[#080d24]">Conversion</h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    Fast, high-converting website pages with direct WhatsApp enquiry buttons and frictionless booking experiences.
                  </p>
                </div>

                <div
                  onMouseEnter={() => setActiveGrowthPillar("insights")}
                  onMouseLeave={() => setActiveGrowthPillar(null)}
                  className={`hover-lift bg-white rounded-2xl p-6 border border-black/5 shadow-sm cursor-pointer transition ${
                    activeGrowthPillar === "insights" ? "ring-2 ring-amber-500 translate-x-1" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-lg">
                        ✦
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-400">04</span>
                        <h3 className="text-lg font-black text-[#080d24]">Insights</h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    Real-time analytics and transparent ROI dashboards to see which channels generate the most profitable customers.
                  </p>
                </div>

              </div>

              {/* Right Radar Canvas */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-md flex flex-col justify-between relative overflow-hidden min-h-[500px]">
                <div className="flex justify-between items-center z-10">
                  <div>
                    <span className="text-[9.5px] font-black uppercase tracking-widest text-[#207de9]">CENTRAL HUB</span>
                    <h4 className="text-base font-black text-[#080d24]">Interactive Strategy Radar</h4>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-emerald" />
                    All 8 Channels Connected
                  </span>
                </div>

                {/* The Radial Orbit Canvas */}
                <div className="relative w-full flex-1 flex items-center justify-center py-6">
                  
                  {/* SVG Rings & Dynamic Spokes */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 450">
                    <circle cx="300" cy="225" r="190" fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="6 6" className="pulse-orbit-3" />
                    <circle cx="300" cy="225" r="130" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" className="pulse-orbit-2" />
                    <circle cx="300" cy="225" r="80" fill="none" stroke="#93c5fd" strokeWidth="1.5" className="pulse-orbit-1" />
                    
                    {/* 8 Spoke Lines */}
                    <line x1="300" y1="225" x2="300" y2="45" stroke={activeGrowthPillar === "visibility" ? "#207de9" : "#93c5fd"} strokeWidth={activeGrowthPillar === "visibility" ? "3" : "1.5"} className={activeGrowthPillar === "visibility" ? "active-spoke-flow" : ""} />
                    <line x1="300" y1="225" x2="465" y2="100" stroke={activeGrowthPillar === "visibility" ? "#207de9" : "#93c5fd"} strokeWidth={activeGrowthPillar === "visibility" ? "3" : "1.5"} className={activeGrowthPillar === "visibility" ? "active-spoke-flow" : ""} />
                    <line x1="300" y1="225" x2="510" y2="225" stroke={activeGrowthPillar === "acquisition" ? "#7c3aed" : "#93c5fd"} strokeWidth={activeGrowthPillar === "acquisition" ? "3" : "1.5"} className={activeGrowthPillar === "acquisition" ? "active-spoke-flow" : ""} />
                    <line x1="300" y1="225" x2="465" y2="350" stroke={activeGrowthPillar === "acquisition" ? "#7c3aed" : "#93c5fd"} strokeWidth={activeGrowthPillar === "acquisition" ? "3" : "1.5"} className={activeGrowthPillar === "acquisition" ? "active-spoke-flow" : ""} />
                    <line x1="300" y1="225" x2="300" y2="405" stroke={activeGrowthPillar === "conversion" ? "#10b981" : "#93c5fd"} strokeWidth={activeGrowthPillar === "conversion" ? "3" : "1.5"} className={activeGrowthPillar === "conversion" ? "active-spoke-flow" : ""} />
                    <line x1="300" y1="225" x2="135" y2="350" stroke={activeGrowthPillar === "conversion" ? "#10b981" : "#93c5fd"} strokeWidth={activeGrowthPillar === "conversion" ? "3" : "1.5"} className={activeGrowthPillar === "conversion" ? "active-spoke-flow" : ""} />
                    <line x1="300" y1="225" x2="90" y2="225" stroke={activeGrowthPillar === "insights" ? "#ea580c" : "#93c5fd"} strokeWidth={activeGrowthPillar === "insights" ? "3" : "1.5"} className={activeGrowthPillar === "insights" ? "active-spoke-flow" : ""} />
                    <line x1="300" y1="225" x2="135" y2="100" stroke={activeGrowthPillar === "insights" ? "#ea580c" : "#93c5fd"} strokeWidth={activeGrowthPillar === "insights" ? "3" : "1.5"} className={activeGrowthPillar === "insights" ? "active-spoke-flow" : ""} />
                  </svg>

                  {/* Central Hub */}
                  <div className="relative z-20 w-[140px] h-[140px] rounded-full bg-[#080d24] text-white p-4 flex flex-col items-center justify-center text-center shadow-2xl border-4 border-white">
                    <span className="text-[8px] font-black text-blue-300 tracking-widest uppercase">DFX CORE</span>
                    <span className="text-sm font-black leading-tight mt-0.5">Growth Engine</span>
                    <span className="text-[9.5px] font-bold text-slate-300">360° Strategy</span>
                  </div>

                  {/* 8 Satellite Nodes */}
                  <div className={`absolute top-3 left-1/2 -translate-x-1/2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm text-[11px] font-bold text-slate-800 z-10 transition ${activeGrowthPillar === "visibility" ? "ring-2 ring-[#207de9] scale-110" : ""}`}>
                    🔍 SEARCH / SEO
                  </div>
                  <div className={`absolute top-14 right-6 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm text-[11px] font-bold text-slate-800 z-10 transition ${activeGrowthPillar === "visibility" ? "ring-2 ring-[#207de9] scale-110" : ""}`}>
                    📍 LOCAL MAPS
                  </div>
                  <div className={`absolute top-1/2 right-2 -translate-y-1/2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm text-[11px] font-bold text-slate-800 z-10 transition ${activeGrowthPillar === "acquisition" ? "ring-2 ring-purple-600 scale-110" : ""}`}>
                    🚀 PAID ADS
                  </div>
                  <div className={`absolute bottom-14 right-6 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm text-[11px] font-bold text-slate-800 z-10 transition ${activeGrowthPillar === "acquisition" ? "ring-2 ring-purple-600 scale-110" : ""}`}>
                    📱 SOCIAL MEDIA
                  </div>
                  <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm text-[11px] font-bold text-slate-800 z-10 transition ${activeGrowthPillar === "conversion" ? "ring-2 ring-emerald-600 scale-110" : ""}`}>
                    💻 WEB DEV
                  </div>
                  <div className={`absolute bottom-14 left-6 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm text-[11px] font-bold text-slate-800 z-10 transition ${activeGrowthPillar === "conversion" ? "ring-2 ring-emerald-600 scale-110" : ""}`}>
                    💬 WHATSAPP FUNNELS
                  </div>
                  <div className={`absolute top-1/2 left-2 -translate-y-1/2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm text-[11px] font-bold text-slate-800 z-10 transition ${activeGrowthPillar === "insights" ? "ring-2 ring-amber-600 scale-110" : ""}`}>
                    🧠 GEO AI SEARCH
                  </div>
                  <div className={`absolute top-14 left-6 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm text-[11px] font-bold text-slate-800 z-10 transition ${activeGrowthPillar === "insights" ? "ring-2 ring-amber-600 scale-110" : ""}`}>
                    📊 ANALYTICS
                  </div>

                </div>

                {/* Bottom Strip */}
                <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-100 text-center text-[10px] font-bold text-slate-500">
                  <div><span className="text-[#207de9]">01</span> Search</div>
                  <div><span className="text-teal-600">02</span> Local</div>
                  <div><span className="text-purple-600">03</span> Social</div>
                  <div><span className="text-emerald-600">04</span> Conversion</div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ==========================================================================
            8. WEBFX 4-STAGE SERVICES FUNNEL MATRIX
            ========================================================================== */}
        <section id="services" className="py-24 bg-white border-b border-slate-200">
          <div className="max-w-[1360px] mx-auto px-6">
            
            <div className="text-center max-w-[820px] mx-auto mb-16">
              <span className="text-[11px] font-black uppercase tracking-[2px] text-[#207de9] bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full">
                COMPREHENSIVE SERVICE SUITE
              </span>
              <h2 className="mt-4 text-[34px] sm:text-[46px] lg:text-[52px] font-black text-[#080d24] tracking-[-0.04em] leading-[1.08]">
                Explore Full-Funnel Services
                <span className="webfx-serif text-[#207de9] block font-normal mt-1">
                  Built For Measurable ROI.
                </span>
              </h2>
              <p className="mt-4 text-[16px] text-slate-600 font-normal">
                From top-of-funnel brand visibility to closed-loop revenue reporting, we handle every stage of your digital journey.
              </p>
            </div>

            {/* 4 Stages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white rounded-2xl p-6 border-t-4 border-t-[#207de9] border border-slate-200 shadow-sm hover-lift">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#207de9]">STAGE 01</span>
                <h3 className="text-xl font-black text-[#080d24] mt-1 mb-3">Brand Visibility</h3>
                <p className="text-xs text-slate-500 mb-6">Attract organic high-intent prospects through search and maps.</p>
                <ul className="space-y-3 text-xs font-bold text-slate-700">
                  <li className="flex items-center gap-2"><span className="text-[#207de9]">⌕</span> SEO & Keyword Strategy</li>
                  <li className="flex items-center gap-2"><span className="text-[#207de9]">📍</span> Google Business Profile / Maps</li>
                  <li className="flex items-center gap-2"><span className="text-[#207de9]">🧠</span> Generative Engine Optimization (GEO)</li>
                  <li className="flex items-center gap-2"><span className="text-[#207de9]">✎</span> Content Marketing & Blogs</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-6 border-t-4 border-t-[#4dc1b9] border border-slate-200 shadow-sm hover-lift">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#4dc1b9]">STAGE 02</span>
                <h3 className="text-xl font-black text-[#080d24] mt-1 mb-3">Traffic & Ads</h3>
                <p className="text-xs text-slate-500 mb-6">Drive immediate, targeted customer traffic with performance ads.</p>
                <ul className="space-y-3 text-xs font-bold text-slate-700">
                  <li className="flex items-center gap-2"><span className="text-[#4dc1b9]">↗</span> Google Search & Display Ads</li>
                  <li className="flex items-center gap-2"><span className="text-[#4dc1b9]">✦</span> Meta Ads (Facebook & Instagram)</li>
                  <li className="flex items-center gap-2"><span className="text-[#4dc1b9]">📱</span> Social Media Marketing (SMM)</li>
                  <li className="flex items-center gap-2"><span className="text-[#4dc1b9]">🎯</span> Retargeting Campaigns</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-6 border-t-4 border-t-[#af3fac] border border-slate-200 shadow-sm hover-lift">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#af3fac]">STAGE 03</span>
                <h3 className="text-xl font-black text-[#080d24] mt-1 mb-3">Conversion Funnels</h3>
                <p className="text-xs text-slate-500 mb-6">Turn visitors into phone calls, WhatsApp chats, and payments.</p>
                <ul className="space-y-3 text-xs font-bold text-slate-700">
                  <li className="flex items-center gap-2"><span className="text-[#af3fac]">◇</span> High-Speed Website Development</li>
                  <li className="flex items-center gap-2"><span className="text-[#af3fac]">💬</span> WhatsApp Lead Automation</li>
                  <li className="flex items-center gap-2"><span className="text-[#af3fac]">⚡</span> Landing Page CRO Optimization</li>
                  <li className="flex items-center gap-2"><span className="text-[#af3fac]">💳</span> PayU Payment Gateway Setup</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-6 border-t-4 border-t-[#41d48c] border border-slate-200 shadow-sm hover-lift">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#41d48c]">STAGE 04</span>
                <h3 className="text-xl font-black text-[#080d24] mt-1 mb-3">Revenue & Data</h3>
                <p className="text-xs text-slate-500 mb-6">Transparent reporting and continuous compound optimization.</p>
                <ul className="space-y-3 text-xs font-bold text-slate-700">
                  <li className="flex items-center gap-2"><span className="text-[#41d48c]">▥</span> Monthly Performance Reports</li>
                  <li className="flex items-center gap-2"><span className="text-[#41d48c]">📈</span> ROI Attribution Dashboards</li>
                  <li className="flex items-center gap-2"><span className="text-[#41d48c]">🛡</span> Brand Reputation Management</li>
                  <li className="flex items-center gap-2"><span className="text-[#41d48c]">☎</span> Dedicated Account Manager</li>
                </ul>
              </div>

            </div>

            {/* Dynamic Services List from Supabase/Fallback */}
            <div className="mt-16 pt-12 border-t border-slate-200">
              <h3 className="text-xl font-black text-[#080d24] mb-6">All Services & Capabilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {services.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#207de9] transition">
                    <span className="text-xl text-[#207de9] font-bold block mb-1">{item.icon || "✦"}</span>
                    <h4 className="text-sm font-black text-[#080d24]">{item.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ==========================================================================
            9. INTERACTIVE GEO AUDIT SECTION
            ========================================================================== */}
        <section id="geo-checker" className="py-24 bg-[#f8faff] border-b border-slate-200">
          <div className="max-w-[1360px] mx-auto px-6">
            
            <div className="text-center max-w-[820px] mx-auto mb-14">
              <span className="text-[11px] font-black uppercase tracking-[2px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
                AI SEARCH READINESS (FREE TOOL)
              </span>
              <h2 className="mt-4 text-[34px] sm:text-[46px] lg:text-[52px] font-black text-[#080d24] tracking-[-0.04em] leading-[1.08]">
                Is Your Business Ready For
                <span className="webfx-serif text-[#207de9] block font-normal mt-1">
                  The AI Search Era?
                </span>
              </h2>
              <p className="mt-4 text-[16px] text-slate-600 font-normal">
                Check how visible your brand is to ChatGPT, Perplexity, Google Gemini, and AI Overviews.
              </p>
            </div>

            {/* Checker Form Card */}
            <div className="max-w-[800px] mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-lg">
              <form onSubmit={handleGeoCheck} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Website URL *</label>
                    <input
                      type="text"
                      required
                      value={geoWebsite}
                      onChange={(e) => setGeoWebsite(e.target.value)}
                      placeholder="e.g. yourbusiness.com"
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#207de9]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City / Region *</label>
                    <input
                      type="text"
                      required
                      value={geoCity}
                      onChange={(e) => setGeoCity(e.target.value)}
                      placeholder="e.g. Ghaziabad / Delhi NCR"
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#207de9]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Services / Keywords</label>
                  <input
                    type="text"
                    value={geoKeyword}
                    onChange={(e) => setGeoKeyword(e.target.value)}
                    placeholder="e.g. interior designer, dentist, real estate"
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#207de9]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={geoLoading}
                  className="w-full py-4 rounded-xl text-sm font-black text-white bg-[#207de9] hover:bg-[#1a6bc7] disabled:opacity-60 flex items-center justify-center gap-2 shadow-md mt-2 transition"
                >
                  {geoLoading ? "Analyzing Growth Signals (1,200 checkpoints)..." : "Analyze My GEO Score (Free) →"}
                </button>
              </form>

              {geoError && (
                <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
                  {geoError}
                </div>
              )}

              {/* GEO Result Box */}
              {geoResult && (
                <div className="mt-8 pt-8 border-t border-slate-200 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">ANALYSIS COMPLETE</span>
                      <h4 className="text-xl font-black text-[#080d24]">
                        Overall GEO Score:{" "}
                        <span className="text-[#207de9]">
                          {geoResult.score ?? geoResult.overall ?? 84} / 100
                        </span>
                      </h4>
                    </div>
                    <span className="px-4 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-black text-lg">
                      GRADE {geoResult.grade ?? "A"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <span className="text-[9px] font-bold text-slate-500 uppercase">AI Visibility</span>
                      <span className="block text-lg font-black text-[#080d24] mt-1">
                        {geoResult.aiVisibility ?? 82}%
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <span className="text-[9px] font-bold text-slate-500 uppercase">Local Maps</span>
                      <span className="block text-lg font-black text-[#080d24] mt-1">
                        {geoResult.localPresence ?? 88}%
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <span className="text-[9px] font-bold text-slate-500 uppercase">Content Entity</span>
                      <span className="block text-lg font-black text-[#080d24] mt-1">
                        {geoResult.contentReadiness ?? 79}%
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <span className="text-[9px] font-bold text-slate-500 uppercase">Tech Signals</span>
                      <span className="block text-lg font-black text-[#080d24] mt-1">
                        {geoResult.technicalSignals ?? 87}%
                      </span>
                    </div>
                  </div>

                  {geoResult.insights && geoResult.insights.length > 0 && (
                    <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <h5 className="text-xs font-black text-[#080d24] mb-2 uppercase tracking-wider">Actionable Recommendations:</h5>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {geoResult.insights.map((insight, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#207de9] font-bold">•</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-900 flex justify-between items-center">
                    <span>Ready to rank #1 in both Google Search & AI Assistants?</span>
                    <a
                      href="https://wa.me/919876543210?text=Hi%20Digital%20FX%20team,%20I%20checked%20my%20GEO%20score%20and%20want%20to%20improve%20it."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#207de9] font-black hover:underline"
                    >
                      Get AI Growth Blueprint →
                    </a>
                  </div>
                </div>
              )}

            </div>

          </div>
        </section>

        {/* ==========================================================================
            10. WEBFX TRANSPARENT PRICING PACKAGES
            ========================================================================== */}
        <section id="pricing" className="py-24 bg-white border-b border-slate-200">
          <div className="max-w-[1360px] mx-auto px-6">
            
            <div className="text-center max-w-[820px] mx-auto mb-16">
              <span className="text-[11px] font-black uppercase tracking-[2px] text-[#207de9] bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full">
                TRANSPARENT ROI INVESTMENT
              </span>
              <h2 className="mt-4 text-[34px] sm:text-[46px] lg:text-[52px] font-black text-[#080d24] tracking-[-0.04em] leading-[1.08]">
                Clear Packages Designed For
                <span className="webfx-serif text-[#207de9] block font-normal mt-1">
                  Measurable Revenue.
                </span>
              </h2>
              <p className="mt-4 text-[16px] text-slate-600 font-normal">
                No hidden fees. Direct online checkout with PayU or instant consultation with our growth specialists.
              </p>
            </div>

            {/* 3 Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1180px] mx-auto items-stretch">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`bg-white rounded-3xl p-8 flex flex-col justify-between hover-lift relative ${
                    plan.popular
                      ? "border-2 border-[#207de9] shadow-[0_20px_45px_-10px_rgba(32,125,233,0.18)]"
                      : "border border-slate-200 shadow-sm"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#207de9] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-sm">
                      MOST POPULAR
                    </div>
                  )}

                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      {plan.popular ? "COMPLETE ENGINE" : "TARGETED SOLUTION"}
                    </span>
                    <h3 className="text-2xl font-black text-[#080d24] mt-1">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-2">{plan.description}</p>
                    
                    <div className="mt-6 mb-6">
                      <span className="text-4xl font-black text-[#080d24]">₹{plan.price}</span>
                      <span className="text-xs text-slate-400 font-bold ml-1">/ one-time</span>
                    </div>

                    <ul className="space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        const matched = paymentPlans.find(
                          (p) => p.amount === plan.price.replace(",", "")
                        );
                        if (matched) openPaymentModal(matched.id);
                        else choosePackage(plan.name);
                      }}
                      className={`w-full py-3.5 rounded-xl font-extrabold text-sm transition ${
                        plan.popular
                          ? "bg-[#207de9] hover:bg-[#1a6bc7] text-white shadow-md"
                          : "border-2 border-[#207de9] text-[#207de9] hover:bg-[#207de9] hover:text-white"
                      }`}
                    >
                      {plan.button} →
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => choosePackage(plan.name)}
                      className="w-full py-2 text-center text-xs font-bold text-slate-500 hover:text-slate-900"
                    >
                      Or Book Free Strategy Call
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ==========================================================================
            11. CLIENT TESTIMONIALS & PROOF
            ========================================================================== */}
        <section id="case-studies" className="py-24 bg-[#f8faff] border-b border-slate-200">
          <div className="max-w-[1360px] mx-auto px-6">
            
            <div className="text-center max-w-[820px] mx-auto mb-16">
              <span className="text-[11px] font-black uppercase tracking-[2px] text-[#207de9] bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full">
                VERIFIED CLIENT REVIEWS
              </span>
              <h2 className="mt-4 text-[34px] sm:text-[46px] lg:text-[52px] font-black text-[#080d24] tracking-[-0.04em] leading-[1.08]">
                Real Results Delivered For
                <span className="webfx-serif text-[#207de9] block font-normal mt-1">
                  Real Growing Businesses.
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
              {testimonials.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover-lift flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 text-sm mb-4">
                      {"★".repeat(item.rating)}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed italic">
                      "{item.quote}"
                    </p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-[#207de9] font-black flex items-center justify-center">
                      {item.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#080d24]">{item.author}</div>
                      <div className="text-[11px] text-slate-400">{item.business}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ==========================================================================
            12. WEBFX SIGNATURE BOTTOM GRADIENT CLOSER CTA (.gradient-closer-cta)
            ========================================================================== */}
        <section id="contact" className="py-24 bg-white">
          <div className="max-w-[1360px] mx-auto px-6">
            
            <div className="gradient-closer-cta rounded-3xl p-8 sm:p-16 border border-[#207de9]/20 shadow-xl max-w-[1240px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                <div className="lg:col-span-7">
                  <span className="text-[11px] font-black uppercase tracking-[2px] text-[#207de9]">
                    READY TO ACCELERATE GROWTH?
                  </span>
                  <h2 className="mt-3 text-[34px] sm:text-[46px] font-black text-[#080d24] tracking-[-0.04em] leading-[1.08]">
                    Move Your Marketing Forward With A 
                    <span className="webfx-serif text-[#207de9] block font-normal mt-1">
                      Proven Revenue Partner.
                    </span>
                  </h2>
                  <p className="mt-4 text-[16px] text-slate-600 font-normal max-w-[560px]">
                    Speak directly with our senior revenue strategists. We’ll analyze your website, audit your competitors, and deliver a tailored roadmap within 24 hours.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-5 items-center">
                    <a
                      href="tel:+919876543210"
                      className="bg-[#207de9] hover:bg-[#1a6bc7] text-white px-7 py-4 rounded-xl text-sm font-extrabold flex items-center gap-2 shadow-md transition"
                    >
                      <span>Call +91 98765 43210</span>
                      <span>→</span>
                    </a>
                    <a
                      href="https://wa.me/919876543210?text=Hi%20Digital%20FX%20team,%20I%20want%20to%20discuss%20a%20growth%20strategy."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-4 rounded-xl bg-white border border-slate-300 text-slate-800 font-extrabold text-sm hover:border-[#207de9] hover:text-[#207de9] transition shadow-xs flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-emerald" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Quick Consultation Request Form */}
                <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-lg">
                  <h3 className="text-xl font-black text-[#080d24] mb-1">Request Free Consultation</h3>
                  <p className="text-xs text-slate-500 mb-5">Fill in your details and our growth team will contact you.</p>

                  <form onSubmit={handleEnquiry} className="space-y-3 text-xs">
                    <div>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Your Name *"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#207de9]"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="Phone Number *"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#207de9]"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#207de9]"
                      />
                    </div>
                    <div>
                      <select
                        name="service"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#207de9]"
                      >
                        <option value="General Consultation">Select Service Interest</option>
                        <option value="SEO & AI Search">SEO & AI Search</option>
                        <option value="Google Business Profile Setup">Google Business Profile Setup</option>
                        <option value="Website Development">Website Development</option>
                        <option value="Paid Ads Management">Google & Meta Paid Ads</option>
                        <option value="Business Growth Package">Business Growth Package</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={formLoading}
                      className="w-full py-3.5 rounded-xl bg-[#207de9] hover:bg-[#1a6bc7] text-white font-extrabold text-sm shadow-sm mt-2 transition disabled:opacity-60"
                    >
                      {formLoading ? "Sending Enquiry..." : "Submit Consultation Request →"}
                    </button>
                  </form>

                  {successMessage && (
                    <p className="mt-3 text-xs font-bold text-emerald-600 text-center">
                      {successMessage}
                    </p>
                  )}
                  {errorMessage && (
                    <p className="mt-3 text-xs font-bold text-rose-600 text-center">
                      {errorMessage}
                    </p>
                  )}
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ==========================================================================
            13. WEBFX FOOTER (.fx-footer-bottom)
            ========================================================================== */}
        <footer className="bg-[#080d24] text-white pt-16 pb-12 border-t border-white/10">
          <div className="max-w-[1360px] mx-auto px-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
              
              {/* Brand Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#207de9] flex items-center justify-center font-black text-white text-lg">
                    FX
                  </div>
                  <div>
                    <div className="text-xl font-black text-white">DIGITAL <span className="text-[#207de9]">FX</span></div>
                    <div className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400">Digital Marketing Agency</div>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-400 max-w-[340px] leading-relaxed">
                  Celebrating 10+ Years of Digital Excellence in Ghaziabad and Delhi NCR. Driving attributable pipeline, rankings and measurable revenue for growth-oriented brands.
                </p>
                <div className="mt-5">
                  <a href="tel:+919876543210" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 px-4 py-2 rounded-lg text-xs font-bold text-white border border-white/10 transition">
                    <span>☎ Call Us:</span>
                    <span className="text-[#207de9] font-black">+91 98765 43210</span>
                  </a>
                </div>
              </div>

              {/* Core Services */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">Core Services</h4>
                <ul className="space-y-2 text-xs text-slate-400 font-medium">
                  <li><a href="#services" className="hover:text-white transition">Search Engine Optimization</a></li>
                  <li><a href="#services" className="hover:text-white transition">Google Business Profile</a></li>
                  <li><a href="#services" className="hover:text-white transition">Google PPC Advertising</a></li>
                  <li><a href="#services" className="hover:text-white transition">Meta & Instagram Ads</a></li>
                  <li><a href="#services" className="hover:text-white transition">Website Development</a></li>
                  <li><a href="#geo-checker" className="hover:text-white transition">GEO AI Search Optimization</a></li>
                </ul>
              </div>

              {/* Growth Solutions */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">Growth Solutions</h4>
                <ul className="space-y-2 text-xs text-slate-400 font-medium">
                  <li><a href="#growth-dashboard" className="hover:text-white transition">Revenue Engine 360°</a></li>
                  <li><a href="#comparison" className="hover:text-white transition">Revenue vs Clicks</a></li>
                  <li><a href="#geo-checker" className="hover:text-white transition">Free AI Search Audit</a></li>
                  <li><a href="#pricing" className="hover:text-white transition">Pricing Packages</a></li>
                  <li><a href="#case-studies" className="hover:text-white transition">Client Success Proof</a></li>
                </ul>
              </div>

              {/* Address */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">Office & Location</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Digital FX Headquarters<br />
                  RDC, Raj Nagar<br />
                  Ghaziabad, Uttar Pradesh 201002<br />
                  India
                </p>
                <p className="mt-3 text-xs text-slate-400">
                  Email: <a href="mailto:hello@digitalfx.in" className="text-white hover:underline">hello@digitalfx.in</a>
                </p>
              </div>

            </div>

            {/* Bottom Bar */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
              <div>
                © 2016 - 2026 Digital FX®. All rights reserved. Registered Digital Agency.
              </div>
              <div className="flex items-center gap-6">
                <a href="#privacy" className="hover:text-slate-300">Privacy Policy</a>
                <a href="#terms" className="hover:text-slate-300">Terms of Service</a>
                <a href="#sitemap" className="hover:text-slate-300">Sitemap</a>
              </div>
            </div>

          </div>
        </footer>

        {/* ==========================================================================
            PAYU PAYMENT MODAL (100% PRESERVED)
            ========================================================================== */}
        {paymentOpen && selectedPaymentPlan && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
            <div className="relative w-full max-w-[460px] rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200">
              <button
                type="button"
                onClick={closePaymentModal}
                disabled={paymentLoading}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-lg font-bold text-slate-600 hover:bg-slate-200"
              >
                ×
              </button>

              <span className="text-[10px] font-black uppercase tracking-widest text-[#207de9]">
                INSTANT ONLINE CHECKOUT
              </span>
              <h3 className="text-xl font-black text-[#080d24] mt-1">
                {selectedPaymentPlan.name}
              </h3>
              <p className="text-sm font-black text-emerald-600 mt-0.5">
                Amount: ₹{selectedPaymentPlan.amount}
              </p>

              <form onSubmit={startPayUPayment} className="mt-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={paymentName}
                    onChange={(e) => setPaymentName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#207de9]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={paymentEmail}
                    onChange={(e) => setPaymentEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#207de9]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={paymentPhone}
                    onChange={(e) => setPaymentPhone(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#207de9]"
                  />
                </div>

                {paymentError && (
                  <p className="text-xs font-bold text-rose-600">{paymentError}</p>
                )}

                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="w-full py-4 rounded-xl bg-[#207de9] hover:bg-[#1a6bc7] text-white font-extrabold text-sm shadow-md transition disabled:opacity-60"
                >
                  {paymentLoading ? "Connecting to PayU Gateway..." : `Proceed to Pay ₹${selectedPaymentPlan.amount} →`}
                </button>
              </form>

              <p className="text-[10px] text-slate-400 text-center mt-4">
                🔒 256-Bit SSL Encrypted & Secured by PayU India
              </p>
            </div>
          </div>
        )}

        {/* ==========================================================================
            FLOATING AI CHAT & SCROLL CONTROLS
            ========================================================================== */}
        <div className="fixed bottom-5 right-5 z-[100] flex items-end gap-3">
          {!chatOpen && (
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="hidden rounded-xl border border-[#dce5ff] bg-white px-3 py-2 text-left shadow-[0_10px_35px_rgba(16,24,40,.12)] sm:block hover:bg-slate-50 transition"
            >
              <p className="text-[11px] font-black text-[#101828]">
                Digital FX AI
              </p>
              <p className="mt-0.5 text-[10px] text-[#667085]">
                Ask about your growth →
              </p>
            </button>
          )}

          {chatOpen && (
            <div className="fixed bottom-24 right-5 w-[340px] sm:w-[380px] h-[460px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
              <div className="bg-[#080d24] p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#207de9] flex items-center justify-center font-black text-xs">
                    AI
                  </div>
                  <div>
                    <h4 className="text-xs font-black">Digital FX AI Strategist</h4>
                    <span className="text-[9.5px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-emerald" /> Online
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  className="text-slate-400 hover:text-white text-lg font-bold"
                >
                  ×
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        msg.sender === "user"
                          ? "bg-[#207de9] text-white rounded-br-none"
                          : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                  placeholder="Ask about SEO, website or ads..."
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#207de9]"
                />
                <button
                  type="button"
                  onClick={sendChatMessage}
                  className="px-4 py-2 bg-[#207de9] text-white font-bold rounded-xl text-xs hover:bg-[#1a6bc7]"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setChatOpen(!chatOpen)}
            aria-label="Open Digital FX AI chat"
            className="relative flex h-[62px] w-[62px] items-center justify-center rounded-full bg-white p-[2px] shadow-[0_12px_35px_rgba(0,0,0,.22)] transition hover:scale-105"
          >
            {!chatOpen && (
              <span className="absolute inset-0 animate-ping rounded-full border-2 border-[#207de9]/40" />
            )}

            {chatOpen ? (
              <span className="relative flex h-full w-full items-center justify-center rounded-full bg-[#080d24] text-2xl text-white">
                ×
              </span>
            ) : (
              <img
                src="/ai-icon.png"
                alt="Digital FX AI Assistant"
                className="relative h-full w-full rounded-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = "none";
                  const p = e.currentTarget.parentElement;
                  if (p && !p.querySelector(".ai-fallback-pill")) {
                    const fallback = document.createElement("span");
                    fallback.className = "ai-fallback-pill flex h-full w-full items-center justify-center rounded-full bg-[#207de9] text-white font-black text-sm";
                    fallback.innerText = "AI";
                    p.appendChild(fallback);
                  }
                }}
              />
            )}
          </button>
        </div>

        {/* FLOATING SCROLL BUTTONS */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[80] hidden md:flex flex-col gap-2">
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className={`h-10 w-10 rounded-xl bg-white border border-slate-200 text-[#207de9] shadow-md flex items-center justify-center font-black transition ${
              showScrollControls ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            ↑
          </button>
          <button
            type="button"
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
            className="h-10 w-10 rounded-xl bg-white border border-slate-200 text-[#207de9] shadow-md flex items-center justify-center font-black hover:bg-slate-50 transition"
          >
            ↓
          </button>
        </div>

      </main>
    </>
  );
}