import { Suspense } from 'react';
import { TrainerInsight, TrainerInsightSkeleton } from '../components/trainer/TrainerInsight';
import { ClientDashboard } from '../components/trainer/ClientDashboard';


const TRAIN = '#6AA882';

export default function TrainerPage() {
  return (
    <div style={{ padding: '24px 20px 0' }}>
      {/* Wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: TRAIN }} />
        <span style={{ color: '#F0E8EC', fontFamily: 'Georgia, serif', fontSize: 20, fontStyle: 'italic' }}>HerSide</span>
        <span style={{ color: 'rgba(240,232,236,0.25)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', letterSpacing: '2px', textTransform: 'uppercase', marginLeft: 2 }}>Trainer</span>
      </div>

      {/* AI roster brief */}
      <Suspense fallback={<TrainerInsightSkeleton />}>
        <TrainerInsight />
      </Suspense>

      {/* Client dashboard */}
      <div style={{ marginTop: 16 }}>
        <ClientDashboard />
      </div>
    </div>
  );
}
