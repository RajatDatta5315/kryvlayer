export async function generateContent(prompt) {
  try {
    const response = await fetch('/api/nehira/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: prompt })
    })

    const data = await response.json()
    return data.response
  } catch (error) {
    console.error('NEHIRA generation error:', error)
    return 'Error generating content'
  }
}
