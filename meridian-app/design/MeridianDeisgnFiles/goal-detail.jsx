// Meridian — Goal Detail screen
// Opens when a user taps a goal card on Home. Same design system.

const GD = {
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

const gdDisplay = {
  fontFamily: '"Fraunces", "Times New Roman", serif',
  fontStyle: 'italic',
  fontWeight: 300,
  letterSpacing: '-0.01em',
};

const gdBody = {
  fontFamily: '-apple-system, "SF Pro Text", "SF Pro", system-ui, sans-serif',
};

// ─────────────────────────────────────────────────────────
// Header — back, title block, overflow
// ─────────────────────────────────────────────────────────
function GoalHeader({ goal, onBack }) {
  return (
    <div style={{ padding: '4px 18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 40, marginBottom: 14 }}>
        <button
          onClick={onBack}
          style={{
            width: 38, height: 38, borderRadius: 19,
            background: GD.surface, border: `0.5px solid ${GD.hairline}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GD.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <button style={{
          width: 38, height: 38, borderRadius: 19,
          background: GD.surface, border: `0.5px solid ${GD.hairline}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', padding: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={GD.text}>
            <circle cx="5" cy="12" r="1.6" />
            <circle cx="12" cy="12" r="1.6" />
            <circle cx="19" cy="12" r="1.6" />
          </svg>
        </button>
      </div>

      <div style={{ padding: '0 4px' }}>
        <div style={{
          ...gdBody, fontSize: 11, fontWeight: 600,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: GD.amber, marginBottom: 8,
        }}>
          {goal.category}
        </div>
        <h1 style={{ ...gdDisplay, fontSize: 40, lineHeight: 1.02, color: GD.text, margin: '0 0 12px' }}>
          {goal.name}
        </h1>
        <div style={{ ...gdBody, fontSize: 13.5, color: GD.muted, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: GD.text }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill={GD.amber}>
              <path d="M12 3c.5 3 3.5 4 3.5 8a3.5 3.5 0 0 1-7 0c0-1.2.5-2 1-2.5C9 10 9 8 12 3Z" />
            </svg>
            {goal.streak} day streak
          </span>
          <span style={{ color: GD.mutedSoft }}>·</span>
          <span style={{ color: GD.text }}>{goal.entries} entries</span>
          <span style={{ color: GD.mutedSoft }}>·</span>
          <span>since {goal.startedLabel}</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Hero thread visualization — large, cinematic
// ─────────────────────────────────────────────────────────
function HeroThread({ entries, monthLabels }) {
  // Build a large meandering path with one node per entry.
  // We layout nodes evenly along the path; gold + glow on the most recent.
  const id = React.useId();
  const width = 322;
  const height = 200;
  const padX = 18;
  const w = width - padX * 2;
  const midY = height / 2 + 6;
  const amp = 50;
  const freq = 1.8;

  // Sample many points for a smooth curve
  const pts = [];
  const steps = 120;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = padX + t * w;
    const y = midY + Math.sin(t * Math.PI * freq * 2) * amp * (0.5 + 0.5 * t);
    pts.push([x, y]);
  }
  const d = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ');

  // Node positions
  const nodes = entries.map((_, i) => {
    const t = entries.length === 1 ? 1 : i / (entries.length - 1);
    const x = padX + t * w;
    const y = midY + Math.sin(t * Math.PI * freq * 2) * amp * (0.5 + 0.5 * t);
    return { x, y, t };
  });
  const lastIdx = nodes.length - 1;

  return (
    <div style={{
      margin: '0 18px 22px',
      background: `linear-gradient(180deg, ${GD.surface} 0%, #1E1D1A 100%)`,
      border: `0.5px solid ${GD.hairline}`,
      borderRadius: 24,
      padding: '20px 14px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* warm corner glow */}
      <div style={{
        position: 'absolute', top: -60, right: -80, width: 260, height: 260,
        background: 'radial-gradient(circle, rgba(245,166,35,0.16) 0%, rgba(245,166,35,0) 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 8px 6px', position: 'relative' }}>
        <div style={{ ...gdBody, fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: GD.mutedSoft }}>
          The thread
        </div>
        <div style={{ ...gdBody, fontSize: 11, color: GD.muted }}>
          {entries.length} nodes · last {entries[entries.length - 1].dateShort}
        </div>
      </div>

      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" style={{ display: 'block' }}>
        <defs>
          <linearGradient id={`hero-${id}`} x1="0" y1="0" x2={width} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={GD.silver} stopOpacity="0.7" />
            <stop offset="0.45" stopColor="#D8C8A2" />
            <stop offset="0.85" stopColor={GD.amber} />
            <stop offset="1" stopColor={GD.amber} stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id={`hero-glow-${id}`}>
            <stop offset="0" stopColor={GD.amber} stopOpacity="0.55" />
            <stop offset="1" stopColor={GD.amber} stopOpacity="0" />
          </radialGradient>
          <filter id={`hero-blur-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* soft underlay of path for glow */}
        <path d={d} stroke={`url(#hero-${id})`} strokeWidth="6" strokeLinecap="round" opacity="0.18" filter={`url(#hero-blur-${id})`} />

        {/* main path */}
        <path d={d} stroke={`url(#hero-${id})`} strokeWidth="2" strokeLinecap="round" />

        {/* Nodes */}
        {nodes.map((n, i) => {
          const isLast = i === lastIdx;
          if (isLast) {
            return (
              <g key={i}>
                <circle cx={n.x} cy={n.y} r="22" fill={`url(#hero-glow-${id})`}>
                  <animate attributeName="r" values="18;26;18" dur="2.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.55;0.95;0.55" dur="2.6s" repeatCount="indefinite" />
                </circle>
                <circle cx={n.x} cy={n.y} r="6" fill={GD.amber} />
                <circle cx={n.x} cy={n.y} r="6" fill="none" stroke="#FAFAF8" strokeOpacity="0.4" strokeWidth="0.6" />
                <circle cx={n.x} cy={n.y} r="2.2" fill="#FFE7B8" />
              </g>
            );
          }
          // Color interpolated silver -> warm by position
          const t = n.t;
          const r = Math.round(201 + (245 - 201) * Math.pow(t, 1.4));
          const g = Math.round(197 + (166 - 197) * Math.pow(t, 1.4));
          const b = Math.round(189 + (35 - 189) * Math.pow(t, 1.4));
          const col = `rgb(${r},${g},${b})`;
          return (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r="3" fill={col} />
              <circle cx={n.x} cy={n.y} r="3" fill="none" stroke="#FAFAF8" strokeOpacity="0.08" strokeWidth="0.5" />
            </g>
          );
        })}
      </svg>

      {/* X-axis */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        padding: '6px 22px 0', position: 'relative',
      }}>
        {monthLabels.map((m, i) => (
          <div key={i} style={{
            ...gdBody, fontSize: 10.5, fontWeight: 500,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: i === monthLabels.length - 1 ? GD.amber : GD.mutedSoft,
          }}>
            {m}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Coach card (matches Home)
// ─────────────────────────────────────────────────────────
function GoalCoachCard({ lastText, todayText }) {
  return (
    <div style={{ margin: '0 18px 26px', position: 'relative' }}>
      <div style={{
        position: 'relative',
        background: `linear-gradient(180deg, ${GD.surface} 0%, #1F1E1B 100%)`,
        border: `0.5px solid ${GD.hairline}`,
        borderRadius: 20,
        padding: '18px',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 160, height: 160,
          background: 'radial-gradient(circle, rgba(245,166,35,0.18) 0%, rgba(245,166,35,0) 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, position: 'relative' }}>
          <div style={{
            width: 22, height: 22, borderRadius: 11,
            background: GD.amberSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="sparkle" size={13} color={GD.amber} />
          </div>
          <div style={{ ...gdBody, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: GD.amber }}>
            Coach
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ ...gdBody, fontSize: 12, color: GD.mutedSoft }}>now</div>
        </div>

        <div style={{ ...gdBody, fontSize: 15, lineHeight: 1.5, color: GD.text, position: 'relative' }}>
          <span style={{ color: GD.muted }}>Last session you </span>
          <span>{lastText}</span>
          <span style={{ color: GD.muted }}>. </span>
          <br />
          <span style={{ ...gdDisplay, fontStyle: 'italic', fontSize: 17, color: GD.text }}>Today —</span>{' '}
          <span style={{ color: GD.text }}>{todayText}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16, position: 'relative' }}>
          <button style={{
            ...gdBody, fontSize: 13, fontWeight: 600, color: GD.text,
            background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            Accept the nudge
            <Icon name="arrow" size={14} color={GD.amber} stroke={1.8} />
          </button>
          <button style={{
            ...gdBody, fontSize: 13, fontWeight: 500, color: GD.mutedSoft,
            background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
          }}>
            Not today
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Evidence timeline
// ─────────────────────────────────────────────────────────
function EvidenceItem({ entry, last }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'stretch', position: 'relative' }}>
      {/* gutter with node + line */}
      <div style={{ width: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ height: 8 }} />
        <div style={{
          width: 10, height: 10, borderRadius: 5,
          background: GD.amber,
          boxShadow: '0 0 0 3px rgba(245,166,35,0.18)',
          flexShrink: 0,
        }} />
        {!last && (
          <div style={{
            width: 1, flex: 1, marginTop: 4,
            background: `linear-gradient(180deg, ${GD.amber}55 0%, ${GD.silver}33 60%, ${GD.silver}11 100%)`,
          }} />
        )}
      </div>

      {/* content */}
      <div style={{ flex: 1, minWidth: 0, paddingBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              ...gdBody, fontSize: 11, fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: GD.mutedSoft, marginBottom: 6,
            }}>
              {entry.dateLabel}
            </div>
            <div style={{ ...gdBody, fontSize: 14.5, lineHeight: 1.45, color: GD.text }}>
              {entry.text}
            </div>
            {entry.meta && (
              <div style={{ ...gdBody, fontSize: 12, color: GD.muted, marginTop: 8 }}>
                {entry.meta}
              </div>
            )}
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: 17,
            background: 'rgba(250,250,248,0.03)',
            border: `0.5px solid ${GD.hairline}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17, flexShrink: 0, marginTop: 2,
          }}>
            {entry.mood}
          </div>
        </div>
      </div>
    </div>
  );
}

function EvidenceTimeline({ entries, totalCount }) {
  return (
    <div style={{ padding: '0 22px 0' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
        <h2 style={{ ...gdDisplay, fontSize: 24, color: GD.text, margin: 0 }}>
          Your evidence
        </h2>
        <div style={{ ...gdBody, fontSize: 12, color: GD.mutedSoft, letterSpacing: '0.04em' }}>
          most recent first
        </div>
      </div>

      <div style={{ paddingLeft: 2 }}>
        {entries.map((e, i) => (
          <EvidenceItem key={e.id} entry={e} last={i === entries.length - 1} />
        ))}
      </div>

      <button style={{
        ...gdBody, fontSize: 13.5, fontWeight: 600, color: GD.amber,
        background: 'transparent', border: 'none', padding: '4px 0 0 32px',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 6,
        letterSpacing: '-0.005em',
      }}>
        View all {totalCount} entries
        <Icon name="arrow" size={14} color={GD.amber} stroke={1.9} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Sticky CTA (just the button; tab bar lives on Home)
// ─────────────────────────────────────────────────────────
function DetailCTA({ onLog }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      paddingBottom: 34, pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 34, height: 140,
        background: `linear-gradient(180deg, rgba(26,25,23,0) 0%, rgba(26,25,23,0.9) 50%, ${GD.bg} 100%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', padding: '0 22px 14px', pointerEvents: 'auto' }}>
        <button
          onClick={onLog}
          style={{
            width: '100%', height: 54, borderRadius: 27,
            background: `linear-gradient(180deg, #F8B547 0%, ${GD.amber} 100%)`,
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 10px 32px rgba(245,166,35,0.32), 0 1px 0 rgba(255,255,255,0.25) inset, 0 -1px 0 rgba(0,0,0,0.15) inset',
            ...gdBody, fontSize: 16, fontWeight: 600, color: '#1A1917',
            letterSpacing: '-0.01em',
          }}
        >
          <Icon name="plus" size={18} color="#1A1917" stroke={2.4} />
          Log evidence
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────
function GoalDetailScreen({ goal, onBack, onLog }) {
  const entries = goal.evidenceEntries;

  return (
    <div style={{
      width: '100%', height: '100%',
      boxSizing: 'border-box',
      background: GD.bg,
      color: GD.text,
      position: 'relative',
      overflow: 'hidden',
      paddingTop: 54,
    }}>
      <div style={{
        position: 'absolute', top: -120, right: -120, width: 380, height: 380,
        background: 'radial-gradient(circle, rgba(245,166,35,0.06) 0%, rgba(245,166,35,0) 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', position: 'relative', paddingBottom: 130 }} className="hide-scrollbar">
        <GoalHeader goal={goal} onBack={onBack} />
        <HeroThread entries={entries} monthLabels={goal.monthLabels} />
        <GoalCoachCard lastText={goal.coachLast} todayText={goal.coachToday} />
        <EvidenceTimeline entries={entries.slice(-3).reverse()} totalCount={goal.entries} />
      </div>

      <DetailCTA onLog={onLog || (() => {})} />
    </div>
  );
}

// Demo data for a default Daily Writing goal
const DAILY_WRITING_GOAL = {
  id: 'g1',
  category: 'Craft',
  name: 'Daily writing',
  streak: 12,
  entries: 87,
  startedLabel: 'Jan 4',
  monthLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  coachLast: 'wrote 420 words on the essay before breakfast',
  coachToday: 'write one paragraph before 8am. That\'s it.',
  evidenceEntries: (() => {
    // Generate 87 stub entries; the timeline shows last 3.
    const moods = ['✍️', '🌅', '☕', '🌙', '🔥', '🌱'];
    const arr = [];
    for (let i = 0; i < 87; i++) arr.push({ id: 'e' + i, dateLabel: '', text: '', mood: moods[i % moods.length], dateShort: '' });
    // Override the most recent three with real text + dates
    arr[arr.length - 1] = {
      id: 'e87',
      dateLabel: 'Today · 7:14 AM',
      dateShort: 'today',
      text: 'Wrote 420 words on the essay before breakfast. The opening still feels off — circling the real argument. Better to keep moving than fix it now.',
      mood: '🌅',
      meta: '420 words · 38 min',
    };
    arr[arr.length - 2] = {
      id: 'e86',
      dateLabel: 'Yesterday · 7:02 AM',
      dateShort: 'yesterday',
      text: 'One paragraph. Got distracted twice. Showed up anyway.',
      mood: '☕',
      meta: '110 words · 12 min',
    };
    arr[arr.length - 3] = {
      id: 'e85',
      dateLabel: 'Thu, May 6 · 7:30 AM',
      dateShort: 'May 6',
      text: 'Drafted the section on attention. Felt the click — three paragraphs in a row without checking anything.',
      mood: '🔥',
      meta: '680 words · 52 min',
    };
    return arr;
  })(),
};

Object.assign(window, { GoalDetailScreen, DAILY_WRITING_GOAL });
