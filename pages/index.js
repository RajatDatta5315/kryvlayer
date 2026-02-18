import Head from 'next/head'
import { useState, useEffect } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <>
      <Head>
        <title>KRYVLayer — Infinite SEO Pages, Instantly</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="AI generates thousands of SEO landing pages on your domain. Set up once, rank forever." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <div className="page-wrap">
        <div className="noise" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <nav className="nav">
          <div className="nav-inner">
            <a href="/" className="logo">
              <img src="/logo.png" alt="K" className="logo-img" onError={(e) => { e.target.style.display = 'none' }} />
              <span>KRYV<em>Layer</em></span>
            </a>
            <div className="nav-links">
              <a href="#how" className="nav-link">How it works</a>
              <a href="/dashboard" className="btn-nav">Get Started →</a>
            </div>
          </div>
        </nav>

        <section className="hero">
          <div className="hero-badge">
            <span className="badge-dot" />
            Powered by NEHIRA AI
          </div>

          <h1 className="hero-title">
            Generate<br />
            <span className="gradient-text">Infinite</span> SEO<br />
            Landing Pages
          </h1>

          <p className="hero-sub">
            Connect your domain once. Our AI reads your site and creates thousands 
            of unique, search-optimized pages — automatically, on YOUR domain.
          </p>

          <div className="hero-cta">
            <a href="/dashboard" className="btn-primary">
              Start Free
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#how" className="btn-ghost">See How It Works</a>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-num">∞</span>
              <span className="stat-label">Pages Generated</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-card">
              <span className="stat-num">1×</span>
              <span className="stat-label">Setup Required</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-card">
              <span className="stat-num">AI</span>
              <span className="stat-label">Content Engine</span>
            </div>
          </div>
        </section>

        <section id="how" className="how-section">
          <div className="section-inner">
            <p className="section-label">The Process</p>
            <h2 className="section-title">Three steps to dominate search</h2>

            <div className="steps-grid">
              {[
                { n: '01', icon: '🔗', title: 'Connect Your Site', body: 'Paste your website URL. KRYVLayer reads your content and understands your business.' },
                { n: '02', icon: '⚡', title: 'AI Does the Work', body: 'NEHIRA generates thousands of keyword-targeted landing pages with unique, compelling content.' },
                { n: '03', icon: '🚀', title: 'Pages Go Live', body: 'All pages are instantly live on your own domain — no extra tools, no manual work ever.' }
              ].map((s, i) => (
                <div key={i} className="step-card">
                  <div className="step-num">{s.n}</div>
                  <div className="step-icon">{s.icon}</div>
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-body">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="urls-section">
          <div className="section-inner">
            <p className="section-label">Live Example</p>
            <h2 className="section-title">Your domain. Thousands of pages.</h2>
            <div className="urls-card">
              {[
                'yourdomain.com/crm-software-london',
                'yourdomain.com/project-management-new-york',
                'yourdomain.com/saas-platform-toronto',
                'yourdomain.com/fintech-tools-singapore',
                'yourdomain.com/analytics-software-dubai',
              ].map((url, i) => (
                <div key={i} className="url-row">
                  <svg className="url-check" width="16" height="16" fill="none" stroke="#4ade80" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                  <span>{url}</span>
                </div>
              ))}
              <div className="url-more">+ Thousands more generated automatically</div>
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="section-inner" style={{ textAlign: 'center' }}>
            <h2 className="section-title">Ready to dominate search?</h2>
            <p className="hero-sub" style={{ margin: '0 auto 2rem', maxWidth: '500px' }}>
              Set up once. Generate forever. Your competitors won't know what hit them.
            </p>
            <a href="/dashboard" className="btn-primary btn-large">
              Start Generating Pages Free
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </section>

        <footer className="footer">
          <div className="nav-inner">
            <span>© 2026 KRYVLayer. All rights reserved.</span>
            <span className="footer-powered">Powered by NEHIRA AI</span>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; background: #080812; color: #e2e0f0; overflow-x: hidden; }
      `}</style>

      <style jsx>{`
        .page-wrap { min-height: 100vh; position: relative; overflow: hidden; }
        .noise { position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"); pointer-events: none; z-index: 1; opacity: 0.4; }
        .orb { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; animation: float 8s ease-in-out infinite; }
        .orb-1 { width: 500px; height: 500px; top: -150px; left: -150px; background: radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%); }
        .orb-2 { width: 400px; height: 400px; bottom: -100px; right: -100px; background: radial-gradient(circle, rgba(219,39,119,0.25), transparent 70%); animation-delay: -3s; }
        .orb-3 { width: 300px; height: 300px; top: 40%; left: 50%; background: radial-gradient(circle, rgba(59,130,246,0.2), transparent 70%); animation-delay: -6s; }
        @keyframes float { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-30px) scale(1.05); } }
        .nav { position: sticky; top: 0; z-index: 100; backdrop-filter: blur(20px); background: rgba(8,8,18,0.7); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 1.25rem; display: flex; justify-content: space-between; align-items: center; height: 64px; }
        .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.25rem; color: #fff; }
        .logo em { font-style: normal; background: linear-gradient(135deg, #a78bfa, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .logo-img { width: 32px; height: 32px; border-radius: 8px; object-fit: cover; }
        .nav-links { display: flex; align-items: center; gap: 1rem; }
        .nav-link { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.9rem; transition: color .2s; }
        .nav-link:hover { color: #fff; }
        .btn-nav { padding: 0.5rem 1.25rem; background: linear-gradient(135deg, #7c3aed, #db2777); border-radius: 8px; color: #fff; font-weight: 600; font-size: 0.875rem; text-decoration: none; transition: opacity .2s, transform .2s; }
        .btn-nav:hover { opacity: 0.85; transform: scale(1.02); }
        .hero { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; padding: 5rem 1.25rem 4rem; text-align: center; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 100px; background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.3); font-size: 0.8rem; color: #c4b5fd; font-weight: 500; margin-bottom: 2rem; }
        .badge-dot { width: 8px; height: 8px; border-radius: 50%; background: #a78bfa; animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.8); } }
        .hero-title { font-family: 'Syne', sans-serif; font-size: clamp(2.5rem, 8vw, 5.5rem); font-weight: 800; line-height: 1.05; color: #fff; margin-bottom: 1.5rem; }
        .gradient-text { background: linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #60a5fa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .hero-sub { font-size: clamp(1rem, 2.5vw, 1.2rem); color: rgba(255,255,255,0.55); max-width: 600px; margin: 0 auto 2.5rem; line-height: 1.7; }
        .hero-cta { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 4rem; }
        .btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 0.875rem 2rem; background: linear-gradient(135deg, #7c3aed, #db2777); border-radius: 12px; color: #fff; font-weight: 700; font-size: 1rem; text-decoration: none; transition: transform .2s, box-shadow .2s; box-shadow: 0 0 30px rgba(124,58,237,0.35); }
        .btn-primary:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 0 50px rgba(124,58,237,0.5); }
        .btn-large { padding: 1rem 2.5rem; font-size: 1.1rem; }
        .btn-ghost { display: inline-flex; align-items: center; padding: 0.875rem 2rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: rgba(255,255,255,0.75); font-weight: 600; font-size: 1rem; text-decoration: none; transition: background .2s, border-color .2s; }
        .btn-ghost:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }
        .stats-row { display: inline-flex; align-items: center; gap: 0; padding: 1.25rem 2rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; backdrop-filter: blur(10px); flex-wrap: wrap; justify-content: center; }
        .stat-card { padding: 0 2rem; text-align: center; }
        .stat-num { display: block; font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; background: linear-gradient(135deg, #a78bfa, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .stat-label { font-size: 0.75rem; color: rgba(255,255,255,0.4); margin-top: 2px; }
        .stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.1); }
        .how-section, .urls-section, .final-cta { position: relative; z-index: 2; padding: 5rem 1.25rem; }
        .how-section { background: rgba(255,255,255,0.015); border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .section-inner { max-width: 1200px; margin: 0 auto; }
        .section-label { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #a78bfa; margin-bottom: 1rem; }
        .section-title { font-family: 'Syne', sans-serif; font-size: clamp(1.75rem, 4vw, 3rem); font-weight: 800; color: #fff; margin-bottom: 3rem; }
        .steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
        .step-card { padding: 2rem; background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; transition: border-color .3s, background .3s; }
        .step-card:hover { border-color: rgba(167,139,250,0.4); background: rgba(124,58,237,0.08); }
        .step-num { font-family: 'Syne', sans-serif; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; color: rgba(167,139,250,0.5); margin-bottom: 1rem; }
        .step-icon { font-size: 2.5rem; margin-bottom: 1rem; }
        .step-title { font-family: 'Syne', sans-serif; font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 0.75rem; }
        .step-body { color: rgba(255,255,255,0.5); line-height: 1.7; font-size: 0.95rem; }
        .urls-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 2rem; max-width: 600px; }
        .url-row { display: flex; align-items: center; gap: 12px; padding: 0.6rem 0; border-bottom: 1px solid rgba(255,255,255,0.04); font-family: 'DM Mono', monospace; font-size: 0.875rem; color: rgba(255,255,255,0.65); }
        .url-row:last-of-type { border-bottom: none; }
        .url-check { flex-shrink: 0; }
        .url-more { padding-top: 1rem; font-size: 0.875rem; color: #a78bfa; font-weight: 600; }
        .footer { position: relative; z-index: 2; border-top: 1px solid rgba(255,255,255,0.06); padding: 1.5rem 0; }
        .footer .nav-inner { color: rgba(255,255,255,0.3); font-size: 0.8rem; }
        .footer-powered { color: rgba(167,139,250,0.5); }
        @media (max-width: 640px) { .nav-link { display: none; } .stat-card { padding: 0 1rem; } .stat-num { font-size: 1.5rem; } .stats-row { padding: 1rem; gap: 0; } .stat-divider { height: 30px; } }
      `}</style>
    </>
  )
}
