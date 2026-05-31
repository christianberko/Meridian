// Meridian — Log Evidence success overlay
// Full-screen celebratory moment after "Save evidence" is tapped.
// Auto-dismisses after ~2.2s or on tap.

const SC = {
  bg: '#1A1917',
  text: '#FAFAF8',
  muted: '#8A8580',
  mutedSoft: '#6C6862',
  amber: '#F5A623',
  amberBright: '#FFC34A',
  amberPale: '#FFE7B8',
  silver: '#C9C5BD',
};

const scDisplay = {
  fontFamily: '"Fraunces", "Times New Roman", serif',
  fontStyle: 'italic',
  fontWeight: 300,
  letterSpacing: '-0.015em',
};
const scBody = {
  fontFamily: '-apple-system, "SF Pro Text", "SF Pro", system-ui, sans-serif',
};

// One-time keyframe injection (success-specific animations)
function useSuccessKeyframes() {
  React.useEffect(() => {
    if (document.getElementById('sc-keyframes')) return;
    const css = `
      @keyframes sc-bg-glow {
        0%   { opacity: 0; transform: scale(0.6); }
        45%  { opacity: 1; transform: scale(1.05); }
        100% { opacity: 0.78; transform: scale(1); }
      }
      @keyframes sc-thread-draw {
        from { stroke-dashoffset: var(--len); }
        to   { stroke-dashoffset: 0; }
      }
      @keyframes sc-thread-warm {
        0%, 30% { opacity: 0; }
        100%    { opacity: 1; }
      }
      @keyframes sc-node-form {
        0%   { transform: scale(0); opacity: 0; }
        55%  { transform: scale(1.35); opacity: 1; }
        78%  { transform: scale(0.92); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes sc-node-bloom {
        0%   { opacity: 0; transform: scale(0.2); }
        40%  { opacity: 1; transform: scale(1); }
        100% { opacity: 0.7; transform: scale(1.05); }
      }
      @keyframes sc-ring {
        0%   { opacity: 0;   stroke-width: 3;   r: 6;  }
        18%  { opacity: 0.95; stroke-width: 2.4; }
        100% { opacity: 0;   stroke-width: 0.4; r: 78; }
      }
      @keyframes sc-text-rise {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes sc-mood-pop {
        0%   { opacity: 0; transform: scale(0.4); }
        60%  { opacity: 1; transform: scale(1.12); }
        100% { opacity: 1; transform: scale(1); }
      }
      @keyframes sc-mood-halo {
        0%, 100% { opacity: 0.55; transform: scale(1); }
        50%      { opacity: 0.85; transform: scale(1.08); }
      }
      @keyframes sc-hint-pulse {
        0%, 100% { opacity: 0.42; }
        50%      { opacity: 0.78; }
      }
      @keyframes sc-spark-rise {
        0%   { opacity: 0; transform: translate(0, 0) scale(0.6); }
        20%  { opacity: 1; }
        100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.4); }
      }
    `;
    const s = document.createElement('style');
    s.id = 'sc-keyframes';
    s.textContent = css;
    document.head.appendChild(s);
  }, []);
}

// ─────────────────────────────────────────────────────────
// The hero thread — same path geometry as Goal Detail, but
// centered in the overlay and with the FINAL node staged as
// a fresh, star-being-born formation.
// ─────────────────────────────────────────────────────────
function SuccessThread({ nodeCount = 12 }) {
  const id = React.useId();
  const width = 340;
  const height = 180;
  const padX = 22;
  const w = width - padX * 2;
  const midY = height / 2;
  const amp = 38;
  const freq = 1.8;

  // Curve sampled densely for a smooth path
  const steps = 140;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = padX + t * w;
    const y = midY + Math.sin(t * Math.PI * freq * 2) * amp * (0.5 + 0.5 * t);
    pts.push([x, y]);
  }
  const d = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ');

  // Approximate path length for draw-on (geometric estimate)
  let pathLen = 0;
  for (let i = 1; i < pts.length; i++) {
    pathLen += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }

  // Existing nodes (the prior history) — these animate to gold
  const existing = [];
  for (let i = 0; i < nodeCount - 1; i++) {
    const t = i / (nodeCount - 1);
    const x = padX + t * w;
    const y = midY + Math.sin(t * Math.PI * freq * 2) * amp * (0.5 + 0.5 * t);
    existing.push({ x, y, t });
  }
  // The new node — last point on the curve
  const newNode = { x: pts[pts.length - 1][0], y: pts[pts.length - 1][1] };

  // Sparkles around the new node
  const sparks = [
    { dx:  18, dy: -22, delay: 850 },
    { dx: -14, dy: -28, delay: 920 },
    { dx:  26, dy:   8, delay: 980 },
    { dx: -22, dy:  -4, delay: 1020 },
    { dx:   4, dy: -32, delay: 1080 },
    { dx:  20, dy:  22, delay: 1140 },
  ];

  return (
    <div style={{ position: 'relative', width, height, margin: '0 auto' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          {/* Silver-to-gold gradient for the thread */}
          <linearGradient id={`sc-silver-${id}`} x1="0" y1="0" x2={width} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0"   stopColor={SC.silver} stopOpacity="0.55" />
            <stop offset="0.5" stopColor={SC.silver} stopOpacity="0.85" />
            <stop offset="1"   stopColor={SC.silver} stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id={`sc-gold-${id}`} x1="0" y1="0" x2={width} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0"    stopColor={SC.amber}      stopOpacity="0.55" />
            <stop offset="0.55" stopColor={SC.amberBright} stopOpacity="0.95" />
            <stop offset="1"    stopColor={SC.amberPale}   stopOpacity="1" />
          </linearGradient>

          {/* The blooming halo of the new node */}
          <radialGradient id={`sc-bloom-${id}`}>
            <stop offset="0"    stopColor={SC.amberPale}  stopOpacity="1" />
            <stop offset="0.25" stopColor={SC.amberBright} stopOpacity="0.7" />
            <stop offset="0.6"  stopColor={SC.amber}      stopOpacity="0.25" />
            <stop offset="1"    stopColor={SC.amber}      stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`sc-bloom-tight-${id}`}>
            <stop offset="0"   stopColor="#FFFFFF"        stopOpacity="1" />
            <stop offset="0.3" stopColor={SC.amberPale}   stopOpacity="0.95" />
            <stop offset="1"   stopColor={SC.amber}       stopOpacity="0" />
          </radialGradient>

          {/* Soft blur for thread glow underlay */}
          <filter id={`sc-blur-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>

        {/* Thread — silver base, draws on first */}
        <path
          d={d}
          stroke={`url(#sc-silver-${id})`}
          strokeWidth="1.6"
          strokeLinecap="round"
          style={{
            '--len': pathLen,
            strokeDasharray: pathLen,
            strokeDashoffset: pathLen,
            animation: 'sc-thread-draw 900ms cubic-bezier(0.22, 0.61, 0.36, 1) 80ms forwards',
          }}
        />

        {/* Thread — gold layer, fades in over silver as node forms */}
        <path
          d={d}
          stroke={`url(#sc-blur-${id})`}
          strokeWidth="6"
          strokeLinecap="round"
          filter={`url(#sc-blur-${id})`}
          style={{ opacity: 0, animation: 'sc-thread-warm 700ms ease-out 700ms forwards' }}
        />
        <path
          d={d}
          stroke={`url(#sc-gold-${id})`}
          strokeWidth="1.8"
          strokeLinecap="round"
          style={{ opacity: 0, animation: 'sc-thread-warm 700ms ease-out 700ms forwards' }}
        />

        {/* Existing nodes — small, interpolated silver -> warm by position */}
        {existing.map((n, i) => {
          const t = n.t;
          // base silvery
          const r1 = Math.round(201 + (245 - 201) * Math.pow(t, 1.4));
          const g1 = Math.round(197 + (166 - 197) * Math.pow(t, 1.4));
          const b1 = Math.round(189 + (35 - 189) * Math.pow(t, 1.4));
          const cold = `rgb(${r1},${g1},${b1})`;
          return (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r="2.6" fill={cold} opacity="0.85" />
              {/* warm overlay fades in */}
              <circle
                cx={n.x} cy={n.y} r="2.6" fill={SC.amber}
                style={{
                  opacity: 0,
                  animation: `sc-thread-warm 700ms ease-out ${700 + i * 18}ms forwards`,
                }}
              />
            </g>
          );
        })}

        {/* The new node — bloom, then concentric rings, then core */}
        <g transform={`translate(${newNode.x} ${newNode.y})`}>
          {/* Outer bloom halo */}
          <circle
            r="36"
            fill={`url(#sc-bloom-${id})`}
            style={{
              transformOrigin: 'center',
              opacity: 0,
              animation: 'sc-node-bloom 1100ms cubic-bezier(0.22, 0.61, 0.36, 1) 620ms forwards',
            }}
          />
          {/* Inner tight bloom */}
          <circle
            r="14"
            fill={`url(#sc-bloom-tight-${id})`}
            style={{
              transformOrigin: 'center',
              opacity: 0,
              animation: 'sc-node-bloom 900ms cubic-bezier(0.22, 0.61, 0.36, 1) 720ms forwards',
            }}
          />

          {/* Ripple ring 1 */}
          <circle
            cx="0" cy="0" r="6" fill="none"
            stroke={SC.amberBright} strokeWidth="2.4"
            style={{ opacity: 0, animation: 'sc-ring 1400ms cubic-bezier(0.16, 0.84, 0.44, 1) 720ms forwards' }}
          />
          {/* Ripple ring 2 (offset) */}
          <circle
            cx="0" cy="0" r="6" fill="none"
            stroke={SC.amber} strokeWidth="1.8"
            style={{ opacity: 0, animation: 'sc-ring 1500ms cubic-bezier(0.16, 0.84, 0.44, 1) 940ms forwards' }}
          />

          {/* Node core — forms with springy scale */}
          <g style={{
            transformOrigin: 'center',
            transformBox: 'fill-box',
            animation: 'sc-node-form 780ms cubic-bezier(0.34, 1.56, 0.64, 1) 600ms backwards',
          }}>
            {/* node glow disc */}
            <circle cx="0" cy="0" r="11" fill={SC.amber} opacity="0.35" />
            {/* main gold body */}
            <circle cx="0" cy="0" r="7.5" fill={SC.amberBright} />
            <circle cx="0" cy="0" r="7.5" fill="none" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="0.8" />
            {/* hot core */}
            <circle cx="0" cy="0" r="3" fill="#FFF6E0" />
            {/* specular highlight */}
            <circle cx="-2.4" cy="-2.4" r="1.1" fill="#FFFFFF" opacity="0.85" />
          </g>

          {/* Sparkles */}
          {sparks.map((s, i) => (
            <circle
              key={i}
              cx="0" cy="0" r="1.4"
              fill={SC.amberPale}
              style={{
                '--dx': `${s.dx}px`,
                '--dy': `${s.dy}px`,
                opacity: 0,
                animation: `sc-spark-rise 1100ms ease-out ${s.delay}ms forwards`,
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// The full-screen overlay
// ─────────────────────────────────────────────────────────
function LogSuccessScreen({ mood = '💪', onDismiss }) {
  useSuccessKeyframes();

  // Auto-dismiss after 2.2s (within the requested 2–3s window)
  React.useEffect(() => {
    if (!onDismiss) return;
    const t = setTimeout(() => onDismiss(), 2200);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const moodEmoji = mood || '💪';

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'absolute', inset: 0, zIndex: 200,
        background: SC.bg,
        color: SC.text,
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        // The whole overlay fades in quickly
        animation: 'sc-text-rise 280ms ease-out both',
      }}
    >
      {/* Center radial glow — biggest "warm" wash */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 70% 50% at 50% 42%, rgba(245,166,35,0.32) 0%, rgba(245,166,35,0.10) 35%, rgba(245,166,35,0) 70%),
          radial-gradient(ellipse 110% 80% at 50% 42%, rgba(245,166,35,0.08) 0%, rgba(245,166,35,0) 60%)
        `,
        transformOrigin: '50% 42%',
        animation: 'sc-bg-glow 1400ms cubic-bezier(0.16, 0.84, 0.44, 1) both',
        pointerEvents: 'none',
      }} />

      {/* Faint vignette to deepen the edges */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Status bar spacer */}
      <div style={{ height: 54, flexShrink: 0 }} />

      {/* Thread + node */}
      <div style={{
        marginTop: 80,
        position: 'relative', zIndex: 2,
      }}>
        <SuccessThread nodeCount={13} />
      </div>

      {/* Text block */}
      <div style={{
        position: 'relative', zIndex: 2,
        marginTop: 8,
        textAlign: 'center',
        padding: '0 36px',
      }}>
        <div style={{
          ...scBody, fontSize: 11, fontWeight: 600,
          letterSpacing: '0.32em', textTransform: 'uppercase',
          color: SC.muted,
          opacity: 0,
          animation: 'sc-text-rise 520ms cubic-bezier(0.22, 0.61, 0.36, 1) 950ms forwards',
        }}>
          Node added
        </div>
        <h1 style={{
          ...scDisplay,
          fontSize: 44, lineHeight: 1.05,
          color: SC.amberPale,
          margin: '14px 0 10px',
          textShadow: '0 0 32px rgba(245,166,35,0.45), 0 0 8px rgba(255,231,184,0.35)',
          opacity: 0,
          animation: 'sc-text-rise 620ms cubic-bezier(0.22, 0.61, 0.36, 1) 1040ms forwards',
        }}>
          Evidence logged.
        </h1>
        <div style={{
          ...scBody, fontSize: 14.5, lineHeight: 1.45,
          color: SC.muted, letterSpacing: '0.01em',
          opacity: 0,
          animation: 'sc-text-rise 580ms cubic-bezier(0.22, 0.61, 0.36, 1) 1180ms forwards',
        }}>
          Your thread grows stronger.
        </div>
      </div>

      {/* Mood emoji — big, with subtle halo */}
      <div style={{
        position: 'relative', zIndex: 2,
        marginTop: 38,
        width: 120, height: 120,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle, rgba(245,166,35,0.32) 0%, rgba(245,166,35,0.08) 45%, rgba(245,166,35,0) 70%)',
          transformOrigin: 'center',
          animation: 'sc-mood-halo 3200ms ease-in-out 1400ms infinite',
        }} />
        <div style={{
          fontSize: 78,
          lineHeight: 1,
          filter: 'drop-shadow(0 8px 24px rgba(245,166,35,0.35))',
          opacity: 0,
          animation: 'sc-mood-pop 720ms cubic-bezier(0.34, 1.56, 0.64, 1) 1280ms forwards',
        }}>
          {moodEmoji}
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Bottom hint */}
      <div style={{
        position: 'relative', zIndex: 2,
        ...scBody, fontSize: 10.5, fontWeight: 500,
        letterSpacing: '0.28em', textTransform: 'uppercase',
        color: SC.mutedSoft,
        marginBottom: 46,
        opacity: 0,
        animation:
          'sc-text-rise 600ms ease-out 1600ms forwards, sc-hint-pulse 2400ms ease-in-out 2200ms infinite',
      }}>
        Tap to continue
      </div>
    </div>
  );
}

Object.assign(window, { LogSuccessScreen });
