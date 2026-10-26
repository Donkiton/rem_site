import Page, { metadata } from "@/components/seo/pages/elektronnaya-reanimacionnaya-karta";
import { localizedMetadata } from "@/lib/site-metadata";
export function generateMetadata() {
  return localizedMetadata("ru", { path: "/elektronnaya-reanimacionnaya-karta/", title: String(metadata.title), description: metadata.description ?? undefined });
}
export default Page;
