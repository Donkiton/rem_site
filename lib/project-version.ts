export const PROJECT_VERSION_FALLBACK = "5.1.9";
export const PROJECT_VERSION_URL =
  "https://raw.githubusercontent.com/Donkiton/rem_card/main/VERSION";

const PROJECT_VERSION_PATTERN = /^\d+\.\d+\.\d+$/;

export function normalizeProjectVersion(value: string): string | null {
  const version = value.trim().replace(/^v/i, "");
  return PROJECT_VERSION_PATTERN.test(version) ? version : null;
}

export async function getProjectVersion(): Promise<string> {
  try {
    const response = await fetch(PROJECT_VERSION_URL, {
      headers: { Accept: "text/plain" },
      cache: "force-cache",
    });
    if (!response.ok) return PROJECT_VERSION_FALLBACK;
    return normalizeProjectVersion(await response.text()) ?? PROJECT_VERSION_FALLBACK;
  } catch {
    return PROJECT_VERSION_FALLBACK;
  }
}
