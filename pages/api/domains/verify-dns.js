export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { domain } = req.body

  if (!domain) {
    return res.status(400).json({ error: 'Domain required' })
  }

  try {
    // Try to resolve DNS by hitting the domain
    // In production, use a DNS lookup service
    // For now we simulate: if domain is reachable, it's connected
    
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    let connected = false

    try {
      const response = await fetch(`https://${domain}`, {
        signal: controller.signal,
        redirect: 'follow'
      })
      connected = response.status < 500
    } catch {
      // DNS might not be propagated yet
      connected = false
    } finally {
      clearTimeout(timeout)
    }

    return res.status(200).json({
      success: true,
      domain,
      connected,
      message: connected
        ? 'Domain is connected to KRYVLayer'
        : 'Domain not yet connected. Check DNS settings or wait for propagation.'
    })

  } catch (error) {
    return res.status(500).json({
      error: 'Verification failed',
      message: error.message,
      connected: false
    })
  }
}
