export const PROJECT_VERSION_FALLBACK = "5.1.12";

const PROJECT_VERSION_PATTERN = /^\d+\.\d+\.\d+$/;

export function normalizeProjectVersion(value: string): string | null {
  const version = value.trim().replace(/^v/i, "");
  return PROJECT_VERSION_PATTERN.test(version) ? version : null;
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
