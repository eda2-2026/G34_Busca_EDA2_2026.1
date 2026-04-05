
import styles from './UserCard.module.css';

export interface UserCardProps {
  username: string;
  avatarUrl: string;
  commits: number;
}

export function UserCard({ username, avatarUrl, commits }: UserCardProps) {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardGlow}></div>
      <div className={styles.cardContent}>
        
        {/* Avatar Area */}
        <div className={styles.avatarWrapper}>
          <img 
            src={avatarUrl} 
            alt={`Avatar de ${username}`} 
            className={styles.avatar} 
          />
          <div className={styles.levelBadge}>Top</div>
        </div>

        {/* User Info */}
        <div className={styles.userInfo}>
          <h2 className={styles.username}>@{username}</h2>
          <div className={styles.statsContainer}>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Total de Commits</span>
              <span className={styles.statValue}>
                {commits.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>

        {/* Decorator */}
        <div className={styles.BSTLogo}>
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
