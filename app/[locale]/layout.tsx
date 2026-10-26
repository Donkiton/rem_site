import { notFound } from "next/navigation";
import SiteDocument from "@/components/site-document";
import { LOCALES, isLocale } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/site-metadata";
export { viewport } from "@/lib/site-metadata";
export const dynamicParams = false;
export function generateStaticParams() { return LOCALES.filter((locale) => locale !== "ru").map((locale) => ({ locale })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "ru") notFound();
  return localizedMetadata(locale);
}
export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "ru") notFound();
  return <SiteDocument locale={locale}>{children}</SiteDocument>;
}
