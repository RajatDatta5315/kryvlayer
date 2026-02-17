import { sql } from '@vercel/postgres'

async function callNEHIRA(prompt) {
  try {
    const response = await fetch(process.env.NEHIRA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEHIRA_API_KEY}`
      },
      body: JSON.stringify({ message: prompt })
    })

    if (!response.ok) {
      throw new Error(`NEHIRA API error: ${response.status}`)
    }

    const data = await response.json()
    return data.response || data.message || JSON.stringify(data)
  } catch (error) {
    console.error('NEHIRA call failed:', error)
    return null
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { domainId } = req.body

    if (!domainId) {
      return res.status(400).json({ error: 'domainId required' })
    }

    // Get domain info
    const domainResult = await sql`
      SELECT * FROM domains WHERE id = ${domainId}
    `

    if (domainResult.rows.length === 0) {
      return res.status(404).json({ error: 'Domain not found' })
    }

    const domain = domainResult.rows[0]

    // Step 1: Analyze website for keywords
    const analysisPrompt = `Analyze ${domain.website_url} and generate 50 SEO keywords and 30 cities. Return ONLY valid JSON: {"keywords":["keyword1"],"cities":["city1"]}`
    
    const analysisText = await callNEHIRA(analysisPrompt)
    
    let keywords = ['crm software', 'project management', 'saas platform', 'business tools', 'automation software']
    let cities = ['London', 'New York', 'Toronto', 'Singapore', 'Dubai', 'Berlin', 'Tokyo', 'Sydney', 'Mumbai', 'Paris']

    // Try to parse NEHIRA response
    if (analysisText) {
      try {
        const parsed = JSON.parse(analysisText.replace(/```json|```/g, '').trim())
        if (parsed.keywords) keywords = parsed.keywords.slice(0, 50)
        if (parsed.cities) cities = parsed.cities.slice(0, 30)
      } catch (e) {
        console.log('Using default keywords/cities')
      }
    }

    // Step 2: Generate pages (limit to 25 for demo, can be increased)
    const generatedPages = []
    let count = 0

    for (const keyword of keywords.slice(0, 5)) {
      for (const city of cities.slice(0, 5)) {
        if (count >= 25) break

        const slug = `${keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
        const title = `${keyword} in ${city} | ${domain.business_name}`
        const metaDescription = `Looking for ${keyword} in ${city}? ${domain.business_name} provides top-rated solutions. Get started today!`

        // Generate unique content
        const contentPrompt = `Write a compelling 200-word landing page for "${domain.business_name}" offering "${keyword}" services in ${city}. Include benefits and call-to-action. Be persuasive and unique.`
        
        let content = `Discover the best ${keyword} solutions in ${city} with ${domain.business_name}. Our innovative platform helps businesses succeed with cutting-edge technology and expert support. Contact us today to learn more about how we can help your business grow.`
        
        const generatedContent = await callNEHIRA(contentPrompt)
        if (generatedContent) {
          content = generatedContent
        }

        // Insert page
        try {
          await sql`
            INSERT INTO pages (domain_id, slug, title, meta_description, content)
            VALUES (${domainId}, ${slug}, ${title}, ${metaDescription}, ${content})
            ON CONFLICT (domain_id, slug) DO NOTHING
          `
          generatedPages.push({ slug, title })
          count++
        } catch (insertError) {
          console.error('Page insert error:', insertError)
        }
      }
      if (count >= 25) break
    }

    return res.status(200).json({
      success: true,
      message: `Generated ${generatedPages.length} pages`,
      pages: generatedPages
    })

  } catch (error) {
    console.error('Auto-generation error:', error)
    return res.status(500).json({ 
      error: error.message || 'Generation failed',
      details: error.toString()
    })
  }
}
