import { neon } from '@neondatabase/serverless'

async function callNEHIRA(prompt, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(process.env.NEHIRA_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEHIRA_API_KEY}`
        },
        body: JSON.stringify({ message: prompt }),
        signal: AbortSignal.timeout(15000)
      })

      if (!res.ok) {
        console.error(`NEHIRA attempt ${i + 1} failed: ${res.status}`)
        continue
      }

      const raw = await res.text()
      if (!raw || !raw.trim()) continue

      let data
      try { data = JSON.parse(raw) } catch { return raw }
      return data.response || data.message || data.text || null
    } catch (error) {
      console.error(`NEHIRA attempt ${i + 1} error:`, error.message)
      if (i === retries - 1) return null
    }
  }
  return null
}

function buildSlug(keyword, city) {
  return `${keyword}-${city}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 80)
}

function buildHTML(keyword, city, businessName, websiteUrl, industry, content) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${keyword} in ${city} | ${businessName}</title><meta name="description" content="Best ${keyword} in ${city}. ${businessName} provides professional ${industry} solutions."/><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,sans-serif;background:#0a0b14;color:#e5e7eb;line-height:1.7}.wrap{max-width:900px;margin:0 auto;padding:2rem 1.5rem}nav{padding:1.5rem 0;border-bottom:1px solid rgba(255,255,255,0.1);margin-bottom:3rem}nav a{color:#3b82f6;text-decoration:none;font-weight:600}h1{font-size:clamp(2rem,5vw,3.5rem);font-weight:800;color:#fff;margin-bottom:1rem;line-height:1.1}.accent{color:#3b82f6}.hero{text-align:center;margin-bottom:4rem}.cta{display:inline-block;padding:1rem 2rem;background:#3b82f6;color:#fff;border-radius:10px;text-decoration:none;font-weight:700;margin-top:2rem}.content{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:2.5rem;margin-bottom:2rem;color:rgba(255,255,255,0.7);white-space:pre-wrap}footer{text-align:center;padding:2rem 0;color:rgba(255,255,255,0.3);font-size:0.85rem}</style></head><body><div class="wrap"><nav><a href="${websiteUrl || '/'}">${businessName}</a></nav><div class="hero"><h1>${keyword} in <span class="accent">${city}</span></h1><p style="font-size:1.1rem;color:rgba(255,255,255,0.6);max-width:600px;margin:0 auto">Professional ${keyword} solutions for ${city} businesses. Trusted by hundreds of companies.</p><a href="${websiteUrl || '/'}" class="cta">Get Started →</a></div><div class="content">${content}</div><footer>© 2026 ${businessName}. ${keyword} for ${city} businesses.</footer></div></body></html>`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  let domainId
  try { domainId = req.body?.domainId } catch { return res.status(400).json({ error: 'Invalid body' }) }
  if (!domainId) return res.status(400).json({ error: 'domainId required' })

  console.log('[GENERATION START] Domain ID:', domainId)

  try {
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL)

    // Ensure tables exist
    await sql`CREATE TABLE IF NOT EXISTS domains (id SERIAL PRIMARY KEY, user_id TEXT, domain TEXT, website_url TEXT, business_name TEXT, industry TEXT, description TEXT, created_at TIMESTAMP DEFAULT NOW())`
    await sql`CREATE TABLE IF NOT EXISTS pages (id SERIAL PRIMARY KEY, domain_id INTEGER, slug TEXT NOT NULL, title TEXT, meta_description TEXT, content TEXT, content_type TEXT DEFAULT 'html', views INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT NOW(), UNIQUE(domain_id, slug))`

    console.log('[TABLES] Created/verified')

    const domResult = await sql`SELECT * FROM domains WHERE id = ${domainId} LIMIT 1`
    if (!domResult.length) {
      console.error('[ERROR] Domain not found')
      return res.status(404).json({ error: 'Domain not found' })
    }

    const domain = domResult[0]
    const businessName = domain.business_name || 'Our Platform'
    const websiteUrl = domain.website_url || ''
    const industry = domain.industry || 'Software'

    console.log('[DOMAIN]', businessName, websiteUrl)

    // GUARANTEED FALLBACK KEYWORDS - Always works even if NEHIRA fails
    let keywords = ['crm software','project management','business automation','saas platform','workflow tools','analytics dashboard','customer management','invoice software','team collaboration','marketing automation']
    let cities = ['London','New York','Toronto','Singapore','Dubai','Berlin','Sydney','Mumbai','Paris','Tokyo']

    // TRY to get better keywords from NEHIRA (but don't fail if it doesn't work)
    console.log('[NEHIRA] Attempting to analyze website...')
    const analysisPrompt = `Analyze ${websiteUrl}. Generate 10 SEO keywords and 10 cities. Return ONLY JSON: {"keywords":["k1","k2"],"cities":["c1","c2"]}`
    const analysisText = await callNEHIRA(analysisPrompt, 1)
    
    if (analysisText) {
      try {
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          if (Array.isArray(parsed.keywords) && parsed.keywords.length) {
            keywords = parsed.keywords.slice(0, 10)
            console.log('[NEHIRA] Got custom keywords:', keywords.length)
          }
          if (Array.isArray(parsed.cities) && parsed.cities.length) {
            cities = parsed.cities.slice(0, 10)
            console.log('[NEHIRA] Got custom cities:', cities.length)
          }
        }
      } catch (e) {
        console.log('[NEHIRA] Using fallback keywords')
      }
    } else {
      console.log('[NEHIRA] Failed, using fallback keywords')
    }

    const generatedPages = []
    const MAX = 50 // Start with 50, not 100

    console.log('[GENERATION] Starting page creation...')

    for (const keyword of keywords) {
      for (const city of cities) {
        if (generatedPages.length >= MAX) break

        const slug = buildSlug(keyword, city)
        const title = `${keyword} in ${city} | ${businessName}`
        const metaDesc = `Best ${keyword} in ${city}. ${businessName} provides professional ${industry} solutions.`

        // Default content (ALWAYS works)
        let content = `${businessName} provides world-class ${keyword} solutions for businesses in ${city}. Our platform is trusted by hundreds of ${city} companies to streamline operations and drive growth.\n\nWith ${businessName}, ${city} businesses get enterprise-grade features at startup-friendly pricing. Our ${keyword} tools are designed specifically for the challenges ${city} businesses face.\n\nJoin ${city}'s fastest-growing companies and see why ${businessName} is the #1 choice for ${keyword}. Start your free trial today.`

        // Try to get AI content (but don't fail if NEHIRA is down)
        const contentPrompt = `Write 200 words for ${businessName} about ${keyword} for businesses in ${city}. Plain text.`
        const generated = await callNEHIRA(contentPrompt, 1)
        if (generated && generated.length > 100) {
          content = generated
          console.log(`[AI CONTENT] Generated for ${slug}`)
        } else {
          console.log(`[FALLBACK] Using default content for ${slug}`)
        }

        const html = buildHTML(keyword, city, businessName, websiteUrl, industry, content)

        try {
          await sql`INSERT INTO pages (domain_id, slug, title, meta_description, content, content_type) VALUES (${domainId}, ${slug}, ${title}, ${metaDesc}, ${html}, 'html') ON CONFLICT (domain_id, slug) DO UPDATE SET content = EXCLUDED.content`
          generatedPages.push({ slug, title })
          console.log(`[CREATED] ${generatedPages.length}/${MAX}: ${slug}`)
        } catch (e) {
          console.error(`[ERROR] Failed to insert ${slug}:`, e.message)
        }
      }
      if (generatedPages.length >= MAX) break
    }

    console.log('[GENERATION COMPLETE] Total pages:', generatedPages.length)

    return res.status(200).json({ 
      success: true, 
      count: generatedPages.length, 
      pages: generatedPages,
      message: `Successfully created ${generatedPages.length} landing pages`
    })

  } catch (error) {
    console.error('[FATAL ERROR]', error)
    return res.status(500).json({ success: false, error: error.message, stack: error.stack })
  }
}
