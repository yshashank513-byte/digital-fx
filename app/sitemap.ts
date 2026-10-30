import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blogData";
import {
  CANONICAL_LOCATION_SLUGS,
  PRIORITY_20_SEO_CITIES,
} from "@/lib/citySeoData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.digitalfx.in";
  const sitemapDate = new Date();

  // Core 200-OK Indexable Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: sitemapDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/digital-marketing-agency`,
      lastModified: sitemapDate,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/services`,
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
      url: `${baseUrl}/case-studies`,
      lastModified: sitemapDate,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: sitemapDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: sitemapDate,
      changeFrequency: "weekly",
      priority: 0.9,
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
      priority: 0.85,
    },
    {
      url: `${baseUrl}/global-markets`,
      lastModified: sitemapDate,
      changeFrequency: "weekly",
      priority: 0.85,
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

  // In-Depth Blog Articles (including newly added SEO guides)
  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: sitemapDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Canonical Authority Hubs & Focus Cities under /digital-marketing-agency/[city]
  // Pre-rendered 200 OK canonical routes (Priority 20 + State & Metro Hubs)
  const combinedCitySlugs = Array.from(
    new Set([...PRIORITY_20_SEO_CITIES, ...CANONICAL_LOCATION_SLUGS])
  );

  const agencyCityRoutes: MetadataRoute.Sitemap = combinedCitySlugs.map((slug) => {
    const isPriority = (PRIORITY_20_SEO_CITIES as readonly string[]).includes(slug);
    return {
      url: `${baseUrl}/digital-marketing-agency/${slug}`,
      lastModified: sitemapDate,
      changeFrequency: "weekly",
      priority: isPriority ? 0.9 : 0.8,
    };
  });

  return [...staticRoutes, ...blogRoutes, ...agencyCityRoutes];
}
