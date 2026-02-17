import { neon } from '@neondatabase/serverless'

export default function Sitemap() {
  return null
}

export async function getServerSideProps({ res }) {
  try {
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL)
    const pages = await sql`SELECT slug, created_at FROM pages ORDER BY created_at DESC LIMIT 5000`
    const domains = await sql`SELECT domain FROM domains LIMIT 100`

    const baseUrl = domains[0]?.domain ? `https://${domains[0].domain}` : 'https://kryvlayer.vercel.app'

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  ${pages.map(p => `
  <url>
    <loc>${baseUrl}/${p.slug}</loc>
    <lastmod>${new Date(p.created_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`

    res.setHeader('Content-Type', 'text/xml')
    res.setHeader('Cache-Control', 'public, s-maxage=86400')
    res.write(sitemap)
    res.end()

    return { props: {} }
  } catch (error) {
    res.setHeader('Content-Type', 'text/xml')
    res.write(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`)
    res.end()
    return { props: {} }
  }
}
