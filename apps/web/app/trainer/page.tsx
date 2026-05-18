export default function TrainerPage() {
  return (
    <div style={{ minHeight: '100dvh', background: '#080509', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6AA882' }} />
      <h1 style={{ color: '#6AA882', fontFamily: 'Georgia, serif', fontSize: 32, fontStyle: 'italic', margin: 0 }}>Trainer</h1>
      <p style={{ color: 'rgba(240,232,236,0.4)', fontSize: 14, letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>Dashboard — coming in Prompt 10</p>
      <a href="/role-select" style={{ marginTop: 24, color: 'rgba(240,232,236,0.3)', fontSize: 12, textDecoration: 'none' }}>← Back to role select</a>
    </div>
  );
}
