import Page, { metadata } from "@/components/seo/pages/operacionnyj-blok";
import { localizedMetadata } from "@/lib/site-metadata";
export function generateMetadata() {
  return localizedMetadata("ru", { path: "/operacionnyj-blok/", title: String(metadata.title), description: metadata.description ?? undefined });
}
export default Page;
