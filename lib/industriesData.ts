export interface IndustryChallenge {
  title: string;
  desc: string;
}

export interface IndustryPlaybookStep {
  step: string;
  title: string;
  desc: string;
}

export interface IndustryResult {
  metric: string;
  label: string;
  desc: string;
}

export interface IndustryData {
  slug: string;
  title: string;
  shortTitle: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroTagline: string;
  heroBadge: string;
  overview: string;
  challenges: IndustryChallenge[];
  playbook: IndustryPlaybookStep[];
  results: IndustryResult[];
  coreServices: { slug: string; name: string; why: string }[];
  faqs: { question: string; answer: string }[];
}

export const INDUSTRIES_CATALOG: Record<string, IndustryData> = {
  "real-estate": {
    slug: "real-estate",
    title: "Digital Marketing & Lead Generation for Real Estate Developers & Brokers",
    shortTitle: "Real Estate",
    metaTitle: "Real Estate Digital Marketing Agency | Qualified Buyer Leads | Digital FX",
    metaDescription: "Drive verified site visits and luxury apartment buyer leads across Delhi NCR, Mumbai, and Bangalore with Digital FX's real estate growth engine.",
    h1: "High-Velocity Digital Marketing for Real Estate Developers",
    heroTagline: "Stop paying for junk portal leads shared across 20 competing brokers. We engineer exclusive buyer acquisition funnels, Google Ads PPC, and 1-click WhatsApp brochure workflows that fill your site visit calendar.",
    heroBadge: "Real Estate Growth Architecture",
    overview: "Real estate transactions in India require high trust, spatial visualization, and immediate follow-up. Standard lead forms with 12 fields lose over 70% of high-net-worth buyers on mobile screens. Digital FX deploys sub-second Next.js project landing pages, Google Ads Customer Match audiences, and direct WhatsApp brochure delivery that qualify prospects by budget tier and schedule verified on-site visits.",
    challenges: [
      {
        title: "Portal Lead Fatigue & Low Conversions",
        desc: "Listing portals sell the same lead to 15 different brokers simultaneously, leading to annoyed buyers who block incoming calls."
      },
      {
        title: "Sky-High Cost Per Acquisition (CPA)",
        desc: "Unoptimized Google and Meta Ads broad-targeting burns hundreds of thousands on unqualified inquiries without investment capability."
      },
      {
        title: "Slow Sales Response Time",
        desc: "Leads that wait more than 15 minutes for project brochures or floor plans routinely lose purchase interest or purchase elsewhere."
      }
    ],
    playbook: [
      {
        step: "01",
        title: "Exclusive High-Speed Project Landing Page",
        desc: "We build dedicated sub-second Next.js project microsites featuring interactive 3D floor plans, amenity walk-throughs, and price matrices."
      },
      {
        step: "02",
        title: "Laser Google PPC & High-Net-Worth Meta Targeting",
        desc: "Deploying high-intent search ads for project names and micro-locations, combined with custom NRI and investor lookalike audiences."
      },
      {
        step: "03",
        title: "Instant 1-Click WhatsApp Brochure Automation",
        desc: "Prospective buyers receive full PDF brochures and virtual walkthrough videos within 5 seconds on WhatsApp without filling lengthy forms."
      },
      {
        step: "04",
        title: "Automated Site Visit Scheduling & CRM Sync",
        desc: "Interactive calendars allow buyers to lock in their preferred weekend visit slots, instantly notifying your sales floor."
      }
    ],
    results: [
      { metric: "73%", label: "Lower Cost Per Lead", desc: "Slashed CPL from ₹1,450 to ₹380 on luxury residential projects." },
      { metric: "1,140+", label: "Verified Site Visits", desc: "High-intent buyer tours booked directly in sales CRM." },
      { metric: "6.2x", label: "Attributable ROAS", desc: "Verified pipeline value compared against advertising expenditure." }
    ],
    coreServices: [
      { slug: "lead-generation", name: "High-Ticket Lead Generation", why: "Exclusive pre-qualified buyer pipelines with verified phone numbers." },
      { slug: "google-ads", name: "Google Ads Management", why: "Capture high-intent searches for project launches and locality keywords." },
      { slug: "web-development", name: "Sub-Second Next.js Landing Pages", why: "Zero mobile bounce rates with instant brochure downloads." }
    ],
    faqs: [
      {
        question: "How do you filter out brokers and unqualified leads?",
        answer: "Our landing pages include multi-step qualifying prompts (e.g., 'Target Configuration: 3 BHK / 4 BHK', 'Budget: ₹1.5Cr - ₹3Cr+'). Furthermore, leads are authenticated via instant mobile verification, filtering out non-serious browsers."
      },
      {
        question: "Can you target NRI real estate investors in the UAE, US, and UK?",
        answer: "Yes. We run specialized international Google Search and Meta Ads campaigns localized for high-earning Indian diaspora in Dubai, Abu Dhabi, London, Singapore, and Silicon Valley looking to invest in Indian residential townships."
      }
    ]
  },

  "healthcare": {
    slug: "healthcare",
    title: "Healthcare, Hospital & Super-Specialty Clinic Digital Marketing",
    shortTitle: "Healthcare & Clinics",
    metaTitle: "Healthcare Digital Marketing Agency | Doctor & Clinic SEO | Digital FX",
    metaDescription: "Dominate Google Maps 3-Pack, capture patient appointments, and build clinical authority for hospitals, dental clinics, and IVF centers.",
    h1: "Patient-Centric Digital Marketing for Clinics & Hospitals",
    heroTagline: "Patients don't browse healthcare—they search with urgency and anxiety. We engineer local Google 3-Pack dominance, physician authority, and frictionless appointment booking systems that build deep patient trust.",
    heroBadge: "Medical & Clinical Growth Systems",
    overview: "Healthcare marketing operates under strict ethical and algorithmic scrutiny. Google's 'Your Money Your Life' (YMYL) guidelines demand medical credentialing, verified schema data, and authentic patient testimonials. Digital FX combines local Google Maps optimization, doctor profile authority, ReviewFlow AI automated reputation management, and HIPAA/telehealth compliance to build steady, high-trust patient appointment pipelines.",
    challenges: [
      {
        title: "Google's Strict YMYL Algorithmic Scrutiny",
        desc: "Medical content without verified doctor authorship and Schema.org MedicalWebPage data is aggressively down-ranked by Google."
      },
      {
        title: "Negative Online Reviews & Trust Erosion",
        desc: "A single disgruntled or fake review can devastate patient walk-ins if not counterbalanced by consistent, verified positive patient experiences."
      },
      {
        title: "Appointment No-Shows & Friction",
        desc: "Slow receptionist callbacks and complicated phone trees result in over 35% patient leakage to competing neighborhood clinics."
      }
    ],
    playbook: [
      {
        step: "01",
        title: "Google Maps 3-Pack Local Domination",
        desc: "Optimizing Google Business Profiles for high-value treatment keywords ('dental implant near me', 'best IVF specialist')."
      },
      {
        step: "02",
        title: "ReviewFlow AI In-Clinic Patient Feedback Desk",
        desc: "Placing smart NFC review standees at reception to seamlessly capture genuine 5-star Google reviews from satisfied patients."
      },
      {
        step: "03",
        title: "Physician Authority & Schema.org Medical Graph",
        desc: "Building doctor bio pages with verifiable educational credentials, medical council registrations, and peer citations."
      },
      {
        step: "04",
        title: "Direct WhatsApp Appointment Booking Bot",
        desc: "Instant automated WhatsApp scheduling that allows patients to select dates, receive clinic location pins, and get reminders."
      }
    ],
    results: [
      { metric: "+312%", label: "Appointment Inquiries", desc: "Increase in high-value dental and elective procedure inquiries in 90 days." },
      { metric: "#1 Top 3", label: "Google Maps 3-Pack", desc: "Sustained first-place ranking across local geographic search radius." },
      { metric: "4.9★", label: "Verified Rating", desc: "Over 420 authentic Google reviews collected via ReviewFlow AI." }
    ],
    coreServices: [
      { slug: "local-seo", name: "Google Maps 3-Pack Local SEO", why: "Capture high-intent patients searching in their immediate neighborhood." },
      { slug: "lead-generation", name: "Patient Appointment Systems", why: "Automated booking and SMS/WhatsApp appointment reminders." },
      { slug: "seo", name: "Medical Entity SEO", why: "Rank doctor specialities on Google search across all target treatments." }
    ],
    faqs: [
      {
        question: "Is your digital marketing compliant with Indian Medical Council guidelines?",
        answer: "Yes, 100%. We strictly avoid sensationalist or misleading medical claims, focusing instead on objective practitioner qualifications, genuine clinic amenities, educational treatment guides, and authentic patient feedback."
      },
      {
        question: "How does ReviewFlow AI help healthcare clinics?",
        answer: "ReviewFlow AI is a smart NFC hardware and QR desk system. When a happy patient finishes their consultation or treatment, they tap their phone at reception to post an authentic 5-star Google review in just 3 seconds."
      }
    ]
  },

  "ecommerce-d2c": {
    slug: "ecommerce-d2c",
    title: "E-Commerce & D2C Brand Digital Marketing & Scaling",
    shortTitle: "E-Commerce & D2C",
    metaTitle: "D2C & E-Commerce Marketing Agency | Scale ROAS & Sales | Digital FX",
    metaDescription: "Scale your online brand with high-ROAS Meta and Google Ads, Shopify speed optimization, automated WhatsApp cart recovery, and retention marketing.",
    h1: "High-ROAS Digital Marketing for E-Commerce & D2C",
    heroTagline: "Scaling a direct-to-consumer brand requires more than basic ad spend; it requires high unit margins, rapid creative testing, and automated repeat purchase retention. We turn clicks into compounding orders.",
    heroBadge: "D2C Performance & Retention Architecture",
    overview: "With escalating customer acquisition costs on social networks, D2C brands cannot survive on first-purchase profitability alone. Digital FX constructs end-to-end commerce growth engines combining high-velocity creative testing on Meta Ads, Google Performance Max shopping feeds, sub-second Shopify theme engineering, and automated WhatsApp post-purchase repeat order flows.",
    challenges: [
      {
        title: "Escalating Ad Costs & Depreciating ROAS",
        desc: "Without systematic creative refresh schedules and first-party server-side tracking, ad acquisition costs quickly erode gross margins."
      },
      {
        title: "High Abandoned Cart & COD RTO Rates",
        desc: "Indian e-commerce stores frequently lose 65%+ of carts and suffer from 25%+ Cash on Delivery returns to origin (RTO)."
      },
      {
        title: "Slow Storefronts Leaking Mobile Shoppers",
        desc: "Shopify stores bloated with dozens of unoptimized apps take 4+ seconds to load on mobile, resulting in massive bounce rates."
      }
    ],
    playbook: [
      {
        step: "01",
        title: "Creative-First Meta & Reels Performance Ad Engine",
        desc: "Testing 10+ dynamic video hooks, lifestyle carousels, and unboxing angles weekly to maintain low customer acquisition costs."
      },
      {
        step: "02",
        title: "Google Performance Max & Merchant Center Feed",
        desc: "Structured product feeds optimized with high-volume search titles, high-resolution product photography, and price competitiveness."
      },
      {
        step: "03",
        title: "Server-Side Meta CAPI & First-Party Data",
        desc: "Deploying server-side event tracking directly from Next.js or Shopify to overcome iOS 14+ ad tracking data blindspots."
      },
      {
        step: "04",
        title: "WhatsApp Abandoned Cart & COD Verification",
        desc: "Instant automated WhatsApp recovery messages and OTP confirmation on COD orders to drastically reduce return losses."
      }
    ],
    results: [
      { metric: "4.8x", label: "Sustained ROAS", desc: "Blended return on ad spend maintained across high-velocity D2C brand catalogs." },
      { metric: "24%", label: "Cart Recovery Rate", desc: "Abandoned purchases recovered via automated WhatsApp workflows." },
      { metric: "-42%", label: "COD Return Losses", desc: "Reduction in fake orders via automated OTP verification before dispatch." }
    ],
    coreServices: [
      { slug: "meta-ads", name: "Meta Ads (Instagram & Facebook)", why: "Drive impulse discovery and high-volume lifestyle consumer purchases." },
      { slug: "ecommerce-development", name: "Custom Shopify & Headless Stores", why: "Sub-second mobile checkout that eliminates purchase friction." },
      { slug: "google-ads", name: "Google Performance Max (Shopping)", why: "Capture high-intent product searchers ready to checkout instantly." }
    ],
    faqs: [
      {
        question: "What monthly ad spend is required to see strong results in D2C?",
        answer: "We typically recommend a starting performance ad spend of ₹50,000 to ₹1,00,000 per month. This provides sufficient conversion data for Meta's and Google's algorithms to exit the learning phase within 7 to 10 days."
      },
      {
        question: "How do you handle COD confirmation to reduce RTO losses?",
        answer: "Every COD order automatically triggers an instant WhatsApp message with an interactive 'Confirm Order' button and an option to switch to instant UPI payment for an exclusive 5% prepaid discount."
      }
    ]
  },

  "b2b-manufacturing": {
    slug: "b2b-manufacturing",
    title: "B2B, Industrial OEM & Manufacturing Lead Generation",
    shortTitle: "B2B & Manufacturing",
    metaTitle: "B2B Manufacturing Lead Generation Agency | Industrial SEO | Digital FX",
    metaDescription: "Generate verified procurement RFQs, distributor applications, and factory enquiries with Digital FX's B2B digital marketing engine.",
    h1: "High-Ticket B2B & Industrial Lead Generation",
    heroTagline: "Industrial equipment and OEM manufacturing deals are not won with generic consumer tactics. We engineer technical SEO, LinkedIn executive pipelines, and Google Search architectures that connect you to corporate procurement heads.",
    heroBadge: "Industrial B2B Growth Architecture",
    overview: "B2B procurement involves multi-month decision cycles, technical specification vetting, and committee approvals. Decision-makers search for exact technical specifications, raw material grades, and industrial capabilities. Digital FX structures comprehensive B2B search visibility, technical spec sheet downloads, and LinkedIn corporate outreach that establish your factory as a Tier-1 vendor.",
    challenges: [
      {
        title: "Dependence on Traditional Trade Fairs & Agents",
        desc: "Offline expos are expensive, seasonal, and fail to provide predictable monthly procurement pipelines."
      },
      {
        title: "Low Quality Portal Enquiries (IndiaMART/TradeIndia)",
        desc: "Listing portals pit 50 manufacturers against each other in a race-to-the-bottom price war with zero brand differentiation."
      },
      {
        title: "Lack of Digital Technical Credibility",
        desc: "Outdated, non-responsive factory websites fail vendor audits from large corporate and multinational procurement teams."
      }
    ],
    playbook: [
      {
        step: "01",
        title: "Technical Specification & Part-Number SEO",
        desc: "Optimizing your catalog for exact technical terms, DIN/ISO standards, material grades (e.g. SS316, EN8), and engineering capacities."
      },
      {
        step: "02",
        title: "Google Search Ads for High-Intent RFQ Terms",
        desc: "Targeting high-intent search queries ('CNC machining supplier India', 'custom sheet metal fabrication OEM') with negative keyword filters."
      },
      {
        step: "03",
        title: "Executive Technical Corporate Web Presence",
        desc: "Building institutional Next.js web platforms showcasing machine capacity, factory certifications, testing facilities, and QA protocols."
      },
      {
        step: "04",
        title: "Direct WhatsApp & Email RFQ Dispatch",
        desc: "Procurement managers upload engineering drawings (CAD/PDF) directly on your site, instantly routing to your estimating engineers."
      }
    ],
    results: [
      { metric: "32+", label: "Verified OEM RFQs", desc: "Monthly enterprise quotation requests generated for industrial equipment." },
      { metric: "₹1.8Cr+", label: "Contract Pipeline", desc: "Attributable deal value generated across manufacturing clients." },
      { metric: "#1", label: "Technical Search Rank", desc: "Top organic positions for high-intent B2B component manufacturing keywords." }
    ],
    coreServices: [
      { slug: "lead-generation", name: "High-Ticket Lead Generation", why: "Capture detailed RFQs with technical drawing upload capabilities." },
      { slug: "seo", name: "Technical & Industrial SEO", why: "Dominate Google search results for OEM specifications and parts." },
      { slug: "web-development", name: "Institutional Corporate Web Portals", why: "Pass vendor qualification audits from Fortune 500 procurement teams." }
    ],
    faqs: [
      {
        question: "Can digital marketing really generate multi-lakh B2B factory orders?",
        answer: "Yes. Procurement officers, supply chain directors, and factory engineers turn to Google search to evaluate new Tier-1 and Tier-2 suppliers when existing vendors fail on price, quality, or lead times. Capturing them at that exact moment delivers multi-year manufacturing contracts."
      },
      {
        question: "How do you prevent retail consumers from submitting B2B inquiries?",
        answer: "We set minimum order quantities (MOQ) clearly on landing pages and implement multi-step qualification filters requiring company registration details and project order volumes before form submission."
      }
    ]
  },

  "education": {
    slug: "education",
    title: "Education, Universities, Colleges & EdTech Digital Marketing",
    shortTitle: "Education & EdTech",
    metaTitle: "Education Digital Marketing Agency | Student Admissions | Digital FX",
    metaDescription: "Accelerate student enrollment and admissions for colleges, universities, and coaching academies with Digital FX's digital marketing funnels.",
    h1: "High-Enrollment Digital Marketing for Educational Institutions",
    heroTagline: "Parents and students evaluate hundreds of institutions before deciding on admissions. We build high-trust digital authority, Google Search visibility, and automated WhatsApp counseling funnels that maximize enrollments.",
    heroBadge: "Admissions & Enrollment Velocity",
    overview: "Education decisions are emotionally and financially significant. Students search for placement records, campus life, faculty credentials, and course curricula, while parents evaluate safety, accreditation, and ROI. Digital FX crafts full-funnel admissions engines combining Google Search capture during peak admission seasons, engaging campus video tours on Meta/YouTube, and instant WhatsApp counseling chatbots.",
    challenges: [
      {
        title: "Extreme Seasonality & Admission Windows",
        desc: "Educational institutions have strict 60 to 90-day enrollment windows; campaigns must scale instantly without room for error."
      },
      {
        title: "Skyrocketing Cost Per Student Admission",
        desc: "Unfocused display ads generate thousands of inquiries from students who don't meet admission cut-offs or cannot afford tuition."
      },
      {
        title: "Counseling Drop-Off & Delayed Follow-Up",
        desc: "Counselors overwhelmed by spreadsheets take days to contact prospective students, who enroll with competitors in the meantime."
      }
    ],
    playbook: [
      {
        step: "01",
        title: "High-Intent Google Search & Exam Query Capture",
        desc: "Bidding on course keywords, entrance exam eligibility, and comparative queries ('best B.Tech college in Delhi NCR')."
      },
      {
        step: "02",
        title: "Authentic Campus Tour & Alumni Reels",
        desc: "Producing engaging short-form video reels highlighting placement statistics, lab infrastructure, and genuine student experiences."
      },
      {
        step: "03",
        title: "Instant WhatsApp Admission Counseling Bot",
        desc: "Allowing students and parents to download brochures, calculate scholarship eligibility, and book campus tours on WhatsApp."
      },
      {
        step: "04",
        title: "Automated CRM Counseling Routing & Reminders",
        desc: "Routing qualified applicants directly to assigned counselors within 60 seconds with automated SMS/WhatsApp reminders."
      }
    ],
    results: [
      { metric: "+45%", label: "Admissions Volume", desc: "Year-over-year increase in verified student course registrations." },
      { metric: "-36%", label: "Cost Per Enrolled Student", desc: "Significant reduction in student acquisition cost vs print & outdoor media." },
      { metric: "88%", label: "Counseling Show-Up Rate", desc: "Sustained attendance rate for campus counseling sessions via WhatsApp reminders." }
    ],
    coreServices: [
      { slug: "lead-generation", name: "High-Ticket Lead Generation", why: "Capture pre-screened student applications with automated counseling routing." },
      { slug: "google-ads", name: "Google Search & YouTube Ads", why: "Dominate peak admission season searches and video campus tours." },
      { slug: "social-media-marketing", name: "Social Media & Campus Storytelling", why: "Showcase vibrant student life, alumni packages, and campus energy." }
    ],
    faqs: [
      {
        question: "When should educational institutions start admission marketing campaigns?",
        answer: "We recommend initiating brand awareness and SEO campaigns 4 to 6 months before the academic session starts, followed by aggressive paid search and WhatsApp conversion campaigns 60 to 90 days prior to admission deadlines."
      },
      {
        question: "Can your system handle thousands of student inquiries simultaneously?",
        answer: "Yes. Our cloud-based Next.js architectures and WhatsApp automation bots can effortlessly process tens of thousands of simultaneous student inquiries, distributing prospect records to counseling teams without any server lag."
      }
    ]
  },

  "hospitality": {
    slug: "hospitality",
    title: "Hospitality, Luxury Resorts & Boutique Dining Digital Marketing",
    shortTitle: "Hospitality & Dining",
    metaTitle: "Hospitality & Resort Marketing Agency | Direct Bookings | Digital FX",
    metaDescription: "Drive direct resort bookings, luxury wedding venue inquiries, and restaurant reservations while slashing OTA commission fees with Digital FX.",
    h1: "High-Yield Digital Marketing for Luxury Resorts & Hospitality",
    heroTagline: "Stop paying 20% to 30% in commission fees to online travel agencies (OTAs). We craft visually stunning social media campaigns, Google Hotel search dominance, and direct booking engines that drive high-margin guests.",
    heroBadge: "Direct Booking & Guest Acquisition Engine",
    overview: "Hospitality is an experiential, visually driven industry. Modern travelers research destinations across Instagram and YouTube before booking. Relying exclusively on OTAs strips your property of brand equity and slashes profit margins. Digital FX designs irresistible visual storytelling campaigns, Google Maps local dominance, and seamless direct booking engines that attract premium guests.",
    challenges: [
      {
        title: "Hefty 20%-30% OTA Commission Fees",
        desc: "Third-party portals (MakeMyTrip, Booking.com, Agoda) control guest relationships while extracting massive commission percentages."
      },
      {
        title: "Weekend vs. Weekday Occupancy Swings",
        desc: "Resorts frequently sell out on Saturday nights while suffering from empty rooms and underutilized amenities Monday through Thursday."
      },
      {
        title: "Low Event & Destination Wedding Enquiries",
        desc: "Failing to capture high-ticket banquet, corporate offsite, and luxury wedding inquiries that generate the largest profit margins."
      }
    ],
    playbook: [
      {
        step: "01",
        title: "Cinematic Visual Storytelling on Instagram Reels",
        desc: "Producing breathtaking drone shots, culinary highlights, and cozy suite walkthroughs that inspire immediate weekend trip desires."
      },
      {
        step: "02",
        title: "Google Local 3-Pack & Hotel Search Ads",
        desc: "Dominating local proximity searches ('resort near Delhi NCR', 'best luxury wedding lawn in Ghaziabad') with real-time room rates."
      },
      {
        step: "03",
        title: "Direct Booking Incentive Engine",
        desc: "Rewarding guests who book directly through your website with complimentary breakfast, spa credits, or room upgrades."
      },
      {
        step: "04",
        title: "WhatsApp Concierge & Guest Review Acceleration",
        desc: "Deploying ReviewFlow AI at check-out to effortlessly gather 5-star Google reviews and re-engage guests with seasonal return offers."
      }
    ],
    results: [
      { metric: "+65%", label: "Direct Website Bookings", desc: "Shift in reservation volume away from high-commission third-party OTAs." },
      { metric: "185+", label: "Wedding & Banquet Inquiries", desc: "High-ticket destination wedding proposals generated per season." },
      { metric: "4.9★", label: "Google Review Score", desc: "Maintained reputation score using ReviewFlow AI smart desk standees." }
    ],
    coreServices: [
      { slug: "meta-ads", name: "Meta Video Ads (Reels & Lifestyle)", why: "Inspire travel demand with stunning visual video reels and weekend offers." },
      { slug: "local-seo", name: "Local SEO & ReviewFlow AI", why: "Dominate Google Maps and capture nearby weekend getaway travelers." },
      { slug: "web-development", name: "Direct Booking Website Engine", why: "Eliminate OTA commissions with seamless mobile room booking." }
    ],
    faqs: [
      {
        question: "How can a boutique resort compete with huge booking portals like MakeMyTrip?",
        answer: "By building a distinct brand narrative on Instagram and Google Maps, and offering exclusive direct-booking incentives (such as free room upgrades or dining discounts) that OTAs are legally unable to match."
      },
      {
        question: "Can you help market banquet halls and destination wedding packages?",
        answer: "Yes! High-ticket banquets and weddings are our specialty. We run targeted campaigns aimed at newly engaged couples and corporate HR heads, generating complete event details (guest count, dates, catering preferences) directly into your sales desk."
      }
    ]
  }
};

export function getIndustryBySlug(slug: string): IndustryData | null {
  return INDUSTRIES_CATALOG[slug] || null;
}

export function getAllIndustries(): IndustryData[] {
  return Object.values(INDUSTRIES_CATALOG);
}
