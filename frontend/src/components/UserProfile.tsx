import { useEffect, useState } from 'react';
import styles from './UserProfile.module.css';

interface RepoContribution {
  name: string;
  commits: number;
}

interface UserProfileData {
  username: string;
  commits: number;
  avatar_url: string;
  rank: number | null;
  repos: RepoContribution[];
}

interface CommitEntry {
  sha: string;
  shortSha: string;
  message: string;
  date: string;
  url: string;
  repo: string;
}

interface UserProfileProps {
  username: string;
  onBack: () => void;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function UserProfile({ username, onBack }: UserProfileProps) {
  const [data, setData] = useState<UserProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);

  const [commits, setCommits] = useState<CommitEntry[]>([]);
  const [loadingCommits, setLoadingCommits] = useState(false);
  const [errorCommits, setErrorCommits] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const res = await fetch(`http://localhost:3000/user/${encodeURIComponent(username)}`);
        if (!res.ok) {
          const body = await res.json() as { error?: string };
          throw new Error(body.error || 'Erro ao carregar perfil');
        }
        const profile = await res.json() as UserProfileData;
        if (!cancelled) {
          setData(profile);
          setLoadingProfile(false);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setErrorProfile(err instanceof Error ? err.message : 'Erro ao carregar perfil');
          setLoadingProfile(false);
        }
      }
    }

    setLoadingProfile(true);
    setErrorProfile(null);
    setData(null);
    setCommits([]);
    void loadProfile();

    return () => { cancelled = true; };
  }, [username]);

  // Busca commits após perfil carregar
  useEffect(() => {
    if (!data) return;
    let cancelled = false;

    async function loadCommits() {
      setLoadingCommits(true);
      setErrorCommits(null);
      try {
        const res = await fetch(`http://localhost:3000/user/${encodeURIComponent(username)}/commits`);
        if (!res.ok) {
          const body = await res.json() as { error?: string };
          throw new Error(body.error || 'Erro ao carregar commits');
        }
        const body = await res.json() as { username: string; commits: CommitEntry[] };
        if (!cancelled) {
          setCommits(body.commits);
          setLoadingCommits(false);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setErrorCommits(err instanceof Error ? err.message : 'Erro ao carregar commits');
          setLoadingCommits(false);
        }
      }
    }

    void loadCommits();
    return () => { cancelled = true; };
  }, [data, username]);

  return (
    <div className={`${styles.profileWrapper} animate-fade-in`}>
      {/* Back Button */}
      <button className={styles.backButton} onClick={onBack} aria-label="Voltar para o ranking">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        Voltar ao Ranking
      </button>

      {loadingProfile && (
        <div className={styles.stateBox}>
          <div className={styles.spinner}></div>
          <p>Carregando perfil...</p>
        </div>
      )}

      {errorProfile && (
        <div className={`${styles.stateBox} ${styles.errorBox}`}>
          <span>⚠️ {errorProfile}</span>
        </div>
      )}

      {data && (
        <div className={styles.profileCard}>
          {/* Glow Background */}
          <div className={styles.cardGlow}></div>
          <div className={styles.cardContent}>

            {/* Avatar Section */}
            <div className={styles.avatarSection}>
              <div className={styles.avatarWrapper}>
                <img
                  src={data.avatar_url}
                  alt={`Avatar de ${data.username}`}
                  className={styles.avatar}
                />
              </div>
              {data.rank !== null && (
                <div className={styles.rankBadge}>#{data.rank} no ranking</div>
              )}
            </div>

            {/* User Info */}
            <div className={styles.userInfo}>
              <h2 className={styles.username}>@{data.username}</h2>
              <a
                href={`https://github.com/${data.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.githubLink}
                aria-label={`Ver perfil de ${data.username} no GitHub`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                Ver no GitHub
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.externalIcon}>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>

              {/* Stats */}
              <div className={styles.statsRow}>
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>Total de Commits</span>
                  <span className={styles.statValue}>{data.commits.toLocaleString('pt-BR')}</span>
                </div>
                {data.rank !== null && (
                  <div className={styles.statBox}>
                    <span className={styles.statLabel}>Posição</span>
                    <span className={`${styles.statValue} ${styles.statRank}`}>#{data.rank}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Commits Section */}
          <div className={styles.commitsSection}>
            <h3 className={styles.commitsTitle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"></circle>
                <line x1="1.05" y1="12" x2="7" y2="12"></line>
                <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
              </svg>
              Histórico de Commits
              {!loadingCommits && commits.length > 0 && (
                <span className={styles.commitsCount}>{commits.length}</span>
              )}
            </h3>

            {loadingCommits && (
              <div className={styles.commitsLoading}>
                <div className={styles.spinnerSmall}></div>
                <span>Buscando commits no GitHub...</span>
              </div>
            )}

            {errorCommits && (
              <div className={styles.commitsError}>
                ⚠️ {errorCommits}
              </div>
            )}

            {!loadingCommits && !errorCommits && commits.length === 0 && (
              <div className={styles.commitsEmpty}>
                Nenhum commit encontrado.
              </div>
            )}

            {!loadingCommits && commits.length > 0 && (
              <div className={styles.commitsList}>
                {commits.map((commit) => (
                  <a
                    key={commit.sha}
                    href={commit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.commitItem}
                    aria-label={`Ver commit ${commit.shortSha}`}
                  >
                    <div className={styles.commitLeft}>
                      <span className={styles.commitHash}>{commit.shortSha}</span>
                      <span className={styles.commitMessage}>{commit.message}</span>
                    </div>
                    <div className={styles.commitRight}>
                      {data.repos.length > 1 && (
                        <span className={styles.commitRepo}>{commit.repo}</span>
                      )}
                      <span className={styles.commitDate}>{formatDate(commit.date)}</span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
