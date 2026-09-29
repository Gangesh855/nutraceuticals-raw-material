import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { PRODUCTS } from "@/lib/products";
import { POSTS } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...PRODUCTS.map((p) => ({ url: `${SITE.url}/products/${p.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...POSTS.map((p) => ({ url: `${SITE.url}/blog/${p.slug}`, lastModified: new Date(p.date), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
