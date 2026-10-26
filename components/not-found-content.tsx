"use client";

import { useEffect, useState } from "react";
import { createTranslator, isLocale, localeHref, LOCALES, LANGUAGE_NAMES, type Locale, type Messages } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { BASE_PATH } from "@/lib/site-url";

export function NotFoundContent() {
  const [language, setLanguage] = useState<{ locale: Locale; messages: Messages }>({ locale: "ru", messages: {} });
  const t = createTranslator(language.messages);
  useEffect(() => {
    const pathname = window.location.pathname.slice(BASE_PATH.length);
    const candidate = pathname.split("/")[1];
    const locale = isLocale(candidate) ? candidate : "ru";
    let active = true;
    getMessages(locale).then((messages) => {
      if (!active) return;
      setLanguage({ locale, messages });
      document.documentElement.lang = locale;
      document.title = createTranslator(messages)("Страница не найдена — RemCard ICU");
    });
    return () => { active = false; };
  }, []);
  return <main className="not-found-page"><div className="not-found-card">
    <span>404</span>
    <h1>{t("Страница не найдена")}</h1>
    <p>{t("Вернитесь на главную страницу RemCard ICU.")}</p>
    <a href={localeHref("/", language.locale, BASE_PATH)}>{t("Перейти на главную")}</a>
    <nav className="not-found-languages" aria-label={t("Выбрать язык")}>
      {LOCALES.map((locale) => <a key={locale} href={localeHref("/", locale, BASE_PATH)} lang={locale}>{LANGUAGE_NAMES[locale]}</a>)}
    </nav>
  </div></main>;
}
