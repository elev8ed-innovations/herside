// Invite acceptance requires a live backend — static placeholder for demo.
export function generateStaticParams() { return [{ token: 'demo' }]; }
export const dynamicParams = false;

export default function AcceptInvitePage() {
  return (
    <div style={{
      minHeight: '100dvh', background: '#080509',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', gap: 16,
    }}>
      <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 22, color: '#F0E8EC' }}>
        HerSide
      </span>
      <div style={{
        width: '100%', maxWidth: 360, background: '#181320',
        border: '1px solid rgba(240,232,236,0.09)', borderTop: '3px solid #C96B84',
        borderRadius: 20, padding: '28px 24px', textAlign: 'center', display: 'flex',
        flexDirection: 'column', gap: 12, alignItems: 'center',
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#C96B84' }} />
        <p style={{ color: '#F0E8EC', fontSize: 17, fontFamily: 'Georgia, serif', fontStyle: 'italic', margin: 0 }}>
          You've been invited
        </p>
        <p style={{ color: 'rgba(240,232,236,0.4)', fontSize: 13, fontFamily: 'DM Sans, sans-serif', margin: 0, lineHeight: 1.5 }}>
          Invite links connect in the HerSide app.<br />Download HerSide to accept this invite.
        </p>
        <a href="/" style={{
          marginTop: 8, display: 'inline-block', padding: '11px 28px',
          borderRadius: 50, background: '#C96B84', color: '#fff',
          fontSize: 13, fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
          textDecoration: 'none',
        }}>
          Learn about HerSide
        </a>
      </div>
    </div>
  );
}
