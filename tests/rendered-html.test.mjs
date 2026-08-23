import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("сервер отдаёт русскую презентационную страницу RemCard ICU", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang=["']ru["']/i);
  assert.match(html, /<title>RemCard ICU — электронная реанимационная карта/);
  assert.match(html, /RemCard ICU — электронная реанимационная карта/);
  assert.match(html, /Что такое RemCard ICU/);
  assert.match(html, /RemCard развивается публично/);
  assert.match(html, /Экспериментальный проект требует независимой проверки/);
  assert.match(html, /application\/ld\+json/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/);
});

test("ключевые разделы и ссылки присутствуют в HTML", async () => {
  const response = await render();
  const html = await response.text();
  for (const id of ["features", "interface", "roles", "architecture", "open-source", "faq", "contact"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  assert.match(html, /https:\/\/github\.com\/Donkiton\/rem_card/);
  assert.match(html, /mailto:menfise%40mail\.ru|mailto:menfise@mail\.ru/);
});
