import { I18nProvider } from "@/components/i18n-provider";
import { getMessages } from "@/lib/messages";
import type { Locale } from "@/lib/i18n";
import localFont from "next/font/local";
import "@/app/globals.css";

const manrope = localFont({
  src: "../app/fonts/Manrope-Variable.woff",
  weight: "200 800",
  style: "normal",
  variable: "--font-heading",
  display: "swap",
});

const inter = localFont({
  src: "../app/fonts/Inter-Variable.woff",
  weight: "100 900",
  style: "normal",
  variable: "--font-body",
  display: "swap",
});

const jetBrainsMono = localFont({
  src: "../app/fonts/JetBrainsMono-Variable.woff",
  weight: "100 800",
  style: "normal",
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

export default async function SiteDocument({ children, locale }: Readonly<{ children: React.ReactNode; locale: Locale }>) {
  const messages = await getMessages(locale);
  return (
    <html lang={locale}>
      <body className={`${manrope.variable} ${inter.variable} ${jetBrainsMono.variable}`}>
        <I18nProvider locale={locale} messages={messages}>{children}</I18nProvider>
      </body>
    </html>
  );
}
