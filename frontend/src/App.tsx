import React, { useState } from 'react';
import { UserCard } from './components/UserCard';

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
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        
        {/* Header / Título */}
        <div style={styles.header}>
          <div style={styles.badge}>
            <span style={styles.badgeDot}></span>
            BST Leaderboard
          </div>
          <h1 style={styles.title}>
            Buscador de <span style={styles.highlight}>Commits</span>
          </h1>
          <p style={styles.subtitle}>
            Explore os repositórios da organização EDA2 e encontre quem mais contribuiu, organizados via Árvore Binária de Busca.
          </p>
        </div>

        {/* Search Input Area */}
        <div style={styles.searchContainer}>
          <div style={styles.inputWrapper}>
            <svg style={styles.searchIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              style={styles.input} 
              placeholder="Digite o nome de usuário do GitHub..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              style={styles.button} 
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        {/* Status / Errors */}
        {error && (
           <div style={styles.errorBox}>
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

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: '2rem',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: '800px',
    display: 'flex',
    flexDirection: 'column',
    gap: '3rem',
    alignItems: 'center',
  },
  header: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'rgba(0, 240, 255, 0.1)',
    border: '1px solid rgba(0, 240, 255, 0.2)',
    borderRadius: '100px',
    color: '#00f0ff',
    fontSize: '0.875rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  badgeDot: {
    width: '6px',
    height: '6px',
    backgroundColor: '#00f0ff',
    borderRadius: '50%',
    boxShadow: '0 0 8px #00f0ff',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    color: '#ffffff',
  },
  highlight: {
    background: 'linear-gradient(135deg, #00f0ff 0%, #8a2be2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 30px rgba(0, 240, 255, 0.3)',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '1.125rem',
    maxWidth: '500px',
    lineHeight: 1.6,
  },
  searchContainer: {
    width: '100%',
    maxWidth: '600px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '0.5rem',
    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(12px)',
    transition: 'all 0.3s ease',
  },
  searchIcon: {
    color: '#64748b',
    marginLeft: '1rem',
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    padding: '1rem 1rem',
    fontSize: '1.125rem',
    color: '#ffffff',
    outline: 'none',
    fontFamily: 'inherit',
  },
  button: {
    background: 'linear-gradient(135deg, #00f0ff 0%, #00a3ff 100%)',
    color: '#0b0f19',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)',
  },
  errorBox: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    padding: '1rem 2rem',
    borderRadius: '12px',
    fontWeight: 600,
  }
};

export default App;