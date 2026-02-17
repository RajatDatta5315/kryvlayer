import { neon } from '@neondatabase/serverless'

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
    return data.response || data.message || data.text || null
  } catch { return null }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { slug, domainId } = req.body
  if (!slug || !domainId) return res.status(400).json({ error: 'slug and domainId required' })

  try {
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL)

    const domResult = await sql`SELECT * FROM domains WHERE id = ${domainId} LIMIT 1`
    if (!domResult.length) return res.status(404).json({ error: 'Domain not found' })

    const domain = domResult[0]
    const businessName = domain.business_name || 'Our Platform'
    const websiteUrl = domain.website_url || ''
    const industry = domain.industry || 'Software'

    // Extract keyword and city from slug
    const parts = slug.split('-')
    const keyword = parts.slice(0, Math.ceil(parts.length / 2)).join(' ')
    const city = parts.slice(Math.ceil(parts.length / 2)).join(' ')

    const prompt = `Write a 300-word SEO landing page body for "${businessName}" (${industry}).
Topic: "${keyword}" for businesses in ${city}.
Be specific to ${city}'s market. Fresh, unique content only.
Plain text only.`

    const content = await callNEHIRA(prompt)
    if (!content) return res.status(500).json({ error: 'NEHIRA did not return content' })

    await sql`
      UPDATE pages 
      SET content = ${content}, meta_description = ${`Best ${keyword} in ${city}. ${businessName} provides professional solutions. Free trial available.`}
      WHERE slug = ${slug} AND domain_id = ${domainId}
    `

    return res.status(200).json({ success: true, slug, message: 'Page regenerated with fresh content' })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
