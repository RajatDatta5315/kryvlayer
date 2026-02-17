import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' })

  const { slugs, domainId } = req.body
  if (!slugs || !domainId) return res.status(400).json({ error: 'slugs and domainId required' })

  try {
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL)

    for (const slug of slugs) {
      await sql`DELETE FROM pages WHERE slug = ${slug} AND domain_id = ${domainId}`
    }

    return res.status(200).json({ success: true, deleted: slugs.length })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
