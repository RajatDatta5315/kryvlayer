export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { websiteUrl } = req.body

    // Step 1: Ask NEHIRA to analyze the website
    const prompt = `
Analyze this website: ${websiteUrl}

Extract and generate:
1. 100 relevant SEO keywords for this business
2. 50 target cities/locations globally
3. Return as JSON: {"keywords": ["keyword1", "keyword2"], "cities": ["city1", "city2"]}

Be specific and relevant to the business niche.
`

    const response = await fetch(process.env.NEHIRA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEHIRA_API_KEY}`
      },
      body: JSON.stringify({ message: prompt })
    })

    const data = await response.json()
    
    // Parse NEHIRA response (it might return JSON string)
    let analysis
    try {
      analysis = JSON.parse(data.response || data.message)
    } catch {
      // If not JSON, use defaults
      analysis = {
        keywords: ['crm software', 'project management', 'inventory system'],
        cities: ['London', 'New York', 'Toronto', 'Singapore', 'Dubai']
      }
    }

    return res.status(200).json({
      success: true,
      keywords: analysis.keywords || [],
      cities: analysis.cities || []
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return res.status(500).json({ error: error.message })
  }
}
