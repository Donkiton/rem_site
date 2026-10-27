import { notFound } from "next/navigation";
import DemoPage, { demoMetadata } from "@/components/demo-page";
import { isLocale } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/site-metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "ru") notFound();
  return localizedMetadata(locale, demoMetadata);
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "ru") notFound();
  return <DemoPage locale={locale} />;
}
