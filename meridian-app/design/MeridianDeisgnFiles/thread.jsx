// Thread visualization — the signature mark for Meridian.
// A meandering curve from silver to amber gold with circular nodes representing
// logged evidence over time. Filled nodes = past entries; hollow = future.

function ThreadMark({ size = 22, stroke = 1.6 }) {
  // Compact logo version — a small meandering thread with 3 nodes.
  const id = React.useId();
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <defs>
        <linearGradient id={`tm-${id}`} x1="2" y1="11" x2="20" y2="11" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#C9C5BD" />
          <stop offset="1" stopColor="#F5A623" />
        </linearGradient>
      </defs>
      <path
        d="M2 14 C 5 14, 6 6, 9 6 C 12 6, 12 16, 15 16 C 18 16, 19 8, 20 8"
        stroke={`url(#tm-${id})`}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="3.5" cy="13.2" r="1.3" fill="#C9C5BD" />
      <circle cx="11" cy="11" r="1.5" fill="#D8B26E" />
      <circle cx="19.4" cy="8.4" r="1.6" fill="#F5A623" />
    </svg>
  );
}

// Mini thread for goal cards — wider, more nodes, animated subtly.
// `progress` 0–1 controls where the "current" gold node sits along the path.
// `nodes` is total node count. `accent` overrides amber.
function ThreadPath({
  width = 248,
  height = 70,
  nodes = 9,
  progress = 0.66,
  accent = '#F5A623',
  silver = '#C9C5BD',
  muted = 'rgba(201,197,189,0.18)',
}) {
  const id = React.useId();
  // Build a meandering path. Sine wave with slight randomness baked in via offsets.
  // We position nodes along the path by sampling x evenly and using same sine.
  const pad = 14;
  const w = width - pad * 2;
  const h = height;
  const amp = h * 0.32;
  const midY = h / 2;
  const freq = 1.6; // number of waves

  // Path as a smooth cubic-ish curve via many small line segments would be ugly.
  // Instead use a single SVG path with C commands. Build 4 control points across.
  const pts = [];
  const steps = 64;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = pad + t * w;
    const y = midY + Math.sin(t * Math.PI * freq * 2) * amp * (0.55 + 0.45 * t);
    pts.push([x, y]);
  }
  const d = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ');

  // Node positions — sample at evenly spaced t values.
  const nodeData = [];
  for (let i = 0; i < nodes; i++) {
    const t = nodes === 1 ? 0.5 : i / (nodes - 1);
    const x = pad + t * w;
    const y = midY + Math.sin(t * Math.PI * freq * 2) * amp * (0.55 + 0.45 * t);
    nodeData.push({ x, y, t });
  }

  // Where is the "current" position? Find node nearest to progress.
  const currentIdx = Math.round(progress * (nodes - 1));

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`tp-${id}`} x1="0" y1="0" x2={width} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={silver} stopOpacity="0.85" />
          <stop offset={Math.max(0.05, progress - 0.05)} stopColor={silver} stopOpacity="0.95" />
          <stop offset={progress} stopColor="#E5C98A" />
          <stop offset={Math.min(0.98, progress + 0.02)} stopColor={accent} />
          <stop offset="1" stopColor={accent} stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id={`tp-bg-${id}`} x1="0" y1="0" x2={width} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={muted} />
          <stop offset="1" stopColor={muted} />
        </linearGradient>
        <filter id={`tp-glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background ghost path (the whole journey, including future) */}
      <path d={d} stroke={muted} strokeWidth="1" strokeDasharray="2 3" strokeLinecap="round" />

      {/* Active path — drawn from start to progress */}
      <path
        d={d}
        stroke={`url(#tp-${id})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={`${progress * 1000} 1000`}
      />

      {/* Nodes */}
      {nodeData.map((n, i) => {
        const past = i < currentIdx;
        const current = i === currentIdx;
        const future = i > currentIdx;
        if (current) {
          return (
            <g key={i} filter={`url(#tp-glow-${id})`}>
              <circle cx={n.x} cy={n.y} r="5" fill={accent} opacity="0.18" />
              <circle cx={n.x} cy={n.y} r="3.2" fill={accent} />
              <circle cx={n.x} cy={n.y} r="3.2" fill="none" stroke="#FAFAF8" strokeOpacity="0.35" strokeWidth="0.5" />
            </g>
          );
        }
        if (past) {
          // Past nodes: small filled, color interpolated silver -> amber by t
          const t = n.t / Math.max(0.01, progress);
          // Interpolate silver to a warmer tone as we approach current
          const r = Math.round(201 + (245 - 201) * t);
          const g = Math.round(197 + (166 - 197) * t);
          const b = Math.round(189 + (35 - 189) * t);
          const col = `rgb(${r},${g},${b})`;
          return <circle key={i} cx={n.x} cy={n.y} r="2.1" fill={col} />;
        }
        // future
        return (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r="1.8"
            fill="none"
            stroke="rgba(201,197,189,0.35)"
            strokeWidth="0.8"
          />
        );
      })}
    </svg>
  );
}

Object.assign(window, { ThreadMark, ThreadPath });
