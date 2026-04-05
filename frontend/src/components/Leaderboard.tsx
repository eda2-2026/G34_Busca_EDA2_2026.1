import { useEffect, useState } from 'react';
import styles from './Leaderboard.module.css';

interface UserData {
  username: string;
  commits: number;
  avatarUrl: string;
  rank: number;
}

interface LeaderboardProps {
  onUserClick: (username: string) => void;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export function Leaderboard({ onUserClick }: LeaderboardProps) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/ranking')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((u: { username: string; commits: number; avatar_url?: string; rank: number }) => ({
          username: u.username,
          commits: u.commits,
          avatarUrl: u.avatar_url || `https://github.com/${u.username}.png`,
          rank: u.rank,
        }));
        setUsers(formatted);
        setLoading(false);
      })
      .catch(() => {
        setError('Falha ao carregar a Árvore de Ranking (Servidor off?)');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className={styles.loadingBox}>Carregando Árvore...</div>;
  if (error) return <div className={styles.errorBox}>⚠️ {error}</div>;

  const podium = users.slice(0, 3);
  const topTen = users.slice(3, 10);
  const rest = users.slice(10);

  return (
    <div className={`${styles.boardContainer} animate-fade-in`}>
      <h2 className={styles.boardTitle}>🏆 Ranking de Contribuidores</h2>

      {/* Pódio — Top 3 */}
      {podium.length > 0 && (
        <div className={styles.podiumSection}>
          {podium.map((user, index) => (
            <div
              key={user.username}
              className={`${styles.podiumCard} ${styles[`podium${index + 1}` as keyof typeof styles]}`}
              onClick={() => onUserClick(user.username)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onUserClick(user.username)}
              aria-label={`Ver perfil de ${user.username}`}
            >
              <div className={styles.podiumMedal}>{MEDALS[index]}</div>
              <div className={styles.podiumAvatarWrapper}>
                <img
                  src={user.avatarUrl}
                  alt={`Avatar de ${user.username}`}
                  className={styles.podiumAvatar}
                />
              </div>
              <div className={styles.podiumUsername}>@{user.username}</div>
              <div className={styles.podiumCommits}>
                {user.commits.toLocaleString('pt-BR')} commits
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top 4–10 */}
      {topTen.length > 0 && (
        <div className={styles.topTenSection}>
          <div className={styles.sectionLabel}>Top 10</div>
          <div className={styles.list}>
            {topTen.map((user) => (
              <div
                key={user.username}
                className={`${styles.listItem} ${styles.topTenItem} animate-fade-in`}
                onClick={() => onUserClick(user.username)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onUserClick(user.username)}
                aria-label={`Ver perfil de ${user.username}`}
              >
                <div className={`${styles.rankBadge} ${styles.rankBadgeHighlight}`}>#{user.rank}</div>
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
      )}

      {/* Resto — 11+ */}
      {rest.length > 0 && (
        <div className={styles.restSection}>
          <div className={styles.sectionLabel}>Todos os Contribuidores</div>
          <div className={styles.list}>
            {rest.map((user) => (
              <div
                key={user.username}
                className={`${styles.listItem} ${styles.restItem} animate-fade-in`}
                onClick={() => onUserClick(user.username)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onUserClick(user.username)}
                aria-label={`Ver perfil de ${user.username}`}
              >
                <div className={styles.rankBadge}>#{user.rank}</div>
                <img src={user.avatarUrl} alt={`Avatar de ${user.username}`} className={`${styles.avatar} ${styles.avatarSmall}`} />
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
      )}
    </div>
  );
}
