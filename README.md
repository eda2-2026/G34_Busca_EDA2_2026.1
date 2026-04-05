# EDA2 Busca — GitHub Leaderboard BST

Aplicação web full-stack que consome a API pública do GitHub para agregar o total de commits dos contribuidores da organização `eda2-2026` e exibir um ranking gamificado utilizando estruturas de dados eficientes (BST) em memória.

## 🚀 Tecnologias

- **Backend:** Bun 1.3.9 + ElysiaJS + TypeScript
- **Frontend:** React 19 + Vite 8 + TypeScript
- **Package Manager:** Bun

## ⚙️ Configuração

### 1. Variáveis de Ambiente

O projeto requer um token de autenticação do GitHub para evitar rate limits da API pública.

```bash
# Copie o exemplo e configure seu token
cp backend/.env.example backend/.env
```

Edite o arquivo `backend/.env` e adicione seu token:

```env
GITHUB_TOKEN=seu_token_aqui
```

**Como obter um token do GitHub:**
1. Acesse GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Crie um novo token com escopo `public_repo` (necessário para ler repositórios públicos)
3. Copie o token gerado

### 2. Instalação

```bash
# Instalar dependências do backend
cd backend && bun install

# Instalar dependências do frontend
cd ../frontend && bun install
```

## ▶️ Executando o Projeto

```bash
# Terminal 1 - Backend (porta 3000)
cd backend && bun run dev

# Terminal 2 - Frontend (porta 5173)
cd frontend && bun run dev
```

## 📡 Acessos

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

### Endpoints Disponíveis

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/ping` | Verifica se o servidor está online |
| `GET` | `/ranking` | Retorna o ranking completo de contribuidores |
| `GET` | `/search?q=username` | Busca um usuário específico |
| `GET` | `/user/:username` | Retorna perfil detalhado do usuário |
| `GET` | `/user/:username/commits` | Retorna histórico de commits do usuário |
| `POST` | `/refresh` | Atualiza os dados buscando no GitHub |

## 🏗️ Arquitetura

O projeto utiliza duas Árvores Binárias de Busca (BST) em memória:

- **RankingTree:** Ordenada por número de commits — travessia In-Order Reversa para ranking decrescente
- **SearchTree:** Ordenada por username — busca binária O(log N)

Não há banco de dados — todos os dados são armazenados em memória durante a execução.

## 📂 Estrutura

```
eda2_busca/
├── backend/
│   └── src/
│       ├── index.ts        # Servidor Elysia + rotas
│       └── lib/
│           ├── bst.ts      # Implementação das BSTs
│           ├── github.ts   # Integração com API GitHub
│           └── githubClient.ts # Cliente HTTP com autenticação
└── frontend/
    └── src/
        ├── App.tsx               # Componente principal
        ├── components/
        │   ├── Leaderboard.tsx   # Ranking de contribuidores
        │   ├── UserCard.tsx      # Cartão de resultado de busca
        │   └── UserProfile.tsx   # Perfil detalhado do usuário
        └── index.css             # Estilos globais
```