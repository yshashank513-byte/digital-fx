export interface ServiceDeliverable {
  title: string;
  desc: string;
  iconName: string;
}

export interface ServiceProcessStep {
  step: string;
  phase: string;
  title: string;
  desc: string;
}

export interface ServiceMetric {
  label: string;
  value: string;
  detail: string;
}

export interface ServicePricingTier {
  name: string;
  badge?: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface ServiceCaseStudyRef {
  client: string;
  metric: string;
  result: string;
  industry: string;
  slug: string;
}

export interface ServiceData {
  slug: string;
  aliases?: string[];
  title: string;
  shortTitle: string;
  category: "Search & Visibility" | "Paid Advertising" | "Tech & Engineering" | "Brand & Growth";
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroTagline: string;
  heroBadge: string;
  overview: string;
  whyItMatters: {
    heading: string;
    points: string[];
  };
  deliverables: ServiceDeliverable[];
  process: ServiceProcessStep[];
  keyMetrics: ServiceMetric[];
  targetIndustries: { name: string; application: string }[];
  faqs: { question: string; answer: string }[];
  pricingTiers: ServicePricingTier[];
  caseStudy: ServiceCaseStudyRef;
  relatedServices: { slug: string; title: string }[];
}

export const SERVICES_CATALOG: Record<string, ServiceData> = {
  "digital-marketing": {
    slug: "digital-marketing",
    title: "Full-Funnel Digital Marketing Services",
    shortTitle: "Digital Marketing",
    category: "Brand & Growth",
    metaTitle: "360° Digital Marketing Agency | ROI & Revenue Growth | Digital FX",
    metaDescription: "Drive predictable business growth with Digital FX's full-funnel digital marketing services across India: SEO, Google Ads, Meta Ads, and AI search optimization.",
    h1: "High-Performance Full-Funnel Digital Marketing",
    heroTagline: "We bridge the gap between digital visibility and bottom-line revenue. From initial brand discovery to closed customer acquisition, our data-backed systems maximize return on ad spend (ROAS).",
    heroBadge: "Full-Funnel Growth Architecture",
    overview: "Modern digital marketing is not about disparate channels or vanity vanity impressions; it is an integrated revenue machine. Digital FX engineers synchronized multi-channel funnels combining intent-driven search (Google SEO & Maps 3-Pack), demand-generation performance ads (Meta & Google PPC), and automated retention infrastructure (WhatsApp API & CRM workflows) to produce sustainable, measurable compounding returns.",
    whyItMatters: {
      heading: "Why Fragmented Marketing Fails in 2026",
      points: [
        "Siloed agencies run ads that generate leads your sales team cannot close due to zero pre-qualification.",
        "Over-reliance on single channels (like Meta ads alone) leads to volatile customer acquisition costs when algorithms change.",
        "Generative AI search engines (ChatGPT, Google Gemini Overviews) now answer customer queries before they ever click standard blue links.",
        "Digital FX unifies search dominance, paid acquisition, and conversion engineering into a singular growth engine."
      ],
    },
    deliverables: [
      {
        title: "Omnichannel Acquisition Strategy",
        desc: "Custom-tailored growth roadmaps combining SEO, paid search, social advertising, and content syndication based on your unit economics.",
        iconName: "strategy"
      },
      {
        title: "Intent-Based Search Engine Dominance",
        desc: "Capture active in-market buyers at the exact moment they search for your products or services across Google, Google Maps, and AI engines.",
        iconName: "search"
      },
      {
        title: "High-ROAS Paid Media Campaigns",
        desc: "Precision bidding and creative testing on Google Ads, Meta, and LinkedIn targeting verified high-value decision-makers.",
        iconName: "ads"
      },
      {
        title: "Rapid Conversion Rate Optimization (CRO)",
        desc: "Sub-second Next.js landing pages, interactive calculators, and frictionless 1-click WhatsApp lead funnels.",
        iconName: "cro"
      },
      {
        title: "Automated Lead Nurturing & CRM",
        desc: "Instant automated WhatsApp and email follow-up workflows that trigger within 30 seconds of lead capture.",
        iconName: "automation"
      },
      {
        title: "End-to-End Attribution & Revenue Dashboards",
        desc: "Real-time Google Looker Studio and server-side tracking providing 100% clarity on cost-per-lead and customer acquisition cost.",
        iconName: "analytics"
      }
    ],
    process: [
      {
        step: "01",
        phase: "Audit & Architecture",
        title: "Comprehensive Digital & Competitor Audit",
        desc: "We analyze your current digital footprint, conversion bottlenecks, competitor keyword share, and customer buying journeys."
      },
      {
        step: "02",
        phase: "Conversion Infrastructure",
        title: "Landing Page & Tracking Setup",
        desc: "We deploy high-converting sub-second landing pages and server-side Meta CAPI / Google Ads conversion tracking."
      },
      {
        step: "03",
        phase: "Multi-Channel Launch",
        title: "Synchronized Campaign Rollout",
        desc: "Simultaneous execution across high-intent Google search, granular Meta lookalikes, and local map pack optimization."
      },
      {
        step: "04",
        phase: "Scale & Optimize",
        title: "Continuous ROAS Compounding",
        desc: "Weekly creative refreshes, budget reallocation toward top-performing segments, and CRM lead velocity enhancements."
      }
    ],
    keyMetrics: [
      { label: "Average ROAS", value: "4.8x", detail: "Across managed performance campaigns" },
      { label: "CPL Reduction", value: "42%", detail: "Within 60 days of funnel optimization" },
      { label: "Client Revenue Generated", value: "₹6Cr+", detail: "Tracked directly in client CRMs" },
      { label: "First-Page Keywords", value: "850+", detail: "Currently ranking in top 3 positions" }
    ],
    targetIndustries: [
      { name: "Real Estate & Housing", application: "High-intent buyer lead capture, virtual site tour funnels, and geo-targeted ads." },
      { name: "Healthcare & Clinics", application: "Patient appointment bookings, Google 3-Pack dominance, and verified review funnels." },
      { name: "B2B & Industrial", application: "High-ticket distributor enquiries, OEM procurement pipelines, and LinkedIn targeting." },
      { name: "E-Commerce & D2C", application: "Scaled purchase volume, ROAS management, and WhatsApp repeat-order automation." }
    ],
    faqs: [
      {
        question: "How long does it take to see tangible results from digital marketing?",
        answer: "Paid advertising (Google & Meta Ads) generates qualified leads within the first 72 to 96 hours of campaign activation. Organic SEO and Google Maps domination typically demonstrate strong compounding gains within 60 to 90 days."
      },
      {
        question: "What makes Digital FX different from typical digital marketing agencies?",
        answer: "We do not charge retainers for vanity metrics like impressions or follower counts. Every campaign is engineered around verifiable cost-per-acquisition (CPA), qualified pipeline leads, and closed revenue tracked directly inside your CRM."
      },
      {
        question: "Do you manage both paid ads and search engine optimization?",
        answer: "Yes. In fact, our core philosophy is full-funnel integration: paid search data informs high-converting organic SEO keywords, while organic brand authority dramatically lowers paid customer acquisition costs."
      }
    ],
    pricingTiers: [
      {
        name: "Growth Starter",
        price: "₹24,999",
        period: "per month",
        description: "Ideal for local businesses and emerging brands seeking immediate local search dominance and lead generation.",
        features: [
          "Google Maps 3-Pack Optimization & Local SEO",
          "Google Ads PPC Management (up to ₹50k ad spend)",
          "Dedicated Next.js High-Speed Landing Page",
          "WhatsApp Lead Notification & 1-Click Bot",
          "Monthly Performance & Lead Audit Report"
        ]
      },
      {
        name: "Scale Accelerator",
        badge: "Most Popular",
        recommended: true,
        price: "₹49,999",
        period: "per month",
        description: "Comprehensive multi-channel growth engine for established businesses scaling regional and national market share.",
        features: [
          "Full-Funnel Organic SEO (25 Target Keywords)",
          "Google Search + Meta Ads Multi-Channel Campaigns",
          "Server-side Meta Conversions API (CAPI) & GA4",
          "Custom Conversion Funnel & A/B Testing",
          "Bi-Weekly Strategy Calls & Dedicated Account Lead",
          "ReviewFlow AI Automated Customer Review Desk"
        ]
      },
      {
        name: "Enterprise Dominance",
        price: "₹95,000",
        period: "per month",
        description: "Bespoke aggressive market capture for multi-location enterprises, healthcare chains, and real estate developers.",
        features: [
          "Omnichannel Enterprise Growth Strategy",
          "Generative AI Search Engine Optimization (GEO)",
          "Custom Next.js Web Application & CRM Integration",
          "Unlimited Ad Spend Management with Daily Bidding",
          "Dedicated Strategist, Copywriter & UI Engineer",
          "24/7 Priority Emergency Support SLA"
        ]
      }
    ],
    caseStudy: {
      client: "NCR Luxury Realty Advisors",
      metric: "6.2x Verified ROAS",
      result: "Reduced CPL from ₹1,450 to ₹380 while generating 1,140+ qualified site visits within 6 months.",
      industry: "Real Estate",
      slug: "ncr-luxury-realty"
    },
    relatedServices: [
      { slug: "google-ads", title: "Google Ads Management" },
      { slug: "seo", title: "Search Engine Optimization" },
      { slug: "web-development", title: "High-Speed Web Development" }
    ]
  },

  "seo": {
    slug: "seo",
    aliases: ["seo-services"],
    title: "Search Engine Optimization (SEO Services)",
    shortTitle: "SEO Services",
    category: "Search & Visibility",
    metaTitle: "Data-Driven SEO Services | Rank #1 on Google | Digital FX",
    metaDescription: "Dominate Google search results with Digital FX's technical, on-page, and entity-based SEO services. Proven ranking strategies with zero black-hat risks.",
    h1: "Data-Driven Search Engine Optimization (SEO)",
    heroTagline: "Stop renting visibility through ever-increasing ad costs. We engineer organic Google authority that ranks on page one, captures high-intent commercial buyers, and compounds month after month.",
    heroBadge: "Entity & Semantic SEO Architecture",
    overview: "Search engine optimization has fundamentally changed. Google no longer simply counts keywords; its AI algorithms evaluate topical authority, schema entity relationships, and user engagement signals. Digital FX delivers enterprise-grade SEO combining sub-second technical performance, semantic content clusters, and authoritative brand entity signals that earn sustainable #1 rankings.",
    whyItMatters: {
      heading: "The Power of High-Intent Organic Search",
      points: [
        "Over 68% of all online experiences begin with an organic search engine query.",
        "Organic search leads offer a 14.6% close rate, compared to just 1.7% for outbound leads.",
        "With Google's AI Overviews and algorithm updates, thin affiliate content has collapsed while technical authority sites thrive.",
        "Digital FX protects your website from algorithmic penalties through white-hat, entity-grounded architecture."
      ],
    },
    deliverables: [
      {
        title: "Deep Technical SEO & Core Web Vitals",
        desc: "Elimination of crawl budget waste, canonical conflicts, rendering blockers, and achieving sub-second Largest Contentful Paint (LCP).",
        iconName: "technical"
      },
      {
        title: "Topical Authority & Content Hubs",
        desc: "Exhaustive semantic keyword clustering that establishes your domain as the definitive authoritative source in your niche.",
        iconName: "content"
      },
      {
        title: "Structured Data & Schema.org Graph",
        desc: "Advanced nested JSON-LD markup (Organization, Service, FAQ, LocalBusiness) to secure rich snippets and AI search citations.",
        iconName: "schema"
      },
      {
        title: "High-Quality Brand Authority & Outreach",
        desc: "Acquisition of contextually relevant, editorially placed backlinks and digital PR citations with zero PBNs or link farms.",
        iconName: "backlinks"
      },
      {
        title: "Generative Engine Optimization (GEO)",
        desc: "Optimizing content formatting to be cited and recommended directly by Google Gemini AI Overviews and ChatGPT Search.",
        iconName: "geo"
      },
      {
        title: "Rank Tracking & Search Console Intelligence",
        desc: "Daily rank tracking across desktop and mobile, indexed page health monitoring, and keyword impression trends.",
        iconName: "tracking"
      }
    ],
    process: [
      {
        step: "01",
        phase: "Diagnostic",
        title: "Comprehensive Technical & Content Audit",
        desc: "We perform a 120-point crawl of your site, diagnosing indexation leaks, duplicate schemas, and missed ranking opportunities."
      },
      {
        step: "02",
        phase: "Foundation",
        title: "On-Page & Information Architecture Fixes",
        desc: "Re-engineering H1-H3 hierarchies, meta tags, internal link silos, and Schema.org graphs across all key URLs."
      },
      {
        step: "03",
        phase: "Authority Building",
        title: "Content Cluster Publishing & Digital PR",
        desc: "Publishing deep commercial pillar pages and securing editorial citations from high-authority industry platforms."
      },
      {
        step: "04",
        phase: "Compounding",
        title: "Ranking Expansion & Conversion Tuning",
        desc: "Expanding into secondary long-tail keywords and continuously optimizing click-through rates (CTR) in search results."
      }
    ],
    keyMetrics: [
      { label: "Top 3 Rankings", value: "+380%", detail: "Average commercial keyword growth in 6 months" },
      { label: "Organic Clicks", value: "4.5x", detail: "Multiplication of qualified inbound search traffic" },
      { label: "Indexed Pages", value: "100%", detail: "Zero orphaned pages or crawl bottlenecks" },
      { label: "Core Web Vitals", value: "98/100", detail: "Mobile Google PageSpeed score standard" }
    ],
    targetIndustries: [
      { name: "Specialized Healthcare", application: "Doctor specialities, treatment costs, and localized clinic keyword dominance." },
      { name: "Legal & Corporate Advisory", application: "High-value commercial litigation and corporate compliance search capture." },
      { name: "Industrial & Manufacturing", application: "B2B parts, technical specifications, and export procurement search visibility." },
      { name: "Financial & FinTech", application: "Investment solutions, loan advisory, and wealth management authority." }
    ],
    faqs: [
      {
        question: "How long until our website reaches the first page of Google?",
        answer: "Low-competition and high-intent local keywords frequently reach page one within 45 to 60 days. Highly competitive national or commercial terms generally require 3 to 6 months of systematic technical optimization and topical authority building."
      },
      {
        question: "Do you guarantee #1 rankings on Google?",
        answer: "No ethical agency can guarantee specific #1 positions, as Google's algorithms are proprietary. However, we guarantee rigorous adherence to Google Search Essentials, transparent monthly reporting, and proven methodology that has achieved top 3 positions for over 850 keywords."
      },
      {
        question: "How does Digital FX adapt to Google's AI Search Overviews?",
        answer: "We specialize in Generative Engine Optimization (GEO). We structure all content with direct answers, verifiable statistical tables, clear entity definitions, and robust Schema.org markup so Google's AI models pick your brand as the cited source."
      }
    ],
    pricingTiers: [
      {
        name: "Regional SEO",
        price: "₹19,999",
        period: "per month",
        description: "Targeted organic search optimization for city-level service providers and local market leaders.",
        features: [
          "15 High-Intent Commercial Target Keywords",
          "Comprehensive Technical & Speed Audit",
          "On-Page Optimization & Schema Implementation",
          "2 In-Depth Authority Content Pieces / Month",
          "Monthly Search Console & Rank Tracking Reports"
        ]
      },
      {
        name: "National Scale SEO",
        badge: "Recommended",
        recommended: true,
        price: "₹39,999",
        period: "per month",
        description: "Full-scale organic dominance for national brands, multi-location businesses, and competitive industries.",
        features: [
          "35 High-Volume Target Keywords",
          "Complete Semantic Content Pillar Strategy",
          "Generative AI Search (GEO) Citation Optimization",
          "4 High-Authority Editorial Backlink Placements",
          "Core Web Vitals Ongoing Performance Tuning",
          "Dedicated SEO Strategist & Monthly Review Meeting"
        ]
      },
      {
        name: "Enterprise Authority",
        price: "₹75,000",
        period: "per month",
        description: "Custom enterprise SEO program for large e-commerce platforms, SaaS brands, and industry leaders.",
        features: [
          "Unlimited Keyword Tracking & Opportunity Mapping",
          "Complex JavaScript & Headless CMS Architecture Support",
          "High-Tier Digital PR & Executive Thought Leadership",
          "Competitor Disruption & Backlink Gap Elimination",
          "Weekly Rank Audits & Direct Slack Access"
        ]
      }
    ],
    caseStudy: {
      client: "Om Logistics & Relocation Desk",
      metric: "2,400+ Monthly Organic Leads",
      result: "Dominated commercial shifting queries across 35+ Tier-1 & Tier-2 cities through structured programmatic SEO.",
      industry: "Logistics & Supply Chain",
      slug: "om-logistics"
    },
    relatedServices: [
      { slug: "local-seo", title: "Local SEO & Google 3-Pack" },
      { slug: "technical-seo", title: "Technical SEO & Core Web Vitals" },
      { slug: "web-development", title: "Custom Next.js Web Development" }
    ]
  },

  "local-seo": {
    slug: "local-seo",
    title: "Local SEO & Google Maps 3-Pack Domination",
    shortTitle: "Local SEO",
    category: "Search & Visibility",
    metaTitle: "Local SEO Agency | Rank #1 on Google Maps 3-Pack | Digital FX",
    metaDescription: "Dominate the Google Maps 3-Pack and capture high-intent local customers with Digital FX's Google Business Profile optimization and geo-grid SEO.",
    h1: "Google Maps 3-Pack & Local SEO Domination",
    heroTagline: "When customers near you search for your services on their phones, do you appear in the top 3 map results? We engineer local entity signals that place your business directly in front of nearby buyers.",
    heroBadge: "Hyperlocal Proximity & Map Pack Optimization",
    overview: "Over 76% of people who conduct a local search on their smartphone visit a business within 24 hours. The Google Maps 3-Pack captures over 44% of total clicks on local search results. Digital FX delivers systematic local SEO: Google Business Profile (GBP) optimization, geo-targeted landing pages, review acceleration via ReviewFlow AI, and consistent NAP citations across the Indian web.",
    whyItMatters: {
      heading: "Why Local Businesses Win or Lose on Google Maps",
      points: [
        "Traditional organic listings are pushed below the fold on mobile screens by the Google Maps 3-Pack.",
        "Proximity, prominence, and review velocity are the three primary algorithmic pillars of local rankings.",
        "Competitors with fewer customer reviews can outrank you if their profile categories, geo-relevance, and citations are superior.",
        "Digital FX solves this with our proprietary ReviewFlow AI NFC standees and hyper-local citation frameworks."
      ],
    },
    deliverables: [
      {
        title: "Google Business Profile (GBP) Optimization",
        desc: "Complete overhaul of primary and secondary categories, service menus, product catalogs, attributes, and geo-tagged visual assets.",
        iconName: "gbp"
      },
      {
        title: "Geo-Grid Local Rank Tracking",
        desc: "Pinpoint ranking visualization showing exactly where your business ranks at every 500-meter radius across your city.",
        iconName: "geogrid"
      },
      {
        title: "ReviewFlow AI Review Acceleration",
        desc: "Hardware NFC standees and automated WhatsApp workflows that capture authentic 5-star customer reviews at the point of sale.",
        iconName: "reviews"
      },
      {
        title: "Hyper-Local Landing Pages",
        desc: "Dedicated city and sector landing pages equipped with LocalBusiness JSON-LD schema, neighborhood landmarks, and localized FAQs.",
        iconName: "locations"
      },
      {
        title: "NAP Citation Building & Cleanup",
        desc: "Consistent distribution of Name, Address, and Phone across Justdial, IndiaMART, Sulekha, Google Maps, and Apple Maps.",
        iconName: "citations"
      },
      {
        title: "Local Spam & Competitor Fighting",
        desc: "Reporting and eliminating fake competitor keyword-stuffed listings that unfairly hijack legitimate local customer traffic.",
        iconName: "shield"
      }
    ],
    process: [
      {
        step: "01",
        phase: "Audit",
        title: "Geo-Grid Rank & Profile Analysis",
        desc: "We generate a comprehensive geo-grid scan measuring your Google Maps rankings at 25+ geographical coordinates around your address."
      },
      {
        step: "02",
        phase: "Profile Optimization",
        title: "GBP Re-structuring & Entity Alignment",
        desc: "Optimizing business categories, description keywords, service catalogs, and uploading high-resolution geo-tagged media."
      },
      {
        step: "03",
        phase: "Review Acceleration",
        title: "Deploy ReviewFlow AI Infrastructure",
        desc: "Setting up automated review collection links, QR codes, and NFC tap standees for instant customer feedback generation."
      },
      {
        step: "04",
        phase: "Hyperlocal Silos",
        title: "Local Page Indexing & Geo-Citations",
        desc: "Publishing localized landing pages and submitting verified citations to top Indian and regional business directories."
      }
    ],
    keyMetrics: [
      { label: "Direct Phone Calls", value: "+312%", detail: "Increase in monthly click-to-call taps from Google Maps" },
      { label: "Driving Directions", value: "+240%", detail: "Growth in customers navigating directly to client premises" },
      { label: "Map 3-Pack Presence", value: "#1", detail: "Dominant ranking across top target local search terms" },
      { label: "Verified Reviews", value: "4.9★", detail: "Average client reputation maintained across Google" }
    ],
    targetIndustries: [
      { name: "Dental Clinics & Doctors", application: "Implant, cosmetic dentistry, and emergency clinic searches." },
      { name: "Luxury Salons & Spas", application: "Walk-in appointments, premium hair treatments, and bridal bookings." },
      { name: "Automotive & Car Service Centers", application: "Car repair near me, periodic maintenance, and detailing inquiries." },
      { name: "Restaurants & Cafes", application: "Table reservations, food delivery discovery, and party inquiries." }
    ],
    faqs: [
      {
        question: "How long does it take to enter the Google Maps 3-Pack?",
        answer: "Most local businesses observe notable ranking improvements within 30 to 45 days. Businesses in competitive commercial areas typically achieve solid top-3 positioning within 60 to 90 days as review velocity and citations accumulate."
      },
      {
        question: "Can you help remove fake negative reviews from my Google profile?",
        answer: "While Google strictly controls review removal, we identify reviews that violate Google's Prohibited Content Policy (conflict of interest, profanity, competitor attacks) and submit official appeals to Google Support for removal."
      },
      {
        question: "What is ReviewFlow AI and how does it relate to Local SEO?",
        answer: "ReviewFlow AI is Digital FX's proprietary review capture system. By placing smart NFC standees at your physical reception or counter, customers tap their smartphones to leave authentic 5-star Google reviews in 3 seconds, significantly increasing local ranking velocity."
      }
    ],
    pricingTiers: [
      {
        name: "Single Location Pro",
        price: "₹14,999",
        period: "per month",
        description: "Essential local search dominance for single-branch clinics, studios, retail outlets, and professional offices.",
        features: [
          "Google Business Profile Optimization",
          "Geo-Grid 5x5 Ranking Scan Every 14 Days",
          "ReviewFlow AI Smart Review Landing Page",
          "20 Local Directory & NAP Citations",
          "Weekly GBP Photo & Update Posts",
          "Local Keyword Rank Tracking"
        ]
      },
      {
        name: "3-Pack Champion",
        badge: "Recommended",
        recommended: true,
        price: "₹27,999",
        period: "per month",
        description: "Aggressive local domination including physical ReviewFlow NFC smart hardware and localized web silos.",
        features: [
          "Everything in Single Location Pro",
          "1 Complimentary ReviewFlow AI NFC Counter Standee",
          "3 Dedicated Hyperlocal Website Landing Pages",
          "Competitor Keyword-Stuffing Spam Removal",
          "45 High-DA Indian Citations & Synced Data",
          "Monthly Dedicated Strategy & Growth Call"
        ]
      },
      {
        name: "Multi-Location Enterprise",
        price: "₹49,999",
        period: "per month (up to 5 locations)",
        description: "Centralized local SEO management for hospital chains, retail franchises, and multi-branch networks.",
        features: [
          "Centralized Multi-Location Dashboard",
          "ReviewFlow AI Standees for All Locations",
          "Store Locator Web Architecture & Schema",
          "Automated Duplicate Profile Merging & Defense",
          "Dedicated Account Manager & Priority Support"
        ]
      }
    ],
    caseStudy: {
      client: "Smile Dental Clinic & Implant Centre",
      metric: "+312% Growth in Direct Inquiries",
      result: "Achieved top 3 Google Maps rank for 'dental implant in Indirapuram', generating 420+ calls per month.",
      industry: "Healthcare",
      slug: "smile-dental"
    },
    relatedServices: [
      { slug: "seo", title: "Search Engine Optimization" },
      { slug: "google-ads", title: "Google Ads Management" },
      { slug: "digital-marketing", title: "Full-Funnel Digital Marketing" }
    ]
  },

  "technical-seo": {
    slug: "technical-seo",
    title: "Technical SEO & Core Web Vitals Optimization",
    shortTitle: "Technical SEO",
    category: "Tech & Engineering",
    metaTitle: "Technical SEO Services & Core Web Vitals Audit | Digital FX",
    metaDescription: "Fix crawl errors, eliminate render-blocking code, achieve sub-second Core Web Vitals, and build scalable schema architecture with Digital FX.",
    h1: "Advanced Technical SEO & Core Web Vitals",
    heroTagline: "Even the best content cannot rank if search engine crawlers struggle to index your website. We engineer lightning-fast architectures that search engine bots love to crawl and rank.",
    heroBadge: "Next.js 16 & Server-Side Performance Engineering",
    overview: "Google evaluates technical performance as a foundational ranking criterion. A 1-second delay in mobile page load reduces conversion rates by up to 20%. Digital FX bridges the gap between software engineering and technical search architecture, resolving JavaScript hydration bottlenecks, Core Web Vitals (LCP, CLS, INP), crawl budget allocation, and complex international sitemaps.",
    whyItMatters: {
      heading: "The Technical Foundation of Organic Growth",
      points: [
        "Google's crawlers operate on strict crawl budget limits; slow or bloated pages get ignored.",
        "Google's 2024 INP (Interaction to Next Paint) metric directly penalizes sluggish JavaScript execution.",
        "Incorrect canonical tags, trailing slash conflicts, and redirect chains quietly drain domain equity.",
        "Digital FX solves this at the source code level using modern Next.js 16 App Router SSR architectures."
      ],
    },
    deliverables: [
      {
        title: "Core Web Vitals Optimization (LCP, CLS, INP)",
        desc: "Eliminating render-blocking resources, font flickering, layout shifts, and heavy scripts to achieve 95+ PageSpeed scores.",
        iconName: "speed"
      },
      {
        title: "JavaScript & Server-Side Rendering (SSR)",
        desc: "Ensuring all essential text, metadata, and structured data is delivered in the initial HTML payload without relying on client-side JS.",
        iconName: "code"
      },
      {
        title: "Crawl Budget & Indexation Control",
        desc: "Custom robots.txt rules, XML sitemaps with dynamic lastmod dates, and prevention of soft-404 or duplicate URL crawl loops.",
        iconName: "bot"
      },
      {
        title: "Schema.org Entity Graph Implementation",
        desc: "Authoritative JSON-LD markup connecting Organizations, LocalBusinesses, Services, Articles, Authors, and FAQs seamlessly.",
        iconName: "schema"
      },
      {
        title: "Canonicalization & Redirect Architecture",
        desc: "Resolution of HTTP/HTTPS, WWW/non-WWW variations, trailing slash consistency, and safe 301 migration maps.",
        iconName: "redirect"
      },
      {
        title: "International & Multi-Regional SEO",
        desc: "Hreflang implementation, geotargeting headers, and clean URL routing for multi-city and cross-border expansion.",
        iconName: "globe"
      }
    ],
    process: [
      {
        step: "01",
        phase: "Deep Audit",
        title: "Log File & Server Crawl Diagnostic",
        desc: "We analyze server access logs and run headless browser crawls to identify how Googlebot interacts with your pages."
      },
      {
        step: "02",
        phase: "Remediation",
        title: "Code-Level Performance Engineering",
        desc: "Our developers directly refactor problematic CSS/JS, optimize image compression (WebP/AVIF), and fix canonical structures."
      },
      {
        step: "03",
        phase: "Structured Data",
        title: "Schema Knowledge Graph Deployment",
        desc: "Writing and validating error-free nested JSON-LD schemas verified through Google's Rich Results Test."
      },
      {
        step: "04",
        phase: "Monitoring",
        title: "Search Console Telemetry & Guardrails",
        desc: "Setting up real-time monitoring for coverage errors, redirect anomalies, and performance regressions."
      }
    ],
    keyMetrics: [
      { label: "Mobile LCP", value: "<1.2s", detail: "Sub-second Largest Contentful Paint achieved" },
      { label: "CLS Score", value: "0.00", detail: "Zero visual layout shift on desktop or mobile" },
      { label: "Crawl Efficiency", value: "+180%", detail: "Increase in weekly Googlebot crawled pages" },
      { label: "Rich Snippets", value: "100%", detail: "Error-free Schema.org validation pass rate" }
    ],
    targetIndustries: [
      { name: "E-Commerce Stores (5,000+ SKUs)", application: "Faceted navigation indexing, canonical filters, and out-of-stock URL management." },
      { name: "SaaS & Tech Platforms", application: "React/Next.js dynamic app hydration and client-side rendering fixes." },
      { name: "Publishers & News Portals", application: "Google Discover qualification, AMP deprecation, and instant mobile speed." },
      { name: "Real Estate Portals", application: "High-volume programmatic city and property listing crawl efficiency." }
    ],
    faqs: [
      {
        question: "Can your team implement technical SEO fixes directly in our codebase?",
        answer: "Yes. Unlike consulting agencies that only provide static PDF audit reports, Digital FX has full-stack engineers experienced in Next.js, React, Node.js, WordPress, and Shopify who can implement fixes directly via Git pull requests."
      },
      {
        question: "What is Google's INP metric and why does it affect rankings?",
        answer: "INP (Interaction to Next Paint) replaced FID in 2024 as a Core Web Vital. It measures the latency of every user tap, click, or keypress on your page. Slow interactions frustrate mobile visitors and directly reduce organic ranking eligibility."
      },
      {
        question: "Will technical SEO help if our website content is already good?",
        answer: "Yes, tremendously. Many companies produce exceptional content that is practically invisible to Google because search bots encounter JavaScript rendering errors, crawl budget exhaustion, or conflicting canonical headers."
      }
    ],
    pricingTiers: [
      {
        name: "Technical Sprint Audit",
        price: "₹29,999",
        period: "one-time",
        description: "Comprehensive 150-point diagnostic identifying all speed, crawl, indexation, and architectural roadblocks.",
        features: [
          "Full Site Crawl & Log File Analysis",
          "Core Web Vitals Bottleneck Breakdown",
          "Schema.org Validation & Entity Graph Map",
          "Actionable Developer Fix Specifications",
          "60-Minute Executive & Tech Review Presentation"
        ]
      },
      {
        name: "Turnkey Implementation",
        badge: "Recommended",
        recommended: true,
        price: "₹59,999",
        period: "one-time + 30d QA",
        description: "Hands-on engineering fixes implemented directly into your codebase with 30-day indexation monitoring.",
        features: [
          "Complete Sprint Audit Included",
          "Hands-On Code Fixes (Next.js / WordPress / Shopify)",
          "Image Pipeline Optimization & Font Preloading",
          "Nested JSON-LD Schema Deployment",
          "Search Console Indexation Clean-Up",
          "Post-Deployment 30-Day Crawl Verification"
        ]
      },
      {
        name: "Retainer & Architecture SLA",
        price: "₹34,999",
        period: "per month",
        description: "Continuous performance monitoring and architectural support for fast-growing dynamic websites.",
        features: [
          "Ongoing Core Web Vitals Guardrails",
          "New Feature Technical Review & PR Approvals",
          "Continuous Schema Graph Expansion",
          "Search Console Error Alerting & Instant Fixes",
          "Direct Developer Slack Integration"
        ]
      }
    ],
    caseStudy: {
      client: "Digital FX Platform Migration",
      metric: "99/100 Mobile PageSpeed",
      result: "Achieved sub-second TTFB and zero CLS across 250+ static routes using Next.js 16 App Router.",
      industry: "Digital Infrastructure",
      slug: "digital-fx-architecture"
    },
    relatedServices: [
      { slug: "seo", title: "Search Engine Optimization" },
      { slug: "web-development", title: "High-Speed Web Development" },
      { slug: "local-seo", title: "Local SEO & Google 3-Pack" }
    ]
  },

  "google-ads": {
    slug: "google-ads",
    title: "Google Ads Management (Search, Performance Max & YouTube)",
    shortTitle: "Google Ads",
    category: "Paid Advertising",
    metaTitle: "Google Ads Agency | High-ROAS Search & PMax PPC | Digital FX",
    metaDescription: "Certified Google Premier Partner agency managing profitable Search, Performance Max, and YouTube campaigns with surgical negative keyword control.",
    h1: "High-Intent Google Ads & PPC Management",
    heroTagline: "Stop burning ad budget on low-intent search terms. We engineer high-converting Google Ads campaigns built around buyer intent, negative keyword defense, and verified offline conversion tracking.",
    heroBadge: "Certified Google Ads Partner Agency",
    overview: "Google Ads is the single fastest way to reach customers actively searching with commercial intent. However, without strict match-type architecture and conversion tracking, businesses routinely waste 40% to 60% of their ad spend on irrelevant clicks. Digital FX constructs precision Google Search, Performance Max, Display, and YouTube campaigns engineered to generate qualified customer leads at the lowest feasible Cost Per Acquisition (CPA).",
    whyItMatters: {
      heading: "Why Most Google Ads Campaigns Burn Money",
      points: [
        "Broad match keywords default to capturing informational queries rather than ready-to-buy decision-makers.",
        "Missing negative keyword lists bleed money on job seekers, free downloaders, and irrelevant locations.",
        "Sending ad traffic to generic homepages rather than dedicated sub-second landing pages cuts conversion rates in half.",
        "Digital FX solves this with Single-Keyword Ad Groups (SKAGs), intent match types, and dedicated conversion pages."
      ],
    },
    deliverables: [
      {
        title: "Single Theme Ad Group (STAG) Architecture",
        desc: "Granular campaign structuring ensuring 100% ad copy alignment with the specific user search query.",
        iconName: "target"
      },
      {
        title: "Negative Keyword Fortress",
        desc: "Proactive deployment of 500+ negative keywords to prevent wasted clicks on free, course, job, and irrelevant intent.",
        iconName: "shield"
      },
      {
        title: "Performance Max (PMax) Optimization",
        desc: "Strategic audience signals, asset group structuring, and brand exclusions to maximize automated algorithmic reach.",
        iconName: "pmax"
      },
      {
        title: "Enhanced Conversions & Value Bidding",
        desc: "Server-side enhanced conversion tracking passing hashed first-party customer data directly to Google's bidding algorithm.",
        iconName: "tracking"
      },
      {
        title: "High-Speed Dedicated Landing Pages",
        desc: "Sub-second Next.js conversion landing pages featuring instant 1-click WhatsApp inquiry buttons and trust badges.",
        iconName: "landing"
      },
      {
        title: "Continuous A/B Ad Copy & Asset Testing",
        desc: "Rigorous testing of responsive search ad headlines, callout extensions, sitelinks, and structured snippets.",
        iconName: "testing"
      }
    ],
    process: [
      {
        step: "01",
        phase: "Keyword Audit",
        title: "Intent Mapping & Competitor Teardown",
        desc: "We analyze competitor bids, search volume, and build a master list of high-intent transactional search terms."
      },
      {
        step: "02",
        phase: "Conversion Rigging",
        title: "Tag Manager & Enhanced Conversion Setup",
        desc: "Setting up Google Tag Manager, form submit triggers, WhatsApp click tracking, and Google Search Console links."
      },
      {
        step: "03",
        phase: "Campaign Activation",
        title: "Launch with Manual CPC / Target CPA",
        desc: "Initial deployment with tight bid caps to collect clean benchmark data before initiating smart bidding algorithms."
      },
      {
        step: "04",
        phase: "Pruning & Scaling",
        title: "Search Term Pruning & Budget Expansion",
        desc: "Daily search term report reviews, adding negatives, and reallocating budget into top-converting geographic zip codes."
      }
    ],
    keyMetrics: [
      { label: "Verified ROAS", value: "5.2x", detail: "Average return on ad spend across client accounts" },
      { label: "Cost Per Lead (CPL)", value: "-48%", detail: "Average reduction within first 45 days of takeover" },
      { label: "Quality Score", value: "8.8/10", detail: "Average keyword Quality Score achieved" },
      { label: "Click-Through Rate", value: "8.4%", detail: "Search campaign CTR vs industry benchmark of 3.2%" }
    ],
    targetIndustries: [
      { name: "Real Estate Developers", application: "Luxury apartment launches, NRI investor campaigns, and project brochure downloads." },
      { name: "Emergency Local Services", application: "Packers & Movers, Pest Control, Emergency Dental, and Commercial Repair." },
      { name: "B2B Capital Equipment", application: "CNC machinery, packaging equipment, and industrial raw material buyers." },
      { name: "Higher Education & Coaching", application: "Entrance exam coaching, MBA admissions, and study abroad consulting." }
    ],
    faqs: [
      {
        question: "How much ad budget do I need to start with Google Ads?",
        answer: "We recommend a minimum starting ad spend of ₹20,000 to ₹35,000 per month for local businesses, and ₹60,000+ for regional or national campaigns. This provides sufficient click volume for Google's bidding algorithm to optimize efficiently."
      },
      {
        question: "Do I pay the ad budget to Digital FX or directly to Google?",
        answer: "You pay your ad spend directly to Google via your own Google Ads billing account. You retain 100% ownership of your data, campaign history, and account. Digital FX charges a transparent monthly campaign management fee."
      },
      {
        question: "What is Performance Max and should my business use it?",
        answer: "Performance Max runs ads across Search, YouTube, Display, Discover, Gmail, and Maps using Google AI. It is highly effective for e-commerce and high-volume lead generation when paired with tight negative keyword lists and strict audience signals."
      }
    ],
    pricingTiers: [
      {
        name: "Local Search Starter",
        price: "₹18,000",
        period: "per month",
        description: "Targeted Google Search & Call campaigns for local service businesses and clinic practices.",
        features: [
          "Google Search & Call-Only Ads (up to ₹40k ad spend)",
          "500+ Negative Keyword Master List",
          "Dedicated Landing Page Optimization",
          "Google Tag Manager & Call Tracking Setup",
          "Bi-Weekly Optimization & Monthly Report"
        ]
      },
      {
        name: "Growth Performance PPC",
        badge: "Recommended",
        recommended: true,
        price: "₹34,000",
        period: "per month",
        description: "Multi-campaign Google Ads management including Search, Performance Max, and Remarketing.",
        features: [
          "Search + Performance Max + Display Remarketing",
          "Management for Ad Spend up to ₹1,50,000/mo",
          "Enhanced Conversions & Server-Side Tracking",
          "Custom Sub-Second Next.js Landing Page Included",
          "Weekly Search Term Pruning & Bid Adjustments",
          "Dedicated Google Ads Certified Account Manager"
        ]
      },
      {
        name: "Enterprise Scale PPC",
        price: "₹65,000",
        period: "per month",
        description: "Full-scale media management for high-growth e-commerce, real estate developers, and national brands.",
        features: [
          "Ad Spend Management over ₹1,50,000/mo (or 10% of spend)",
          "YouTube Video Ads & Demand Gen Campaigns",
          "CRM Closed-Loop Offline Conversion Tracking",
          "Daily Bid Optimization & Multi-Variant Copy Testing",
          "Custom Looker Studio Real-Time Dashboard"
        ]
      }
    ],
    caseStudy: {
      client: "NCR Luxury Realty Advisors",
      metric: "73% Lower Cost Per Lead",
      result: "Reduced CPL from ₹1,450 to ₹380 while generating 1,140+ qualified site visits for luxury expressway apartments.",
      industry: "Real Estate",
      slug: "ncr-luxury-realty"
    },
    relatedServices: [
      { slug: "meta-ads", title: "Meta Ads (Facebook & Instagram)" },
      { slug: "digital-marketing", title: "Full-Funnel Digital Marketing" },
      { slug: "web-development", title: "High-Speed Web Development" }
    ]
  },

  "meta-ads": {
    slug: "meta-ads",
    title: "Meta Ads (Facebook & Instagram Advertising)",
    shortTitle: "Meta Ads",
    category: "Paid Advertising",
    metaTitle: "Meta Ads Agency | High-ROAS Instagram & Facebook Ads | Digital FX",
    metaDescription: "Scale your revenue with high-converting Meta Ads, UGC video creatives, custom lookalike audiences, and Meta Conversions API (CAPI) integration.",
    h1: "High-ROAS Meta Ads (Facebook & Instagram)",
    heroTagline: "Generate active customer demand before buyers even search. We craft thumb-stopping creative hooks, precision interest targeting, and automated WhatsApp lead funnels that scale profitably.",
    heroBadge: "Meta Certified Agency Partner",
    overview: "While Google captures existing search intent, Meta Ads creates new demand. With over 500 million active users in India across Facebook and Instagram, Meta is an unmatched customer acquisition channel. Digital FX engineers profitable Meta advertising combining direct-response creative frameworks, server-side Conversions API (CAPI) tracking, and instant WhatsApp chat lead generation.",
    whyItMatters: {
      heading: "The Creative-First Meta Advertising Landscape",
      points: [
        "In modern Meta advertising, your creative asset is your primary targeting mechanism.",
        "Browser tracking restrictions (iOS 14+, cookie depreciation) blind standard pixels without Server-Side CAPI.",
        "Leads captured on traditional slow web forms abandon at rates over 70%; WhatsApp instant funnels eliminate this drop-off.",
        "Digital FX pairs high-converting visual assets with frictionless conversational automation."
      ],
    },
    deliverables: [
      {
        title: "High-Converting Creative Frameworks",
        desc: "Design of high-impact video reels, carousel ads, and editorial static graphics engineered to stop the scroll.",
        iconName: "creative"
      },
      {
        title: "Meta Conversions API (CAPI) Integration",
        desc: "Server-side event dispatch directly from Next.js to Meta's servers, restoring 100% conversion attribution and signal clarity.",
        iconName: "server"
      },
      {
        title: "Custom Audience & Lookalike Modeling",
        desc: "Segmenting VIP buyers, CRM lists, and building 1%-3% high-value lookalikes to continuously feed the algorithm.",
        iconName: "audience"
      },
      {
        title: "Direct WhatsApp Click-to-Chat Funnels",
        desc: "Instant customer initiation straight into WhatsApp with pre-filled enquiry prompts and immediate automated replies.",
        iconName: "whatsapp"
      },
      {
        title: "Dynamic Retargeting Architecture",
        desc: "Re-engaging website visitors, video viewers, and profile engagers with testimonials, offer urgency, and social proof.",
        iconName: "retargeting"
      },
      {
        title: "Creative Fatigue Defense & Testing",
        desc: "Systematic weekly testing of hooks, angles, and formats to sustain low acquisition costs without audience saturation.",
        iconName: "refresh"
      }
    ],
    process: [
      {
        step: "01",
        phase: "Audience Analysis",
        title: "Customer Persona & Pain Point Research",
        desc: "We analyze your ideal customer profile, competitor ads library, and identify high-converting visual hooks."
      },
      {
        step: "02",
        phase: "Tracking Setup",
        title: "Meta CAPI & Event Deduplication",
        desc: "Deploying server-side event dispatch alongside client-side Pixel with deduplication for 100% data integrity."
      },
      {
        step: "03",
        phase: "Testing Sandbox",
        title: "Rapid Creative & Angle Testing",
        desc: "Testing 5 to 10 creative variants at low daily spend to discover the winning hook, body, and CTA combinations."
      },
      {
        step: "04",
        phase: "Scale & Automate",
        title: "Advantage+ Scaling & Retention",
        desc: "Graduating top winners into Advantage+ budget campaigns and connecting automated WhatsApp instant lead routing."
      }
    ],
    keyMetrics: [
      { label: "Average E-Com ROAS", value: "4.6x", detail: "Sustained return across consumer product campaigns" },
      { label: "WhatsApp Lead Rate", value: "32%", detail: "Conversion rate from ad click to active chat conversation" },
      { label: "Cost Per Message", value: "₹22 - ₹65", detail: "Qualified conversational lead acquisition cost" },
      { label: "CAPI Signal Match", value: "9.2/10", detail: "Meta Event Quality score achieved across accounts" }
    ],
    targetIndustries: [
      { name: "Interior Design & Architecture", application: "Showcase residential transformations, video walkthroughs, and quotation requests." },
      { name: "D2C Fashion & Lifestyle", application: "Catalog sales, seasonal collections, influencer collaboration whitelisting." },
      { name: "Luxury Hospitality & Resorts", application: "Weekend getaway packages, wedding venue showcases, and direct bookings." },
      { name: "Real Estate Pre-Launches", application: "Architectural renders, floor plan downloads, and VIP site visit bookings." }
    ],
    faqs: [
      {
        question: "Why should we run WhatsApp Click-to-Chat ads instead of website forms?",
        answer: "In India, over 90% of smartphone users live on WhatsApp. A traditional website form requires users to type their details and wait hours for an email. Click-to-WhatsApp ads immediately connect your sales team to the prospect's verified mobile number within 5 seconds."
      },
      {
        question: "How do you solve the iOS tracking loss on Meta Ads?",
        answer: "We deploy Meta Conversions API (CAPI) directly on our Next.js backend server. When a user submits an enquiry or purchases, our server communicates directly with Meta's servers, completely bypassing browser ad blockers and cookie restrictions."
      },
      {
        question: "Do you produce the ad creatives or do we need to provide them?",
        answer: "Digital FX provides end-to-end creative production including motion graphics, high-converting ad copy, visual design, and video editing. If you have raw video footage or product photos, our creative team refashions them into high-converting ad reels."
      }
    ],
    pricingTiers: [
      {
        name: "Creative Starter",
        price: "₹18,000",
        period: "per month",
        description: "Direct-to-WhatsApp or lead generation campaigns for local businesses and independent service brands.",
        features: [
          "Meta Ads Management (up to ₹40k ad spend)",
          "8 Custom Creative Ad Graphics & Copy Variants",
          "WhatsApp Direct Lead Generation Funnel",
          "Pixel & Standard Event Tracking Setup",
          "Bi-Weekly Campaign Performance Review"
        ]
      },
      {
        name: "Scale Accelerator",
        badge: "Recommended",
        recommended: true,
        price: "₹34,000",
        period: "per month",
        description: "Full-funnel Meta advertising with video creative testing, CAPI server-side integration, and custom audiences.",
        features: [
          "Meta Ads Management (up to ₹1,20,000 ad spend)",
          "Server-Side Meta Conversions API (CAPI) Setup",
          "16 Ad Creatives (Statics, Carousels & Video Reels)",
          "Custom & 1%-3% Lookalike Audience Creation",
          "WhatsApp CRM Automated Lead Integration",
          "Weekly Creative Refreshes & Dedicated Strategist"
        ]
      },
      {
        name: "High-Volume Enterprise",
        price: "₹65,000",
        period: "per month",
        description: "Aggressive multi-channel media scaling for national D2C brands, luxury real estate, and enterprise lead generation.",
        features: [
          "Unlimited Ad Spend Management",
          "High-Velocity Video Production (UGC Style & Motion)",
          "Full Funnel: Top of Funnel Discovery to Dynamic Retargeting",
          "Multi-Variant Landing Page A/B Testing",
          "Daily Budget Pacing & Dedicated Creative Director"
        ]
      }
    ],
    caseStudy: {
      client: "The Woodcraft Studio & Modular Living",
      metric: "5.4x Verified ROAS",
      result: "Generated 185+ high-ticket residential interior design consultations using interactive WhatsApp quotation funnels.",
      industry: "Interior & D2C",
      slug: "woodcraft-studio"
    },
    relatedServices: [
      { slug: "google-ads", title: "Google Ads Management" },
      { slug: "social-media-marketing", title: "Social Media Marketing" },
      { slug: "digital-marketing", title: "Full-Funnel Digital Marketing" }
    ]
  },

  "social-media-marketing": {
    slug: "social-media-marketing",
    title: "Social Media Marketing & Brand Authority",
    shortTitle: "Social Media",
    category: "Brand & Growth",
    metaTitle: "Social Media Marketing Agency | Organic Engagement & Growth | Digital FX",
    metaDescription: "Build an authoritative brand presence on Instagram, LinkedIn, and YouTube. Strategic content calendars, high-impact reels, and executive thought leadership.",
    h1: "Strategic Social Media Marketing & Brand Authority",
    heroTagline: "Do not post content just for the sake of posting. We craft high-impact narrative strategies, viral short-form video reels, and executive thought leadership that turn passive followers into paying brand advocates.",
    heroBadge: "Narrative & Community Engineering",
    overview: "Social media algorithms reward genuine engagement, educational authority, and distinctive creative identity. Generic stock photos and robotic quotes no longer work. Digital FX develops tailored social media ecosystems across Instagram, LinkedIn, YouTube, and X that position your brand as the undeniable market leader in your industry.",
    whyItMatters: {
      heading: "The Shift from Vanity Follower Counts to Real Authority",
      points: [
        "Modern buyers check your Instagram and LinkedIn before finalizing contracts to verify your legitimacy and culture.",
        "Short-form video reels generate over 2.5x more organic reach than traditional static images.",
        "Founder-led thought leadership on LinkedIn drives high-ticket B2B deals far faster than sterile company pages.",
        "Digital FX handles end-to-end ideation, scripting, professional editing, community moderation, and distribution."
      ],
    },
    deliverables: [
      {
        title: "Strategic Content Calendar & Pillars",
        desc: "Monthly multi-pillar content roadmaps balancing education, entertainment, social proof, and direct conversion hooks.",
        iconName: "calendar"
      },
      {
        title: "Short-Form Video Production (Reels & Shorts)",
        desc: "Engaging vertical video editing with dynamic captions, sound design, hooks, and branded aesthetic treatments.",
        iconName: "video"
      },
      {
        title: "LinkedIn Executive Thought Leadership",
        desc: "Ghostwriting authoritative articles and commentary for founders and C-level executives to build enterprise trust.",
        iconName: "linkedin"
      },
      {
        title: "Brand Aesthetic & Carousels",
        desc: "Custom high-resolution multi-slide carousels and infographics that generate high saves and shares.",
        iconName: "carousel"
      },
      {
        title: "Community Moderation & Engagement",
        desc: "Proactive monitoring and thoughtful responses to comments, DMs, and mentions to nurture active brand community.",
        iconName: "community"
      },
      {
        title: "Growth & Virality Analytics",
        desc: "Transparent monthly reporting tracking reach velocity, engagement rates, profile visits, and inbound leads.",
        iconName: "analytics"
      }
    ],
    process: [
      {
        step: "01",
        phase: "Brand Identity",
        title: "Tone, Style & Visual Archetype",
        desc: "We establish your distinctive visual identity, brand typography, voice guidelines, and key topic pillars."
      },
      {
        step: "02",
        phase: "Batch Production",
        title: "Scripting, Recording & Design",
        desc: "Writing high-retention video scripts, designing carousels, and editing short-form video content in efficient monthly batches."
      },
      {
        step: "03",
        phase: "Distribution",
        title: "Algorithmic Scheduling & Publishing",
        desc: "Publishing during peak follower activity windows with optimized hashtags, audio trends, and localized geo-tags."
      },
      {
        step: "04",
        phase: "Lead Capturing",
        title: "DM Automation & Lead Routing",
        desc: "Converting comments and profile bio visits into active enquiries via automated direct messaging workflows."
      }
    ],
    keyMetrics: [
      { label: "Organic Reach Growth", value: "+340%", detail: "Average expansion in accounts reached within 90 days" },
      { label: "Engagement Rate", value: "4.8%", detail: "Sustained engagement vs industry standard of 1.2%" },
      { label: "Content Production", value: "24 Assets", detail: "Delivered per month (Reels, Carousels, Stories)" },
      { label: "Inbound DMs", value: "+180%", detail: "Qualified commercial inquiries captured via social channels" }
    ],
    targetIndustries: [
      { name: "Cosmetic & Plastic Surgery", application: "Patient transformation reels, surgeon credentials, and procedure education." },
      { name: "B2B Tech & SaaS Founders", application: "LinkedIn thought leadership, engineering culture, and product demo shorts." },
      { name: "Architects & Luxury Builders", application: "Site tours, material showcases, and aesthetic residential walkthroughs." },
      { name: "Culinary & Fine Dining", application: "Chef storytelling, ambiance reels, and weekend event hype." }
    ],
    faqs: [
      {
        question: "Do I need to be on camera for our business social media to work?",
        answer: "While founder or team presence builds trust faster, it is not mandatory. We produce highly engaging documentary-style b-roll, animated kinetic typography, high-value visual carousels, and voiceover formats that perform exceptionally well."
      },
      {
        question: "How many times per week should our brand post on social media?",
        answer: "Quality and consistency always beat blind volume. We recommend 4 to 5 high-impact, carefully crafted posts per week (combining 2-3 Reels, 1 deep carousel, and 1 community poll/story sequence) to maintain optimal algorithmic momentum."
      },
      {
        question: "Can social media actually generate high-ticket B2B business?",
        answer: "Absolutely. Through founder-led LinkedIn thought leadership and retargeting ads, our clients routinely close enterprise contracts worth ₹5L to ₹50L that originated as a direct LinkedIn message or post share."
      }
    ],
    pricingTiers: [
      {
        name: "Authority Foundation",
        price: "₹18,000",
        period: "per month",
        description: "Essential organic social media consistency and professional branding for growing businesses.",
        features: [
          "12 Custom Designed Posts & Carousels per Month",
          "4 Short-Form Video Reels (Client supplies raw clips)",
          "Curated Caption Writing & Strategic Hashtag Vault",
          "Instagram & Facebook Account Management",
          "Monthly Audience Growth Report"
        ]
      },
      {
        name: "Omnichannel Growth",
        badge: "Recommended",
        recommended: true,
        price: "₹32,000",
        period: "per month",
        description: "Aggressive multi-platform organic growth spanning Instagram, LinkedIn, and YouTube Shorts.",
        features: [
          "20 Total Assets (8 High-Impact Reels + 12 Carousels)",
          "LinkedIn Executive Thought Leadership (4 Articles/Posts)",
          "Professional Motion Graphics & Dynamic Subtitles",
          "Community Comment Moderation & Story Management",
          "DM Auto-Reply & Lead Qualification Integration",
          "Dedicated Social Media Strategist & Content Lead"
        ]
      },
      {
        name: "Market Leader Dominance",
        price: "₹55,000",
        period: "per month",
        description: "Full-scale brand broadcasting for market leaders including on-site shoot coordination and PR syndication.",
        features: [
          "Daily Content Publishing (30+ High-End Monthly Assets)",
          "Quarterly On-Site Professional Video/Photo Shoot Support",
          "YouTube Channel Management & Thumbnail Optimization",
          "Influencer Collab Outreach & Micro-Creator Management",
          "Weekly Analytics Review & Real-Time Trend Hijacking"
        ]
      }
    ],
    caseStudy: {
      client: "The Woodcraft Studio",
      metric: "+480% Instagram Reach",
      result: "Transformed an offline furniture studio into an aspirational interior brand generating 185+ monthly project enquiries.",
      industry: "Interior Design",
      slug: "woodcraft-studio"
    },
    relatedServices: [
      { slug: "meta-ads", title: "Meta Ads Management" },
      { slug: "branding", title: "Brand Identity & Strategy" },
      { slug: "digital-marketing", title: "Full-Funnel Digital Marketing" }
    ]
  },

  "web-design": {
    slug: "web-design",
    aliases: ["website-design"],
    title: "UI/UX & High-Converting Website Design",
    shortTitle: "Web Design",
    category: "Tech & Engineering",
    metaTitle: "Website Design & UI/UX Agency | High-Converting Interfaces | Digital FX",
    metaDescription: "Award-winning, conversion-optimized UI/UX website design in Figma. Tailored for maximum user engagement, brand authority, and mobile perfection.",
    h1: "High-Converting UI/UX & Website Design",
    heroTagline: "Your website is your 24/7 digital flagship showroom. We craft sophisticated, editorial UI/UX designs that command authority, eliminate cognitive friction, and turn curious visitors into paying clients.",
    heroBadge: "Figma & Human-Centric UI/UX Architecture",
    overview: "First impressions are formed within 50 milliseconds of landing on a website. In an era where trust is everything, outdated templates and cluttered interfaces immediately destroy credibility. Digital FX creates bespoke UI/UX designs crafted specifically around user psychology, typography hierarchy, clear value propositions, and conversion paths.",
    whyItMatters: {
      heading: "Design Is Not Just How It Looks; It Is How It Converts",
      points: [
        "94% of first impressions on a business website are strictly design-related.",
        "Over 75% of users admit to judging a company's commercial credibility based on their website design.",
        "Poor mobile responsive design drives away over half of your potential buyers before they read a single sentence.",
        "Digital FX designs every interface in Figma with comprehensive design systems, component libraries, and interactive prototypes."
      ],
    },
    deliverables: [
      {
        title: "Bespoke Figma UI/UX Design Systems",
        desc: "Complete visual frameworks including typography scales, harmonious color palettes, component libraries, and layout grids.",
        iconName: "figma"
      },
      {
        title: "Conversion-Focused Wireframing",
        desc: "Low-fidelity and high-fidelity UX wireframes engineered around user psychology, reducing decision friction.",
        iconName: "wireframe"
      },
      {
        title: "Mobile-First Responsive Layouts",
        desc: "Dedicated layouts engineered specifically for modern smartphone screen viewports with thumb-friendly navigation.",
        iconName: "mobile"
      },
      {
        title: "Interactive Clickable Prototypes",
        desc: "Full Figma interactive walkthroughs allowing you to test transitions, animations, and flows before writing a single line of code.",
        iconName: "prototype"
      },
      {
        title: "Visual Asset Creation & 3D Accents",
        desc: "Custom vector iconography, editorial photography curation, and tasteful subtle ambient gradients.",
        iconName: "assets"
      },
      {
        title: "Developer-Ready Design Handoff",
        desc: "Pixel-perfect specifications, tokenized design systems, and export-ready SVG assets formatted for seamless engineering.",
        iconName: "handoff"
      }
    ],
    process: [
      {
        step: "01",
        phase: "Discovery & UX",
        title: "User Journey & Information Architecture",
        desc: "We map out user personas, key decision triggers, and define the optimal site structure and content hierarchy."
      },
      {
        step: "02",
        phase: "Wireframing",
        title: "Low-Fidelity Blueprinting",
        desc: "Structuring the layout, copywriting placements, and call-to-action buttons without visual distraction."
      },
      {
        step: "03",
        phase: "High-Fidelity UI",
        title: "Visual Craftsmanship in Figma",
        desc: "Applying your brand colors, refined typography, custom illustrations, and interactive micro-states."
      },
      {
        step: "04",
        phase: "Handoff & Review",
        title: "Prototype Testing & Engineering Handoff",
        desc: "Conducting user flow testing on clickable prototypes and delivering comprehensive design specs to development."
      }
    ],
    keyMetrics: [
      { label: "Conversion Lift", value: "+64%", detail: "Average increase in lead conversion rate after redesign" },
      { label: "Bounce Rate", value: "-38%", detail: "Reduction in immediate visitor drop-off" },
      { label: "Mobile Usability", value: "100%", detail: "Thumb-zone accessible interface compliance" },
      { label: "Figma Components", value: "120+", detail: "Reusable design system tokens delivered per project" }
    ],
    targetIndustries: [
      { name: "Luxury Architecture & Real Estate", application: "High-impact visual showcases, floorplan viewing, and VIP consultation booking." },
      { name: "FinTech & Enterprise SaaS", application: "Clean data presentation, product feature walkthroughs, and self-serve onboarding." },
      { name: "Medical Clinics & Hospitals", application: "Patient trust signaling, doctor bios, and frictionless appointment booking." },
      { name: "Professional Law & Advisory", application: "Editorial corporate authority, practice area navigation, and partner credibility." }
    ],
    faqs: [
      {
        question: "Do you use ready-made templates like WordPress or Webflow themes?",
        answer: "Never. Every design created by Digital FX is designed completely from scratch in Figma to match your exact brand identity, customer expectations, and competitive differentiators. No generic templates."
      },
      {
        question: "What files do we receive at the end of the design project?",
        answer: "You receive full ownership of the production Figma file containing the complete design system, typography styles, mobile and desktop responsive screens, interactive clickable prototype, and developer-ready exported SVG assets."
      },
      {
        question: "Can your team also code the website once design is finalized?",
        answer: "Yes! Our core engineering team specializes in custom Next.js 16 and modern full-stack development, ensuring your finalized design is converted into a sub-second, perfectly responsive live website."
      }
    ],
    pricingTiers: [
      {
        name: "Landing Page Sprint",
        price: "₹24,999",
        period: "one-time",
        description: "Bespoke high-converting single-page design for high-ticket marketing campaigns, product launches, or webinars.",
        features: [
          "1 Comprehensive High-Converting Landing Page",
          "Desktop, Tablet & Mobile Viewport Variants",
          "Custom Figma Design System & Typography Hierarchy",
          "Interactive Clickable Prototype",
          "2 Rounds of Revisions Included",
          "Complete Developer Handoff Package"
        ]
      },
      {
        name: "Corporate Website UI/UX",
        badge: "Recommended",
        recommended: true,
        price: "₹54,999",
        period: "one-time",
        description: "Complete UI/UX design overhaul for growing businesses seeking international credibility and higher conversion rates.",
        features: [
          "Up to 8 Custom Page Templates (Home, About, Services, Case Studies, Contact)",
          "Comprehensive Multi-Device Responsive Layouts",
          "Complete Design System (Colors, Typography, Reusable Components)",
          "Micro-Interaction & Scroll Animation Specifications",
          "Interactive Figma Walkthrough with Clickable Flows",
          "Dedicated Senior UI/UX Designer"
        ]
      },
      {
        name: "Enterprise Platform UI/UX",
        price: "₹95,000",
        period: "one-time",
        description: "Exhaustive user experience and interface design for complex SaaS portals, e-commerce platforms, and multi-tier enterprises.",
        features: [
          "Up to 20 Screen Templates including User Dashboards",
          "Deep User Persona & Competitor UX Benchmarking",
          "Extensive Component Library with Light/Dark Modes",
          "Usability Testing & Conversion Flow Optimization",
          "Weekly Collaborative Workshops & Priority Support"
        ]
      }
    ],
    caseStudy: {
      client: "Digital FX Website Overhaul",
      metric: "+78% Average Session Duration",
      result: "Redesigned digital agency presence into an editorial international aesthetic with flawless mobile responsiveness.",
      industry: "Digital Infrastructure",
      slug: "digital-fx-architecture"
    },
    relatedServices: [
      { slug: "web-development", title: "Custom Web Development" },
      { slug: "branding", title: "Brand Identity & Strategy" },
      { slug: "digital-marketing", title: "Full-Funnel Digital Marketing" }
    ]
  },

  "web-development": {
    slug: "web-development",
    aliases: ["website-development"],
    title: "Custom Next.js & Full-Stack Web Development",
    shortTitle: "Web Development",
    category: "Tech & Engineering",
    metaTitle: "Custom Web Development Agency | Next.js 16 & Sub-Second SSR | Digital FX",
    metaDescription: "Enterprise-grade web development using Next.js 16, TypeScript, and Tailwind CSS. Sub-second load times, flawless security, and 100% Core Web Vitals.",
    h1: "High-Performance Next.js & Full-Stack Web Development",
    heroTagline: "Slow, bloated WordPress websites leak revenue. We engineer sub-second, enterprise-grade web applications with Next.js 16, TypeScript, and Tailwind CSS that load in milliseconds and convert visitors into clients.",
    heroBadge: "Next.js 16 App Router & Edge Infrastructure",
    overview: "In 2026, web speed is not a luxury; it is a core commercial metric. Digital FX develops modern full-stack web architectures powered by Next.js 16 App Router, React Server Components, TypeScript, and Tailwind CSS. We deliver sub-second Server-Side Rendered (SSR) experiences that pass Google Core Web Vitals with 98+ scores and provide unmatched security with zero database vulnerabilities.",
    whyItMatters: {
      heading: "Why Modern Businesses Are Abandoning Legacy CMS",
      points: [
        "Traditional CMS platforms (like bloated WordPress installations with 40 plugins) suffer from constant security vulnerabilities, plugin conflicts, and slow database queries.",
        "Next.js pre-renders pages into static HTML at the edge, guaranteeing instant page delivery worldwide.",
        "Clean, semantic server-side rendered HTML is natively indexed by Googlebot without relying on fragile JavaScript rendering.",
        "Digital FX writes clean, modular, scalable TypeScript code built to last."
      ],
    },
    deliverables: [
      {
        title: "Next.js 16 App Router & React Server Components",
        desc: "State-of-the-art web framework providing instant server-side page delivery and optimal resource streaming.",
        iconName: "nextjs"
      },
      {
        title: "Sub-Second Global Load Times (LCP < 1.0s)",
        desc: "Edge caching, automatic WebP/AVIF image transcoding, and font preloading delivering near-zero latency.",
        iconName: "speed"
      },
      {
        title: "Custom REST & GraphQL API Integrations",
        desc: "Seamless integration with CRM platforms (HubSpot, Zoho, Salesforce), WhatsApp Business API, and payment gateways.",
        iconName: "api"
      },
      {
        title: "Enterprise Security & Zero Vulnerabilities",
        desc: "Static compilation and modern serverless endpoints eliminate traditional SQL injection and PHP exploit vectors.",
        iconName: "security"
      },
      {
        title: "Clean Headless CMS Integration",
        desc: "Empower your marketing team to edit blogs and landing pages effortlessly using Sanity, Strapi, or Supabase.",
        iconName: "cms"
      },
      {
        title: "100% Responsive & Cross-Browser Precision",
        desc: "Rigorous testing across iOS Safari, Chrome, Android, Edge, and all screen resolutions from 320px to 4K ultra-wide.",
        iconName: "responsive"
      }
    ],
    process: [
      {
        step: "01",
        phase: "Architecture",
        title: "System Design & Tech Stack Blueprint",
        desc: "We define database schemas, API contracts, component architecture, and CI/CD deployment pipelines."
      },
      {
        step: "02",
        phase: "Development",
        title: "TypeScript Engineering & Component Build",
        desc: "Building modular, reusable React Server Components with Tailwind CSS styling and accessible ARIA attributes."
      },
      {
        step: "03",
        phase: "Integration",
        title: "API, CRM & Payment Rigging",
        desc: "Connecting lead capture forms to your CRM, WhatsApp notification webhooks, and payment gateways (Razorpay/Stripe)."
      },
      {
        step: "04",
        phase: "QA & Deployment",
        title: "Automated Testing & Edge Deployment",
        desc: "Running Lighthouse audits, cross-device testing, SSL encryption, and deploying to global edge networks (Vercel/Cloudflare)."
      }
    ],
    keyMetrics: [
      { label: "Page Load Speed", value: "<0.8s", detail: "Global average Largest Contentful Paint (LCP)" },
      { label: "Google PageSpeed", value: "98/100", detail: "Mobile performance score standard" },
      { label: "Server Uptime", value: "99.99%", detail: "Serverless edge architecture reliability" },
      { label: "Security Vulnerabilities", value: "0", detail: "Zero legacy CMS plugin attack vectors" }
    ],
    targetIndustries: [
      { name: "High-Growth FinTech & SaaS", application: "Customer self-service portals, subscription billing, and real-time dashboards." },
      { name: "Multi-Location Enterprise Services", application: "Scalable programmatic location directories and centralized CRM lead distribution." },
      { name: "Luxury E-Commerce & Retail", application: "Headless shopping experiences, instant checkout, and inventory synchronization." },
      { name: "Real Estate & Housing Portals", application: "Interactive map search, dynamic floor plan viewers, and mortgage calculators." }
    ],
    faqs: [
      {
        question: "Why choose Next.js instead of a standard WordPress website?",
        answer: "Next.js provides sub-second page loads, unmatched Core Web Vitals, enterprise security (no vulnerable PHP plugins to hack), and effortless scalability. For serious commercial businesses where page speed directly drives conversions, Next.js is the modern gold standard."
      },
      {
        question: "Can our marketing team still edit blog posts and page text without coding?",
        answer: "Yes! We pair custom Next.js frontends with intuitive headless CMS platforms (such as Sanity, Strapi, or Markdown/MDX workflows). Your team gets an easy-to-use editor interface while visitors enjoy ultra-fast Next.js speed."
      },
      {
        question: "Do you provide website maintenance and support after launch?",
        answer: "Yes. Every web development project includes 30 days of complimentary post-launch support and monitoring. We also provide ongoing technical maintenance plans covering security updates, edge hosting, and new feature additions."
      }
    ],
    pricingTiers: [
      {
        name: "Custom Landing Page Build",
        price: "₹29,999",
        period: "one-time",
        description: "Ultra-fast Next.js single-page application engineered specifically for high-conversion paid advertising campaigns.",
        features: [
          "Custom Next.js 16 App Router Build",
          "Sub-Second Load Time (LCP < 1.0s)",
          "Instant WhatsApp Webhook & Email Lead Notifications",
          "Google Tag Manager & Meta Pixel Integration",
          "Global Edge Hosting Deployment (Vercel / Cloudflare)",
          "14 Days Post-Launch Support"
        ]
      },
      {
        name: "Full-Stack Corporate Web Engine",
        badge: "Recommended",
        recommended: true,
        price: "₹69,999",
        period: "one-time",
        description: "Complete corporate web platform engineered for search authority, commercial credibility, and scalable lead capture.",
        features: [
          "Up to 10 Custom Next.js Server-Side Rendered Pages",
          "Headless CMS Integration for Blogs & Content Updates",
          "Dynamic Schema.org Entity Graph & SEO Architecture",
          "Custom Lead Capture Forms with CRM Webhook Routing",
          "98+ Mobile PageSpeed Score Guarantee",
          "30 Days Dedicated Engineering QA & Support"
        ]
      },
      {
        name: "Enterprise Custom Application",
        price: "₹1,40,000",
        period: "one-time",
        description: "Complex web applications, client portals, multi-tenant SaaS dashboards, and high-volume programmatic directories.",
        features: [
          "Bespoke Database & Authentication Architecture (Supabase / PostgreSQL)",
          "Client Account Portals & Role-Based Access Controls",
          "Payment Gateway Integration (Razorpay / Stripe)",
          "Automated CI/CD Pipeline & Staging Environments",
          "Dedicated Senior Full-Stack Engineer & Code Review"
        ]
      }
    ],
    caseStudy: {
      client: "Digital FX Web Platform",
      metric: "Sub-Second Global Edge SSR",
      result: "Engineered 250+ static and dynamic routes compiling in seconds with 98+ Google PageSpeed scores.",
      industry: "Digital Infrastructure",
      slug: "digital-fx-architecture"
    },
    relatedServices: [
      { slug: "web-design", title: "UI/UX & Website Design" },
      { slug: "technical-seo", title: "Technical SEO & Core Web Vitals" },
      { slug: "ecommerce-development", title: "E-Commerce Development" }
    ]
  },

  "ecommerce-development": {
    slug: "ecommerce-development",
    title: "E-Commerce & Headless Shopify Development",
    shortTitle: "E-Commerce",
    category: "Tech & Engineering",
    metaTitle: "E-Commerce Development Agency | Shopify & Headless Solutions | Digital FX",
    metaDescription: "Build high-converting online stores. Custom Shopify Plus themes, Headless Next.js storefronts, seamless Razorpay payments, and 1-click checkout.",
    h1: "High-Converting E-Commerce & Shopify Development",
    heroTagline: "Turn casual online shoppers into loyal repeat buyers. We engineer lightning-fast e-commerce stores, frictionless 1-click checkout flows, and automated WhatsApp cart recovery systems that maximize average order value (AOV).",
    heroBadge: "Shopify Plus & Headless Commerce Engineering",
    overview: "Every 100-millisecond delay in e-commerce checkout page load decreases conversion rates by 7%. In today's competitive online retail landscape, an off-the-shelf theme weighed down with 30 slow apps destroys profit margins. Digital FX builds custom, lightning-fast e-commerce storefronts on Shopify and headless Next.js platforms engineered for high throughput, seamless Indian payment gateways, and automated post-purchase retention.",
    whyItMatters: {
      heading: "The Anatomy of a High-Converting Online Store",
      points: [
        "Over 80% of e-commerce shopping in India happens on smartphones; your mobile checkout experience must be flawless.",
        "Cart abandonment averages 69.8% worldwide; automated WhatsApp reminders recover up to 28% of those lost sales.",
        "Custom liquid and headless architectures allow lightning-fast product filtering and instant search without page reloading.",
        "Digital FX integrates trusted Indian payment gateways (Razorpay, Cashfree, UPI 1-click) and COD verification to prevent fake orders."
      ],
    },
    deliverables: [
      {
        title: "Custom Shopify Plus Theme Engineering",
        desc: "Clean, bespoke Liquid and JSON theme development without heavy, unoptimized third-party app bloat.",
        iconName: "shopify"
      },
      {
        title: "Headless Next.js Commerce Storefronts",
        desc: "Decoupled frontend architecture providing instantaneous sub-second page transitions and unlimited design flexibility.",
        iconName: "nextjs"
      },
      {
        title: "1-Click UPI & Razorpay Checkout Optimization",
        desc: "Frictionless checkout experience supporting GPay, PhonePe, Paytm, Credit Cards, EMI, and verified Cash on Delivery.",
        iconName: "payment"
      },
      {
        title: "WhatsApp Abandoned Cart & Order Updates",
        desc: "Automated WhatsApp API sequences sending personalized recovery incentives within 15 minutes of cart abandonment.",
        iconName: "cart"
      },
      {
        title: "ERP, Inventory & Logistics Integration",
        desc: "Live synchronization with Shiprocket, Delhivery, Unicommerce, and ERP inventory management systems.",
        iconName: "logistics"
      },
      {
        title: "Conversion-Focused Upsell & Bundle Architecture",
        desc: "In-cart recommendations, volume tiered discounts, and post-purchase one-click upsells to maximize Average Order Value.",
        iconName: "upsell"
      }
    ],
    process: [
      {
        step: "01",
        phase: "Catalog & UX",
        title: "Store Strategy & Collection Architecture",
        desc: "We analyze your SKU count, category taxonomy, pricing tiers, and design a frictionless shopping journey."
      },
      {
        step: "02",
        phase: "Design & Prototype",
        title: "Mobile-First UX/UI Design in Figma",
        desc: "Designing product detail pages (PDP), collections, and cart drawers engineered to eliminate purchase anxiety."
      },
      {
        step: "03",
        phase: "Storefront Engineering",
        title: "Shopify / Next.js Storefront Development",
        desc: "Coding custom responsive components, integrating payment gateways, shipping rules, and tax compliance (GST)."
      },
      {
        step: "04",
        phase: "Automation & Scale",
        title: "Tracking, WhatsApp Funnels & Launch",
        desc: "Deploying Meta CAPI, Google Ads purchase conversion tags, automated WhatsApp notifications, and live launch."
      }
    ],
    keyMetrics: [
      { label: "Checkout Conversion", value: "+38%", detail: "Increase in completed transactions post-optimization" },
      { label: "Cart Recovery Rate", value: "24%", detail: "Recovered via automated WhatsApp sequences" },
      { label: "Mobile Speed Score", value: "92/100", detail: "Shopify store performance rating standard" },
      { label: "Average Order Value", value: "+18%", detail: "Growth through in-cart upsells and product bundles" }
    ],
    targetIndustries: [
      { name: "D2C Fashion & Apparel", application: "High-aesthetic lookbooks, size charts, color swatches, and instant checkout." },
      { name: "Beauty, Skincare & Wellness", application: "Ingredient education, bundle discounts, and recurring subscription boxes." },
      { name: "Consumer Electronics & Gadgets", application: "Detailed technical comparison tables, warranty add-ons, and EMI calculations." },
      { name: "Luxury Home Decor & Furniture", application: "High-resolution zoom galleries, custom dimension calculators, and lead inquiries." }
    ],
    faqs: [
      {
        question: "Should we build our store on Shopify or a custom Headless Next.js stack?",
        answer: "For most D2C brands, a custom Shopify theme engineered without plugin bloat is fast, reliable, and cost-effective. For enterprise brands with 10,000+ SKUs or complex multi-regional requirements, a Headless Next.js frontend with Shopify backend delivers unmatched sub-second speed."
      },
      {
        question: "How do you reduce Cash on Delivery (COD) Return to Origin (RTO) rates?",
        answer: "We deploy automated OTP verification on COD orders via WhatsApp and SMS, flag high-risk delivery addresses using historical intelligence, and incentivize customers with small instant UPI discounts to convert COD into prepaid orders."
      },
      {
        question: "Will our team be able to add new products and manage inventory easily?",
        answer: "Yes, 100%. You manage products, inventory, discounts, and customer orders through Shopify's standard user-friendly dashboard. We also provide complete video onboarding walkthroughs for your operations team."
      }
    ],
    pricingTiers: [
      {
        name: "Shopify Launch Starter",
        price: "₹39,999",
        period: "one-time",
        description: "Essential bespoke Shopify store build for emerging D2C brands and boutique retail collections.",
        features: [
          "Custom Shopify 2.0 Theme Setup (up to 30 products)",
          "Mobile-First Responsive Layout & Cart Drawer",
          "Razorpay / Cashfree & UPI Payment Gateway Integration",
          "Automated GST Invoice & Tax Setup",
          "Shiprocket Logistics Integration",
          "14 Days Post-Launch Operational Support"
        ]
      },
      {
        name: "D2C Scale Storefront",
        badge: "Recommended",
        recommended: true,
        price: "₹79,999",
        period: "one-time",
        description: "High-performance custom Shopify engineering built for high sales volume, upsells, and automated recovery.",
        features: [
          "Custom Liquid Engineering without Slow App Bloat",
          "In-Cart Upsell & Tiered Volume Bundle Engine",
          "Automated WhatsApp Cart Recovery & Order Tracking",
          "COD OTP Verification to Minimize RTO Losses",
          "Full Meta Conversions API & GA4 E-Commerce Tracking",
          "30 Days Dedicated Engineering & QA Support"
        ]
      },
      {
        name: "Headless Enterprise Commerce",
        price: "₹1,65,000",
        period: "one-time",
        description: "Sub-second Next.js 16 decoupled commerce frontend for high-volume enterprise retail and global brands.",
        features: [
          "Decoupled Headless Next.js App Router Front-End",
          "Instantaneous Sub-Second Page Transitions",
          "Multi-Currency & Multi-Language Geolocation Routing",
          "Custom ERP & Warehouse Management Synchronizations",
          "Dedicated Senior Full-Stack Engineer & SLA"
        ]
      }
    ],
    caseStudy: {
      client: "The Woodcraft Studio",
      metric: "+140% Online Inquiries",
      result: "Engineered digital catalog with instant WhatsApp product inquiry links and custom configuration options.",
      industry: "Retail & Furniture",
      slug: "woodcraft-studio"
    },
    relatedServices: [
      { slug: "web-development", title: "Custom Web Development" },
      { slug: "meta-ads", title: "Meta Ads (Facebook & Instagram)" },
      { slug: "google-ads", title: "Google Ads Management" }
    ]
  },

  "branding": {
    slug: "branding",
    title: "Brand Identity, Strategy & Creative Design",
    shortTitle: "Branding",
    category: "Brand & Growth",
    metaTitle: "Brand Identity & Creative Agency | Logos & Guidelines | Digital FX",
    metaDescription: "Craft an unforgettable brand identity. Strategic positioning, distinctive logo systems, typography, color theory, and executive brand guidelines.",
    h1: "Strategic Brand Identity & Creative Architecture",
    heroTagline: "Products are manufactured; brands are remembered. We craft distinctive visual identities, authoritative messaging frameworks, and comprehensive brand guidelines that command premium pricing.",
    heroBadge: "Distinctive Visual & Verbal Architecture",
    overview: "In crowded markets where functional features are quickly commoditized, brand perception is your greatest competitive moat. Premium customers do not buy solely based on utility; they buy based on trust, identity, and prestige. Digital FX designs complete brand ecosystems from core positioning and naming to distinctive logo systems, bespoke typography, and corporate identity collateral.",
    whyItMatters: {
      heading: "Why Distinctive Branding Commands Premium Margins",
      points: [
        "Consistent brand presentation across all touchpoints increases overall company revenue by up to 23%.",
        "A weak, amateur visual identity immediately invites price negotiations and skepticism from high-value prospects.",
        "Your brand is not just a logo; it is the cohesive visual and verbal language expressed in every ad, invoice, and website visit.",
        "Digital FX delivers exhaustive, production-ready Brand Bible guidelines that ensure your identity remains pristine."
      ],
    },
    deliverables: [
      {
        title: "Strategic Positioning & Brand Architecture",
        desc: "Core mission, vision, value propositions, brand archetype, tone-of-voice, and competitive differentiation matrix.",
        iconName: "compass"
      },
      {
        title: "Distinctive Vector Logo Systems",
        desc: "Primary logos, secondary marks, favicons, and sub-marks engineered in vector format for infinite scalability.",
        iconName: "vector"
      },
      {
        title: "Color Theory & Palette Definition",
        desc: "Curated primary, secondary, and accent palettes with precise hex, RGB, CMYK, and Pantone specifications.",
        iconName: "palette"
      },
      {
        title: "Bespoke Typography Pairing",
        desc: "Curated editorial headline and body typefaces with defined hierarchy scales for digital screens and print collateral.",
        iconName: "type"
      },
      {
        title: "Comprehensive Brand Guidelines (Brand Bible)",
        desc: "A 40+ page definitive rulebook covering spacing, correct/incorrect usage, photographic art direction, and stationery.",
        iconName: "book"
      },
      {
        title: "Stationery & Corporate Collateral Package",
        desc: "Business cards, letterheads, invoice templates, presentation decks, social media banners, and email signatures.",
        iconName: "stationery"
      }
    ],
    process: [
      {
        step: "01",
        phase: "Immersion",
        title: "Brand Audit & Market Positioning",
        desc: "We research your category landscape, customer aspirations, and identify whitespace opportunities for visual differentiation."
      },
      {
        step: "02",
        phase: "Concepting",
        title: "Visual Exploration & Moodboards",
        desc: "Developing 3 distinct conceptual directions exploring different aesthetic archetypes, typography, and symbolisms."
      },
      {
        step: "03",
        phase: "Refinement",
        title: "Vector Crafting & Identity Testing",
        desc: "Refining the selected direction into pixel-perfect vectors and testing legibility across micro-screens, merchandise, and billboards."
      },
      {
        step: "04",
        phase: "Codification",
        title: "Brand Bible & Asset Export",
        desc: "Compiling the comprehensive Brand Style Guide and exporting complete master asset packages (AI, SVG, PNG, PDF)."
      }
    ],
    keyMetrics: [
      { label: "Asset Deliverables", value: "45+ Files", detail: "Vector masters, print-ready PDFs, and digital web tokens" },
      { label: "Brand Recall Lift", value: "3.2x", detail: "Increase in unprompted customer brand recognition" },
      { label: "Pricing Power", value: "+30%", detail: "Ability to command higher retainer and product prices" },
      { label: "Style Guide Pages", value: "40+ Pages", detail: "Exhaustive corporate visual and verbal documentation" }
    ],
    targetIndustries: [
      { name: "Hospitality & Boutique Hotels", application: "Luxury signage, guest amenities, menus, and architectural branding." },
      { name: "Corporate Legal & Consulting", application: "Authoritative corporate identity, proposal templates, and partner stationery." },
      { name: "D2C Premium FMCG", application: "Unboxing packaging, label design, retail shelf presence, and visual flair." },
      { name: "Healthcare & Private Clinics", application: "Patient-friendly clinic aesthetics, scrubs, doctor stationery, and signage." }
    ],
    faqs: [
      {
        question: "How many logo design concepts will our team receive?",
        answer: "We develop 3 entirely distinct conceptual routes, each grounded in a unique strategic rationale, visual moodboard, and typography pairing. Once you select your preferred direction, we refine it through collaborative feedback rounds."
      },
      {
        question: "Do we receive full copyright and master source files for our branding?",
        answer: "Yes, 100%. Upon final project completion, full legal ownership and commercial copyright transfer to your company. You receive all vector master files (.AI, .EPS, .SVG) and production-ready exports."
      },
      {
        question: "Can you help redesign an existing brand without losing our current customer recognition?",
        answer: "Yes. We specialize in evolutionary brand refreshes—modernizing outdated marks, sharpening typography, and establishing digital-first guidelines while preserving the core heritage elements your existing customers recognize."
      }
    ],
    pricingTiers: [
      {
        name: "Identity Starter Kit",
        price: "₹24,999",
        period: "one-time",
        description: "Essential brand foundation for startups, independent professionals, and emerging regional businesses.",
        features: [
          "2 Distinct Creative Logo Concepts",
          "Primary & Secondary Vector Logo Marks",
          "Curated Color Palette & Typography Guidelines",
          "Digital Social Media Profile Kit & Favicon",
          "Print-Ready Business Card & Letterhead Design",
          "Full Vector Master Files Ownership (.AI, .SVG, .PNG)"
        ]
      },
      {
        name: "Comprehensive Brand Identity",
        badge: "Recommended",
        recommended: true,
        price: "₹49,999",
        period: "one-time",
        description: "Complete corporate identity system for established companies seeking premium market authority and clear guidelines.",
        features: [
          "3 Strategic Conceptual Directions",
          "Exhaustive 40-Page Corporate Brand Bible Guide",
          "Custom Typography Scale & Color System Tokens",
          "Complete Corporate Collateral Suite (Deck, Invoices, Stationery)",
          "Social Media Post & Banner Template Suite",
          "3 Rounds of Iterative Design Refinements"
        ]
      },
      {
        name: "Enterprise Brand Ecosystem",
        price: "₹95,000",
        period: "one-time",
        description: "Bespoke brand architecture for multi-brand corporations, luxury consumer products, and packaging design.",
        features: [
          "Full Brand Positioning & Verbal Messaging Framework",
          "Custom Packaging / Merchandise / Signage Design",
          "Multi-Tier Sub-Brand Architecture Guidelines",
          "Executive Keynote & Investor Pitch Deck Design",
          "Dedicated Creative Director & Video Brand Walkthrough"
        ]
      }
    ],
    caseStudy: {
      client: "Digital FX Corporate Identity",
      metric: "Recognized Agency Brand",
      result: "Engineered deep navy and electric blue brand identity recognized across Delhi NCR and international client rosters.",
      industry: "Creative Services",
      slug: "digital-fx-branding"
    },
    relatedServices: [
      { slug: "web-design", title: "UI/UX & Website Design" },
      { slug: "social-media-marketing", title: "Social Media Marketing" },
      { slug: "digital-marketing", title: "Full-Funnel Digital Marketing" }
    ]
  },

  "lead-generation": {
    slug: "lead-generation",
    title: "High-Ticket B2B & B2C Lead Generation",
    shortTitle: "Lead Generation",
    category: "Brand & Growth",
    metaTitle: "Lead Generation Agency | High-Intent B2B & B2C Pipeline | Digital FX",
    metaDescription: "Generate qualified, sales-ready buyer leads. Multi-channel outbound and inbound funnels, instant WhatsApp qualification, and verified ROI.",
    h1: "High-Ticket B2B & B2C Lead Generation",
    heroTagline: "Stop chasing tire-kickers and low-quality leads that waste your sales team's valuable time. We engineer pre-qualified customer acquisition pipelines that fill your calendar with serious decision-makers.",
    heroBadge: "Automated Pipeline & Pipeline Velocity",
    overview: "A business does not suffer from a traffic problem; it suffers from a lead qualification problem. Generating 100 unqualified contacts who never answer the phone is a drain on sales morale. Digital FX constructs performance-based lead generation systems that pre-screen prospects by budget, timeline, and decision-making authority before they ever reach your sales desk.",
    whyItMatters: {
      heading: "The Shift from Raw Volume to Sales-Qualified Leads (SQL)",
      points: [
        "Over 50% of sales representatives spend their working hours chasing leads that were never commercially qualified.",
        "A lead contacted within 5 minutes of inquiry is 21 times more likely to enter the sales pipeline than one called after 30 minutes.",
        "Interactive multi-step qualification quizzes eliminate junk submissions while educating the buyer.",
        "Digital FX integrates instant WhatsApp lead routing and SMS verification directly into your team's smartphones."
      ],
    },
    deliverables: [
      {
        title: "Multi-Step Lead Qualification Funnels",
        desc: "Custom interactive qualification quizzes that filter prospects by project budget, urgency, and specific requirements.",
        iconName: "filter"
      },
      {
        title: "Sub-Second Inbound Landing Pages",
        desc: "Lightning-fast Next.js pages engineered with zero distractions, clear value offers, and high-trust social proof.",
        iconName: "speed"
      },
      {
        title: "Instant WhatsApp Sales Automation",
        desc: "Instant automated WhatsApp messages dispatching brochures, appointment links, and pre-qualifying questions in real-time.",
        iconName: "whatsapp"
      },
      {
        title: "High-Intent Search & Paid Social Targeting",
        desc: "Laser-focused Google Search and Meta Ads campaigns aimed strictly at users exhibiting immediate buying signals.",
        iconName: "target"
      },
      {
        title: "CRM Integration & Automated Lead Scoring",
        desc: "Seamless synchronization with HubSpot, Zoho, LeadSquared, and Google Sheets with instant salesperson assignment.",
        iconName: "crm"
      },
      {
        title: "Closed-Loop Attribution Telemetry",
        desc: "Tracking leads through every sales stage to determine exact Cost Per Acquisition (CPA) and Customer Lifetime Value (LTV).",
        iconName: "analytics"
      }
    ],
    process: [
      {
        step: "01",
        phase: "Profile Definition",
        title: "Ideal Customer Profile (ICP) Criteria",
        desc: "We define the exact financial and demographic profile of your highest-margin customers and eliminate dead-weight segments."
      },
      {
        step: "02",
        phase: "Funnel Build",
        title: "High-Speed Funnel & CRM Webhook Setup",
        desc: "Building the custom interactive qualification funnel, connecting phone validation, and routing leads to WhatsApp and CRM."
      },
      {
        step: "03",
        phase: "Traffic Deployment",
        title: "Paid Media & Search Channel Activation",
        desc: "Deploying high-intent search ads, Meta lookalikes, and retargeting campaigns directing traffic into the qualification funnel."
      },
      {
        step: "04",
        phase: "Speed-to-Lead Tuning",
        title: "Sales Response Optimization",
        desc: "Implementing automated calendar scheduling and instant call-triggers to ensure sub-3-minute response times."
      }
    ],
    keyMetrics: [
      { label: "Lead Qualification Rate", value: "78%", detail: "Percentage of captured leads meeting target commercial budget" },
      { label: "Speed to Lead", value: "<60s", detail: "Automated WhatsApp response latency to prospect" },
      { label: "Cost Per Qualified Lead", value: "-44%", detail: "Reduction compared to industry standard lead portals" },
      { label: "Appointment Show Rate", value: "82%", detail: "Show-up rate for scheduled consultations via automated reminders" }
    ],
    targetIndustries: [
      { name: "Real Estate Developers & Brokers", application: "Site visit scheduling for luxury residential apartments and commercial retail." },
      { name: "Specialized Healthcare & Dental", application: "Implant, cosmetic surgery, and high-value elective procedure consultations." },
      { name: "Industrial Equipment & OEM", application: "Factory machinery RFQs, bulk distributor applications, and wholesale inquiries." },
      { name: "Corporate Legal & Financial Advisory", application: "Tax dispute advisory, wealth management, and M&A legal consultation." }
    ],
    faqs: [
      {
        question: "How do you ensure the leads generated are genuinely qualified and not fake numbers?",
        answer: "We employ multi-layer verification: OTP mobile number validation via SMS/WhatsApp, interactive multi-step qualifying questions (e.g. 'What is your budget tier?'), and bot-blocking honeypots that eliminate spam submissions."
      },
      {
        question: "Do you sell shared leads to multiple competing businesses like IndiaMART or Justdial?",
        answer: "Never. Every lead generated through our system is 100% exclusive to your company. The customer applied specifically to your brand through your custom landing page and is never shared with any competitor."
      },
      {
        question: "Can your system automatically notify our sales team on WhatsApp when a lead arrives?",
        answer: "Yes! The moment a prospect completes the qualifying form, your sales team receives an immediate WhatsApp notification containing the prospect's name, phone number, budget, and answers to all qualifying questions."
      }
    ],
    pricingTiers: [
      {
        name: "Pipeline Starter",
        price: "₹24,999",
        period: "per month",
        description: "Essential exclusive lead generation funnel for local service providers, doctors, and real estate agents.",
        features: [
          "Custom High-Speed Lead Funnel Landing Page",
          "Google Ads or Meta Ads Campaign Management",
          "Instant WhatsApp Lead Notification Webhook",
          "Exclusive Leads (Zero Shared Competitor Data)",
          "Bi-Weekly Lead Quality & Conversion Review"
        ]
      },
      {
        name: "Scale Acquisition Engine",
        badge: "Recommended",
        recommended: true,
        price: "₹49,999",
        period: "per month",
        description: "Aggressive multi-channel lead generation with interactive qualification quizzes and automated CRM routing.",
        features: [
          "Multi-Channel Paid Inbound (Google Search + Meta Ads)",
          "Interactive Multi-Step Lead Qualification Quiz",
          "Automated WhatsApp Instant Follow-up Sequences",
          "CRM Integration (Zoho / HubSpot / LeadSquared / Sheets)",
          "Dedicated Account Strategist & Weekly Quality Tuning",
          "ReviewFlow AI Customer Reputation Support"
        ]
      },
      {
        name: "Enterprise Pipeline Dominance",
        price: "₹89,000",
        period: "per month",
        description: "High-volume customer acquisition for large real estate townships, hospital networks, and national brands.",
        features: [
          "Unlimited Ad Spend Management & Scaled Funnels",
          "Custom API Middleware & Advanced Lead Scoring",
          "Automated Calendar Booking & SMS Reminders",
          "Sales Call Audio / Quality Audit Consulting",
          "24/7 Dedicated Account Director & Daily Pacing Reports"
        ]
      }
    ],
    caseStudy: {
      client: "NCR Luxury Realty Advisors",
      metric: "1,140+ Qualified Buyer Inquiries",
      result: "Reduced CPL by 73% while booking over 380 luxury site tours in Noida & Greater Noida West.",
      industry: "Real Estate",
      slug: "ncr-luxury-realty"
    },
    relatedServices: [
      { slug: "google-ads", title: "Google Ads Management" },
      { slug: "meta-ads", title: "Meta Ads (Facebook & Instagram)" },
      { slug: "digital-marketing", title: "Full-Funnel Digital Marketing" }
    ]
  }
};

// Quick helper to resolve service by slug or alias
export function getServiceBySlug(slug: string): ServiceData | null {
  const directMatch = SERVICES_CATALOG[slug];
  if (directMatch) return directMatch;

  // Search aliases
  for (const service of Object.values(SERVICES_CATALOG)) {
    if (service.aliases && service.aliases.includes(slug)) {
      return service;
    }
  }

  return null;
}

export function getAllServices(): ServiceData[] {
  return Object.values(SERVICES_CATALOG);
}
