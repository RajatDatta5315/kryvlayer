import { sql } from '@vercel/postgres'

async function callNEHIRA(prompt) {
  const endpoint = process.env.NEHIRA_ENDPOINT
  const apiKey = process.env.NEHIRA_API_KEY

  if (!endpoint || !apiKey) {
    console.warn('NEHIRA env vars not set, using fallback content')
    return null
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ message: prompt })
    })

    if (!response.ok) {
      console.error(`NEHIRA HTTP ${response.status}`)
      return null
    }

    const text = await response.text()
    if (!text || text.trim() === '') {
      console.warn('NEHIRA returned empty response')
      return null
    }

    let data
    try {
      data = JSON.parse(text)
    } catch {
      // Response is plain text
      return text
    }

    return data.response || data.message || data.text || data.content || null
  } catch (error) {
    console.error('NEHIRA call error:', error.message)
    return null
  }
}

function buildSlug(keyword, city) {
  return `${keyword}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80)
}

function fallbackContent(keyword, city, businessName) {
  return `Discover world-class ${keyword} solutions in ${city} with ${businessName}. 
  
Our platform is trusted by businesses in ${city} looking to streamline their operations and scale faster. Whether you're a startup or enterprise, our ${keyword} tools are designed to grow with you.

Why choose ${businessName} for ${keyword} in ${city}?
- Purpose-built for ${city} businesses
- AI-powered automation and insights  
- Dedicated support team
- Start free, scale as you grow

Join hundreds of businesses in ${city} already using ${businessName} to power their ${keyword} needs. Get started today and see results within days.`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let domainId
  try {
    const body = req.body
    domainId = body?.domainId
  } catch {
    return res.status(400).json({ error: 'Invalid request body' })
  }

  if (!domainId) {
    return res.status(400).json({ error: 'domainId is required' })
  }

  try {
    // Ensure tables exist first
    await sql`
      CREATE TABLE IF NOT EXISTS domains (
        id SERIAL PRIMARY KEY,
        user_id TEXT,
        domain TEXT,
        website_url TEXT,
        business_name TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        domain_id INTEGER,
        slug TEXT NOT NULL,
        title TEXT,
        meta_description TEXT,
        content TEXT,
        views INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(domain_id, slug)
      )
    `

    // Get domain
    const domainResult = await sql`SELECT * FROM domains WHERE id = ${domainId} LIMIT 1`
    
    if (!domainResult.rows || domainResult.rows.length === 0) {
      return res.status(404).json({ error: 'Domain not found', domainId })
    }

    const domain = domainResult.rows[0]
    const businessName = domain.business_name || 'Our Company'
    const websiteUrl = domain.website_url || ''

    // Get keywords + cities from NEHIRA (or use defaults)
    let keywords = ['crm software', 'project management', 'business automation', 'saas platform', 'enterprise software', 'analytics tools', 'marketing automation', 'customer success', 'sales tools', 'workflow automation']
    let cities = ['London', 'New York', 'Toronto', 'Singapore', 'Dubai', 'Berlin', 'Sydney', 'Mumbai', 'Paris', 'Tokyo']

    if (websiteUrl) {
      const analysisPrompt = `Analyze the business at ${websiteUrl}. Generate exactly 10 relevant SEO keywords and 10 target cities. Return ONLY this JSON with no other text: {"keywords":["keyword1","keyword2","keyword3","keyword4","keyword5","keyword6","keyword7","keyword8","keyword9","keyword10"],"cities":["city1","city2","city3","city4","city5","city6","city7","city8","city9","city10"]}`

      const analysisText = await callNEHIRA(analysisPrompt)
      
      if (analysisText) {
        try {
          const cleaned = analysisText.replace(/```json|```/g, '').trim()
          const jsonStart = cleaned.indexOf('{')
          const jsonEnd = cleaned.lastIndexOf('}')
          if (jsonStart !== -1 && jsonEnd !== -1) {
            const jsonStr = cleaned.substring(jsonStart, jsonEnd + 1)
            const parsed = JSON.parse(jsonStr)
            if (Array.isArray(parsed.keywords) && parsed.keywords.length > 0) {
              keywords = parsed.keywords.map(k => String(k).trim()).filter(Boolean)
            }
            if (Array.isArray(parsed.cities) && parsed.cities.length > 0) {
              cities = parsed.cities.map(c => String(c).trim()).filter(Boolean)
            }
          }
        } catch (parseError) {
          console.log('Using default keywords/cities — NEHIRA parse failed')
        }
      }
    }

    // Generate pages
    const generatedPages = []
    const MAX_PAGES = 25

    for (const keyword of keywords.slice(0, 5)) {
      for (const city of cities.slice(0, 5)) {
        if (generatedPages.length >= MAX_PAGES) break

        const slug = buildSlug(keyword, city)
        const title = `${keyword} in ${city} | ${businessName}`
        const metaDescription = `Looking for ${keyword} in ${city}? ${businessName} offers top-rated solutions. Get started today — free trial available.`

        // Generate unique content
        let content = fallbackContent(keyword, city, businessName)

        const contentPrompt = `Write a 200-word SEO landing page for "${businessName}" about "${keyword}" services in ${city}. Make it compelling and unique. Include a headline, 2-3 paragraphs with benefits, and a call-to-action. Plain text only.`
        
        const generatedContent = await callNEHIRA(contentPrompt)
        if (generatedContent && generatedContent.length > 50) {
          content = generatedContent
        }

        try {
          await sql`
            INSERT INTO pages (domain_id, slug, title, meta_description, content)
            VALUES (${domainId}, ${slug}, ${title}, ${metaDescription}, ${content})
            ON CONFLICT (domain_id, slug) DO NOTHING
          `
          generatedPages.push({ slug, title })
        } catch (insertErr) {
          console.error('Insert error:', insertErr.message)
        }
      }
      if (generatedPages.length >= MAX_PAGES) break
    }

    return res.status(200).json({
      success: true,
      count: generatedPages.length,
      pages: generatedPages,
      message: `Generated ${generatedPages.length} pages successfully`
    })

  } catch (error) {
    console.error('Auto-generate error:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Generation failed',
      hint: 'Check database connection and environment variables'
    })
  }
}
