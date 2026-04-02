import { githubFetch } from "./githubClient";
import type { User } from "./bst";

interface GitHubRepo {
  name: string;
  [key: string]: unknown;
}

interface GitHubContributor {
  login: string;
  avatar_url: string;
  contributions: number;
}

export async function fetchOrgRepositories(orgName: string): Promise<string[]> {
  const repos: string[] = [];
  let page = 1;

  while (true) {
    const url = `https://api.github.com/orgs/${encodeURIComponent(orgName)}/repos?per_page=100&page=${page}`;
    const response = await githubFetch(url);

    if (!response.ok) {
      throw new Error(
        `GitHub API error fetching repos for "${orgName}": ` +
          `${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as GitHubRepo[];

    if (data.length === 0) {
      break;
    }

    for (const repo of data) {
      repos.push(repo.name);
    }

    page++;
  }

  return repos;
}

export async function fetchAndAggregateContributors(
  orgName: string,
  repoNames: string[]
): Promise<User[]> {
  const CONCURRENCY = 8;
  const aggregated = new Map<string, User>();

  async function fetchRepo(repo: string): Promise<void> {
    const url =
      `https://api.github.com/repos/` +
      `${encodeURIComponent(orgName)}/${encodeURIComponent(repo)}/contributors` +
      `?per_page=100&anon=false`;

    let response: Response;
    try {
      response = await githubFetch(url);
    } catch (err) {
      console.warn(
        `[fetchAndAggregateContributors] Network error for "${repo}":`,
        err
      );
      return;
    }

    if (!response.ok) {
      console.warn(
        `[fetchAndAggregateContributors] Skipping "${repo}" — ` +
          `HTTP ${response.status} ${response.statusText}`
      );
      return;
    }

    const contributors =
      ((await response.json()) as GitHubContributor[] | null) ?? [];

    for (const contributor of contributors) {
      const existing = aggregated.get(contributor.login);
      if (existing) {
        existing.commits += contributor.contributions;
      } else {
        aggregated.set(contributor.login, {
          username: contributor.login,
          avatar_url: contributor.avatar_url,
          commits: contributor.contributions,
        });
      }
    }
  }

  for (let i = 0; i < repoNames.length; i += CONCURRENCY) {
    const batch = repoNames.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(fetchRepo));
  }

  return Array.from(aggregated.values());
}
