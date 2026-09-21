import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/services",
          "/locations",
          "/global-markets",
          "/blog",
          "/privacy-policy",
          "/terms-and-conditions",
          "/refund-policy",
        ],
        disallow: ["/admin/", "/payment/", "/payments/", "/api/"],
      },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "PerplexityBot",
          "ClaudeBot",
          "Google-Extended",
          "Applebot-Extended",
          "Bingbot",
        ],
        allow: [
          "/",
          "/services",
          "/locations",
          "/global-markets",
          "/blog",
          "/privacy-policy",
          "/terms-and-conditions",
          "/refund-policy",
        ],
        disallow: ["/admin/", "/payment/", "/payments/", "/api/"],
      },
    ],
    sitemap: "https://www.digitalfx.in/sitemap.xml",
  };
}
