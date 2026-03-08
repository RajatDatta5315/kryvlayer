import { Globe, BarChart2, Sparkles, ChevronRight } from 'lucide-react'

const navItems = [
  { id: 'domains', icon: Globe, label: 'My Domains' },
  { id: 'analytics', icon: BarChart2, label: 'Analytics' },
]

export default function Sidebar({ user, view, setView, fetchStats, sidebarOpen, setSidebarOpen }) {
  return (
    <>
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40, backdropFilter: 'blur(4px)' }} />
      )}
      <aside style={{
        width: 240, flexShrink: 0,
        background: '#ffffff',
        borderRight: '1px solid #e5e7eb',
        display: 'flex', flexDirection: 'column',
        padding: '20px 12px',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
        boxShadow: '4px 0 24px rgba(0,0,0,0.04)',
      }} className="sidebar">
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 28, padding: '4px 8px' }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 16 }}>K</div>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#0f1117', letterSpacing: '-0.02em' }}>KRYVLayer</span>
        </a>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(({ id, icon: Icon, label }) => {
            const active = view === id
            return (
              <button key={id}
                onClick={() => { setView(id); setSidebarOpen(false); if (id === 'analytics') fetchStats(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 10, border: 'none',
                  background: active ? '#f0f0ff' : 'transparent',
                  color: active ? '#4f46e5' : '#6b7280',
                  fontSize: 13, fontWeight: active ? 700 : 500,
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                  transition: 'all 0.15s',
                }}>
                <Icon size={15} strokeWidth={active ? 2.5 : 1.8} />
                {label}
                {active && <ChevronRight size={13} style={{ marginLeft: 'auto' }} />}
              </button>
            )
          })}

          <div style={{ height: 1, background: '#f3f4f6', margin: '12px 4px' }} />

          <a href="/chat" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 10, textDecoration: 'none',
            background: 'linear-gradient(135deg, #f0f0ff, #fdf4ff)',
            border: '1px solid #e0d9ff',
            color: '#4f46e5', fontSize: 13, fontWeight: 700,
          }}>
            <Sparkles size={14} />
            Ask NEHIRA AI
          </a>

          <a href="/add-domain" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '11px 12px', borderRadius: 10, textDecoration: 'none',
            background: '#4f46e5', color: '#fff', fontSize: 13, fontWeight: 700, marginTop: 8,
          }}>
            + Add Domain
          </a>
        </nav>

        {/* Footer */}
        <div style={{ paddingTop: 16, borderTop: '1px solid #f3f4f6' }}>
          <div style={{ fontSize: 11, color: '#9ca3af', padding: '0 8px', lineHeight: 1.5 }}>
            {user?.email}
          </div>
        </div>
      </aside>
    </>
  )
}
