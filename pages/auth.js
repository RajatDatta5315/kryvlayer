import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Auth() {
  const router = useRouter()
  const [mode, setMode] = useState('signup') // signup | login
  const [form, setForm] = useState({ email: '', name: '', databaseUrl: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (data.success) {
        localStorage.setItem('kryv_user', JSON.stringify(data.user))
        router.push('/dashboard')
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>{mode === 'signup' ? 'Create Account' : 'Sign In'} — KRYVLayer</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: '100vh', background: '#0a0a14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <a href="/" style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.5rem', color: '#fff', textDecoration: 'none' }}>
              KRYV<span style={{ background: 'linear-gradient(135deg,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Layer</span>
            </a>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '2.5rem' }}>
            <h1 style={{ fontFamily: 'Syne', fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '2rem', fontSize: '0.9rem' }}>
              {mode === 'signup' ? 'Connect your free database and start generating pages' : 'Sign in to your KRYVLayer account'}
            </p>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '0.875rem', marginBottom: '1.5rem', color: '#fca5a5', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {mode === 'signup' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>Your Name</label>
                  <input
                    type="text"
                    placeholder="Rajat Datta"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '0.875rem 1rem', color: '#fff', outline: 'none', fontSize: '0.95rem' }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>Email</label>
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '0.875rem 1rem', color: '#fff', outline: 'none', fontSize: '0.95rem' }}
                />
              </div>

              {mode === 'signup' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>
                    Your Free Database URL
                    <a href="https://neon.tech" target="_blank" style={{ color: '#a78bfa', marginLeft: '8px', fontSize: '0.75rem', textDecoration: 'none' }}>Get free DB →</a>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="postgresql://user:password@host/database"
                    value={form.databaseUrl}
                    onChange={e => setForm({ ...form, databaseUrl: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '0.875rem 1rem', color: '#fff', outline: 'none', fontSize: '0.9rem', fontFamily: 'monospace' }}
                  />
                  <p style={{ fontSize: '0.775rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.5rem' }}>
                    Your database = your data. We never store your pages on our servers.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{ padding: '0.9rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
              >
                {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account & Connect DB' : 'Sign In'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.35)' }}>
              {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
              <button onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} style={{ color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: 'inherit' }}>
                {mode === 'signup' ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
