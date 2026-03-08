import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Send, Sparkles, ArrowLeft, Bot } from 'lucide-react'

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'nehira', text: "Hi, I'm NEHIRA — your AI SEO strategist. Ask me anything about keywords, landing pages, GEO optimization, or your KRYVLayer campaigns." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function sendMessage(e) {
    e.preventDefault()
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)
    try {
      const res = await fetch('/api/nehira/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: userMsg }) })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'nehira', text: data.reply || data.message || 'Something went wrong. Try again.' }])
    } catch { setMessages(prev => [...prev, { role: 'nehira', text: 'Connection error. Please try again.' }]) }
    setLoading(false)
  }

  return (
    <>
      <Head><title>NEHIRA AI — KRYVLayer</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" /></Head>
      <div style={{ minHeight: '100vh', background: '#f8f9fc', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#6b7280', fontSize: 13 }}>
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={16} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0f1117' }}>NEHIRA AI</div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>KRYVLayer SEO Expert</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720, width: '100%', margin: '0 auto' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              {m.role === 'nehira' && (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <Bot size={14} color="#fff" />
                </div>
              )}
              <div style={{
                maxWidth: '75%', padding: '12px 16px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: m.role === 'user' ? '#4f46e5' : '#fff',
                color: m.role === 'user' ? '#fff' : '#0f1117',
                fontSize: 14, lineHeight: 1.65,
                boxShadow: m.role === 'user' ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
                border: m.role === 'user' ? 'none' : '1px solid #e5e7eb',
              }}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={14} color="#fff" />
              </div>
              <div style={{ padding: '14px 18px', borderRadius: '18px 18px 18px 4px', background: '#fff', border: '1px solid #e5e7eb', display: 'flex', gap: 4 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#9ca3af', animation: 'pulse 1.2s ease infinite', animationDelay: `${i * 0.2}s` }} />)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ background: '#fff', borderTop: '1px solid #e5e7eb', padding: '16px 20px', flexShrink: 0 }}>
          <form onSubmit={sendMessage} style={{ maxWidth: 720, margin: '0 auto', display: 'flex', gap: 10 }}>
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask NEHIRA anything about SEO, keywords, or strategy..."
              style={{ flex: 1, padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 14, outline: 'none', color: '#0f1117' }} />
            <button type="submit" disabled={loading || !input.trim()}
              style={{ padding: '12px 18px', background: '#4f46e5', border: 'none', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontSize: 14, fontWeight: 700, opacity: loading || !input.trim() ? 0.5 : 1 }}>
              <Send size={15} />
            </button>
          </form>
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:0.4;transform:scale(0.8)}50%{opacity:1;transform:scale(1)} }`}</style>
      </div>
    </>
  )
}
