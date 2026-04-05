import React, { useState } from 'react';
import { UserCard } from './components/UserCard';
import styles from './App.module.css';

// Interface esperada do retorno do Backend
interface PlayerData {
  nome: string;
  commits: number;
  avatar_url?: string;
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setPlayerData(null);

    try {
      // Faz a requisição para a sua rota do Elysia
      const res = await fetch(`http://localhost:3000/player/${searchTerm}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Usuário não encontrado na Árvore.');
        }
        throw new Error('Erro ao buscar o usuário');
      }

      const data = await res.json();
      setPlayerData({
        nome: data.nome || searchTerm,
        commits: data.commits || 0,
        // Caso o backend ainda não retorne o avatar, simulamos pelo github
        avatar_url: data.avatar_url || `https://github.com/${searchTerm}.png`
      });

    } catch (err: any) {
      // Mock Data (Fallback Visual) só para o Frontend funcionar enquanto o Backend não está pronto
      if (searchTerm.toLowerCase() === 'mock') {
         setPlayerData({
            nome: "AlunoMock",
            commits: 1337,
            avatar_url: "https://github.com/github.png"
         });
      } else {
         setError(err.message || 'Erro desconhecido. Tente usar "mock".');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        
        {/* Header / Título */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <span className={styles.badgeDot}></span>
            BST Leaderboard
          </div>
          <h1 className={styles.title}>
            Buscador de <span className={styles.highlight}>Commits</span>
          </h1>
          <p className={styles.subtitle}>
            Explore os repositórios da organização EDA2 e encontre quem mais contribuiu, organizados via Árvore Binária de Busca.
          </p>
        </div>

        {/* Search Input Area */}
        <div className={styles.searchContainer}>
          <div className={styles.inputWrapper}>
            <svg className={styles.searchIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="Digite o nome de usuário do GitHub..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              className={styles.button} 
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        {/* Status / Errors */}
        {error && (
           <div className={styles.errorBox}>
             ⚠️ {error}
           </div>
        )}

        {/* Resultado */}
        {playerData && (
          <UserCard 
            username={playerData.nome}
            avatarUrl={playerData.avatar_url!}
            commits={playerData.commits}
          />
        )}

      </div>
    </div>
  );
}

export default App;