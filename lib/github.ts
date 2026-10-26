import { PROJECT_VERSION_FALLBACK, selectPublishedProjectVersion } from "@/lib/project-version";

export type GitHubMetrics =
  | {
      available: true;
      stars: number;
      forks: number;
      openIssues: number;
    }
  | {
      available: false;
    };

type GitHubRepositoryResponse = {
  stargazers_count?: unknown;
  forks_count?: unknown;
  open_issues_count?: unknown;
};

type GitHubReleaseResponse = {
  tag_name?: unknown;
  name?: unknown;
  html_url?: unknown;
  prerelease?: unknown;
  draft?: unknown;
  published_at?: unknown;
  assets?: Array<{ browser_download_url?: unknown }>;
};

export type GitHubReleaseInfo = {
  version: string;
  name: string;
  url: string;
  downloadUrl: string | null;
  prerelease: boolean;
  publishedAt: string;
};

const CONFIRMED_RELEASE: GitHubReleaseInfo = {
  version: PROJECT_VERSION_FALLBACK,
  name: `RemCard ${PROJECT_VERSION_FALLBACK}`,
  url: `https://github.com/Donkiton/rem_card/releases/tag/v${PROJECT_VERSION_FALLBACK}`,
  downloadUrl: null,
  prerelease: false,
  publishedAt: "2026-10-25",
};

function githubHeaders() {
  const token = process.env.GITHUB_TOKEN?.trim();
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getGitHubMetrics(): Promise<GitHubMetrics> {
  try {
    const response = await fetch("https://api.github.com/repos/Donkiton/rem_card", {
      headers: githubHeaders(),
      cache: "force-cache",
    });

    if (!response.ok) {
      return { available: false };
    }

    const data = (await response.json()) as GitHubRepositoryResponse;
    if (
      typeof data.stargazers_count !== "number" ||
      typeof data.forks_count !== "number" ||
      typeof data.open_issues_count !== "number"
    ) {
      return { available: false };
    }

    return {
      available: true,
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssues: data.open_issues_count,
    };
  } catch {
    return { available: false };
  }
}

export async function getLatestGitHubRelease(): Promise<GitHubReleaseInfo> {
  try {
    const response = await fetch(
      "https://api.github.com/repos/Donkiton/rem_card/releases/latest",
      {
        headers: githubHeaders(),
      },
    );
    if (!response.ok) return CONFIRMED_RELEASE;

    const release = (await response.json()) as GitHubReleaseResponse | null;
    const version = release ? selectPublishedProjectVersion(release) : null;
    if (
      !release ||
      !version ||
      typeof release.name !== "string" ||
      typeof release.html_url !== "string" ||
      release.html_url !== `https://github.com/Donkiton/rem_card/releases/tag/v${version}` ||
      typeof release.published_at !== "string"
    ) {
      return CONFIRMED_RELEASE;
    }

    const assetUrl = release.assets?.find(
      (asset) => typeof asset.browser_download_url === "string" &&
        asset.browser_download_url.startsWith(`https://github.com/Donkiton/rem_card/releases/download/v${version}/`) &&
        asset.browser_download_url.endsWith(".zip"),
    )?.browser_download_url;
    return {
      version,
      name: release.name,
      url: release.html_url,
      downloadUrl: typeof assetUrl === "string" ? assetUrl : null,
      prerelease: false,
      publishedAt: release.published_at,
    };
  } catch {
    return CONFIRMED_RELEASE;
  }
}
