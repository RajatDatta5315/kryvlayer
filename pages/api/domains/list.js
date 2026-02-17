import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
  const { userId } = req.query

  try {
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL)

    await sql`CREATE TABLE IF NOT EXISTS domains (
      id SERIAL PRIMARY KEY, user_id TEXT, domain TEXT,
      website_url TEXT, business_name TEXT, industry TEXT, description TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )`

    await sql`CREATE TABLE IF NOT EXISTS pages (
      id SERIAL PRIMARY KEY, domain_id INTEGER, slug TEXT NOT NULL,
      title TEXT, meta_description TEXT, content TEXT,
      content_type TEXT DEFAULT 'html', views INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(), UNIQUE(domain_id, slug)
    )`

    const domains = await sql`
      SELECT d.*, 
        COUNT(p.id) as page_count,
        COALESCE(SUM(p.views), 0) as total_views
      FROM domains d
      LEFT JOIN pages p ON d.id = p.domain_id
      WHERE d.user_id = ${userId || '1'}
      GROUP BY d.id
      ORDER BY d.created_at DESC
    `

    return res.status(200).json({ success: true, domains })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message, domains: [] })
  }
}
