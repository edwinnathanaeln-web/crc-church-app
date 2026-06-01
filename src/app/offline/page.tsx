export default function Offline() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#020203',
        color: '#EDEDEF',
        fontFamily: 'Inter, sans-serif',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <svg width="40" height="52" viewBox="0 0 28 36" fill="none" style={{ marginBottom: 24 }}>
        <rect x="11" y="0" width="6" height="36" rx="3" fill="#D4AF37" />
        <rect x="0" y="10" width="28" height="6" rx="3" fill="#D4AF37" />
      </svg>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>You&apos;re offline</h1>
      <p style={{ fontSize: 14, color: 'rgba(138,143,152,0.9)', maxWidth: 260 }}>
        Please check your connection and try again.
      </p>
    </div>
  );
}
