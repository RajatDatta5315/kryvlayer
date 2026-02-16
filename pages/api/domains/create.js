import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId, domain, websiteUrl, businessName, keywords, cities } = req.body

    const result = await sql`
      INSERT INTO domains (user_id, domain, website_url, business_name)
      VALUES (${userId}, ${domain}, ${websiteUrl}, ${businessName})
      RETURNING id
    `

    return res.status(200).json({
      success: true,
      domainId: result.rows[0].id
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
pages/api/domains/list.js
import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  const { userId } = req.query

  try {
    const result = await sql`
      SELECT 
        d.*,
        COUNT(p.id) as page_count,
        COALESCE(SUM(p.views), 0) as total_views
      FROM domains d
      LEFT JOIN pages p ON d.id = p.domain_id
      WHERE d.user_id = ${userId}
      GROUP BY d.id
      ORDER BY d.created_at DESC
    `

    return res.status(200).json({
      success: true,
      domains: result.rows
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
