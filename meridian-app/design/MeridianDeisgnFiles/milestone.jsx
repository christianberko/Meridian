// Meridian — Streak milestone celebration screen.
// Big, bold, earned. Carved-in-gold number is the hero.
// Shown when a user crosses 7 / 30 / 60 / 90 day milestones.

const SM = {
  bg: '#1A1917',
  surface: '#242320',
  hairline: 'rgba(250,250,248,0.07)',
  text: '#FAFAF8',
  muted: '#8A8580',
  mutedSoft: '#6C6862',
  amber: '#F5A623',
  amberBright: '#FFC34A',
  amberPale: '#FFE7B8',
  amberDeep: '#B8740F',
  silver: '#C9C5BD',
};

const smDisplay = {
  fontFamily: '"Fraunces", "Times New Roman", serif',
  fontStyle: 'italic',
  fontWeight: 300,
  letterSpacing: '-0.02em',
};
const smBody = {
  fontFamily: '-apple-system, "SF Pro Text", "SF Pro", system-ui, sans-serif',
};

function useMilestoneKeyframes() {
  React.useEffect(() => {
    if (document.getElementById('sm-keyframes')) return;
    const css = `
      @keyframes sm-fade-up {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes sm-fade {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes sm-number-rise {
        0%   { opacity: 0; transform: translateY(28px) scale(0.86); letter-spacing: -0.06em; }
        65%  { opacity: 1; transform: translateY(0)     scale(1.02); }
        100% { opacity: 1; transform: translateY(0)     scale(1);    letter-spacing: -0.02em; }
      }
      @keyframes sm-ray-rotate {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes sm-rays-fade {
        0%   { opacity: 0; }
        60%  { opacity: 0.85; }
        100% { opacity: 0.7; }
      }
      @keyframes sm-glow-pulse {
        0%, 100% { opacity: 0.55; transform: scale(1); }
        50%      { opacity: 0.85; transform: scale(1.04); }
      }
      @keyframes sm-mark-pulse {
        0%, 100% { opacity: 0.55; transform: scale(1); }
        50%      { opacity: 0.95; transform: scale(1.1); }
      }
      @keyframes sm-particle-rise {
        0%   { opacity: 0; transform: translate(0, 20px) scale(0.5); }
        15%  { opacity: 1; }
        80%  { opacity: 0.8; }
        100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.3); }
      }
    `;
    const s = document.createElement('style');
    s.id = 'sm-keyframes';
    s.textContent = css;
    document.head.appendChild(s);
  }, []);
}

// ─────────────────────────────────────────────────────────
// The thread-mark logo, blown up large with a glowing peak
// ─────────────────────────────────────────────────────────
function BigThreadMark({ size = 86 }) {
  const id = React.useId();
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sm-tm-${id}`} x1="2" y1="11" x2="20" y2="11" gradientUnits="userSpaceOnUse">
          <stop offset="0"   stopColor={SM.silver}     stopOpacity="0.7" />
          <stop offset="0.5" stopColor="#E5C98A" />
          <stop offset="1"   stopColor={SM.amberBright} />
        </linearGradient>
        <radialGradient id={`sm-tm-glow-${id}`}>
          <stop offset="0"   stopColor={SM.amberPale}  stopOpacity="1" />
          <stop offset="0.3" stopColor={SM.amberBright} stopOpacity="0.7" />
          <stop offset="1"   stopColor={SM.amber}      stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Aura around peak node */}
      <circle
        cx="19.4" cy="8.4" r="6.5"
        fill={`url(#sm-tm-glow-${id})`}
        style={{
          transformOrigin: '19.4px 8.4px',
          animation: 'sm-mark-pulse 2600ms ease-in-out infinite',
        }}
      />
      <path
        d="M2 14 C 5 14, 6 6, 9 6 C 12 6, 12 16, 15 16 C 18 16, 19 8, 20 8"
        stroke={`url(#sm-tm-${id})`}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="3.5"  cy="13.2" r="1.1" fill={SM.silver} opacity="0.85" />
      <circle cx="11"   cy="11"   r="1.3" fill="#D8B26E" />
      {/* Peak node */}
      <circle cx="19.4" cy="8.4"  r="2.1" fill={SM.amberBright} />
      <circle cx="19.4" cy="8.4"  r="0.9" fill="#FFF6E0" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
// The hero number — Fraunces italic, monumental, gold,
// with a soft inner bloom and crisp upper highlight
// ─────────────────────────────────────────────────────────
function HeroNumber({ value = 30 }) {
  const digits = String(value);
  // Scale font size down slightly for 3-digit values so it always fits
  const fontSize = digits.length >= 3 ? 220 : 280;

  return (
    <div style={{
      position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      lineHeight: 0.85,
      animation: 'sm-number-rise 1100ms cubic-bezier(0.22, 0.61, 0.36, 1) 240ms backwards',
    }}>
      {/* Soft warm bloom behind the digits */}
      <div style={{
        position: 'absolute',
        width: fontSize * 1.4, height: fontSize * 1.0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,195,74,0.45) 0%, rgba(245,166,35,0.18) 40%, rgba(245,166,35,0) 70%)',
        filter: 'blur(8px)',
        pointerEvents: 'none',
        transformOrigin: 'center',
        animation: 'sm-glow-pulse 4000ms ease-in-out 800ms infinite',
      }} />
      <span style={{
        position: 'relative',
        ...smDisplay,
        fontSize,
        // Layered gradient to mimic warm-to-bright-to-warm "carved gold"
        background: 'linear-gradient(180deg, #FFE9B8 0%, #FFC34A 28%, #F5A623 58%, #C8821B 92%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        // The amber shadow IS the glow on the dark bg
        filter: 'drop-shadow(0 0 30px rgba(245,166,35,0.55)) drop-shadow(0 0 12px rgba(255,231,184,0.45))',
        textShadow: '0 0 80px rgba(245,166,35,0.4)',
        letterSpacing: '-0.04em',
      }}>
        {digits}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Rotating light rays behind the number
// ─────────────────────────────────────────────────────────
function LightRays({ size = 540 }) {
  // Twelve subtle wedge rays, slowly rotating
  const rays = [];
  const count = 12;
  for (let i = 0; i < count; i++) {
    rays.push(i);
  }
  return (
    <div style={{
      position: 'absolute',
      width: size, height: size,
      left: '50%', top: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      opacity: 0,
      animation: 'sm-rays-fade 1600ms ease-out 500ms forwards',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        animation: 'sm-ray-rotate 60s linear infinite',
      }}>
        {rays.map(i => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%', top: '50%',
              width: 2,
              height: size / 2,
              transformOrigin: '50% 0%',
              transform: `translate(-50%, 0) rotate(${(i / count) * 360}deg)`,
              background: 'linear-gradient(180deg, rgba(255,195,74,0.0) 0%, rgba(255,195,74,0.22) 35%, rgba(255,195,74,0.0) 100%)',
              filter: 'blur(0.5px)',
            }}
          />
        ))}
      </div>
      {/* Second set, offset and slower, opposite direction */}
      <div style={{
        position: 'absolute', inset: 0,
        animation: 'sm-ray-rotate 90s linear infinite reverse',
        opacity: 0.7,
      }}>
        {rays.map(i => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%', top: '50%',
              width: 1,
              height: size / 2,
              transformOrigin: '50% 0%',
              transform: `translate(-50%, 0) rotate(${(i / count) * 360 + 15}deg)`,
              background: 'linear-gradient(180deg, rgba(255,231,184,0.0) 0%, rgba(255,231,184,0.18) 50%, rgba(255,231,184,0.0) 100%)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Floating embers — small gold particles drifting upward
// ─────────────────────────────────────────────────────────
function Particles() {
  // Deterministic so they look hand-placed, not random
  const particles = [
    { left: 18, bottom: 60,  size: 2.5, dx: 12,  dy: -180, delay: 0,    dur: 6200 },
    { left: 38, bottom: 80,  size: 1.8, dx: -8,  dy: -220, delay: 800,  dur: 7400 },
    { left: 62, bottom: 50,  size: 3.0, dx: 6,   dy: -200, delay: 1500, dur: 6800 },
    { left: 82, bottom: 100, size: 2.2, dx: -14, dy: -240, delay: 400,  dur: 7800 },
    { left: 12, bottom: 200, size: 1.6, dx: 16,  dy: -160, delay: 2200, dur: 6500 },
    { left: 88, bottom: 220, size: 2.4, dx: -10, dy: -200, delay: 1200, dur: 7100 },
    { left: 28, bottom: 320, size: 1.8, dx: 12,  dy: -140, delay: 2800, dur: 6300 },
    { left: 72, bottom: 340, size: 2.6, dx: -16, dy: -160, delay: 600,  dur: 7600 },
    { left: 50, bottom: 30,  size: 2.0, dx: 18,  dy: -260, delay: 1800, dur: 7900 },
    { left: 8,  bottom: 420, size: 1.5, dx: 20,  dy: -120, delay: 3200, dur: 6700 },
    { left: 92, bottom: 460, size: 1.9, dx: -22, dy: -140, delay: 2400, dur: 7200 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            bottom: p.bottom,
            width: p.size, height: p.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,231,184,0.95) 0%, rgba(245,166,35,0.6) 50%, rgba(245,166,35,0) 100%)',
            boxShadow: '0 0 6px rgba(245,166,35,0.6)',
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            opacity: 0,
            animation: `sm-particle-rise ${p.dur}ms ease-out ${p.delay}ms infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Stats row: entries · goal name · since date
// ─────────────────────────────────────────────────────────
function MilestoneStats({ entries, goalName, sinceLabel }) {
  const Dot = () => (
    <div style={{
      width: 3, height: 3, borderRadius: 1.5,
      background: SM.mutedSoft, flexShrink: 0,
    }} />
  );
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 10, flexWrap: 'nowrap',
      ...smBody, fontSize: 12.5, color: SM.muted,
      letterSpacing: '0.02em',
    }}>
      <span style={{ color: SM.text }}>{entries} entries</span>
      <Dot />
      <span>{goalName}</span>
      <Dot />
      <span>Since {sinceLabel}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────
function StreakMilestoneScreen({
  days = 30,
  entries = 30,
  goalName = 'Daily writing',
  sinceLabel = 'Apr 8',
  onContinue = () => {},
  onShare = () => {},
}) {
  useMilestoneKeyframes();

  // Tagline differs slightly with milestone size, but the requested 30-day copy is the default
  const taglineForDays = (d) => {
    if (d >= 90) return `${d} days of showing up.`;
    if (d >= 60) return `${d} days of showing up.`;
    if (d >= 30) return `${d} days of showing up.`;
    return `${d} days of showing up.`;
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      boxSizing: 'border-box',
      background: SM.bg,
      color: SM.text,
      position: 'relative',
      overflow: 'hidden',
      paddingTop: 54,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Central warm radial gradient — barely there at the edges */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 60% 45% at 50% 40%, rgba(245,166,35,0.22) 0%, rgba(245,166,35,0.06) 40%, rgba(245,166,35,0) 70%),
          radial-gradient(ellipse 100% 80% at 50% 40%, rgba(245,166,35,0.05) 0%, rgba(245,166,35,0) 60%)
        `,
        pointerEvents: 'none',
        opacity: 0,
        animation: 'sm-fade 900ms ease-out 100ms forwards',
      }} />

      {/* Vignette to darken edges further */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 110% 100% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.45) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Drifting embers */}
      <Particles />

      {/* Top: small label */}
      <div style={{
        position: 'relative',
        textAlign: 'center',
        padding: '12px 22px 0',
        opacity: 0,
        animation: 'sm-fade-up 600ms ease-out 100ms forwards',
      }}>
        <div style={{
          ...smBody, fontSize: 10.5, fontWeight: 600,
          letterSpacing: '0.32em', textTransform: 'uppercase',
          color: SM.amber,
        }}>
          Milestone reached
        </div>
      </div>

      {/* Hero stack — number with rays + glowing thread mark */}
      <div style={{
        position: 'relative',
        flex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        paddingBottom: 30,
      }}>
        {/* Rotating light rays — sit behind everything in this stack */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <LightRays size={520} />
        </div>

        {/* Glowing thread mark above the number */}
        <div style={{
          position: 'relative',
          marginBottom: 18,
          opacity: 0,
          animation: 'sm-fade-up 700ms ease-out 200ms forwards',
        }}>
          <BigThreadMark size={64} />
        </div>

        {/* Hero number */}
        <div style={{ position: 'relative' }}>
          <HeroNumber value={days} />
        </div>

        {/* "days" label */}
        <div style={{
          ...smBody, fontSize: 12, fontWeight: 600,
          letterSpacing: '0.42em', textTransform: 'uppercase',
          color: SM.muted,
          marginTop: 8,
          opacity: 0,
          animation: 'sm-fade-up 600ms ease-out 1100ms forwards',
        }}>
          Days
        </div>
      </div>

      {/* Text block + stats */}
      <div style={{
        position: 'relative',
        padding: '0 28px 0',
        textAlign: 'center',
      }}>
        <h1 style={{
          ...smDisplay,
          fontSize: 30, lineHeight: 1.1,
          color: SM.amberPale,
          margin: '0 0 12px',
          textShadow: '0 0 32px rgba(245,166,35,0.35)',
          textWrap: 'pretty',
          opacity: 0,
          animation: 'sm-fade-up 700ms ease-out 1200ms forwards',
        }}>
          {taglineForDays(days)}
        </h1>
        <p style={{
          ...smBody, fontSize: 14.5, lineHeight: 1.5,
          color: SM.muted,
          margin: '0 auto 22px',
          maxWidth: 320,
          textWrap: 'pretty',
          opacity: 0,
          animation: 'sm-fade-up 700ms ease-out 1340ms forwards',
        }}>
          Most people quit in the first week. You're still here, still building, still proving it.
        </p>

        <div style={{
          opacity: 0,
          animation: 'sm-fade-up 700ms ease-out 1480ms forwards',
        }}>
          <MilestoneStats entries={entries} goalName={goalName} sinceLabel={sinceLabel} />
        </div>
      </div>

      {/* Bottom actions */}
      <div style={{
        position: 'relative',
        padding: '28px 22px 34px',
        opacity: 0,
        animation: 'sm-fade-up 700ms ease-out 1620ms forwards',
      }}>
        <button
          onClick={onContinue}
          style={{
            width: '100%', height: 54, borderRadius: 27,
            background: `linear-gradient(180deg, #F8B547 0%, ${SM.amber} 100%)`,
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: '0 12px 36px rgba(245,166,35,0.42), 0 1px 0 rgba(255,255,255,0.25) inset, 0 -1px 0 rgba(0,0,0,0.15) inset',
            ...smBody, fontSize: 16, fontWeight: 600, color: '#1A1917',
            letterSpacing: '-0.01em',
          }}
        >
          Keep building
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A1917" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        </button>

        <button
          onClick={onShare}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: 'transparent', border: 'none', cursor: 'pointer',
            margin: '14px auto 0', padding: '4px 8px',
            ...smBody, fontSize: 12.5, color: SM.muted,
            letterSpacing: '0.04em',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={SM.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
            <path d="M16 6l-4-4-4 4" />
            <path d="M12 2v14" />
          </svg>
          Share your milestone
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { StreakMilestoneScreen });
