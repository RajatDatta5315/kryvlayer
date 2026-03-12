import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
  const { domainId } = req.query
  if (!domainId) return res.status(400).json({ error: 'domainId required', pages: [] })
  if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL)
    return res.status(500).json({ error: 'DATABASE_URL not set', pages: [] })
  try {
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL)
    await sql`CREATE TABLE IF NOT EXISTS pages (
      id SERIAL PRIMARY KEY, domain_id INTEGER, slug TEXT NOT NULL,
      keyword TEXT, city TEXT, title TEXT, meta_description TEXT,
      content TEXT, content_type TEXT DEFAULT 'html',
      views INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(domain_id, slug)
    )`
    const pages = await sql`
      SELECT id, slug, keyword, city, title, meta_description, views, created_at
      FROM pages WHERE domain_id = ${domainId}
      ORDER BY created_at DESC LIMIT 500`
    return res.status(200).json({ success: true, pages })
  } catch (e) {
    return res.status(500).json({ error: e.message, pages: [] })
  }
}
