import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
  const { domainId } = req.query
  if (!domainId) return res.status(400).json({ error: 'domainId required' })
  if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL)
    return res.status(500).json({ error: 'DATABASE_URL not set' })
  try {
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL)
    await sql`CREATE TABLE IF NOT EXISTS domains (
      id SERIAL PRIMARY KEY, user_id TEXT, domain TEXT,
      website_url TEXT, business_name TEXT, industry TEXT, description TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )`
    const rows = await sql`SELECT * FROM domains WHERE id = ${domainId} LIMIT 1`
    if (!rows.length) return res.status(404).json({ error: 'Domain not found' })
    return res.status(200).json({ success: true, domain: rows[0] })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
