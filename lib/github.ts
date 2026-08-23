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

export async function getLatestGitHubRelease(): Promise<GitHubReleaseInfo | null> {
  try {
    const response = await fetch(
      "https://api.github.com/repos/Donkiton/rem_card/releases?per_page=1",
      {
        headers: githubHeaders(),
        cache: "force-cache",
      },
    );
    if (!response.ok) return null;

    const [release] = (await response.json()) as GitHubReleaseResponse[];
    const version =
      typeof release?.tag_name === "string" ? release.tag_name.replace(/^v/i, "") : null;
    if (
      !version ||
      typeof release.name !== "string" ||
      typeof release.html_url !== "string" ||
      typeof release.prerelease !== "boolean" ||
      typeof release.published_at !== "string"
    ) {
      return null;
    }

    const assetUrl = release.assets?.find(
      (asset) => typeof asset.browser_download_url === "string",
    )?.browser_download_url;
    return {
      version,
      name: release.name,
      url: release.html_url,
      downloadUrl: typeof assetUrl === "string" ? assetUrl : null,
      prerelease: release.prerelease,
      publishedAt: release.published_at,
    };
  } catch {
    return null;
  }
}
