import { useState, useEffect } from 'react'
import Head from 'next/head'

const KRYVLAYER_IP = '76.76.21.21'
const KRYVLAYER_CNAME = 'cname.kryvlayer.app'

export default function Dashboard() {
  const [view, setView] = useState('domains')
  const [domains, setDomains] = useState([])
  const [addStep, setAddStep] = useState(0)
  const [formData, setFormData] = useState({ businessName: '', websiteUrl: '', domain: '' })
  const [generatedPages, setGeneratedPages] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [verifyStatus, setVerifyStatus] = useState(null)
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

  async function checkDNS() {
    setVerifyStatus('checking')
    try {
      const res = await fetch('/api/domains/verify-dns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: formData.domain })
      })
      const data = await res.json()
      setVerifyStatus(data.connected ? 'valid' : 'invalid')
    } catch { setVerifyStatus('invalid') }
  }

  async function proceedGenerate() {
    setAddStep(4)
    setLoading(true)
    try {
      const domainRes = await fetch('/api/domains/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...formData })
      })
      const domainData = await domainRes.json()
      if (!domainData.success) throw new Error(domainData.error || 'Domain creation failed')

      const genRes = await fetch('/api/generate/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainId: domainData.domainId })
      })
      const genData = await genRes.json()
      setGeneratedPages(genData.pages || [])
      setAddStep(5)
      fetchDomains()
      notify(`✅ ${genData.count || 0} pages generated!`)
    } catch (err) {
      notify('❌ ' + err.message, 'error')
      setAddStep(2)
    } finally { setLoading(false) }
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

  function resetAdd() {
    setAddStep(0)
    setFormData({ businessName: '', websiteUrl: '', domain: '' })
    setVerifyStatus(null)
    setGeneratedPages([])
    setView('domains')
  }

  const isSubdomain = formData.domain.split('.').length > 2

  const navItems = [
    { id: 'domains', icon: '🌐', label: 'Domains' },
    { id: 'analytics', icon: '📊', label: 'Analytics' },
    { id: 'chat', icon: '🤖', label: 'NEHIRA AI', href: '/chat' },
  ]

  return (
    <>
      <Head>
        <title>Dashboard — KRYVLayer</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: '100vh', background: '#080812', color: '#e2e0f0', fontFamily: "'DM Sans', sans-serif", display: 'flex' }}>

        {/* Notification */}
        {notification && (
          <div style={{
            position: 'fixed', top: '1rem', right: '1rem', zIndex: 999,
            padding: '0.875rem 1.5rem', borderRadius: 12, fontWeight: 600, fontSize: '0.9rem',
            background: notification.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(74,222,128,0.15)',
            border: `1px solid ${notification.type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(74,222,128,0.4)'}`,
            color: notification.type === 'error' ? '#fca5a5' : '#4ade80',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            {notification.msg}
          </div>
        )}

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }} />
        )}

        {/* Sidebar */}
        <aside style={{
          width: 220, flexShrink: 0,
          background: 'rgba(255,255,255,0.02)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column',
          padding: '1.5rem 1rem',
          position: 'fixed', top: 0, left: 0, bottom: 0,
          zIndex: 50,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
        }}
          className="sidebar"
        >
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: '2rem', padding: '0 0.5rem' }}>
            <img src="/logo.png" alt="" style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
            <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
              KRYV<span style={{ background: 'linear-gradient(135deg,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Layer</span>
            </span>
          </a>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
            {navItems.map(item => (
              item.href ? (
                <a key={item.id} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '0.65rem 0.75rem', borderRadius: 10,
                  color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: 500,
                  textDecoration: 'none', transition: 'all .2s'
                }}>
                  <span>{item.icon}</span>{item.label}
                </a>
              ) : (
                <button key={item.id} onClick={() => {
                  setView(item.id)
                  setSidebarOpen(false)
                  if (item.id === 'analytics') fetchStats()
                }} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '0.65rem 0.75rem', borderRadius: 10,
                  color: view === item.id ? '#fff' : 'rgba(255,255,255,0.5)',
                  background: view === item.id ? 'rgba(124,58,237,0.2)' : 'none',
                  fontSize: '0.9rem', fontWeight: 500,
                  border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all .2s'
                }}>
                  <span>{item.icon}</span>{item.label}
                </button>
              )
            ))}

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0.75rem 0' }} />

            <a href="/chat" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '0.65rem 0.75rem', borderRadius: 10,
              background: 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(219,39,119,0.2))',
              border: '1px solid rgba(167,139,250,0.2)',
              color: '#c4b5fd', fontSize: '0.875rem', fontWeight: 600,
              textDecoration: 'none'
            }}>
              <span>✨</span> Ask NEHIRA
            </a>
          </nav>

          <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', padding: '0.5rem' }}>
              {user.email}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div style={{ flex: 1, marginLeft: 0, display: 'flex', flexDirection: 'column' }} className="main-wrap">

          {/* Top bar (mobile) */}
          <div style={{ position: 'sticky', top: 0, zIndex: 30, backdropFilter: 'blur(20px)', background: 'rgba(8,8,18,0.8)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 1rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.25rem', cursor: 'pointer', padding: '0.25rem' }}>☰</button>
            <span style={{ fontFamily: 'Syne', fontWeight: 800, color: '#fff', fontSize: '1rem' }}>
              KRYV<span style={{ background: 'linear-gradient(135deg,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Layer</span>
            </span>
            <a href="/chat" style={{ fontSize: '1.25rem', textDecoration: 'none' }}>🤖</a>
          </div>

          <main style={{ flex: 1, padding: '1.5rem 1rem', maxWidth: 960, width: '100%', margin: '0 auto' }}>

            {/* ============ DOMAINS VIEW ============ */}
            {view === 'domains' && addStep === 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                  <div>
                    <h1 style={{ fontFamily: 'Syne', fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>Your Domains</h1>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem' }}>Connect once. Generate infinite SEO pages.</p>
                  </div>
                  <button onClick={() => { setView('domains'); setAddStep(1) }} style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)', borderRadius: 12, color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
                    + Add Domain
                  </button>
                </div>

                {domains.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🌐</div>
                    <h2 style={{ fontFamily: 'Syne', fontSize: '1.5rem', color: '#fff', marginBottom: '0.75rem' }}>No domains yet</h2>
                    <p style={{ color: 'rgba(255,255,255,0.35)', marginBottom: '2rem', fontSize: '0.9rem' }}>Add your first domain to start generating SEO landing pages</p>
                    <button onClick={() => { setView('domains'); setAddStep(1) }} style={{ padding: '0.875rem 2rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)', borderRadius: 12, color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                      Add Your First Domain →
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    {domains.map((d, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '1.5rem', transition: 'border-color .2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                          <div>
                            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#fff', marginBottom: 4, fontSize: '1rem' }}>{d.business_name}</h3>
                            <p style={{ color: '#a78bfa', fontFamily: 'monospace', fontSize: '0.8rem' }}>{d.domain}</p>
                          </div>
                          <span style={{ padding: '3px 10px', background: 'rgba(74,222,128,0.12)', color: '#4ade80', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600 }}>Live</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '0.875rem', textAlign: 'center' }}>
                            <div style={{ fontFamily: 'Syne', fontSize: '1.5rem', fontWeight: 800, color: '#a78bfa' }}>{d.page_count || 0}</div>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Pages</div>
                          </div>
                          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '0.875rem', textAlign: 'center' }}>
                            <div style={{ fontFamily: 'Syne', fontSize: '1.5rem', fontWeight: 800, color: '#f472b6' }}>{d.total_views || 0}</div>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Views</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <a href={`/domain/${d.id}`} style={{ flex: 1, textAlign: 'center', padding: '0.6rem 0.75rem', background: 'rgba(124,58,237,0.15)', color: '#a78bfa', borderRadius: 10, fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
                            View Pages
                          </a>
                          <button onClick={() => bulkGenerate(d.id, 100)} style={{ flex: 1, padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', borderRadius: 10, fontSize: '0.8rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
                            + More Pages
                          </button>
                          <a href={`/api/export/csv?domainId=${d.id}`} style={{ padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', borderRadius: 10, fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                            CSV
                          </a>
                          <button onClick={() => deleteDomain(d.id, d.business_name)} style={{ padding: '0.6rem 0.75rem', background: 'rgba(239,68,68,0.08)', color: 'rgba(239,68,68,0.6)', borderRadius: 10, fontSize: '0.8rem', border: '1px solid rgba(239,68,68,0.15)', cursor: 'pointer' }}>
                            🗑
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ============ ADD DOMAIN STEPS ============ */}
            {addStep > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <button onClick={resetAdd} style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', marginBottom: 8, display: 'block' }}>← Back</button>
                    <h1 style={{ fontFamily: 'Syne', fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>Add Domain</h1>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['Info', 'DNS', 'Verify', 'Generate', 'Done'].map((s, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700,
                          background: addStep > i + 1 ? 'rgba(74,222,128,0.2)' : addStep === i + 1 ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)',
                          color: addStep > i + 1 ? '#4ade80' : addStep === i + 1 ? '#a78bfa' : 'rgba(255,255,255,0.3)'
                        }}>
                          {addStep > i + 1 ? '✓' : i + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 1 */}
                {addStep === 1 && (
                  <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '2rem', maxWidth: 600 }}>
                    <h2 style={{ fontFamily: 'Syne', fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>Your Business Info</h2>
                    <p style={{ color: 'rgba(255,255,255,0.35)', marginBottom: '2rem', fontSize: '0.875rem' }}>We scan your website — NEHIRA does the rest automatically</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {[
                        { label: 'Business Name', key: 'businessName', placeholder: 'Acme SaaS Inc.', type: 'text' },
                        { label: 'Your Website URL', key: 'websiteUrl', placeholder: 'https://mycompany.com', type: 'url', hint: 'NEHIRA AI will analyze this to understand your business' },
                        { label: 'Domain for Landing Pages', key: 'domain', placeholder: 'seo.mycompany.com or mycompany.com', type: 'text', hint: 'Pages will be live here — can be a subdomain' }
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>{f.label}</label>
                          <input type={f.type} required placeholder={f.placeholder} value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '0.875rem 1rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
                          {f.hint && <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.4rem' }}>{f.hint}</p>}
                        </div>
                      ))}
                      <button onClick={() => { if (formData.businessName && formData.websiteUrl && formData.domain) setAddStep(2); else notify('Fill all fields', 'error') }}
                        style={{ padding: '0.9rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)', borderRadius: 12, color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
                        Continue to DNS Setup →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: DNS */}
                {addStep === 2 && (
                  <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '2rem', maxWidth: 640 }}>
                    <h2 style={{ fontFamily: 'Syne', fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>Connect Your Domain</h2>
                    <p style={{ color: 'rgba(255,255,255,0.35)', marginBottom: '2rem', fontSize: '0.875rem' }}>Add this DNS record in your domain provider dashboard</p>

                    <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 16, overflow: 'hidden', marginBottom: '1.5rem' }}>
                      <div style={{ padding: '0.875rem 1.25rem', background: 'rgba(124,58,237,0.1)', borderBottom: '1px solid rgba(167,139,250,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c4b5fd', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Required DNS Record</span>
                        <span style={{ background: 'rgba(167,139,250,0.2)', color: '#a78bfa', padding: '3px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700 }}>{isSubdomain ? 'CNAME' : 'A Record'}</span>
                      </div>

                      <div style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1.5fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                          {['Type', 'Name', 'Value'].map(h => (
                            <span key={h} style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
                          ))}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1.5fr', gap: '0.5rem', alignItems: 'center' }}>
                          <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: '0.875rem' }}>{isSubdomain ? 'CNAME' : 'A'}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <code style={{ background: 'rgba(255,255,255,0.08)', padding: '3px 8px', borderRadius: 6, fontSize: '0.85rem', color: '#fff' }}>
                              {isSubdomain ? formData.domain.split('.')[0] : '@'}
                            </code>
                            <button onClick={() => navigator.clipboard?.writeText(isSubdomain ? formData.domain.split('.')[0] : '@')} style={{ padding: '2px 7px', background: 'rgba(255,255,255,0.06)', borderRadius: 6, color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', border: 'none', cursor: 'pointer' }}>⎘</button>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <code style={{ background: 'rgba(255,255,255,0.08)', padding: '3px 8px', borderRadius: 6, fontSize: '0.8rem', color: '#fff', wordBreak: 'break-all' }}>
                              {isSubdomain ? KRYVLAYER_CNAME : KRYVLAYER_IP}
                            </code>
                            <button onClick={() => navigator.clipboard?.writeText(isSubdomain ? KRYVLAYER_CNAME : KRYVLAYER_IP)} style={{ padding: '2px 7px', background: 'rgba(255,255,255,0.06)', borderRadius: 6, color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', border: 'none', cursor: 'pointer', flexShrink: 0 }}>⎘</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem' }}>
                      <p style={{ fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem', fontSize: '0.875rem' }}>📋 Step-by-step:</p>
                      <ol style={{ paddingLeft: '1.5rem', color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', lineHeight: 2.2 }}>
                        <li>Log in to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)</li>
                        <li>Go to <strong style={{ color: 'rgba(255,255,255,0.7)' }}>DNS Settings</strong> or <strong style={{ color: 'rgba(255,255,255,0.7)' }}>DNS Management</strong></li>
                        <li>Click <strong style={{ color: 'rgba(255,255,255,0.7)' }}>Add Record</strong></li>
                        <li>Type: <strong style={{ color: '#a78bfa' }}>{isSubdomain ? 'CNAME' : 'A'}</strong> | Name: <strong style={{ color: '#a78bfa' }}>{isSubdomain ? formData.domain.split('.')[0] : '@'}</strong> | Value: <strong style={{ color: '#a78bfa' }}>{isSubdomain ? KRYVLAYER_CNAME : KRYVLAYER_IP}</strong></li>
                        <li>Save. DNS updates in 1–30 minutes.</li>
                      </ol>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <button onClick={() => setAddStep(1)} style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600, cursor: 'pointer' }}>← Back</button>
                      <button onClick={() => setAddStep(3)} style={{ flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)', borderRadius: 12, color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                        I've Added the Record →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Verify */}
                {addStep === 3 && (
                  <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '2rem', maxWidth: 500 }}>
                    <h2 style={{ fontFamily: 'Syne', fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>Verify Connection</h2>
                    <p style={{ color: 'rgba(255,255,255,0.35)', marginBottom: '2rem', fontSize: '0.875rem' }}>We check if your domain is pointing to KRYVLayer</p>

                    <div style={{ textAlign: 'center', padding: '1.5rem 0 2rem' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '1rem', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(167,139,250,0.3)', padding: '8px 20px', borderRadius: 100, color: '#c4b5fd' }}>{formData.domain}</span>
                    </div>

                    {verifyStatus === null && (
                      <button onClick={checkDNS} style={{ width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)', borderRadius: 12, color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                        Check DNS Connection
                      </button>
                    )}

                    {verifyStatus === 'checking' && (
                      <div style={{ textAlign: 'center', padding: '1rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                        <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#a78bfa', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        Checking DNS records...
                      </div>
                    )}

                    {verifyStatus === 'valid' && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✅</div>
                        <h3 style={{ fontFamily: 'Syne', color: '#4ade80', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Domain Connected!</h3>
                        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Pointing to KRYVLayer successfully</p>
                        <button onClick={proceedGenerate} style={{ width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)', borderRadius: 12, color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                          Generate Pages Now →
                        </button>
                      </div>
                    )}

                    {verifyStatus === 'invalid' && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
                        <h3 style={{ fontFamily: 'Syne', color: '#fbbf24', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Not Connected Yet</h3>
                        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>DNS changes take 1–30 mins. Check settings and retry.</p>
                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                          <button onClick={() => { setVerifyStatus(null); setAddStep(2) }} style={{ flex: 1, padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600, cursor: 'pointer' }}>Review DNS</button>
                          <button onClick={checkDNS} style={{ flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)', borderRadius: 12, color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Try Again</button>
                        </div>
                        <button onClick={proceedGenerate} style={{ background: 'none', border: 'none', color: '#a78bfa', fontSize: '0.8rem', textDecoration: 'underline', cursor: 'pointer' }}>
                          Skip verification and generate anyway →
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Generating */}
                {addStep === 4 && (
                  <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '3rem 2rem', maxWidth: 500, textAlign: 'center' }}>
                    <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ position: 'absolute', inset: 0, border: '2px solid transparent', borderTopColor: '#a78bfa', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      <div style={{ position: 'absolute', inset: 12, border: '2px solid transparent', borderTopColor: '#f472b6', borderRadius: '50%', animation: 'spin 0.7s linear infinite reverse' }} />
                      <span style={{ fontSize: '2rem' }}>🤖</span>
                    </div>
                    <h2 style={{ fontFamily: 'Syne', fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>NEHIRA is Working</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', lineHeight: 1.7 }}>Scanning your website, extracting keywords, and generating unique content for every page. This takes about 30–60 seconds.</p>
                    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', textAlign: 'left', maxWidth: 260, margin: '2rem auto 0' }}>
                      {['Scanning website', 'Extracting keywords', 'Generating AI content', 'Creating landing pages'].map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem' }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#a78bfa', animation: `pulse ${1 + i * 0.3}s ease-in-out infinite` }} />
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 5: Done */}
                {addStep === 5 && (
                  <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '2rem', maxWidth: 600 }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                      <h2 style={{ fontFamily: 'Syne', fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>Pages Are Live!</h2>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                        <strong style={{ color: '#a78bfa' }}>{generatedPages.length} landing pages</strong> are now live on <strong style={{ color: '#fff' }}>{formData.domain}</strong>
                      </p>
                    </div>

                    <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
                      {generatedPages.slice(0, 12).map((p, i) => (
                        <a key={i} href={`/${p.slug}`} target="_blank" style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10,
                          textDecoration: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', transition: 'all .15s'
                        }}>
                          <span style={{ fontFamily: 'monospace', color: '#a78bfa' }}>/{p.slug}</span>
                          <span>↗</span>
                        </a>
                      ))}
                      {generatedPages.length > 12 && <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem', padding: '0.5rem' }}>+ {generatedPages.length - 12} more</p>}
                    </div>

                    <button onClick={resetAdd} style={{ width: '100%', padding: '0.875rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)', borderRadius: 12, color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                      Back to Dashboard
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ============ ANALYTICS VIEW ============ */}
            {view === 'analytics' && (
              <div>
                <div style={{ marginBottom: '2rem' }}>
                  <h1 style={{ fontFamily: 'Syne', fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>Analytics</h1>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem' }}>Track your page performance across all domains</p>
                </div>

                {!stats ? (
                  <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div style={{ width: 40, height: 40, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#a78bfa', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
                    <p style={{ color: 'rgba(255,255,255,0.3)' }}>Loading analytics...</p>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                      {[
                        { label: 'Total Pages', value: stats.totalPages || 0, color: '#a78bfa' },
                        { label: 'Total Views', value: stats.totalViews || 0, color: '#f472b6' },
                        { label: 'Domains', value: stats.totalDomains || 0, color: '#60a5fa' },
                        { label: 'Avg Views/Page', value: stats.avgViewsPerPage || 0, color: '#4ade80' }
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
                      {(!stats.topPages || !stats.topPages.length) && (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.875rem' }}>No views yet — share your pages!</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

          </main>
        </div>
      </div>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #080812; color: #e2e0f0; overflow-x: hidden; }
        button { cursor: pointer; border: none; background: none; font-family: inherit; }
        a { color: inherit; }
        input { font-family: inherit; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        @media (min-width: 768px) {
          .sidebar { transform: translateX(0) !important; position: sticky !important; height: 100vh !important; }
          .main-wrap { margin-left: 220px !important; }
        }
      `}</style>
    </>
  )
}
