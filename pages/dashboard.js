import { useState, useEffect } from 'react'
import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import DomainCard from '../components/DomainCard'
import Notification from '../components/Notification'

export default function Dashboard() {
  const [view, setView] = useState('domains')
  const [domains, setDomains] = useState([])
  const [stats, setStats] = useState(null)
  const [notification, setNotification] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const user = { email: 'demo@kryvlayer.com', id: '1' }

  useEffect(() => { fetchDomains() }, [])

  function notify(msg, type = 'success') {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 4000)
  }

  async function fetchDomains() {
    try {
      const res = await fetch(`/api/domains/list?userId=${user.id}`)
      const data = await res.json()
      if (data.success) setDomains(data.domains || [])
    } catch (e) { console.error(e) }
  }

  async function fetchStats() {
    try {
      const res = await fetch('/api/analytics/stats')
      const data = await res.json()
      setStats(data)
    } catch {}
  }

  async function deleteDomain(domainId, domainName) {
    if (!confirm(`Delete "${domainName}" and ALL its pages? This cannot be undone.`)) return
    try {
      const res = await fetch('/api/domains/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainId })
      })
      const data = await res.json()
      if (data.success) { fetchDomains(); notify('Domain deleted') }
      else notify('Delete failed: ' + data.error, 'error')
    } catch (e) { notify('Error: ' + e.message, 'error') }
  }

  async function bulkGenerate(domainId, count) {
    notify('🚀 Bulk generation started...')
    try {
      const res = await fetch('/api/pages/bulk-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainId, count })
      })
      const data = await res.json()
      if (data.success) { fetchDomains(); notify(`✅ ${data.count} pages generated!`) }
      else notify('Error: ' + data.error, 'error')
    } catch (e) { notify('Error: ' + e.message, 'error') }
  }

  return (
    <>
      <Head>
        <title>Dashboard — KRYVLayer</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: '100vh', background: '#080812', color: '#e2e0f0', fontFamily: "'DM Sans', sans-serif", display: 'flex' }}>
        <Notification notification={notification} />
        <Sidebar user={user} view={view} setView={setView} fetchStats={fetchStats} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div style={{ flex: 1, marginLeft: 0, display: 'flex', flexDirection: 'column' }} className="main-wrap">
          <div style={{ position: 'sticky', top: 0, zIndex: 30, backdropFilter: 'blur(20px)', background: 'rgba(8,8,18,0.8)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 1rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.25rem', cursor: 'pointer', padding: '0.25rem' }}>☰</button>
            <span style={{ fontFamily: 'Syne', fontWeight: 800, color: '#fff', fontSize: '1rem' }}>KRYV<span style={{ background: 'linear-gradient(135deg,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Layer</span></span>
            <a href="/chat" style={{ fontSize: '1.25rem', textDecoration: 'none' }}>🤖</a>
          </div>

          <main style={{ flex: 1, padding: '1.5rem 1rem', maxWidth: 960, width: '100%', margin: '0 auto' }}>
            {view === 'domains' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                  <div>
                    <h1 style={{ fontFamily: 'Syne', fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>Your Domains</h1>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem' }}>Connect once. Generate infinite SEO pages.</p>
                  </div>
                  <a href="/add-domain" style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)', borderRadius: 12, color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>+ Add Domain</a>
                </div>

                {domains.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🌐</div>
                    <h2 style={{ fontFamily: 'Syne', fontSize: '1.5rem', color: '#fff', marginBottom: '0.75rem' }}>No domains yet</h2>
                    <p style={{ color: 'rgba(255,255,255,0.35)', marginBottom: '2rem', fontSize: '0.9rem' }}>Add your first domain to start generating SEO landing pages</p>
                    <a href="/add-domain" style={{ display: 'inline-block', padding: '0.875rem 2rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)', borderRadius: 12, color: '#fff', fontWeight: 700, textDecoration: 'none' }}>Add Your First Domain →</a>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    {domains.map((d, i) => (
                      <DomainCard key={i} domain={d} onDelete={deleteDomain} onBulkGenerate={bulkGenerate} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {view === 'analytics' && (
              <div>
                <div style={{ marginBottom: '2rem' }}>
                  <h1 style={{ fontFamily: 'Syne', fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>Analytics</h1>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem' }}>Track performance across all domains</p>
                </div>

                {!stats ? (
                  <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div style={{ width: 40, height: 40, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#a78bfa', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
                    <p style={{ color: 'rgba(255,255,255,0.3)' }}>Loading...</p>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                      {[
                        { label: 'Total Pages', value: stats.totalPages || 0, color: '#a78bfa' },
                        { label: 'Total Views', value: stats.totalViews || 0, color: '#f472b6' },
                        { label: 'Domains', value: stats.totalDomains || 0, color: '#60a5fa' },
                        { label: 'Avg Views', value: stats.avgViewsPerPage || 0, color: '#4ade80' }
                      ].map((s, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.5rem' }}>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>{s.label}</div>
                          <div style={{ fontFamily: 'Syne', fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
                      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <h3 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#fff', fontSize: '1rem' }}>🔥 Top Pages</h3>
                      </div>
                      {(stats.topPages || []).map((p, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <div>
                            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', marginRight: '0.75rem' }}>#{i + 1}</span>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>/{p.slug}</span>
                          </div>
                          <span style={{ color: '#4ade80', fontWeight: 700 }}>{p.views}</span>
                        </div>
                      ))}
                      {(!stats.topPages || !stats.topPages.length) && <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.875rem' }}>No views yet</div>}
                    </div>
                  </>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #080812; color: #e2e0f0; overflow-x: hidden; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 768px) {
          .sidebar { transform: translateX(0) !important; position: sticky !important; height: 100vh !important; }
          .main-wrap { margin-left: 220px !important; }
        }
      `}</style>
    </>
  )
}
