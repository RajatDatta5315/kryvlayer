import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, name, databaseUrl } = req.body

  if (!email || !databaseUrl) {
    return res.status(400).json({ error: 'Email and database URL required' })
  }

  try {
    // Create master users table in KRYVLayer's own DB
    await sql`
      CREATE TABLE IF NOT EXISTS kryv_users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        database_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Test user's database connection
    const { Client } = await import('pg').catch(() => null) || {}
    if (Client && databaseUrl) {
      const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } })
      await client.connect()

      // Create tables in user's own database
      await client.query(`
        CREATE TABLE IF NOT EXISTS domains (
          id SERIAL PRIMARY KEY,
          user_id TEXT,
          domain TEXT,
          website_url TEXT,
          business_name TEXT,
          industry TEXT,
          description TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `)

      await client.query(`
        CREATE TABLE IF NOT EXISTS pages (
          id SERIAL PRIMARY KEY,
          domain_id INTEGER,
          slug TEXT NOT NULL,
          title TEXT,
          meta_description TEXT,
          content TEXT,
          content_type TEXT DEFAULT 'html',
          views INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(domain_id, slug)
        )
      `)

      await client.end()
    }

    // Save user to KRYVLayer master DB
    const userResult = await sql`
      INSERT INTO kryv_users (email, name, database_url)
      VALUES (${email}, ${name || ''}, ${databaseUrl})
      ON CONFLICT (email) DO UPDATE SET database_url = EXCLUDED.database_url
      RETURNING id, email, name
    `

    const user = userResult.rows[0]

    return res.status(200).json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
      message: 'Account created! Your database is connected.'
    })

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
