export default function Sidebar({ user, view, setView, fetchStats, sidebarOpen, setSidebarOpen }) {
  const navItems = [
    { id: 'domains', icon: '🌐', label: 'Domains' },
    { id: 'analytics', icon: '📊', label: 'Analytics' },
    { id: 'chat', icon: '🤖', label: 'NEHIRA AI', href: '/chat' },
  ]

  return (
    <>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }} />}

      <aside style={{
        width: 220, flexShrink: 0, background: 'rgba(255,255,255,0.02)',
        borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column',
        padding: '1.5rem 1rem', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.25s ease',
      }} className="sidebar">
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: '2rem', padding: '0 0.5rem' }}>
          <img src="/logo.png" alt="" style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
            KRYV<span style={{ background: 'linear-gradient(135deg,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Layer</span>
          </span>
        </a>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {navItems.map(item => (
            item.href ? (
              <a key={item.id} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.65rem 0.75rem', borderRadius: 10, color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', transition: 'all .2s' }}>
                <span>{item.icon}</span>{item.label}
              </a>
            ) : (
              <button key={item.id} onClick={() => { setView(item.id); setSidebarOpen(false); if (item.id === 'analytics') fetchStats(); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.65rem 0.75rem', borderRadius: 10, color: view === item.id ? '#fff' : 'rgba(255,255,255,0.5)', background: view === item.id ? 'rgba(124,58,237,0.2)' : 'none', fontSize: '0.9rem', fontWeight: 500, border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all .2s' }}>
                <span>{item.icon}</span>{item.label}
              </button>
            )
          ))}

          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0.75rem 0' }} />
          <a href="/chat" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.65rem 0.75rem', borderRadius: 10, background: 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(219,39,119,0.2))', border: '1px solid rgba(167,139,250,0.2)', color: '#c4b5fd', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
            <span>✨</span> Ask NEHIRA
          </a>
        </nav>

        <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', padding: '0.5rem' }}>{user.email}</div>
        </div>
      </aside>
    </>
  )
}
