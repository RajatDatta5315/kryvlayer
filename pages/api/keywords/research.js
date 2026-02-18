export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { topic, count } = req.body
  if (!topic) return res.status(400).json({ error: 'topic required' })

  const targetCount = Math.min(parseInt(count || 50), 200)

  try {
    const prompt = `You are an SEO keyword research expert.

Topic: "${topic}"

Generate ${targetCount} high-value long-tail SEO keywords related to this topic.

Requirements:
- Include search intent (informational, commercial, transactional)
- Mix of low, medium, high competition keywords
- Include question-based keywords (how, what, why, etc.)
- Include location-based variations
- Include product/service variations

Return ONLY this JSON format:
{
  "keywords": [
    {"keyword": "example keyword", "intent": "commercial", "competition": "low"},
    {"keyword": "how to example", "intent": "informational", "competition": "medium"}
  ]
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
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')

    const parsed = JSON.parse(jsonMatch[0])

    return res.status(200).json({
      success: true,
      keywords: parsed.keywords || [],
      count: (parsed.keywords || []).length
    })

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
