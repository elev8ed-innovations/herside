import { TrainerNav } from './TrainerNav';

export const metadata = { title: 'HerSide · Trainer' };

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 480, flex: 1, paddingBottom: 80 }}>
        {children}
      </div>
      <TrainerNav />
    </div>
  );
}
