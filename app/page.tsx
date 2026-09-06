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
    icon: "◆",
    status: true,
  },
  {
    id: 9,
    name: "Email / WhatsApp Marketing",
    description:
      "Automated campaigns that help nurture prospects, re-engage customers and drive repeat enquiries.",
    icon: "✉",
    status: true,
  },
];

const industries = [
  "Real Estate",
  "Healthcare",
  "Education",
  "E-Commerce",
  "Professional Services",
  "Local Businesses",
  "Finance",
  "Hospitality",
  "Technology",
];

const testimonials = [
  {
    quote:
      "Digital FX helped us improve our online presence and generate better quality enquiries.",
    name: "Business Owner",
    role: "Local Business",
  },
  {
    quote:
      "The website, SEO and marketing strategy gave our business a much more professional digital presence.",
    name: "Founder",
    role: "Professional Services",
  },
  {
    quote:
      "Their approach is clear, practical and focused on actual business growth rather than vanity metrics.",
    name: "Marketing Manager",
    role: "Growing Business",
  },
];

const pricingPlans = [
  {
    name: "Google Business Listing",
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
      "A complete digital foundation combining website, Google visibility and business listings.",
    features: [
      "Professional business website",
      "Google Business Listing",
      "Google Maps Listing",
      "10+ business directory listings",
      "Basic SEO setup",
      "WhatsApp integration",
      "Enquiry form",
      "Admin panel",
      "Facebook business setup",
    ],
    button: "Choose Growth Package",
    popular: true,
  },
];

const paymentPlans: PaymentPlan[] = [
  {
    id: "google_listing",
    name: "Google Business Listing",
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
  const [services, setServices] =
    useState<Service[]>(fallbackServices);

  const [loadingServices, setLoadingServices] =
    useState(true);

  const [formLoading, setFormLoading] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [paymentOpen, setPaymentOpen] =
    useState(false);

  const [selectedPaymentPlan, setSelectedPaymentPlan] =
    useState<PaymentPlan | null>(null);

  const [paymentName, setPaymentName] =
    useState("");

  const [paymentEmail, setPaymentEmail] =
    useState("");

  const [paymentPhone, setPaymentPhone] =
    useState("");

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  const [paymentError, setPaymentError] =
    useState("");

  const [geoUrl, setGeoUrl] =
    useState("");

  const [geoLoading, setGeoLoading] =
    useState(false);

  const [geoResult, setGeoResult] =
    useState<GeoResult | null>(null);

  const [geoError, setGeoError] =
    useState("");

  const [chatOpen, setChatOpen] =
    useState(false);

  const [chatMessage, setChatMessage] =
    useState("");

  const [chatMessages, setChatMessages] =
    useState<
      {
        sender: "ai" | "user";
        text: string;
      }[]
    >([
      {
        sender: "ai",
        text:
          "Hi! I’m Digital FX AI Assistant. How can I help you with your digital growth today?",
      },
    ]);

  const [showScrollControls, setShowScrollControls] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollControls(window.scrollY > 250);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function scrollToBottom() {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  }

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("id,name,description,icon,status")
        .eq("status", true)
        .order("id", {
          ascending: true,
        });

      if (!error && data?.length) {
        setServices(data);
      }
    } catch (error) {
      console.error(
        "Unable to load services:",
        error
      );
    } finally {
      setLoadingServices(false);
    }
  }

  async function checkGeoScore() {
    if (!geoUrl.trim()) {
      setGeoError(
        "Please enter your website URL."
      );
      return;
    }

    let url = geoUrl.trim();

    if (
      !url.startsWith("http://") &&
      !url.startsWith("https://")
    ) {
      url = `https://${url}`;
    }

    setGeoLoading(true);
    setGeoError("");
    setGeoResult(null);

    try {
      const response = await fetch(
        "/api/geo-check",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            url,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Unable to analyze website."
        );
      }

      const data =
        result?.data || result;

      setGeoResult(data);
    } catch (error) {
      console.error(error);

      setGeoError(
        error instanceof Error
          ? error.message
          : "Unable to analyze this website."
      );
    } finally {
      setGeoLoading(false);
    }
  }

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setFormLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(
        data.get("name") || ""
      ).trim(),

      phone: String(
        data.get("phone") || ""
      ).trim(),

      email: String(
        data.get("email") || ""
      ).trim(),

      service: String(
        data.get("service") || ""
      ).trim(),

      message: String(
        data.get("message") || ""
      ).trim(),
    };

    try {
      const response = await fetch(
        "/api/enquiry",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Unable to save enquiry."
        );
      }

      form.reset();

      setSuccessMessage(
        "Thank you! Your enquiry has been submitted successfully."
      );

      const whatsappNumber =
        "919876543210";

      const whatsappText =
        `New enquiry from ${payload.name}. ` +
        `Service: ${payload.service}. ` +
        `Phone: ${payload.phone}.`;

      window.open(
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          whatsappText
        )}`,
        "_blank"
      );
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setFormLoading(false);
    }
  }

  function sendChatMessage() {
    const message =
      chatMessage.trim();

    if (!message) return;

    setChatMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: message,
      },
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

  function openPaymentModal(
    planId: PaymentPlan["id"]
  ) {
    const plan = paymentPlans.find(
      (item) => item.id === planId
    );

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

  async function startPayUPayment(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!selectedPaymentPlan) {
      setPaymentError("Please select a package.");
      return;
    }

    const name = paymentName.trim();
    const email = paymentEmail.trim();
    const phone = paymentPhone.trim();

    if (!name || !email || !phone) {
      setPaymentError(
        "Please fill in your name, email and mobile number."
      );
      return;
    }

    setPaymentLoading(true);
    setPaymentError("");

    try {
      const response = await fetch(
        "/api/payu/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            planId: selectedPaymentPlan.id,
            firstname: name,
            email,
            phone,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.error ||
            "Unable to start PayU payment."
        );
      }

      const payment = result?.data;

      if (!payment?.action) {
        throw new Error(
          "Payment gateway URL was not returned."
        );
      }

      const form =
        document.createElement("form");

      form.method = "POST";
      form.action = payment.action;
      form.style.display = "none";

      const fields: Record<string, string> = {
        key: String(payment.key ?? ""),
        txnid: String(payment.txnid ?? ""),
        amount: String(payment.amount ?? selectedPaymentPlan.amount),
        productinfo: String(
          payment.productinfo ??
            selectedPaymentPlan.name
        ),
        firstname: String(
          payment.firstname ?? name
        ),
        email: String(
          payment.email ?? email
        ),
        phone: String(
          payment.phone ?? phone
        ),
        udf1: String(payment.udf1 ?? ""),
        udf2: String(payment.udf2 ?? ""),
        udf3: String(payment.udf3 ?? ""),
        udf4: String(payment.udf4 ?? ""),
        udf5: String(payment.udf5 ?? ""),
        hash: String(payment.hash ?? ""),
        surl: String(payment.surl ?? ""),
        furl: String(payment.furl ?? ""),
        curl: String(payment.curl ?? ""),
      };

      Object.entries(fields).forEach(
        ([name, value]) => {
          const input =
            document.createElement("input");

          input.type = "hidden";
          input.name = name;
          input.value = value;

          form.appendChild(input);
        }
      );

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error(
        "PAYU PAYMENT ERROR:",
        error
      );

      setPaymentError(
        error instanceof Error
          ? error.message
          : "Unable to start payment. Please try again."
      );

      setPaymentLoading(false);
    }
  }

  function choosePackage(
    packageName: string
  ) {
    const section =
      document.getElementById("contact");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }

    setTimeout(() => {
      const serviceSelect =
        document.querySelector(
          'select[name="service"]'
        ) as HTMLSelectElement | null;

      if (serviceSelect) {
        serviceSelect.value =
          packageName;
        serviceSelect.dispatchEvent(
          new Event("change", {
            bubbles: true,
          })
        );
      }
    }, 500);
  }

  return (
    <>
      <DigitalFXIntro />

      <main
        className={`${manrope.variable} min-h-screen overflow-x-hidden bg-white font-[var(--font-manrope)] text-[#101828] antialiased`}
      >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="fixed left-0 top-0 z-50 w-full border-b border-[#e4e7ec] bg-white/95 backdrop-blur-xl">

        {/* TOP BAR */}

        <div className="hidden bg-[#080d24] text-white lg:block">

          <div className="mx-auto flex h-[38px] max-w-[1320px] items-center justify-between px-5 lg:px-8">

            <div className="flex items-center gap-5 text-[11px] font-medium text-[#d0d5dd]">

              <a
                href="tel:+919876543210"
                className="whitespace-nowrap transition hover:text-white"
              >
                ☎ +91 98765 43210
              </a>

              <span className="h-3 w-px bg-white/15" />

              <a
                href="mailto:hello@digitalfx.in"
                className="whitespace-nowrap transition hover:text-white"
              >
                ✉ hello@digitalfx.in
              </a>

              <span className="h-3 w-px bg-white/15" />

              <span className="whitespace-nowrap">
                ⌖ Jaipur, Rajasthan, India
              </span>

            </div>

            <div className="flex items-center gap-5 text-[11px] font-semibold text-[#aab4ca]">

              <a
                href="#about"
                className="whitespace-nowrap transition hover:text-white"
              >
                About Us
              </a>

              <a
                href="#case-studies"
                className="whitespace-nowrap transition hover:text-white"
              >
                Case Studies
              </a>

              <a
                href="#contact"
                className="whitespace-nowrap transition hover:text-white"
              >
                Contact
              </a>

              <span className="h-3 w-px bg-white/15" />

              <a
                href="https://wa.me/919876543210?text=Hi%20Digital%20FX%2C%20I%20need%20help%20with%20digital%20marketing."
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#7d91ff] transition hover:text-white"
              >
                WhatsApp
              </a>

            </div>

          </div>

        </div>


        {/* MAIN NAVIGATION */}

        <div className="mx-auto flex h-[82px] max-w-[1320px] items-center px-5 lg:px-8">

          {/* BRAND */}

          <a
            href="#home"
            className="flex shrink-0 items-center gap-3"
          >

            <div className="flex h-[62px] w-[62px] shrink-0 items-center justify-center">

              <img
                src="/logo.png"
                alt="Digital FX"
                className="h-[76px] w-[76px] object-contain"
              />

            </div>

            <div className="whitespace-nowrap">

              <div className="text-[22px] font-black leading-none tracking-[-0.8px] text-[#101828]">
                DIGITAL{" "}
                <span className="text-[#315df5]">
                  FX
                </span>
              </div>

              <div className="mt-2 text-[9px] font-bold leading-none tracking-[2.2px] text-[#667085]">
                DIGITAL MARKETING THAT DELIVERS
              </div>

            </div>

          </a>


          {/* DESKTOP NAV */}

          <nav className="hidden">

            <div className="flex items-center gap-1">

              <a
                href="#home"
                className="flex h-[44px] items-center rounded-lg px-3 text-[13px] font-bold text-[#315df5] transition hover:bg-[#f5f7ff]"
              >
                Home
              </a>

              <a
                href="#services"
                className="flex h-[44px] items-center rounded-lg px-3 text-[13px] font-semibold text-[#344054] transition hover:bg-[#f5f7ff] hover:text-[#315df5]"
              >
                Services
              </a>

              <a
                href="#pricing"
                className="flex h-[44px] items-center gap-1.5 rounded-lg px-3 text-[13px] font-bold text-[#315df5] transition hover:bg-[#f5f7ff]"
              >
                <span>Pricing</span>

                <span className="rounded-full bg-[#eef3ff] px-2 py-[3px] text-[9px] font-black leading-none text-[#315df5]">
                  NEW
                </span>
              </a>

              <a
                href="#geo-checker"
                className="flex h-[44px] items-center gap-1.5 rounded-lg px-3 text-[13px] font-bold text-[#315df5] transition hover:bg-[#f5f7ff]"
              >
                <span>Free GEO Check</span>

                <span className="rounded-full bg-[#eef3ff] px-2 py-[3px] text-[9px] font-black leading-none text-[#315df5]">
                  FREE
                </span>
              </a>

              <a
                href="#industries"
                className="flex h-[44px] items-center rounded-lg px-3 text-[13px] font-semibold text-[#344054] transition hover:bg-[#f5f7ff] hover:text-[#315df5]"
              >
                Industries
              </a>

              <a
                href="#about"
                className="flex h-[44px] items-center rounded-lg px-3 text-[13px] font-semibold text-[#344054] transition hover:bg-[#f5f7ff] hover:text-[#315df5]"
              >
                About
              </a>

              <a
                href="#contact"
                className="flex h-[44px] items-center rounded-lg px-3 text-[13px] font-semibold text-[#344054] transition hover:bg-[#f5f7ff] hover:text-[#315df5]"
              >
                Contact
              </a>

            </div>

          </nav>


          {/* RIGHT ACTIONS */}

          <div className="hidden">

            <a
              href="tel:+919876543210"
              className="group flex items-center gap-3 border-r border-[#e4e7ec] pr-4"
            >

              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dce5ff] bg-[#f7f9ff] text-[15px] text-[#315df5] transition group-hover:bg-[#eef3ff]">
                ☎
              </span>

              <span className="flex flex-col justify-center">

                <span className="text-[9px] font-bold uppercase leading-[12px] tracking-[1.3px] text-[#98a2b3]">
                  Free Consultation
                </span>

                <span className="mt-[2px] whitespace-nowrap text-[13px] font-black leading-[16px] text-[#101828]">
                  +91 98765 43210
                </span>

              </span>

            </a>


            <a
              href="#pricing"
              className="group flex h-[50px] min-w-[132px] items-center justify-center gap-3 rounded-[8px] bg-[#315df5] px-5 text-[13px] font-black text-white shadow-[0_8px_24px_rgba(49,93,245,.18)] transition duration-200 hover:-translate-y-[1px] hover:bg-[#2449d6] hover:shadow-[0_12px_28px_rgba(49,93,245,.25)]"
            >

              <span>
                View Pricing
              </span>

              <span className="text-[15px] transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>

            </a>

          </div>


          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-lg border border-[#d0d5dd] bg-white shadow-sm transition hover:border-[#315df5] hover:bg-[#f7f9ff]"
          >

            <span className="flex flex-col gap-[5px]">

              <span className="h-[2px] w-5 bg-[#344054]" />
              <span className="h-[2px] w-5 bg-[#344054]" />
              <span className="h-[2px] w-5 bg-[#344054]" />

            </span>

          </button>

        </div>


        {/* =====================================================
            AUTOMATIC SERVICE TICKER
        ===================================================== */}

        <div className="overflow-hidden border-t border-[#eef1f5] bg-[#f8faff]">

          <div className="relative flex h-[42px] w-full items-center overflow-hidden">

            <div className="flex min-w-max ticker-track items-center">

              {[
                "SEO",
                "Local SEO",
                "Google Ads",
                "Meta Ads",
                "Web Development",
                "E-Commerce",
                "Social Media Marketing",
                "Lead Generation",
                "Content Marketing",
                "Branding",
                "WhatsApp Marketing",
                "Analytics & Reporting",
                "GEO Optimization",
                "Conversion Strategy",
                "Performance Marketing",
                "Digital Growth",
                "Google Business Profile",
                "Website Design",
                "Online Visibility",
                "Growth Strategy",
              ].map((item, index) => (

                <div
                  key={`${item}-${index}`}
                  className="flex items-center"
                >

                  <span className="whitespace-nowrap px-5 text-[10px] font-bold uppercase tracking-[1.1px] text-[#53617e]">
                    {item}
                  </span>

                  <span className="h-1 w-1 shrink-0 rounded-full bg-[#315df5]" />

                </div>

              ))}

              {[
                "SEO",
                "Local SEO",
                "Google Ads",
                "Meta Ads",
                "Web Development",
                "E-Commerce",
                "Social Media Marketing",
                "Lead Generation",
                "Content Marketing",
                "Branding",
                "WhatsApp Marketing",
                "Analytics & Reporting",
                "GEO Optimization",
                "Conversion Strategy",
                "Performance Marketing",
                "Digital Growth",
                "Google Business Profile",
                "Website Design",
                "Online Visibility",
                "Growth Strategy",
              ].map((item, index) => (

                <div
                  key={`repeat-${item}-${index}`}
                  className="flex items-center"
                  aria-hidden="true"
                >

                  <span className="whitespace-nowrap px-5 text-[10px] font-bold uppercase tracking-[1.1px] text-[#53617e]">
                    {item}
                  </span>

                  <span className="h-1 w-1 shrink-0 rounded-full bg-[#315df5]" />

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* GLOBAL SERVICE TICKER ANIMATION */}
        <style jsx global>{`
          .ticker-track {
            display: flex;
            width: max-content;
            min-width: max-content;
            align-items: center;
            animation: digitalFxServiceTicker 32s linear infinite;
            will-change: transform;
            transform: translate3d(0, 0, 0);
          }

          .ticker-track:hover {
            animation-play-state: paused;
          }

          @keyframes digitalFxServiceTicker {
            from {
              transform: translate3d(0, 0, 0);
            }
            to {
              transform: translate3d(-50%, 0, 0);
            }
          }

          @media (max-width: 1024px) {
            .ticker-track {
              animation-duration: 26s;
            }
          }

          @media (max-width: 640px) {
            .ticker-track {
              animation-duration: 20s;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .ticker-track {
              animation: none;
            }
          }
        `}</style>

      </header>





      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {mobileOpen && (
        <>

          <button
            type="button"
            onClick={closeMobileMenu}
            className="fixed inset-0 z-[60] bg-[#101828]/35 backdrop-blur-[2px]"
          />

          <aside className="fixed right-0 top-0 z-[70] h-full w-[86%] max-w-[470px] border-l border-[#e4e7ec] bg-white shadow-[-20px_0_70px_rgba(16,24,40,.15)]">

            <div className="flex h-[82px] items-center justify-between border-b border-[#eaecf0] px-5">

              <div className="flex items-center gap-3">

                <img
                  src="/logo.png"
                  alt="Digital FX"
                  className="h-[54px] w-[60px] object-contain"
                />

                <div>

                  <p className="text-xl font-black">
                    DIGITAL{" "}
                    <span className="text-[#315df5]">
                      FX
                    </span>
                  </p>

                  <p className="text-[9px] font-bold tracking-[1.8px] text-[#98a2b3]">
                    DIGITAL MARKETING
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={closeMobileMenu}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e4e7ec] text-xl"
              >
                ×
              </button>

            </div>


            <div className="flex h-[calc(100%-82px)] flex-col overflow-y-auto px-5 py-7">

              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  setChatOpen(true);
                }}
                className="mb-7 rounded-[14px] border border-[#dce5ff] bg-[#f7f9ff] p-4 text-left"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#080d24] text-white">
                    ✦
                  </div>

                  <div>
                    <p className="text-xs font-black">
                      Digital FX AI Assistant
                    </p>
                    <p className="mt-1 text-[10px] text-[#667085]">
                      Ask about SEO, websites & growth
                    </p>
                  </div>

                  <span className="ml-auto text-[10px] font-black text-[#027a48]">
                    ONLINE
                  </span>

                </div>

              </button>


              <nav className="space-y-1">

                {[
                  ["Home", "#home"],
                  ["Services", "#services"],
                  ["Pricing", "#pricing"],
                  ["Free GEO Score", "#geo-checker"],
                  ["Industries", "#industries"],
                  ["About Digital FX", "#about"],
                  ["Case Studies", "#case-studies"],
                  ["Our Process", "#process"],
                  ["Contact", "#contact"],
                ].map(
                  ([name, href]) => (

                    <a
                      key={name}
                      href={href}
                      onClick={closeMobileMenu}
                      className="flex items-center justify-between border-b border-[#f0f2f5] px-3 py-4 text-sm font-bold text-[#344054] hover:text-[#315df5]"
                    >
                      {name}
                      <span>→</span>
                    </a>

                  )
                )}

              </nav>


              <div className="mt-auto pt-8">

                <a
                  href="#pricing"
                  onClick={closeMobileMenu}
                  className="block rounded-[6px] bg-[#315df5] px-5 py-4 text-center text-sm font-black text-white"
                >
                  View Pricing →
                </a>

              </div>

            </div>

          </aside>

        </>
      )}


      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        id="home"
        className="relative overflow-hidden border-b border-[#e1e7f2] bg-[#f3f6fb] pt-[82px] lg:pt-[162px]"
      >

        <div className="pointer-events-none absolute left-[-120px] top-[120px] h-[420px] w-[420px] rounded-full bg-white/80 blur-[90px]" />
        <div className="pointer-events-none absolute right-[-90px] top-[180px] h-[520px] w-[520px] rounded-full bg-[#dce7ff]/70 blur-[110px]" />

        <div className="relative mx-auto grid min-h-[680px] max-w-[1440px] items-center gap-16 px-6 py-24 lg:grid-cols-[1.02fr_.98fr] lg:px-10">

          <div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d9e2ff] bg-white px-4 py-2">

              <span className="h-2 w-2 rounded-full bg-[#315df5]" />

              <span className="text-[11px] font-black uppercase tracking-[1.8px] text-[#315df5]">
                Results-Driven Digital Marketing Agency
              </span>

            </div>


            <h1 className="max-w-[760px] text-[56px] font-black leading-[1.02] tracking-[-3px] sm:text-[68px] lg:text-[82px] xl:text-[88px]">

              We Make

              <span className="block">
                Businesses
              </span>

              <span className="bg-gradient-to-r from-[#315df5] to-[#6947f5] bg-clip-text text-transparent">
                More Visible.
              </span>

            </h1>


            <p className="mt-8 max-w-[700px] text-[19px] leading-8 text-[#5f6b7a]">
              Digital FX combines SEO, web development,
              paid advertising, local search, social media
              and content marketing to help businesses
              attract more customers and grow online.
            </p>


            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <a
                href="#pricing"
                className="rounded-[5px] bg-[#315df5] px-7 py-4 text-center text-sm font-bold text-white shadow-[0_12px_30px_rgba(49,93,245,.20)] hover:bg-[#2449d6]"
              >
                View Packages →
              </a>

              <a
                href="#geo-checker"
                className="rounded-[5px] border border-[#d0d5dd] bg-white px-7 py-4 text-center text-sm font-bold text-[#344054] hover:border-[#315df5] hover:text-[#315df5]"
              >
                Check Your GEO Score
              </a>

            </div>


            <div className="mt-11 flex flex-wrap gap-8 border-t border-[#dfe3ea] pt-7">

              <div>
                <p className="text-[32px] font-black">
                  100+
                </p>
                <p className="mt-1 text-[13px] text-[#667085]">
                  Projects Delivered
                </p>
              </div>

              <div className="h-10 w-px bg-[#dfe3ea]" />

              <div>
                <p className="text-[32px] font-black">
                  25+
                </p>
                <p className="mt-1 text-[13px] text-[#667085]">
                  Industries
                </p>
              </div>

              <div className="h-10 w-px bg-[#dfe3ea]" />

              <div>
                <p className="text-[32px] font-black">
                  4.9/5
                </p>
                <p className="mt-1 text-[13px] text-[#667085]">
                  Client Rating
                </p>
              </div>

            </div>

          </div>


          <div className="relative">

            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#dce5ff] blur-3xl" />

            <div className="relative rounded-[22px] border border-[#dbe3f0] bg-white/95 p-4 shadow-[0_30px_80px_rgba(16,24,40,.12)] backdrop-blur-sm">

              <div className="overflow-hidden rounded-[14px] bg-[#101828]">

                <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#98a2b3]">
                      DIGITAL FX
                    </p>

                    <p className="mt-1 text-lg font-extrabold text-white">
                      Growth Dashboard
                    </p>
                  </div>

                  <span className="rounded-full bg-[#ecfdf3] px-3 py-1 text-[10px] font-bold text-[#027a48]">
                    ACTIVE
                  </span>

                </div>


                <div className="grid grid-cols-2 sm:grid-cols-4">

                  {[
                    ["VISIBILITY", "+84%"],
                    ["LEADS", "+62%"],
                    ["TRAFFIC", "+71%"],
                    ["ROI", "+91%"],
                  ].map(
                    ([label, value]) => (

                      <div
                        key={label}
                        className="border-b border-r border-white/10 p-5"
                      >

                        <p className="text-[10px] font-bold tracking-[1px] text-[#667085]">
                          {label}
                        </p>

                        <p className="mt-2 text-xl font-black text-white">
                          {value}
                        </p>

                      </div>

                    )
                  )}

                </div>


                <div className="p-6">

                  <div className="mb-5 flex items-center justify-between">

                    <span className="text-xs font-bold text-white">
                      Digital Performance
                    </span>

                    <span className="text-[10px] text-[#667085]">
                      LAST 30 DAYS
                    </span>

                  </div>


                  <div className="flex h-[220px] items-end gap-2">

                    {[
                      30,
                      38,
                      35,
                      45,
                      42,
                      55,
                      51,
                      65,
                      61,
                      73,
                      70,
                      88,
                    ].map(
                      (height, index) => (

                        <div
                          key={index}
                          className="flex h-full flex-1 items-end"
                        >

                          <div
                            style={{
                              height: `${height}%`,
                            }}
                            className="w-full rounded-t-[3px] bg-gradient-to-t from-[#315df5] to-[#708cff]"
                          />

                        </div>

                      )
                    )}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          TRUSTED BY — AUTO SCROLLING COMPANY LOGOS
      ===================================================== */}

      <section
        id="trusted-businesses"
        className="border-b border-[#e4e7ec] bg-white"
      >
        <div className="mx-auto max-w-[1440px] px-5 py-8 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">

            <div className="w-full shrink-0 lg:w-[285px]">
              <p className="text-[12px] font-black uppercase tracking-[2.5px] text-[#233b68]">
                POWERING YOUR DIGITAL PRESENCE
              </p>
              <p className="mt-2 text-[13px] text-[#98a2b3]">
                Web • Search • Social • Commerce
              </p>
            </div>

            <div className="relative min-w-0 flex-1 overflow-hidden">

              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-20 w-14 bg-gradient-to-r from-white to-transparent"
                aria-hidden="true"
              />

              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-20 w-14 bg-gradient-to-l from-white to-transparent"
                aria-hidden="true"
              />

              <div className="trusted-logo-marquee">
                <div className="trusted-logo-track">

                  {/* SET 1 */}
                  {[
                    ["Google", "G", "google"],
                    ["Meta", "∞", "meta"],
                    ["Amazon", "a", "amazon"],
                    ["Microsoft", "▦", "microsoft"],
                    ["Shopify", "S", "shopify"],
                    ["WordPress", "W", "wordpress"],
                    ["WhatsApp", "◔", "whatsapp"],
                    ["LinkedIn", "in", "linkedin"],
                  ].map(([name, mark, type]) => (
                    <div
                      key={`brand-a-${name}`}
                      className="trusted-logo-card"
                      title={name}
                    >
                      <span className={`trusted-brand-mark ${type}`}>
                        {mark}
                      </span>
                      <span className="trusted-logo-name">{name}</span>
                    </div>
                  ))}

                  {/* SET 2 — exact duplicate for seamless scrolling */}
                  {[
                    ["Google", "G", "google"],
                    ["Meta", "∞", "meta"],
                    ["Amazon", "a", "amazon"],
                    ["Microsoft", "▦", "microsoft"],
                    ["Shopify", "S", "shopify"],
                    ["WordPress", "W", "wordpress"],
                    ["WhatsApp", "◔", "whatsapp"],
                    ["LinkedIn", "in", "linkedin"],
                  ].map(([name, mark, type]) => (
                    <div
                      key={`brand-b-${name}`}
                      className="trusted-logo-card"
                      title={name}
                      aria-hidden="true"
                    >
                      <span className={`trusted-brand-mark ${type}`}>
                        {mark}
                      </span>
                      <span className="trusted-logo-name">{name}</span>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .trusted-logo-marquee {
            width: 100%;
            overflow: hidden;
            padding: 3px 0 8px;
          }

          .trusted-logo-track {
            display: flex;
            width: max-content;
            align-items: center;
            gap: 14px;
            animation: digitalFxLogoScroll 27s linear infinite;
            will-change: transform;
          }

          .trusted-logo-marquee:hover .trusted-logo-track {
            animation-play-state: paused;
          }

          .trusted-logo-card {
            display: flex;
            height: 68px;
            width: 154px;
            flex: 0 0 154px;
            align-items: center;
            justify-content: center;
            gap: 10px;
            border: 1px solid #e5eaf2;
            border-radius: 12px;
            background: #ffffff;
            padding: 10px 15px;
            box-shadow: 0 4px 18px rgba(16, 24, 40, 0.045);
            transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
          }

          .trusted-logo-card:hover {
            transform: translateY(-3px);
            border-color: #cfdaf0;
            box-shadow: 0 10px 28px rgba(16, 24, 40, 0.10);
          }

          .trusted-brand-mark {
            display: inline-flex;
            width: 34px;
            height: 34px;
            flex: 0 0 34px;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            line-height: 1;
          }

          .trusted-brand-mark.google {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 28px;
            color: #4285f4;
          }

          .trusted-brand-mark.meta {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 35px;
            font-weight: 700;
            color: #1877f2;
            transform: scaleX(1.12);
          }

          .trusted-brand-mark.amazon {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 31px;
            font-weight: 900;
            color: #111827;
            text-transform: lowercase;
          }

          .trusted-brand-mark.microsoft {
            font-size: 29px;
            color: #737373;
          }

          .trusted-brand-mark.shopify {
            width: 34px;
            height: 34px;
            border-radius: 8px;
            background: #95bf47;
            color: white;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 24px;
            font-weight: 900;
          }

          .trusted-brand-mark.wordpress {
            width: 34px;
            height: 34px;
            border: 3px solid #21759b;
            border-radius: 50%;
            color: #21759b;
            font-family: Georgia, serif;
            font-size: 23px;
          }

          .trusted-brand-mark.whatsapp {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background: #25d366;
            color: white;
            font-size: 25px;
          }

          .trusted-brand-mark.linkedin {
            width: 34px;
            height: 34px;
            border-radius: 5px;
            background: #0a66c2;
            color: white;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 17px;
          }

          .trusted-logo-name {
            white-space: nowrap;
            color: #17233d;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: -.15px;
          }

          @keyframes digitalFxLogoScroll {
            from {
              transform: translateX(0);
            }

            to {
              transform: translateX(calc(-50% - 7px));
            }
          }

          @media (max-width: 1024px) {
            .trusted-logo-track {
              animation-duration: 24s;
            }

            .trusted-logo-card {
              width: 145px;
              flex-basis: 145px;
            }
          }

          @media (max-width: 640px) {
            .trusted-logo-track {
              gap: 10px;
              animation-duration: 21s;
            }

            .trusted-logo-card {
              width: 132px;
              height: 60px;
              flex-basis: 132px;
              border-radius: 10px;
              padding: 8px 10px;
            }

            .trusted-brand-mark {
              width: 29px;
              height: 29px;
              flex-basis: 29px;
              font-size: 20px;
            }

            .trusted-brand-mark.meta {
              font-size: 30px;
            }

            .trusted-logo-name {
              font-size: 10px;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .trusted-logo-track {
              animation: none;
            }
          }
        `}</style>
      </section>


      {/* =====================================================
          DIGITAL GROWTH DASHBOARD
      ===================================================== */}

      <section
        id="growth-dashboard"
        className="relative overflow-hidden border-b border-[#e4e7ec] bg-[#f6f9fd] py-20 sm:py-24"
      >
        <div className="pointer-events-none absolute left-[-180px] top-[-180px] h-[420px] w-[420px] rounded-full bg-[#315df5]/[0.07] blur-[100px]" />
        <div className="pointer-events-none absolute bottom-[-180px] right-[-180px] h-[420px] w-[420px] rounded-full bg-[#20b879]/[0.06] blur-[100px]" />

        <div className="relative mx-auto max-w-[1320px] px-5 lg:px-8">

          <div className="mx-auto max-w-[820px] text-center">
            <p className="text-[11px] font-black uppercase tracking-[2.6px] text-[#315df5]">
              DIGITAL GROWTH DASHBOARD
            </p>

            <h2 className="mt-4 text-[38px] font-black leading-[1.08] tracking-[-1.6px] text-[#071534] sm:text-[50px]">
              One Digital System.
              <span className="block text-[#315df5]">
                Built To Grow Your Business.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-[680px] text-[15px] leading-7 text-[#667085]">
              We connect visibility, customer acquisition, conversion and
              business insights into one practical digital growth system.
            </p>
          </div>

          <div className="mt-12 grid items-center gap-8 lg:grid-cols-[.82fr_1.18fr]">

            {/* LEFT — GROWTH AREAS */}
            <div className="space-y-4">

              {[
                {
                  number: "01",
                  title: "Visibility",
                  text: "Get discovered across Google, search, maps and the channels your customers use.",
                  icon: "◎",
                  tone: "blue",
                },
                {
                  number: "02",
                  title: "Acquisition",
                  text: "Turn digital reach into qualified enquiries through SEO, content and paid campaigns.",
                  icon: "↗",
                  tone: "purple",
                },
                {
                  number: "03",
                  title: "Conversion",
                  text: "Use better websites, landing pages and customer journeys to turn visitors into leads.",
                  icon: "◇",
                  tone: "green",
                },
                {
                  number: "04",
                  title: "Insights",
                  text: "Measure what is working and continuously improve your digital performance.",
                  icon: "✦",
                  tone: "orange",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="growth-info-card group"
                >
                  <div className={`growth-dashboard-icon ${item.tone}`}>
                    {item.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-[17px] font-black text-[#071534]">
                        {item.title}
                      </h3>

                      <span className="text-[10px] font-black tracking-[1.5px] text-[#a0aabd]">
                        {item.number}
                      </span>
                    </div>

                    <p className="mt-2 text-[12px] leading-5 text-[#667085]">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}

            </div>


            {/* RIGHT — ORIGINAL DIGITAL FX DASHBOARD VISUAL */}
            <div className="growth-visual">

              <div className="growth-visual-grid" />

              <div className="growth-orbit orbit-one" />
              <div className="growth-orbit orbit-two" />

              {/* CONNECTOR LINES */}
              <div className="growth-connector connector-a" />
              <div className="growth-connector connector-b" />
              <div className="growth-connector connector-c" />
              <div className="growth-connector connector-d" />

              {/* TOP METRIC CARDS */}
              <div className="growth-mini-card mini-top-left">
                <span>SEARCH</span>
                <strong>SEO</strong>
              </div>

              <div className="growth-mini-card mini-top-right">
                <span>LOCAL</span>
                <strong>MAPS</strong>
              </div>

              {/* OUTER GROWTH NODES */}
              <div className="growth-node growth-node-acquisition">
                <span className="growth-node-symbol blue">
                  ↗
                </span>
                <span>Acquisition</span>
              </div>

              <div className="growth-node growth-node-visibility">
                <span className="growth-node-symbol teal">
                  ◎
                </span>
                <span>Visibility</span>
              </div>

              <div className="growth-node growth-node-conversion">
                <span className="growth-node-symbol green">
                  ◇
                </span>
                <span>Conversion</span>
              </div>

              <div className="growth-node growth-node-insights">
                <span className="growth-node-symbol purple">
                  ✦
                </span>
                <span>Insights</span>
              </div>

              {/* CENTER ENGINE */}
              <div className="growth-engine">
                <div className="growth-engine-ring ring-outer" />
                <div className="growth-engine-ring ring-inner" />

                <div className="growth-engine-core">
                  <div className="growth-engine-badge">
                    DFX
                  </div>

                  <p className="growth-engine-label">
                    DIGITAL GROWTH
                  </p>

                  <h3>
                    Growth Engine
                  </h3>

                  <div className="growth-engine-metric">
                    <strong>360°</strong>
                    <span>Strategy</span>
                  </div>
                </div>
              </div>

              {/* BOTTOM METRICS */}
              <div className="growth-mini-card mini-bottom-left">
                <span>SOCIAL</span>
                <strong>REACH</strong>
              </div>

              <div className="growth-mini-card mini-bottom-right">
                <span>LEADS</span>
                <strong>GROW</strong>
              </div>

              <div className="growth-live-status">
                <span className="growth-live-dot" />
                <span>Connected growth channels</span>
              </div>

            </div>
          </div>


          {/* BOTTOM CHANNEL STRIP */}
          <div className="mt-8 grid overflow-hidden rounded-[16px] border border-[#e1e7ef] bg-white sm:grid-cols-4">

            {[
              ["01", "Search", "SEO & organic visibility"],
              ["02", "Local", "Google & Maps presence"],
              ["03", "Social", "Reach & engagement"],
              ["04", "Conversion", "Leads & enquiries"],
            ].map(([number, title, text], index) => (
              <div
                key={title}
                className={`flex items-center gap-4 px-5 py-5 ${
                  index < 3
                    ? "border-b border-[#e8edf3] sm:border-b-0 sm:border-r"
                    : ""
                }`}
              >
                <span className="text-[10px] font-black tracking-[1px] text-[#315df5]">
                  {number}
                </span>

                <div>
                  <p className="text-[12px] font-black text-[#17233d]">
                    {title}
                  </p>
                  <p className="mt-1 text-[10px] text-[#98a2b3]">
                    {text}
                  </p>
                </div>
              </div>
            ))}

          </div>

        </div>

        <style jsx>{`
          .digitalfx-marquee-track {
            animation: digitalTicker 32s linear infinite;
            will-change: transform;
          }

          @keyframes digitalTicker {
            from {
              transform: translate3d(0, 0, 0);
            }
            to {
              transform: translate3d(-50%, 0, 0);
            }
          }

          .ticker-track {
            animation: digitalTicker 32s linear infinite;
            will-change: transform;
          }

          .ticker-track:hover {
            animation-play-state: paused;
          }

          .growth-info-card {
            position: relative;
            display: flex;
            gap: 18px;
            padding: 22px 24px;
            border: 1px solid #e4eaf3;
            border-radius: 15px;
            background: rgba(255,255,255,.94);
            box-shadow: 0 8px 30px rgba(20,40,80,.045);
            transition:
              transform .25s ease,
              border-color .25s ease,
              box-shadow .25s ease;
          }

          .growth-info-card:hover {
            transform: translateX(4px);
            border-color: #ccd8ed;
            box-shadow: 0 14px 35px rgba(20,40,80,.09);
          }

          .growth-dashboard-icon {
            display: flex;
            width: 44px;
            height: 44px;
            flex: 0 0 44px;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            font-size: 18px;
            font-weight: 900;
          }

          .growth-dashboard-icon.blue {
            background: #edf3ff;
            color: #315df5;
          }

          .growth-dashboard-icon.purple {
            background: #f1edff;
            color: #7654e8;
          }

          .growth-dashboard-icon.green {
            background: #eafaf2;
            color: #20a96f;
          }

          .growth-dashboard-icon.orange {
            background: #fff3e8;
            color: #d87524;
          }

          .growth-visual {
            position: relative;
            min-height: 535px;
            overflow: hidden;
            border: 1px solid #dce5f2;
            border-radius: 28px;
            background:
              radial-gradient(circle at 50% 50%, rgba(49,93,245,.075), transparent 40%),
              linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
            box-shadow: 0 24px 70px rgba(16,24,40,.09);
          }

          .growth-visual-grid {
            position: absolute;
            inset: 0;
            opacity: .55;
            background-image:
              linear-gradient(#dce7f5 1px, transparent 1px),
              linear-gradient(90deg, #dce7f5 1px, transparent 1px);
            background-size: 40px 40px;
            mask-image: radial-gradient(circle at center, black, transparent 74%);
            -webkit-mask-image: radial-gradient(circle at center, black, transparent 74%);
          }

          .growth-orbit {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border: 1px solid #d4e1f7;
            border-radius: 50%;
            pointer-events: none;
          }

          .orbit-one {
            width: 345px;
            height: 345px;
          }

          .orbit-two {
            width: 275px;
            height: 275px;
            border-color: #e3eaf5;
          }

          .growth-connector {
            position: absolute;
            height: 1px;
            background: linear-gradient(90deg, transparent, #b9ccef 45%, transparent);
            transform-origin: center;
            opacity: .9;
          }

          .connector-a {
            width: 25%;
            left: 21%;
            top: 31%;
            transform: rotate(22deg);
          }

          .connector-b {
            width: 25%;
            right: 21%;
            top: 31%;
            transform: rotate(-22deg);
          }

          .connector-c {
            width: 25%;
            left: 21%;
            bottom: 31%;
            transform: rotate(-22deg);
          }

          .connector-d {
            width: 25%;
            right: 21%;
            bottom: 31%;
            transform: rotate(22deg);
          }

          .growth-node {
            position: absolute;
            z-index: 8;
            display: flex;
            align-items: center;
            gap: 9px;
            padding: 11px 15px;
            border: 1px solid #dce5f2;
            border-radius: 12px;
            background: rgba(255,255,255,.96);
            box-shadow: 0 10px 28px rgba(25,45,80,.09);
            color: #17233d;
            font-size: 11px;
            font-weight: 900;
            white-space: nowrap;
          }

          .growth-node-acquisition {
            left: 6%;
            top: 20%;
          }

          .growth-node-visibility {
            right: 6%;
            top: 20%;
          }

          .growth-node-conversion {
            right: 6%;
            bottom: 19%;
          }

          .growth-node-insights {
            left: 6%;
            bottom: 19%;
          }

          .growth-node-symbol {
            display: flex;
            width: 29px;
            height: 29px;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 900;
          }

          .growth-node-symbol.blue {
            background: #edf3ff;
            color: #315df5;
          }

          .growth-node-symbol.teal {
            background: #e8f9f7;
            color: #27aaa5;
          }

          .growth-node-symbol.green {
            background: #e9faf1;
            color: #20b879;
          }

          .growth-node-symbol.purple {
            background: #f0eaff;
            color: #9b43b7;
          }

          .growth-engine {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 250px;
            height: 250px;
            transform: translate(-50%, -50%);
          }

          .growth-engine-ring {
            position: absolute;
            inset: 0;
            border: 1px solid #cbdcff;
            border-radius: 50%;
          }

          .growth-engine-ring.ring-inner {
            inset: 18px;
            border-color: #e0e8f5;
          }

          .growth-engine-core {
            position: absolute;
            inset: 45px;
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 1px solid #edf1f7;
            border-radius: 50%;
            background: rgba(255,255,255,.98);
            box-shadow: 0 14px 40px rgba(35,59,104,.10);
            text-align: center;
          }

          .growth-engine-badge {
            display: flex;
            width: 38px;
            height: 28px;
            align-items: center;
            justify-content: center;
            margin-bottom: 8px;
            border-radius: 7px;
            background: #071534;
            color: #ffffff;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: .5px;
          }

          .growth-engine-label {
            margin: 0;
            color: #315df5;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: 1.8px;
          }

          .growth-engine-core h3 {
            margin: 5px 0 9px;
            color: #071534;
            font-size: 19px;
            font-weight: 900;
            letter-spacing: -.4px;
          }

          .growth-engine-metric {
            display: flex;
            align-items: baseline;
            gap: 5px;
          }

          .growth-engine-metric strong {
            color: #315df5;
            font-size: 17px;
            font-weight: 900;
          }

          .growth-engine-metric span {
            color: #8b98aa;
            font-size: 9px;
          }

          .growth-mini-card {
            position: absolute;
            z-index: 9;
            display: flex;
            min-width: 88px;
            flex-direction: column;
            gap: 2px;
            padding: 9px 11px;
            border: 1px solid #e1e7f0;
            border-radius: 9px;
            background: rgba(255,255,255,.96);
            box-shadow: 0 8px 22px rgba(20,40,80,.06);
          }

          .growth-mini-card span {
            color: #99a5b8;
            font-size: 7px;
            font-weight: 900;
            letter-spacing: 1px;
          }

          .growth-mini-card strong {
            color: #315df5;
            font-size: 12px;
            font-weight: 900;
          }

          .mini-top-left {
            left: 31%;
            top: 8%;
          }

          .mini-top-right {
            right: 31%;
            top: 8%;
          }

          .mini-bottom-left {
            left: 31%;
            bottom: 10%;
          }

          .mini-bottom-right {
            right: 31%;
            bottom: 10%;
          }

          .growth-live-status {
            position: absolute;
            bottom: 7px;
            left: 50%;
            z-index: 15;
            display: flex;
            align-items: center;
            gap: 7px;
            transform: translateX(-50%);
            padding: 7px 12px;
            border: 1px solid #e2e8f1;
            border-radius: 999px;
            background: rgba(255,255,255,.92);
            color: #667085;
            font-size: 8px;
            font-weight: 800;
            white-space: nowrap;
            box-shadow: 0 7px 18px rgba(20,40,80,.06);
          }

          .growth-live-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #20b879;
            box-shadow: 0 0 0 4px rgba(32,184,121,.10);
          }

          @media (max-width: 900px) {
            

            .growth-visual {
              min-height: 490px;
            }

            .growth-node {
              transform: scale(.9);
            }
          }

          @media (max-width: 640px) {
            

            

            

            

            .growth-visual {
              min-height: 405px;
              border-radius: 20px;
            }

            .orbit-one {
              width: 275px;
              height: 275px;
            }

            .orbit-two {
              width: 220px;
              height: 220px;
            }

            .growth-engine {
              width: 195px;
              height: 195px;
            }

            .growth-engine-core {
              inset: 34px;
            }

            .growth-engine-core h3 {
              font-size: 15px;
            }

            .growth-node {
              padding: 7px 9px;
              gap: 5px;
              font-size: 8px;
              transform: scale(.78);
            }

            .growth-node-acquisition {
              left: -1%;
              top: 18%;
            }

            .growth-node-visibility {
              right: -1%;
              top: 18%;
            }

            .growth-node-conversion {
              right: -1%;
              bottom: 18%;
            }

            .growth-node-insights {
              left: -1%;
              bottom: 18%;
            }

            .growth-mini-card {
              display: none;
            }

            .growth-live-status {
              bottom: 7px;
              font-size: 8px;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .growth-visual * {
              scroll-behavior: auto;
            }

          }
        `}</style>
      </section>


      {/* =====================================================
          PRICING — NEW
      ===================================================== */}

      <section
        id="pricing"
        className="relative overflow-hidden bg-[#f7f9fc] py-24"
      >

        <div className="pointer-events-none absolute left-[-180px] top-[-180px] h-[420px] w-[420px] rounded-full bg-[#315df5]/10 blur-[100px]" />

        <div className="pointer-events-none absolute bottom-[-180px] right-[-180px] h-[420px] w-[420px] rounded-full bg-[#7048f6]/10 blur-[100px]" />


        <div className="relative mx-auto max-w-[1320px] px-5 lg:px-8">

          <div className="mx-auto max-w-[760px] text-center">

            <p className="text-[11px] font-black uppercase tracking-[2.2px] text-[#315df5]">
              Simple & Transparent Pricing
            </p>

            <h2 className="mt-4 text-[44px] font-black tracking-[-2px] md:text-[58px]">
              Choose What Your
              <span className="block">
                Business Needs.
              </span>
            </h2>

            <p className="mt-5 text-[15px] leading-7 text-[#667085]">
              Professional digital solutions without complicated
              pricing. Start small or choose the complete
              business growth package.
            </p>

          </div>


          <div className="mt-14 grid items-stretch gap-5 lg:grid-cols-3">

            {pricingPlans.map(
              (plan) => (

                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-[20px] border bg-white p-7 shadow-[0_8px_35px_rgba(16,24,40,.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(16,24,40,.10)] ${
                    plan.popular
                      ? "border-[#315df5] ring-1 ring-[#315df5]"
                      : "border-[#e4e7ec]"
                  }`}
                >

                  {plan.popular && (
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">

                      <span className="rounded-full bg-[#315df5] px-4 py-2 text-[10px] font-black uppercase tracking-[1.2px] text-white shadow-[0_8px_20px_rgba(49,93,245,.25)]">
                        Most Popular
                      </span>

                    </div>
                  )}


                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <p className="text-[11px] font-black uppercase tracking-[1.5px] text-[#315df5]">
                        Digital FX
                      </p>

                      <h3 className="mt-3 text-[23px] font-black leading-tight">
                        {plan.name}
                      </h3>

                    </div>


                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef3ff] text-[#315df5]">
                      {plan.popular
                        ? "★"
                        : "◇"}
                    </div>

                  </div>


                  <p className="mt-4 min-h-[66px] text-[13px] leading-6 text-[#667085]">
                    {plan.description}
                  </p>


                  <div className="mt-6 border-y border-[#eaecf0] py-5">

                    <div className="flex items-end gap-2">

                      <span className="text-[13px] font-bold text-[#667085]">
                        ₹
                      </span>

                      <span className="text-[48px] font-black leading-none tracking-[-2px]">
                        {plan.price}
                      </span>

                    </div>

                    <p className="mt-2 text-[11px] text-[#98a2b3]">
                      One-time package price
                    </p>

                  </div>


                  <div className="mt-6 flex-1">

                    <p className="text-[11px] font-black uppercase tracking-[1.2px] text-[#344054]">
                      Included
                    </p>

                    <div className="mt-4 space-y-3">

                      {plan.features.map(
                        (feature) => (

                          <div
                            key={feature}
                            className="flex items-start gap-3"
                          >

                            <span className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ecfdf3] text-[10px] font-black text-[#027a48]">
                              ✓
                            </span>

                            <span className="text-[13px] leading-5 text-[#475467]">
                              {feature}
                            </span>

                          </div>

                        )
                      )}

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={() => {
                      const planId =
                        plan.name ===
                        "Google Business Listing"
                          ? "google_listing"
                          : plan.name ===
                              "Website Development"
                            ? "website"
                            : "growth";

                      openPaymentModal(
                        planId
                      );
                    }}
                    className={`mt-8 w-full rounded-[7px] px-5 py-4 text-[13px] font-black transition ${
                      plan.popular
                        ? "bg-[#315df5] text-white shadow-[0_10px_25px_rgba(49,93,245,.20)] hover:bg-[#2449d6]"
                        : "border border-[#d0d5dd] bg-white text-[#344054] hover:border-[#315df5] hover:text-[#315df5]"
                    }`}
                  >
                    {plan.button} →
                  </button>

                </div>

              )
            )}

          </div>


          {/* DISCLAIMER */}

          <div className="mx-auto mt-7 max-w-[1050px] rounded-[14px] border border-[#e4e7ec] bg-white px-5 py-4">

            <div className="flex flex-col gap-2 text-center md:flex-row md:items-center md:justify-center md:gap-3">

              <span className="font-black text-[#315df5]">
                Note:
              </span>

              <p className="text-[11px] leading-5 text-[#667085]">
                Package prices cover the services listed above.
                Advertising spend, including Meta Ads or Google
                Ads budget, is <strong>not included</strong> and
                is paid separately by the client.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          GEO CHECKER
      ===================================================== */}

      <section
        id="geo-checker"
        className="relative overflow-hidden bg-[#080d24] py-24 text-white"
      >

        <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#315df5]/20 blur-[120px]" />

        <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#7147f5]/20 blur-[130px]" />


        <div className="relative mx-auto max-w-[1180px] px-5 lg:px-8">

          <div className="mx-auto max-w-[800px] text-center">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">

              <span className="h-2 w-2 animate-pulse rounded-full bg-[#6d8cff]" />

              <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#aab9ff]">
                Free Website Intelligence
              </span>

            </div>


            <h2 className="text-[40px] font-black leading-[1.05] tracking-[-2px] sm:text-[54px]">

              Is Your Website Ready

              <span className="block bg-gradient-to-r from-[#6d8cff] to-[#a97cff] bg-clip-text text-transparent">
                For The AI Search Era?
              </span>

            </h2>


            <p className="mx-auto mt-5 max-w-[650px] text-[15px] leading-7 text-[#9da8c2]">
              Enter your website and get a free snapshot
              of your digital visibility, local presence,
              content readiness and technical signals.
            </p>

          </div>


          <div className="mx-auto mt-12 max-w-[860px]">

            <div className="rounded-[20px] border border-white/10 bg-white/[0.06] p-2 shadow-[0_30px_100px_rgba(0,0,0,.35)] backdrop-blur-xl">

              <div className="flex flex-col gap-2 sm:flex-row">

                <div className="flex flex-1 items-center rounded-[14px] bg-[#0d1432] px-5">

                  <span className="mr-3 text-[#7183c9]">
                    ◉
                  </span>

                  <input
                    value={geoUrl}
                    onChange={(e) =>
                      setGeoUrl(
                        e.target.value
                      )
                    }
                    onKeyDown={(e) => {

                      if (
                        e.key ===
                        "Enter"
                      ) {
                        checkGeoScore();
                      }

                    }}
                    placeholder="Enter your website URL..."
                    className="h-[58px] w-full bg-transparent text-sm text-white outline-none placeholder:text-[#66718e]"
                  />

                </div>


                <button
                  type="button"
                  onClick={checkGeoScore}
                  disabled={geoLoading}
                  className="h-[58px] rounded-[14px] bg-gradient-to-r from-[#315df5] to-[#7048f6] px-7 text-sm font-bold text-white shadow-[0_10px_35px_rgba(49,93,245,.30)] hover:scale-[1.01] disabled:opacity-60"
                >
                  {geoLoading
                    ? "Analyzing..."
                    : "Check Free GEO Score →"}
                </button>

              </div>

            </div>


            <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] text-[#66718e]">

              <span>✓ Free Check</span>
              <span>✓ No Credit Card</span>
              <span>✓ Instant Insights</span>
              <span>✓ Website Signals</span>

            </div>

          </div>


          {geoError && (
            <div className="mx-auto mt-7 max-w-[850px] rounded-xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-center text-sm text-red-300">
              {geoError}
            </div>
          )}


          {geoResult && (

            <div className="mx-auto mt-12 max-w-[1050px]">

              <div className="grid gap-5 lg:grid-cols-[.75fr_1.25fr]">

                <div className="rounded-[22px] border border-white/10 bg-white/[0.055] p-8 backdrop-blur-xl">

                  <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#7d8bb1]">
                    Your GEO Score
                  </p>


                  <div className="mt-7 flex justify-center">

                    <div className="relative flex h-[190px] w-[190px] items-center justify-center rounded-full border-[10px] border-[#315df5]/20">

                      <div className="absolute inset-[-10px] rounded-full border-[10px] border-transparent border-r-[#6847f7] border-t-[#6d8cff] rotate-[-35deg]" />

                      <div className="text-center">

                        <div className="text-[58px] font-black">
                          {geoResult.score ??
                            geoResult.overall ??
                            0}
                        </div>

                        <div className="text-[11px] uppercase tracking-[2px] text-[#8b98b5]">
                          / 100
                        </div>

                      </div>

                    </div>

                  </div>


                  <p className="mt-7 text-center text-sm font-bold text-white">
                    {geoResult.grade ||
                      "Digital Visibility Report"}
                  </p>

                </div>


                <div className="grid gap-4 sm:grid-cols-2">

                  {[
                    {
                      title:
                        "AI Visibility",
                      value:
                        geoResult.aiVisibility ??
                        0,
                      icon: "✦",
                    },
                    {
                      title:
                        "Local Presence",
                      value:
                        geoResult.localPresence ??
                        0,
                      icon: "◎",
                    },
                    {
                      title:
                        "Content Readiness",
                      value:
                        geoResult.contentReadiness ??
                        0,
                      icon: "◇",
                    },
                    {
                      title:
                        "Technical Signals",
                      value:
                        geoResult.technicalSignals ??
                        0,
                      icon: "⌁",
                    },
                  ].map(
                    (item) => (

                      <div
                        key={item.title}
                        className="rounded-[20px] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl"
                      >

                        <div className="flex items-center justify-between">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#315df5]/10 text-[#7d91ff]">
                            {item.icon}
                          </div>

                          <span className="text-xl font-black">
                            {item.value}
                          </span>

                        </div>


                        <p className="mt-5 text-sm font-bold">
                          {item.title}
                        </p>


                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">

                          <div
                            style={{
                              width: `${Math.min(
                                Number(
                                  item.value
                                ) || 0,
                                100
                              )}%`,
                            }}
                            className="h-full rounded-full bg-gradient-to-r from-[#315df5] to-[#8b7cff]"
                          />

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>


              {geoResult.insights &&
                geoResult.insights.length >
                  0 && (

                  <div className="mt-5 rounded-[20px] border border-white/10 bg-white/[0.055] p-7">

                    <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#7d8bb1]">
                      AI Insights
                    </p>

                    <div className="mt-5 grid gap-3 md:grid-cols-3">

                      {geoResult.insights.map(
                        (
                          insight,
                          index
                        ) => (

                          <div
                            key={index}
                            className="rounded-xl bg-white/[0.04] p-4 text-sm leading-6 text-[#aab4ca]"
                          >

                            <span className="mr-2 font-bold text-[#6d8cff]">
                              0
                              {index + 1}
                            </span>

                            {insight}

                          </div>

                        )
                      )}

                    </div>

                  </div>

                )}

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section
        id="services"
        className="bg-white py-24"
      >

        <div className="mx-auto max-w-[1320px] px-5 lg:px-8">

          <div className="max-w-[750px]">

            <p className="text-[11px] font-black uppercase tracking-[2px] text-[#315df5]">
              What We Do
            </p>

            <h2 className="mt-4 text-[46px] font-black tracking-[-2px] md:text-[58px]">
              Digital Marketing
              <span className="block">
                Built For Growth.
              </span>
            </h2>

            <p className="mt-5 text-[16px] leading-7 text-[#667085]">
              One agency for the digital channels that
              matter most to your business.
            </p>

          </div>


          <div className="mt-12 grid border-l border-t border-[#eaecf0] md:grid-cols-2 lg:grid-cols-3">

            {loadingServices
              ? Array.from({
                  length: 6,
                }).map(
                  (_, i) => (
                    <div
                      key={i}
                      className="h-[270px] animate-pulse border-b border-r border-[#eaecf0] bg-[#f8f9fb]"
                    />
                  )
                )
              : services.map(
                  (service) => (

                    <div
                      key={service.id}
                      className="group min-h-[270px] border-b border-r border-[#eaecf0] bg-white p-8 transition duration-300 hover:-translate-y-1 hover:bg-[#f8faff] hover:shadow-[0_20px_50px_rgba(16,24,40,.07)]"
                    >

                      <div className="flex items-center justify-between">

                        <div className="flex h-12 w-12 items-center justify-center rounded-[6px] bg-[#eef3ff] text-xl font-bold text-[#315df5] group-hover:bg-[#315df5] group-hover:text-white">
                          {service.icon ||
                            "◇"}
                        </div>

                        <span className="text-[11px] font-bold text-[#98a2b3]">
                          {String(
                            service.id
                          ).padStart(2, "0")}
                        </span>

                      </div>


                      <h3 className="mt-7 text-[20px] font-black">
                        {service.name}
                      </h3>


                      <p className="mt-3 text-[14px] leading-6 text-[#667085]">
                        {service.description ||
                          "Professional digital marketing solutions designed for business growth."}
                      </p>


                      <a
                        href="#contact"
                        className="mt-6 inline-block text-[13px] font-bold text-[#315df5]"
                      >
                        Explore Service →
                      </a>

                    </div>

                  )
                )}

          </div>

        </div>

      </section>


      {/* =====================================================
          INDUSTRIES
      ===================================================== */}

      <section
        id="industries"
        className="bg-[#f7f9fc] py-24"
      >

        <div className="mx-auto max-w-[1320px] px-5 lg:px-8">

          <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]">

            <div>

              <p className="text-[11px] font-black uppercase tracking-[2px] text-[#315df5]">
                Industries
              </p>

              <h2 className="mt-4 text-[46px] font-black tracking-[-1.8px] md:text-[56px]">
                We Understand
                <span className="block">
                  Different Markets.
                </span>
              </h2>

              <p className="mt-5 max-w-[520px] text-[15px] leading-7 text-[#667085]">
                Every industry has a different audience,
                buying journey and competitive landscape.
                Our digital strategies adapt accordingly.
              </p>

              <a
                href="#contact"
                className="mt-7 inline-block text-sm font-bold text-[#315df5]"
              >
                Discuss Your Industry →
              </a>

            </div>


            <div className="grid grid-cols-2 border-l border-t border-[#dfe3ea] sm:grid-cols-3">

              {industries.map(
                (industry) => (

                  <div
                    key={industry}
                    className="border-b border-r border-[#dfe3ea] bg-white p-7 hover:bg-[#f8faff]"
                  >

                    <div className="mb-6 h-1 w-8 bg-[#315df5]" />

                    <p className="text-sm font-bold text-[#344054]">
                      {industry}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section
        id="about"
        className="bg-white py-24"
      >

        <div className="mx-auto grid max-w-[1320px] gap-16 px-5 lg:grid-cols-2 lg:items-center lg:px-8">

          <div>

            <p className="text-[11px] font-black uppercase tracking-[2px] text-[#315df5]">
              Why Digital FX
            </p>

            <h2 className="mt-4 text-[46px] font-black tracking-[-2px] md:text-[58px]">
              More Than An
              <span className="block text-[#315df5]">
                Agency.
              </span>
            </h2>

            <p className="mt-6 max-w-[600px] text-[16px] leading-8 text-[#667085]">
              We work as an extension of your business.
              Every recommendation, campaign and digital
              experience is built around sustainable growth.
            </p>


            <div className="mt-9 grid gap-4 sm:grid-cols-2">

              {[
                "Business-first strategy",
                "Clear communication",
                "Performance focused",
                "Transparent reporting",
                "Modern technology",
                "Long-term partnerships",
              ].map(
                (item) => (

                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >

                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ecfdf3] text-[12px] font-black text-[#027a48]">
                      ✓
                    </span>

                    <span className="text-sm font-bold text-[#344054]">
                      {item}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>


          <div className="grid grid-cols-2 border-l border-t border-[#e4e7ec]">

            {[
              ["100+", "Projects Delivered"],
              ["25+", "Industries Served"],
              ["4.9/5", "Client Rating"],
              ["24/7", "Digital Support"],
            ].map(
              ([number, label]) => (

                <div
                  key={label}
                  className="border-b border-r border-[#e4e7ec] bg-[#fafbfc] p-9"
                >

                  <p className="text-[40px] font-black text-[#315df5]">
                    {number}
                  </p>

                  <p className="mt-2 text-sm text-[#667085]">
                    {label}
                  </p>

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          CASE STUDIES
      ===================================================== */}

      <section
        id="case-studies"
        className="bg-[#f7f9fc] py-24"
      >

        <div className="mx-auto max-w-[1320px] px-5 lg:px-8">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>

              <p className="text-[11px] font-black uppercase tracking-[2px] text-[#315df5]">
                Case Studies
              </p>

              <h2 className="mt-4 text-[40px] font-black tracking-[-1.8px] md:text-[50px]">
                Work That
                <span className="block">
                  Moves Business Forward.
                </span>
              </h2>

            </div>

            <a
              href="#contact"
              className="text-sm font-bold text-[#315df5]"
            >
              Start Your Project →
            </a>

          </div>


          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {[
              {
                category: "SEO + Local Search",
                title:
                  "Improving Local Visibility",
                text:
                  "A structured local search strategy designed to improve discovery and customer enquiries.",
                metric:
                  "+84% Visibility",
              },
              {
                category: "Website + CRO",
                title:
                  "Building A Better Digital Experience",
                text:
                  "A conversion-focused website strategy designed around customer journeys.",
                metric:
                  "+62% Leads",
              },
              {
                category: "Paid Advertising",
                title:
                  "Scaling Qualified Traffic",
                text:
                  "Targeted campaigns focused on reaching high-intent users and improving acquisition efficiency.",
                metric:
                  "+91% ROI",
              },
            ].map((item) => (

              <div
                key={item.title}
                className="overflow-hidden border border-[#e4e7ec] bg-white hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(16,24,40,.08)]"
              >

                <div className="h-[190px] bg-[#101828] p-7">

                  <div className="flex h-full flex-col justify-between">

                    <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[1px] text-[#aab4ca]">
                      {item.category}
                    </span>

                    <div>

                      <p className="text-3xl font-black text-white">
                        {item.metric}
                      </p>

                      <div className="mt-3 h-1 w-14 bg-[#315df5]" />

                    </div>

                  </div>

                </div>


                <div className="p-7">

                  <h3 className="text-xl font-black">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#667085]">
                    {item.text}
                  </p>

                  <a
                    href="#contact"
                    className="mt-6 inline-block text-xs font-bold text-[#315df5]"
                  >
                    Discuss Similar Project →
                  </a>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          PROCESS
      ===================================================== */}

      <section
        id="process"
        className="bg-[#101828] py-24 text-white"
      >

        <div className="mx-auto max-w-[1320px] px-5 lg:px-8">

          <div className="max-w-[700px]">

            <p className="text-[11px] font-black uppercase tracking-[2px] text-[#718bff]">
              Our Process
            </p>

            <h2 className="mt-4 text-[46px] font-black tracking-[-2px] md:text-[58px]">
              From Strategy
              <span className="block text-[#718bff]">
                To Growth.
              </span>
            </h2>

            <p className="mt-5 text-[15px] leading-7 text-[#98a2b3]">
              A structured process keeps every project focused,
              measurable and aligned with your business objectives.
            </p>

          </div>


          <div className="mt-14 grid border-l border-t border-white/10 md:grid-cols-4">

            {[
              [
                "01",
                "Discover",
                "Understand your business, customers, competitors and goals.",
              ],
              [
                "02",
                "Strategize",
                "Create a customized digital roadmap based on opportunities.",
              ],
              [
                "03",
                "Execute",
                "Launch websites, campaigns, content and marketing channels.",
              ],
              [
                "04",
                "Optimize",
                "Measure performance, learn from data and continuously improve.",
              ],
            ].map(
              ([number, title, text]) => (

                <div
                  key={number}
                  className="border-b border-r border-white/10 p-8"
                >

                  <p className="text-[13px] font-black text-[#718bff]">
                    {number}
                  </p>

                  <h3 className="mt-12 text-xl font-black">
                    {title}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-[#98a2b3]">
                    {text}
                  </p>

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          TESTIMONIALS — AUTO SCROLLING
      ===================================================== */}

      <section
        id="testimonials"
        className="relative overflow-hidden border-b border-[#e4e7ec] bg-white py-20 sm:py-24"
      >
        <div className="mx-auto max-w-[1440px] px-5 lg:px-10">

          <div className="mb-12 text-center">
            <p className="text-[12px] font-black uppercase tracking-[3px] text-[#315df5]">
              Client Feedback
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-1.5px] text-[#071534] sm:text-5xl">
              What Our Clients Say
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-[#7b8ba5]">
              Real businesses. Real results. Real growth.
            </p>
          </div>

          <div className="relative">

            {/* Desktop navigation */}
            <button
              type="button"
              aria-label="Previous reviews"
              className="testimonial-arrow testimonial-prev hidden lg:flex"
              onClick={() => {
                const el = document.getElementById("testimonial-track");
                el?.scrollBy({ left: -380, behavior: "smooth" });
              }}
            >
              ←
            </button>

            <button
              type="button"
              aria-label="Next reviews"
              className="testimonial-arrow testimonial-next hidden lg:flex"
              onClick={() => {
                const el = document.getElementById("testimonial-track");
                el?.scrollBy({ left: 380, behavior: "smooth" });
              }}
            >
              →
            </button>

            <div
              id="testimonial-track"
              className="testimonial-track"
              onMouseEnter={(e) => {
                const target = e.currentTarget;
                target.dataset.paused = "true";
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget;
                target.dataset.paused = "false";
              }}
            >

              {[
                {
                  initials: "RS",
                  name: "Rahul Singh",
                  role: "Business Owner",
                  industry: "Local Business",
                  review:
                    "Digital FX helped us improve our online presence and generate better quality enquiries.",
                  tone: "blue",
                },
                {
                  initials: "PK",
                  name: "Pooja Kumar",
                  role: "Founder",
                  industry: "Professional Services",
                  review:
                    "The website, SEO and marketing strategy gave our business a much more professional digital presence.",
                  tone: "green",
                },
                {
                  initials: "AM",
                  name: "Amit Mehta",
                  role: "Marketing Manager",
                  industry: "Growing Business",
                  review:
                    "Their approach is clear, practical and focused on actual business growth rather than vanity metrics.",
                  tone: "orange",
                },
                {
                  initials: "SS",
                  name: "Sneha Sharma",
                  role: "Business Owner",
                  industry: "E-Commerce",
                  review:
                    "Great communication, on-time delivery and excellent support throughout the project.",
                  tone: "purple",
                },
                {
                  initials: "VK",
                  name: "Vikram Khanna",
                  role: "Founder",
                  industry: "Real Estate",
                  review:
                    "Our Google visibility and leads have improved significantly since working with Digital FX.",
                  tone: "blue",
                },
                {
                  initials: "NP",
                  name: "Neha Patel",
                  role: "Director",
                  industry: "Healthcare",
                  review:
                    "Professional team with practical ideas. Highly recommended for any growing business.",
                  tone: "green",
                },
                {
                  initials: "AR",
                  name: "Aarav Roy",
                  role: "Founder",
                  industry: "Technology",
                  review:
                    "The new website made our services much easier to understand and improved the quality of enquiries.",
                  tone: "orange",
                },
                {
                  initials: "MS",
                  name: "Meera Shah",
                  role: "Owner",
                  industry: "Education",
                  review:
                    "Fast response, clean execution and a much stronger online presence for our business.",
                  tone: "purple",
                },
              ].map((item, index) => (
                <article
                  key={`testimonial-${index}`}
                  className="testimonial-card"
                >
                  <div className="testimonial-quote-mark">“</div>

                  <div className="mb-5 flex gap-1 text-[20px] leading-none text-[#315df5]">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>

                  <p className="min-h-[92px] text-[14px] leading-7 text-[#344563]">
                    “{item.review}”
                  </p>

                  <div className="my-5 h-px w-full bg-[#e6eaf0]" />

                  <div className="flex items-center gap-3">
                    <div className={`testimonial-avatar ${item.tone}`}>
                      {item.initials}
                    </div>

                    <div>
                      <p className="text-[14px] font-extrabold text-[#071534]">
                        {item.name}
                      </p>

                      <p className="mt-0.5 text-[12px] font-semibold text-[#98a2b3]">
                        {item.role} · {item.industry}
                      </p>
                    </div>
                  </div>
                </article>
              ))}

              {/* Duplicate set for continuous loop */}
              {[
                {
                  initials: "RS",
                  name: "Rahul Singh",
                  role: "Business Owner",
                  industry: "Local Business",
                  review:
                    "Digital FX helped us improve our online presence and generate better quality enquiries.",
                  tone: "blue",
                },
                {
                  initials: "PK",
                  name: "Pooja Kumar",
                  role: "Founder",
                  industry: "Professional Services",
                  review:
                    "The website, SEO and marketing strategy gave our business a much more professional digital presence.",
                  tone: "green",
                },
                {
                  initials: "AM",
                  name: "Amit Mehta",
                  role: "Marketing Manager",
                  industry: "Growing Business",
                  review:
                    "Their approach is clear, practical and focused on actual business growth rather than vanity metrics.",
                  tone: "orange",
                },
                {
                  initials: "SS",
                  name: "Sneha Sharma",
                  role: "Business Owner",
                  industry: "E-Commerce",
                  review:
                    "Great communication, on-time delivery and excellent support throughout the project.",
                  tone: "purple",
                },
                {
                  initials: "VK",
                  name: "Vikram Khanna",
                  role: "Founder",
                  industry: "Real Estate",
                  review:
                    "Our Google visibility and leads have improved significantly since working with Digital FX.",
                  tone: "blue",
                },
                {
                  initials: "NP",
                  name: "Neha Patel",
                  role: "Director",
                  industry: "Healthcare",
                  review:
                    "Professional team with practical ideas. Highly recommended for any growing business.",
                  tone: "green",
                },
                {
                  initials: "AR",
                  name: "Aarav Roy",
                  role: "Founder",
                  industry: "Technology",
                  review:
                    "The new website made our services much easier to understand and improved the quality of enquiries.",
                  tone: "orange",
                },
                {
                  initials: "MS",
                  name: "Meera Shah",
                  role: "Owner",
                  industry: "Education",
                  review:
                    "Fast response, clean execution and a much stronger online presence for our business.",
                  tone: "purple",
                },
              ].map((item, index) => (
                <article
                  key={`testimonial-duplicate-${index}`}
                  className="testimonial-card"
                  aria-hidden="true"
                >
                  <div className="testimonial-quote-mark">“</div>

                  <div className="mb-5 flex gap-1 text-[20px] leading-none text-[#315df5]">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>

                  <p className="min-h-[92px] text-[14px] leading-7 text-[#344563]">
                    “{item.review}”
                  </p>

                  <div className="my-5 h-px w-full bg-[#e6eaf0]" />

                  <div className="flex items-center gap-3">
                    <div className={`testimonial-avatar ${item.tone}`}>
                      {item.initials}
                    </div>

                    <div>
                      <p className="text-[14px] font-extrabold text-[#071534]">
                        {item.name}
                      </p>

                      <p className="mt-0.5 text-[12px] font-semibold text-[#98a2b3]">
                        {item.role} · {item.industry}
                      </p>
                    </div>
                  </div>
                </article>
              ))}

            </div>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <span
                key={index}
                className={`testimonial-dot ${index === 0 ? "active" : ""}`}
              />
            ))}
          </div>
        </div>

        <style jsx>{`
          .testimonial-track {
            display: flex;
            width: max-content;
            gap: 20px;
            overflow-x: auto;
            overflow-y: hidden;
            scroll-behavior: smooth;
            scrollbar-width: none;
            padding: 4px 0 12px;
            animation: testimonialScroll 48s linear infinite;
            will-change: transform;
          }

          .testimonial-track::-webkit-scrollbar {
            display: none;
          }

          .testimonial-track[data-paused="true"] {
            animation-play-state: paused;
          }

          .testimonial-card {
            position: relative;
            width: 360px;
            min-height: 300px;
            flex: 0 0 360px;
            padding: 28px;
            border: 1px solid #e1e6ee;
            border-radius: 16px;
            background: #ffffff;
            box-shadow: 0 8px 30px rgba(16, 24, 40, 0.045);
            transition:
              transform .25s ease,
              box-shadow .25s ease,
              border-color .25s ease;
          }

          .testimonial-card:hover {
            transform: translateY(-4px);
            border-color: #cbd6e8;
            box-shadow: 0 16px 40px rgba(16, 24, 40, 0.09);
          }

          .testimonial-quote-mark {
            height: 24px;
            margin-bottom: 3px;
            color: #cbdafd;
            font-family: Georgia, serif;
            font-size: 44px;
            font-weight: 900;
            line-height: .75;
          }

          .testimonial-avatar {
            display: flex;
            width: 42px;
            height: 42px;
            flex: 0 0 42px;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-size: 12px;
            font-weight: 900;
          }

          .testimonial-avatar.blue {
            background: #e6efff;
            color: #315df5;
          }

          .testimonial-avatar.green {
            background: #e3f8e9;
            color: #159447;
          }

          .testimonial-avatar.orange {
            background: #fff0e2;
            color: #d66c19;
          }

          .testimonial-avatar.purple {
            background: #eee8ff;
            color: #6b46e8;
          }

          .testimonial-arrow {
            position: absolute;
            top: 50%;
            z-index: 20;
            width: 52px;
            height: 52px;
            transform: translateY(-50%);
            align-items: center;
            justify-content: center;
            border: 1px solid #e0e6ef;
            border-radius: 50%;
            background: rgba(255,255,255,.96);
            color: #315df5;
            font-size: 25px;
            box-shadow: 0 8px 25px rgba(16, 24, 40, .10);
            cursor: pointer;
          }

          .testimonial-arrow:hover {
            border-color: #315df5;
          }

          .testimonial-prev {
            left: -26px;
          }

          .testimonial-next {
            right: -26px;
          }

          .testimonial-dot {
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background: #e1e7f0;
          }

          .testimonial-dot.active {
            width: 11px;
            height: 11px;
            margin-top: -1px;
            background: #315df5;
          }

          @keyframes testimonialScroll {
            from {
              transform: translateX(0);
            }

            to {
              transform: translateX(calc(-50% - 10px));
            }
          }

          @media (max-width: 1024px) {
            .testimonial-card {
              width: 330px;
              flex-basis: 330px;
            }

            .testimonial-track {
              animation-duration: 42s;
            }
          }

          @media (max-width: 640px) {
            .testimonial-card {
              width: 300px;
              min-height: 285px;
              flex-basis: 300px;
              padding: 23px;
              border-radius: 14px;
            }

            .testimonial-track {
              gap: 14px;
              animation-duration: 35s;
            }

            .testimonial-arrow {
              display: none;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .testimonial-track {
              animation: none;
            }
          }
        `}</style>
      </section>


      {/* =====================================================
          CONTACT
      ===================================================== */}

      <section
        id="contact"
        className="bg-white py-24"
      >

        <div className="mx-auto max-w-[1100px] px-5 lg:px-8">

          <div className="mb-12 text-center">

            <p className="text-[11px] font-black uppercase tracking-[2px] text-[#315df5]">
              Contact Digital FX
            </p>

            <h2 className="mt-4 text-[40px] font-black tracking-[-1.8px] md:text-[50px]">
              Let&apos;s Talk About Your Business.
            </h2>

            <p className="mx-auto mt-4 max-w-[620px] text-[15px] leading-7 text-[#667085]">
              Tell us what you want to achieve and our
              team will help identify the right digital strategy.
            </p>

          </div>


          <div className="grid overflow-hidden rounded-[6px] border border-[#e4e7ec] lg:grid-cols-[.78fr_1.22fr]">

            {/* AI PANEL */}

            <div className="relative overflow-hidden bg-[#080d24] p-8 text-white md:p-10">

              <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              <div className="relative">

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2">

                  <span className="relative flex h-2 w-2">

                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6d8cff] opacity-75" />

                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#6d8cff]" />

                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[1.7px] text-[#aab9ff]">
                    Digital FX AI Assistant
                  </span>

                </div>


                <h3 className="mt-7 text-[30px] font-black leading-tight">

                  Let&apos;s Understand

                  <span className="block text-[#6d8cff]">
                    Your Business.
                  </span>

                </h3>


                <p className="mt-4 max-w-[390px] text-sm leading-6 text-[#98a2b3]">
                  Tell us what you are trying to achieve.
                  Our digital strategy system helps identify
                  the right direction for your business.
                </p>


                <div className="mt-9 rounded-[16px] border border-white/10 bg-white/[0.055] p-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#315df5]/15 text-[#7d91ff]">
                      ✦
                    </div>

                    <div>

                      <p className="text-xs font-bold">
                        AI Strategy Analysis
                      </p>

                      <p className="mt-1 text-[10px] text-[#667085]">
                        Ready to analyze your requirement
                      </p>

                    </div>

                  </div>


                  <div className="mt-6 space-y-3">

                    {[
                      "Business Requirements",
                      "Digital Visibility",
                      "Growth Opportunities",
                    ].map(
                      (item, index) => (

                        <div
                          key={item}
                          className="flex items-center gap-3 rounded-lg bg-white/[0.035] px-3 py-3"
                        >

                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#315df5]/10 text-[10px] font-bold text-[#718bff]">
                            0{index + 1}
                          </div>

                          <span className="text-[12px] text-[#aab4ca]">
                            {item}
                          </span>

                          <span className="ml-auto text-[10px] text-[#53617e]">
                            READY
                          </span>

                        </div>

                      )
                    )}

                  </div>

                </div>


                <div className="mt-8 border-t border-white/10 pt-6">

                  <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#667085]">
                    Direct Support
                  </p>

                  <div className="mt-4 space-y-3">

                    <a
                      href="tel:+919876543210"
                      className="flex items-center gap-3 text-sm text-[#d0d5dd] hover:text-white"
                    >
                      ☎ +91 98765 43210
                    </a>

                    <a
                      href="mailto:hello@digitalfx.in"
                      className="flex items-center gap-3 text-sm text-[#d0d5dd] hover:text-white"
                    >
                      @ hello@digitalfx.in
                    </a>

                  </div>

                </div>

              </div>

            </div>


            {/* FORM */}

            <div className="p-7 md:p-10">

              <div className="mb-7 flex items-center gap-3 rounded-xl border border-[#dce5ff] bg-[#f8faff] px-4 py-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#315df5] text-white">
                  ✦
                </div>

                <div className="flex-1">

                  <p className="text-xs font-black">
                    AI-assisted enquiry
                  </p>

                  <p className="mt-1 text-[11px] text-[#667085]">
                    Tell us what your business needs.
                  </p>

                </div>

              </div>


              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>

                    <label className="text-xs font-bold text-[#344054]">
                      Full Name
                    </label>

                    <input
                      name="name"
                      required
                      placeholder="Your full name"
                      className="mt-2 h-12 w-full rounded-[4px] border border-[#d0d5dd] px-4 text-sm text-black outline-none focus:border-[#315df5] focus:ring-2 focus:ring-[#315df5]/10"
                    />

                  </div>


                  <div>

                    <label className="text-xs font-bold text-[#344054]">
                      Phone Number
                    </label>

                    <input
                      name="phone"
                      required
                      placeholder="+91"
                      className="mt-2 h-12 w-full rounded-[4px] border border-[#d0d5dd] px-4 text-sm text-black outline-none focus:border-[#315df5] focus:ring-2 focus:ring-[#315df5]/10"
                    />

                  </div>

                </div>


                <div>

                  <label className="text-xs font-bold text-[#344054]">
                    Email Address
                  </label>

                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="mt-2 h-12 w-full rounded-[4px] border border-[#d0d5dd] px-4 text-sm text-black outline-none focus:border-[#315df5] focus:ring-2 focus:ring-[#315df5]/10"
                  />

                </div>


                <div>

                  <label className="text-xs font-bold text-[#344054]">
                    Service / Package
                  </label>

                  <select
                    name="service"
                    required
                    className="mt-2 h-12 w-full rounded-[4px] border border-[#d0d5dd] bg-white px-4 text-sm text-black outline-none focus:border-[#315df5] focus:ring-2 focus:ring-[#315df5]/10"
                  >

                    <option value="">
                      Select service or package
                    </option>

                    <optgroup label="Packages">

                      <option value="Google Business Listing - ₹2,999">
                        Google Business Listing — ₹2,999
                      </option>

                      <option value="Website Development - ₹5,999">
                        Website Development — ₹5,999
                      </option>

                      <option value="Business Growth Package - ₹9,999">
                        Business Growth Package — ₹9,999
                      </option>

                    </optgroup>


                    <optgroup label="Services">

                      {services.map(
                        (service) => (

                          <option
                            key={service.id}
                            value={service.name}
                          >
                            {service.name}
                          </option>

                        )
                      )}

                    </optgroup>

                  </select>

                </div>


                <div>

                  <label className="text-xs font-bold text-[#344054]">
                    Project Details
                  </label>

                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us about your project..."
                    className="mt-2 w-full resize-none rounded-[4px] border border-[#d0d5dd] px-4 py-3 text-sm text-black outline-none focus:border-[#315df5] focus:ring-2 focus:ring-[#315df5]/10"
                  />

                </div>


                {successMessage && (

                  <div className="border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                    {successMessage}
                  </div>

                )}


                {errorMessage && (

                  <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {errorMessage}
                  </div>

                )}


                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full rounded-[4px] bg-[#315df5] px-6 py-4 text-sm font-black text-white hover:bg-[#2449d6] disabled:opacity-60"
                >

                  {formLoading
                    ? "Sending..."
                    : "Send Enquiry →"}

                </button>


                <p className="text-center text-[11px] text-[#98a2b3]">
                  Your information is kept private and used
                  only to respond to your enquiry.
                </p>

              </form>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          PAYU PAYMENT MODAL
      ===================================================== */}

      {paymentOpen &&
        selectedPaymentPlan && (
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-[#080d24]/65 px-4 py-6 backdrop-blur-md"
            onMouseDown={(e) => {
              if (
                e.target === e.currentTarget &&
                !paymentLoading
              ) {
                closePaymentModal();
              }
            }}
          >
            <div className="w-full max-w-[520px] overflow-hidden rounded-[24px] border border-white/20 bg-white shadow-[0_35px_100px_rgba(0,0,0,.30)]">
              <div className="relative overflow-hidden bg-[#080d24] px-6 py-7 text-white md:px-8">
                <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[#315df5]/25 blur-3xl" />
                <div className="relative flex items-start justify-between gap-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                      <img
                        src="/logo.png"
                        alt="Digital FX"
                        className="h-10 w-10 object-contain"
                      />
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[2px] text-[#8ea2ff]">
                        DIGITAL FX
                      </p>
                      <h3 className="mt-1 text-xl font-black">
                        Secure Checkout
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={closePaymentModal}
                    disabled={paymentLoading}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-lg text-[#c7cfdf] transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Close payment"
                  >
                    ×
                  </button>
                </div>

                <div className="relative mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.06] px-4 py-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[1.3px] text-[#7f8cab]">
                      Selected Package
                    </p>
                    <p className="mt-1 text-sm font-black">
                      {selectedPaymentPlan.name}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-[1.3px] text-[#7f8cab]">
                      Amount
                    </p>
                    <p className="mt-1 text-2xl font-black">
                      ₹{Number(
                        selectedPaymentPlan.amount
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={startPayUPayment}
                className="p-6 md:p-8"
              >
                <div className="mb-6">
                  <p className="text-sm font-black text-[#101828]">
                    Enter your details
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#667085]">
                    We&apos;ll use these details to create your PayU checkout.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="payment-name"
                      className="text-xs font-bold text-[#344054]"
                    >
                      Full Name
                    </label>
                    <input
                      id="payment-name"
                      value={paymentName}
                      onChange={(e) =>
                        setPaymentName(
                          e.target.value
                        )
                      }
                      required
                      autoComplete="name"
                      placeholder="Enter your full name"
                      className="mt-2 h-12 w-full rounded-xl border border-[#d0d5dd] bg-white px-4 text-sm text-[#101828] outline-none transition focus:border-[#315df5] focus:ring-4 focus:ring-[#315df5]/10"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="payment-email"
                        className="text-xs font-bold text-[#344054]"
                      >
                        Email Address
                      </label>
                      <input
                        id="payment-email"
                        value={paymentEmail}
                        onChange={(e) =>
                          setPaymentEmail(
                            e.target.value
                          )
                        }
                        required
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className="mt-2 h-12 w-full rounded-xl border border-[#d0d5dd] bg-white px-4 text-sm text-[#101828] outline-none transition focus:border-[#315df5] focus:ring-4 focus:ring-[#315df5]/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="payment-phone"
                        className="text-xs font-bold text-[#344054]"
                      >
                        Mobile Number
                      </label>
                      <input
                        id="payment-phone"
                        value={paymentPhone}
                        onChange={(e) =>
                          setPaymentPhone(
                            e.target.value
                          )
                        }
                        required
                        type="tel"
                        autoComplete="tel"
                        placeholder="+91 98765 43210"
                        className="mt-2 h-12 w-full rounded-xl border border-[#d0d5dd] bg-white px-4 text-sm text-[#101828] outline-none transition focus:border-[#315df5] focus:ring-4 focus:ring-[#315df5]/10"
                      />
                    </div>
                  </div>
                </div>

                {paymentError && (
                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold leading-5 text-red-700">
                    {paymentError}
                  </div>
                )}

                <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#e4e7ec] bg-[#f8faff] p-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#ecfdf3] text-xs font-black text-[#027a48]">
                    ✓
                  </span>
                  <p className="text-[11px] leading-5 text-[#667085]">
                    You will be redirected to the PayU secure checkout page to complete your payment.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#315df5] to-[#5d4df3] px-6 py-4 text-sm font-black text-white shadow-[0_12px_30px_rgba(49,93,245,.24)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(49,93,245,.30)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {paymentLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Connecting to PayU...
                    </>
                  ) : (
                    <>
                      Proceed to Pay ₹{Number(
                        selectedPaymentPlan.amount
                      ).toLocaleString("en-IN")}
                      <span>→</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={closePaymentModal}
                  disabled={paymentLoading}
                  className="mt-3 w-full rounded-xl px-5 py-3 text-xs font-bold text-[#667085] transition hover:bg-[#f8f9fc] hover:text-[#344054] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <p className="mt-4 text-center text-[10px] leading-4 text-[#98a2b3]">
                  Digital FX • Secure payment processing via PayU
                </p>
              </form>
            </div>
          </div>
        )}

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-[#07132c] text-white">

        <div className="mx-auto max-w-[1320px] px-5 py-14 lg:px-8">

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.1fr]">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-[62px] w-[70px] items-center justify-center rounded-md bg-white">

                  <img
                    src="/logo.png"
                    alt="Digital FX"
                    className="h-[58px] w-[66px] object-contain"
                  />

                </div>


                <div>

                  <p className="text-[23px] font-black">

                    DIGITAL{" "}

                    <span className="text-[#5c7fff]">
                      FX
                    </span>

                  </p>

                  <p className="text-[9px] font-bold tracking-[2px] text-[#71809d]">
                    DIGITAL MARKETING THAT DELIVERS
                  </p>

                </div>

              </div>


              <p className="mt-6 max-w-[420px] text-sm leading-7 text-[#98a2b3]">
                Digital marketing solutions designed to
                help businesses attract customers, improve
                visibility and grow online.
              </p>


              <a
                href="#pricing"
                className="mt-6 inline-block rounded-md border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold text-[#aab4ca] hover:bg-white/10 hover:text-white"
              >
                View Digital FX Packages →
              </a>

            </div>


            <div>

              <h4 className="text-sm font-bold">
                Company
              </h4>

              <div className="mt-5 space-y-3">

                <a
                  href="#about"
                  className="block text-sm text-[#98a2b3] hover:text-white"
                >
                  About Us
                </a>

                <a
                  href="#services"
                  className="block text-sm text-[#98a2b3] hover:text-white"
                >
                  Services
                </a>

                <a
                  href="#pricing"
                  className="block text-sm text-[#98a2b3] hover:text-white"
                >
                  Pricing
                </a>

                <a
                  href="#case-studies"
                  className="block text-sm text-[#98a2b3] hover:text-white"
                >
                  Case Studies
                </a>

                <a
                  href="#contact"
                  className="block text-sm text-[#98a2b3] hover:text-white"
                >
                  Contact
                </a>

              </div>

            </div>


            <div>

              <h4 className="text-sm font-bold">
                Packages
              </h4>

              <div className="mt-5 space-y-3">

                <a
                  href="#pricing"
                  className="block text-sm text-[#98a2b3] hover:text-white"
                >
                  Google Listing — ₹2,999
                </a>

                <a
                  href="#pricing"
                  className="block text-sm text-[#98a2b3] hover:text-white"
                >
                  Website — ₹5,999
                </a>

                <a
                  href="#pricing"
                  className="block text-sm text-[#98a2b3] hover:text-white"
                >
                  Growth Package — ₹9,999
                </a>

              </div>

            </div>


            <div>

              <h4 className="text-sm font-bold">
                Contact Us
              </h4>

              <div className="mt-5 space-y-5">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#667085]">
                    Phone
                  </p>

                  <a
                    href="tel:+919876543210"
                    className="mt-1 block text-sm text-[#d0d5dd]"
                  >
                    +91 98765 43210
                  </a>

                </div>


                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#667085]">
                    Email
                  </p>

                  <a
                    href="mailto:hello@digitalfx.in"
                    className="mt-1 block text-sm text-[#d0d5dd]"
                  >
                    hello@digitalfx.in
                  </a>

                </div>


                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#667085]">
                    Address
                  </p>

                  <p className="mt-1 text-sm leading-6 text-[#d0d5dd]">
                    Jaipur, Rajasthan, India
                  </p>

                </div>

              </div>

            </div>

          </div>


          <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-[#667085] md:flex-row">

            <p>
              © {new Date().getFullYear()} Digital FX.
              All Rights Reserved.
            </p>

            <p>
              Advertising spend is not included in package prices.
            </p>

          </div>

        </div>

      </footer>


      {/* =====================================================
          AI CHAT
      ===================================================== */}

      {chatOpen && (

        <div className="fixed bottom-[88px] right-5 z-[90] w-[calc(100%-40px)] max-w-[370px] overflow-hidden rounded-[18px] border border-[#e4e7ec] bg-white shadow-[0_25px_80px_rgba(16,24,40,.22)]">

          <div className="bg-[#080d24] p-4 text-white">

            <div className="flex items-center gap-3">

              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#315df5]">

                ✦

                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#080d24] bg-[#12b76a]" />

              </div>


              <div className="flex-1">

                <p className="text-sm font-black">
                  Digital FX AI
                </p>

                <div className="mt-1 flex items-center gap-2">

                  <span className="h-1.5 w-1.5 rounded-full bg-[#12b76a]" />

                  <p className="text-[10px] text-[#98a2b3]">
                    Online • Ready to help
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={() =>
                  setChatOpen(false)
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-lg text-[#98a2b3]"
              >
                ×
              </button>

            </div>

          </div>


          <div className="max-h-[320px] space-y-3 overflow-y-auto bg-[#f8f9fc] p-4">

            {chatMessages.map(
              (message, index) => (

                <div
                  key={index}
                  className={`flex ${
                    message.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`max-w-[85%] rounded-[13px] px-4 py-3 text-xs leading-5 ${
                      message.sender === "user"
                        ? "bg-[#315df5] text-white"
                        : "border border-[#e4e7ec] bg-white text-[#344054]"
                    }`}
                  >
                    {message.text}
                  </div>

                </div>

              )
            )}

          </div>


          <div className="border-t border-[#eaecf0] bg-white px-3 pt-3">

            <div className="flex gap-2 overflow-x-auto pb-2">

              {[
                "SEO",
                "Website",
                "GEO Score",
                "Google Listing",
                "Pricing",
              ].map(
                (quick) => (

                  <button
                    type="button"
                    key={quick}
                    onClick={() => {

                      setChatMessage(
                        `I need help with ${quick}`
                      );

                    }}
                    className="whitespace-nowrap rounded-full border border-[#dce5ff] bg-[#f8faff] px-3 py-2 text-[10px] font-bold text-[#315df5]"
                  >
                    {quick}
                  </button>

                )
              )}

            </div>

          </div>


          <div className="flex gap-2 border-t border-[#eaecf0] bg-white p-3">

            <input
              value={chatMessage}
              onChange={(e) =>
                setChatMessage(
                  e.target.value
                )
              }
              onKeyDown={(e) => {

                if (
                  e.key === "Enter"
                ) {
                  sendChatMessage();
                }

              }}
              placeholder="Ask Digital FX..."
              className="h-11 min-w-0 flex-1 rounded-xl border border-[#d0d5dd] px-3 text-xs text-black outline-none focus:border-[#315df5]"
            />

            <button
              type="button"
              onClick={sendChatMessage}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#315df5] text-white"
            >
              →
            </button>

          </div>


          <a
            href="https://wa.me/919876543210?text=Hi%20Digital%20FX%2C%20I%20want%20help%20with%20digital%20marketing."
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-[#25D366] px-4 py-3 text-center text-[12px] font-black text-white"
          >
            Continue on WhatsApp →
          </a>

        </div>

      )}


      {/* =====================================================
          FLOATING SCROLL CONTROLS
      ===================================================== */}

      <div className="fixed right-5 top-1/2 z-[80] hidden -translate-y-1/2 flex-col gap-2 md:flex">
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className={`group relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/90 text-[#315df5] shadow-[0_12px_35px_rgba(16,24,40,.14)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#315df5] hover:bg-[#315df5] hover:text-white hover:shadow-[0_16px_40px_rgba(49,93,245,.25)] ${showScrollControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <span className="text-xl font-black transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
          <span className="pointer-events-none absolute right-[58px] whitespace-nowrap rounded-lg bg-[#080d24] px-3 py-2 text-[10px] font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            Back to top
          </span>
        </button>

        <div className="mx-auto h-7 w-px bg-gradient-to-b from-[#315df5]/20 via-[#315df5]/60 to-[#315df5]/20" />

        <button
          type="button"
          onClick={scrollToBottom}
          aria-label="Scroll to bottom"
          className="group relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/90 text-[#315df5] shadow-[0_12px_35px_rgba(16,24,40,.14)] backdrop-blur-xl transition-all duration-300 hover:translate-y-1 hover:border-[#315df5] hover:bg-[#315df5] hover:text-white hover:shadow-[0_16px_40px_rgba(49,93,245,.25)]"
        >
          <span className="text-xl font-black transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
          <span className="pointer-events-none absolute right-[58px] whitespace-nowrap rounded-lg bg-[#080d24] px-3 py-2 text-[10px] font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            Go to bottom
          </span>
        </button>
      </div>

      {/* Mobile scroll controls */}
      <div className="fixed bottom-5 left-5 z-[80] flex gap-2 md:hidden">
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/80 bg-white/95 text-[#315df5] shadow-[0_10px_28px_rgba(16,24,40,.14)]"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={scrollToBottom}
          aria-label="Scroll to bottom"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/80 bg-white/95 text-[#315df5] shadow-[0_10px_28px_rgba(16,24,40,.14)]"
        >
          ↓
        </button>
      </div>

      {/* =====================================================
          FLOATING AI
      ===================================================== */}

      <div className="fixed bottom-5 right-5 z-[100] flex items-end gap-3">

        {!chatOpen && (

          <button
            type="button"
            onClick={() =>
              setChatOpen(true)
            }
            className="hidden rounded-xl border border-[#dce5ff] bg-white px-3 py-2 text-left shadow-[0_10px_35px_rgba(16,24,40,.12)] sm:block"
          >

            <p className="text-[11px] font-black text-[#101828]">
              Digital FX AI
            </p>

            <p className="mt-0.5 text-[10px] text-[#667085]">
              Ask about your growth →
            </p>

          </button>

        )}


        <button
          type="button"
          onClick={() =>
            setChatOpen(!chatOpen)
          }
          aria-label="Open Digital FX AI chat"
          className="relative flex h-[62px] w-[62px] items-center justify-center rounded-full bg-white p-[2px] shadow-[0_12px_35px_rgba(0,0,0,.22)] transition hover:scale-105"
        >

          {!chatOpen && (
            <span className="absolute inset-0 animate-ping rounded-full border-2 border-[#315df5]/30" />
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
            />
          )}

        </button>

      </div>

    </main>
    </>
  );
}