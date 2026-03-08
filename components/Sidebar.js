import Link from 'next/link'
import { useRouter } from 'next/router'
import { LayoutDashboard, Globe, BarChart3, MessageSquare, Plus, Settings, ChevronRight } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Overview',   icon: LayoutDashboard },
  { href: '/analytics', label: 'Analytics',  icon: BarChart3 },
  { href: '/chat',      label: 'NEHIRA AI',  icon: MessageSquare },
  { href: '/add-domain',label: 'Add Domain', icon: Plus },
]

export default function Sidebar({ open, onClose }) {
  const { pathname } = useRouter()
  return (
    <>
      {/* Overlay (mobile) */}
      {open && <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:40,display:'block' }} />}
      <aside style={{
        position: open ? 'fixed' : 'sticky',
        top: 0, left: 0,
        height: '100vh',
        width: 220, minWidth: 220, flexShrink: 0,
        background: '#080808',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column',
        zIndex: 50,
        transform: open !== false ? 'translateX(0)' : undefined,
        transition: 'transform 0.25s ease',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ padding: '22px 18px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/dashboard" style={{ textDecoration:'none',display:'flex',alignItems:'center',gap:9 }}>
            <div style={{ width:30,height:30,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
              <span style={{ fontSize:12,fontWeight:900,color:'#fff',fontFamily:'Inter,sans-serif',letterSpacing:'-0.05em' }}>KL</span>
            </div>
            <div>
              <div style={{ fontSize:13,fontWeight:800,color:'#ededed',letterSpacing:'-0.02em' }}>KRYVLayer</div>
              <div style={{ fontSize:9,color:'rgba(255,255,255,0.2)',letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:"'JetBrains Mono',monospace" }}>SEO Engine</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex:1,padding:'12px 10px' }}>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link key={href} href={href} style={{
                display:'flex',alignItems:'center',gap:9,padding:'9px 10px',
                borderRadius:8,marginBottom:2,textDecoration:'none',
                background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
                border: active ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
                color: active ? '#a5b4fc' : 'rgba(237,237,237,0.4)',
                transition:'all 0.15s',
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='rgba(237,237,237,0.7)'; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(237,237,237,0.4)'; }}}>
                <Icon size={15} strokeWidth={active?2:1.5} />
                <span style={{ fontSize:13,fontWeight:active?600:400 }}>{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding:'12px 10px',borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <Link href="https://inkrux.kryv.network/article/geo-beats-seo-2026-full-playbook" target="_blank"
            style={{ display:'flex',alignItems:'center',gap:8,padding:'10px 12px',background:'rgba(99,102,241,0.07)',border:'1px solid rgba(99,102,241,0.15)',borderRadius:9,textDecoration:'none',marginBottom:8 }}>
            <span style={{ fontSize:12,fontWeight:600,color:'#a5b4fc',flex:1 }}>GEO Guide 2026</span>
            <ChevronRight size={12} color='rgba(165,180,252,0.5)' />
          </Link>
          <Link href="/dashboard"
            style={{ display:'flex',alignItems:'center',gap:8,padding:'9px 10px',borderRadius:8,textDecoration:'none',color:'rgba(237,237,237,0.3)',fontSize:12 }}>
            <Settings size={13} /> Settings
          </Link>
        </div>
      </aside>
    </>
  )
}
