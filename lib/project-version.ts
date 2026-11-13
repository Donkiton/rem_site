import publicRelease from "../content/public-release.json" with { type: "json" };

export type PublicReleaseChanges = Partial<Record<"ru" | "en" | "de" | "ja" | "zh-CN", string[]>>;

export const PUBLIC_RELEASE_SNAPSHOT: {
  schema_version: number;
  version: string;
  tag_name: string;
  published_at: string;
  release_url: string;
  installer_url: string;
  archive_url: string;
  checksums_url: string;
  source_commit: string;
  documentation_commit?: string | null;
  changes: PublicReleaseChanges;
} = publicRelease;
export const PROJECT_VERSION_FALLBACK = PUBLIC_RELEASE_SNAPSHOT.version;

const PROJECT_VERSION_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export function normalizeProjectVersion(value: string): string | null {
  const version = value.trim().replace(/^v/i, "");
  return PROJECT_VERSION_PATTERN.test(version) && version.split(".").every((part) => Number.isSafeInteger(Number(part))) ? version : null;
}

export function selectPublishedProjectVersion(candidate: {
  tag_name?: unknown;
  prerelease?: unknown;
  draft?: unknown;
}): string | null {
  const version = typeof candidate.tag_name === "string"
    ? normalizeProjectVersion(candidate.tag_name)
    : null;
  if (!version || candidate.prerelease !== false || candidate.draft !== false) return null;

  const candidateParts = version.split(".").map(Number);
  const confirmedParts = PROJECT_VERSION_FALLBACK.split(".").map(Number);
  for (let index = 0; index < confirmedParts.length; index += 1) {
    if (candidateParts[index] > confirmedParts[index]) return version;
    if (candidateParts[index] < confirmedParts[index]) return null;
  }
  return version;
}
