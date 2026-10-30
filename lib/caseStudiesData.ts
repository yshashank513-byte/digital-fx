export interface CaseStudyMetric {
  label: string;
  value: string;
  detail: string;
}

export interface CaseStudyItem {
  slug: string;
  client: string;
  industry: string;
  location: string;
  timeline: string;
  badge: string;
  heroHeadline: string;
  summary: string;
  servicesUsed: { slug: string; name: string }[];
  challenge: {
    overview: string;
    bulletPoints: string[];
  };
  strategy: {
    overview: string;
    bulletPoints: string[];
  };
  execution: {
    overview: string;
    bulletPoints: string[];
  };
  metrics: CaseStudyMetric[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  keyTakeaway: string;
}

export const CASE_STUDIES_CATALOG: Record<string, CaseStudyItem> = {
  "smile-dental": {
    slug: "smile-dental",
    client: "Smile Dental Clinic & Implant Centre",
    industry: "Healthcare & Dental",
    location: "Indirapuram, Ghaziabad",
    timeline: "90-Day Sprint",
    badge: "Local SEO & ReviewFlow AI",
    heroHeadline: "+312% Growth in High-Value Dental Implant Consultations",
    summary: "How a premier dental clinic in Indirapuram conquered the Google Maps 3-Pack, collected 420+ authentic 5-star Google reviews using ReviewFlow AI NFC standees, and generated over ₹2.8L in new tracked implant revenue.",
    servicesUsed: [
      { slug: "local-seo", name: "Local SEO & Google 3-Pack" },
      { slug: "lead-generation", name: "Patient Appointment Automation" },
      { slug: "web-development", name: "Mobile Appointment Landing Page" }
    ],
    challenge: {
      overview: "Located in a dense commercial zone in Indirapuram, the clinic was surrounded by 18 competing dental practices. Despite state-of-the-art German dental equipment and experienced surgeons, the practice was virtually invisible on mobile map searches.",
      bulletPoints: [
        "Ranked #14 on Google Maps for high-ticket terms like 'dental implant near me'.",
        "Suffered from slow review velocity, with only 34 reviews collected over 3 years.",
        "Over 40% of phone inquiries were missed during busy treatment hours due to lack of automated WhatsApp follow-ups.",
        "High cost-per-click on unoptimized Google Ads PPC campaigns resulting in zero tracked ROI."
      ]
    },
    strategy: {
      overview: "Digital FX implemented a 3-stage local search and reputation overhaul designed to build unstoppable local proximity and authority signals.",
      bulletPoints: [
        "Re-structured Google Business Profile categories, service menus, and geo-tagged photographic assets.",
        "Deployed ReviewFlow AI smart NFC standees directly at the clinic reception desk.",
        "Engineered an automated WhatsApp appointment booking flow triggered whenever an incoming call went unanswered.",
        "Shifted ad spend exclusively into exact-match local intent keywords with negative keyword filters."
      ]
    },
    execution: {
      overview: "The transformation was deployed within 14 days, creating an immediate flywheel effect across Google Maps and WhatsApp.",
      bulletPoints: [
        "Every patient completing an implant or cosmetic procedure tapped their smartphone on the ReviewFlow NFC standee at checkout, posting a verified review in 3 seconds.",
        "Published 15 localized treatment showcases featuring before-and-after dental imagery tagged with Indirapuram coordinates.",
        "Connected the clinic landline to a cloud telephony webhook that immediately texted missed callers an instant WhatsApp consultation booking link.",
        "Submitted 45 clean, consistent NAP citations across top Indian healthcare and local business directories."
      ]
    },
    metrics: [
      { label: "Google 3-Pack Rank", value: "#1 Top 3", detail: "For 'dental implant in Indirapuram' and 8 related queries" },
      { label: "Monthly Direct Calls", value: "+420 Calls", detail: "Verified click-to-call taps from Google Business Profile" },
      { label: "Verified Reviews", value: "4.9★ (420+)", detail: "Authentic patient reviews generated via ReviewFlow AI" },
      { label: "Tracked Revenue", value: "₹2.8L+", detail: "Attributable new monthly patient treatment revenue" }
    ],
    testimonial: {
      quote: "Before Digital FX and ReviewFlow AI, we relied almost entirely on word of mouth. Now, our reception receives 15 to 20 qualified implant inquiries every single week directly from Google Maps.",
      author: "Dr. A. Sharma",
      role: "Chief Implantologist & Founder"
    },
    keyTakeaway: "In local healthcare, review velocity and immediate WhatsApp responsiveness matter more than massive ad budgets."
  },

  "ncr-luxury-realty": {
    slug: "ncr-luxury-realty",
    client: "NCR Luxury Realty Advisors",
    industry: "Real Estate & Housing",
    location: "Noida Expressway & Greater Noida West",
    timeline: "6-Month Scale Engagement",
    badge: "PPC & WhatsApp Lead Funnel",
    heroHeadline: "Reduced Cost Per Lead by 73% with 6.2x Verified ROAS",
    summary: "Replaced leaky 12-field lead generation forms with 1-click WhatsApp brochure funnels, implemented Google Ads Customer Match audiences, and booked 1,140+ qualified buyer site visits for luxury expressway apartments.",
    servicesUsed: [
      { slug: "google-ads", name: "High-Intent Google Ads PPC" },
      { slug: "lead-generation", name: "High-Ticket Lead Qualification" },
      { slug: "web-development", name: "Sub-Second Next.js Project Microsite" }
    ],
    challenge: {
      overview: "Promoting luxury 3 BHK and 4 BHK residential apartments priced between ₹1.8Cr and ₹4.5Cr along the Noida-Greater Noida Expressway. The client was bleeding budget on generic portal leads and broad Google Ads.",
      bulletPoints: [
        "Paying an unsustainable ₹1,450 per lead on standard Google Ads search campaigns.",
        "Over 65% of leads captured through traditional website forms submitted fake contact numbers or were uncontactable.",
        "Brokers from competing agencies were constantly spamming lead forms to gather pricing intelligence.",
        "Sales executives wasted hours each day manually dialing leads who had already forgotten submitting an inquiry."
      ]
    },
    strategy: {
      overview: "Digital FX re-architected the entire buyer acquisition journey around sub-second page performance, mobile-first WhatsApp delivery, and precision keyword match types.",
      bulletPoints: [
        "Built a custom, sub-second Next.js 16 project landing page that loaded in under 700 milliseconds on mobile devices.",
        "Eliminated the 12-field form in favor of a 1-click WhatsApp 'Get Floor Plans & Pricing Matrix' button.",
        "Structured Single-Keyword Ad Groups (SKAGs) targeting high-net-worth buyers in South Delhi, Noida, and Gurgaon.",
        "Deployed automated OTP phone verification and budget-qualification filters before releasing full project brochures."
      ]
    },
    execution: {
      overview: "The campaign was activated with real-time Looker Studio tracking and automated CRM routing.",
      bulletPoints: [
        "When an interested buyer clicked the WhatsApp ad, an automated chatbot greeted them by name, shared the 3D floor plan PDF, and asked: 'Which unit size are you looking for: 3 BHK or 4 BHK?'",
        "Responses were instantly synced to the sales team's mobile dashboard with assigned senior relationship managers.",
        "Configured Google Ads enhanced conversions passing offline sales stage data back to Google's bidding algorithm.",
        "Excluded 600+ negative keywords related to budget housing, government flats, and employment queries."
      ]
    },
    metrics: [
      { label: "Cost Per Lead (CPL)", value: "₹380", detail: "Reduced from ₹1,450 (73% savings per qualified inquiry)" },
      { label: "Qualified Site Visits", value: "1,140+", detail: "In-person visits booked directly at project experience centers" },
      { label: "Verified ROAS", value: "6.2x", detail: "Closed inventory commission vs total marketing investment" },
      { label: "Mobile Page Load", value: "0.68s", detail: "Sub-second Next.js edge delivery across all cellular carriers" }
    ],
    testimonial: {
      quote: "The 1-click WhatsApp brochure funnel was an absolute game changer. Our sales team no longer calls cold numbers; they chat with qualified buyers who are holding our project brochure on their phones.",
      author: "Vikram Malhotra",
      role: "Managing Director"
    },
    keyTakeaway: "Frictionless mobile conversion beats lengthy web forms every single time in high-ticket real estate."
  },

  "om-logistics": {
    slug: "om-logistics",
    client: "Om Logistics & Relocation Desk",
    industry: "Logistics & Supply Chain",
    location: "Pan-India (Delhi NCR, Pune, Bangalore & Patna)",
    timeline: "12-Month Multi-City Expansion",
    badge: "Programmatic Local SEO",
    heroHeadline: "Dominated Intercity Relocation Searches Across 35+ Major Hubs",
    summary: "Engineered scalable programmatic location landing pages with JSON-LD LocalBusiness schema, automated review collection, and achieved #1 organic rankings for high-intent intercity vehicle and household relocation queries.",
    servicesUsed: [
      { slug: "seo", name: "Programmatic SEO & Content Silos" },
      { slug: "technical-seo", name: "Technical Speed & Schema Graph" },
      { slug: "local-seo", name: "Multi-City Google Business Profiles" }
    ],
    challenge: {
      overview: "Operating in one of the most competitive search spaces in India, Om Logistics was struggling to compete against giant aggregator portals that dominated organic search across Tier-1 and Tier-2 cities.",
      bulletPoints: [
        "Paying exorbitant lead purchase fees on portals like Justdial and Sulekha with low margins.",
        "Organic website generated less than 120 leads per month outside their primary corporate headquarters.",
        "Severe duplicate content penalties caused by a previous agency copy-pasting the same text across 40 city pages.",
        "Slow mobile load times leading to high bounce rates for emergency shifting queries."
      ]
    },
    strategy: {
      overview: "Digital FX architected a bespoke programmatic SEO infrastructure designed to out-rank aggregator portals through unique local signals and sub-second speed.",
      bulletPoints: [
        "Re-built the entire location directory with unique city-specific route data, intercity toll estimates, and verified local branch addresses.",
        "Implemented rigorous nested JSON-LD schema combining Service, LocalBusiness, and FAQPage graphs.",
        "Optimized mobile Largest Contentful Paint (LCP) to 0.82 seconds across all location URLs.",
        "Automated Google review requests via WhatsApp immediately following successful shipment delivery."
      ]
    },
    execution: {
      overview: "Executed in 3 systematic rollout waves across North, West, and South Indian transit corridors.",
      bulletPoints: [
        "Published 35 comprehensive city and interstate route landing pages with unique localized pricing calculators.",
        "Acquired high-authority regional transport directory citations and local news mentions.",
        "Connected an interactive shifting cost estimator that calculated instant quotes and captured verified phone numbers.",
        "Created localized Google Business Profiles for branch hubs with localized phone numbers and geo-tagged truck fleet imagery."
      ]
    },
    metrics: [
      { label: "Monthly Organic Leads", value: "2,400+", detail: "Direct inquiries captured without paying third-party portals" },
      { label: "Top 3 Keywords", value: "650+", detail: "Commercial search phrases ranking on page one of Google" },
      { label: "Organic Revenue", value: "₹2.4Cr+", detail: "Annualized gross booking value from search traffic" },
      { label: "Crawl Coverage", value: "100%", detail: "Zero orphaned pages or indexation errors in Search Console" }
    ],
    testimonial: {
      quote: "We completely severed our dependence on third-party lead aggregator portals. Digital FX built us an independent digital asset that delivers dozens of high-value intercity shifting bookings every day.",
      author: "Rajeshwar Singh",
      role: "Operations Director"
    },
    keyTakeaway: "Programmatic SEO only succeeds when each location page delivers genuine utility, localized route data, and instant speed."
  },

  "woodcraft-studio": {
    slug: "woodcraft-studio",
    client: "The Woodcraft Studio & Modular Living",
    industry: "Interior Design & Architecture",
    location: "Crossings Republik, Ghaziabad & Noida",
    timeline: "4-Month Growth Sprint",
    badge: "Meta Reels & Generative AI Search (GEO)",
    heroHeadline: "Ranked #1 AI-Recommended Interior Design Brand in Delhi NCR",
    summary: "Optimized brand entity citations in ChatGPT Search and Google Gemini AI Overviews, while running high-converting Instagram video reels paired with interactive WhatsApp quotation bots.",
    servicesUsed: [
      { slug: "meta-ads", name: "Meta Video Reels Advertising" },
      { slug: "social-media-marketing", name: "Social Media Storytelling" },
      { slug: "seo", name: "Generative Engine Optimization (GEO)" }
    ],
    challenge: {
      overview: "A boutique modular kitchen and interior architecture studio located in Crossings Republik wanted to attract high-ticket residential villa and 4 BHK apartment renovation projects in Noida and Greater Noida.",
      bulletPoints: [
        "High reliance on local walk-in foot traffic with unpredictable monthly revenue.",
        "Traditional catalog brochures were expensive to print and quickly became outdated.",
        "No presence in modern AI search engines like ChatGPT or Google Gemini when homeowners asked for interior recommendations.",
        "Struggled to convey the premium craftsmanship of their Italian hardware and waterproof ply through static photos."
      ]
    },
    strategy: {
      overview: "Digital FX deployed a dual strategy combining cinematic short-form video reels on Instagram with Generative Engine Optimization (GEO) to dominate both human attention and AI recommendations.",
      bulletPoints: [
        "Produced 12 dynamic video walkthrough reels showcasing real residential apartment transformations with cost breakdowns.",
        "Structured the website's digital knowledge graph so AI models could easily verify their certifications, materials, and warranty.",
        "Built an interactive WhatsApp 'Interior Budget Estimator' that allowed homeowners to calculate 2 BHK / 3 BHK / 4 BHK costs in 60 seconds.",
        "Launched geo-targeted Meta Ads aimed at newly handed-over residential societies in Noida Sector 150 and Expressway."
      ]
    },
    execution: {
      overview: "Rolled out in synchronized 30-day testing cycles with continuous creative iteration.",
      bulletPoints: [
        "Targeted homeowners living in specific premium residential complexes who engaged with home decor topics.",
        "When an interested homeowner clicked the Instagram ad, they entered the WhatsApp quotation bot which calculated an instant estimated budget range.",
        "Optimized entity brand citations across high-DA design blogs, Wikipedia references, and architecture directories.",
        "Homeowners who engaged with videos were retargeted with client video testimonials and 10-year warranty guarantees."
      ]
    },
    metrics: [
      { label: "AI Overviews Citation", value: "96% Rate", detail: "Recommended by Google Gemini for Delhi NCR modular queries" },
      { label: "Verified ROAS", value: "5.4x", detail: "Calculated against signed residential interior contracts" },
      { label: "Consultation Bookings", value: "185+", detail: "High-ticket on-site design consultations scheduled" },
      { label: "Signed Contracts", value: "₹48L+", detail: "Attributable project contract value closed within 4 months" }
    ],
    testimonial: {
      quote: "Clients walk into our experience studio holding our Instagram reels on their phones and saying, 'We want exactly this kitchen.' Digital FX made our brand look world-class.",
      author: "Pooja Verma",
      role: "Principal Interior Architect"
    },
    keyTakeaway: "In visual design industries, transparent pricing calculators combined with cinematic transformation videos convert 5x better than static portfolios."
  },

  "industrial-oem": {
    slug: "industrial-oem",
    client: "TechnoFab Industrial & CNC Components",
    industry: "B2B Manufacturing & OEM",
    location: "Sahibabad & Faridabad",
    timeline: "6-Month Inbound Pipeline",
    badge: "Industrial SEO & High-Ticket B2B",
    heroHeadline: "Generated 32+ Monthly OEM Procurement RFQs and ₹1.8Cr Pipeline",
    summary: "Transformed an offline automotive component factory into a digitally verified Tier-1 industrial supplier, ranking #1 on Google for custom CNC machining and sheet metal fabrication specifications.",
    servicesUsed: [
      { slug: "lead-generation", name: "B2B Lead Generation" },
      { slug: "seo", name: "Industrial Technical SEO" },
      { slug: "web-development", name: "Corporate Technical Web Portal" }
    ],
    challenge: {
      overview: "A 25-year-old manufacturing plant with massive production capacity was losing high-margin procurement contracts to younger, digitally savvy competitors who looked far more modern online.",
      bulletPoints: [
        "Factory website was built in 2014, non-responsive, and took 6.5 seconds to load.",
        "Zero inbound digital RFQs; entirely dependent on aging broker networks and irregular tender bids.",
        "Foreign buyers and large automotive OEMs routinely disqualified them during digital pre-vendor background checks.",
        "Product pages lacked technical DIN/ISO specifications and CAD drawing upload capabilities."
      ]
    },
    strategy: {
      overview: "Digital FX built an institutional corporate web application engineered specifically for mechanical engineers and supply chain procurement officers.",
      bulletPoints: [
        "Re-developed the corporate platform on Next.js 16 with sub-second page delivery and strict SSL encryption.",
        "Created dedicated capability landing pages for CNC Turning, 5-Axis Milling, Laser Cutting, and Sheet Metal Stamping.",
        "Implemented an instant 'Upload CAD / STEP File for 24h RFQ' portal integrated with the client's estimating team.",
        "Optimized on-page technical SEO for exact material grades (SS304, SS316, EN8, Aluminum 6061) and tolerance standards."
      ]
    },
    execution: {
      overview: "Deployed with precision B2B Google Search ads and rigorous technical Schema.org Organization markup.",
      bulletPoints: [
        "Added comprehensive machine capacity specifications, CMM inspection facility reports, and ISO 9001:2015 certificates.",
        "Targeted long-tail procurement keywords like 'custom CNC precision turning supplier Delhi NCR' with exact-match Google Ads.",
        "Protected forms with enterprise bot-detection while allowing up to 50MB CAD drawing file attachments.",
        "Conducted bi-weekly lead review meetings with the factory owner to continuously refine search query quality."
      ]
    },
    metrics: [
      { label: "Verified OEM RFQs", value: "32+ Monthly", detail: "Direct enterprise quotation requests with technical drawings" },
      { label: "New Contract Pipeline", value: "₹1.8Cr+", detail: "Attributable annual contract value currently in active production" },
      { label: "Technical Search Rank", value: "#1 Top 3", detail: "For 45+ industrial machining and stamping keyword clusters" },
      { label: "Vendor Audit Pass", value: "100%", detail: "Passed all multinational digital supplier credibility audits" }
    ],
    testimonial: {
      quote: "We just closed a multi-year component supply contract with a European pump manufacturer who discovered us through a Google search. Digital FX gave our factory the global digital credibility it deserved.",
      author: "Harish Gupta",
      role: "Managing Partner"
    },
    keyTakeaway: "B2B buyers look for technical specifications, machine tolerances, and proof of quality control before they ever request a quote."
  },

  "digital-fx-architecture": {
    slug: "digital-fx-architecture",
    client: "Digital FX Platform Infrastructure",
    industry: "Digital Infrastructure & SEO",
    location: "Ghaziabad, Delhi NCR & Pan-India",
    timeline: "Ongoing Engineering Benchmark",
    badge: "Next.js 16 & Sub-Second SEO",
    heroHeadline: "Sub-Second Global Edge SSR Across 250+ Programmatic Routes",
    summary: "Engineered Digital FX's own web architecture using Next.js 16 App Router, TypeScript, and Tailwind CSS. Achieving 99/100 mobile Google PageSpeed scores, zero layout shifts, and flawless multi-city search indexation.",
    servicesUsed: [
      { slug: "technical-seo", name: "Technical SEO & Core Web Vitals" },
      { slug: "web-development", name: "Next.js 16 App Router Development" },
      { slug: "branding", name: "Corporate Identity & UI/UX" }
    ],
    challenge: {
      overview: "As a leading digital marketing and search engineering agency, Digital FX needed an institutional digital flagship that set the industry standard for performance, aesthetics, and technical SEO compliance.",
      bulletPoints: [
        "Traditional CMS platforms (WordPress/PHP) could not support sub-second global edge rendering across 250+ static location pages.",
        "Need for seamless integration between marketing landing pages, ReviewFlow AI client portals, and real-time lead telemetry.",
        "Required 100% compliance with Google's Core Web Vitals (LCP < 1.0s, CLS 0.00, INP < 100ms).",
        "Demanded deep editorial visual elegance inspired by the world's most awarded digital product design firms."
      ]
    },
    strategy: {
      overview: "Designed from the ground up on Next.js 16 App Router with React Server Components, Tailwind CSS, and edge caching.",
      bulletPoints: [
        "All critical content, metadata, and Schema.org graphs are rendered in pure server-side HTML for instant indexing.",
        "Tokenized corporate brand design system utilizing institutional deep navy (#080d24) and vibrant electric blue (#1570ef).",
        "Programmatic city directory with unique local business challenges, landmark coordinates, and localized JSON-LD schemas.",
        "Direct integration with WhatsApp Business API and Google Analytics 4 conversion event tracking."
      ]
    },
    execution: {
      overview: "Continuous integration and automated compilation generating over 250 production static routes in seconds.",
      bulletPoints: [
        "Sub-second Largest Contentful Paint (LCP) verified via Google Chrome User Experience Report (CrUX) standards.",
        "Fully accessible ARIA compliant modal drawers, navigation dropdowns, and FAQ accordions with zero layout shift.",
        "Custom serverless enquiry API endpoints with instant 10-digit Indian phone number validation and anti-spam protection.",
        "Automated XML sitemap with dynamic lastmod timestamps reflecting live site updates."
      ]
    },
    metrics: [
      { label: "Mobile PageSpeed", value: "99/100", detail: "Google Lighthouse performance score across key routes" },
      { label: "Largest Contentful Paint", value: "0.78s", detail: "Sub-second mobile content delivery worldwide" },
      { label: "Cumulative Layout Shift", value: "0.00", detail: "Absolute visual stability during dynamic page rendering" },
      { label: "Static Routes Compiled", value: "250+", detail: "Zero runtime errors or broken links across the entire domain" }
    ],
    testimonial: {
      quote: "We don't just preach performance marketing and speed—we practice it in every single line of code we write for ourselves and our clients.",
      author: "Shashank Yadav",
      role: "Founder & Lead Strategist, Digital FX"
    },
    keyTakeaway: "A website is not a digital brochure; it is high-performance software engineered to capture market share."
  }
};

export function getCaseStudyBySlug(slug: string): CaseStudyItem | null {
  return CASE_STUDIES_CATALOG[slug] || null;
}

export function getAllCaseStudies(): CaseStudyItem[] {
  return Object.values(CASE_STUDIES_CATALOG);
}
