import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PUBLIC_RELEASE_SNAPSHOT, selectPublishedProjectVersion } from "../lib/project-version.ts";

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
  const version = html.match(/"softwareVersion":"(\d+\.\d+\.\d+)"/)?.[1];
  const releaseSection = html.match(/<section id="open-source"[\s\S]*?<\/section>/)?.[0] ?? "";
  const escapeHtml = (text) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
  if (version === PUBLIC_RELEASE_SNAPSHOT.version) {
    for (const note of PUBLIC_RELEASE_SNAPSHOT.changes.ru) assert.ok(releaseSection.includes(escapeHtml(note)), "notes опубликованного snapshot видны на странице");
  } else {
    assert.match(releaseSection, /Описание изменений и требования к установке опубликованы на странице этого релиза/);
  }
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
  assert.match(html, new RegExp(`<strong>Версия(?:<!-- -->|\\s)*${escapedVersion}(?:<!-- -->)*\\.</strong>`));
  assert.ok(html.includes(`href="https://github.com/Donkiton/rem_card/releases/tag/v${version}"`));
  assert.ok(html.includes(`Открыть страницу релиза ${version}`));
  assert.ok(html.includes(`Скачать для Windows ${version}`));
  if (version === PUBLIC_RELEASE_SNAPSHOT.version) {
    assert.ok(html.includes(`href="https://github.com/Donkiton/rem_card/releases/download/v${version}/RemCard-Setup-${version}.exe"`));
    assert.ok(html.includes(`href="https://github.com/Donkiton/rem_card/releases/download/v${version}/RemCard_${version}_full.zip"`));
    assert.ok(html.includes(`"downloadUrl":"https://github.com/Donkiton/rem_card/releases/download/v${version}/RemCard-Setup-${version}.exe"`));
  }
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
  for (const screen of ["roles", "patients", "beds", "orders", "balance"]) {
    assert.ok(html.includes(`${basePath}/images/remcard/remcard-${screen}-5-1.jpg`));
  }
  assert.match(html, /Снимки интерфейса(?:<!-- -->|\s)*5\.1\.0/);
  assert.doesNotMatch(html, /images\/remcard\/remcard-[^"<>\s]*screenshot\.png|4\.1\.1/);
  assert.ok(html.includes('class="language-select"'));
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
