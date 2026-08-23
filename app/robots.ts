import type { MetadataRoute } from "next";
import { resolveSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = resolveSiteUrl().toString().replace(/\/$/, "");
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
