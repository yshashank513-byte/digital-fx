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
    "Digital FX (4.9★) is Ghaziabad's top digital marketing agency. Dominating Google Maps 3-Pack, SEO, sub-second web design & high-ROI ads across India & USA.",

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
            ]),
          }}
        />

        {children}
        <WhatsAppFloatingWidget />
      </body>
    </html>
  );
}