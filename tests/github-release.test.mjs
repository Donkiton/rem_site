import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

// Compile the production module while resolving its Next.js alias for Node's test runner.
const source = (await readFile(new URL("../lib/github.ts", import.meta.url), "utf8"))
  .replace('"@/lib/project-version"', JSON.stringify(new URL("../lib/project-version.ts", import.meta.url).href));
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { getLatestGitHubRelease } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

const prefix = (version) => `https://github.com/Donkiton/rem_card/releases/download/v${version}/`;
const installer = (version) => `${prefix(version)}RemCard-Setup-${version}.exe`;
const archive = (version) => `${prefix(version)}RemCard_${version}_full.zip`;
const stableRelease = (version, urls = []) => ({
  tag_name: `v${version}`,
  name: `RemCard ${version}`,
  html_url: `https://github.com/Donkiton/rem_card/releases/tag/v${version}`,
  prerelease: false,
  draft: false,
  published_at: "2026-11-13T08:48:07Z",
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
  assert.equal(release.version, "5.1.20");
  assert.equal(release.publishedAt, "2026-11-13T08:48:07Z");
  assert.equal(release.installerUrl, installer("5.1.20"));
  assert.equal(release.archiveUrl, archive("5.1.20"));
  assert.equal(release.downloadUrl, release.installerUrl);
}

test("установщик предпочтительнее полного ZIP подтверждённого выпуска", async () => {
  await withFetch(jsonResponse(stableRelease("5.1.20", [archive("5.1.20"), installer("5.1.20")])), assertConfirmedRelease);
});

test("при недоступном API доступны известные ссылки установщика и полного ZIP 5.1.20", async () => {
  await withFetch(async () => ({ ok: false }), assertConfirmedRelease);
  await withFetch(async () => { throw new Error("offline"); }, assertConfirmedRelease);
});

test("устаревший ответ API не понижает выпуск или ссылки", async () => {
  await withFetch(jsonResponse(stableRelease("5.1.19", [installer("5.1.19")])), assertConfirmedRelease);
});

test("новый выпуск с одним full ZIP не получает установщик старой версии", async () => {
  await withFetch(jsonResponse(stableRelease("5.1.21", [archive("5.1.21"), installer("5.1.20")])), (release) => {
    assert.equal(release.version, "5.1.21");
    assert.equal(release.installerUrl, null);
    assert.equal(release.archiveUrl, archive("5.1.21"));
    assert.equal(release.downloadUrl, release.archiveUrl);
  });
});

test("посторонние, неполные и подменённые assets не считаются дистрибутивом", async () => {
  await withFetch(jsonResponse(stableRelease("5.1.21", [
    `${prefix("5.1.21")}source.zip`,
    `${prefix("5.1.21")}RemCard-debug.exe`,
    `${prefix("5.1.21")}RemCard-Setup-5.1.21.exe?download=1`,
    "https://example.com/RemCard-Setup-5.1.21.exe",
    installer("5.1.20"),
    archive("5.1.20"),
  ])), (release) => {
    assert.equal(release.version, "5.1.21");
    assert.equal(release.installerUrl, null);
    assert.equal(release.archiveUrl, null);
    assert.equal(release.downloadUrl, null);
  });
});

test("отсутствующие assets нового выпуска не выдумывают ссылку скачивания", async () => {
  const candidate = stableRelease("5.1.21");
  delete candidate.assets;
  await withFetch(jsonResponse(candidate), (release) => {
    assert.equal(release.version, "5.1.21");
    assert.equal(release.installerUrl, null);
    assert.equal(release.archiveUrl, null);
    assert.equal(release.downloadUrl, null);
  });
});
