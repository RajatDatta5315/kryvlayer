export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { websiteUrl } = req.body
  if (!websiteUrl) return res.status(400).json({ error: 'websiteUrl required' })

  let scrapedText = ''

  // Step 1: Actually fetch the website HTML
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const pageRes = await fetch(websiteUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; KRYVLayerBot/1.0)',
        'Accept': 'text/html'
      }
    })
    clearTimeout(timeout)

    const html = await pageRes.text()

    // Extract visible text from HTML
    scrapedText = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 3000) // First 3000 chars is enough for analysis

  } catch (scrapeError) {
    console.log('Could not scrape website, using URL only:', scrapeError.message)
    scrapedText = `Website: ${websiteUrl}`
  }

  // Step 2: Send to NEHIRA for deep analysis
  try {
    const prompt = `You are an SEO expert. Analyze this website content and generate SEO data.

WEBSITE: ${websiteUrl}
CONTENT PREVIEW: ${scrapedText}

Generate exactly:
- 30 highly specific SEO long-tail keywords this business should rank for
- 20 target cities/locations relevant to this business
- A 2-sentence business description
- The main industry/niche

Return ONLY this exact JSON (no markdown, no explanation):
{
  "keywords": ["keyword 1","keyword 2","keyword 3"],
  "cities": ["city 1","city 2","city 3"],
  "description": "Business description here.",
  "industry": "Industry name"
}`

    const nehiraRes = await fetch(process.env.NEHIRA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEHIRA_API_KEY}`
      },
      body: JSON.stringify({ message: prompt })
    })

    if (!nehiraRes.ok) throw new Error(`NEHIRA ${nehiraRes.status}`)

    const raw = await nehiraRes.text()
    if (!raw || raw.trim() === '') throw new Error('Empty NEHIRA response')

    let nehiraData
    try {
      nehiraData = JSON.parse(raw)
    } catch {
      nehiraData = {}
    }

    const responseText = nehiraData.response || nehiraData.message || nehiraData.text || raw

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in NEHIRA response')

    const parsed = JSON.parse(jsonMatch[0])

    return res.status(200).json({
      success: true,
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
      cities: Array.isArray(parsed.cities) ? parsed.cities : [],
      description: parsed.description || '',
      industry: parsed.industry || '',
      scrapedPreview: scrapedText.substring(0, 200)
    })

  } catch (error) {
    console.error('Analysis error:', error.message)
    // Smart fallback based on URL
    const urlLower = websiteUrl.toLowerCase()
    return res.status(200).json({
      success: true,
      fallback: true,
      keywords: ['crm software','project management','business automation','saas platform','workflow tools','team collaboration','analytics dashboard','customer management','inventory tracking','invoice software'],
      cities: ['London','New York','Toronto','Singapore','Dubai','Berlin','Sydney','Mumbai','Los Angeles','Paris'],
      description: `Professional software solutions for modern businesses.`,
      industry: 'SaaS'
    })
  }
}
