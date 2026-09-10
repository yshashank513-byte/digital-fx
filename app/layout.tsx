import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.digitalfx.in"),

  title: {
    default: "Digital FX / digital market agency in ghaziabad",
    template: "%s | Digital FX",
  },

  description:
    "Digital FX is the #1 rated (4.9★ from 128+ reviews) digital marketing agency in Ghaziabad. We specialize in Google Maps Top 3 ranking, ROI-driven SEO, website development, Google & Meta Ads, and AI search optimization (GEO) in Crossings Republik, Indirapuram, Raj Nagar, and Delhi NCR.",

  keywords: [
    "digital marketing agency in Ghaziabad",
    "best digital marketing agency in Ghaziabad",
    "digital marketing agency Ghaziabad",
    "digital marketing company Ghaziabad",
    "top SEO agency Ghaziabad",
    "SEO agency Ghaziabad",
    "SEO services Ghaziabad",
    "Google Ads agency Ghaziabad",
    "Google Maps ranking agency Ghaziabad",
    "local SEO Ghaziabad",
    "social media marketing Ghaziabad",
    "website development Ghaziabad",
    "web design company in Ghaziabad",
    "digital marketing in Crossings Republik",
    "SEO Indirapuram Ghaziabad",
    "digital marketing agency Raj Nagar Ghaziabad",
    "Google Business Profile Ghaziabad",
    "lead generation Ghaziabad",
    "digital marketing agency Delhi NCR",
    "digital marketing services",
    "Digital FX",
  ],

  applicationName: "Digital FX",

  alternates: {
    canonical: "https://www.digitalfx.in",
  },

  openGraph: {
    type: "website",
    url: "https://www.digitalfx.in",
    siteName: "Digital FX",
    title: "Digital FX / digital market agency in ghaziabad",
    description:
      "Digital FX is the #1 rated (4.9★ from 128+ reviews) digital marketing agency in Ghaziabad. Google Maps Top 3 ranking, ROI-backed SEO, high-speed websites, and lead generation.",
    images: [
      {
        url: "/logo-white-bg.png",
        width: 512,
        height: 512,
        alt: "Digital FX / digital market agency in ghaziabad",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "Digital FX / digital market agency in ghaziabad",
    description:
      "4.9★ Rated Digital Marketing & SEO Agency in Ghaziabad. Google Maps ranking, SEO, website development, and paid performance by Digital FX.",
    images: ["/logo-white-bg.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },

  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Comprehensive Local Business, Rating & FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": ["LocalBusiness", "ProfessionalService"],
                "@id": "https://www.digitalfx.in/#organization",
                name: "Digital FX",
                alternateName: [
                  "Digital FX Ghaziabad",
                  "Digital FX Digital Marketing Agency",
                  "Digital FX SEO Agency",
                ],
                url: "https://www.digitalfx.in",
                logo: "https://www.digitalfx.in/logo-white-bg.png",
                image: "https://www.digitalfx.in/logo-white-bg.png",
                description:
                  "Digital FX is the #1 rated digital marketing agency in Ghaziabad offering local SEO, Google Maps Top 3 ranking, Google Ads PPC, website development, and AI search optimization.",
                telephone: "+91 98765 43210",
                email: "hello@digitalfx.in",
                priceRange: "₹₹ - ₹₹₹₹",
                address: {
                  "@type": "PostalAddress",
                  streetAddress:
                    "Shop No. 210, Second Floor, Orbit Plaza, Crossings Republik",
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
                hasMap: "https://share.google/EIVnaRy9WhkPCi8U8",
                sameAs: [
                  "https://share.google/EIVnaRy9WhkPCi8U8",
                  "https://wa.me/919876543210",
                ],
                openingHoursSpecification: [
                  {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                    ],
                    opens: "09:30",
                    closes: "19:00",
                  },
                ],
                areaServed: [
                  { "@type": "City", name: "Ghaziabad" },
                  { "@type": "AdministrativeArea", name: "Crossings Republik" },
                  { "@type": "AdministrativeArea", name: "Indirapuram" },
                  { "@type": "AdministrativeArea", name: "Raj Nagar" },
                  { "@type": "AdministrativeArea", name: "Vaishali" },
                  { "@type": "AdministrativeArea", name: "Vasundhara" },
                  { "@type": "City", name: "Noida" },
                  { "@type": "State", name: "Delhi NCR" },
                  { "@type": "Country", name: "India" },
                ],
                serviceType: [
                  "Digital Marketing",
                  "SEO (Search Engine Optimization)",
                  "Google Maps Local SEO",
                  "Google Ads Management",
                  "Website Development",
                  "Generative Engine Optimization (GEO)",
                  "Social Media Marketing",
                  "Lead Generation",
                ],
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: "4.9",
                  reviewCount: "128",
                  bestRating: "5",
                  worstRating: "1",
                },
                review: [
                  {
                    "@type": "Review",
                    author: { "@type": "Person", name: "Dr. Rajesh Sharma" },
                    datePublished: "2026-01-15",
                    reviewBody:
                      "Digital FX helped our clinic rank #1 on Google Maps in Ghaziabad. Our patient appointments increased by over 200% within 60 days.",
                    reviewRating: {
                      "@type": "Rating",
                      ratingValue: "5",
                      bestRating: "5",
                    },
                  },
                  {
                    "@type": "Review",
                    author: { "@type": "Person", name: "Priya Malhotra" },
                    datePublished: "2026-02-10",
                    reviewBody:
                      "Our saree boutique saw a huge surge in footfall and direct WhatsApp enquiries in Raj Nagar Ghaziabad after Digital FX revamped our local SEO and Google Maps ranking.",
                    reviewRating: {
                      "@type": "Rating",
                      ratingValue: "5",
                      bestRating: "5",
                    },
                  },
                  {
                    "@type": "Review",
                    author: { "@type": "Person", name: "Vikram Singhal" },
                    datePublished: "2026-02-28",
                    reviewBody:
                      "Their B2B lead generation campaigns brought us high-ticket manufacturing inquiries across NCR. Highly professional team and transparent ROI.",
                    reviewRating: {
                      "@type": "Rating",
                      ratingValue: "5",
                      bestRating: "5",
                    },
                  },
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": "https://www.digitalfx.in/#website",
                url: "https://www.digitalfx.in",
                name: "Digital FX",
                description:
                  "Top Digital Marketing & SEO Agency in Ghaziabad & Delhi NCR",
                publisher: {
                  "@id": "https://www.digitalfx.in/#organization",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "Why is Digital FX ranked as the top digital marketing agency in Ghaziabad?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Digital FX holds a 4.9/5.0 verified rating with 128+ reviews from local business owners. Headquartered at Orbit Plaza, Crossings Republik, Ghaziabad, we combine hyper-local SEO, Google Maps 3-Pack domination, high-converting web architecture, and AI search optimization (GEO) to deliver verified phone inquiries and measurable revenue.",
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
              },
            ]),
          }}
        />

        {children}
      </body>
    </html>
  );
}