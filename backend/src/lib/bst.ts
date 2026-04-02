export interface User {
  username: string;
  commits: number;
  avatar_url: string;
}

export class Node {
  user: User;
  left: Node | null = null;
  right: Node | null = null;

  constructor(user: User) {
    this.user = user;
  }
}

export abstract class BinarySearchTree {
  protected root: Node | null = null;

  insert(user: User): void {
    const newNode = new Node(user);

    if (this.root === null) {
      this.root = newNode;
      return;
    }

    let current: Node = this.root;

    while (true) {
      if (this.goRight(user, current.user)) {
        if (current.right === null) {
          current.right = newNode;
          return;
        }
        current = current.right;
      } else {
        if (current.left === null) {
          current.left = newNode;
          return;
        }
        current = current.left;
      }
    }
  }

  protected abstract goRight(incoming: User, current: User): boolean;

  getRoot(): Node | null {
    return this.root;
  }
}

export class RankingTree extends BinarySearchTree {
  protected goRight(incoming: User, current: User): boolean {
    return incoming.commits >= current.commits;
  }
}

export class SearchTree extends BinarySearchTree {
  protected goRight(incoming: User, current: User): boolean {
    return incoming.username >= current.username;
  }
}

export function insertUser(
  user: User,
  rankingTree: RankingTree,
  searchTree: SearchTree
): void {
  rankingTree.insert(user);
  searchTree.insert(user);
}
