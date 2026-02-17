import { neon } from '@neondatabase/serverless'
import { useState } from 'react'
import Head from 'next/head'

export default function DomainPage({ domain, initialPages }) {
  const [pages] = useState(initialPages || [])
  const [filter, setFilter] = useState('')
  const [regen, setRegen] = useState(false)

  const filtered = pages.filter(p => !filter || p.slug?.includes(filter.toLowerCase()) || p.title?.toLowerCase().includes(filter.toLowerCase()))

  async function handleRegen() {
    setRegen(true)
    try {
      await fetch('/api/generate/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainId: domain.id })
      })
      window.location.reload()
    } catch (e) { alert('Error: ' + e.message) }
    setRegen(false)
  }

  if (!domain) return <div style={{ minHeight: '100vh', background: '#0a0a14', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Domain not found</p></div>

  return (
    <>
      <Head>
        <title>{domain.business_name} — KRYVLayer</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#0a0a14', color: '#e8e6f0', fontFamily: "'DM Sans',sans-serif" }}>
        <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 1.5rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', height: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href="/dashboard" style={{ color: '#a78bfa', textDecoration: 'none', fontSize: '0.875rem' }}>← Dashboard</a>
            <span style={{ fontFamily: 'Syne', fontWeight: 800, color: '#fff' }}>KRYV<span style={{ background: 'linear-gradient(135deg,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Layer</span></span>
            <a href={`https://${domain.domain}`} target="_blank" style={{ color: '#a78bfa', fontSize: '0.875rem', textDecoration: 'none' }}>Live Site ↗</a>
          </div>
        </nav>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontFamily: 'Syne', fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>{domain.business_name}</h1>
              <p style={{ color: '#a78bfa', fontFamily: 'monospace', fontSize: '0.875rem' }}>{domain.domain}</p>
            </div>
            <button onClick={handleRegen} disabled={regen} style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)', borderRadius: 12, color: '#fff', fontWeight: 700, border: 'none', cursor: regen ? 'not-allowed' : 'pointer', opacity: regen ? 0.6 : 1 }}>
              {regen ? '⏳ Regenerating...' : '🔄 Regenerate Pages'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Total Pages', value: pages.length, color: '#a78bfa' },
              { label: 'Total Views', value: pages.reduce((s, p) => s + (p.views || 0), 0), color: '#f472b6' },
              { label: 'Status', value: '✓ Live', color: '#4ade80' }
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.4rem' }}>{s.label}</div>
                <div style={{ fontFamily: 'Syne', fontSize: '1.75rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          <input type="text" placeholder="Search pages..." value={filter} onChange={e => setFilter(e.target.value)}
            style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '0.75rem 1rem', color: '#fff', outline: 'none', fontSize: '0.9rem', width: '100%', maxWidth: 400 }} />

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              {filtered.map((p, i) => (
                <div key={i} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'grid', gridTemplateColumns: '1fr 60px 80px', gap: '1rem', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#a78bfa' }}>/{p.slug}</div>
                    <div style={{ fontSize: '0.775rem', color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{p.title}</div>
                  </div>
                  <div style={{ color: '#4ade80', fontWeight: 700, textAlign: 'right' }}>{p.views || 0}</div>
                  <a href={`/${p.slug}`} target="_blank" style={{ fontSize: '0.8rem', color: '#a78bfa', textDecoration: 'none', textAlign: 'right' }}>View →</a>
                </div>
              ))}
              {filtered.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>No pages found</div>}
            </div>
          </div>
          <p style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.2)', textAlign: 'right' }}>{filtered.length} of {pages.length} pages</p>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.params
  try {
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL)
    const domainResult = await sql`SELECT * FROM domains WHERE id = ${id} LIMIT 1`
    if (!domainResult.length) return { props: { domain: null, initialPages: [] } }

    const domain = domainResult[0]
    const pagesResult = await sql`SELECT slug, title, views FROM pages WHERE domain_id = ${id} ORDER BY created_at DESC`

    return {
      props: {
        domain: { id: domain.id, business_name: domain.business_name, domain: domain.domain, website_url: domain.website_url },
        initialPages: pagesResult.map(r => ({ slug: r.slug, title: r.title, views: r.views || 0 }))
      }
    }
  } catch {
    return { props: { domain: null, initialPages: [] } }
  }
}
