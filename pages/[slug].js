import { neon } from '@neondatabase/serverless'

export default function SEOPage({ page, notFound }) {
  if (notFound || !page) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a14', color: '#fff', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</div>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Page not found</p>
          <a href="/" style={{ color: '#a78bfa' }}>← Home</a>
        </div>
      </div>
    )
  }

  if (page.content_type === 'html' && page.content && page.content.startsWith('<!DOCTYPE')) {
    return <div dangerouslySetInnerHTML={{ __html: page.content }} />
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a14', color: '#e8e6f0', fontFamily: 'sans-serif', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>{page.title}</h1>
        <div style={{ lineHeight: 1.9, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.65)' }}>{page.content}</div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const { slug } = context.params

  try {
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL)

    try { await sql`UPDATE pages SET views = views + 1 WHERE slug = ${slug}` } catch {}

    const result = await sql`
      SELECT p.*, d.domain, d.website_url
      FROM pages p
      LEFT JOIN domains d ON p.domain_id = d.id
      WHERE p.slug = ${slug}
      LIMIT 1
    `

    if (!result.length) return { props: { notFound: true, page: null } }

    const row = result[0]
    return {
      props: {
        notFound: false,
        page: {
          slug: row.slug,
          title: row.title || slug,
          meta_description: row.meta_description || '',
          content: row.content || '',
          content_type: row.content_type || 'html',
          domain: row.domain || ''
        }
      }
    }
  } catch (err) {
    return { props: { notFound: true, page: null } }
  }
}
