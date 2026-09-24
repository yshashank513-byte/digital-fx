"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

interface ServiceDetail {
  id: string;
  number: string;
  title: string;
  category: "Performance" | "Search" | "Tech" | "Direct";
  tagline: string;
  shortDesc: string;
  fullOverview: string;
  deliverables: string[];
  kpis: { label: string; value: string }[];
  useCases: string[];
  processSteps: { step: string; title: string; desc: string }[];
  accentColor: string;
  bgLight: string;
}

const SERVICES_DATA: ServiceDetail[] = [
  {
    id: "ctv-advertising",
    number: "01",
    title: "CTV Advertising",
    category: "Performance",
    tagline: "High-Impact Smart TV & OTT Streaming Video Campaigns",
    shortDesc: "Reach millions of household decision-makers on Disney+ Hotstar, JioCinema, SonyLIV, and Smart TVs.",
    fullOverview:
      "Connected TV (CTV) advertising empowers brands to combine the immersive storytelling of traditional television with the surgical precision and tracking of digital performance marketing. Digital FX manages end-to-end CTV campaign execution across Indian and global OTT platforms.",
    deliverables: [
      "Non-skippable 15s/30s Full HD & 4K Video Ad Placement",
      "Household IP & Household Income Micro-Targeting",
      "Placement on Disney+ Hotstar, JioCinema, SonyLIV, YouTube TV",
      "Cross-Device Retargeting (Smart TV to Mobile Smartphone)",
      "Real-Time Verified Video Completion Rate (VCR) Tracking",
      "Brand Lift & Incremental Reach Analytics Reports",
    ],
    kpis: [
      { label: "Video Completion Rate", value: "88%+" },
      { label: "Target Audience Recall", value: "4.2x" },
      { label: "Min Household Reach", value: "500K+" },
    ],
    useCases: [
      "Real Estate & Luxury Housing Launches",
      "Automotive & EV Vehicle Brands",
      "D2C Consumer Brands & FMCG",
      "Higher Education & Universities",
    ],
    processSteps: [
      { step: "01", title: "Creative & Audience Blueprint", desc: "Define target household segments, income tiers, and geographic clusters." },
      { step: "02", title: "Publisher Direct Insertion", desc: "Deploy ads on top OTT platforms with guaranteed non-skippable inventory." },
      { step: "03", title: "Cross-Device Tracking", desc: "Pixel tracking connects TV ad views to mobile site visits and conversions." },
      { step: "04", title: "Performance Optimization", desc: "Shift budget dynamically toward high-converting dayparts and demographics." },
    ],
    accentColor: "#207de9",
    bgLight: "bg-blue-50/50",
  },
  {
    id: "programmatic-advertising",
    number: "02",
    title: "Programmatic Advertising",
    category: "Performance",
    tagline: "Automated DSP Bidding & Real-Time Audience Engine",
    shortDesc: "Data-driven media buying using Google DV360 & Demand-Side Platforms for maximum ROI.",
    fullOverview:
      "Programmatic Advertising bypasses manual ad buying by leveraging automated algorithms and real-time bidding (RTB) to purchase impressions across top-tier global news, sports, and niche media networks within milliseconds.",
    deliverables: [
      "Demand-Side Platform (DSP) Setup via Google DV360 & The Trade Desk",
      "First-Party Data Onboarding & CRM Audience Matching",
      "Contextual AI Keyword & Sentiment Content Targeting",
      "Dynamic Creative Optimization (DCO) for Personalized Ads",
      "Geo-Fencing & Precise Radius Location Targeting",
      "Transparent Domain-Level Supply Path Optimization (SPO)",
    ],
    kpis: [
      { label: "Reduction in CPA", value: "38%" },
      { label: "Brand Safety Guard", value: "100%" },
      { label: "Ad Network Reach", value: "98% Web" },
    ],
    useCases: [
      "B2B Enterprise Software & Tech",
      "Financial Services & FinTech",
      "Healthcare & Hospital Chains",
      "Global Export & Logistics Firms",
    ],
    processSteps: [
      { step: "01", title: "Audience Data Mapping", desc: "Integrate customer CRM data with third-party intent data signals." },
      { step: "02", title: "DSP Campaign Setup", desc: "Configure floor prices, frequency caps, and brand safety filters." },
      { step: "03", title: "Real-Time Bidding Execution", desc: "Automated bidding buys inventory at optimal impression rates." },
      { step: "04", title: "Conversion Attribution", desc: "Track view-through and click-through conversions across devices." },
    ],
    accentColor: "#4f46e5",
    bgLight: "bg-indigo-50/50",
  },
  {
    id: "pay-per-click-advertising",
    number: "03",
    title: "Pay-Per-Click Advertising",
    category: "Performance",
    tagline: "High-Intent Google Search, Performance Max & Display PPC",
    shortDesc: "Capture immediate sales inquiries from buyers actively searching for your services.",
    fullOverview:
      "Pay-Per-Click (PPC) is the fastest channel to generate qualified phone calls, leads, and direct sales. Digital FX builds surgical Google Ads campaigns with negative keyword shielding and conversion-optimized landing pages.",
    deliverables: [
      "Google Search Ads with Single Keyword Ad Groups (SKAGs)",
      "Performance Max (PMax) AI-Driven Multi-Channel Campaigns",
      "Google Shopping & Merchant Center Feed Optimization",
      "Negative Keyword Armor to Eliminate Wasted Spend",
      "High-Converting Landing Page Design & A/B Copy Testing",
      "Google Tag Manager (GTM) Conversion & Revenue Attribution",
    ],
    kpis: [
      { label: "Average ROAS", value: "4.5x - 9x" },
      { label: "Cost Per Lead Cut", value: "42%" },
      { label: "Click-To-Call Rate", value: "18.4%" },
    ],
    useCases: [
      "Doctors, Clinics & Hospitals",
      "Legal Advisors & Chartered Accountants",
      "Home Services & Emergency Repair",
      "Industrial B2B Manufacturers",
    ],
    processSteps: [
      { step: "01", title: "Intent Keyword Mining", desc: "Identify high-commercial-intent buyer keywords with exact match focus." },
      { step: "02", title: "Ad Copy & Extension Build", desc: "Craft compelling headlines, callouts, sitelinks, and structured snippets." },
      { step: "03", title: "Landing Page Sync", desc: "Align ad promises directly with ultra-fast dedicated landing pages." },
      { step: "04", title: "Smart Bidding Optimization", desc: "Scale campaigns based on Target CPA and Target ROAS algorithms." },
    ],
    accentColor: "#0284c7",
    bgLight: "bg-sky-50/50",
  },
  {
    id: "search-engine-optimization",
    number: "04",
    title: "Search Engine Optimization",
    category: "Search",
    tagline: "Google #1 Rankings, Local Maps 3-Pack & Generative AI Search (GEO)",
    shortDesc: "Dominate organic search results, local Google Maps listings, and AI search engines like ChatGPT & Perplexity.",
    fullOverview:
      "Our Search Engine Optimization (SEO) service combines technical site speed engineering, authoritative backlink building, local Google Business Profile optimization, and next-gen Generative Engine Optimization (GEO).",
    deliverables: [
      "Google Business Profile 3-Pack Domination Strategy",
      "Technical Core Web Vitals & Next.js Performance Audit",
      "High-Authority Contextual Backlink & Digital PR Outreach",
      "Generative AI Schema (JSON-LD) for ChatGPT & Perplexity Indexing",
      "Keyword & Topic Cluster Content Architecture",
      "Rank Tracking Dashboard with Weekly Keyword Progress",
    ],
    kpis: [
      { label: "Organic Lead Growth", value: "+340%" },
      { label: "Google Maps Calls", value: "3x Volume" },
      { label: "Page 1 Keyword Share", value: "85%+" },
    ],
    useCases: [
      "Local Businesses & Retail Stores",
      "Real Estate Agencies & Builders",
      "Coaching Institutes & Schools",
      "E-Commerce Brands & Marketplaces",
    ],
    processSteps: [
      { step: "01", title: "Comprehensive SEO & GEO Audit", desc: "Analyze technical hurdles, schema gaps, and competitor link profiles." },
      { step: "02", title: "On-Page & Architecture Fixes", desc: "Optimize title tags, headers, internal linking, and mobile page speed." },
      { step: "03", title: "Authority Link Building", desc: "Acquire high-DA niche citations and editorial media mentions." },
      { step: "04", title: "GEO & AI Indexing", desc: "Structure entity relationships so AI bots summarize your brand favorably." },
    ],
    accentColor: "#059669",
    bgLight: "bg-emerald-50/50",
  },
  {
    id: "content-marketing",
    number: "05",
    title: "Content Marketing",
    category: "Search",
    tagline: "Strategic Storytelling, Whitepapers, Case Studies & Viral Shorts",
    shortDesc: "Attract, educate, and convert your ideal prospects with authoritative content assets.",
    fullOverview:
      "Content is the engine of digital trust. Digital FX creates data-driven blog articles, industry whitepapers, customer case studies, and video content scripts designed to solve customer pain points and drive organic inbound leads.",
    deliverables: [
      "SEO-Optimized Editorial Long-Form Articles & Guides",
      "Customer Case Studies & ROI Success Stories",
      "Downloadable E-books & Lead-Magnet PDF Assets",
      "Short-Form Video Scripts for Instagram Reels & YouTube Shorts",
      "Content Distribution & Email Newsletter Syndication",
      "Keyword Intent Mapping & Topic Authority Clusters",
    ],
    kpis: [
      { label: "Organic Organic Reach", value: "5x" },
      { label: "Time On Page", value: "4m 20s" },
      { label: "Lead Magnet Conversion", value: "22%" },
    ],
    useCases: [
      "SaaS & Enterprise Tech Solutions",
      "Financial Planning & Advisory",
      "Healthcare Education & Medical Blogs",
      "B2B Corporate Services",
    ],
    processSteps: [
      { step: "01", title: "Buyer Persona Research", desc: "Uncover key questions and objections of your target customers." },
      { step: "02", title: "Editorial Content Calendar", desc: "Plan monthly high-value topics prioritized by organic search demand." },
      { step: "03", title: "Expert Writing & Production", desc: "Craft engaging, well-researched content with rich media visuals." },
      { step: "04", title: "Multi-Channel Distribution", desc: "Repurpose core content across LinkedIn, email, and social networks." },
    ],
    accentColor: "#d97706",
    bgLight: "bg-amber-50/50",
  },
  {
    id: "rich-media-innovation",
    number: "06",
    title: "Rich Media & Innovation",
    category: "Tech",
    tagline: "Interactive 3D Banners, Gamified Ads & AR Filters",
    shortDesc: "Capture user attention with dynamic, high-engagement interactive HTML5 ad creatives.",
    fullOverview:
      "Break through banner blindness with cutting-edge Rich Media ad formats. We craft expandable canvas ads, 360-degree product showcases, gamified ad units, and Augmented Reality (AR) try-on experiences that deliver 3x higher engagement.",
    deliverables: [
      "Interactive HTML5 Rich Media Banners (Expandable & Floating)",
      "3D Product Visualizers & 360-Degree Interactive Models",
      "Gamified Playable Ads for Mobile & In-App Placements",
      "Augmented Reality (AR) Try-On Filters for Instagram & Web",
      "Custom Micro-Interactions & Animation Design",
      "Cross-Platform Compatibility (IAB Standard Compliant)",
    ],
    kpis: [
      { label: "CTR vs Static Ads", value: "3.2x Higher" },
      { label: "User Dwell Time", value: "18 Seconds" },
      { label: "Brand Engagement", value: "74%" },
    ],
    useCases: [
      "Fashion & Apparel Brands",
      "Jewelry & Luxury Products",
      "Mobile Gaming & Entertainment Apps",
      "Consumer Electronics & Appliances",
    ],
    processSteps: [
      { step: "01", title: "Creative Concept & Storyboard", desc: "Design interactive wireframes and user interaction flows." },
      { step: "02", title: "HTML5 & WebGL Coding", desc: "Build ultra-lightweight interactive ad units optimized for instant loading." },
      { step: "03", title: "Ad Server Integration", desc: "Deploy across Google Display Network, DV360, and premium ad networks." },
      { step: "04", title: "Interaction Analytics Tracking", desc: "Measure hover rates, slide interactions, and custom event clicks." },
    ],
    accentColor: "#7c3aed",
    bgLight: "bg-purple-50/50",
  },
  {
    id: "online-reputation-management",
    number: "07",
    title: "Online Reputation Management",
    category: "Search",
    tagline: "Brand Protection, 5-Star Review Generation & Crisis Shielding",
    shortDesc: "Safeguard your corporate image, boost Google review ratings, and suppress negative search results.",
    fullOverview:
      "Your online reputation directly impacts your conversion rate. Digital FX's ORM service helps businesses build glowing 5-star Google review profiles, suppress unfair negative feedback, and establish a bulletproof digital identity.",
    deliverables: [
      "Automated SMS/WhatsApp 5-Star Review Acceleration Funnels",
      "Google Business Profile Review Response & Escalation Management",
      "Unfair/Fake Negative Review Dispute & Removal Support",
      "Search Engine Result Page (SERP) Suppression of Negative Content",
      "Executive & CEO Personal Reputation Building on LinkedIn",
      "24/7 Brand Mention Monitoring & Crisis Alerts",
    ],
    kpis: [
      { label: "Avg Star Rating", value: "4.9★" },
      { label: "Review Count Increase", value: "+250%" },
      { label: "Crisis Mitigation", value: "99%" },
    ],
    useCases: [
      "Doctors, Clinics & Hospitals",
      "Hotels, Restaurants & Venues",
      "Packers & Movers Logistics",
      "Corporate Leadership & Executives",
    ],
    processSteps: [
      { step: "01", title: "Reputation Health Audit", desc: "Scan reviews across Google, Trustpilot, Glassdoor, and social media." },
      { step: "02", title: "Review Generation Engine", desc: "Deploy automated post-purchase WhatsApp review requests to happy customers." },
      { step: "03", title: "Negative SERP Suppression", desc: "Publish authoritative branded assets to push down unwanted links." },
      { step: "04", title: "Ongoing Monitoring", desc: "Track brand sentiment 24/7 with instant alerts for new feedback." },
    ],
    accentColor: "#dc2626",
    bgLight: "bg-rose-50/50",
  },
  {
    id: "social-media-marketing",
    number: "08",
    title: "Social Media Marketing",
    category: "Direct",
    tagline: "Meta, Instagram Reels, LinkedIn & TikTok Brand Dominance",
    shortDesc: "Transform social channels into high-converting revenue streams with targeted organic and paid campaigns.",
    fullOverview:
      "Social media is where modern attention lives. Digital FX creates thumb-stopping short videos, carousel graphics, and hyper-targeted Meta (Facebook & Instagram) and LinkedIn ad campaigns that turn followers into paying customers.",
    deliverables: [
      "Custom Graphic & Reel Short Video Content Creation",
      "Hyper-Targeted Meta (Facebook & Instagram) Ad Campaigns",
      "LinkedIn B2B Account-Based Marketing (ABM) Outreach",
      "Community Management, DM Automation & Comment Responses",
      "Social Catalog & WhatsApp Shop Sync",
      "Monthly Social ROI & Conversion Performance Audits",
    ],
    kpis: [
      { label: "Monthly Impressions", value: "1M+" },
      { label: "ROAS on Meta Ads", value: "3.8x" },
      { label: "Engagement Boost", value: "220%" },
    ],
    useCases: [
      "Fashion Boutiques & Lifestyle Stores",
      "Beauty Salons & Wellness Spas",
      "Real Estate Projects & Developers",
      "B2B Corporate & SaaS Companies",
    ],
    processSteps: [
      { step: "01", title: "Brand Identity & Voice Setup", desc: "Establish visual aesthetic, brand colors, and communication tone." },
      { step: "02", title: "High-Frequency Content Engine", desc: "Produce reels, posts, and stories on a predictable monthly calendar." },
      { step: "03", title: "Paid Social Ad Scaling", desc: "Run custom audience retargeting and lookalike acquisition campaigns." },
      { step: "04", title: "Community & Lead Capture", desc: "Engage instantly with comments and auto-route DMs to sales reps." },
    ],
    accentColor: "#db2777",
    bgLight: "bg-pink-50/50",
  },
  {
    id: "website-app-development",
    number: "09",
    title: "Website & App Development",
    category: "Tech",
    tagline: "Ultra-Fast Next.js Websites, iOS/Android Apps & E-Commerce",
    shortDesc: "Custom built, sub-second loading digital platforms designed to maximize conversions.",
    fullOverview:
      "A slow or clunky website destroys ad budgets. We engineer enterprise-grade Next.js, React, and Node.js applications with 99+ Core Web Vitals performance, seamless WhatsApp integration, and mobile-first UX.",
    deliverables: [
      "High-Speed Next.js 14 Server-Rendered Web Architecture",
      "Mobile App Development (React Native / iOS & Android)",
      "Headless E-Commerce & Custom Shopify/WooCommerce Builds",
      "WhatsApp & Lead Management CRM Integrations",
      "Sub-Second Page Load Speeds (99/100 Google PageSpeed)",
      "Comprehensive SSL Security, DDoS Shield & Cloudflare CDN",
    ],
    kpis: [
      { label: "Page Load Speed", value: "< 0.8s" },
      { label: "Google PageSpeed", value: "99/100" },
      { label: "Conversion Lift", value: "+45%" },
    ],
    useCases: [
      "E-Commerce Brands & D2C Marketplaces",
      "Corporate Enterprise Websites",
      "On-Demand Booking & Booking Portals",
      "Fintech & SaaS Mobile Platforms",
    ],
    processSteps: [
      { step: "01", title: "UX Wireframing & Design", desc: "Figma UI/UX designs focused on high-conversion customer journeys." },
      { step: "02", title: "Full-Stack Development", desc: "Clean React/Next.js code structure optimized for search indexing." },
      { step: "03", title: "Rigorous Speed & Security Testing", desc: "Cross-browser, mobile responsiveness, and load testing." },
      { step: "04", title: "Deployment & Managed Hosting", desc: "Vercel / AWS deployment with SSL and automatic daily backups." },
    ],
    accentColor: "#2563eb",
    bgLight: "bg-blue-50/50",
  },
  {
    id: "media-planning-buying",
    number: "10",
    title: "Media Planning & Buying",
    category: "Performance",
    tagline: "Strategic Omnichannel Budget Allocation & Direct Publisher Rates",
    shortDesc: "Maximize reach and ROI across Digital, TV, Radio, Print, and Outdoor media channels.",
    fullOverview:
      "Effective media buying isn't just about spending money—it's about buying the right impressions at guaranteed lowest rates. Digital FX leverages direct publisher relationships to negotiate prime ad inventory.",
    deliverables: [
      "Comprehensive Target Audience Demographics & Flighting Plan",
      "Direct Publisher Rate Negotiations & Rate-Card Discounts",
      "Cross-Media Attribution & Multi-Touch Funnel Tracking",
      "Digital, Print, Radio & Outdoor (OOH) Coordinated Flighting",
      "Real-Time Post-Evaluation & Impression Audit Reports",
      "Competitor Ad Spend & Share of Voice (SOV) Benchmarking",
    ],
    kpis: [
      { label: "Media Rate Discount", value: "25 - 35%" },
      { label: "Wasted Impression Shield", value: "0%" },
      { label: "Effective CPM Cut", value: "30%" },
    ],
    useCases: [
      "Pan-India Corporate Enterprises",
      "FMCG Consumer Brands",
      "Political & Public Cause Campaigns",
      "Large-Scale Event Organizers",
    ],
    processSteps: [
      { step: "01", title: "Audience Media Audit", desc: "Determine exact channel consumption habits of your target buyer." },
      { step: "02", title: "Strategic Allocation", desc: "Distribute budgets across digital, OTT, radio, and outdoor touchpoints." },
      { step: "03", title: "Publisher Direct Buying", desc: "Secure preferred rates and prime placements." },
      { step: "04", title: "Flighting Analysis", desc: "Monitor daily performance metrics and reallocate underperforming inventory." },
    ],
    accentColor: "#475569",
    bgLight: "bg-slate-50/50",
  },
  {
    id: "email-marketing",
    number: "11",
    title: "Email Marketing & CRM Automation",
    category: "Direct",
    tagline: "High-Deliverability Newsletters, Klaviyo & Drip Funnels",
    shortDesc: "Turn email subscribers into repeat buyers with automated flows and 100% inbox placement.",
    fullOverview:
      "Email marketing remains the highest ROI channel in digital marketing ($38 return for every $1 spent). We configure technical SPF/DKIM/DMARC inbox authentication, build responsive email templates, and create automated lifecycle drip sequences.",
    deliverables: [
      "Technical Domain Authentication (SPF, DKIM, DMARC, BIMI Setup)",
      "Automated E-Commerce Klaviyo / Mailchimp Lifecycle Sequences",
      "Abandoned Cart, Browse Abandonment & Welcome Series Drips",
      "Custom Mobile-Responsive HTML Email Template Design",
      "Audience List Hygiene, Bounce Cleaning & Spam Score Audits",
      "A/B Subject Line & Preview Text Conversion Optimization",
    ],
    kpis: [
      { label: "Average Email ROI", value: "38:1" },
      { label: "Inbox Placement", value: "99.4%" },
      { label: "Average Open Rate", value: "34%+" },
    ],
    useCases: [
      "E-Commerce & D2C Retail Brands",
      "SaaS Subscription Platforms",
      "B2B Professional Services",
      "Education & Online Courses",
    ],
    processSteps: [
      { step: "01", title: "Technical DNS Setup", desc: "Authenticate domain records to bypass spam filters completely." },
      { step: "02", title: "Automated Drip Design", desc: "Build automated sequences for welcome, purchase, and win-back flows." },
      { step: "03", title: "Segmented Broadcasts", desc: "Send targeted campaigns to active subscribers based on purchase history." },
      { step: "04", title: "Analytics & Revenue Attribution", desc: "Track exact revenue generated per email broadcast." },
    ],
    accentColor: "#0284c7",
    bgLight: "bg-sky-50/50",
  },
  {
    id: "influencer-marketing",
    number: "12",
    title: "Influencer Marketing",
    category: "Direct",
    tagline: "Creator Sourcing, UGC Content & Authentic Brand Endorsements",
    shortDesc: "Leverage trusted regional micro and macro influencers to drive viral word-of-mouth sales.",
    fullOverview:
      "Consumers trust creators more than traditional ads. Digital FX connects your brand with vetted Instagram, YouTube, and LinkedIn creators who possess authentic, highly engaged regional and national followings.",
    deliverables: [
      "Influencer Vetting, Audience Authenticity & Engagement Audits",
      "Contract Negotiation, Rights Management & Product Seeding",
      "High-Converting User Generated Content (UGC) Asset Creation",
      "Affiliate & Unique Promo Code Tracking Setup",
      "Multi-Creator Campaign Co-ordination & Timed Drops",
      "Whitelisting Creator Handles for Paid Meta Ads",
    ],
    kpis: [
      { label: "ROI vs Brand Ads", value: "4.8x Higher" },
      { label: "Creator Network", value: "5,000+ Vetted" },
      { label: "Engagement Rate", value: "6.5%+" },
    ],
    useCases: [
      "Beauty, Cosmetics & Skincare",
      "Food, Beverages & Cafes",
      "Fitness Apps & Nutrition Brands",
      "Travel & Boutique Resorts",
    ],
    processSteps: [
      { step: "01", title: "Creator Selection", desc: "Match creators with genuine follower demographics fitting your target audience." },
      { step: "02", title: "Creative Briefing & Seeding", desc: "Send product samples and outline clear brand messaging guidelines." },
      { step: "03", title: "Campaign Execution", desc: "Coordinate synchronized reel and video posts for maximum impact." },
      { step: "04", title: "Performance & Promo Tracking", desc: "Measure traffic, promo code usage, and sales conversions." },
    ],
    accentColor: "#9333ea",
    bgLight: "bg-purple-50/50",
  },
  {
    id: "whatsapp-marketing",
    number: "13",
    title: "WhatsApp Marketing",
    category: "Direct",
    tagline: "Official WhatsApp Business API, Green Tick & Automated Funnels",
    shortDesc: "Engage customers directly on their favorite chat app with 98% open rates and instant responses.",
    fullOverview:
      "WhatsApp is India's default messaging app. Digital FX builds official WhatsApp Business API integrations featuring green tick verification, automated chatbots, interactive button broadcasts, and direct CRM lead routing.",
    deliverables: [
      "Official WhatsApp Business API Setup & Green Tick Application",
      "Automated Lead Capture & Qualification Chatbot Sequences",
      "High-Open-Rate Interactive Broadcast Campaigns (Buttons & Lists)",
      "Shopify & CRM Webhook Sync for Order Updates & Abandoned Carts",
      "24/7 Auto-Responder & Live Agent Desk Multi-User Support",
      "Meta Approved Broadcast Message Template Management",
    ],
    kpis: [
      { label: "Message Open Rate", value: "98%" },
      { label: "Click-Through Rate", value: "45%" },
      { label: "Lead Response Time", value: "< 15 Sec" },
    ],
    useCases: [
      "Real Estate Developers & Agents",
      "Healthcare & Diagnostic Labs",
      "Coaching Institutes & Admissions",
      "Financial Services & Loan Enquiry",
    ],
    processSteps: [
      { step: "01", title: "API Verification & Setup", desc: "Verify Facebook Business Manager and activate official WhatsApp API." },
      { step: "02", title: "Chatbot & Flow Building", desc: "Design interactive decision-tree chatbot flows to qualify leads." },
      { step: "03", title: "CRM & Webhook Sync", desc: "Connect incoming chat leads directly to your sales team's CRM." },
      { step: "04", title: "Broadcast Campaign Optimization", desc: "Send targeted promotional offers to opted-in customer segments." },
    ],
    accentColor: "#16a34a",
    bgLight: "bg-green-50/50",
  },
];

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<"All" | "Performance" | "Search" | "Tech" | "Direct">("All");
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [proposalService, setProposalService] = useState("");
  const [proposalName, setProposalName] = useState("");
  const [proposalPhone, setProposalPhone] = useState("");
  const [proposalEmail, setProposalEmail] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");
  const [proposalLoading, setProposalLoading] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState("");
  const [proposalError, setProposalError] = useState("");

  const filteredServices =
    activeTab === "All"
      ? SERVICES_DATA
      : SERVICES_DATA.filter((s) => s.category === activeTab);

  function openProposal(serviceTitle: string) {
    setProposalService(serviceTitle);
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
          service: proposalService,
          message: proposalMessage.trim(),
          is_proposal: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit proposal request.");
      }

      setProposalSuccess("Thank you! Our Senior Strategy Team will contact you within 15 minutes.");
      setProposalName("");
      setProposalPhone("");
      setProposalEmail("");
      setProposalMessage("");
    } catch (err) {
      setProposalError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setProposalLoading(false);
    }
  }

  return (
    <main
      className={`${plusJakartaSans.variable} ${playfairDisplay.variable} min-h-screen bg-slate-50 font-[var(--font-plus-jakarta)] text-[#101828] antialiased selection:bg-[#207de9] selection:text-white`}
    >
      {/* Schema.org Markup for Services */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.digitalfx.in" },
              { "@type": "ListItem", position: 2, name: "Services", item: "https://www.digitalfx.in/services" },
            ],
          }),
        }}
      />

      {/* 1. UNIVERSAL TOPBAR & MAIN HEADER WITH SERVICES DROPDOWN & MOBILE DRAWER */}
      <Navbar currentPath="/services" onOpenProposal={() => openProposal("Full Growth Consultation")} />

      {/* 3. HERO SECTION */}
      <section className="bg-gradient-to-b from-[#080d24] via-[#0b1333] to-[#080d24] text-white pt-14 pb-20 relative overflow-hidden border-b border-slate-800">
        {/* Background Subtle Grid & Glow */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-extrabold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            360° Digital Growth &amp; Technology Divisions
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
            Performance Marketing &amp; Tech Capabilities{" "}
            <span className="font-[var(--font-playfair)] italic font-normal text-blue-400 block sm:inline">
              Engineered for Revenue
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Discover our 13 specialized service channels designed to dominate local Google Maps, scale paid ad campaigns, build ultra-fast websites, and automate WhatsApp customer funnels.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800 text-left sm:text-center">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-black text-white">500+</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Active Campaigns</div>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">4.9★</div>
              <div className="text-xs text-slate-400 font-medium mt-1">128+ Verified Reviews</div>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">$50M+</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Ad Spend Managed</div>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-black text-blue-400">98%</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Client Retention Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FILTER TABS & SERVICE CARDS GRID */}
      <section className="py-16 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Navigation Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {(["All", "Performance", "Search", "Tech", "Direct"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-[#207de9] text-white shadow-md shadow-blue-500/25 scale-105"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {tab === "All"
                ? "All 13 Services"
                : tab === "Performance"
                ? "Performance Ads (CTV, PPC, DSP)"
                : tab === "Search"
                ? "Search & Organic (SEO, GEO, ORM)"
                : tab === "Tech"
                ? "Tech & Innovation (Web, Apps, 3D)"
                : "Direct & Social (WhatsApp, SMM, Email)"}
            </button>
          ))}
        </div>

        {/* 13 SERVICES GRID - EXACT LAYOUT FROM USER'S SCREENSHOT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedService(service)}
              className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 p-6 flex flex-col justify-between items-center text-center cursor-pointer overflow-hidden min-h-[360px]"
            >
              {/* Service Illustration Container (Vector Graphic matching screenshot) */}
              <div className={`w-full h-44 rounded-xl ${service.bgLight} flex items-center justify-center p-4 mb-4 relative overflow-hidden transition-transform group-hover:scale-[1.02]`}>
                <ServiceIllustration id={service.id} />
                <span className="absolute top-3 right-3 text-[10px] font-black uppercase bg-white/90 px-2 py-0.5 rounded text-slate-500 border border-slate-200">
                  {service.number}
                </span>
              </div>

              {/* Service Title & Brief */}
              <div className="w-full flex-1 flex flex-col items-center justify-center mb-6">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight group-hover:text-[#207de9] transition-colors leading-snug">
                  {service.title}
                </h2>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 font-medium px-1">
                  {service.shortDesc}
                </p>
              </div>

              {/* Signature Blue Button - "Know More →" matching screenshot */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedService(service);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#207de9] hover:bg-[#1a6bc7] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all group-hover:bg-[#1a6bc7]"
              >
                <span>Know More</span>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold leading-none">
                  →
                </span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE SERVICE DETAIL MODAL (Opens when clicking "Know More →") */}
      {selectedService && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-[#080d24]/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col animate-scaleUp text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#080d24] text-white p-6 sm:p-8 border-b border-slate-800 shrink-0 relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center shrink-0">
                    <ServiceIllustration id={selectedService.id} mini />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded border border-blue-400/30 mb-1">
                      <span>Service Division #{selectedService.number}</span>
                      <span>•</span>
                      <span>{selectedService.category}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {selectedService.title}
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-base font-bold transition cursor-pointer shrink-0"
                >
                  ✕
                </button>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-slate-300 font-medium">
                {selectedService.tagline}
              </p>
            </div>

            {/* Modal Content Body */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-8 bg-slate-50/50">
              {/* Overview */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                  Executive Overview
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {selectedService.fullOverview}
                </p>
              </div>

              {/* Key Deliverables */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                  Key Deliverables &amp; Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedService.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className="text-xs font-semibold text-slate-800 leading-snug">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benchmarks & Expected KPIs */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                  Verified Performance KPIs
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {selectedService.kpis.map((kpi, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                      <div className="text-xl sm:text-2xl font-black text-[#207de9]">
                        {kpi.value}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-1">
                        {kpi.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Implementation 4-Step Process */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                  Strategic Implementation Process
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedService.processSteps.map((step, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#207de9] font-black text-xs flex items-center justify-center shrink-0">
                        {step.step}
                      </span>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">{step.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-snug font-medium">
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 sm:p-6 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <a
                href={`https://wa.me/919319807273?text=Hi%20Digital%20FX,%20I%20want%20to%20know%20more%20about%20your%20${encodeURIComponent(selectedService.title)}%20service.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Talk to Specialist on WhatsApp</span>
                <span className="text-sm">💬</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  const title = selectedService.title;
                  setSelectedService(null);
                  openProposal(title);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#207de9] hover:bg-[#1a6bc7] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
              >
                <span>Request Custom Proposal</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. PROPOSAL REQUEST MODAL */}
      {proposalModalOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 bg-[#080d24]/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
          onClick={() => setProposalModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scaleUp text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#080d24] text-white p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white">Get Customized Growth Proposal</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Selected Division: <span className="text-blue-400 font-bold">{proposalService || "General Services"}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProposalModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/10 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {proposalSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-black mx-auto">
                  ✓
                </div>
                <h4 className="text-lg font-black text-slate-900">Proposal Request Received!</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {proposalSuccess}
                </p>
                <button
                  type="button"
                  onClick={() => setProposalModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#080d24] text-white font-bold text-xs"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleProposalSubmit} className="p-6 space-y-4 bg-slate-50/50">
                {proposalError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                    {proposalError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={proposalName}
                    onChange={(e) => setProposalName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#207de9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={proposalPhone}
                    onChange={(e) => setProposalPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#207de9] tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Business Email (Optional)</label>
                  <input
                    type="email"
                    value={proposalEmail}
                    onChange={(e) => setProposalEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#207de9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Requirement / Monthly Budget Goals</label>
                  <textarea
                    rows={3}
                    value={proposalMessage}
                    onChange={(e) => setProposalMessage(e.target.value)}
                    placeholder="Describe your current targets, target locations, or questions..."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#207de9] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={proposalLoading}
                  className="w-full py-3.5 rounded-xl bg-[#207de9] hover:bg-[#1a6bc7] text-white font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {proposalLoading ? "Submitting Proposal Request..." : "Submit Proposal Request →"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* UNIVERSAL BRANDED FOOTER */}
      <Footer />
    </main>
  );
}

{/* VECTOR ILLUSTRATION COMPONENT FOR EACH SERVICE CARD */}
function ServiceIllustration({ id, mini }: { id: string; mini?: boolean }) {
  const size = mini ? "w-10 h-10" : "w-28 h-28 sm:w-32 sm:h-32";

  switch (id) {
    case "ctv-advertising":
      return (
        <svg className={size} viewBox="0 0 120 120" fill="none">
          <rect x="15" y="25" width="90" height="58" rx="8" fill="#E0E7FF" stroke="#3730A3" strokeWidth="3" />
          <rect x="22" y="32" width="76" height="44" rx="4" fill="#EEF2FF" />
          <path d="M52 44L74 54L52 64V44Z" fill="#4338CA" />
          <path d="M40 92H80" stroke="#3730A3" strokeWidth="4" strokeLinecap="round" />
          <path d="M60 83V92" stroke="#3730A3" strokeWidth="4" />
          <circle cx="90" cy="20" r="10" fill="#818CF8" opacity="0.6" />
        </svg>
      );

    case "programmatic-advertising":
      return (
        <svg className={size} viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="42" fill="#EEF2FF" stroke="#4338CA" strokeWidth="3" />
          <circle cx="60" cy="60" r="28" stroke="#6366F1" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="60" cy="60" r="14" fill="#818CF8" />
          <path d="M60 10V22M60 98V110M10 60H22M98 60H110" stroke="#4338CA" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case "pay-per-click-advertising":
      return (
        <svg className={size} viewBox="0 0 120 120" fill="none">
          <rect x="20" y="20" width="80" height="70" rx="8" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3" />
          <path d="M30 40H70M30 52H55" stroke="#0369A1" strokeWidth="3" strokeLinecap="round" />
          <circle cx="80" cy="75" r="18" fill="#38BDF8" opacity="0.4" />
          <path d="M65 85L80 50L95 85L80 75L65 85Z" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
        </svg>
      );

    case "search-engine-optimization":
      return (
        <svg className={size} viewBox="0 0 120 120" fill="none">
          <rect x="18" y="22" width="84" height="66" rx="8" fill="#ECFDF5" stroke="#059669" strokeWidth="3" />
          <path d="M30 38H65M30 50H50" stroke="#047857" strokeWidth="3" strokeLinecap="round" />
          <path d="M30 75L50 55L68 68L90 42" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="90" cy="42" r="5" fill="#059669" />
        </svg>
      );

    case "content-marketing":
      return (
        <svg className={size} viewBox="0 0 120 120" fill="none">
          <rect x="24" y="18" width="72" height="84" rx="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="3" />
          <line x1="36" y1="34" x2="84" y2="34" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
          <line x1="36" y1="46" x2="72" y2="46" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
          <line x1="36" y1="58" x2="84" y2="58" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
          <circle cx="78" cy="78" r="14" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
          <path d="M74 78L82 78M78 74L78 82" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case "rich-media-innovation":
      return (
        <svg className={size} viewBox="0 0 120 120" fill="none">
          <rect x="25" y="25" width="70" height="70" rx="10" fill="#F3E8FF" stroke="#7C3AED" strokeWidth="3" />
          <path d="M45 40L75 60L45 80V40Z" fill="#9333EA" />
          <path d="M20 60H30M90 60H100M60 20V30M60 90V100" stroke="#A855F7" strokeWidth="3" strokeLinecap="round" />
          <circle cx="88" cy="32" r="6" fill="#C084FC" />
        </svg>
      );

    case "online-reputation-management":
      return (
        <svg className={size} viewBox="0 0 120 120" fill="none">
          <path d="M60 18L92 32V60C92 80 78 96 60 102C42 96 28 80 28 60V32L60 18Z" fill="#FFE4E6" stroke="#E11D48" strokeWidth="3" />
          <path d="M60 38L64.5 48.5L76 49.5L67.5 57L70 68L60 62L50 68L52.5 57L44 49.5L55.5 48.5L60 38Z" fill="#F43F5E" />
        </svg>
      );

    case "social-media-marketing":
      return (
        <svg className={size} viewBox="0 0 120 120" fill="none">
          <rect x="30" y="16" width="60" height="88" rx="12" fill="#FCE7F3" stroke="#DB2777" strokeWidth="3" />
          <rect x="38" y="28" width="44" height="52" rx="4" fill="#FFFFFF" stroke="#F472B6" strokeWidth="2" />
          <circle cx="60" cy="54" r="12" fill="#F43F5E" opacity="0.8" />
          <path d="M55 54C55 51 60 48 60 48C60 48 65 51 65 54C65 57 60 60 60 60C60 60 55 57 55 54Z" fill="#FFFFFF" />
          <circle cx="60" cy="92" r="3" fill="#DB2777" />
        </svg>
      );

    case "website-app-development":
      return (
        <svg className={size} viewBox="0 0 120 120" fill="none">
          <rect x="16" y="24" width="70" height="52" rx="6" fill="#EFF6FF" stroke="#2563EB" strokeWidth="3" />
          <path d="M16 36H86" stroke="#3B82F6" strokeWidth="2" />
          <rect x="64" y="44" width="40" height="54" rx="8" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="3" />
          <circle cx="84" cy="90" r="2.5" fill="#1E40AF" />
        </svg>
      );

    case "media-planning-buying":
      return (
        <svg className={size} viewBox="0 0 120 120" fill="none">
          <rect x="20" y="20" width="80" height="80" rx="10" fill="#F1F5F9" stroke="#475569" strokeWidth="3" />
          <line x1="20" y1="50" x2="100" y2="50" stroke="#64748B" strokeWidth="2" />
          <line x1="50" y1="20" x2="50" y2="100" stroke="#64748B" strokeWidth="2" />
          <circle cx="35" cy="35" r="7" fill="#334155" />
          <circle cx="75" cy="75" r="10" fill="#475569" />
          <path d="M35 75L75 35" stroke="#0EA5E9" strokeWidth="3" strokeDasharray="3 3" />
        </svg>
      );

    case "email-marketing":
      return (
        <svg className={size} viewBox="0 0 120 120" fill="none">
          <rect x="18" y="30" width="84" height="60" rx="8" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3" />
          <path d="M18 36L60 66L102 36" stroke="#0369A1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="92" cy="32" r="8" fill="#38BDF8" />
          <path d="M89 32L95 32" stroke="#FFFFFF" strokeWidth="2" />
        </svg>
      );

    case "influencer-marketing":
      return (
        <svg className={size} viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="45" r="20" fill="#F3E8FF" stroke="#9333EA" strokeWidth="3" />
          <path d="M30 92C30 75 43 65 60 65C77 65 90 75 90 92" stroke="#9333EA" strokeWidth="3" strokeLinecap="round" />
          <polygon points="90,25 94,33 103,34 96,40 98,49 90,44 82,49 84,40 77,34 86,33" fill="#A855F7" />
        </svg>
      );

    case "whatsapp-marketing":
      return (
        <svg className={size} viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="42" fill="#DCFCE7" stroke="#16A34A" strokeWidth="3" />
          <path
            d="M42 78L45 68C43 64 42 60 42 56C42 45 50 37 61 37C72 37 80 45 80 56C80 67 72 75 61 75C57 75 53 74 49 72L42 78Z"
            fill="#22C55E"
            stroke="#15803D"
            strokeWidth="2"
          />
          <path d="M53 48C52 46 51 46 50 46C49 46 48 46 47 47C46 48 44 50 44 53C44 56 47 60 47 60C48 61 53 66 61 69C67 71 68 70 69 69C71 68 73 65 73 63C73 62 73 61 71 60C70 60 67 58 66 58C65 58 64 58 64 59C63 60 62 61 61 61C60 62 59 61 58 61C56 60 53 58 51 55C49 53 49 51 50 50C50 49 51 48 52 48Z" fill="#FFFFFF" />
        </svg>
      );

    default:
      return (
        <svg className={size} viewBox="0 0 120 120" fill="none">
          <rect x="20" y="20" width="80" height="80" rx="12" fill="#EEF2FF" stroke="#4338CA" strokeWidth="3" />
        </svg>
      );
  }
}
