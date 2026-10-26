"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { createTranslator, localeHref, translateData, type Locale, type Messages } from "@/lib/i18n";
import { BASE_PATH } from "@/lib/site-url";

function makeValue(locale: Locale, messages: Messages) {
  const t = createTranslator(messages);
  return { locale, t, l: (href: string) => localeHref(href, locale, BASE_PATH),
    data: <T,>(value: T): T => translateData(value, t) };
}

const I18nContext = createContext(makeValue("ru", {}));

export function I18nProvider({ locale, messages, children }: { locale: Locale; messages: Messages; children: ReactNode }) {
  const value = useMemo(() => makeValue(locale, messages), [locale, messages]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() { return useContext(I18nContext); }
