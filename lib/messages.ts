import type { Locale, Messages } from "@/lib/i18n";

export async function getMessages(locale: Locale): Promise<Messages> {
  switch (locale) {
    case "en": return (await import("@/content/i18n/en.json")).default;
    case "de": return (await import("@/content/i18n/de.json")).default;
    case "zh-CN": return (await import("@/content/i18n/zh-CN.json")).default;
    case "ja": return (await import("@/content/i18n/ja.json")).default;
    default: return (await import("@/content/i18n/ru.json")).default;
  }
}
