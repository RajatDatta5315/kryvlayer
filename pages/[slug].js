import { sql } from '@vercel/postgres'

export default function SEOPage({ page, notFound }) {
  if (notFound || !page) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a14', color: '#fff', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</div>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Page not found</p>
          <a href="/" style={{ color: '#a78bfa' }}>← Back to home</a>
        </div>
      </div>
    )
  }

  // If content is full HTML, render it directly
  if (page.content_type === 'html' && page.content.startsWith('<!DOCTYPE')) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: page.content }}
        style={{ minHeight: '100vh' }}
      />
    )
  }

  // Fallback for plain text content
  return (
    <>
      <head>
        <title>{page.title}</title>
        <meta name="description" content={page.meta_description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
      </head>
      <div style={{ minHeight: '100vh', background: '#0a0a14', color: '#e8e6f0', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1.5rem' }}>
          <a href="/" style={{ color: '#a78bfa', textDecoration: 'none', display: 'block', marginBottom: '2rem' }}>← KRYVLayer</a>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2 }}>{page.title}</h1>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '2rem', lineHeight: 1.9, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.65)' }}>
            {page.content}
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const { slug } = context.params

  try {
    // Track view
    try { await sql`UPDATE pages SET views = views + 1 WHERE slug = ${slug}` } catch {}

    const result = await sql`
      SELECT p.*, d.domain, d.website_url
      FROM pages p
      LEFT JOIN domains d ON p.domain_id = d.id
      WHERE p.slug = ${slug}
      LIMIT 1
    `

    if (!result.rows.length) return { props: { notFound: true, page: null } }

    const row = result.rows[0]
    return {
      props: {
        notFound: false,
        page: {
          slug: row.slug,
          title: row.title || slug,
          meta_description: row.meta_description || '',
          content: row.content || '',
          content_type: row.content_type || 'text',
          domain: row.domain || ''
        }
      }
    }
  } catch (err) {
    console.error('SSR error:', err)
    return { props: { notFound: true, page: null } }
  }
}
