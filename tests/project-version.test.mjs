import assert from "node:assert/strict";
import test from "node:test";
import { selectPublishedProjectVersion } from "../lib/project-version.ts";

const stable = (tag_name) => ({ tag_name, prerelease: false, draft: false });

test("устаревший релиз не понижает подтверждённую версию 5.1.10", () => {
  assert.equal(selectPublishedProjectVersion(stable("v5.1.6")), null);
  assert.equal(selectPublishedProjectVersion(stable("v5.1.9")), null);
  assert.equal(selectPublishedProjectVersion(stable("v5.1.10")), "5.1.10");
});

test("сравнение стабильных версий принимает будущую 5.1.11 численно", () => {
  assert.equal(selectPublishedProjectVersion(stable("v5.1.11")), "5.1.11");
  assert.equal(selectPublishedProjectVersion(stable("v5.2.0")), "5.2.0");
  assert.equal(selectPublishedProjectVersion(stable("v6.0.0")), "6.0.0");
  assert.equal(selectPublishedProjectVersion(stable("v5.0.99")), null);
});

test("черновики, prerelease и неполные ответы не задают текущую версию", () => {
  assert.equal(selectPublishedProjectVersion({ ...stable("v5.1.11"), draft: true }), null);
  assert.equal(selectPublishedProjectVersion({ ...stable("v5.1.11"), prerelease: true }), null);
  assert.equal(selectPublishedProjectVersion(stable("v5.1.11-beta.1")), null);
  assert.equal(selectPublishedProjectVersion({ tag_name: "v5.1.11" }), null);
  assert.equal(selectPublishedProjectVersion(stable("unknown")), null);
});
