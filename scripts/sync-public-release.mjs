import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPOSITORY = "https://github.com/Donkiton/rem_card";
const LOCALES = ["ru", "en", "de", "ja", "zh-CN"];
const VERSION_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const FIELDS = ["schema_version", "version", "tag_name", "published_at", "release_url", "installer_url", "archive_url", "checksums_url", "source_commit", "documentation_commit", "changes"];

function object(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function versionParts(value) {
  if (typeof value !== "string" || !VERSION_PATTERN.test(value)) throw new Error("version must be a stable major.minor.patch version");
  const parts = value.split(".").map(Number);
  if (!parts.every(Number.isSafeInteger)) throw new Error("version components exceed safe integers");
  return parts;
}

export function validatePublicReleaseMetadata(value, currentVersion) {
  if (!object(value) || Object.keys(value).some((key) => !FIELDS.includes(key))) throw new Error("invalid public release metadata fields");
  if (value.schema_version !== 1) throw new Error("unsupported schema_version");
  const parts = versionParts(value.version);
  if (currentVersion !== undefined) {
    const current = versionParts(currentVersion);
    const difference = parts.map((part, index) => part - current[index]).find((part) => part !== 0) ?? 0;
    if (difference < 0) throw new Error("public release version downgrade is forbidden");
  }
  const tag = `v${value.version}`;
  if (value.tag_name !== tag) throw new Error("tag_name does not match version");
  const prefix = `${REPOSITORY}/releases/download/${tag}/`;
  const expected = {
    release_url: `${REPOSITORY}/releases/tag/${tag}`,
    installer_url: `${prefix}RemCard-Setup-${value.version}.exe`,
    archive_url: `${prefix}RemCard_${value.version}_full.zip`,
    checksums_url: `${prefix}SHA256SUMS.txt`,
  };
  for (const [key, url] of Object.entries(expected)) {
    if (value[key] !== url) throw new Error(`${key} must be the canonical release URL`);
  }
  const date = value.published_at;
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(date) ||
      !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 19) !== date.slice(0, 19)) {
    throw new Error("published_at must be a valid UTC timestamp");
  }
  const commit = (sha, field) => {
    if (typeof sha !== "string" || !/^[\da-f]{40}$/i.test(sha)) throw new Error(`${field} must be a 40-character commit SHA`);
    return sha.toLowerCase();
  };
  const sourceCommit = commit(value.source_commit, "source_commit");
  const documentationCommit = value.documentation_commit == null ? null : commit(value.documentation_commit, "documentation_commit");
  if (!object(value.changes) || !Array.isArray(value.changes.ru) || Object.keys(value.changes).some((locale) => !LOCALES.includes(locale))) {
    throw new Error("changes must contain Russian release notes and only supported locale keys");
  }
  const changes = {};
  for (const locale of LOCALES) {
    if (!(locale in value.changes)) continue;
    const notes = value.changes[locale];
    if (!Array.isArray(notes) || notes.length === 0 || notes.length > 100 || notes.some((note) =>
      typeof note !== "string" || !note.trim() || note.length > 5000 || /[\u0000-\u001f\u007f]/.test(note))) {
      throw new Error(`changes.${locale} must contain nonempty plain-text release notes`);
    }
    changes[locale] = notes.map((note) => note.trim());
  }
  return {
    schema_version: 1,
    version: value.version,
    tag_name: tag,
    published_at: date,
    ...expected,
    source_commit: sourceCommit,
    documentation_commit: documentationCommit,
    changes,
  };
}

async function readMetadata(path) {
  const text = await readFile(path, "utf8");
  if (Buffer.byteLength(text) > 256 * 1024) throw new Error("public release metadata exceeds 256 KiB");
  return JSON.parse(text);
}

export async function syncPublicRelease(metadataPath, { projectRoot = PROJECT_ROOT } = {}) {
  const outputPath = resolve(projectRoot, "content/public-release.json");
  let currentText;
  let current;
  try {
    currentText = await readFile(outputPath, "utf8");
    current = validatePublicReleaseMetadata(JSON.parse(currentText));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const metadata = validatePublicReleaseMetadata(await readMetadata(resolve(metadataPath)), current?.version);
  const text = `${JSON.stringify(metadata, null, 2)}\n`;
  const changed = currentText !== text;
  if (changed) await writeFile(outputPath, text, "utf8");
  return { changed, version: metadata.version, path: "content/public-release.json" };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    if (process.argv.length !== 4 || process.argv[2] !== "--metadata") throw new Error("usage: node scripts/sync-public-release.mjs --metadata <path>");
    process.stdout.write(`${JSON.stringify(await syncPublicRelease(process.argv[3]))}\n`);
  } catch (error) {
    process.stderr.write(`Public release sync failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}
