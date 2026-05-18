'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const HIM = '#5085B0';

const TABS = [
  { label: 'Today',      href: '/him'         },
  { label: 'Forecast',   href: '/him/forecast' },
  { label: 'What to Say',href: '/him/say'      },
  { label: 'Learn',      href: '/him/learn'    },
];

export function HimNav() {
  const path = usePathname();
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(8,5,9,0.92)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(80,133,176,0.12)',
      display: 'flex', justifyContent: 'center',
    }}>
      <div style={{ display: 'flex', maxWidth: 480, width: '100%', padding: '0 4px' }}>
        {TABS.map(({ label, href }) => {
          const active = href === '/him' ? path === '/him' : path.startsWith(href);
          return (
            <Link key={href} href={href} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', padding: '10px 0 14px', gap: 4,
              textDecoration: 'none',
              color: active ? HIM : 'rgba(240,232,236,0.28)',
              fontSize: 10, fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '0.5px', fontWeight: active ? 500 : 400,
              transition: 'color 200ms ease',
            }}>
              {active && (
                <div style={{ width: 3, height: 3, borderRadius: '50%', background: HIM, marginBottom: 2 }} />
              )}
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
