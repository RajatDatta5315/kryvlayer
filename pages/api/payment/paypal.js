export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // PayPal integration coming soon
  // For now, just return success
  return res.status(200).json({
    success: true,
    message: 'PayPal integration will be added soon',
    paypalButton: 'https://www.paypal.com/donate'
  })
}
