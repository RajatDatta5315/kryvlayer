import { useState, useEffect } from 'react'

export default function GenerationProgress({ onComplete }) {
  const [stage, setStage] = useState(0)

  const stages = [
    { title: 'Analyzing Website', desc: 'Scanning your website content and structure...' },
    { title: 'Extracting Keywords', desc: 'NEHIRA AI identifying SEO opportunities...' },
    { title: 'Finding Target Cities', desc: 'Mapping location-based keyword combinations...' },
    { title: 'Generating Content', desc: 'Writing unique copy for each landing page...' },
    { title: 'Building Pages', desc: 'Creating premium HTML landing pages...' },
    { title: 'Saving to Database', desc: 'Storing pages securely in your database...' },
    { title: 'Finalizing', desc: 'Making pages live on your domain...' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setStage(prev => {
        if (prev >= stages.length - 1) {
          clearInterval(interval)
          setTimeout(onComplete, 1000)
          return prev
        }
        return prev + 1
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '3rem 2rem', maxWidth: 560, margin: '0 auto' }}>
      
      <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, border: '3px solid transparent', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1.2s linear infinite' }} />
        <div style={{ position: 'absolute', inset: 10, border: '3px solid transparent', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 0.9s linear infinite reverse' }} />
        <div style={{ width: 40, height: 40, borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.25rem' }}>AI</div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: 'Syne', fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          {stages[stage]?.title}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>
          {stages[stage]?.desc}
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
          <span>Progress</span>
          <span>{Math.round(((stage + 1) / stages.length) * 100)}%</span>
        </div>
        <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 100, overflow: 'hidden' }}>
          <div style={{ 
            width: `${((stage + 1) / stages.length) * 100}%`, 
            height: '100%', 
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            transition: 'width 0.5s ease',
            borderRadius: 100
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {stages.map((s, i) => (
          <div key={i} style={{ 
            display: 'flex', alignItems: 'center', gap: 12,
            opacity: i === stage ? 1 : i < stage ? 0.5 : 0.2,
            transition: 'opacity 0.3s'
          }}>
            <div style={{ 
              width: 24, height: 24, borderRadius: '50%', 
              background: i < stage ? '#10b981' : i === stage ? '#6366f1' : 'rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700,
              color: i <= stage ? '#fff' : 'rgba(255,255,255,0.3)',
              flexShrink: 0
            }}>
              {i < stage ? '✓' : i + 1}
            </div>
            <span style={{ 
              fontSize: '0.875rem', 
              color: i === stage ? '#fff' : 'rgba(255,255,255,0.5)',
              fontWeight: i === stage ? 600 : 400
            }}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
          ⏱️ Est. time: 30-60 seconds
        </p>
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
