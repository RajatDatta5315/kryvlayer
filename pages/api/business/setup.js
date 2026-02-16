import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { businessName, industry, targetCities, domain, keywords } = req.body

    // Create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS businesses (
        id SERIAL PRIMARY KEY,
        business_name TEXT,
        industry TEXT,
        target_cities TEXT,
        domain TEXT,
        keywords TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Insert business
    const result = await sql`
      INSERT INTO businesses (business_name, industry, target_cities, domain, keywords)
      VALUES (${businessName}, ${industry}, ${targetCities}, ${domain}, ${keywords})
      RETURNING id
    `

    return res.status(200).json({
      success: true,
      businessId: result.rows[0].id
    })

  } catch (error) {
    console.error('Setup error:', error)
    return res.status(500).json({ error: error.message })
  }
}
