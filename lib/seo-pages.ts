import ChartPage, { metadata as chartMetadata } from "@/components/seo/pages/elektronnaya-reanimacionnaya-karta";
import IcuPage, { metadata as icuMetadata } from "@/components/seo/pages/programma-dlya-orit";
import OperatingPage, { metadata as operatingMetadata } from "@/components/seo/pages/operacionnyj-blok";

export const seoPages = {
  "elektronnaya-reanimacionnaya-karta": { Component: ChartPage, metadata: chartMetadata },
  "programma-dlya-orit": { Component: IcuPage, metadata: icuMetadata },
  "operacionnyj-blok": { Component: OperatingPage, metadata: operatingMetadata },
};
export type SeoPageSlug = keyof typeof seoPages;
export function isSeoPage(value: string): value is SeoPageSlug { return Object.hasOwn(seoPages, value); }
