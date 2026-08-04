import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { resolveSiteUrl } from "@/lib/site-url";
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

const title = "RemCard — цифровая карта пациента для реанимации и операционного блока";
const description =
  "Open-source Windows-приложение для ведения пациента в реанимации и операционном блоке: назначения, витальные показатели, инфузии, ИВЛ, процедуры, анализы и документы.";

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = await resolveSiteUrl();
  const ogImage = new URL("/og.png", siteUrl).toString();
  return {
    metadataBase: siteUrl,
    title,
    description,
    applicationName: "RemCard",
    alternates: { canonical: siteUrl },
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [{ url: "/favicon.ico" }, { url: "/remcardicon.png", type: "image/png" }],
      shortcut: "/favicon.ico",
      apple: "/remcardicon.png",
    },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: siteUrl,
      siteName: "RemCard",
      title,
      description,
      images: [{ url: ogImage, width: 1729, height: 910, alt: "RemCard — цифровая карта пациента" }],
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
