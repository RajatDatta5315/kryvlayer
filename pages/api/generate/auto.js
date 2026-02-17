import { neon } from '@neondatabase/serverless'

async function callNEHIRA(prompt) {
  try {
    const res = await fetch(process.env.NEHIRA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEHIRA_API_KEY}`
      },
      body: JSON.stringify({ message: prompt })
    })
    if (!res.ok) return null
    const raw = await res.text()
    if (!raw || !raw.trim()) return null
    let data
    try { data = JSON.parse(raw) } catch { return raw }
    return data.response || data.message || data.text || data.content || null
  } catch { return null }
}

function buildSlug(keyword, city) {
  return `${keyword}-${city}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 80)
}

function buildLandingPageHTML(keyword, city, businessName, websiteUrl, industry, aiContent, description) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${keyword} in ${city} | ${businessName}</title>
<meta name="description" content="Find the best ${keyword} in ${city}. ${businessName} offers professional ${industry} solutions tailored for ${city} businesses."/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0a0a14;color:#e8e6f0}
.hero{background:linear-gradient(135deg,#1a0535 0%,#0d1b3e 50%,#0a0a14 100%);padding:5rem 1.5rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06)}
.logo{display:inline-flex;align-items:center;gap:8px;margin-bottom:3rem;text-decoration:none}
.logo-text{font-size:1.25rem;font-weight:800;color:#fff;letter-spacing:-0.02em}
.logo-accent{background:linear-gradient(135deg,#a78bfa,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.badge{display:inline-block;padding:6px 16px;background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.3);border-radius:100px;font-size:0.78rem;color:#c4b5fd;font-weight:600;letter-spacing:0.05em;margin-bottom:1.5rem}
h1{font-size:clamp(2rem,5vw,3.5rem);font-weight:800;line-height:1.1;color:#fff;margin-bottom:1.25rem;letter-spacing:-0.02em}
.accent{background:linear-gradient(135deg,#a78bfa,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero-sub{font-size:1.15rem;color:rgba(255,255,255,0.55);max-width:600px;margin:0 auto 2.5rem;line-height:1.7}
.cta-row{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:8px;padding:0.875rem 2rem;border-radius:12px;font-weight:700;font-size:1rem;text-decoration:none;transition:all .2s}
.btn-primary{background:linear-gradient(135deg,#7c3aed,#db2777);color:#fff;box-shadow:0 0 30px rgba(124,58,237,0.3)}
.btn-ghost{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.7)}
.section{padding:4rem 1.5rem}
.container{max-width:900px;margin:0 auto}
.section-label{font-size:0.75rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#a78bfa;margin-bottom:0.75rem}
.section-title{font-size:clamp(1.5rem,3vw,2.25rem);font-weight:800;color:#fff;margin-bottom:1rem}
.main-content{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:20px;padding:2.5rem;margin-top:2rem;line-height:1.9;color:rgba(255,255,255,0.65);font-size:1rem;white-space:pre-wrap}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.25rem;margin-top:2rem}
.card{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:1.5rem}
.card-icon{font-size:2rem;margin-bottom:0.75rem}
.card-title{font-size:1rem;font-weight:700;color:#fff;margin-bottom:0.5rem}
.card-body{color:rgba(255,255,255,0.4);line-height:1.7;font-size:0.875rem}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin:2.5rem 0}
.stat{text-align:center;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:1.25rem}
.stat-num{font-size:1.75rem;font-weight:800;background:linear-gradient(135deg,#a78bfa,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;display:block}
.stat-label{font-size:0.75rem;color:rgba(255,255,255,0.3);margin-top:4px}
.cta-box{background:linear-gradient(135deg,#1a0535,#0d1b3e);border:1px solid rgba(167,139,250,0.2);border-radius:20px;padding:2.5rem;text-align:center;margin-top:2.5rem}
.cta-title{font-size:1.75rem;font-weight:800;color:#fff;margin-bottom:0.75rem}
.cta-sub{color:rgba(255,255,255,0.4);margin-bottom:1.75rem}
footer{border-top:1px solid rgba(255,255,255,0.06);padding:1.5rem;text-align:center;color:rgba(255,255,255,0.2);font-size:0.8rem}
@media(max-width:600px){.stats{grid-template-columns:1fr 1fr}.cta-row{flex-direction:column;align-items:center}.section{padding:2.5rem 1rem}}
</style>
</head>
<body>
<div class="hero">
  <div class="container">
    <a href="/" class="logo"><span class="logo-text">KRYV<span class="logo-accent">Layer</span></span></a>
    <div class="badge">${city} • ${industry}</div>
    <h1>${keyword} in <span class="accent">${city}</span></h1>
    <p class="hero-sub">${description || `${businessName} provides cutting-edge ${keyword} solutions for ${city} businesses. Trusted, scalable, and built for growth.`}</p>
    <div class="cta-row">
      <a href="${websiteUrl || '/'}" class="btn btn-primary">Get Started Free →</a>
      <a href="${websiteUrl || '/'}" class="btn btn-ghost">Learn More</a>
    </div>
  </div>
</div>
<section class="section">
  <div class="container">
    <p class="section-label">Built for ${city}</p>
    <h2 class="section-title">${businessName} — ${keyword} experts</h2>
    <div class="stats">
      <div class="stat"><span class="stat-num">500+</span><span class="stat-label">${city} Clients</span></div>
      <div class="stat"><span class="stat-num">99.9%</span><span class="stat-label">Uptime</span></div>
      <div class="stat"><span class="stat-num">24/7</span><span class="stat-label">Support</span></div>
    </div>
    <div class="main-content">${aiContent}</div>
    <div class="cards">
      <div class="card"><div class="card-icon">⚡</div><div class="card-title">Instant Setup</div><div class="card-body">Live in minutes. No technical skills needed for ${city} businesses.</div></div>
      <div class="card"><div class="card-icon">🔒</div><div class="card-title">Enterprise Security</div><div class="card-body">Bank-grade encryption trusted by ${city}'s top businesses.</div></div>
      <div class="card"><div class="card-icon">📈</div><div class="card-title">Scales With You</div><div class="card-body">From startup to enterprise — ${businessName} grows with ${city} businesses.</div></div>
      <div class="card"><div class="card-icon">🤖</div><div class="card-title">AI-Powered</div><div class="card-body">Automate your ${keyword} workflows with cutting-edge AI.</div></div>
    </div>
    <div class="cta-box">
      <div class="cta-title">Start your free trial today</div>
      <div class="cta-sub">Join ${city} businesses already using ${businessName}</div>
      <a href="${websiteUrl || '/'}" class="btn btn-primary">Try ${businessName} Free →</a>
    </div>
  </div>
</section>
<footer>© 2026 ${businessName}. ${keyword} solutions for ${city} businesses. Powered by KRYVLayer.</footer>
</body>
</html>`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  let domainId
  try { domainId = req.body?.domainId } catch { return res.status(400).json({ error: 'Invalid body' }) }
  if (!domainId) return res.status(400).json({ error: 'domainId required' })

  try {
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL)

    await sql`CREATE TABLE IF NOT EXISTS domains (
      id SERIAL PRIMARY KEY, user_id TEXT, domain TEXT,
      website_url TEXT, business_name TEXT, industry TEXT, description TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )`

    await sql`CREATE TABLE IF NOT EXISTS pages (
      id SERIAL PRIMARY KEY, domain_id INTEGER, slug TEXT NOT NULL,
      title TEXT, meta_description TEXT, content TEXT,
      content_type TEXT DEFAULT 'html', views INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(), UNIQUE(domain_id, slug)
    )`

    const domResult = await sql`SELECT * FROM domains WHERE id = ${domainId} LIMIT 1`
    if (!domResult.length) return res.status(404).json({ error: 'Domain not found' })

    const domain = domResult[0]
    const businessName = domain.business_name || 'Our Platform'
    const websiteUrl = domain.website_url || ''
    const industry = domain.industry || 'Software'
    const description = domain.description || ''

    // Analyze website with NEHIRA
    let keywords = []
    let cities = []

    const analysisPrompt = `You are an SEO expert. Analyze this business website: ${websiteUrl}

Generate for this SPECIFIC business:
- 20 highly targeted SEO long-tail keywords they should rank for
- 20 target cities relevant to their business
- Their main industry in 2 words

Return ONLY this JSON, no other text:
{"keywords":["kw1","kw2"],"cities":["city1","city2"],"industry":"Industry Name"}`

    const analysisText = await callNEHIRA(analysisPrompt)
    
    if (analysisText) {
      try {
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          if (Array.isArray(parsed.keywords) && parsed.keywords.length > 0) keywords = parsed.keywords
          if (Array.isArray(parsed.cities) && parsed.cities.length > 0) cities = parsed.cities
          if (parsed.industry) {
            await sql`UPDATE domains SET industry = ${parsed.industry} WHERE id = ${domainId}`
          }
        }
      } catch {}
    }

    if (keywords.length === 0) keywords = ['crm software','project management','business automation','saas platform','workflow tools','analytics dashboard','customer management','invoice software','team collaboration','marketing automation']
    if (cities.length === 0) cities = ['London','New York','Toronto','Singapore','Dubai','Berlin','Sydney','Mumbai','Paris','Tokyo']

    const generatedPages = []
    const MAX = 100

    for (const keyword of keywords) {
      for (const city of cities) {
        if (generatedPages.length >= MAX) break

        const pageSlug = buildSlug(keyword, city)
        const title = `${keyword} in ${city} | ${businessName}`
        const metaDesc = `Best ${keyword} in ${city}. ${businessName} provides top-rated ${industry} solutions for ${city} businesses. Free trial available.`

        const contentPrompt = `Write a 250-word landing page body for "${businessName}" — a ${industry} company.
Topic: "${keyword}" services for businesses in ${city}.
Make it unique to ${city}'s market. Include specific local context.
Write 3 paragraphs: problem in ${city}, solution, why ${businessName}.
Plain text only.`

        let aiContent = `In ${city}'s competitive business landscape, finding the right ${keyword} solution can make the difference between growth and stagnation. ${businessName} has been helping ${city} businesses overcome exactly this challenge.

Our ${keyword} platform was built with ${city} businesses in mind. We understand the local market dynamics, compliance requirements, and the unique pressures that ${city} companies face every day. That's why hundreds of ${city} businesses have made ${businessName} their trusted ${industry} partner.

What sets us apart isn't just our technology — it's our commitment to your success in ${city}. With 24/7 support, seamless integrations, and a platform that scales as your ${city} business grows, ${businessName} is the ${keyword} solution you've been looking for. Start your free trial today and see results within 7 days.`

        const generated = await callNEHIRA(contentPrompt)
        if (generated && generated.length > 100) aiContent = generated

        const fullHtml = buildLandingPageHTML(keyword, city, businessName, websiteUrl, industry, aiContent, description)

        try {
          await sql`
            INSERT INTO pages (domain_id, slug, title, meta_description, content, content_type)
            VALUES (${domainId}, ${pageSlug}, ${title}, ${metaDesc}, ${fullHtml}, 'html')
            ON CONFLICT (domain_id, slug) DO UPDATE SET content = EXCLUDED.content, title = EXCLUDED.title
          `
          generatedPages.push({ slug: pageSlug, title })
        } catch (e) {
          console.error('Insert error:', e.message)
        }
      }
      if (generatedPages.length >= MAX) break
    }

    return res.status(200).json({ success: true, count: generatedPages.length, pages: generatedPages })

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
