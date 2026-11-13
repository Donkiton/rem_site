import assert from "node:assert/strict";
import test from "node:test";
import { PROJECT_VERSION_FALLBACK, selectPublishedProjectVersion } from "../lib/project-version.ts";

const stable = (tag_name) => ({ tag_name, prerelease: false, draft: false });
const [major, minor, patch] = PROJECT_VERSION_FALLBACK.split(".").map(Number);
const previous = patch > 0 ? `${major}.${minor}.${patch - 1}` : minor > 0 ? `${major}.${minor - 1}.0` : `${major - 1}.0.0`;
const future = `${major}.${minor}.${patch + 1}`;

test("устаревший релиз не понижает подтверждённую версию из metadata", () => {
  assert.equal(selectPublishedProjectVersion(stable(`v${previous}`)), null);
  assert.equal(selectPublishedProjectVersion(stable(`v${PROJECT_VERSION_FALLBACK}`)), PROJECT_VERSION_FALLBACK);
});

test("сравнение стабильных версий принимает новые patch, minor и major численно", () => {
  for (const version of [future, `${major}.${minor + 1}.0`, `${major + 1}.0.0`]) {
    assert.equal(selectPublishedProjectVersion(stable(`v${version}`)), version);
  }
});

test("черновики, prerelease и неполные ответы не задают текущую версию", () => {
  assert.equal(selectPublishedProjectVersion({ ...stable(`v${future}`), draft: true }), null);
  assert.equal(selectPublishedProjectVersion({ ...stable(`v${future}`), prerelease: true }), null);
  assert.equal(selectPublishedProjectVersion(stable(`v${future}-beta.1`)), null);
  assert.equal(selectPublishedProjectVersion({ tag_name: `v${future}` }), null);
  assert.equal(selectPublishedProjectVersion(stable("unknown")), null);
  assert.equal(selectPublishedProjectVersion(stable("v05.1.1")), null);
});
