import { useState } from 'react'
import Head from 'next/head'
import GenerationProgress from '../components/GenerationProgress'

const KRYVLAYER_IP = '76.76.21.21'
const KRYVLAYER_CNAME = 'cname.kryvlayer.app'

export default function AddDomain() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ businessName: '', websiteUrl: '', domain: '' })
  const [verifyStatus, setVerifyStatus] = useState(null)
  const [pages, setPages] = useState([])
  const [error, setError] = useState('')

  const isSubdomain = form.domain.split('.').length > 2

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.businessName || !form.websiteUrl || !form.domain) {
      setError('All fields required')
      return
    }
    setStep(2)
  }

  async function checkDNS() {
    setVerifyStatus('checking')
    try {
      const res = await fetch('/api/domains/verify-dns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: form.domain })
      })
      const data = await res.json()
      setVerifyStatus(data.connected ? 'valid' : 'invalid')
    } catch { setVerifyStatus('invalid') }
  }

  async function generate() {
    setStep(4)
    try {
      const domainRes = await fetch('/api/domains/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: '1', ...form })
      })
      const domainData = await domainRes.json()
      if (!domainData.success) throw new Error(domainData.error || 'Failed to create domain')

      const genRes = await fetch('/api/generate/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainId: domainData.domainId })
      })
      const genData = await genRes.json()
      
      if (!genData.success) throw new Error(genData.error || 'Generation failed')
      
      setPages(genData.pages || [])
    } catch (err) {
      console.error('Generation error:', err)
      setError(err.message)
      setStep(2)
    }
  }

  return (
    <>
      <Head>
        <title>Add Domain — KRYVLayer</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <a href="/dashboard" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6, marginBottom: '2rem' }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Dashboard
          </a>

          {error && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, color: '#ef4444' }}>
              {error}
            </div>
          )}

          <h1 style={{ fontFamily: 'Syne', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Add Domain</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>Step {step} of 5</p>

          {step === 1 && (
            <form onSubmit={handleSubmit} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 16, padding: '2rem' }}>
              {[
                { label: 'Business Name', key: 'businessName', type: 'text', placeholder: 'Acme Inc.' },
                { label: 'Website URL', key: 'websiteUrl', type: 'url', placeholder: 'https://mycompany.com', hint: 'NEHIRA will analyze this URL' },
                { label: 'Domain for Pages', key: 'domain', type: 'text', placeholder: 'seo.mycompany.com', hint: 'Where your landing pages will live' }
              ].map(f => (
                <div key={f.key} style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{f.label}</label>
                  <input type={f.type} required placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.875rem 1rem', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                  {f.hint && <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.4rem' }}>{f.hint}</p>}
                </div>
              ))}
              <button type="submit" style={{ width: '100%', padding: '0.95rem', background: 'var(--accent-primary)', borderRadius: 10, color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
                Continue →
              </button>
            </form>
          )}

          {step === 2 && (
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 16, padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>DNS Setup</h2>
              <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.75rem 1rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-tertiary)', fontWeight: 600 }}>Type:</span>
                  <code style={{ background: 'var(--bg-tertiary)', padding: '4px 10px', borderRadius: 6, color: 'var(--accent-primary)', fontWeight: 700 }}>
                    {isSubdomain ? 'CNAME' : 'A'}
                  </code>
                  
                  <span style={{ color: 'var(--text-tertiary)', fontWeight: 600 }}>Name:</span>
                  <code style={{ background: 'var(--bg-tertiary)', padding: '4px 10px', borderRadius: 6, color: 'var(--text-primary)' }}>
                    {isSubdomain ? form.domain.split('.')[0] : '@'}
                  </code>
                  
                  <span style={{ color: 'var(--text-tertiary)', fontWeight: 600 }}>Value:</span>
                  <code style={{ background: 'var(--bg-tertiary)', padding: '4px 10px', borderRadius: 6, color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                    {isSubdomain ? KRYVLAYER_CNAME : KRYVLAYER_IP}
                  </code>
                </div>
              </div>

              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Quick Steps:</p>
                <ol style={{ paddingLeft: '1.25rem' }}>
                  <li>Log into your domain registrar</li>
                  <li>Find DNS or Domain Settings</li>
                  <li>Add the record above</li>
                  <li>Wait 1–30 minutes for DNS to update</li>
                </ol>
              </div>

              <button onClick={() => setStep(3)} style={{ width: '100%', padding: '0.95rem', background: 'var(--accent-primary)', borderRadius: 10, color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                I've Added It →
              </button>
            </div>
          )}

          {step === 3 && (
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 16, padding: '2.5rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem' }}>Verify Connection</h2>
              
              <div style={{ marginBottom: '2rem' }}>
                <code style={{ background: 'rgba(99,102,241,0.1)', padding: '10px 20px', borderRadius: 100, color: 'var(--accent-primary)', fontSize: '1rem', fontWeight: 600 }}>
                  {form.domain}
                </code>
              </div>

              {verifyStatus === null && (
                <button onClick={checkDNS} style={{ width: '100%', padding: '0.95rem', background: 'var(--accent-primary)', borderRadius: 10, color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  Check DNS Connection
                </button>
              )}

              {verifyStatus === 'checking' && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '1rem', color: 'var(--text-secondary)' }}>
                  <div style={{ width: 20, height: 20, border: '2px solid var(--border)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Checking DNS records...
                </div>
              )}

              {verifyStatus === 'valid' && (
                <div>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
                  <h3 style={{ color: 'var(--accent-success)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Connected!</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>Domain is pointing to KRYVLayer</p>
                  <button onClick={generate} style={{ width: '100%', padding: '0.95rem', background: 'var(--accent-primary)', borderRadius: 10, color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                    Generate Pages →
                  </button>
                </div>
              )}

              {verifyStatus === 'invalid' && (
                <div>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠</div>
                  <h3 style={{ color: 'var(--accent-warning)', marginBottom: '0.5rem' }}>Not Connected</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>DNS not propagated yet. Check settings or wait.</p>
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                    <button onClick={() => setStep(2)} style={{ flex: 1, padding: '0.875rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}>← Back</button>
                    <button onClick={checkDNS} style={{ flex: 1, padding: '0.875rem', background: 'var(--accent-primary)', borderRadius: 10, color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Try Again</button>
                  </div>
                  <button onClick={generate} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.85rem', textDecoration: 'underline', cursor: 'pointer' }}>
                    Skip & generate anyway
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 4 && <GenerationProgress onComplete={() => setStep(5)} />}

          {step === 5 && (
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 16, padding: '2.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>🎉</div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Pages Are Live!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                <strong style={{ color: 'var(--accent-primary)' }}>{pages.length} pages</strong> generated on <strong>{form.domain}</strong>
              </p>

              <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: '2rem', textAlign: 'left' }}>
                {pages.slice(0, 10).map((p, i) => (
                  <div key={i} style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: '0.5rem', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                    <a href={`https://${form.domain}/${p.slug}`} target="_blank" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
                      /{p.slug} ↗
                    </a>
                  </div>
                ))}
                {pages.length > 10 && <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem', padding: '0.5rem' }}>+ {pages.length - 10} more</p>}
              </div>

              <a href="/dashboard" style={{ display: 'block', padding: '0.95rem', background: 'var(--accent-primary)', borderRadius: 10, color: '#fff', fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
                Back to Dashboard
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
