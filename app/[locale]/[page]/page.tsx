import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { isSeoPage, seoPages } from "@/lib/seo-pages";
import { localizedMetadata } from "@/lib/site-metadata";
export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(seoPages).map((page) => ({ page })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string; page: string }> }) {
  const { locale, page } = await params;
  if (!isLocale(locale) || !isSeoPage(page)) notFound();
  const { metadata } = seoPages[page];
  return localizedMetadata(locale, { path: `/${page}/`, title: String(metadata.title), description: metadata.description ?? undefined });
}
export default async function Page({ params }: { params: Promise<{ locale: string; page: string }> }) {
  const { locale, page } = await params;
  if (!isLocale(locale) || !isSeoPage(page)) notFound();
  const { Component } = seoPages[page];
  return <Component />;
}
