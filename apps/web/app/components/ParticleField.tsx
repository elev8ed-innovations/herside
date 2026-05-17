'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

const COLORS = [
  'rgba(201,107,132,0.5)',
  'rgba(80,133,176,0.4)',
  'rgba(106,168,130,0.4)',
  'rgba(139,104,192,0.5)',
  'rgba(200,148,58,0.35)',
];

export function ParticleField() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 32 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: 20 + Math.random() * 80, // avoid very top
        size: Math.random() * 2.5 + 0.8,
        delay: Math.random() * 14,
        duration: Math.random() * 14 + 12,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }))
    );
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            opacity: 0,
            animation: `float-particle ${p.duration}s ${p.delay}s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
}
