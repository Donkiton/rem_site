export const LOCALES = ["ru", "en", "zh-CN", "ja", "de"] as const;
export type Locale = (typeof LOCALES)[number];
export type Messages = Record<string, string>;
export type TranslationValues = Record<string, string | number>;

export const LANGUAGE_NAMES: Record<Locale, string> = {
  ru: "Русский", en: "English", "zh-CN": "简体中文", ja: "日本語", de: "Deutsch",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function createTranslator(messages: Messages) {
  return (source: string, values: TranslationValues = {}) => {
    const key = source.replace(/\s+/g, " ").trim();
    return (messages[key] ?? source).replace(/\{([\w]+)\}/g, (placeholder, name: string) =>
      Object.hasOwn(values, name) ? String(values[name]) : placeholder,
    );
  };
}

export function translateData<T>(value: T, t: ReturnType<typeof createTranslator>): T {
  if (typeof value === "string") return t(value) as T;
  if (Array.isArray(value)) return value.map((item) => translateData(item, t)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, translateData(item, t)])) as T;
  }
  return value;
}

export function localeHref(href: string, locale: Locale, basePath = ""): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const [, pathname, suffix] = href.match(/^([^?#]*)(.*)$/)!;
  let route = basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`))
    ? pathname.slice(basePath.length) || "/" : pathname;
  const first = route.split("/")[1];
  if (first && isLocale(first)) route = route.slice(first.length + 1) || "/";
  return `${basePath}${locale === "ru" ? "" : `/${locale}`}${route.startsWith("/") ? route : `/${route}`}${suffix}`;
}
