import { notFound } from "next/navigation";
import Home from "@/components/home-page";
import { isLocale } from "@/lib/i18n";
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "ru") notFound();
  return <Home locale={locale} />;
}
