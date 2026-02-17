export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { message, context } = req.body
  if (!message) return res.status(400).json({ error: 'message required' })

  const systemContext = context
    ? `You are NEHIRA, an AI assistant for KRYVLayer — a programmatic SEO platform. Context: ${context}. Help the user with SEO strategy, keyword research, and content optimization.`
    : `You are NEHIRA, an AI SEO expert for KRYVLayer. Give concise, actionable SEO advice.`

  try {
    const response = await fetch(process.env.NEHIRA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEHIRA_API_KEY}`
      },
      body: JSON.stringify({
        message: `${systemContext}\n\nUser: ${message}`
      })
    })

    if (!response.ok) throw new Error(`NEHIRA ${response.status}`)

    const raw = await response.text()
    let data
    try { data = JSON.parse(raw) } catch { return res.status(200).json({ success: true, response: raw }) }

    return res.status(200).json({
      success: true,
      response: data.response || data.message || data.text || data.content || 'No response from NEHIRA'
    })

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
