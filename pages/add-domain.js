import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Globe, CheckCircle, AlertCircle, ArrowRight, Copy, Check, Loader } from 'lucide-react'

const S = {
  page: { minHeight: '100vh', background: '#050505', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' },
  card: { width: '100%', maxWidth: 560, background: 'rgba(255,255,255,0.04)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '36px 40px' },
  label: { display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(237,237,237,0.7)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' },
  input: { width: '100%', padding: '11px 14px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, fontSize: 14, outline: 'none', color: '#ededed', background: 'rgba(255,255,255,0.04)', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '13px', background: '#6366f1', color: '#050505', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 20 },
  step: (active) => ({ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', opacity: active ? 1 : 0.4 }),
}

export default function AddDomain() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ businessName: '', websiteUrl: '', domain: '' })
  const [verifyStatus, setVerifyStatus] = useState(null)
  const [pages, setPages] = useState([])
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(null)
  const [generating, setGenerating] = useState(false)

  const CNAME = 'cname.kryvlayer.app'
  const IP = '76.76.21.21'
  const isSubdomain = form.domain.split('.').length > 2

  const copy = (text, key) => { navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 2000) }

  async function handleStep1(e) {
    e.preventDefault()
    if (!form.businessName || !form.websiteUrl || !form.domain) { setError('All fields are required'); return }
    setError(''); setStep(2)
  }

  async function checkDNS() {
    setVerifyStatus('checking')
    try {
      const res = await fetch('/api/domains/verify-dns', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ domain: form.domain }) })
      const data = await res.json()
      setVerifyStatus(data.verified ? 'verified' : 'failed')
      if (data.verified) setStep(3)
    } catch { setVerifyStatus('failed') }
  }

  async function generate() {
    setGenerating(true)
    try {
      const res = await fetch('/api/domains/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ businessName: form.businessName, websiteUrl: form.websiteUrl, domain: form.domain, userId: '1' }) })
      const data = await res.json()
      if (data.success) { setPages(data.pages || []); setStep(4) }
      else setError(data.error || 'Generation failed')
    } catch (e) { setError(e.message) }
    setGenerating(false)
  }

  return (
    <>
      <Head><title>Add Domain — KRYVLayer</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" /></Head>
      <div style={S.page}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <Link href="/dashboard" style={{ fontSize: 13, color: 'rgba(237,237,237,0.4)', textDecoration: 'none' }}>← Back to Dashboard</Link>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#ededed', marginTop: 12, letterSpacing: '-0.02em' }}>Add a Domain</h1>
          <p style={{ fontSize: 14, color: 'rgba(237,237,237,0.25)', marginTop: 6 }}>Connect your domain and generate thousands of SEO pages automatically.</p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 28, justifyContent: 'center' }}>
          {['Details', 'DNS Setup', 'Verify', 'Done'].map((s, i) => (
            <div key={s} style={S.step(step === i + 1)}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: step > i + 1 ? '#4f46e5' : step === i + 1 ? '#4f46e5' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {step > i + 1 ? <CheckCircle size={14} color="#fff" /> : <span style={{ fontSize: 11, fontWeight: 700, color: step === i + 1 ? '#fff' : '#9ca3af' }}>{i + 1}</span>}
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: step === i + 1 ? '#4f46e5' : '#9ca3af' }}>{s}</span>
            </div>
          ))}
        </div>

        <div style={S.card}>
          {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', color: '#fca5a5', fontSize: 13, marginBottom: 20 }}>{error}</div>}

          {/* Step 1 — Details */}
          {step === 1 && (
            <form onSubmit={handleStep1}>
              <div style={{ marginBottom: 16 }}>
                <label style={S.label}>Business Name</label>
                <input style={S.input} placeholder="e.g. Acme Corp" value={form.businessName} onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={S.label}>Website URL</label>
                <input style={S.input} placeholder="https://acmecorp.com" value={form.websiteUrl} onChange={e => setForm(f => ({ ...f, websiteUrl: e.target.value }))} />
              </div>
              <div style={{ marginBottom: 4 }}>
                <label style={S.label}>SEO Domain (where pages will live)</label>
                <input style={S.input} placeholder="seo.acmecorp.com" value={form.domain} onChange={e => setForm(f => ({ ...f, domain: e.target.value }))} />
                <p style={{ fontSize: 11, color: 'rgba(237,237,237,0.25)', marginTop: 6 }}>Use a subdomain like seo.yourdomain.com for best results.</p>
              </div>
              <button type="submit" style={S.btn}>Continue <ArrowRight size={14} style={{ display: 'inline' }} /></button>
            </form>
          )}

          {/* Step 2 — DNS */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#ededed', marginBottom: 6 }}>Configure DNS</h2>
              <p style={{ fontSize: 13, color: 'rgba(237,237,237,0.4)', marginBottom: 20 }}>Add this DNS record in your domain registrar (Cloudflare, Namecheap, etc.)</p>
              <div style={{ background: '#050505', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 18, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(237,237,237,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>DNS Record</span>
                  <span style={{ fontSize: 11, background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>{isSubdomain ? 'CNAME' : 'A Record'}</span>
                </div>
                {[
                  { label: 'Type', value: isSubdomain ? 'CNAME' : 'A' },
                  { label: 'Name / Host', value: form.domain.split('.')[0] },
                  { label: 'Value / Points to', value: isSubdomain ? CNAME : IP },
                  { label: 'TTL', value: 'Auto' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: 12, color: 'rgba(237,237,237,0.25)', fontWeight: 500 }}>{row.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#ededed', fontWeight: 600 }}>{row.value}</span>
                      <button onClick={() => copy(row.value, row.label)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                        {copied === row.label ? <Check size={12} color="#4f46e5" /> : <Copy size={12} color="#9ca3af" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={checkDNS} disabled={verifyStatus === 'checking'} style={{ ...S.btn, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {verifyStatus === 'checking' ? <><Loader size={14} className="animate-spin" /> Checking DNS...</> : 'Verify DNS →'}
              </button>
              {verifyStatus === 'failed' && <p style={{ color: '#fca5a5', fontSize: 12, textAlign: 'center', marginTop: 10 }}>DNS not verified yet. DNS propagation can take up to 48h. Try again in a few minutes.</p>}
            </div>
          )}

          {/* Step 3 — Verified, Generate */}
          {step === 3 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#f0fdf4', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle size={28} color="#16a34a" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#ededed', marginBottom: 8 }}>DNS Verified!</h2>
              <p style={{ fontSize: 13, color: 'rgba(237,237,237,0.4)', marginBottom: 28 }}>Your domain is pointing correctly. Now let NEHIRA AI generate your first batch of SEO pages.</p>
              <button onClick={generate} disabled={generating} style={{ ...S.btn, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {generating ? <><Loader size={14} /> Generating 100 pages...</> : '⚡ Generate 100 Pages Now'}
              </button>
            </div>
          )}

          {/* Step 4 — Done */}
          {step === 4 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#ededed', marginBottom: 8 }}>{pages.length || 100} pages live!</h2>
              <p style={{ fontSize: 13, color: 'rgba(237,237,237,0.4)', marginBottom: 28 }}>Your SEO pages are generating. They will be indexable within minutes.</p>
              <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 24px', background: '#6366f1', borderRadius: 12, color: '#050505', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>
                View in Dashboard →
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
