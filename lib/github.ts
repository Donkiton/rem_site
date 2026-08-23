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

export async function getGitHubMetrics(): Promise<GitHubMetrics> {
  try {
    const response = await fetch("https://api.github.com/repos/Donkiton/rem_card", {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
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
