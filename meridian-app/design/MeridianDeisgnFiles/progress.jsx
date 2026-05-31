// Meridian — Progress screen (tab 2)
// Same design system. Header → consistency heatmap → per-goal bars → momentum graph.

const PR = {
  bg: '#1A1917',
  surface: '#242320',
  surfaceRaised: '#2A2925',
  hairline: 'rgba(250,250,248,0.07)',
  hairlineStrong: 'rgba(250,250,248,0.12)',
  text: '#FAFAF8',
  muted: '#8A8580',
  mutedSoft: '#6C6862',
  amber: '#F5A623',
  amberSoft: 'rgba(245,166,35,0.12)',
  silver: '#C9C5BD',
};
const prDisplay = {
  fontFamily: '"Fraunces", "Times New Roman", serif',
  fontStyle: 'italic',
  fontWeight: 300,
  letterSpacing: '-0.01em',
};
const prBody = {
  fontFamily: '-apple-system, "SF Pro Text", "SF Pro", system-ui, sans-serif',
};

// ──────────────────────────────────────────────────────
// Header
// ──────────────────────────────────────────────────────
function ProgressHeader() {
  return (
    <div style={{ padding: '8px 22px 22px' }}>
      <div style={{
        ...prBody, fontSize: 11, fontWeight: 600,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: PR.mutedSoft, marginBottom: 8,
      }}>
        May 2026
      </div>
      <h1 style={{ ...prDisplay, fontSize: 34, lineHeight: 1.05, color: PR.text, margin: '0 0 16px' }}>
        Your momentum.
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px 10px', ...prBody, fontSize: 13, color: PR.text }}>
        <span>4 active threads</span>
        <span style={{ width: 4, height: 4, borderRadius: 2, background: PR.amber }} />
        <span>247 total entries</span>
        <span style={{ width: 4, height: 4, borderRadius: 2, background: PR.amber }} />
        <span>12 day streak</span>
      </div>
    </div>
  );
}

function SectionLabel({ children, extra }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 22px', marginBottom: 12 }}>
      <div style={{
        ...prBody, fontSize: 11, fontWeight: 600,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: PR.mutedSoft,
      }}>
        {children}
      </div>
      {extra}
    </div>
  );
}

// ──────────────────────────────────────────────────────
// Consistency heatmap
// ──────────────────────────────────────────────────────
function Heatmap() {
  // 6 rows × 12 cols. Deterministic pseudo-random levels.
  const rows = 6, cols = 12;
  // Bias recent (right) cells toward higher intensity.
  const cells = [];
  let seed = 137;
  const rand = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const recencyBoost = c / cols; // 0..1
      const v = rand();
      // bias: bring up
      let lvl = 0;
      const combined = v * 0.65 + recencyBoost * 0.55;
      if (combined > 0.92) lvl = 4;
      else if (combined > 0.72) lvl = 3;
      else if (combined > 0.52) lvl = 2;
      else if (combined > 0.32) lvl = 1;
      else lvl = 0;
      row.push(lvl);
    }
    cells.push(row);
  }

  const lvlColor = (lvl) => {
    if (lvl === 0) return { bg: 'rgba(250,250,248,0.04)', border: PR.hairline, glow: false };
    if (lvl === 1) return { bg: 'rgba(245,166,35,0.18)', border: 'rgba(245,166,35,0.25)', glow: false };
    if (lvl === 2) return { bg: 'rgba(245,166,35,0.38)', border: 'rgba(245,166,35,0.4)', glow: false };
    if (lvl === 3) return { bg: 'rgba(245,166,35,0.68)', border: 'rgba(245,166,35,0.55)', glow: false };
    return { bg: PR.amber, border: 'rgba(255,200,90,0.6)', glow: true };
  };

  const cellSize = 18;
  const gap = 5;

  return (
    <div style={{
      margin: '0 22px 26px',
      background: PR.surface,
      border: `0.5px solid ${PR.hairline}`,
      borderRadius: 20,
      padding: '18px 18px 16px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -50, right: -60, width: 200, height: 200,
        background: 'radial-gradient(circle, rgba(245,166,35,0.10) 0%, rgba(245,166,35,0) 65%)',
        pointerEvents: 'none',
      }} />

      {/* Day labels left */}
      <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
        <div style={{
          display: 'flex', flexDirection: 'column', gap, paddingTop: 0,
          ...prBody, fontSize: 9.5, fontWeight: 500, color: PR.mutedSoft, letterSpacing: '0.06em',
        }}>
          {['M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} style={{ height: cellSize, display: 'flex', alignItems: 'center' }}>{d}</div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap }}>
          {cells.map((row, r) => (
            <div key={r} style={{ display: 'flex', gap }}>
              {row.map((lvl, c) => {
                const col = lvlColor(lvl);
                return (
                  <div key={c} style={{
                    width: cellSize, height: cellSize, borderRadius: 4,
                    background: col.bg,
                    border: `0.5px solid ${col.border}`,
                    boxShadow: col.glow ? '0 0 8px rgba(245,166,35,0.4)' : 'none',
                  }} />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, marginTop: 14, position: 'relative' }}>
        <span style={{ ...prBody, fontSize: 11, color: PR.mutedSoft }}>Less</span>
        {[0, 1, 2, 3, 4].map(l => {
          const col = lvlColor(l);
          return (
            <div key={l} style={{
              width: 11, height: 11, borderRadius: 2.5,
              background: col.bg, border: `0.5px solid ${col.border}`,
            }} />
          );
        })}
        <span style={{ ...prBody, fontSize: 11, color: PR.mutedSoft }}>More</span>
      </div>

      <div style={{ ...prBody, fontSize: 12, color: PR.muted, marginTop: 12, position: 'relative' }}>
        Most active: <span style={{ color: PR.text }}>Tuesdays and Thursdays</span>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────
// The Thread Wall — 4 vertical threads side by side
// Each thread = one goal; nodes = evidence entries from bottom (oldest)
// to top (most recent). Silver fades to gold up the line. Cold threads
// dim. Top node glows.
// ──────────────────────────────────────────────────────
function VerticalThread({ width, height, nodes, daysSinceLast, accent = '#F5A623' }) {
  const id = React.useId();
  const padY = 18;
  const innerH = height - padY * 2;
  const cx = width / 2;
  // Subtle horizontal sway so the thread feels alive, not a ruler.
  const sway = Math.min(8, width * 0.18);
  const cold = daysSinceLast >= 3;
  const dim = cold ? 0.42 : 1;

  // Build a smooth vertical path with slight sine sway.
  const pts = [];
  const steps = 80;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps; // 0 = top (newest), 1 = bottom (oldest)
    const y = padY + t * innerH;
    const x = cx + Math.sin(t * Math.PI * 2.2) * sway * (0.4 + 0.6 * (1 - t));
    pts.push([x, y]);
  }
  const d = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ');

  // Node positions sampled along same curve. t=0 = top/newest.
  const nodePts = [];
  for (let i = 0; i < nodes.length; i++) {
    const t = nodes.length === 1 ? 0 : i / (nodes.length - 1);
    const y = padY + t * innerH;
    const x = cx + Math.sin(t * Math.PI * 2.2) * sway * (0.4 + 0.6 * (1 - t));
    nodePts.push({ x, y, t });
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" style={{ display: 'block', opacity: dim }}>
      <defs>
        <linearGradient id={`vt-${id}`} x1="0" y1={padY} x2="0" y2={padY + innerH} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={accent} />
          <stop offset="0.35" stopColor="#D8C8A2" />
          <stop offset="1" stopColor="#C9C5BD" stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id={`vtg-${id}`}>
          <stop offset="0" stopColor={accent} stopOpacity={cold ? 0.25 : 0.7} />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <filter id={`vtb-${id}`} x="-100%" y="-50%" width="300%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* soft blurred underlay for warmth */}
      <path d={d} stroke={`url(#vt-${id})`} strokeWidth="5" strokeLinecap="round" opacity="0.18" filter={`url(#vtb-${id})`} />
      {/* main thread */}
      <path d={d} stroke={`url(#vt-${id})`} strokeWidth="1.6" strokeLinecap="round" />

      {/* Nodes — bottom (oldest) silver, top (newest) gold */}
      {nodePts.map((n, i) => {
        const isTop = i === 0; // newest
        if (isTop) {
          return (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={cold ? 12 : 16} fill={`url(#vtg-${id})`}>
                {!cold && <animate attributeName="r" values="13;19;13" dur="2.8s" repeatCount="indefinite" />}
                {!cold && <animate attributeName="opacity" values="0.55;0.95;0.55" dur="2.8s" repeatCount="indefinite" />}
              </circle>
              <circle cx={n.x} cy={n.y} r="4.5" fill={cold ? '#9C8F6E' : accent} />
              <circle cx={n.x} cy={n.y} r="4.5" fill="none" stroke="#FAFAF8" strokeOpacity={cold ? 0.18 : 0.4} strokeWidth="0.6" />
              {!cold && <circle cx={n.x} cy={n.y} r="1.6" fill="#FFE7B8" />}
            </g>
          );
        }
        // Past nodes — fade silver as we go down (toward older).
        const t = n.t; // 0 top → 1 bottom
        const r = Math.round(245 - (245 - 201) * Math.pow(t, 0.9));
        const g = Math.round(166 - (166 - 197) * Math.pow(t, 0.9));
        const b = Math.round(35 + (189 - 35) * Math.pow(t, 0.9));
        return (
          <circle key={i} cx={n.x} cy={n.y} r={2.4} fill={`rgb(${r},${g},${b})`} />
        );
      })}
    </svg>
  );
}

function ThreadWall() {
  // Each goal has a different density + length + warmth profile.
  // nodes: array — length = entry count visualized; we cap to a sensible viz number.
  const goals = [
    {
      name: 'Daily writing', entries: 87, daysSinceLast: 0,
      // Very dense — many nodes
      density: 22,
    },
    {
      name: 'Strength',     entries: 34, daysSinceLast: 2,
      density: 14,
    },
    {
      name: 'Learn Swift',  entries: 18, daysSinceLast: 6,
      density: 7, // sparse — inconsistent + cold
    },
    {
      name: 'Read',         entries: 42, daysSinceLast: 1,
      density: 17,
    },
  ].map(g => ({ ...g, nodes: Array.from({ length: g.density }, () => null) }));

  const threadW = 64;
  const threadH = 220;

  return (
    <div style={{
      margin: '0 22px 26px',
      background: PR.surface,
      border: `0.5px solid ${PR.hairline}`,
      borderRadius: 22,
      padding: '22px 14px 18px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* warm ambient — soft from top, like the candles are lit */}
      <div style={{
        position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)',
        width: '90%', height: 180,
        background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(245,166,35,0.14) 0%, rgba(245,166,35,0) 70%)',
        pointerEvents: 'none',
      }} />
      {/* base shadow at floor */}
      <div style={{
        position: 'absolute', bottom: 56, left: 14, right: 14, height: 24,
        background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        alignItems: 'end', justifyItems: 'center',
        position: 'relative', gap: 4,
      }}>
        {goals.map((g, i) => (
          <div key={g.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <VerticalThread width={threadW} height={threadH} nodes={g.nodes} daysSinceLast={g.daysSinceLast} />
            <div style={{ height: 0.5, width: '70%', background: PR.hairline }} />
            <div style={{ textAlign: 'center', paddingTop: 4 }}>
              <div style={{ ...prDisplay, fontSize: 14, color: g.daysSinceLast >= 3 ? PR.muted : PR.text, lineHeight: 1.1, marginBottom: 4 }}>
                {g.name}
              </div>
              <div style={{ ...prBody, fontSize: 10.5, color: PR.mutedSoft, letterSpacing: '0.06em' }}>
                {g.entries} entries
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
        marginTop: 16, ...prBody, fontSize: 11, color: PR.mutedSoft,
        position: 'relative',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: PR.amber, boxShadow: '0 0 6px rgba(245,166,35,0.6)' }} />
          Burning
        </span>
        <span style={{ width: 0.5, height: 10, background: PR.hairline }} />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: '#9C8F6E' }} />
          Cold
        </span>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────
// Per-goal progress bars
// ──────────────────────────────────────────────────────
function GoalProgressRow({ goal, last }) {
  return (
    <div style={{ padding: '16px 22px', borderBottom: last ? 'none' : `0.5px solid ${PR.hairline}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <h3 style={{ ...prDisplay, fontSize: 19, lineHeight: 1.1, color: PR.text, margin: 0, flex: 1, minWidth: 0 }}>
          {goal.name}
        </h3>
        <div style={{ ...prBody, fontSize: 13.5, fontWeight: 500, color: PR.amber, letterSpacing: '-0.01em', flexShrink: 0 }}>
          {goal.pct}%
        </div>
      </div>

      <div style={{
        height: 5, borderRadius: 3, background: 'rgba(250,250,248,0.05)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${goal.pct}%`,
          background: `linear-gradient(90deg, ${PR.silver} 0%, ${PR.amber} 100%)`,
          borderRadius: 3,
          boxShadow: '0 0 8px rgba(245,166,35,0.35)',
        }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
        <div style={{ ...prBody, fontSize: 12, color: PR.muted }}>
          {goal.entries} entries
        </div>
        <div style={{ ...prBody, fontSize: 12, color: PR.mutedSoft }}>
          last logged {goal.lastLogged}
        </div>
      </div>
    </div>
  );
}

function GoalProgressCard() {
  const goals = [
    { id: 'g1', name: 'Daily writing',     pct: 84, entries: 87,  lastLogged: 'today' },
    { id: 'g2', name: 'Strength training', pct: 61, entries: 34,  lastLogged: '2d ago' },
    { id: 'g3', name: 'Learn Swift',       pct: 24, entries: 18,  lastLogged: 'yesterday' },
    { id: 'g4', name: 'Read 12 books',     pct: 42, entries: 5,   lastLogged: '4d ago' },
  ];
  return (
    <div style={{
      margin: '0 22px 26px',
      background: PR.surface,
      border: `0.5px solid ${PR.hairline}`,
      borderRadius: 20,
      overflow: 'hidden',
    }}>
      {goals.map((g, i) => (
        <GoalProgressRow key={g.id} goal={g} last={i === goals.length - 1} />
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────
// Momentum graph (entries per week, last 8 weeks)
// ──────────────────────────────────────────────────────
function MomentumGraph() {
  const id = React.useId();
  const width = 322;
  const height = 200;
  const padL = 30, padR = 18, padT = 14, padB = 32;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;

  // 8 weekly data points, week-ending labels
  const data = [
    { w: 'Mar 17', v: 2 },
    { w: 'Mar 24', v: 4 },
    { w: 'Mar 31', v: 3 },
    { w: 'Apr 7',  v: 5 },
    { w: 'Apr 14', v: 4 },
    { w: 'Apr 21', v: 6 },
    { w: 'Apr 28', v: 8 },
    { w: 'May 5',  v: 9 },
  ];
  const yMax = 10;

  const x = (i) => padL + (i / (data.length - 1)) * innerW;
  const y = (v) => padT + (1 - v / yMax) * innerH;

  const pts = data.map((d, i) => [x(i), y(d.v)]);
  const linePath = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ');
  const areaPath = `${linePath} L ${pts[pts.length - 1][0]} ${padT + innerH} L ${pts[0][0]} ${padT + innerH} Z`;

  return (
    <div style={{
      margin: '0 22px 28px',
      background: PR.surface,
      border: `0.5px solid ${PR.hairline}`,
      borderRadius: 20,
      padding: '14px 4px 8px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -40, right: -60, width: 220, height: 220,
        background: 'radial-gradient(circle, rgba(245,166,35,0.10) 0%, rgba(245,166,35,0) 65%)',
        pointerEvents: 'none',
      }} />

      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" style={{ display: 'block' }}>
        <defs>
          <linearGradient id={`mg-line-${id}`} x1="0" y1="0" x2={width} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={PR.silver} stopOpacity="0.6" />
            <stop offset="0.5" stopColor="#D8C8A2" />
            <stop offset="1" stopColor={PR.amber} />
          </linearGradient>
          <linearGradient id={`mg-fill-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={PR.amber} stopOpacity="0.22" />
            <stop offset="1" stopColor={PR.amber} stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`mg-glow-${id}`}>
            <stop offset="0" stopColor={PR.amber} stopOpacity="0.6" />
            <stop offset="1" stopColor={PR.amber} stopOpacity="0" />
          </radialGradient>
          <filter id={`mg-blur-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* y gridlines */}
        {[0, 5, 10].map(v => (
          <g key={v}>
            <line x1={padL} x2={width - padR} y1={y(v)} y2={y(v)} stroke="rgba(250,250,248,0.06)" strokeWidth="0.5" />
            <text x={padL - 8} y={y(v) + 4} textAnchor="end" fill={PR.mutedSoft}
              style={{ fontFamily: prBody.fontFamily, fontSize: 10, fontWeight: 500 }}>{v}</text>
          </g>
        ))}

        {/* area */}
        <path d={areaPath} fill={`url(#mg-fill-${id})`} />

        {/* underglow */}
        <path d={linePath} stroke={`url(#mg-line-${id})`} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.25" filter={`url(#mg-blur-${id})`} />

        {/* line — stroke widens toward the right by overlaying two paths */}
        <path d={linePath} stroke={`url(#mg-line-${id})`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
        <path d={pts.slice(Math.floor(pts.length / 2)).map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ')}
          stroke={`url(#mg-line-${id})`} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />

        {/* intermediate points */}
        {pts.slice(0, -1).map((p, i) => {
          const t = i / (pts.length - 1);
          const r = Math.round(201 + (245 - 201) * Math.pow(t, 1.3));
          const g = Math.round(197 + (166 - 197) * Math.pow(t, 1.3));
          const b = Math.round(189 + (35 - 189) * Math.pow(t, 1.3));
          return <circle key={i} cx={p[0]} cy={p[1]} r="2.2" fill={`rgb(${r},${g},${b})`} />;
        })}

        {/* glowing latest point */}
        {(() => {
          const p = pts[pts.length - 1];
          return (
            <g>
              <circle cx={p[0]} cy={p[1]} r="18" fill={`url(#mg-glow-${id})`}>
                <animate attributeName="r" values="14;22;14" dur="2.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0.95;0.5" dur="2.6s" repeatCount="indefinite" />
              </circle>
              <circle cx={p[0]} cy={p[1]} r="5" fill={PR.amber} />
              <circle cx={p[0]} cy={p[1]} r="5" fill="none" stroke="#FAFAF8" strokeOpacity="0.4" strokeWidth="0.6" />
              <circle cx={p[0]} cy={p[1]} r="1.8" fill="#FFE7B8" />
            </g>
          );
        })()}

        {/* x axis labels — show 4 to avoid crowding */}
        {data.map((d, i) => {
          if (i % 2 !== 0 && i !== data.length - 1) return null;
          const isLast = i === data.length - 1;
          return (
            <text key={i} x={x(i)} y={padT + innerH + 18} textAnchor="middle"
              fill={isLast ? PR.amber : PR.mutedSoft}
              style={{ fontFamily: prBody.fontFamily, fontSize: 9.5, fontWeight: isLast ? 700 : 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {d.w}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// ──────────────────────────────────────────────────────
// Tab bar (same as Home, but Progress is active)
// ──────────────────────────────────────────────────────
function ProgressTabBar({ active, onTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'progress', label: 'Progress', icon: 'progress' },
    { id: 'goals', label: 'Goals', icon: 'goals' },
    { id: 'profile', label: 'Profile', icon: 'profile' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      paddingBottom: 34, pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 34, height: 120,
        background: `linear-gradient(180deg, rgba(26,25,23,0) 0%, rgba(26,25,23,0.85) 45%, ${PR.bg} 100%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '12px 14px 4px', pointerEvents: 'auto',
      }}>
        {tabs.map(t => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onTab && onTab(t.id)}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                padding: '8px 12px',
                color: isActive ? PR.text : PR.mutedSoft,
              }}
            >
              <Icon name={t.icon} size={22} color={isActive ? PR.amber : PR.mutedSoft} active={isActive} stroke={1.6} />
              <div style={{
                ...prBody, fontSize: 10, fontWeight: 500,
                color: isActive ? PR.text : PR.mutedSoft,
                letterSpacing: '0.02em',
              }}>
                {t.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────
function ProgressScreen({ onTab }) {
  const [tab, setTab] = React.useState('progress');
  return (
    <div style={{
      width: '100%', height: '100%', boxSizing: 'border-box',
      background: PR.bg, color: PR.text,
      position: 'relative', overflow: 'hidden', paddingTop: 54,
    }}>
      <div style={{
        position: 'absolute', top: -120, right: -120, width: 380, height: 380,
        background: 'radial-gradient(circle, rgba(245,166,35,0.06) 0%, rgba(245,166,35,0) 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', position: 'relative', paddingBottom: 110 }} className="hide-scrollbar">
        <ProgressHeader />

        <SectionLabel>Your threads</SectionLabel>
        <ThreadWall />

        <SectionLabel extra={<div style={{ ...prBody, fontSize: 12, color: PR.mutedSoft, paddingRight: 22 }}>4 active</div>}>
          Progress
        </SectionLabel>
        <GoalProgressCard />

        <SectionLabel extra={<div style={{ ...prBody, fontSize: 12, color: PR.mutedSoft, paddingRight: 22 }}>last 8 weeks</div>}>
          Entry frequency
        </SectionLabel>
        <MomentumGraph />
      </div>

      <ProgressTabBar active={tab} onTab={(t) => { setTab(t); onTab && onTab(t); }} />
    </div>
  );
}

Object.assign(window, { ProgressScreen });
