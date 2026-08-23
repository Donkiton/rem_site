import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  return readFile(new URL("../out/index.html", import.meta.url), "utf8");
}

test("статическая сборка содержит русскую презентационную страницу RemCard ICU", async () => {
  const html = await render();
  assert.match(html, /<html[^>]*lang=["']ru["']/i);
  assert.match(html, /<title>RemCard ICU — электронная реанимационная карта/);
  assert.match(html, /RemCard ICU — электронная реанимационная карта/);
  assert.match(html, /Что такое RemCard ICU/);
  assert.match(html, /RemCard развивается публично/);
  assert.match(html, /Единый центр архива/);
  assert.match(html, /текущая версия проекта —(?:<!-- -->|\s)*\d+\.\d+\.\d+/);
  assert.match(html, /softwareVersion\\?"?:\\?"\d+\.\d+\.\d+/);
  assert.doesNotMatch(html, /текущая версия проекта —(?:<!-- -->|\s)*4\.1\.2/);
  assert.match(html, /Экспериментальный проект требует независимой проверки/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /rel="canonical" href="https:\/\/donkiton\.github\.io\/rem_site\/"/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/);
});

test("ключевые разделы и ссылки присутствуют в HTML", async () => {
  const html = await render();
  const basePath = process.env.GITHUB_ACTIONS === "true" ? "/rem_site" : "";
  for (const id of ["features", "interface", "roles", "architecture", "open-source", "faq", "contact"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  assert.match(html, /https:\/\/github\.com\/Donkiton\/rem_card/);
  assert.match(html, /https:\/\/donkiton\.github\.io\/rem_card\/codemap\/codemap\.html/);
  assert.match(html, /mailto:menfise%40mail\.ru|mailto:menfise@mail\.ru/);
  assert.ok(html.includes(`${basePath}/images/remcard/remcard-real-screenshot.png`));
});

test("SEO-файлы указывают на публичный GitHub Pages URL", async () => {
  const [robots, sitemap] = await Promise.all([
    readFile(new URL("../out/robots.txt", import.meta.url), "utf8"),
    readFile(new URL("../out/sitemap.xml", import.meta.url), "utf8"),
  ]);
  assert.match(robots, /https:\/\/donkiton\.github\.io\/rem_site\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/donkiton\.github\.io\/rem_site\/?/);
});
