import { useState } from 'react';
import { UserCard } from './components/UserCard';
import { Leaderboard } from './components/Leaderboard';
import { UserProfile } from './components/UserProfile';
import styles from './App.module.css';

// Interface esperada do retorno do Backend
interface PlayerData {
  nome: string;
  commits: number;
  avatar_url?: string;
}

type View = 'leaderboard' | 'profile';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);

  // Navigation state
  const [view, setView] = useState<View>('leaderboard');
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);

  const handleUserClick = (username: string) => {
    setSelectedUsername(username);
    setView('profile');
  };

  const handleBack = () => {
    setView('leaderboard');
    setSelectedUsername(null);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setPlayerData(null);

    try {
      // Faz a requisição para a rota do Elysia
      const res = await fetch(`http://localhost:3000/search?q=${searchTerm}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Usuário não encontrado nos repositórios da organização eda2-2026.');
        }
        throw new Error('Erro ao buscar o usuário');
      }

      const data = await res.json();
      
      if (data.error) {
         throw new Error(data.error);
      }

      setPlayerData({
        nome: data.username || searchTerm,
        commits: data.commits || 0,
        avatar_url: data.avatar_url || `https://github.com/${data.username || searchTerm}.png`
      });

    } catch (err: unknown) {
      // Mock Data (Fallback Visual) só para o Frontend funcionar enquanto o Backend não está pronto
      if (searchTerm.toLowerCase() === 'mock') {
         setPlayerData({
            nome: "AlunoMock",
            commits: 1337,
            avatar_url: "https://github.com/github.png"
         });
      } else {
         setError(err instanceof Error ? err.message : 'Este usuário não commitou nos repositórios da eda2-2026.');
      }
    } finally {
      setLoading(false);
    }
  };

  // When in profile view, show the UserProfile screen
  if (view === 'profile' && selectedUsername) {
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
          </div>

          <UserProfile username={selectedUsername} onBack={handleBack} />
        </div>
      </div>
    );
  }

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
              placeholder="Pesquise um contribuidor da org (ex: usuário exato)..."
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
          <p className={styles.helperText}>Somente contribuidores listados na Árvore da organização eda2-2026 aparecerão nesta pesquisa O(log N).</p>
        </div>

        {/* Status / Errors */}
        {error && (
           <div className={styles.errorBox}>
             <strong style={{display: 'block', marginBottom: '4px'}}>Aviso da Árvore:</strong>
             {error}
           </div>
        )}

        {/* Resultado da busca */}
        {playerData && (
          <div className={styles.searchResultWrapper}>
            <div className={styles.searchResultActions}>
              <button
                className={styles.backToLeaderboardButton}
                onClick={() => { setPlayerData(null); setError(null); setSearchTerm(''); }}
                aria-label="Voltar ao leaderboard"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Voltar ao Leaderboard
              </button>
            </div>
            <UserCard 
              username={playerData.nome}
              avatarUrl={playerData.avatar_url!}
              commits={playerData.commits}
            />
            <button
              className={styles.profileButton}
              onClick={() => handleUserClick(playerData.nome)}
              aria-label={`Ver perfil completo de ${playerData.nome}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Ver Perfil Completo
            </button>
          </div>
        )}

        {/* Leaderboard da Árvore */}
        {!playerData && !loading && !error && (
           <Leaderboard onUserClick={handleUserClick} />
        )}

      </div>
    </div>
  );
}

export default App;
