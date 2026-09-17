import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blogData";
import { CANONICAL_LOCATION_SLUGS } from "@/lib/citySeoData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.digitalfx.in";
  const now = new Date();

  // Core 200-OK Indexable Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/global-markets`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Verified In-Depth Blog Articles
  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Canonical Authority Hubs Only (All 28 States, 8 UTs, Top 36 Indian Metros, 10 Global Hubs)
  // Secondary minor localities redirect permanently (308) to their parent state hubs and are excluded from sitemap.
  const locationRoutes: MetadataRoute.Sitemap = CANONICAL_LOCATION_SLUGS.map((slug) => ({
    url: `${baseUrl}/locations/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...blogRoutes, ...locationRoutes];
}
