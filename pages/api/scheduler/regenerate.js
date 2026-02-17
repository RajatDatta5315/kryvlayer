import { neon } from '@neondatabase/serverless'

export const config = { maxDuration: 300 }

export default async function handler(req, res) {
  // Secure this endpoint
  const authHeader = req.headers.authorization
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL)

    // Get all domains that haven't been updated in 7+ days
    const staleDomains = await sql`
      SELECT d.id, d.business_name, d.website_url
      FROM domains d
      WHERE d.created_at < NOW() - INTERVAL '7 days'
      OR d.id NOT IN (
        SELECT DISTINCT domain_id FROM pages 
        WHERE created_at > NOW() - INTERVAL '7 days'
      )
      LIMIT 10
    `

    const results = []
    for (const domain of staleDomains) {
      try {
        const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
        await fetch(`${baseUrl}/api/generate/auto`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domainId: domain.id })
        })
        results.push({ id: domain.id, name: domain.business_name, status: 'regenerated' })
      } catch (e) {
        results.push({ id: domain.id, name: domain.business_name, status: 'failed', error: e.message })
      }
    }

    return res.status(200).json({ success: true, processed: results.length, results })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
