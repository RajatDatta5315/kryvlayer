import { useState, useEffect } from 'react'
import Head from 'next/head'
import { sql } from '@vercel/postgres'

export default function DomainPage({ domain, initialPages }) {
  const [pages, setPages] = useState(initialPages || [])
  const [filter, setFilter] = useState('')
  const [regen, setRegen] = useState(false)

  const filteredPages = pages.filter(p =>
    !filter || p.slug.includes(filter.toLowerCase()) || p.title?.toLowerCase().includes(filter.toLowerCase())
  )

  async function handleRegen() {
    setRegen(true)
    try {
      await fetch('/api/generate/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainId: domain.id })
      })
      window.location.reload()
    } catch (e) {
      alert('Error: ' + e.message)
    }
    setRegen(false)
  }

  if (!domain) return (
    <div style={{ minHeight: '100vh', background: '#0a0a14', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
      <p>Domain not found</p>
    </div>
  )

  return (
    <>
      <Head>
        <title>{domain.business_name} Pages — KRYVLayer</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: '100vh', background: '#0a0a14', color: '#e8e6f0', fontFamily: "'DM Sans', sans-serif" }}>
        {/* Top nav */}
        <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', padding: '0 1.5rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', height: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href="/dashboard" style={{ color: '#a78bfa', textDecoration: 'none', fontSize: '0.875rem' }}>← Dashboard</a>
            <span style={{ fontFamily: 'Syne', fontWeight: 800, color: '#fff' }}>KRYV<span style={{ background: 'linear-gradient(135deg,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Layer</span></span>
            <a href={`https://${domain.domain}`} target="_blank" style={{ color: '#a78bfa', fontSize: '0.875rem', textDecoration: 'none' }}>View Site ↗</a>
          </div>
        </nav>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
          {/* Domain header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontFamily: 'Syne', fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>{domain.business_name}</h1>
              <p style={{ color: '#a78bfa', fontFamily: 'monospace', fontSize: '0.9rem' }}>{domain.domain}</p>
              {domain.website_url && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{domain.website_url}</p>}
            </div>
            <button
              onClick={handleRegen}
              disabled={regen}
              style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)', borderRadius: 12, color: '#fff', fontWeight: 700, border: 'none', cursor: regen ? 'not-allowed' : 'pointer', opacity: regen ? 0.6 : 1 }}
            >
              {regen ? '⏳ Regenerating...' : '🔄 Regenerate All Pages'}
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Total Pages', value: pages.length, color: '#a78bfa' },
              { label: 'Total Views', value: pages.reduce((s, p) => s + (p.views || 0), 0), color: '#f472b6' },
              { label: 'Domain', value: '✓ Live', color: '#4ade80' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.25rem' }}>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.4rem' }}>{s.label}</div>
                <div style={{ fontFamily: 'Syne', fontSize: '1.75rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div style={{ marginBottom: '1.25rem' }}>
            <input
              type="text"
              placeholder="Search pages..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{ width: '100%', maxWidth: 400, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '0.75rem 1rem', color: '#fff', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>

          {/* Pages table */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <span>Page</span><span>Views</span><span>Action</span>
            </div>
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {filteredPages.map((p, i) => (
                <div key={i} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'center', transition: 'background .15s' }}>
                  <div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.825rem', color: '#a78bfa' }}>/{p.slug}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{p.title}</div>
                  </div>
                  <div style={{ textAlign: 'right', color: '#4ade80', fontWeight: 700 }}>{p.views || 0}</div>
                  <a href={`/${p.slug}`} target="_blank" style={{ fontSize: '0.8rem', color: '#a78bfa', textDecoration: 'none', whiteSpace: 'nowrap' }}>View →</a>
                </div>
              ))}
              {filteredPages.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)' }}>No pages found</div>
              )}
            </div>
          </div>
          <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)', textAlign: 'right' }}>
            Showing {filteredPages.length} of {pages.length} pages
          </p>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.params

  try {
    const domainResult = await sql`SELECT * FROM domains WHERE id = ${id} LIMIT 1`
    if (!domainResult.rows.length) return { props: { domain: null, initialPages: [] } }

    const domain = domainResult.rows[0]

    const pagesResult = await sql`
      SELECT slug, title, views, created_at 
      FROM pages 
      WHERE domain_id = ${id}
      ORDER BY views DESC
    `

    return {
      props: {
        domain: {
          id: domain.id,
          business_name: domain.business_name,
          domain: domain.domain,
          website_url: domain.website_url,
          industry: domain.industry
        },
        initialPages: pagesResult.rows.map(r => ({
          slug: r.slug,
          title: r.title,
          views: r.views || 0
        }))
      }
    }
  } catch (error) {
    return { props: { domain: null, initialPages: [] } }
  }
}
