import { fetchOrgRepositories, fetchAndAggregateContributors } from "./lib/github";

const ORG = "eda2-2026";

async function main() {
  console.log(`=== Agregando contribuidores da organização "${ORG}" ===\n`);

  console.log("1. Buscando lista de repositórios...");
  let repos: string[];
  try {
    repos = await fetchOrgRepositories(ORG);
    console.log(`   ✓ ${repos.length} repositórios encontrados\n`);
  } catch (err) {
    console.error("❌ Falha ao buscar repositórios:", err);
    process.exit(1);
  }

  console.log("2. Agregando contribuidores (com controle de concorrência)...");
  const start = Date.now();
  let users;
  try {
    users = await fetchAndAggregateContributors(ORG, repos);
  } catch (err) {
    console.error("❌ Falha inesperada na agregação:", err);
    process.exit(1);
  }
  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`   ✓ Agregação concluída em ${elapsed}s\n`);

  console.log(`3. Resultado — ${users.length} contribuidores únicos encontrados:\n`);

  users
    .slice()
    .sort((a, b) => b.commits - a.commits)
    .forEach((u, i) => {
      console.log(`   ${String(i + 1).padStart(3)}. ${u.username.padEnd(30)} commits: ${u.commits}`);
    });

  console.log("\n✅ fetchAndAggregateContributors funcionando corretamente!");
}

main();
