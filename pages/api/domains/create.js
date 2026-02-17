import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId, domain, websiteUrl, businessName } = req.body

    if (!domain || !businessName) {
      return res.status(400).json({ error: 'domain and businessName are required' })
    }

    // Create table if needed
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

    const result = await sql`
      INSERT INTO domains (user_id, domain, website_url, business_name)
      VALUES (${userId || '1'}, ${domain}, ${websiteUrl || ''}, ${businessName})
      RETURNING id
    `

    return res.status(200).json({
      success: true,
      domainId: result.rows[0].id
    })

  } catch (error) {
    console.error('Domain create error:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
