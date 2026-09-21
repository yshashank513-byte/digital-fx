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

  // 3. International Commercial & Offshore Hubs (Dubai Flagship)
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
  "ghaziabad", "noida", "delhi", "gurugram", "faridabad", "mumbai", "pune",
  "bengaluru", "hyderabad", "ahmedabad", "chennai", "kolkata", "jaipur",
  "lucknow", "kanpur", "indore", "bhopal", "chandigarh", "mohali", "kochi",
  "patna", "surat", "nagpur", "visakhapatnam", "bhubaneswar", "ludhiana",
  "dehradun", "vadodara", "coimbatore", "varanasi", "agra", "prayagraj",
  "meerut", "amritsar", "nashik", "rajkot"
];

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
      metaTitle: `Best Digital Marketing Agency in ${name} | State-Wide SEO & Google Maps`,
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
    metaTitle: `Best Digital Marketing Agency in ${name} | SEO & Google Maps Ranking`,
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
