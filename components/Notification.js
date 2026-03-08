import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

const TYPES = {
  success: { icon:CheckCircle, color:'#22c55e', bg:'rgba(34,197,94,0.08)', border:'rgba(34,197,94,0.2)' },
  error:   { icon:AlertCircle, color:'#ef4444', bg:'rgba(239,68,68,0.08)', border:'rgba(239,68,68,0.2)' },
  info:    { icon:Info,        color:'#a5b4fc', bg:'rgba(99,102,241,0.08)', border:'rgba(99,102,241,0.2)' },
}

export default function Notification({ msg, type='success', onClose }) {
  const t = TYPES[type] || TYPES.info
  const Icon = t.icon
  return (
    <div style={{
      position:'fixed',bottom:24,right:24,zIndex:999,
      display:'flex',alignItems:'center',gap:10,
      padding:'12px 16px 12px 14px',borderRadius:12,
      background:t.bg,border:`1px solid ${t.border}`,
      backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',
      boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
      maxWidth:360,animation:'slideIn 0.25s ease',
    }}>
      <Icon size={15} color={t.color} style={{ flexShrink:0 }} />
      <span style={{ fontSize:13,color:'rgba(237,237,237,0.85)',flex:1,lineHeight:1.5 }}>{msg}</span>
      {onClose && <button onClick={onClose} style={{ background:'none',border:'none',cursor:'pointer',padding:2,color:'rgba(237,237,237,0.3)',marginLeft:4 }}><X size={13} /></button>}
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}
