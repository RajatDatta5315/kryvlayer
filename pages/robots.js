export default function Robots() {
  return null
}

export async function getServerSideProps({ res }) {
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard
Disallow: /auth

Sitemap: https://kryvlayer.vercel.app/sitemap.xml`

  res.setHeader('Content-Type', 'text/plain')
  res.write(robots)
  res.end()

  return { props: {} }
}
