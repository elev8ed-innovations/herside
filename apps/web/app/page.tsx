export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-bg text-t1">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full">
        <Wordmark size="sm" />
        <div className="flex items-center gap-6">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-t2 hover:text-t1 transition-colors"
          >
            How it works
          </a>
          <a
            href="#for-partners"
            className="text-sm font-medium text-t2 hover:text-t1 transition-colors"
          >
            For partners
          </a>
          <a
            href="/login"
            className="btn-ghost text-sm font-medium px-5 py-2 rounded-[50px]"
          >
            Sign in
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-16 pb-32 max-w-4xl mx-auto w-full">

        {/* Phase ring decoration */}
        <div className="relative flex items-center justify-center mb-12">
          <PhaseOrb />
        </div>

        {/* Wordmark */}
        <Wordmark size="lg" />

        {/* Tagline */}
        <h1
          className="mt-6 text-4xl md:text-5xl leading-tight tracking-tight max-w-2xl"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Understand her cycle.{" "}
          <em style={{ color: "var(--her)" }}>Show up better.</em>
        </h1>

        {/* Sub-tagline */}
        <p
          className="mt-6 text-lg leading-relaxed max-w-xl"
          style={{ color: "var(--t2)" }}
        >
          HerSide gives women full visibility into their cycle — and gives
          the people in her corner exactly what they need to support her,
          with only what she chooses to share.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <a
            href="/onboarding"
            className="btn-primary inline-flex items-center justify-center px-8 py-4 rounded-[50px] text-sm font-medium"
          >
            Get Started
          </a>
          <a
            href="#how-it-works"
            className="btn-ghost inline-flex items-center justify-center px-8 py-4 rounded-[50px] text-sm font-medium"
          >
            See how it works
          </a>
        </div>

        {/* Trust note */}
        <p className="mt-8 text-xs tracking-wider uppercase" style={{ color: "var(--t3)" }}>
          Privacy-first &nbsp;&middot;&nbsp; She controls everything &nbsp;&middot;&nbsp; No ads. Ever.
        </p>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="py-24 px-6"
        style={{ background: "var(--s1)" }}
      >
        <div className="max-w-5xl mx-auto">
          <p
            className="text-xs font-medium tracking-[4px] uppercase text-center mb-4"
            style={{ color: "var(--her)" }}
          >
            Built for her circle
          </p>
          <h2
            className="text-3xl md:text-4xl text-center mb-16"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            One platform. Three perspectives.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RoleCard
              label="Her"
              accent="var(--her)"
              headline="Full cycle intelligence"
              body="Track her cycle, symptoms, labs, HRV, and patterns — all in one place. AI analyzes her data and surfaces real insights grounded in her numbers."
            />
            <RoleCard
              label="Him"
              accent="var(--him)"
              headline="Know how to show up"
              body="Daily phase guidance, what to say, what to avoid, and a 28-day forecast — so he can be present in the way she actually needs, not just well-meaning."
            />
            <RoleCard
              label="Trainer"
              accent="var(--train)"
              headline="Train smarter, not harder"
              body="Phase-synced session plans for every female client. Push when she's strongest, pull back when her biology says to. Science-backed protocol, zero guesswork."
            />
          </div>
        </div>
      </section>

      {/* For partners */}
      <section
        id="for-partners"
        className="py-24 px-6"
        style={{ background: "var(--bg)" }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Visual */}
          <div className="flex flex-col gap-4">
            <PartnerCard
              day="Day 18"
              phase="Ovulation"
              accent="var(--ph-o)"
              action="Be fully present — quality time lands deepest right now."
              avoid={["Don't plan solo activities tonight", "Don't cancel plans"]}
            />
            <PartnerCard
              day="Day 24"
              phase="Luteal"
              accent="var(--ph-l)"
              action="Less noise, fewer decisions, more warmth. Presence over performance."
              avoid={["Don't bring up big decisions", "Don't interpret quiet as rejection"]}
            />
          </div>

          {/* Copy */}
          <div>
            <p
              className="text-xs font-medium tracking-[4px] uppercase mb-4"
              style={{ color: "var(--him)" }}
            >
              For partners
            </p>
            <h2
              className="text-3xl md:text-4xl mb-6 leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Stop guessing.{" "}
              <em style={{ color: "var(--him)" }}>Start understanding.</em>
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: "var(--t2)" }}>
              She has a 28-day cycle that shapes her energy, mood, communication,
              and needs. HerSide translates that biology into daily, actionable
              guidance — so you can show up with intention, not just instinct.
            </p>
            <p className="text-base leading-relaxed mb-10" style={{ color: "var(--t2)" }}>
              You only see what she chooses to share. No oversharing, no guessing —
              just the context you need to be present.
            </p>

            <div className="flex flex-col gap-4">
              {[
                { stat: "28%", label: "of partners understand the menstrual cycle" },
                { stat: "3x", label: "better relationship outcomes with cycle awareness" },
                { stat: "48h", label: "invite link — she's in control from day one" },
              ].map(({ stat, label }) => (
                <div key={stat} className="flex items-center gap-4">
                  <span
                    className="text-2xl font-medium"
                    style={{ color: "var(--him)", fontFamily: "var(--font-playfair)" }}
                  >
                    {stat}
                  </span>
                  <span className="text-sm" style={{ color: "var(--t2)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Privacy section */}
      <section
        className="py-24 px-6"
        style={{ background: "var(--s1)" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-xs font-medium tracking-[4px] uppercase mb-4"
            style={{ color: "var(--her)" }}
          >
            Privacy first
          </p>
          <h2
            className="text-3xl md:text-4xl mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            She controls everything.
          </h2>
          <p className="text-base leading-relaxed mb-12" style={{ color: "var(--t2)" }}>
            Every connection has granular permission toggles. Exact cycle dates are
            never shared. Symptoms are never shared with trainers. She can revoke
            access instantly and silently — no notification sent. Her data is never
            sold, never used for ads.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Exact cycle dates", note: "Never shared with anyone" },
              { label: "Symptoms + mood", note: "Her eyes only, always" },
              { label: "Revoke access", note: "Instant and silent" },
            ].map(({ label, note }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 p-6 rounded-[20px]"
                style={{ background: "var(--s2)", border: "1px solid var(--dim)" }}
              >
                <div
                  className="w-2 h-2 rounded-full mb-2"
                  style={{ background: "var(--ok)" }}
                />
                <span className="text-sm font-medium" style={{ color: "var(--t1)" }}>{label}</span>
                <span className="text-xs" style={{ color: "var(--t3)" }}>{note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 text-center" style={{ background: "var(--bg)" }}>
        <Wordmark size="md" />
        <p
          className="mt-6 text-xl max-w-lg mx-auto leading-relaxed"
          style={{ color: "var(--t2)", fontFamily: "var(--font-playfair)" }}
        >
          The most caring thing you can do is understand her.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
          <a
            href="/onboarding"
            className="btn-primary inline-flex items-center justify-center px-10 py-4 rounded-[50px] text-sm font-medium"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-10 px-8 border-t"
        style={{ borderColor: "var(--dim)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Wordmark size="sm" />
          <p className="text-xs tracking-wider" style={{ color: "var(--t3)" }}>
            herside.app &nbsp;&middot;&nbsp; Privacy-first cycle intelligence
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

function Wordmark({ size }: { size: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { font: "22px", tag: "9px" },
    md: { font: "32px", tag: "10px" },
    lg: { font: "48px", tag: "11px" },
  };
  const { font, tag } = sizes[size];

  return (
    <div className="flex flex-col items-center gap-1">
      <span style={{ fontFamily: "Georgia, serif", fontSize: font, lineHeight: 1 }}>
        <span style={{ color: "#EDE5E0" }}>Her</span>
        <em style={{ color: "var(--her)" }}>Side</em>
      </span>
      {size === "lg" && (
        <span
          style={{
            fontSize: tag,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "var(--t3)",
          }}
        >
          herside.app
        </span>
      )}
    </div>
  );
}

function PhaseOrb() {
  const phases = [
    { color: "#C96B84", label: "Menstrual", deg: 0 },
    { color: "#6AA882", label: "Follicular", deg: 90 },
    { color: "#C8943A", label: "Ovulation", deg: 180 },
    { color: "#8B68C0", label: "Luteal", deg: 270 },
  ];

  return (
    <div className="relative w-40 h-40">
      {/* Orbit ring */}
      <div
        className="absolute inset-0 rounded-full border"
        style={{ borderColor: "var(--dim)" }}
      />
      {/* Phase dots */}
      {phases.map(({ color, label, deg }) => {
        const rad = (deg * Math.PI) / 180;
        const r = 68;
        const x = 80 + r * Math.sin(rad);
        const y = 80 - r * Math.cos(rad);
        return (
          <div
            key={label}
            className="absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{ background: color, left: x, top: y }}
            title={label}
          />
        );
      })}
      {/* Center */}
      <div
        className="absolute inset-6 rounded-full flex items-center justify-center"
        style={{ background: "var(--s2)", border: "1px solid var(--dim)" }}
      >
        <span
          className="text-xs font-medium"
          style={{ color: "var(--her)", fontFamily: "Georgia, serif" }}
        >
          Day 14
        </span>
      </div>
    </div>
  );
}

function RoleCard({
  label,
  accent,
  headline,
  body,
}: {
  label: string;
  accent: string;
  headline: string;
  body: string;
}) {
  return (
    <div
      className="flex flex-col gap-4 p-6 rounded-[20px]"
      style={{ background: "var(--s2)", border: "1px solid var(--dim)" }}
    >
      <span
        className="text-xs font-medium tracking-[3px] uppercase"
        style={{ color: accent }}
      >
        {label}
      </span>
      <h3
        className="text-lg font-medium leading-snug"
        style={{ fontFamily: "var(--font-playfair)", color: "var(--t1)" }}
      >
        {headline}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "var(--t2)" }}>
        {body}
      </p>
    </div>
  );
}

function PartnerCard({
  day,
  phase,
  accent,
  action,
  avoid,
}: {
  day: string;
  phase: string;
  accent: string;
  action: string;
  avoid: string[];
}) {
  return (
    <div
      className="p-5 rounded-[20px] flex flex-col gap-3"
      style={{ background: "var(--s2)", border: "1px solid var(--dim)" }}
    >
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-medium tracking-[3px] uppercase"
          style={{ color: accent }}
        >
          {phase}
        </span>
        <span className="text-xs" style={{ color: "var(--t3)" }}>{day}</span>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "var(--t1)" }}>
        {action}
      </p>
      <div className="flex flex-col gap-1 pt-1" style={{ borderTop: "1px solid var(--dim)" }}>
        {avoid.map((a) => (
          <p key={a} className="text-xs" style={{ color: "var(--t3)" }}>
            {a}
          </p>
        ))}
      </div>
    </div>
  );
}
