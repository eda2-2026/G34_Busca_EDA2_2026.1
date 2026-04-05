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

interface GitHubCommitItem {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      date: string;
    } | null;
  };
}

export interface CommitEntry {
  sha: string;
  shortSha: string;
  message: string;
  date: string;
  url: string;
  repo: string;
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

  // Map<username, User> for total commits aggregation
  const aggregated = new Map<string, User>();
  // Map<username, Map<repoName, commits>> for per-repo tracking
  const repoMap = new Map<string, Map<string, number>>();

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
      const login = contributor.login;

      // Aggregate total commits
      const existing = aggregated.get(login);
      if (existing) {
        existing.commits += contributor.contributions;
      } else {
        aggregated.set(login, {
          username: login,
          avatar_url: contributor.avatar_url,
          commits: contributor.contributions,
          repos: [],
        });
      }

      // Track per-repo commits
      if (!repoMap.has(login)) {
        repoMap.set(login, new Map<string, number>());
      }
      const userRepos = repoMap.get(login)!;
      const existing_repo_commits = userRepos.get(repo) ?? 0;
      userRepos.set(repo, existing_repo_commits + contributor.contributions);
    }
  }

  for (let i = 0; i < repoNames.length; i += CONCURRENCY) {
    const batch = repoNames.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(fetchRepo));
  }

  // Populate repos array on each user, sorted by commits descending
  for (const [login, user] of aggregated) {
    const userRepoMap = repoMap.get(login);
    if (userRepoMap) {
      user.repos = Array.from(userRepoMap.entries())
        .map(([name, commits]) => ({ name, commits }))
        .sort((a, b) => b.commits - a.commits);
    }
  }

  return Array.from(aggregated.values());
}

export async function fetchUserCommits(
  orgName: string,
  username: string,
  repoNames: string[]
): Promise<CommitEntry[]> {
  const CONCURRENCY = 6;
  const allCommits: CommitEntry[] = [];

  async function fetchRepoCommits(repo: string): Promise<void> {
    let page = 1;

    while (true) {
      const url =
        `https://api.github.com/repos/` +
        `${encodeURIComponent(orgName)}/${encodeURIComponent(repo)}/commits` +
        `?author=${encodeURIComponent(username)}&per_page=100&page=${page}`;

      let response: Response;
      try {
        response = await githubFetch(url);
      } catch (err) {
        console.warn(`[fetchUserCommits] Network error for "${repo}" page ${page}:`, err);
        break;
      }

      if (!response.ok) {
        console.warn(
          `[fetchUserCommits] Skipping "${repo}" page ${page} — HTTP ${response.status}`
        );
        break;
      }

      const items = ((await response.json()) as GitHubCommitItem[] | null) ?? [];

      if (items.length === 0) break;

      for (const item of items) {
        allCommits.push({
          sha: item.sha,
          shortSha: item.sha.slice(0, 7),
          message: item.commit.message.split("\n")[0], // só a primeira linha
          date: item.commit.author?.date ?? "",
          url: item.html_url,
          repo,
        });
      }

      if (items.length < 100) break;
      page++;
    }
  }

  for (let i = 0; i < repoNames.length; i += CONCURRENCY) {
    const batch = repoNames.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(fetchRepoCommits));
  }

  // Ordena por data decrescente
  allCommits.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return allCommits;
}
