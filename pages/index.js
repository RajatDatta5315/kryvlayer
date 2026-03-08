import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>KRYVLayer — AI Programmatic SEO & Infinite Landing Pages</title>
        <link rel="icon" href="/logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Connect your domain once. AI generates thousands of SEO-optimized landing pages automatically. Built on KRYV Network." />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Inter, sans-serif', color: '#0f1117' }}>

        {/* NAV */}
        <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #e5e7eb', padding: '0 24px' }}>
          <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 16 }}>K</div>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#0f1117', letterSpacing: '-0.02em' }}>KRYVLayer</span>
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <a href="#how" style={{ padding: '8px 16px', fontSize: 14, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>How it works</a>
              <a href="/dashboard" style={{ padding: '10px 20px', background: '#4f46e5', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                Get Started →
              </a>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ padding: '80px 24px 64px', textAlign: 'center', maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: '#f0f0ff', border: '1px solid #c7d2fe', borderRadius: 100, fontSize: 13, color: '#4f46e5', fontWeight: 600, marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4f46e5', display: 'inline-block' }}></span>
            Powered by NEHIRA AI
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 900, color: '#0f1117', lineHeight: 1.08, letterSpacing: '-0.04em', margin: '0 0 20px' }}>
            Generate Infinite<br />
            <span style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SEO Landing Pages</span><br />
            Automatically
          </h1>

          <p style={{ fontSize: 18, color: '#6b7280', maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.7, fontWeight: 400 }}>
            Connect your domain once. NEHIRA analyzes your site and creates thousands of unique,
            keyword-targeted landing pages — live on your domain in minutes. Zero maintenance.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
            <a href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: '#4f46e5', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none', boxShadow: '0 4px 20px rgba(79,70,229,0.3)' }}>
              Start Free Trial
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#how" style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 28px', border: '1.5px solid #e5e7eb', borderRadius: 12, color: '#374151', fontWeight: 600, fontSize: 16, textDecoration: 'none' }}>
              See How It Works
            </a>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', background: '#f8f9fc', border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden', maxWidth: 700, margin: '0 auto' }}>
            {[['∞', 'Pages Generated'], ['5 min', 'Setup Time'], ['100%', 'Your Domain'], ['0', 'Maintenance']].map(([val, label], i) => (
              <div key={i} style={{ flex: '1 1 150px', padding: '24px 20px', borderRight: i < 3 ? '1px solid #e5e7eb' : 'none', textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#4f46e5', marginBottom: 4 }}>{val}</div>
                <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" style={{ padding: '80px 24px', background: '#f8f9fc', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: 1140, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4f46e5', marginBottom: 12 }}>How It Works</div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#0f1117', letterSpacing: '-0.03em' }}>Three steps to SEO domination</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {[
                { num: '01', title: 'Connect Domain', desc: 'Point a subdomain to KRYVLayer. Simple DNS record — takes under 5 minutes with any registrar.', icon: '🌐' },
                { num: '02', title: 'AI Generates Pages', desc: 'NEHIRA AI analyzes your site, researches keywords, and creates hundreds of unique, SEO-optimized landing pages.', icon: '⚡' },
                { num: '03', title: 'Pages Go Live', desc: 'All pages instantly live on your domain. Google indexes them. Traffic grows automatically. You do nothing.', icon: '🚀' },
              ].map((step, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 20, padding: 32, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f0f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{step.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#d1d5db' }}>{step.num}</div>
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f1117', marginBottom: 10 }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#0f1117', letterSpacing: '-0.03em', marginBottom: 16 }}>
              Ready to scale your SEO?
            </h2>
            <p style={{ fontSize: 16, color: '#6b7280', marginBottom: 32, lineHeight: 1.7 }}>
              Start generating landing pages on your domain today. No credit card required.
            </p>
            <a href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 36px', background: '#4f46e5', borderRadius: 14, color: '#fff', fontWeight: 800, fontSize: 16, textDecoration: 'none', boxShadow: '0 6px 24px rgba(79,70,229,0.35)' }}>
              Get Started Free →
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid #e5e7eb', padding: '24px', background: '#f8f9fc' }}>
          <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#9ca3af' }}>© 2026 KRYVLayer — Part of <a href="https://kryv.network" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}>KRYV Network</a></span>
            <a href="/dashboard" style={{ fontSize: 13, color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}>Launch Dashboard →</a>
          </div>
        </footer>

      </div>
    </>
  )
}
