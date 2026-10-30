import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CityEnquiryForm from "@/components/CityEnquiryForm";
import { ALL_LOCATIONS_FLAT, PRIORITY_20_SEO_CITIES } from "@/lib/citySeoData";

export const metadata: Metadata = {
  title: "Best Digital Marketing Agency in India | Multi-City SEO & Performance Marketing",
  description:
    "Digital FX is India's premier digital marketing agency delivering Google Maps 3-Pack Local SEO, sub-second Next.js web applications, and high-ROI Google & Meta Ads across Delhi NCR and major Indian metros.",
  alternates: {
    canonical: "https://www.digitalfx.in/digital-marketing-agency",
  },
  openGraph: {
    title: "Best Digital Marketing Agency in India | Digital FX",
    description:
      "Full-service digital marketing agency serving Delhi NCR (Noida, Ghaziabad, Delhi, Gurgaon) and major Indian metros with Local SEO, Google Ads, and custom Next.js web development.",
    url: "https://www.digitalfx.in/digital-marketing-agency",
    siteName: "Digital FX",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Digital Marketing Agency in India - Digital FX",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Digital Marketing Agency in India | Digital FX",
    description:
      "Enterprise SEO, Google Maps 3-Pack ranking, and performance paid media across Delhi NCR and all major Indian commercial hubs.",
    images: ["/logo.png"],
  },
};

export default function DigitalMarketingAgencyIndexPage() {
  const ncrHubs = [
    {
      name: "Noida",
      slug: "noida",
      tagline: "Enterprise B2B, SaaS & Real Estate Growth",
      landmarks: "Sector 62, Sector 18 & Expressway",
    },
    {
      name: "Ghaziabad",
      slug: "ghaziabad",
      tagline: "Digital FX Registered HQ & Growth Lab",
      landmarks: "Orbit Plaza, Crossings Republik & RDC",
    },
    {
      name: "Delhi",
      slug: "delhi",
      tagline: "Full-Funnel Capital City Commercial SEO",
      landmarks: "CP, Nehru Place, South Ex & Okhla",
    },
    {
      name: "Greater Noida",
      slug: "greater-noida",
      tagline: "Higher Education & Township Lead Generation",
      landmarks: "Knowledge Park, Pari Chowk & TechZone",
    },
    {
      name: "Gurgaon",
      slug: "gurgaon",
      tagline: "Fintech, Startup & Corporate Paid Media",
      landmarks: "Cyber City, Golf Course Rd & Udyog Vihar",
    },
    {
      name: "Faridabad",
      slug: "faridabad",
      tagline: "Industrial OEM & Manufacturing B2B Funnels",
      landmarks: "NIT, Mathura Road & Sector 15",
    },
    {
      name: "Indirapuram",
      slug: "indirapuram",
      tagline: "Healthcare, Retail & Cafe 3-Pack SEO",
      landmarks: "Aditya Mall, Kala Patthar & Vaibhav Khand",
    },
    {
      name: "Vaishali",
      slug: "vaishali",
      tagline: "Metro Transit Corridor Clinics & Salons",
      landmarks: "Mahagun Metro Mall & Sector 4",
    },
    {
      name: "Vasundhara",
      slug: "vasundhara",
      tagline: "Local High-Street & Education Academy SEO",
      landmarks: "Sector 11, Sector 14 & Atal Chowk",
    },
    {
      name: "Raj Nagar Extension",
      slug: "raj-nagar-extension",
      tagline: "High-Rise Townships & Interior Design Leads",
      landmarks: "KDP Grand Savanna & River Heights",
    },
  ];

  const metroHubs = [
    {
      name: "Mumbai",
      slug: "mumbai",
      state: "Maharashtra",
      focus: "BFSI, Media, D2C & Luxury Living",
    },
    {
      name: "Bangalore",
      slug: "bangalore",
      state: "Karnataka",
      focus: "AI Startups, Global SaaS & Tech Ecosystems",
    },
    {
      name: "Hyderabad",
      slug: "hyderabad",
      state: "Telangana",
      focus: "Pharma, Super-Specialty Hospitals & IT",
    },
    {
      name: "Pune",
      slug: "pune",
      state: "Maharashtra",
      focus: "Automotive Precision & Engineering R&D",
    },
    {
      name: "Jaipur",
      slug: "jaipur",
      state: "Rajasthan",
      focus: "Gems, Jewellery, Heritage Tourism & Exports",
    },
    {
      name: "Lucknow",
      slug: "lucknow",
      state: "Uttar Pradesh",
      focus: "Apparel Exports, Healthcare & Real Estate",
    },
    {
      name: "Chandigarh",
      slug: "chandigarh",
      state: "Punjab & Haryana",
      focus: "Immigration, Visa Consultants & Healthcare",
    },
    {
      name: "Ahmedabad",
      slug: "ahmedabad",
      state: "Gujarat",
      focus: "Textiles, Chemicals, Pharma & Industrial",
    },
    {
      name: "Kolkata",
      slug: "kolkata",
      state: "West Bengal",
      focus: "IT Sector V, Corporate HQ & Medical Tourism",
    },
    {
      name: "Chennai",
      slug: "chennai",
      state: "Tamil Nadu",
      focus: "Automotive, SaaS GCCs & B2B Manufacturing",
    },
  ];

  const statesList = ALL_LOCATIONS_FLAT.filter((l) => l.isState);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.digitalfx.in",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Digital Marketing Agency",
          item: "https://www.digitalfx.in/digital-marketing-agency",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": "https://www.digitalfx.in/digital-marketing-agency#organization",
      name: "Digital FX — Best Digital Marketing Agency in India",
      url: "https://www.digitalfx.in/digital-marketing-agency",
      logo: "https://www.digitalfx.in/logo.png",
      image: "https://www.digitalfx.in/logo.png",
      description:
        "Digital FX is India's premier digital marketing agency delivering Google Maps 3-Pack Local SEO, sub-second Next.js web applications, and high-ROI Google & Meta Ads across Delhi NCR and major Indian metros.",
      telephone: "+91 93198 07273",
      email: "hello@digitalfx.in",
      priceRange: "₹₹ - ₹₹₹₹",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Shop No. 210, Second Floor, Orbit Plaza, Crossings Republik",
        addressLocality: "Ghaziabad",
        addressRegion: "Uttar Pradesh",
        postalCode: "201016",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 28.6258,
        longitude: 77.4378,
      },
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#1570ef] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar currentPath="/digital-marketing-agency" />

      {/* Breadcrumb Trail */}
      <nav aria-label="Breadcrumb" className="bg-slate-50 border-b border-slate-200/80 py-3">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#1570ef] transition font-medium">
            Home
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-[#1570ef] font-bold">Digital Marketing Agency Directory</span>
        </div>
      </nav>

      <main>
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-[#080d24] to-[#080d24] text-white pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(21,112,239,0.18),transparent_50%)] pointer-events-none" />
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-semibold text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>🇮🇳 Multi-City Growth Network • Delhi NCR &amp; Indian Metros</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                Best Digital Marketing Agency in{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                  India
                </span>
              </h1>

              <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
                Digital FX is a full-stack digital marketing agency and search engineering consultancy headquartered at Orbit Plaza, Crossings Republik, Ghaziabad. We help brands dominate Google Maps 3-Pack rankings, convert mobile users with 0.8s Next.js web applications, and scale revenue with precision paid media.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-400 font-medium">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <span className="text-emerald-400">✓</span> 10 Delhi NCR Dedicated Hubs
                </span>
                <span className="flex items-center gap-1.5 text-slate-200">
                  <span className="text-emerald-400">✓</span> 10 Top Indian Metros
                </span>
                <span className="flex items-center gap-1.5 text-slate-200">
                  <span className="text-emerald-400">✓</span> 28 States &amp; 8 UTs Coverage
                </span>
                <span className="flex items-center gap-1.5 text-slate-200">
                  <span className="text-emerald-400">✓</span> Zero Lock-In Contracts
                </span>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#ncr-hubs"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#1570ef] to-[#0d5ac9] hover:from-[#1264d8] text-white font-black text-sm sm:text-base shadow-xl shadow-blue-500/25 transition-all text-center"
                >
                  Explore Delhi NCR Hubs →
                </a>
                <a
                  href={`https://wa.me/919319807273?text=Hi%20Digital%20FX%20team,%20I%20want%20to%20discuss%20a%20digital%20marketing%20growth%20plan.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>💬 WhatsApp Strategy Desk</span>
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 1: DELHI NCR HUBS */}
        <section id="ncr-hubs" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
              <span className="text-xs font-black uppercase tracking-wider text-[#1570ef]">
                Capital Region Authority
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Delhi NCR Digital Marketing Hubs
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Headquartered in Ghaziabad, Digital FX provides on-ground strategy, localized Google Maps optimization, and high-performance search marketing across all core NCR commercial corridors:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {ncrHubs.map((hub) => (
                <Link
                  key={hub.slug}
                  href={`/digital-marketing-agency/${hub.slug}`}
                  className="group rounded-2xl border border-slate-200/90 p-6 hover:border-blue-400 hover:shadow-xl transition-all bg-white flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-[#1570ef] group-hover:text-blue-600 transition">
                        Delhi NCR
                      </span>
                      <span className="text-slate-400 group-hover:translate-x-1 transition text-sm font-bold">
                        →
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#1570ef] transition">
                      Agency in {hub.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      {hub.tagline}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span>📍</span>
                    <span>{hub.landmarks}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: TOP INDIAN METROS */}
        <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
              <span className="text-xs font-black uppercase tracking-wider text-[#1570ef]">
                Pan-India Enterprise Coverage
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Top Indian Metro Commercial Hubs
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Tailored performance marketing, enterprise SEO, and sub-second web platforms engineered for major state capitals and commercial metropolitan centers across India:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
              {metroHubs.map((hub) => (
                <Link
                  key={hub.slug}
                  href={`/digital-marketing-agency/${hub.slug}`}
                  className="group rounded-2xl bg-white border border-slate-200/90 p-5 hover:border-emerald-400 hover:shadow-lg transition-all space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                      {hub.state}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition">
                      {hub.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-snug line-clamp-2">
                      {hub.focus}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] font-bold text-[#1570ef] flex items-center gap-1 group-hover:translate-x-0.5 transition">
                    <span>View Hub</span>
                    <span>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: ALL 28 STATES DIRECTORY */}
        <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="max-w-3xl mx-auto text-center space-y-2 mb-10">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                All 28 States &amp; 8 Union Territories
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Pan-India State Regional Hubs
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-w-6xl mx-auto text-xs">
              {statesList.map((state) => (
                <Link
                  key={state.slug}
                  href={`/digital-marketing-agency/${state.slug}`}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/70 text-slate-700 hover:text-[#1570ef] font-semibold transition text-center truncate"
                >
                  {state.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: CONSULTATION & ENQUIRY FORM */}
        <section className="py-16 sm:py-24 bg-slate-900 text-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="max-w-2xl mx-auto rounded-3xl bg-white text-slate-900 p-8 sm:p-12 shadow-2xl space-y-6">
              <div className="text-center space-y-2">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#1570ef] text-xs font-extrabold uppercase tracking-wider">
                  Growth Advisory Desk
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Schedule a Free Growth Audit
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Connect directly with Digital FX senior strategists to review your local search visibility, paid media efficiency, and web speed.
                </p>
              </div>

              <CityEnquiryForm cityName="India" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
