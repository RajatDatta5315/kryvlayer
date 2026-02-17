import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  try {
    const pagesCount = await sql`SELECT COUNT(*) as count FROM pages`
    const viewsCount = await sql`SELECT COALESCE(SUM(views),0) as total FROM pages`
    const domainsCount = await sql`SELECT COUNT(*) as count FROM domains`
    const topPages = await sql`
      SELECT slug, title, views, domain_id
      FROM pages 
      ORDER BY views DESC 
      LIMIT 10
    `
    const recentPages = await sql`
      SELECT slug, title, created_at 
      FROM pages 
      ORDER BY created_at DESC 
      LIMIT 5
    `

    const totalPages = parseInt(pagesCount.rows[0]?.count || 0)
    const totalViews = parseInt(viewsCount.rows[0]?.total || 0)

    return res.status(200).json({
      success: true,
      totalPages,
      totalViews,
      totalDomains: parseInt(domainsCount.rows[0]?.count || 0),
      avgViewsPerPage: totalPages > 0 ? (totalViews / totalPages).toFixed(1) : 0,
      topPages: topPages.rows,
      recentPages: recentPages.rows
    })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
