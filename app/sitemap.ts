import type { MetadataRoute } from "next";
import { resolveSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (await resolveSiteUrl()).toString().replace(/\/$/, "");
  return [{ url: baseUrl, changeFrequency: "weekly", priority: 1 }];
}
