import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'nehira', text: 'Hi! I\'m NEHIRA, your AI SEO expert. Ask me anything about keywords, landing pages, SEO strategy, or your KRYVLayer campaigns.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      const res = await fetch('/api/nehira/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'nehira', text: data.response || 'Sorry, I could not process that.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'nehira', text: 'Connection error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const suggestions = [
    'What keywords should I target for a SaaS in London?',
    'How do I improve my landing page rankings?',
    'Generate 10 city-based keyword ideas for fintech',
    'What makes a good SEO landing page?'
  ]

  return (
    <>
      <Head>
        <title>NEHIRA AI Chat — KRYVLayer</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: '100vh', background: '#0a0a14', display: 'flex', flexDirection: 'column', fontFamily: "'DM Sans', sans-serif" }}>
        <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 1.5rem', flexShrink: 0 }}>
          <div style={{ maxWidth: 800, margin: '0 auto', height: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href="/dashboard" style={{ color: '#a78bfa', textDecoration: 'none', fontSize: '0.875rem' }}>← Dashboard</a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
              <span style={{ fontFamily: 'Syne', fontWeight: 800, color: '#fff', fontSize: '1rem' }}>NEHIRA AI</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)' }}>SEO Expert</span>
          </div>
        </nav>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.length === 1 && (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>Quick questions:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {suggestions.map((s, i) => (
                    <button key={i} onClick={() => setInput(s)}
                      style={{ padding: '0.5rem 1rem', background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 100, color: '#c4b5fd', fontSize: '0.8rem', cursor: 'pointer' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {m.role === 'nehira' && (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginRight: 10, flexShrink: 0, marginTop: 4 }}>N</div>
                )}
                <div style={{
                  maxWidth: '75%', padding: '0.875rem 1.25rem',
                  background: m.role === 'user' ? 'linear-gradient(135deg,#7c3aed,#db2777)' : 'rgba(255,255,255,0.04)',
                  border: m.role === 'nehira' ? '1px solid rgba(255,255,255,0.07)' : 'none',
                  borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                  color: '#fff', fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-wrap'
                }}>
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>N</div>
                <div style={{ padding: '0.875rem 1.25rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px 18px 18px 18px', display: 'flex', gap: 6, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#a78bfa', animation: 'bounce 1s ease-in-out infinite', animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '1rem 1.5rem', flexShrink: 0 }}>
          <form onSubmit={sendMessage} style={{ maxWidth: 800, margin: '0 auto', display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask NEHIRA about SEO, keywords, or strategy..."
              style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '0.875rem 1.25rem', color: '#fff', fontSize: '0.95rem', outline: 'none' }}
            />
            <button type="submit" disabled={loading || !input.trim()}
              style={{ padding: '0.875rem 1.5rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)', borderRadius: 14, color: '#fff', fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, whiteSpace: 'nowrap' }}>
              Send →
            </button>
          </form>
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </>
  )
}
