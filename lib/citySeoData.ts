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

// All 28 States & 8 UTs + all 350+ Cities with guaranteed unique slugs
export const ALL_LOCATIONS_FLAT: LocationMapping[] = (() => {
  const list: LocationMapping[] = [];
  const seenSlugs = new Set<string>();

  // 1. All 28 States & 8 Union Territories
  for (const s of INDIA_STATES_AND_UTS) {
    const slug = toCitySlug(s.name);
    seenSlugs.add(slug);
    list.push({
      name: s.name,
      slug,
      stateName: s.name,
      type: s.type,
      isState: true,
      cities: s.cities,
    });
  }

  // 2. All 350+ Cities (disambiguated if duplicate slug found)
  for (const s of INDIA_STATES_AND_UTS) {
    for (const c of s.cities) {
      let slug = toCitySlug(c);
      if (seenSlugs.has(slug)) {
        const stateSlug = toCitySlug(s.name);
        slug = `${slug}-${stateSlug}`;
      }
      seenSlugs.add(slug);
      list.push({
        name: c,
        slug,
        stateName: s.name,
        type: s.type,
        isState: false,
      });
    }
  }

  // 3. Delhi NCR Strategic Localities & Regional Commercial Hubs
  const ncrAndMetroLocalities: LocationMapping[] = [
    { name: "Indirapuram", slug: "indirapuram", stateName: "Uttar Pradesh", type: "state", isState: false },
    { name: "Vaishali", slug: "vaishali", stateName: "Uttar Pradesh", type: "state", isState: false },
    { name: "Vasundhara", slug: "vasundhara", stateName: "Uttar Pradesh", type: "state", isState: false },
    { name: "Raj Nagar Extension", slug: "raj-nagar-extension", stateName: "Uttar Pradesh", type: "state", isState: false },
    { name: "Gurgaon", slug: "gurgaon", stateName: "Haryana", type: "state", isState: false },
    { name: "Bangalore", slug: "bangalore", stateName: "Karnataka", type: "state", isState: false },
  ];

  for (const loc of ncrAndMetroLocalities) {
    if (!seenSlugs.has(loc.slug)) {
      seenSlugs.add(loc.slug);
      list.push(loc);
    }
  }

  // 4. International Commercial & Offshore Hubs (Dubai Flagship)
  const globalHubs: LocationMapping[] = [
    { name: "Dubai", slug: "dubai", stateName: "United Arab Emirates", type: "union_territory", isState: false },
    { name: "Abu Dhabi", slug: "abu-dhabi", stateName: "United Arab Emirates", type: "union_territory", isState: false },
    { name: "Sharjah", slug: "sharjah", stateName: "United Arab Emirates", type: "union_territory", isState: false },
    { name: "Riyadh", slug: "riyadh", stateName: "Saudi Arabia", type: "union_territory", isState: false },
    { name: "Doha", slug: "doha", stateName: "Qatar", type: "union_territory", isState: false },
    { name: "New York", slug: "new-york", stateName: "United States", type: "union_territory", isState: false },
    { name: "London", slug: "london", stateName: "United Kingdom", type: "union_territory", isState: false },
    { name: "Toronto", slug: "toronto", stateName: "Canada", type: "union_territory", isState: false },
    { name: "Sydney", slug: "sydney", stateName: "Australia", type: "union_territory", isState: false },
    { name: "Singapore", slug: "singapore", stateName: "Singapore", type: "union_territory", isState: false },
  ];

  for (const g of globalHubs) {
    seenSlugs.add(g.slug);
    list.push(g);
  }

  return list;
})();


export const TOP_COMMERCIAL_CITIES = [
  "ghaziabad", "noida", "greater-noida", "delhi", "gurgaon", "gurugram", "faridabad",
  "indirapuram", "vaishali", "vasundhara", "raj-nagar-extension",
  "mumbai", "bangalore", "bengaluru", "hyderabad", "pune", "jaipur",
  "lucknow", "chandigarh", "ahmedabad", "kolkata", "chennai",
  "kanpur", "indore", "bhopal", "mohali", "kochi",
  "patna", "surat", "nagpur", "visakhapatnam", "bhubaneswar", "ludhiana",
  "dehradun", "vadodara", "coimbatore", "varanasi", "agra", "prayagraj",
  "meerut", "amritsar", "nashik", "rajkot", "cuttack", "alappuzha", "kottayam",
  "rewari", "lajpat-nagar", "dharmanagar", "diglipur"
];

// The 20 Explicit Focus Cities / Localities for Multi-City SEO
export const PRIORITY_20_SEO_CITIES = [
  // Delhi NCR (10)
  "noida",
  "ghaziabad",
  "delhi",
  "greater-noida",
  "gurgaon",
  "faridabad",
  "indirapuram",
  "vaishali",
  "vasundhara",
  "raj-nagar-extension",
  // Other Major Indian Cities (10)
  "mumbai",
  "bangalore",
  "hyderabad",
  "pune",
  "jaipur",
  "lucknow",
  "chandigarh",
  "ahmedabad",
  "kolkata",
  "chennai",
] as const;

export const GLOBAL_HUBS_SLUGS = [
  "dubai", "abu-dhabi", "sharjah", "riyadh", "doha", "new-york", "london",
  "singapore", "toronto", "sydney"
];

export const CANONICAL_LOCATION_SLUGS: string[] = (() => {
  const stateSlugs = INDIA_STATES_AND_UTS.map((s) => toCitySlug(s.name));
  return Array.from(new Set([...stateSlugs, ...TOP_COMMERCIAL_CITIES, ...GLOBAL_HUBS_SLUGS]));
})();

export function isCanonicalLocation(slug: string): boolean {
  return CANONICAL_LOCATION_SLUGS.includes(slug.toLowerCase().trim());
}

export function getParentStateSlugForCity(citySlug: string): string | null {
  const clean = citySlug.toLowerCase().trim();
  const stateDirect = INDIA_STATES_AND_UTS.find((s) => toCitySlug(s.name) === clean);
  if (stateDirect) return clean;

  const loc = ALL_LOCATIONS_FLAT.find((c) => c.slug === clean);
  if (loc && loc.stateName) {
    return toCitySlug(loc.stateName);
  }
  for (const s of INDIA_STATES_AND_UTS) {
    const stateSlug = toCitySlug(s.name);
    for (const c of s.cities) {
      const cSlug = toCitySlug(c);
      if (cSlug === clean || `${cSlug}-${stateSlug}` === clean) {
        return stateSlug;
      }
    }
  }
  return null;
}

export const GLOBAL_HUBS_LIST = [
  { name: "Dubai", country: "United Arab Emirates", slug: "dubai", code: "AE", flag: "🇦🇪", cta: "AED Retainers" },
  { name: "Abu Dhabi", country: "United Arab Emirates", slug: "abu-dhabi", code: "AE", flag: "🇦🇪", cta: "ADGM & Oil/Gas" },
  { name: "Riyadh", country: "Saudi Arabia", slug: "riyadh", code: "SA", flag: "🇸🇦", cta: "Vision 2030" },
  { name: "New York", country: "United States", slug: "new-york", code: "US", flag: "🇺🇸", cta: "SaaS & Scaleup" },
  { name: "London", country: "United Kingdom", slug: "london", code: "GB", flag: "🇬🇧", cta: "Fintech & Property" },
  { name: "Toronto", country: "Canada", slug: "toronto", code: "CA", flag: "🇨🇦", cta: "Tech & Growth" },
  { name: "Sydney", country: "Australia", slug: "sydney", code: "AU", flag: "🇦🇺", cta: "Tradie & B2B" },
  { name: "Singapore", country: "Singapore", slug: "singapore", code: "SG", flag: "🇸🇬", cta: "APAC Enterprise" },
];

// Alias for backwards compatibility
export const ALL_CITIES_FLAT = ALL_LOCATIONS_FLAT;

// Map of tailored nuances for priority Indian commercial hubs and states
const BESPOKE_LOCATION_DATA: Record<string, Partial<CityProfile>> = {
  "uttar-pradesh": {
    landmarks: [
      "Noida (Sector 62, Sector 18 Commercial & Expressways)",
      "Greater Noida (Knowledge Park & Pari Chowk)",
      "Ghaziabad (Crossings Republik, Raj Nagar & Sahibabad)",
      "Lucknow (Hazratganj, Gomti Nagar & Vibhuti Khand)",
      "Kanpur (Civil Lines, Panki & Swaroop Nagar)",
      "Agra (Sanjay Place & MG Road Corridor)",
      "Varanasi (Sigra, Cantonment & Kashi Cultural Commerce Belt)",
      "Prayagraj (Civil Lines & Katra Market)",
      "Meerut (Delhi Road, Partapur & Abu Lane)",
    ],
    primaryIndustries: [
      "IT, Software & SaaS Services (Noida & Greater Noida Hubs)",
      "Manufacturing, Auto Components & Heavy Engineering (Ghaziabad & Kanpur)",
      "Leather, Footwear & Apparel Exports (Kanpur & Agra)",
      "Healthcare, Multi-Specialty Hospitals & Diagnostic Networks",
      "Real Estate Development, Commercial Townships & Infrastructure",
      "Textiles, Silk Handlooms & Handicrafts (Varanasi & Meerut)",
    ],
    localChallenges: [
      "Intense regional competition between Delhi NCR agencies and local state providers, leading to missed customer acquisition.",
      "Outdated, slow-loading websites losing over 55% of prospective mobile inquiries across UP districts.",
      "Unoptimized Google Business Profiles failing to appear in the Google Maps 3-Pack for local buyers searching across UP district headquarters.",
    ],
    localStrategyPoints: [
      "Google Maps 3-Pack Authority: Dominating Top 3 rankings for 'best digital marketing agency in Uttar Pradesh' and regional intent.",
      "Sub-Second Next.js Web Platforms: Built to load in 0.8s on 4G/5G mobile networks across all UP commercial corridors.",
      "Full Schema.org Entity Integration: Directly connecting your business entity with UP commercial registries and Google Knowledge Graph.",
      "Hyper-Local Regional Citation Network: 50+ high-DA business citations ensuring accurate NAP across all UP districts.",
      "Generative AI Search (GEO): Formatting digital footprint so ChatGPT, Perplexity, and Google AI Overviews highlight your business first in UP.",
    ],
    sampleCaseStudy: {
      clientType: "Leading Healthcare & Commercial Services Group in Uttar Pradesh",
      neighborhood: "Ghaziabad & Noida NCR Corridor",
      metrics: "+285% Verified Inbound Inquiries in 90 Days",
      result: "Restructured Google Business Profiles across multiple centers, built a sub-second Next.js web application, and established state-wide ranking dominance.",
    },
    coordinates: { lat: 26.8467, lng: 80.9462 },
  },

  "tamil-nadu": {
    landmarks: [
      "Chennai (OMR IT Corridor, Guindy Industrial & Anna Nagar)",
      "Coimbatore (Tidel Park, Avinashi Road & Peelamedu)",
      "Madurai (KK Nagar & Town Hall Commercial Market)",
      "Tirupur (Apparel Export Corridor & Court Street)",
      "Salem (Steel & Textile Trade Corridor)",
      "Trichy (Thillai Nagar & Cantonment)",
    ],
    primaryIndustries: [
      "IT Services, SaaS & Product Engineering (Chennai OMR & Coimbatore)",
      "Automotive Manufacturing & Precision Engineering (Chennai & Sriperumbudur)",
      "Textiles, Garments & Apparel Exports (Tirupur & Coimbatore)",
      "Tertiary Healthcare, Medical Tourism & Diagnostic Centers",
      "Hardware Manufacturing & Electronics SEZs",
    ],
    sampleCaseStudy: {
      clientType: "B2B Precision Engineering & Tech Exporter in Tamil Nadu",
      neighborhood: "OMR Tech Corridor, Chennai",
      metrics: "+240% Qualified Inbound Inquiries in 75 Days",
      result: "Executed deep technical SEO, structured data markup, and high-converting performance PPC campaigns across South India and export markets.",
    },
    coordinates: { lat: 13.0827, lng: 80.2707 },
  },

  "west-bengal": {
    landmarks: [
      "Kolkata (Salt Lake Sector V IT Hub & Rajarhat New Town)",
      "Park Street & BBD Bagh Commercial Corridor",
      "Howrah (Industrial & Machinery Trade Belt)",
      "Siliguri (Sevoke Road & North Bengal Logistics Hub)",
      "Durgapur (City Centre & Steel Industrial Zone)",
      "Asansol (Burnpur Commercial Corridor)",
    ],
    primaryIndustries: [
      "IT & Enterprise Software Development (Sector V & New Town)",
      "Jute, Tea & Agro Commodity Exports",
      "Steel, Heavy Engineering & Foundry Manufacturing",
      "Healthcare Clinics, Diagnostic Networks & Higher Education",
      "Retail, E-commerce & FMCG Distribution",
    ],
    sampleCaseStudy: {
      clientType: "Premier Healthcare & Education Group in West Bengal",
      neighborhood: "Salt Lake Sector V, Kolkata",
      metrics: "+195% Verified Local Patient Enquiries in 60 Days",
      result: "Rebuilt local search citations, optimized Google Maps 3-Pack placement, and launched hyper-targeted search ads.",
    },
    coordinates: { lat: 22.5726, lng: 88.3639 },
  },

  "bihar": {
    landmarks: [
      "Patna (Boring Road, Fraser Road & Exhibition Road Corridor)",
      "Kankarbagh & Bailey Road Tech Corridor",
      "Muzaffarpur (Motijheel & Commercial Center)",
      "Gaya (Civil Lines & Bodhgaya Hospitality Belt)",
      "Bhagalpur (Silk & Trade Market)",
      "Darbhanga (Laheriasarai Commercial Hub)",
    ],
    primaryIndustries: [
      "Healthcare Clinics, Nursing Homes & Medical Distribution",
      "Competitive Exam Coaching & Higher Education Institutes",
      "Retail Chains, Automobile Dealerships & FMCG Wholesale",
      "Real Estate Construction & Commercial Contracting",
      "Agri-Tech & Food Processing Enterprises",
    ],
    sampleCaseStudy: {
      clientType: "Top Coaching & Career Institute in Bihar",
      neighborhood: "Boring Road, Patna",
      metrics: "+310% Inbound Student Inquiries in 45 Days",
      result: "Dominated local Google Maps ranking across Patna district and implemented high-speed Next.js landing pages with direct WhatsApp lead capture.",
    },
    coordinates: { lat: 25.5941, lng: 85.1376 },
  },

  "madhya-pradesh": {
    landmarks: [
      "Indore (Vijay Nagar, AB Road & Super Corridor IT SEZ)",
      "Bhopal (MP Nagar Zones I & II, Arera Colony)",
      "Jabalpur (Civic Centre & Russell Chowk)",
      "Gwalior (City Centre & Lashkar Market)",
      "Pithampur & Mandideep (Automobile & Industrial Belts)",
      "Ujjain (Freeganj & Religious Tourism Corridor)",
    ],
    primaryIndustries: [
      "IT Software & Global Service Exports (Indore Super Corridor)",
      "Automobile & Heavy Commercial Vehicle Manufacturing (Pithampur)",
      "Pharmaceutical Formulations & Active Ingredients",
      "Healthcare, Diagnostic Hubs & Higher Education",
      "Agro-Processing, Soya & FMCG Trading",
    ],
    sampleCaseStudy: {
      clientType: "Multi-Specialty Hospital & Wellness Chain in MP",
      neighborhood: "Vijay Nagar, Indore",
      metrics: "+230% Organic Inbound Call Volume in 60 Days",
      result: "Optimized GBP profiles across Indore and Bhopal, deployed structured FAQ schema, and ran high-intent local search campaigns.",
    },
    coordinates: { lat: 22.7196, lng: 75.8577 },
  },

  "kerala": {
    landmarks: [
      "Kochi (Infopark Kakkanad, Marine Drive & MG Road)",
      "Thiruvananthapuram (Technopark Phases 1-4 & Kazhakkoottam)",
      "Kozhikode (Mavoor Road & Cyberpark)",
      "Thrissur (Swaraj Round Commercial Hub)",
      "Kollam & Alappuzha (Tourism & Maritime Trade Belts)",
    ],
    primaryIndustries: [
      "Software Development, IT Services & AI (Technopark & Infopark)",
      "Ayurveda, Wellness Centers & Hospitality Tourism",
      "Healthcare Services & Medical Diagnostics",
      "Spice Exports, Seafood & Plantation Commodities",
      "Jewellery Retail & Real Estate Construction",
    ],
    sampleCaseStudy: {
      clientType: "Luxury Wellness & Ayurvedic Healthcare Resort in Kerala",
      neighborhood: "Kochi Marine Drive & Coastal Belt",
      metrics: "+270% International & Domestic Direct Bookings",
      result: "Executed multi-lingual SEO, rich Schema markup, and Google AI Overviews optimization to attract high-net-worth travellers.",
    },
    coordinates: { lat: 9.9312, lng: 76.2673 },
  },

  "andhra-pradesh": {
    landmarks: [
      "Visakhapatnam (Cyber Valley, Rushikonda & Siripuram)",
      "Vijayawada (Benz Circle, MG Road & Auto Nagar)",
      "Guntur (Brodipet & Arundelpet Trade Hub)",
      "Tirupati (Renigunta Road & Pilgrimage Corridor)",
      "Kakinada & Rajahmundry (Port & Industrial Zones)",
    ],
    primaryIndustries: [
      "Information Technology & ITES (Visakhapatnam SEZ)",
      "Port Operations, Shipping & Marine Logistics",
      "Pharmaceutical Manufacturing & Chemical Belts",
      "Agro-Commodity Exports, Chilli & Tobacco Trade",
      "Healthcare Networks & Engineering Education",
    ],
    sampleCaseStudy: {
      clientType: "Industrial Logistics & Trade Exporter in Andhra Pradesh",
      neighborhood: "Rushikonda Tech Park, Visakhapatnam",
      metrics: "+180% Verified Corporate Inquiries in 90 Days",
      result: "Deployed specialized B2B SEO, local entity syndication, and high-conversion landing pages.",
    },
    coordinates: { lat: 17.6868, lng: 83.2185 },
  },

  "odisha": {
    landmarks: [
      "Bhubaneswar (Infocity Patia, Chandrasekharpur & Saheed Nagar)",
      "Cuttack (Badambadi & Malgodown Wholesale Corridor)",
      "Rourkela (Steel Industrial Corridor & Panposh Road)",
      "Puri (Grand Road & Tourism Belt)",
      "Berhampur (Bada Bazaar Trade Center)",
    ],
    primaryIndustries: [
      "IT Services, Fintech & Software Centers (Infocity Bhubaneswar)",
      "Metals, Mining & Steel Heavy Industries",
      "Healthcare Hospitals & Technical Universities",
      "Handloom, Handicrafts & Cultural Tourism",
      "Port-Based Logistics & Seafood Exports",
    ],
    sampleCaseStudy: {
      clientType: "Premier Higher Education & Training Academy in Odisha",
      neighborhood: "Infocity Patia, Bhubaneswar",
      metrics: "+250% Verified Admissions Leads in 60 Days",
      result: "Rebuilt mobile landing page with Next.js 16, optimized Google Maps 3-Pack ranking, and captured student search intent.",
    },
    coordinates: { lat: 20.2961, lng: 85.8245 },
  },

  "uttarakhand": {
    landmarks: [
      "Dehradun (Rajpur Road, Clock Tower & IT Park Sahastradhara)",
      "Haridwar (SIDCUL Industrial Area & Ranipur)",
      "Rishikesh (Tapovan & Wellness Corridor)",
      "Haldwani (Nainital Road Commercial Belt)",
      "Roorkee (IIT Road & Engineering Hub)",
    ],
    primaryIndustries: [
      "Boarding Schools, Universities & Professional Institutes",
      "Pharmaceuticals & FMCG Manufacturing (SIDCUL Haridwar)",
      "Wellness Tourism, Yoga Retreats & Hospitality",
      "Real Estate & Second-Home Townships",
      "IT Software & Ecological Startups",
    ],
    sampleCaseStudy: {
      clientType: "Elite Boarding School & Academy in Uttarakhand",
      neighborhood: "Rajpur Road, Dehradun",
      metrics: "+210% Pan-India Parent Enquiries in 60 Days",
      result: "Engineered high-intent national and international search rankings, fast Next.js mobile pages, and localized Google Maps profiles.",
    },
    coordinates: { lat: 30.3165, lng: 78.0322 },
  },

  // Priority Metro Cities
  kanpur: {
    landmarks: ["Civil Lines", "Panki Industrial Estate", "Swaroop Nagar", "Mall Road", "Fazalganj"],
    primaryIndustries: ["Leather & Footwear Manufacturing", "Textiles & Hosiery", "Engineering & Defense Components", "Chemicals & Plastics"],
    sampleCaseStudy: { clientType: "Industrial Manufacturer in Kanpur", neighborhood: "Panki Industrial Area", metrics: "+240% B2B Sales Leads", result: "Scaled national B2B SEO and Google Ads campaigns." },
    coordinates: { lat: 26.4499, lng: 80.3319 },
  },
  indore: {
    landmarks: ["Vijay Nagar", "AB Road Commercial Hub", "Palasia", "Super Corridor", "56 Dukan Market"],
    primaryIndustries: ["IT & Software Services", "Pharmaceuticals", "Textiles & Garments", "Soybean & FMCG Trade"],
    sampleCaseStudy: { clientType: "Healthcare & Dental Clinic in Indore", neighborhood: "Vijay Nagar", metrics: "+225% Direct Patient Calls", result: "Achieved Google Maps 3-Pack Rank #1 within 45 days." },
    coordinates: { lat: 22.7196, lng: 75.8577 },
  },
  bhopal: {
    landmarks: ["MP Nagar Zone 1 & 2", "Arera Colony", "Bittan Market", "New Market", "Govindpura Industrial"],
    primaryIndustries: ["Governance & Public Sector Consulting", "Higher Education & Coaching", "Healthcare & Hospitals", "Electrical Manufacturing"],
    sampleCaseStudy: { clientType: "Professional Institute in Bhopal", neighborhood: "MP Nagar Zone 2", metrics: "+195% Verified Student Inquiries", result: "Re-engineered website performance and local citation architecture." },
    coordinates: { lat: 23.2599, lng: 77.4126 },
  },
  patna: {
    landmarks: ["Boring Road", "Fraser Road", "Kankarbagh", "Exhibition Road", "Bailey Road"],
    primaryIndustries: ["Competitive Coaching & Education", "Healthcare & Diagnostic Centers", "Retail & Automobile Dealerships", "Commercial Contracting"],
    sampleCaseStudy: { clientType: "Premier Coaching Institute in Patna", neighborhood: "Boring Road", metrics: "+290% Inbound Inquiries", result: "Captured #1 rankings on Google Maps and organic mobile search." },
    coordinates: { lat: 25.5941, lng: 85.1376 },
  },
  surat: {
    landmarks: ["Ring Road Textile Market", "Varachha Diamond Market", "Vesu", "Ghod Dod Road", "Hazira Industrial Belt"],
    primaryIndustries: ["Textiles & Synthetic Fabrics", "Diamond Polishing & Jewelry", "Petrochemicals & Heavy Industry", "Real Estate Development"],
    sampleCaseStudy: { clientType: "Textile Exporter in Surat", neighborhood: "Ring Road Market", metrics: "+265% Domestic & Export Leads", result: "Targeted Google Ads and multi-region SEO campaigns." },
    coordinates: { lat: 21.1702, lng: 72.8311 },
  },
  nagpur: {
    landmarks: ["Sitabuldi", "Dharampeth", "MIHAN SEZ", "Wardha Road", "Hingna MIDC"],
    primaryIndustries: ["Multimodal Logistics & Transport", "IT Services (MIHAN)", "Textiles & Agro-Trading", "Healthcare & Medical Education"],
    sampleCaseStudy: { clientType: "Logistics Enterprise in Nagpur", neighborhood: "MIHAN SEZ", metrics: "+210% High-Value Freight Inquiries", result: "Built a high-converting web presence and localized B2B SEO." },
    coordinates: { lat: 21.1458, lng: 79.0882 },
  },
  visakhapatnam: {
    landmarks: ["Siripuram", "Jagadamba Centre", "Rushikonda IT Park", "Gajuwaka Industrial Belt", "Daba Gardens"],
    primaryIndustries: ["Port Operations & Marine Cargo", "IT & BPO (Rushikonda)", "Steel & Heavy Engineering", "Pharmaceutical Manufacturing"],
    sampleCaseStudy: { clientType: "Marine Engineering Firm in Visakhapatnam", neighborhood: "Rushikonda", metrics: "+200% Qualified Inquiries", result: "Optimized Google Business Profile and global search rankings." },
    coordinates: { lat: 17.6868, lng: 83.2185 },
  },
  bhubaneswar: {
    landmarks: ["Infocity Patia", "Saheed Nagar", "Nayapalli", "Janpath Commercial", "Chandrasekharpur"],
    primaryIndustries: ["IT & Software Startups", "Healthcare & Super-Specialty Hospitals", "Higher Education Universities", "Handloom & Tourism"],
    sampleCaseStudy: { clientType: "IT Consulting Startup in Bhubaneswar", neighborhood: "Infocity Patia", metrics: "+235% Corporate Pipeline Growth", result: "Ranked for competitive SaaS and software development keywords." },
    coordinates: { lat: 20.2961, lng: 85.8245 },
  },
  ludhiana: {
    landmarks: ["Focal Point Phase 1-8", "Model Town", "Chaura Bazaar", "Ferozepur Road", "Gill Road"],
    primaryIndustries: ["Woolen Hosiery & Garments", "Bicycle & Auto Parts", "Textile Machinery", "Wholesale Trading"],
    sampleCaseStudy: { clientType: "Garment Brand in Ludhiana", neighborhood: "Model Town", metrics: "+250% Wholesale & Retail Orders", result: "Google Maps 3-Pack and targeted Meta catalogue advertising." },
    coordinates: { lat: 30.9010, lng: 75.8573 },
  },
  dehradun: {
    landmarks: ["Rajpur Road", "Sahastradhara Road IT Park", "Paltan Bazaar", "Clock Tower", "Ballupur"],
    primaryIndustries: ["Boarding Schools & Academies", "Healthcare & Wellness", "Hospitality & Tourism", "Real Estate"],
    sampleCaseStudy: { clientType: "Wellness & Spa Resort in Dehradun", neighborhood: "Rajpur Road", metrics: "+215% Weekend Bookings", result: "Local SEO, Google Ads, and optimized GEO entity citations." },
    coordinates: { lat: 30.3165, lng: 78.0322 },
  },
  vadodara: {
    landmarks: ["Alkapuri", "Makarpura GIDC", "Sayajigunj", "Manjalpur", "Old Padra Road"],
    primaryIndustries: ["Chemicals & Petrochemicals", "Heavy Engineering & Transformers", "Pharmaceutical Formulations", "Plastics"],
    sampleCaseStudy: { clientType: "Engineering Machinery Firm in Vadodara", neighborhood: "Makarpura GIDC", metrics: "+205% Industrial Leads", result: "Targeted technical SEO and high-converting B2B inquiry funnels." },
    coordinates: { lat: 22.3072, lng: 73.1812 },
  },
  coimbatore: {
    landmarks: ["RS Puram", "Peelamedu", "Gandhipuram", "Avinashi Road", "Tidel Park"],
    primaryIndustries: ["Textile Machinery & Pumps", "Auto Components & Foundries", "IT & Software Services", "Jewelry Manufacturing"],
    sampleCaseStudy: { clientType: "Pump & Motor Manufacturer in Coimbatore", neighborhood: "Peelamedu", metrics: "+240% Dealer & Buyer Inquiries", result: "Secured top organic search spots across South Indian B2B keywords." },
    coordinates: { lat: 11.0168, lng: 76.9558 },
  },
  varanasi: {
    landmarks: ["Sigra Commercial", "Cantonment", "Lanka & BHU Corridor", "Bhelupur", "Godowlia"],
    primaryIndustries: ["Silk Handloom & Textiles", "Cultural Tourism & Hospitality", "Healthcare Clinics", "Handicrafts & Metalware"],
    sampleCaseStudy: { clientType: "Boutique Heritage Hotel in Varanasi", neighborhood: "Cantonment", metrics: "+280% Direct Inbound Bookings", result: "Dominant Google Business Profile rankings and GEO AI Search placement." },
    coordinates: { lat: 25.3176, lng: 82.9739 },
  },
  agra: {
    landmarks: ["Sanjay Place Commercial", "MG Road", "Fatehabad Road", "Kamla Nagar", "Sikandra Industrial"],
    primaryIndustries: ["Footwear & Leather Goods", "Tourism, Hotels & Hospitality", "Handicrafts & Marble Inlay", "Automobile Ancillaries"],
    sampleCaseStudy: { clientType: "Footwear Brand in Agra", neighborhood: "Sanjay Place", metrics: "+220% Qualified Inquiries", result: "Next.js performance website and Google Maps 3-Pack domination." },
    coordinates: { lat: 27.1767, lng: 78.0081 },
  },
  prayagraj: {
    landmarks: ["Civil Lines", "Katra Commercial", "Georgetown", "Allahabad High Court Corridor", "Naini Industrial Area"],
    primaryIndustries: ["Judicial & Legal Consulting", "Competitive Exam Coaching", "Healthcare & Medical Services", "Food Processing & Agriculture"],
    sampleCaseStudy: { clientType: "Coaching Academy in Prayagraj", neighborhood: "Civil Lines", metrics: "+230% Student Enrollments", result: "Optimized GBP review funnels and high-speed mobile pages." },
    coordinates: { lat: 25.4358, lng: 81.8463 },
  },
  meerut: {
    landmarks: ["Partapur Industrial Area", "Abu Lane", "Delhi Road", "Shastri Nagar", "Modipuram"],
    primaryIndustries: ["Sports Goods Manufacturing", "Publishing & Printing", "Auto Parts & Precision Tools", "Healthcare & Hospitals"],
    sampleCaseStudy: { clientType: "Sports Equipment Brand in Meerut", neighborhood: "Partapur Industrial Area", metrics: "+210% Verified Wholesale Inquiries", result: "Scaled national keyword rankings and Google Maps Top 3 presence." },
    coordinates: { lat: 28.9845, lng: 77.7064 },
  },
  amritsar: {
    landmarks: ["Mall Road", "Ranjit Avenue", "Lawrence Road", "Hall Bazaar", "GT Road Commercial"],
    primaryIndustries: ["Hospitality & Tourism", "Textiles & Shawls", "Food Processing & Dining", "Handicrafts & Trade"],
    sampleCaseStudy: { clientType: "Hospitality & Restaurant Group in Amritsar", neighborhood: "Ranjit Avenue", metrics: "+245% Footfall & Private Bookings", result: "Dominant Google Maps 3-Pack placement and geo-targeted review syndication." },
    coordinates: { lat: 31.6340, lng: 74.8723 },
  },
  nashik: {
    landmarks: ["College Road", "Ambad MIDC", "Satpur Industrial", "Gangapur Road", "Mahatma Nagar"],
    primaryIndustries: ["Automotive & Precision Engineering", "Wine Production & Agro-Tourism", "Electrical Equipment", "Pharmaceuticals"],
    sampleCaseStudy: { clientType: "Engineering Components Supplier in Nashik", neighborhood: "Ambad MIDC", metrics: "+220% Corporate RFQ Pipeline", result: "Targeted B2B SEO and sub-second landing page architecture." },
    coordinates: { lat: 19.9975, lng: 73.7898 },
  },
  rajkot: {
    landmarks: ["Yagnik Road", "Kalawad Road", "Aji GIDC", "Bhakti Nagar", "150 Feet Ring Road"],
    primaryIndustries: ["Diesel Engines & Machine Tools", "Auto Components & Forging", "Gold Jewelry Manufacturing", "Kitchenware & Castings"],
    sampleCaseStudy: { clientType: "Machine Tool Exporter in Rajkot", neighborhood: "Aji GIDC", metrics: "+230% Inbound Inquiries", result: "Global and domestic SEO optimization with verified schema integration." },
    coordinates: { lat: 22.3039, lng: 70.8022 },
  },
  faridabad: {
    landmarks: ["Sector 15 Commercial Hub", "Mathura Road Industrial Area", "NIT Market", "Sector 31", "Old Faridabad"],
    primaryIndustries: ["Heavy Engineering & Machinery", "Auto Ancillaries & Parts", "Fabrication & Sheet Metal", "Consumer Appliances"],
    sampleCaseStudy: { clientType: "Industrial Ancillary Manufacturer in Faridabad", neighborhood: "Mathura Road Industrial Area", metrics: "+215% High-Value Orders", result: "B2B local search dominance and Google Ads campaign optimization." },
    coordinates: { lat: 28.4089, lng: 77.3178 },
  },
  cuttack: {
    landmarks: ["Badambadi Bus Stand Market", "Malgodown Wholesale Trade Corridor", "Choudwar Industrial Area", "Buxi Bazaar", "Cantonment Road"],
    primaryIndustries: ["Agro-Commodity & Spices Wholesale", "Healthcare & Specialty Medical Clinics", "Metals, Paper & Printing Manufacturing", "Higher Education & Legal Advisory"],
    sampleCaseStudy: { clientType: "Agro-Commodity & Wholesale Group in Cuttack", neighborhood: "Malgodown & Badambadi", metrics: "+240% B2B Buyer Inquiries", result: "Engineered local SEO, Google Maps 3-Pack placement, and fast Next.js mobile catalog." },
    coordinates: { lat: 20.4625, lng: 85.8828 },
  },
  alappuzha: {
    landmarks: ["Kalarcode Commercial Hub", "Alleppey Beach Resort Corridor", "Finishing Point Jetty", "Vazhicherry Market", "Cherthala Industrial Belt"],
    primaryIndustries: ["Coir & Matting Exports", "Houseboat Tourism & Eco-Resorts", "Seafood & Marine Exports", "Ayurvedic Healthcare & Wellness"],
    sampleCaseStudy: { clientType: "Coir Goods Exporter & Eco-Resort in Alappuzha", neighborhood: "Finishing Point & Beach Road", metrics: "+225% Direct Tourist & Export Bookings", result: "Optimized multilingual local SEO, Google Business Profile, and high-conversion landing pages." },
    coordinates: { lat: 9.4981, lng: 76.3388 },
  },
  kottayam: {
    landmarks: ["Collectorate Junction", "Kanjikuzhy Commercial Area", "KK Road Trade Belt", "Ettumanoor Industrial Belt", "Chingavanam"],
    primaryIndustries: ["Natural Rubber & Latex Processing", "Publishing & Print Media", "Tertiary Healthcare & Diagnostics", "Plantation Commodity Exports"],
    sampleCaseStudy: { clientType: "Rubber Goods & Latex Processor in Kottayam", neighborhood: "Kanjikuzhy & KK Road", metrics: "+210% Pan-India B2B Orders", result: "Dominant organic search ranking and verified Google Knowledge Graph entity structure." },
    coordinates: { lat: 9.5916, lng: 76.5222 },
  },
  rewari: {
    landmarks: ["Bawal Industrial Growth Centre (GIDC)", "Dharuhera Industrial Corridor", "Brass Market Rewari", "Model Town Rewari", "Delhi-Jaipur Highway Belt"],
    primaryIndustries: ["Automotive Components & OEM Suppliers (Bawal)", "Traditional Brassware & Metal Handicrafts", "Heavy Equipment & Warehousing Logistics", "Real Estate & Commercial Contracting"],
    sampleCaseStudy: { clientType: "Auto Component OEM Supplier in Rewari & Bawal", neighborhood: "Bawal Industrial Area & Dharuhera", metrics: "+235% Corporate RFQ Opportunities", result: "Targeted B2B industrial SEO, sub-second landing page architecture, and Google Maps 3-Pack domination." },
    coordinates: { lat: 28.1833, lng: 76.6167 },
  },
  "lajpat-nagar": {
    landmarks: ["Central Market Lajpat Nagar", "Amar Colony Commercial Hub", "Ring Road Lajpat Nagar Metro Station Corridor", "Lajpat Nagar II & III"],
    primaryIndustries: ["Ethnic Fashion & Bridal Apparel Boutiques", "Specialty Healthcare & Dental Centers", "Interior Decoration & Home Furnishings", "Food Retail & Dining Enterprises"],
    sampleCaseStudy: { clientType: "Bridal Wear & Designer Fashion Boutique in Lajpat Nagar", neighborhood: "Central Market & Amar Colony", metrics: "+310% Walk-in Customer Inquiries", result: "Ranked #1 on Google Maps 3-Pack across South Delhi for 'bridal lehenga boutique Lajpat Nagar' with 4.9★ review syndication." },
    coordinates: { lat: 28.5685, lng: 77.2433 },
  },
  "andaman-nicobar-islands": {
    landmarks: ["Port Blair (Aberdeen Bazaar, MG Road & Haddo)", "Cellular Jail Heritage Corridor", "Havelock Island (Radhanagar Beach Resort Belt)", "Neil Island & Diglipur"],
    primaryIndustries: ["Eco-Tourism, Island Resorts & Water Sports", "Marine Logistics & Inter-Island Shipping", "Handicrafts & Pearl Jewelry Exports", "Fisheries & Agro-Commodities"],
    sampleCaseStudy: { clientType: "Luxury Beach Resort & Marine Charter in Port Blair", neighborhood: "Havelock & Port Blair", metrics: "+275% Direct Island Bookings", result: "Optimized Google Business Profile, high-speed Next.js web application, and rich tourism Schema markup." },
    coordinates: { lat: 11.6234, lng: 92.7265 },
  },
  dharmanagar: {
    landmarks: ["Dharmanagar Main Market", "Naya Para Commercial Corridor", "Rajbari Trade Center", "ISBT Dharmanagar Belt"],
    primaryIndustries: ["Timber & Bamboo Product Manufacturing", "Rubber & Tea Plantation Logistics", "Cross-Border Trade & Agriculture", "Retail & Local Commerce"],
    sampleCaseStudy: { clientType: "Timber & Agro-Commodity Exporter in Dharmanagar", neighborhood: "Naya Para & Main Market", metrics: "+210% Pan-India Buyer Orders", result: "Targeted B2B local search dominance, Google Knowledge Graph integration, and fast mobile landing page." },
    coordinates: { lat: 24.3767, lng: 92.1643 },
  },
  diglipur: {
    landmarks: ["Aerial Bay Jetty", "Subhash Gram Commercial Market", "Kalipur Beach Corridor", "Ross & Smith Islands Gateway"],
    primaryIndustries: ["Eco-Tourism & Island Homestays", "Fisheries & Marine Produce", "Spices & Coconut Processing", "Local Logistics & Retail"],
    sampleCaseStudy: { clientType: "Eco-Tourism & Diving Operator in Diglipur", neighborhood: "Subhash Gram & Aerial Bay", metrics: "+230% Direct Tourist Reservations", result: "Engineered high-ranking Google Maps 3-Pack presence and fast Next.js mobile booking portal." },
    coordinates: { lat: 13.2667, lng: 92.9833 },
  },

  // Global Commercial Hubs
  "abu-dhabi": {
    landmarks: ["Al Maryah Island Financial Free Zone", "Corniche Commercial Belt", "Yas Island Business Hub", "Masdar City", "Khalifa City"],
    primaryIndustries: ["Sovereign Investment & Private Equity", "Oil, Gas & Clean Energy", "Government & Enterprise Consulting", "Commercial Real Estate"],
    sampleCaseStudy: { clientType: "ADGM Corporate Services Firm in Abu Dhabi", neighborhood: "Al Maryah Island", metrics: "+280% UAE Enterprise Contracts", result: "Full-funnel organic search, AI answer engine citations, and executive lead funnels." },
    coordinates: { lat: 24.4539, lng: 54.3773 },
  },
  riyadh: {
    landmarks: ["King Abdullah Financial District (KAFD)", "Olaya Commercial District", "Al Malqa", "Digital City", "Diplomatic Quarter"],
    primaryIndustries: ["Vision 2030 Mega Projects", "Enterprise SaaS & Cloud Infrastructure", "Construction & Engineering Management", "Fintech & Banking"],
    sampleCaseStudy: { clientType: "Enterprise Tech & Cloud Consultancy in Riyadh", neighborhood: "KAFD & Olaya", metrics: "+320% Inbound Corporate Pipeline", result: "Multi-lingual Arabic/English SEO, local entity Knowledge Graph integration, and GEO dominance." },
    coordinates: { lat: 24.7136, lng: 46.6753 },
  },
  "new-york": {
    landmarks: ["Silicon Alley (Flatiron)", "Midtown Manhattan", "Financial District Wall Street", "DUMBO Brooklyn", "Grand Central Corridor"],
    primaryIndustries: ["B2B SaaS & Tech Scaleups", "Fintech & Capital Markets", "Professional & Legal Services", "Direct-to-Consumer (DTC) Brands"],
    sampleCaseStudy: { clientType: "B2B SaaS Scaleup in New York", neighborhood: "Silicon Alley, Manhattan", metrics: "+310% US Qualified Demo Requests", result: "Deployed high-speed Next.js landing pages, technical SEO, and programmatic GEO positioning." },
    coordinates: { lat: 40.7128, lng: -74.0060 },
  },
  toronto: {
    landmarks: ["Downtown Financial District", "King West Tech Strip", "Markham Silicon Valley North", "Yorkville", "Liberty Village"],
    primaryIndustries: ["Artificial Intelligence & Software Engineering", "Financial Services & WealthTech", "Biotech & Healthcare", "CleanTech"],
    sampleCaseStudy: { clientType: "Fintech Platform in Toronto", neighborhood: "Financial District", metrics: "+260% Qualified Canadian Inquiries", result: "Accelerated technical SEO and local entity syndication." },
    coordinates: { lat: 43.6532, lng: -79.3832 },
  },
  sydney: {
    landmarks: ["Barangaroo Financial Corridor", "Sydney CBD", "Surry Hills Tech Hub", "North Sydney Commercial", "Macquarie Park"],
    primaryIndustries: ["Fintech & Scaleups", "Tradie & Home Services Franchises", "Property & Commercial Development", "Professional Advisory"],
    sampleCaseStudy: { clientType: "B2B Commercial Services Firm in Sydney", neighborhood: "Barangaroo & Surry Hills", metrics: "+275% High-Ticket Contracts", result: "Engineered local Google Maps 3-Pack authority and high-converting paid search." },
    coordinates: { lat: -33.8688, lng: 151.2093 },
  },

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
      metrics: "₹6 Lakh+ Domestic & Regional Trade Inquiries",
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
  "arunachal-pradesh": {
    landmarks: [
      "Itanagar (Bank Tinali, Ganga Market & Secretariate Road)",
      "Naharlagun (A-Sector Commercial Belt)",
      "Pasighat (Main Market & Trade Center)",
      "Tawang (Hospitality & Eco-Tourism Belt)",
      "Ziro (Cultural Tourism Corridor)",
    ],
    primaryIndustries: [
      "Eco-Tourism, Heritage Resorts & Adventure Hospitality",
      "Hydroelectric Power, Infrastructure & Civil Construction",
      "Organic Agri-Products & Horticulture Exports",
      "Government Contracting, Healthcare & Digital Infrastructure",
    ],
    sampleCaseStudy: {
      clientType: "Premier Hospitality & Regional Tourism Group in Arunachal Pradesh",
      neighborhood: "Itanagar & Tawang Corridor",
      metrics: "+260% Direct Inbound Tourist Bookings",
      result: "Deployed high-speed Next.js web presence, optimized Google Maps local citations, and captured national search traffic for North-East travel.",
    },
    coordinates: { lat: 27.0844, lng: 93.6053 },
  },
  "dadra-nagar-haveli-and-daman-diu": {
    landmarks: [
      "Daman (Nani Daman Fort, Moti Daman & Somnath Industrial Estate)",
      "Silvassa (Amli Industrial Estate & Piparia GIDC Belt)",
      "Diu (Nagoa Beach Hospitality Corridor)",
      "Khanvel (Resort & Eco-Tourism Belt)",
    ],
    primaryIndustries: [
      "Plastics, Packaging & Polymer Manufacturing",
      "Pharmaceuticals, Chemicals & Textile Manufacturing",
      "Beach Tourism, Hospitality & Food Enterprises",
      "Industrial Logistics & Export Packaging",
    ],
    sampleCaseStudy: {
      clientType: "Industrial Packaging & Polymer Manufacturer in Daman & Silvassa",
      neighborhood: "Somnath Industrial Estate, Daman",
      metrics: "+215% High-Value B2B Supplier Enquiries",
      result: "Executed targeted industrial SEO, Google Business Profile optimization, and fast mobile landing pages for pan-India B2B buyers.",
    },
    coordinates: { lat: 20.3974, lng: 72.8328 },
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
    heroTagline: "Best Digital Marketing Agency in Ghaziabad",
    metaTitle: "Best Digital Marketing Agency in Ghaziabad - Digital FX",
    metaDescription: "Digital FX is the best digital marketing agency in Ghaziabad headquartered at Orbit Plaza, Crossings Republik. We deliver Google Maps 3-Pack SEO, Google Ads, and custom websites.",
    landmarks: [
      "Orbit Plaza (Crossings Republik) — Digital FX HQ",
      "Raj Nagar District Centre (RDC)",
      "Kavi Nagar Commercial Hub",
      "Indirapuram (Kala Patthar & Aditya Mall)",
      "Vasundhara & Vaishali Commercial Belts",
      "Sahibabad Industrial Area Site 4",
      "Raj Nagar Extension High-Rise Corridor",
      "Gandhi Nagar & Nehru Nagar Markets",
    ],
    primaryIndustries: [
      "Multi-Specialty Hospitals, IVF & Dental Clinics",
      "B2B Manufacturing & Auto Engineering (Sahibabad)",
      "Real Estate Developers & High-Rise Townships",
      "Bridal Boutiques & Apparel (Gandhi Nagar & Turab Nagar)",
      "Coaching Academies & Private Schools (Kavi Nagar)",
      "Sanitaryware, Tiles & Building Supplies (Mohan Nagar)",
    ],
    localChallenges: [
      "Heavy competition from adjacent Noida and East Delhi agencies charging inflated retainers without transparent local reporting or presence.",
      "Established family businesses in RDC, Sahibabad, and Gandhi Nagar losing customer search share to digital-first competitors.",
      "Outdated WordPress websites losing 60%+ mobile traffic due to slow 3-5 second load times.",
    ],
    localStrategyPoints: [
      "Google Maps 3-Pack Supremacy: Securing Rank #1 for 'digital marketing agency in Ghaziabad' and 'SEO company near me'.",
      "Sub-Second Next.js 16 Web Architecture: Fast, secure web applications loading in 0.8s on 5G/4G across Ghaziabad.",
      "Hyper-Local Citation Syndication: 50+ verified high-DA directory citations ensuring accurate NAP across all Ghaziabad zones.",
      "High-Converting WhatsApp & Call Lead Funnels with automated booking.",
      "AI Search (GEO) Leadership: Formatting data for top citations in ChatGPT, Perplexity, and Google AI Overviews.",
    ],
    sampleCaseStudy: {
      clientType: "Multi-Specialty Dental & Implant Clinic Network",
      neighborhood: "Raj Nagar District Centre (RDC) & Crossings Republik",
      metrics: "+280% Google Maps Inquiries in 60 Days",
      result: "Optimized Google Business Profiles across two centers, generated 64 authentic geo-tagged reviews, and achieved Rank #1 for 'best dentist in Ghaziabad'.",
    },
    coordinates: { lat: 28.6692, lng: 77.4538 },
    faqs: [
      {
        question: "Where is Digital FX located in Ghaziabad?",
        answer: "Our registered office and growth lab is located at Shop No. 210, Second Floor, Orbit Plaza, Crossings Republik, Ghaziabad (201016). You can visit our office or schedule an in-person strategy consultation anytime.",
      },
      {
        question: "Why should Ghaziabad businesses choose Digital FX?",
        answer: "Unlike remote or Delhi-based agencies that sell vanity metrics, Digital FX is an on-ground partner with documented client results (+₹6L client revenue), modern Next.js 16 engineering, transparent reporting, and zero lock-in contracts.",
      },
      {
        question: "How long does it take to rank #1 on Google Maps in Ghaziabad?",
        answer: "Most local clients in Ghaziabad see measurable rank jumps within 30 to 45 days after completing our GBP optimization, NAP consistency audit, and geo-tagged review syndication.",
      },
      {
        question: "What is your pricing for digital marketing in Ghaziabad?",
        answer: "Google Maps & Local SEO packages start at ₹2,000/month, custom high-speed websites start from ₹10,000 one-time, and 360° full-funnel retainers start at ₹25,000/month.",
      },
    ],
  },
  noida: {
    heroTagline: "Leading Digital Marketing Agency in Noida",
    metaTitle: "Best Digital Marketing Agency in Noida | SEO & Google Ads",
    metaDescription: "Leading digital marketing agency in Noida. Enterprise SEO, Google Ads, local search, and custom Next.js web development for high-growth tech and retail brands.",
    landmarks: [
      "Sector 62 IT & Institutional Park",
      "Sector 18 Commercial Hub & Atta Market",
      "Sector 63 B2B Industrial Corridor",
      "Noida Expressway Tech Zones (Sector 125-144)",
      "Sector 137 High-Rise Residential Hub",
      "Sector 104 Boutique Cafe & Retail Belt",
    ],
    primaryIndustries: [
      "SaaS, IT Services & B2B Technology",
      "Corporate Real Estate Developers & Builders",
      "Diagnostic Labs & Cosmetology Clinics",
      "Garment & Textile Export Houses (Sector 58/63)",
      "Luxury Home Interior & Architectural Studios",
    ],
    localChallenges: [
      "Extreme agency competition along Noida Expressway, driving up Google Ads CPCs to ₹120+ per click on commercial search terms.",
      "Local organic results dominated by low-relevance directories, making organic search authority critical.",
      "High mobile bounce rate from slow corporate WordPress templates.",
    ],
    localStrategyPoints: [
      "B2B Account-Based SEO: Dominating bottom-of-funnel keywords for enterprise SaaS, manufacturing, and commercial real estate.",
      "Sub-Second Next.js 16 Platforms: Engineered for high-speed corporate buyer evaluation.",
      "Google Maps 3-Pack Domination for Sector 18, Sector 62, and Expressway business hubs.",
      "Laser-targeted Google Search & LinkedIn ad funnels with strict negative keyword filters.",
    ],
    sampleCaseStudy: {
      clientType: "Enterprise B2B Cloud Solutions Provider",
      neighborhood: "Sector 62 IT Park, Noida",
      metrics: "3.8x Qualified Pipeline Value",
      result: "Built custom Next.js 16 landing pages, executed high-intent Google Search PPC, and drove ₹48L+ in verified enterprise contract opportunities in 90 days.",
    },
    coordinates: { lat: 28.5355, lng: 77.3910 },
    faqs: [
      {
        question: "Why should Noida businesses partner with Digital FX?",
        answer: "We bring modern engineering (sub-second Next.js 16 speed), proprietary ReviewFlow AI customer review automation, and proven performance marketing that delivers verified phone calls and sales pipeline.",
      },
      {
        question: "Can Digital FX handle B2B lead generation in Noida?",
        answer: "Yes, B2B lead generation is our core specialization. We combine high-intent Google Search ads, account-based retargeting, and technical schema SEO to deliver qualified business inquiries.",
      },
      {
        question: "What is the cost of digital marketing services in Noida?",
        answer: "Plans start at ₹2,000/month for Google Maps & Local SEO, ₹10,000 for custom web development, and ₹25,000/month for complete 360° performance retainers.",
      },
    ],
  },
  "greater-noida": {
    heroTagline: "Top Digital Marketing Agency in Greater Noida",
    metaTitle: "Digital Marketing Agency in Greater Noida | SEO & Lead Gen",
    metaDescription: "Digital marketing agency in Greater Noida helping colleges, real estate developers, and local businesses grow through SEO, Google Ads and Next.js web design.",
    landmarks: [
      "Knowledge Park Educational Corridor (I-V)",
      "Pari Chowk Commercial Hub",
      "Greater Noida West (Noida Extension)",
      "Surajpur Industrial Area & Toy City",
      "TechZone IT & Data Center Hub",
      "Alpha 1 & Beta 1 Commercial Complexes",
    ],
    primaryIndustries: [
      "Higher Education, Engineering & Medical Colleges",
      "Real Estate Developers & High-Rise Societies",
      "Automotive & Electronics Manufacturing (Surajpur)",
      "Data Centers & IT Infrastructure",
      "Furniture, Interior Fitouts & Home Decor",
    ],
    localChallenges: [
      "Rapid geographic expansion across Greater Noida West vs Greater Noida East creating fragmented search intent.",
      "High seasonal ad competition for student admissions and residential homebuyer keywords.",
      "Low lead-to-appointment conversion from generic web forms.",
    ],
    localStrategyPoints: [
      "Programmatic Local SEO capturing college admission and residential buyer searches.",
      "Google Maps 3-Pack Optimization across Pari Chowk, Knowledge Park, and Noida Extension.",
      "Mobile-First Sub-Second Next.js Web Funnels with 1-click WhatsApp lead capture.",
      "Targeted Google Search & Meta ad campaigns with automated lead notification.",
    ],
    sampleCaseStudy: {
      clientType: "Engineering & Management Institute",
      neighborhood: "Knowledge Park III, Greater Noida",
      metrics: "+340% Verified Admissions Inquiries",
      result: "Deployed programmatic local landing pages and Google Ads campaigns targeting Delhi NCR and West UP, capturing over 1,200 verified course applications in 90 days.",
    },
    coordinates: { lat: 28.4744, lng: 77.5040 },
    faqs: [
      {
        question: "How do you help educational institutes in Greater Noida?",
        answer: "We build high-converting course landing pages, optimize Google Ads for verified student inquiries, and implement WhatsApp automations that dramatically improve enrollment ratios.",
      },
      {
        question: "Do you serve businesses in Greater Noida West (Noida Extension)?",
        answer: "Yes, we have deep experience optimizing local businesses, clinics, and interior design studios across Noida Extension's high-rise residential belts.",
      },
    ],
  },
  delhi: {
    heroTagline: "Full-Service Digital Marketing Agency in Delhi",
    metaTitle: "Digital Marketing Agency in Delhi | Best SEO & Ads Company",
    metaDescription: "Full-service digital marketing agency in Delhi providing technical SEO, Google Ads PPC, social media management, and custom sub-second Next.js websites.",
    landmarks: [
      "Connaught Place (CP) Central District",
      "Nehru Place Electronics & IT Hub",
      "South Extension Commercial Corridor",
      "Netaji Subhash Place (NSP) Pitampura",
      "Okhla Industrial Area Phases 1-3",
      "Karol Bagh & Rajendra Place Commercial Belt",
      "Lajpat Nagar Central Market",
      "Dwarka Sector 12 Commercial Hub",
    ],
    primaryIndustries: [
      "Corporate Legal Practices & Financial Advisory",
      "Retail E-commerce & Direct-to-Consumer (D2C) Brands",
      "Super-Specialty Hospitals, IVF & Dental Centers",
      "Architectural Studios & Luxury Interior Design",
      "Manufacturing & International Export Consortia (Okhla)",
    ],
    localChallenges: [
      "Extreme organic density with thousands of competing agencies driving inflated search auction costs.",
      "Fragmented micro-local search intent where South Delhi consumers behave differently from West or North Delhi buyers.",
      "Wasted marketing spend on agencies delivering impressions instead of qualified phone calls and leads.",
    ],
    localStrategyPoints: [
      "Zonal Micro-Targeting: Hyper-local campaigns tailored to South Delhi, West Delhi, and Central business hubs.",
      "Enterprise Technical SEO with full JSON-LD Schema.org hierarchy.",
      "Sub-Second Next.js 16 Web Platforms loading in 0.8s on 5G/4G.",
      "Conversion Rate Optimization (CRO) with direct WhatsApp and phone call tracking.",
    ],
    sampleCaseStudy: {
      clientType: "Luxury Home Interior Architecture Firm",
      neighborhood: "South Extension & Greater Kailash (GK), Delhi",
      metrics: "42 High-Ticket Inquiries / Month (₹15L+ Ticket Size)",
      result: "Structured Schema.org LocalBusiness architecture with geo-fenced Meta Ad funnels generating genuine ₹15L+ residential interior projects.",
    },
    coordinates: { lat: 28.6139, lng: 77.2090 },
    faqs: [
      {
        question: "Why should Delhi businesses work with Digital FX?",
        answer: "We offer the technical depth of an enterprise engineering agency with the agility of a specialized growth partner. Our sub-second Next.js tech stack, transparent ROI tracking, and zero lock-in contracts set us apart from traditional Delhi agencies.",
      },
      {
        question: "How do you track leads and conversions?",
        answer: "We integrate Google Analytics 4, phone call tracking, and WhatsApp click tracking so you see the exact origin, cost-per-lead, and revenue generated from every campaign.",
      },
    ],
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
      metrics: "₹6 Lakh+ New Advisory Pipeline",
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

  // ================= DELHI NCR LOCALITIES =================
  indirapuram: {
    heroTagline: "Best Digital Marketing Agency in Indirapuram, Ghaziabad",
    metaTitle: "Best Digital Marketing Agency in Indirapuram | SEO & Google Ads",
    metaDescription: "Leading digital marketing agency in Indirapuram, Ghaziabad. We help local clinics, cafes, boutiques and salons rank #1 on Google Maps and drive high-intent leads.",
    landmarks: [
      "Aditya Mega Mall & Shipra Mall Corridor",
      "Kala Patthar Road Commercial Market",
      "Vaibhav Khand High-Street & Swarna Jayanti Park",
      "Ahinsa Khand 1 & 2 High-Rise Societies",
      "Nyay Khand Commercial Market",
      "Windsor Park Commercial Arcade",
      "Shakti Khand & Mangal Bazaar",
    ],
    primaryIndustries: [
      "Dental Clinics, Pediatricians & Maternity Centers",
      "Boutique Cafes, Bakeries & Cloud Kitchens",
      "Fitness Centers, Yoga & Pilates Studios",
      "Real Estate Resale & Rental Agencies",
      "Modular Kitchens, Interior Decor & Furniture Studios",
      "Beauty Salons, Spas & Skin Aesthetics Clinics",
    ],
    localChallenges: [
      "Extremely dense commercial competition with 50+ local healthcare and retail service providers clustered along Kala Patthar and Vaibhav Khand.",
      "Heavy reliance on traditional printed flyers and newspaper inserts that deliver zero measurable ROI or tracking.",
      "Outdated, slow mobile websites losing over 65% of mobile searches from busy Indirapuram residents.",
    ],
    localStrategyPoints: [
      "Google Maps 3-Pack Domination: Securing #1 positions for 'best dentist in Indirapuram', 'cafes near me', and high-commercial search phrases.",
      "Sub-Second Next.js Web Development: Mobile-first responsive sites loading under 0.8s on 5G/4G across all Indirapuram Khands.",
      "Geo-Fenced Meta & Google Ads: Precision targeting to residents within 3km of Aditya Mall and Kala Patthar Road.",
      "ReviewFlow AI Automated Reviews: Collecting 5-star Google reviews via tap-to-review standees to dominate local search authority.",
    ],
    sampleCaseStudy: {
      clientType: "Advanced Multi-Specialty Dental Clinic",
      neighborhood: "Vaibhav Khand & Kala Patthar, Indirapuram",
      metrics: "94+ New Patient Appointments / Month",
      result: "Revamped Google Business Profile, integrated ReviewFlow NFC cards, and achieved Rank #1 on Google Maps 3-Pack across Indirapuram in 45 days.",
    },
    coordinates: { lat: 28.6415, lng: 77.3714 },
    faqs: [
      {
        question: "Why should Indirapuram businesses choose Digital FX over Delhi agencies?",
        answer: "Digital FX is headquartered right next door in Crossings Republik, Ghaziabad. We understand Indirapuram's micro-neighborhoods (Vaibhav Khand, Ahinsa Khand, Kala Patthar) intimately, providing on-ground strategy, transparent reporting, and zero lock-in contracts.",
      },
      {
        question: "How quickly can my Indirapuram business rank on Google Maps?",
        answer: "Most local retail and clinic clients in Indirapuram see measurable rank jumps within 30 to 45 days after completing our GBP optimization, NAP consistency audit, and geo-tagged review syndication.",
      },
      {
        question: "Do you offer website development for Indirapuram service providers?",
        answer: "Yes, we build modern, custom Next.js 16 websites designed specifically for mobile speed and high conversions with direct 1-click WhatsApp and call buttons.",
      },
      {
        question: "What are your digital marketing packages for Indirapuram?",
        answer: "Our local SEO growth packages start at ₹2,000/month, custom high-speed websites start at ₹10,000 one-time, and 360° full-funnel retainers start at ₹25,000/month.",
      },
    ],
  },
  vaishali: {
    heroTagline: "Top Digital Marketing Agency in Vaishali, Ghaziabad",
    metaTitle: "Digital Marketing Agency in Vaishali | Local SEO & Google Ads",
    metaDescription: "Top digital marketing agency in Vaishali, Ghaziabad specializing in Google Maps 3-Pack SEO, high-speed Next.js websites, and targeted Google Ads funnels.",
    landmarks: [
      "Vaishali Metro Station (Blue Line) Commercial Corridor",
      "Mahagun Metro Mall & Cinepolis Arcade",
      "Sector 4 Central Market & Commercial Complex",
      "Sector 1 Commercial Belt & Ramprastha Green",
      "Max Super Specialty Hospital Corridor",
      "Sector 5 & Sector 9 Commercial Corridors",
    ],
    primaryIndustries: [
      "Specialty Clinics, Diagnostic Labs & IVF Centers",
      "Fine Dining, Multi-Cuisine Restaurants & Banquets",
      "Competitive Exam Coaching & Language Institutes",
      "Property Advisory, Commercial Leasing & Architects",
      "Wellness Salons, Hair Studios & Dermatology Clinics",
    ],
    localChallenges: [
      "Rapid transit commuter zone where potential clients make rapid mobile decisions while commuting via Vaishali Blue Line Metro.",
      "Local service providers losing patients and diners to Anand Vihar and East Delhi competitors due to unoptimized local SEO.",
      "Generic template websites taking 4+ seconds to load, causing 60%+ bounce rates.",
    ],
    localStrategyPoints: [
      "Local Search 3-Pack Optimization for Sector 4, Sector 1, and Mahagun Mall catchment areas.",
      "High-Speed Mobile Websites with 1-click call and WhatsApp appointment booking.",
      "Hyperlocal Meta & Google Ads targeting residents in Vaishali, Kaushambi, and Anand Vihar.",
      "Google Business Profile Review Automation via ReviewFlow AI.",
    ],
    sampleCaseStudy: {
      clientType: "Orthopedic & Sports Rehabilitation Center",
      neighborhood: "Sector 4 & Mahagun Mall Corridor, Vaishali",
      metrics: "+185% Inbound Appointments & Calls",
      result: "Restructured Google Business Profile, built a sub-second Next.js web application, and established #1 ranking for 'best physiotherapist in Vaishali'.",
    },
    coordinates: { lat: 28.6480, lng: 77.3411 },
    faqs: [
      {
        question: "Can Digital FX help my Vaishali clinic or business beat East Delhi competitors?",
        answer: "Yes! By capturing local search intent and Google Maps 3-Pack rankings in Vaishali and Anand Vihar border zones, we ensure local residents choose your clinic or business first without crossing the border.",
      },
      {
        question: "How long does local SEO take to deliver results in Vaishali?",
        answer: "Initial ranking improvements and call volume increases typically begin within 30 to 45 days, with top 3 Google Maps positions solidifying within 60 to 90 days.",
      },
      {
        question: "What digital marketing services do you provide in Vaishali?",
        answer: "We provide Google Maps Local SEO, Google Search Ads (PPC), Meta Ads, custom Next.js website design, and ReviewFlow AI customer review automation.",
      },
    ],
  },
  vasundhara: {
    heroTagline: "Digital Marketing Agency in Vasundhara, Ghaziabad",
    metaTitle: "Digital Marketing Agency in Vasundhara | Best SEO & Ads Company",
    metaDescription: "Digital marketing agency in Vasundhara, Ghaziabad helping local shops, medical centers, coaching institutes, and service brands dominate local search results.",
    landmarks: [
      "Sector 11 Commercial Complex & Market",
      "Sector 14 High-Street & Main Commercial Belt",
      "Sector 16 Commercial Arcade",
      "Mewar Institute of Management Corridor",
      "Atal Chowk & Sector 10 Commercial Hub",
      "Sector 1 & 2 Residential & Commercial Corridors",
    ],
    primaryIndustries: [
      "Pharmacies, Polyclinics & Pathology Labs",
      "Coaching Institutes, Pre-Schools & Daycares",
      "Building Hardware, Sanitaryware & Interior Paint Stores",
      "Apparel Boutiques, Tailoring Studios & Jewellery Shops",
      "Bakers, Confectioners & Local Catering Services",
    ],
    localChallenges: [
      "Local businesses struggle to pull customers from adjacent Indirapuram and Vaishali markets without digital search visibility.",
      "Lack of structured digital footprint leaving established offline retailers invisible to younger residents searching on smartphones.",
      "High competition on local coaching and diagnostic keywords.",
    ],
    localStrategyPoints: [
      "Google Maps 3-Pack Dominance across all Vasundhara sectors (1 through 19).",
      "Ultra-Fast Next.js Landing Pages optimized for instant phone call conversions.",
      "NAP (Name, Address, Phone) consistency across 50+ high-DA Indian business directories.",
      "Hyper-targeted social media advertising driving footfall to retail showrooms.",
    ],
    sampleCaseStudy: {
      clientType: "Modular Kitchen & Interior Hardware Studio",
      neighborhood: "Sector 14 & Atal Chowk, Vasundhara",
      metrics: "28 Qualified In-Store Design Consultations / Mo",
      result: "Deployed high-speed Next.js portfolio website and dominated Google Maps for 'modular kitchen Vasundhara', generating ₹38L in new residential fitouts.",
    },
    coordinates: { lat: 28.6609, lng: 77.3621 },
    faqs: [
      {
        question: "Why do Vasundhara businesses choose Digital FX?",
        answer: "We are local growth partners based in Ghaziabad with proven experience in Vasundhara's commercial corridors. We provide transparent ROI reporting and tangible customer inquiries.",
      },
      {
        question: "Do you offer Google Business Profile optimization for Vasundhara retailers?",
        answer: "Yes, we optimize categories, geo-tagged photos, service menus, and review syndication to secure your spot in the Google Maps 3-Pack.",
      },
      {
        question: "What is your pricing for Vasundhara digital marketing?",
        answer: "Plans start at ₹2,000/month for Google Maps & Local SEO, custom websites from ₹10,000, and comprehensive retainers from ₹25,000/month.",
      },
    ],
  },
  "raj-nagar-extension": {
    heroTagline: "Digital Marketing Agency in Raj Nagar Extension, Ghaziabad",
    metaTitle: "Digital Marketing Agency in Raj Nagar Extension | SEO & PPC",
    metaDescription: "Digital marketing agency in Raj Nagar Extension, Ghaziabad providing Google Maps 3-Pack SEO, lead generation, social media ads, and custom web development.",
    landmarks: [
      "KDP Grand Savanna & Officer City Commercial Hub",
      "River Heights Commercial Arcade",
      "Meerut Bypass Road Commercial Corridor",
      "VVIP Addresses & Raj Nagar Extension Main Road",
      "MCC Signature Heights & Charms Castle Belts",
      "DPS & GD Goenka School Corridor",
    ],
    primaryIndustries: [
      "Turnkey Interior Designers & Modular Furniture Makers",
      "High-Rise Residential Society Home Services",
      "Pediatric, Dental & Maternity Clinics for Young Families",
      "Playschools, Activity Centers & Martial Arts Academies",
      "Fitness Gyms, Crossfit & Yoga Centers",
      "Property Resale, Rental & Commercial Leasing",
    ],
    localChallenges: [
      "Massive residential population (100,000+ residents) searching on mobile devices daily, but local businesses lack verified Google presence.",
      "Hyper-dense competition among interior designers and medical clinics for society residents' attention.",
      "Wasted marketing spend on paper leaflets scattered at society security gates.",
    ],
    localStrategyPoints: [
      "Google Maps 3-Pack Ranking for Raj Nagar Extension, Morta, and Meerut Road searchers.",
      "Hyperlocal Meta Ads geo-fenced to high-rise townships (VVIP Addresses, Officer City, River Heights).",
      "Sub-Second Next.js Mobile Web Design with 1-click WhatsApp quote requests.",
      "ReviewFlow AI Automated Tap-to-Review systems for clinics and retail showrooms.",
    ],
    sampleCaseStudy: {
      clientType: "Turnkey Home Interior & Modular Furniture Studio",
      neighborhood: "KDP Commercial Corridor, Raj Nagar Extension",
      metrics: "₹48L+ Signed Residential Interior Contracts in 90 Days",
      result: "Targeted Google Search PPC and local Google Maps optimization capturing newly moved high-rise society homeowners searching for interior designers.",
    },
    coordinates: { lat: 28.7118, lng: 77.4262 },
    faqs: [
      {
        question: "How can my Raj Nagar Extension business reach residents of high-rise societies?",
        answer: "We use geo-fenced digital advertising and Google Maps 3-Pack optimization that targets residents within a 2-3 km radius of Raj Nagar Extension's high-rise societies.",
      },
      {
        question: "Do you help interior designers get clients in Raj Nagar Extension?",
        answer: "Yes, we specialize in high-ticket lead generation for interior design and modular kitchen studios, generating qualified inquiries from new homeowners.",
      },
      {
        question: "How soon can we see leads in Raj Nagar Extension?",
        answer: "Paid Google Ads and Meta campaigns start generating qualified WhatsApp inquiries within 24 to 48 hours. Google Maps 3-Pack rankings climb within 30 to 45 days.",
      },
    ],
  },

  // ================= METRO HUBS (KOLKATA, CHENNAI, GURGAON, BANGALORE) =================
  kolkata: {
    heroTagline: "Premier Digital Marketing Agency in Kolkata",
    metaTitle: "Digital Marketing Agency in Kolkata | SEO & Google Ads Company",
    metaDescription: "Digital marketing agency in Kolkata helping retail, corporate, and healthcare businesses scale through SEO, Google Ads, social media, and web development.",
    landmarks: [
      "Salt Lake Sector V IT & Tech Cluster",
      "Park Street Commercial & Entertainment Corridor",
      "Rajarhat New Town Financial & Action Area",
      "Camac Street & Theatre Road Corporate Belt",
      "BBD Bagh & Dalhousie Heritage Financial Center",
      "Gariahat & South City Retail Belts",
    ],
    primaryIndustries: [
      "IT Services, Software Development & BPM (Sector V)",
      "Corporate Headquarters (Mining, Metals, Tea & Jute)",
      "Jewellery & Bridal Handloom Retail (Bowbazar & Gariahat)",
      "Super-Specialty Hospitals & Medical Tourism",
      "Real Estate & Modern Residential Townships (New Town)",
    ],
    localChallenges: [
      "Slow, outdated legacy agency websites suffering high bounce rates on regional mobile networks.",
      "Cross-border and multi-state search intent from Eastern India and Bangladesh requiring specialized medical and educational SEO.",
      "Intense competition in Salt Lake Sector V IT services and corporate consulting.",
    ],
    localStrategyPoints: [
      "Next.js 16 Sub-Second Web Platforms built to load under 0.8s across Kolkata mobile networks.",
      "Google Maps 3-Pack Domination for corporate, healthcare, and retail businesses.",
      "Full Schema.org Entity Integration connecting businesses to Google Knowledge Graph.",
      "High-Intent Paid Search campaigns maximizing ROAS in retail and B2B sectors.",
    ],
    sampleCaseStudy: {
      clientType: "Super-Specialty Cardiac & Diagnostic Hospital",
      neighborhood: "Salt Lake & EM Bypass, Kolkata",
      metrics: "240+ Inpatient & Diagnostic Consultations / Mo",
      result: "Secured top Google Maps 3-Pack rankings across Kolkata and Eastern India with medical schema, patient review automation, and health search clusters.",
    },
    coordinates: { lat: 22.5726, lng: 88.3639 },
    faqs: [
      {
        question: "Why choose Digital FX for digital marketing in Kolkata?",
        answer: "We deploy cutting-edge Next.js 16 web architecture (loading in 0.8s) and verified Google Maps 3-Pack playbooks focused on revenue and attributable leads, not vanity impressions.",
      },
      {
        question: "Can you help Kolkata healthcare and IT businesses attract international clients?",
        answer: "Yes, our cross-border SEO and Generative Engine Optimization (GEO) strategies help Kolkata enterprises capture clients from Bangladesh, Southeast Asia, and Western markets.",
      },
      {
        question: "What are your service packages for Kolkata businesses?",
        answer: "Local SEO packages start at ₹2,000/month, custom websites start at ₹10,000 one-time, and 360° growth retainers start at ₹25,000/month.",
      },
    ],
  },
  chennai: {
    heroTagline: "Leading Digital Marketing Agency in Chennai",
    metaTitle: "Digital Marketing Agency in Chennai | Best SEO & Ads Company",
    metaDescription: "Digital marketing agency in Chennai providing technical SEO, Google Ads management, social media marketing, and custom Next.js web development.",
    landmarks: [
      "OMR (Old Mahabalipuram Road) IT Expressway",
      "T. Nagar Retail & Commercial Hub",
      "Guindy Industrial Estate & Ekkattuthangal",
      "Anna Nagar Commercial Corridor",
      "Nungambakkam & Mount Road Corporate Belts",
      "Ambattur Industrial Estate & Tech Parks",
    ],
    primaryIndustries: [
      "Automobile & EV Manufacturing (The Detroit of South Asia)",
      "SaaS, IT Services & Global Capability Centers (GCCs)",
      "Healthcare, Medical Tourism & Multi-Specialty Hospitals",
      "Textiles, Silk Sarees & Gold Jewellery (T. Nagar)",
      "Leather & Footwear Export Consortia",
    ],
    localChallenges: [
      "Bilingual search intent (Tamil and English) requiring culturally nuanced on-page optimization.",
      "Global capability centers on OMR demanding enterprise-grade web security and sub-second performance.",
      "High Cost-Per-Click in healthcare, education, and real estate niches.",
    ],
    localStrategyPoints: [
      "B2B Technical Spec SEO: Product catalog optimization capturing global procurement directors.",
      "Google Maps 3-Pack Domination for T. Nagar, Anna Nagar, and Guindy commercial hubs.",
      "Sub-Second Next.js Architecture ensuring 0.7s load time on Indian 5G networks.",
      "ReviewFlow AI Automated Tap-to-Review systems for retail and hospital chains.",
    ],
    sampleCaseStudy: {
      clientType: "Tier-1 Automotive Ancillary & Precision Tooling Exporter",
      neighborhood: "Guindy Industrial Estate & OMR, Chennai",
      metrics: "34 Global RFQs from European & US Carmakers",
      result: "Rebuilt technical export portal on Next.js 16 with multilingual schema, capturing international automotive procurement directors.",
    },
    coordinates: { lat: 13.0827, lng: 80.2707 },
    faqs: [
      {
        question: "How does Digital FX support Chennai's B2B and automotive exporters?",
        answer: "We engineer technical B2B catalogs with Schema.org specifications and execute targeted international SEO, generating corporate RFQs from US, European, and APAC buyers.",
      },
      {
        question: "Do you optimize websites for bilingual search in Chennai?",
        answer: "Yes, we handle bilingual search patterns and semantic keyword clustering to ensure you capture both English and regional language search intent.",
      },
      {
        question: "What are your pricing plans for Chennai enterprises?",
        answer: "Local SEO starts at ₹2,000/month, custom Next.js web development from ₹10,000, and full-funnel corporate growth retainers from ₹25,000/month.",
      },
    ],
  },
  gurgaon: {
    heroTagline: "Premier Digital Marketing Agency in Gurgaon (Gurugram)",
    metaTitle: "Digital Marketing Agency in Gurgaon | SEO, PPC & Web Development",
    metaDescription: "Best digital marketing agency in Gurgaon helping startups, B2B companies, and corporate brands scale with high-ROI Google Ads, SEO, and Next.js web design.",
    landmarks: ["Cyber City", "Golf Course Road", "Sohna Road", "Udyog Vihar", "Sector 29", "MG Road"],
    primaryIndustries: ["Fintech & Startups", "Corporate Real Estate", "Luxury Automotive", "High-End Medical Services", "Coworking & Commercial Spaces"],
    localChallenges: [
      "India's highest paid advertising CPCs in corporate and wealth management niches.",
      "Tech-savvy consumers relying heavily on AI search tools (Perplexity, ChatGPT) alongside traditional Google search.",
    ],
    localStrategyPoints: [
      "Enterprise GEO & AI Search Placement (ChatGPT, Perplexity, Google AI Overviews).",
      "Sub-Second Next.js 16 Platforms designed for high-conversion corporate buyer evaluation.",
      "Laser-targeted B2B Account-Based Google Search & LinkedIn Ad funnels.",
      "Google Maps 3-Pack authority across Cyber City, Golf Course Road, and Sohna Road.",
    ],
    sampleCaseStudy: {
      clientType: "Angel-Backed B2B Logistics Scale-up",
      neighborhood: "Cyber City & Udyog Vihar, Gurgaon",
      metrics: "318% Organic Search Traffic Growth",
      result: "Deployed Generative Engine Optimization (GEO) and technical SEO, making the company the default recommended logistics vendor in AI Search Overviews.",
    },
    coordinates: { lat: 28.4595, lng: 77.0266 },
    faqs: [
      {
        question: "How does Digital FX handle high CPCs on Google Ads in Gurgaon?",
        answer: "We deploy negative keyword sculpting, high-relevance Quality Score landing pages, and account-based retargeting, slashing wasted spend and delivering 4x higher ROAS.",
      },
      {
        question: "Do you provide AI Search (GEO) optimization for Gurgaon tech firms?",
        answer: "Yes, we format your digital entity, citations, and PR footprint so AI engines like Perplexity, ChatGPT, and Google AI Overviews cite your company as the leading authority.",
      },
    ],
  },
  bangalore: {
    heroTagline: "Data-Driven Digital Marketing Agency in Bangalore (Bengaluru)",
    metaTitle: "Digital Marketing Agency in Bangalore | SEO & Performance Growth",
    metaDescription: "Data-driven digital marketing and SEO agency in Bangalore driving organic growth, Google Ads ROI, and high-speed Next.js web development for tech and retail.",
    landmarks: ["Whitefield", "Koramangala", "Indiranagar", "Electronic City", "HSR Layout", "Outer Ring Road"],
    primaryIndustries: ["AI & DeepTech Startups", "Global SaaS", "Hardware Engineering", "Specialty Coffee & F&B", "Co-living & Modern Real Estate"],
    localChallenges: [
      "Ultra-technical buyer demographic that ignores generic marketing and demands verifiable technical authority.",
      "AI-driven search behavior with over 45% of tech founders using ChatGPT and Perplexity for vendor evaluations.",
    ],
    localStrategyPoints: [
      "Programmatic SEO & Technical Documentation Indexing for SaaS & Product Tech.",
      "Sub-Second Next.js 16 Web Engineering with zero layout shift.",
      "Generative Engine Optimization (GEO) for AI Search Visibility.",
      "Full-Funnel Paid Search targeting enterprise tech decision-makers.",
    ],
    sampleCaseStudy: {
      clientType: "Enterprise Developer Tools SaaS",
      neighborhood: "Koramangala & HSR Layout, Bangalore",
      metrics: "5.4x Demo Signups from Organic Search",
      result: "Engineered programmatic technical documentation indexing, JSON-LD API Schemas, and GEO entity optimization, reducing blended customer acquisition cost by 62%.",
    },
    coordinates: { lat: 12.9716, lng: 77.5946 },
    faqs: [
      {
        question: "Why do Bangalore tech founders and brands choose Digital FX?",
        answer: "We don't use dated agency templates. We code custom Next.js 16 web applications, implement strict API schema architectures, and optimize for AI Search (GEO) with measurable CAC reduction.",
      },
      {
        question: "How does Digital FX help SaaS companies in Bangalore scale?",
        answer: "Through high-intent bottom-of-funnel SEO, programmatic landing pages, and precision Google Search PPC targeting commercial software buyers.",
      },
    ],
  },

  // ================= GLOBAL INTERNATIONAL HUBS =================
  dubai: {
    landmarks: [
      "Downtown Dubai & Burj Khalifa",
      "Business Bay Commercial Towers",
      "Dubai Marina & JBR",
      "DIFC (Dubai International Financial Centre)",
      "Palm Jumeirah Luxury Corridor",
      "Dubai Healthcare City & Jumeirah",
    ],
    primaryIndustries: [
      "Real Estate & Luxury Off-Plan Developers",
      "Aesthetics, Plastic Surgery & Cosmetology Clinics",
      "Dental Implant Centers & Healthcare",
      "Fine Dining, Beach Clubs & Hospitality",
      "Yacht Charters & Exotic Car Rentals",
      "Corporate Law, Tax & DIFC Wealth Management",
      "Crypto, Web3 & FinTech Ventures",
      "Commercial Fitout & Architecture",
    ],
    localChallenges: [
      "Sky-high Cost-Per-Click (CPC) on Google Ads in Dubai (often exceeding AED 45 - AED 120 per click on real estate, aesthetic clinics, and legal terms).",
      "Fierce local competition where legacy agencies charge inflated AED 25,000+ monthly retainers without transparent ROAS or pipeline reporting.",
      "Slow, outdated WordPress websites taking over 3 seconds to load on UAE 5G networks, causing over 65% of affluent mobile users to bounce.",
    ],
    sampleCaseStudy: {
      clientType: "Luxury Real Estate Brokerage & Off-Plan Advisory",
      neighborhood: "Downtown Dubai & Business Bay",
      metrics: "AED 34M+ High-Ticket Investor Pipeline",
      result: "Rebuilt property acquisition portal on sub-second Next.js 16, secured Rank #1 for high-intent off-plan queries across Dubai, and generated 240+ verified HNW investor inquiries within 90 days.",
    },
    coordinates: { lat: 25.2048, lng: 55.2708 },
  },





  london: {
    landmarks: [
      "City of London Financial Square",
      "Canary Wharf Banking Hub",
      "Shoreditch Tech City",
      "West End Commercial",
      "Mayfair Luxury Corridor",
    ],
    primaryIndustries: [
      "Fintech & Open Banking Services",
      "Property Investment & Commercial Real Estate",
      "B2B Professional Services & Corporate Law",
      "D2C E-commerce Scaleups",
      "Private Harley Street Clinics",
    ],
    sampleCaseStudy: {
      clientType: "FCA-Regulated Boutique Wealth Advisory",
      neighborhood: "City of London & Mayfair",
      metrics: "£14M+ Inbound AUM Inquiries",
      result: "High-intent Google Ads PPC and Generative AI search optimization positioning the firm as the top wealth advisory in UK AI Overviews.",
    },
    coordinates: { lat: 51.5074, lng: -0.1278 },
  },

  singapore: {
    landmarks: [
      "Marina Bay Financial Centre",
      "Raffles Place Central",
      "Orchard Road Commercial District",
      "One-North Tech Cluster",
      "Jurong Industrial Belt",
    ],
    primaryIndustries: [
      "Regional APAC Corporate Headquarters",
      "Fintech & Wealth Tech Platforms",
      "Global Supply Chain & Logistics",
      "Biotech & Specialty Healthcare",
      "Cross-Border B2B Trade",
    ],
    sampleCaseStudy: {
      clientType: "Cross-Border Logistics & Freight Scaleup",
      neighborhood: "Marina Bay & Jurong",
      metrics: "$2.4M Verified APAC Contract Inquiries",
      result: "Custom Next.js web architecture and localized search optimization establishing dominant authority across Singapore and Southeast Asia.",
    },
    coordinates: { lat: 1.3521, lng: 103.8198 },
  },
};

export const STATE_META_DESCRIPTIONS: Record<string, string> = {
  "uttar-pradesh": "Digital marketing and SEO services for businesses across Uttar Pradesh, including local SEO, Google Ads, social media and web development.",
  "maharashtra": "Digital marketing services for Maharashtra businesses including SEO, Google Ads, social media marketing and website development for growing brands.",
  "karnataka": "SEO, Google Ads, and performance digital marketing services for startups, tech firms, and enterprises across Bengaluru and Karnataka.",
  "tamil-nadu": "Grow your enterprise in Tamil Nadu with data-driven SEO, Google Ads management, social media marketing, and high-performance web development.",
  "gujarat": "Scale your business across Gujarat with ROI-focused digital marketing, local SEO, Google Ads, and custom website development services.",
  "delhi-nct": "Comprehensive digital marketing and search engine optimization services for businesses, retail stores, and corporate brands across Delhi NCR.",
  "haryana": "Digital marketing and local SEO solutions for industrial, corporate, and retail businesses across Gurugram, Faridabad, and Haryana.",
  "rajasthan": "Expand your customer reach across Rajasthan with targeted local SEO, Google Ads, social media marketing, and custom web development.",
  "west-bengal": "Results-driven digital marketing and SEO services for businesses in Kolkata and West Bengal, driving qualified inquiries and revenue.",
  "telangana": "Scalable digital marketing, SEO, and paid performance advertising services for businesses, clinics, and startups across Telangana.",
  "kerala": "Modern digital marketing and local SEO services for businesses across Kerala, helping brands increase qualified local inquiries and footfall.",
  "punjab": "Accelerate business growth in Punjab with strategic SEO, Google Ads, social media marketing, and responsive website development services.",
  "madhya-pradesh": "Performance-led digital marketing and local search optimization services for growing retail, healthcare, and commercial businesses in Madhya Pradesh.",
  "bihar": "Grow your enterprise in Bihar with proven digital marketing services, including Google Maps ranking, local SEO, and paid lead generation.",
  "odisha": "Digital marketing and SEO services for businesses in Odisha, offering Google Maps optimization, performance ads, and web development.",
  "andhra-pradesh": "Expand your market across Andhra Pradesh with ROI-driven digital marketing, local SEO, paid search advertising, and website development.",
  "chhattisgarh": "Strategic digital marketing and local SEO solutions for commercial enterprises, retail chains, and industrial businesses across Chhattisgarh.",
  "jharkhand": "Custom digital marketing and search engine optimization services for industrial, healthcare, education, and retail businesses in Jharkhand.",
  "uttarakhand": "Grow your tourism, hospitality, education, or healthcare business in Uttarakhand with local SEO, Google Ads, and modern web development.",
  "himachal-pradesh": "Specialized digital marketing and local search optimization services for hospitality, trade, and retail businesses across Himachal Pradesh.",
  "goa": "Digital marketing and SEO services tailored for hospitality, tourism, real estate, and retail businesses operating across North and South Goa.",
  "assam": "Expand your regional customer reach in Assam with professional SEO, Google Ads, social media marketing, and web development services.",
  "chandigarh": "Digital marketing and local SEO services for businesses, clinics, and retail brands across Chandigarh Capital Region and Tricity.",
  "jammu-kashmir": "Local SEO, search advertising, and custom web development services helping businesses in Jammu & Kashmir connect with high-intent buyers.",
  "puducherry": "Digital marketing and local search engine optimization services for retail, hospitality, and healthcare businesses in Puducherry.",
  "andaman-nicobar-islands": "Digital marketing and web development services tailored for tourism, hospitality, and local enterprises in the Andaman & Nicobar Islands.",
  "dadra-nagar-haveli-and-daman-diu": "Digital marketing, SEO, and paid advertising solutions for manufacturing units, industrial brands, and local trade in Daman and Diu.",
  "ladakh": "Targeted digital marketing, local search optimization, and web development solutions for hospitality and adventure businesses in Ladakh.",
  "lakshadweep": "Digital marketing and website solutions for tourism, travel operators, and local service providers across the Lakshadweep Islands.",
  "sikkim": "Search engine optimization and digital marketing solutions for hospitality, eco-tourism, and commercial businesses across Sikkim.",
  "tripura": "Digital marketing and local search optimization services helping businesses and retail trade across Tripura expand digital visibility.",
  "meghalaya": "SEO, social media, and web development services helping hospitality, education, and retail businesses across Meghalaya grow online.",
  "manipur": "Targeted digital marketing and local SEO solutions for retail, education, healthcare, and commercial businesses operating in Manipur.",
  "nagaland": "Digital marketing and search optimization services for local enterprises, retail brands, and service businesses across Nagaland.",
  "mizoram": "Strategic digital marketing and website development services helping businesses and professionals in Mizoram reach active local customers.",
  "arunachal-pradesh": "Search engine optimization, Google Ads, and web development services for tourism, trade, and commercial businesses in Arunachal Pradesh.",
};

export const CITY_META_DESCRIPTIONS: Record<string, string> = {
  "ghaziabad": "Digital FX is the best digital marketing agency in Ghaziabad. We help local clinics, retailers, and manufacturers rank #1 on Google Maps & Google Ads.",
  "noida": "Leading digital marketing agency in Noida. Enterprise SEO, Google Ads, local search, and custom Next.js web development for high-growth businesses.",
  "greater-noida": "Digital marketing agency in Greater Noida helping colleges, real estate developers, and local businesses grow through SEO, Google Ads and web development.",
  "delhi": "Full-service digital marketing agency in Delhi providing technical SEO, Google Ads PPC, social media management, and custom sub-second websites.",
  "gurgaon": "Best digital marketing agency in Gurgaon helping startups, B2B companies, and corporate brands scale with Google Ads, SEO, and Next.js web design.",
  "gurugram": "Performance digital marketing and SEO agency in Gurugram delivering high-ROI Google Ads, local SEO, and scalable web development for corporate brands.",
  "faridabad": "Results-driven digital marketing agency in Faridabad helping manufacturers, clinics, and local brands scale with SEO and Google Ads.",
  "indirapuram": "Leading digital marketing agency in Indirapuram, Ghaziabad. We help local clinics, cafes, and retail businesses rank #1 on Google Maps & generate leads.",
  "vaishali": "Top digital marketing agency in Vaishali, Ghaziabad specializing in Google Maps local SEO, high-speed websites, and targeted Google Ads funnels.",
  "vasundhara": "Digital marketing agency in Vasundhara, Ghaziabad helping local shops, medical centers, and service brands dominate local search results.",
  "raj-nagar-extension": "Digital marketing agency in Raj Nagar Extension, Ghaziabad providing Google Maps 3-Pack SEO, lead generation, and custom web development.",
  "mumbai": "Premier digital marketing agency in Mumbai specializing in performance SEO, paid search advertising, and enterprise web development.",
  "pune": "Digital marketing and SEO agency in Pune helping IT firms, real estate brands, and local businesses capture high-converting leads.",
  "bangalore": "Data-driven digital marketing and SEO agency in Bangalore driving organic growth, Google Ads ROI, and high-speed Next.js web development.",
  "bengaluru": "Data-driven digital marketing and SEO agency in Bangalore driving organic growth, Google Ads ROI, and high-speed web development.",
  "hyderabad": "Digital marketing and SEO services in Hyderabad helping healthcare, tech, and local enterprises acquire qualified customers online.",
  "ahmedabad": "Digital marketing agency in Ahmedabad delivering revenue-focused SEO, Google Ads management, and custom e-commerce web development.",
  "chennai": "Digital marketing agency in Chennai providing technical SEO, Google Ads management, social media marketing, and web development.",
  "kolkata": "Digital marketing agency in Kolkata helping retail, corporate, and healthcare businesses scale through SEO and paid search campaigns.",
  "jaipur": "Digital marketing agency in Jaipur offering local SEO, Google Ads management, social media campaigns, and custom web development.",
  "lucknow": "Digital marketing agency in Lucknow providing Google Maps ranking, SEO retainers, social media management, and web development.",
  "kanpur": "Digital marketing and SEO agency in Kanpur helping manufacturing, leather, and retail businesses capture qualified customer leads.",
  "indore": "Digital marketing agency in Indore delivering performance SEO, Google Ads PPC, and high-speed web design for growing businesses.",
  "bhopal": "Digital marketing agency in Bhopal helping local clinics, colleges, and retail stores grow through local SEO and search marketing.",
  "mohali": "Digital marketing and SEO services in Mohali helping tech startups, clinics, and local enterprises scale with Google Ads and SEO.",
  "kochi": "Digital marketing agency in Kochi providing performance SEO, Google Ads management, and custom web development for Kerala businesses.",
  "patna": "Digital marketing agency in Patna helping coaching institutes, clinics, and local retail businesses scale with SEO and Google Ads.",
  "surat": "Digital marketing agency in Surat helping textile, diamond, and retail businesses generate qualified leads through SEO and ads.",
  "nagpur": "Digital marketing agency in Nagpur delivering ROI-focused local SEO, Google Ads management, and responsive website development.",
  "visakhapatnam": "Digital marketing agency in Visakhapatnam providing SEO, Google Ads PPC, and web development for logistics and industrial brands.",
  "bhubaneswar": "Digital marketing agency in Bhubaneswar helping IT, healthcare, and education enterprises grow with SEO and paid advertising.",
  "ludhiana": "Digital marketing agency in Ludhiana helping manufacturing, apparel, and local commercial businesses scale through SEO and ads.",
  "dehradun": "Digital marketing agency in Dehradun helping schools, resorts, and healthcare clinics generate qualified leads with local SEO.",
  "vadodara": "Digital marketing agency in Vadodara offering performance SEO, Google Ads PPC, and custom website design for commercial businesses.",
  "coimbatore": "Digital marketing agency in Coimbatore delivering technical SEO, Google Ads management, and web development for manufacturing hubs.",
  "varanasi": "Digital marketing agency in Varanasi helping tourism, silk trade, and healthcare businesses grow through local SEO and Google Ads.",
  "agra": "Digital marketing agency in Agra providing local SEO, Google Ads PPC, and web development for footwear exporters and tourism brands.",
  "prayagraj": "Digital marketing agency in Prayagraj helping coaching centers, clinics, and retail stores grow with local SEO and digital ads.",
  "meerut": "Digital marketing agency in Meerut delivering local SEO, Google Ads management, and high-speed web design for local manufacturers.",
  "amritsar": "Digital marketing agency in Amritsar providing local SEO, Google Ads, and website design for hospitality and retail businesses.",
  "nashik": "Digital marketing agency in Nashik helping industrial, wine, and agricultural businesses scale with SEO and paid performance ads.",
  "rajkot": "Digital marketing agency in Rajkot offering SEO, Google Ads management, and web development for engineering and manufacturing units.",
  "cuttack": "Digital marketing agency in Cuttack helping legal, healthcare, and commercial trade businesses expand through local SEO and PPC.",
  "alappuzha": "Digital marketing agency in Alappuzha providing local SEO, web development, and digital ads for resorts, tourism, and local trade.",
  "kottayam": "Digital marketing agency in Kottayam helping healthcare clinics, colleges, and local businesses grow with SEO and digital marketing.",
  "rewari": "Digital marketing agency in Rewari delivering local SEO, Google Business Profile optimization, and lead generation for local trade.",
  "lajpat-nagar": "Local SEO and digital marketing agency in Lajpat Nagar helping retail stores, clinics, and fashion boutiques attract local customers.",
  "dharmanagar": "Digital marketing agency in Dharmanagar providing local SEO, Google Business Profile setup, and web design for regional businesses.",
  "diglipur": "Digital marketing and web development services in Diglipur helping local tourism operators and island businesses grow online.",
  "dubai": "Digital marketing and SEO agency in Dubai delivering high-converting Google Ads, local search visibility, and custom web development.",
  "abu-dhabi": "Digital marketing and SEO services in Abu Dhabi helping commercial enterprises, B2B firms, and corporate brands scale online.",
  "sharjah": "Digital marketing agency in Sharjah providing performance SEO, Google Ads PPC, and responsive website development for businesses.",
  "riyadh": "Digital marketing agency in Riyadh delivering search engine optimization, performance advertising, and modern web applications.",
  "doha": "Digital marketing and SEO services in Doha helping commercial businesses and brands scale through targeted search and paid advertising.",
  "new-york": "Digital marketing and SEO agency in New York providing technical search optimization, paid search management, and web engineering.",
  "london": "Digital marketing agency in London delivering data-driven search optimization, performance PPC, and bespoke web platforms.",
  "singapore": "Digital marketing agency in Singapore providing enterprise SEO, Google Ads management, and high-performance website development.",
  "toronto": "Digital marketing and SEO agency in Toronto delivering scalable search engine optimization, paid media campaigns, and web solutions.",
  "sydney": "Digital marketing and SEO agency in Sydney helping businesses grow with strategic search optimization, Google Ads, and web design.",
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
  let bespokeKey = normalizedSlug;
  if (!BESPOKE_LOCATION_DATA[bespokeKey]) {
    if (bespokeKey === "gurgaon") bespokeKey = "gurugram";
    else if (bespokeKey === "gurugram") bespokeKey = "gurgaon";
    else if (bespokeKey === "bangalore") bespokeKey = "bengaluru";
    else if (bespokeKey === "bengaluru") bespokeKey = "bangalore";
  }
  const bespoke = BESPOKE_LOCATION_DATA[bespokeKey] || {};

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
      heroTagline: `Digital Marketing & Local SEO Agency Serving ${name}`,
      metaTitle: normalizedSlug === "delhi-nct" ? "Digital Marketing Services in Delhi NCR" : `Digital Marketing Agency in ${name}`,
      metaDescription: STATE_META_DESCRIPTIONS[normalizedSlug] || `Digital marketing and SEO services for businesses across ${name}, including local SEO, Google Ads, social media and web development.`,
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
    heroTagline: bespoke.heroTagline || `Digital Marketing & Local SEO Agency Serving ${name}, ${stateName}`,
    metaTitle: bespoke.metaTitle || (normalizedSlug === "ghaziabad" ? "Best Digital Marketing Agency in Ghaziabad - Digital FX" : `Digital Marketing Agency in ${name} | Best SEO & Ads Company`),
    metaDescription: bespoke.metaDescription || CITY_META_DESCRIPTIONS[normalizedSlug] || CITY_META_DESCRIPTIONS[bespokeKey] || `Digital marketing agency in ${name} helping local businesses grow through SEO, Google Ads, social media marketing and web development.`,
    landmarks,
    primaryIndustries,
    localChallenges,
    localStrategyPoints: bespoke.localStrategyPoints || localStrategyPoints,
    sampleCaseStudy,
    coordinates,
    keywords: bespoke.keywords || [
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
    faqs: bespoke.faqs && bespoke.faqs.length > 0 ? bespoke.faqs : [
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
