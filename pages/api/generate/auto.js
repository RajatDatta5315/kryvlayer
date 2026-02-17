import { sql } from '@vercel/postgres'

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
  } catch (e) {
    return null
  }
}

function slug(keyword, city) {
  return `${keyword}-${city}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 80)
}

// Full premium HTML landing page template
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
.logo-text span{background:linear-gradient(135deg,#a78bfa,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.badge{display:inline-block;padding:6px 16px;background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.3);border-radius:100px;font-size:0.78rem;color:#c4b5fd;font-weight:600;letter-spacing:0.05em;margin-bottom:1.5rem}
h1{font-size:clamp(2rem,5vw,3.5rem);font-weight:800;line-height:1.1;color:#fff;margin-bottom:1.25rem;letter-spacing:-0.02em}
h1 .accent{background:linear-gradient(135deg,#a78bfa,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero-sub{font-size:1.15rem;color:rgba(255,255,255,0.55);max-width:600px;margin:0 auto 2.5rem;line-height:1.7}
.cta-row{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:8px;padding:0.875rem 2rem;border-radius:12px;font-weight:700;font-size:1rem;text-decoration:none;transition:all .2s}
.btn-primary{background:linear-gradient(135deg,#7c3aed,#db2777);color:#fff;box-shadow:0 0 30px rgba(124,58,237,0.3)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 0 50px rgba(124,58,237,0.5)}
.btn-ghost{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.7)}
.btn-ghost:hover{background:rgba(255,255,255,0.08)}
.section{padding:4rem 1.5rem}
.container{max-width:900px;margin:0 auto}
.section-label{font-size:0.75rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#a78bfa;margin-bottom:0.75rem}
.section-title{font-size:clamp(1.5rem,3vw,2.25rem);font-weight:800;color:#fff;margin-bottom:1rem;line-height:1.2}
.section-sub{color:rgba(255,255,255,0.45);line-height:1.8;font-size:1rem;max-width:700px}
.content-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;margin-top:2.5rem}
.content-card{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:18px;padding:1.75rem;transition:all .3s}
.content-card:hover{border-color:rgba(167,139,250,0.3);background:rgba(124,58,237,0.08)}
.card-icon{font-size:2rem;margin-bottom:1rem}
.card-title{font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:0.6rem}
.card-body{color:rgba(255,255,255,0.45);line-height:1.7;font-size:0.9rem}
.main-content{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:20px;padding:2.5rem;margin-top:2rem;line-height:1.9;color:rgba(255,255,255,0.65);font-size:1rem;white-space:pre-wrap}
.stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin:3rem 0}
.stat{text-align:center;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1.5rem}
.stat-num{font-size:2rem;font-weight:800;background:linear-gradient(135deg,#a78bfa,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;display:block}
.stat-label{font-size:0.8rem;color:rgba(255,255,255,0.35);margin-top:4px}
.cta-section{background:linear-gradient(135deg,#1a0535,#0d1b3e);border:1px solid rgba(167,139,250,0.2);border-radius:24px;padding:3rem;text-align:center;margin-top:3rem}
.cta-title{font-size:2rem;font-weight:800;color:#fff;margin-bottom:0.75rem}
.cta-sub{color:rgba(255,255,255,0.45);margin-bottom:2rem}
footer{border-top:1px solid rgba(255,255,255,0.06);padding:2rem 1.5rem;text-align:center;color:rgba(255,255,255,0.25);font-size:0.85rem}
@media(max-width:600px){.stats-row{grid-template-columns:1fr 1fr}.cta-row{flex-direction:column;align-items:center}.section{padding:2.5rem 1rem}}
</style>
</head>
<body>
<div class="hero">
  <div class="container">
    <a href="/" class="logo"><span class="logo-text">KRYV<span>Layer</span></span></a>
    <div class="badge">${city} • ${industry}</div>
    <h1>${keyword} in <span class="accent">${city}</span></h1>
    <p class="hero-sub">Discover how ${businessName} is transforming ${keyword} for businesses in ${city}. Purpose-built solutions that scale with you.</p>
    <div class="cta-row">
      <a href="${websiteUrl || '/'}" class="btn btn-primary">Get Started Free →</a>
      <a href="${websiteUrl || '/'}" class="btn btn-ghost">Learn More</a>
    </div>
  </div>
</div>

<section class="section">
  <div class="container">
    <p class="section-label">Why ${city} Businesses Choose Us</p>
    <h2 class="section-title">${businessName} for ${keyword}</h2>
    <p class="section-sub">${description || `We help ${city} businesses succeed with industry-leading ${keyword} solutions.`}</p>

    <div class="stats-row">
      <div class="stat"><span class="stat-num">500+</span><span class="stat-label">Businesses in ${city}</span></div>
      <div class="stat"><span class="stat-num">99%</span><span class="stat-label">Uptime Guaranteed</span></div>
      <div class="stat"><span class="stat-num">24/7</span><span class="stat-label">Support Available</span></div>
    </div>

    <div class="main-content">${aiContent}</div>

    <div class="content-grid">
      <div class="content-card"><div class="card-icon">⚡</div><div class="card-title">Fast Setup</div><div class="card-body">Get your ${keyword} solution live in ${city} within minutes. No technical expertise required.</div></div>
      <div class="content-card"><div class="card-icon">🔒</div><div class="card-title">Secure & Reliable</div><div class="card-body">Enterprise-grade security trusted by hundreds of ${city} businesses.</div></div>
      <div class="content-card"><div class="card-icon">📈</div><div class="card-title">Scalable</div><div class="card-body">Grows with your ${city} business from startup to enterprise without friction.</div></div>
      <div class="content-card"><div class="card-icon">🤖</div><div class="card-title">AI-Powered</div><div class="card-body">Leverage cutting-edge AI to automate your ${keyword} workflows in ${city}.</div></div>
    </div>

    <div class="cta-section">
      <h2 class="cta-title">Ready to transform your ${keyword}?</h2>
      <p class="cta-sub">Join ${city} businesses already using ${businessName}</p>
      <a href="${websiteUrl || '/'}" class="btn btn-primary">Start Free Trial →</a>
    </div>
  </div>
</section>

<footer>© 2026 ${businessName}. ${keyword} solutions for ${city} businesses.</footer>
</body>
</html>`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  let domainId
  try { domainId = req.body?.domainId } catch { return res.status(400).json({ error: 'Invalid body' }) }
  if (!domainId) return res.status(400).json({ error: 'domainId required' })

  try {
    await sql`CREATE TABLE IF NOT EXISTS domains (
      id SERIAL PRIMARY KEY, user_id TEXT, domain TEXT,
      website_url TEXT, business_name TEXT, industry TEXT, description TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )`

    await sql`CREATE TABLE IF NOT EXISTS pages (
      id SERIAL PRIMARY KEY, domain_id INTEGER, slug TEXT NOT NULL,
      title TEXT, meta_description TEXT, content TEXT, content_type TEXT DEFAULT 'html',
      views INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(domain_id, slug)
    )`

    const domResult = await sql`SELECT * FROM domains WHERE id = ${domainId} LIMIT 1`
    if (!domResult.rows.length) return res.status(404).json({ error: 'Domain not found' })

    const domain = domResult.rows[0]
    const businessName = domain.business_name || 'Our Platform'
    const websiteUrl = domain.website_url || ''
    const industry = domain.industry || 'Software'
    const description = domain.description || ''

    // Get keywords/cities from NEHIRA by analyzing the real website
    let keywords = []
    let cities = []

    try {
      const analysisRes = await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/analyze/website`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteUrl })
      })
      const analysisData = await analysisRes.json()
      keywords = analysisData.keywords || []
      cities = analysisData.cities || []
    } catch {}

    // Fallback
    if (keywords.length === 0) keywords = ['crm software','project management','business automation','saas platform','workflow tools','analytics dashboard','customer management','invoice software','team collaboration','marketing tools']
    if (cities.length === 0) cities = ['London','New York','Toronto','Singapore','Dubai','Berlin','Sydney','Mumbai','Paris','Tokyo']

    const generatedPages = []
    const MAX_PAGES = 100

    // Generate ALL combinations
    for (const keyword of keywords) {
      for (const city of cities) {
        if (generatedPages.length >= MAX_PAGES) break

        const pageSlug = slug(keyword, city)
        const title = `${keyword} in ${city} | ${businessName}`
        const metaDescription = `Looking for ${keyword} in ${city}? ${businessName} offers professional ${industry} solutions. Start free today.`

        // Generate UNIQUE AI content for EVERY page
        const contentPrompt = `You are a copywriter for ${businessName}, a ${industry} company.

Write a compelling 300-word landing page body for "${keyword}" services specifically for businesses in ${city}.

Include:
- An engaging opening about the ${city} market
- 3 specific benefits for ${city} businesses
- Real pain points ${keyword} solves
- A compelling closing with urgency

Be specific to ${city}'s business culture. Do NOT be generic. Plain text only, no HTML tags.`

        let aiContent = `${businessName} brings powerful ${keyword} solutions to businesses in ${city}. 

In today's competitive ${city} market, businesses need tools that work as hard as they do. Our ${keyword} platform is specifically designed for the unique challenges facing ${city} businesses — from scaling operations to managing teams across multiple locations.

What makes us different for ${city}:
• Deep understanding of the ${city} business landscape
• Localized support and compliance built-in  
• Integration with tools ${city} businesses already use
• Pricing designed for ${city} market conditions

Join hundreds of ${city} businesses who have already transformed their ${keyword} workflows with ${businessName}. The results speak for themselves — faster growth, fewer headaches, and a platform that actually scales.

Ready to see what's possible? Start your free trial today and discover why ${city}'s fastest-growing businesses choose ${businessName} for their ${keyword} needs.`

        const generated = await callNEHIRA(contentPrompt)
        if (generated && generated.length > 100) aiContent = generated

        // Build full HTML page
        const fullHtmlPage = buildLandingPageHTML(keyword, city, businessName, websiteUrl, industry, aiContent, description)

        try {
          await sql`
            INSERT INTO pages (domain_id, slug, title, meta_description, content, content_type)
            VALUES (${domainId}, ${pageSlug}, ${title}, ${metaDescription}, ${fullHtmlPage}, 'html')
            ON CONFLICT (domain_id, slug) DO UPDATE SET
              content = EXCLUDED.content,
              title = EXCLUDED.title
          `
          generatedPages.push({ slug: pageSlug, title })
        } catch (insertErr) {
          console.error('Insert:', insertErr.message)
        }
      }
      if (generatedPages.length >= MAX_PAGES) break
    }

    return res.status(200).json({
      success: true,
      count: generatedPages.length,
      pages: generatedPages
    })

  } catch (error) {
    console.error('Generate error:', error)
    return res.status(500).json({ success: false, error: error.message })
  }
}
