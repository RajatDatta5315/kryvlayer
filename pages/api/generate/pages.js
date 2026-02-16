import { sql } from '@vercel/postgres'

async function callNEHIRA(prompt) {
  const response = await fetch(process.env.NEHIRA_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEHIRA_API_KEY}`
    },
    body: JSON.stringify({ message: prompt })
  })
  
  const data = await response.json()
  return data.response || data.message || JSON.stringify(data)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { businessId } = req.body

    // Get business data
    const business = await sql`SELECT * FROM businesses WHERE id = ${businessId}`
    if (business.rows.length === 0) {
      return res.status(404).json({ error: 'Business not found' })
    }

    const { business_name, industry, target_cities, keywords } = business.rows[0]

    // Create pages table
    await sql`
      CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        business_id INTEGER,
        slug TEXT UNIQUE,
        title TEXT,
        meta_description TEXT,
        content TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Parse inputs
    const cityList = target_cities.split(',').map(c => c.trim())
    const keywordList = keywords.split(',').map(k => k.trim())

    const pages = []

    // Generate pages for each keyword + city combination
    for (const keyword of keywordList.slice(0, 5)) { // Limit for demo
      for (const city of cityList.slice(0, 5)) { // Limit for demo
        const slug = `${keyword.toLowerCase().replace(/\s+/g, '-')}-${city.toLowerCase().replace(/\s+/g, '-')}`
        
        // Generate unique content with NEHIRA
        const prompt = `Write a compelling 150-word SEO landing page for "${business_name}" - a ${industry} company. Focus on "${keyword}" services in ${city}. Include benefits and a call-to-action. Be unique and persuasive.`
        
        const content = await callNEHIRA(prompt)
        
        const title = `${keyword} in ${city} | ${business_name}`
        const metaDescription = `Looking for ${keyword} in ${city}? ${business_name} provides top-rated ${industry} solutions. Get started today!`

        // Save to database
        await sql`
          INSERT INTO pages (business_id, slug, title, meta_description, content)
          VALUES (${businessId}, ${slug}, ${title}, ${metaDescription}, ${content})
          ON CONFLICT (slug) DO NOTHING
        `

        pages.push({ slug, title, metaDescription })
      }
    }

    return res.status(200).json({
      success: true,
      pages: pages
    })

  } catch (error) {
    console.error('Generation error:', error)
    return res.status(500).json({ error: error.message })
  }
}
