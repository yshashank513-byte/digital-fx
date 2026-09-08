"use client";

import { FormEvent, useEffect, useState, useRef } from "react";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { supabase } from "./lib/supabase";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-playfair",
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
  id: "google_listing" | "website" | "growth" | "custom";
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
  {
    id: "custom",
    name: "Custom Amount / Bespoke Retainer",
    amount: "15000",
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
  const [customPaymentAmount, setCustomPaymentAmount] = useState<string>("15000");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentName, setPaymentName] = useState("");
  const [paymentEmail, setPaymentEmail] = useState("");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const [heroWebsite, setHeroWebsite] = useState("");

  // AI Business Suite Coming Soon Modal State
  const [isAiSuiteOpen, setIsAiSuiteOpen] = useState(false);
  const [aiSuiteSubmitted, setAiSuiteSubmitted] = useState(false);
  const [aiSuiteName, setAiSuiteName] = useState("");
  const [aiSuiteBusiness, setAiSuiteBusiness] = useState("");
  const [aiSuitePhone, setAiSuitePhone] = useState("");

  const [showScrollControls, setShowScrollControls] = useState(false);

  // Interactive Revenue Funnel Split Comparison Slider State (Flat, Working Slider)
  const [funnelSliderPos, setFunnelSliderPos] = useState(50);
  const [isFunnelDragging, setIsFunnelDragging] = useState(false);
  const funnelContainerRef = useRef<HTMLDivElement>(null);

  const updateFunnelPosition = (clientX: number) => {
    if (!funnelContainerRef.current) return;
    const rect = funnelContainerRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setFunnelSliderPos(Math.max(5, Math.min(95, Math.round(pct))));
  };

  const handleFunnelPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsFunnelDragging(true);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    updateFunnelPosition(e.clientX);
  };

  const handleFunnelPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isFunnelDragging) {
      updateFunnelPosition(e.clientX);
    }
  };

  const handleFunnelPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsFunnelDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

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

  function scrollToGeoAudit(e?: React.MouseEvent) {
    if (e) e.preventDefault();
    const geoSection = document.getElementById("geo-checker");
    if (geoSection) {
      geoSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  function scrollToServices(e?: React.MouseEvent) {
    if (e) e.preventDefault();
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  function scrollToSection(sectionId: string, e?: React.MouseEvent) {
    if (e) e.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
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

    const isCustomPlan = selectedPaymentPlan.id === "custom";
    let finalAmount = selectedPaymentPlan.amount;

    if (isCustomPlan) {
      const customVal = Number(customPaymentAmount);
      if (!customVal || isNaN(customVal) || customVal < 1) {
        setPaymentError("Please enter a valid custom amount in INR (minimum ₹1).");
        return;
      }
      finalAmount = String(customVal);
    }

    setPaymentLoading(true);
    setPaymentError("");

    try {
      const response = await fetch("/api/payu/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPaymentPlan.id,
          customAmount: isCustomPlan ? finalAmount : undefined,
          amount: finalAmount,
          firstname: name,
          name,
          email,
          phone,
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const rawText = await response.text();
        console.error("Non-JSON payment response:", rawText);
        throw new Error(`Payment service returned an unexpected response (${response.status}). Please try again.`);
      }

      const result = await response.json();
      if (!response.ok || result?.success === false) {
        throw new Error(result?.error || "Unable to initiate payment.");
      }

      const payuData = result.data || result;
      const actionUrl = payuData.action || payuData.actionUrl || result.actionUrl || "https://test.payu.in/_payment";
      const params = payuData.params || payuData;

      const form = document.createElement("form");
      form.method = "POST";
      form.action = actionUrl;

      Object.entries(params as Record<string, unknown>).forEach(([key, value]) => {
        if (
          key !== "action" &&
          key !== "actionUrl" &&
          key !== "params" &&
          key !== "success" &&
          key !== "data" &&
          value !== undefined &&
          value !== null
        ) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        }
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

  const circularEngineData = [
    {
      calloutTitle: "Stay Visible & Drive Traffic",
      calloutDesc: "Get your brand in front of ready-to-buy customers in Search & AI.",
    },
    {
      calloutTitle: "Capture & Nurture Leads",
      calloutDesc: "Turn high-intent visitors into sales-ready qualified pipeline.",
    },
    {
      calloutTitle: "Closed-Loop ROI Scale",
      calloutDesc: "Attribute real pipeline value & closed revenue to your marketing.",
    },
    {
      calloutTitle: "AI Overview & GEO Engine",
      calloutDesc: "Continuous feedback loop feeding high-intent AI search algorithms.",
    },
  ];


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
          font-family: var(--font-plus-jakarta), var(--font-manrope), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .webfx-serif {
          font-family: var(--font-playfair), 'Playfair Display', Georgia, 'Times New Roman', serif !important;
          font-style: italic !important;
          font-weight: 400 !important;
          letter-spacing: -0.01em !important;
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

        @keyframes energyBeamFlowIn {
          0% { stroke-dashoffset: 48; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes energyBeamFlowOut {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -48; }
        }
        @keyframes energyParticlePulse {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.06); opacity: 1; }
        }
        .energy-beam-in {
          stroke-dasharray: 10 7;
          animation: energyBeamFlowIn 1.1s linear infinite;
        }
        .energy-beam-out {
          stroke-dasharray: 10 7;
          animation: energyBeamFlowOut 1.1s linear infinite;
        }
        .energy-node-glow {
          animation: energyParticlePulse 2.5s ease-in-out infinite;
        }

        @keyframes electricCurrentFast {
          0% { stroke-dashoffset: 40; filter: drop-shadow(0 0 6px #10b981); }
          50% { filter: drop-shadow(0 0 14px #34d399) drop-shadow(0 0 20px #00f0ff); }
          100% { stroke-dashoffset: 0; filter: drop-shadow(0 0 6px #10b981); }
        }
        @keyframes verticalCurrentFlow {
          0% { stroke-dashoffset: 32; }
          100% { stroke-dashoffset: 0; }
        }
        .electric-stream-active {
          stroke-dasharray: 8 5;
          animation: electricCurrentFast 0.65s linear infinite;
        }
        .vertical-current {
          stroke-dasharray: 6 4;
          animation: verticalCurrentFlow 0.8s linear infinite;
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

        * {
          font-family: var(--font-plus-jakarta), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .webfx-serif {
          font-family: var(--font-playfair), 'Playfair Display', Georgia, 'Times New Roman', serif !important;
          font-style: italic !important;
          font-weight: 400 !important;
          letter-spacing: -0.01em !important;
        }
      `}</style>

      <main className={`${plusJakartaSans.variable} ${playfairDisplay.variable} min-h-screen overflow-x-hidden font-[var(--font-plus-jakarta)] text-[#101828] antialiased`}>

        {/* ==========================================================================
            1. INSTITUTIONAL TOP BAR (#fxtopbar) - ACCREDITATION & DIRECT CLIENT DESK
            ========================================================================== */}
        <div id="fxtopbar" className="bg-[#080d24] text-white py-2 border-b border-white/10 block">
          <div className="mx-auto flex h-auto min-h-[34px] max-w-[1400px] flex-wrap items-center justify-between gap-y-2 px-4 sm:px-6 lg:px-8 text-xs">
            
            {/* Left: Certifications & Regional Presence */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-slate-300 text-[11.5px] font-medium">
              <span className="inline-flex items-center gap-1.5 text-slate-300 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Google Premier Partner Certified
              </span>
              <span className="hidden md:inline text-slate-600">•</span>
              <span className="hidden md:inline-flex items-center gap-1.5 text-slate-300">
                Meta Certified Agency
              </span>
              <span className="hidden lg:inline text-slate-600">•</span>
              <span className="hidden lg:inline-flex items-center gap-1.5 text-slate-400">
                Crossings Republik, Ghaziabad &amp; Delhi NCR
              </span>
            </div>

            {/* Right: Client Checkout Portal & Direct Strategist Communications */}
            <div className="flex items-center gap-3.5 sm:gap-5 text-[12px] font-medium text-slate-300 ml-auto sm:ml-0">
              <button
                type="button"
                onClick={() => openPricingModal()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white text-[11.5px] font-bold transition-all cursor-pointer shadow-xs hover:border-blue-400/50"
                title="Secure Client Invoicing & Packages"
              >
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Client Checkout Portal</span>
              </button>

              <a href="tel:+919876543210" className="hidden sm:inline-flex items-center gap-1.5 text-[12px] hover:text-white font-bold transition">
                <span className="text-[#207de9]">☎</span> +91 98765 43210
              </a>

              <a
                href="https://wa.me/919876543210?text=Hi%20Digital%20FX%20team,%20I%20want%20to%20discuss%20a%20growth%20strategy."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[12px] font-bold text-emerald-400 hover:text-emerald-300 transition"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-emerald inline-block" />
                <span>WhatsApp Strategy Desk</span>
              </a>
            </div>

          </div>
        </div>

        {/* ==========================================================================
            2. WEBFX MAIN HEADER WITH DESKTOP NAVIGATION (#fxheader)
            ========================================================================== */}
        <header id="fxheader" className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs transition-all">
          <div className="mx-auto flex h-[74px] max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">

            {/* Brand Logo */}
            <a href="#home" className="flex items-center gap-3 shrink-0 group">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white border border-slate-200/90 shadow-xs transition-transform group-hover:scale-105 p-1">
                <img
                  src="/logo.png"
                  alt="Digital FX"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="shrink-0">
                <div className="text-[21px] font-extrabold leading-none tracking-[-0.03em] text-[#080d24]">
                  DIGITAL <span className="text-[#207de9]">FX</span>
                </div>
                <div className="mt-1.5 text-[8.5px] font-bold uppercase tracking-[1.8px] text-slate-500 whitespace-nowrap">
                  Digital Marketing That Drives Revenue®
                </div>
              </div>
            </a>

            {/* Center Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 mr-2">
              <a
                href="#geo-checker"
                onClick={scrollToGeoAudit}
                className="text-[14px] font-semibold text-slate-700 hover:text-[#207de9] transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <span>AI Search (GEO)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9.5px] font-bold uppercase tracking-wider leading-none">
                  FREE
                </span>
              </a>

            </nav>

            {/* Right Action & Menu Trigger */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <a href="tel:+919876543210" className="hidden xl:flex flex-col text-right justify-center shrink-0 group">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 leading-none">Direct Consultation</span>
                <span className="mt-1 text-[13.5px] font-extrabold text-[#080d24] group-hover:text-[#207de9] transition whitespace-nowrap leading-none">+91 98765 43210</span>
              </a>

              <button
                type="button"
                onClick={scrollToContact}
                className="hidden sm:inline-flex h-[42px] items-center gap-2 rounded-xl bg-[#207de9] hover:bg-[#1a6bc7] px-5 text-[13px] font-bold text-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer shrink-0 whitespace-nowrap tracking-wide"
              >
                <span>Get Free Proposal</span>
                <span className="text-sm font-bold">→</span>
              </button>

              {/* 3-LINE MENU BUTTON (Opens Complete Navigation Drawer) */}
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
                <span className="text-[13px] font-bold text-[#080d24] group-hover:text-[#207de9] transition-colors tracking-tight hidden xs:inline">
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
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center overflow-hidden p-1 shrink-0">
                      <img src="/logo.png" alt="Digital FX" className="h-full w-full object-contain" />
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
                    onClick={(e) => {
                      closeMobileMenu();
                      scrollToGeoAudit(e);
                    }}
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

                  {/* AI Business Suite (Coming Soon Trigger in Drawer) */}
                  <button
                    type="button"
                    onClick={() => {
                      closeMobileMenu();
                      setIsAiSuiteOpen(true);
                    }}
                    className="w-full group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-blue-50/60 transition text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#080d24] text-[#00f0ff] border border-[#00f0ff]/40 transition shrink-0">
                        <span className="text-[11px] font-black">FX</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#080d24] group-hover:text-[#207de9] transition flex items-center gap-2">
                          <span>AI Business Suite</span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#080d24] text-white border border-[#00f0ff] text-[8.5px] font-extrabold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>COMING SOON</span>
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Google Maps Auto-reply &amp; Lead intelligence
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-300 group-hover:text-[#207de9] group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                  </button>

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

                  {/* Contact Strategy Team & Office Location */}
                  <a
                    href="#contact"
                    onClick={closeMobileMenu}
                    className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-blue-50/60 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#207de9] transition">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#080d24] group-hover:text-[#207de9] transition">
                          Contact &amp; Office Location
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Orbit Plaza, Ghaziabad • Live Google Map
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
            <div className="max-w-[860px]">
              {/* Overline Subhead */}
              <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-blue-200/90 bg-blue-50/90 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1570ef] shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1570ef]" />
                <span>Rated #1 Revenue Marketing Agency • Delhi NCR</span>
              </div>

              {/* WebFX Signature Headline */}
              <h1 className="text-[38px] sm:text-[54px] lg:text-[66px] font-extrabold leading-[1.08] tracking-[-0.035em] text-[#080d24]">
                Your Revenue Growth Partner{" "}
                <span className="webfx-serif text-[#207de9] block font-normal sm:inline">
                  in the AI Era.
                </span>
              </h1>

              {/* Subtitle Description */}
              <p className="mt-5 max-w-[720px] text-[15.5px] sm:text-[17.5px] leading-[1.68] text-slate-600 font-normal">
                Most agencies report vanity metrics like impressions and clicks. Digital FX engineers connected customer acquisition systems that turn search visibility into qualified pipeline and measurable revenue for businesses across India.
              </p>

              {/* WebFX Exact Website Proposal Bar */}
              <form
                onSubmit={handleHeroProposal}
                className="mt-8 flex flex-col sm:flex-row items-stretch max-w-[620px] bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-sm hover:border-slate-400 focus-within:border-[#1570ef] focus-within:ring-2 focus-within:ring-blue-100 transition-all"
              >
                <div className="flex-1 flex items-center px-4 bg-transparent">
                  <svg className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a8.997 8.997 0 01-7.843-4.582M12 3a8.997 8.997 0 017.843 4.582M12 3v18" />
                  </svg>
                  <input
                    type="text"
                    value={heroWebsite}
                    onChange={(e) => setHeroWebsite(e.target.value)}
                    placeholder="Enter your website (e.g. yourcompany.com)"
                    className="w-full py-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="px-7 py-4 bg-[#080d24] hover:bg-[#207de9] text-white font-bold text-sm tracking-wide transition-colors whitespace-nowrap cursor-pointer shadow-xs"
                >
                  Analyze Growth Potential →
                </button>
              </form>

              {/* Trust Badges */}
              <div className="mt-3.5 flex flex-wrap items-center gap-5 text-[12px] text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Confidential Website Audit
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Direct Strategist Review
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Zero Obligation
                </span>
              </div>
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
                    {circularEngineData[activeFlywheelQuadrant].calloutTitle}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    {circularEngineData[activeFlywheelQuadrant].calloutDesc}
                  </div>
                </div>

              </div>

              {/* WebFX Proven Revenue Impact Grid - Realistic Data for Emerging Agency */}
              <div className="mt-12 relative z-10 max-w-[1040px] mx-auto">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_12px_40px_rgba(8,13,36,0.06)] p-6 sm:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center lg:text-left divide-y sm:divide-y-0 lg:divide-x divide-slate-100">
                    
                    {/* Metric 1: Qualified Lead Growth */}
                    <div className="pt-3 sm:pt-0 lg:px-4 first:lg:pl-0">
                      <span className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#1570ef] tracking-tight tabular-nums block">
                        15% Higher
                      </span>
                      <h3 className="text-[14px] font-bold text-[#080d24] mt-1.5 leading-snug">
                        Qualified Lead Growth
                      </h3>
                      <p className="text-[11.5px] text-slate-500 font-normal mt-1 leading-relaxed">
                        For clients who connect their data &amp; CRM attribution.
                      </p>
                    </div>

                    {/* Metric 2: AI Citations & Visibility */}
                    <div className="pt-4 sm:pt-0 lg:px-4">
                      <span className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-purple-600 tracking-tight tabular-nums block">
                        2,500+
                      </span>
                      <h3 className="text-[14px] font-bold text-[#080d24] mt-1.5 leading-snug">
                        Citations in AI Sources
                      </h3>
                      <p className="text-[11.5px] text-slate-500 font-normal mt-1 leading-relaxed">
                        AI visibility tracked across ChatGPT, Gemini &amp; Copilot.
                      </p>
                    </div>

                    {/* Metric 3: Rated Agency & Reviews */}
                    <div className="pt-4 sm:pt-0 lg:px-4">
                      <span className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-amber-500 tracking-tight tabular-nums block">
                        #1 Rated
                      </span>
                      <h3 className="text-[14px] font-bold text-[#080d24] mt-1.5 leading-snug">
                        Agency on Google &amp; Clutch
                      </h3>
                      <p className="text-[11.5px] text-slate-500 font-normal mt-1 leading-relaxed">
                        Verified from 50+ client reviews (5 / 5 Rating).
                      </p>
                    </div>

                    {/* Metric 4: Closed Revenue & Measurable ROI */}
                    <div className="pt-4 sm:pt-0 lg:px-4 last:lg:pr-0">
                      <span className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-emerald-600 tracking-tight tabular-nums block">
                        ₹100,000+
                      </span>
                      <h3 className="text-[14px] font-bold text-[#080d24] mt-1.5 leading-snug">
                        Closed Client Revenue
                      </h3>
                      <p className="text-[11.5px] text-slate-500 font-normal mt-1 leading-relaxed">
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
        <section className="bg-white py-12 border-b border-slate-200">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">
              TRUSTED BY GROWTH-FOCUSED BRANDS &amp; BUSINESS LEADERS ACROSS INDIA
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6 items-center justify-center text-center">
              {[
                { name: "Healthcare & Clinics", sub: "Hospitals, Eye Care & Dental Practices" },
                { name: "Retail & E-Commerce", sub: "Fashion, Boutiques & D2C Brands" },
                { name: "Industrial & Manufacturing", sub: "B2B Polymers, Steel & Engineering" },
                { name: "Real Estate & Architecture", sub: "Developers, Agents & Interior Studios" },
                { name: "Professional & Corporate", sub: "Legal Counsel, Chartered Accountants & Tax" },
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-[#1570ef]/40 hover:shadow-md transition-all duration-300 group">
                  <span className="text-xs sm:text-[13px] font-bold tracking-tight text-[#080d24] group-hover:text-[#1570ef] transition-colors block">
                    {item.name}
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal mt-1 block">
                    {item.sub}
                  </span>
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
              <h2 className="text-[32px] sm:text-[44px] lg:text-[50px] font-extrabold text-[#080d24] tracking-[-0.035em] leading-[1.12]">
                Move From Marketing that Reports Clicks to{" "}
                <span className="block text-[#1570ef] webfx-serif font-normal">
                  Marketing that Reports Revenue
                </span>
              </h2>
              <p className="mt-5 text-[15px] sm:text-[17px] leading-[1.65] text-slate-600 font-normal max-w-[800px] mx-auto">
                Traditional marketing optimizes for channel metrics. Revenue marketing optimizes for business impact. Connected revenue marketing through <strong className="font-extrabold text-[#080d24]">Digital FX</strong> leads to <strong className="font-extrabold text-[#1570ef]">1.8X faster lead growth than industry average</strong>.
              </p>
            </div>

            {/* Interactive Revenue Funnel Split Comparison Stage (Working Slider, No 3D Tilt) */}
            <div className="mt-6 sm:mt-8 max-w-[960px] mx-auto select-none">
              
              {/* Preset Switcher & Real-time Indicator Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse" />
                  <span>Interactive Comparison:</span>
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono text-[11px]">
                    Traditional {100 - funnelSliderPos}%
                  </span>
                  <span className="text-slate-400">vs</span>
                  <span className="bg-blue-50 text-[#1570ef] px-2 py-0.5 rounded-md font-mono text-[11px] font-extrabold border border-blue-200">
                    Revenue {funnelSliderPos}%
                  </span>
                </div>

                {/* Preset Buttons */}
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setFunnelSliderPos(5)}
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                      funnelSliderPos <= 15
                        ? "bg-[#1570ef] text-white shadow-xs"
                        : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    100% Revenue
                  </button>
                  <button
                    type="button"
                    onClick={() => setFunnelSliderPos(50)}
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                      funnelSliderPos === 50
                        ? "bg-[#080d24] text-white shadow-xs"
                        : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    50% Split (Default)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFunnelSliderPos(95)}
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                      funnelSliderPos >= 85
                        ? "bg-slate-800 text-white shadow-xs"
                        : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    100% Traditional
                  </button>
                </div>
              </div>

              {/* Working Slider Canvas Card (No 3D Perspective, Clean Flat WebFX Reproduction) */}
              <div
                ref={funnelContainerRef}
                onPointerDown={handleFunnelPointerDown}
                onPointerMove={handleFunnelPointerMove}
                onPointerUp={handleFunnelPointerUp}
                className={`relative w-full aspect-[960/540] bg-white rounded-3xl p-2 sm:p-6 border border-slate-200/90 shadow-xl shadow-slate-200/40 cursor-ew-resize touch-none overflow-hidden ${
                  isFunnelDragging ? "cursor-grabbing" : ""
                }`}
                title="Drag the center divider left or right to compare"
              >

                {/* Layer 1: Traditional Digital Marketing Funnel (Cracked, Grey, Siloed - Full Base) */}
                <div className="absolute inset-0 w-full h-full p-2 sm:p-6">
                  <svg viewBox="0 0 960 540" className="w-full h-full select-none pointer-events-none overflow-visible">
                    <defs>
                      <linearGradient id="tfGradCavity" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#0f172a" />
                      </linearGradient>
                      <linearGradient id="tfGradTier1" x1="0%" y1="0%" x2="100%" y2="50%">
                        <stop offset="0%" stopColor="#475467" />
                        <stop offset="100%" stopColor="#3b4758" />
                      </linearGradient>
                      <linearGradient id="tfGradTier2" x1="0%" y1="0%" x2="100%" y2="50%">
                        <stop offset="0%" stopColor="#374151" />
                        <stop offset="100%" stopColor="#2f3744" />
                      </linearGradient>
                      <linearGradient id="tfGradTier3" x1="0%" y1="0%" x2="100%" y2="50%">
                        <stop offset="0%" stopColor="#293241" />
                        <stop offset="100%" stopColor="#212936" />
                      </linearGradient>
                      <linearGradient id="tfGradTier4" x1="0%" y1="0%" x2="100%" y2="50%">
                        <stop offset="0%" stopColor="#1e2530" />
                        <stop offset="100%" stopColor="#161c24" />
                      </linearGradient>
                      <filter id="tfShadow" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#080d24" floodOpacity="0.10" />
                      </filter>
                    </defs>

                    {/* Mint Background Trajectory Line (Faint in traditional) */}
                    <path
                      d="M 60 360 C 180 390 300 370 420 300 C 540 220 720 120 840 50"
                      fill="none"
                      stroke="#cbd5e1"
                      strokeWidth="2"
                      strokeDasharray="6 6"
                    />

                    {/* Floor Ambient Shadow */}
                    <ellipse cx="480" cy="465" rx="140" ry="16" fill="#080d24" opacity="0.08" />

                    {/* Cracked Funnel Body */}
                    <g filter="url(#tfShadow)">
                      {/* Top Rim Cavity */}
                      <ellipse cx="480" cy="150" rx="190" ry="38" fill="url(#tfGradCavity)" />

                      {/* Tier 1 */}
                      <path
                        d="M 290 150 A 190 38 0 0 0 670 150 L 630 225 A 150 28 0 0 1 330 225 Z"
                        fill="url(#tfGradTier1)"
                      />
                      {/* Tier 2 */}
                      <path
                        d="M 330 225 A 150 28 0 0 0 630 225 L 585 295 A 105 20 0 0 1 375 295 Z"
                        fill="url(#tfGradTier2)"
                      />
                      {/* Tier 3 */}
                      <path
                        d="M 375 295 A 105 20 0 0 0 585 295 L 540 360 A 60 14 0 0 1 420 360 Z"
                        fill="url(#tfGradTier3)"
                      />
                      {/* Tier 4 (Spout) */}
                      <path
                        d="M 420 360 A 60 14 0 0 0 540 360 L 500 425 A 20 6 0 0 1 460 425 Z"
                        fill="url(#tfGradTier4)"
                      />

                      {/* Rim Edge Highlight */}
                      <path d="M 290 150 A 190 38 0 0 1 670 150" fill="none" stroke="#64748b" strokeWidth="2" opacity="0.5" />

                      {/* Deep Realistic Fracture Cracks */}
                      <path
                        d="M 340 152 L 375 190 L 355 230 L 415 275 L 390 320 L 440 365 L 470 415"
                        fill="none"
                        stroke="#050811"
                        strokeWidth="3.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M 341 153 L 376 191 L 356 231 L 416 276 L 391 321 L 441 366 L 471 416"
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.75"
                      />

                      {/* Branch Crack 1 */}
                      <path d="M 375 190 L 425 208 L 455 245" fill="none" stroke="#050811" strokeWidth="2.8" strokeLinecap="round" />
                      <path d="M 376 191 L 426 209 L 456 246" fill="none" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" opacity="0.7" />

                      {/* Branch Crack 2 */}
                      <path d="M 415 275 L 460 288 L 488 312" fill="none" stroke="#050811" strokeWidth="2.8" strokeLinecap="round" />
                      <path d="M 416 276 L 461 289 L 489 313" fill="none" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" opacity="0.7" />

                      {/* Branch Crack 3 (Left Edge notch) */}
                      <path d="M 310 220 L 355 230" fill="none" stroke="#050811" strokeWidth="2.5" strokeLinecap="round" />
                      <polygon points="310,216 322,224 314,232 304,224" fill="#ffffff" />

                      {/* Branch Crack 4 (Right Side) */}
                      <path d="M 500 190 L 460 230" fill="none" stroke="#050811" strokeWidth="2.2" strokeLinecap="round" />
                    </g>

                    {/* Siloed Data Warnings (Left Side) */}
                    <g opacity="0.8">
                      <text x="180" y="240" fill="#64748b" fontSize="12px" fontWeight="800" textAnchor="end">✕ Siloed Channel Data</text>
                      <line x1="190" y1="236" x2="330" y2="225" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                      <text x="210" y="320" fill="#64748b" fontSize="12px" fontWeight="800" textAnchor="end">✕ Leaking Inefficient Funnel</text>
                      <line x1="220" y1="316" x2="375" y2="295" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                    </g>
                  </svg>
                </div>

                {/* Layer 2: Revenue Marketing Funnel (Vibrant 4-Tier, Circular Loops - Clipped by Slider) */}
                <div
                  className="absolute inset-0 w-full h-full p-2 sm:p-6 overflow-hidden transition-none select-none"
                  style={{ clipPath: `inset(0 0 0 ${funnelSliderPos}%)` }}
                >
                  <svg viewBox="0 0 960 540" className="w-full h-full select-none pointer-events-none overflow-visible">
                    <defs>
                      <linearGradient id="rfGradCavity" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0d2557" />
                        <stop offset="100%" stopColor="#081838" />
                      </linearGradient>
                      <linearGradient id="rfGradTier1" x1="0%" y1="0%" x2="100%" y2="50%">
                        <stop offset="0%" stopColor="#1570ef" />
                        <stop offset="50%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                      <linearGradient id="rfGradTier2" x1="0%" y1="0%" x2="100%" y2="50%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="60%" stopColor="#00b894" />
                        <stop offset="100%" stopColor="#0891b2" />
                      </linearGradient>
                      <linearGradient id="rfGradTier3" x1="0%" y1="0%" x2="100%" y2="50%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="60%" stopColor="#059669" />
                        <stop offset="100%" stopColor="#047857" />
                      </linearGradient>
                      <linearGradient id="rfGradTier4" x1="0%" y1="0%" x2="100%" y2="50%">
                        <stop offset="0%" stopColor="#84cc16" />
                        <stop offset="60%" stopColor="#a3e635" />
                        <stop offset="100%" stopColor="#65a30d" />
                      </linearGradient>
                      <filter id="rfShadow" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#1570ef" floodOpacity="0.15" />
                      </filter>
                    </defs>

                    {/* Mint Trajectory Line & Upward Arrow (Screenshot 2) */}
                    <g opacity="0.95">
                      <path
                        d="M 60 360 C 180 390 300 370 420 300 C 540 220 720 120 840 50"
                        fill="none"
                        stroke="#2dd4bf"
                        strokeWidth="2.5"
                        strokeDasharray="6 6"
                      />
                      <polygon points="840,50 828,55 835,65" fill="#2dd4bf" />
                    </g>

                    {/* Floor Ambient Glow Shadow */}
                    <ellipse cx="480" cy="465" rx="140" ry="16" fill="#1570ef" opacity="0.12" />

                    {/* 4 Connected Vibrant Revenue Tiers */}
                    <g filter="url(#rfShadow)">
                      {/* Top Rim Cavity */}
                      <ellipse cx="480" cy="150" rx="190" ry="38" fill="url(#rfGradCavity)" />

                      {/* Tier 1: Brand Visibility */}
                      <path
                        d="M 290 150 A 190 38 0 0 0 670 150 L 630 225 A 150 28 0 0 1 330 225 Z"
                        fill="url(#rfGradTier1)"
                      />
                      {/* Tier 2: Website Traffic */}
                      <path
                        d="M 330 225 A 150 28 0 0 0 630 225 L 585 295 A 105 20 0 0 1 375 295 Z"
                        fill="url(#rfGradTier2)"
                      />
                      {/* Tier 3: Qualified Leads */}
                      <path
                        d="M 375 295 A 105 20 0 0 0 585 295 L 540 360 A 60 14 0 0 1 420 360 Z"
                        fill="url(#rfGradTier3)"
                      />
                      {/* Tier 4: Sales */}
                      <path
                        d="M 420 360 A 60 14 0 0 0 540 360 L 500 425 A 20 6 0 0 1 460 425 Z"
                        fill="url(#rfGradTier4)"
                      />

                      {/* Subtle Sheen Seams */}
                      <path d="M 330 225 A 150 28 0 0 0 630 225" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                      <path d="M 375 295 A 105 20 0 0 0 585 295" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                      <path d="M 420 360 A 60 14 0 0 0 540 360" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                    </g>

                    {/* Circular Looping Arrows Around Funnel (Screenshot 2) */}
                    {/* Left Loop: Revenue Generation (Shifted Left for Full Clearance) */}
                    <g>
                      <path
                        d="M 440 440 C 220 440 190 240 340 150"
                        fill="none"
                        stroke="#93c5fd"
                        strokeWidth="2"
                        strokeDasharray="5 5"
                        opacity="0.85"
                      />
                      <polygon points="340,150 330,146 332,158" fill="#1570ef" />
                      <text x="235" y="195" fill="#1570ef" fontSize="13px" fontWeight="900" textAnchor="end">
                        Revenue
                      </text>
                      <text x="235" y="212" fill="#1570ef" fontSize="13px" fontWeight="900" textAnchor="end">
                        Generation
                      </text>
                    </g>

                    {/* Right Loop: Revenue-Backed Optimization (Shifted Right Away From Sales) */}
                    <g>
                      <path
                        d="M 620 150 C 760 240 750 450 510 445"
                        fill="none"
                        stroke="#99f6e4"
                        strokeWidth="2"
                        strokeDasharray="5 5"
                        opacity="0.85"
                      />
                      <polygon points="510,445 520,449 518,437" fill="#00b894" />
                      <text x="740" y="380" fill="#00b894" fontSize="13px" fontWeight="900">
                        Revenue-Backed
                      </text>
                      <text x="740" y="396" fill="#00b894" fontSize="13px" fontWeight="900">
                        Optimization
                      </text>
                    </g>

                    {/* Tier Labels on the Right with Leader Lines (Exact match to screenshot 2) */}
                    <g>
                      <line x1="650" y1="185" x2="720" y2="185" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                      <text x="728" y="189" fill="#080d24" fontSize="13px" fontWeight="800">Brand Visibility</text>
                    </g>
                    <g>
                      <line x1="605" y1="260" x2="695" y2="260" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                      <text x="703" y="264" fill="#080d24" fontSize="13px" fontWeight="800">Website Traffic</text>
                    </g>
                    <g>
                      <line x1="560" y1="325" x2="660" y2="325" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                      <text x="668" y="329" fill="#080d24" fontSize="13px" fontWeight="800">Qualified Leads</text>
                    </g>
                    <g>
                      <line x1="490" y1="390" x2="560" y2="390" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                      <text x="568" y="394" fill="#080d24" fontSize="13px" fontWeight="800">Sales</text>
                    </g>
                  </svg>
                </div>

                {/* Layer 3: Draggable Vertical Center Divider ("Dandi" & Handle) */}
                <div
                  className="absolute top-0 bottom-0 pointer-events-none transition-none z-30"
                  style={{ left: `${funnelSliderPos}%`, transform: "translateX(-50%)" }}
                >
                  {/* Vertical Rail Line */}
                  <div className="w-[3px] h-full bg-[#080d24] relative shadow-[0_0_10px_rgba(8,13,36,0.4)]">
                    {/* Top Pin Cap */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#080d24] border-2 border-white shadow-xs" />

                    {/* Center Grip Handle with Double Arrow */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-auto cursor-ew-resize group"
                      title="Drag left/right to compare"
                    >
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#080d24] border-2 border-white shadow-2xl flex items-center justify-center text-white group-hover:scale-110 group-active:scale-95 group-hover:bg-[#1570ef] transition-all duration-150">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-4 3 4 3m8-6l4 3-4 3" />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom Pointed Anchor Pin (Screenshot 4) */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                      <svg width="14" height="22" viewBox="0 0 14 22" className="fill-[#080d24] drop-shadow-md">
                        <polygon points="1,0 13,0 13,14 7,22 1,14" />
                      </svg>
                    </div>
                  </div>
                </div>

              </div>

              {/* Range Scrubber for Smooth Sliding on Touch & Desktop */}
              <div className="mt-4 px-2 flex items-center gap-3">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider shrink-0">
                  Traditional
                </span>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={funnelSliderPos}
                  onChange={(e) => setFunnelSliderPos(Number(e.target.value))}
                  aria-label="Comparison Divider Slider"
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1570ef]"
                />
                <span className="text-[11px] font-extrabold text-[#1570ef] uppercase tracking-wider shrink-0">
                  Revenue Engine
                </span>
              </div>

              {/* Bottom Comparison Columns (Exact Match to Screenshots 3, 4, 5) */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 max-w-[860px] mx-auto text-left">
                
                {/* Left: Traditional Digital Marketing */}
                <div className="md:pr-4">
                  <h3 className="text-lg font-bold text-[#475467]">
                    Traditional Digital Marketing
                  </h3>
                  <p className="mt-2 text-xs sm:text-[13.5px] text-slate-500 font-normal leading-relaxed">
                    Siloed marketing and sales data leads to a broken, inefficient funnel that leads to decisions based on <span className="italic font-semibold">feel</span> rather than true ROI.
                  </p>
                </div>

                {/* Right: Revenue Marketing */}
                <div className="md:pl-4">
                  <h3 className="text-lg font-bold text-[#080d24]">
                    Revenue Marketing
                  </h3>
                  <p className="mt-2 text-xs sm:text-[13.5px] text-slate-700 font-normal leading-relaxed">
                    Digital FX connects your data through <strong className="text-[#080d24] font-bold">Digital <span className="bg-[#1570ef] text-white px-1.5 py-0.5 rounded text-[10px] font-bold">FX</span></strong> to make revenue-backed marketing decisions that reduce cost per lead and maximize ROI.
                  </p>
                </div>

              </div>

              {/* Three Connected Pillars: Platform, People, Playbooks */}
              <div className="mt-14 pt-12 border-t border-slate-200 text-center">
                <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#080d24] tracking-tight">
                  Uniquely Positioned to Power Real Revenue Growth
                </h3>
                <p className="mt-3 text-sm sm:text-[15px] text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
                  Every result our digital marketing agency delivers is powered by three connected pillars — expert execution, a revenue platform built to connect marketing to ROI, and AI-powered intelligence that informs better decisions.
                </p>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  {/* Pillar 1: Platform */}
                  <div className="p-6 rounded-2xl bg-[#f8faff] border border-blue-100 hover:border-blue-300 transition-all duration-300 group hover:shadow-md">
                    <div className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-[#1570ef] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      platform
                    </div>
                    <h4 className="text-lg font-bold text-[#080d24] mt-3 mb-2">
                      Revenue Platform
                    </h4>
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                      Built to track, attribute, and connect multi-channel marketing spend directly to real customer inquiries and verified closed ROI.
                    </p>
                  </div>

                  {/* Pillar 2: People */}
                  <div className="p-6 rounded-2xl bg-[#f8fafc] border border-emerald-100 hover:border-emerald-300 transition-all duration-300 group hover:shadow-md">
                    <div className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      people
                    </div>
                    <h4 className="text-lg font-bold text-[#080d24] mt-3 mb-2">
                      Strategic Execution
                    </h4>
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                      Dedicated senior growth strategists, copywriters, and media buyers actively managing Search, Meta ads, local Maps, and funnels.
                    </p>
                  </div>

                  {/* Pillar 3: Playbooks */}
                  <div className="p-6 rounded-2xl bg-[#faf8ff] border border-purple-100 hover:border-purple-300 transition-all duration-300 group hover:shadow-md">
                    <div className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                      playbooks
                    </div>
                    <h4 className="text-lg font-bold text-[#080d24] mt-3 mb-2">
                      AI-Powered Intelligence
                    </h4>
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                      Continuous data feedback loops and predictive models feeding Google Search, AI Overviews, and generative engine algorithms.
                    </p>
                  </div>
                </div>
              </div>

              {/* Deep Dive Showcase: AI-POWERED INTELLIGENCE (Digital FX AI Engine & Electric Flow) */}
              <div className="mt-14 p-5 sm:p-8 lg:p-12 rounded-3xl bg-gradient-to-b from-[#f0faf7] via-[#f7fcfb] to-white border border-teal-100/90 shadow-lg shadow-teal-900/5 text-left select-none relative overflow-hidden">
                
                {/* Background Ambient Glow */}
                <div
                  className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-40 blur-3xl"
                  style={{ background: "radial-gradient(circle, rgba(45,212,191,0.35) 0%, transparent 70%)" }}
                />

                {/* Overline & Title */}
                <div className="relative z-10 max-w-2xl">
                  <div className="text-[11px] sm:text-xs font-bold uppercase tracking-[2.5px] text-[#0d9488]">
                    AI-POWERED INTELLIGENCE
                  </div>
                  <h3 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#080d24] tracking-tight">
                    Smarter Decisions at Scale
                  </h3>
                </div>

                {/* 3 Executive Bullet Points */}
                <div className="mt-6 space-y-3 max-w-3xl relative z-10">
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#14b8a6] mt-2 shrink-0" />
                    <p className="text-[14px] sm:text-[15.5px] text-slate-700 font-normal leading-relaxed">
                      AI analyzes performance patterns across industries and campaigns to surface opportunities humans might miss.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#14b8a6] mt-2 shrink-0" />
                    <p className="text-[14px] sm:text-[15.5px] text-slate-700 font-normal leading-relaxed">
                      AI insights are used to prioritize optimizations, not replace strategy or execution.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#14b8a6] mt-2 shrink-0" />
                    <p className="text-[14px] sm:text-[15.5px] text-slate-700 font-normal leading-relaxed">
                      AI integration allows our team to focus on what’s working, where to invest next, and how to compound revenue over time.
                    </p>
                  </div>
                </div>

                {/* ==========================================================================
                    1. PC & TABLET VIEW: FULL HORIZONTAL SVG DIAGRAM (Hidden on Mobile <768px)
                    ========================================================================== */}
                <div className="hidden md:block mt-8 sm:mt-12 relative w-full aspect-[920/380] max-w-[920px] mx-auto">
                  <svg viewBox="0 0 920 380" className="w-full h-full overflow-visible">
                    <defs>
                      {/* Gradients for Electric Beams */}
                      <linearGradient id="dfxCyanCurrent" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2dd4bf" />
                        <stop offset="50%" stopColor="#00f0ff" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                      <linearGradient id="dfxEmeraldCurrent" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#00f0ff" />
                      </linearGradient>
                      <linearGradient id="dfxBlueCurrent" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#207de9" />
                        <stop offset="50%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                      <linearGradient id="dfxCoreNavy" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#080d24" />
                        <stop offset="60%" stopColor="#0c173d" />
                        <stop offset="100%" stopColor="#080d24" />
                      </linearGradient>

                      {/* Drop Shadows & Glow Filters */}
                      <filter id="dfxNodeShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#080d24" floodOpacity="0.14" />
                      </filter>
                      <filter id="dfxCoreGlow" x="-40%" y="-40%" width="180%" height="180%">
                        <feDropShadow dx="0" dy="0" stdDeviation="16" floodColor="#00f0ff" floodOpacity="0.45" />
                        <feDropShadow dx="0" dy="10" stdDeviation="20" floodColor="#207de9" floodOpacity="0.3" />
                      </filter>
                      <filter id="dfxSparkGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ffffff" floodOpacity="0.9" />
                        <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#00f0ff" floodOpacity="0.8" />
                      </filter>
                    </defs>

                    {/* --- LEFT STREAM: 3 CONVERGING ELECTRIC CURRENTS (Traffic, Leads, Sales -> DIGITAL FX) --- */}
                    {/* 1. Traffic Path Glow Tube */}
                    <path
                      d="M 170 85 C 280 85 340 190 415 190"
                      fill="none"
                      stroke="rgba(45, 212, 191, 0.2)"
                      strokeWidth="14"
                      strokeLinecap="round"
                    />
                    {/* 2. Leads Path (ELECTRIC CURRENT TYPE: High-Voltage Glow Tube) */}
                    <path
                      d="M 170 190 L 415 190"
                      fill="none"
                      stroke="rgba(16, 185, 129, 0.3)"
                      strokeWidth="16"
                      strokeLinecap="round"
                    />
                    {/* 3. Sales Path Glow Tube */}
                    <path
                      d="M 170 295 C 280 295 340 190 415 190"
                      fill="none"
                      stroke="rgba(45, 212, 191, 0.2)"
                      strokeWidth="14"
                      strokeLinecap="round"
                    />

                    {/* Active Electric Current Beams */}
                    <path
                      d="M 170 85 C 280 85 340 190 415 190"
                      fill="none"
                      stroke="url(#dfxCyanCurrent)"
                      strokeWidth="3.5"
                      className="energy-beam-in"
                    />
                    {/* Leads: Rapid Electric Current Surge */}
                    <path
                      d="M 170 190 L 415 190"
                      fill="none"
                      stroke="url(#dfxEmeraldCurrent)"
                      strokeWidth="4"
                      className="electric-stream-active"
                    />
                    <path
                      d="M 170 295 C 280 295 340 190 415 190"
                      fill="none"
                      stroke="url(#dfxCyanCurrent)"
                      strokeWidth="3.5"
                      className="energy-beam-in"
                    />

                    {/* LIVE ELECTRIC CURRENT SPARKS SHOOTING INTO DIGITAL FX CORE */}
                    <circle r="4" fill="#ffffff" filter="url(#dfxSparkGlow)">
                      <animateMotion
                        path="M 194 85 C 280 85 340 190 415 190"
                        dur="1.2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    {/* Leads Spark (Rapid & High-Voltage) */}
                    <circle r="5" fill="#ffffff" filter="url(#dfxSparkGlow)">
                      <animateMotion
                        path="M 194 190 L 415 190"
                        dur="0.8s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle r="3.5" fill="#34d399" filter="url(#dfxSparkGlow)">
                      <animateMotion
                        path="M 194 190 L 415 190"
                        dur="0.8s"
                        begin="0.4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle r="4" fill="#ffffff" filter="url(#dfxSparkGlow)">
                      <animateMotion
                        path="M 194 295 C 280 295 340 190 415 190"
                        dur="1.2s"
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Current Directional Arrowheads */}
                    <polygon points="280,108 288,114 280,120" fill="#2dd4bf" />
                    <polygon points="295,186 305,190 295,194" fill="#10b981" />
                    <polygon points="280,272 288,266 280,260" fill="#2dd4bf" />

                    {/* --- RIGHT STREAM: 3 DIVERGING CURRENTS (DIGITAL FX -> Actions) --- */}
                    {/* Soft ambient glow paths */}
                    <path
                      d="M 505 190 C 580 190 640 85 750 85"
                      fill="none"
                      stroke="rgba(32, 125, 233, 0.2)"
                      strokeWidth="14"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 505 190 L 750 190"
                      fill="none"
                      stroke="rgba(32, 125, 233, 0.2)"
                      strokeWidth="14"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 505 190 C 580 190 640 295 750 295"
                      fill="none"
                      stroke="rgba(32, 125, 233, 0.2)"
                      strokeWidth="14"
                      strokeLinecap="round"
                    />

                    {/* Active glowing blue energy flow lines */}
                    <path
                      d="M 505 190 C 580 190 640 85 750 85"
                      fill="none"
                      stroke="url(#dfxBlueCurrent)"
                      strokeWidth="3.5"
                      className="energy-beam-out"
                    />
                    <path
                      d="M 505 190 L 750 190"
                      fill="none"
                      stroke="url(#dfxBlueCurrent)"
                      strokeWidth="3.5"
                      className="energy-beam-out"
                    />
                    <path
                      d="M 505 190 C 580 190 640 295 750 295"
                      fill="none"
                      stroke="url(#dfxBlueCurrent)"
                      strokeWidth="3.5"
                      className="energy-beam-out"
                    />

                    {/* LIVE ELECTRIC CURRENT SPARKS SHOOTING OUTWARD */}
                    <circle r="4" fill="#ffffff" filter="url(#dfxSparkGlow)">
                      <animateMotion
                        path="M 505 190 C 580 190 640 85 726 85"
                        dur="1.2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle r="4" fill="#ffffff" filter="url(#dfxSparkGlow)">
                      <animateMotion
                        path="M 505 190 L 726 190"
                        dur="0.9s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle r="4" fill="#ffffff" filter="url(#dfxSparkGlow)">
                      <animateMotion
                        path="M 505 190 C 580 190 640 295 726 295"
                        dur="1.2s"
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Outflow Directional Arrowheads */}
                    <polygon points="635,114 643,108 635,102" fill="#38bdf8" />
                    <polygon points="625,186 635,190 625,194" fill="#38bdf8" />
                    <polygon points="635,266 643,272 635,278" fill="#38bdf8" />

                    {/* --- CENTER HUB: DIGITAL FX AI ROBOT MASCOT EMBLEM (REPLACED PER USER REQUEST) --- */}
                    <g
                      onClick={() => setIsAiSuiteOpen(true)}
                      className="cursor-pointer group select-none transition-transform duration-300 hover:scale-105"
                      style={{ transformOrigin: "460px 190px" }}
                    >
                      {/* Ambient Outer Energy Field with Soft Glow */}
                      <circle cx="460" cy="190" r="56" fill="#207de9" opacity="0.18" className="animate-pulse" />

                      {/* Concentric High-Tech Orbit Rings */}
                      <circle cx="460" cy="190" r="50" fill="none" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" strokeDasharray="3 4" />
                      <circle cx="460" cy="190" r="46" fill="none" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="6 3" className="vertical-current" />

                      {/* Robot Mascot Clip Path */}
                      <defs>
                        <clipPath id="dfxCenterMascotClip">
                          <circle cx="460" cy="190" r="44" />
                        </clipPath>
                      </defs>

                      {/* 1. WALI PHOTO: Robot FX Mascot Emblem */}
                      <image
                        href="/robot-fx.png"
                        x="415"
                        y="145"
                        width="90"
                        height="90"
                        clipPath="url(#dfxCenterMascotClip)"
                        preserveAspectRatio="xMidYMid meet"
                      />

                      {/* High-Tech Neon Cyan Outer Rim */}
                      <circle cx="460" cy="190" r="44" fill="none" stroke="#00f0ff" strokeWidth="2.2" />
                    </g>

                    {/* Core Text Branding */}
                    <g
                      transform="translate(460, 252)"
                      onClick={() => setIsAiSuiteOpen(true)}
                      className="cursor-pointer group select-none"
                    >
                      <text x="0" y="0" textAnchor="middle" fill="#080d24" fontSize="14.5px" fontWeight="800" letterSpacing="-0.02em">
                        DIGITAL <tspan fill="#207de9">FX</tspan>
                      </text>
                      <text x="0" y="16" textAnchor="middle" fill="#1570ef" fontSize="10.5px" fontWeight="800" letterSpacing="0.1em">
                        AI BUSINESS SUITE
                      </text>
                    </g>

                    {/* --- LEFT NODES: Traffic, Leads, Sales (Teal & Emerald) --- */}
                    {/* 1. Traffic Node */}
                    <g filter="url(#dfxNodeShadow)">
                      <text x="170" y="46" textAnchor="middle" fill="#080d24" fontSize="13.5px" fontWeight="800">
                        Traffic
                      </text>
                      <circle cx="170" cy="85" r="25" fill="#2dd4bf" />
                      {/* Pointer / Play Icon */}
                      <path d="M 164 76 L 178 85 L 164 94 Z" fill="#ffffff" />
                    </g>

                    {/* 2. Leads Node (Highlighted with Electric Aura) */}
                    <g filter="url(#dfxNodeShadow)">
                      <text x="170" y="150" textAnchor="middle" fill="#080d24" fontSize="14px" fontWeight="900">
                        Leads
                      </text>
                      {/* Electric pulse ring */}
                      <circle cx="170" cy="190" r="30" fill="none" stroke="#10b981" strokeWidth="1.8" strokeDasharray="4 3" className="vertical-current" />
                      <circle cx="170" cy="190" r="25" fill="#10b981" />
                      {/* User Icon */}
                      <circle cx="170" cy="184" r="5" fill="#ffffff" />
                      <path d="M 162 198 C 162 193 166 191 170 191 C 174 191 178 193 178 198 Z" fill="#ffffff" />
                    </g>

                    {/* 3. Sales Node */}
                    <g filter="url(#dfxNodeShadow)">
                      <text x="170" y="256" textAnchor="middle" fill="#080d24" fontSize="13.5px" fontWeight="800">
                        Sales
                      </text>
                      <circle cx="170" cy="295" r="25" fill="#2dd4bf" />
                      {/* Upward Trending Chart Icon */}
                      <path d="M 162 302 L 167 294 L 171 298 L 178 287" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points="174,287 178,287 178,291" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>

                    {/* --- RIGHT NODES: Optimize Budget, Expand Keywords, Scale Winning Ads (Royal Blue) --- */}
                    {/* 1. Optimize Budget Node */}
                    <g filter="url(#dfxNodeShadow)">
                      <text x="750" y="46" textAnchor="middle" fill="#080d24" fontSize="13.5px" fontWeight="800">
                        Optimize Budget
                      </text>
                      <circle cx="750" cy="85" r="25" fill="#207de9" />
                      {/* Calculator / Budget Icon */}
                      <rect x="742" y="77" width="16" height="17" rx="2.5" fill="none" stroke="#ffffff" strokeWidth="1.8" />
                      <line x1="745" y1="81" x2="755" y2="81" stroke="#ffffff" strokeWidth="1.6" />
                      <circle cx="745" cy="85" r="1" fill="#ffffff" />
                      <circle cx="750" cy="85" r="1" fill="#ffffff" />
                      <circle cx="755" cy="85" r="1" fill="#ffffff" />
                      <circle cx="745" cy="89" r="1" fill="#ffffff" />
                      <circle cx="750" cy="89" r="1" fill="#ffffff" />
                      <circle cx="755" cy="89" r="1" fill="#ffffff" />
                    </g>

                    {/* 2. Expand Keywords Node */}
                    <g filter="url(#dfxNodeShadow)">
                      <text x="750" y="150" textAnchor="middle" fill="#080d24" fontSize="13.5px" fontWeight="800">
                        Expand Keywords
                      </text>
                      <circle cx="750" cy="190" r="25" fill="#207de9" />
                      {/* List with Plus Icon */}
                      <line x1="742" y1="184" x2="752" y2="184" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
                      <line x1="742" y1="189" x2="752" y2="189" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
                      <line x1="742" y1="194" x2="748" y2="194" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
                      <circle cx="755" cy="193" r="4.5" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                      <line x1="755" y1="191" x2="755" y2="195" stroke="#ffffff" strokeWidth="1.3" />
                      <line x1="753" y1="193" x2="757" y2="193" stroke="#ffffff" strokeWidth="1.3" />
                    </g>

                    {/* 3. Scale Winning Ads Node */}
                    <g filter="url(#dfxNodeShadow)">
                      <text x="750" y="256" textAnchor="middle" fill="#080d24" fontSize="13.5px" fontWeight="800">
                        Scale Winning Ads
                      </text>
                      <circle cx="750" cy="295" r="25" fill="#207de9" />
                      {/* Sliders / Equalizer Icon */}
                      <line x1="743" y1="289" x2="757" y2="289" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
                      <circle cx="747" cy="289" r="2.2" fill="#ffffff" />
                      <line x1="743" y1="295" x2="757" y2="295" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
                      <circle cx="753" cy="295" r="2.2" fill="#ffffff" />
                      <line x1="743" y1="301" x2="757" y2="301" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
                      <circle cx="748" cy="301" r="2.2" fill="#ffffff" />
                    </g>
                  </svg>
                </div>

                {/* ==========================================================================
                    2. MOBILE-OPTIMIZED VERTICAL FLOW (Visible strictly on Mobile <768px)
                    ========================================================================== */}
                <div className="block md:hidden mt-8 space-y-4">
                  
                  {/* Step 1: Input Signals (Traffic, Leads, Sales) */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {/* Traffic */}
                    <div className="p-3 rounded-2xl bg-white border border-teal-200/80 shadow-xs flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-xl bg-[#2dd4bf] text-white flex items-center justify-center font-black shadow-xs">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <polygon points="6,4 20,12 6,20" />
                        </svg>
                      </div>
                      <span className="text-xs font-black text-[#080d24] mt-2">Traffic</span>
                      <span className="text-[9.5px] font-bold text-teal-700 mt-0.5">Inbound</span>
                    </div>

                    {/* Leads (Electric Current Active) */}
                    <div className="p-3 rounded-2xl bg-gradient-to-b from-emerald-50 to-white border-2 border-emerald-400 shadow-md shadow-emerald-500/10 flex flex-col items-center text-center relative overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-[#10b981] text-white flex items-center justify-center font-black shadow-xs">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                      <span className="text-xs font-black text-[#080d24] mt-2">Leads</span>
                      <span className="text-[9.5px] font-black text-emerald-700 mt-0.5">⚡ Current</span>
                    </div>

                    {/* Sales */}
                    <div className="p-3 rounded-2xl bg-white border border-teal-200/80 shadow-xs flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-xl bg-[#2dd4bf] text-white flex items-center justify-center font-black shadow-xs">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <span className="text-xs font-black text-[#080d24] mt-2">Sales</span>
                      <span className="text-[9.5px] font-bold text-teal-700 mt-0.5">Closed ROI</span>
                    </div>
                  </div>

                  {/* Vertical Energy Connectors (Flowing Inwards) */}
                  <div className="w-full h-8 flex items-center justify-center">
                    <svg className="w-48 h-full overflow-visible" viewBox="0 0 200 32">
                      <line x1="40" y1="0" x2="100" y2="32" stroke="#2dd4bf" strokeWidth="2.5" strokeDasharray="4 3" className="vertical-current" />
                      <line x1="100" y1="0" x2="100" y2="32" stroke="#10b981" strokeWidth="3.5" strokeDasharray="4 3" className="vertical-current" />
                      <line x1="160" y1="0" x2="100" y2="32" stroke="#2dd4bf" strokeWidth="2.5" strokeDasharray="4 3" className="vertical-current" />
                    </svg>
                  </div>

                  {/* Step 2: Central DIGITAL FX AI Business Suite Card */}
                  <div
                    onClick={() => setIsAiSuiteOpen(true)}
                    className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#080d24] via-[#0f1d47] to-[#080d24] text-white border-2 border-[#207de9] shadow-xl text-center relative overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
                  >
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider mb-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      ⚡ COMING SOON • PROPRIETARY SUITE
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <img
                        src="/robot-fx.png"
                        alt="Digital FX AI Mascot"
                        className="w-12 h-12 rounded-full border-2 border-[#00f0ff] shadow-md object-cover"
                      />
                      <div className="text-left">
                        <div className="text-base font-extrabold text-white leading-tight">
                          DIGITAL <span className="text-[#00f0ff]">FX</span>
                        </div>
                        <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-blue-300">
                          AI BUSINESS SUITE
                        </div>
                      </div>
                    </div>
                    <p className="mt-2.5 text-[11px] text-slate-300 leading-relaxed font-normal">
                      Google Maps Auto-Reply • Form-Fill Lead Intelligence • Autonomous AI Site Builder
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAiSuiteOpen(true);
                      }}
                      className="mt-3.5 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#207de9] to-[#00b4d8] hover:from-[#1a6bc7] hover:to-[#0096c7] text-white text-xs font-extrabold shadow-md shadow-blue-500/25 transition cursor-pointer"
                    >
                      <span>🚀 Preview AI Business Suite &amp; Features →</span>
                    </button>
                  </div>

                  {/* Vertical Energy Connectors (Flowing Outwards) */}
                  <div className="w-full h-8 flex items-center justify-center">
                    <svg className="w-48 h-full overflow-visible" viewBox="0 0 200 32">
                      <line x1="100" y1="0" x2="40" y2="32" stroke="#207de9" strokeWidth="3" strokeDasharray="4 3" className="vertical-current" />
                      <line x1="100" y1="0" x2="100" y2="32" stroke="#38bdf8" strokeWidth="3" strokeDasharray="4 3" className="vertical-current" />
                      <line x1="100" y1="0" x2="160" y2="32" stroke="#207de9" strokeWidth="3" strokeDasharray="4 3" className="vertical-current" />
                    </svg>
                  </div>

                  {/* Step 3: Output Optimizations */}
                  <div className="space-y-2">
                    {/* Optimize Budget */}
                    <div className="p-3 rounded-xl bg-white border border-blue-200/80 shadow-xs flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#207de9] text-white flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <rect x="4" y="4" width="16" height="16" rx="2" />
                          <line x1="8" y1="9" x2="16" y2="9" />
                          <circle cx="8" cy="13" r="1" fill="currentColor" />
                          <circle cx="12" cy="13" r="1" fill="currentColor" />
                          <circle cx="16" cy="13" r="1" fill="currentColor" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-black text-[#080d24]">Optimize Budget</div>
                        <div className="text-[10px] text-slate-500 font-medium">Eliminates wasted ad spend across Google &amp; Meta</div>
                      </div>
                    </div>

                    {/* Expand Keywords */}
                    <div className="p-3 rounded-xl bg-white border border-blue-200/80 shadow-xs flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#207de9] text-white flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <line x1="4" y1="6" x2="14" y2="6" />
                          <line x1="4" y1="12" x2="14" y2="12" />
                          <circle cx="17" cy="15" r="3" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-black text-[#080d24]">Expand Keywords</div>
                        <div className="text-[10px] text-slate-500 font-medium">Captures unexploited high-intent search queries</div>
                      </div>
                    </div>

                    {/* Scale Winning Ads */}
                    <div className="p-3 rounded-xl bg-white border border-blue-200/80 shadow-xs flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#207de9] text-white flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <line x1="4" y1="8" x2="20" y2="8" />
                          <line x1="4" y1="16" x2="20" y2="16" />
                          <circle cx="9" cy="8" r="2.5" fill="currentColor" />
                          <circle cx="15" cy="16" r="2.5" fill="currentColor" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-black text-[#080d24]">Scale Winning Ads</div>
                        <div className="text-[10px] text-slate-500 font-medium">Automated budget reallocation into highest ROAS ads</div>
                      </div>
                    </div>
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
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#207de9] bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full">
                COMPREHENSIVE SERVICE SUITE
              </span>
              <h2 className="mt-4 text-[32px] sm:text-[44px] lg:text-[48px] font-extrabold text-[#080d24] tracking-[-0.035em] leading-[1.1]">
                Explore Full-Funnel Services
                <span className="webfx-serif text-[#207de9] block font-normal mt-1">
                  Built For Measurable ROI.
                </span>
              </h2>
              <p className="mt-4 text-[15px] sm:text-[16px] text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
                From top-of-funnel brand visibility to closed-loop revenue reporting, we handle every stage of your digital journey.
              </p>
            </div>

            {/* 4 Stages Grid - Unified Cohesive Agency Design System */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Stage 01: Brand Visibility */}
              <div className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#1570ef] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                      STAGE 01
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">Organic Search</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#080d24] group-hover:text-[#207de9] transition-colors">
                    Search &amp; Visibility
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 mb-6 leading-relaxed font-normal">
                    Attract ready-to-buy commercial prospects through search engines, Maps, and AI answer engines.
                  </p>
                  <ul className="space-y-3 text-xs text-slate-700 font-medium">
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1570ef] shrink-0" />
                      <span>SEO &amp; Programmatic Keyword Strategy</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1570ef] shrink-0" />
                      <span>Google Business Profile #1 Map Pack</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1570ef] shrink-0" />
                      <span>Generative Engine Optimization (GEO)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1570ef] shrink-0" />
                      <span>Authoritative Content &amp; Entity PR</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-normal">Target KPI</span>
                  <span className="font-bold text-[#1570ef]">#1 Google &amp; AI Share</span>
                </div>
              </div>

              {/* Stage 02: Traffic & Paid Ads */}
              <div className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#1570ef] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                      STAGE 02
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">Paid Media</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#080d24] group-hover:text-[#207de9] transition-colors">
                    Acquisition &amp; Ads
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 mb-6 leading-relaxed font-normal">
                    Drive targeted, high-intent traffic with surgical Google PPC and Meta advertising funnels.
                  </p>
                  <ul className="space-y-3 text-xs text-slate-700 font-medium">
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1570ef] shrink-0" />
                      <span>Google Search &amp; High-Intent PPC Ads</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1570ef] shrink-0" />
                      <span>Meta &amp; Instagram Precision Advertising</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1570ef] shrink-0" />
                      <span>Social Media Management &amp; Catalogs</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1570ef] shrink-0" />
                      <span>Multi-Touch Retargeting Funnels</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-normal">Target KPI</span>
                  <span className="font-bold text-[#1570ef]">4.2x Target ROAS</span>
                </div>
              </div>

              {/* Stage 03: Conversion Funnels */}
              <div className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#1570ef] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                      STAGE 03
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">Conversion</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#080d24] group-hover:text-[#207de9] transition-colors">
                    Funnel &amp; Web CRO
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 mb-6 leading-relaxed font-normal">
                    Convert traffic into immediate phone inquiries, WhatsApp chats, and confirmed appointments.
                  </p>
                  <ul className="space-y-3 text-xs text-slate-700 font-medium">
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1570ef] shrink-0" />
                      <span>High-Speed Conversion Landing Pages</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1570ef] shrink-0" />
                      <span>WhatsApp Business CRM Automation</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1570ef] shrink-0" />
                      <span>Mobile Booking &amp; Lead Capture CRO</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1570ef] shrink-0" />
                      <span>PayU India Payment Settlement Desk</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-normal">Target KPI</span>
                  <span className="font-bold text-[#1570ef]">Sub-Second Routing</span>
                </div>
              </div>

              {/* Stage 04: Revenue & Data */}
              <div className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      STAGE 04
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">Attribution</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#080d24] group-hover:text-emerald-600 transition-colors">
                    Revenue &amp; Analytics
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 mb-6 leading-relaxed font-normal">
                    Transparent closed-loop attribution connecting marketing expenditure to verified pipeline.
                  </p>
                  <ul className="space-y-3 text-xs text-slate-700 font-medium">
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>Monthly Executive Performance Reports</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>Attributable Pipeline Dashboards</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>Brand Entity Reputation Protection</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>Dedicated Senior Revenue Strategist</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Target KPI</span>
                  <span className="font-extrabold text-emerald-700">Closed ROI Verified</span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ==========================================================================
            7. PROPRIETARY GEO & AI SEARCH AUDIT SUITE (WEBFX EXECUTIVE DESIGN)
            ========================================================================== */}
        <section id="geo-checker" className="scroll-mt-20 py-24 bg-[#f8fafc] border-b border-slate-200 relative overflow-hidden">
          <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            
            {/* Header Area */}
            <div className="mx-auto max-w-[840px] text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1570ef]">
                <span className="w-2 h-2 rounded-full bg-[#1570ef]" />
                GEO &amp; AI Search Audit Engine
              </span>
              <h2 className="mt-4 text-[32px] sm:text-[44px] lg:text-[50px] font-extrabold text-[#080d24] tracking-[-0.03em] leading-[1.12]">
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
                      className="flex-1 bg-transparent py-3 text-sm text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none"
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
                    className="px-8 py-3.5 rounded-xl bg-[#080d24] hover:bg-[#1570ef] text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap shadow-xs"
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
                    <span className="font-medium text-slate-600">Sample Websites:</span>
                    {["thewoodcraftstudio.in", "smiledentalindirapuram.com", "bansaltaxncr.in"].map((sample) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => {
                          setGeoWebsite(sample);
                          runGeoAudit(sample);
                        }}
                        className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-[#1570ef] text-[11px] font-semibold transition cursor-pointer"
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
                <div className="flex items-center justify-between text-xs font-bold text-[#1570ef] mb-2.5">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-ping" />
                    AUDITING LIVE AI SEARCH CRAWLERS
                  </span>
                  <span className="font-mono font-bold">{geoScanStep === 1 ? "35%" : geoScanStep === 2 ? "70%" : "95%"}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#1570ef] to-[#00b894] transition-all duration-300 rounded-full"
                    style={{ width: geoScanStep === 1 ? "35%" : geoScanStep === 2 ? "70%" : "95%" }}
                  />
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className={`flex items-center gap-2 ${geoScanStep >= 1 ? "text-emerald-700 font-semibold" : "text-slate-400"}`}>
                    <span>{geoScanStep >= 1 ? "✓" : "○"}</span>
                    <span>Pinging OpenAI SearchGPT &amp; ChatGPT citation database</span>
                  </div>
                  <div className={`flex items-center gap-2 ${geoScanStep >= 2 ? "text-emerald-700 font-semibold" : "text-slate-400"}`}>
                    <span>{geoScanStep >= 2 ? "✓" : "○"}</span>
                    <span>Checking Google Gemini &amp; Knowledge Entity Graph associations</span>
                  </div>
                  <div className={`flex items-center gap-2 ${geoScanStep >= 3 ? "text-emerald-700 font-semibold" : "text-slate-400"}`}>
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
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Verified AI Audit Report</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#080d24] mt-1 tracking-tight">
                      Audit Target: <span className="text-[#1570ef] font-mono">{geoWebsite || "yourbusiness.com"}</span>
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-semibold">
                      Live Engine Index
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
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
                        <span className="text-[44px] font-extrabold text-[#080d24] leading-none tracking-tight tabular-nums">
                          {geoResult.score ?? geoResult.overall ?? 82}
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-1">out of 100</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                        {geoResult.grade || "Strong Base with AI Schema Gaps"}
                      </span>
                      <p className="text-xs text-slate-500 mt-2 max-w-[220px] font-normal">
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
                          <span className="text-xs font-bold text-[#080d24]">{pillar.title}</span>
                          <span className="text-sm font-extrabold tabular-nums" style={{ color: pillar.color }}>
                            {pillar.score}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden mb-2">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pillar.score}%`, backgroundColor: pillar.color }}
                          />
                        </div>
                        <p className="text-[11.5px] text-slate-500 leading-snug font-normal">{pillar.desc}</p>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Audit Key Findings & Critical Fixes */}
                <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Verified Strengths */}
                  <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-3">
                      <span>✓</span>
                      <span>Verified Strengths Detected</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700 font-normal">
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
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-3">
                      <span>⚠️</span>
                      <span>High-Impact AI Fixes Needed</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700 font-normal">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span><strong className="font-semibold text-slate-900">Missing Entity Schema:</strong> Lack of JSON-LD <code>sameAs</code> connections prevents ChatGPT from recognizing your brand.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span><strong className="font-semibold text-slate-900">No Conversational Q&amp;A Clusters:</strong> Google AI Overviews requires explicit answer snippets to trigger citations.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span><strong className="font-semibold text-slate-900">Voice Search Intent Gap:</strong> Competitors are outranking you for long-tail &quot;best near me&quot; voice queries.</span>
                      </li>
                    </ul>
                  </div>

                </div>

                {/* Executive Action Banner */}
                <div className="mt-8 rounded-2xl bg-[#080d24] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
                  <div>
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 rounded-full">
                      FIX THESE 3 ISSUES
                    </span>
                    <h4 className="text-lg sm:text-xl font-extrabold text-white mt-1.5 tracking-tight">
                      Want Digital FX to optimize your site for #1 AI Citations?
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5 max-w-[540px] font-normal">
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
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs text-center shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>💬 Fix on WhatsApp (15% OFF)</span>
                      <span>→</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => openPricingModal()}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs text-center transition cursor-pointer"
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
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#207de9] bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full">
                VERIFIED CLIENT REVIEWS (50+ CLIENTS)
              </span>
              <h2 className="mt-4 text-[32px] sm:text-[44px] lg:text-[48px] font-extrabold text-[#080d24] tracking-[-0.035em] leading-[1.1]">
                Real Results Delivered For
                <span className="webfx-serif text-[#207de9] block font-normal mt-1">
                  30+ Verified Businesses Across India.
                </span>
              </h2>
              <p className="mt-3 text-xs font-semibold text-slate-500">
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
                      <span className="text-[9.5px] font-bold uppercase tracking-wider bg-white border border-slate-200 px-2 py-0.5 rounded text-[#207de9]">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal">
                      "{item.quote}"
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-200/80 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#207de9] text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                      {item.author.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-[#080d24] truncate">{item.author}</div>
                      <div className="text-[11px] text-slate-500 font-normal truncate">{item.business}</div>
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
                      <span className="text-[9.5px] font-bold uppercase tracking-wider bg-white border border-slate-200 px-2 py-0.5 rounded text-[#207de9]">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal">
                      "{item.quote}"
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-200/80 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#207de9] text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                      {item.author.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-[#080d24] truncate">{item.author}</div>
                      <div className="text-[11px] text-slate-500 font-normal truncate">{item.business}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================================================
            9B. PROPRIETARY RESEARCH & INDUSTRY TRENDS (WEBFX EDITORIAL)
            ========================================================================== */}
        <section
          id="insights"
          className="py-20 sm:py-24 bg-gradient-to-b from-[#f8faff] via-white to-slate-50 border-b border-slate-200"
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header: We Don’t Just Follow Industry Trends — We Publish Them */}
            <div className="text-center max-w-[880px] mx-auto">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1570ef]">
                <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse"></span>
                Original Market Research &amp; Publications
              </span>
              <h2 className="mt-4 text-[30px] sm:text-[42px] lg:text-[46px] font-extrabold text-[#080d24] tracking-[-0.03em] leading-[1.14]">
                We Don’t Just Follow Industry Trends —{" "}
                <span className="text-[#1570ef] webfx-serif block sm:inline font-normal">
                  We Publish Them
                </span>
              </h2>
              <p className="mt-4 text-[15px] sm:text-[17px] leading-relaxed text-slate-600 font-normal max-w-[780px] mx-auto">
                The Digital FX experts regularly leverage our first-party data along with original research to produce insights for marketing managers and business teams to make smarter marketing decisions.
              </p>
            </div>

            {/* 3 Research Cards Grid */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Card 1: Google AI Overviews */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#1570ef] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                      AI Search Study
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-slate-400">2.3M Data Points</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#080d24] group-hover:text-[#1570ef] transition-colors leading-snug tracking-tight">
                    Where and Why Google’s AI Overviews Appear
                  </h3>
                  <p className="mt-3 text-xs sm:text-[13.5px] text-slate-600 font-normal leading-relaxed">
                    Our study of 2.3m keywords reveals the query types and industries most impacted by Google’s AI-generated answers.
                  </p>
                </div>
                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href="#geo-checker"
                    onClick={scrollToGeoAudit}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1570ef] hover:underline cursor-pointer"
                  >
                    Run AI Search Audit <span className="transition-transform group-hover:translate-x-1">→</span>
                  </a>
                  <span className="text-[11px] text-slate-400 font-medium">Study Report</span>
                </div>
              </div>

              {/* Card 2: How Gen AI is Changing Search */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      Search Intelligence
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-slate-400">GEO Strategy</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#080d24] group-hover:text-emerald-600 transition-colors leading-snug tracking-tight">
                    How Gen AI is Changing Search
                  </h3>
                  <p className="mt-3 text-xs sm:text-[13.5px] text-slate-600 font-normal leading-relaxed">
                    Understand how generative AI is transforming search engines and what it means for your marketing strategy.
                  </p>
                </div>
                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href="#geo-checker"
                    onClick={scrollToGeoAudit}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                  >
                    Explore GEO Strategy <span className="transition-transform group-hover:translate-x-1">→</span>
                  </a>
                  <span className="text-[11px] text-slate-400 font-medium">Trend Analysis</span>
                </div>
              </div>

              {/* Card 3: How Different Generations Use AI */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full">
                      Demographic Study
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-slate-400">User Behavior</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#080d24] group-hover:text-purple-600 transition-colors leading-snug tracking-tight">
                    How Different Generations Use AI to Search
                  </h3>
                  <p className="mt-3 text-xs sm:text-[13.5px] text-slate-600 font-normal leading-relaxed">
                    Our original research reveals insights into how Gen Z, Millennials, Gen X, and Boomers are using AI.
                  </p>
                </div>
                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsAiSuiteOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:underline cursor-pointer"
                  >
                    Preview AI Suite <span className="transition-transform group-hover:translate-x-1">→</span>
                  </button>
                  <span className="text-[11px] text-slate-400 font-medium">User Insights</span>
                </div>
              </div>

            </div>

            {/* Careers Spotlight Card / Banner */}
            <div className="mt-8 rounded-2xl sm:rounded-3xl bg-[#080d24] p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl border border-slate-800">
              <div className="space-y-1.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#207de9] bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Careers &amp; Talent Acquisition
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Want to join our award-winning team?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                  We’re always looking for top talent to help our clients achieve their goals.
                </p>
              </div>

              <div className="shrink-0">
                <a
                  href="mailto:careers@digitalfx.in?subject=Career%20Application%20at%20Digital%20FX"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#207de9] hover:bg-[#1866c2] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5"
                >
                  Join Our Team →
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* ==========================================================================
            10. WEBFX SIGNATURE BOTTOM GRADIENT CLOSER CTA
            ========================================================================== */}
        <section id="contact" className="py-20 sm:py-24 bg-gradient-to-b from-white via-slate-50/60 to-white border-b border-slate-200">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="text-center max-w-[820px] mx-auto mb-14">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1570ef]">
                <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse"></span>
                Official Agency Headquarters &amp; Strategic Advisory
              </span>
              <h2 className="mt-4 text-[32px] sm:text-[44px] lg:text-[48px] font-extrabold text-[#080d24] tracking-[-0.03em] leading-[1.12]">
                Visit Our Office Or Connect With Our{" "}
                <span className="text-[#1570ef] webfx-serif block sm:inline font-normal">
                  Senior Growth Strategists
                </span>
              </h2>
              <p className="mt-4 text-[15px] sm:text-[17px] leading-relaxed text-slate-600 font-normal max-w-[700px] mx-auto">
                Ready to scale your organic rankings, paid acquisition, and attributable revenue? Speak directly with our team in Orbit Plaza, Crossings Republik, or request a customized audit below.
              </p>
            </div>

            {/* Main 2-Column Grid: Left (Office Details & LIVE MAP) + Right (Consultation Proposal Form) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              
              {/* Left Column (7 cols): Full Verified Office Card + Live Interactive Google Map */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl flex flex-col justify-between space-y-6">
                
                {/* Agency Brand & Location Header */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#080d24] to-[#207de9] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          FX
                        </div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-[#080d24] tracking-tight">
                          DIGITAL <span className="text-[#207de9]">FX</span> | DIGITAL MARKETING AGENCY
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Enterprise Performance Marketing &amp; Generative AI Search Architecture
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Verified Google Business Listing</span>
                    </div>
                  </div>

                  {/* Address & Contact Attributes Grid */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    
                    {/* Physical Office Address */}
                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1.5">
                        <span>📍</span>
                        <span>Office Headquarters</span>
                      </div>
                      <p className="font-bold text-slate-900 text-xs sm:text-[13px] leading-snug">
                        Shop No. 210, 2nd Floor, Orbit Plaza
                      </p>
                      <p className="text-slate-600 mt-0.5 leading-relaxed font-normal">
                        Crossings Republik, Ghaziabad, Uttar Pradesh 201016, India
                      </p>
                      <div className="mt-2 text-[10px] font-medium text-slate-500 flex items-center gap-1">
                        <span>🏢 Landmark:</span> Orbit Plaza Commercial Center (NH-24 Corridor)
                      </div>
                    </div>

                    {/* Operational Hours */}
                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1.5">
                        <span>⏰</span>
                        <span>Consultation Hours</span>
                      </div>
                      <div className="space-y-1 text-slate-700">
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-900">Mon – Sat:</span>
                          <span className="font-mono text-emerald-700 font-bold">9:30 AM – 7:30 PM IST</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-normal">Sunday:</span>
                          <span className="text-slate-400 font-medium">By Prior Appointment</span>
                        </div>
                        <div className="pt-1.5 text-[10px] text-slate-500 border-t border-slate-200/60 font-normal">
                          Direct in-office and virtual Google Meet consultations available.
                        </div>
                      </div>
                    </div>

                    {/* Direct Telephone */}
                    <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#1570ef] flex items-center gap-1.5 mb-1">
                        <span>☎</span>
                        <span>Direct Telephone Desk</span>
                      </div>
                      <a
                        href="tel:+919876543210"
                        className="text-base sm:text-lg font-extrabold text-[#080d24] hover:text-[#1570ef] transition block font-mono"
                      >
                        +91 98765 43210
                      </a>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-normal">
                        Toll-free routing for Delhi NCR &amp; national inquiries.
                      </p>
                    </div>

                    {/* Direct Communications & WhatsApp */}
                    <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 mb-1">
                        <span>💬</span>
                        <span>WhatsApp &amp; Inquiries</span>
                      </div>
                      <a
                        href="https://wa.me/919876543210?text=Hi%20Digital%20FX%20team,%20I%20want%20to%20discuss%20a%20growth%20strategy."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base sm:text-lg font-extrabold text-emerald-800 hover:text-emerald-900 transition flex items-center gap-2 font-mono"
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Chat on WhatsApp</span>
                      </a>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-normal">
                        Email: <a href="mailto:hello@digitalfx.in" className="font-semibold text-slate-700 hover:underline">hello@digitalfx.in</a>
                      </p>
                    </div>

                  </div>
                </div>

                {/* Google Maps Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <a
                    href="https://share.google/EIVnaRy9WhkPCi8U8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#207de9] hover:bg-[#1866c2] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>📍 Open in Google Maps / Get Directions</span>
                    <span>↗</span>
                  </a>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <span className="text-amber-500 text-sm">★★★★★</span>
                    <span>4.9 / 5.0 Rating on Google</span>
                  </div>
                </div>

                {/* LIVE EMBEDDED INTERACTIVE GOOGLE MAP */}
                <div className="relative w-full h-[300px] sm:h-[360px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner group">
                  <iframe
                    title="Digital FX Office Location - Orbit Plaza Crossings Republik Ghaziabad"
                    src="https://maps.google.com/maps?q=Orbit+Plaza,+Crossings+Republik,+Ghaziabad,+Uttar+Pradesh+201016&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                  {/* Floating Location Overlay Chip */}
                  <div className="absolute bottom-3 left-3 right-3 sm:right-auto bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-lg flex items-center justify-between sm:justify-start gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-emerald" />
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">Orbit Plaza, 2nd Floor, Shop 210</p>
                        <p className="text-[10px] text-slate-500 font-normal">Crossings Republik, Ghaziabad 201016</p>
                      </div>
                    </div>
                    <a
                      href="https://share.google/EIVnaRy9WhkPCi8U8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1570ef] font-bold text-[11px] transition whitespace-nowrap"
                    >
                      Open Full Map ↗
                    </a>
                  </div>
                </div>

              </div>

              {/* Right Column (5 cols): High-Converting Consultation & Proposal Request Form */}
              <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1570ef] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                      Free Strategy Audit
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-slate-400">Response &lt; 24h</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#080d24] tracking-tight">
                    Request Strategic Proposal
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-500 font-normal mt-1 mb-6 leading-relaxed">
                    Tell us about your business goals. We’ll perform a competitor gap analysis and map out an attributable growth strategy.
                  </p>

                  <form onSubmit={handleEnquiry} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#207de9] focus:bg-white text-slate-800 font-medium transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="+91 98765..."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#207de9] focus:bg-white text-slate-800 font-medium transition"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="you@company.com"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#207de9] focus:bg-white text-slate-800 font-medium transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Website URL / Business Name
                      </label>
                      <input
                        type="text"
                        name="website"
                        defaultValue={heroWebsite || geoWebsite || ""}
                        placeholder="e.g. www.yourcompany.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#207de9] focus:bg-white text-slate-800 font-medium transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Primary Service Focus
                      </label>
                      <select
                        name="service"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#207de9] focus:bg-white text-slate-800 font-medium transition"
                      >
                        <option value="Business Growth Package">Business Growth Package (Full Engine)</option>
                        <option value="SEO & AI Search">SEO &amp; Generative Engine Optimization (GEO)</option>
                        <option value="Google Business Profile Setup">Google Business Profile &amp; Local Maps #1</option>
                        <option value="Website Development">High-Converting Website Development</option>
                        <option value="Paid Ads Management">Google Ads &amp; Meta Performance Marketing</option>
                        <option value="Custom Enterprise Scope">Custom Enterprise Consultation</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={formLoading}
                      className="w-full py-4 rounded-xl bg-[#207de9] hover:bg-[#1a6bc7] text-white font-bold text-sm shadow-md mt-2 transition disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5 tracking-wide"
                    >
                      {formLoading ? (
                        <span>Submitting Proposal Request...</span>
                      ) : (
                        <>
                          <span>Submit Proposal Request</span>
                          <span>→</span>
                        </>
                      )}
                    </button>
                  </form>

                  {successMessage && (
                    <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 text-center flex items-center justify-center gap-2">
                      <span>✓</span>
                      <span>{successMessage}</span>
                    </div>
                  )}
                  {errorMessage && (
                    <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 text-center flex items-center justify-center gap-2">
                      <span>✕</span>
                      <span>{errorMessage}</span>
                    </div>
                  )}
                </div>

                {/* Institutional Guarantees */}
                <div className="mt-6 pt-5 border-t border-slate-100 space-y-2 text-[11px] text-slate-600 font-normal">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>100% Confidentiality &amp; NDA protection guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Dedicated senior strategist assigned — no junior handoffs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Complimentary audit report delivered within 24 business hours</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ==========================================================================
            11. DIGITAL FX MEGA FOOTER
            ========================================================================== */}
        <footer className="bg-[#080d24] text-white pt-16 pb-12 border-t border-white/10">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Top Bar: Premier Digital Marketing & Give us a ring CTA */}
            <div className="pb-10 border-b border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wider uppercase mb-3">
                  <span className="text-blue-400 text-sm">★</span>
                  Premier Digital Marketing &amp; GEO AI Search Agency
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Ready to speak with a marketing expert? <span className="text-[#207de9]">Give us a ring</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl font-normal leading-relaxed">
                  Call our senior strategists directly for bespoke organic search, paid advertising, and revenue engine architecture.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#207de9] hover:bg-[#1866c2] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5"
                >
                  <span>☎ Call +91 98765 43210</span>
                </a>
                <a
                  href="https://wa.me/919876543210?text=Hi%20Digital%20FX%20team,%20I%20want%20to%20discuss%20a%20growth%20strategy."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-bold border border-white/15 transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </div>

            {/* Office & Brand Identity Strip */}
            <div className="py-8 border-b border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden p-1 shrink-0 shadow-sm">
                  <img src="/logo.png" alt="Digital FX" className="h-full w-full object-contain" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-white">DIGITAL <span className="text-[#207de9]">FX</span></div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Digital Marketing That Drives Revenue®</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#207de9] mb-1">Office &amp; Headquarters</div>
                <div className="text-slate-300 leading-snug font-normal">
                  Shop No. 210, Orbit Plaza, Second Floor, Crossings Republik, Ghaziabad, UP 201016 India
                </div>
                <a
                  href="https://share.google/EIVnaRy9WhkPCi8U8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-[#207de9] hover:underline font-semibold mt-1.5"
                >
                  <span>View on Google Maps</span> <span>↗</span>
                </a>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#207de9] mb-1">Direct Communications</div>
                <div className="text-slate-300 leading-snug font-normal">
                  Email: <a href="mailto:hello@digitalfx.in" className="text-white hover:underline font-semibold">hello@digitalfx.in</a><br />
                  Direct Phone: <span className="text-white font-semibold">+91 98765 43210</span>
                </div>
              </div>
            </div>

            {/* 5 Mega Footer Columns */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 py-12 border-b border-white/10">
              
              {/* Column 1: Services */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#207de9]" />
                  Services
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-400 font-normal">
                  <li><a href="#services" onClick={scrollToServices} className="hover:text-white transition">Digital Marketing Strategy</a></li>
                  <li><a href="#services" onClick={scrollToServices} className="hover:text-white transition">SEO &amp; Organic Ranking</a></li>
                  <li><a href="#services" onClick={scrollToServices} className="hover:text-white transition">PPC &amp; Google Ads Campaign</a></li>
                  <li><a href="#services" onClick={scrollToServices} className="hover:text-white transition">Content &amp; Inbound Marketing</a></li>
                  <li><a href="#services" onClick={scrollToServices} className="hover:text-white transition">Social Media Acceleration</a></li>
                  <li><a href="#services" onClick={scrollToServices} className="hover:text-white transition">Full-Stack Web Development</a></li>
                  <li><a href="#geo-checker" onClick={scrollToGeoAudit} className="hover:text-white transition text-[#207de9] font-medium">GEO AI Optimization →</a></li>
                </ul>
              </div>

              {/* Column 2: Solutions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Solutions
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-400 font-normal">
                  <li><button type="button" onClick={() => openPricingModal("google_listing")} className="text-left hover:text-white transition cursor-pointer">Google Maps Top 3 Rank</button></li>
                  <li><button type="button" onClick={() => openPricingModal("website")} className="text-left hover:text-white transition cursor-pointer">High-Converting Websites</button></li>
                  <li><button type="button" onClick={() => openPricingModal("growth")} className="text-left hover:text-white transition cursor-pointer">360° Growth Retainer</button></li>
                  <li><button type="button" onClick={() => openPricingModal("custom")} className="text-left hover:text-white transition cursor-pointer">Custom Retainer Payment</button></li>
                  <li><a href="#home" onClick={(e) => scrollToSection("home", e)} className="hover:text-white transition">Revenue Engine Matrix</a></li>
                  <li><a href="#growth-dashboard" onClick={(e) => scrollToSection("growth-dashboard", e)} className="hover:text-white transition">Performance Dashboard</a></li>
                  <li><button type="button" onClick={() => setIsAiSuiteOpen(true)} className="text-left hover:text-white transition cursor-pointer text-emerald-400 font-medium">AI Business Suite (Preview)</button></li>
                </ul>
              </div>

              {/* Column 3: Company */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Company
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-400 font-normal">
                  <li><a href="#home" onClick={scrollToTop} className="hover:text-white transition">About Digital FX</a></li>
                  <li><a href="#case-studies" onClick={(e) => scrollToSection("case-studies", e)} className="hover:text-white transition">Client Case Studies</a></li>
                  <li><a href="#case-studies" onClick={(e) => scrollToSection("case-studies", e)} className="hover:text-white transition">Verified 5-Star Reviews</a></li>
                  <li><a href="#contact" onClick={scrollToContact} className="hover:text-white transition">Contact Strategy Team</a></li>
                  <li><a href="#insights" onClick={(e) => scrollToSection("insights", e)} className="hover:text-white transition">Industry Research</a></li>
                  <li><a href="https://share.google/EIVnaRy9WhkPCi8U8" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Ghaziabad HQ Map ↗</a></li>
                  <li><a href="mailto:careers@digitalfx.in" className="hover:text-white transition">Careers (Join Us)</a></li>
                </ul>
              </div>

              {/* Column 4: Growth Tools */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Growth Tools
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-400 font-normal">
                  <li><a href="#geo-checker" onClick={scrollToGeoAudit} className="hover:text-white transition font-medium text-emerald-400">GEO AI Search Audit</a></li>
                  <li><a href="#geo-checker" onClick={scrollToGeoAudit} className="hover:text-white transition">ChatGPT Citation Diagnostic</a></li>
                  <li><a href="#geo-checker" onClick={scrollToGeoAudit} className="hover:text-white transition">Gemini AI Visibility Checker</a></li>
                  <li><a href="#geo-checker" onClick={scrollToGeoAudit} className="hover:text-white transition">Local Pack SEO Diagnostic</a></li>
                  <li><button type="button" onClick={() => openPricingModal("custom")} className="text-left hover:text-white transition cursor-pointer">Official PayU Terminal</button></li>
                  <li><button type="button" onClick={() => openPricingModal("custom")} className="text-left hover:text-white transition cursor-pointer">Retainer Calculator</button></li>
                  <li><a href="#geo-checker" onClick={scrollToGeoAudit} className="hover:text-white transition font-semibold text-[#207de9]">Run Instant Audit →</a></li>
                </ul>
              </div>

              {/* Column 5: Explore */}
              <div className="col-span-2 sm:col-span-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Explore &amp; Grow
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-400 font-normal">
                  <li><a href="#geo-checker" onClick={scrollToGeoAudit} className="hover:text-white transition">Generative Engine Optimization</a></li>
                  <li><a href="#geo-checker" onClick={scrollToGeoAudit} className="hover:text-white transition">The Future of Search &amp; AI</a></li>
                  <li><a href="#services" onClick={scrollToServices} className="hover:text-white transition">10x Revenue Acceleration</a></li>
                  <li><a href="#services" onClick={scrollToServices} className="hover:text-white transition">Local Business Lead Engine</a></li>
                  <li><a href="#contact" onClick={scrollToContact} className="hover:text-white transition">Regional Market Dominance</a></li>
                  <li><a href="#contact" onClick={scrollToContact} className="hover:text-white transition">Book Discovery Call</a></li>
                  <li><button type="button" onClick={() => openPricingModal("custom")} className="text-left hover:text-white transition font-semibold text-emerald-400 cursor-pointer">Instant Checkout Desk →</button></li>
                </ul>
              </div>

            </div>

            {/* Bottom Bar / Sub-footer */}
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
                <span className="font-bold text-white">Digital FX®</span>
                <span className="hidden sm:inline text-slate-600">•</span>
                <span className="font-normal">Premier Digital Marketing &amp; GEO AI Search Agency</span>
                <span className="hidden sm:inline text-slate-600">•</span>
                <span className="font-normal">© {new Date().getFullYear()} Digital FX®. All rights reserved.</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 font-normal">
                <a href="#services" onClick={scrollToServices} className="hover:text-white transition cursor-pointer">Sitemap &amp; Services</a>
                <a href="#contact" onClick={scrollToContact} className="hover:text-white transition cursor-pointer">Privacy &amp; Terms of Use</a>
                <button type="button" onClick={() => openPricingModal("custom")} className="hover:text-white transition text-[#207de9] font-medium cursor-pointer">Client Billing Portal</button>
              </div>
            </div>

          </div>
        </footer>

        {/* ==========================================================================
            12. EXECUTIVE CLIENT INVOICE & PAYU CHECKOUT TERMINAL
            ========================================================================== */}
        {paymentOpen && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
            <div className="relative w-full max-w-[1040px] my-auto bg-white rounded-3xl shadow-[0_25px_80px_rgba(8,13,36,0.55)] border border-slate-300 overflow-hidden text-slate-900 font-[var(--font-plus-jakarta)]">
              
              {/* Top Institutional Header Bar - Big Bold Typography */}
              <div className="bg-[#080d24] text-white px-6 sm:px-8 py-5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-md border border-white/20 shrink-0">
                    <img src="/logo.png" alt="Digital FX" className="h-full w-full object-contain" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                        DIGITAL <span className="text-[#207de9]">FX</span>
                      </span>
                      <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-md border border-white/10">
                        Official Order &amp; Checkout Desk
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-2.5 sm:gap-3.5 font-normal">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" /> RBI Authorized Gateway
                      </span>
                      <span className="text-slate-500 hidden sm:inline">•</span>
                      <span className="flex items-center gap-1.5 text-slate-300 text-[11.5px] font-medium">
                        🔒 256-Bit SSL Bank Encrypted
                      </span>
                      <span className="text-slate-500 hidden md:inline">•</span>
                      <span className="hidden md:inline text-slate-300 text-[11.5px] font-medium">
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
                      <h3 className="text-xl sm:text-2xl font-extrabold text-[#080d24] tracking-tight">
                        Select Client Engagement Tier
                      </h3>
                      <p className="text-sm text-slate-600 font-normal mt-1 leading-normal">
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
                              <div className="text-base sm:text-lg font-bold text-[#080d24]">
                                Google Business Profile Setup
                              </div>
                              <div className="text-xs sm:text-[13px] text-slate-500 font-normal mt-0.5">
                                Maps Rank #1 Optimization &amp; Local Search Authority
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xl sm:text-2xl font-extrabold text-[#080d24] tabular-nums">₹2,999</div>
                            <div className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">One-Time</div>
                          </div>
                        </div>

                        {/* Professional Deliverables Checklist */}
                        <ul className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-2 text-xs sm:text-[13px] text-slate-700 font-normal">
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
                              <div className="text-base sm:text-lg font-bold text-[#080d24]">
                                Website Development
                              </div>
                              <div className="text-xs sm:text-[13px] text-slate-500 font-normal mt-0.5">
                                High-Velocity Conversion Landing Architecture
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xl sm:text-2xl font-extrabold text-[#080d24] tabular-nums">₹5,999</div>
                            <div className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">One-Time</div>
                          </div>
                        </div>

                        <ul className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-2 text-xs sm:text-[13px] text-slate-700 font-normal">
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
                                <span className="text-base sm:text-lg font-bold text-[#080d24]">
                                  Business Growth Package
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#207de9] bg-blue-100 border border-blue-200 px-2.5 py-0.5 rounded-md">
                                  FLAGSHIP ENGINE
                                </span>
                              </div>
                              <div className="text-xs sm:text-[13px] text-slate-500 font-normal mt-0.5">
                                Complete Integrated Growth: Website + Google Profile + Local SEO
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xl sm:text-2xl font-extrabold text-[#080d24] tabular-nums">₹9,999</div>
                            <div className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">One-Time</div>
                          </div>
                        </div>

                        <ul className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-2 text-xs sm:text-[13px] text-slate-700 font-normal">
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

                      {/* Plan 4: Custom Amount (Client's Choice) */}
                      <div
                        onClick={() => setSelectedPaymentPlan(paymentPlans[3])}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                          selectedPaymentPlan?.id === "custom"
                            ? "bg-white border-[#207de9] shadow-md ring-2 ring-[#207de9]/20"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3.5">
                            <div className={`w-5 h-5 rounded-full border mt-1 flex items-center justify-center shrink-0 transition ${
                              selectedPaymentPlan?.id === "custom"
                                ? "border-[#207de9] bg-[#207de9]"
                                : "border-slate-300 bg-white"
                            }`}>
                              {selectedPaymentPlan?.id === "custom" && (
                                <span className="w-2 h-2 rounded-full bg-white block" />
                              )}
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-base sm:text-lg font-bold text-[#080d24]">
                                  Custom Amount / Retainer
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                                  YOUR CHOICE
                                </span>
                              </div>
                              <div className="text-xs sm:text-[13px] text-slate-500 font-normal mt-0.5">
                                Apni marzi ka payment amount bhar kar instantly PayU se pay karein
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xl sm:text-2xl font-extrabold text-[#207de9] tabular-nums">
                              ₹{customPaymentAmount ? Number(customPaymentAmount).toLocaleString("en-IN") : "0"}
                            </div>
                            <div className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Custom Scope</div>
                          </div>
                        </div>

                        {/* Interactive Custom Amount Input */}
                        <div className="mt-3.5 pt-3.5 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                          <label className="block text-xs font-bold text-slate-800 mb-1.5">
                            Enter Custom Amount in INR (₹) *
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 font-extrabold text-base pointer-events-none">
                              ₹
                            </span>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={customPaymentAmount}
                              onChange={(e) => {
                                setCustomPaymentAmount(e.target.value);
                                if (selectedPaymentPlan?.id !== "custom") {
                                  setSelectedPaymentPlan(paymentPlans[3]);
                                }
                              }}
                              onFocus={() => {
                                if (selectedPaymentPlan?.id !== "custom") {
                                  setSelectedPaymentPlan(paymentPlans[3]);
                                }
                              }}
                              placeholder="e.g. 15000"
                              className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-300 focus:border-[#207de9] focus:bg-white rounded-xl text-slate-900 font-extrabold text-lg focus:outline-none focus:ring-2 focus:ring-blue-100 transition shadow-xs tabular-nums"
                            />
                          </div>

                          {/* Quick Amount Suggestion Chips */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                            <span className="text-[11px] text-slate-400 font-semibold mr-1">Quick Select:</span>
                            {[2000, 5000, 10000, 15000, 25000, 50000].map((amt) => (
                              <button
                                key={amt}
                                type="button"
                                onClick={() => {
                                  setCustomPaymentAmount(String(amt));
                                  setSelectedPaymentPlan(paymentPlans[3]);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                                  selectedPaymentPlan?.id === "custom" && customPaymentAmount === String(amt)
                                    ? "bg-[#207de9] text-white border-[#207de9] shadow-xs"
                                    : "bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#207de9] border-slate-200"
                                }`}
                              >
                                ₹{amt.toLocaleString("en-IN")}
                              </button>
                            ))}
                          </div>
                        </div>

                        <ul className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-1.5 text-xs text-slate-600 font-normal">
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-emerald-600 shrink-0 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Pay for custom retainers, ad budget deposits, or agreed milestones</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-emerald-600 shrink-0 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Official GST tax invoice generated for exact custom settlement amount</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Enterprise Retainer Callout */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#080d24]">
                        Enterprise Scope or Custom Scope?
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 font-normal">
                        Multi-location SEO, full PPC campaigns, GEO AI search optimization.
                      </div>
                    </div>
                    <a
                      href="https://wa.me/919876543210?text=Hello%20Digital%20FX%20Team%2C%20we%20require%20a%20custom%20growth%20proposal%20or%20enterprise%20agreement."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs transition shrink-0 whitespace-nowrap"
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
                      <div className="text-xs font-bold uppercase tracking-wider text-[#207de9]">
                        INVOICE SETTLEMENT LEDGER
                      </div>
                      <div className="text-xl sm:text-2xl font-extrabold text-[#080d24] mt-1 tracking-tight">
                        {selectedPaymentPlan
                          ? selectedPaymentPlan.id === "custom"
                            ? "Custom Scope / Bespoke Retainer"
                            : selectedPaymentPlan.name
                          : "Select Package"}
                      </div>
                    </div>

                    {/* Financial Breakdown Table */}
                    <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
                      <div className="flex justify-between text-slate-600 text-xs sm:text-[13px]">
                        <span className="font-normal">Deployment SLA:</span>
                        <span className="font-semibold text-slate-800">
                          {selectedPaymentPlan?.id === "custom" ? "Immediate Client Kickoff" : "3–5 Business Days Kickoff"}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 text-xs sm:text-[13px]">
                        <span className="font-normal">Invoice Type:</span>
                        <span className="font-semibold text-slate-800">
                          {selectedPaymentPlan?.id === "custom" ? "Custom Invoice / Retainer Deposit" : "Fixed One-Time Fee"}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 text-xs sm:text-[13px]">
                        <span className="font-normal">Tax &amp; Platform Fee:</span>
                        <span className="font-semibold text-emerald-700">Included (0% Surcharge)</span>
                      </div>
                      <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                        <span className="font-bold text-[#080d24] text-sm">Total Amount Due:</span>
                        <div className="text-right">
                          <span className="text-3xl sm:text-4xl font-extrabold text-[#080d24] tracking-tight tabular-nums">
                            ₹{selectedPaymentPlan?.id === "custom"
                              ? (Number(customPaymentAmount) || 0).toLocaleString("en-IN")
                              : (selectedPaymentPlan ? Number(selectedPaymentPlan.amount).toLocaleString("en-IN") : "0")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={startPayUPayment} className="space-y-3.5 text-xs">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1.5 text-xs sm:text-[13px]">
                          Authorized Representative Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={paymentName}
                          onChange={(e) => setPaymentName(e.target.value)}
                          placeholder="Full name as per business records"
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:border-[#207de9] focus:ring-2 focus:ring-blue-100 transition shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1.5 text-xs sm:text-[13px]">
                          Billing Email (For Tax Invoice &amp; Receipt) *
                        </label>
                        <input
                          type="email"
                          required
                          value={paymentEmail}
                          onChange={(e) => setPaymentEmail(e.target.value)}
                          placeholder="billing@yourcompany.com"
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:border-[#207de9] focus:ring-2 focus:ring-blue-100 transition shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1.5 text-xs sm:text-[13px]">
                          Mobile Number (For Project Onboarding) *
                        </label>
                        <input
                          type="tel"
                          required
                          value={paymentPhone}
                          onChange={(e) => setPaymentPhone(e.target.value)}
                          placeholder="10-digit mobile number"
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:border-[#207de9] focus:ring-2 focus:ring-blue-100 transition shadow-xs"
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
                        className="w-full py-4 rounded-xl bg-[#207de9] hover:bg-[#1866c2] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer text-center tracking-wide mt-2"
                      >
                        {paymentLoading
                          ? "Connecting to PayU India Gateway..."
                          : `Authorize & Pay ₹${
                              selectedPaymentPlan?.id === "custom"
                                ? (Number(customPaymentAmount) || 0).toLocaleString("en-IN")
                                : (selectedPaymentPlan ? Number(selectedPaymentPlan.amount).toLocaleString("en-IN") : "0")
                            } via PayU India →`}
                      </button>
                    </form>
                  </div>

                  {/* Payment Methods & RBI Authorized Badges */}
                  <div className="mt-5 pt-4 border-t border-slate-100 text-center space-y-2.5">
                    <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-700">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">UPI (GPay, PhonePe, Paytm)</span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">Cards (Visa, RuPay, MC)</span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">NetBanking</span>
                    </div>
                    <p className="text-xs text-slate-500 font-normal leading-relaxed">
                      Processed securely via PayU India (PCI-DSS Level 1 Certified). Official GST tax invoice issued immediately.
                    </p>
                  </div>

                </div>

              </div>
            </div>
          </div>
        )}

        {/* ==========================================================================
            12B. AI BUSINESS SUITE — COMING SOON MODAL (PROPRIETARY AGENCY SUITE)
            ========================================================================== */}
        {isAiSuiteOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-[#080d24]/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
            onClick={() => setIsAiSuiteOpen(false)}
          >
            <div
              className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-scaleUp"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header: High-Tech Enterprise Dark Banner */}
              <div className="bg-gradient-to-r from-[#080d24] via-[#0c173d] to-[#080d24] p-5 sm:p-7 text-white border-b border-white/10 relative shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      PROPRIETARY INTELLIGENCE SUITE • COMING Q2 2026
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white mt-1">
                      Digital FX Autonomous AI Business Suite
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                      Engineered specifically for business owners, clinics, and brands to eliminate manual work, automate local reputation, and capture every revenue opportunity 24/7.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAiSuiteOpen(false)}
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-base font-bold transition cursor-pointer shrink-0 border border-white/10"
                    title="Close Preview"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Body: Scrollable Features & Early Access Waitlist */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8 bg-slate-50/60">

                {/* Grid of 6 Core Business Automation Modules */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-[#080d24] tracking-tight">
                        Core Business Automation Modules
                      </h3>
                      <p className="text-xs text-slate-500 font-normal">
                        Proprietary AI capabilities currently in private client beta testing.
                      </p>
                    </div>
                    <span className="hidden sm:inline-flex text-[11px] font-bold text-[#1570ef] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      6 Modules Included
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Feature 1: Google Maps Review Smart Auto-Reply */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 transition-all shadow-xs group">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-extrabold text-[#080d24]">
                              Google Maps Review Smart Auto-Reply
                            </h4>
                            <span className="text-[9.5px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                              24/7 SLA
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs text-slate-600 font-normal leading-relaxed">
                            Detects new Google reviews within 60 seconds. Crafts authentic, sentiment-aware, human-like responses in English &amp; Hinglish with integrated local SEO keywords to cement your Google 3-Pack rank.
                          </p>
                          <div className="mt-2.5 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                            <span className="text-emerald-600 font-bold">✓ &lt;60s Response</span>
                            <span>•</span>
                            <span>Sentiment Analysis</span>
                            <span>•</span>
                            <span>100% 5-Star Safeguard</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Feature 2: Automated Customer Form-Fill & Lead Intelligence */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 transition-all shadow-xs group">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-[#1570ef] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-extrabold text-[#080d24]">
                              Form-Fill Intelligence &amp; Instant WhatsApp Push
                            </h4>
                            <span className="text-[9.5px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shrink-0">
                              Sub-3s Push
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs text-slate-600 font-normal leading-relaxed">
                            Auto-completes and enriches inquiry data as prospective clients type. Instantly validates phone numbers, evaluates buyer intent, and pushes qualified alerts to your sales WhatsApp within 3 seconds.
                          </p>
                          <div className="mt-2.5 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                            <span className="text-blue-600 font-bold">✓ Zero Missed Leads</span>
                            <span>•</span>
                            <span>Buyer Intent Scoring</span>
                            <span>•</span>
                            <span>Instant CRM Sync</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Feature 3: Autonomous AI Website Builder & Self-Optimizing CRO */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 transition-all shadow-xs group">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-extrabold text-[#080d24]">
                              Autonomous AI Website &amp; Landing Page Engine
                            </h4>
                            <span className="text-[9.5px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 shrink-0">
                              Instant CRO
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs text-slate-600 font-normal leading-relaxed">
                            Dynamically builds ultra-fast, high-converting landing pages tailored to specific search keywords and geographic catchments. Continuously A/B tests headlines and buttons to compound conversion rates.
                          </p>
                          <div className="mt-2.5 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                            <span className="text-purple-600 font-bold">✓ Sub-Second Speed</span>
                            <span>•</span>
                            <span>Self-Learning CRO</span>
                            <span>•</span>
                            <span>Dynamic GEO Copy</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Feature 4: AI Review & Testimonial Generator Engine */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 transition-all shadow-xs group">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-extrabold text-[#080d24]">
                              Review &amp; Testimonial Multiplier Engine
                            </h4>
                            <span className="text-[9.5px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                              3.5x Volume
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs text-slate-600 font-normal leading-relaxed">
                            Sends frictionless post-service WhatsApp review invitations to happy customers. Generates custom 1-tap 5-star review drafts based on their exact experience, multiplying authentic Google &amp; Clutch feedback.
                          </p>
                          <div className="mt-2.5 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                            <span className="text-amber-600 font-bold">✓ 1-Tap Submission</span>
                            <span>•</span>
                            <span>Automated Workflows</span>
                            <span>•</span>
                            <span>Clutch &amp; Google Ready</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Feature 5: Conversational WhatsApp Sales Concierge */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 transition-all shadow-xs group">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-extrabold text-[#080d24]">
                              Conversational Multi-Channel Sales Concierge
                            </h4>
                            <span className="text-[9.5px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 shrink-0">
                              24/7 Agent
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs text-slate-600 font-normal leading-relaxed">
                            A highly trained conversational assistant that responds to incoming inquiries on WhatsApp and Web, qualifies lead budgets, provides service estimates, and schedules Google Meet consultations automatically.
                          </p>
                          <div className="mt-2.5 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                            <span className="text-teal-600 font-bold">✓ Direct Calendar Sync</span>
                            <span>•</span>
                            <span>Budget Qualification</span>
                            <span>•</span>
                            <span>Human Hand-off</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Feature 6: Autonomous Ad Budget & Keyword Allocator */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 transition-all shadow-xs group">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-extrabold text-[#080d24]">
                              Autonomous Ad Spend &amp; Keyword Allocator
                            </h4>
                            <span className="text-[9.5px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 shrink-0">
                              ROAS Boost
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs text-slate-600 font-normal leading-relaxed">
                            Continuous algorithmic tracking of customer acquisition cost across Google &amp; Meta. Shifts budget in real-time away from non-performing keywords and into winning ad sets with zero human latency.
                          </p>
                          <div className="mt-2.5 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                            <span className="text-indigo-600 font-bold">✓ Waste Elimination</span>
                            <span>•</span>
                            <span>Cross-Platform Tracking</span>
                            <span>•</span>
                            <span>4.2X Target ROAS</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Institutional Quality Guarantee Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-[#080d24] to-[#121e4a] text-white border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      ★ BUILT FOR SERIOUS BUSINESSES (NOT GIMMICKS)
                    </div>
                    <p className="mt-1 text-xs sm:text-[13px] text-slate-200 leading-relaxed font-normal max-w-xl">
                      &quot;We don’t build generic robot chatbots that annoy your customers. Digital FX AI Suite is quiet, enterprise-grade infrastructure that solves real operational bottlenecks and maximizes your revenue.&quot;
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white whitespace-nowrap">
                      SOC-2 Compliant Security
                    </span>
                  </div>
                </div>

                {/* VIP Early Access Waitlist Module */}
                <div className="p-6 sm:p-7 rounded-2xl bg-white border-2 border-blue-500/30 shadow-lg shadow-blue-500/5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                    <div>
                      <div className="inline-block text-[10.5px] font-extrabold uppercase tracking-wider text-[#1570ef] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 mb-1">
                        LIMITED BETA COHORT
                      </div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-[#080d24]">
                        Join the VIP Early Access Beta Waitlist
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Current Digital FX clients receive 3 months complimentary access upon public release.
                      </p>
                    </div>
                    <div className="text-right sm:shrink-0">
                      <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        50 Beta Slots Available
                      </span>
                    </div>
                  </div>

                  {aiSuiteSubmitted ? (
                    <div className="mt-5 p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-2 animate-fadeIn">
                      <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xl font-bold">
                        ✓
                      </div>
                      <h4 className="text-base font-extrabold text-emerald-900">
                        You&apos;re On the Priority Beta Access List!
                      </h4>
                      <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                        Thank you, <strong>{aiSuiteName || "Valued Partner"}</strong>. Our strategy desk at Crossings Republik will contact your WhatsApp ({aiSuitePhone || "your registered number"}) with early credentials before public deployment.
                      </p>
                      <button
                        type="button"
                        onClick={() => setAiSuiteSubmitted(false)}
                        className="text-xs font-bold text-emerald-700 hover:underline pt-2 inline-block cursor-pointer"
                      >
                        ← Register another business
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setAiSuiteSubmitted(true);
                      }}
                      className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3.5"
                    >
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={aiSuiteName}
                          onChange={(e) => setAiSuiteName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#207de9] focus:bg-white transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Business / Clinic Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={aiSuiteBusiness}
                          onChange={(e) => setAiSuiteBusiness(e.target.value)}
                          placeholder="e.g. Apex Dental Clinic"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#207de9] focus:bg-white transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          WhatsApp Mobile *
                        </label>
                        <input
                          type="tel"
                          required
                          value={aiSuitePhone}
                          onChange={(e) => setAiSuitePhone(e.target.value)}
                          placeholder="10-digit mobile number"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#207de9] focus:bg-white transition tabular-nums"
                        />
                      </div>

                      <div className="sm:col-span-3 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                        <span className="text-[11px] text-slate-500 font-normal">
                          🔒 100% Confidential. Zero spam. Cancel early access anytime.
                        </span>
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#207de9] to-[#00b4d8] hover:from-[#1a6bc7] hover:to-[#0096c7] text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer whitespace-nowrap"
                        >
                          Request Priority Beta Access →
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Direct WhatsApp Action Link */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
                    <span>Have urgent enterprise automation requirements?</span>
                    <a
                      href="https://wa.me/919876543210?text=Hello%20Digital%20FX%20Team%2C%20I%20want%20to%20learn%20more%20about%20the%20upcoming%20AI%20Business%20Suite%20and%20early%20beta%20access."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1570ef] hover:underline font-bold inline-flex items-center gap-1.5"
                    >
                      <span>Chat with Strategy Desk on WhatsApp</span>
                      <span>→</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* Modal Footer: Dismiss & Direct Actions */}
              <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
                <div className="text-[11px] text-slate-500 font-medium">
                  Digital FX® Proprietary Business Suite • All Rights Reserved
                </div>
                <button
                  type="button"
                  onClick={() => setIsAiSuiteOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Close Window
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ==========================================================================
            13. FLOATING STRATEGIST ADVISORY DESK (INSTITUTIONAL AGENCY CONCIERGE)
            ========================================================================== */}
        <div className="fixed bottom-6 right-6 z-[95] flex items-end gap-3">
          {!chatOpen && (
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="group flex items-center gap-3 rounded-full border border-slate-200 bg-white/95 backdrop-blur-md pl-4 pr-5 py-2.5 shadow-[0_12px_36px_rgba(15,23,42,0.12)] hover:border-[#207de9] hover:shadow-[0_16px_40px_rgba(32,125,233,0.18)] transition-all cursor-pointer"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 tracking-tight leading-none group-hover:text-[#207de9] transition">
                  Strategist Desk
                </p>
                <p className="text-[10px] text-slate-500 font-medium leading-none mt-1">
                  Delhi NCR Advisory Team
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#080d24] text-white flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </button>
          )}

          {chatOpen && (
            <div className="fixed bottom-24 right-6 w-[360px] sm:w-[400px] h-[520px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-fadeIn">
              <div className="bg-[#080d24] p-4 text-white flex justify-between items-center border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center overflow-hidden p-1 shadow-inner shrink-0">
                    <img src="/logo.png" alt="Digital FX" className="h-full w-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold tracking-wide text-white">Senior Growth Advisory Desk</h4>
                    <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Crossings Republik Strategists Available
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[82%] p-3.5 rounded-2xl text-[13px] leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-[#207de9] text-white rounded-br-none shadow-xs font-medium"
                          : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-none shadow-xs font-normal"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 bg-white border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                  placeholder="Ask about SEO, GEO AI, PPC, or custom retainer..."
                  className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#207de9] focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={sendChatMessage}
                  className="px-4 py-2.5 bg-[#207de9] hover:bg-[#1866c2] text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>

      </main>
    </>
  );
}