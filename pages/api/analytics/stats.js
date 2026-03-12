import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
  if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL)
    return res.status(200).json({ success: true, totalPages: 0, totalViews: 0, totalDomains: 0, topPages: [], recentPages: [], message: 'DATABASE_URL not set — add it in Vercel settings' })
  try {
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL)

    const [pagesCount] = await sql`SELECT COUNT(*) as count FROM pages`
    const [viewsCount] = await sql`SELECT COALESCE(SUM(views),0) as total FROM pages`
    const [domainsCount] = await sql`SELECT COUNT(*) as count FROM domains`
    const topPages = await sql`SELECT slug, title, views FROM pages ORDER BY views DESC LIMIT 10`
    const recentPages = await sql`SELECT slug, title, created_at FROM pages ORDER BY created_at DESC LIMIT 5`

    const totalPages = parseInt(pagesCount?.count || 0)
    const totalViews = parseInt(viewsCount?.total || 0)

    return res.status(200).json({
      success: true,
      totalPages,
      totalViews,
      totalDomains: parseInt(domainsCount?.count || 0),
      avgViewsPerPage: totalPages > 0 ? (totalViews / totalPages).toFixed(1) : 0,
      topPages,
      recentPages
    })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
