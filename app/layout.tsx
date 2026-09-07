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
    default: "Digital Marketing Agency in Ghaziabad | Digital FX",
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
    title: "Digital Marketing Agency in Ghaziabad | Digital FX",
    description:
      "Digital FX helps businesses grow online with SEO, Google Ads, social media marketing, website development, branding, local SEO and lead generation.",
    images: [
      {
        url: "/logo.webp",
        width: 512,
        height: 512,
        alt: "Digital FX - Digital Marketing Agency in Ghaziabad",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "Digital Marketing Agency in Ghaziabad | Digital FX",
    description:
      "SEO, Google Ads, social media marketing, websites, branding, local SEO and lead generation solutions by Digital FX.",
    images: ["/logo.webp"],
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
    icon: "/logo.webp",
    apple: "/logo.webp",
  },
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

              logo: "https://www.digitalfx.in/logo.webp",

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