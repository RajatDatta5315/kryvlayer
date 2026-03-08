import { Globe, BarChart2, Download, Trash2, Plus, ExternalLink, CheckCircle } from 'lucide-react'

export default function DomainCard({ domain, onDelete, onBulkGenerate }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16,
      padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,70,229,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f1117', marginBottom: 4, letterSpacing: '-0.01em' }}>
            {domain.business_name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Globe size={12} color="#9ca3af" />
            <span style={{ fontSize: 12, color: '#6b7280', fontFamily: 'monospace' }}>{domain.domain}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 100 }}>
          <CheckCircle size={10} color="#16a34a" />
          <span style={{ fontSize: 10, fontWeight: 700, color: '#16a34a' }}>Live</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
        <div style={{ background: '#f8f9fc', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#4f46e5', letterSpacing: '-0.02em', lineHeight: 1 }}>{domain.page_count || 0}</div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, fontWeight: 500 }}>Pages Generated</div>
        </div>
        <div style={{ background: '#f8f9fc', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#7c3aed', letterSpacing: '-0.02em', lineHeight: 1 }}>{domain.total_views || 0}</div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, fontWeight: 500 }}>Total Views</div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <a href={`/domain/${domain.id}`} style={{ flex: 1, minWidth: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 12px', background: '#f0f0ff', color: '#4f46e5', borderRadius: 10, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
          <ExternalLink size={12} /> View Pages
        </a>
        <button onClick={() => onBulkGenerate(domain.id, 100)} style={{ flex: 1, minWidth: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 12px', background: '#fff', color: '#374151', borderRadius: 10, fontSize: 12, fontWeight: 700, border: '1px solid #e5e7eb', cursor: 'pointer' }}>
          <Plus size={12} /> Generate
        </button>
        <a href={`/api/export/csv?domainId=${domain.id}`} style={{ padding: '9px 12px', background: '#f8f9fc', color: '#9ca3af', borderRadius: 10, fontSize: 12, border: '1px solid #e5e7eb', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <Download size={12} />
        </a>
        <button onClick={() => onDelete(domain.id, domain.business_name)} style={{ padding: '9px 12px', background: '#fff5f5', color: '#ef4444', borderRadius: 10, fontSize: 12, border: '1px solid #fee2e2', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}
