import type { Metadata, Viewport } from "next";
import { LOCALES, createTranslator, type Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { resolveSiteUrl, withBasePath } from "@/lib/site-url";

const siteTitle = "RemCard ICU — электронная реанимационная карта для ОРИТ и операционного блока";
const siteDescription = "Windows-приложение с доступным исходным кодом для ведения пациента в реанимации и операционном блоке: назначения, витальные показатели, инфузии, ИВЛ, процедуры, анализы и документы.";
const ogLocales: Record<Locale, string> = { ru: "ru_RU", en: "en_US", "zh-CN": "zh_CN", ja: "ja_JP", de: "de_DE" };

export function localizedUrl(locale: Locale, path = "/") {
  return new URL(`${locale === "ru" ? "" : `${locale}/`}${path.replace(/^\//, "")}`, resolveSiteUrl()).toString();
}

export async function localizedMetadata(locale: Locale, page: { path?: string; title?: string; description?: string } = {}): Promise<Metadata> {
  const t = createTranslator(await getMessages(locale));
  const title = t(page.title ?? siteTitle);
  const description = t(page.description ?? siteDescription);
  const url = localizedUrl(locale, page.path);
  const image = new URL(withBasePath("/og.png"), resolveSiteUrl().origin).toString();
  return {
    metadataBase: new URL(resolveSiteUrl().origin), title, description, applicationName: "RemCard ICU",
    alternates: { canonical: url, languages: {
      ...Object.fromEntries(LOCALES.map((language) => [language, localizedUrl(language, page.path)])),
      "x-default": localizedUrl("ru", page.path),
    } },
    other: { "yandex-verification": "1b90a7ca5c672df1" },
    manifest: withBasePath(locale === "ru" ? "/manifest.webmanifest" : `/manifest.${locale}.webmanifest`),
    icons: { icon: [{ url: withBasePath("/favicon.ico") }, { url: withBasePath("/remcardicon.png"), type: "image/png" }], shortcut: withBasePath("/favicon.ico"), apple: withBasePath("/remcardicon.png") },
    openGraph: { type: "website", locale: ogLocales[locale], alternateLocale: LOCALES.filter((language) => language !== locale).map((language) => ogLocales[language]), url, siteName: "RemCard ICU", title, description, images: [{ url: image, width: 1729, height: 910, alt: t("RemCard ICU — электронная реанимационная карта") }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#081018", colorScheme: "dark" };
