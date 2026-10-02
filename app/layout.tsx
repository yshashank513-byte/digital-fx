import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  CORE_CUSTOMER_SEARCH_KEYWORDS,
  ALL_INDIA_AREA_SERVED_SCHEMA,
} from "@/lib/indiaLocations";
// NfcPromoModal is lazy-loaded via a client wrapper to keep it off the critical path
import NfcPromoModalLoader from "@/components/NfcPromoModalLoader";


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#080d24",
};

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
    default: "Digital Marketing & SEO Agency in Ghaziabad",
    template: "%s",
  },

  description:
    "Digital marketing agency in Ghaziabad helping local businesses grow with SEO, Google Ads, social media marketing, web development and local SEO services.",

  keywords: CORE_CUSTOMER_SEARCH_KEYWORDS,

  applicationName: "Digital FX",

  alternates: {
    canonical: "https://www.digitalfx.in",
  },


  openGraph: {
    type: "website",
    url: "https://www.digitalfx.in",
    siteName: "Digital FX",
    title: "Digital Marketing & SEO Agency in Ghaziabad",
    description:
      "Digital marketing agency in Ghaziabad helping local businesses grow with SEO, Google Ads, social media marketing, web development and local SEO services.",
    images: [
      {
        url: "/logo.png",
        width: 2172,
        height: 724,
        alt: "Digital Marketing & SEO Agency in Ghaziabad - Digital FX",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Digital Marketing & SEO Agency in Ghaziabad",
    description:
      "Digital marketing agency in Ghaziabad helping local businesses grow with SEO, Google Ads, social media marketing, web development and local SEO services.",
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
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/favicon-48x48.png?v=2", type: "image/png", sizes: "48x48" },
      { url: "/favicon-96x96.png?v=2", type: "image/png", sizes: "96x96" },
      { url: "/favicon-32x32.png?v=2", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png?v=2", type: "image/png", sizes: "16x16" },
      { url: "/android-chrome-192x192.png?v=2", type: "image/png", sizes: "192x192" },
      { url: "/android-chrome-512x512.png?v=2", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=2",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased w-full max-w-full overflow-x-hidden`}
    >
      <head>
        {/* Critical resource hints — open connections with proper CORS attribution */}
        <link rel="preconnect" href="https://zmrcgpzptuodyndljydf.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://zmrcgpzptuodyndljydf.supabase.co" />
        <link rel="dns-prefetch" href="https://wa.me" />
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png?v=2" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png?v=2" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png?v=2" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" sizes="180x180" />
      </head>
      <body className="min-h-full flex flex-col w-full max-w-full overflow-x-hidden">
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
                telephone: "+91 93198 07273",
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
                  "https://wa.me/919319807273",
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
                alternateName: ["Digital FX Agency", "Digital FX Ghaziabad", "Digital FX Marketing"],
                description:
                  "Best Digital Marketing & SEO Agency in Ghaziabad - Delhi NCR serving India & USA",
                publisher: {
                  "@id": "https://www.digitalfx.in/#organization",
                },
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://www.digitalfx.in/locations?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
                hasPart: [
                  {
                    "@type": "WebPage",
                    "@id": "https://www.digitalfx.in/services",
                    url: "https://www.digitalfx.in/services",
                    name: "SEO & Digital Marketing Services",
                  },
                  {
                    "@type": "WebPage",
                    "@id": "https://www.digitalfx.in/careers",
                    url: "https://www.digitalfx.in/careers",
                    name: "Careers (We Are Hiring!)",
                  },
                  {
                    "@type": "WebPage",
                    "@id": "https://www.digitalfx.in/case-studies",
                    url: "https://www.digitalfx.in/case-studies",
                    name: "The Digital FX Portfolio",
                  },
                  {
                    "@type": "WebPage",
                    "@id": "https://www.digitalfx.in/pricing",
                    url: "https://www.digitalfx.in/pricing",
                    name: "Digital Marketing Packages & Pricing",
                  },
                  {
                    "@type": "WebPage",
                    "@id": "https://www.digitalfx.in/tools",
                    url: "https://www.digitalfx.in/tools",
                    name: "Free AI Search & GEO Audit Tool",
                  },
                  {
                    "@type": "WebPage",
                    "@id": "https://www.digitalfx.in/contact",
                    url: "https://www.digitalfx.in/contact",
                    name: "Contact & Strategy Advisory Desk",
                  },
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "SiteNavigationElement",
                "@id": "https://www.digitalfx.in/#sitelink-careers",
                name: "Careers (We Are Hiring!)",
                url: "https://www.digitalfx.in/careers",
                description:
                  "Explore open roles for SEO architects, performance media buyers, and full-stack engineers at Digital FX.",
              },
              {
                "@context": "https://schema.org",
                "@type": "SiteNavigationElement",
                "@id": "https://www.digitalfx.in/#sitelink-services",
                name: "SEO & Digital Marketing Services",
                url: "https://www.digitalfx.in/services",
                description:
                  "Enterprise search engine optimization, Google Maps 3-Pack domination, Connected TV, and performance paid media across India and USA.",
              },
              {
                "@context": "https://schema.org",
                "@type": "SiteNavigationElement",
                "@id": "https://www.digitalfx.in/#sitelink-case-studies",
                name: "The Digital FX Portfolio",
                url: "https://www.digitalfx.in/case-studies",
                description:
                  "Verified client case studies, ₹6 Lakh+ documented client revenue, and real performance ROAS breakdowns across industries.",
              },
              {
                "@context": "https://schema.org",
                "@type": "SiteNavigationElement",
                "@id": "https://www.digitalfx.in/#sitelink-pricing",
                name: "Digital Marketing Packages & Pricing",
                url: "https://www.digitalfx.in/pricing",
                description:
                  "Transparent monthly retainers and performance growth packages for local clinics, scaling brands, and multi-city enterprises.",
              },
              {
                "@context": "https://schema.org",
                "@type": "SiteNavigationElement",
                "@id": "https://www.digitalfx.in/#sitelink-tools",
                name: "Free AI Search & GEO Audit Tool",
                url: "https://www.digitalfx.in/tools",
                description:
                  "Run an instant 60-second Generative Engine Optimization (GEO) and AI search visibility audit for your business website.",
              },
              {
                "@context": "https://schema.org",
                "@type": "SiteNavigationElement",
                "@id": "https://www.digitalfx.in/#sitelink-locations",
                name: "Local SEO & 350+ Cities Directory",
                url: "https://www.digitalfx.in/locations",
                description:
                  "Explore Digital FX local SEO coverage across all 28 Indian States, 8 UTs, and major commercial hubs.",
              },
              {
                "@context": "https://schema.org",
                "@type": "SiteNavigationElement",
                "@id": "https://www.digitalfx.in/#sitelink-global",
                name: "Global Search Engineering (Dubai & US)",
                url: "https://www.digitalfx.in/global-markets",
                description:
                  "Enterprise SEO and digital growth strategy for UAE (Dubai, Abu Dhabi), USA, UK, and international exporters.",
              },
              {
                "@context": "https://schema.org",
                "@type": "SiteNavigationElement",
                "@id": "https://www.digitalfx.in/#sitelink-blog",
                name: "SEO & AI Search Insights Blog",
                url: "https://www.digitalfx.in/blog",
                description:
                  "Proven guides on Google Maps 3-Pack domination, Next.js web performance, and Generative Engine Optimization (GEO).",
              },
              {
                "@context": "https://schema.org",
                "@type": "SiteNavigationElement",
                "@id": "https://www.digitalfx.in/#sitelink-contact",
                name: "Contact & Strategy Advisory Desk",
                url: "https://www.digitalfx.in/contact",
                description:
                  "Book a direct consultation with Shashank Yadav and Digital FX senior growth strategists at Orbit Plaza, Crossings Republik.",
              },
            ]),
          }}
        />

        {children}
        <NfcPromoModalLoader />
      </body>
    </html>
  );
}