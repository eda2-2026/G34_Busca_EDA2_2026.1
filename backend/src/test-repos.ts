import { fetchOrgRepositories } from "./lib/github";

async function main() {
  const org = "eda2-2026";
  console.log(`=== Buscando repositórios da organização "${org}" ===\n`);

  try {
    const repos = await fetchOrgRepositories(org);

    console.log(`✓ Total de repositórios encontrados: ${repos.length}\n`);
    console.log("Repositórios:");
    repos.forEach((name, i) => {
      console.log(`  ${i + 1}. ${name}`);
    });

    console.log("\n✅ fetchOrgRepositories funcionando corretamente!");
  } catch (error) {
    console.error("\n❌ Erro:", error);
    process.exit(1);
  }
}

main();
