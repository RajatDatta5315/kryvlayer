import { useState, useEffect } from 'react'
import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import DomainCard from '../components/DomainCard'
import Notification from '../components/Notification'
import { Globe, BarChart2, Plus, Menu, X, TrendingUp, Activity, Layers, Zap } from 'lucide-react'

export default function Dashboard() {
  const [view, setView] = useState('domains')
  const [domains, setDomains] = useState([])
  const [stats, setStats] = useState(null)
  const [notification, setNotification] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const user = { email: 'demo@kryvlayer.com', id: '1' }

  useEffect(() => { fetchDomains() }, [])

  function notify(msg, type = 'success') {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 4000)
  }

  async function fetchDomains() {
    setLoading(true)
    try {
      const res = await fetch(`/api/domains/list?userId=${user.id}`)
      const data = await res.json()
      if (data.success) setDomains(data.domains || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
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
    notify('Generating pages...')
    try {
      const res = await fetch('/api/pages/bulk-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainId, count })
      })
      const data = await res.json()
      if (data.success) { fetchDomains(); notify(`${data.pages?.length || count} pages generated`) }
      else notify(data.error || 'Generation failed', 'error')
    } catch (e) { notify('Error: ' + e.message, 'error') }
  }

  const totalPages = domains.reduce((s, d) => s + (d.page_count || 0), 0)
  const totalViews = domains.reduce((s, d) => s + (d.total_views || 0), 0)

  return (
    <>
      <Head>
        <title>Dashboard — KRYVLayer</title>
        <link rel="icon" href="/logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fc', fontFamily: 'Inter, sans-serif' }}>
        {/* Sidebar */}
        <Sidebar user={user} view={view} setView={setView} fetchStats={fetchStats} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main — offset for fixed sidebar on desktop */}
        <main style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: 0 }}>
          {/* Topbar */}
          <header style={{ position: 'sticky', top: 0, zIndex: 30, background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4 }} className="mobile-menu">
                <Menu size={20} />
              </button>
              <div>
                <h1 style={{ fontSize: 16, fontWeight: 800, color: '#0f1117', letterSpacing: '-0.01em' }}>
                  {view === 'domains' ? 'My Domains' : 'Analytics'}
                </h1>
                <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>KRYVLayer Dashboard</p>
              </div>
            </div>
            <a href="/add-domain" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#4f46e5', borderRadius: 10, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
              <Plus size={14} /> Add Domain
            </a>
          </header>

          {/* Content */}
          <div style={{ flex: 1, padding: 24, maxWidth: 1200, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
            {view === 'domains' && (
              <>
                {/* Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
                  {[
                    { label: 'Active Domains', value: domains.length, icon: Globe, color: '#4f46e5', bg: '#f0f0ff' },
                    { label: 'Total Pages', value: totalPages.toLocaleString(), icon: Layers, color: '#7c3aed', bg: '#fdf4ff' },
                    { label: 'Total Views', value: totalViews.toLocaleString(), icon: Activity, color: '#059669', bg: '#f0fdf4' },
                    { label: 'SEO Score', value: domains.length > 0 ? '94/100' : '—', icon: Zap, color: '#d97706', bg: '#fffbeb' },
                  ].map(({ label, value, icon: Icon, color, bg }, i) => (
                    <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>{label}</span>
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={14} color={color} />
                        </div>
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 900, color: '#0f1117', letterSpacing: '-0.02em' }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Domain Cards */}
                {loading ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} style={{ height: 200, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, animation: 'pulse 1.5s ease infinite' }} />
                    ))}
                  </div>
                ) : domains.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', border: '2px dashed #e5e7eb', borderRadius: 20 }}>
                    <Globe size={40} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#374151', marginBottom: 8 }}>No domains yet</h3>
                    <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 24 }}>Connect your first domain and start generating SEO pages automatically.</p>
                    <a href="/add-domain" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 24px', background: '#4f46e5', borderRadius: 12, color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>
                      <Plus size={14} /> Add Your First Domain
                    </a>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                    {domains.map(domain => (
                      <DomainCard key={domain.id} domain={domain} onDelete={deleteDomain} onBulkGenerate={bulkGenerate} />
                    ))}
                  </div>
                )}
              </>
            )}

            {view === 'analytics' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
                  {stats ? [
                    { label: 'Total Domains', value: stats.totalDomains || domains.length },
                    { label: 'Total Pages', value: stats.totalPages || totalPages },
                    { label: 'Total Views', value: stats.totalViews || totalViews },
                    { label: 'Avg Pages/Domain', value: domains.length ? Math.round(totalPages / domains.length) : 0 },
                  ].map(({ label, value }, i) => (
                    <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 20 }}>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8, fontWeight: 500 }}>{label}</div>
                      <div style={{ fontSize: 30, fontWeight: 900, color: '#4f46e5', letterSpacing: '-0.02em' }}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
                    </div>
                  )) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: '#9ca3af', fontSize: 13 }}>
                      Loading analytics...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>

        {notification && <Notification msg={notification.msg} type={notification.type} />}
      </div>

      <style>{`
        @media (max-width: 768px) {
          main { margin-left: 0 !important; }
          .mobile-menu { display: flex !important; }
        }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.6} }
      `}</style>
    </>
  )
}
