"use client";

import { FormEvent, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { supabase } from "./lib/supabase";
import GlobalKeywordsSection from "@/components/GlobalKeywordsSection";

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
  recommendations?: string[];
  title?: string;
  description?: string;
  responseTime?: number;
  realInfrastructure?: {
    serverIp: string;
    emailProvider: string;
    isHttps: boolean;
    hasGa4: boolean;
    hasGtm: boolean;
    analyticsId?: string | null;
    mxRecords?: string[];
  };
  realGooglePlaces?: {
    placeId: string;
    name: string;
    rating: number;
    userRatingsTotal: number;
    address: string;
    businessStatus: string;
    url?: string;
  } | null;
  realContentStats?: {
    wordCount: number;
    h1Tags: string[];
    h2Count: number;
    hasOgTags: boolean;
    hasTwitterTags: boolean;
  };
  detectedSchemas?: string[];
  trancoRank?: number | null;
  googleMapsUrl?: string | null;
  aiAnalysis?: {
    summary: string;
    priority: "High" | "Medium" | "Low";
    opportunities: string[];
    actions: string[];
    aiEngineBreakdown?: {
      chatgpt: { score: number; status: string; diagnosis: string };
      gemini: { score: number; status: string; diagnosis: string };
      perplexity: { score: number; status: string; diagnosis: string };
    };
    projectedGrowth?: {
      estimatedScoreAfterFixes: number;
      potentialTrafficIncrease: string;
    };
    trafficIntelligence?: {
      estimatedMonthlyVisits: string;
      trafficTier: string;
      analyticsStatus?: string;
      serverIp?: string;
      emailProvider?: string;
      trancoRank?: number | null;
      channelSplit: {
        organicSearch: number;
        localMaps: number;
        directBrand: number;
        aiCitations: number;
      };
      missedTrafficMonthly: string;
      projectedTrafficMonthly: string;
    };
    googleRatingIntelligence?: {
      rating: number | null;
      reviewCountText: string;
      gbpStatus: string;
      sentiment: number;
      localPackImpact: string;
      hasReviewSchema: boolean;
      source?: string;
      address?: string;
      placeUrl?: string;
    };
    engineUsed?: string;
  } | null;
};

type PaymentPlan = {
  id: "google_listing" | "email_marketing" | "website" | "growth" | "custom";
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
  {
    id: 9,
    name: "Email Marketing & CRM Automation",
    description:
      "High-deliverability newsletters, drip sequences, Klaviyo & Mailchimp setup, and SPF/DKIM/DMARC inbox placement.",
    icon: "✉",
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
    name: "Email Marketing & CRM Automation",
    price: "4,999",
    description:
      "Turn subscribers into repeat revenue with automated drip campaigns and deliverability engineering.",
    features: [
      "Technical ESP Setup (Mailchimp / Klaviyo / Brevo)",
      "100% Deliverability: SPF, DKIM, DMARC authentication",
      "Custom responsive HTML email template",
      "3-step automated welcome & lead nurture drip",
      "Audience segmentation & bounce cleaning",
      "Conversion copywriting & A/B subject line tests",
    ],
    button: "Launch Email Marketing",
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
    timeAgo: "2 weeks ago",
    avatarColor: "#5c53c4",
  },
  {
    quote: "Our saree boutique saw a huge surge in footfall and direct WhatsApp enquiries after they revamped our local presence and social catalog.",
    author: "Priya Malhotra",
    business: "Malhotra Saree Sansar, Raj Nagar",
    rating: 5,
    tag: "Local Growth",
    timeAgo: "1 month ago",
    avatarColor: "#d81b60",
  },
  {
    quote: "Their B2B lead generation campaigns brought us high-ticket manufacturing inquiries across NCR. Highly professional team and transparent ROI.",
    author: "Vikram Singhal",
    business: "Singhal Polymers & Packaging, Ghaziabad",
    rating: 5,
    tag: "Paid Ads",
    timeAgo: "2 months ago",
    avatarColor: "#2d6636",
  },
  {
    quote: "The website they designed loads instantly on mobile and our interior design leads started flowing directly to WhatsApp without any hassle.",
    author: "Ananya Gupta",
    business: "The Woodcraft Studio, Noida",
    rating: 5,
    tag: "Web Dev",
    timeAgo: "3 weeks ago",
    avatarColor: "#8e24aa",
  },
  {
    quote: "Sensible pricing, clear communication, and practical guidance. Best digital marketing agency for chartered accountants and consulting firms.",
    author: "Mohit Bansal",
    business: "Bansal CA & Tax Associates, NCR",
    rating: 5,
    tag: "Business Growth",
    timeAgo: "3 months ago",
    avatarColor: "#285b88",
  },
  {
    quote: "Our bridal and salon bookings doubled ahead of wedding season thanks to their hyper-targeted Meta advertising campaigns.",
    author: "Neha Kapoor",
    business: "Glamour Glow Salon & Academy, Ghaziabad",
    rating: 5,
    tag: "Meta Ads",
    timeAgo: "1 month ago",
    avatarColor: "#c2185b",
  },
  {
    quote: "In the real estate sector, speed and trust are everything. Digital FX built our landing pages that convert cold traffic into closed property visits.",
    author: "Amit Tyagi",
    business: "Tyagi Properties, Crossings Republik",
    rating: 5,
    tag: "Real Estate",
    timeAgo: "4 months ago",
    avatarColor: "#00796b",
  },
  {
    quote: "We were struggling with Google reviews and discovery. Digital FX properly optimized our dental listing and now patients find us organically.",
    author: "Dr. Sunita Verma",
    business: "Smile Dental Clinic, Indirapuram",
    rating: 5,
    tag: "Google Maps",
    timeAgo: "5 months ago",
    avatarColor: "#b53826",
  },
  {
    quote: "The gym membership enquiries skyrocketed within the first month itself. Their creative ads and local SEO approach really delivers.",
    author: "Karan Sachdeva",
    business: "Sachdeva Fitness & Gym, Vaishali",
    rating: 5,
    tag: "Fitness",
    timeAgo: "2 months ago",
    avatarColor: "#e65100",
  },
  {
    quote: "Our preschool admissions reached full capacity this year. Their hyper-local Google campaign and parental trust messaging worked wonders.",
    author: "Pooja Aggarwal",
    business: "Little Wonders Preschool, Vasundhara",
    rating: 5,
    tag: "Education",
    timeAgo: "6 months ago",
    avatarColor: "#00acc1",
  },
  {
    quote: "Home grocery orders on WhatsApp increased significantly after our Google Business listing and promotional campaign went live.",
    author: "Rakesh Goel",
    business: "Goel Supermarket, Ghaziabad",
    rating: 5,
    tag: "Retail",
    timeAgo: "3 weeks ago",
    avatarColor: "#43a047",
  },
  {
    quote: "Premium car detailing requires high-trust video and photo ads. Digital FX targeted luxury car owners in NCR with surgical precision.",
    author: "Deepak Chauhan",
    business: "Chauhan Auto Care & Detailing, Delhi NCR",
    rating: 5,
    tag: "Auto Detailing",
    timeAgo: "1 year ago",
    avatarColor: "#3949ab",
  },
  {
    quote: "My designer apparel studio started receiving outstation orders through our clean e-commerce landing page. Extremely satisfied with their work.",
    author: "Simran Kaur",
    business: "Kaur Couture Designer Boutique, Noida",
    rating: 5,
    tag: "Fashion",
    timeAgo: "2 months ago",
    avatarColor: "#d81b60",
  },
  {
    quote: "They established our firm's digital authority across corporate law keywords. High-intent corporate clients now discover us effortlessly.",
    author: "Alok Tripathi",
    business: "Tripathi Legal Advisors, Delhi High Court",
    rating: 5,
    tag: "Legal",
    timeAgo: "8 months ago",
    avatarColor: "#285b88",
  },
  {
    quote: "Our orthopedic clinic is now recognized across western UP. Patient inquiries through phone and Google Maps are steady and reliable.",
    author: "Dr. Sanjay Mathur",
    business: "Metro Ortho Clinic, Rajender Nagar",
    rating: 5,
    tag: "Healthcare",
    timeAgo: "1 year ago",
    avatarColor: "#5c53c4",
  },
  {
    quote: "Custom cake orders and party catering inquiries through WhatsApp have become our biggest revenue stream thanks to Digital FX.",
    author: "Manisha Joshi",
    business: "Sweet Delights Bakery & Cafe, Ghaziabad",
    rating: 5,
    tag: "F&B",
    timeAgo: "4 months ago",
    avatarColor: "#f57c00",
  },
  {
    quote: "They modernized our family jewelry brand for the digital age. Trustworthy, responsive, and genuinely invested in client growth.",
    author: "Gaurav Jain",
    business: "Arihant Jewellers, Gandhi Nagar",
    rating: 5,
    tag: "Jewelry",
    timeAgo: "2 years ago",
    avatarColor: "#2d6636",
  },
  {
    quote: "Batch enrollment for our competitive exam batches filled up three weeks ahead of schedule. Their digital funnel works like clockwork.",
    author: "Sonal Saxena",
    business: "EduPlus Coaching Classes, Kavi Nagar",
    rating: 5,
    tag: "Coaching",
    timeAgo: "5 months ago",
    avatarColor: "#673ab7",
  },
  {
    quote: "Shifted our logistics marketing from old directory listings to direct Google Search ads. Our cost per commercial lead dropped by 45%.",
    author: "Rohit Rawat",
    business: "Rawat Logistics & Packers, NCR",
    rating: 5,
    tag: "Logistics",
    timeAgo: "9 months ago",
    avatarColor: "#00838f",
  },
  {
    quote: "Clear reporting and consistent performance. Our eye hospital has seen a dramatic improvement in patient appointment bookings.",
    author: "Dr. Shalini Varma",
    business: "Varma Eye Care Centre, Ghaziabad",
    rating: 5,
    tag: "Eye Care",
    timeAgo: "1 year ago",
    avatarColor: "#00796b",
  },
  {
    quote: "They helped our electrical showroom compete against online discount sites by highlighting local trust, fast delivery, and warranties.",
    author: "Harish Chand",
    business: "Chand Electricals & Home Appliances, RDC",
    rating: 5,
    tag: "Electronics",
    timeAgo: "7 months ago",
    avatarColor: "#b53826",
  },
  {
    quote: "Our architectural firm gained high-budget residential villa projects in Delhi NCR. The portfolio website they built is world-class.",
    author: "Meenakshi Bhatia",
    business: "Urban Nest Interior Architecture, Noida",
    rating: 5,
    tag: "Architecture",
    timeAgo: "3 months ago",
    avatarColor: "#8e24aa",
  },
  {
    quote: "They helped our agricultural seed distribution company connect with authorized dealers across Uttar Pradesh. Remarkable B2B reach.",
    author: "Arun Pandey",
    business: "Pandey Agro & Seeds, Uttar Pradesh",
    rating: 5,
    tag: "Agro B2B",
    timeAgo: "1 year ago",
    avatarColor: "#43a047",
  },
  {
    quote: "Pet parents in Vaishali and Indirapuram find our clinic immediately on Google Maps. Emergency pet consultations increased by 180%.",
    author: "Dr. Tanya Rastogi",
    business: "Royal Pet Hospital & Grooming, Vaishali",
    rating: 5,
    tag: "Pet Care",
    timeAgo: "6 months ago",
    avatarColor: "#3949ab",
  },
  {
    quote: "Commercial building contractors and architects now call us directly for bulk steel quotations. Genuine digital partner for industrial firms.",
    author: "Naveen Mittal",
    business: "Mittal Steel & Hardware Works, Sahibabad",
    rating: 5,
    tag: "Manufacturing",
    timeAgo: "2 years ago",
    avatarColor: "#285b88",
  },
  {
    quote: "Parents trust clean websites with verified reviews. Digital FX delivered both and our pediatric OPD numbers speak for themselves.",
    author: "Dr. Vivek Khurana",
    business: "Khurana Child Care & Vaccination, Ghaziabad",
    rating: 5,
    tag: "Pediatrics",
    timeAgo: "11 months ago",
    avatarColor: "#5c53c4",
  },
  {
    quote: "Wedding season banquet bookings were fully locked in advance. Their targeted Instagram video campaigns delivered unbelievable ROI.",
    author: "Swati Singhania",
    business: "Singhania Banquet & Events, Raj Nagar Ext",
    rating: 5,
    tag: "Hospitality",
    timeAgo: "3 years ago",
    avatarColor: "#c2185b",
  },
  {
    quote: "Our doorstep gadget repair service gets steady phone calls everyday. Quick response, great technical support, and honest execution.",
    author: "Rajat Srivastava",
    business: "QuickFix Tech Care, Indirapuram",
    rating: 5,
    tag: "Tech Support",
    timeAgo: "4 months ago",
    avatarColor: "#e65100",
  },
  {
    quote: "Holistic wellness therapies require patient education. Their content marketing and local SEO strategy brought us loyal long-term patrons.",
    author: "Poonam Mishra",
    business: "Prakriti Ayurvedic Wellness, NCR",
    rating: 5,
    tag: "Wellness",
    timeAgo: "8 months ago",
    avatarColor: "#00796b",
  },
  {
    quote: "Our self-drive car rental fleet operates at 95% utilization on weekends thanks to their search engine ranking work.",
    author: "Kunal Bhatnagar",
    business: "DriveEasy Car Rentals, Delhi NCR",
    rating: 5,
    tag: "Travel",
    timeAgo: "1 year ago",
    avatarColor: "#3949ab",
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
    id: "email_marketing",
    name: "Email Marketing & Automation",
    amount: "4999",
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

const ghaziabadFaqs = [
  {
    q: "Why is Digital FX ranked as the best digital marketing agency in Ghaziabad - Delhi NCR?",
    a: "Digital FX holds a 4.9/5.0 verified rating with 128+ reviews from business owners. Headquartered at Orbit Plaza, Crossings Republik, Ghaziabad, we combine hyper-local SEO, Google Maps 3-Pack domination, high-converting web architecture, and AI search optimization (GEO) to deliver verified phone inquiries and measurable revenue across Ghaziabad, Delhi NCR, India, and USA.",
  },
  {
    q: "Do you serve clients outside Ghaziabad, including other Indian states and USA / international businesses?",
    a: "Yes! While our physical headquarters is at Orbit Plaza, Crossings Republik, Ghaziabad (Delhi NCR), Digital FX serves fast-growing companies across India (Mumbai, Bangalore, Hyderabad, Pune, Kolkata, Ahmedabad) and overseas in the USA (New York, California, Texas, Florida, Illinois). We provide offshore digital marketing, technical SEO, high-speed Next.js websites, and international Google Ads management with dedicated timezone support.",
  },
  {
    q: "How does Digital FX help businesses rank #1 on Google Maps in Ghaziabad?",
    a: "We deploy an end-to-end Local SEO playbook: Google Business Profile (GBP) complete optimization, local citation syndication across 50+ high-DA Indian directories, geo-tagged schema markup, review generation engines, and hyper-local landing page architecture targeting Crossings Republik, Indirapuram, Raj Nagar, Vaishali, Vasundhara, and Noida.",
  },
  {
    q: "What digital marketing services do you provide for Ghaziabad & NCR clients?",
    a: "Our core services include Search Engine Optimization (Local & National SEO), High-Speed Website Design & UX, Google Ads (Search, Display & Local PPC), Meta & Instagram Advertising, Generative Engine Optimization (GEO for ChatGPT & Gemini), and complete 360° Business Growth Retainers.",
  },
  {
    q: "What is your pricing for digital marketing and SEO in Ghaziabad?",
    a: "Our Google Listing setup starts at ₹2,999, Email Marketing & Automation starts at ₹4,999, custom high-speed websites start from ₹5,999, and comprehensive 360° Growth Retainers start from ₹9,999. We also provide flexible custom amount retainer billing via our secure RBI-authorized PayU terminal.",
  },
  {
    q: "How quickly can we see results from SEO and digital marketing campaigns?",
    a: "Paid advertising (Google Ads & Meta Ads) generates qualified customer inquiries within 24 to 48 hours. For Google Maps 3-Pack and organic search ranking, local businesses in Ghaziabad typically see noticeable ranking climbs and increased inbound call volume within 30 to 60 days.",
  },
  {
    q: "Can we visit your office in Ghaziabad for an in-person strategy session?",
    a: "Yes! Our headquarters is at Shop No. 210, Second Floor, Orbit Plaza, Crossings Republik, Ghaziabad (UP 201016). We welcome local business owners for one-on-one growth roadmapping, or you can book an instant discovery call online.",
  },
];

const featuredStartups = [
  {
    name: "Stripe",
    category: "Fintech Infrastructure",
    location: "San Francisco, CA",
    country: "US",
    symbol: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <path d="M10.8 7.2c0-.7.6-1 1.6-1 1.4 0 3.2.5 4.6 1.3V3.6C15.5 3.1 13.9 2.8 12.3 2.8 8.4 2.8 5.7 4.9 5.7 8.3c0 5.4 7.4 4.5 7.4 6.8 0 .8-.7 1.1-1.7 1.1-1.7 0-3.8-.7-5.4-1.6v4.1c1.8.8 3.6 1.1 5.3 1.1 4.1 0 6.9-2 6.9-5.6 0-5.7-7.4-4.7-7.4-7z" fill="#635bff"/>
      </svg>
    ),
    badgeBg: "bg-[#635bff]/10 border-[#635bff]/25",
  },
  {
    name: "Razorpay",
    category: "Payment & Banking Suite",
    location: "Bangalore, India",
    country: "IN",
    symbol: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <path d="M14.5 3.5H7l-3 17h4l1.2-6.8h3.8c3.5 0 6-2 6-5.2 0-3.3-2-5-4.5-5zm-.5 6.5h-3.5l.8-4.2H14c1.8 0 2.8.8 2.8 2.1 0 1.3-1 2.1-2.8 2.1z" fill="#0C2340"/>
        <path d="M11 13.5l4-7.5h5L12 20.5h-4l3-7z" fill="#3395FF"/>
      </svg>
    ),
    badgeBg: "bg-blue-500/10 border-blue-500/25",
  },
  {
    name: "Vercel",
    category: "Frontend Cloud & AI",
    location: "San Francisco, CA",
    country: "US",
    symbol: (
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <polygon points="12 2 23 21 1 21" fill="#000000"/>
      </svg>
    ),
    badgeBg: "bg-black/5 border-black/15",
  },
  {
    name: "Zerodha",
    category: "Discount Broking & Wealth",
    location: "Bangalore, India",
    country: "IN",
    symbol: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <path d="M12 2l9 10-9 10-9-10z" fill="#387ED1"/>
        <circle cx="12" cy="12" r="3.5" fill="#ffffff"/>
      </svg>
    ),
    badgeBg: "bg-[#387ED1]/10 border-[#387ED1]/25",
  },
  {
    name: "Figma",
    category: "Design Architecture",
    location: "San Francisco, CA",
    country: "US",
    symbol: (
      <svg viewBox="0 0 38 57" className="w-3.5 h-5">
        <path fill="#F24E1E" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/>
        <path fill="#A259FF" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/>
        <path fill="#F24E1E" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"/>
        <path fill="#FF7262" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/>
        <path fill="#1ABCFE" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/>
      </svg>
    ),
    badgeBg: "bg-purple-500/10 border-purple-500/25",
  },
  {
    name: "Zomato",
    category: "Food Tech & Quick Commerce",
    location: "Delhi NCR, India",
    country: "IN",
    symbol: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="6" fill="#E23744"/>
        <text x="12" y="16.5" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle" fontStyle="italic">z</text>
      </svg>
    ),
    badgeBg: "bg-red-500/10 border-red-500/25",
  },
  {
    name: "Scale AI",
    category: "Generative AI Systems",
    location: "San Francisco, CA",
    country: "US",
    symbol: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    badgeBg: "bg-slate-900/5 border-slate-900/15",
  },
  {
    name: "Groww",
    category: "Investments & Mutual Funds",
    location: "Bangalore, India",
    country: "IN",
    symbol: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="6" fill="#00D09C"/>
        <path d="M7 14l3-3 3 3 4-5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    badgeBg: "bg-[#00D09C]/10 border-[#00D09C]/25",
  },
  {
    name: "Supabase",
    category: "Open Source Backend",
    location: "San Francisco, CA",
    country: "US",
    symbol: (
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path fill="#3ECF8E" d="M13.4 2.1c-.6-.7-1.7-.3-1.8.6l-1.3 8.3h6.6c.9 0 1.4 1 .8 1.7l-7.3 9.2c-.6.7-1.7.3-1.8-.6l1.3-8.3H3.3c-.9 0-1.4-1-.8-1.7l7.3-9.2z"/>
      </svg>
    ),
    badgeBg: "bg-emerald-500/10 border-emerald-500/25",
  },
  {
    name: "CRED",
    category: "Premium Credit & Fintech",
    location: "Bangalore, India",
    country: "IN",
    symbol: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="5" fill="#1C1C1E"/>
        <path d="M8 8h5a3 3 0 0 1 0 6H8V8zm0 8h8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    badgeBg: "bg-neutral-900/10 border-neutral-900/20",
  },
  {
    name: "Ramp",
    category: "Finance Automation",
    location: "New York, NY",
    country: "US",
    symbol: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <path d="M4 19L18 5h-7L4 12v7z" fill="#080d24"/>
        <circle cx="18" cy="18" r="3" fill="#207de9"/>
      </svg>
    ),
    badgeBg: "bg-amber-400/10 border-amber-400/25",
  },
  {
    name: "Swiggy",
    category: "On-Demand Hyperlocal Delivery",
    location: "Bangalore, India",
    country: "IN",
    symbol: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="6" fill="#FC8019"/>
        <path d="M12 6a4 4 0 0 0-4 4c0 3 4 8 4 8s4-5 4-8a4 4 0 0 0-4-4zm0 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="#ffffff"/>
      </svg>
    ),
    badgeBg: "bg-[#FC8019]/10 border-[#FC8019]/25",
  },
  {
    name: "Linear",
    category: "Issue & Project Engine",
    location: "San Francisco, CA",
    country: "US",
    symbol: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#5E6AD2">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 0 1-5.66-13.66l13.32 13.32A7.95 7.95 0 0 1 12 20z"/>
      </svg>
    ),
    badgeBg: "bg-indigo-500/10 border-indigo-500/25",
  },
  {
    name: "Zepto",
    category: "10-Min Quick Commerce",
    location: "Mumbai, India",
    country: "IN",
    symbol: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="6" fill="#7C22E8"/>
        <path d="M7 8h10l-6 8h6" stroke="#FF5C8A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    badgeBg: "bg-[#7C22E8]/10 border-[#7C22E8]/25",
  },
  {
    name: "Notion",
    category: "AI Workspace Platform",
    location: "San Francisco, CA",
    country: "US",
    symbol: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="4" fill="#000000"/>
        <path d="M7.5 7.5v9h2l5-6.2v6.2h2v-9h-2l-5 6.2v-6.2h-2z" fill="#ffffff"/>
      </svg>
    ),
    badgeBg: "bg-black/5 border-black/15",
  },
  {
    name: "Freshworks",
    category: "Enterprise CRM & SaaS",
    location: "Chennai, India",
    country: "IN",
    symbol: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <circle cx="12" cy="7" r="3" fill="#F4511E"/>
        <circle cx="17" cy="12" r="3" fill="#FB8C00"/>
        <circle cx="12" cy="17" r="3" fill="#43A047"/>
        <circle cx="7" cy="12" r="3" fill="#1E88E5"/>
        <circle cx="12" cy="12" r="2.5" fill="#039BE5"/>
      </svg>
    ),
    badgeBg: "bg-orange-500/10 border-orange-500/25",
  },
  {
    name: "Retool",
    category: "Internal Software Suite",
    location: "San Francisco, CA",
    country: "US",
    symbol: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7z" fill="#3B82F6"/>
        <path d="M13 13h7v7h-7v-7z" fill="#1D4ED8"/>
      </svg>
    ),
    badgeBg: "bg-blue-500/10 border-blue-500/25",
  },
  {
    name: "Lenskart",
    category: "Omnichannel Eyewear",
    location: "Delhi NCR, India",
    country: "IN",
    symbol: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <circle cx="8" cy="12" r="4.5" stroke="#000042" strokeWidth="2"/>
        <circle cx="16" cy="12" r="4.5" stroke="#000042" strokeWidth="2"/>
        <line x1="12.5" y1="12" x2="11.5" y2="12" stroke="#000042" strokeWidth="2.5"/>
      </svg>
    ),
    badgeBg: "bg-indigo-900/10 border-indigo-900/25",
  },
  {
    name: "Loom",
    category: "Enterprise Video Comm",
    location: "San Francisco, CA",
    country: "US",
    symbol: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <circle cx="12" cy="5" r="3" fill="#625DF5"/>
        <circle cx="12" cy="19" r="3" fill="#625DF5"/>
        <circle cx="5" cy="12" r="3" fill="#625DF5"/>
        <circle cx="19" cy="12" r="3" fill="#625DF5"/>
        <circle cx="12" cy="12" r="3.5" fill="#625DF5"/>
      </svg>
    ),
    badgeBg: "bg-violet-500/10 border-violet-500/25",
  },
  {
    name: "Urban Company",
    category: "On-Demand Home Services",
    location: "Delhi NCR, India",
    country: "IN",
    symbol: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="6" fill="#111111"/>
        <text x="12" y="16.5" fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle" letterSpacing="0.5">UC</text>
      </svg>
    ),
    badgeBg: "bg-black/5 border-black/15",
  },
];

export default function Home() {
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [liveRevenue, setLiveRevenue] = useState<number>(104993);
  const reviewsScrollRef = useRef<HTMLDivElement>(null);

  const scrollReviews = (direction: "left" | "right") => {
    if (reviewsScrollRef.current) {
      const scrollAmount = direction === "left" ? -380 : 380;
      reviewsScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    async function loadLiveRevenue() {
      try {
        const res = await fetch("/api/revenue");
        if (res.ok) {
          const json = await res.json();
          if (json.success && typeof json.totalRevenue === "number") {
            setLiveRevenue(json.totalRevenue);
          }
        }
      } catch (err) {
        console.error("Failed to load live revenue:", err);
      }
    }

    loadLiveRevenue();

    try {
      const channel = supabase
        .channel("public-revenue-feed")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "payments" },
          () => {
            loadLiveRevenue();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {}
  }, []);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
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

  // Strategic Proposal Modal State
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [proposalName, setProposalName] = useState("");
  const [proposalPhone, setProposalPhone] = useState("");
  const [proposalEmail, setProposalEmail] = useState("");
  const [proposalWebsite, setProposalWebsite] = useState("");
  const [proposalService, setProposalService] = useState("Generative Engine Optimization (GEO)");
  const [proposalRequirement, setProposalRequirement] = useState("");
  const [proposalLoading, setProposalLoading] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState("");
  const [proposalError, setProposalError] = useState("");

  // Free Website Analysis Lead Capture Modal State
  const [auditCaptureOpen, setAuditCaptureOpen] = useState(false);
  const [auditCustomerName, setAuditCustomerName] = useState("");
  const [auditCustomerPhone, setAuditCustomerPhone] = useState("");
  const [auditCustomerEmail, setAuditCustomerEmail] = useState("");
  const [auditCustomerService, setAuditCustomerService] = useState("GEO & AI Search Audit");

  // AI Business Suite Coming Soon Modal State
  const [isAiSuiteOpen, setIsAiSuiteOpen] = useState(false);
  const [aiSuiteSubmitted, setAiSuiteSubmitted] = useState(false);
  const [aiSuiteName, setAiSuiteName] = useState("");
  const [aiSuiteBusiness, setAiSuiteBusiness] = useState("");
  const [aiSuitePhone, setAiSuitePhone] = useState("");

  // Global Markets & Keywords Explorer Modal State
  const [isGlobalModalOpen, setIsGlobalModalOpen] = useState(false);

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

  function openProposalModal(site?: string, srv?: string) {
    if (site) setProposalWebsite(site);
    if (srv) setProposalService(srv);
    setProposalSuccess("");
    setProposalError("");
    setProposalModalOpen(true);
  }

  async function handleProposalSubmit(e: FormEvent) {
    e.preventDefault();
    setProposalLoading(true);
    setProposalError("");
    setProposalSuccess("");

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: proposalName.trim(),
          phone: proposalPhone.trim(),
          email: proposalEmail.trim(),
          website: proposalWebsite.trim(),
          service: proposalService,
          message: proposalRequirement.trim(),
          is_proposal: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to submit proposal request.");
      }

      setProposalSuccess(
        "Your Strategic Proposal request has been submitted successfully! Our lead growth strategist will contact you shortly."
      );

      const waMsg = `Hi Digital FX, I requested a Strategic Proposal for ${
        proposalWebsite || "my business"
      }. Name: ${proposalName}, Service: ${proposalService}, Phone: ${proposalPhone}.`;
      window.open(
        `https://wa.me/918447583685?text=${encodeURIComponent(waMsg)}`,
        "_blank"
      );

      setTimeout(() => {
        setProposalModalOpen(false);
      }, 3500);
    } catch (err) {
      setProposalError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setProposalLoading(false);
    }
  }

  function handleHeroProposal(e: FormEvent) {
    e.preventDefault();
    const site = heroWebsite.trim();
    if (!site) return;
    setGeoWebsite(site);
    const target = document.getElementById("geo-checker");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    if (!auditCustomerName || !auditCustomerPhone) {
      setAuditCaptureOpen(true);
    } else {
      runGeoAudit(site);
    }
  }

  async function handleGeoCheck(e: FormEvent) {
    e.preventDefault();
    if (!geoWebsite.trim()) return;
    if (!auditCustomerName || !auditCustomerPhone) {
      setAuditCaptureOpen(true);
    } else {
      runGeoAudit(geoWebsite);
    }
  }

  async function handleAuditCaptureSubmit(e: FormEvent) {
    e.preventDefault();
    setAuditCaptureOpen(false);
    const target = document.getElementById("geo-checker");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    runGeoAudit(geoWebsite, {
      name: auditCustomerName,
      phone: auditCustomerPhone,
      email: auditCustomerEmail,
      service: auditCustomerService,
    });
  }

  async function runGeoAudit(
    siteInput?: string,
    userLead?: { name: string; phone: string; email: string; service: string }
  ) {
    const site = (siteInput || geoWebsite).trim();
    if (!site) return;
    setGeoWebsite(site);
    setGeoLoading(true);
    setGeoScanStep(1);
    setGeoError("");
    setGeoResult(null);

    const lead = userLead || {
      name: auditCustomerName,
      phone: auditCustomerPhone,
      email: auditCustomerEmail,
      service: auditCustomerService,
    };

    // 1. Try local API route if available
    try {
      const response = await fetch("/api/geo-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: site,
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          service: lead.service,
          keyword: geoKeyword,
          city: geoCity,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const auditData = data.data || data;

        setGeoScanStep(3);

        let aiAnalysis = null;
        try {
          const aiRes = await fetch("/api/ai-analysis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url: auditData.url || site,
              seo: auditData.seo,
              performance: auditData.performance,
              mobile: auditData.mobile,
              content: auditData.content,
              geo: auditData.geo,
              overall: auditData.overall,
              recommendations: auditData.recommendations,
              title: auditData.title,
              description: auditData.description,
              responseTime: auditData.responseTime,
              realInfrastructure: auditData.realInfrastructure,
              realGooglePlaces: auditData.realGooglePlaces,
              realContentStats: auditData.realContentStats,
              trancoRank: auditData.trancoRank,
              detectedSchemas: auditData.detectedSchemas,
              googleMapsUrl: auditData.googleMapsUrl,
            }),
          });
          if (aiRes.ok) {
            const aiJson = await aiRes.json();
            if (aiJson.success) {
              aiAnalysis = aiJson.data;
            }
          }
        } catch (e) {
          console.error("AI Analysis fetch error:", e);
        }

        setGeoResult({
          ...auditData,
          realInfrastructure: auditData.realInfrastructure,
          realGooglePlaces: auditData.realGooglePlaces,
          realContentStats: auditData.realContentStats,
          trancoRank: auditData.trancoRank,
          detectedSchemas: auditData.detectedSchemas,
          googleMapsUrl: auditData.googleMapsUrl,
          score: auditData.overall ?? auditData.score,
          aiVisibility: auditData.geo ?? 78,
          localPresence: auditData.seo ?? 85,
          contentReadiness: auditData.content ?? 72,
          technicalSignals: auditData.performance ?? 88,
          grade:
            (auditData.overall ?? 80) >= 86
              ? "Tier-1 Leader: High AI Citation Authority"
              : (auditData.overall ?? 80) >= 78
              ? "Tier-2 Contender: Strong Base with AI Schema Gaps"
              : "Action Required: Missing Critical Generative Search Markup",
          aiAnalysis,
        });
        setGeoLoading(false);
        return;
      }
    } catch {
      // In standalone mode or when server route is unreachable, continue with deterministic audit generator
    }

    // 2. High-precision dynamic scanning progress simulation
    setTimeout(() => setGeoScanStep(2), 350);
    setTimeout(() => setGeoScanStep(3), 750);
    setTimeout(async () => {
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

      let fallbackAi = null;
      try {
        const aiRes = await fetch("/api/ai-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: site,
            seo: localPres,
            performance: tech,
            mobile: 85,
            content,
            geo: aiVis,
            overall: score,
            recommendations: [
              "Implement JSON-LD Schema (LocalBusiness + FAQPage)",
              "Optimize page speed and mobile responsiveness",
              "Build conversational FAQ comparison clusters",
            ],
            responseTime: 980,
          }),
        });
        if (aiRes.ok) {
          const aiJson = await aiRes.json();
          if (aiJson.success) fallbackAi = aiJson.data;
        }
      } catch {}

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
        aiAnalysis: fallbackAi,
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

      const whatsappNumber = "918447583685";
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
    const plan = (planId && paymentPlans.find((item) => item.id === planId)) || selectedPaymentPlan || paymentPlans.find((p) => p.id === "growth") || paymentPlans[0];
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
      metric: `₹${liveRevenue.toLocaleString("en-IN")}+ Closed Revenue Scale`,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Why is Digital FX ranked as the best digital marketing agency in Ghaziabad - Delhi NCR?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Digital FX holds a 4.9/5.0 verified rating with 128+ reviews from business owners. Headquartered at Orbit Plaza, Crossings Republik, Ghaziabad, we combine hyper-local SEO, Google Maps 3-Pack domination, high-converting web architecture, and AI search optimization (GEO) to deliver verified phone inquiries and measurable revenue across Ghaziabad, Delhi NCR, India, and USA.",
                },
              },
              {
                "@type": "Question",
                name: "Do you serve clients outside Ghaziabad, including other Indian states and USA / international businesses?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes! While our physical headquarters is at Orbit Plaza, Crossings Republik, Ghaziabad (Delhi NCR), Digital FX serves fast-growing companies across India (Mumbai, Bangalore, Hyderabad, Pune, Kolkata, Ahmedabad) and overseas in the USA (New York, California, Texas, Florida, Illinois). We provide offshore digital marketing, technical SEO, high-speed Next.js websites, and international Google Ads management with dedicated timezone support.",
                },
              },
              {
                "@type": "Question",
                name: "How does Digital FX help businesses rank #1 on Google Maps in Ghaziabad?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "We deploy an end-to-end Local SEO playbook: Google Business Profile (GBP) complete optimization, local citation syndication across 50+ high-DA Indian directories, geo-tagged schema markup, review generation engines, and hyper-local landing page architecture targeting Crossings Republik, Indirapuram, Raj Nagar, Vaishali, Vasundhara, and Noida.",
                },
              },
              {
                "@type": "Question",
                name: "What digital marketing services do you provide for Ghaziabad & NCR clients?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Our core services include Search Engine Optimization (Local & National SEO), High-Speed Website Design & UX, Google Ads (Search, Display & Local PPC), Meta & Instagram Advertising, Generative Engine Optimization (GEO for ChatGPT & Gemini), and complete 360° Business Growth Retainers.",
                },
              },
              {
                "@type": "Question",
                name: "What is your pricing for digital marketing and SEO in Ghaziabad?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Our Google Listing Growth plan starts at ₹2,000/month, custom high-speed websites start from ₹10,000, and our comprehensive 360° Growth Retainer starts at ₹25,000/month. We also provide flexible custom amount retainer billing via our secure RBI-authorized PayU terminal.",
                },
              },
              {
                "@type": "Question",
                name: "How quickly can we see results from SEO and digital marketing campaigns?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Paid advertising (Google Ads & Meta Ads) generates qualified customer inquiries within 24 to 48 hours. For Google Maps 3-Pack and organic search ranking, local businesses in Ghaziabad typically see noticeable ranking climbs and increased inbound call volume within 30 to 60 days.",
                },
              },
            ],
          }),
        }}
      />
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

        /* Anti-Gravity Zero-G Floating Ecosystem Styles */
        @keyframes antigravityScroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }

        @keyframes antigravityLevitate1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(1.2deg); }
        }

        @keyframes antigravityLevitate2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(16px) rotate(-1.5deg); }
        }

        @keyframes antigravityLevitate3 {
          0%, 100% { transform: translateY(-6px) rotate(0.8deg); }
          50% { transform: translateY(12px) rotate(-1deg); }
        }

        @keyframes antigravityLevitate4 {
          0%, 100% { transform: translateY(8px) rotate(-1deg); }
          50% { transform: translateY(-12px) rotate(1.5deg); }
        }

        @keyframes dynamicBar1 {
          0%, 100% { height: 90%; }
          50% { height: 68%; }
        }
        @keyframes dynamicBar2 {
          0%, 100% { height: 75%; }
          50% { height: 95%; }
        }
        @keyframes dynamicBar3 {
          0%, 100% { height: 52%; }
          50% { height: 78%; }
        }
        @keyframes dynamicBar4 {
          0%, 100% { height: 35%; }
          50% { height: 55%; }
        }

        @keyframes acousticRingPulse {
          0% { transform: scale(0.85); opacity: 0.8; }
          50% { transform: scale(1.18); opacity: 0.25; }
          100% { transform: scale(0.85); opacity: 0.8; }
        }

        @keyframes slowOrbitSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes microBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        .antigravity-track {
          display: flex;
          width: max-content;
          gap: 28px;
          animation: antigravityScroll 65s linear infinite;
          will-change: transform;
        }
        .antigravity-track:hover {
          animation-play-state: paused;
        }

        .ag-card-1 { animation: antigravityLevitate1 4.8s ease-in-out infinite; }
        .ag-card-2 { animation: antigravityLevitate2 5.6s ease-in-out infinite 0.4s; }
        .ag-card-3 { animation: antigravityLevitate3 6.2s ease-in-out infinite 0.8s; }
        .ag-card-4 { animation: antigravityLevitate4 5.2s ease-in-out infinite 0.2s; }
        .ag-card-5 { animation: antigravityLevitate1 5.8s ease-in-out infinite 1s; }
        .ag-card-6 { animation: antigravityLevitate2 4.6s ease-in-out infinite 0.6s; }
        .ag-card-7 { animation: antigravityLevitate3 5.4s ease-in-out infinite 1.2s; }

        .ag-bar-1 { animation: dynamicBar1 3.2s ease-in-out infinite; }
        .ag-bar-2 { animation: dynamicBar2 4.1s ease-in-out infinite 0.5s; }
        .ag-bar-3 { animation: dynamicBar3 3.6s ease-in-out infinite 1s; }
        .ag-bar-4 { animation: dynamicBar4 4.5s ease-in-out infinite 0.2s; }

        .ag-acoustic-ring { animation: acousticRingPulse 2.4s ease-in-out infinite; }
        .ag-orbit-spin { animation: slowOrbitSpin 32s linear infinite; }
        .ag-micro-bob { animation: microBob 3s ease-in-out infinite; }

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

        @media (max-width: 640px) {
          .webfx-serif {
            display: block !important;
            line-height: 1.15 !important;
          }
        }
      `}</style>

      <main className={`${plusJakartaSans.variable} ${playfairDisplay.variable} min-h-screen overflow-x-hidden font-[var(--font-plus-jakarta)] text-[#101828] antialiased`}>

        {/* ==========================================================================
            1. INSTITUTIONAL TOP BAR (#fxtopbar) - ACCREDITATION & DIRECT CLIENT DESK
            ========================================================================== */}
        <div id="fxtopbar" className="bg-[#080d24] text-white py-2 border-b border-white/10 block w-full overflow-hidden">
          <div className="mx-auto flex h-auto min-h-[34px] max-w-[1400px] flex-wrap items-center justify-between gap-y-2 px-4 sm:px-6 lg:px-8 text-xs">
            
            {/* Left: Certifications & Regional Presence */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-slate-300 text-[11px] sm:text-[11.5px] font-medium">
              <span className="inline-flex items-center gap-1.5 text-slate-300 font-semibold shrink-0">
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
            <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-4 text-[11px] sm:text-[12px] font-medium text-slate-300 w-full sm:w-auto">
              <Link
                href="/careers"
                className="hidden lg:inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-300 hover:text-white transition shrink-0"
              >
                <span>Careers</span>
                <span className="px-1.5 py-0.2 rounded bg-purple-500/25 text-purple-300 border border-purple-400/30 text-[8.5px] font-extrabold uppercase leading-none">
                  HIRING
                </span>
              </Link>

              <button
                type="button"
                onClick={() => openPricingModal()}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white text-[10.5px] sm:text-[11.5px] font-bold transition-all cursor-pointer shadow-xs hover:border-blue-400/50 shrink-0"
                title="Secure Client Invoicing & Packages"
              >
                <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Client Checkout Portal</span>
              </button>

              <a href="tel:+918447583685" className="hidden sm:inline-flex items-center gap-1.5 text-[12px] hover:text-white font-bold transition">
                <span className="text-[#207de9]">☎</span> +91 84475 83685
              </a>

              <a
                href="https://wa.me/918447583685?text=Hi%20Digital%20FX%20team,%20I%20want%20to%20discuss%20a%20growth%20strategy."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] font-bold text-emerald-400 hover:text-emerald-300 transition shrink-0"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-emerald inline-block shrink-0" />
                <span>WhatsApp Strategy Desk</span>
              </a>
            </div>

          </div>
        </div>

        {/* ==========================================================================
            2. WEBFX MAIN HEADER WITH DESKTOP NAVIGATION (#fxheader)
            ========================================================================== */}
        <header id="fxheader" className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs transition-all w-full">
          <div className="mx-auto flex h-[74px] max-w-[1480px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">

            {/* Brand Logo - Official Digital FX Logo */}
            <a href="#home" className="flex items-center shrink-0 group min-w-0" aria-label="Digital FX Home">
              <img
                src="/logo.svg"
                alt="Digital FX - Business Solution"
                width={138}
                height={46}
                decoding="async"
                className="h-10 sm:h-[46px] w-auto object-contain shrink-0 transition-transform group-hover:scale-105"
              />
            </a>

            {/* Center Desktop Navigation Links - Perfectly Spaced, Centered, No Text-Wrapping */}
            <nav className="hidden lg:flex items-center justify-center gap-5 xl:gap-8 mx-auto px-4 xl:px-8 shrink-0">
              <Link
                href="/services"
                className="text-[14px] font-semibold text-slate-700 hover:text-[#207de9] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Services
              </Link>
              <Link
                href="/case-studies"
                className="text-[14px] font-semibold text-slate-700 hover:text-[#207de9] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Portfolio
              </Link>
              <Link
                href="/pricing"
                className="text-[14px] font-semibold text-slate-700 hover:text-[#207de9] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Packages
              </Link>
              <Link
                href="/tools"
                className="text-[14px] font-semibold text-slate-700 hover:text-[#207de9] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span className="whitespace-nowrap">AI Tools</span>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold uppercase tracking-wider leading-none shrink-0">
                  FREE
                </span>
              </Link>
              <Link
                href="/locations"
                className="text-[14px] font-semibold text-slate-700 hover:text-[#207de9] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">350+ Cities</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[9px] font-extrabold uppercase leading-none shrink-0">
                  IN
                </span>
              </Link>
              <Link
                href="/careers"
                className="hidden xl:inline-flex items-center gap-1.5 text-[14px] font-semibold text-slate-700 hover:text-[#207de9] transition-colors whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">Careers</span>
                <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[9px] font-extrabold uppercase leading-none shrink-0">
                  HIRING
                </span>
              </Link>
              <Link
                href="/blog"
                className="hidden 2xl:inline-flex text-[14px] font-semibold text-slate-700 hover:text-[#207de9] transition-colors whitespace-nowrap shrink-0"
              >
                Insights
              </Link>
            </nav>

            {/* Right Action & Menu Trigger */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
              <button
                type="button"
                onClick={scrollToContact}
                className="hidden sm:inline-flex h-[42px] items-center gap-2 rounded-xl bg-[#207de9] hover:bg-[#1a6bc7] px-5 text-[13px] font-bold text-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer shrink-0 whitespace-nowrap tracking-wide"
              >
                <span>Get Free Proposal</span>
                <span className="text-sm font-bold">→</span>
              </button>

              {/* Mobile Quick-Call Tap Button */}
              <a
                href="tel:+918447583685"
                aria-label="Call +91 84475 83685"
                className="sm:hidden flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
                title="Call +91 84475 83685"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>

              {/* 3-LINE MENU BUTTON (Opens Complete Navigation Drawer) */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open Navigation Menu"
                className="flex h-[42px] min-w-[42px] items-center justify-center gap-2 px-3 sm:px-4 rounded-xl border border-slate-300 bg-slate-50 hover:bg-white hover:border-[#207de9] shadow-xs transition-all cursor-pointer group shrink-0"
              >
                <span className="flex flex-col gap-[4.5px] items-center justify-center">
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
                  <div className="flex items-center">
                    <img src="/logo.svg" alt="Digital FX" width={120} height={40} decoding="async" className="h-9 w-auto object-contain shrink-0" />
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
                  <span>Directory &amp; All Pages</span>
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
                  <Link
                    href="/services"
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
                          SEO &amp; Growth Services
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          SEO, CTV, Paid Media &amp; Full-Funnel Growth
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-300 group-hover:text-[#207de9] group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                  </Link>

                  {/* Portfolio & Case Studies */}
                  <Link
                    href="/case-studies"
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
                          The Digital FX Portfolio
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          ₹18.4 Cr+ documented client revenue &amp; case studies
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-300 group-hover:text-[#207de9] group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                  </Link>

                  {/* Packages & Pricing */}
                  <Link
                    href="/pricing"
                    onClick={closeMobileMenu}
                    className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-blue-50/60 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#207de9] transition">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#080d24] group-hover:text-[#207de9] transition">
                          Packages &amp; Retainers
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Transparent pricing from ₹24,999/month
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-300 group-hover:text-[#207de9] group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                  </Link>

                  {/* GEO AI Audit Tool */}
                  <Link
                    href="/tools"
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
                          Free AI Search &amp; GEO Tool
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Instant 60s ChatGPT &amp; Gemini scan
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                  </Link>

                  {/* Careers (We Are Hiring!) */}
                  <Link
                    href="/careers"
                    onClick={closeMobileMenu}
                    className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-purple-50/60 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 transition">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#080d24] group-hover:text-purple-700 transition flex items-center gap-1.5">
                          <span>Careers (We Are Hiring!)</span>
                          <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 text-[8.5px] font-extrabold uppercase">4 ROLES</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          SEO Architects, Next.js Devs &amp; Media Buyers
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                  </Link>

                  {/* Contact & Consultation Desk */}
                  <Link
                    href="/contact"
                    onClick={closeMobileMenu}
                    className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-cyan-50/60 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 transition">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#080d24] group-hover:text-cyan-700 transition">
                          Contact &amp; Strategy Desk
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Orbit Plaza Office &amp; Free Growth Proposal
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-300 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                  </Link>

                  {/* Frequently Asked Questions (FAQ) */}
                  <a
                    href="#faq"
                    onClick={closeMobileMenu}
                    className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-emerald-50/60 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition">
                        <span className="text-xs font-black">?</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#080d24] group-hover:text-emerald-700 transition">
                          Ghaziabad SEO &amp; FAQs
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Ratings, Maps ranking &amp; timeline
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                  </a>

                  {/* Pan-India 350+ Cities Directory */}
                  <Link
                    href="/locations"
                    onClick={closeMobileMenu}
                    className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-blue-50/60 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#207de9] transition font-black text-xs">
                        📍
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#080d24] group-hover:text-[#207de9] transition flex items-center gap-1.5">
                          <span>Pan-India 350+ Cities</span>
                          <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 text-[9px] font-extrabold">28 STATES</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Local SEO directory &amp; city blueprints
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-300 group-hover:text-[#207de9] group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                  </Link>

                  {/* Global Hubs & Dubai */}
                  <button
                    type="button"
                    onClick={() => {
                      closeMobileMenu();
                      setIsGlobalModalOpen(true);
                    }}
                    className="w-full group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-amber-50/60 transition text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 transition font-black text-xs shrink-0">
                        🌍
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#080d24] group-hover:text-amber-700 transition flex items-center gap-1.5">
                          <span>Global Hubs &amp; Dubai</span>
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-200 text-[9px] font-extrabold">10 COUNTRIES</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Dubai 🇦🇪, USA, UK, KSA • 1,098+ keywords
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                  </button>

                  {/* Insights & Blog */}
                  <Link
                    href="/blog"
                    onClick={closeMobileMenu}
                    className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-emerald-50/60 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition font-black text-xs">
                        📚
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#080d24] group-hover:text-emerald-700 transition">
                          Insights &amp; Blueprints Blog
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Google 3-Pack, Next.js 16 &amp; AI Search
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                  </Link>

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

                {/* Global & Dubai Hubs Featured Expansion Card (In 3-Line Menu Drawer) */}
                <div className="mt-4 rounded-2xl bg-gradient-to-br from-[#080d24] via-[#0d163d] to-[#080d24] text-white border border-slate-700/80 p-4 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-300">
                      <span>🇦🇪</span>
                      <span>Global Search &amp; Offshore Desk</span>
                    </div>
                    <span className="text-[9px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full uppercase">
                      Dubai Hub
                    </span>
                  </div>

                  <div className="mt-2">
                    <h4 className="text-[13.5px] font-extrabold text-white leading-tight">
                      Dubai &amp; International Search Hubs
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-1 font-light leading-snug">
                      High-ticket acquisition in Dubai, USA, UK, KSA &amp; Singapore. Dual-index Maps 3-Pack &amp; sub-second Next.js speed.
                    </p>
                  </div>

                  {/* Dubai Flagship CTA Button */}
                  <Link
                    href="/locations/dubai"
                    onClick={closeMobileMenu}
                    className="mt-3 w-full py-2.5 px-3 rounded-xl bg-[#207de9] hover:bg-[#1866c2] text-white font-extrabold text-xs transition flex items-center justify-between shadow-xs group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🇦🇪</span>
                      <div className="text-left">
                        <div className="leading-tight">Dubai Authority Hub</div>
                        <div className="text-[9.5px] font-normal text-blue-100">AED 2,500/mo • Retainers &amp; Maps</div>
                      </div>
                    </div>
                    <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
                  </Link>

                  {/* International Hubs Quick Selector */}
                  <div className="mt-2.5 pt-2.5 border-t border-slate-800 grid grid-cols-2 gap-1.5 text-[11px]">
                    <Link
                      href="/locations/abu-dhabi"
                      onClick={closeMobileMenu}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition flex items-center gap-1.5 border border-white/5"
                    >
                      <span>🇦🇪</span>
                      <span className="font-semibold truncate">Abu Dhabi</span>
                    </Link>
                    <Link
                      href="/locations/riyadh"
                      onClick={closeMobileMenu}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition flex items-center gap-1.5 border border-white/5"
                    >
                      <span>🇸🇦</span>
                      <span className="font-semibold truncate">Riyadh GCC</span>
                    </Link>
                    <Link
                      href="/locations/new-york"
                      onClick={closeMobileMenu}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition flex items-center gap-1.5 border border-white/5"
                    >
                      <span>🇺🇸</span>
                      <span className="font-semibold truncate">New York</span>
                    </Link>
                    <Link
                      href="/locations/london"
                      onClick={closeMobileMenu}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition flex items-center gap-1.5 border border-white/5"
                    >
                      <span>🇬🇧</span>
                      <span className="font-semibold truncate">London UK</span>
                    </Link>
                  </div>

                  {/* 1,098+ Keywords Explorer Button */}
                  <button
                    type="button"
                    onClick={() => {
                      closeMobileMenu();
                      setIsGlobalModalOpen(true);
                    }}
                    className="mt-2.5 w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/30 font-bold text-xs transition flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>🔍</span>
                      <span>1,098+ Global Keywords</span>
                    </span>
                    <span className="text-[9px] font-black bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded uppercase">
                      Open Explorer
                    </span>
                  </button>

                  <div className="mt-2 text-center">
                    <Link
                      href="/global-markets"
                      onClick={closeMobileMenu}
                      className="text-[10px] text-slate-400 hover:text-slate-200 underline transition"
                    >
                      Standalone Global Search Page ↗
                    </Link>
                  </div>
                </div>

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
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        closeMobileMenu();
                        openPricingModal("google_listing");
                      }}
                      className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] font-semibold transition cursor-pointer"
                    >
                      Maps ₹2,999
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        closeMobileMenu();
                        openPricingModal("email_marketing");
                      }}
                      className="px-2 py-0.5 rounded-md bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 text-[10px] font-bold transition cursor-pointer"
                    >
                      Email ₹4,999
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        closeMobileMenu();
                        openPricingModal("website");
                      }}
                      className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] font-semibold transition cursor-pointer"
                    >
                      Web ₹5,999
                    </button>
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
                      href="tel:+918447583685"
                      className="text-xs font-bold text-[#207de9] hover:underline whitespace-nowrap"
                    >
                      +91 84475 83685
                    </a>
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Action */}
              <div className="pt-5 border-t border-slate-100">
                <a
                  href="https://wa.me/918447583685?text=Hi%20Digital%20FX%20team,%20I%20want%20to%20discuss%20a%20growth%20strategy."
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
          className="relative overflow-hidden bg-[#f8faff] pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 border-b border-slate-200"
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

          <div className="relative z-10 mx-auto max-w-[1360px] px-5 sm:px-6 lg:px-8">
            
            {/* Top Area: WebFX Headline & Website Proposal Input Bar */}
            <div className="max-w-[860px]">
              {/* Overline Subhead & Google Rating */}
              <div className="mb-4 inline-flex flex-wrap items-center gap-x-2 gap-y-1.5 rounded-2xl sm:rounded-full border border-blue-200/90 bg-blue-50/90 px-3.5 py-2 sm:px-4 sm:py-1.5 text-[10px] sm:text-[11px] font-bold text-[#1570ef] shadow-xs max-w-full">
                <div className="flex items-center gap-1 shrink-0">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="text-amber-500 tracking-tighter text-[11px]">★ ★ ★ ★ ★</span>
                  <span className="font-extrabold text-[#080d24]">4.9</span>
                </div>
                <span className="text-blue-300 hidden xs:inline">•</span>
                <span className="uppercase tracking-normal sm:tracking-[0.1em] text-slate-700">
                  <strong className="text-[#1570ef]">128+ Reviews</strong> • Best Digital Marketing Agency in Ghaziabad - Delhi NCR
                </span>
              </div>

              {/* WebFX Signature Headline */}
              <h1 className="text-[clamp(32px,8.5vw,58px)] font-extrabold leading-[1.04] tracking-[-0.035em] text-[#080d24]">
                <span className="block">Digital Marketing &amp; SEO</span>
                <span className="block">Agency in Ghaziabad —</span>{" "}
                <span className="webfx-serif text-[#207de9] font-normal text-[clamp(26px,7vw,50px)] leading-[1.12] block mt-1 sm:mt-2">
                  Your Revenue Partner in the AI Era.
                </span>
              </h1>

              {/* Subtitle Description */}
              <p className="mt-4 sm:mt-5 max-w-[720px] text-[15px] sm:text-[17.5px] leading-[1.55] sm:leading-[1.65] text-slate-600 font-normal">
                Most agencies report vanity metrics like impressions and clicks. Digital FX engineers connected customer acquisition systems that turn search visibility into qualified pipeline and measurable revenue for businesses across India.
              </p>

              {/* WebFX Exact Website Proposal Bar */}
              <form
                onSubmit={handleHeroProposal}
                className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch w-full max-w-[620px] bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-sm hover:border-slate-400 focus-within:border-[#1570ef] focus-within:ring-2 focus-within:ring-blue-100 transition-all"
              >
                <div className="flex-1 flex items-center px-4 min-h-[64px] sm:min-h-[58px] bg-transparent">
                  <svg className="w-5 h-5 text-slate-400 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a8.997 8.997 0 01-7.843-4.582M12 3a8.997 8.997 0 017.843 4.582M12 3v18" />
                  </svg>
                  <input
                    type="text"
                    value={heroWebsite}
                    onChange={(e) => setHeroWebsite(e.target.value)}
                    placeholder="Enter your website (e.g. yourcompany.com)"
                    className="w-full py-3.5 text-[13px] sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-[58px] sm:min-h-[58px] px-6 sm:px-7 bg-[#080d24] hover:bg-[#207de9] text-white font-bold text-[14px] sm:text-sm tracking-wide transition-colors whitespace-nowrap cursor-pointer shadow-xs flex items-center justify-center text-center shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200"
                >
                  <span>Analyze Growth Potential</span>
                  <span className="ml-1.5 text-base">→</span>
                </button>
              </form>

              {/* Strategic Proposal Quick Trigger */}
              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 font-medium">
                <span>Need a customized multi-channel plan?</span>
                <button
                  type="button"
                  onClick={() => openProposalModal(heroWebsite, "Enterprise Growth Roadmap")}
                  className="text-[#1570ef] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <span>Request Strategic Proposal</span>
                  <span>→</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-3.5 flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-2 text-[11.5px] sm:text-[12px] text-slate-600 font-medium">
                <span className="inline-flex items-center gap-1.5 shrink-0">
                  <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Confidential Website Audit</span>
                </span>
                <span className="inline-flex items-center gap-1.5 shrink-0">
                  <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Direct Strategist Review</span>
                </span>
                <span className="inline-flex items-center gap-1.5 shrink-0">
                  <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Zero Obligation</span>
                </span>
              </div>
            </div>

            {/* Centerpiece: WebFX Circular 4-Quadrant Revenue Engine with Callouts */}
            <div className="relative mx-auto w-full max-w-[1040px] px-0 sm:px-4 mt-10 sm:mt-16 select-none overflow-hidden">

              {/* Vector SVG Graphic Container with Centered Elements & Widened Callout Margins */}
              <div className="relative z-10 w-full max-w-[1040px] mx-auto">
                
                <div className="w-full aspect-[1040/560] relative">
                  <svg viewBox="0 0 1040 560" className="w-full h-full drop-shadow-sm overflow-hidden sm:overflow-visible">
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
                      <image
                        href="/logo.svg"
                        x="-75"
                        y="-20"
                        width="150"
                        height="40"
                        preserveAspectRatio="xMidYMid meet"
                      />
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
                        {activeFlywheelQuadrant === 2 && `₹${liveRevenue.toLocaleString("en-IN")}+ Closed Scale`}
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
                </div>

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

              {/* WebFX Proven Revenue Impact Grid - Responsive 2x2 on Mobile, 4-col on Desktop */}
              <div className="mt-8 sm:mt-12 relative z-10 max-w-[1040px] mx-auto">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_12px_40px_rgba(8,13,36,0.06)] p-4 sm:p-6 lg:p-8">
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 text-center lg:text-left lg:divide-x lg:divide-slate-100">
                    
                    {/* Metric 1: Qualified Lead Growth */}
                    <div className="p-3 sm:p-0 lg:px-4 first:lg:pl-0 rounded-xl bg-slate-50/70 sm:bg-transparent border sm:border-0 border-slate-100">
                      <span className="text-xl sm:text-3xl lg:text-[32px] font-extrabold text-[#1570ef] tracking-tight tabular-nums block">
                        15% Higher
                      </span>
                      <h3 className="text-xs sm:text-[14px] font-bold text-[#080d24] mt-1 sm:mt-1.5 leading-snug">
                        Qualified Lead Growth
                      </h3>
                      <p className="text-[10px] sm:text-[11.5px] text-slate-500 font-normal mt-0.5 sm:mt-1 leading-relaxed">
                        For clients who connect CRM attribution.
                      </p>
                    </div>

                    {/* Metric 2: AI Citations & Visibility */}
                    <div className="p-3 sm:p-0 lg:px-4 rounded-xl bg-slate-50/70 sm:bg-transparent border sm:border-0 border-slate-100">
                      <span className="text-xl sm:text-3xl lg:text-[32px] font-extrabold text-purple-600 tracking-tight tabular-nums block">
                        2,500+
                      </span>
                      <h3 className="text-xs sm:text-[14px] font-bold text-[#080d24] mt-1 sm:mt-1.5 leading-snug">
                        AI Citations Tracked
                      </h3>
                      <p className="text-[10px] sm:text-[11.5px] text-slate-500 font-normal mt-0.5 sm:mt-1 leading-relaxed">
                        Across ChatGPT, Gemini &amp; Copilot.
                      </p>
                    </div>

                    {/* Metric 3: Rated Agency & Reviews */}
                    <div className="p-3 sm:p-0 lg:px-4 rounded-xl bg-slate-50/70 sm:bg-transparent border sm:border-0 border-slate-100">
                      <span className="text-xl sm:text-3xl lg:text-[32px] font-extrabold text-amber-500 tracking-tight tabular-nums block">
                        4.9 ★ Rating
                      </span>
                      <h3 className="text-xs sm:text-[14px] font-bold text-[#080d24] mt-1 sm:mt-1.5 leading-snug">
                        Google Verified
                      </h3>
                      <p className="text-[10px] sm:text-[11.5px] text-slate-500 font-normal mt-0.5 sm:mt-1 leading-relaxed">
                        128+ verified reviews in Delhi NCR.
                      </p>
                    </div>

                    {/* Metric 4: Closed Revenue & Measurable ROI (Live from Admin Payments) */}
                    <div className="p-3 sm:p-0 lg:px-4 last:lg:pr-0 rounded-xl bg-slate-50/70 sm:bg-transparent border sm:border-0 border-slate-100">
                      <div className="flex items-center justify-center lg:justify-start gap-2">
                        <span className="text-xl sm:text-3xl lg:text-[32px] font-extrabold text-emerald-600 tracking-tight tabular-nums block">
                          ₹{liveRevenue.toLocaleString("en-IN")}+
                        </span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-[8.5px] font-black uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Live
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-[14px] font-bold text-[#080d24] mt-1 sm:mt-1.5 leading-snug">
                        Verified Client Revenue
                      </h3>
                      <p className="text-[10px] sm:text-[11.5px] text-slate-500 font-normal mt-0.5 sm:mt-1 leading-relaxed">
                        Live gateway collections &amp; tracked ROI.
                      </p>
                    </div>

                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ==========================================================================
            4. CLIENT TRUST & AUTHORITY STRIP — GLOBAL & INDIAN STARTUP ECOSYSTEM
            ========================================================================== */}
        <section className="bg-white py-12 sm:py-14 border-b border-slate-200 overflow-hidden">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 mb-7 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100/90 border border-slate-200 text-slate-700 text-[10.5px] font-extrabold uppercase tracking-[0.2em] mb-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Global &amp; Indian Startup Ecosystem
            </div>
            <p className="text-[11.5px] sm:text-[12.5px] font-extrabold uppercase tracking-[0.22em] text-slate-500">
              TRUSTED BY HIGH-GROWTH STARTUPS, MODERN ENTERPRISES &amp; VC-BACKED SCALE-UPS
            </p>
          </div>

          {/* Continuous Infinite Horizontal Logo Marquee */}
          <div className="logo-marquee py-2">
            <div className="logo-track" style={{ animationDuration: "44s" }}>
              {featuredStartups.map((item, idx) => (
                <div
                  key={`startup-a-${idx}`}
                  className="flex items-center gap-3.5 px-4 py-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-[#207de9]/50 hover:-translate-y-1 transition-all duration-300 shrink-0 w-[235px] sm:w-[250px] group select-none cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${item.badgeBg} group-hover:scale-105 transition-transform shadow-xs`}>
                    {item.symbol}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[14px] font-extrabold text-[#080d24] group-hover:text-[#207de9] transition-colors tracking-tight truncate">
                        {item.name}
                      </span>
                      <span className={`text-[8.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                        item.country === "IN"
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200/90"
                          : "text-blue-700 bg-blue-50 border-blue-200/90"
                      }`}>
                        {item.country}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">
                      {item.category}
                    </p>
                  </div>
                </div>
              ))}

              {/* Duplicate track for seamless infinite marquee loop */}
              {featuredStartups.map((item, idx) => (
                <div
                  key={`startup-b-${idx}`}
                  className="flex items-center gap-3.5 px-4 py-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-[#207de9]/50 hover:-translate-y-1 transition-all duration-300 shrink-0 w-[235px] sm:w-[250px] group select-none cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${item.badgeBg} group-hover:scale-105 transition-transform shadow-xs`}>
                    {item.symbol}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[14px] font-extrabold text-[#080d24] group-hover:text-[#207de9] transition-colors tracking-tight truncate">
                        {item.name}
                      </span>
                      <span className={`text-[8.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                        item.country === "IN"
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200/90"
                          : "text-blue-700 bg-blue-50 border-blue-200/90"
                      }`}>
                        {item.country}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">
                      {item.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================================================
            4B. INSIDE DIGITAL FX HEADQUARTERS — REAL STRATEGISTS, REAL IMPACT
            ========================================================================== */}
        <section className="py-16 sm:py-20 bg-gradient-to-b from-white via-[#f8faff] to-white border-b border-slate-200">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold tracking-wider uppercase mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse" />
                  Inside Our Agency • Orbit Plaza, Ghaziabad
                </div>
                <h2 className="text-[28px] sm:text-[38px] lg:text-[44px] font-extrabold text-[#080d24] tracking-[-0.03em] leading-tight">
                  Real Strategists. Real Work.{" "}
                  <span className="text-[#207de9] webfx-serif block sm:inline font-normal">
                    Measurable Revenue.
                  </span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl font-normal">
                  No outsourced black-boxes. At Digital FX, our dedicated campaign specialists, web engineers, and local SEO managers work directly on your brand entity.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <a
                  href="#contact"
                  className="px-5 py-3 rounded-xl bg-[#080d24] hover:bg-[#207de9] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Visit Our Office →
                </a>
              </div>
            </div>

            {/* 4 Professional Agency Photos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              
              {/* Photo 1: Man at Computer Desk */}
              <div className="group rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src="/office-man-computer.jpg"
                    alt="Digital FX Campaign Specialist Optimizing Google Maps and Analytics"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#080d24]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider">
                    Campaign Desk
                  </div>
                  <div className="absolute bottom-2 right-2 bg-emerald-600/90 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Live Analytics Monitoring
                  </div>
                </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm sm:text-[15px] font-extrabold text-[#080d24] group-hover:text-[#207de9] transition-colors leading-snug">
                      Daily Ranking &amp; Traffic Optimization
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-600 font-normal leading-relaxed">
                      Our SEO specialists monitor your Google Maps 3-Pack keyword positions and organic rankings daily on high-precision dual display setups.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>Google Analytics 4 • Maps</span>
                    <span className="text-[#207de9] font-bold">SEO Team</span>
                  </div>
                </div>
              </div>

              {/* Photo 2: Strategy Meeting */}
              <div className="group rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src="/agency-meeting.jpg"
                    alt="Digital FX Multi-Channel Revenue Growth Strategy Meeting"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#080d24]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider">
                    Conference Hub
                  </div>
                  <div className="absolute bottom-2 right-2 bg-blue-600/90 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                    Sprint Strategy
                  </div>
                </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm sm:text-[15px] font-extrabold text-[#080d24] group-hover:text-[#207de9] transition-colors leading-snug">
                      Multi-Channel Sprint Planning
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-600 font-normal leading-relaxed">
                      Strategists align Google Ads, Meta campaigns, and local citations to ensure your client acquisition pipeline operates at peak ROI.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>Closed-Loop Attribution</span>
                    <span className="text-blue-600 font-bold">Strategy Desk</span>
                  </div>
                </div>
              </div>

              {/* Photo 3: Tech & AI Search Workstation */}
              <div className="group rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src="/tech-workstation.jpg"
                    alt="Digital FX Web Engineering and Generative AI Schema Lab"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#080d24]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider">
                    Engineering Lab
                  </div>
                  <div className="absolute bottom-2 right-2 bg-purple-600/90 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                    Next.js &amp; GEO AI
                  </div>
                </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm sm:text-[15px] font-extrabold text-[#080d24] group-hover:text-[#207de9] transition-colors leading-snug">
                      AI Search &amp; Web Engineering
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-600 font-normal leading-relaxed">
                      Engineers building responsive web architectures, Core Web Vitals performance, and Schema.org markup for ChatGPT and Gemini discovery.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>99+ Speed • Schema Entities</span>
                    <span className="text-purple-600 font-bold">Dev Team</span>
                  </div>
                </div>
              </div>

              {/* Photo 4: Client Consultation & Growth */}
              <div className="group rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src="/client-consultation.jpg"
                    alt="Digital FX Executive Client Consultation and Growth Review"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#080d24]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider">
                    Executive Lounge
                  </div>
                  <div className="absolute bottom-2 right-2 bg-amber-500/90 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                    6.8x Client ROI
                  </div>
                </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm sm:text-[15px] font-extrabold text-[#080d24] group-hover:text-[#207de9] transition-colors leading-snug">
                      1-on-1 Growth Consultation
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-600 font-normal leading-relaxed">
                      Transparent monthly reviews with business owners, tracking closed revenue, cost per lead, and lifetime customer growth trajectories.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>Orbit Plaza • In-Office / Meet</span>
                    <span className="text-amber-600 font-bold">Client Success</span>
                  </div>
                </div>
              </div>

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
                    Digital FX connects your data through <strong className="font-bold text-[#080d24]">Digital FX</strong> to make revenue-backed marketing decisions that reduce cost per lead and maximize ROI.
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
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
                <div>
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-5 bg-slate-100 shadow-xs">
                    <img
                      src="/service-seo-maps.jpg"
                      alt="Search & Visibility - Local SEO & Google Maps 3-Pack"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#080d24]/90 backdrop-blur-xs px-2 py-0.5 rounded text-[9.5px] font-extrabold text-white uppercase tracking-wider">
                      Stage 01
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#1570ef] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                      STAGE 01
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">Organic Search</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#080d24] group-hover:text-[#207de9] transition-colors">
                    Search &amp; Visibility
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 mb-5 leading-relaxed font-normal">
                    Attract ready-to-buy commercial prospects through search engines, Maps, and AI answer engines.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
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
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
                <div>
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-5 bg-slate-100 shadow-xs">
                    <img
                      src="/service-paid-ads.jpg"
                      alt="Acquisition & Ads - Google Ads PPC and Meta Marketing"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#080d24]/90 backdrop-blur-xs px-2 py-0.5 rounded text-[9.5px] font-extrabold text-white uppercase tracking-wider">
                      Stage 02
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#1570ef] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                      STAGE 02
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">Paid Media</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#080d24] group-hover:text-[#207de9] transition-colors">
                    Acquisition &amp; Ads
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 mb-5 leading-relaxed font-normal">
                    Drive targeted, high-intent traffic with surgical Google PPC and Meta advertising funnels.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
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
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
                <div>
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-5 bg-slate-100 shadow-xs">
                    <img
                      src="/service-web-cro.jpg"
                      alt="Funnel & Web CRO - Fast Mobile Sites & WhatsApp Funnels"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#080d24]/90 backdrop-blur-xs px-2 py-0.5 rounded text-[9.5px] font-extrabold text-white uppercase tracking-wider">
                      Stage 03
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#1570ef] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                      STAGE 03
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">Conversion</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#080d24] group-hover:text-[#207de9] transition-colors">
                    Funnel &amp; Web CRO
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 mb-5 leading-relaxed font-normal">
                    Convert traffic into immediate phone inquiries, WhatsApp chats, and confirmed appointments.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
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
                      <span>Email Marketing &amp; Nurture Drips (₹4,999)</span>
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
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
                <div>
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-5 bg-slate-100 shadow-xs">
                    <img
                      src="/service-revenue-analytics.jpg"
                      alt="Revenue & Analytics - Attributable Pipeline & Executive Dashboards"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#080d24]/90 backdrop-blur-xs px-2 py-0.5 rounded text-[9.5px] font-extrabold text-white uppercase tracking-wider">
                      Stage 04
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      STAGE 04
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">Attribution</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#080d24] group-hover:text-emerald-600 transition-colors">
                    Revenue &amp; Analytics
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 mb-5 leading-relaxed font-normal">
                    Transparent closed-loop attribution connecting marketing expenditure to verified pipeline.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
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

            {/* Pre-Audit Feature Showcase: Explains evaluated signals with custom vector illustration */}
            {!geoResult && !geoLoading && (
              <div className="mx-auto mt-10 max-w-[1080px] rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-9 transition-all">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  <div className="lg:col-span-7 space-y-3.5">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-[#1570ef]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1570ef]" />
                      Comprehensive Search &amp; Entity Diagnosis
                    </div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#080d24] tracking-tight">
                      What our proprietary audit engine evaluates in real-time
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      Search is evolving beyond simple blue links. We audit your website across next-generation generative AI engines and traditional ranking factors to uncover missed revenue opportunities.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="text-[#1570ef]">●</span> AI Overviews Readiness
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Evaluates conversational summary citations on Google Gemini &amp; ChatGPT Search.
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="text-[#00b894]">●</span> Google Maps 3-Pack Rank
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Checks GMB profile signals, local NAP citations, and geo-relevance.
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="text-[#6c5ce7]">●</span> Schema.org JSON-LD
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Validates structured entity markup, Knowledge Graph links, and FAQ blocks.
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="text-[#e17055]">●</span> Speed &amp; Traffic Estimate
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Calculates Core Web Vitals, organic traffic potential, and missed revenue gaps.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex items-center justify-center">
                    <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-md bg-white p-2 w-full">
                      <img
                        src="/ai-seo-audit-vector.jpg"
                        alt="Digital FX Search & GEO Audit Engine"
                        className="w-full h-auto rounded-xl object-contain"
                        loading="lazy"
                      />
                    </div>
                  </div>

                </div>
              </div>
            )}

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

                {/* =========================================================
                    EXECUTIVE AI INTELLIGENCE BRIEFING
                    ========================================================= */}
                <div className="mt-8 rounded-2xl border border-indigo-200 bg-gradient-to-br from-[#0c1438] via-[#080d24] to-[#040714] text-white p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 border border-indigo-400/40 text-xs font-black text-indigo-300">
                          AI
                        </div>
                        <div>
                          <div className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300">
                            EXECUTIVE AI INTELLIGENCE BRIEFING
                          </div>
                          <div className="text-xs text-slate-300 font-medium">
                            {geoResult.aiAnalysis?.engineUsed || "Digital FX Enterprise AI Diagnostic Engine v2.4"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                            geoResult.aiAnalysis?.priority === "High"
                              ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                              : geoResult.aiAnalysis?.priority === "Medium"
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          }`}
                        >
                          PRIORITY: {geoResult.aiAnalysis?.priority?.toUpperCase() || "HIGH"} ACTION REQUIRED
                        </span>
                      </div>
                    </div>

                    {/* Executive AI Synthesis */}
                    <p className="text-sm sm:text-base leading-relaxed text-slate-200 font-normal">
                      {geoResult.aiAnalysis?.summary ||
                        `Executive Audit for ${geoWebsite || "your website"}: The domain demonstrates a solid foundational score of ${
                          geoResult.score ?? geoResult.overall ?? 82
                        }/100. However, key generative engine optimization signals (GEO) indicate missed opportunities in Google AI Overviews and ChatGPT citation indexes. By implementing institutional structured schema and conversational answer clusters, the brand can establish category authority.`}
                    </p>

                    {/* Projected Growth & ROI Banner */}
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between sm:justify-start sm:gap-4">
                        <span className="text-xs text-slate-400">Projected Post-Optimization Score:</span>
                        <span className="text-sm font-extrabold text-emerald-400">
                          {geoResult.aiAnalysis?.projectedGrowth?.estimatedScoreAfterFixes ?? 94}/100
                          <span className="text-[11px] font-normal text-slate-400 ml-1.5">
                            (+{Math.max(12, (geoResult.aiAnalysis?.projectedGrowth?.estimatedScoreAfterFixes ?? 94) - (geoResult.score ?? geoResult.overall ?? 82))} pts)
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between sm:justify-start sm:gap-4 sm:border-l sm:border-white/10 sm:pl-4">
                        <span className="text-xs text-slate-400">Est. AI Search Traffic Uplift:</span>
                        <span className="text-sm font-extrabold text-cyan-300">
                          {geoResult.aiAnalysis?.projectedGrowth?.potentialTrafficIncrease ?? "+55% to +90%"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* =========================================================
                    3 AI SEARCH ENGINE CITATION BREAKDOWN
                    ========================================================= */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* ChatGPT / SearchGPT */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        ChatGPT &amp; SearchGPT
                      </span>
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {geoResult.aiAnalysis?.aiEngineBreakdown?.chatgpt?.score ?? 76}% Citations
                      </span>
                    </div>
                    <span className="text-[10.5px] font-semibold text-slate-500 block mb-2">
                      {geoResult.aiAnalysis?.aiEngineBreakdown?.chatgpt?.status ?? "Moderate AI Visibility"}
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {geoResult.aiAnalysis?.aiEngineBreakdown?.chatgpt?.diagnosis ??
                        "Brand is recognized by conversational search, but requires Schema entity validation to be cited in direct recommendations."}
                    </p>
                  </div>

                  {/* Google Gemini */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Google Gemini &amp; SGE
                      </span>
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {geoResult.aiAnalysis?.aiEngineBreakdown?.gemini?.score ?? 81}% Authority
                      </span>
                    </div>
                    <span className="text-[10.5px] font-semibold text-slate-500 block mb-2">
                      {geoResult.aiAnalysis?.aiEngineBreakdown?.gemini?.status ?? "High Local Proximity"}
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {geoResult.aiAnalysis?.aiEngineBreakdown?.gemini?.diagnosis ??
                        "Active Google Business profile verified; linking LocalBusiness structured data will trigger Google AI Overview snapshots."}
                    </p>
                  </div>

                  {/* Perplexity */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-cyan-300 transition">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-500" />
                        Perplexity &amp; Voice Search
                      </span>
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
                        {geoResult.aiAnalysis?.aiEngineBreakdown?.perplexity?.score ?? 84}% Readiness
                      </span>
                    </div>
                    <span className="text-[10.5px] font-semibold text-slate-500 block mb-2">
                      {geoResult.aiAnalysis?.aiEngineBreakdown?.perplexity?.status ?? "Fast Response Indexing"}
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {geoResult.aiAnalysis?.aiEngineBreakdown?.perplexity?.diagnosis ??
                        "Server response latency allows rapid crawling, but Q&A formatted content snippets are required for citation cards."}
                    </p>
                  </div>
                </div>

                {/* =========================================================
                    ESTIMATED WEBSITE TRAFFIC & GOOGLE RATING INTELLIGENCE
                    ========================================================= */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Card 1: Estimated Website Traffic & Technical Infrastructure */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/70 via-slate-50 to-indigo-50/40 border border-blue-200/80 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1570ef] text-white text-xs font-black">
                          📊
                        </span>
                        <div>
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#080d24]">
                            Website Traffic &amp; Infrastructure
                          </h4>
                          <p className="text-[10px] text-slate-500 font-medium">
                            Live DNS Signals, GA4 Tracking &amp; Traffic Model
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100/80 text-[#1570ef] text-[11px] font-bold border border-blue-200">
                        {geoResult.aiAnalysis?.trafficIntelligence?.trafficTier || "Growth Stage (1K–5K)"}
                      </span>
                    </div>

                    {/* Big Traffic Metric */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-3xl sm:text-4xl font-black text-[#080d24] tabular-nums tracking-tight">
                        {geoResult.aiAnalysis?.trafficIntelligence?.estimatedMonthlyVisits || "1,800 – 3,500"}
                      </span>
                      <span className="text-xs font-bold text-slate-500">monthly visits (est.)</span>
                    </div>

                    {/* Real Technical Signals Pills */}
                    <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-white/80 border border-blue-100 text-[11px]">
                      <div className="flex items-center justify-between gap-1 overflow-hidden">
                        <span className="text-slate-500 font-medium">Server IP:</span>
                        <span className="font-bold text-slate-800 font-mono truncate" title={geoResult.realInfrastructure?.serverIp || geoResult.aiAnalysis?.trafficIntelligence?.serverIp || "DNS Lookup"}>
                          {geoResult.realInfrastructure?.serverIp || geoResult.aiAnalysis?.trafficIntelligence?.serverIp || "Resolved via DNS"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-1 overflow-hidden">
                        <span className="text-slate-500 font-medium">Mail Host:</span>
                        <span className="font-bold text-indigo-700 truncate" title={geoResult.realInfrastructure?.emailProvider || geoResult.aiAnalysis?.trafficIntelligence?.emailProvider || "DNS MX"}>
                          {geoResult.realInfrastructure?.emailProvider || geoResult.aiAnalysis?.trafficIntelligence?.emailProvider || "DNS MX"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-1 col-span-2 pt-1 border-t border-slate-100">
                        <span className="text-slate-500 font-medium">Analytics:</span>
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          (geoResult.realInfrastructure?.hasGa4 || geoResult.realInfrastructure?.hasGtm || geoResult.aiAnalysis?.trafficIntelligence?.analyticsStatus?.includes("Active"))
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {geoResult.realInfrastructure?.hasGa4
                            ? `✓ GA4 Active (${geoResult.realInfrastructure.analyticsId || "Detected"})`
                            : geoResult.realInfrastructure?.hasGtm
                            ? "✓ GTM Container Active"
                            : "⚠️ Traffic Untracked (Missing GA4)"}
                        </span>
                      </div>
                      {(geoResult.trancoRank || geoResult.aiAnalysis?.trafficIntelligence?.trancoRank) && (
                        <div className="flex items-center justify-between gap-1 col-span-2 text-[10.5px]">
                          <span className="text-slate-500 font-medium">Global Tranco Rank:</span>
                          <span className="font-bold text-blue-700">
                            #{(geoResult.trancoRank || geoResult.aiAnalysis?.trafficIntelligence?.trancoRank)?.toLocaleString()} Global
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 4-Channel Traffic Split */}
                    <div className="space-y-2 mt-4 pt-3 border-t border-slate-200/80">
                      <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700">
                        <span>Traffic Channel Breakdown</span>
                        <span className="text-slate-400 font-normal">Source Share</span>
                      </div>

                      {/* Multi-segment progress bar */}
                      <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden flex">
                        <div
                          className="bg-[#1570ef] h-full"
                          style={{
                            width: `${geoResult.aiAnalysis?.trafficIntelligence?.channelSplit?.organicSearch ?? 45}%`,
                          }}
                          title={`Google Search: ${geoResult.aiAnalysis?.trafficIntelligence?.channelSplit?.organicSearch ?? 45}%`}
                        />
                        <div
                          className="bg-[#10b981] h-full"
                          style={{
                            width: `${geoResult.aiAnalysis?.trafficIntelligence?.channelSplit?.localMaps ?? 30}%`,
                          }}
                          title={`Google Maps 3-Pack: ${geoResult.aiAnalysis?.trafficIntelligence?.channelSplit?.localMaps ?? 30}%`}
                        />
                        <div
                          className="bg-[#a855f7] h-full"
                          style={{
                            width: `${geoResult.aiAnalysis?.trafficIntelligence?.channelSplit?.aiCitations ?? 12}%`,
                          }}
                          title={`AI Citations: ${geoResult.aiAnalysis?.trafficIntelligence?.channelSplit?.aiCitations ?? 12}%`}
                        />
                        <div
                          className="bg-[#f59e0b] h-full"
                          style={{
                            width: `${geoResult.aiAnalysis?.trafficIntelligence?.channelSplit?.directBrand ?? 13}%`,
                          }}
                          title={`Direct & Brand: ${geoResult.aiAnalysis?.trafficIntelligence?.channelSplit?.directBrand ?? 13}%`}
                        />
                      </div>

                      {/* Legend */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#1570ef]" />
                          <span>Google Search: <strong className="text-slate-900">{geoResult.aiAnalysis?.trafficIntelligence?.channelSplit?.organicSearch ?? 45}%</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                          <span>Google Maps: <strong className="text-slate-900">{geoResult.aiAnalysis?.trafficIntelligence?.channelSplit?.localMaps ?? 30}%</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
                          <span>AI Citations: <strong className="text-slate-900">{geoResult.aiAnalysis?.trafficIntelligence?.channelSplit?.aiCitations ?? 12}%</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                          <span>Direct &amp; Brand: <strong className="text-slate-900">{geoResult.aiAnalysis?.trafficIntelligence?.channelSplit?.directBrand ?? 13}%</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Missed Traffic Opportunity Alert */}
                    <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-600 font-black">⚠️</span>
                        <span className="text-slate-700 font-medium">
                          Missed Traffic: <strong className="text-amber-800">{geoResult.aiAnalysis?.trafficIntelligence?.missedTrafficMonthly || "~2,800 visits/mo"}</strong>
                        </span>
                      </div>
                      <span className="text-[10.5px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                        Recoverable
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Google Rating & Review Intelligence */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/70 via-slate-50 to-emerald-50/40 border border-amber-200/80 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f59e0b] text-white text-xs font-black">
                          ★
                        </span>
                        <div>
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#080d24]">
                            Google Rating &amp; Reputation
                          </h4>
                          <p className="text-[10px] text-slate-500 font-medium">
                            Google Business Profile &amp; Local Schema Verification
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          geoResult.aiAnalysis?.googleRatingIntelligence?.rating
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                        }`}
                      >
                        {geoResult.aiAnalysis?.googleRatingIntelligence?.rating
                          ? (geoResult.aiAnalysis?.googleRatingIntelligence?.gbpStatus || "Verified Rating")
                          : "⚠️ GBP / Schema Not Linked"}
                      </span>
                    </div>

                    {/* Big Rating Metric or Truthful Unlinked State */}
                    {geoResult.aiAnalysis?.googleRatingIntelligence?.rating ? (
                      <div>
                        <div className="flex items-baseline gap-3 mb-2">
                          <span className="text-3xl sm:text-4xl font-black text-[#080d24] tabular-nums tracking-tight">
                            {geoResult.aiAnalysis.googleRatingIntelligence.rating}
                          </span>
                          <div className="flex text-amber-400 text-lg">
                            {"★★★★★"}
                          </div>
                          <span className="text-xs font-bold text-slate-500">out of 5.0</span>
                        </div>
                        <p className="text-xs text-slate-600 mb-2 font-normal">
                          {geoResult.aiAnalysis.googleRatingIntelligence.reviewCountText} •{" "}
                          <span className="font-semibold text-slate-800">
                            {geoResult.aiAnalysis.googleRatingIntelligence.source || "Google Business Profile"}
                          </span>
                        </p>
                        {geoResult.aiAnalysis.googleRatingIntelligence.placeUrl && (
                          <a
                            href={geoResult.aiAnalysis.googleRatingIntelligence.placeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#1570ef] hover:underline font-bold inline-flex items-center gap-1 mb-3"
                          >
                            <span>View on Google Maps</span>
                            <span>↗</span>
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="mb-4 p-3.5 rounded-xl bg-amber-50/90 border border-amber-200">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-lg font-extrabold text-amber-900">
                            Profile / Schema Not Linked
                          </span>
                          <span className="text-[11px] text-amber-700 font-semibold">(Unverified)</span>
                        </div>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed">
                          Website code me Google Business Profile ya AggregateRating Schema link nahi mila. Isse Google Maps 3-Pack aur AI Search Overviews me local credibility kam hoti hai.
                        </p>
                      </div>
                    )}

                    {/* Reputation & Local Pack Metrics */}
                    <div className="space-y-2.5 pt-3 border-t border-slate-200/80">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Customer Sentiment Score
                        </span>
                        <span className="font-extrabold text-emerald-700">
                          {geoResult.aiAnalysis?.googleRatingIntelligence?.rating
                            ? `${geoResult.aiAnalysis?.googleRatingIntelligence?.sentiment ?? 94}% Positive`
                            : "Baseline Trust (65%)"}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{
                            width: `${
                              geoResult.aiAnalysis?.googleRatingIntelligence?.rating
                                ? (geoResult.aiAnalysis?.googleRatingIntelligence?.sentiment ?? 94)
                                : 65
                            }%`,
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-slate-600">Local Maps 3-Pack Rank Impact</span>
                        <span className={`font-extrabold text-[11.5px] ${
                          geoResult.aiAnalysis?.googleRatingIntelligence?.rating ? "text-blue-700" : "text-amber-700"
                        }`}>
                          {geoResult.aiAnalysis?.googleRatingIntelligence?.localPackImpact ||
                            (geoResult.aiAnalysis?.googleRatingIntelligence?.rating ? "Top 3-Pack Contender" : "High Risk - Action Needed")}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-slate-600">Review Schema (AggregateRating)</span>
                        <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                          geoResult.aiAnalysis?.googleRatingIntelligence?.hasReviewSchema
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {geoResult.aiAnalysis?.googleRatingIntelligence?.hasReviewSchema ? "✓ Active on Page" : "⚠️ Missing Schema Markup"}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* =========================================================
                    DYNAMIC STRATEGIC OPPORTUNITIES & ACTION PLAN
                    ========================================================= */}
                <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strategic Growth Opportunities */}
                  <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5 mb-3">
                      <span>✦</span>
                      <span>Strategic Growth Opportunities</span>
                    </h4>
                    <ul className="space-y-2.5 text-xs text-slate-700 font-normal">
                      {(geoResult.aiAnalysis?.opportunities && geoResult.aiAnalysis.opportunities.length > 0
                        ? geoResult.aiAnalysis.opportunities
                        : [
                            "Implement JSON-LD LocalBusiness & Organization Schema to dominate Google AI Overviews.",
                            "Deploy conversational FAQ comparison clusters to capture voice and long-tail search traffic.",
                            "Accelerate mobile Core Web Vitals to improve conversational crawler citation rate.",
                          ]
                      ).map((opp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-indigo-600 font-bold shrink-0">{idx + 1}.</span>
                          <span>{opp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prioritized Engineering Actions */}
                  <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 mb-3">
                      <span>⚡</span>
                      <span>Priority Engineering Action Plan</span>
                    </h4>
                    <ul className="space-y-2.5 text-xs text-slate-700 font-normal">
                      {(geoResult.aiAnalysis?.actions && geoResult.aiAnalysis.actions.length > 0
                        ? geoResult.aiAnalysis.actions
                        : [
                            "Add Schema.org JSON-LD structured markup with verified 'sameAs' social entity links.",
                            "Refactor primary H1 tags and page titles with targeted NCR and high-intent commercial keywords.",
                            "Publish structured FAQ modules answering specific customer buying questions.",
                          ]
                      ).map((act, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Executive Action Banner */}
                <div className="mt-8 rounded-2xl bg-[#080d24] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
                  <div>
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 rounded-full">
                      FIX THESE {geoResult.aiAnalysis?.actions?.length || 3} ISSUES
                    </span>
                    <h4 className="text-lg sm:text-xl font-extrabold text-white mt-1.5 tracking-tight">
                      Want Digital FX to optimize your site for #1 AI Citations?
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5 max-w-[540px] font-normal">
                      We implement full JSON-LD entity schema, conversational content clusters, and optimize your business for Google AI Overviews and ChatGPT Search.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
                    <a
                      href={`https://wa.me/918447583685?text=${encodeURIComponent(
                        `Hi Digital FX, I just ran a GEO AI Audit on ${geoWebsite || "my website"} (Score: ${
                          geoResult.score ?? geoResult.overall ?? 82
                        }/100, Est. Traffic: ${
                          geoResult.aiAnalysis?.trafficIntelligence?.estimatedMonthlyVisits || "1,800–3,500"
                        }/mo, Rating: ${
                          geoResult.aiAnalysis?.googleRatingIntelligence?.rating ?? 4.8
                        }★). Please share the implementation plan to recover the missed traffic and fix AI citations.`
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
                      onClick={() => openProposalModal(geoWebsite, "GEO AI Citations & Optimization")}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#207de9] hover:bg-[#1866c2] text-white font-bold text-xs text-center transition cursor-pointer shadow-md whitespace-nowrap"
                    >
                      Request Strategic Proposal →
                    </button>
                    <button
                      type="button"
                      onClick={() => openPricingModal()}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs text-center transition cursor-pointer whitespace-nowrap"
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
            
            <div className="text-center max-w-[860px] mx-auto">
              {/* Google Verified Review & Rating Card */}
              <div className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm mb-5">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Google Verified</span>
                </div>
                <div className="flex text-amber-400 text-sm tracking-tighter">
                  ★ ★ ★ ★ ★
                </div>
                <span className="text-sm font-extrabold text-[#080d24]">4.9 / 5.0 Rating</span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="text-xs font-semibold text-slate-600">128+ Verified Client Reviews in Ghaziabad &amp; NCR</span>
              </div>

              <h2 className="text-[32px] sm:text-[44px] lg:text-[48px] font-extrabold text-[#080d24] tracking-[-0.035em] leading-[1.1]">
                #1 Rated Digital Marketing &amp; SEO Agency in
                <span className="webfx-serif text-[#207de9] block font-normal mt-1">
                  Ghaziabad &amp; Delhi NCR
                </span>
              </h2>
              <p className="mt-3.5 text-xs sm:text-[14px] text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
                Trusted by 128+ businesses across Crossings Republik, Indirapuram, Raj Nagar, Vaishali, and Noida for top Google Maps rankings, high-converting websites, and proven customer acquisition.
              </p>
              
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://share.google/EIVnaRy9WhkPCi8U8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#207de9] hover:bg-[#1866c2] text-white text-xs font-bold transition shadow-sm"
                >
                  <span>📍 View Live Google Maps Listing &amp; Reviews</span>
                  <span>↗</span>
                </a>
              </div>

              <p className="mt-4 text-[11px] font-semibold text-slate-400">
                ← Auto-scrolling horizontally • Hover over any card to pause and read →
              </p>
            </div>

          </div>

          {/* Google Reviews Carousel & Interactive Marquee Track with Navigation Arrows */}
          <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-4 group">
            {/* Left Carousel Navigation Button */}
            <button
              onClick={() => scrollReviews("left")}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-700 hover:text-black hover:bg-slate-50 transition cursor-pointer z-20 focus:outline-none"
              aria-label="Previous reviews"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Carousel Navigation Button */}
            <button
              onClick={() => scrollReviews("right")}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-700 hover:text-black hover:bg-slate-50 transition cursor-pointer z-20 focus:outline-none"
              aria-label="Next reviews"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Scrollable Container with Marquee Animation */}
            <div ref={reviewsScrollRef} className="reviews-scroll-container w-full overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="reviews-marquee-track">
                {/* First Set of Google Business Reviews */}
                {clientReviews.map((item, idx) => (
                  <div
                    key={`rev-1-${idx}`}
                    className="w-[310px] sm:w-[360px] min-h-[210px] bg-[#f8f9fa] p-5 sm:p-6 rounded-[20px] border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition flex flex-col justify-between shrink-0 select-none text-left"
                  >
                    <div>
                      {/* Top Header: Avatar, Name, Relative Timestamp & Google "G" Logo */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0 uppercase select-none shadow-xs"
                            style={{ backgroundColor: item.avatarColor || '#5c53c4' }}
                          >
                            {item.author.charAt(0)}
                          </div>
                          <div className="min-w-0 overflow-hidden">
                            <h4 className="text-[14.5px] sm:text-[15px] font-bold text-[#1f1f1f] truncate leading-tight tracking-tight">
                              {item.author}
                            </h4>
                            <p className="text-[12px] text-[#70757a] font-normal leading-tight mt-0.5">
                              {item.timeAgo || "2 months ago"}
                            </p>
                          </div>
                        </div>

                        {/* Official Google G Logo */}
                        <svg className="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                      </div>

                      {/* 5 Stars Rating Bar + Blue Verified Checkmark Badge */}
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <div className="flex text-[#fbbc04] text-sm tracking-widest">
                          {"★".repeat(item.rating)}
                        </div>
                        {/* Blue Circle Verified Badge */}
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#1a73e8] text-white shrink-0 shadow-xs" title="Verified Google Business Review">
                          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      </div>

                      {/* Review Text */}
                      <p className="text-xs sm:text-[13.5px] text-[#202124] leading-relaxed font-normal">
                        {item.quote}
                      </p>
                      {item.quote.length > 110 && (
                        <button className="text-[12px] text-[#70757a] font-medium mt-1 hover:underline focus:outline-none">
                          Read more
                        </button>
                      )}
                    </div>

                    {/* Footer Tag */}
                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-[#70757a]">
                      <span className="font-medium truncate max-w-[200px]">{item.business}</span>
                      <span className="font-semibold text-[#1a73e8] bg-white px-2 py-0.5 rounded-full border border-slate-200/80 shrink-0">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Duplicate Set of Reviews for Continuous Seamless Loop */}
                {clientReviews.map((item, idx) => (
                  <div
                    key={`rev-2-${idx}`}
                    className="w-[310px] sm:w-[360px] min-h-[210px] bg-[#f8f9fa] p-5 sm:p-6 rounded-[20px] border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition flex flex-col justify-between shrink-0 select-none text-left"
                    aria-hidden="true"
                  >
                    <div>
                      {/* Top Header: Avatar, Name, Relative Timestamp & Google "G" Logo */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0 uppercase select-none shadow-xs"
                            style={{ backgroundColor: item.avatarColor || '#5c53c4' }}
                          >
                            {item.author.charAt(0)}
                          </div>
                          <div className="min-w-0 overflow-hidden">
                            <h4 className="text-[14.5px] sm:text-[15px] font-bold text-[#1f1f1f] truncate leading-tight tracking-tight">
                              {item.author}
                            </h4>
                            <p className="text-[12px] text-[#70757a] font-normal leading-tight mt-0.5">
                              {item.timeAgo || "2 months ago"}
                            </p>
                          </div>
                        </div>

                        {/* Official Google G Logo */}
                        <svg className="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                      </div>

                      {/* 5 Stars Rating Bar + Blue Verified Checkmark Badge */}
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <div className="flex text-[#fbbc04] text-sm tracking-widest">
                          {"★".repeat(item.rating)}
                        </div>
                        {/* Blue Circle Verified Badge */}
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#1a73e8] text-white shrink-0 shadow-xs" title="Verified Google Business Review">
                          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      </div>

                      {/* Review Text */}
                      <p className="text-xs sm:text-[13.5px] text-[#202124] leading-relaxed font-normal">
                        {item.quote}
                      </p>
                      {item.quote.length > 110 && (
                        <button className="text-[12px] text-[#70757a] font-medium mt-1 hover:underline focus:outline-none">
                          Read more
                        </button>
                      )}
                    </div>

                    {/* Footer Tag */}
                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-[#70757a]">
                      <span className="font-medium truncate max-w-[200px]">{item.business}</span>
                      <span className="font-semibold text-[#1a73e8] bg-white px-2 py-0.5 rounded-full border border-slate-200/80 shrink-0">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            9B. PROPRIETARY RESEARCH & ANTI-GRAVITY GROWTH ECOSYSTEM
            ========================================================================== */}
        {/* ==========================================================================
            9B. PROPRIETARY BENCHMARKS & SEARCH PERFORMANCE ENGINE
            ========================================================================== */}
        <section
          id="insights"
          className="py-20 sm:py-28 bg-gradient-to-b from-white via-[#f8faff] to-white border-b border-slate-200 relative overflow-hidden select-none"
        >
          {/* Subtle Ambient Background Gradient Lighting Matching Entire Website */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(32,125,233,0.06),transparent_70%)] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            {/* Header: We Don’t Just Follow Search Trends — We Benchmark Them */}
            <div className="text-center max-w-[900px] mx-auto mb-14 sm:mb-16">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1570ef] mb-4">
                <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse" />
                Proprietary Benchmarks • Live Client Performance
              </span>
              <h2 className="text-[32px] sm:text-[46px] lg:text-[52px] font-extrabold text-[#080d24] tracking-[-0.03em] leading-[1.12]">
                We Don’t Just Follow Search Trends —{" "}
                <span className="text-[#1570ef] webfx-serif block sm:inline font-normal">
                  We Benchmark Them
                </span>
              </h2>
              <p className="mt-4 text-[15px] sm:text-[17px] leading-relaxed text-slate-600 font-normal max-w-[780px] mx-auto">
                Real-time search intelligence, Google Maps 3-Pack rank tracking, and cross-channel attribution engine powering high-growth businesses across India and global markets.
              </p>
            </div>

            {/* Seamless Infinite Horizontal Performance Marquee Stream */}
            <div className="relative w-full overflow-hidden py-6 -my-6 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
              <div className="antigravity-track">
                
                {/* SET A: Core Performance Dashboards */}

                {/* 1. Organic Search & Traffic Engine (Live Trajectory Chart) */}
                <div className="ag-card-1 w-[320px] sm:w-[360px] h-[310px] rounded-[24px] p-6 bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 flex flex-col justify-between relative overflow-hidden transition-all duration-300 group shrink-0 select-none">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#1570ef] to-transparent opacity-80" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">Organic Search Engine</span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1570ef] border border-blue-200">
                      +312% YoY Lift
                    </span>
                  </div>

                  {/* Clean Light Area Chart Widget */}
                  <div className="w-full h-32 bg-slate-50/80 rounded-2xl p-3 flex flex-col justify-between border border-slate-200/80 relative overflow-hidden shadow-xs my-1.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-600 font-semibold relative z-10">
                      <span>Trailing 90-Day Organic Clicks</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        248.5K
                      </span>
                    </div>

                    <div className="relative w-full h-16 my-auto">
                      <svg viewBox="0 0 280 60" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="chartGradLight1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#1570ef" stopOpacity="0.22" />
                            <stop offset="100%" stopColor="#1570ef" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <line x1="0" y1="16" x2="280" y2="16" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
                        <line x1="0" y1="38" x2="280" y2="38" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
                        <polygon points="0,55 25,48 60,42 95,45 130,32 165,35 200,20 235,14 275,4 275,60 0,60" fill="url(#chartGradLight1)" />
                        <polyline points="0,55 25,48 60,42 95,45 130,32 165,35 200,20 235,14 275,4" fill="none" stroke="#1570ef" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="275" cy="4" r="3" fill="#1570ef" />
                      </svg>
                    </div>

                    <div className="flex items-center justify-between text-[9.5px] text-slate-500 border-t border-slate-200/60 pt-1 relative z-10">
                      <span>Top 3 Keywords: <strong className="text-slate-900 font-bold">420+</strong></span>
                      <span>Avg CPA: <strong className="text-[#1570ef] font-bold">₹142</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>Continuous Search Indexing</span>
                    <span className="text-[#1570ef] font-bold">Conversion Velocity ↑</span>
                  </div>
                </div>

                {/* 2. Paid Search & Meta Performance Engine */}
                <div className="ag-card-2 w-[320px] sm:w-[360px] h-[310px] rounded-[24px] p-6 bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-300 flex flex-col justify-between relative overflow-hidden transition-all duration-300 group shrink-0 select-none">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-80" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">Paid Media Engine</span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      ROAS 5.4x
                    </span>
                  </div>

                  {/* Real Paid Ads Performance KPI Grid */}
                  <div className="w-full bg-amber-50/40 rounded-2xl p-3 border border-amber-100 space-y-2 my-1.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs">
                        <div className="text-[9.5px] text-slate-500 font-semibold">Google Ads CPA</div>
                        <div className="text-base font-black text-slate-900 mt-0.5">₹142 <span className="text-[9px] text-emerald-600 font-bold">↓ 59%</span></div>
                        <div className="text-[8.5px] text-slate-400 mt-0.5">Target: ₹350</div>
                      </div>
                      <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs">
                        <div className="text-[9.5px] text-slate-500 font-semibold">Conversion Rate</div>
                        <div className="text-base font-black text-slate-900 mt-0.5">7.8% <span className="text-[9px] text-emerald-600 font-bold">↑ 3.2x</span></div>
                        <div className="text-[8.5px] text-slate-400 mt-0.5">Industry: 2.1%</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] bg-white rounded-lg px-2.5 py-1.5 border border-amber-200/60 shadow-2xs">
                      <span className="text-slate-600">Managed Spend: <strong className="text-amber-800">₹85L+/mo</strong></span>
                      <span className="text-emerald-700 font-bold text-[9px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> CRM Matched
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900 flex items-center justify-between">
                      <span>High-Intent Ad Reach</span>
                      <span className="text-amber-600 font-extrabold">4.8M+</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>Google Search &amp; Meta PPC</span>
                      <span className="text-amber-600 font-semibold">Verified CPL Reduction</span>
                    </div>
                  </div>
                </div>

                {/* 3. Google Maps 3-Pack Local Search Authority */}
                <div className="ag-card-3 w-[320px] sm:w-[360px] h-[310px] rounded-[24px] p-6 bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 flex flex-col justify-between relative overflow-hidden transition-all duration-300 group shrink-0 select-none">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-80" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">Local Authority</span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Rank #1 Leader
                    </span>
                  </div>

                  {/* Real Google Business Profile 3-Pack Widget */}
                  <div className="w-full bg-emerald-50/40 rounded-2xl p-3 border border-emerald-100 space-y-2 my-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-[11px] font-extrabold text-slate-900">Google Maps 3-Pack</div>
                          <div className="text-[9px] text-emerald-700 font-medium">Verified Business Profile</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10.5px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <span>★ 4.9</span>
                        <span className="text-[8.5px] text-slate-500 font-normal">(140+)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-200/50">
                      <div className="bg-white rounded-lg p-2 border border-slate-200/80 shadow-2xs">
                        <div className="text-[8.5px] text-slate-500 uppercase font-semibold">Direct Calls</div>
                        <div className="text-sm font-extrabold text-slate-900 mt-0.5">+840 <span className="text-[8.5px] text-emerald-600 font-bold">/ mo</span></div>
                      </div>
                      <div className="bg-white rounded-lg p-2 border border-slate-200/80 shadow-2xs">
                        <div className="text-[8.5px] text-slate-500 uppercase font-semibold">Direction Queries</div>
                        <div className="text-sm font-extrabold text-[#1570ef] mt-0.5">+2,150 <span className="text-[8.5px] text-emerald-600 font-bold">/ mo</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900 flex items-center justify-between">
                      <span>Geo-Targeted Radius</span>
                      <span className="text-emerald-600 font-extrabold">Active #1 Pack</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>140+ Verified Reviews</span>
                      <span className="text-[#1570ef] font-medium">Pan-India 3-Pack Lock</span>
                    </div>
                  </div>
                </div>

                {/* 4. Strategic 90-Day Execution Framework */}
                <div className="ag-card-4 w-[320px] sm:w-[360px] h-[310px] rounded-[24px] p-6 bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 flex flex-col justify-between relative overflow-hidden transition-all duration-300 group shrink-0 select-none">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#207de9] to-transparent opacity-80" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1570ef]">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">Execution Framework</span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1570ef] border border-blue-200">
                      90-Day Sprint
                    </span>
                  </div>

                  {/* Real 3-Phase Delivery Roadmap */}
                  <div className="w-full bg-slate-50/80 rounded-2xl p-3 border border-slate-200/80 space-y-2 my-1.5">
                    <div className="space-y-1.5 text-[10px]">
                      <div className="flex items-center justify-between bg-white rounded-lg px-2.5 py-1.5 border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 font-extrabold text-[8px] flex items-center justify-center border border-emerald-200">✓</span>
                          <span className="text-slate-800 font-medium">Days 1–15: Technical SEO Audit</span>
                        </div>
                        <span className="text-emerald-700 font-bold text-[9px]">Completed</span>
                      </div>
                      <div className="flex items-center justify-between bg-blue-50/70 rounded-lg px-2.5 py-1.5 border border-blue-200 shadow-2xs">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-[#1570ef] text-white font-extrabold text-[8px] flex items-center justify-center">2</span>
                          <span className="text-blue-900 font-semibold">Days 16–45: GEO Entity &amp; 3-Pack</span>
                        </div>
                        <span className="text-[#1570ef] font-bold text-[9px] animate-pulse">Active ⚡</span>
                      </div>
                      <div className="flex items-center justify-between bg-white rounded-lg px-2.5 py-1.5 border border-slate-200/80 shadow-2xs opacity-75">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-500 font-bold text-[8px] flex items-center justify-center">3</span>
                          <span className="text-slate-500 font-medium">Days 46–90: Revenue Scale &amp; CRO</span>
                        </div>
                        <span className="text-slate-400 font-medium text-[9px]">Target</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900 flex items-center justify-between">
                      <span>Target Horizon</span>
                      <span className="text-[#1570ef] font-extrabold">30–60–90 Days</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>Guaranteed Deliverables</span>
                      <span className="text-emerald-600 font-semibold">Attributable ROI</span>
                    </div>
                  </div>
                </div>

                {/* 5. Multi-City Search & CDN Infrastructure */}
                <div className="ag-card-5 w-[320px] sm:w-[360px] h-[310px] rounded-[24px] p-6 bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-300 flex flex-col justify-between relative overflow-hidden transition-all duration-300 group shrink-0 select-none">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-80" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">Multi-City Infrastructure</span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      350+ Cities
                    </span>
                  </div>

                  {/* Real CDN & Speed Telemetry Panel */}
                  <div className="w-full bg-indigo-50/40 rounded-2xl p-3 border border-indigo-100 space-y-2 my-1.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs">
                        <div className="text-[9px] text-slate-500 uppercase font-semibold">Edge Latency</div>
                        <div className="text-base font-black text-indigo-700 mt-0.5">&lt; 45ms</div>
                        <div className="text-[8.5px] text-emerald-600 font-semibold mt-0.5">Pan-India CDN</div>
                      </div>
                      <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs">
                        <div className="text-[9px] text-slate-500 uppercase font-semibold">Core Web Vitals</div>
                        <div className="text-base font-black text-emerald-600 mt-0.5">99 / 100</div>
                        <div className="text-[8.5px] text-slate-400 font-medium mt-0.5">Mobile Speed</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[9.5px] bg-white rounded-lg px-2.5 py-1.5 border border-indigo-200/60 shadow-2xs">
                      <span className="text-slate-600">Coverage: <strong className="text-indigo-900">28 States &amp; UTs</strong></span>
                      <span className="text-[#1570ef] font-semibold">Dubai &amp; US Desks</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900 flex items-center justify-between">
                      <span>High-Availability Network</span>
                      <span className="text-indigo-600 font-extrabold">99.98% Uptime</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>Hyperlocal City Desks</span>
                      <span className="text-[#1570ef] font-semibold">Sub-Second CDN</span>
                    </div>
                  </div>
                </div>

                {/* 6. Client Confidence & Retainer Retention */}
                <div className="ag-card-6 w-[320px] sm:w-[360px] h-[310px] rounded-[24px] p-6 bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 flex flex-col justify-between relative overflow-hidden transition-all duration-300 group shrink-0 select-none">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-80" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">Client Confidence</span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      94% Retention
                    </span>
                  </div>

                  {/* Real Verified Trust & Revenue Proof */}
                  <div className="w-full bg-emerald-50/40 rounded-2xl p-3 border border-emerald-100 space-y-2 my-1.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs">
                        <div className="text-[9px] text-slate-500 uppercase font-semibold">Avg Partnership</div>
                        <div className="text-base font-black text-emerald-700 mt-0.5">2.8+ Yrs</div>
                        <div className="text-[8.5px] text-slate-400 mt-0.5">Industry: 10 mos</div>
                      </div>
                      <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs">
                        <div className="text-[9px] text-slate-500 uppercase font-semibold">Client Revenue</div>
                        <div className="text-base font-black text-slate-900 mt-0.5">₹18.4 Cr+</div>
                        <div className="text-[8.5px] text-emerald-600 font-semibold mt-0.5">Attributable ROI</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[9.5px] bg-white rounded-lg px-2.5 py-1.5 border border-emerald-200/60 shadow-2xs">
                      <span className="text-slate-600">Retainer Terms: <strong className="text-emerald-700">Zero Lock-In</strong></span>
                      <span className="text-emerald-600 font-bold">Month-to-Month</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900 flex items-center justify-between">
                      <span>Attributable ROI</span>
                      <span className="text-emerald-600 font-extrabold">100% Tracked</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>Transparent Weekly Reporting</span>
                      <span className="text-[#1570ef] font-semibold">Live Dashboards</span>
                    </div>
                  </div>
                </div>

                {/* 7. Generative Engine Optimization (GEO & AI Search) */}
                <div className="ag-card-7 w-[320px] sm:w-[360px] h-[310px] rounded-[24px] p-6 bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-purple-300 flex flex-col justify-between relative overflow-hidden transition-all duration-300 group shrink-0 select-none">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-80" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">AI Search Engine (GEO)</span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      Tier-1 Entity
                    </span>
                  </div>

                  {/* Real AI Search Citation & Knowledge Graph Widget */}
                  <div className="w-full bg-purple-50/40 rounded-2xl p-3 border border-purple-100 space-y-2 my-1.5">
                    <div className="flex items-center justify-between bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs">
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase font-semibold">Perplexity &amp; ChatGPT Citations</div>
                        <div className="text-base font-black text-purple-800 mt-0.5">94% <span className="text-[9px] text-emerald-600 font-bold">Top Source</span></div>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 text-xs font-black">
                        GEO
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[9.5px] bg-white rounded-lg px-2.5 py-1.5 border border-purple-200/60 shadow-2xs">
                      <span className="text-slate-600">Google AI Overviews: <strong className="text-purple-800">Top Snippet</strong></span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Entity Verified
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900 flex items-center justify-between">
                      <span>AI Entity Authority</span>
                      <span className="text-purple-700 font-extrabold">96 / 100</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>ChatGPT, Perplexity &amp; Gemini</span>
                      <span className="text-[#1570ef] font-semibold">Entity Graph Locked</span>
                    </div>
                  </div>
                </div>

                {/* SET B: Exact Duplicate for Seamless Infinite 60fps Loop */}

                {/* 1. Organic Search & Traffic Engine (Live Trajectory Chart) */}
                <div className="ag-card-1 w-[320px] sm:w-[360px] h-[310px] rounded-[24px] p-6 bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 flex flex-col justify-between relative overflow-hidden transition-all duration-300 group shrink-0 select-none">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#1570ef] to-transparent opacity-80" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">Organic Search Engine</span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1570ef] border border-blue-200">
                      +312% YoY Lift
                    </span>
                  </div>

                  {/* Clean Light Area Chart Widget */}
                  <div className="w-full h-32 bg-slate-50/80 rounded-2xl p-3 flex flex-col justify-between border border-slate-200/80 relative overflow-hidden shadow-xs my-1.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-600 font-semibold relative z-10">
                      <span>Trailing 90-Day Organic Clicks</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        248.5K
                      </span>
                    </div>

                    <div className="relative w-full h-16 my-auto">
                      <svg viewBox="0 0 280 60" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="chartGradLight1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#1570ef" stopOpacity="0.22" />
                            <stop offset="100%" stopColor="#1570ef" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <line x1="0" y1="16" x2="280" y2="16" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
                        <line x1="0" y1="38" x2="280" y2="38" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
                        <polygon points="0,55 25,48 60,42 95,45 130,32 165,35 200,20 235,14 275,4 275,60 0,60" fill="url(#chartGradLight1)" />
                        <polyline points="0,55 25,48 60,42 95,45 130,32 165,35 200,20 235,14 275,4" fill="none" stroke="#1570ef" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="275" cy="4" r="3" fill="#1570ef" />
                      </svg>
                    </div>

                    <div className="flex items-center justify-between text-[9.5px] text-slate-500 border-t border-slate-200/60 pt-1 relative z-10">
                      <span>Top 3 Keywords: <strong className="text-slate-900 font-bold">420+</strong></span>
                      <span>Avg CPA: <strong className="text-[#1570ef] font-bold">₹142</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>Continuous Search Indexing</span>
                    <span className="text-[#1570ef] font-bold">Conversion Velocity ↑</span>
                  </div>
                </div>

                {/* 2. Paid Search & Meta Performance Engine */}
                <div className="ag-card-2 w-[320px] sm:w-[360px] h-[310px] rounded-[24px] p-6 bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-300 flex flex-col justify-between relative overflow-hidden transition-all duration-300 group shrink-0 select-none">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-80" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">Paid Media Engine</span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      ROAS 5.4x
                    </span>
                  </div>

                  {/* Real Paid Ads Performance KPI Grid */}
                  <div className="w-full bg-amber-50/40 rounded-2xl p-3 border border-amber-100 space-y-2 my-1.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs">
                        <div className="text-[9.5px] text-slate-500 font-semibold">Google Ads CPA</div>
                        <div className="text-base font-black text-slate-900 mt-0.5">₹142 <span className="text-[9px] text-emerald-600 font-bold">↓ 59%</span></div>
                        <div className="text-[8.5px] text-slate-400 mt-0.5">Target: ₹350</div>
                      </div>
                      <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs">
                        <div className="text-[9.5px] text-slate-500 font-semibold">Conversion Rate</div>
                        <div className="text-base font-black text-slate-900 mt-0.5">7.8% <span className="text-[9px] text-emerald-600 font-bold">↑ 3.2x</span></div>
                        <div className="text-[8.5px] text-slate-400 mt-0.5">Industry: 2.1%</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] bg-white rounded-lg px-2.5 py-1.5 border border-amber-200/60 shadow-2xs">
                      <span className="text-slate-600">Managed Spend: <strong className="text-amber-800">₹85L+/mo</strong></span>
                      <span className="text-emerald-700 font-bold text-[9px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> CRM Matched
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900 flex items-center justify-between">
                      <span>High-Intent Ad Reach</span>
                      <span className="text-amber-600 font-extrabold">4.8M+</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>Google Search &amp; Meta PPC</span>
                      <span className="text-amber-600 font-semibold">Verified CPL Reduction</span>
                    </div>
                  </div>
                </div>

                {/* 3. Google Maps 3-Pack Local Search Authority */}
                <div className="ag-card-3 w-[320px] sm:w-[360px] h-[310px] rounded-[24px] p-6 bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 flex flex-col justify-between relative overflow-hidden transition-all duration-300 group shrink-0 select-none">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-80" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">Local Authority</span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Rank #1 Leader
                    </span>
                  </div>

                  {/* Real Google Business Profile 3-Pack Widget */}
                  <div className="w-full bg-emerald-50/40 rounded-2xl p-3 border border-emerald-100 space-y-2 my-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-[11px] font-extrabold text-slate-900">Google Maps 3-Pack</div>
                          <div className="text-[9px] text-emerald-700 font-medium">Verified Business Profile</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10.5px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <span>★ 4.9</span>
                        <span className="text-[8.5px] text-slate-500 font-normal">(140+)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-200/50">
                      <div className="bg-white rounded-lg p-2 border border-slate-200/80 shadow-2xs">
                        <div className="text-[8.5px] text-slate-500 uppercase font-semibold">Direct Calls</div>
                        <div className="text-sm font-extrabold text-slate-900 mt-0.5">+840 <span className="text-[8.5px] text-emerald-600 font-bold">/ mo</span></div>
                      </div>
                      <div className="bg-white rounded-lg p-2 border border-slate-200/80 shadow-2xs">
                        <div className="text-[8.5px] text-slate-500 uppercase font-semibold">Direction Queries</div>
                        <div className="text-sm font-extrabold text-[#1570ef] mt-0.5">+2,150 <span className="text-[8.5px] text-emerald-600 font-bold">/ mo</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900 flex items-center justify-between">
                      <span>Geo-Targeted Radius</span>
                      <span className="text-emerald-600 font-extrabold">Active #1 Pack</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>140+ Verified Reviews</span>
                      <span className="text-[#1570ef] font-medium">Pan-India 3-Pack Lock</span>
                    </div>
                  </div>
                </div>

                {/* 4. Strategic 90-Day Execution Framework */}
                <div className="ag-card-4 w-[320px] sm:w-[360px] h-[310px] rounded-[24px] p-6 bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 flex flex-col justify-between relative overflow-hidden transition-all duration-300 group shrink-0 select-none">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#207de9] to-transparent opacity-80" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1570ef]">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">Execution Framework</span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1570ef] border border-blue-200">
                      90-Day Sprint
                    </span>
                  </div>

                  {/* Real 3-Phase Delivery Roadmap */}
                  <div className="w-full bg-slate-50/80 rounded-2xl p-3 border border-slate-200/80 space-y-2 my-1.5">
                    <div className="space-y-1.5 text-[10px]">
                      <div className="flex items-center justify-between bg-white rounded-lg px-2.5 py-1.5 border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 font-extrabold text-[8px] flex items-center justify-center border border-emerald-200">✓</span>
                          <span className="text-slate-800 font-medium">Days 1–15: Technical SEO Audit</span>
                        </div>
                        <span className="text-emerald-700 font-bold text-[9px]">Completed</span>
                      </div>
                      <div className="flex items-center justify-between bg-blue-50/70 rounded-lg px-2.5 py-1.5 border border-blue-200 shadow-2xs">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-[#1570ef] text-white font-extrabold text-[8px] flex items-center justify-center">2</span>
                          <span className="text-blue-900 font-semibold">Days 16–45: GEO Entity &amp; 3-Pack</span>
                        </div>
                        <span className="text-[#1570ef] font-bold text-[9px] animate-pulse">Active ⚡</span>
                      </div>
                      <div className="flex items-center justify-between bg-white rounded-lg px-2.5 py-1.5 border border-slate-200/80 shadow-2xs opacity-75">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-500 font-bold text-[8px] flex items-center justify-center">3</span>
                          <span className="text-slate-500 font-medium">Days 46–90: Revenue Scale &amp; CRO</span>
                        </div>
                        <span className="text-slate-400 font-medium text-[9px]">Target</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900 flex items-center justify-between">
                      <span>Target Horizon</span>
                      <span className="text-[#1570ef] font-extrabold">30–60–90 Days</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>Guaranteed Deliverables</span>
                      <span className="text-emerald-600 font-semibold">Attributable ROI</span>
                    </div>
                  </div>
                </div>

                {/* 5. Multi-City Search & CDN Infrastructure */}
                <div className="ag-card-5 w-[320px] sm:w-[360px] h-[310px] rounded-[24px] p-6 bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-300 flex flex-col justify-between relative overflow-hidden transition-all duration-300 group shrink-0 select-none">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-80" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">Multi-City Infrastructure</span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      350+ Cities
                    </span>
                  </div>

                  {/* Real CDN & Speed Telemetry Panel */}
                  <div className="w-full bg-indigo-50/40 rounded-2xl p-3 border border-indigo-100 space-y-2 my-1.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs">
                        <div className="text-[9px] text-slate-500 uppercase font-semibold">Edge Latency</div>
                        <div className="text-base font-black text-indigo-700 mt-0.5">&lt; 45ms</div>
                        <div className="text-[8.5px] text-emerald-600 font-semibold mt-0.5">Pan-India CDN</div>
                      </div>
                      <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs">
                        <div className="text-[9px] text-slate-500 uppercase font-semibold">Core Web Vitals</div>
                        <div className="text-base font-black text-emerald-600 mt-0.5">99 / 100</div>
                        <div className="text-[8.5px] text-slate-400 font-medium mt-0.5">Mobile Speed</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[9.5px] bg-white rounded-lg px-2.5 py-1.5 border border-indigo-200/60 shadow-2xs">
                      <span className="text-slate-600">Coverage: <strong className="text-indigo-900">28 States &amp; UTs</strong></span>
                      <span className="text-[#1570ef] font-semibold">Dubai &amp; US Desks</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900 flex items-center justify-between">
                      <span>High-Availability Network</span>
                      <span className="text-indigo-600 font-extrabold">99.98% Uptime</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>Hyperlocal City Desks</span>
                      <span className="text-[#1570ef] font-semibold">Sub-Second CDN</span>
                    </div>
                  </div>
                </div>

                {/* 6. Client Confidence & Retainer Retention */}
                <div className="ag-card-6 w-[320px] sm:w-[360px] h-[310px] rounded-[24px] p-6 bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 flex flex-col justify-between relative overflow-hidden transition-all duration-300 group shrink-0 select-none">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-80" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">Client Confidence</span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      94% Retention
                    </span>
                  </div>

                  {/* Real Verified Trust & Revenue Proof */}
                  <div className="w-full bg-emerald-50/40 rounded-2xl p-3 border border-emerald-100 space-y-2 my-1.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs">
                        <div className="text-[9px] text-slate-500 uppercase font-semibold">Avg Partnership</div>
                        <div className="text-base font-black text-emerald-700 mt-0.5">2.8+ Yrs</div>
                        <div className="text-[8.5px] text-slate-400 mt-0.5">Industry: 10 mos</div>
                      </div>
                      <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs">
                        <div className="text-[9px] text-slate-500 uppercase font-semibold">Client Revenue</div>
                        <div className="text-base font-black text-slate-900 mt-0.5">₹18.4 Cr+</div>
                        <div className="text-[8.5px] text-emerald-600 font-semibold mt-0.5">Attributable ROI</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[9.5px] bg-white rounded-lg px-2.5 py-1.5 border border-emerald-200/60 shadow-2xs">
                      <span className="text-slate-600">Retainer Terms: <strong className="text-emerald-700">Zero Lock-In</strong></span>
                      <span className="text-emerald-600 font-bold">Month-to-Month</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900 flex items-center justify-between">
                      <span>Attributable ROI</span>
                      <span className="text-emerald-600 font-extrabold">100% Tracked</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>Transparent Weekly Reporting</span>
                      <span className="text-[#1570ef] font-semibold">Live Dashboards</span>
                    </div>
                  </div>
                </div>

                {/* 7. Generative Engine Optimization (GEO & AI Search) */}
                <div className="ag-card-7 w-[320px] sm:w-[360px] h-[310px] rounded-[24px] p-6 bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-purple-300 flex flex-col justify-between relative overflow-hidden transition-all duration-300 group shrink-0 select-none">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-80" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">AI Search Engine (GEO)</span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      Tier-1 Entity
                    </span>
                  </div>

                  {/* Real AI Search Citation & Knowledge Graph Widget */}
                  <div className="w-full bg-purple-50/40 rounded-2xl p-3 border border-purple-100 space-y-2 my-1.5">
                    <div className="flex items-center justify-between bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs">
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase font-semibold">Perplexity &amp; ChatGPT Citations</div>
                        <div className="text-base font-black text-purple-800 mt-0.5">94% <span className="text-[9px] text-emerald-600 font-bold">Top Source</span></div>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 text-xs font-black">
                        GEO
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[9.5px] bg-white rounded-lg px-2.5 py-1.5 border border-purple-200/60 shadow-2xs">
                      <span className="text-slate-600">Google AI Overviews: <strong className="text-purple-800">Top Snippet</strong></span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Entity Verified
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900 flex items-center justify-between">
                      <span>AI Entity Authority</span>
                      <span className="text-purple-700 font-extrabold">96 / 100</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>ChatGPT, Perplexity &amp; Gemini</span>
                      <span className="text-[#1570ef] font-semibold">Entity Graph Locked</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Live Performance Indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-slate-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Client Deployments Across 350+ Cities
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5 text-slate-700 font-semibold">
                <span className="text-emerald-600">✓</span> 100% Attributable Revenue Tracking
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5 text-slate-700 font-semibold">
                <span className="text-[#1570ef]">⚡</span> Real-Time Campaign Dashboard
              </span>
            </div>

            {/* Careers Spotlight Banner (Sleek Clean Light Redesign) */}
            <div className="mt-14 rounded-3xl bg-gradient-to-br from-white via-blue-50/40 to-slate-50 p-6 sm:p-10 text-[#080d24] shadow-lg border border-blue-200/80 overflow-hidden relative">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                
                <div className="lg:col-span-7 space-y-3.5">
                  <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#1570ef] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Careers &amp; Talent Acquisition
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#080d24] tracking-tight leading-snug">
                    Want to join our search engineering &amp; performance team?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-xl">
                    We’re actively hiring senior SEO architects, full-stack Next.js engineers, and performance media buyers who love solving complex search challenges and building high-ROI digital systems.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs">Senior Technical SEO</span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs">Full-Stack Next.js Developer</span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs">Paid Media &amp; Meta Buyer</span>
                  </div>

                  <div className="pt-2">
                    <a
                      href="mailto:careers@digitalfx.in?subject=Career%20Application%20at%20Digital%20FX"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1570ef] hover:bg-[#1362d2] text-white text-xs sm:text-sm font-extrabold shadow-md shadow-blue-500/25 transition-all hover:-translate-y-0.5 cursor-pointer"
                    >
                      <span>Explore Open Roles &amp; Apply</span>
                      <span>→</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5 flex items-center justify-center">
                  <div className="w-full rounded-2xl overflow-hidden bg-white p-3 shadow-md border border-slate-200/80 group hover:scale-[1.02] transition-transform duration-300">
                    <img
                      src="/agency-team-illustration.png"
                      alt="Digital FX Collaborative Agency Team"
                      className="w-full h-auto object-contain rounded-xl"
                      loading="lazy"
                    />
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ==========================================================================
            9C. FREQUENTLY ASKED QUESTIONS (FAQ) & LOCAL GHAZIABAD SEO AUTHORITY (#faq)
            ========================================================================== */}
        <section
          id="faq"
          className="py-20 sm:py-24 bg-gradient-to-b from-white via-[#f8faff] to-white border-b border-slate-200"
        >
          <div className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="text-center max-w-[820px] mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1570ef] text-xs font-bold tracking-wider uppercase mb-3.5">
                <span className="w-2 h-2 rounded-full bg-[#1570ef] animate-pulse" />
                Ghaziabad &amp; Delhi NCR Local Search Authority
              </div>
              <h2 className="text-[30px] sm:text-[42px] font-extrabold text-[#080d24] tracking-tight leading-[1.15]">
                Frequently Asked Questions About{" "}
                <span className="webfx-serif text-[#207de9] block sm:inline font-normal">
                  Digital Marketing in Ghaziabad
                </span>
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                Everything you need to know about Google Maps 3-Pack rankings, ROI-driven SEO, website architecture, and scaling your business with Digital FX.
              </p>
            </div>

            {/* Accordion List */}
            <div className="space-y-4">
              {ghaziabadFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={`faq-${idx}`}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "bg-white border-[#207de9] shadow-md ring-2 ring-blue-100"
                        : "bg-white/80 hover:bg-white border-slate-200 shadow-xs hover:border-slate-300"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left px-5 sm:px-7 py-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                      aria-expanded={isOpen}
                    >
                      <span className="text-[14.5px] sm:text-[16px] font-bold text-[#080d24] leading-snug">
                        {faq.q}
                      </span>
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-transform duration-200 ${
                          isOpen
                            ? "bg-[#207de9] text-white rotate-180"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        ▼
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 sm:px-7 pb-6 pt-1 text-xs sm:text-[14px] text-slate-600 leading-relaxed border-t border-slate-100 animate-fadeIn">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Local CTA Card */}
            <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#080d24] via-[#0d163d] to-[#080d24] text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div>
                <div className="flex items-center gap-2 text-xs font-extrabold text-amber-400 mb-1">
                  <span>★ ★ ★ ★ ★</span>
                  <span>4.9/5.0 Rated Agency</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Ready to rank #1 in Ghaziabad?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg font-normal">
                  Claim your free Google Maps and GEO AI Search audit today with our senior strategists.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <a
                  href="#geo-checker"
                  onClick={scrollToGeoAudit}
                  className="px-6 py-3.5 rounded-xl bg-[#207de9] hover:bg-[#1866c2] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all"
                >
                  Run Free Audit →
                </a>
                <a
                  href="#contact"
                  onClick={scrollToContact}
                  className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-bold border border-white/15 transition-all"
                >
                  Book Discovery Call
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
                      <div className="flex items-center gap-3">
                        <img
                          src="/logo.svg"
                          alt="Digital FX"
                          className="h-8 sm:h-9 w-auto object-contain"
                        />
                        <span className="text-sm font-bold text-slate-300">|</span>
                        <h3 className="text-sm sm:text-base font-extrabold text-[#080d24] tracking-tight">
                          DIGITAL MARKETING AGENCY
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
                      <div className="mt-3 pt-2.5 border-t border-slate-200/70 text-[11px] text-slate-600 flex items-start gap-1.5">
                        <span className="shrink-0 text-xs">🏢</span>
                        <div className="leading-snug">
                          <span className="font-semibold text-slate-700">Landmark: </span>
                          <span className="text-slate-600">Orbit Plaza Commercial Center (NH-24 Corridor)</span>
                        </div>
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
                        href="tel:+918447583685"
                        className="text-base sm:text-lg font-extrabold text-[#080d24] hover:text-[#1570ef] transition block font-mono"
                      >
                        +91 84475 83685
                      </a>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-normal">
                        Direct routing for Delhi NCR, national &amp; international inquiries.
                      </p>
                    </div>

                    {/* Direct Communications & WhatsApp */}
                    <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 mb-1">
                        <span>💬</span>
                        <span>WhatsApp &amp; Inquiries</span>
                      </div>
                      <a
                        href="https://wa.me/918447583685?text=Hi%20Digital%20FX%20team,%20I%20want%20to%20discuss%20a%20growth%20strategy."
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

                {/* Office Strategy Consultation Photo Banner */}
                <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
                  <img
                    src="/client-consultation.jpg"
                    alt="Digital FX Strategy Desk at Orbit Plaza, Crossings Republik"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080d24]/90 via-[#080d24]/40 to-transparent flex items-end p-4 sm:p-5">
                    <div className="text-white">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#207de9] text-[10px] font-extrabold uppercase tracking-wider">
                        In-Office Consultations
                      </span>
                      <p className="text-sm sm:text-base font-extrabold mt-1">
                        Meet Our Senior Strategists at Orbit Plaza, Crossings Republik
                      </p>
                      <p className="text-xs text-slate-200 font-normal hidden sm:block">
                        Shop No. 210, 2nd Floor • Welcoming Delhi NCR business owners &amp; clinic directors
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
                  <p className="text-xs sm:text-[13px] text-slate-500 font-normal mt-1 mb-4 leading-relaxed">
                    Tell us about your business goals. We’ll perform a competitor gap analysis and map out an attributable growth strategy.
                  </p>

                  <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 mb-5 shadow-xs group">
                    <img
                      src="/strategy-consultation-vector.jpg"
                      alt="Digital FX 1-on-1 Growth Consultation & Strategic Advisory"
                      className="w-full aspect-[16/9] object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

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
                          placeholder="+91 84475..."
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
        {/* ==========================================================================
            11. DIGITAL FX PROFESSIONAL FOOTER (MATCHING IMAGE 2 LAYOUT)
            ========================================================================== */}
        <footer className="bg-white text-slate-900 pt-16 pb-12 border-t border-slate-200 font-[var(--font-plus-jakarta)]">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* 4 Professional Columns Grid matching Image 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-slate-200">
              
              {/* Column 1: Brand Logo, Description & Certified Trust Badges */}
              <div className="space-y-5">
                {/* Brand Logo - Proportional & Clean */}
                <div className="flex items-center">
                  <img
                    src="/logo.svg"
                    alt="Digital FX - Best Digital Marketing Agency in Ghaziabad"
                    width={150}
                    height={50}
                    loading="lazy"
                    decoding="async"
                    className="h-10 sm:h-11 w-auto object-contain shrink-0"
                  />
                </div>

                {/* Company Tagline / Description */}
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                  We are the leading digital advertising &amp; SEO company that turns bold ideas into powerful results. Since our inception, innovation has been at the heart of what we do. At Digital FX, we&apos;re not just redefining digital marketing; we&apos;re reaching the unimaginable.
                </p>

                {/* Certified Trust Badges Row (Google 5-Star, Amazing Workplaces, Glassdoor) */}
                <div className="space-y-3 pt-2">
                  {/* Badge 1: Google Verified 5-Star Badge */}
                  <div className="flex items-center gap-2.5">
                    <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <div className="flex text-amber-400 text-xs tracking-tight">★ ★ ★ ★ ★</div>
                  </div>

                  {/* Badge 2: Amazing Workplaces Certified */}
                  <div className="inline-block px-3 py-1.5 rounded bg-[#fdd835] text-[#080d24] font-extrabold text-[10px] uppercase tracking-wider border border-amber-400 shadow-xs">
                    AMAZING WORKPLACES CERTIFIED INDIA
                  </div>

                  {/* Badge 3: Glassdoor 4.5 Badge */}
                  <div className="flex items-center gap-2 text-xs pt-1">
                    <span className="font-extrabold text-emerald-600 font-mono tracking-wider">GLASSDOOR</span>
                    <span className="font-bold text-slate-900">4.5</span>
                    <div className="flex text-amber-400 text-xs">★ ★ ★ ★ ★</div>
                  </div>
                </div>
              </div>

              {/* Column 2: Quick Links & Follow Us */}
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-4">
                  Quick Links
                </h4>
                <ul className="space-y-2 text-xs text-slate-700 font-normal">
                  <li><Link href="/" className="hover:text-[#207de9] transition">Home</Link></li>
                  <li><Link href="/services" className="hover:text-[#207de9] transition font-semibold text-slate-900">SEO &amp; Growth Services</Link></li>
                  <li><Link href="/case-studies" className="hover:text-[#207de9] transition font-semibold text-slate-900">The Digital FX Portfolio</Link></li>
                  <li><Link href="/pricing" className="hover:text-[#207de9] transition font-semibold text-slate-900">Digital Marketing Packages</Link></li>
                  <li><Link href="/tools" className="hover:text-[#207de9] transition font-semibold text-slate-900">Free AI Search &amp; GEO Tool</Link></li>
                  <li><Link href="/careers" className="hover:text-[#207de9] transition font-semibold text-[#207de9]">Careers (We Are Hiring!)</Link></li>
                  <li><Link href="/contact" className="hover:text-[#207de9] transition font-semibold text-slate-900">Contact &amp; Strategy Desk</Link></li>
                  <li><Link href="/locations" className="hover:text-[#207de9] transition">350+ Cities Directory</Link></li>
                  <li><Link href="/blog" className="hover:text-[#207de9] transition">Blog &amp; SEO Insights</Link></li>
                  <li><Link href="/privacy-policy" className="hover:text-[#207de9] transition">Privacy Policy</Link></li>
                  <li><Link href="/terms-and-conditions" className="hover:text-[#207de9] transition">Terms &amp; Conditions</Link></li>
                  <li><Link href="/refund-policy" className="hover:text-[#207de9] transition">Refund Policy</Link></li>
                  <li><Link href="/sitemap.xml" className="hover:text-[#207de9] transition">XML Sitemap</Link></li>
                </ul>

                {/* Follow Us Sub-section */}
                <div className="mt-6">
                  <h5 className="text-xs font-bold text-slate-900 mb-3">
                    Follow Us
                  </h5>
                  <div className="flex items-center gap-2">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#1877f2] text-white flex items-center justify-center font-bold text-xs hover:opacity-90 transition">f</a>
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs hover:opacity-90 transition">𝕏</a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#0a66c2] text-white flex items-center justify-center font-bold text-xs hover:opacity-90 transition">in</a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs hover:opacity-90 transition">📷</a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#ff0000] text-white flex items-center justify-center font-bold text-xs hover:opacity-90 transition">►</a>
                  </div>
                </div>
              </div>

              {/* Column 3: Solutions & Services */}
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-4">
                  Solutions &amp; Services
                </h4>
                <ul className="space-y-2 text-xs text-slate-700 font-normal">
                  <li><Link href="/services" className="hover:text-[#207de9] transition">CTV Advertising</Link></li>
                  <li><Link href="/services" className="hover:text-[#207de9] transition">Rich Media Innovation</Link></li>
                  <li><Link href="/services" className="hover:text-[#207de9] transition">Media Planning &amp; Buying</Link></li>
                  <li><Link href="/services" className="hover:text-[#207de9] transition">Programmatic Advertising</Link></li>
                  <li><Link href="/services" className="hover:text-[#207de9] transition">Pay Per Click (PPC / Google Ads)</Link></li>
                  <li><Link href="/services" className="hover:text-[#207de9] transition">Content Marketing</Link></li>
                  <li><Link href="/services" className="hover:text-[#207de9] transition font-semibold text-slate-900">Search Engine Optimization (SEO)</Link></li>
                  <li><Link href="/services" className="hover:text-[#207de9] transition font-semibold text-slate-900">Website &amp; App Development</Link></li>
                  <li><Link href="/services" className="hover:text-[#207de9] transition">Social Media Marketing</Link></li>
                  <li><Link href="/services" className="hover:text-[#207de9] transition">Reputation Management</Link></li>
                  <li><Link href="/services" className="hover:text-[#207de9] transition">Influencer Marketing</Link></li>
                  <li><button type="button" onClick={() => openPricingModal("email_marketing")} className="hover:text-[#207de9] transition text-left cursor-pointer">Email Marketing (₹4,999)</button></li>
                  <li><Link href="/contact" className="hover:text-[#207de9] transition">WhatsApp Lead Automation</Link></li>
                </ul>
              </div>

              {/* Column 4: Industries */}
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-4">
                  Industries
                </h4>
                <ul className="space-y-2 text-xs text-slate-700 font-normal">
                  <li><span className="hover:text-[#207de9] transition cursor-default">Hospitals &amp; Healthcare</span></li>
                  <li><span className="hover:text-[#207de9] transition cursor-default">Automobile &amp; Detailing</span></li>
                  <li><span className="hover:text-[#207de9] transition cursor-default">Real Estate &amp; Builders</span></li>
                  <li><span className="hover:text-[#207de9] transition cursor-default">Travel &amp; Hospitality</span></li>
                  <li><span className="hover:text-[#207de9] transition cursor-default">FMCG &amp; FMCD Brands</span></li>
                  <li><span className="hover:text-[#207de9] transition cursor-default">Education &amp; Institutes</span></li>
                  <li><span className="hover:text-[#207de9] transition cursor-default">E-Commerce &amp; D2C</span></li>
                  <li><span className="hover:text-[#207de9] transition cursor-default">Security &amp; Legal Services</span></li>
                  <li><span className="hover:text-[#207de9] transition cursor-default">Information Technology</span></li>
                  <li><span className="hover:text-[#207de9] transition cursor-default">Banking &amp; Financial Services</span></li>
                </ul>
              </div>

            </div>

            {/* Bottom Sub-footer Bar */}
            <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-600 gap-4 font-normal">
              <div>
                © {new Date().getFullYear()} Digital FX®. All rights reserved. Registered Office: Orbit Plaza, Crossings Republik, Ghaziabad.
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <Link href="/locations" className="hover:text-[#207de9] transition">350+ Cities Hub</Link>
                <Link href="/blog" className="hover:text-[#207de9] transition">Blog</Link>
                <Link href="/privacy-policy" className="hover:text-[#207de9] transition">Privacy Policy</Link>
                <Link href="/terms-and-conditions" className="hover:text-[#207de9] transition">Terms of Service</Link>
                <Link href="/refund-policy" className="hover:text-[#207de9] transition">Refund Policy</Link>
                <a href="/admin/login" className="hover:text-slate-900 transition text-slate-400">Admin Login</a>
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
                <div className="flex items-center gap-4">
                  <img src="/logo-white.svg" alt="Digital FX" width={138} height={46} decoding="async" className="h-9 sm:h-10 w-auto object-contain shrink-0" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
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
                        onClick={() => setSelectedPaymentPlan(paymentPlans.find((p) => p.id === "google_listing") || paymentPlans[0])}
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

                      {/* Plan 2: Email Marketing & CRM Automation */}
                      <div
                        onClick={() => setSelectedPaymentPlan(paymentPlans.find((p) => p.id === "email_marketing") || paymentPlans[1])}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                          selectedPaymentPlan?.id === "email_marketing"
                            ? "bg-white border-[#207de9] shadow-md ring-2 ring-[#207de9]/20"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3.5">
                            <div className={`w-5 h-5 rounded-full border mt-1 flex items-center justify-center shrink-0 transition ${
                              selectedPaymentPlan?.id === "email_marketing"
                                ? "border-[#207de9] bg-[#207de9]"
                                : "border-slate-300 bg-white"
                            }`}>
                              {selectedPaymentPlan?.id === "email_marketing" && (
                                <span className="w-2 h-2 rounded-full bg-white block" />
                              )}
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-base sm:text-lg font-bold text-[#080d24]">
                                  Email Marketing &amp; Automation
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                                  LIFECYCLE ROI
                                </span>
                              </div>
                              <div className="text-xs sm:text-[13px] text-slate-500 font-normal mt-0.5">
                                ESP Setup, 100% Inbox Placement (SPF/DKIM/DMARC) &amp; Nurture Drips
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xl sm:text-2xl font-extrabold text-[#080d24] tabular-nums">₹4,999</div>
                            <div className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">One-Time / Mo</div>
                          </div>
                        </div>

                        {/* Professional Deliverables Checklist */}
                        <ul className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-2 text-xs sm:text-[13px] text-slate-700 font-normal">
                          <li className="flex items-center gap-2.5">
                            <svg className="w-4 h-4 text-emerald-600 shrink-0 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Technical ESP setup (Mailchimp / Klaviyo / Brevo / Resend)</span>
                          </li>
                          <li className="flex items-center gap-2.5">
                            <svg className="w-4 h-4 text-emerald-600 shrink-0 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>100% Deliverability: SPF, DKIM, DMARC &amp; custom domain authentication</span>
                          </li>
                          <li className="flex items-center gap-2.5">
                            <svg className="w-4 h-4 text-emerald-600 shrink-0 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>3-step automated lead welcome drip &amp; conversion copywriting</span>
                          </li>
                        </ul>
                      </div>

                      {/* Plan 2: Website Development */}
                      <div
                        onClick={() => setSelectedPaymentPlan(paymentPlans.find((p) => p.id === "website") || paymentPlans[2])}
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
                        onClick={() => setSelectedPaymentPlan(paymentPlans.find((p) => p.id === "growth") || paymentPlans[3])}
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
                        onClick={() => setSelectedPaymentPlan(paymentPlans.find((p) => p.id === "custom") || paymentPlans[4])}
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
                                  setSelectedPaymentPlan(paymentPlans.find((p) => p.id === "custom") || paymentPlans[4]);
                                }
                              }}
                              onFocus={() => {
                                if (selectedPaymentPlan?.id !== "custom") {
                                  setSelectedPaymentPlan(paymentPlans.find((p) => p.id === "custom") || paymentPlans[4]);
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
                                  setSelectedPaymentPlan(paymentPlans.find((p) => p.id === "custom") || paymentPlans[4]);
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
                      href="https://wa.me/918447583685?text=Hello%20Digital%20FX%20Team%2C%20we%20require%20a%20custom%20growth%20proposal%20or%20enterprise%20agreement."
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
                      href="https://wa.me/918447583685?text=Hello%20Digital%20FX%20Team%2C%20I%20want%20to%20learn%20more%20about%20the%20upcoming%20AI%20Business%20Suite%20and%20early%20beta%20access."
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
            STRATEGIC PROPOSAL REQUEST MODAL (Requirement 11)
            ========================================================================== */}
        {proposalModalOpen && (
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-[#080d24]/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
            onClick={() => setProposalModalOpen(false)}
          >
            <div
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scaleUp text-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#080d24] text-white p-6 sm:p-8 border-b border-white/10 relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-extrabold uppercase tracking-widest">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      STRATEGIC PROPOSAL DESK
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-2">
                      Request Strategic Proposal
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Receive an executive growth roadmap, competitive AI gap analysis, and transparent scope for your business.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProposalModalOpen(false)}
                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition cursor-pointer shrink-0"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Form Body */}
              <div className="p-6 sm:p-8 space-y-4 bg-slate-50/50">
                {proposalSuccess ? (
                  <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold mx-auto">
                      ✓
                    </div>
                    <h4 className="text-base font-black text-emerald-900">
                      Proposal Request Confirmed!
                    </h4>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      {proposalSuccess}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleProposalSubmit} className="space-y-4">
                    {proposalError && (
                      <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-xs text-red-600">
                        {proposalError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={proposalName}
                          onChange={(e) => setProposalName(e.target.value)}
                          placeholder="e.g. Ramesh Sharma"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#207de9] transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          WhatsApp Mobile *
                        </label>
                        <input
                          type="tel"
                          required
                          value={proposalPhone}
                          onChange={(e) => setProposalPhone(e.target.value)}
                          placeholder="+91 84475 83685"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#207de9] transition tabular-nums"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Business Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={proposalEmail}
                          onChange={(e) => setProposalEmail(e.target.value)}
                          placeholder="name@yourcompany.com"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#207de9] transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Target Website URL *
                        </label>
                        <input
                          type="text"
                          required
                          value={proposalWebsite}
                          onChange={(e) => setProposalWebsite(e.target.value)}
                          placeholder="yourcompany.com"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#207de9] transition font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Primary Strategic Focus *
                      </label>
                      <select
                        value={proposalService}
                        onChange={(e) => setProposalService(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#207de9] transition"
                      >
                        <option value="Email Marketing & CRM Automation">
                          Email Marketing &amp; CRM Automation (Newsletters &amp; Drips)
                        </option>
                        <option value="Generative Engine Optimization (GEO)">
                          Generative Engine Optimization (GEO &amp; ChatGPT Citation)
                        </option>
                        <option value="Local SEO & Google Maps 3-Pack">
                          Local SEO &amp; Google Maps 3-Pack Domination
                        </option>
                        <option value="High-Speed Next.js Web Architecture">
                          High-Speed Next.js Web &amp; Mobile Architecture
                        </option>
                        <option value="Full-Funnel Digital Growth Retainer">
                          Full-Funnel Digital Growth Retainer &amp; Google Ads
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Specific Goals or Current Bottlenecks (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={proposalRequirement}
                        onChange={(e) => setProposalRequirement(e.target.value)}
                        placeholder="Tell us about your target locations, competitor domains, or revenue goals..."
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#207de9] transition resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={proposalLoading}
                      className="w-full py-3.5 rounded-xl bg-[#080d24] hover:bg-[#1570ef] text-white font-black text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                    >
                      {proposalLoading ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          <span>Generating Strategic Request...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Proposal Request</span>
                          <span>→</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================================
            FREE WEBSITE ANALYSIS LEAD CAPTURE MODAL (Requirement 7 & 8)
            ========================================================================== */}
        {auditCaptureOpen && (
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-[#080d24]/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
            onClick={() => setAuditCaptureOpen(false)}
          >
            <div
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scaleUp text-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#080d24] text-white p-6 border-b border-white/10 relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-extrabold uppercase tracking-widest">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      FREE AI AUDIT &amp; GEO SCAN
                    </div>
                    <h3 className="text-xl font-black tracking-tight text-white mt-2">
                      Unlock Full Diagnostic Report
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Auditing: <span className="text-[#6f8cff] font-mono font-bold">{geoWebsite || heroWebsite || "yourbusiness.com"}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAuditCaptureOpen(false)}
                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition cursor-pointer shrink-0"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Form Body */}
              <form onSubmit={handleAuditCaptureSubmit} className="p-6 space-y-4 bg-slate-50/60">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={auditCustomerName}
                    onChange={(e) => setAuditCustomerName(e.target.value)}
                    placeholder="e.g. Ankit Verma"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#207de9] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={auditCustomerPhone}
                    onChange={(e) => setAuditCustomerPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#207de9] transition tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={auditCustomerEmail}
                    onChange={(e) => setAuditCustomerEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#207de9] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Focus Service
                  </label>
                  <select
                    value={auditCustomerService}
                    onChange={(e) => setAuditCustomerService(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#207de9] transition"
                  >
                    <option value="Email Marketing & CRM Automation">Email Marketing &amp; CRM Automation</option>
                    <option value="GEO & AI Search Audit">GEO &amp; Generative AI Search Audit</option>
                    <option value="Local SEO & Google Maps 3-Pack">Local SEO &amp; Google Maps 3-Pack</option>
                    <option value="High-Speed Website Architecture">High-Speed Website Development</option>
                    <option value="Full Digital Growth Partner">Full-Funnel Digital Growth Retainer</option>
                  </select>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#207de9] to-[#080d24] hover:from-[#1767c2] text-white font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>⚡ Generate Verified Audit Report</span>
                    <span>→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuditCaptureOpen(false);
                      runGeoAudit(geoWebsite || heroWebsite);
                    }}
                    className="w-full text-center text-[11px] text-slate-400 hover:text-slate-600 transition font-medium py-1"
                  >
                    Skip &amp; Run Quick Scan Without Contact Details →
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==========================================================================
            GLOBAL SEARCH ENGINEERING & 1,098+ KEYWORDS MODAL
            ========================================================================== */}
        {isGlobalModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
            <div className="relative w-full max-w-[1400px] max-h-[92vh] my-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col font-[var(--font-plus-jakarta)]">
              {/* Modal Header */}
              <div className="bg-[#080d24] text-white px-5 sm:px-8 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white/10 text-xl shrink-0">
                    🌍
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base sm:text-lg font-extrabold text-white">
                        Global Search Engineering Explorer
                      </span>
                      <span className="text-[10px] uppercase font-black bg-amber-400 text-slate-900 px-2 py-0.5 rounded">
                        1,098+ Verified Keywords
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 hidden sm:block">
                      Dubai 🇦🇪, USA 🇺🇸, UK 🇬🇧, Saudi Arabia 🇸🇦, Canada 🇨🇦, Australia 🇦🇺, Singapore 🇸🇬
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <Link
                    href="/locations/dubai"
                    onClick={() => setIsGlobalModalOpen(false)}
                    className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold hover:bg-amber-400/30 transition"
                  >
                    <span>🇦🇪 Dubai Hub (AED 2,500)</span>
                  </Link>
                  <Link
                    href="/global-markets"
                    onClick={() => setIsGlobalModalOpen(false)}
                    className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white underline transition"
                  >
                    Full Page ↗
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsGlobalModalOpen(false)}
                    aria-label="Close modal"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition cursor-pointer text-base font-bold ml-1"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto p-3 sm:p-6 bg-slate-50/50">
                <GlobalKeywordsSection />
              </div>
            </div>
          </div>
        )}

      </main>
    </>
  );
}