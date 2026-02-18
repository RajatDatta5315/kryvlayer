import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
  const checks = {
    database: false,
    nehira: false,
    tables: false,
    domainExists: false,
    pagesCount: 0,
    errors: []
  }

  try {
    // Check database connection
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL)
    checks.database = true

    // Check if tables exist
    try {
      await sql`SELECT 1 FROM domains LIMIT 1`
      await sql`SELECT 1 FROM pages LIMIT 1`
      checks.tables = true
    } catch (e) {
      checks.errors.push('Tables missing: ' + e.message)
    }

    // Check domains exist
    const domains = await sql`SELECT COUNT(*) as count FROM domains`
    checks.domainExists = domains[0].count > 0

    // Check pages count
    const pages = await sql`SELECT COUNT(*) as count FROM pages`
    checks.pagesCount = parseInt(pages[0].count)

    // Check NEHIRA API
    try {
      const nehiraRes = await fetch(process.env.NEHIRA_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEHIRA_API_KEY}`
        },
        body: JSON.stringify({ message: 'Test connection' }),
        signal: AbortSignal.timeout(5000)
      })
      checks.nehira = nehiraRes.ok
      if (!nehiraRes.ok) checks.errors.push(`NEHIRA failed: ${nehiraRes.status}`)
    } catch (e) {
      checks.errors.push('NEHIRA error: ' + e.message)
    }

  } catch (error) {
    checks.errors.push('Fatal: ' + error.message)
  }

  return res.status(200).json({
    success: true,
    checks,
    env: {
      hasDatabase: !!process.env.DATABASE_URL,
      hasNehira: !!process.env.NEHIRA_ENDPOINT,
      hasApiKey: !!process.env.NEHIRA_API_KEY
    }
  })
}
