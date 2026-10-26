import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { LOCALES, LANGUAGE_NAMES, createTranslator, isLocale, localeHref, translateData } from "../lib/i18n.ts";

const targetLocales = LOCALES.filter((locale) => locale !== "ru");
const source = JSON.parse(await readFile(new URL("../content/i18n/source.json", import.meta.url), "utf8"));
const catalogs = Object.fromEntries(await Promise.all(targetLocales.map(async (locale) => [
  locale,
  JSON.parse(await readFile(new URL(`../content/i18n/${locale}.json`, import.meta.url), "utf8")),
])));
const basePath = process.env.GITHUB_ACTIONS === "true" ? "/rem_site" : "";
const publishedBase = "https://donkiton.github.io/rem_site/";
const pageTitles = {
  "": "RemCard ICU — электронная реанимационная карта",
  "elektronnaya-reanimacionnaya-karta": "RemCard ICU: электронная карта пациента в реанимации",
  "programma-dlya-orit": "Рабочий контур отделения реанимации и интенсивной терапии",
  "operacionnyj-blok": "Регистрация и сопровождение операции в RemCard ICU",
};
const seoSlugs = Object.keys(pageTitles).filter(Boolean);

function route(locale, slug = "") {
  return `${locale === "ru" ? "" : `${locale}/`}${slug ? `${slug}/` : ""}`;
}

function publicUrl(locale, slug = "") {
  return new URL(route(locale, slug), publishedBase).toString();
}

function decodeEntities(value) {
  const named = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (entity, name) => {
    if (name[0] === "#") return String.fromCodePoint(name[1].toLowerCase() === "x" ? Number.parseInt(name.slice(2), 16) : Number(name.slice(1)));
    return named[name.toLowerCase()] ?? entity;
  });
}

function attribute(tag, name) {
  return decodeEntities(tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"))?.[1] ?? "");
}

function renderedMarkup(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

function visibleText(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

test("переключение языка сохраняет подпуть, SEO-страницу, query и hash для всех пяти языков", () => {
  for (const prefix of ["", "/rem_site"]) {
    for (const from of LOCALES) {
      for (const to of LOCALES) {
        const input = `${prefix}/${route(from, "programma-dlya-orit")}?view=full&tab=2#details-title`;
        const expected = `${prefix}/${route(to, "programma-dlya-orit")}?view=full&tab=2#details-title`;
        assert.equal(localeHref(input, to, prefix), expected, `${from} → ${to}, basePath=${prefix}`);
      }
    }
  }
});

test("русский язык использует корень по умолчанию, без дублирования префиксов", () => {
  assert.equal(LOCALES[0], "ru");
  for (const locale of LOCALES) {
    assert.equal(localeHref(`/rem_site/${route(locale)}#interface`, "ru", "/rem_site"), "/rem_site/#interface");
    assert.equal(localeHref(`/rem_site/${route(locale)}`, locale, "/rem_site"), `/rem_site/${route(locale)}`);
  }
  assert.equal(localeHref("/rem_site", "ru", "/rem_site"), "/rem_site/");
  assert.equal(localeHref("/ru/programma-dlya-orit/", "ru"), "/programma-dlya-orit/");
  assert.equal(localeHref("/enough/", "de"), "/de/enough/");
  assert.ok(isLocale("zh-CN"));
  assert.equal(isLocale("zh"), false);
  assert.equal(isLocale("fr"), false);
});

test("переключение языка не изменяет внешние ссылки и локальные якоря", () => {
  for (const href of ["https://github.com/Donkiton/rem_card", "//cdn.example.com/image.png", "mailto:menfise@mail.ru", "tel:+12345", "#interface"]) {
    for (const locale of LOCALES) assert.equal(localeHref(href, locale, "/rem_site"), href);
  }
});

test("перевод форматирует именованные параметры, включая ноль, без потери неизвестных параметров", () => {
  const t = createTranslator({ "Экран {current} из {total}": "Screen {current} of {total}", "Имя": "Name" });
  assert.equal(t("Экран {current} из {total}", { current: 0, total: 5 }), "Screen 0 of 5");
  assert.equal(t("Экран {current} из {total}", { current: 2 }), "Screen 2 of {total}");
  assert.equal(t("Неизвестный текст {number}", { number: 7 }), "Неизвестный текст 7");
  assert.equal(t("  Имя\n"), "Name");
  assert.deepEqual(translateData({ label: "Имя", nested: ["Имя", 3, false], href: "/en/" }, t), {
    label: "Name", nested: ["Name", 3, false], href: "/en/",
  });
});

for (const locale of targetLocales) {
  test(`словарь ${locale} покрывает исходные строки и сохраняет все плейсхолдеры`, () => {
    const messages = catalogs[locale];
    const placeholders = (value) => (value.match(/\{\w+\}/g) ?? []).sort();
    for (const key of source) {
      assert.equal(typeof messages[key], "string", `${locale}: нет перевода ${JSON.stringify(key)}`);
      assert.ok(messages[key].trim(), `${locale}: пустой перевод ${JSON.stringify(key)}`);
      assert.deepEqual(placeholders(messages[key]), placeholders(key), `${locale}: изменены параметры ${JSON.stringify(key)}`);
    }
  });
}

for (const locale of LOCALES) {
  for (const [slug, sourceTitle] of Object.entries(pageTitles)) {
    test(`готовая страница /${route(locale, slug)}: язык, метаданные, переключатель и локализованные ссылки`, async () => {
      const html = await readFile(new URL(`../out/${route(locale, slug)}index.html`, import.meta.url), "utf8");
      const t = createTranslator(catalogs[locale] ?? {});
      assert.equal(attribute(html.match(/<html\b[^>]*>/i)?.[0] ?? "", "lang"), locale);

      const links = html.match(/<link\b[^>]*>/gi) ?? [];
      const canonical = links.find((tag) => attribute(tag, "rel") === "canonical");
      assert.ok(canonical, "canonical присутствует");
      assert.equal(attribute(canonical, "href"), publicUrl(locale, slug));
      for (const alternate of [...LOCALES, "x-default"]) {
        const tag = links.find((link) => attribute(link, "rel") === "alternate" && attribute(link, "hreflang") === alternate);
        assert.ok(tag, `hreflang ${alternate} присутствует`);
        assert.equal(attribute(tag, "href"), publicUrl(alternate === "x-default" ? "ru" : alternate, slug));
      }

      const markup = renderedMarkup(html);
      const selectors = (markup.match(/<select\b[^>]*>[\s\S]*?<\/select>/gi) ?? [])
        .filter((tag) => attribute(tag.match(/<select\b[^>]*>/i)?.[0] ?? "", "class").split(/\s+/).includes("language-select"));
      assert.ok(selectors.length > 0, "переключатель языка присутствует");
      for (const selector of selectors) {
        const options = selector.match(/<option\b[^>]*>[\s\S]*?<\/option>/gi) ?? [];
        assert.deepEqual(options.map((option) => attribute(option, "value")), [...LOCALES]);
        for (const option of options) {
          const code = attribute(option, "value");
          assert.equal(visibleText(option), LANGUAGE_NAMES[code]);
          assert.equal(/\bselected(?:\s|=|>)/i.test(option), code === locale);
        }
      }

      const headings = markup.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi) ?? [];
      assert.equal(headings.length, 1, "есть один содержательный заголовок h1");
      assert.equal(visibleText(headings[0]), t(sourceTitle));
      assert.ok(visibleText(markup).includes(t("Возможности")), "навигация переведена");
      if (locale !== "ru") {
        // Русское самоназвание языка остаётся доступным во всех переключателях.
        // Скрипты с сериализованным словарём выше удалены: они содержат исходные русские ключи.
        const translatedUi = markup.replace(/<option\b[^>]*>[\s\S]*?<\/option>/gi, "");
        const untranslatedFragment = translatedUi.match(/.{0,55}[А-Яа-яЁё].{0,55}/)?.[0];
        assert.equal(untranslatedFragment, undefined, `русский текст в интерфейсе: ${untranslatedFragment ?? ""}`);
      }

      const anchors = markup.match(/<a\b[^>]*>/gi) ?? [];
      const localHrefs = anchors.map((anchor) => attribute(anchor, "href")).filter((href) => href.startsWith("/") && !href.startsWith("//"));
      assert.ok(localHrefs.length > 0);
      for (const href of localHrefs) assert.equal(localeHref(href, locale, basePath), href, `ссылка сохраняет текущий язык и basePath: ${href}`);
      assert.ok(localHrefs.includes(`${basePath}/${route(locale)}#features`), "навигация ведёт на главную текущего языка");
      const expectedRelated = !slug ? seoSlugs : slug === "elektronnaya-reanimacionnaya-karta"
        ? ["programma-dlya-orit"] : slug === "programma-dlya-orit"
          ? ["elektronnaya-reanimacionnaya-karta", "operacionnyj-blok"]
          : ["programma-dlya-orit", "elektronnaya-reanimacionnaya-karta"];
      for (const related of expectedRelated) assert.ok(localHrefs.includes(`${basePath}/${route(locale, related)}`), `связанная страница ${related} сохраняет язык`);
    });
  }
}
