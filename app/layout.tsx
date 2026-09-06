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
    default: "Digital FX | Digital Marketing Agency in India",
    template: "%s | Digital FX",
  },

  description:
    "Digital FX helps businesses grow online with SEO, Google Ads, social media marketing, website development, branding, lead generation and digital marketing solutions.",

  keywords: [
    "digital marketing agency",
    "digital marketing agency India",
    "SEO services",
    "SEO agency",
    "Google Ads management",
    "social media marketing",
    "website development",
    "lead generation",
    "local SEO",
    "Google Business Profile",
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
    title: "Digital FX | Digital Marketing Agency in India",
    description:
      "SEO, Google Ads, social media marketing, website development, branding and lead generation solutions for growing businesses.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Digital FX",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "Digital FX | Digital Marketing Agency in India",
    description:
      "Digital marketing solutions including SEO, Google Ads, social media, websites, branding and lead generation.",
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
    icon: "/logo.png",
    apple: "/logo.png",
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
              logo: "https://www.digitalfx.in/logo.png",
              description:
                "Digital FX is a digital marketing agency providing SEO, Google Ads, social media marketing, website development, branding and lead generation solutions.",
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
              sameAs: ["https://www.digitalfx.in"],
            }),
          }}
        />

        {children}
      </body>
    </html>
  );
}