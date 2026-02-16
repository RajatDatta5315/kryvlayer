import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  try {
    // Total pages
    const pagesCount = await sql`SELECT COUNT(*) as count FROM pages`
    
    // Total views
    const viewsCount = await sql`SELECT SUM(views) as total FROM pages`
    
    // Total businesses
    const businessCount = await sql`SELECT COUNT(*) as count FROM businesses`
    
    // Top pages
    const topPages = await sql`
      SELECT slug, title, views 
      FROM pages 
      ORDER BY views DESC 
      LIMIT 10
    `

    const totalPages = parseInt(pagesCount.rows[0]?.count || 0)
    const totalViews = parseInt(viewsCount.rows[0]?.total || 0)
    const totalBusinesses = parseInt(businessCount.rows[0]?.count || 0)

    return res.status(200).json({
      totalPages,
      totalViews,
      totalBusinesses,
      avgViewsPerPage: totalPages > 0 ? totalViews / totalPages : 0,
      topPages: topPages.rows
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return res.status(500).json({ error: error.message })
  }
}
