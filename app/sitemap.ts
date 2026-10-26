import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n";
import { localizedUrl } from "@/lib/site-metadata";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/elektronnaya-reanimacionnaya-karta/", "/programma-dlya-orit/", "/operacionnyj-blok/"];
  return LOCALES.flatMap((locale) => paths.map((path) => ({
    url: localizedUrl(locale, path),
    changeFrequency: path === "/" ? "weekly" as const : "monthly" as const,
    priority: path === "/" ? 1 : 0.9,
    alternates: { languages: Object.fromEntries(LOCALES.map((language) => [language, localizedUrl(language, path)])) },
  })));
}
