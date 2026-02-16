export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message } = req.body

    const response = await fetch(process.env.NEHIRA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEHIRA_API_KEY}`
      },
      body: JSON.stringify({ message })
    })

    const data = await response.json()
    
    return res.status(200).json({
      success: true,
      response: data.response || data.message || JSON.stringify(data)
    })

  } catch (error) {
    console.error('NEHIRA error:', error)
    return res.status(500).json({ error: error.message })
  }
}
