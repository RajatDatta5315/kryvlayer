import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' })

  const { domainId } = req.body
  if (!domainId) return res.status(400).json({ error: 'domainId required' })

  try {
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL)

    await sql`DELETE FROM pages WHERE domain_id = ${domainId}`
    await sql`DELETE FROM domains WHERE id = ${domainId}`

    return res.status(200).json({ success: true, message: 'Domain and all pages deleted' })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
