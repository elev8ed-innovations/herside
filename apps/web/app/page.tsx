import { RubiksCube } from './components/RubiksCube';
import { ParticleField } from './components/ParticleField';

export const metadata = {
  title: 'HerSide',
};

export default function Home() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#080509',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <ParticleField />

      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 60% 55% at 50% 50%,
            rgba(201,107,132,0.09) 0%,
            rgba(139,104,192,0.05) 50%,
            transparent 80%)`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          marginBottom: 52,
          animation: 'fade-in-up 0.8s ease both',
        }}
      >
        <span
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 44,
            lineHeight: 1,
            letterSpacing: '-0.5px',
          }}
        >
          <span style={{ color: '#EDE5E0' }}>Her</span>
          <em style={{ color: '#C96B84' }}>Side</em>
        </span>
        <span
          style={{
            fontSize: 11,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: 'rgba(240,232,236,0.22)',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          herside.app
        </span>
      </div>

      <div style={{ animation: 'fade-in-up 0.8s 0.1s ease both', opacity: 0 }}>
        <RubiksCube />
      </div>

      <p
        style={{
          marginTop: 44,
          fontSize: 12,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: 'rgba(240,232,236,0.2)',
          fontFamily: 'DM Sans, sans-serif',
          animation: 'fade-in-up 0.8s 0.8s ease both',
          opacity: 0,
        }}
      >
        Tap a face to enter
      </p>

      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '18%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 260,
          height: 40,
          background: 'rgba(201,107,132,0.08)',
          filter: 'blur(30px)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
