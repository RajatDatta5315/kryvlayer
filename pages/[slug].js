import Head from 'next/head'
import { sql } from '@vercel/postgres'

export default function SEOPage({ page }) {
  if (!page) {
    return <div className="min-h-screen flex items-center justify-center">
      <p>Page not found</p>
    </div>
  }

  return (
    <>
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.meta_description} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.meta_description} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-xl font-bold text-purple-600">KRYVLayer</h1>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-16 max-w-4xl">
          <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {page.title}
            </h1>
            
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              {page.content}
            </div>

            <div className="mt-12 bg-purple-50 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-purple-900 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-purple-700 mb-6">
                Contact us today to learn more about our services
              </p>
              <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-500 transition">
                Get a Free Quote
              </button>
            </div>
          </article>
        </main>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const { slug } = context.params

  try {
    const result = await sql`SELECT * FROM pages WHERE slug = ${slug} LIMIT 1`
    
    if (result.rows.length === 0) {
      return { props: { page: null } }
    }

    return {
      props: {
        page: {
          title: result.rows[0].title,
          meta_description: result.rows[0].meta_description,
          content: result.rows[0].content
        }
      }
    }
  } catch (error) {
    console.error('Error fetching page:', error)
    return { props: { page: null } }
  }
}
