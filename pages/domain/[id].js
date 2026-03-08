import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Search, Plus, Download } from 'lucide-react'

export default function DomainDetail() {
  const router = useRouter()
  const { id } = router.query
  const [domain, setDomain] = useState(null)
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const PER = 20

  useEffect(() => {
    if (!id) return
    Promise.all([
      fetch(`/api/domains/detail?domainId=${id}`).then(r => r.json()),
      fetch(`/api/pages/list?domainId=${id}`).then(r => r.json()),
    ]).then(([d, p]) => {
      setDomain(d.domain || d)
      setPages(Array.isArray(p) ? p : p.pages || [])
    }).finally(() => setLoading(false))
  }, [id])

  const filtered = pages.filter(p => !search || (p.keyword || p.title || '').toLowerCase().includes(search.toLowerCase()))
  const paginated = filtered.slice((page-1)*PER, page*PER)
  const totalPages = Math.ceil(filtered.length / PER)

  return (
    <>
      <Head><title>{domain?.business_name || 'Domain'} — KRYVLayer</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" /></Head>
      <div style={{ minHeight: '100vh', background: '#f8f9fc', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#6b7280', fontSize: 13 }}><ArrowLeft size={14} /> Dashboard</Link>
          {domain && <h1 style={{ fontSize: 15, fontWeight: 800, color: '#0f1117' }}>{domain.business_name} · {pages.length} pages</h1>}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <a href={`/api/export/csv?domainId=${id}`} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#f8f9fc', border: '1px solid #e5e7eb', borderRadius: 9, color: '#374151', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}><Download size={12} /> Export CSV</a>
            <Link href={`/add-domain`} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#4f46e5', borderRadius: 9, color: '#fff', textDecoration: 'none', fontSize: 12, fontWeight: 700 }}><Plus size={12} /> Generate More</Link>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af', fontSize: 13 }}>Loading pages...</div>
          ) : (
            <>
              <div style={{ marginBottom: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
                  <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search keywords..."
                    style={{ width: '100%', padding: '9px 12px 9px 32px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 13, outline: 'none', background: '#fff', boxSizing: 'border-box' }} />
                </div>
                <span style={{ fontSize: 13, color: '#9ca3af' }}>{filtered.length} pages</span>
              </div>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, overflow: 'hidden' }}>
                {paginated.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af', fontSize: 13 }}>No pages found.</div>
                ) : paginated.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 18px', borderBottom: '1px solid #f9fafb' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f1117', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 500 }}>{p.keyword || p.title || `Page ${i+1}`}</div>
                      {p.slug && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>/{p.slug}</div>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                      <span style={{ fontSize: 12, color: '#9ca3af' }}>{p.views || 0} views</span>
                      {p.url && <a href={p.url} target="_blank" rel="noreferrer" style={{ color: '#4f46e5' }}><ExternalLink size={13} /></a>}
                    </div>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 20 }}>
                  {[...Array(Math.min(totalPages, 8))].map((_, i) => (
                    <button key={i} onClick={() => setPage(i+1)}
                      style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${page === i+1 ? '#4f46e5' : '#e5e7eb'}`, background: page === i+1 ? '#4f46e5' : '#fff', color: page === i+1 ? '#fff' : '#374151', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      {i+1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
