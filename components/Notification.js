export default function Notification({ notification }) {
  if (!notification) return null

  return (
    <div style={{
      position: 'fixed', top: '1rem', right: '1rem', zIndex: 999,
      padding: '0.875rem 1.5rem', borderRadius: 12, fontWeight: 600, fontSize: '0.9rem',
      background: notification.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(74,222,128,0.15)',
      border: `1px solid ${notification.type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(74,222,128,0.4)'}`,
      color: notification.type === 'error' ? '#fca5a5' : '#4ade80',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    }}>
      {notification.msg}
    </div>
  )
}
