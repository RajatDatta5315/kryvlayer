import { useState } from 'react'
import Head from 'next/head'

const KRYVLAYER_IP = '76.76.21.21'
const KRYVLAYER_CNAME = 'cname.kryvlayer.app'

export default function AddDomain() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ businessName: '', websiteUrl: '', domain: '' })
  const [verifyStatus, setVerifyStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pages, setPages] = useState([])

  const isSubdomain = form.domain.split('.').length > 2

  async function handleSubmit(e) {
    e.preventDefault()
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
    setLoading(true)
    try {
      const domainRes = await fetch('/api/domains/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: '1', ...form })
      })
      const domainData = await domainRes.json()
      if (!domainData.success) throw new Error(domainData.error)

      const genRes = await fetch('/api/generate/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainId: domainData.domainId })
      })
      const genData = await genRes.json()
      setPages(genData.pages || [])
      setStep(5)
    } catch (err) { alert(err.message); setStep(2) }
    finally { setLoading(false) }
  }

  return (
    <>
      <Head>
        <title>Add Domain — KRYVLayer</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: '100vh', background: '#080812', color: '#e2e0f0', fontFamily: "'DM Sans', sans-serif", padding: '2rem 1rem' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <a href="/dashboard" style={{ color: '#a78bfa', textDecoration: 'none', fontSize: '0.875rem', display: 'block', marginBottom: '2rem' }}>← Dashboard</a>

          <h1 style={{ fontFamily: 'Syne', fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>Add Domain</h1>

          {step === 1 && (
            <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#fff' }}>Business Info</h2>
              {[
                { label: 'Business Name', key: 'businessName', type: 'text', placeholder: 'Acme Inc.' },
                { label: 'Website URL', key: 'websiteUrl', type: 'url', placeholder: 'https://mycompany.com' },
                { label: 'Domain for Pages', key: 'domain', type: 'text', placeholder: 'seo.mycompany.com' }
              ].map(f => (
                <div key={f.key} style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.6)' }}>{f.label}</label>
                  <input type={f.type} required placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '0.875rem', color: '#fff', fontSize: '0.95rem', outline: 'none' }} />
                </div>
              ))}
              <button type="submit" style={{ width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)', borderRadius: 12, color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Continue →</button>
            </form>
          )}

          {step === 2 && (
            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#fff' }}>DNS Setup</h2>
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1.5fr', gap: '1rem', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 700, color: '#a78bfa' }}>{isSubdomain ? 'CNAME' : 'A'}</span>
                  <code style={{ background: 'rgba(255,255,255,0.08)', padding: '4px 8px', borderRadius: 6 }}>{isSubdomain ? form.domain.split('.')[0] : '@'}</code>
                  <code style={{ background: 'rgba(255,255,255,0.08)', padding: '4px 8px', borderRadius: 6 }}>{isSubdomain ? KRYVLAYER_CNAME : KRYVLAYER_IP}</code>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>Add this record in your DNS settings. Updates take 1–30 minutes.</p>
              <button onClick={() => setStep(3)} style={{ width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)', borderRadius: 12, color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>I've Added It →</button>
            </div>
          )}

          {step === 3 && (
            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '2rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem', color: '#fff' }}>Verify Connection</h2>
              {verifyStatus === null && <button onClick={checkDNS} style={{ width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)', borderRadius: 12, color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Check DNS</button>}
              {verifyStatus === 'checking' && <p style={{ color: 'rgba(255,255,255,0.4)' }}>Checking...</p>}
              {verifyStatus === 'valid' && (
                <div>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
                  <h3 style={{ color: '#4ade80', marginBottom: '1.5rem' }}>Connected!</h3>
                  <button onClick={generate} style={{ width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)', borderRadius: 12, color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Generate Pages →</button>
                </div>
              )}
              {verifyStatus === 'invalid' && (
                <div>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Not connected yet</p>
                  <button onClick={checkDNS} style={{ width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)', borderRadius: 12, color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Try Again</button>
                  <button onClick={generate} style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#a78bfa', fontSize: '0.85rem', textDecoration: 'underline', cursor: 'pointer' }}>Skip & generate anyway</button>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🤖</div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>NEHIRA is Working</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)' }}>Generating unique content for every page...</p>
            </div>
          )}

          {step === 5 && (
            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '2rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>Done!</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)' }}>{pages.length} pages are live</p>
              </div>
              <a href="/dashboard" style={{ display: 'block', textAlign: 'center', padding: '0.9rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)', borderRadius: 12, color: '#fff', fontWeight: 700, textDecoration: 'none' }}>Back to Dashboard</a>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
