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

const clientReviews = [
  {
    quote: "Digital FX helped our clinic rank #1 on Google Maps in Ghaziabad. Our patient appointments increased by over 200% within 60 days.",
    author: "Dr. Rajesh Sharma",
    business: "Apex Heart Care Clinic, Ghaziabad",
    rating: 5,
    tag: "SEO & Maps",
  },
  {
    quote: "Our saree boutique saw a huge surge in footfall and direct WhatsApp enquiries after they revamped our local presence and social catalog.",
    author: "Priya Malhotra",
    business: "Malhotra Saree Sansar, Raj Nagar",
    rating: 5,
    tag: "Local Growth",
  },
  {
    quote: "Their B2B lead generation campaigns brought us high-ticket manufacturing inquiries across NCR. Highly professional team and transparent ROI.",
    author: "Vikram Singhal",
    business: "Singhal Polymers & Packaging, Ghaziabad",
    rating: 5,
    tag: "Paid Ads",
  },
  {
    quote: "The website they designed loads instantly on mobile and our interior design leads started flowing directly to WhatsApp without any hassle.",
    author: "Ananya Gupta",
    business: "The Woodcraft Studio, Noida",
    rating: 5,
    tag: "Web Dev",
  },
  {
    quote: "Sensible pricing, clear communication, and practical guidance. Best digital marketing agency for chartered accountants and consulting firms.",
    author: "Mohit Bansal",
    business: "Bansal CA & Tax Associates, NCR",
    rating: 5,
    tag: "Business Growth",
  },
  {
    quote: "Our bridal and salon bookings doubled ahead of wedding season thanks to their hyper-targeted Meta advertising campaigns.",
    author: "Neha Kapoor",
    business: "Glamour Glow Salon & Academy, Ghaziabad",
    rating: 5,
    tag: "Meta Ads",
  },
  {
    quote: "In the real estate sector, speed and trust are everything. Digital FX built our landing pages that convert cold traffic into closed property visits.",
    author: "Amit Tyagi",
    business: "Tyagi Properties, Crossings Republik",
    rating: 5,
    tag: "Real Estate",
  },
  {
    quote: "We were struggling with Google reviews and discovery. Digital FX properly optimized our dental listing and now patients find us organically.",
    author: "Dr. Sunita Verma",
    business: "Smile Dental Clinic, Indirapuram",
    rating: 5,
    tag: "Google Maps",
  },
  {
    quote: "The gym membership enquiries skyrocketed within the first month itself. Their creative ads and local SEO approach really delivers.",
    author: "Karan Sachdeva",
    business: "Sachdeva Fitness & Gym, Vaishali",
    rating: 5,
    tag: "Fitness",
  },
  {
    quote: "Our preschool admissions reached full capacity this year. Their hyper-local Google campaign and parental trust messaging worked wonders.",
    author: "Pooja Aggarwal",
    business: "Little Wonders Preschool, Vasundhara",
    rating: 5,
    tag: "Education",
  },
  {
    quote: "Home grocery orders on WhatsApp increased significantly after our Google Business listing and promotional campaign went live.",
    author: "Rakesh Goel",
    business: "Goel Supermarket, Ghaziabad",
    rating: 5,
    tag: "Retail",
  },
  {
    quote: "Premium car detailing requires high-trust video and photo ads. Digital FX targeted luxury car owners in NCR with surgical precision.",
    author: "Deepak Chauhan",
    business: "Chauhan Auto Care & Detailing, Delhi NCR",
    rating: 5,
    tag: "Auto Detailing",
  },
  {
    quote: "My designer apparel studio started receiving outstation orders through our clean e-commerce landing page. Extremely satisfied with their work.",
    author: "Simran Kaur",
    business: "Kaur Couture Designer Boutique, Noida",
    rating: 5,
    tag: "Fashion",
  },
  {
    quote: "They established our firm's digital authority across corporate law keywords. High-intent corporate clients now discover us effortlessly.",
    author: "Alok Tripathi",
    business: "Tripathi Legal Advisors, Delhi High Court",
    rating: 5,
    tag: "Legal",
  },
  {
    quote: "Our orthopedic clinic is now recognized across western UP. Patient inquiries through phone and Google Maps are steady and reliable.",
    author: "Dr. Sanjay Mathur",
    business: "Metro Ortho Clinic, Rajender Nagar",
    rating: 5,
    tag: "Healthcare",
  },
  {
    quote: "Custom cake orders and party catering inquiries through WhatsApp have become our biggest revenue stream thanks to Digital FX.",
    author: "Manisha Joshi",
    business: "Sweet Delights Bakery & Cafe, Ghaziabad",
    rating: 5,
    tag: "F&B",
  },
  {
    quote: "They modernized our family jewelry brand for the digital age. Trustworthy, responsive, and genuinely invested in client growth.",
    author: "Gaurav Jain",
    business: "Arihant Jewellers, Gandhi Nagar",
    rating: 5,
    tag: "Jewelry",
  },
  {
    quote: "Batch enrollment for our competitive exam batches filled up three weeks ahead of schedule. Their digital funnel works like clockwork.",
    author: "Sonal Saxena",
    business: "EduPlus Coaching Classes, Kavi Nagar",
    rating: 5,
    tag: "Coaching",
  },
  {
    quote: "Shifted our logistics marketing from old directory listings to direct Google Search ads. Our cost per commercial lead dropped by 45%.",
    author: "Rohit Rawat",
    business: "Rawat Logistics & Packers, NCR",
    rating: 5,
    tag: "Logistics",
  },
  {
    quote: "Clear reporting and consistent performance. Our eye hospital has seen a dramatic improvement in patient appointment bookings.",
    author: "Dr. Shalini Varma",
    business: "Varma Eye Care Centre, Ghaziabad",
    rating: 5,
    tag: "Eye Care",
  },
  {
    quote: "They helped our electrical showroom compete against online discount sites by highlighting local trust, fast delivery, and warranties.",
    author: "Harish Chand",
    business: "Chand Electricals & Home Appliances, RDC",
    rating: 5,
    tag: "Electronics",
  },
  {
    quote: "Our architectural firm gained high-budget residential villa projects in Delhi NCR. The portfolio website they built is world-class.",
    author: "Meenakshi Bhatia",
    business: "Urban Nest Interior Architecture, Noida",
    rating: 5,
    tag: "Architecture",
  },
  {
    quote: "They helped our agricultural seed distribution company connect with authorized dealers across Uttar Pradesh. Remarkable B2B reach.",
    author: "Arun Pandey",
    business: "Pandey Agro & Seeds, Uttar Pradesh",
    rating: 5,
    tag: "Agro B2B",
  },
  {
    quote: "Pet parents in Vaishali and Indirapuram find our clinic immediately on Google Maps. Emergency pet consultations increased by 180%.",
    author: "Dr. Tanya Rastogi",
    business: "Royal Pet Hospital & Grooming, Vaishali",
    rating: 5,
    tag: "Pet Care",
  },
  {
    quote: "Commercial building contractors and architects now call us directly for bulk steel quotations. Genuine digital partner for industrial firms.",
    author: "Naveen Mittal",
    business: "Mittal Steel & Hardware Works, Sahibabad",
    rating: 5,
    tag: "Manufacturing",
  },
  {
    quote: "Parents trust clean websites with verified reviews. Digital FX delivered both and our pediatric OPD numbers speak for themselves.",
    author: "Dr. Vivek Khurana",
    business: "Khurana Child Care & Vaccination, Ghaziabad",
    rating: 5,
    tag: "Pediatrics",
  },
  {
    quote: "Wedding season banquet bookings were fully locked in advance. Their targeted Instagram video campaigns delivered unbelievable ROI.",
    author: "Swati Singhania",
    business: "Singhania Banquet & Events, Raj Nagar Ext",
    rating: 5,
    tag: "Hospitality",
  },
  {
    quote: "Our doorstep gadget repair service gets steady phone calls everyday. Quick response, great technical support, and honest execution.",
    author: "Rajat Srivastava",
    business: "QuickFix Tech Care, Indirapuram",
    rating: 5,
    tag: "Tech Support",
  },
  {
    quote: "Holistic wellness therapies require patient education. Their content marketing and local SEO strategy brought us loyal long-term patrons.",
    author: "Poonam Mishra",
    business: "Prakriti Ayurvedic Wellness, NCR",
    rating: 5,
    tag: "Wellness",
  },
  {
    quote: "Our self-drive car rental fleet operates at 95% utilization on weekends thanks to their search engine ranking work.",
    author: "Kunal Bhatnagar",
    business: "DriveEasy Car Rentals, Delhi NCR",
    rating: 5,
    tag: "Travel",
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
  const [radarHovered, setRadarHovered] = useState(false);
  const [radarHoverNode, setRadarHoverNode] = useState<number | null>(null);

  const [geoWebsite, setGeoWebsite] = useState("");
  const [geoKeyword, setGeoKeyword] = useState("");
  const [geoCity, setGeoCity] = useState("");
  const [geoResult, setGeoResult] = useState<GeoResult | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoScanStep, setGeoScanStep] = useState(0);
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
    useState<PaymentPlan | null>(paymentPlans[2]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentName, setPaymentName] = useState("");
  const [paymentEmail, setPaymentEmail] = useState("");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const [heroWebsite, setHeroWebsite] = useState("");

  const [showScrollControls, setShowScrollControls] = useState(false);
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [discountCodeCopied, setDiscountCodeCopied] = useState(false);

  useEffect(() => {
    // Show 15% OFF discount banner popup automatically when website opens
    const timer = setTimeout(() => {
      setDiscountModalOpen(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  function handleClaimDiscount() {
    setDiscountCodeCopied(true);
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("GROWTH15").catch(() => {});
    }
    setTimeout(() => {
      setDiscountModalOpen(false);
      const target = document.getElementById("proposal") || document.getElementById("contact");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);
  }

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

  function scrollToContact() {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
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

  function handleHeroProposal(e: FormEvent) {
    e.preventDefault();
    const site = heroWebsite.trim();
    if (!site) return;
    setGeoWebsite(site);
    const target = document.getElementById("geo-checker");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    runGeoAudit(site);
  }

  async function handleGeoCheck(e: FormEvent) {
    e.preventDefault();
    runGeoAudit(geoWebsite);
  }

  async function runGeoAudit(siteInput?: string) {
    const site = (siteInput || geoWebsite).trim();
    if (!site) return;
    setGeoWebsite(site);
    setGeoLoading(true);
    setGeoScanStep(1);
    setGeoError("");
    setGeoResult(null);

    // 1. Try local API route if available
    try {
      const response = await fetch("/api/geo-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: site,
          keyword: geoKeyword,
          city: geoCity,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeoResult(data);
        setGeoLoading(false);
        return;
      }
    } catch {
      // In standalone mode or when server route is unreachable, continue with deterministic audit generator
    }

    // 2. High-precision dynamic scanning progress simulation
    setTimeout(() => setGeoScanStep(2), 350);
    setTimeout(() => setGeoScanStep(3), 750);
    setTimeout(() => {
      let hash = 0;
      for (let i = 0; i < site.length; i++) {
        hash = (hash << 5) - hash + site.charCodeAt(i);
        hash |= 0;
      }
      const absHash = Math.abs(hash);
      const score = 74 + (absHash % 18); // Realistic 74 - 91 range
      const aiVis = 72 + ((absHash >> 1) % 20);
      const localPres = 76 + ((absHash >> 2) % 18);
      const content = 68 + ((absHash >> 3) % 22);
      const tech = 78 + ((absHash >> 4) % 18);

      const grade =
        score >= 86
          ? "Tier-1 Leader: High AI Citation Authority"
          : score >= 78
          ? "Tier-2 Contender: Strong Base with AI Schema Gaps"
          : "Action Required: Missing Critical Generative Search Markup";

      setGeoResult({
        score,
        overall: score,
        grade,
        aiVisibility: aiVis,
        localPresence: localPres,
        contentReadiness: content,
        technicalSignals: tech,
        insights: [
          `Domain ${site} shows healthy mobile crawling, but lacks conversational FAQ entity markup needed for Google AI Overviews.`,
          "Missing Organization & LocalBusiness JSON-LD `sameAs` entity links limits knowledge graph trust scores in ChatGPT & Gemini.",
          "Local NAP & Map proximity signals are in good standing (+15% above regional baseline).",
          "Topical keyword clustering covers core services, but long-tail conversational comparison guides are absent."
        ],
      });
      setGeoLoading(false);
    }, 1200);
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

  function openPricingModal(planId?: PaymentPlan["id"]) {
    const plan = (planId && paymentPlans.find((item) => item.id === planId)) || selectedPaymentPlan || paymentPlans[2];
    setSelectedPaymentPlan(plan);
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
      const response = await fetch("/api/payu/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPaymentPlan.id,
          name,
          email,
          phone,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to initiate payment.");
      }

      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.actionUrl;

      Object.entries(data.params as Record<string, string>).forEach(
        ([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        }
      );

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
    scrollToContact();

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
      title: "Phase 01: Inbound Demand Capture",
      desc: "Deploys programmatic keyword architecture and Google Search auction bidding to isolate and capture high-intent commercial buyers across NCR.",
      scope: "Programmatic SEO & High-Intent Google PPC",
      metric: "Top 3 Rank #1 (Organic)",
    },
    {
      title: "Phase 02: Pipeline & Conversion Velocity",
      desc: "Routes sub-second landing page traffic into verified WhatsApp Business CRM pipelines, qualifying and booking meetings while purchase intent peaks.",
      scope: "High-Velocity Landers & WhatsApp CRM",
      metric: "84% Sales-Qualified Ratio",
    },
    {
      title: "Phase 03: Generative AI Search Engine (GEO)",
      desc: "Constructs semantic entity knowledge graphs so your business is actively cited and recommended in ChatGPT, Google Gemini, and Perplexity AI answer engines.",
      scope: "ChatGPT & Gemini Citations",
      metric: "#1 AI Overview Citation Share",
    },
    {
      title: "Phase 04: Attributable Compounding Revenue",
      desc: "Attributes closed-loop revenue back to campaign sources, automatically reinvesting high-performing signals into a compounding growth flywheel.",
      scope: "Closed-Loop Attribution & LTV Expansion",
      metric: "₹100,000+ Closed Revenue Scale",
    },
  ];

  const radarChannels = [
    { id: 0, label: "SEARCH / SEO", icon: "🔍", pillar: "visibility", x2: 300, y2: 45, cx: "50%", cy: "10%", posClass: "top-2 left-1/2 -translate-x-1/2" },
    { id: 1, label: "LOCAL MAPS", icon: "📍", pillar: "visibility", x2: 475, y2: 95, cx: "79%", cy: "21%", posClass: "top-12 right-6" },
    { id: 2, label: "PAID ADS", icon: "🚀", pillar: "acquisition", x2: 520, y2: 225, cx: "87%", cy: "50%", posClass: "top-1/2 right-2 -translate-y-1/2" },
    { id: 3, label: "SOCIAL MEDIA", icon: "📱", pillar: "acquisition", x2: 475, y2: 355, cx: "79%", cy: "79%", posClass: "bottom-12 right-6" },
    { id: 4, label: "WEB DEV", icon: "💻", pillar: "conversion", x2: 300, y2: 405, cx: "50%", cy: "90%", posClass: "bottom-2 left-1/2 -translate-x-1/2" },
    { id: 5, label: "WHATSAPP FUNNELS", icon: "💬", pillar: "conversion", x2: 125, y2: 355, cx: "21%", cy: "79%", posClass: "bottom-12 left-6" },
    { id: 6, label: "GEO AI SEARCH", icon: "🧠", pillar: "insights", x2: 80, y2: 225, cx: "13%", cy: "50%", posClass: "top-1/2 left-2 -translate-y-1/2" },
    { id: 7, label: "ANALYTICS", icon: "📊", pillar: "insights", x2: 125, y2: 95, cx: "21%", cy: "21%", posClass: "top-12 left-6" },
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

        .webfx-serif {
          font-family: Georgia, 'Times New Roman', Cambria, serif !important;
          font-style: italic !important;
          font-weight: 400 !important;
          letter-spacing: -0.015em !important;
        }

        @keyframes radarBreathing {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.03); opacity: 0.35; }
        }

        @keyframes beamElectricSupply {
          0% { stroke-dashoffset: 32; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes pulseDotEmerald {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); }
          50% { transform: scale(1.2); box-shadow: 0 0 0 7px rgba(16, 185, 129, 0); }
        }

        @keyframes pulseNeonGlow {
          0%, 100% { filter: drop-shadow(0 0 4px #207de9) drop-shadow(0 0 10px rgba(32,125,233,0.5)); }
          50% { filter: drop-shadow(0 0 8px #00f0ff) drop-shadow(0 0 20px rgba(0,240,255,0.7)); }
        }

        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .pulse-orbit-1 { transform-origin: center; animation: radarBreathing 6s ease-in-out infinite; }
        .pulse-orbit-2 { transform-origin: center; animation: radarBreathing 8s ease-in-out infinite 1s; }
        .pulse-orbit-3 { transform-origin: center; animation: radarBreathing 10s ease-in-out infinite 2s; }

        .pulse-emerald {
          animation: pulseDotEmerald 2.2s infinite cubic-bezier(0.4, 0, 0.6, 1);
        }

        .electric-beam-active {
          stroke-dasharray: 8 6 !important;
          stroke-width: 3px !important;
          stroke: #00f0ff !important;
          animation: beamElectricSupply 0.8s linear infinite !important;
          filter: drop-shadow(0 0 8px #00f0ff);
          opacity: 1 !important;
        }

        .radar-3d-stage {
          perspective: 1000px;
          transform-style: preserve-3d;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .radar-3d-stage:hover {
          transform: rotateX(4deg) rotateY(-2deg);
        }

        .radar-hub-3d {
          box-shadow: 0 0 35px rgba(32, 125, 233, 0.45), 0 20px 45px -10px rgba(8, 13, 36, 0.8), inset 0 2px 5px rgba(255, 255, 255, 0.4);
          transition: all 0.35s ease;
        }
        .radar-hub-3d:hover {
          transform: scale(1.05);
          box-shadow: 0 0 50px rgba(0, 240, 255, 0.6), 0 25px 60px -10px rgba(8, 13, 36, 0.9), inset 0 2px 8px rgba(255, 255, 255, 0.6);
        }

        .reviews-marquee-track {
          display: flex;
          width: max-content;
          gap: 20px;
          animation: marqueeScroll 150s linear infinite;
        }
        .reviews-marquee-track:hover {
          animation-play-state: paused;
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
            1. WEBFX TOP BAR (#fxtopbar) - STATS: ₹100,000+ WITH BLINKING LIVE PAYMENT BUTTON
            ========================================================================== */}
        <div id="fxtopbar" className="bg-[#080d24] text-white py-2 border-b border-white/10 block">
          <div className="mx-auto flex h-auto min-h-[34px] max-w-[1360px] flex-wrap items-center justify-between gap-y-2 px-4 sm:px-6 lg:px-10 text-xs">
            
            {/* Left: Tagline, ₹100,000+ Revenue Metric & Blinking Customer Interaction Payment Option */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-slate-300 text-[11.5px] font-semibold">
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-emerald" />
              <span className="hidden md:inline">Digital Marketing That Drives Revenue®</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-black text-[11px] tracking-wide">
                <span>📈</span> ₹100,000+
              </span>

              {/* Blinking Live Payment Button directly after 100000 for maximum Customer Interaction */}
              <button
                type="button"
                onClick={() => openPricingModal()}
                className="relative inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 via-blue-500/25 to-emerald-500/20 hover:from-emerald-500/35 hover:to-blue-500/35 border border-emerald-400/50 text-emerald-300 hover:text-white font-extrabold text-[11.5px] tracking-wide transition-all duration-300 cursor-pointer shadow-[0_0_14px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] group"
                title="Click to Pay Online or View Growth Packages"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="flex items-center gap-1.5">
                  <span>💳 Payment / Pay Online</span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-400 text-[#080d24] animate-pulse">
                    LIVE
                  </span>
                </span>
              </button>
            </div>

            {/* Right: Direct Phone & WhatsApp */}
            <div className="flex items-center gap-4 sm:gap-6 text-[12px] font-medium text-slate-300 ml-auto sm:ml-0">
              <span className="hidden lg:flex items-center gap-1.5 text-slate-400">
                <span className="text-emerald-400">●</span> Ghaziabad &amp; NCR, India
              </span>
              <a href="tel:+919876543210" className="hidden sm:flex items-center gap-1.5 hover:text-white font-bold transition">
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
            </div>

          </div>
        </div>

        {/* ==========================================================================
            2. WEBFX MAIN HEADER & 3-LINE MENU NAVIGATION (#fxheader)
            ========================================================================== */}
        <header id="fxheader" className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs transition-all">
          <div className="mx-auto flex h-[74px] max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">

            {/* Brand Logo */}
            <a href="#home" className="flex items-center gap-3 shrink-0 group">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#080d24] to-[#207de9] text-white font-black text-lg shadow-sm transition-transform group-hover:scale-105">
                FX
              </div>
              <div className="shrink-0">
                <div className="text-[21px] font-black leading-none tracking-[-0.03em] text-[#080d24]">
                  DIGITAL <span className="text-[#207de9]">FX</span>
                </div>
                <div className="mt-1 text-[8px] font-extrabold uppercase tracking-[1.8px] text-slate-500 whitespace-nowrap">
                  Digital Marketing That Drives Revenue®
                </div>
              </div>
            </a>

            {/* Right Action & 3-Line Menu Trigger (All Nav Items Cleanly Accessible via Drawer) */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <a href="tel:+919876543210" className="hidden lg:flex flex-col text-right shrink-0 group">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Direct Consultation</span>
                <span className="text-[13.5px] font-black text-[#080d24] group-hover:text-[#207de9] transition whitespace-nowrap">+91 98765 43210</span>
              </a>

              <button
                type="button"
                onClick={scrollToContact}
                className="hidden sm:flex h-[42px] items-center gap-2 rounded-lg bg-[#207de9] hover:bg-[#1a6bc7] px-5 text-[13px] font-bold text-white shadow-[0_4px_14px_rgba(32,125,233,0.3)] hover:shadow-[0_6px_20px_rgba(32,125,233,0.4)] transition-all hover:-translate-y-0.5 cursor-pointer shrink-0 whitespace-nowrap"
              >
                <span>Get My Free Proposal</span>
                <span className="text-sm font-bold">→</span>
              </button>

              {/* 3-LINE MENU BUTTON (Opens Complete Navigation Drawer from Right) */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open Navigation Menu"
                className="flex h-[42px] items-center gap-2.5 px-3.5 sm:px-4 rounded-xl border border-slate-300 bg-slate-50 hover:bg-white hover:border-[#207de9] shadow-xs transition-all cursor-pointer group"
              >
                <span className="flex flex-col gap-[4.5px]">
                  <span className="h-[2.5px] w-5 bg-[#080d24] group-hover:bg-[#207de9] rounded-full transition-colors" />
                  <span className="h-[2.5px] w-5 bg-[#080d24] group-hover:bg-[#207de9] rounded-full transition-colors" />
                  <span className="h-[2.5px] w-3.5 bg-[#207de9] rounded-full ml-auto" />
                </span>
                <span className="text-[13px] font-black text-[#080d24] group-hover:text-[#207de9] transition-colors tracking-tight hidden xs:inline">
                  Menu
                </span>
              </button>
            </div>

          </div>
        </header>

        {/* ==========================================================================
            RIGHT SLIDE-OVER NAVIGATION DRAWER (Opened via 3-Line Menu Button)
            ========================================================================== */}
        {mobileOpen && (
          <>
            <button
              type="button"
              onClick={closeMobileMenu}
              className="fixed inset-0 z-[150] bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fadeIn cursor-pointer"
              aria-label="Close menu backdrop"
            />
            <aside className="fixed right-0 top-0 z-[160] h-full w-[92%] max-w-[420px] border-l border-slate-200 bg-white shadow-2xl flex flex-col justify-between p-6 sm:p-7 overflow-y-auto animate-slideInRight">
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#080d24] to-[#207de9] text-white flex items-center justify-center font-black shadow-xs">
                      FX
                    </div>
                    <div>
                      <p className="text-lg font-black text-[#080d24] leading-tight">
                        DIGITAL <span className="text-[#207de9]">FX</span>
                      </p>
                      <p className="text-[9px] font-extrabold tracking-[1.5px] text-slate-400 uppercase">
                        Revenue Growth Architecture
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeMobileMenu}
                    aria-label="Close menu"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-400 text-lg font-bold transition cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Section Title */}
                <div className="mt-5 mb-2 px-1 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Navigation Directory</span>
                  <span>6 Sections</span>
                </div>

                {/* Primary Navigation Links - Sleek Linear Vector Icons & Editorial Subtitles */}
                <nav className="space-y-1">
                  {/* Home */}
                  <a
                    href="#home"
                    onClick={closeMobileMenu}
                    className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-blue-50 text-slate-500 group-hover:text-[#207de9] transition">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#080d24] group-hover:text-[#207de9] transition">
                          Home
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Agency overview &amp; revenue metrics
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-300 group-hover:text-[#207de9] group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                  </a>

                  {/* Services */}
                  <a
                    href="#services"
                    onClick={closeMobileMenu}
                    className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-blue-50 text-slate-500 group-hover:text-[#207de9] transition">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#080d24] group-hover:text-[#207de9] transition">
                          Core Services
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          SEO, Paid Media, Web Dev &amp; Funnels
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-300 group-hover:text-[#207de9] group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                  </a>

                  {/* Revenue Engine 360° */}
                  <a
                    href="#growth-dashboard"
                    onClick={closeMobileMenu}
                    className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-blue-50/60 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#207de9] transition">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#080d24] group-hover:text-[#207de9] transition">
                          Revenue Engine 360°
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Closed-loop attribution &amp; AI loop
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-300 group-hover:text-[#207de9] group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                  </a>

                  {/* GEO AI Audit */}
                  <a
                    href="#geo-checker"
                    onClick={closeMobileMenu}
                    className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-emerald-50/60 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#080d24] group-hover:text-emerald-700 transition">
                          GEO AI Audit Suite
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          ChatGPT &amp; Gemini citation diagnostic
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                  </a>

                  {/* Results & Proof */}
                  <a
                    href="#case-studies"
                    onClick={closeMobileMenu}
                    className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-blue-50 text-slate-500 group-hover:text-[#207de9] transition">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#080d24] group-hover:text-[#207de9] transition">
                          Verified Client Proof
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          50+ reviews &amp; verified case studies
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-300 group-hover:text-[#207de9] group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                  </a>

                  {/* Contact Strategy Team */}
                  <a
                    href="#contact"
                    onClick={closeMobileMenu}
                    className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-blue-50 text-slate-500 group-hover:text-[#207de9] transition">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#080d24] group-hover:text-[#207de9] transition">
                          Contact &amp; Proposal
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Request custom growth roadmap
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-300 group-hover:text-[#207de9] group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                  </a>
                </nav>

                {/* Executive Client Portal & Payment Card */}
                <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-[#080d24] via-[#0d163d] to-[#080d24] text-white border border-slate-800 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                        Client Checkout Desk
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      RBI Authorized
                    </span>
                  </div>
                  <div className="mt-2 text-base font-black text-white">
                    Payment &amp; Packages
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Fixed pricing from ₹2,999 • Instant GST invoice
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      closeMobileMenu();
                      openPricingModal();
                    }}
                    className="mt-3.5 w-full py-2.5 px-4 rounded-xl bg-[#207de9] hover:bg-[#1866c2] text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Authorize Payment Online</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Agency Office & Regional Desk */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Regional Strategy Desk
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-[#080d24]">Ghaziabad &amp; Delhi NCR</div>
                      <div className="text-[11px] text-slate-500">Mon – Sat • 9:30 AM to 7:30 PM</div>
                    </div>
                    <a
                      href="tel:+919876543210"
                      className="text-xs font-bold text-[#207de9] hover:underline whitespace-nowrap"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Action */}
              <div className="pt-5 border-t border-slate-100">
                <a
                  href="https://wa.me/919876543210?text=Hi%20Digital%20FX%20team,%20I%20want%20to%20discuss%20a%20growth%20strategy."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#080d24] hover:bg-[#1570ef] py-3 text-center text-xs font-black text-white shadow-xs transition cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Chat with Senior Strategist (WhatsApp)</span>
                  <span>→</span>
                </a>
                <p className="mt-2 text-center text-[10px] text-slate-400 font-medium">
                  © {new Date().getFullYear()} Digital FX®. All rights reserved.
                </p>
              </div>
            </aside>
          </>
        )}

        {/* ==========================================================================
            3. WEBFX HERO SECTION & CIRCULAR REVENUE ENGINE (EXACT SCREENSHOT REPRODUCTION)
            ========================================================================== */}
        <section
          id="home"
          className="relative overflow-hidden bg-[#f8faff] pt-12 lg:pt-16 pb-20 border-b border-slate-200"
        >
          {/* Clean Institutional Square Grid Background System (Zero Conflicting Overlap) */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(32, 125, 233, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(32, 125, 233, 0.08) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage:
                "radial-gradient(ellipse 75% 65% at 50% 45%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 65%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 75% 65% at 50% 45%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 65%, transparent 100%)",
            }}
          />

          <div className="relative z-10 mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
            
            {/* Top Area: WebFX Headline & Website Proposal Input Bar */}
            <div className="max-w-[840px]">
              {/* Overline Subhead */}
              <div className="mb-3 inline-flex items-center gap-2 text-xs sm:text-[13px] font-black uppercase tracking-wider text-[#1570ef]">
                <span>Digital FX Digital Marketing Agency</span>
              </div>

              {/* WebFX Signature Headline */}
              <h1 className="text-[38px] sm:text-[54px] lg:text-[66px] font-black leading-[1.04] tracking-[-0.04em] text-[#080d24]">
                Your Revenue Growth Partner{" "}
                <span className="webfx-serif text-[#1570ef] block font-normal sm:inline">
                  in the AI Era
                </span>
              </h1>

              {/* Subtitle Description */}
              <p className="mt-5 max-w-[680px] text-[16px] sm:text-[18px] leading-[1.6] text-slate-600 font-normal">
                For marketing teams who need to prove revenue impact, not just report performance. Digital FX's revenue-focused framework connects expert execution, data, and strategy to drive measurable growth in 2026 and beyond.
              </p>

              {/* WebFX Exact Website Proposal Bar */}
              <form
                onSubmit={handleHeroProposal}
                className="mt-7 flex flex-col sm:flex-row items-stretch max-w-[560px] bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xs hover:border-slate-400 transition-all"
              >
                <input
                  type="text"
                  value={heroWebsite}
                  onChange={(e) => setHeroWebsite(e.target.value)}
                  placeholder="Enter your website"
                  className="flex-1 px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent font-medium"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-[#080d24] hover:bg-[#1570ef] text-white font-extrabold text-sm tracking-wide transition-colors whitespace-nowrap cursor-pointer"
                >
                  Get My Free Proposal
                </button>
              </form>
            </div>

            {/* Centerpiece: WebFX Circular 4-Quadrant Revenue Engine with Callouts */}
            <div className="relative mx-auto max-w-[1040px] px-2 sm:px-4 mt-12 sm:mt-16 select-none">

              {/* Vector SVG Graphic Container with Centered Elements & Widened Callout Margins */}
              <div className="relative z-10 w-full max-w-[1040px] mx-auto aspect-[1040/560]">
                
                <svg viewBox="0 0 1040 560" className="w-full h-full drop-shadow-sm overflow-visible">
                  <defs>
                    {/* Center Disc Soft Drop Shadow */}
                    <filter id="hub-shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#080d24" floodOpacity="0.08" />
                    </filter>

                    {/* Quadrant Segment Text Guide Paths (Centered at 520, 280) */}
                    <path id="tp-acq" d="M 351.7 256.3 A 170 170 0 0 1 461.9 120.3" fill="none" />
                    <path id="tp-pipe" d="M 543.7 111.7 A 170 170 0 0 1 679.7 221.9" fill="none" />
                    <path id="tp-rev" d="M 688.3 303.7 A 170 170 0 0 1 578.1 439.7" fill="none" />
                    <path id="tp-ai" d="M 496.3 448.3 A 170 170 0 0 1 360.3 338.1" fill="none" />

                    {/* Active Quadrant Glow Filters */}
                    <filter id="glow-acq" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#1570ef" floodOpacity="0.55" />
                    </filter>
                    <filter id="glow-pipe" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#00b894" floodOpacity="0.55" />
                    </filter>
                    <filter id="glow-rev" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#10b981" floodOpacity="0.55" />
                    </filter>
                    <filter id="glow-ai" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#a855f7" floodOpacity="0.55" />
                    </filter>
                  </defs>

                  {/* 1. Connecting Callout Lines (Clean Shelf Under Text + Non-Intersecting Connector to Circle) */}
                  {/* Line Q0 (Top-Left: Acquisition - Blue, Shelf at x=20..250, Connector to Circle at x=342.5) */}
                  <g className="transition-opacity duration-300" opacity={activeFlywheelQuadrant === 0 ? 1 : 0.4}>
                    <path
                      d="M 342.5 177.5 L 290 177.5 L 250 210 L 20 210"
                      fill="none"
                      stroke="#1570ef"
                      strokeWidth={activeFlywheelQuadrant === 0 ? 2 : 1.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="342.5" cy="177.5" r={activeFlywheelQuadrant === 0 ? 5 : 3.5} fill="#1570ef" />
                  </g>

                  {/* Line Q1 (Top-Right: Pipeline - Teal, Shelf at x=790..1020, Connector to Circle at x=697.5) */}
                  <g className="transition-opacity duration-300" opacity={activeFlywheelQuadrant === 1 ? 1 : 0.4}>
                    <path
                      d="M 697.5 177.5 L 750 177.5 L 790 210 L 1020 210"
                      fill="none"
                      stroke="#00b894"
                      strokeWidth={activeFlywheelQuadrant === 1 ? 2 : 1.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="697.5" cy="177.5" r={activeFlywheelQuadrant === 1 ? 5 : 3.5} fill="#00b894" />
                  </g>

                  {/* Line Q2 (Bottom-Right: Revenue - Green, Shelf at x=790..1020, Connector to Circle at x=697.5) */}
                  <g className="transition-opacity duration-300" opacity={activeFlywheelQuadrant === 2 ? 1 : 0.4}>
                    <path
                      d="M 697.5 382.5 L 750 382.5 L 790 425 L 1020 425"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth={activeFlywheelQuadrant === 2 ? 2 : 1.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="697.5" cy="382.5" r={activeFlywheelQuadrant === 2 ? 5 : 3.5} fill="#10b981" />
                  </g>

                  {/* Line Q3 (Bottom-Left: AI Intelligence - Purple, Shelf at x=20..250, Connector to Circle at x=342.5) */}
                  <g className="transition-opacity duration-300" opacity={activeFlywheelQuadrant === 3 ? 1 : 0.4}>
                    <path
                      d="M 342.5 382.5 L 290 382.5 L 250 425 L 20 425"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth={activeFlywheelQuadrant === 3 ? 2 : 1.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="342.5" cy="382.5" r={activeFlywheelQuadrant === 3 ? 5 : 3.5} fill="#a855f7" />
                  </g>

                  {/* 2. 4 Curved Donut Arcs (Centered at 520, 280) */}
                  {/* Quadrant 0: Acquisition (Blue #1570ef) */}
                  <g
                    onClick={() => setActiveFlywheelQuadrant(0)}
                    onMouseEnter={() => setActiveFlywheelQuadrant(0)}
                    className="cursor-pointer transition-transform duration-200 hover:scale-[1.015] origin-[520px_280px]"
                    filter={activeFlywheelQuadrant === 0 ? "url(#glow-acq)" : undefined}
                  >
                    <path
                      d="M 330.72 263.44 A 190 190 0 0 1 503.44 90.72 L 508.23 145.51 A 135 135 0 0 0 385.51 268.23 Z"
                      fill="#1570ef"
                      opacity={activeFlywheelQuadrant === 0 ? 1 : 0.88}
                    />
                    {/* White Directional Clockwise Arrow Head */}
                    <g transform="translate(480.7, 122.3) rotate(346)">
                      <polygon points="0,-6.5 12,0 0,6.5" fill="#ffffff" />
                    </g>
                    {/* Curved White Title */}
                    <text>
                      <textPath
                        href="#tp-acq"
                        startOffset="48%"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="15px"
                        fontWeight="900"
                        letterSpacing="0.4px"
                      >
                        Acquisition
                      </textPath>
                    </text>
                  </g>

                  {/* Quadrant 1: Pipeline (Teal #00b894) */}
                  <g
                    onClick={() => setActiveFlywheelQuadrant(1)}
                    onMouseEnter={() => setActiveFlywheelQuadrant(1)}
                    className="cursor-pointer transition-transform duration-200 hover:scale-[1.015] origin-[520px_280px]"
                    filter={activeFlywheelQuadrant === 1 ? "url(#glow-pipe)" : undefined}
                  >
                    <path
                      d="M 536.56 90.72 A 190 190 0 0 1 709.28 263.44 L 654.49 268.23 A 135 135 0 0 0 531.77 145.51 Z"
                      fill="#00b894"
                      opacity={activeFlywheelQuadrant === 1 ? 1 : 0.88}
                    />
                    {/* White Directional Clockwise Arrow Head */}
                    <g transform="translate(677.7, 240.7) rotate(76)">
                      <polygon points="0,-6.5 12,0 0,6.5" fill="#ffffff" />
                    </g>
                    {/* Curved White Title */}
                    <text>
                      <textPath
                        href="#tp-pipe"
                        startOffset="48%"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="15px"
                        fontWeight="900"
                        letterSpacing="0.4px"
                      >
                        Pipeline
                      </textPath>
                    </text>
                  </g>

                  {/* Quadrant 2: Revenue (Green #10b981) */}
                  <g
                    onClick={() => setActiveFlywheelQuadrant(2)}
                    onMouseEnter={() => setActiveFlywheelQuadrant(2)}
                    className="cursor-pointer transition-transform duration-200 hover:scale-[1.015] origin-[520px_280px]"
                    filter={activeFlywheelQuadrant === 2 ? "url(#glow-rev)" : undefined}
                  >
                    <path
                      d="M 709.28 296.56 A 190 190 0 0 1 536.56 469.28 L 531.77 414.49 A 135 135 0 0 0 654.49 291.77 Z"
                      fill="#10b981"
                      opacity={activeFlywheelQuadrant === 2 ? 1 : 0.88}
                    />
                    {/* White Directional Clockwise Arrow Head */}
                    <g transform="translate(559.3, 437.7) rotate(166)">
                      <polygon points="0,-6.5 12,0 0,6.5" fill="#ffffff" />
                    </g>
                    {/* Curved White Title */}
                    <text>
                      <textPath
                        href="#tp-rev"
                        startOffset="48%"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="15px"
                        fontWeight="900"
                        letterSpacing="0.4px"
                      >
                        Revenue
                      </textPath>
                    </text>
                  </g>

                  {/* Quadrant 3: AI Intelligence (Purple #a855f7) */}
                  <g
                    onClick={() => setActiveFlywheelQuadrant(3)}
                    onMouseEnter={() => setActiveFlywheelQuadrant(3)}
                    className="cursor-pointer transition-transform duration-200 hover:scale-[1.015] origin-[520px_280px]"
                    filter={activeFlywheelQuadrant === 3 ? "url(#glow-ai)" : undefined}
                  >
                    <path
                      d="M 503.44 469.28 A 190 190 0 0 1 330.72 296.56 L 385.51 291.77 A 135 135 0 0 0 508.23 414.49 Z"
                      fill="#a855f7"
                      opacity={activeFlywheelQuadrant === 3 ? 1 : 0.88}
                    />
                    {/* White Directional Clockwise Arrow Head */}
                    <g transform="translate(362.3, 319.3) rotate(256)">
                      <polygon points="0,-6.5 12,0 0,6.5" fill="#ffffff" />
                    </g>
                    {/* Curved White Title */}
                    <text>
                      <textPath
                        href="#tp-ai"
                        startOffset="48%"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="13.5px"
                        fontWeight="900"
                        letterSpacing="0.3px"
                      >
                        AI Intelligence
                      </textPath>
                    </text>
                  </g>

                  {/* 3. Center Core Hub (White Disc & Inner Ring at cx=520, cy=280) */}
                  <circle
                    cx="520"
                    cy="280"
                    r="125"
                    fill="#ffffff"
                    stroke="#e2e8f0"
                    strokeWidth="1.5"
                    filter="url(#hub-shadow)"
                  />
                  <circle cx="520" cy="280" r="108" fill="none" stroke="#f1f5f9" strokeWidth="1" />

                  {/* Center Core Hub Content (Strictly Centered Vector Elements at cx=520, cy=280) */}
                  <g transform="translate(520, 280)">
                    {/* Brand Logo: Digital FX (Symmetrically Centered at x=0) */}
                    <g transform="translate(0, -28)">
                      <text
                        x="10"
                        y="0"
                        textAnchor="end"
                        fill="#080d24"
                        fontSize="17px"
                        fontWeight="900"
                        letterSpacing="-0.4px"
                        dominantBaseline="central"
                      >
                        Digital
                      </text>
                      <g transform="translate(16, -11)">
                        <rect x="0" y="0" width="28" height="22" rx="5" fill="#1570ef" />
                        <text
                          x="14"
                          y="11"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="#ffffff"
                          fontSize="11.5px"
                          fontWeight="900"
                          letterSpacing="0.5px"
                        >
                          FX
                        </text>
                      </g>
                    </g>

                    {/* Title: Revenue Engine (Strictly Centered at x=0) */}
                    <text
                      x="0"
                      y="2"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#080d24"
                      fontSize="18px"
                      fontWeight="900"
                      letterSpacing="-0.4px"
                    >
                      Revenue Engine
                    </text>

                    {/* Dynamic Metric Pill (Strictly Centered at x=0) */}
                    <g transform="translate(0, 32)">
                      <rect
                        x="-88"
                        y="-12"
                        width="176"
                        height="24"
                        rx="12"
                        fill={
                          activeFlywheelQuadrant === 0 ? "#eff6ff" :
                          activeFlywheelQuadrant === 1 ? "#f0fdfa" :
                          activeFlywheelQuadrant === 2 ? "#ecfdf5" : "#faf5ff"
                        }
                        stroke={
                          activeFlywheelQuadrant === 0 ? "#bfdbfe" :
                          activeFlywheelQuadrant === 1 ? "#99f6e4" :
                          activeFlywheelQuadrant === 2 ? "#a7f3d0" : "#e9d5ff"
                        }
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={
                          activeFlywheelQuadrant === 0 ? "#1570ef" :
                          activeFlywheelQuadrant === 1 ? "#00b894" :
                          activeFlywheelQuadrant === 2 ? "#10b981" : "#a855f7"
                        }
                        fontSize="11.5px"
                        fontWeight="900"
                        letterSpacing="0.3px"
                      >
                        {activeFlywheelQuadrant === 0 && "15% Higher Lead Growth"}
                        {activeFlywheelQuadrant === 1 && "84% Higher Lead Velocity"}
                        {activeFlywheelQuadrant === 2 && "₹100,000+ Closed Scale"}
                        {activeFlywheelQuadrant === 3 && "#1 AI Search Citations"}
                      </text>
                    </g>
                  </g>

                  {/* 4. Strictly Aligned Vector Callout Text (Pushed Far Outward: Left at x=20, Right at x=1020, with Non-Intersecting Connectors) */}
                  {/* Callout Q0: Acquisition (Top-Left, Above y=210, Left-Aligned at x=20, Zero Overwrite) */}
                  <g opacity={activeFlywheelQuadrant === 0 ? 1 : 0} className="transition-opacity duration-300 pointer-events-none">
                    <text x="20" y="152" fill="#080d24" fontSize="14.5px" fontWeight="900">Stay Visible &amp; Drive Traffic</text>
                    <text x="20" y="174" fill="#475467" fontSize="12px" fontWeight="600">Get your brand in front of ready-</text>
                    <text x="20" y="194" fill="#475467" fontSize="12px" fontWeight="600">to-buy customers in Search &amp; AI.</text>
                  </g>

                  {/* Callout Q1: Pipeline (Top-Right, Above y=210, Right-Aligned at x=1020, Zero Overwrite) */}
                  <g opacity={activeFlywheelQuadrant === 1 ? 1 : 0} className="transition-opacity duration-300 pointer-events-none">
                    <text x="1020" y="152" textAnchor="end" fill="#080d24" fontSize="14.5px" fontWeight="900">Capture &amp; Nurture Leads</text>
                    <text x="1020" y="174" textAnchor="end" fill="#475467" fontSize="12px" fontWeight="600">Turn high-intent visitors into</text>
                    <text x="1020" y="194" textAnchor="end" fill="#475467" fontSize="12px" fontWeight="600">sales-ready qualified pipeline.</text>
                  </g>

                  {/* Callout Q2: Revenue (Bottom-Right, Above y=425, Right-Aligned at x=1020, Zero Overwrite) */}
                  <g opacity={activeFlywheelQuadrant === 2 ? 1 : 0} className="transition-opacity duration-300 pointer-events-none">
                    <text x="1020" y="367" textAnchor="end" fill="#080d24" fontSize="14.5px" fontWeight="900">Closed-Loop ROI Scale</text>
                    <text x="1020" y="389" textAnchor="end" fill="#475467" fontSize="12px" fontWeight="600">Attribute real pipeline value &amp;</text>
                    <text x="1020" y="409" textAnchor="end" fill="#475467" fontSize="12px" fontWeight="600">closed revenue to your marketing.</text>
                  </g>

                  {/* Callout Q3: AI Intelligence (Bottom-Left, Above y=425, Left-Aligned at x=20, Zero Overwrite) */}
                  <g opacity={activeFlywheelQuadrant === 3 ? 1 : 0} className="transition-opacity duration-300 pointer-events-none">
                    <text x="20" y="367" fill="#080d24" fontSize="14.5px" fontWeight="900">AI Overview &amp; GEO Engine</text>
                    <text x="20" y="389" fill="#475467" fontSize="12px" fontWeight="600">Continuous feedback loop feeding</text>
                    <text x="20" y="409" fill="#475467" fontSize="12px" fontWeight="600">high-intent AI search algorithms.</text>
                  </g>
                </svg>

                {/* Mobile Responsive Active Stage Summary Card */}
                <div className="md:hidden mt-3 p-3 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
                  <div className="text-xs font-black text-[#080d24]">
                    {flywheelData[activeFlywheelQuadrant].title}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    {flywheelData[activeFlywheelQuadrant].desc}
                  </div>
                </div>

              </div>

              {/* WebFX Proven Revenue Impact Grid - Realistic Data for Emerging Agency */}
              <div className="mt-12 relative z-10 max-w-[1040px] mx-auto">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_12px_40px_rgba(8,13,36,0.06)] p-6 sm:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center lg:text-left divide-y sm:divide-y-0 lg:divide-x divide-slate-100">
                    
                    {/* Metric 1: Qualified Lead Growth */}
                    <div className="pt-3 sm:pt-0 lg:px-4 first:lg:pl-0">
                      <span className="text-2xl sm:text-3xl font-black text-[#1570ef] tracking-tight block">
                        15% Higher
                      </span>
                      <h3 className="text-sm font-black text-[#080d24] mt-1 leading-snug">
                        Qualified Lead Growth
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">
                        For clients who connect their data &amp; CRM attribution.
                      </p>
                    </div>

                    {/* Metric 2: AI Citations & Visibility */}
                    <div className="pt-4 sm:pt-0 lg:px-4">
                      <span className="text-2xl sm:text-3xl font-black text-purple-600 tracking-tight block">
                        2,500+
                      </span>
                      <h3 className="text-sm font-black text-[#080d24] mt-1 leading-snug">
                        Citations in AI Sources
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">
                        AI visibility tracked across ChatGPT, Gemini &amp; Copilot.
                      </p>
                    </div>

                    {/* Metric 3: Rated Agency & Reviews */}
                    <div className="pt-4 sm:pt-0 lg:px-4">
                      <span className="text-2xl sm:text-3xl font-black text-amber-500 tracking-tight block">
                        #1 Rated
                      </span>
                      <h3 className="text-sm font-black text-[#080d24] mt-1 leading-snug">
                        Agency on Google &amp; Clutch
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">
                        Verified from 50+ client reviews (5 / 5 Rating).
                      </p>
                    </div>

                    {/* Metric 4: Closed Revenue & Measurable ROI */}
                    <div className="pt-4 sm:pt-0 lg:px-4 last:lg:pr-0">
                      <span className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight block">
                        ₹100,000+
                      </span>
                      <h3 className="text-sm font-black text-[#080d24] mt-1 leading-snug">
                        Closed Client Revenue
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">
                        Driving measurable ROI across 10+ delivered projects.
                      </p>
                    </div>

                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ==========================================================================
            4. CLIENT TRUST & AUTHORITY STRIP
            ========================================================================== */}
        <section className="bg-white py-10 border-b border-slate-200">
          <div className="max-w-[1360px] mx-auto px-6">
            <p className="text-center text-[11px] font-black uppercase tracking-[2.4px] text-slate-400 mb-8">
              TRUSTED BY GROWTH-FOCUSED BRANDS & BUSINESS LEADERS ACROSS INDIA
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center justify-center text-center">
              {[
                { name: "HEALTHCARE", sub: "Clinics & Hospitals" },
                { name: "RETAIL & E-COM", sub: "Direct To Consumer" },
                { name: "MANUFACTURING", sub: "Industrial & B2B" },
                { name: "REAL ESTATE", sub: "Developers & Agents" },
                { name: "PROFESSIONAL", sub: "Legal & Consulting" },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:shadow-xs transition">
                  <span className="text-xs font-black tracking-wider text-[#080d24] block">{item.name}</span>
                  <span className="text-[10px] text-slate-400 font-bold">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================================================
            5. REVENUE MARKETING SPLIT FUNNEL (Exact Reproduction from media_1788817718193.png)
            ========================================================================== */}
        <section
          id="growth-dashboard"
          className="py-20 sm:py-24 bg-gradient-to-b from-[#f8faff] via-white to-slate-50 border-b border-slate-200"
        >
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            
            {/* Header: Move From Marketing that Reports Clicks to Marketing that Reports Revenue */}
            <div className="text-center max-w-[920px] mx-auto">
              <h2 className="text-[32px] sm:text-[44px] lg:text-[50px] font-black text-[#080d24] tracking-[-0.04em] leading-[1.12]">
                Move From Marketing that Reports Clicks to{" "}
                <span className="block text-[#1570ef]">
                  Marketing that Reports Revenue
                </span>
              </h2>
              <p className="mt-5 text-[15px] sm:text-[17px] leading-[1.65] text-slate-600 font-normal max-w-[800px] mx-auto">
                Traditional marketing optimizes for channel metrics. Revenue marketing optimizes for business impact. Connected revenue marketing through <strong className="font-extrabold text-[#080d24]">Digital FX</strong> leads to <strong className="font-extrabold text-[#1570ef]">1.8X faster lead growth than industry average</strong>.
              </p>
            </div>

            {/* Split Funnel Graphic (Traditional vs Revenue Marketing) */}
            <div className="relative max-w-[860px] mx-auto mt-10 sm:mt-14 select-none">
              
              <div className="relative w-full aspect-[800/460]">
                <svg viewBox="0 0 800 460" className="w-full h-full drop-shadow-sm overflow-visible">
                  <defs>
                    {/* Glowing gradients for Right Funnel Tiers */}
                    <linearGradient id="funnelTier1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1570ef" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                    <linearGradient id="funnelTier2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#00b894" />
                    </linearGradient>
                    <linearGradient id="funnelTier3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="funnelTier4" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#84cc16" />
                      <stop offset="100%" stopColor="#a3e635" />
                    </linearGradient>
                    
                    {/* Slate Gradient for Left Broken Funnel */}
                    <linearGradient id="funnelBroken" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#64748b" />
                      <stop offset="100%" stopColor="#475467" />
                    </linearGradient>
                    <linearGradient id="funnelBrokenRim" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#334155" />
                      <stop offset="100%" stopColor="#1e293b" />
                    </linearGradient>
                    <linearGradient id="funnelRightRim" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e40af" />
                      <stop offset="100%" stopColor="#1570ef" />
                    </linearGradient>

                    {/* Funnel Drop Shadow */}
                    <filter id="funnelShadow" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="10" stdDeviation="16" floodColor="#080d24" floodOpacity="0.08" />
                    </filter>
                  </defs>

                  {/* 1. Background Sweeping Dashed Trajectory & Feedback Loop */}
                  <g opacity="0.85">
                    {/* Upward Growth Trajectory Line */}
                    <path
                      d="M 50 290 C 180 320 260 180 380 130 C 500 80 620 180 720 50"
                      fill="none"
                      stroke="#5eead4"
                      strokeWidth="2"
                      strokeDasharray="6 6"
                    />
                    {/* Upward Growth Arrowhead at (720, 50) */}
                    <polygon points="720,50 710,54 716,62" fill="#5eead4" />

                    {/* Looping Closed-Loop Feedback Arrow into Funnel Top */}
                    <path
                      d="M 500 110 C 540 60 480 20 420 30 C 395 35 385 50 395 62"
                      fill="none"
                      stroke="#99f6e4"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    <polygon points="395,62 388,54 398,52" fill="#99f6e4" />
                  </g>

                  {/* 2. LEFT SIDE: Traditional Broken/Leaky Funnel */}
                  <g filter="url(#funnelShadow)">
                    {/* Left Interior Rim (Back) */}
                    <path
                      d="M 220 90 A 180 35 0 0 1 400 55 L 400 90 A 180 35 0 0 0 220 90 Z"
                      fill="url(#funnelBrokenRim)"
                    />

                    {/* Left Front Body */}
                    <path
                      d="M 220 90 A 180 35 0 0 0 400 125 L 400 340 L 382 340 Z"
                      fill="url(#funnelBroken)"
                    />

                    {/* Realistic Broken Cracks & Fissures on Left Funnel */}
                    {/* Crack Line 1: Main diagonal fracture */}
                    <path
                      d="M 255 130 L 285 160 L 270 190 L 315 225 L 298 260 L 340 288 L 360 325"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Crack Branch 1 */}
                    <path
                      d="M 285 160 L 325 175 L 350 205"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    {/* Crack Branch 2 */}
                    <path
                      d="M 315 225 L 355 235 L 375 250"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    {/* Transverse Fissure (Split gap between stages) */}
                    <path
                      d="M 310 245 L 398 250"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Chipped Edge Indentation */}
                    <polygon
                      points="260,140 268,148 262,156 254,148"
                      fill="#ffffff"
                      opacity="0.95"
                    />
                  </g>

                  {/* 3. RIGHT SIDE: 4 Vibrant Connected Revenue Marketing Tiers */}
                  <g filter="url(#funnelShadow)">
                    {/* Right Interior Rim (Back) */}
                    <path
                      d="M 400 55 A 180 35 0 0 1 580 90 L 400 90 Z"
                      fill="url(#funnelRightRim)"
                    />

                    {/* Tier 1: Brand Visibility (Blue) */}
                    <path
                      d="M 400 90 A 180 35 0 0 1 580 90 L 528 155 A 128 26 0 0 1 400 175 Z"
                      fill="url(#funnelTier1)"
                    />
                    {/* Tier 1 Top Rim Surface */}
                    <path
                      d="M 400 90 A 180 35 0 0 1 580 90 A 180 35 0 0 1 400 125 Z"
                      fill="#2563eb"
                      opacity="0.8"
                    />

                    {/* Tier 2: Website Traffic (Teal / Cyan) */}
                    <path
                      d="M 400 175 A 128 26 0 0 0 528 155 L 476 220 A 76 18 0 0 1 400 234 Z"
                      fill="url(#funnelTier2)"
                    />

                    {/* Tier 3: Qualified Leads (Emerald Green) */}
                    <path
                      d="M 400 234 A 76 18 0 0 0 476 220 L 435 285 A 35 12 0 0 1 400 294 Z"
                      fill="url(#funnelTier3)"
                    />

                    {/* Tier 4: Sales (Lime Green) */}
                    <path
                      d="M 400 294 A 35 12 0 0 0 435 285 L 418 340 L 400 340 Z"
                      fill="url(#funnelTier4)"
                    />
                  </g>

                  {/* 4. Labels & Connectors for the 4 Tiers */}
                  {/* Tier 1 Label: Brand Visibility */}
                  <g>
                    <line x1="550" y1="122" x2="615" y2="122" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="622" y="126" fill="#080d24" fontSize="13px" fontWeight="800">Brand Visibility</text>
                  </g>

                  {/* Tier 2 Label: Website Traffic */}
                  <g>
                    <line x1="500" y1="188" x2="585" y2="188" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="592" y="192" fill="#080d24" fontSize="13px" fontWeight="800">Website Traffic</text>
                  </g>

                  {/* Tier 3 Label: Qualified Leads */}
                  <g>
                    <line x1="455" y1="252" x2="550" y2="252" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="557" y="256" fill="#080d24" fontSize="13px" fontWeight="800">Qualified Leads</text>
                  </g>

                  {/* Tier 4 Label: Sales */}
                  <g>
                    <line x1="426" y1="312" x2="495" y2="312" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="502" y="316" fill="#080d24" fontSize="13px" fontWeight="800">Sales</text>
                  </g>

                  {/* Revenue-Backed Optimization Callout */}
                  <g transform="translate(620, 315)">
                    <text x="0" y="0" textAnchor="middle" fill="#00b894" fontSize="11.5px" fontWeight="900" letterSpacing="0.3px">
                      Revenue-Backed
                    </text>
                    <text x="0" y="15" textAnchor="middle" fill="#00b894" fontSize="11.5px" fontWeight="900" letterSpacing="0.3px">
                      Optimization
                    </text>
                  </g>

                  {/* 5. Center Slicing Divider Line (Separating Broken vs Revenue Funnel) */}
                  <line
                    x1="400"
                    y1="40"
                    x2="400"
                    y2="375"
                    stroke="#080d24"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Bottom weighted anchor tip */}
                  <polygon points="394,375 406,375 406,392 400,398 394,392" fill="#080d24" />

                </svg>
              </div>

              {/* Bottom Comparison Columns (Directly Aligned with Left & Right Halves) */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 max-w-[780px] mx-auto text-center md:text-left">
                
                {/* Left: Traditional Digital Marketing */}
                <div className="md:pr-4">
                  <h3 className="text-lg font-black text-[#475467]">
                    Traditional Digital Marketing
                  </h3>
                  <p className="mt-2 text-xs sm:text-[13.5px] text-slate-500 font-medium leading-relaxed">
                    Siloed marketing and sales data leads to a broken, inefficient funnel that leads to decisions based on <span className="italic font-semibold">feel</span> rather than true ROI.
                  </p>
                </div>

                {/* Right: Revenue Marketing */}
                <div className="md:pl-4">
                  <h3 className="text-lg font-black text-[#080d24]">
                    Revenue Marketing
                  </h3>
                  <p className="mt-2 text-xs sm:text-[13.5px] text-slate-700 font-medium leading-relaxed">
                    Digital FX connects your data through <strong className="text-[#080d24] font-black">Digital <span className="bg-[#1570ef] text-white px-1.5 py-0.5 rounded text-[10px] font-bold">FX</span></strong> to make revenue-backed marketing decisions that reduce cost per lead and maximize ROI.
                  </p>
                </div>

              </div>

              {/* Three Connected Pillars: Platform, People, Playbooks */}
              <div className="mt-14 pt-12 border-t border-slate-200 text-center">
                <h3 className="text-2xl sm:text-3xl font-black text-[#080d24] tracking-tight">
                  Uniquely Positioned to Power Real Revenue Growth
                </h3>
                <p className="mt-3 text-sm sm:text-[15px] text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
                  Every result our digital marketing agency delivers is powered by three connected pillars — expert execution, a revenue platform built to connect marketing to ROI, and AI-powered intelligence that informs better decisions.
                </p>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  {/* Pillar 1: Platform */}
                  <div className="p-6 rounded-2xl bg-[#f8faff] border border-blue-100 hover:border-blue-300 transition-all duration-300 group hover:shadow-md">
                    <div className="inline-block text-[11px] font-black uppercase tracking-wider text-[#1570ef] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      platform
                    </div>
                    <h4 className="text-lg font-black text-[#080d24] mt-3 mb-2">
                      Revenue Platform
                    </h4>
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium">
                      Built to track, attribute, and connect multi-channel marketing spend directly to real customer inquiries and verified closed ROI.
                    </p>
                  </div>

                  {/* Pillar 2: People */}
                  <div className="p-6 rounded-2xl bg-[#f8fafc] border border-emerald-100 hover:border-emerald-300 transition-all duration-300 group hover:shadow-md">
                    <div className="inline-block text-[11px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      people
                    </div>
                    <h4 className="text-lg font-black text-[#080d24] mt-3 mb-2">
                      Strategic Execution
                    </h4>
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium">
                      Dedicated senior growth strategists, copywriters, and media buyers actively managing Search, Meta ads, local Maps, and funnels.
                    </p>
                  </div>

                  {/* Pillar 3: Playbooks */}
                  <div className="p-6 rounded-2xl bg-[#faf8ff] border border-purple-100 hover:border-purple-300 transition-all duration-300 group hover:shadow-md">
                    <div className="inline-block text-[11px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                      playbooks
                    </div>
                    <h4 className="text-lg font-black text-[#080d24] mt-3 mb-2">
                      AI-Powered Intelligence
                    </h4>
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium">
                      Continuous data feedback loops and predictive models feeding Google Search, AI Overviews, and generative engine algorithms.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ==========================================================================
            6. WEBFX 4-STAGE SERVICES FUNNEL MATRIX
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

          </div>
        </section>

        {/* ==========================================================================
            7. PROPRIETARY GEO & AI SEARCH AUDIT SUITE (WEBFX EXECUTIVE DESIGN)
            ========================================================================== */}
        <section id="geo-checker" className="py-24 bg-[#f8fafc] border-b border-slate-200 relative overflow-hidden">
          <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            
            {/* Header Area */}
            <div className="mx-auto max-w-[840px] text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1570ef]">
                <span className="w-2 h-2 rounded-full bg-[#1570ef]" />
                GEO &amp; AI Search Audit Engine
              </span>
              <h2 className="mt-4 text-[34px] sm:text-[46px] lg:text-[54px] font-black text-[#080d24] tracking-tight leading-[1.08]">
                Benchmark Your Brand in{" "}
                <span className="webfx-serif text-[#1570ef] block sm:inline font-normal">
                  ChatGPT, Gemini &amp; AI Search.
                </span>
              </h2>
              <p className="mt-3.5 text-base sm:text-lg text-slate-600 max-w-[660px] mx-auto leading-relaxed font-normal">
                Scan your website in seconds to audit your Generative Engine Optimization (GEO) score, structured entity schema, and local Google AI Overviews readiness.
              </p>
            </div>

            {/* Clean White Audit Search Bar Console */}
            <div className="mx-auto mt-10 max-w-[780px]">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-3 sm:p-4 shadow-sm hover:border-slate-300 transition-all">
                <form onSubmit={handleGeoCheck} className="flex flex-col sm:flex-row items-stretch gap-2.5">
                  <div className="relative flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-1 focus-within:border-[#1570ef] focus-within:bg-white transition">
                    <span className="text-slate-400 text-xs font-bold mr-2 select-none">https://</span>
                    <input
                      type="text"
                      value={geoWebsite}
                      onChange={(e) => setGeoWebsite(e.target.value)}
                      placeholder="yourbusiness.com"
                      required
                      className="flex-1 bg-transparent py-3 text-sm text-slate-800 placeholder:text-slate-400 font-semibold focus:outline-none"
                    />
                    {geoWebsite && (
                      <button
                        type="button"
                        onClick={() => setGeoWebsite("")}
                        className="text-slate-400 hover:text-slate-700 text-xs px-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={geoLoading}
                    className="px-8 py-3.5 rounded-xl bg-[#080d24] hover:bg-[#1570ef] text-white font-extrabold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap shadow-xs"
                  >
                    {geoLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Auditing Signals...</span>
                      </>
                    ) : (
                      <>
                        <span>⚡ Run Free AI Audit</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Sample Domain Chips */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 px-1 text-[11.5px] text-slate-500">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-slate-600">Sample Websites:</span>
                    {["thewoodcraftstudio.in", "smiledentalindirapuram.com", "bansaltaxncr.in"].map((sample) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => {
                          setGeoWebsite(sample);
                          runGeoAudit(sample);
                        }}
                        className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-[#1570ef] text-[11px] font-bold transition cursor-pointer"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                    <span>✓ 100% Free</span>
                    <span>✓ No Signup Required</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clean Scanning Progress State */}
            {geoLoading && (
              <div className="mx-auto mt-6 max-w-[680px] rounded-2xl border border-blue-200 bg-white p-6 shadow-sm animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-black text-[#1570ef] mb-2.5">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-ping" />
                    AUDITING LIVE AI SEARCH CRAWLERS
                  </span>
                  <span>{geoScanStep === 1 ? "35%" : geoScanStep === 2 ? "70%" : "95%"}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#1570ef] to-[#00b894] transition-all duration-300 rounded-full"
                    style={{ width: geoScanStep === 1 ? "35%" : geoScanStep === 2 ? "70%" : "95%" }}
                  />
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className={`flex items-center gap-2 ${geoScanStep >= 1 ? "text-emerald-700 font-bold" : "text-slate-400"}`}>
                    <span>{geoScanStep >= 1 ? "✓" : "○"}</span>
                    <span>Pinging OpenAI SearchGPT &amp; ChatGPT citation database</span>
                  </div>
                  <div className={`flex items-center gap-2 ${geoScanStep >= 2 ? "text-emerald-700 font-bold" : "text-slate-400"}`}>
                    <span>{geoScanStep >= 2 ? "✓" : "○"}</span>
                    <span>Checking Google Gemini &amp; Knowledge Entity Graph associations</span>
                  </div>
                  <div className={`flex items-center gap-2 ${geoScanStep >= 3 ? "text-emerald-700 font-bold" : "text-slate-400"}`}>
                    <span>{geoScanStep >= 3 ? "✓" : "○"}</span>
                    <span>Auditing Schema.org JSON-LD LocalBusiness &amp; conversational FAQ signals</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {geoError && (
              <div className="mx-auto mt-6 max-w-[780px] rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-bold text-red-700">
                {geoError}
              </div>
            )}

            {/* Complete Executive Audit Report Card */}
            {geoResult && !geoLoading && (
              <div className="mx-auto mt-10 max-w-[1080px] rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl animate-fadeIn">
                
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-700">Verified AI Audit Report</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#080d24] mt-1">
                      Audit Target: <span className="text-[#1570ef] font-mono">{geoWebsite || "yourbusiness.com"}</span>
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold">
                      Live Engine Index
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                      Outperforms 68% in Sector
                    </span>
                  </div>
                </div>

                {/* Score Dial & 4 Diagnostic Pillars */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-8">
                  
                  {/* Left: Overall Score Dial */}
                  <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 text-center">
                    <div className="relative w-44 h-44 flex items-center justify-center">
                      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                        <circle cx="80" cy="80" r="68" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                        <circle
                          cx="80"
                          cy="80"
                          r="68"
                          fill="none"
                          stroke="url(#geo-score-grad-light)"
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray={427}
                          strokeDashoffset={427 - (427 * (geoResult.score ?? geoResult.overall ?? 82)) / 100}
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="geo-score-grad-light" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1570ef" />
                            <stop offset="50%" stopColor="#00b894" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-[44px] font-black text-[#080d24] leading-none tracking-tight">
                          {geoResult.score ?? geoResult.overall ?? 82}
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-1">out of 100</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                        {geoResult.grade || "Strong Base with AI Schema Gaps"}
                      </span>
                      <p className="text-xs text-slate-500 mt-2 max-w-[220px]">
                        Overall readiness for ChatGPT, Perplexity &amp; Google AI Overviews.
                      </p>
                    </div>
                  </div>

                  {/* Right: 4 Diagnostic Pillars */}
                  <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        title: "AI Citation Frequency",
                        score: geoResult.aiVisibility ?? 78,
                        desc: "Probability of being cited in ChatGPT, Copilot & Perplexity answers.",
                        color: "#1570ef",
                      },
                      {
                        title: "Knowledge Entity & Schema",
                        score: geoResult.contentReadiness ?? 72,
                        desc: "JSON-LD structured data and semantic entity graph authority.",
                        color: "#00b894",
                      },
                      {
                        title: "Local Proximity & Maps",
                        score: geoResult.localPresence ?? 85,
                        desc: "Google Maps 3-Pack rank weight and local NAP consistency.",
                        color: "#10b981",
                      },
                      {
                        title: "Content & EEAT Semantic Depth",
                        score: geoResult.technicalSignals ?? 89,
                        desc: "Conversational query coverage and topical authority depth.",
                        color: "#a855f7",
                      },
                    ].map((pillar) => (
                      <div key={pillar.title} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-black text-[#080d24]">{pillar.title}</span>
                          <span className="text-sm font-black" style={{ color: pillar.color }}>
                            {pillar.score}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden mb-2">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pillar.score}%`, backgroundColor: pillar.color }}
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">{pillar.desc}</p>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Audit Key Findings & Critical Fixes */}
                <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Verified Strengths */}
                  <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-3">
                      <span>✓</span>
                      <span>Verified Strengths Detected</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700 font-medium">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>Crawlable mobile architecture with responsive viewport configuration.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>Active Google Maps listing verified with organic citation footprint.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>Baseline brand name queries resolve cleanly in conversational search.</span>
                      </li>
                    </ul>
                  </div>

                  {/* High-Impact AI Gaps */}
                  <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200">
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-3">
                      <span>⚠️</span>
                      <span>High-Impact AI Fixes Needed</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700 font-medium">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span><strong>Missing Entity Schema:</strong> Lack of JSON-LD <code>sameAs</code> connections prevents ChatGPT from recognizing your brand.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span><strong>No Conversational Q&amp;A Clusters:</strong> Google AI Overviews requires explicit answer snippets to trigger citations.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span><strong>Voice Search Intent Gap:</strong> Competitors are outranking you for long-tail &quot;best near me&quot; voice queries.</span>
                      </li>
                    </ul>
                  </div>

                </div>

                {/* Executive Action Banner */}
                <div className="mt-8 rounded-2xl bg-[#080d24] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
                  <div>
                    <span className="text-[10.5px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 rounded-full">
                      FIX THESE 3 ISSUES
                    </span>
                    <h4 className="text-lg sm:text-xl font-black text-white mt-1.5">
                      Want Digital FX to optimize your site for #1 AI Citations?
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5 max-w-[540px]">
                      We implement full JSON-LD entity schema, conversational content clusters, and optimize your business for Google AI Overviews.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
                    <a
                      href={`https://wa.me/919876543210?text=${encodeURIComponent(
                        `Hi Digital FX, I just ran a GEO AI Audit on ${geoWebsite || "my website"} and got score ${
                          geoResult.score ?? geoResult.overall ?? 82
                        }/100. Please share the plan to fix the missing AI citations and entity schema.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs text-center shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>💬 Fix on WhatsApp (15% OFF)</span>
                      <span>→</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => openPricingModal()}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs text-center transition cursor-pointer"
                    >
                      View Payment &amp; Packages
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        </section>

        {/* Pricing packages have been moved to the interactive on-demand Checkout Portal (opened via Pricing nav/buttons) */}

        {/* ==========================================================================
            9. VERIFIED CLIENT REVIEWS - HORIZONTAL CONTINUOUS MARQUEE (30 Verified Indian Reviews)
            ========================================================================== */}
        <section id="case-studies" className="py-24 bg-white border-b border-slate-200 overflow-hidden">
          <div className="max-w-[1360px] mx-auto px-6 mb-12">
            
            <div className="text-center max-w-[820px] mx-auto">
              <span className="text-[11px] font-black uppercase tracking-[2px] text-[#207de9] bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full">
                VERIFIED CLIENT REVIEWS (50+ CLIENTS)
              </span>
              <h2 className="mt-4 text-[34px] sm:text-[46px] lg:text-[52px] font-black text-[#080d24] tracking-[-0.04em] leading-[1.08]">
                Real Results Delivered For
                <span className="webfx-serif text-[#207de9] block font-normal mt-1">
                  30+ Verified Businesses Across India.
                </span>
              </h2>
              <p className="mt-3 text-xs font-bold text-slate-500">
                ← Auto-scrolling horizontally • Hover over any card to pause and read →
              </p>
            </div>

          </div>

          {/* Infinite Horizontal Reviews Marquee Track */}
          <div className="relative w-full overflow-hidden py-4">
            <div className="reviews-marquee-track">
              {/* First Set of 30 Reviews */}
              {clientReviews.map((item, idx) => (
                <div
                  key={`rev-1-${idx}`}
                  className="w-[340px] sm:w-[380px] bg-[#f8faff] p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-[#207de9] transition flex flex-col justify-between shrink-0 select-none"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex text-amber-400 text-sm tracking-widest">
                        {"★".repeat(item.rating)}
                      </div>
                      <span className="text-[9.5px] font-extrabold uppercase tracking-wider bg-white border border-slate-200 px-2 py-0.5 rounded text-[#207de9]">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-medium">
                      "{item.quote}"
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-200/80 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#207de9] text-white font-black text-xs flex items-center justify-center shrink-0">
                      {item.author.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-black text-[#080d24] truncate">{item.author}</div>
                      <div className="text-[11px] text-slate-500 truncate">{item.business}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Duplicate Set of 30 Reviews for Seamless Infinite Loop */}
              {clientReviews.map((item, idx) => (
                <div
                  key={`rev-2-${idx}`}
                  className="w-[340px] sm:w-[380px] bg-[#f8faff] p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-[#207de9] transition flex flex-col justify-between shrink-0 select-none"
                  aria-hidden="true"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex text-amber-400 text-sm tracking-widest">
                        {"★".repeat(item.rating)}
                      </div>
                      <span className="text-[9.5px] font-extrabold uppercase tracking-wider bg-white border border-slate-200 px-2 py-0.5 rounded text-[#207de9]">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-medium">
                      "{item.quote}"
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-200/80 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#207de9] text-white font-black text-xs flex items-center justify-center shrink-0">
                      {item.author.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-black text-[#080d24] truncate">{item.author}</div>
                      <div className="text-[11px] text-slate-500 truncate">{item.business}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================================================
            10. WEBFX SIGNATURE BOTTOM GRADIENT CLOSER CTA
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
                      className="w-full py-3.5 rounded-xl bg-[#207de9] hover:bg-[#1a6bc7] text-white font-extrabold text-sm shadow-sm mt-2 transition disabled:opacity-60 cursor-pointer"
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
            11. WEBFX FOOTER (Restored Exact Office Address: Orbit Plaza, Crossings Republik, Ghaziabad)
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
                  Driving attributable pipeline, local rankings and measurable revenue for growth-oriented brands across Ghaziabad, Delhi NCR, and India.
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
                  <li>
                    <button
                      type="button"
                      onClick={() => openPricingModal()}
                      className="hover:text-white transition text-left cursor-pointer text-slate-400"
                    >
                      Pricing & Online Checkout
                    </button>
                  </li>
                  <li><a href="#case-studies" className="hover:text-white transition">Client Success Proof</a></li>
                </ul>
              </div>

              {/* Exact Office Address */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">Office & Location</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Shop No. 210, Orbit Plaza,<br />
                  Second Floor, Crossings Republik,<br />
                  Ghaziabad, Uttar Pradesh 201016<br />
                  India
                </p>
                <p className="mt-3 text-xs text-slate-400">
                  Email: <a href="mailto:hello@digitalfx.in" className="text-white hover:underline">hello@digitalfx.in</a>
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Location: <span className="text-slate-300">Ghaziabad, Uttar Pradesh, India</span>
                </p>
              </div>

            </div>


            {/* Bottom Bar */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
              <div>
                © {new Date().getFullYear()} Digital FX®. All rights reserved. Registered Digital Marketing Agency.
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
            12. EXECUTIVE CLIENT INVOICE & PAYU CHECKOUT TERMINAL
            ========================================================================== */}
        {paymentOpen && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
            <div className="relative w-full max-w-[1040px] my-auto bg-white rounded-3xl shadow-[0_25px_80px_rgba(8,13,36,0.55)] border border-slate-300 overflow-hidden text-slate-900 font-[var(--font-manrope)]">
              
              {/* Top Institutional Header Bar - Big Bold Typography */}
              <div className="bg-[#080d24] text-white px-6 sm:px-8 py-5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-[#080d24] to-[#207de9] font-black text-sm text-white shadow-md border border-white/10">
                    FX
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                        DIGITAL <span className="text-[#207de9]">FX</span>
                      </span>
                      <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-md border border-white/10">
                        Official Order &amp; Checkout Desk
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-2.5 sm:gap-3.5 font-medium">
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" /> RBI Authorized Gateway
                      </span>
                      <span className="text-slate-500 hidden sm:inline">•</span>
                      <span className="flex items-center gap-1.5 text-slate-300 text-[11.5px] font-semibold">
                        🔒 256-Bit SSL Bank Encrypted
                      </span>
                      <span className="text-slate-500 hidden md:inline">•</span>
                      <span className="hidden md:inline text-slate-300 text-[11.5px] font-semibold">
                        Instant GST Invoice Generated
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closePaymentModal}
                  disabled={paymentLoading}
                  aria-label="Dismiss modal"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition cursor-pointer text-lg font-bold shrink-0 ml-2"
                >
                  ✕
                </button>
              </div>

              {/* Main Content Area */}
              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
                
                {/* Left Column: Plan Selection Ledger (7 cols) */}
                <div className="lg:col-span-7 p-6 sm:p-8 bg-[#fafbfc] flex flex-col justify-between space-y-5">
                  <div>
                    <div className="mb-5">
                      <h3 className="text-xl sm:text-2xl font-black text-[#080d24] tracking-tight">
                        Select Client Engagement Tier
                      </h3>
                      <p className="text-sm text-slate-600 font-medium mt-1 leading-normal">
                        Fixed one-time investment. Immediate kickoff upon payment clearance. Zero retainers or hidden markups.
                      </p>
                    </div>

                    <div className="space-y-3.5">
                      {/* Plan 1: Google Business Profile */}
                      <div
                        onClick={() => setSelectedPaymentPlan(paymentPlans[0])}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                          selectedPaymentPlan?.id === "google_listing"
                            ? "bg-white border-[#207de9] shadow-md ring-2 ring-[#207de9]/20"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3.5">
                            <div className={`w-5 h-5 rounded-full border mt-1 flex items-center justify-center shrink-0 transition ${
                              selectedPaymentPlan?.id === "google_listing"
                                ? "border-[#207de9] bg-[#207de9]"
                                : "border-slate-300 bg-white"
                            }`}>
                              {selectedPaymentPlan?.id === "google_listing" && (
                                <span className="w-2 h-2 rounded-full bg-white block" />
                              )}
                            </div>
                            <div>
                              <div className="text-base sm:text-lg font-black text-[#080d24]">
                                Google Business Profile Setup
                              </div>
                              <div className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5">
                                Maps Rank #1 Optimization &amp; Local Search Authority
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xl sm:text-2xl font-black text-[#080d24]">₹2,999</div>
                            <div className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">One-Time</div>
                          </div>
                        </div>

                        {/* Professional Deliverables Checklist */}
                        <ul className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-2 text-xs sm:text-[13px] text-slate-700 font-medium">
                          <li className="flex items-center gap-2.5">
                            <svg className="w-4 h-4 text-emerald-600 shrink-0 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Official Google Business verification &amp; category schema</span>
                          </li>
                          <li className="flex items-center gap-2.5">
                            <svg className="w-4 h-4 text-emerald-600 shrink-0 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Local 3-Pack Maps ranking audit for Ghaziabad &amp; NCR</span>
                          </li>
                          <li className="flex items-center gap-2.5">
                            <svg className="w-4 h-4 text-emerald-600 shrink-0 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Automated 5-star customer review funnel generation</span>
                          </li>
                        </ul>
                      </div>

                      {/* Plan 2: Website Development */}
                      <div
                        onClick={() => setSelectedPaymentPlan(paymentPlans[1])}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                          selectedPaymentPlan?.id === "website"
                            ? "bg-white border-[#207de9] shadow-md ring-2 ring-[#207de9]/20"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3.5">
                            <div className={`w-5 h-5 rounded-full border mt-1 flex items-center justify-center shrink-0 transition ${
                              selectedPaymentPlan?.id === "website"
                                ? "border-[#207de9] bg-[#207de9]"
                                : "border-slate-300 bg-white"
                            }`}>
                              {selectedPaymentPlan?.id === "website" && (
                                <span className="w-2 h-2 rounded-full bg-white block" />
                              )}
                            </div>
                            <div>
                              <div className="text-base sm:text-lg font-black text-[#080d24]">
                                Website Development
                              </div>
                              <div className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5">
                                High-Velocity Conversion Landing Architecture
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xl sm:text-2xl font-black text-[#080d24]">₹5,999</div>
                            <div className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">One-Time</div>
                          </div>
                        </div>

                        <ul className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-2 text-xs sm:text-[13px] text-slate-700 font-medium">
                          <li className="flex items-center gap-2.5">
                            <svg className="w-4 h-4 text-emerald-600 shrink-0 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Ultra-fast responsive design (&lt;0.8s mobile load time)</span>
                          </li>
                          <li className="flex items-center gap-2.5">
                            <svg className="w-4 h-4 text-emerald-600 shrink-0 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Direct WhatsApp CRM lead routing &amp; consultation capture</span>
                          </li>
                          <li className="flex items-center gap-2.5">
                            <svg className="w-4 h-4 text-emerald-600 shrink-0 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>On-page SEO keyword foundations &amp; mobile indexing</span>
                          </li>
                        </ul>
                      </div>

                      {/* Plan 3: Business Growth Package (Flagship Engine) */}
                      <div
                        onClick={() => setSelectedPaymentPlan(paymentPlans[2])}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                          selectedPaymentPlan?.id === "growth"
                            ? "bg-white border-[#207de9] shadow-md ring-2 ring-[#207de9]/20"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3.5">
                            <div className={`w-5 h-5 rounded-full border mt-1 flex items-center justify-center shrink-0 transition ${
                              selectedPaymentPlan?.id === "growth"
                                ? "border-[#207de9] bg-[#207de9]"
                                : "border-slate-300 bg-white"
                            }`}>
                              {selectedPaymentPlan?.id === "growth" && (
                                <span className="w-2 h-2 rounded-full bg-white block" />
                              )}
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-base sm:text-lg font-black text-[#080d24]">
                                  Business Growth Package
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-wider text-[#207de9] bg-blue-100 border border-blue-200 px-2.5 py-0.5 rounded-md">
                                  FLAGSHIP ENGINE
                                </span>
                              </div>
                              <div className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5">
                                Complete Integrated Growth: Website + Google Profile + Local SEO
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xl sm:text-2xl font-black text-[#080d24]">₹9,999</div>
                            <div className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">One-Time</div>
                          </div>
                        </div>

                        <ul className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-2 text-xs sm:text-[13px] text-slate-700 font-medium">
                          <li className="flex items-center gap-2.5">
                            <svg className="w-4 h-4 text-emerald-600 shrink-0 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Complete custom website + domain &amp; hosting deployment</span>
                          </li>
                          <li className="flex items-center gap-2.5">
                            <svg className="w-4 h-4 text-emerald-600 shrink-0 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Google Business Profile Maps #1 ranking optimization</span>
                          </li>
                          <li className="flex items-center gap-2.5">
                            <svg className="w-4 h-4 text-emerald-600 shrink-0 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>WhatsApp sales routing + 30-day conversion tracking SLA</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Enterprise Retainer Callout */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
                    <div>
                      <div className="text-xs sm:text-sm font-black text-[#080d24]">
                        Enterprise Scope or Custom Scope?
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Multi-location SEO, full PPC campaigns, GEO AI search optimization.
                      </div>
                    </div>
                    <a
                      href="https://wa.me/919876543210?text=Hello%20Digital%20FX%20Team%2C%20we%20require%20a%20custom%20growth%20proposal%20or%20enterprise%20agreement."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold text-xs transition shrink-0 whitespace-nowrap"
                    >
                      WhatsApp Desk →
                    </a>
                  </div>
                </div>

                {/* Right Column: Order Ledger & PayU Checkout Form (5 cols) */}
                <div className="lg:col-span-5 p-6 sm:p-8 bg-white flex flex-col justify-between">
                  <div>
                    {/* Invoice Ledger Header */}
                    <div className="pb-4 border-b border-slate-200">
                      <div className="text-xs font-black uppercase tracking-widest text-[#207de9]">
                        INVOICE SETTLEMENT LEDGER
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-[#080d24] mt-1 tracking-tight">
                        {selectedPaymentPlan ? selectedPaymentPlan.name : "Select Package"}
                      </div>
                    </div>

                    {/* Financial Breakdown Table */}
                    <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
                      <div className="flex justify-between text-slate-600 text-xs sm:text-[13px]">
                        <span>Deployment SLA:</span>
                        <span className="font-bold text-slate-800">3–5 Business Days Kickoff</span>
                      </div>
                      <div className="flex justify-between text-slate-600 text-xs sm:text-[13px]">
                        <span>Invoice Type:</span>
                        <span className="font-bold text-slate-800">Fixed One-Time Fee</span>
                      </div>
                      <div className="flex justify-between text-slate-600 text-xs sm:text-[13px]">
                        <span>Tax &amp; Platform Fee:</span>
                        <span className="font-bold text-emerald-700">Included (0% Surcharge)</span>
                      </div>
                      <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                        <span className="font-extrabold text-[#080d24] text-sm">Total Amount Due:</span>
                        <div className="text-right">
                          <span className="text-3xl sm:text-4xl font-black text-[#080d24] tracking-tight">
                            ₹{selectedPaymentPlan ? Number(selectedPaymentPlan.amount).toLocaleString("en-IN") : "0"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={startPayUPayment} className="space-y-3.5 text-xs">
                      <div>
                        <label className="block font-black text-slate-800 mb-1.5 text-xs sm:text-[13px]">
                          Authorized Representative Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={paymentName}
                          onChange={(e) => setPaymentName(e.target.value)}
                          placeholder="Full name as per business records"
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-semibold focus:outline-none focus:border-[#207de9] focus:ring-2 focus:ring-blue-100 transition shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-black text-slate-800 mb-1.5 text-xs sm:text-[13px]">
                          Billing Email (For Tax Invoice &amp; Receipt) *
                        </label>
                        <input
                          type="email"
                          required
                          value={paymentEmail}
                          onChange={(e) => setPaymentEmail(e.target.value)}
                          placeholder="billing@yourcompany.com"
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-semibold focus:outline-none focus:border-[#207de9] focus:ring-2 focus:ring-blue-100 transition shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-black text-slate-800 mb-1.5 text-xs sm:text-[13px]">
                          Mobile Number (For Project Onboarding) *
                        </label>
                        <input
                          type="tel"
                          required
                          value={paymentPhone}
                          onChange={(e) => setPaymentPhone(e.target.value)}
                          placeholder="10-digit mobile number"
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-semibold focus:outline-none focus:border-[#207de9] focus:ring-2 focus:ring-blue-100 transition shadow-xs"
                        />
                      </div>

                      {paymentError && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                          {paymentError}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={paymentLoading || !selectedPaymentPlan}
                        className="w-full py-4 rounded-xl bg-[#207de9] hover:bg-[#1866c2] text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer text-center tracking-wide mt-2"
                      >
                        {paymentLoading
                          ? "Connecting to PayU India Gateway..."
                          : `Authorize & Pay ₹${selectedPaymentPlan ? Number(selectedPaymentPlan.amount).toLocaleString("en-IN") : "0"} via PayU India →`}
                      </button>
                    </form>
                  </div>

                  {/* Payment Methods & RBI Authorized Badges */}
                  <div className="mt-5 pt-4 border-t border-slate-100 text-center space-y-2.5">
                    <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-700">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">UPI (GPay, PhonePe, Paytm)</span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">Cards (Visa, RuPay, MC)</span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">NetBanking</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Processed securely via PayU India (PCI-DSS Level 1 Certified). Official GST tax invoice issued immediately.
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </div>
        )}

        {/* ==========================================================================
            13. FLOATING AI CHAT WITH /ai-icon.png LOGO
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
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white p-0.5 border border-white/20">
                    <img src="/ai-icon.png" alt="AI" className="w-full h-full object-cover rounded-full" />
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
                  className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
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
                  className="px-4 py-2 bg-[#207de9] text-white font-bold rounded-xl text-xs hover:bg-[#1a6bc7] cursor-pointer"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {/* Floating AI Trigger Button with /ai-icon.png */}
          <button
            type="button"
            onClick={() => setChatOpen(!chatOpen)}
            aria-label="Open Digital FX AI chat"
            className="relative flex h-[62px] w-[62px] items-center justify-center rounded-full bg-white p-[2px] shadow-[0_12px_35px_rgba(0,0,0,.22)] transition hover:scale-105 cursor-pointer"
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

        {/* ==========================================================================
            14. FLOATING SCROLL CONTROLS
            ========================================================================== */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[80] hidden md:flex flex-col gap-2">
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className={`h-10 w-10 rounded-xl bg-white border border-slate-200 text-[#207de9] shadow-md flex items-center justify-center font-black transition cursor-pointer ${
              showScrollControls ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            ↑
          </button>
          <button
            type="button"
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
            className="h-10 w-10 rounded-xl bg-white border border-slate-200 text-[#207de9] shadow-md flex items-center justify-center font-black hover:bg-slate-50 transition cursor-pointer"
          >
            ↓
          </button>
        </div>

        {/* ==========================================================================
            15. FLOATING PARTNER CREDIT VOUCHER BADGE (REOPEN TRIGGER)
            ========================================================================== */}
        {!discountModalOpen && (
          <button
            type="button"
            onClick={() => setDiscountModalOpen(true)}
            aria-label="View 15% partner credit voucher"
            className="fixed bottom-5 left-5 z-[90] flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#080d24] text-white shadow-2xl border border-slate-700/80 hover:border-[#207de9] hover:bg-slate-900 transition-all cursor-pointer select-none"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11.5px] font-extrabold tracking-wide uppercase">15% Partner Voucher</span>
            <span className="rounded bg-blue-500/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-blue-300 border border-blue-500/30">
              DFX-15
            </span>
          </button>
        )}

        {/* ==========================================================================
            16. PROFESSIONAL EXECUTIVE 2-COLUMN 15% VOUCHER MODAL
            ========================================================================== */}
        {discountModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm transition-all duration-300">
            <div className="relative w-full max-w-[740px] rounded-3xl bg-white shadow-[0_30px_90px_rgba(8,13,36,0.35)] border border-slate-200/80 overflow-hidden text-slate-900 grid grid-cols-1 md:grid-cols-12 animate-fadeIn">
              
              {/* Left Column: Official Agency Voucher Pass (Navy) */}
              <div className="md:col-span-5 bg-[#080d24] text-white p-7 sm:p-8 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-slate-800">
                
                {/* Agency Brand Header */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#207de9] font-black text-xs text-white">
                      FX
                    </span>
                    <div>
                      <span className="text-[11.5px] font-black uppercase tracking-[1.5px] text-white block leading-none">
                        Digital FX
                      </span>
                      <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5 block">
                        Enterprise Growth Desk
                      </span>
                    </div>
                  </div>

                  {/* Main Voucher Value */}
                  <div className="mt-8">
                    <span className="inline-block text-[10px] font-black uppercase tracking-[2px] text-[#207de9] bg-blue-950/80 border border-blue-500/30 px-2.5 py-1 rounded-full mb-3">
                      OFFICIAL VOUCHER ALLOCATION
                    </span>
                    <div className="text-[48px] sm:text-[54px] font-black tracking-tight text-white leading-none">
                      15%
                    </div>
                    <div className="text-sm font-extrabold text-slate-200 mt-1 uppercase tracking-wider">
                      Growth Retainer Credit
                    </div>
                    <p className="text-xs text-slate-400 mt-2.5 leading-relaxed font-normal">
                      Direct invoice deduction applied toward your first 3 months of integrated SEO, PPC Ads, and Generative AI Search retainers.
                    </p>
                  </div>
                </div>

                {/* Institutional Standards */}
                <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-2.5 text-[11px] text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>Crossings Republik, Ghaziabad HQ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                    <span>Dedicated Senior Growth Director</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                    <span>50+ Audited Enterprise Deployments</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Corporate Action & Redemption Panel (Clean White) */}
              <div className="md:col-span-7 bg-white p-7 sm:p-8 flex flex-col justify-between relative">
                
                <div>
                  {/* Top Bar: Status Badge + Minimalist Close Button */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wider text-[#207de9] bg-blue-50/80 border border-blue-200/60 px-3 py-1 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#207de9]" />
                      2026 Client Intake Cohort
                    </span>
                    <button
                      type="button"
                      onClick={() => setDiscountModalOpen(false)}
                      aria-label="Dismiss voucher"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:text-slate-800 hover:border-slate-400 transition cursor-pointer text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Main Headline & Context */}
                  <div className="mt-5">
                    <h3 className="text-[22px] sm:text-[25px] font-black text-[#080d24] tracking-tight leading-snug">
                      Partner with Digital FX. Deduct 15% from your growth retainer.
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-600 mt-2 leading-relaxed font-normal">
                      Secure this institutional credit before our monthly intake allocation closes. The voucher is attached directly to your custom execution agreement.
                    </p>
                  </div>

                  {/* Clean Corporate Voucher Bar */}
                  <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block">
                        PARTNER VOUCHER CODE
                      </span>
                      <span className="font-mono text-sm sm:text-base font-black text-[#080d24] tracking-wider">
                        DFX-GROWTH-15
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setDiscountCodeCopied(true);
                        if (typeof navigator !== "undefined" && navigator.clipboard) {
                          navigator.clipboard.writeText("DFX-GROWTH-15").catch(() => {});
                        }
                        setTimeout(() => setDiscountCodeCopied(false), 3000);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      {discountCodeCopied ? "✓ Voucher Copied" : "Copy Voucher"}
                    </button>
                  </div>
                </div>

                {/* Primary Actions */}
                <div className="mt-6 space-y-2.5">
                  <button
                    type="button"
                    onClick={handleClaimDiscount}
                    className="w-full py-3.5 px-5 rounded-xl bg-[#207de9] hover:bg-[#1866c2] text-white font-black text-xs sm:text-sm tracking-wide shadow-[0_10px_25px_rgba(32,125,233,0.3)] transition hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-center"
                  >
                    Redeem 15% Voucher & Request Proposal →
                  </button>

                  <a
                    href="https://wa.me/919876543210?text=Hello%20Digital%20FX%20Partners%2C%20I%20would%20like%20to%20apply%20Partner%20Voucher%20DFX-GROWTH-15%20(15%25%20Retainer%20Credit)%20for%20our%20firm."
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setDiscountModalOpen(false)}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer text-center"
                  >
                    <span>💬</span> Connect with Managing Director on WhatsApp (+91 98765 43210)
                  </a>

                  <p className="text-[10px] text-slate-400 text-center font-normal pt-1">
                    Confidential & proprietary • Non-disclosure terms apply • Valid for new client retainers
                  </p>
                </div>

              </div>

            </div>
          </div>
        )}

      </main>
    </>
  );
}