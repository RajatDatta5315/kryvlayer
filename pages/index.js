import { useState, useEffect } from 'react'
import Head from 'next/head'

const KRYVLAYER_IP = '76.76.21.21'
const KRYVLAYER_CNAME = 'cname.kryvlayer.app'

export default function Dashboard() {
  const [view, setView] = useState('domains') // domains | addDomain | analytics
  const [domains, setDomains] = useState([])
  const [addStep, setAddStep] = useState(1) // 1=info, 2=dns, 3=verify, 4=generating, 5=done
  const [formData, setFormData] = useState({ businessName: '', websiteUrl: '', domain: '' })
  const [currentDomain, setCurrentDomain] = useState(null)
  const [generatedPages, setGeneratedPages] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [verifyStatus, setVerifyStatus] = useState(null) // null | checking | valid | invalid

  useEffect(() => {
    fetchDomains()
  }, [])

  async function fetchDomains() {
    try {
      const res = await fetch('/api/domains/list?userId=1')
      const data = await res.json()
      if (data.success) setDomains(data.domains || [])
    } catch (e) {
      console.error(e)
    }
  }

  async function handleStep1(e) {
    e.preventDefault()
    setAddStep(2)
  }

  async function checkDNS() {
    setVerifyStatus('checking')
    try {
      const res = await fetch('/api/domains/verify-dns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: formData.domain })
      })
      const data = await res.json()
      setVerifyStatus(data.connected ? 'valid' : 'invalid')
    } catch {
      setVerifyStatus('invalid')
    }
  }

  async function proceedAfterDNS() {
    setAddStep(4)
    setLoading(true)
    try {
      // Create domain record
      const domainRes = await fetch('/api/domains/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1, ...formData })
      })
      const domainData = await domainRes.json()
      if (!domainData.success) throw new Error(domainData.error || 'Domain creation failed')
      setCurrentDomain(domainData.domainId)

      // Generate pages
      const genRes = await fetch('/api/generate/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainId: domainData.domainId })
      })
      const genData = await genRes.json()
      setGeneratedPages(genData.pages || [])
      setAddStep(5)
      fetchDomains()
    } catch (err) {
      alert('Error: ' + err.message)
      setAddStep(2)
    } finally {
      setLoading(false)
    }
  }

  async function fetchStats() {
    try {
      const res = await fetch('/api/analytics/stats')
      const data = await res.json()
      setStats(data)
    } catch (e) {}
  }

  function resetForm() {
    setAddStep(1)
    setFormData({ businessName: '', websiteUrl: '', domain: '' })
    setVerifyStatus(null)
    setGeneratedPages([])
    setView('domains')
  }

  const domainType = formData.domain.includes('.') ? 'subdomain' : 'root'
  const isSubdomain = formData.domain.split('.').length > 2

  return (
    <>
      <Head>
        <title>Dashboard — KRYVLayer</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <div className="dash-wrap">
        <div className="noise" />

        {/* Sidebar */}
        <aside className="sidebar">
          <a href="/" className="sidebar-logo">
            <img src="/logo.png" alt="" className="logo-img" onError={e => e.target.style.display = 'none'} />
            <span>KRYV<em>Layer</em></span>
          </a>

          <nav className="sidebar-nav">
            <button className={`nav-item ${view === 'domains' ? 'active' : ''}`} onClick={() => setView('domains')}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9"/></svg>
              Domains
            </button>
            <button className={`nav-item ${view === 'analytics' ? 'active' : ''}`} onClick={() => { setView('analytics'); fetchStats(); }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
              Analytics
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="user-pill">demo@kryvlayer.com</div>
          </div>
        </aside>

        {/* Main */}
        <main className="dash-main">

          {/* DOMAINS VIEW */}
          {view === 'domains' && addStep === 1 && (
            <div>
              <div className="dash-header">
                <div>
                  <h1 className="dash-title">Domains</h1>
                  <p className="dash-sub">Connect a domain once — we generate infinite pages on it</p>
                </div>
                <button className="btn-primary" onClick={() => setView('addDomain')}>
                  + Add Domain
                </button>
              </div>

              {domains.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🌐</div>
                  <h2>No domains yet</h2>
                  <p>Add your first domain to start generating landing pages</p>
                  <button className="btn-primary" onClick={() => setView('addDomain')}>
                    Add Your First Domain
                  </button>
                </div>
              ) : (
                <div className="domains-grid">
                  {domains.map((d, i) => (
                    <div key={i} className="domain-card">
                      <div className="domain-top">
                        <div>
                          <div className="domain-name">{d.business_name}</div>
                          <div className="domain-url">{d.domain}</div>
                        </div>
                        <span className="badge-live">Live</span>
                      </div>
                      <div className="domain-stats">
                        <div className="dstat">
                          <span className="dstat-num">{d.page_count || 0}</span>
                          <span className="dstat-label">Pages</span>
                        </div>
                        <div className="dstat">
                          <span className="dstat-num">{d.total_views || 0}</span>
                          <span className="dstat-label">Views</span>
                        </div>
                      </div>
                      <a href={`/domain-pages?id=${d.id}`} className="domain-link">
                        View Pages →
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADD DOMAIN FLOW */}
          {(view === 'addDomain' || (view === 'domains' && addStep > 1)) && (
            <div>
              <div className="dash-header">
                <div>
                  <button className="back-btn" onClick={resetForm}>← Back</button>
                  <h1 className="dash-title">Add Domain</h1>
                </div>
                {/* Step progress */}
                <div className="steps-progress">
                  {['Info', 'DNS', 'Verify', 'Generate', 'Done'].map((s, i) => (
                    <div key={i} className={`prog-step ${addStep > i ? 'done' : ''} ${addStep === i + 1 ? 'current' : ''}`}>
                      <div className="prog-dot">{addStep > i + 1 ? '✓' : i + 1}</div>
                      <span className="prog-label">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 1: Business Info */}
              {addStep === 1 && (
                <div className="form-card">
                  <h2 className="form-title">Tell us about your business</h2>
                  <p className="form-sub">We'll analyze your website and generate pages automatically</p>
                  <form onSubmit={handleStep1} className="form-fields">
                    <div className="field">
                      <label>Business Name</label>
                      <input
                        type="text" required placeholder="Acme SaaS Inc."
                        value={formData.businessName}
                        onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                      />
                    </div>
                    <div className="field">
                      <label>Your Website URL</label>
                      <input
                        type="url" required placeholder="https://mycompany.com"
                        value={formData.websiteUrl}
                        onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
                      />
                      <span className="field-hint">Our AI will scan this to understand your business</span>
                    </div>
                    <div className="field">
                      <label>Domain for Landing Pages</label>
                      <input
                        type="text" required placeholder="e.g. mycompany.com or seo.mycompany.com"
                        value={formData.domain}
                        onChange={e => setFormData({ ...formData, domain: e.target.value })}
                      />
                      <span className="field-hint">This is where your pages will live — can be a subdomain</span>
                    </div>
                    <button type="submit" className="btn-primary btn-full">
                      Continue to DNS Setup →
                    </button>
                  </form>
                </div>
              )}

              {/* STEP 2: DNS Instructions */}
              {addStep === 2 && (
                <div className="form-card">
                  <h2 className="form-title">Connect your domain</h2>
                  <p className="form-sub">Add this DNS record in your domain provider (Namecheap, GoDaddy, Cloudflare, etc.)</p>

                  <div className="dns-card">
                    <div className="dns-header">
                      <span className="dns-badge">Required DNS Record</span>
                      <span className="dns-type-badge">{isSubdomain ? 'CNAME' : 'A Record'}</span>
                    </div>

                    <div className="dns-table">
                      <div className="dns-row dns-row-head">
                        <span>Type</span>
                        <span>Name</span>
                        <span>Value</span>
                        <span>TTL</span>
                      </div>

                      {isSubdomain ? (
                        <div className="dns-row">
                          <span className="dns-val-type">CNAME</span>
                          <span className="dns-val">
                            <code>{formData.domain.split('.')[0]}</code>
                            <button className="copy-btn" onClick={() => navigator.clipboard?.writeText(formData.domain.split('.')[0])}>⎘</button>
                          </span>
                          <span className="dns-val">
                            <code>{KRYVLAYER_CNAME}</code>
                            <button className="copy-btn" onClick={() => navigator.clipboard?.writeText(KRYVLAYER_CNAME)}>⎘</button>
                          </span>
                          <span className="dns-val"><code>3600</code></span>
                        </div>
                      ) : (
                        <div className="dns-row">
                          <span className="dns-val-type">A</span>
                          <span className="dns-val">
                            <code>@</code>
                          </span>
                          <span className="dns-val">
                            <code>{KRYVLAYER_IP}</code>
                            <button className="copy-btn" onClick={() => navigator.clipboard?.writeText(KRYVLAYER_IP)}>⎘</button>
                          </span>
                          <span className="dns-val"><code>3600</code></span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="dns-steps">
                    <p className="dns-steps-title">📋 Step-by-step:</p>
                    <ol>
                      <li>Log into your domain provider (GoDaddy, Cloudflare, Namecheap, etc.)</li>
                      <li>Go to <strong>DNS Settings</strong> or <strong>DNS Management</strong></li>
                      <li>Click <strong>Add Record</strong></li>
                      <li>Set Type to <strong>{isSubdomain ? 'CNAME' : 'A'}</strong></li>
                      <li>Set Name to <strong>{isSubdomain ? formData.domain.split('.')[0] : '@'}</strong></li>
                      <li>Set Value to <strong>{isSubdomain ? KRYVLAYER_CNAME : KRYVLAYER_IP}</strong></li>
                      <li>Save. DNS updates in 1–30 minutes.</li>
                    </ol>
                  </div>

                  <div className="dns-footer-btns">
                    <button className="btn-ghost" onClick={() => setAddStep(1)}>← Back</button>
                    <button className="btn-primary" onClick={() => setAddStep(3)}>
                      I've Added the Record →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Verify */}
              {addStep === 3 && (
                <div className="form-card">
                  <h2 className="form-title">Verify DNS Connection</h2>
                  <p className="form-sub">We'll check if your domain is pointing to KRYVLayer</p>

                  <div className="verify-domain-display">
                    <span className="domain-chip">{formData.domain}</span>
                  </div>

                  {verifyStatus === null && (
                    <button className="btn-primary btn-full" onClick={checkDNS}>
                      Check DNS Connection
                    </button>
                  )}

                  {verifyStatus === 'checking' && (
                    <div className="verify-checking">
                      <div className="spin" />
                      <span>Checking DNS records...</span>
                    </div>
                  )}

                  {verifyStatus === 'valid' && (
                    <div className="verify-success">
                      <div className="verify-icon">✅</div>
                      <h3>Domain Connected!</h3>
                      <p>Your domain is now pointing to KRYVLayer</p>
                      <button className="btn-primary btn-full" onClick={proceedAfterDNS}>
                        Generate Pages Now →
                      </button>
                    </div>
                  )}

                  {verifyStatus === 'invalid' && (
                    <div className="verify-fail">
                      <div className="verify-icon">⚠️</div>
                      <h3>Not Connected Yet</h3>
                      <p>DNS changes can take up to 30 minutes. Check your settings and try again.</p>
                      <div className="dns-footer-btns">
                        <button className="btn-ghost" onClick={() => { setVerifyStatus(null); setAddStep(2); }}>
                          Review DNS Settings
                        </button>
                        <button className="btn-primary" onClick={checkDNS}>Try Again</button>
                      </div>
                      <p className="skip-hint">
                        In a rush?{' '}
                        <button className="link-btn" onClick={proceedAfterDNS}>
                          Skip verification and generate anyway
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: Generating */}
              {addStep === 4 && (
                <div className="form-card center-card">
                  <div className="gen-animation">
                    <div className="gen-ring" />
                    <div className="gen-ring gen-ring-2" />
                    <div className="gen-icon">🤖</div>
                  </div>
                  <h2 className="form-title">Generating Your Pages</h2>
                  <p className="form-sub">NEHIRA AI is analyzing your website and creating unique SEO content for every page.</p>

                  <div className="gen-stages">
                    {['Scanning website', 'Extracting keywords', 'Generating content', 'Creating pages'].map((s, i) => (
                      <div key={i} className="gen-stage">
                        <div className="stage-dot stage-active" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: Done */}
              {addStep === 5 && (
                <div className="form-card">
                  <div className="done-hero">
                    <div className="done-icon">🎉</div>
                    <h2 className="form-title">Pages Are Live!</h2>
                    <p className="form-sub">
                      <strong>{generatedPages.length} landing pages</strong> are now live on <strong>{formData.domain}</strong>
                    </p>
                  </div>

                  <div className="pages-list">
                    {generatedPages.slice(0, 8).map((p, i) => (
                      <a key={i} href={`/${p.slug}`} target="_blank" className="page-item">
                        <span className="page-slug">/{p.slug}</span>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                      </a>
                    ))}
                    {generatedPages.length > 8 && (
                      <div className="page-more">+ {generatedPages.length - 8} more pages</div>
                    )}
                  </div>

                  <button className="btn-primary btn-full" onClick={resetForm}>
                    Back to Dashboard
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ANALYTICS VIEW */}
          {view === 'analytics' && (
            <div>
              <div className="dash-header">
                <div>
                  <h1 className="dash-title">Analytics</h1>
                  <p className="dash-sub">Track your page performance across all domains</p>
                </div>
              </div>

              {!stats ? (
                <div className="empty-state">
                  <div className="spin" style={{ width: 40, height: 40, margin: '0 auto 1rem' }} />
                  <p>Loading stats...</p>
                </div>
              ) : (
                <>
                  <div className="analytics-grid">
                    {[
                      { label: 'Total Pages', value: stats.totalPages || 0, color: '#a78bfa' },
                      { label: 'Total Views', value: stats.totalViews || 0, color: '#f472b6' },
                      { label: 'Domains', value: stats.totalBusinesses || 0, color: '#60a5fa' },
                      { label: 'Avg Views/Page', value: (stats.avgViewsPerPage || 0).toFixed(1), color: '#4ade80' },
                    ].map((s, i) => (
                      <div key={i} className="analytics-card">
                        <span className="analytics-label">{s.label}</span>
                        <span className="analytics-num" style={{ color: s.color }}>{s.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="top-pages-card">
                    <h3 className="top-pages-title">🔥 Top Performing Pages</h3>
                    {(stats.topPages || []).map((p, i) => (
                      <div key={i} className="top-page-row">
                        <div>
                          <span className="tp-rank">#{i + 1}</span>
                          <span className="tp-slug">/{p.slug}</span>
                        </div>
                        <div className="tp-views">
                          <span className="tp-views-num">{p.views}</span>
                          <span className="tp-views-label"> views</span>
                        </div>
                      </div>
                    ))}
                    {(!stats.topPages || stats.topPages.length === 0) && (
                      <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '2rem' }}>No page views yet</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #080812; color: #e2e0f0; }
        button { cursor: pointer; border: none; background: none; font-family: inherit; }
        a { color: inherit; }
        input { font-family: inherit; }
      `}</style>

      <style jsx>{`
        .noise {
          position: fixed; inset: 0; pointer-events: none; z-index: 1; opacity: 0.3;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
        }

        .dash-wrap {
          display: flex; min-height: 100vh; position: relative;
        }

        /* SIDEBAR */
        .sidebar {
          width: 220px; flex-shrink: 0;
          background: rgba(255,255,255,0.02);
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column;
          padding: 1.5rem 1rem; position: sticky; top: 0; height: 100vh;
          z-index: 10;
        }
        .sidebar-logo {
          display: flex; align-items: center; gap: 8px;
          text-decoration: none; font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1.1rem; color: #fff;
          margin-bottom: 2rem; padding: 0 0.5rem;
        }
        .sidebar-logo em { font-style: normal; background: linear-gradient(135deg, #a78bfa, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .logo-img { width: 28px; height: 28px; border-radius: 7px; object-fit: cover; }

        .sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 0.65rem 0.75rem; border-radius: 10px;
          color: rgba(255,255,255,0.5); font-size: 0.9rem; font-weight: 500;
          transition: all .2s; text-align: left;
        }
        .nav-item:hover { color: #fff; background: rgba(255,255,255,0.05); }
        .nav-item.active { color: #fff; background: rgba(124,58,237,0.2); }

        .sidebar-footer { padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.06); }
        .user-pill { font-size: 0.75rem; color: rgba(255,255,255,0.3); padding: 0.5rem; }

        /* MAIN */
        .dash-main {
          flex: 1; padding: 2.5rem 2rem; max-width: 900px;
          position: relative; z-index: 2; overflow-y: auto;
        }
        .dash-header {
          display: flex; justify-content: space-between;
          align-items: flex-start; flex-wrap: wrap; gap: 1rem;
          margin-bottom: 2rem;
        }
        .dash-title { font-family: 'Syne', sans-serif; font-size: 1.75rem; font-weight: 800; color: #fff; margin-bottom: 0.25rem; }
        .dash-sub { color: rgba(255,255,255,0.4); font-size: 0.9rem; }
        .back-btn { color: rgba(255,255,255,0.4); font-size: 0.85rem; margin-bottom: 0.5rem; display: block; }
        .back-btn:hover { color: #fff; }

        /* STEPS PROGRESS */
        .steps-progress {
          display: flex; align-items: center; gap: 0;
        }
        .prog-step {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.75rem; color: rgba(255,255,255,0.3);
        }
        .prog-step:not(:last-child)::after {
          content: '—'; margin: 0 8px; color: rgba(255,255,255,0.15);
        }
        .prog-step.current { color: #a78bfa; }
        .prog-step.done { color: #4ade80; }
        .prog-dot {
          width: 22px; height: 22px; border-radius: 50%;
          background: rgba(255,255,255,0.08); display: flex;
          align-items: center; justify-content: center; font-size: 0.7rem;
        }
        .prog-step.current .prog-dot { background: rgba(124,58,237,0.4); color: #a78bfa; }
        .prog-step.done .prog-dot { background: rgba(74,222,128,0.2); color: #4ade80; }
        .prog-label { display: none; }
        @media (min-width: 600px) { .prog-label { display: inline; } }

        /* EMPTY STATE */
        .empty-state {
          text-align: center; padding: 5rem 2rem;
        }
        .empty-icon { font-size: 3rem; margin-bottom: 1.5rem; }
        .empty-state h2 { font-family: 'Syne', sans-serif; font-size: 1.5rem; color: #fff; margin-bottom: 0.75rem; }
        .empty-state p { color: rgba(255,255,255,0.4); margin-bottom: 2rem; }

        /* DOMAINS GRID */
        .domains-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
        .domain-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 1.5rem;
          transition: border-color .2s;
        }
        .domain-card:hover { border-color: rgba(167,139,250,0.3); }
        .domain-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; }
        .domain-name { font-family: 'Syne', sans-serif; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .domain-url { font-size: 0.8rem; color: #a78bfa; font-family: monospace; }
        .badge-live { padding: 3px 10px; background: rgba(74,222,128,0.15); color: #4ade80; border-radius: 100px; font-size: 0.7rem; font-weight: 600; }
        .domain-stats { display: flex; gap: 2rem; margin-bottom: 1.25rem; }
        .dstat-num { display: block; font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; color: #fff; }
        .dstat-label { font-size: 0.75rem; color: rgba(255,255,255,0.35); }
        .domain-link { display: block; text-align: center; padding: 0.6rem; background: rgba(124,58,237,0.1); color: #a78bfa; border-radius: 10px; font-size: 0.85rem; font-weight: 600; text-decoration: none; transition: background .2s; }
        .domain-link:hover { background: rgba(124,58,237,0.2); }

        /* FORM CARD */
        .form-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 2.5rem;
          max-width: 640px;
        }
        .center-card { text-align: center; }
        .form-title { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; }
        .form-sub { color: rgba(255,255,255,0.4); font-size: 0.9rem; margin-bottom: 2rem; line-height: 1.6; }

        .form-fields { display: flex; flex-direction: column; gap: 1.25rem; }
        .field { display: flex; flex-direction: column; gap: 0.5rem; }
        .field label { font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.7); }
        .field input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; padding: 0.875rem 1rem;
          color: #fff; font-size: 0.95rem; outline: none;
          transition: border-color .2s;
        }
        .field input:focus { border-color: #a78bfa; }
        .field-hint { font-size: 0.78rem; color: rgba(255,255,255,0.3); }

        /* DNS CARD */
        .dns-card {
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(167,139,250,0.3);
          border-radius: 16px; overflow: hidden; margin-bottom: 1.5rem;
        }
        .dns-header {
          padding: 1rem 1.25rem;
          background: rgba(124,58,237,0.1);
          border-bottom: 1px solid rgba(167,139,250,0.2);
          display: flex; justify-content: space-between; align-items: center;
        }
        .dns-badge { font-size: 0.8rem; font-weight: 700; color: #c4b5fd; letter-spacing: 0.05em; text-transform: uppercase; }
        .dns-type-badge { background: rgba(167,139,250,0.2); color: #a78bfa; padding: 3px 10px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; }
        .dns-table { padding: 0.75rem 0; }
        .dns-row { display: grid; grid-template-columns: 80px 1fr 1.5fr 80px; gap: 0; padding: 0.75rem 1.25rem; font-size: 0.85rem; }
        .dns-row-head { color: rgba(255,255,255,0.3); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .dns-val { display: flex; align-items: center; gap: 6px; color: #fff; }
        .dns-val-type { font-weight: 700; color: #a78bfa; }
        code { background: rgba(255,255,255,0.08); padding: 2px 8px; border-radius: 6px; font-family: monospace; font-size: 0.85rem; }
        .copy-btn { padding: 2px 6px; background: rgba(255,255,255,0.06); border-radius: 6px; color: rgba(255,255,255,0.5); font-size: 0.8rem; transition: all .2s; }
        .copy-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }

        .dns-steps {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px; padding: 1.25rem; margin-bottom: 1.5rem;
        }
        .dns-steps-title { font-weight: 700; color: rgba(255,255,255,0.7); margin-bottom: 0.75rem; font-size: 0.9rem; }
        .dns-steps ol { padding-left: 1.5rem; color: rgba(255,255,255,0.5); font-size: 0.875rem; line-height: 2; }
        .dns-steps li strong { color: rgba(255,255,255,0.8); }
        .dns-footer-btns { display: flex; gap: 1rem; flex-wrap: wrap; }

        /* VERIFY */
        .verify-domain-display { text-align: center; padding: 1.5rem 0 2rem; }
        .domain-chip {
          font-family: monospace; font-size: 1.1rem;
          background: rgba(124,58,237,0.15); border: 1px solid rgba(167,139,250,0.3);
          padding: 8px 20px; border-radius: 100px; color: #c4b5fd;
        }
        .verify-checking { display: flex; align-items: center; gap: 12px; justify-content: center; padding: 1.5rem; color: rgba(255,255,255,0.5); }
        .verify-success, .verify-fail { text-align: center; padding: 1.5rem 0; }
        .verify-icon { font-size: 2.5rem; margin-bottom: 1rem; }
        .verify-success h3 { font-family: 'Syne', sans-serif; font-size: 1.25rem; color: #4ade80; margin-bottom: 0.5rem; }
        .verify-fail h3 { font-family: 'Syne', sans-serif; font-size: 1.25rem; color: #fbbf24; margin-bottom: 0.5rem; }
        .verify-success p, .verify-fail p { color: rgba(255,255,255,0.4); margin-bottom: 1.5rem; font-size: 0.9rem; }
        .verify-fail .dns-footer-btns { justify-content: center; }
        .skip-hint { margin-top: 1rem; font-size: 0.8rem; color: rgba(255,255,255,0.3); }
        .link-btn { color: #a78bfa; text-decoration: underline; font-size: inherit; }

        /* GENERATING */
        .gen-animation {
          position: relative; width: 100px; height: 100px;
          margin: 0 auto 2rem; display: flex; align-items: center; justify-content: center;
        }
        .gen-ring {
          position: absolute; inset: 0;
          border: 2px solid transparent;
          border-top-color: #a78bfa; border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .gen-ring-2 {
          inset: 10px; border-top-color: #f472b6;
          animation-duration: 0.7s; animation-direction: reverse;
        }
        .gen-icon { font-size: 2rem; position: relative; z-index: 1; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .gen-stages { margin-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem; text-align: left; max-width: 280px; margin: 2rem auto 0; }
        .gen-stage { display: flex; align-items: center; gap: 10px; color: rgba(255,255,255,0.5); font-size: 0.875rem; }
        .stage-dot { width: 8px; height: 8px; border-radius: 50%; background: #a78bfa; animation: pulse 1.5s ease-in-out infinite; flex-shrink: 0; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }

        /* DONE */
        .done-hero { text-align: center; margin-bottom: 2rem; }
        .done-icon { font-size: 3rem; margin-bottom: 1rem; }
        .pages-list { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; max-height: 320px; overflow-y: auto; }
        .page-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; text-decoration: none; color: rgba(255,255,255,0.6); font-size: 0.85rem; transition: all .2s; }
        .page-item:hover { border-color: rgba(167,139,250,0.4); color: #fff; }
        .page-slug { font-family: monospace; color: #a78bfa; }
        .page-more { text-align: center; color: rgba(255,255,255,0.3); font-size: 0.85rem; padding: 0.5rem; }

        /* ANALYTICS */
        .analytics-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .analytics-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 1.5rem; }
        .analytics-label { display: block; font-size: 0.8rem; color: rgba(255,255,255,0.4); margin-bottom: 0.5rem; }
        .analytics-num { display: block; font-family: 'Syne', sans-serif; font-size: 2.25rem; font-weight: 800; }

        .top-pages-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden; }
        .top-pages-title { padding: 1.25rem 1.5rem; font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .top-page-row { display: flex; justify-content: space-between; align-items: center; padding: 0.875rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .tp-rank { color: rgba(255,255,255,0.2); font-size: 0.85rem; margin-right: 0.75rem; }
        .tp-slug { font-family: monospace; font-size: 0.875rem; color: rgba(255,255,255,0.6); }
        .tp-views-num { font-weight: 700; color: #4ade80; }
        .tp-views-label { color: rgba(255,255,255,0.3); font-size: 0.8rem; }

        /* SHARED */
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #7c3aed, #db2777);
          border-radius: 12px; color: #fff; font-weight: 700;
          font-size: 0.9rem; text-decoration: none;
          transition: transform .2s, box-shadow .2s;
          box-shadow: 0 0 20px rgba(124,58,237,0.3);
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 0 30px rgba(124,58,237,0.45); }
        .btn-full { width: 100%; justify-content: center; }
        .btn-ghost {
          display: inline-flex; align-items: center;
          padding: 0.75rem 1.5rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; color: rgba(255,255,255,0.7); font-weight: 600;
          font-size: 0.9rem; transition: all .2s;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.08); }
        .spin { border: 2px solid rgba(255,255,255,0.1); border-top-color: #a78bfa; border-radius: 50%; animation: spin 0.8s linear infinite; }

        @media (max-width: 640px) {
          .sidebar { display: none; }
          .dash-main { padding: 1.25rem 1rem; }
          .form-card { padding: 1.5rem; }
          .dns-row { grid-template-columns: 70px 1fr 1fr; }
          .dns-row > span:last-child { display: none; }
          .steps-progress { display: none; }
        }
      `}</style>
    </>
  )
}
