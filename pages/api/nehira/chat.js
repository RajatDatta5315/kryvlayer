export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { message } = req.body
  if (!message) return res.status(400).json({ error: 'message required' })

  try {
    const response = await fetch(process.env.NEHIRA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEHIRA_API_KEY}`
      },
      body: JSON.stringify({ message })
    })

    if (!response.ok) {
      const errorText = await response.text()
      return res.status(response.status).json({ error: `NEHIRA error: ${response.status}`, details: errorText })
    }

    const raw = await response.text()
    if (!raw || !raw.trim()) return res.status(200).json({ success: true, response: '' })

    let data
    try { data = JSON.parse(raw) } catch { return res.status(200).json({ success: true, response: raw }) }

    return res.status(200).json({
      success: true,
      response: data.response || data.message || data.text || data.content || JSON.stringify(data)
    })

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
