import { HerNav } from './HerNav';

export const metadata = {
  title: 'Her Today · HerSide',
};

export default function HerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          flex: 1,
          paddingBottom: 80, // room for fixed nav
        }}
      >
        {children}
      </div>
      <HerNav />
    </div>
  );
}
