const GITHUB_API_ACCEPT = "application/vnd.github.v3+json";

export function githubFetch(url: string, options?: RequestInit): Promise<Response> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error(
      "Missing GITHUB_TOKEN environment variable. " +
        "Copy backend/.env.example to backend/.env and set your token."
    );
  }

  const headers = new Headers(options?.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", GITHUB_API_ACCEPT);

  return fetch(url, { ...options, headers });
}
