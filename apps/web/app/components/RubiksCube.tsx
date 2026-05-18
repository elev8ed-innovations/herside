'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

// ── Geometry ─────────────────────────────────────────────────────
const SIZE = 280;
const HALF = SIZE / 2;

// ── Face definitions ──────────────────────────────────────────────
type FaceId = 'front' | 'back' | 'right' | 'left' | 'top' | 'bottom';

interface FaceDef {
  color: string;
  label: string | null;
  route: string | null;
  snapX: number; // cube rotation to bring this face forward
  snapY: number;
}

const FACES: Record<FaceId, FaceDef> = {
  front:  { color: '#C96B84', label: 'Her',           route: '/her',      snapX: 0,   snapY: 0   },
  back:   { color: '#5085B0', label: 'Him',           route: '/him',      snapX: 0,   snapY: 180 },
  right:  { color: '#6AA882', label: 'Trainer',       route: '/trainer',  snapX: 0,   snapY: -90 },
  left:   { color: '#C8943A', label: 'IronMind',      route: '/ironmind', snapX: 0,   snapY: 90  },
  top:    { color: '#8B68C0', label: 'Perimenopause', route: '/peri',     snapX: 90,  snapY: 0   },
  bottom: { color: '#1A1520', label: null,             route: null,        snapX: -90, snapY: 0   },
};

const FACE_TRANSFORM: Record<FaceId, string> = {
  front:  `translateZ(${HALF}px)`,
  back:   `rotateY(180deg) translateZ(${HALF}px)`,
  right:  `rotateY(90deg) translateZ(${HALF}px)`,
  left:   `rotateY(-90deg) translateZ(${HALF}px)`,
  top:    `rotateX(90deg) translateZ(${HALF}px)`,
  bottom: `rotateX(-90deg) translateZ(${HALF}px)`,
};

const FACE_IDS = Object.keys(FACES) as FaceId[];
const ALL_COLORS = FACE_IDS.map(id => FACES[id].color);

// ── Tile helpers ──────────────────────────────────────────────────
function lightenHex(hex: string, amount: number): string {
  const ch = (offset: number) =>
    Math.min(255, parseInt(hex.slice(offset, offset + 2), 16) + amount)
      .toString(16).padStart(2, '0');
  return `#${ch(1)}${ch(3)}${ch(5)}`;
}

function makeTiles(scrambled: boolean): Record<FaceId, string[]> {
  return Object.fromEntries(
    FACE_IDS.map(id => [
      id,
      Array.from({ length: 9 }, (_, i) =>
        scrambled
          ? ALL_COLORS[Math.floor(Math.random() * ALL_COLORS.length)]
          : i === 4 ? lightenHex(FACES[id].color, 28) : FACES[id].color
      ),
    ])
  ) as Record<FaceId, string[]>;
}

// ── Main component ────────────────────────────────────────────────
type Phase = 'scrambled' | 'solving' | 'solved';

export function RubiksCube() {
  const router = useRouter();
  const cubeRef = useRef<HTMLDivElement>(null);

  // Rotation lives in a ref — updated directly on DOM to avoid re-render per frame
  const rotRef = useRef({ x: -20, y: 25 });
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0 });
  const rafRef = useRef<number | null>(null);
  const phaseRef = useRef<Phase>('scrambled');

  const [tiles, setTiles] = useState<Record<FaceId, string[]>>(() => makeTiles(true));
  const [phase, setPhase] = useState<Phase>('scrambled');
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const applyRotation = useCallback((transition = '') => {
    if (!cubeRef.current) return;
    cubeRef.current.style.transition = transition;
    cubeRef.current.style.transform =
      `rotateX(${rotRef.current.x}deg) rotateY(${rotRef.current.y}deg)`;
  }, []);

  // ── Solve animation ───────────────────────────────────────────
  useEffect(() => {
    const startDelay = setTimeout(() => {
      setPhase('solving');
      phaseRef.current = 'solving';

      const solved = makeTiles(false);

      // All 54 tile positions, shuffled
      const positions: [FaceId, number][] = FACE_IDS.flatMap(id =>
        Array.from({ length: 9 }, (_, i): [FaceId, number] => [id, i])
      );
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }

      const STEPS = 30;
      const perStep = Math.ceil(positions.length / STEPS);
      let step = 0;

      const interval = setInterval(() => {
        step++;
        const from = (step - 1) * perStep;
        const to = Math.min(from + perStep, positions.length);

        setTiles(prev => {
          const next = Object.fromEntries(
            FACE_IDS.map(id => [id, [...prev[id]]])
          ) as Record<FaceId, string[]>;
          for (let k = from; k < to; k++) {
            const [id, idx] = positions[k];
            next[id][idx] = solved[id][idx];
          }
          return next;
        });

        if (step >= STEPS) {
          clearInterval(interval);
          setTiles(makeTiles(false));
          setTimeout(() => {
            setPhase('solved');
            phaseRef.current = 'solved';
          }, 250);
        }
      }, 60);

      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(startDelay);
  }, []);

  // ── Auto-spin ─────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'solved') return;

    let lastTime: number | null = null;

    const spin = (time: number) => {
      if (lastTime !== null && !dragRef.current.active && phaseRef.current === 'solved') {
        const dt = Math.min(time - lastTime, 50);
        rotRef.current.y += dt * 0.022;
        applyRotation();
      }
      lastTime = time;
      rafRef.current = requestAnimationFrame(spin);
    };

    rafRef.current = requestAnimationFrame(spin);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [phase, applyRotation]);

  // ── Drag ──────────────────────────────────────────────────────
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isTransitioning) return;
    dragRef.current = { active: true, lastX: e.clientX, lastY: e.clientY };
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [isTransitioning]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.lastX;
    const dy = e.clientY - dragRef.current.lastY;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
    rotRef.current.y += dx * 0.5;
    rotRef.current.x = Math.max(-75, Math.min(75, rotRef.current.x - dy * 0.5));
    applyRotation();
  }, [applyRotation]);

  const handlePointerUp = useCallback(() => {
    dragRef.current.active = false;
    setIsDragging(false);
  }, []);

  // ── Face tap ──────────────────────────────────────────────────
  const handleFaceTap = useCallback((faceId: FaceId, e: React.MouseEvent) => {
    const def = FACES[faceId];
    if (phase !== 'solved' || isTransitioning || !def.route) return;
    e.stopPropagation();

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    setIsTransitioning(true);

    rotRef.current = { x: def.snapX, y: def.snapY };
    applyRotation('transform 600ms cubic-bezier(0.34, 1.1, 0.64, 1)');

    setTimeout(() => router.push(def.route!), 700);
  }, [phase, isTransitioning, applyRotation, router]);

  return (
    <div
      style={{ perspective: '900px', perspectiveOrigin: '50% 50%', userSelect: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div
        ref={cubeRef}
        style={{
          width: SIZE,
          height: SIZE,
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotRef.current.x}deg) rotateY(${rotRef.current.y}deg)`,
          cursor: isDragging ? 'grabbing' : 'grab',
          willChange: 'transform',
        }}
      >
        {FACE_IDS.map(id => (
          <CubeFace
            key={id}
            faceId={id}
            tiles={tiles[id]}
            phase={phase}
            onTap={handleFaceTap}
          />
        ))}
      </div>
    </div>
  );
}

// ── CubeFace ──────────────────────────────────────────────────────
interface CubeFaceProps {
  faceId: FaceId;
  tiles: string[];
  phase: Phase;
  onTap: (id: FaceId, e: React.MouseEvent) => void;
}

function CubeFace({ faceId, tiles, phase, onTap }: CubeFaceProps) {
  const def = FACES[faceId];
  const clickable = phase === 'solved' && def.route !== null;

  return (
    <div
      onClick={clickable ? e => onTap(faceId, e) : undefined}
      style={{
        position: 'absolute',
        inset: 0,
        transform: FACE_TRANSFORM[faceId],
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        background: '#08050B',
        borderRadius: 8,
        overflow: 'hidden',
        cursor: clickable ? 'pointer' : 'inherit',
        boxShadow: 'inset 0 0 0 1px rgba(240,232,236,0.06)',
      }}
    >
      {/* 3×3 tile grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 5,
          padding: 9,
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        {tiles.map((color, i) => (
          <div
            key={i}
            style={{
              background: color,
              borderRadius: 9,
              transition: 'background-color 170ms ease',
            }}
          />
        ))}
      </div>

      {/* Label band — bottom frosted strip */}
      {def.label && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 44,
            background: 'rgba(8, 5, 9, 0.75)',
            borderTop: '1px solid rgba(240,232,236,0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {/* Color pip */}
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: def.color,
              flexShrink: 0,
              opacity: 0.8,
            }}
          />
          <span
            style={{
              color: '#F0E8EC',
              fontSize: 11,
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              opacity: 0.8,
            }}
          >
            {def.label}
          </span>
        </div>
      )}

      {/* Hover shimmer overlay — only when solved */}
      {clickable && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 50% 50%, ${def.color}18 0%, transparent 70%)`,
            opacity: 0,
            transition: 'opacity 300ms ease',
          }}
          className="face-hover-shimmer"
        />
      )}
    </div>
  );
}
