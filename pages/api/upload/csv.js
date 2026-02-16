export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { csvData, businessId } = req.body
    
    // Parse CSV (simple implementation)
    const lines = csvData.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',')
    
    const keywords = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',')
      keywords.push({
        keyword: values[0]?.trim(),
        city: values[1]?.trim()
      })
    }

    return res.status(200).json({
      success: true,
      count: keywords.length,
      keywords
    })

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
