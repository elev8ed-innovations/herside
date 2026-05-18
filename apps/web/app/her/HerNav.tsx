'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { label: 'Today',    href: '/her'           },
  { label: 'Patterns', href: '/her/patterns'  },
  { label: 'Toolkit',  href: '/her/toolkit'   },
  { label: 'Mirror',   href: '/her/mirror'    },
  { label: 'Labs',     href: '/her/labs'      },
  { label: 'Privacy',  href: '/her/privacy'   },
];

export function HerNav() {
  const path = usePathname();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(8,5,9,0.92)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(240,232,236,0.07)',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          maxWidth: 480,
          width: '100%',
          padding: '0 4px',
        }}
      >
        {TABS.map(({ label, href }) => {
          const active = href === '/her' ? path === '/her' : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px 0 14px',
                gap: 4,
                textDecoration: 'none',
                color: active ? '#C96B84' : 'rgba(240,232,236,0.28)',
                fontSize: 10,
                fontFamily: 'DM Sans, sans-serif',
                letterSpacing: '0.5px',
                fontWeight: active ? 500 : 400,
                transition: 'color 200ms ease',
              }}
            >
              {active && (
                <div
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: '50%',
                    background: '#C96B84',
                    marginBottom: 2,
                  }}
                />
              )}
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
