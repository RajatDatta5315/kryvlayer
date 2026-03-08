import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Auth() {
  const router = useRouter()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const S = {
    page: { minHeight: '100vh', background: '#050505', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
    card: { width: '100%', maxWidth: 420, background: 'rgba(255,255,255,0.04)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '40px 36px' },
    input: { width: '100%', padding: '11px 14px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, fontSize: 14, outline: 'none', color: '#ededed', boxSizing: 'border-box', marginBottom: 12 },
    btn: { width: '100%', padding: 13, background: '#6366f1', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
    label: { fontSize: 12, fontWeight: 700, color: 'rgba(237,237,237,0.6)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' },
  }

  async function handleAuth(e) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch(`/api/auth/${mode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name }) })
      const data = await res.json()
      if (data.success) { router.push('/dashboard') }
      else setError(data.error || 'Authentication failed')
    } catch { setError('Network error. Please try again.') }
    setLoading(false)
  }

  return (
    <>
      <Head><title>{mode === 'login' ? 'Sign In' : 'Get Started'} — KRYVLayer</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet" /></Head>
      <div style={S.page}>
        <div style={S.card}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 20, fontWeight: 900, color: '#fff' }}>K</div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#ededed', letterSpacing: '-0.02em', marginBottom: 6 }}>{mode === 'login' ? 'Welcome back' : 'Start for free'}</h1>
            <p style={{ fontSize: 13, color: 'rgba(237,237,237,0.3)' }}>{mode === 'login' ? 'Sign in to your KRYVLayer account' : 'Create your KRYVLayer account'}</p>
          </div>
          {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', color: '#fca5a5', fontSize: 13, marginBottom: 16 }}>{error}</div>}
          <form onSubmit={handleAuth}>
            {mode === 'signup' && <><label style={S.label}>Name</label><input style={S.input} placeholder="Your name" value={name} onChange={e => setName(e.target.value)} /></>}
            <label style={S.label}>Email</label>
            <input style={S.input} type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} />
            <label style={S.label}>Password</label>
            <input style={S.input} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit" disabled={loading} style={S.btn}>{loading ? 'Loading...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}</button>
          </form>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 20 }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} style={{ background: 'none', border: 'none', color: '#a5b4fc', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </>
  )
}
