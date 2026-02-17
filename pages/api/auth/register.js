import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, name, databaseUrl } = req.body
  if (!email || !databaseUrl) return res.status(400).json({ error: 'Email and database URL required' })

  try {
    // Master KRYVLayer DB — stores user accounts
    const masterSql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL)

    await masterSql`CREATE TABLE IF NOT EXISTS kryv_users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      database_url TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )`

    // Test + setup user's own database
    try {
      const userSql = neon(databaseUrl)

      await userSql`CREATE TABLE IF NOT EXISTS domains (
        id SERIAL PRIMARY KEY, user_id TEXT, domain TEXT,
        website_url TEXT, business_name TEXT, industry TEXT, description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )`

      await userSql`CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY, domain_id INTEGER, slug TEXT NOT NULL,
        title TEXT, meta_description TEXT, content TEXT,
        content_type TEXT DEFAULT 'html', views INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(), UNIQUE(domain_id, slug)
      )`
    } catch (dbErr) {
      return res.status(400).json({
        success: false,
        error: 'Could not connect to your database. Check the URL and try again.',
        details: dbErr.message
      })
    }

    // Save user
    const result = await masterSql`
      INSERT INTO kryv_users (email, name, database_url)
      VALUES (${email}, ${name || ''}, ${databaseUrl})
      ON CONFLICT (email) DO UPDATE SET
        database_url = EXCLUDED.database_url,
        name = EXCLUDED.name
      RETURNING id, email, name
    `

    return res.status(200).json({
      success: true,
      user: result[0],
      message: 'Account created and database connected!'
    })

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
