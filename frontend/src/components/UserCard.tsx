import React from 'react';

export interface UserCardProps {
  username: string;
  avatarUrl: string;
  commits: number;
}

export function UserCard({ username, avatarUrl, commits }: UserCardProps) {
  return (
    <div style={styles.cardContainer}>
      <div style={styles.cardGlow}></div>
      <div style={styles.cardContent}>
        
        {/* Avatar Area */}
        <div style={styles.avatarWrapper}>
          <img 
            src={avatarUrl} 
            alt={`Avatar de ${username}`} 
            style={styles.avatar} 
          />
          <div style={styles.levelBadge}>Top</div>
        </div>

        {/* User Info */}
        <div style={styles.userInfo}>
          <h2 style={styles.username}>@{username}</h2>
          <div style={styles.statsContainer}>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>Total de Commits</span>
              <span style={styles.statValue}>
                {commits.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>

        {/* Decorator */}
        <div style={styles.BSTLogo}>
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0, 240, 255, 0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <circle cx="12" cy="5" r="3"></circle>
             <line x1="12" y1="8" x2="8" y2="14"></line>
             <line x1="12" y1="8" x2="16" y2="14"></line>
             <circle cx="8" cy="17" r="3"></circle>
             <circle cx="16" cy="17" r="3"></circle>
           </svg>
        </div>

      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  cardContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '500px',
    marginTop: '2rem',
    borderRadius: '24px',
    transition: 'transform 0.3s ease',
  },
  cardGlow: {
    position: 'absolute',
    top: '-2px',
    left: '-2px',
    right: '-2px',
    bottom: '-2px',
    background: 'linear-gradient(135deg, #00f0ff, #8a2be2)',
    borderRadius: '26px',
    opacity: 0.5,
    filter: 'blur(10px)',
    zIndex: 0,
  },
  cardContent: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '24px',
    padding: '2rem',
    backdropFilter: 'blur(16px)',
    zIndex: 1,
  },
  avatarWrapper: {
    position: 'relative',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    padding: '4px',
    background: 'linear-gradient(135deg, #00f0ff 0%, #8a2be2 100%)',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid var(--bg-color)',
  },
  levelBadge: {
    position: 'absolute',
    bottom: '-5px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#8a2be2',
    color: '#fff',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    padding: '2px 8px',
    borderRadius: '12px',
    border: '2px solid var(--bg-color)',
    textTransform: 'uppercase',
  },
  userInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  username: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#fff',
    margin: 0,
  },
  statsContainer: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  statLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#00f0ff',
  },
  BSTLogo: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
  }
};
