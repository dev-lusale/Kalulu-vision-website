import type { MetadataRoute } from "next";
import { getPosts, getProjects, getServices } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [services, projects, insights, research] = await Promise.all([getServices(), getProjects(), getPosts("insights"), getPosts("research")]);
  const staticPages = ["", "/about", "/services", "/products", "/projects", "/research", "/insights", "/opportunities", "/contact", "/training"];
  return [
    ...staticPages.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...services.map((s) => ({ url: `${base}/services/${s.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...insights.map((p) => ({ url: `${base}/insights/${p.slug}`, lastModified: p.publishedAt ?? undefined, priority: 0.5 })),
    ...research.map((p) => ({ url: `${base}/research/${p.slug}`, lastModified: p.publishedAt ?? undefined, priority: 0.5 })),
  ];
}
