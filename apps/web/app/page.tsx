import { CycleRing } from './components/CycleRing';
import { ParticleField } from './components/ParticleField';

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen bg-bg text-t1">
      <ParticleField />

      {/* ── Nav ─────────────────────────────────────────── */}
      <nav
        className="relative z-10 flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full"
      >
        <Wordmark size="sm" />
        <div className="flex items-center gap-6">
          <a
            href="#how-it-works"
            className="text-sm font-medium transition-colors"
            style={{ color: 'var(--t2)' }}
          >
            How it works
          </a>
          <a
            href="#for-partners"
            className="text-sm font-medium transition-colors"
            style={{ color: 'var(--t2)' }}
          >
            For partners
          </a>
          <a href="/login" className="btn-ghost text-sm font-medium px-5 py-2 rounded-[50px]">
            Sign in
          </a>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-12 pb-28 max-w-5xl mx-auto w-full">

        {/* Radial hero glow — decorative */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 55% at 50% 40%,
              rgba(201,107,132,0.10) 0%,
              rgba(139,104,192,0.06) 50%,
              transparent 80%)`,
          }}
        />

        {/* Animated cycle ring */}
        <div style={{ animation: 'fade-in-up 1s ease both' }}>
          <CycleRing />
        </div>

        {/* Wordmark */}
        <div style={{ animation: 'fade-in-up 1s 0.15s ease both', opacity: 0 }}>
          <Wordmark size="lg" />
        </div>

        {/* Tagline */}
        <h1
          className="mt-7 text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight max-w-2xl"
          style={{
            fontFamily: 'var(--font-playfair)',
            animation: 'fade-in-up 1s 0.25s ease both',
            opacity: 0,
          }}
        >
          Understand her cycle.{' '}
          <span className="gradient-her">Show up better.</span>
        </h1>

        {/* Sub-tagline */}
        <p
          className="mt-6 text-lg md:text-xl leading-relaxed max-w-xl"
          style={{
            color: 'var(--t2)',
            animation: 'fade-in-up 1s 0.35s ease both',
            opacity: 0,
          }}
        >
          Cycle intelligence for her. Clarity for everyone in her corner.
          She shares exactly what she wants — nothing more.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4 mt-10"
          style={{ animation: 'fade-in-up 1s 0.45s ease both', opacity: 0 }}
        >
          <a
            href="/onboarding"
            className="btn-primary inline-flex items-center justify-center px-9 py-4 rounded-[50px] text-sm font-medium"
          >
            Get Started Free
          </a>
          <a
            href="#how-it-works"
            className="btn-ghost inline-flex items-center justify-center px-9 py-4 rounded-[50px] text-sm font-medium"
          >
            See how it works
          </a>
        </div>

        <p
          className="mt-8 text-xs tracking-wider uppercase"
          style={{
            color: 'var(--t3)',
            animation: 'fade-in-up 1s 0.55s ease both',
            opacity: 0,
          }}
        >
          Privacy-first &nbsp;&middot;&nbsp; She controls everything &nbsp;&middot;&nbsp; No ads. Ever.
        </p>
      </section>

      {/* ── Section divider ─────────────────────────────── */}
      <div
        aria-hidden
        style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(201,107,132,0.2), rgba(139,104,192,0.2), transparent)' }}
      />

      {/* ── Phase ribbon ────────────────────────────────── */}
      <div className="relative z-10 py-5" style={{ background: 'var(--s1)' }}>
        <div className="flex max-w-3xl mx-auto">
          {[
            { label: 'Menstrual',  color: '#C96B84', note: 'Days 1–5',  sub: 'Release & Rest'     },
            { label: 'Follicular', color: '#6AA882', note: 'Days 6–13', sub: 'Rising Energy'       },
            { label: 'Ovulation',  color: '#C8943A', note: 'Days 14–16',sub: 'Peak Power'          },
            { label: 'Luteal',     color: '#8B68C0', note: 'Days 17–28',sub: 'Inward & Sensitive'  },
          ].map((phase, i) => (
            <div
              key={phase.label}
              className="flex-1 flex flex-col items-center gap-1 py-3 px-2"
              style={{
                borderLeft: i > 0 ? '1px solid var(--dim)' : undefined,
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: phase.color }} />
              <span className="text-xs font-medium" style={{ color: phase.color }}>{phase.label}</span>
              <span className="text-[10px] hidden sm:block" style={{ color: 'var(--t3)' }}>{phase.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ────────────────────────────────── */}
      <section
        id="how-it-works"
        className="relative z-10 py-28 px-6"
        style={{ background: 'var(--s1)' }}
      >
        <div className="max-w-5xl mx-auto">
          <p
            className="text-xs font-medium tracking-[4px] uppercase text-center mb-4"
            style={{ color: 'var(--her)' }}
          >
            Built for her circle
          </p>
          <h2
            className="text-3xl md:text-4xl text-center mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            One platform.{' '}
            <span className="gradient-phase-animated">Three perspectives.</span>
          </h2>
          <p
            className="text-center text-base max-w-lg mx-auto mb-16"
            style={{ color: 'var(--t2)' }}
          >
            Each person sees only what she chooses to share — tailored for
            their role and filtered by her privacy controls.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <RoleCard
              accentClass="card-her"
              accent="#C96B84"
              label="Her"
              headline="Full cycle intelligence"
              body="Track cycle, symptoms, labs, HRV, and sleep. AI surfaces real patterns grounded in her specific numbers — not generic advice."
              features={['Pattern analysis', 'Lab interpretation', 'Accountability mirror']}
            />
            <RoleCard
              accentClass="card-him"
              accent="#5085B0"
              label="Him"
              headline="Know how to show up"
              body="Daily phase guidance, scripts for what to say, a 28-day forecast, and the science behind why she feels what she feels."
              features={['Daily phase brief', '28-day forecast', 'What to say scripts']}
            />
            <RoleCard
              accentClass="card-train"
              accent="#6AA882"
              label="Trainer"
              headline="Train smarter, not harder"
              body="Phase-synced session plans for every female client. Push when she's strongest, pull back when biology says to."
              features={['Intensity recommendations', 'Client phase dashboard', 'Science library']}
            />
          </div>
        </div>
      </section>

      {/* ── Section divider ─────────────────────────────── */}
      <div
        aria-hidden
        style={{ height: 60, background: 'linear-gradient(to bottom, var(--s1), var(--bg))' }}
      />

      {/* ── For partners ────────────────────────────────── */}
      <section
        id="for-partners"
        className="relative z-10 py-20 px-6"
        style={{ background: 'var(--bg)' }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Partner preview cards */}
          <div className="flex flex-col gap-4">
            <PartnerCard
              day="Day 14"
              phase="Ovulation"
              accentColor="#C8943A"
              action="Be fully present — quality time lands deepest right now. She is at her most open."
              avoid={["Don't cancel plans tonight", "Don't check your phone during dinner"]}
            />
            <PartnerCard
              day="Day 23"
              phase="Luteal"
              accentColor="#8B68C0"
              action="Less noise, fewer decisions, more warmth. Presence over performance."
              avoid={["Don't interpret quiet as rejection", "Don't bring up big decisions"]}
            />

            {/* Attribution note */}
            <p
              className="text-xs text-center mt-1"
              style={{ color: 'var(--t3)' }}
            >
              Only what she chooses to share — nothing more.
            </p>
          </div>

          {/* Copy */}
          <div>
            <p
              className="text-xs font-medium tracking-[4px] uppercase mb-5"
              style={{ color: 'var(--him)' }}
            >
              For partners
            </p>
            <h2
              className="text-3xl md:text-4xl mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Stop guessing.{' '}
              <span className="gradient-him">Start understanding.</span>
            </h2>
            <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--t2)' }}>
              She has a 28-day cycle that shapes her energy, mood, communication,
              and needs. HerSide translates that biology into daily, practical
              guidance — so you can show up with intention, not just instinct.
            </p>
            <p className="text-base leading-relaxed mb-12" style={{ color: 'var(--t2)' }}>
              The most caring thing you can do is understand her. This is
              the tool that makes that possible.
            </p>

            <div className="flex flex-col gap-6">
              {[
                { stat: '28%',  note: 'of partners feel they truly understand her cycle' },
                { stat: '3×',   note: 'better relationship outcomes with cycle awareness' },
                { stat: '48h',  note: 'invite link — she controls access from day one' },
              ].map(({ stat, note }) => (
                <div key={stat} className="flex items-center gap-5">
                  <span
                    className="text-3xl font-medium shrink-0"
                    style={{ color: 'var(--him)', fontFamily: 'var(--font-playfair)' }}
                  >
                    {stat}
                  </span>
                  <span className="text-sm leading-snug" style={{ color: 'var(--t2)' }}>{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section divider ─────────────────────────────── */}
      <div
        aria-hidden
        style={{ height: 60, background: 'linear-gradient(to bottom, var(--bg), var(--s1))' }}
      />

      {/* ── Privacy ─────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6" style={{ background: 'var(--s1)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-xs font-medium tracking-[4px] uppercase mb-4"
            style={{ color: 'var(--her)' }}
          >
            Privacy first
          </p>
          <h2
            className="text-3xl md:text-4xl mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            She controls{' '}
            <span className="gradient-her">everything.</span>
          </h2>
          <p
            className="text-base leading-relaxed mb-14 max-w-xl mx-auto"
            style={{ color: 'var(--t2)' }}
          >
            Granular per-connection permission toggles. Revoke access instantly
            and silently — no notification sent. Her data is never sold,
            never used for ads, never shared with third parties.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Cycle dates',     note: 'Never visible to anyone else',  color: 'var(--ok)' },
              { label: 'Symptoms & mood', note: 'Her eyes only, always',          color: 'var(--ok)' },
              { label: 'Revoke access',   note: 'Instant — no notification sent', color: 'var(--ok)' },
            ].map(({ label, note, color }) => (
              <div
                key={label}
                className="card flex flex-col items-center gap-2 p-6"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full mb-2"
                  style={{ background: color }}
                />
                <span className="text-sm font-medium" style={{ color: 'var(--t1)' }}>{label}</span>
                <span className="text-xs leading-snug text-center" style={{ color: 'var(--t3)' }}>{note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section divider ─────────────────────────────── */}
      <div
        aria-hidden
        style={{ height: 60, background: 'linear-gradient(to bottom, var(--s1), var(--bg))' }}
      />

      {/* ── Final CTA ───────────────────────────────────── */}
      <section className="relative z-10 py-36 px-6 text-center" style={{ background: 'var(--bg)' }}>
        {/* Radial glow */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 60%,
              rgba(201,107,132,0.10) 0%,
              rgba(139,104,192,0.06) 50%,
              transparent 80%)`,
          }}
        />
        <Wordmark size="md" />
        <p
          className="mt-8 text-xl md:text-2xl max-w-lg mx-auto leading-relaxed"
          style={{ color: 'var(--t2)', fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
        >
          The most caring thing you can do is understand her.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-12 justify-center">
          <a
            href="/onboarding"
            className="btn-primary inline-flex items-center justify-center px-12 py-5 rounded-[50px] text-sm font-medium"
          >
            Get Started Free
          </a>
        </div>
        <p
          className="mt-7 text-xs tracking-wider uppercase"
          style={{ color: 'var(--t3)' }}
        >
          No credit card required
        </p>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer
        className="relative z-10 py-10 px-8 border-t"
        style={{ borderColor: 'var(--dim)' }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Wordmark size="sm" />
          <p className="text-xs tracking-wider" style={{ color: 'var(--t3)' }}>
            herside.app &nbsp;&middot;&nbsp; Privacy-first cycle intelligence
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────── */

function Wordmark({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const fontSizes = { sm: '22px', md: '34px', lg: '50px' };
  const tagSizes  = { sm: '0px',  md: '0px',  lg: '11px' };

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: fontSizes[size],
          lineHeight: 1,
          letterSpacing: '-0.5px',
        }}
      >
        <span style={{ color: '#EDE5E0' }}>Her</span>
        <em style={{ color: 'var(--her)' }}>Side</em>
      </span>
      {size === 'lg' && (
        <span
          style={{
            fontSize: tagSizes[size],
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: 'var(--t3)',
          }}
        >
          herside.app
        </span>
      )}
    </div>
  );
}

function RoleCard({
  accent,
  accentClass,
  label,
  headline,
  body,
  features,
}: {
  accent: string;
  accentClass: string;
  label: string;
  headline: string;
  body: string;
  features: string[];
}) {
  return (
    <div className={`card ${accentClass} flex flex-col gap-5 p-7`}>
      {/* Accent bar */}
      <div
        className="w-8 h-0.5 rounded-full"
        style={{ background: accent }}
      />
      <div>
        <span
          className="text-xs font-medium tracking-[3px] uppercase block mb-3"
          style={{ color: accent }}
        >
          {label}
        </span>
        <h3
          className="text-xl font-medium leading-snug mb-3"
          style={{ fontFamily: 'var(--font-playfair)', color: 'var(--t1)' }}
        >
          {headline}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--t2)' }}>
          {body}
        </p>
      </div>
      <div className="flex flex-col gap-2 pt-2" style={{ borderTop: '1px solid var(--dim)' }}>
        {features.map((f) => (
          <div key={f} className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full shrink-0" style={{ background: accent }} />
            <span className="text-xs" style={{ color: 'var(--t3)' }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PartnerCard({
  day,
  phase,
  accentColor,
  action,
  avoid,
}: {
  day: string;
  phase: string;
  accentColor: string;
  action: string;
  avoid: string[];
}) {
  return (
    <div
      className="card flex flex-col gap-4 p-6"
      style={{ borderColor: `rgba(${hexToRgb(accentColor)}, 0.25)` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
          <span
            className="text-xs font-medium tracking-[2px] uppercase"
            style={{ color: accentColor }}
          >
            {phase}
          </span>
        </div>
        <span className="text-xs" style={{ color: 'var(--t3)' }}>{day}</span>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: 'var(--t1)' }}>
        {action}
      </p>

      <div
        className="flex flex-col gap-1.5 pt-3"
        style={{ borderTop: '1px solid var(--dim)' }}
      >
        <span className="text-[10px] tracking-wider uppercase mb-1" style={{ color: 'var(--t3)' }}>
          Avoid today
        </span>
        {avoid.map((a) => (
          <p key={a} className="text-xs" style={{ color: 'rgba(240,232,236,0.35)' }}>
            — {a}
          </p>
        ))}
      </div>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
