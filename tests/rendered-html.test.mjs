import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { selectPublishedProjectVersion } from "../lib/project-version.ts";

async function render() {
  return readFile(new URL("../out/index.html", import.meta.url), "utf8");
}

test("статическая сборка содержит русскую презентационную страницу RemCard ICU", async () => {
  const html = await render();
  assert.match(html, /<html[^>]*lang=["']ru["']/i);
  assert.match(html, /<title>RemCard ICU — электронная реанимационная карта/);
  assert.match(html, /RemCard ICU — электронная реанимационная карта/);
  assert.match(html, /Что такое RemCard ICU/);
  assert.match(html, /Электронная реанимационная карта/);
  assert.match(html, /Программа для ОРИТ/);
  assert.match(html, /Операционный блок/);
  assert.match(html, /RemCard развивается публично/);
  assert.match(html, /Версия 5\.1\.10 от 20 октября 2026 года/);
  assert.match(html, /передаются дельтой даже при большой истории/);
  assert.match(html, /из потока интерфейса медсестры/);
  assert.match(html, /поздние ответы не должны заменять более новые данные/);
  assert.match(html, /после освобождения блокировки общей базы/);
  assert.match(html, /Обновление необязательное/);
  assert.match(html, /минимальная версия клиента не повышаются/);
  assert.doesNotMatch(html, /sync_failed/);
  assert.doesNotMatch(html, /27(?:×|x|\s*раз)/i);
  assert.match(html, /Единый центр архива/);
  assert.match(html, /текущая версия проекта —(?:<!-- -->|\s)*\d+\.\d+\.\d+/);
  assert.match(html, /softwareVersion\\?"?:\\?"\d+\.\d+\.\d+/);
  assert.doesNotMatch(html, /текущая версия проекта —(?:<!-- -->|\s)*4\.1\.2/);
  assert.match(html, /Экспериментальный проект требует независимой проверки/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /rel="canonical" href="https:\/\/donkiton\.github\.io\/rem_site\/"/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/);
});

test("версия галереи, подвала и ссылки релиза совпадает с опубликованной версией в метаданных", async () => {
  const html = await render();
  const version = html.match(/"softwareVersion":"(\d+\.\d+\.\d+)"/)?.[1];
  assert.ok(version, "softwareVersion присутствует в JSON-LD");
  assert.equal(selectPublishedProjectVersion({ tag_name: version, prerelease: false, draft: false }), version);
  const escapedVersion = version.replaceAll(".", "\\.");
  assert.match(html, new RegExp(`текущая версия проекта —(?:<!-- -->|\\s)*${escapedVersion}(?:<!-- -->)*\\.`));
  assert.match(html, new RegExp(`class="footer-version">Версия(?:<!-- -->|\\s)*${escapedVersion}<`));
  assert.ok(html.includes(`href="https://github.com/Donkiton/rem_card/releases/tag/v${version}"`));
  assert.ok(html.includes(`Скачать Windows-релиз ${version}`));
  assert.doesNotMatch(html, /href="https:\/\/github\.com\/Donkiton\/rem_card\/releases\/tag\/v5\.1\.[689]"/);
});

test("ключевые разделы и ссылки присутствуют в HTML", async () => {
  const html = await render();
  const basePath = process.env.GITHUB_ACTIONS === "true" ? "/rem_site" : "";
  for (const id of ["features", "interface", "roles", "architecture", "open-source", "english", "faq", "contact"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  assert.match(html, /https:\/\/github\.com\/Donkiton\/rem_card/);
  assert.match(html, /https:\/\/donkiton\.github\.io\/rem_card\/codemap\/codemap\.html/);
  assert.match(html, /mailto:menfise%40mail\.ru|mailto:menfise@mail\.ru/);
  assert.ok(html.includes(`${basePath}/images/remcard/remcard-real-screenshot.png`));
  assert.ok(html.includes(`class="header-language-link" href="${basePath}/#english" lang="en"`));
  assert.ok(html.includes(`src="${basePath}/images/clinicians-that-code-verified.svg"`));
});

test("SEO-файлы указывают на публичный GitHub Pages URL", async () => {
  const [robots, sitemap] = await Promise.all([
    readFile(new URL("../out/robots.txt", import.meta.url), "utf8"),
    readFile(new URL("../out/sitemap.xml", import.meta.url), "utf8"),
  ]);
  assert.match(robots, /https:\/\/donkiton\.github\.io\/rem_site\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/donkiton\.github\.io\/rem_site\/?/);
  assert.match(sitemap, /elektronnaya-reanimacionnaya-karta/);
  assert.match(sitemap, /programma-dlya-orit/);
  assert.match(sitemap, /operacionnyj-blok/);
});
