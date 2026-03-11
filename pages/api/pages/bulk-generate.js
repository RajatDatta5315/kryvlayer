import { neon } from '@neondatabase/serverless'

async function callNEHIRA(prompt) {
  try {
    const apiKey = process.env.GROQ_API_KEY || process.env.NEHIRA_API_KEY
    if (!apiKey) return null
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800
      })
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.choices?.[0]?.message?.content || null
  } catch { return null }
}

function buildSlug(keyword, city) {
  return `${keyword}-${city}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 80)
}

function buildFullHtmlPage(keyword, city, businessName, websiteUrl, industry, content, description) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${keyword} in ${city} | ${businessName}</title>
<meta name="description" content="${description || `Best ${keyword} in ${city}. ${businessName} provides professional ${industry} solutions for ${city} businesses.`}"/>
<meta name="robots" content="index,follow"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0a0a14;color:#e8e6f0}
a{color:inherit;text-decoration:none}
.hero{background:linear-gradient(135deg,#1a0535 0%,#0d1b3e 60%,#0a0a14 100%);padding:5rem 1.5rem 4rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06)}
.nav{display:flex;justify-content:space-between;align-items:center;max-width:1000px;margin:0 auto 3rem}
.logo{font-size:1.2rem;font-weight:800;color:#fff;letter-spacing:-0.02em}
.logo span{background:linear-gradient(135deg,#a78bfa,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.get-started{padding:8px 18px;background:linear-gradient(135deg,#7c3aed,#db2777);border-radius:8px;color:#fff;font-weight:600;font-size:0.85rem}
.badge{display:inline-block;padding:5px 14px;background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.25);border-radius:100px;font-size:0.75rem;color:#c4b5fd;font-weight:600;letter-spacing:0.06em;margin-bottom:1.5rem}
.hero-inner{max-width:800px;margin:0 auto}
h1{font-size:clamp(2rem,5vw,3.5rem);font-weight:800;line-height:1.1;color:#fff;margin-bottom:1.25rem;letter-spacing:-0.02em}
.accent{background:linear-gradient(135deg,#a78bfa,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sub{font-size:1.1rem;color:rgba(255,255,255,0.5);max-width:600px;margin:0 auto 2.5rem;line-height:1.7}
.btns{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:8px;padding:0.875rem 2rem;border-radius:12px;font-weight:700;font-size:0.95rem}
.btn-p{background:linear-gradient(135deg,#7c3aed,#db2777);color:#fff;box-shadow:0 0 25px rgba(124,58,237,0.3)}
.btn-g{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.7)}
.section{padding:4rem 1.5rem}
.container{max-width:900px;margin:0 auto}
.label{font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#a78bfa;margin-bottom:0.75rem}
.title{font-size:clamp(1.5rem,3vw,2.25rem);font-weight:800;color:#fff;margin-bottom:1rem}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin:2.5rem 0}
.stat{text-align:center;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:1.25rem}
.stat-n{font-size:1.75rem;font-weight:800;background:linear-gradient(135deg,#a78bfa,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;display:block}
.stat-l{font-size:0.72rem;color:rgba(255,255,255,0.3);margin-top:4px}
.content-box{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:18px;padding:2.5rem;line-height:1.9;color:rgba(255,255,255,0.6);font-size:1rem;white-space:pre-wrap;margin:2rem 0}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.25rem;margin:2rem 0}
.card{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:1.5rem;transition:border-color .2s}
.card:hover{border-color:rgba(167,139,250,0.3)}
.card-i{font-size:1.75rem;margin-bottom:0.75rem}
.card-t{font-size:0.95rem;font-weight:700;color:#fff;margin-bottom:0.4rem}
.card-b{color:rgba(255,255,255,0.4);line-height:1.65;font-size:0.85rem}
.cta-box{background:linear-gradient(135deg,#1a0535,#0d1b3e);border:1px solid rgba(167,139,250,0.2);border-radius:20px;padding:3rem 2rem;text-align:center;margin-top:2.5rem}
.cta-t{font-size:1.75rem;font-weight:800;color:#fff;margin-bottom:0.75rem}
.cta-s{color:rgba(255,255,255,0.4);margin-bottom:1.75rem;font-size:0.95rem}
.faq{margin-top:2.5rem}
.faq-item{border-bottom:1px solid rgba(255,255,255,0.06);padding:1.25rem 0}
.faq-q{font-weight:700;color:#fff;margin-bottom:0.5rem;font-size:0.95rem}
.faq-a{color:rgba(255,255,255,0.45);font-size:0.875rem;line-height:1.7}
footer{border-top:1px solid rgba(255,255,255,0.06);padding:1.5rem;text-align:center;color:rgba(255,255,255,0.2);font-size:0.8rem;margin-top:2rem}
@media(max-width:600px){.stats{grid-template-columns:1fr 1fr}.btns{flex-direction:column;align-items:center}.section{padding:2.5rem 1rem}.hero{padding:3rem 1rem 2.5rem}}
</style>
</head>
<body>
<div class="hero">
  <div class="nav">
    <div class="logo">KRYV<span>Layer</span></div>
    <a href="${websiteUrl || '/'}" class="get-started">Get Started →</a>
  </div>
  <div class="hero-inner">
    <div class="badge">${city} · ${industry}</div>
    <h1>${keyword} in <span class="accent">${city}</span></h1>
    <p class="sub">${description || `${businessName} offers cutting-edge ${keyword} solutions built specifically for ${city} businesses. Trusted, scalable, and designed to grow with you.`}</p>
    <div class="btns">
      <a href="${websiteUrl || '/'}" class="btn btn-p">Start Free Trial →</a>
      <a href="${websiteUrl || '/'}" class="btn btn-g">Learn More</a>
    </div>
  </div>
</div>

<section class="section">
  <div class="container">
    <p class="label">Why ${city} Businesses Choose Us</p>
    <h2 class="title">${businessName} — ${keyword} for ${city}</h2>
    <div class="stats">
      <div class="stat"><span class="stat-n">500+</span><span class="stat-l">${city} Clients</span></div>
      <div class="stat"><span class="stat-n">99.9%</span><span class="stat-l">Uptime SLA</span></div>
      <div class="stat"><span class="stat-n">24/7</span><span class="stat-l">Support</span></div>
    </div>
    <div class="content-box">${content}</div>
    <div class="cards">
      <div class="card"><div class="card-i">⚡</div><div class="card-t">Instant Setup</div><div class="card-b">Go live in minutes. No technical skills required for ${city} teams.</div></div>
      <div class="card"><div class="card-i">🔒</div><div class="card-t">Bank-Grade Security</div><div class="card-b">Enterprise encryption trusted by ${city}'s fastest growing companies.</div></div>
      <div class="card"><div class="card-i">📈</div><div class="card-t">Scales Infinitely</div><div class="card-b">From 1 to 10,000 users — ${businessName} handles ${city}'s growth.</div></div>
      <div class="card"><div class="card-i">🤖</div><div class="card-t">AI Automation</div><div class="card-b">Let AI handle your ${keyword} workflows so your ${city} team focuses on growth.</div></div>
      <div class="card"><div class="card-i">🔗</div><div class="card-t">100+ Integrations</div><div class="card-b">Connects with every tool your ${city} business already uses.</div></div>
      <div class="card"><div class="card-i">💰</div><div class="card-t">ROI in 30 Days</div><div class="card-b">Most ${city} businesses see measurable ROI within 30 days.</div></div>
    </div>

    <div class="faq">
      <p class="label" style="margin-bottom:1.5rem">Frequently Asked Questions</p>
      <div class="faq-item"><div class="faq-q">Is ${businessName} right for ${city} businesses?</div><div class="faq-a">Absolutely. ${businessName} is used by hundreds of businesses in ${city} ranging from startups to enterprise. Our platform is designed to adapt to your specific market needs.</div></div>
      <div class="faq-item"><div class="faq-q">How quickly can I get started with ${keyword}?</div><div class="faq-a">Setup takes under 10 minutes. Your ${city} team can be fully operational the same day. No technical expertise required.</div></div>
      <div class="faq-item"><div class="faq-q">Do you offer support for ${city} based companies?</div><div class="faq-a">Yes. We offer 24/7 support with dedicated account managers for ${city} businesses on our growth plans.</div></div>
      <div class="faq-item"><div class="faq-q">What makes ${businessName} different from competitors?</div><div class="faq-a">Unlike generic solutions, ${businessName} is built with ${industry} businesses in ${city} in mind. We understand local market dynamics, compliance, and what ${city} businesses actually need.</div></div>
    </div>

    <div class="cta-box">
      <div class="cta-t">Ready to transform your ${keyword}?</div>
      <div class="cta-s">Join ${city} businesses already using ${businessName}. Free trial — no credit card needed.</div>
      <a href="${websiteUrl || '/'}" class="btn btn-p">Try ${businessName} Free →</a>
    </div>
  </div>
</section>

<footer>© 2026 ${businessName}. ${keyword} solutions built for ${city} businesses.</footer>
</body>
</html>`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  let domainId, targetCount
  try {
    domainId = req.body?.domainId
    targetCount = Math.min(parseInt(req.body?.count || 100), 1000)
  } catch {
    return res.status(400).json({ error: 'Invalid body' })
  }
  if (!domainId) return res.status(400).json({ error: 'domainId required' })
  if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
    return res.status(500).json({ error: 'DATABASE_URL not configured. Add it in Vercel → Project → Settings → Environment Variables' })
  }

  try {
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL)

    await sql`CREATE TABLE IF NOT EXISTS domains (id SERIAL PRIMARY KEY, user_id TEXT, domain TEXT, website_url TEXT, business_name TEXT, industry TEXT, description TEXT, created_at TIMESTAMP DEFAULT NOW())`
    await sql`CREATE TABLE IF NOT EXISTS pages (id SERIAL PRIMARY KEY, domain_id INTEGER, slug TEXT NOT NULL, title TEXT, meta_description TEXT, content TEXT, content_type TEXT DEFAULT 'html', views INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT NOW(), UNIQUE(domain_id, slug))`

    const domResult = await sql`SELECT * FROM domains WHERE id = ${domainId} LIMIT 1`
    if (!domResult.length) return res.status(404).json({ error: 'Domain not found' })

    const domain = domResult[0]
    const businessName = domain.business_name || 'Our Platform'
    const websiteUrl = domain.website_url || ''
    const industry = domain.industry || 'Software'
    const description = domain.description || ''

    // Use curated keyword + city defaults (no AI call = no Vercel timeout)
    const keywords = ['crm software','project management','business automation','saas platform','workflow tools','analytics dashboard','customer management','invoice software','team collaboration','marketing automation','hr software','inventory management','sales tracking','customer support','data analytics','reporting tools','task management','time tracking','document management','lead generation','email marketing','social media management','content management','event management','accounting software']
    const cities = ['London','New York','Toronto','Singapore','Dubai','Berlin','Sydney','Mumbai','Paris','Tokyo','Los Angeles','Chicago','San Francisco','Amsterdam','Stockholm','Oslo','Copenhagen','Helsinki','Dublin','Zurich','Vienna','Barcelona','Milan','Madrid','Rome','Warsaw','Prague','Budapest','Lisbon','Athens','Cairo','Nairobi','Lagos','Johannesburg','Cape Town','São Paulo','Buenos Aires','Mexico City','Bogotá','Lima','Manila','Jakarta','Bangkok','Kuala Lumpur','Ho Chi Minh City']

        const generatedPages = []
    let count = 0

    for (const keyword of keywords) {
      for (const city of cities) {
        if (count >= targetCount) break

        const pageSlug = buildSlug(keyword, city)
        const title = `${keyword} in ${city} | ${businessName}`
        const metaDesc = `Best ${keyword} in ${city}. ${businessName} provides professional ${industry} solutions for ${city} businesses. Free trial available.`

        const pageContent = `In ${city}'s fast-paced business environment, having the right ${keyword} solution is no longer optional — it's essential for staying competitive. ${businessName} has been helping ${city} businesses solve exactly this challenge.

Our ${keyword} platform was purpose-built for businesses operating in markets like ${city}. We understand the local regulatory landscape, the talent dynamics, and the specific pressures that ${city} companies face when trying to scale. That's why over 500 businesses in ${city} and beyond have made ${businessName} their trusted ${industry} partner.

What sets us apart from generic solutions? We don't just offer software — we offer outcomes. With ${businessName}, ${city} businesses typically see 40% reduction in manual work, 3x faster onboarding, and measurable ROI within the first 30 days. Our AI-powered automation handles the heavy lifting so your ${city} team can focus on what actually moves the needle.

Whether you're a 5-person startup in ${city} or a 500-person enterprise, ${businessName} scales with your ambition. Start your free trial today — no credit card required, no lengthy setup, just results.`

        const fullHtml = buildFullHtmlPage(keyword, city, businessName, websiteUrl, industry, pageContent, description)

        try {
          await sql`
            INSERT INTO pages (domain_id, slug, title, meta_description, content, content_type)
            VALUES (${domainId}, ${pageSlug}, ${title}, ${metaDesc}, ${fullHtml}, 'html')
            ON CONFLICT (domain_id, slug) DO UPDATE SET
              content = EXCLUDED.content,
              title = EXCLUDED.title,
              meta_description = EXCLUDED.meta_description
          `
          generatedPages.push({ slug: pageSlug, title })
          count++
        } catch (e) {
          console.error('Insert error:', e.message)
        }
      }
      if (count >= targetCount) break
    }

    return res.status(200).json({
      success: true,
      count: generatedPages.length,
      generated: generatedPages.length,
      pages: generatedPages.slice(0, 20),
      message: `Generated ${generatedPages.length} landing pages for ${domain.domain}`
    })

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
