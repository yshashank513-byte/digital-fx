import { BusinessCategory, QuestionTemplate } from "./reviewFlowTypes";

export interface CategoryMetadata {
  id: string;
  name: BusinessCategory;
  icon: string;
  badge: string;
  description: string;
  accentColor: string;
  sampleDraft: string;
}

export const CATEGORIES_LIST: CategoryMetadata[] = [
  {
    id: "packers-movers",
    name: "Packers & Movers",
    icon: "🚚",
    badge: "Logistics & Shifting",
    description: "Home shifting, vehicle transport, office relocation and packing services.",
    accentColor: "#0284c7",
    sampleDraft: "Had a seamless shifting experience with the team. Packing quality was top-notch with zero damage to fragile items. The crew was courteous, loaded carefully, and delivered right on time.",
  },
  {
    id: "jewellery-store",
    name: "Jewellery Store",
    icon: "💎",
    badge: "Gold, Diamonds & Luxury",
    description: "Showrooms, bridal collections, hallmark gold and certified diamond stores.",
    accentColor: "#d97706",
    sampleDraft: "Wonderful shopping experience! Their gold and diamond collection has stunning modern designs. The sales staff explained the hallmark purity transparently and were very patient.",
  },
  {
    id: "restaurant",
    name: "Restaurant",
    icon: "🍽️",
    badge: "Dining & Cafe",
    description: "Fine dining, family restaurants, cafes, bakeries and cloud kitchens.",
    accentColor: "#e11d48",
    sampleDraft: "Great food and vibrant ambiance! Every dish was freshly prepared and full of flavor. The staff provided quick service and polite hospitality. Highly recommended for family dinners.",
  },
  {
    id: "salon",
    name: "Salon",
    icon: "💇",
    badge: "Beauty & Grooming",
    description: "Hair styling, luxury salons, beauty clinics and wellness spas.",
    accentColor: "#db2777",
    sampleDraft: "Loved my visit! The stylists are highly skilled, polite, and take the time to understand your style. Clean hygiene standards and premium products used. Very refreshing service.",
  },
  {
    id: "hotel",
    name: "Hotel",
    icon: "🏨",
    badge: "Hospitality & Stays",
    description: "Hotels, resorts, homestays, executive suites and banquet halls.",
    accentColor: "#0d9488",
    sampleDraft: "Comfortable and pleasant stay! The room was spotless with great amenities and quick room service. The front desk staff was welcoming and made check-in effortless.",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    icon: "🏢",
    badge: "Property & Builders",
    description: "Residential flats, commercial projects, real estate consultancies and plots.",
    accentColor: "#4f46e5",
    sampleDraft: "Very professional real estate consultation. Transparent documentation, clear answers to all my legal queries, and honest advice on property ROI. Reliable and trustworthy team.",
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing Agency",
    icon: "📈",
    badge: "SEO & Growth",
    description: "SEO agencies, Google Ads specialists, performance marketing and web development.",
    accentColor: "#207de9",
    sampleDraft: "Outstanding digital growth partner! The Digital FX team delivered measurable organic ranking improvements on Google Maps and high-intent customer inquiries. Clear reporting and pro-active communication.",
  },
  {
    id: "automobile-dealer",
    name: "Automobile Dealer",
    icon: "🚗",
    badge: "Showrooms & Workshops",
    description: "Car/bike showrooms, authorized service centers and detailing studios.",
    accentColor: "#2563eb",
    sampleDraft: "Excellent experience at the dealership! Smooth test drive, transparent pricing with all discount options explained. Timely delivery and prompt follow-up from the sales executive.",
  },
  {
    id: "clothing-store",
    name: "Clothing Store",
    icon: "👗",
    badge: "Fashion & Retail",
    description: "Men's, women's, ethnic, bridal wear and retail apparel outlets.",
    accentColor: "#9333ea",
    sampleDraft: "Great variety of trendy outfits and traditional wear. The fabric quality is impressive and fitting options are well-organized. Helpful staff and smooth billing.",
  },
  {
    id: "electronics-store",
    name: "Electronics Store",
    icon: "⚡",
    badge: "Appliances & Tech",
    description: "Mobile phones, laptops, home appliances and electronic retail centers.",
    accentColor: "#0891b2",
    sampleDraft: "Huge selection of genuine electronics and latest gadgets. The sales advisors provided hands-on demos and explained warranty coverage clearly. Fast billing and safe delivery.",
  },
  {
    id: "clinic",
    name: "Clinic",
    icon: "🩺",
    badge: "Healthcare & Doctors",
    description: "Dental clinics, polyclinics, diagnostic centers and specialist doctor clinics.",
    accentColor: "#059669",
    sampleDraft: "Doctor gave detailed consultation and patiently explained the diagnosis and treatment plan. Well-sanitized clinic, minimal waiting time, and attentive support staff.",
  },
  {
    id: "education-coaching",
    name: "Education/Coaching",
    icon: "🎓",
    badge: "Institutes & Tutors",
    description: "Competitive exam coaching, schools, skill institutes and tuition centers.",
    accentColor: "#ca8a04",
    sampleDraft: "Exceptional faculty and structured study material. Concept clarity and regular doubt-solving sessions have boosted student confidence tremendously. Disciplined academic atmosphere.",
  },
  {
    id: "local-services",
    name: "Local Services",
    icon: "🛠️",
    badge: "Repairs & Maintenance",
    description: "Electricians, plumbers, AC repair, home cleaning and pest control services.",
    accentColor: "#64748b",
    sampleDraft: "Very prompt and reliable local service. Technician diagnosed the problem quickly, used genuine replacement parts, and left the workspace clean. Fair and transparent pricing.",
  },
  {
    id: "other",
    name: "Other",
    icon: "⭐",
    badge: "General Business",
    description: "Custom businesses, creative studios, legal services and boutique shops.",
    accentColor: "#475569",
    sampleDraft: "Had a really satisfying experience. High attention to detail, transparent communication, and polite team. Will definitely recommend them to friends and family.",
  },
];

export const CATEGORY_QUESTIONS: Record<BusinessCategory, QuestionTemplate[]> = {
  "Packers & Movers": [
    {
      id: "pm-1",
      question: "How was your overall experience with the team?",
      category: "Packers & Movers",
      shortKey: "overall",
      type: "chips",
      options: ["Smooth & Hassle-free", "Very Good", "Satisfactory", "Average"],
    },
    {
      id: "pm-2",
      question: "How was the packing quality and safety of your goods?",
      category: "Packers & Movers",
      shortKey: "packing",
      type: "chips",
      options: ["Multi-layer / No damage", "Carefully packed", "Decent", "Minor scratches"],
    },
    {
      id: "pm-3",
      question: "How was the staff behaviour & professionalism?",
      category: "Packers & Movers",
      shortKey: "staff",
      type: "chips",
      options: ["Courteous & Helpful", "Trained & Hardworking", "Polite", "Neutral"],
    },
    {
      id: "pm-4",
      question: "Was loading and unloading handled properly?",
      category: "Packers & Movers",
      shortKey: "handling",
      type: "chips",
      options: ["Careful with heavy & glass items", "Organized & Quick", "Satisfactory"],
    },
    {
      id: "pm-5",
      question: "How was the delivery timeliness?",
      category: "Packers & Movers",
      shortKey: "delivery",
      type: "chips",
      options: ["On-time delivery", "Slight delay but informed", "Ahead of schedule"],
    },
  ],

  "Jewellery Store": [
    {
      id: "js-1",
      question: "How was the collection and variety of designs?",
      category: "Jewellery Store",
      shortKey: "collection",
      type: "chips",
      options: ["Stunning & Modern", "Traditional & Elegant", "Wide Variety", "Decent Selection"],
    },
    {
      id: "js-2",
      question: "How was the staff guidance and consultation?",
      category: "Jewellery Store",
      shortKey: "staff",
      type: "chips",
      options: ["Patient & Informative", "Very Helpful", "Friendly", "Courteous"],
    },
    {
      id: "js-3",
      question: "Were you satisfied with pricing transparency & hallmark purity?",
      category: "Jewellery Store",
      shortKey: "transparency",
      type: "chips",
      options: ["100% Certified / Transparent billing", "Fair Making Charges", "Satisfactory"],
    },
    {
      id: "js-4",
      question: "How was your overall shopping experience?",
      category: "Jewellery Store",
      shortKey: "overall",
      type: "chips",
      options: ["Luxurious & Comfortable", "Delightful", "Smooth & Quick"],
    },
  ],

  "Restaurant": [
    {
      id: "res-1",
      question: "How was the taste and freshness of the food?",
      category: "Restaurant",
      shortKey: "food",
      type: "chips",
      options: ["Delicious & Flavorful", "Fresh & Well-seasoned", "Good Portion Size", "Average"],
    },
    {
      id: "res-2",
      question: "How was the service speed and staff hospitality?",
      category: "Restaurant",
      shortKey: "service",
      type: "chips",
      options: ["Quick & Attentive", "Warm Hospitality", "Friendly", "Prompt"],
    },
    {
      id: "res-3",
      question: "How did you find the ambiance and cleanliness?",
      category: "Restaurant",
      shortKey: "ambiance",
      type: "chips",
      options: ["Vibrant & Cozy", "Family Friendly", "Spotless Hygiene", "Pleasant"],
    },
    {
      id: "res-4",
      question: "Would you visit again and recommend to others?",
      category: "Restaurant",
      shortKey: "recommend",
      type: "chips",
      options: ["Definitely visiting again!", "Highly recommended", "Yes, worth a try"],
    },
  ],

  "Salon": [
    {
      id: "sal-1",
      question: "Which service did you take and how was the result?",
      category: "Salon",
      shortKey: "service",
      type: "chips",
      options: ["Haircut & Styling (Superb)", "Skin / Facial Treatment (Glowing)", "Beard & Grooming", "Spa / Relaxing"],
    },
    {
      id: "sal-2",
      question: "How was the stylist / aesthetician expertise?",
      category: "Salon",
      shortKey: "stylist",
      type: "chips",
      options: ["Understood my exact requirements", "Very Skilled & Professional", "Knowledgeable"],
    },
    {
      id: "sal-3",
      question: "How was the salon hygiene and products used?",
      category: "Salon",
      shortKey: "hygiene",
      type: "chips",
      options: ["Premium Brand Products", "Clean & Sanitized Tools", "Comfortable Ambiance"],
    },
  ],

  "Hotel": [
    {
      id: "hot-1",
      question: "How was the room comfort and cleanliness?",
      category: "Hotel",
      shortKey: "room",
      type: "chips",
      options: ["Spotless & Comfortable Bed", "Spacious with Great View", "Clean & Well Maintained"],
    },
    {
      id: "hot-2",
      question: "How was the front desk and room service hospitality?",
      category: "Hotel",
      shortKey: "service",
      type: "chips",
      options: ["Swift Check-in & Helpful Staff", "Prompt Room Service", "Courteous Team"],
    },
    {
      id: "hot-3",
      question: "How was the food and amenities?",
      category: "Hotel",
      shortKey: "amenities",
      type: "chips",
      options: ["Delicious Breakfast Buffet", "Great Pool & Wi-Fi", "Convenient Location"],
    },
  ],

  "Real Estate": [
    {
      id: "re-1",
      question: "How was the property consultation and options provided?",
      category: "Real Estate",
      shortKey: "consultation",
      type: "chips",
      options: ["Tailored to my budget & requirements", "Prime Location Options", "Honest Guidance"],
    },
    {
      id: "re-2",
      question: "How was transparency regarding legalities and paperwork?",
      category: "Real Estate",
      shortKey: "transparency",
      type: "chips",
      options: ["100% Clear & Transparent", "Assisted with documentation", "Professional handling"],
    },
    {
      id: "re-3",
      question: "How was the sales executive's responsiveness?",
      category: "Real Estate",
      shortKey: "responsiveness",
      type: "chips",
      options: ["Prompt updates & site visits", "Patient with all queries", "Trustworthy advice"],
    },
  ],

  "Digital Marketing Agency": [
    {
      id: "dma-1",
      question: "How has the campaign ROI and organic growth been?",
      category: "Digital Marketing Agency",
      shortKey: "growth",
      type: "chips",
      options: ["Significant boost in leads & calls", "Higher Google Maps 3-Pack rank", "Measurable Revenue Lift", "Steady Progress"],
    },
    {
      id: "dma-2",
      question: "How is the technical & strategic expertise of the team?",
      category: "Digital Marketing Agency",
      shortKey: "technical",
      type: "chips",
      options: ["Deep SEO & Ads expertise", "High-speed modern website", "AI-ready optimization"],
    },
    {
      id: "dma-3",
      question: "How is the communication and weekly reporting?",
      category: "Digital Marketing Agency",
      shortKey: "reporting",
      type: "chips",
      options: ["Transparent dashboard & reports", "Proactive & responsive team", "Regular review calls"],
    },
  ],

  "Automobile Dealer": [
    {
      id: "ad-1",
      question: "How was your test drive and vehicle selection experience?",
      category: "Automobile Dealer",
      shortKey: "selection",
      type: "chips",
      options: ["Smooth test drive & wide choice", "Executive explained all features", "Comfortable visit"],
    },
    {
      id: "ad-2",
      question: "How was the pricing clarity and delivery process?",
      category: "Automobile Dealer",
      shortKey: "delivery",
      type: "chips",
      options: ["Clear on discounts & on-time delivery", "Quick loan/finance assistance", "Transparent quotation"],
    },
    {
      id: "ad-3",
      question: "How was the staff hospitality?",
      category: "Automobile Dealer",
      shortKey: "hospitality",
      type: "chips",
      options: ["Warm & Courteous", "Professional throughout", "Prompt follow-up"],
    },
  ],

  "Clothing Store": [
    {
      id: "cs-1",
      question: "How did you find the collection and fabric quality?",
      category: "Clothing Store",
      shortKey: "collection",
      type: "chips",
      options: ["Trendy styles & premium fabric", "Great fitting options", "Value for money"],
    },
    {
      id: "cs-2",
      question: "How was the staff assistance and trial experience?",
      category: "Clothing Store",
      shortKey: "assistance",
      type: "chips",
      options: ["Helpful with sizing & choices", "Quick service & neat trial rooms", "Friendly staff"],
    },
  ],

  "Electronics Store": [
    {
      id: "es-1",
      question: "How was the product availability and demo?",
      category: "Electronics Store",
      shortKey: "demo",
      type: "chips",
      options: ["Live demo was very clear", "Latest models in stock", "Good comparison of brands"],
    },
    {
      id: "es-2",
      question: "How was billing, warranty and pricing?",
      category: "Electronics Store",
      shortKey: "pricing",
      type: "chips",
      options: ["Great festive offer / cashback", "Warranty explained clearly", "Quick billing"],
    },
  ],

  "Clinic": [
    {
      id: "cl-1",
      question: "How was the doctor's consultation and explanation?",
      category: "Clinic",
      shortKey: "doctor",
      type: "chips",
      options: ["Thorough checkup & patient listening", "Clear explanation of treatment", "Reassuring & expert care"],
    },
    {
      id: "cl-2",
      question: "How was clinic hygiene and appointment management?",
      category: "Clinic",
      shortKey: "hygiene",
      type: "chips",
      options: ["Spotless clinic & sterilized tools", "Minimal waiting time", "Courteous nursing staff"],
    },
  ],

  "Education/Coaching": [
    {
      id: "ec-1",
      question: "How is the teaching methodology and faculty expertise?",
      category: "Education/Coaching",
      shortKey: "faculty",
      type: "chips",
      options: ["Clear concept explanation", "Helpful doubt-clearing sessions", "Experienced mentors"],
    },
    {
      id: "ec-2",
      question: "How is the study material and test series?",
      category: "Education/Coaching",
      shortKey: "material",
      type: "chips",
      options: ["Comprehensive & exam-oriented", "Regular tests with feedback", "Well-structured notes"],
    },
  ],

  "Local Services": [
    {
      id: "ls-1",
      question: "How was the technician's punctuality and problem diagnosis?",
      category: "Local Services",
      shortKey: "diagnosis",
      type: "chips",
      options: ["Arrived on time & identified issue quickly", "Professional inspection", "Polite technician"],
    },
    {
      id: "ls-2",
      question: "How was the work quality and pricing?",
      category: "Local Services",
      shortKey: "quality",
      type: "chips",
      options: ["Fixed properly on first visit", "Cleaned up area afterwards", "Fair & upfront pricing"],
    },
  ],

  "Other": [
    {
      id: "oth-1",
      question: "How was your overall experience with our service?",
      category: "Other",
      shortKey: "overall",
      type: "chips",
      options: ["Exceeded Expectations", "Very Satisfied", "Good & Helpful", "Satisfactory"],
    },
    {
      id: "oth-2",
      question: "How was the staff communication and support?",
      category: "Other",
      shortKey: "support",
      type: "chips",
      options: ["Responsive & Professional", "Friendly & Courteous", "Prompt assistance"],
    },
  ],
};

/**
 * Intelligent local natural draft synthesizer (offline/heuristic fallback if OpenAI is unavailable).
 */
export function synthesizeReviewDraftLocally(
  businessName: string,
  category: BusinessCategory,
  rating: number,
  answers: Record<string, string>,
  optionalNotes?: string
): string {
  const parts: string[] = [];
  const entries = Object.entries(answers).filter(([_, v]) => Boolean(v && v.trim()));

  // Tone base
  if (rating >= 5) {
    parts.push(`Had an exceptional experience with ${businessName}.`);
  } else if (rating === 4) {
    parts.push(`Had a really good experience with the team at ${businessName}.`);
  } else if (rating === 3) {
    parts.push(`Visited ${businessName} recently for their ${category} service.`);
  } else {
    parts.push(`Sharing my honest feedback regarding my experience with ${businessName}.`);
  }

  // Inject category-specific answer sentences
  for (const [key, val] of entries) {
    const cleanVal = val.toLowerCase();
    if (cleanVal.includes("packing") || cleanVal.includes("damage")) {
      parts.push(`The packing quality was ${val.toLowerCase()}, ensuring our items stayed intact.`);
    } else if (cleanVal.includes("staff") || cleanVal.includes("courteous") || cleanVal.includes("polite") || cleanVal.includes("hardworking")) {
      parts.push(`The staff was ${val.toLowerCase()} and handled everything with good professionalism.`);
    } else if (cleanVal.includes("delivery") || cleanVal.includes("time") || cleanVal.includes("punctual")) {
      parts.push(`Delivery was ${val.toLowerCase()}.`);
    } else if (cleanVal.includes("collection") || cleanVal.includes("design") || cleanVal.includes("variety")) {
      parts.push(`Their collection was ${val.toLowerCase()} with impressive variety.`);
    } else if (cleanVal.includes("food") || cleanVal.includes("taste") || cleanVal.includes("delicious") || cleanVal.includes("flavor")) {
      parts.push(`The food was ${val.toLowerCase()} and freshly served.`);
    } else if (cleanVal.includes("doctor") || cleanVal.includes("checkup") || cleanVal.includes("treatment")) {
      parts.push(`The doctor provided ${val.toLowerCase()} and addressed my concerns clearly.`);
    } else if (cleanVal.includes("lead") || cleanVal.includes("rank") || cleanVal.includes("roi") || cleanVal.includes("growth")) {
      parts.push(`We saw ${val.toLowerCase()} which significantly boosted our online visibility.`);
    } else {
      parts.push(`${val}.`);
    }
  }

  if (optionalNotes && optionalNotes.trim()) {
    parts.push(optionalNotes.trim());
  }

  if (rating >= 4) {
    parts.push(`Would definitely recommend them to anyone looking for reliable ${category} services.`);
  }

  return parts.join(" ");
}
