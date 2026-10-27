import React, { createContext, useContext, useEffect, useMemo } from 'react';
import ru from './locales/ru.json';
import en from './locales/en.json';
import de from './locales/de.json';
import ja from './locales/ja.json';
import zh from './locales/zh-CN.json';
import { createDemoTranslator, getDemoLocale } from './translation.js';

const catalogs = { ru, en, de, ja, 'zh-CN': zh };
const defaultValue = { locale: 'ru', ...createDemoTranslator(ru, 'ru') };
const DemoI18nContext = createContext(defaultValue);

export function DemoI18nProvider({ children }) {
  const locale = getDemoLocale();
  const value = useMemo(() => ({ locale, ...createDemoTranslator(catalogs[locale], locale) }), [locale]);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = value.t('RemCard — интерактивное демо');
  }, [locale, value]);
  return <DemoI18nContext.Provider value={value}>{children}</DemoI18nContext.Provider>;
}

export const useDemoI18n = () => useContext(DemoI18nContext);
