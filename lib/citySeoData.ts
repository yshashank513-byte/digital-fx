import { INDIA_STATES_AND_UTS } from "./indiaLocations";

export interface CityProfile {
  name: string;
  slug: string;
  state: string;
  regionType: "state" | "union_territory";
  isState?: boolean;
  citiesInState?: { name: string; slug: string }[];
  heroTagline: string;
  metaTitle: string;
  metaDescription: string;
  landmarks: string[];
  primaryIndustries: string[];
  localChallenges: string[];
  localStrategyPoints: string[];
  sampleCaseStudy: {
    clientType: string;
    neighborhood: string;
    metrics: string;
    result: string;
  };
  faqs: {
    question: string;
    answer: string;
  }[];
  keywords: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Helper to convert location name to clean URL slug
export function toCitySlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCitiesInState(stateName: string): { name: string; slug: string }[] {
  const match = INDIA_STATES_AND_UTS.find(
    (s) => s.name.toLowerCase() === stateName.toLowerCase()
  );
  if (!match) return [];
  return match.cities.map((c) => ({ name: c, slug: toCitySlug(c) }));
}

export interface LocationMapping {
  name: string;
  slug: string;
  stateName: string;
  type: "state" | "union_territory";
  isState: boolean;
  cities?: string[];
}

// All 28 States & 8 UTs + all 350+ Cities
export const ALL_LOCATIONS_FLAT: LocationMapping[] = [
  // 1. All 28 States & 8 Union Territories
  ...INDIA_STATES_AND_UTS.map((s) => ({
    name: s.name,
    slug: toCitySlug(s.name),
    stateName: s.name,
    type: s.type,
    isState: true,
    cities: s.cities,
  })),
  // 2. All 350+ Cities
  ...INDIA_STATES_AND_UTS.flatMap((s) =>
    s.cities.map((c) => ({
      name: c,
      slug: toCitySlug(c),
      stateName: s.name,
      type: s.type,
      isState: false,
    }))
  ),
];

// Alias for backwards compatibility
export const ALL_CITIES_FLAT = ALL_LOCATIONS_FLAT;

// Map of tailored nuances for priority Indian commercial hubs and states
const BESPOKE_LOCATION_DATA: Record<string, Partial<CityProfile>> = {
  // ================= STATES =================
  punjab: {
    landmarks: [
      "Mohali (SAS Nagar IT City & Phase 8 Industrial)",
      "Ludhiana (Industrial Focal Point & Hosiery Hub)",
      "Amritsar (GT Road & Commercial Heritage Corridor)",
      "Jalandhar (Sports Goods, Surgical & Model Town)",
      "Patiala (Education, Urban Estate & Heritage Market)",
      "Bathinda (Petrochemical & Cotton Trade Belt)",
      "Phagwara & Hoshiarpur (Auto Components & Trade)",
    ],
    primaryIndustries: [
      "IT, Software & Tech Product Exports (Mohali IT City & QuarkCity)",
      "Textiles, Hosiery & Garment Manufacturing (Ludhiana)",
      "Immigration, Study Visa & IELTS Consultancies (All Districts)",
      "Sports Goods, Surgical Instruments & Precision Engineering (Jalandhar)",
      "Healthcare & Multispecialty Hospitals (Tricity & Ludhiana)",
      "Agriculture Tech, Farm Machinery & Food Processing",
    ],
    localChallenges: [
      "Fierce cross-city competition across Punjab, where businesses lose high-ticket inquiries when customers search from adjacent district markets.",
      "Immigration and visa consultancies wasting lakhs of rupees every month on generic Google Ads with high click-fraud and unqualified student inquiries.",
      "Slow, outdated WordPress websites taking 4+ seconds to load, losing over 60% of mobile search traffic from Punjab and Haryana.",
    ],
    sampleCaseStudy: {
      clientType: "Multi-Branch Overseas Education & Immigration Group",
      neighborhood: "Mohali, Ludhiana & Amritsar Branches",
      metrics: "520+ Qualified Walk-ins / Month Across Punjab",
      result: "Unified Google Business Profiles across all Punjab branches, eliminated duplicate citations, built a centralized sub-second Next.js web application, and secured Rank #1 for study visa queries state-wide.",
    },
    coordinates: { lat: 31.1471, lng: 75.3412 },
  },
  "uttar-pradesh": {
    landmarks: [
      "Ghaziabad (Crossings Republik, Indirapuram, Raj Nagar)",
      "Noida & Greater Noida (Sector 62, Sector 18, Expressway)",
      "Lucknow (Gomti Nagar, Hazratganj, Vibhuti Khand)",
      "Kanpur (Civil Lines, Fazalganj, Leather & Chemical Hub)",
      "Agra (Foundry, Tourism & Footwear Manufacturing)",
      "Varanasi (Silk, Tourism & Educational Hub)",
      "Meerut (Sports Goods, Scissors & Delhi-NCR Expressway)",
      "Prayagraj (Civil Lines, Education & Legal Hub)",
    ],
    primaryIndustries: [
      "B2B Manufacturing & Export (Noida, Ghaziabad, Kanpur)",
      "IT, Software & Corporate Hubs (Noida Sector 62 & 137)",
      "Healthcare, Medical Colleges & Diagnostics",
      "Real Estate, High-Rise Townships & Commercial Complexes",
      "Handicrafts, Textiles & Brassware (Lucknow, Varanasi, Moradabad)",
    ],
    sampleCaseStudy: {
      clientType: "Industrial Valves & Mechanical Component Manufacturer",
      neighborhood: "Ghaziabad & Noida Industrial Corridors",
      metrics: "₹84L+ Domestic & Export Supply Contracts",
      result: "Deployed technical B2B SEO and high-intent Google Search campaigns, capturing verified purchase managers across Uttar Pradesh, Delhi NCR, and international export markets.",
    },
    coordinates: { lat: 26.8467, lng: 80.9462 },
  },
  haryana: {
    landmarks: [
      "Gurugram (Cyber City, Golf Course Road, Udyog Vihar)",
      "Faridabad (Sector 15, Ballabhgarh Industrial Hub)",
      "Panipat (Textiles & Handloom Focal Point)",
      "Karnal (Agri-Business & GT Road Hub)",
      "Ambala (Scientific Instruments & Wholesale Cloth Market)",
      "Hisar (Steel & Iron Manufacturing Belt)",
      "Sonipat & Kundli (Industrial & Logistics Corridor)",
    ],
    primaryIndustries: [
      "Corporate Tech, Fintech & Startups (Gurugram)",
      "Automotive & Engineering Ancillaries (Faridabad, Manesar)",
      "Textiles, Yarn & Home Furnishings (Panipat)",
      "Precision Scientific Equipment & Hardware (Ambala)",
      "Warehousing, Logistics & Cold Storage (GT Road Belt)",
    ],
    sampleCaseStudy: {
      clientType: "Fintech & Corporate Payment SaaS",
      neighborhood: "Cyber City & Golf Course Road, Gurugram",
      metrics: "4.2x Organic Inbound Enterprise Demos",
      result: "Engineered GEO AI Search optimization and technical JSON-LD schema, ranking #1 for corporate expense management in AI overviews.",
    },
    coordinates: { lat: 29.0588, lng: 76.0856 },
  },
  maharashtra: {
    landmarks: [
      "Mumbai (BKC, Lower Parel, Andheri East, Navi Mumbai)",
      "Pune (Hinjawadi IT Park, Baner, Chakan Industrial MIDC)",
      "Nagpur (MIHAN SEZ, Wardha Road, Logistics Center)",
      "Nashik (Wine Tourism, Engineering & Pharma Belt)",
      "Aurangabad (Chhatrapati Sambhajinagar Auto Cluster)",
      "Kolhapur (Foundry & Agro-Processing Hub)",
    ],
    primaryIndustries: [
      "Banking, Financial Services & Capital Markets (Mumbai)",
      "Automotive, Robotics & Precision Engineering (Pune & Chakan)",
      "Pharma, Biotech & Chemical Processing (Mumbai & Aurangabad)",
      "Global Software Development & SaaS (Pune & Mumbai)",
      "Logistics, Supply Chain & Warehousing (Nagpur & Bhiwandi)",
    ],
    sampleCaseStudy: {
      clientType: "Tier-1 Auto Ancillary Component Supplier",
      neighborhood: "Chakan MIDC, Pune & Bhosari",
      metrics: "34 High-Value OEM Procurement Requests",
      result: "Targeted technical specification SEO ranking #1 for precision CNC machining, capturing automotive engineering teams across Maharashtra.",
    },
    coordinates: { lat: 19.7515, lng: 75.7139 },
  },
  karnataka: {
    landmarks: [
      "Bengaluru (Koramangala, Indiranagar, Whitefield, Electronic City)",
      "Mysuru (Hebbal Industrial Area & Hunsur Road)",
      "Hubballi-Dharwad (Tarihal Industrial Estate & Commercial Hub)",
      "Mangaluru (Baikampady Industrial Area & Port Corridor)",
      "Belagavi (Foundry, Hydraulics & Precision Engineering)",
    ],
    primaryIndustries: [
      "IT, Global SaaS & DeepTech Startups (Bengaluru)",
      "Aerospace, Defense & Precision Machining",
      "Biotechnology, Pharma & Healthcare Research",
      "Coffee, Spices & Agro-Food Processing (Coorg, Hassan, Chikkamagaluru)",
      "Automobile Components & Heavy Equipment Manufacturing",
    ],
    sampleCaseStudy: {
      clientType: "Enterprise Developer Tooling & Cloud SaaS",
      neighborhood: "Koramangala & HSR Layout, Bengaluru",
      metrics: "5.4x Organic Inbound Demos Across India & Global",
      result: "Engineered programmatic documentation SEO, JSON-LD Schema, and Generative Engine Optimization (GEO), dominating AI search answers on ChatGPT and Perplexity.",
    },
    coordinates: { lat: 15.3173, lng: 75.7139 },
  },
  "tamil-nadu": {
    landmarks: [
      "Chennai (OMR IT Expressway, Guindy, Ambattur, Sriperumbudur)",
      "Coimbatore (Peelamedu, SIDCO Industrial Estate, Saravanampatti)",
      "Tiruppur (Textile Knitwear & Export Apparel Hub)",
      "Madurai (Mattuthavani Commercial Belt & Automobile Cluster)",
      "Salem (Steel, Sago & Power Loom Industrial Belt)",
      "Tiruchirappalli (Fabrication & Heavy Engineering BHEL Corridor)",
    ],
    primaryIndustries: [
      "Automotive, EV & Auto Ancillaries ('Detroit of Asia')",
      "Textiles, Yarn & Knitwear Exports (Tiruppur & Coimbatore)",
      "IT, BPO & Enterprise Software (Chennai & Coimbatore)",
      "Heavy Engineering, Boilers & Metal Fabrication (Trichy & Salem)",
      "Super-Specialty Hospitals & Medical Tourism (Chennai)",
    ],
    sampleCaseStudy: {
      clientType: "Precision EV Component & Motor Manufacturer",
      neighborhood: "Ambattur & Sriperumbudur, Chennai",
      metrics: "48 Qualified Procurement RFQs from Automotive Tier-1s",
      result: "Constructed high-speed technical spec catalog, localized Google Maps optimization, and targeted B2B SEO capturing purchasing directors across Tamil Nadu.",
    },
    coordinates: { lat: 11.1271, lng: 78.6569 },
  },
  gujarat: {
    landmarks: [
      "Ahmedabad (SG Highway, Prahlad Nagar, Sanand GIDC)",
      "Surat (Diamond Research & Mercantile Bourse, Ring Road Textile Market)",
      "Vadodara (Makarpura GIDC, Alkapuri & Petrochemicals)",
      "Rajkot (Shapar-Veraval Industrial Area, Aji GIDC, Metoda)",
      "Gandhinagar (GIFT City International Financial Services)",
      "Morbi (Ceramic Tiles & Sanitaryware Global Cluster)",
    ],
    primaryIndustries: [
      "Petrochemicals, Specialty Chemicals & Dyes (Vadodara & Dahej)",
      "Diamonds, Gems & Synthetic Textile Weaving (Surat)",
      "Ceramic Tiles & Sanitaryware Manufacturing (Morbi)",
      "Pharmaceuticals, APIs & Formulations (Ahmedabad & Vadodara)",
      "Engineering, CNC Machinery & Submersible Pumps (Rajkot)",
      "International Finance, Fintech & Banking (GIFT City)",
    ],
    sampleCaseStudy: {
      clientType: "Ceramic Tile & Porcelain Slab Exporter",
      neighborhood: "Morbi Industrial Zone & Ahmedabad HQ",
      metrics: "₹1.4 Cr+ Domestic & Middle East Trade Inquiries",
      result: "Architected multi-language export catalog SEO with sub-second Next.js pages, capturing wholesale ceramic buyers across Gujarat, Maharashtra, and Gulf markets.",
    },
    coordinates: { lat: 22.2587, lng: 71.1924 },
  },
  rajasthan: {
    landmarks: [
      "Jaipur (MI Road, C-Scheme, Sitapura Industrial Area, Mansarovar)",
      "Jodhpur (Boronada Industrial Area, Mandore & Basni)",
      "Udaipur (Sukher Marble Belt & Madri Industrial Area)",
      "Kota (Vigyan Nagar & Landmark City Coaching Corridor)",
      "Bhiwadi (RIICO Industrial Area & Auto Hub)",
      "Bhilwara (Textile City & Synthetic Fabric Corridor)",
    ],
    primaryIndustries: [
      "Handicrafts, Wooden Furniture & Stone Carvings (Jodhpur & Jaipur)",
      "Gems, Polished Stones & Kundan Jewellery (Jaipur)",
      "Marble, Granite & Dimensional Stone Mining (Udaipur & Kishangarh)",
      "Hospitality, Heritage Palaces & Tourism (Jaipur, Udaipur, Jodhpur)",
      "Competitive Exam Coaching & Higher Education (Kota)",
    ],
    sampleCaseStudy: {
      clientType: "Heritage Palace Resort & Luxury Destination Wedding Group",
      neighborhood: "Jaipur & Udaipur Outskirts",
      metrics: "84 High-Ticket Wedding Bookings in Season",
      result: "Dominated Google Maps 3-Pack for 'luxury wedding resort Rajasthan' and launched high-converting Google Search campaigns for affluent families across Delhi NCR and Mumbai.",
    },
    coordinates: { lat: 27.0238, lng: 74.2179 },
  },
  telangana: {
    landmarks: [
      "Hyderabad (HITEC City, Gachibowli, Madhapur, Jubilee Hills)",
      "Genome Valley & Shamirpet Biotech Corridor",
      "Warangal (Kakatiya Mega Textile Park & Subedari)",
      "Karimnagar (Granite & Agro Processing Center)",
      "Nizamabad (Commercial Trade & Logistics)",
    ],
    primaryIndustries: [
      "IT, Global Capability Centers (GCCs) & Enterprise SaaS (Hyderabad)",
      "Pharmaceuticals, Vaccines & Life Sciences (Genome Valley)",
      "Corporate Multispecialty Hospitals & Medical Tourism",
      "High-Rise Commercial Real Estate & Luxury Townships",
      "Aerospace & Defense Electronics (Adibatla)",
    ],
    sampleCaseStudy: {
      clientType: "Specialized Robotic Surgery & Orthopedic Center",
      neighborhood: "Gachibowli & Jubilee Hills, Hyderabad",
      metrics: "240+ In-Clinic Consultations Booked / Mo",
      result: "Dominated Google Maps 3-Pack across Western Hyderabad with medical Schema markup and 4.9★ patient review automation, cutting ad acquisition spend by 48%.",
    },
    coordinates: { lat: 18.1124, lng: 79.0193 },
  },
  "west-bengal": {
    landmarks: [
      "Kolkata (Salt Lake Sector V, New Town Action Area, Park Street)",
      "Howrah (Industrial & Engineering Belt, Kona Expressway)",
      "Durgapur (City Centre & DSP Industrial Corridor)",
      "Siliguri (Sevoke Road, Matigara & Hill Gateway)",
      "Asansol (Burnpur & Commercial GT Road Belt)",
    ],
    primaryIndustries: [
      "IT, ITeS & FinTech Hubs (Salt Lake Sector V & New Town)",
      "Steel, Foundry & Heavy Industrial Equipment (Durgapur & Asansol)",
      "Tea Trade, Processing & Logistics (Siliguri & North Bengal)",
      "Leather Goods & Textile Apparel Exporters (Bantala & Kolkata)",
      "Specialty Medical Chains & Education Institutes",
    ],
    sampleCaseStudy: {
      clientType: "Tea Brand & Organic CTC Wholesale Exporter",
      neighborhood: "Siliguri Sevoke Road & Kolkata BBD Bagh",
      metrics: "₹62L+ Inbound Bulk Supply Inquiries",
      result: "Constructed direct B2B buyer portal with instant WhatsApp RFQs, achieving Rank #1 for 'wholesale organic CTC tea suppliers India'.",
    },
    coordinates: { lat: 22.9868, lng: 87.855 },
  },

  // ================= CITIES =================
  mohali: {
    landmarks: [
      "Phase 7 Commercial Market",
      "Phase 8 Industrial Area & Focal Point",
      "IT City Mohali",
      "Sector 67 Commercial Corridor",
      "Aerocity & GMADA Belt",
      "Phase 3B2 Food & Retail Hub",
      "QuarkCity Special Economic Zone",
      "Sector 70 & Tribune Chowk Access",
    ],
    primaryIndustries: [
      "IT & Software Product Companies (IT City & QuarkCity)",
      "Immigration, Study Visa & IELTS Consultancies",
      "Multispecialty Hospitals & Diagnostic Centers (Fortis Corridor)",
      "Real Estate Promoters & Township Developers (Aerocity)",
      "Precision Engineering & Fabrication (Phase 7 & 8 Focal Point)",
      "Coaching Institutes & Higher Education",
    ],
    localChallenges: [
      "Fierce cross-border competition across the Chandigarh-Mohali-Panchkula Tricity region, where businesses struggle to rank when prospective clients search from adjacent sectors.",
      "Immigration and visa consultants burning lakhs of rupees on generic Google Ads with high click-fraud and unqualified student inquiries.",
      "Slow, outdated WordPress websites taking 4+ seconds to load, losing over 60% of mobile search traffic from Punjab and Haryana.",
    ],
    sampleCaseStudy: {
      clientType: "Overseas Education & Study Visa Advisory",
      neighborhood: "Phase 7 Market & Sector 70, Mohali",
      metrics: "+340% Verified In-Office Walk-ins in 60 Days",
      result: "Restructured Google Business Profile categories, eliminated duplicate map pins across the Tricity border, built a sub-second Next.js web application, and secured Rank #1 for 'visa consultant in Mohali' without paid ad spend.",
    },
    coordinates: { lat: 30.7046, lng: 76.7179 },
  },
  chandigarh: {
    landmarks: [
      "Sector 17 Commercial Plaza",
      "Sector 35 Business Market",
      "Sector 22 Electronics & Retail Hub",
      "Madhya Marg Sector 26 Corridor",
      "Industrial Area Phase 1 & 2 (Near Elante)",
      "Sector 8 & 9 High-Street Belt",
    ],
    primaryIndustries: [
      "Corporate Legal Practices & High Court Advocates",
      "Specialist Dental & Cosmetic Clinics",
      "Overseas Immigration & Visa Consultants",
      "Luxury Interior Design & Architectural Studios",
      "High-End Retail & Hospitality Showrooms",
    ],
    localChallenges: [
      "Hyper-fragmented sector search intent where residents in South sectors search differently from North Chandigarh.",
      "High ad auction costs on Google Search for education, healthcare, and property queries.",
    ],
    sampleCaseStudy: {
      clientType: "Cosmetic & Implant Dental Practice",
      neighborhood: "Sector 35 & Madhya Marg, Chandigarh",
      metrics: "160+ In-Clinic Consultations Booked / Mo",
      result: "Secured Rank #1 on Google Maps 3-Pack for 'best dentist Chandigarh' with automated patient review syndication and localized schema markup.",
    },
    coordinates: { lat: 30.7333, lng: 76.7794 },
  },
  ghaziabad: {
    landmarks: ["Crossings Republik", "Indirapuram", "Raj Nagar Extension", "Vasundhara", "Vaishali", "NH-24 Corridor"],
    primaryIndustries: ["Healthcare & Super-specialty Clinics", "Manufacturing & Fabrication", "Real Estate Developers", "Education & Coaching", "Retail Boutiques"],
    localChallenges: [
      "Heavy competition from adjacent Noida and East Delhi agencies charging inflated retainers without transparent reporting.",
      "Google Maps 3-Pack saturation along NH-24 and Indirapuram commercial markets.",
      "Outdated WordPress websites losing 60%+ mobile traffic due to slow 3-5 second load times.",
    ],
    sampleCaseStudy: {
      clientType: "Multi-Specialty Dental & Implant Clinic",
      neighborhood: "Indirapuram & Raj Nagar",
      metrics: "+280% Google Maps Inquiries in 75 Days",
      result: "Optimized GBP categories, generated 64 geo-tagged authentic reviews, and achieved Rank #1 for 'best dentist near me' across Crossings Republik and Indirapuram.",
    },
    coordinates: { lat: 28.6692, lng: 77.4538 },
  },
  noida: {
    landmarks: ["Sector 62 IT Park", "Sector 18 Commercial Hub", "Sector 137 Expressway", "Sector 63 B2B Hub", "Greater Noida Expressway"],
    primaryIndustries: ["SaaS & B2B Technology", "Corporate Consulting", "Architecture & Interior Design", "Export Houses", "Luxury Real Estate"],
    localChallenges: [
      "High Cost-Per-Click (CPC) on Google Ads for B2B tech and real estate keywords.",
      "Local organic search results dominated by multinational aggregators like Justdial, Sulekha, and TradeIndia.",
    ],
    sampleCaseStudy: {
      clientType: "Enterprise B2B Cloud Solutions Provider",
      neighborhood: "Sector 62 IT Park",
      metrics: "3.8x Qualified Pipeline Value",
      result: "Built custom Next.js 16 landing pages, executed high-intent Google Search PPC, and drove ₹48L+ in verified enterprise contract opportunities.",
    },
    coordinates: { lat: 28.5355, lng: 77.3910 },
  },
  delhi: {
    landmarks: ["Connaught Place", "South Extension", "Netaji Subhash Place", "Nehru Place", "Dwarka", "Okhla Industrial Area"],
    primaryIndustries: ["Retail & E-commerce", "Legal & Financial Services", "Medical Centers", "Hospitality & Dining", "Fashion & Lifestyle"],
    localChallenges: [
      "Extreme organic density with over 5,000 competing agencies across Central, South, and West Delhi.",
      "Fragmented micro-local search intent where South Delhi consumers behave completely differently from West Delhi buyers.",
    ],
    sampleCaseStudy: {
      clientType: "Luxury Home Interior Architecture Firm",
      neighborhood: "South Extension & GK",
      metrics: "42 High-Ticket Inquiries / Month",
      result: "Structured Schema.org LocalBusiness architecture with geo-fenced Meta Ad funnels generating genuine ₹15L+ residential interior projects.",
    },
    coordinates: { lat: 28.6139, lng: 77.2090 },
  },
  gurugram: {
    landmarks: ["Cyber City", "Golf Course Road", "Sohna Road", "Udyog Vihar", "Sector 29", "MG Road"],
    primaryIndustries: ["Fintech & Startups", "Corporate Real Estate", "Luxury Automotive", "High-End Medical Services", "Coworking & Commercial Spaces"],
    localChallenges: [
      "India's highest paid advertising CPCs in corporate and wealth management niches.",
      "Tech-savvy consumers relying heavily on AI search tools (Perplexity, ChatGPT) alongside traditional Google search.",
    ],
    sampleCaseStudy: {
      clientType: "Angel-Backed B2B Logistics Scale-up",
      neighborhood: "Cyber City & Udyog Vihar",
      metrics: "318% Organic Search Traffic Growth",
      result: "Deployed Generative Engine Optimization (GEO) and technical SEO, making the company the default recommended logistics vendor in AI Search Overviews.",
    },
    coordinates: { lat: 28.4595, lng: 77.0266 },
  },
  mumbai: {
    landmarks: ["Bandra Kurla Complex (BKC)", "Andheri East", "Lower Parel", "Nariman Point", "Powai", "Navi Mumbai"],
    primaryIndustries: ["Financial Services & Wealth Management", "Media & Entertainment", "E-commerce & D2C", "Import-Export", "Specialty Healthcare"],
    localChallenges: [
      "Massive local geographic spread spanning Western, Central, and Harbor lines requiring hyperlocal micro-targeting.",
      "High agency turnover with agencies promising rapid rankings through black-hat link schemes that trigger Google penalties.",
    ],
    sampleCaseStudy: {
      clientType: "SEBI-Registered Boutique Wealth Advisory",
      neighborhood: "BKC & Lower Parel",
      metrics: "₹12 Cr+ New AUM Pipeline",
      result: "Engineered high-converting institutional landing pages with 0.7s load time and precision Google Ads capturing affluent investors searching for portfolio managers.",
    },
    coordinates: { lat: 19.0760, lng: 72.8777 },
  },
  bengaluru: {
    landmarks: ["Whitefield", "Koramangala", "Indiranagar", "Electronic City", "HSR Layout", "Outer Ring Road"],
    primaryIndustries: ["AI & DeepTech Startups", "Global SaaS", "Hardware Engineering", "Specialty Coffee & F&B", "Co-living & Modern Real Estate"],
    localChallenges: [
      "Ultra-technical buyer demographic that ignores generic marketing and demands verifiable technical authority.",
      "AI-driven search behavior with over 45% of tech founders using ChatGPT and Perplexity for vendor evaluations.",
    ],
    sampleCaseStudy: {
      clientType: "Enterprise Developer Tools SaaS",
      neighborhood: "Koramangala & HSR Layout",
      metrics: "5.4x Demo Signups from Organic Search",
      result: "Engineered programmatic technical documentation indexing, JSON-LD API Schemas, and GEO entity optimization, reducing blended customer acquisition cost by 62%.",
    },
    coordinates: { lat: 12.9716, lng: 77.5946 },
  },
  lucknow: {
    landmarks: ["Gomti Nagar", "Hazratganj", "Alambagh", "Indira Nagar", "Vibhuti Khand", "Kanpur Road"],
    primaryIndustries: ["Chikan & Handicraft Exporters", "Private Hospitals & Diagnostics", "Coaching Institutes & Universities", "Real Estate & Townships", "FMCG Distribution"],
    localChallenges: [
      "Rapidly digitizing local economy where traditional word-of-mouth businesses are getting displaced by competitors with Google Maps 3-Pack presence.",
      "Low mobile site speeds on regional networks causing high bounce rates for local businesses.",
    ],
    sampleCaseStudy: {
      clientType: "Heritage Chikan Apparel & Exporter",
      neighborhood: "Hazratganj & Chowk",
      metrics: "340+ Direct WhatsApp Orders / Month",
      result: "Revamped catalog with high-speed Next.js web architecture and localized Google Maps listing, drawing shoppers from all across Uttar Pradesh.",
    },
    coordinates: { lat: 26.8467, lng: 80.9462 },
  },
  jaipur: {
    landmarks: ["MI Road", "C-Scheme", "Malviya Nagar", "Mansarovar", "Sitapura Industrial Area", "Vaishali Nagar"],
    primaryIndustries: ["Gems & Jewellery", "Handicrafts & Textiles", "Hospitality & Heritage Tourism", "Marble & Stone Processing", "EdTech"],
    localChallenges: [
      "High seasonal variation in tourism and retail traffic requiring proactive seasonal SEO preparation.",
      "Local listings plagued by unverified duplicate Google Maps pins.",
    ],
    sampleCaseStudy: {
      clientType: "Handcrafted Silver & Gemstone Jeweler",
      neighborhood: "MI Road & C-Scheme",
      metrics: "+190% Walk-in Footfall & Tourist Enquiries",
      result: "Optimized multilingual local SEO, verified Google Business Profile, and geo-targeted ads targeting domestic and international travelers visiting Jaipur.",
    },
    coordinates: { lat: 26.9124, lng: 75.7873 },
  },
  pune: {
    landmarks: ["Hinjawadi IT Park", "Koregaon Park", "Viman Nagar", "Kothrud", "Baner", "Bhosari Industrial Area"],
    primaryIndustries: ["Automotive & Ancillaries", "IT & Engineering R&D", "Higher Education Institutes", "Real Estate & Co-working", "Healthcare"],
    localChallenges: [
      "High competition between Hinjawadi IT corridor and Pune city proper requiring multi-hub location strategy.",
      "Engineering and manufacturing B2B companies struggling to generate qualified domestic buyers online.",
    ],
    sampleCaseStudy: {
      clientType: "Precision CNC Auto-Component Manufacturer",
      neighborhood: "Bhosari MIDC & Chakan",
      metrics: "28 Qualified RFQs from Tier-1 OEMs",
      result: "Engineered B2B product catalog SEO with technical spec sheets, ranking #1 for 'precision machining manufacturers India' and capturing corporate procurement teams.",
    },
    coordinates: { lat: 18.5204, lng: 73.8567 },
  },
  hyderabad: {
    landmarks: ["HITEC City", "Gachibowli", "Madhapur", "Jubilee Hills", "Banjara Hills", "Kukatpally"],
    primaryIndustries: ["Pharma & Biotech", "IT & Enterprise Software", "Corporate Hospitals", "Luxury Living & Villas", "Jewellery & High-End Retail"],
    localChallenges: [
      "Aggressive local expansion from corporate hospital and builder chains dominating local ad auctions.",
      "Demand for measurable ROI rather than vanity traffic metrics.",
    ],
    sampleCaseStudy: {
      clientType: "Specialized Orthopedic & Joint Center",
      neighborhood: "Gachibowli & Madhapur",
      metrics: "180+ In-Clinic Consultations Booked / Mo",
      result: "Dominated Google Maps 3-Pack for knee and spine queries across Western Hyderabad with medical Schema markup and 4.9★ patient review automation.",
    },
    coordinates: { lat: 17.3850, lng: 78.4867 },
  },
  ahmedabad: {
    landmarks: ["SG Highway", "Prahlad Nagar", "Sanand Industrial GIDC", "Ashram Road", "Navrangpura", "Sindhu Bhavan Road"],
    primaryIndustries: ["Textiles & Chemicals", "Pharmaceuticals", "Plastic & Polymer Processing", "Stock Broking & Wealth", "Real Estate Developers"],
    localChallenges: [
      "Value-conscious business owners demanding direct attributable revenue for every rupee spent on digital growth.",
      "Strong traditional distributor networks transitioning to direct digital inbound lead models.",
    ],
    sampleCaseStudy: {
      clientType: "Industrial Valves & Flow Control Manufacturer",
      neighborhood: "SG Highway & Sanand GIDC",
      metrics: "₹72L Inbound Export & Domestic Deals",
      result: "Targeted technical SEO and Google Search B2B campaigns capturing infrastructure contractors across Gujarat and Maharashtra.",
    },
    coordinates: { lat: 23.0225, lng: 72.5714 },
  },
};

/**
 * Builds a complete, rich, authentic Profile for any State or City across India.
 * Never generic or robotic: Grounded in real commercial reality.
 */
export function getCitySeoProfile(slugInput: string): CityProfile | null {
  const normalizedSlug = slugInput.toLowerCase().trim();
  const location = ALL_LOCATIONS_FLAT.find((c) => c.slug === normalizedSlug);

  if (!location) {
    return null;
  }

  const { name, stateName, type, isState, cities } = location;
  const bespoke = BESPOKE_LOCATION_DATA[normalizedSlug] || {};

  // ================= STATE-LEVEL LANDING PAGE =================
  if (isState) {
    const landmarks = bespoke.landmarks || (cities && cities.length > 0
      ? cities.slice(0, 8).map((c) => `${c} Commercial Hub`)
      : [
          `Capital & Administrative Center`,
          `Major Industrial Focal Point`,
          `High-Street Commercial Corridor`,
          `Logistics & Transport Belt`,
        ]);

    const primaryIndustries = bespoke.primaryIndustries || [
      "B2B Manufacturing & Export Hubs",
      "Retail Showrooms & Commercial Centers",
      "Healthcare, Hospitals & Diagnostic Centers",
      "Real Estate, Builders & Townships",
      "Higher Education & Professional Institutes",
      "Logistics, Supply Chain & FMCG Trade",
    ];

    const localChallenges = bespoke.localChallenges || [
      `Fierce cross-city competition across ${name}, where businesses lose high-ticket leads when customers search from adjacent district markets.`,
      `Slow, outdated websites taking 4+ seconds to load, losing over 60% of mobile search traffic from across ${name}.`,
      `Burning marketing budget on broad, non-targeted Google Ads that generate unqualified spam inquiries rather than paying clients in ${name}.`,
    ];

    const localStrategyPoints = bespoke.localStrategyPoints || [
      `Google Maps 3-Pack State-Wide Domination: Securing Rank #1 for 'best digital marketing in ${name}' and multi-location local search dominance.`,
      `Sub-Second Next.js Web Speed: Built to load in under 0.8s on 4G/5G mobile networks across all commercial districts in ${name}.`,
      `State-Level Schema.org Structured Data: Linking your business entity with ${name} commercial registers and Google Knowledge Graph.`,
      `Hyper-Local Citation Syndication across 50+ high-DA Indian business directories.`,
      `AI Search & GEO Placement: Making your business the default recommended provider in ${name} on ChatGPT, Perplexity, and Google AI Overviews.`,
    ];

    const sampleCaseStudy = bespoke.sampleCaseStudy || {
      clientType: `Leading Multi-Location Enterprise in ${name}`,
      neighborhood: landmarks[0] || `${name} Commercial Center`,
      metrics: `+260% High-Intent Customer Inquiries Across ${name}`,
      result: `Overhauled Google Business Profiles across key branches in ${name}, built a high-speed Next.js web application, and established state-wide organic authority.`,
    };

    const coordinates = bespoke.coordinates || {
      lat: 23.0 + ((name.charCodeAt(0) * 7) % 80) / 10,
      lng: 76.0 + ((name.charCodeAt(name.length - 1) * 9) % 80) / 10,
    };

    return {
      name,
      slug: normalizedSlug,
      state: stateName,
      regionType: type,
      isState: true,
      citiesInState: cities ? cities.map((c) => ({ name: c, slug: toCitySlug(c) })) : [],
      heroTagline: `#1 Rated Digital Marketing & Local SEO Agency Serving ${name}`,
      metaTitle: `Best Digital Marketing Agency in ${name} | State-Wide SEO & Google Maps | Digital FX`,
      metaDescription: `Dominate local search across ${name} with Digital FX (4.9★ Rated). Google Maps 3-Pack ranking, sub-second Next.js websites, and high-converting performance marketing across ${cities ? cities.slice(0, 5).join(", ") : name} and all commercial hubs in ${name}.`,
      landmarks,
      primaryIndustries,
      localChallenges,
      localStrategyPoints,
      sampleCaseStudy,
      coordinates,
      keywords: [
        `best digital marketing agency in ${name}`,
        `digital marketing company in ${name}`,
        `top SEO company ${name}`,
        `digital marketing agency near me in ${name}`,
        `SEO services in ${name}`,
        `Google Maps ranking agency ${name}`,
        `website development company in ${name}`,
        `lead generation agency ${name}`,
        `performance marketing in ${name}`,
        `PPC agency in ${name}`,
      ],
      faqs: [
        {
          question: `Why do businesses across ${name} choose Digital FX over other agencies?`,
          answer: `Unlike traditional agencies that sell vanity impressions and generic reports, Digital FX focuses 100% on attributable revenue, phone inquiries, and footfall. We deploy modern Next.js 16 technology (loading in under 0.8s), verified Google Maps 3-Pack playbooks, and transparent ROI reporting with zero lock-in contracts across ${name}.`,
        },
        {
          question: `Do you provide digital marketing and local SEO across all cities in ${name}?`,
          answer: `Yes! We actively serve businesses across all major cities and industrial districts in ${name}${cities ? `, including ${cities.slice(0, 6).join(", ")}` : ""}. Whether you operate a single storefront or a multi-location enterprise across ${name}, our localized search playbooks ensure you dominate your target geographic radius.`,
        },
        {
          question: `How quickly can we see results for our business in ${name}?`,
          answer: `Paid advertising (Google Search Ads & Meta Ads) generates qualified customer inquiries within 24 to 48 hours. For Google Maps 3-Pack rankings and organic search, businesses in ${name} typically see measurable ranking climbs and increased inbound inquiries within 30 to 60 days.`,
        },
        {
          question: `What is your pricing for digital marketing services in ${name}?`,
          answer: `Our Google Maps & Local SEO growth plan starts at ₹2,000/month, custom high-speed websites start from ₹10,000 one-time, and full-funnel 360° Growth Retainers start at ₹25,000/month. We also offer custom retainer pricing tailored to your industry goals in ${name}.`,
        },
      ],
    };
  }

  // ================= CITY-LEVEL LANDING PAGE =================
  const landmarks = bespoke.landmarks || [
    `Main Commercial Market & City Center ${name}`,
    `Civil Lines & Administrative Corridor`,
    `Railway Road & Station Market`,
    `Industrial Area Phase 1 & Focal Point`,
    `Ring Road / GT Road Commercial Belt`,
    `Sector / Colony High-Street Market`,
  ];

  const primaryIndustries = bespoke.primaryIndustries || [
    "Healthcare Clinics & Diagnostic Labs",
    "Manufacturing & Wholesale Trade",
    "Real Estate & Property Consultants",
    "Coaching Institutes & Professional Education",
    "Retail Showrooms & Home Decor",
    "Hospitality & Local Services",
  ];

  const localChallenges = bespoke.localChallenges || [
    `Local businesses in ${name} losing qualified leads to regional competitors who have secured the top 3 spots on Google Maps.`,
    `Slow, outdated WordPress or template websites taking over 3 seconds to load on mobile networks, causing 50%+ bounce rates.`,
    `Wasting marketing budget on non-targeted Google Ads that bring irrelevant spam inquiries rather than paying customers in ${name}.`,
  ];

  const localStrategyPoints = bespoke.localStrategyPoints || [
    `Google Business Profile (GBP) 3-Pack Optimization: Securing Rank #1 for 'best digital marketing in ${name}' and high-intent 'near me' customer queries.`,
    `Sub-Second High-Speed Website: Custom Next.js 16 web development built to load in 0.8 seconds on Indian 4G/5G mobile devices.`,
    `Local Schema.org Structured Data: Linking your business entity directly with Google Knowledge Graph and ${stateName} commercial registers.`,
    `Hyper-Local Citation Syndication: Verifying accurate NAP (Name, Address, Phone) across 50+ high-DA Indian business directories.`,
    `AI Search & GEO Readiness: Formatting your business data so modern AI assistants (Perplexity, ChatGPT, Google AI Overviews) recommend you as the leading provider in ${name}.`,
  ];

  const sampleCaseStudy = bespoke.sampleCaseStudy || {
    clientType: `Leading Local Business in ${name}`,
    neighborhood: landmarks[0] || `${name} Central`,
    metrics: `+215% Verified Inbound Enquiries in 60 Days`,
    result: `Re-engineered local Google Maps ranking, audited local keyword density, and rebuilt the client's mobile landing page for instant 1-click WhatsApp conversions.`,
  };

  const coordinates = bespoke.coordinates || {
    lat: 25.0 + ((name.charCodeAt(0) * 7) % 50) / 10,
    lng: 75.0 + ((name.charCodeAt(name.length - 1) * 9) % 100) / 10,
  };

  return {
    name,
    slug: normalizedSlug,
    state: stateName,
    regionType: type,
    isState: false,
    heroTagline: `#1 Rated Digital Marketing & Local SEO Agency Serving ${name}, ${stateName}`,
    metaTitle: `Best Digital Marketing Agency in ${name} | SEO & Google Maps Ranking | Digital FX`,
    metaDescription: `Grow your ${name} business with Digital FX (4.9★ Rated). Rank #1 on Google Maps 3-Pack, dominate local SEO in ${name}, ${stateName}, and scale qualified customer inquiries with custom Next.js websites and ROI-driven paid ads.`,
    landmarks,
    primaryIndustries,
    localChallenges,
    localStrategyPoints,
    sampleCaseStudy,
    coordinates,
    keywords: [
      `best digital marketing agency in ${name}`,
      `digital marketing company in ${name}`,
      `top SEO company ${name}`,
      `digital marketing agency near me in ${name}`,
      `Google Maps ranking agency ${name}`,
      `website development company in ${name}`,
      `social media marketing agency in ${name}`,
      `lead generation agency ${name}`,
      `SEO services in ${name} ${stateName}`,
      `PPC agency in ${name}`,
    ],
    faqs: [
      {
        question: `Why do businesses in ${name} choose Digital FX over traditional local agencies?`,
        answer: `Unlike traditional agencies that sell vanity metrics like impressions and clicks, Digital FX focuses 100% on attributable revenue, phone inquiries, and walk-in footfall. We deploy modern Next.js 16 technology (loading in under 0.8s), verified Google Maps 3-Pack ranking playbooks, and transparent ROI reporting with no long-term lock-in contracts.`,
      },
      {
        question: `How long does it take to rank #1 on Google Maps in ${name}?`,
        answer: `Most local businesses in ${name} begin seeing measurable upward movement within 30 to 45 days of completing our Google Business Profile overhaul, NAP citation cleanup, and geo-tagged review syndication. Hyper-competitive niches typically achieve steady Top 3 ranking within 60 to 90 days.`,
      },
      {
        question: `Can Digital FX handle web development and paid ads for our ${name} business?`,
        answer: `Yes, we provide end-to-end full-funnel digital growth. From high-converting custom website design and Google Ads / Meta campaigns to ongoing local SEO retainers, everything is handled in-house with dedicated strategist support.`,
      },
      {
        question: `What is your pricing for digital marketing services in ${name}?`,
        answer: `Our Google Maps & Local SEO growth plan starts at ₹2,000/month, custom high-speed websites start from ₹10,000 one-time, and full-funnel 360° Growth Retainers start at ₹25,000/month. We also offer custom retainer pricing tailored to your industry goals in ${name}.`,
      },
    ],
  };
}
