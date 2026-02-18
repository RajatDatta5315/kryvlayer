export default function DomainCard({ domain, onDelete, onBulkGenerate }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#fff', marginBottom: 4, fontSize: '1rem' }}>{domain.business_name}</h3>
          <p style={{ color: '#a78bfa', fontFamily: 'monospace', fontSize: '0.8rem' }}>{domain.domain}</p>
        </div>
        <span style={{ padding: '3px 10px', background: 'rgba(74,222,128,0.12)', color: '#4ade80', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600 }}>Live</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '0.875rem', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Syne', fontSize: '1.5rem', fontWeight: 800, color: '#a78bfa' }}>{domain.page_count || 0}</div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Pages</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '0.875rem', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Syne', fontSize: '1.5rem', fontWeight: 800, color: '#f472b6' }}>{domain.total_views || 0}</div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Views</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <a href={`/domain/${domain.id}`} style={{ flex: 1, textAlign: 'center', padding: '0.6rem 0.75rem', background: 'rgba(124,58,237,0.15)', color: '#a78bfa', borderRadius: 10, fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>View Pages</a>
        <button onClick={() => onBulkGenerate(domain.id, 100)} style={{ flex: 1, padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', borderRadius: 10, fontSize: '0.8rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>+ More Pages</button>
        <a href={`/api/export/csv?domainId=${domain.id}`} style={{ padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', borderRadius: 10, fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>CSV</a>
        <button onClick={() => onDelete(domain.id, domain.business_name)} style={{ padding: '0.6rem 0.75rem', background: 'rgba(239,68,68,0.08)', color: 'rgba(239,68,68,0.6)', borderRadius: 10, fontSize: '0.8rem', border: '1px solid rgba(239,68,68,0.15)', cursor: 'pointer' }}>🗑</button>
      </div>
    </div>
  )
}
