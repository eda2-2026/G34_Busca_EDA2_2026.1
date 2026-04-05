import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { RankingTree, SearchTree, insertUser } from "./lib/bst";
import { fetchOrgRepositories, fetchAndAggregateContributors } from "./lib/github";

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
  .get("/ranking", () => rankingTree.getRanking(100))
  .get("/search", ({ query }) => {
    if (!query.q) return { error: "Parâmetro de busca 'q' requerido" };
    const result = searchTree.searchByUsername(query.q as string);
    return result ? result : { error: "Usuário não encontrado" };
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
