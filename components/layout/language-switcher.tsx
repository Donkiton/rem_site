"use client";

import { Languages } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { LANGUAGE_NAMES, LOCALES, isLocale, localeHref } from "@/lib/i18n";
import { BASE_PATH } from "@/lib/site-url";

export function LanguageSwitcher() {
  const { locale, t } = useI18n();
  return (
    <label className="language-switcher">
      <Languages size={17} aria-hidden="true" />
      <select
        className="language-select"
        aria-label={t("Язык сайта")}
        value={locale}
        onChange={(event) => {
          const nextLocale = event.target.value;
          if (!isLocale(nextLocale)) return;
          const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
          window.location.assign(localeHref(current, nextLocale, BASE_PATH));
        }}
      >
        {LOCALES.map((code) => <option key={code} value={code} lang={code}>{LANGUAGE_NAMES[code]}</option>)}
      </select>
    </label>
  );
}
