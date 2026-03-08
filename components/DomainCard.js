import Link from 'next/link'
import { Globe, ExternalLink, Trash2, Zap, BarChart3, FileText } from 'lucide-react'

export default function DomainCard({ domain, onDelete, onGenerate }) {
  const status = domain.page_count > 0 ? 'active' : 'pending'
  return (
    <div style={{
      background:'rgba(255,255,255,0.035)',
      border:'1px solid rgba(255,255,255,0.07)',
      borderRadius:14, padding:'20px 22px',
      transition:'border-color 0.15s,background 0.15s',
    }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.12)';e.currentTarget.style.background='rgba(255,255,255,0.055)'}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.07)';e.currentTarget.style.background='rgba(255,255,255,0.035)'}}>

      {/* Header */}
      <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:14 }}>
        <div style={{ display:'flex',alignItems:'center',gap:10,minWidth:0 }}>
          <div style={{ width:34,height:34,borderRadius:9,background:'rgba(99,102,241,0.12)',border:'1px solid rgba(99,102,241,0.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
            <Globe size={15} color='#a5b4fc' />
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:14,fontWeight:700,color:'#ededed',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:240 }}>{domain.domain}</div>
            <div style={{ fontSize:11,color:'rgba(237,237,237,0.3)',marginTop:2 }}>{domain.business_name}</div>
          </div>
        </div>
        <span style={{
          fontSize:9,padding:'3px 8px',borderRadius:100,
          fontFamily:"'JetBrains Mono',monospace",fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',
          ...(status==='active'
            ? {background:'rgba(34,197,94,0.1)',color:'#22c55e',border:'1px solid rgba(34,197,94,0.2)'}
            : {background:'rgba(245,158,11,0.1)',color:'#f59e0b',border:'1px solid rgba(245,158,11,0.2)'}),
        }}>{status}</span>
      </div>

      {/* Stats */}
      <div style={{ display:'flex',gap:14,marginBottom:16,padding:'12px 0',borderTop:'1px solid rgba(255,255,255,0.05)',borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        {[
          { icon:FileText, label:'Pages', value:domain.page_count||0 },
          { icon:BarChart3, label:'Views',  value:domain.total_views||0 },
        ].map(({ icon:Icon, label, value }) => (
          <div key={label} style={{ display:'flex',alignItems:'center',gap:7 }}>
            <Icon size={12} color='rgba(237,237,237,0.2)' />
            <span style={{ fontSize:13,fontWeight:700,color:'#ededed' }}>{value.toLocaleString()}</span>
            <span style={{ fontSize:11,color:'rgba(237,237,237,0.3)' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display:'flex',gap:7,flexWrap:'wrap' }}>
        <Link href={`/domain/${domain.id}`}
          style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'8px 12px',background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.2)',borderRadius:8,textDecoration:'none',fontSize:12,color:'#a5b4fc',fontWeight:600,minWidth:80 }}>
          <BarChart3 size={12} /> View Pages
        </Link>
        <button onClick={() => onGenerate && onGenerate(domain.id, 100)}
          style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'8px 12px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,cursor:'pointer',fontSize:12,color:'rgba(237,237,237,0.55)',fontWeight:600,fontFamily:'inherit',minWidth:80 }}>
          <Zap size={12} /> Generate
        </button>
        {domain.domain && (
          <a href={`https://${domain.domain}`} target='_blank' rel='noreferrer'
            style={{ display:'flex',alignItems:'center',justifyContent:'center',padding:'8px 10px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,color:'rgba(237,237,237,0.4)' }}>
            <ExternalLink size={12} />
          </a>
        )}
        <button onClick={() => onDelete && onDelete(domain.id, domain.domain)}
          style={{ display:'flex',alignItems:'center',justifyContent:'center',padding:'8px 10px',background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.15)',borderRadius:8,cursor:'pointer',color:'rgba(239,68,68,0.7)',fontFamily:'inherit' }}>
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}
