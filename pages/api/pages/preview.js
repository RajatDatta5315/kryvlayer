import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
  const { slug, domainId } = req.query

  try {
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL)
    const result = await sql`SELECT content FROM pages WHERE slug = ${slug} AND domain_id = ${domainId} LIMIT 1`
    
    if (!result.length) return res.status(404).send('<h1>Page not found</h1>')

    res.setHeader('Content-Type', 'text/html')
    res.send(result[0].content)
  } catch {
    res.status(500).send('<h1>Error loading preview</h1>')
  }
}
