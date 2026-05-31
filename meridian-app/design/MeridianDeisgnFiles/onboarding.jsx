// Meridian — Onboarding screens (4 frames)
// Same design system. Each screen is rendered inside an iPhone-sized frame.

const OB = {
  bg: '#1A1917',
  surface: '#242320',
  surfaceRaised: '#2A2925',
  hairline: 'rgba(250,250,248,0.07)',
  text: '#FAFAF8',
  muted: '#8A8580',
  mutedSoft: '#6C6862',
  amber: '#F5A623',
  amberSoft: 'rgba(245,166,35,0.12)',
  silver: '#C9C5BD',
};
const obDisplay = {
  fontFamily: '"Fraunces", "Times New Roman", serif',
  fontStyle: 'italic',
  fontWeight: 300,
  letterSpacing: '-0.012em',
};
const obBody = {
  fontFamily: '-apple-system, "SF Pro Text", "SF Pro", system-ui, sans-serif',
};

// ─────────────────────────────────────────────────────────
// Shared bits
// ─────────────────────────────────────────────────────────
function GoldButton({ children, style }) {
  return (
    <button style={{
      width: '100%', height: 54, borderRadius: 27,
      background: `linear-gradient(180deg, #F8B547 0%, ${OB.amber} 100%)`,
      border: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      boxShadow: '0 10px 32px rgba(245,166,35,0.32), 0 1px 0 rgba(255,255,255,0.25) inset, 0 -1px 0 rgba(0,0,0,0.15) inset',
      ...obBody, fontSize: 16, fontWeight: 600, color: '#1A1917',
      letterSpacing: '-0.01em',
      ...style,
    }}>{children}</button>
  );
}

function ProgressDots({ count, active }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length: count }).map((_, i) => {
        const filled = i < active;
        const current = i === active;
        return (
          <div key={i} style={{
            width: current ? 22 : 6, height: 6, borderRadius: 3,
            background: filled ? OB.amber : current ? OB.amber : 'rgba(250,250,248,0.18)',
            transition: 'all 200ms ease',
          }} />
        );
      })}
    </div>
  );
}

// Large hero thread mark — used on welcome screen
function HeroThreadMark({ size = 200 }) {
  const id = React.useId();
  const w = size, h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 200 200" fill="none">
      <defs>
        <linearGradient id={`hl-${id}`} x1="20" y1="100" x2="180" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#C9C5BD" stopOpacity="0.7" />
          <stop offset="0.5" stopColor="#D8C8A2" />
          <stop offset="1" stopColor={OB.amber} />
        </linearGradient>
        <radialGradient id={`hlg-${id}`}>
          <stop offset="0" stopColor={OB.amber} stopOpacity="0.7" />
          <stop offset="1" stopColor={OB.amber} stopOpacity="0" />
        </radialGradient>
        <filter id={`hlb-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      {/* underlay */}
      <path d="M 20 130 C 50 130, 60 50, 90 60 C 120 70, 110 160, 140 150 C 160 145, 170 90, 180 80" stroke={`url(#hl-${id})`} strokeWidth="9" strokeLinecap="round" opacity="0.22" filter={`url(#hlb-${id})`} />
      {/* main */}
      <path d="M 20 130 C 50 130, 60 50, 90 60 C 120 70, 110 160, 140 150 C 160 145, 170 90, 180 80" stroke={`url(#hl-${id})`} strokeWidth="2.4" strokeLinecap="round" />
      {/* past nodes */}
      <circle cx="22" cy="129" r="3.5" fill="#C9C5BD" />
      <circle cx="58" cy="84" r="3.5" fill="#D6BFA0" />
      <circle cx="98" cy="98" r="3.5" fill="#E1B870" />
      <circle cx="138" cy="151" r="3.5" fill="#EFB347" />
      {/* peak gold node */}
      <circle cx="180" cy="80" r="28" fill={`url(#hlg-${id})`}>
        <animate attributeName="r" values="22;32;22" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.55;0.95;0.55" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="180" cy="80" r="8" fill={OB.amber} />
      <circle cx="180" cy="80" r="8" fill="none" stroke="#FAFAF8" strokeOpacity="0.4" strokeWidth="0.7" />
      <circle cx="180" cy="80" r="3" fill="#FFE7B8" />
    </svg>
  );
}

// Concept thread — silver Day 1 → gold Today, used on Screen 2 + 4
function ConceptThread({ width = 320, height = 200, label1 = 'Day 1', label2 = 'Today', nodes = 5 }) {
  const id = React.useId();
  const padX = 28;
  const w = width - padX * 2;
  const midY = height / 2;
  const amp = 36;
  const pts = [];
  const steps = 100;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = padX + t * w;
    const y = midY + Math.sin(t * Math.PI * 2.4) * amp * (0.55 + 0.45 * t);
    pts.push([x, y]);
  }
  const d = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ');

  const intermediate = [];
  for (let i = 1; i < nodes - 1; i++) {
    const t = i / (nodes - 1);
    const x = padX + t * w;
    const y = midY + Math.sin(t * Math.PI * 2.4) * amp * (0.55 + 0.45 * t);
    intermediate.push({ x, y, t });
  }
  const startX = padX, startY = midY + Math.sin(0) * amp * 0.55;
  const endX = padX + w;
  const endY = midY + Math.sin(1 * Math.PI * 2.4) * amp;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`ct-${id}`} x1="0" y1="0" x2={width} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#C9C5BD" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#D8C8A2" />
          <stop offset="1" stopColor={OB.amber} />
        </linearGradient>
        <radialGradient id={`ctg-${id}`}>
          <stop offset="0" stopColor={OB.amber} stopOpacity="0.6" />
          <stop offset="1" stopColor={OB.amber} stopOpacity="0" />
        </radialGradient>
        <filter id={`ctb-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <path d={d} stroke={`url(#ct-${id})`} strokeWidth="6" strokeLinecap="round" opacity="0.16" filter={`url(#ctb-${id})`} />
      <path d={d} stroke={`url(#ct-${id})`} strokeWidth="2" strokeLinecap="round" />

      {intermediate.map((n, i) => {
        const t = n.t;
        const r = Math.round(201 + (245 - 201) * Math.pow(t, 1.3));
        const g = Math.round(197 + (166 - 197) * Math.pow(t, 1.3));
        const b = Math.round(189 + (35 - 189) * Math.pow(t, 1.3));
        return <circle key={i} cx={n.x} cy={n.y} r="3" fill={`rgb(${r},${g},${b})`} />;
      })}

      {/* Start (silver) node */}
      <circle cx={startX} cy={startY} r="5" fill={OB.silver} />
      <circle cx={startX} cy={startY} r="5" fill="none" stroke="#FAFAF8" strokeOpacity="0.25" strokeWidth="0.6" />
      <text x={startX} y={startY + 26} textAnchor="middle" fill={OB.mutedSoft}
        style={{ fontFamily: obBody.fontFamily, fontSize: 10, fontWeight: 600, letterSpacing: '0.16em' }}>
        {label1.toUpperCase()}
      </text>

      {/* End (gold) node */}
      <circle cx={endX} cy={endY} r="22" fill={`url(#ctg-${id})`}>
        <animate attributeName="r" values="18;26;18" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.55;0.95;0.55" dur="2.6s" repeatCount="indefinite" />
      </circle>
      <circle cx={endX} cy={endY} r="7" fill={OB.amber} />
      <circle cx={endX} cy={endY} r="7" fill="none" stroke="#FAFAF8" strokeOpacity="0.4" strokeWidth="0.7" />
      <circle cx={endX} cy={endY} r="2.4" fill="#FFE7B8" />
      <text x={endX} y={endY + 30} textAnchor="middle" fill={OB.amber}
        style={{ fontFamily: obBody.fontFamily, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em' }}>
        {label2.toUpperCase()}
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
// Frame wrapper — gives every screen the iPhone-ish shape inside
// a DCArtboard. (We are NOT using the IOSDevice wrapper here to
// keep the frames compact and consistent inside the canvas.)
// ─────────────────────────────────────────────────────────
function PhoneFrame({ children }) {
  return (
    <div style={{
      width: 320, height: 660, borderRadius: 44, overflow: 'hidden',
      background: OB.bg, color: OB.text, position: 'relative',
      border: `1px solid rgba(250,250,248,0.06)`,
      boxShadow: '0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.4)',
      fontFamily: obBody.fontFamily,
    }}>
      {/* status bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 22px',
        ...obBody, fontSize: 13, fontWeight: 600, color: OB.text,
        zIndex: 10,
      }}>
        <span>9:41</span>
        <div style={{
          width: 90, height: 26, borderRadius: 14, background: '#000',
        }} />
        <span style={{ opacity: 0.85 }}>
          <svg width="44" height="11" viewBox="0 0 44 11" fill="none">
            <rect x="0" y="2" width="16" height="7" rx="1.5" fill={OB.text} opacity="0.8" />
            <rect x="20" y="3" width="3" height="5" rx="0.8" fill={OB.text} opacity="0.8" />
            <rect x="25" y="2" width="3" height="6" rx="0.8" fill={OB.text} opacity="0.8" />
            <rect x="30" y="1" width="3" height="7" rx="0.8" fill={OB.text} opacity="0.8" />
            <rect x="35" y="0" width="3" height="8" rx="0.8" fill={OB.text} opacity="0.8" />
          </svg>
        </span>
      </div>
      {/* home indicator */}
      <div style={{
        position: 'absolute', bottom: 8, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', zIndex: 10,
      }}>
        <div style={{ width: 110, height: 4, borderRadius: 2, background: 'rgba(250,250,248,0.45)' }} />
      </div>
      {/* warm vignette */}
      <div style={{
        position: 'absolute', top: -80, right: -80, width: 280, height: 280,
        background: 'radial-gradient(circle, rgba(245,166,35,0.07) 0%, rgba(245,166,35,0) 65%)',
        pointerEvents: 'none',
      }} />
      {/* content */}
      <div style={{ position: 'absolute', inset: 0, paddingTop: 48, paddingBottom: 28, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Screen 1 — Welcome
// ─────────────────────────────────────────────────────────
function Screen1_Welcome() {
  return (
    <PhoneFrame>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px', position: 'relative' }}>
        <HeroThreadMark size={180} />
        <div style={{ ...obDisplay, fontSize: 48, lineHeight: 1, color: OB.text, marginTop: 32 }}>
          Meridian
        </div>
        <div style={{ ...obBody, fontSize: 14, color: OB.muted, marginTop: 14, textAlign: 'center', lineHeight: 1.5, textWrap: 'pretty' }}>
          Your goals. Your evidence.<br/>Your highest point.
        </div>
      </div>
      <div style={{ padding: '0 22px 18px', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
        <GoldButton>Get started</GoldButton>
        <div style={{ ...obBody, fontSize: 13, color: OB.muted }}>
          Already have an account? <span style={{ color: OB.text, fontWeight: 500 }}>Sign in</span>
        </div>
      </div>
    </PhoneFrame>
  );
}

// ─────────────────────────────────────────────────────────
// Screen 2 — Concept
// ─────────────────────────────────────────────────────────
function Screen2_Concept() {
  return (
    <PhoneFrame>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 26px' }}>
        <div style={{
          marginTop: 12, padding: '18px 8px 22px',
          background: `linear-gradient(180deg, ${OB.surface} 0%, #1E1D1A 100%)`,
          border: `0.5px solid ${OB.hairline}`,
          borderRadius: 24, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -40, right: -50, width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(245,166,35,0.14) 0%, rgba(245,166,35,0) 65%)',
            pointerEvents: 'none',
          }} />
          <ConceptThread width={260} height={170} />
        </div>

        <h1 style={{ ...obDisplay, fontSize: 34, lineHeight: 1.05, color: OB.text, margin: '28px 0 14px' }}>
          Show your work.
        </h1>
        <p style={{ ...obBody, fontSize: 14.5, lineHeight: 1.55, color: OB.muted, margin: 0, textWrap: 'pretty' }}>
          Most goal apps let you tap done and move on. Meridian makes you prove it. Every entry builds your evidence — a real record of who you became and how.
        </p>
      </div>

      <div style={{ padding: '0 22px 18px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <GoldButton>
          Continue
          <Icon name="arrow" size={16} color="#1A1917" stroke={2.2} />
        </GoldButton>
        <ProgressDots count={4} active={1} />
      </div>
    </PhoneFrame>
  );
}

// ─────────────────────────────────────────────────────────
// Screen 3 — First goal
// ─────────────────────────────────────────────────────────
function S3Input({ placeholder, value }) {
  return (
    <div style={{
      background: 'rgba(0,0,0,0.22)',
      border: `0.5px solid ${OB.hairline}`,
      borderRadius: 14,
      padding: '14px 14px',
      ...obBody, fontSize: 15, color: value ? OB.text : OB.mutedSoft,
      minHeight: 50, display: 'flex', alignItems: 'center',
    }}>
      {value || placeholder}
      <span style={{ marginLeft: 4, width: 1, height: 18, background: OB.amber, opacity: 0.6, animation: 'none' }} />
    </div>
  );
}

function Chip({ children }) {
  return (
    <div style={{
      padding: '7px 12px', borderRadius: 999,
      border: `0.8px solid rgba(245,166,35,0.45)`,
      background: 'rgba(245,166,35,0.04)',
      ...obBody, fontSize: 12, fontWeight: 500, color: OB.amber,
      whiteSpace: 'nowrap',
    }}>{children}</div>
  );
}

function Screen3_FirstGoal() {
  return (
    <PhoneFrame>
      <div style={{ flex: 1, padding: '14px 22px 0', overflow: 'hidden' }}>
        <h1 style={{ ...obDisplay, fontSize: 28, lineHeight: 1.1, color: OB.text, margin: '0 0 8px' }}>
          What do you want<br/>to achieve?
        </h1>
        <p style={{ ...obBody, fontSize: 13.5, color: OB.muted, margin: '0 0 22px', textWrap: 'pretty' }}>
          You can add more later. Start with one thing.
        </p>

        <div style={{ ...obBody, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: OB.mutedSoft, marginBottom: 8 }}>
          Goal
        </div>
        <S3Input placeholder="e.g. Learn Swift, Run a 5K, Write daily..." />

        <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
          {['Fitness', 'Writing', 'Learning', 'Career', 'Creative'].map(c => <Chip key={c}>{c}</Chip>)}
        </div>

        <div style={{ ...obBody, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: OB.mutedSoft, margin: '22px 0 8px' }}>
          What does doing the work look like?
        </div>
        <S3Input placeholder="e.g. Write 200 words, Run 20 mins..." />
      </div>

      <div style={{ padding: '14px 22px 18px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <GoldButton>
          Create my first thread
          <Icon name="arrow" size={16} color="#1A1917" stroke={2.2} />
        </GoldButton>
        <ProgressDots count={4} active={2} />
      </div>
    </PhoneFrame>
  );
}

// ─────────────────────────────────────────────────────────
// Screen 4 — You're in
// ─────────────────────────────────────────────────────────
function Screen4_Ready() {
  return (
    <PhoneFrame>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '32%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 360, height: 360,
          background: 'radial-gradient(circle, rgba(245,166,35,0.12) 0%, rgba(245,166,35,0) 60%)',
          pointerEvents: 'none',
        }} />
        <ConceptThread width={280} height={200} label1="Today" label2="Onward" nodes={7} />

        <h1 style={{ ...obDisplay, fontSize: 30, lineHeight: 1.1, color: OB.text, margin: '24px 0 14px', textAlign: 'center', textWrap: 'pretty' }}>
          Your first thread<br/>is ready.
        </h1>
        <p style={{ ...obBody, fontSize: 14, color: OB.muted, margin: 0, textAlign: 'center', lineHeight: 1.55, textWrap: 'pretty', maxWidth: 260 }}>
          You showed up once. That's how every great thread started.
        </p>
      </div>

      <div style={{ padding: '0 22px 18px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <GoldButton>
          Start building
          <Icon name="arrow" size={16} color="#1A1917" stroke={2.2} />
        </GoldButton>
        <ProgressDots count={4} active={3} />
      </div>
    </PhoneFrame>
  );
}

Object.assign(window, {
  Screen1_Welcome, Screen2_Concept, Screen3_FirstGoal, Screen4_Ready,
});
