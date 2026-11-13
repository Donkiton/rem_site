import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import test from "node:test";
import snapshot from "../content/public-release.json" with { type: "json" };
import { syncPublicRelease, validatePublicReleaseMetadata } from "../scripts/sync-public-release.mjs";

const exec = promisify(execFile);
const nextVersion = snapshot.version.split(".").map(Number);
nextVersion[2] += 1;
const future = nextVersion.join(".");
const metadata = (version = snapshot.version) => {
  const prefix = `https://github.com/Donkiton/rem_card/releases/download/v${version}/`;
  return {
    ...structuredClone(snapshot),
    version,
    tag_name: `v${version}`,
    release_url: `https://github.com/Donkiton/rem_card/releases/tag/v${version}`,
    installer_url: `${prefix}RemCard-Setup-${version}.exe`,
    archive_url: `${prefix}RemCard_${version}_full.zip`,
    checksums_url: `${prefix}SHA256SUMS.txt`,
  };
};

test("seed metadata accepts the released source and nullable documentation provenance", () => {
  assert.deepEqual(validatePublicReleaseMetadata(snapshot), snapshot);
  const withDocumentation = metadata();
  withDocumentation.documentation_commit = "a".repeat(40);
  assert.equal(validatePublicReleaseMetadata(withDocumentation).documentation_commit, "a".repeat(40));
  delete withDocumentation.documentation_commit;
  assert.equal(validatePublicReleaseMetadata(withDocumentation).documentation_commit, null);
});

test("metadata rejects prereleases, malformed fields, dates, source commits and noncanonical asset URLs", () => {
  for (const patch of [
    { schema_version: 2 }, { version: `${future}-beta.1` }, { version: "05.1.1" },
    { tag_name: "v0.0.0" }, { published_at: "2026-02-30T00:00:00Z" },
    { published_at: "2026-11-13" }, { source_commit: "HEAD" },
    { documentation_commit: "main" }, { prerelease: true },
    { release_url: "https://example.com/release" },
    { installer_url: `${snapshot.installer_url}?download=1` },
    { archive_url: snapshot.archive_url.replace("_full.zip", "_update.zip") },
    { checksums_url: snapshot.checksums_url.replace("SHA256SUMS.txt", "checksums.txt") },
    { changes: [] }, { changes: {} }, { changes: { ru: [] } },
    { changes: { ru: [""] } }, { changes: { ru: [42] } },
    { changes: { ru: ["note\u0000"] } }, { changes: { ru: ["note"], fr: ["note"] } },
    { changes: { ru: ["note"], en: "not an array" } },
  ]) assert.throws(() => validatePublicReleaseMetadata({ ...metadata(), ...patch }), undefined, JSON.stringify(patch));
});

test("metadata version comparison blocks downgrades and allows a future stable release", () => {
  assert.throws(() => validatePublicReleaseMetadata(snapshot, future), /downgrade/);
  assert.equal(validatePublicReleaseMetadata(metadata(future), snapshot.version).version, future);
});

test("optional localized notes are preserved without inventing translations", () => {
  const value = metadata();
  value.changes.en = ["Published English notes"];
  const validated = validatePublicReleaseMetadata(value);
  assert.deepEqual(validated.changes.en, value.changes.en);
  assert.equal(validated.changes.de, undefined);
});

test("sync is idempotent, updates only its snapshot and leaves input and other files intact", async () => {
  const root = await mkdtemp(join(tmpdir(), "rem-site-release-sync-"));
  try {
    await mkdir(join(root, "content"));
    const original = `${JSON.stringify(snapshot, null, 2)}\n`;
    const inputPath = join(root, "incoming.json");
    await writeFile(join(root, "content/public-release.json"), original);
    await writeFile(join(root, "README.md"), "User documentation\n");
    await writeFile(inputPath, JSON.stringify(metadata(future)));
    assert.deepEqual(await syncPublicRelease(inputPath, { projectRoot: root }), { changed: true, version: future, path: "content/public-release.json" });
    const updated = await readFile(join(root, "content/public-release.json"), "utf8");
    assert.equal(JSON.parse(updated).version, future);
    assert.deepEqual(await syncPublicRelease(inputPath, { projectRoot: root }), { changed: false, version: future, path: "content/public-release.json" });
    assert.equal(await readFile(join(root, "content/public-release.json"), "utf8"), updated);
    assert.equal(await readFile(join(root, "README.md"), "utf8"), "User documentation\n");
    assert.equal(await readFile(inputPath, "utf8"), JSON.stringify(metadata(future)));
    assert.deepEqual(await readdir(join(root, "content")), ["public-release.json"]);
    await writeFile(inputPath, JSON.stringify(snapshot));
    await assert.rejects(syncPublicRelease(inputPath, { projectRoot: root }), /downgrade/);
    assert.equal(await readFile(join(root, "content/public-release.json"), "utf8"), updated);
    await writeFile(inputPath, "not JSON");
    await assert.rejects(syncPublicRelease(inputPath, { projectRoot: root }), SyntaxError);
    assert.equal(await readFile(join(root, "content/public-release.json"), "utf8"), updated);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("CLI refuses unknown arguments before writing", async () => {
  const script = new URL("../scripts/sync-public-release.mjs", import.meta.url);
  await assert.rejects(exec(process.execPath, [fileURLToPath(script), "--unknown"]), (error) => {
    assert.equal(error.code, 1);
    assert.match(error.stderr, /usage:/);
    return true;
  });
});
