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
    "Digital FX is a digital marketing agency in Ghaziabad providing SEO, Google Ads, social media marketing, website development, branding, local SEO and lead generation solutions for growing businesses.",

  keywords: [
    "digital marketing agency in Ghaziabad",
    "digital marketing agency Ghaziabad",
    "digital marketing company Ghaziabad",
    "SEO agency Ghaziabad",
    "SEO services Ghaziabad",
    "Google Ads agency Ghaziabad",
    "social media marketing Ghaziabad",
    "website development Ghaziabad",
    "local SEO Ghaziabad",
    "Google Business Profile Ghaziabad",
    "lead generation Ghaziabad",
    "digital marketing agency India",
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
      "Digital FX helps businesses grow online with SEO, Google Ads, social media marketing, website development, branding, local SEO and lead generation.",
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
      "SEO, Google Ads, social media marketing, websites, branding, local SEO and lead generation solutions by Digital FX.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",

              name: "Digital FX",

              url: "https://www.digitalfx.in",

              logo: "https://www.digitalfx.in/logo-white-bg.png",

              description:
                "Digital FX is a digital marketing agency in Ghaziabad providing SEO, Google Ads, social media marketing, website development, branding, local SEO and lead generation solutions.",

              telephone: "+91 98765 43210",

              address: {
                "@type": "PostalAddress",
                streetAddress:
                  "Second Floor, Orbit Plaza, 218, Crossings Republik",
                addressLocality: "Ghaziabad",
                addressRegion: "Uttar Pradesh",
                postalCode: "201016",
                addressCountry: "IN",
              },

              areaServed: [
                {
                  "@type": "City",
                  name: "Ghaziabad",
                },
                {
                  "@type": "State",
                  name: "Uttar Pradesh",
                },
                {
                  "@type": "Country",
                  name: "India",
                },
              ],

              serviceType: [
                "Digital Marketing",
                "SEO",
                "Local SEO",
                "Google Ads",
                "Social Media Marketing",
                "Website Development",
                "Lead Generation",
                "Branding",
              ],
            }),
          }}
        />

        {children}
      </body>
    </html>
  );
}