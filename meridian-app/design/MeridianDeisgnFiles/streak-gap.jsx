// Meridian — Streak gap screen
// Shown on app open after a missed day. Warm, not punishing.
// Reframes the gap as part of the thread's story.

const SG = {
  bg: '#1A1917',
  surface: '#242320',
  hairline: 'rgba(250,250,248,0.07)',
  text: '#FAFAF8',
  muted: '#8A8580',
  mutedSoft: '#6C6862',
  amber: '#F5A623',
  amberSoft: 'rgba(245,166,35,0.12)',
  silver: '#C9C5BD',
  silverDim: '#7A766F',
};

const sgDisplay = {
  fontFamily: '"Fraunces", "Times New Roman", serif',
  fontStyle: 'italic',
  fontWeight: 300,
  letterSpacing: '-0.012em',
};
const sgBody = {
  fontFamily: '-apple-system, "SF Pro Text", "SF Pro", system-ui, sans-serif',
};

// ─────────────────────────────────────────────────────────
// The thread, with a gap.
// Mirrors HeroThread geometry from Goal Detail but breaks
// the path at a "gap index" — the day that was missed.
// ─────────────────────────────────────────────────────────
function ThreadWithGap({ totalDays = 23, gapDay = 22 }) {
  // We render `totalDays` nodes spaced along the curve. The node at index
  // `gapDay - 1` is the gap (yesterday). Path is split before/after it,
  // bridged by a dotted line. The most recent node is hollow/glowing —
  // "still alive" but waiting for today's evidence.
  const id = React.useId();
  const width = 322;
  const height = 200;
  const padX = 20;
  const w = width - padX * 2;
  const midY = height / 2 + 4;
  const amp = 46;
  const freq = 1.8;

  // Dense sampling so we can chop the path cleanly around the gap
  const steps = 240;
  const curve = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = padX + t * w;
    const y = midY + Math.sin(t * Math.PI * freq * 2) * amp * (0.5 + 0.5 * t);
    curve.push([x, y, t]);
  }

  // Node positions
  const nodes = [];
  for (let i = 0; i < totalDays; i++) {
    const t = totalDays === 1 ? 1 : i / (totalDays - 1);
    const x = padX + t * w;
    const y = midY + Math.sin(t * Math.PI * freq * 2) * amp * (0.5 + 0.5 * t);
    nodes.push({ x, y, t, idx: i });
  }

  const gapIdx = gapDay - 1;            // node that was missed
  const gapNode = nodes[gapIdx];
  const todayIdx = totalDays - 1;       // today — still alive, faint glow
  const todayNode = nodes[todayIdx];

  // Split the curve into segments: before the gap and after the gap.
  // We chop a small visible "break" on either side of the gap node.
  const breakRadius = 0.022; // in t-units around the gap node's t
  const tGap = gapNode.t;
  const tToday = todayNode.t;
  const tBreakStart = Math.max(0, tGap - breakRadius);
  const tBreakEnd = Math.min(1, tGap + breakRadius);

  const segBefore = curve.filter(([, , t]) => t <= tBreakStart);
  const segAfter  = curve.filter(([, , t]) => t >= tBreakEnd);

  const toPath = (seg) =>
    seg.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(' ');

  // Dotted bridge — straight short line between the two break ends
  const bridgeStart = curve.find(([, , t]) => t >= tBreakStart) || curve[0];
  const bridgeEnd = curve.find(([, , t]) => t >= tBreakEnd) || curve[curve.length - 1];

  return (
    <div style={{ width, margin: '0 auto', position: 'relative' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          {/* Silver → warm → silver-with-faint-warm. Continuous all the way through. */}
          <linearGradient id={`sg-thread-${id}`} x1="0" y1="0" x2={width} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0"    stopColor={SG.silver} stopOpacity="0.55" />
            <stop offset="0.45" stopColor="#D8C8A2"   stopOpacity="0.9" />
            <stop offset={tGap.toFixed(3)} stopColor={SG.silverDim} stopOpacity="0.85" />
            <stop offset={Math.min(1, tGap + 0.04).toFixed(3)} stopColor="#C7AE74" stopOpacity="0.7" />
            <stop offset="1"    stopColor={SG.amber}  stopOpacity="0.75" />
          </linearGradient>
          <radialGradient id={`sg-today-glow-${id}`}>
            <stop offset="0"   stopColor={SG.amber} stopOpacity="0.55" />
            <stop offset="1"   stopColor={SG.amber} stopOpacity="0" />
          </radialGradient>
          <filter id={`sg-blur-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Soft underlay glow for the WHOLE path so the thread reads as continuous, even through the gap */}
        <path
          d={toPath(curve)}
          stroke={SG.silver}
          strokeOpacity="0.08"
          strokeWidth="6"
          strokeLinecap="round"
          filter={`url(#sg-blur-${id})`}
        />

        {/* Main path — before the gap */}
        <path
          d={toPath(segBefore)}
          stroke={`url(#sg-thread-${id})`}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Main path — after the gap */}
        <path
          d={toPath(segAfter)}
          stroke={`url(#sg-thread-${id})`}
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Dotted bridge across the gap */}
        <line
          x1={bridgeStart[0]} y1={bridgeStart[1]}
          x2={bridgeEnd[0]}   y2={bridgeEnd[1]}
          stroke={SG.silverDim}
          strokeOpacity="0.55"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="1.5 3"
        />

        {/* Nodes — silver→warmer along the curve, the gap node is dim, today is alive */}
        {nodes.map((n, i) => {
          const isGap = i === gapIdx;
          const isToday = i === todayIdx;

          if (isGap) {
            // The missed day: silver, dim, hollow ring — quiet, not red
            return (
              <g key={i}>
                <circle cx={n.x} cy={n.y} r="3.2" fill={SG.bg} />
                <circle
                  cx={n.x} cy={n.y} r="3.2"
                  fill="none"
                  stroke={SG.silverDim}
                  strokeOpacity="0.85"
                  strokeWidth="1"
                  strokeDasharray="1.4 1.6"
                />
              </g>
            );
          }

          if (isToday) {
            // Today: still alive — faint warm glow, hollow-ish so it reads as "waiting"
            return (
              <g key={i}>
                <circle cx={n.x} cy={n.y} r="14" fill={`url(#sg-today-glow-${id})`}>
                  <animate attributeName="r" values="11;16;11" dur="3.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0.85;0.5" dur="3.2s" repeatCount="indefinite" />
                </circle>
                <circle cx={n.x} cy={n.y} r="4.4" fill={SG.amber} opacity="0.18" />
                <circle cx={n.x} cy={n.y} r="3.2" fill={SG.bg} />
                <circle
                  cx={n.x} cy={n.y} r="3.2"
                  fill="none"
                  stroke={SG.amber}
                  strokeOpacity="0.9"
                  strokeWidth="1.2"
                />
                <circle cx={n.x} cy={n.y} r="1.1" fill={SG.amber} />
              </g>
            );
          }

          // Past, logged days — silver tone warming slightly toward the gold end
          const t = n.t;
          const r = Math.round(201 + (215 - 201) * Math.pow(t, 1.6));
          const g = Math.round(197 + (175 - 197) * Math.pow(t, 1.6));
          const b = Math.round(189 + (115 - 189) * Math.pow(t, 1.6));
          const col = `rgb(${r},${g},${b})`;
          return (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r="2.6" fill={col} />
              <circle cx={n.x} cy={n.y} r="2.6" fill="none" stroke="#FAFAF8" strokeOpacity="0.06" strokeWidth="0.5" />
            </g>
          );
        })}

        {/* Tiny "yesterday" label above the gap node — quietly acknowledges it */}
        <g transform={`translate(${gapNode.x} ${gapNode.y - 18})`}>
          <text
            textAnchor="middle"
            style={{
              ...sgBody,
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fill: SG.mutedSoft,
            }}
          >
            yesterday
          </text>
        </g>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Stats row — three columns, the gap framed as 1 in 23
// ─────────────────────────────────────────────────────────
function GapStats({ logged = 22, gaps = 1, total = 23 }) {
  const Col = ({ value, label, dim }) => (
    <div style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
      <div style={{
        ...sgDisplay, fontSize: 30, lineHeight: 1, color: dim ? SG.silver : SG.text,
        marginBottom: 8,
      }}>
        {value}
      </div>
      <div style={{
        ...sgBody, fontSize: 10.5, fontWeight: 600,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: SG.mutedSoft,
      }}>
        {label}
      </div>
    </div>
  );
  return (
    <div style={{
      margin: '0 22px',
      background: 'rgba(250,250,248,0.025)',
      border: `0.5px solid ${SG.hairline}`,
      borderRadius: 18,
      padding: '20px 6px',
      display: 'flex',
      alignItems: 'stretch',
      position: 'relative',
    }}>
      <Col value={logged} label="Logged days" />
      <div style={{ width: 0.5, background: SG.hairline, alignSelf: 'stretch', margin: '4px 0' }} />
      <Col value={gaps} label="Gap" dim />
      <div style={{ width: 0.5, background: SG.hairline, alignSelf: 'stretch', margin: '4px 0' }} />
      <Col value={total} label="Days total" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Header — just the goal label, no back chrome.
// This is a contextual welcome, not a destination.
// ─────────────────────────────────────────────────────────
function GapHeader({ goalName = 'Daily writing', day = 23 }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '8px 22px 0',
    }}>
      <div style={{
        ...sgBody, fontSize: 11, fontWeight: 600,
        letterSpacing: '0.24em', textTransform: 'uppercase',
        color: SG.amber,
      }}>
        {goalName} · Day {day}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────
function StreakGapScreen({
  goalName = 'Daily writing',
  totalDays = 23,
  loggedDays = 22,
  gapDays = 1,
  onLog = () => {},
  onLater = () => {},
}) {
  return (
    <div style={{
      width: '100%', height: '100%',
      boxSizing: 'border-box',
      background: SG.bg,
      color: SG.text,
      position: 'relative',
      overflow: 'hidden',
      paddingTop: 54,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Soft ambient warmth — present but very subtle (not celebratory) */}
      <div style={{
        position: 'absolute', top: -160, right: -120, width: 360, height: 360,
        background: 'radial-gradient(circle, rgba(245,166,35,0.07) 0%, rgba(245,166,35,0) 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -100, left: -100, width: 320, height: 320,
        background: 'radial-gradient(circle, rgba(201,197,189,0.035) 0%, rgba(201,197,189,0) 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        flex: 1,
        overflowY: 'auto', overflowX: 'hidden',
        position: 'relative',
        paddingTop: 18,
        paddingBottom: 24,
      }} className="hide-scrollbar">

        <GapHeader goalName={goalName} day={totalDays} />

        {/* Hero text block */}
        <div style={{ padding: '24px 28px 12px', textAlign: 'left' }}>
          <h1 style={{
            ...sgDisplay,
            fontSize: 42, lineHeight: 1.04,
            color: SG.text, margin: '0 0 16px',
            textWrap: 'pretty',
          }}>
            Your thread continues.
          </h1>
          <p style={{
            ...sgBody, fontSize: 15.5, lineHeight: 1.55,
            color: SG.muted, margin: 0,
            textWrap: 'pretty',
          }}>
            You missed yesterday. The gap is part of the story too. What matters is you're here now.
          </p>
        </div>

        {/* The thread, with a gap */}
        <div style={{
          margin: '14px 18px 24px',
          background: `linear-gradient(180deg, ${SG.surface} 0%, #1E1D1A 100%)`,
          border: `0.5px solid ${SG.hairline}`,
          borderRadius: 24,
          padding: '20px 8px 18px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            ...sgBody, fontSize: 10.5, fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: SG.mutedSoft,
            textAlign: 'center', marginBottom: 4,
          }}>
            The thread
          </div>
          <ThreadWithGap totalDays={totalDays} gapDay={totalDays - 1} />
        </div>

        {/* Stats */}
        <GapStats logged={loggedDays} gaps={gapDays} total={totalDays} />

        <div style={{
          ...sgBody, fontSize: 13, lineHeight: 1.5,
          color: SG.muted,
          textAlign: 'center',
          padding: '14px 36px 0',
          textWrap: 'pretty',
        }}>
          <span style={{ color: SG.text }}>{loggedDays} of {totalDays}</span> is still remarkable.
        </div>
      </div>

      {/* Sticky action area */}
      <div style={{
        position: 'relative',
        padding: '0 22px 34px',
        paddingTop: 8,
      }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: '100%', height: 60,
          background: `linear-gradient(180deg, rgba(26,25,23,0) 0%, ${SG.bg} 100%)`,
          pointerEvents: 'none',
        }} />

        <button
          onClick={onLog}
          style={{
            width: '100%', height: 54, borderRadius: 27,
            background: `linear-gradient(180deg, #F8B547 0%, ${SG.amber} 100%)`,
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: '0 10px 32px rgba(245,166,35,0.32), 0 1px 0 rgba(255,255,255,0.25) inset, 0 -1px 0 rgba(0,0,0,0.15) inset',
            ...sgBody, fontSize: 16, fontWeight: 600, color: '#1A1917',
            letterSpacing: '-0.01em',
          }}
        >
          Log today's evidence
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A1917" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        </button>

        <div style={{
          ...sgBody, fontSize: 12.5, lineHeight: 1.45,
          color: SG.mutedSoft,
          textAlign: 'center',
          marginTop: 14,
          letterSpacing: '0.01em',
          fontStyle: 'italic',
        }}>
          Gaps don't break threads. Quitting does.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { StreakGapScreen });
