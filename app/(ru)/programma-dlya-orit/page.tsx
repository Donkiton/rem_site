import Page, { metadata } from "@/components/seo/pages/programma-dlya-orit";
import { localizedMetadata } from "@/lib/site-metadata";
export function generateMetadata() {
  return localizedMetadata("ru", { path: "/programma-dlya-orit/", title: String(metadata.title), description: metadata.description ?? undefined });
}
export default Page;
