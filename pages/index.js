import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>KRYVLayer — AI-Powered Programmatic SEO Platform</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Generate thousands of SEO landing pages automatically on your domain. AI-powered, zero maintenance." />
      </Head>

      <div className="page">
        {/* Grid background */}
        <div className="grid-bg" />

        {/* Navbar */}
        <nav className="nav">
          <div className="container">
            <div className="nav-content">
              <a href="/" className="logo">
                <div className="logo-icon">K</div>
                <span className="logo-text">KRYVLayer</span>
              </a>
              <div className="nav-links">
                <a href="#features" className="nav-link">Features</a>
                <a href="#pricing" className="nav-link">Pricing</a>
                <a href="/dashboard" className="btn-primary">Get Started</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="hero">
          <div className="container">
            <div className="hero-badge">
              <span className="badge-dot" />
              <span>Powered by NEHIRA AI</span>
            </div>

            <h1 className="hero-title">
              Generate Infinite<br />
              SEO Landing Pages<br />
              <span className="gradient">Automatically</span>
            </h1>

            <p className="hero-subtitle">
              Connect your domain once. Our AI analyzes your site and creates thousands of unique, 
              SEO-optimized pages — all live on YOUR domain in minutes.
            </p>

            <div className="hero-cta">
              <a href="/dashboard" className="btn-primary btn-large">
                Start Free Trial
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <a href="#features" className="btn-ghost">
                See How It Works
              </a>
            </div>

            {/* Stats cards */}
            <div className="stats-grid">
              <div className="stat-card glass">
                <div className="stat-value">∞</div>
                <div className="stat-label">Pages Generated</div>
              </div>
              <div className="stat-card glass">
                <div className="stat-value">5min</div>
                <div className="stat-label">Setup Time</div>
              </div>
              <div className="stat-card glass">
                <div className="stat-value">Zero</div>
                <div className="stat-label">Maintenance</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="features">
          <div className="container">
            <div className="section-header">
              <span className="section-label">How It Works</span>
              <h2 className="section-title">Three Steps to SEO Domination</h2>
            </div>

            <div className="features-grid">
              <div className="feature-card glass">
                <div className="feature-number">01</div>
                <div className="feature-icon">
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                </div>
                <h3 className="feature-title">Connect Domain</h3>
                <p className="feature-desc">Point your domain DNS to KRYVLayer. Simple one-time setup that takes 5 minutes.</p>
              </div>

              <div className="feature-card glass">
                <div className="feature-number">02</div>
                <div className="feature-icon">
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                </div>
                <h3 className="feature-title">AI Generates Pages</h3>
                <p className="feature-desc">NEHIRA analyzes your site and creates hundreds of unique, keyword-targeted landing pages.</p>
              </div>

              <div className="feature-card glass">
                <div className="feature-number">03</div>
                <div className="feature-icon">
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <h3 className="feature-title">Pages Go Live</h3>
                <p className="feature-desc">All pages instantly live on your domain. Zero maintenance. Just watch your traffic grow.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-card glass">
              <h2 className="cta-title">Ready to Scale Your SEO?</h2>
              <p className="cta-subtitle">Join businesses generating thousands of landing pages automatically</p>
              <a href="/dashboard" className="btn-primary btn-large">
                Start Free Trial
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <span>© 2026 KRYVLayer</span>
              <span>Powered by NEHIRA AI</span>
            </div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0b14; color: #e5e7eb; }
      `}</style>

      <style jsx>{`
        .page { min-height: 100vh; position: relative; }
        .grid-bg { position: fixed; inset: 0; background-image: linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px); background-size: 50px 50px; pointer-events: none; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        
        /* Nav */
        .nav { position: sticky; top: 0; z-index: 100; backdrop-filter: blur(20px); background: rgba(10,11,20,0.8); border-bottom: 1px solid rgba(255,255,255,0.08); }
        .nav-content { display: flex; justify-content: space-between; align-items: center; height: 70px; }
        .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .logo-icon { width: 36px; height: 36px; border-radius: 8px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 1.1rem; }
        .logo-text { font-size: 1.25rem; font-weight: 700; color: #fff; }
        .nav-links { display: flex; align-items: center; gap: 1.5rem; }
        .nav-link { color: rgba(255,255,255,0.7); text-decoration: none; font-size: 0.95rem; transition: color .2s; }
        .nav-link:hover { color: #fff; }

        /* Buttons */
        .btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 0.75rem 1.5rem; background: #3b82f6; border-radius: 10px; color: #fff; font-weight: 600; font-size: 0.95rem; text-decoration: none; border: none; cursor: pointer; transition: all .2s; }
        .btn-primary:hover { background: #2563eb; transform: translateY(-1px); }
        .btn-large { padding: 1rem 2rem; font-size: 1.05rem; }
        .btn-ghost { display: inline-flex; align-items: center; padding: 0.75rem 1.5rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: rgba(255,255,255,0.8); font-weight: 600; text-decoration: none; transition: all .2s; }
        .btn-ghost:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }

        /* Hero */
        .hero { padding: 6rem 0 5rem; text-align: center; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3); border-radius: 100px; font-size: 0.85rem; color: rgba(59,130,246,0.9); margin-bottom: 2rem; }
        .badge-dot { width: 8px; height: 8px; border-radius: 50%; background: #3b82f6; animation: pulse 2s ease-in-out infinite; }
        .hero-title { font-size: clamp(2.5rem, 8vw, 5rem); font-weight: 800; line-height: 1.1; color: #fff; margin-bottom: 1.5rem; letter-spacing: -0.02em; }
        .gradient { background: linear-gradient(135deg, #3b82f6, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-subtitle { font-size: clamp(1rem, 2.5vw, 1.15rem); color: rgba(255,255,255,0.6); max-width: 700px; margin: 0 auto 2.5rem; line-height: 1.7; }
        .hero-cta { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 4rem; }

        /* Stats */
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; max-width: 700px; margin: 0 auto; }
        .stat-card { padding: 1.5rem; text-align: center; }
        .stat-value { font-size: 2rem; font-weight: 800; color: #3b82f6; margin-bottom: 0.25rem; }
        .stat-label { font-size: 0.8rem; color: rgba(255,255,255,0.5); }

        /* Glass effect */
        .glass { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(10px); border-radius: 16px; }

        /* Features */
        .features { padding: 5rem 0; background: rgba(255,255,255,0.01); }
        .section-header { text-align: center; margin-bottom: 4rem; }
        .section-label { display: inline-block; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #3b82f6; margin-bottom: 1rem; }
        .section-title { font-size: clamp(1.75rem, 4vw, 2.75rem); font-weight: 800; color: #fff; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
        .feature-card { padding: 2rem; transition: transform .2s; }
        .feature-card:hover { transform: translateY(-4px); }
        .feature-number { font-size: 0.75rem; font-weight: 700; color: rgba(59,130,246,0.5); margin-bottom: 1rem; }
        .feature-icon { width: 48px; height: 48px; border-radius: 12px; background: rgba(59,130,246,0.1); display: flex; align-items: center; justify-content: center; color: #3b82f6; margin-bottom: 1.5rem; }
        .feature-title { font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 0.75rem; }
        .feature-desc { color: rgba(255,255,255,0.6); line-height: 1.7; }

        /* CTA */
        .cta-section { padding: 5rem 0; }
        .cta-card { padding: 4rem 2rem; text-align: center; }
        .cta-title { font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 800; color: #fff; margin-bottom: 1rem; }
        .cta-subtitle { font-size: 1.1rem; color: rgba(255,255,255,0.6); margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto; }

        /* Footer */
        .footer { border-top: 1px solid rgba(255,255,255,0.08); padding: 2rem 0; }
        .footer-content { display: flex; justify-content: space-between; font-size: 0.85rem; color: rgba(255,255,255,0.4); flex-wrap: wrap; gap: 1rem; }

        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @media (max-width: 768px) { .stats-grid { grid-template-columns: 1fr; } .nav-link { display: none; } }
      `}</style>
    </>
  )
}
