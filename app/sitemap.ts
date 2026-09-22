import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blogData";
import { CANONICAL_LOCATION_SLUGS } from "@/lib/citySeoData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.digitalfx.in";
  // Use a fixed recent date so Googlebot sees fresh lastModified consistently
  const sitemapDate = new Date("2026-09-20T18:00:00.000Z");

  // Core 200-OK Indexable Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: sitemapDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: sitemapDate,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: sitemapDate,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: sitemapDate,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: sitemapDate,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: sitemapDate,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: sitemapDate,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: sitemapDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/global-markets`,
      lastModified: sitemapDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: sitemapDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: sitemapDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: sitemapDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: sitemapDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Verified In-Depth Blog Articles
  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: sitemapDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Canonical Authority Hubs Only (All 28 States, 8 UTs, Top 36 Indian Metros, 10 Global Hubs).
  // All secondary/minor locality pages (308 redirects) are EXCLUDED from the sitemap.
  // Google only sees 200-OK canonical pages here to prevent "Crawled - currently not indexed" confusion.
  const locationRoutes: MetadataRoute.Sitemap = CANONICAL_LOCATION_SLUGS.map((slug) => ({
    url: `${baseUrl}/locations/${slug}`,
    lastModified: sitemapDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...blogRoutes, ...locationRoutes];
}

