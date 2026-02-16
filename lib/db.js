import { sql } from '@vercel/postgres'

export async function setupDatabase() {
  try {
    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Domains table (one user can have multiple domains)
    await sql`
      CREATE TABLE IF NOT EXISTS domains (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        domain TEXT NOT NULL,
        website_url TEXT,
        business_name TEXT,
        industry TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Pages table (linked to domains)
    await sql`
      CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        domain_id INTEGER REFERENCES domains(id),
        slug TEXT NOT NULL,
        title TEXT,
        meta_description TEXT,
        content TEXT,
        views INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(domain_id, slug)
      )
    `

    return { success: true }
  } catch (error) {
    console.error('Database setup error:', error)
    return { success: false, error: error.message }
  }
}
