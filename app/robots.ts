import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/payment/", "/api/"],
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
        allow: ["/", "/locations/", "/blog/", "/privacy-policy", "/terms-and-conditions", "/refund-policy"],
        disallow: ["/admin/", "/payment/", "/api/"],
      },
    ],
    sitemap: "https://www.digitalfx.in/sitemap.xml",
  };
}
