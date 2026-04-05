import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { RankingTree, SearchTree, insertUser } from "./lib/bst";
import { fetchOrgRepositories, fetchAndAggregateContributors, fetchUserCommits } from "./lib/github";

export let rankingTree = new RankingTree();
export let searchTree = new SearchTree();


async function bootstrapApp(): Promise<void> {
  console.log("[Startup] Buscando dados no GitHub...");

  const repos = await fetchOrgRepositories("eda2-2026");
  const users = await fetchAndAggregateContributors("eda2-2026", repos);

  console.log("[Startup] Populando árvores...");

  for (const user of users) {
    insertUser(user, rankingTree, searchTree);
  }

  console.log(
    `[Startup] Árvores populadas com sucesso com ${users.length} usuários! Servidor pronto.`
  );
}


const app = new Elysia()
  .use(cors())
  .get("/", () => "Hello Elysia")
  .get("/ping", () => ({ message: "Backend ta On." }))
  .get("/ranking", () => {
    const users = rankingTree.getRanking(10000);
    return users.map((user, index) => ({
      username: user.username,
      commits: user.commits,
      avatar_url: user.avatar_url,
      rank: index + 1,
    }));
  })
  .get("/search", ({ query }) => {
    if (!query.q) return { error: "Parâmetro de busca 'q' requerido" };
    const result = searchTree.searchByUsername(query.q as string);
    return result ? result : { error: "Usuário não encontrado" };
  })
  .get("/user/:username", ({ params, set }) => {
    const user = searchTree.searchByUsername(params.username);
    if (!user) {
      set.status = 404;
      return { error: "Usuário não encontrado" };
    }
    const rank = rankingTree.getUserRank(params.username);
    return {
      username: user.username,
      commits: user.commits,
      avatar_url: user.avatar_url,
      rank: rank === -1 ? null : rank,
      repos: user.repos,
    };
  })
  .get("/user/:username/commits", async ({ params, set }) => {
    const user = searchTree.searchByUsername(params.username);
    if (!user) {
      set.status = 404;
      return { error: "Usuário não encontrado" };
    }

    const repoNames = user.repos.map((r) => r.name);

    try {
      const commits = await fetchUserCommits("eda2-2026", params.username, repoNames);
      return { username: user.username, commits };
    } catch (err) {
      console.error("[/user/commits] Erro ao buscar commits:", err);
      set.status = 500;
      return { error: "Falha ao buscar commits do usuário" };
    }
  })
  .post("/refresh", async ({ set }) => {
    try {
      console.log("[Refresh] Buscando dados atualizados no GitHub...");

      const repos = await fetchOrgRepositories("eda2-2026");
      const users = await fetchAndAggregateContributors("eda2-2026", repos);

      const newRankingTree = new RankingTree();
      const newSearchTree = new SearchTree();

      for (const user of users) {
        insertUser(user, newRankingTree, newSearchTree);
      }
      rankingTree = newRankingTree;
      searchTree = newSearchTree;

      console.log(
        `[Refresh] Ranking atualizado com sucesso com ${users.length} usuários.`
      );

      return { message: "Ranking atualizado com sucesso!", total_users: users.length };
    } catch (err) {
      console.error("[Refresh] Erro ao atualizar ranking:", err);
      set.status = 500;
      return { error: "Falha ao atualizar ranking. Dados anteriores preservados." };
    }
  });

await bootstrapApp();

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
