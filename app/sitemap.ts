import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blogData";
import { ALL_CITIES_FLAT } from "@/lib/citySeoData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.digitalfx.in";
  const now = new Date();

  // Core Pages
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
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Blog Posts
  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Unique city slugs (filter duplicates if any across UTs/states)
  const uniqueCitySlugs = Array.from(
    new Set(ALL_CITIES_FLAT.map((c) => c.slug))
  );

  const cityRoutes: MetadataRoute.Sitemap = uniqueCitySlugs.map((slug) => ({
    url: `${baseUrl}/locations/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes, ...cityRoutes];
}