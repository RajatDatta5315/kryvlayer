import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' })

  const { domainId, businessName, websiteUrl, industry, description } = req.body
  if (!domainId) return res.status(400).json({ error: 'domainId required' })

  try {
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL)

    await sql`
      UPDATE domains SET
        business_name = COALESCE(${businessName || null}, business_name),
        website_url = COALESCE(${websiteUrl || null}, website_url),
        industry = COALESCE(${industry || null}, industry),
        description = COALESCE(${description || null}, description)
      WHERE id = ${domainId}
    `

    return res.status(200).json({ success: true, message: 'Domain updated' })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
