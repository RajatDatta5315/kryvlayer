export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { websiteUrl } = req.body

    if (!websiteUrl) {
      return res.status(400).json({ error: 'websiteUrl required' })
    }

    const prompt = `Analyze ${websiteUrl} and generate 100 SEO keywords and 50 cities. Return ONLY valid JSON: {"keywords":["keyword1","keyword2"],"cities":["city1","city2"]}`

    const response = await fetch(process.env.NEHIRA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEHIRA_API_KEY}`
      },
      body: JSON.stringify({ message: prompt })
    })

    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`)
    }

    const data = await response.json()
    
    // Default fallback
    let analysis = {
      keywords: ['crm software', 'project management', 'business automation', 'saas platform', 'enterprise software'],
      cities: ['London', 'New York', 'Toronto', 'Singapore', 'Dubai', 'Berlin', 'Tokyo', 'Sydney', 'Mumbai', 'Paris']
    }

    // Try to parse NEHIRA response
    const responseText = data.response || data.message || ''
    if (responseText) {
      try {
        const cleaned = responseText.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(cleaned)
        if (parsed.keywords && Array.isArray(parsed.keywords)) {
          analysis.keywords = parsed.keywords.slice(0, 100)
        }
        if (parsed.cities && Array.isArray(parsed.cities)) {
          analysis.cities = parsed.cities.slice(0, 50)
        }
      } catch (parseError) {
        console.log('Using default analysis due to parse error')
      }
    }

    return res.status(200).json({
      success: true,
      keywords: analysis.keywords,
      cities: analysis.cities
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return res.status(500).json({ 
      error: 'Analysis failed',
      message: error.message,
      fallback: true,
      keywords: ['crm', 'project management', 'saas'],
      cities: ['London', 'New York', 'Toronto']
    })
  }
}
