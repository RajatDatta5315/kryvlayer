export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { domain } = req.body
  if (!domain) return res.status(400).json({ error: 'Domain required' })

  const KRYVLAYER_IP = '76.76.21.21'
  const KRYVLAYER_CNAME = 'cname.kryvlayer.app'

  try {
    const isSubdomain = domain.split('.').length > 2
    let connected = false
    let foundValue = null
    let recordType = isSubdomain ? 'CNAME' : 'A'

    // Use Cloudflare DNS-over-HTTPS — free, real, no API key
    const dohUrl = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${recordType}`
    
    const dnsRes = await fetch(dohUrl, {
      headers: { 'Accept': 'application/dns-json' }
    })

    if (!dnsRes.ok) throw new Error('DNS lookup failed')

    const dnsData = await dnsRes.json()
    const answers = dnsData.Answer || []

    for (const answer of answers) {
      const val = (answer.data || '').replace(/\.$/, '').toLowerCase()
      foundValue = val

      if (recordType === 'A' && val === KRYVLAYER_IP) {
        connected = true
        break
      }
      if (recordType === 'CNAME' && val === KRYVLAYER_CNAME.toLowerCase()) {
        connected = true
        break
      }
    }

    // Also try A record if CNAME not found
    if (!connected && isSubdomain && answers.length > 0) {
      const aUrl = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=A`
      const aRes = await fetch(aUrl, { headers: { 'Accept': 'application/dns-json' } })
      const aData = await aRes.json()
      const aAnswers = aData.Answer || []
      for (const a of aAnswers) {
        if ((a.data || '').trim() === KRYVLAYER_IP) {
          connected = true
          foundValue = a.data
          break
        }
      }
    }

    return res.status(200).json({
      success: true,
      domain,
      connected,
      recordType,
      foundValue,
      expectedValue: isSubdomain ? KRYVLAYER_CNAME : KRYVLAYER_IP,
      message: connected
        ? `Domain connected to KRYVLayer`
        : `DNS not pointing to KRYVLayer yet. Found: ${foundValue || 'nothing'}`
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      connected: false,
      error: error.message
    })
  }
}
