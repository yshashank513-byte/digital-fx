import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/payment/"],
    },
    sitemap: "https://www.digitalfx.in/sitemap.xml",
  };
}