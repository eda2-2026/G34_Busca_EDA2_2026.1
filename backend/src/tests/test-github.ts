import { githubFetch } from "../lib/githubClient";

async function testGitHubAPI() {
  console.log("=== Testando GitHub API - Organização eda2-2026 ===\n");

  try {
    console.log("1. Buscando organização eda2-2026...");
    const orgResponse = await githubFetch("https://api.github.com/orgs/eda2-2026");
    
    if (!orgResponse.ok) {
      console.error(`Erro na API: ${orgResponse.status} ${orgResponse.statusText}`);
      process.exit(1);
    }
    
    const orgData = await orgResponse.json();
    console.log(`   ✓ Organização encontrada: ${orgData.login}`);
    console.log(`   ✓ Repos públicos: ${orgData.public_repos}`);
    console.log(`   ✓URL: ${orgData.html_url}\n`);

    console.log("2. Buscando repositórios...");
    const reposResponse = await githubFetch("https://api.github.com/orgs/eda2-2026/repos?per_page=10");
    const reposData = await reposResponse.json();
    console.log(`   ✓ Repositórios encontrados:`);
    reposData.forEach((repo: any) => {
      console.log(`     - ${repo.name} (${repo.stargazers_count} stars, ${repo.language})`);
    });

    console.log("\n✅ Tudo funcionando!");
  } catch (error) {
    console.error("\n❌ Erro:", error);
    process.exit(1);
  }
}

testGitHubAPI();