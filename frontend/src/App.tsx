import { useEffect, useState } from 'react'

function App() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [latency, setLatency] = useState(0)

  useEffect(() => {
    const start = Date.now()
    fetch('http://localhost:3000/ping')
      .then(res => {
        setLatency(Date.now() - start)
        return res.json()
      })
      .then(data => {
        setMessage(data.message)
        setStatus('success')
      })
      .catch(() => {
        setMessage('Erro ao conectar com o backend')
        setStatus('error')
      })
  }, [])

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>
          {status === 'loading' ? '⏳' : status === 'success' ? '✅' : '❌'}
        </div>
        
        <h1 style={styles.title}>Connection Test</h1>
        
        <div style={getStatusBoxStyle(status)}>
          {status === 'loading' && 'Connecting...'}
          {status === 'success' && `Status: Online ✓`}
          {status === 'error' && 'Status: Offline ✗'}
        </div>

        {status === 'success' && (
          <>
            <p style={styles.message}>{message}</p>
            <div style={styles.latency}>
              <span style={styles.latencyLabel}>Latency:</span>
              <span style={styles.latencyValue}>{latency}ms</span>
            </div>
          </>
        )}

        <button 
          style={styles.button}
          onClick={() => {
            setStatus('loading')
            const start = Date.now()
            fetch('http://localhost:3000/ping')
              .then(res => {
                setLatency(Date.now() - start)
                return res.json()
              })
              .then(data => {
                setMessage(data.message)
                setStatus('success')
              })
              .catch(() => {
                setMessage('Erro ao conectar com o backend')
                setStatus('error')
              })
          }}
        >
          ⟳ Test Again
        </button>
      </div>

      <div style={styles.footer}>
        <span>Backend: localhost:3000</span>
        <span>Frontend: localhost:5173</span>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: '#fff',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '24px',
    padding: '3rem',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    minWidth: '320px',
  },
  icon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  title: {
    margin: '0 0 2rem',
    fontSize: '1.8rem',
    fontWeight: 600,
  },
}

const getStatusBoxStyle = (status: string): React.CSSProperties => ({
  padding: '0.75rem 1.5rem',
  borderRadius: '50px',
  background: status === 'loading' ? '#f59e0b20' : status === 'success' ? '#10b98120' : '#ef444420',
  color: status === 'loading' ? '#f59e0b' : status === 'success' ? '#10b981' : '#ef4444',
  fontWeight: 600,
  fontSize: '0.9rem',
  display: 'inline-block',
  marginBottom: '1.5rem',
})

Object.assign(styles, {
  message: {
    fontSize: '1.2rem',
    margin: '0 0 1rem',
    color: '#a5b4fc',
  },
  latency: {
    marginBottom: '2rem',
    padding: '0.5rem 1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    display: 'inline-flex',
    gap: '0.5rem',
  },
  latencyLabel: {
    color: '#9ca3af',
  },
  latencyValue: {
    color: '#34d399',
    fontWeight: 600,
    fontFamily: 'monospace',
  },
  button: {
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    fontWeight: 600,
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  footer: {
    marginTop: '3rem',
    display: 'flex',
    gap: '2rem',
    color: '#6b7280',
    fontSize: '0.85rem',
  },
})

export default App