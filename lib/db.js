import { sql } from '@vercel/postgres'

export async function setupDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS businesses (
        id SERIAL PRIMARY KEY,
        business_name TEXT,
        industry TEXT,
        target_cities TEXT,
        domain TEXT,
        keywords TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        business_id INTEGER,
        slug TEXT UNIQUE,
        title TEXT,
        meta_description TEXT,
        content TEXT,
        views INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    return { success: true }
  } catch (error) {
    console.error('Database setup error:', error)
    return { success: false, error: error.message }
  }
}
