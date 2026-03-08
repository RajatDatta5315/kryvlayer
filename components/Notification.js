export default function Notification({ msg, type = 'success' }) {
  const colors = {
    success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#16a34a' },
    error: { bg: '#fff5f5', border: '#fecaca', text: '#dc2626' },
    info: { bg: '#f0f0ff', border: '#c7d2fe', text: '#4f46e5' },
  }
  const c = colors[type] || colors.info
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
      padding: '14px 20px', background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: 12, color: c.text, fontSize: 13, fontWeight: 600,
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)', maxWidth: 360,
      animation: 'slideUp 0.3s ease',
    }}>
      {msg}
    </div>
  )
}
