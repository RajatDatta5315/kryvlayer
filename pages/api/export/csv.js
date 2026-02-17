import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
  const { domainId } = req.query
  if (!domainId) return res.status(400).json({ error: 'domainId required' })

  try {
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL)

    const pages = await sql`
      SELECT p.slug, p.title, p.meta_description, p.views, p.created_at, d.domain
      FROM pages p
      LEFT JOIN domains d ON p.domain_id = d.id
      WHERE p.domain_id = ${domainId}
      ORDER BY p.views DESC
    `

    const header = 'URL,Title,Meta Description,Views,Created\n'
    const rows = pages.map(p =>
      `"https://${p.domain}/${p.slug}","${(p.title || '').replace(/"/g, '""')}","${(p.meta_description || '').replace(/"/g, '""')}",${p.views || 0},"${new Date(p.created_at).toLocaleDateString()}"`
    ).join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="kryvlayer-pages-${domainId}.csv"`)
    res.send(header + rows)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
