import React, { useEffect, useState } from 'react';
import styles from './Leaderboard.module.css';

interface UserData {
  username: string;
  commits: number;
  avatarUrl: string;
}

export function Leaderboard() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/ranking')
      .then(res => res.json())
      .then(data => {
        // A árvore retorna a lista ordenada por commits ou afins
        const formatted = data.map((u: any) => ({
          username: u.username,
          commits: u.commits,
          avatarUrl: u.avatar_url || `https://github.com/${u.username}.png`
        }));
        setUsers(formatted.slice(0, 10)); // Mostrar apenas os 10 mais para o "pódio"
        setLoading(false);
      })
      .catch(() => {
        setError('Falha ao carregar a Árvore de Ranking (Servidor off?)');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className={styles.loadingBox}>Carregando Árvore...</div>;
  if (error) return <div className={styles.errorBox}>⚠️ {error}</div>;

  return (
    <div className={`${styles.boardContainer} animate-fade-in`}>
      <h2 className={styles.boardTitle}>🏆 Top 10 Contribuidores</h2>
      
      <div className={styles.list}>
        {users.map((user, index) => (
          <div 
            key={user.username} 
            className={`${styles.listItem} animate-fade-in`} 
            style={{ animationDelay: `${Math.min(index * 0.1, 1)}s` }}
          >
            <div className={styles.rankBadge}>#{index + 1}</div>
            <img src={user.avatarUrl} alt={`Avatar de ${user.username}`} className={styles.avatar} />
            <div className={styles.info}>
              <span className={styles.username}>@{user.username}</span>
              <span className={styles.commits}>
                {user.commits.toLocaleString('pt-BR')} commits
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
