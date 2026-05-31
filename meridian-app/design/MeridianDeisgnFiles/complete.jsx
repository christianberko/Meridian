// Meridian — Goal Achieved screen
// Full-screen takeover when a user marks a goal complete.
// The thread fills the screen vertically: silver origin at the bottom,
// a blazing gold final node at the top with a soft bloom that lights the screen.

const GA = {
  bg: '#1A1917',
  text: '#FAFAF8',
  muted: '#9A948D',
  mutedSoft: '#6C6862',
  warmGrey: '#A8A19A',
  amber: '#F5A623',
  amberHi: '#FFD387',
  amberCore: '#FFE7B8',
  silver: '#C9C5BD',
  silverDim: '#7A766F',
};

const gaDisplay = {
  fontFamily: '"Fraunces", "Times New Roman", serif',
  fontStyle: 'italic',
  fontWeight: 300,
  letterSpacing: '-0.015em',
};

const gaBody = {
  fontFamily: '-apple-system, "SF Pro Text", "SF Pro", system-ui, sans-serif',
};

// ─────────────────────────────────────────────────────────
// The full vertical thread — bottom (silver) to top (blazing gold).
// 87 nodes for 90 days. Meandering sine, amplitude tapers near the top
// so the final node lands centered under the bloom.
// ─────────────────────────────────────────────────────────
function CompletedThread({
  width = 390,
  height = 520,
  nodes = 87,
  topInset = 92,        // space at top reserved for the bloom
  bottomInset = 26,     // small breathing room at bottom
  centerBias = 8,       // pull centerline slightly above geometric center
}) {
  const id = React.useId();

  const cx = width / 2 + centerBias - 8;
  const baseAmp = 78;   // horizontal swing
  const freq = 2.6;     // number of waves over the journey
  const taperPow = 1.6; // how fast amplitude collapses near the gold node

  // t = 0 at bottom (silver), 1 at top (gold)
  const yFor = (t) => height - bottomInset - t * (height - bottomInset - topInset);
  const xFor = (t) => {
    // amplitude grows from start, shrinks as we approach the apex
    const env = Math.pow(1 - Math.abs(t - 0.42) * 1.2, 1);
    const taper = Math.pow(1 - t, taperPow); // collapse near top
    const amp = baseAmp * Math.max(0.35, env) * (0.55 + 0.45 * taper);
    return cx + Math.sin(t * Math.PI * freq) * amp;
  };

  // Sample many points for a smooth path
  const steps = 240;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push([xFor(t), yFor(t)]);
  }
  const d = pts.map((p, i) => (i === 0 ? `M ${p[0].toFixed(2)} ${p[1].toFixed(2)}` : `L ${p[0].toFixed(2)} ${p[1].toFixed(2)}`)).join(' ');

  // Node positions
  const nodeData = [];
  for (let i = 0; i < nodes; i++) {
    const t = nodes === 1 ? 1 : i / (nodes - 1);
    nodeData.push({ x: xFor(t), y: yFor(t), t });
  }
  const last = nodeData[nodeData.length - 1];

  // Color along thread — silver -> warm gold
  const colorAt = (t) => {
    // ease so most of the journey is silver-warm, gold concentrates near the top
    const k = Math.pow(t, 1.35);
    const r = Math.round(201 + (255 - 201) * k);
    const g = Math.round(197 + (200 - 197) * k);
    const b = Math.round(189 + (96 - 189) * k);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      style={{ display: 'block', position: 'relative', zIndex: 2 }}
    >
      <defs>
        {/* Path gradient — top heavy gold */}
        <linearGradient id={`ct-line-${id}`} x1="0" y1={height} x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={GA.silver} stopOpacity="0.55" />
          <stop offset="0.32" stopColor="#D2C8B6" stopOpacity="0.9" />
          <stop offset="0.7" stopColor="#E8C68A" />
          <stop offset="0.92" stopColor={GA.amber} />
          <stop offset="1" stopColor={GA.amberHi} />
        </linearGradient>

        {/* Blurred glow underlay */}
        <filter id={`ct-blur-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id={`ct-blur-soft-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>

        {/* Bloom around the final node */}
        <radialGradient id={`ct-bloom-${id}`}>
          <stop offset="0" stopColor="#FFF1CC" stopOpacity="0.95" />
          <stop offset="0.18" stopColor={GA.amberHi} stopOpacity="0.55" />
          <stop offset="0.5" stopColor={GA.amber} stopOpacity="0.18" />
          <stop offset="1" stopColor={GA.amber} stopOpacity="0" />
        </radialGradient>

        {/* Inner radiance of the final node */}
        <radialGradient id={`ct-core-${id}`}>
          <stop offset="0" stopColor="#FFFCEC" />
          <stop offset="0.45" stopColor={GA.amberCore} />
          <stop offset="1" stopColor={GA.amber} />
        </radialGradient>

        {/* Node-by-node glow (used on past nodes near the top) */}
        <radialGradient id={`ct-node-glow-${id}`}>
          <stop offset="0" stopColor={GA.amber} stopOpacity="0.5" />
          <stop offset="1" stopColor={GA.amber} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft blurred path underlay (the luminous trail) */}
      <path
        d={d}
        stroke={`url(#ct-line-${id})`}
        strokeWidth="14"
        strokeLinecap="round"
        opacity="0.18"
        filter={`url(#ct-blur-${id})`}
      />
      <path
        d={d}
        stroke={`url(#ct-line-${id})`}
        strokeWidth="4.5"
        strokeLinecap="round"
        opacity="0.35"
        filter={`url(#ct-blur-soft-${id})`}
      />

      {/* Crisp main path */}
      <path
        d={d}
        stroke={`url(#ct-line-${id})`}
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* All nodes — every single one visible */}
      {nodeData.map((n, i) => {
        if (i === nodeData.length - 1) return null;
        const t = n.t;
        const col = colorAt(t);
        // base radius grows slightly toward the top
        const r = 1.4 + t * 1.0;
        // soft halo for warm nodes near the top
        const haloR = 4 + t * 8;
        const haloOp = 0.05 + Math.pow(t, 2.2) * 0.45;
        return (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={haloR} fill={`url(#ct-node-glow-${id})`} opacity={haloOp} />
            <circle cx={n.x} cy={n.y} r={r} fill={col} />
            <circle cx={n.x} cy={n.y} r={r} fill="none" stroke="#FAFAF8" strokeOpacity="0.12" strokeWidth="0.4" />
          </g>
        );
      })}

      {/* Final blazing gold node + bloom */}
      <g>
        {/* outer bloom — large */}
        <circle cx={last.x} cy={last.y} r="170" fill={`url(#ct-bloom-${id})`} opacity="0.65">
          <animate attributeName="r" values="158;176;158" dur="3.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.55;0.78;0.55" dur="3.6s" repeatCount="indefinite" />
        </circle>
        {/* mid bloom */}
        <circle cx={last.x} cy={last.y} r="72" fill={`url(#ct-bloom-${id})`} opacity="0.85">
          <animate attributeName="r" values="66;78;66" dur="2.6s" repeatCount="indefinite" />
        </circle>
        {/* node body */}
        <circle cx={last.x} cy={last.y} r="13" fill={`url(#ct-core-${id})`} />
        <circle cx={last.x} cy={last.y} r="13" fill="none" stroke="#FFF8E0" strokeOpacity="0.55" strokeWidth="0.8" />
        {/* center spark */}
        <circle cx={last.x} cy={last.y} r="3.6" fill="#FFFCEC">
          <animate attributeName="opacity" values="0.85;1;0.85" dur="2.2s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
// Stat — large gold Fraunces number, small warm grey label
// ─────────────────────────────────────────────────────────
function Stat({ value, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
      <div style={{
        ...gaDisplay,
        fontSize: 30,
        lineHeight: 1,
        color: GA.amber,
        letterSpacing: '-0.02em',
        textShadow: '0 0 24px rgba(245,166,35,0.32)',
      }}>
        {value}
      </div>
      <div style={{
        ...gaBody,
        fontSize: 10.5,
        fontWeight: 500,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: GA.warmGrey,
        marginTop: 8,
      }}>
        {label}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────
function GoalCompleteScreen({
  eyebrow = 'Daily writing · 90 days',
  title = 'Thread complete.',
  subtitle = '87 entries. 90 days. You showed up and proved it.',
  stats = [
    { value: '87', label: 'Entries' },
    { value: '90', label: 'Days' },
    { value: '42k', label: 'Words' },
  ],
  onSave,
  onNew,
  onClose,
}) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      background: GA.bg,
      color: GA.text,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Sunrise behind the thread — a wide warm radial centered behind the top node */}
      <div style={{
        position: 'absolute',
        top: -180, left: '50%', transform: 'translateX(-50%)',
        width: 720, height: 640,
        background: 'radial-gradient(ellipse 50% 55% at 50% 50%, rgba(245,166,35,0.22) 0%, rgba(245,166,35,0.10) 30%, rgba(245,166,35,0.03) 55%, rgba(245,166,35,0) 75%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      {/* Secondary, softer wash low on the screen */}
      <div style={{
        position: 'absolute',
        bottom: -200, left: '50%', transform: 'translateX(-50%)',
        width: 520, height: 360,
        background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(245,166,35,0.06) 0%, rgba(245,166,35,0) 65%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Top bar — minimal close */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        paddingTop: 56, paddingLeft: 18, paddingRight: 18,
        display: 'flex', justifyContent: 'flex-end',
        zIndex: 5,
      }}>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            width: 36, height: 36, borderRadius: 18,
            background: 'rgba(250,250,248,0.06)',
            border: '0.5px solid rgba(250,250,248,0.10)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={GA.text} strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      {/* Thread — anchored to the top of the screen */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 520,
        display: 'flex', justifyContent: 'center',
        zIndex: 1,
      }}>
        <CompletedThread width={390} height={520} nodes={87} />
      </div>

      {/* Below-thread content */}
      <div style={{
        position: 'absolute',
        top: 470, left: 0, right: 0, bottom: 0,
        display: 'flex', flexDirection: 'column',
        padding: '0 28px 28px',
        zIndex: 3,
      }}>
        {/* Caption block */}
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <div style={{
            ...gaBody,
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: GA.warmGrey,
          }}>
            {eyebrow}
          </div>
          <h1 style={{
            ...gaDisplay,
            fontSize: 44,
            lineHeight: 1.05,
            color: GA.text,
            margin: '12px 0 10px',
          }}>
            {title}
          </h1>
          <div style={{
            ...gaBody,
            fontSize: 14,
            lineHeight: 1.5,
            color: GA.warmGrey,
            maxWidth: 300,
            margin: '0 auto',
            textWrap: 'pretty',
          }}>
            {subtitle}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginTop: 26,
          padding: '0 6px',
          position: 'relative',
        }}>
          {stats.map((s, i) => (
            <React.Fragment key={s.label}>
              <Stat value={s.value} label={s.label} />
              {i < stats.length - 1 && (
                <div style={{
                  width: 1,
                  height: 36,
                  alignSelf: 'center',
                  background: 'linear-gradient(180deg, rgba(245,166,35,0) 0%, rgba(245,166,35,0.35) 50%, rgba(245,166,35,0) 100%)',
                  marginTop: 2,
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Actions */}
        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 6 }}>
          <button
            onClick={onSave}
            style={{
              width: '100%', height: 54, borderRadius: 27,
              background: 'linear-gradient(180deg, #F8B547 0%, #F5A623 100%)',
              border: 'none', cursor: 'pointer',
              boxShadow: '0 14px 38px rgba(245,166,35,0.38), 0 1px 0 rgba(255,255,255,0.30) inset, 0 -1px 0 rgba(0,0,0,0.18) inset',
              ...gaBody, fontSize: 16, fontWeight: 600,
              color: '#1A1917',
              letterSpacing: '-0.005em',
            }}
          >
            Save to journal
          </button>
          <button
            onClick={onNew}
            style={{
              width: '100%', height: 50, borderRadius: 25,
              background: 'transparent',
              border: '0.5px solid rgba(250,250,248,0.18)',
              cursor: 'pointer',
              ...gaBody, fontSize: 15, fontWeight: 500,
              color: GA.text,
              letterSpacing: '-0.005em',
            }}
          >
            Start a new thread
          </button>
        </div>

        <div style={{
          ...gaBody,
          fontSize: 10.5,
          color: GA.mutedSoft,
          textAlign: 'center',
          letterSpacing: '0.04em',
          marginTop: 8,
          paddingBottom: 6,
        }}>
          Your thread lives in your completed goals forever
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { GoalCompleteScreen, CompletedThread });
