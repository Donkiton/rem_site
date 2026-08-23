import type { MetadataRoute } from "next";
import { resolveSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = resolveSiteUrl().toString().replace(/\/$/, "");
  return [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/elektronnaya-reanimacionnaya-karta/`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/programma-dlya-orit/`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/operacionnyj-blok/`, changeFrequency: "monthly", priority: 0.9 },
  ];
}
