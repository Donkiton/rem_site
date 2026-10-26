import SiteDocument from "@/components/site-document";
import { localizedMetadata } from "@/lib/site-metadata";
export { viewport } from "@/lib/site-metadata";
export function generateMetadata() { return localizedMetadata("ru"); }
export default function Layout({ children }: { children: React.ReactNode }) { return <SiteDocument locale="ru">{children}</SiteDocument>; }
