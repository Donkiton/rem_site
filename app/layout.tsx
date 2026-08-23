import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { resolveSiteUrl, withBasePath } from "@/lib/site-url";
import "./globals.css";

const manrope = localFont({
  src: "./fonts/Manrope-Variable.woff",
  weight: "200 800",
  style: "normal",
  variable: "--font-heading",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/Inter-Variable.woff",
  weight: "100 900",
  style: "normal",
  variable: "--font-body",
  display: "swap",
});

const jetBrainsMono = localFont({
  src: "./fonts/JetBrainsMono-Variable.woff",
  weight: "100 800",
  style: "normal",
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

const title = "RemCard ICU — электронная реанимационная карта для ОРИТ и операционного блока";
const description =
  "Windows-приложение с доступным исходным кодом для ведения пациента в реанимации и операционном блоке: назначения, витальные показатели, инфузии, ИВЛ, процедуры, анализы и документы.";

export function generateMetadata(): Metadata {
  const siteUrl = resolveSiteUrl();
  const canonicalUrl = siteUrl.toString();
  const ogImage = new URL(withBasePath("/og.png"), siteUrl.origin).toString();
  return {
    metadataBase: new URL(siteUrl.origin),
    title,
    description,
    applicationName: "RemCard ICU",
    alternates: { canonical: canonicalUrl },
    other: { "yandex-verification": "1b90a7ca5c672df1" },
    manifest: withBasePath("/manifest.webmanifest"),
    icons: {
      icon: [
        { url: withBasePath("/favicon.ico") },
        { url: withBasePath("/remcardicon.png"), type: "image/png" },
      ],
      shortcut: withBasePath("/favicon.ico"),
      apple: withBasePath("/remcardicon.png"),
    },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: siteUrl,
      siteName: "RemCard ICU",
      title,
      description,
      images: [{ url: ogImage, width: 1729, height: 910, alt: "RemCard ICU — электронная реанимационная карта" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#081018",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={`${manrope.variable} ${inter.variable} ${jetBrainsMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
