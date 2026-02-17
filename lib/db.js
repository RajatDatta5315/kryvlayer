import { neon } from '@neondatabase/serverless'

export function getDb() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!url) throw new Error('No DATABASE_URL found in environment variables')
  return neon(url)
}

export async function setupDatabase() {
  try {
    const sql = getDb()

    await sql`CREATE TABLE IF NOT EXISTS kryv_users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      database_url TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )`

    await sql`CREATE TABLE IF NOT EXISTS domains (
      id SERIAL PRIMARY KEY,
      user_id TEXT,
      domain TEXT NOT NULL,
      website_url TEXT,
      business_name TEXT,
      industry TEXT,
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )`

    await sql`CREATE TABLE IF NOT EXISTS pages (
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
    )`

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
