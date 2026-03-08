import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Eye, Globe, Layers, BarChart3, ArrowUpRight } from 'lucide-react'

export default function Analytics() {
  const [stats, setStats] = useState(null)
  const [topPages, setTopPages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/analytics/stats').then(r => r.json()),
      fetch('/api/analytics/top-pages?limit=10').then(r => r.json()),
    ]).then(([s, p]) => {
      setStats(s)
      setTopPages(Array.isArray(p) ? p : p.pages || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Head><title>Analytics — KRYVLayer</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" /></Head>
      <div style={{ minHeight: '100vh', background: '#f8f9fc', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#6b7280', fontSize: 13 }}><ArrowLeft size={14} /> Dashboard</Link>
          <h1 style={{ fontSize: 16, fontWeight: 800, color: '#0f1117' }}>Analytics</h1>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 28 }}>
              {[...Array(4)].map((_,i) => <div key={i} style={{ height: 110, background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', animation: 'pulse 1.5s ease infinite' }} />)}
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 14, marginBottom: 28 }}>
                {[
                  { label: 'Total Domains', value: stats?.totalDomains ?? '—', icon: Globe, color: '#4f46e5', bg: '#f0f0ff' },
                  { label: 'Total Pages', value: stats?.totalPages ?? '—', icon: Layers, color: '#7c3aed', bg: '#fdf4ff' },
                  { label: 'Total Views', value: stats?.totalViews ?? '—', icon: Eye, color: '#059669', bg: '#f0fdf4' },
                  { label: 'Avg Views/Page', value: stats?.totalPages ? Math.round((stats.totalViews||0)/(stats.totalPages||1)) : '—', icon: TrendingUp, color: '#d97706', bg: '#fffbeb' },
                ].map(({ label, value, icon: Icon, color, bg }, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 22 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>{label}</span>
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={15} color={color} /></div>
                    </div>
                    <div style={{ fontSize: 30, fontWeight: 900, color: '#0f1117', letterSpacing: '-0.02em' }}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
                  </div>
                ))}
              </div>

              {topPages.length > 0 && (
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ padding: '18px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <BarChart3 size={15} color="#4f46e5" />
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0f1117' }}>Top Performing Pages</span>
                  </div>
                  {topPages.map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #f9fafb' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                        <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 700, width: 20 }}>#{i+1}</span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0f1117', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 400 }}>{p.keyword || p.title || 'Untitled'}</div>
                          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{p.domain}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#4f46e5' }}>{p.views?.toLocaleString() || 0} views</span>
                        {p.url && <a href={p.url} target="_blank" rel="noreferrer" style={{ color: '#9ca3af' }}><ArrowUpRight size={13} /></a>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
      </div>
    </>
  )
}
