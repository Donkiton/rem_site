import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import { PUBLIC_RELEASE_SNAPSHOT as snapshot } from "../lib/project-version.ts";

// Compile the production module while resolving its Next.js alias for Node's test runner.
const source = (await readFile(new URL("../lib/github.ts", import.meta.url), "utf8"))
  .replace('"@/lib/project-version"', JSON.stringify(new URL("../lib/project-version.ts", import.meta.url).href));
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { getLatestGitHubRelease } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

const version = snapshot.version;
const [major, minor, patch] = version.split(".").map(Number);
const future = `${major}.${minor}.${patch + 1}`;
const previous = patch > 0 ? `${major}.${minor}.${patch - 1}` : minor > 0 ? `${major}.${minor - 1}.0` : `${major - 1}.0.0`;
const prefix = (version) => `https://github.com/Donkiton/rem_card/releases/download/v${version}/`;
const installer = (version) => `${prefix(version)}RemCard-Setup-${version}.exe`;
const archive = (version) => `${prefix(version)}RemCard_${version}_full.zip`;
const stableRelease = (version, urls = []) => ({
  tag_name: `v${version}`,
  name: `RemCard ${version}`,
  html_url: `https://github.com/Donkiton/rem_card/releases/tag/v${version}`,
  prerelease: false,
  draft: false,
  published_at: snapshot.published_at,
  assets: urls.map((browser_download_url) => ({ browser_download_url })),
});
async function withFetch(mock, check) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = mock;
  try { await check(await getLatestGitHubRelease()); }
  finally { globalThis.fetch = originalFetch; }
}
const jsonResponse = (body) => async () => ({ ok: true, json: async () => body });

function assertConfirmedRelease(release) {
  assert.equal(release.version, version);
  assert.equal(release.publishedAt, snapshot.published_at);
  assert.equal(release.installerUrl, installer(version));
  assert.equal(release.archiveUrl, archive(version));
  assert.equal(release.downloadUrl, release.installerUrl);
  assert.deepEqual(release.changes, snapshot.changes);
}

test("установщик предпочтительнее полного ZIP подтверждённого выпуска", async () => {
  await withFetch(jsonResponse(stableRelease(version, [archive(version), installer(version)])), assertConfirmedRelease);
});

test("при недоступном API доступны известные ссылки установщика и полного ZIP из metadata", async () => {
  await withFetch(async () => ({ ok: false }), assertConfirmedRelease);
  await withFetch(async () => { throw new Error("offline"); }, assertConfirmedRelease);
});

test("устаревший ответ API не понижает выпуск или ссылки", async () => {
  await withFetch(jsonResponse(stableRelease(previous, [installer(previous)])), assertConfirmedRelease);
});

test("новый выпуск с одним full ZIP не получает установщик старой версии", async () => {
  await withFetch(jsonResponse(stableRelease(future, [archive(future), installer(version)])), (release) => {
    assert.equal(release.version, future);
    assert.equal(release.changes, null, "несинхронизированный выпуск не получает старые notes");
    assert.equal(release.installerUrl, null);
    assert.equal(release.archiveUrl, archive(future));
    assert.equal(release.downloadUrl, release.archiveUrl);
  });
});

test("посторонние, неполные и подменённые assets не считаются дистрибутивом", async () => {
  await withFetch(jsonResponse(stableRelease(future, [
    `${prefix(future)}source.zip`,
    `${prefix(future)}RemCard-debug.exe`,
    `${prefix(future)}RemCard-Setup-${future}.exe?download=1`,
    `https://example.com/RemCard-Setup-${future}.exe`,
    installer(version),
    archive(version),
  ])), (release) => {
    assert.equal(release.version, future);
    assert.equal(release.changes, null, "несинхронизированный выпуск не получает старые notes");
    assert.equal(release.installerUrl, null);
    assert.equal(release.archiveUrl, null);
    assert.equal(release.downloadUrl, null);
  });
});

test("отсутствующие assets нового выпуска не выдумывают ссылку скачивания", async () => {
  const candidate = stableRelease(future);
  delete candidate.assets;
  await withFetch(jsonResponse(candidate), (release) => {
    assert.equal(release.version, future);
    assert.equal(release.changes, null, "несинхронизированный выпуск не получает старые notes");
    assert.equal(release.installerUrl, null);
    assert.equal(release.archiveUrl, null);
    assert.equal(release.downloadUrl, null);
  });
});
