import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Sidebar from '../components/Sidebar'
import DomainCard from '../components/DomainCard'
import Notification from '../components/Notification'
import { Globe, BarChart3, Plus, Menu, X, Zap, Layers, TrendingUp, Activity } from 'lucide-react'

export default function Dashboard() {
  const [domains, setDomains] = useState([])
  const [stats, setStats] = useState(null)
  const [notification, setNotification] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState(null)

  useEffect(() => { fetchDomains(); fetchStats() }, [])

  function notify(msg, type = 'success') {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 4000)
  }

  async function fetchDomains() {
    setLoading(true)
    try {
      const res = await fetch('/api/domains/list?userId=1')
      const data = await res.json()
      if (data.success) { setDomains(data.domains || []); setDbError(null) }
      else if (data.error && data.error.includes('DATABASE')) setDbError('DATABASE_URL not set in Vercel env vars')
      else setDbError(data.error || 'Failed to load domains')
    } catch { setDbError('API unreachable') }
    setLoading(false)
  }

  async function fetchStats() {
    try {
      const res = await fetch('/api/analytics/stats')
      const data = await res.json()
      setStats(data)
    } catch {}
  }

  async function deleteDomain(id, name) {
    if (!confirm(`Delete "${name}" and all its pages?`)) return
    try {
      const res = await fetch('/api/domains/delete', { method:'DELETE', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ domainId:id }) })
      const data = await res.json()
      if (data.success) { fetchDomains(); notify('Domain deleted') }
      else notify(data.error || 'Delete failed', 'error')
    } catch (e) { notify(e.message, 'error') }
  }

  async function bulkGenerate(id, count) {
    notify('⚡ Generating ' + count + ' pages...')
    try {
      const res = await fetch('/api/pages/bulk-generate', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ domainId:id, count }) })
      const data = await res.json()
      if (data.success) {
        // Update domain page count locally instead of refreshing (avoids DB round-trip wiping state)
        setDomains(prev => prev.map(d => d.id === id ? { ...d, page_count: (d.page_count || 0) + (data.generated || count) } : d))
        notify(`✅ ${data.generated || count} pages generated!`)
      } else {
        notify(data.error || 'Generation failed — check DATABASE_URL in Vercel env', 'error')
      }
    } catch (e) { notify(e.message, 'error') }
  }

  const metricCards = [
    { label:'Domains',     value:stats?.totalDomains   ?? domains.length ?? 0, icon:Globe,      suffix:'' },
    { label:'Pages',       value:stats?.totalPages     ?? 0,                   icon:Layers,     suffix:'' },
    { label:'Total Views', value:stats?.totalViews     ?? 0,                   icon:TrendingUp, suffix:'' },
    { label:'Avg/Page',    value:stats?.totalPages ? Math.round((stats.totalViews||0)/stats.totalPages) : 0, icon:Activity, suffix:'' },
  ]

  return (
    <>
      <Head>
        <title>Dashboard — KRYVLayer</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ display:'flex',minHeight:'100vh',background:'#050505',fontFamily:'Inter,sans-serif',position:'relative' }}>
        {/* Mobile topbar */}
        <div style={{ display:'none',position:'fixed',top:0,left:0,right:0,height:52,background:'rgba(5,5,5,0.95)',borderBottom:'1px solid rgba(255,255,255,0.07)',alignItems:'center',justifyContent:'space-between',padding:'0 16px',zIndex:30 }}
          className="mobile-bar">
          <span style={{ fontSize:14,fontWeight:800,color:'#ededed' }}>KRYVLayer</span>
          <button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{ background:'none',border:'none',cursor:'pointer',color:'rgba(237,237,237,0.5)',padding:4 }}>
            {sidebarOpen ? <X size={18}/> : <Menu size={18}/>}
          </button>
        </div>

        <Sidebar open={sidebarOpen} onClose={()=>setSidebarOpen(false)} />

        <main style={{ flex:1,minWidth:0,overflowY:'auto' }}>
          <div style={{ maxWidth:1100,margin:'0 auto',padding:'36px 28px',position:'relative',zIndex:1 }}>
            {/* Header */}
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:32 }}>
              <div>
                <h1 style={{ fontSize:22,fontWeight:900,color:'#ededed',letterSpacing:'-0.025em',marginBottom:4 }}>Dashboard</h1>
                <p style={{ fontSize:13,color:'rgba(237,237,237,0.35)' }}>Manage your domains and SEO page generation.</p>
              </div>
              <Link href="/add-domain" style={{ display:'flex',alignItems:'center',gap:7,padding:'9px 18px',background:'#6366f1',borderRadius:9,textDecoration:'none',fontSize:13,fontWeight:700,color:'#fff',transition:'background 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.background='#4f46e5'}
                onMouseLeave={e=>e.currentTarget.style.background='#6366f1'}>
                <Plus size={14}/> Add Domain
              </Link>
            </div>

            {/* Metric cards */}
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:14,marginBottom:32 }}>
              {metricCards.map(({ label, value, icon:Icon }) => (
                <div key={label} style={{ background:'rgba(255,255,255,0.035)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:'18px 20px' }}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14 }}>
                    <span style={{ fontSize:11,color:'rgba(237,237,237,0.35)',fontWeight:500 }}>{label}</span>
                    <div style={{ width:28,height:28,borderRadius:7,background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.15)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                      <Icon size={13} color='#a5b4fc' />
                    </div>
                  </div>
                  <div style={{ fontSize:28,fontWeight:900,color:'#ededed',letterSpacing:'-0.02em' }}>{typeof value==='number'?value.toLocaleString():value}</div>
                </div>
              ))}
            </div>

            {/* Domains */}
            <div style={{ marginBottom:20,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
              <h2 style={{ fontSize:14,fontWeight:700,color:'rgba(237,237,237,0.6)',textTransform:'uppercase',letterSpacing:'0.08em' }}>Your Domains</h2>
              <span style={{ fontSize:11,color:'rgba(237,237,237,0.25)',fontFamily:"'JetBrains Mono',monospace" }}>{domains.length} total</span>
            </div>

            {loading ? (
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:14 }}>
                {[1,2,3].map(i=><div key={i} style={{ height:160,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,animation:'pulse 1.5s ease infinite' }}/>)}
              </div>
            ) : dbError ? (
              <div style={{ textAlign:'center',padding:'64px 24px',border:'1px solid rgba(239,68,68,0.15)',borderRadius:16,background:'rgba(239,68,68,0.04)' }}>
                <div style={{ fontSize:13,color:'rgba(239,68,68,0.8)',fontFamily:"'JetBrains Mono',monospace",marginBottom:12 }}>DATABASE_NOT_CONNECTED</div>
                <p style={{ fontSize:13,color:'rgba(237,237,237,0.4)',marginBottom:20,maxWidth:480,margin:'0 auto 20px' }}>
                  KryvLayer needs a Neon PostgreSQL database to store domains and generated pages.<br/>
                  Go to <strong style={{ color:'#a5b4fc' }}>Vercel → Settings → Env Vars</strong> and add <code style={{ fontFamily:"'JetBrains Mono',monospace",color:'#6ee7b7',fontSize:11 }}>DATABASE_URL</code> with your Neon connection string.
                </p>
                <button onClick={fetchDomains} style={{ padding:'9px 20px',background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:9,color:'#a5b4fc',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit' }}>
                  Retry Connection
                </button>
              </div>
            ) : domains.length === 0 ? (
              <div style={{ textAlign:'center',padding:'72px 24px',border:'1px dashed rgba(255,255,255,0.08)',borderRadius:16 }}>
                <Globe size={36} color='rgba(237,237,237,0.12)' style={{ margin:'0 auto 16px' }} />
                <h3 style={{ fontSize:16,fontWeight:700,color:'rgba(237,237,237,0.5)',marginBottom:8 }}>No domains yet</h3>
                <p style={{ fontSize:13,color:'rgba(237,237,237,0.25)',marginBottom:24 }}>Add your first domain to start generating SEO pages.</p>
                <Link href="/add-domain" style={{ display:'inline-flex',alignItems:'center',gap:7,padding:'10px 22px',background:'#6366f1',borderRadius:9,textDecoration:'none',fontSize:13,fontWeight:700,color:'#fff' }}>
                  <Plus size={14}/> Add Domain
                </Link>
              </div>
            ) : (
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:14 }}>
                {domains.map(d=><DomainCard key={d.id} domain={d} onDelete={deleteDomain} onGenerate={bulkGenerate}/>)}
              </div>
            )}
          </div>
        </main>

        {notification && <Notification msg={notification.msg} type={notification.type} onClose={()=>setNotification(null)}/>}
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}} @media(max-width:768px){.mobile-bar{display:flex!important}}`}</style>
      </div>
    </>
  )
}
