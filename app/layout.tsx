import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  CORE_CUSTOMER_SEARCH_KEYWORDS,
  ALL_INDIA_AREA_SERVED_SCHEMA,
} from "@/lib/indiaLocations";
import WhatsAppFloatingWidget from "@/components/WhatsAppFloatingWidget";

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
    default: "Digital FX | Best Digital Marketing Agency in Ghaziabad - Delhi NCR & Pan-India",
    template: "%s | Digital FX",
  },

  description:
    "Digital FX is the #1 rated (4.9★) digital marketing agency in Ghaziabad - Delhi NCR serving businesses across all 28 States and 8 UTs of India & USA. High-converting SEO, Google Maps 3-Pack domination, custom web development, Google & Meta Ads, and AI search optimization (GEO).",

  keywords: CORE_CUSTOMER_SEARCH_KEYWORDS,

  applicationName: "Digital FX",

  alternates: {
    canonical: "https://www.digitalfx.in",
  },

  openGraph: {
    type: "website",
    url: "https://www.digitalfx.in",
    siteName: "Digital FX",
    title: "Digital FX | Best Digital Marketing Agency in Ghaziabad - Delhi NCR",
    description:
      "Digital FX is the #1 rated (4.9★ from 128+ reviews) best digital marketing agency in Ghaziabad - Delhi NCR. Local SEO, Google Maps ranking, web development, and performance ads across India & USA.",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 1024,
        alt: "Digital FX | Best Digital Marketing Agency in Ghaziabad - Delhi NCR",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "Digital FX | Best Digital Marketing Agency in Ghaziabad - Delhi NCR",
    description:
      "4.9★ Rated Best Digital Marketing & SEO Agency in Ghaziabad - Delhi NCR serving clients across India and USA.",
    images: ["/logo.png"],
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
      { url: "/logo.png", type: "image/png" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/logo.png",
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
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="shortcut icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
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
                  "Digital FX",
                  "Digital FX Ghaziabad",
                  "Best Digital Marketing Agency in Ghaziabad - Delhi",
                  "Digital Marketing Agency Delhi NCR",
                  "Digital FX Marketing Agency",
                ],
                url: "https://www.digitalfx.in",
                logo: "https://www.digitalfx.in/logo.png",
                image: "https://www.digitalfx.in/logo.png",
                description:
                  "Digital FX is the best digital marketing agency in Ghaziabad - Delhi NCR offering local SEO, Google Maps Top 3 ranking, Google Ads PPC, website development, and AI search optimization for clients across India and the USA.",
                telephone: "+91 84475 83685",
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
                  "https://wa.me/918447583685",
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
                areaServed: ALL_INDIA_AREA_SERVED_SCHEMA,
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
                      "Their B2B lead generation campaigns brought us high-ticket manufacturing inquiries across NCR and international orders from US clients. Highly professional team and transparent ROI.",
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
                  "Best Digital Marketing & SEO Agency in Ghaziabad - Delhi NCR serving India & USA",
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
                    name: "Why is Digital FX ranked as the best digital marketing agency in Ghaziabad - Delhi NCR?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Digital FX holds a 4.9/5.0 verified rating with 128+ reviews from business owners. Headquartered at Orbit Plaza, Crossings Republik, Ghaziabad, we combine hyper-local SEO, Google Maps 3-Pack domination, high-converting web architecture, and AI search optimization (GEO) to deliver verified phone inquiries and measurable revenue across Ghaziabad, Delhi NCR, India, and USA.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Do you serve clients outside Ghaziabad, including other Indian states and USA / international businesses?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes! While our physical headquarters is at Orbit Plaza, Crossings Republik, Ghaziabad (Delhi NCR), Digital FX serves fast-growing companies across India (Mumbai, Bangalore, Hyderabad, Pune, Kolkata, Ahmedabad) and overseas in the USA (New York, California, Texas, Florida, Illinois). We provide offshore digital marketing, technical SEO, high-speed Next.js websites, and international Google Ads management with dedicated timezone support.",
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
        <WhatsAppFloatingWidget />
      </body>
    </html>
  );
}