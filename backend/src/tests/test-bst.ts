import { RankingTree, SearchTree, insertUser, User } from "../lib/bst";

const rankingTree = new RankingTree();
const searchTree = new SearchTree();

const users: User[] = [
  { username: "alice", commits: 50, avatar_url: "https://example.com/alice.png", repos: [] },
  { username: "bob", commits: 30, avatar_url: "https://example.com/bob.png", repos: [] },
  { username: "charlie", commits: 80, avatar_url: "https://example.com/charlie.png", repos: [] },
  { username: "diana", commits: 20, avatar_url: "https://example.com/diana.png", repos: [] },
  { username: "eve", commits: 50, avatar_url: "https://example.com/eve.png", repos: [] },
];

console.log("=== Inserting users ===");
users.forEach((user) => {
  insertUser(user, rankingTree, searchTree);
  console.log(`Inserted: ${user.username} (${user.commits} commits)`);
});

function printTree(node: any, prefix: string = "", isLast: boolean = true): void {
  if (node === null) return;

  const connector = isLast ? "└── " : "├── ";
  console.log(`${prefix}${connector}[${node.user.username}] (commits: ${node.user.commits})`);

  const children: any[] = [];
  if (node.left) children.push({ node: node.left, side: "L" });
  if (node.right) children.push({ node: node.right, side: "R" });

  children.forEach((child, index) => {
    const isLastChild = index === children.length - 1;
    const newPrefix = prefix + (isLast ? "    " : "│   ");
    console.log(`${newPrefix}${child.side === "L" ? "┌── LEFT" : "┌── RIGHT"}:`);
    printTree(child.node, newPrefix, isLastChild);
  });
}

console.log("\n=== RankingTree Structure ===");
console.log("(Root)");
printTree(rankingTree.getRoot());

console.log("\n=== SearchTree Structure ===");
console.log("(Root)");
printTree(searchTree.getRoot());