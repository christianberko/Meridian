// Meridian — All Threads screen
// Reached from "All 4 ›" on Home or the Goals tab.
// Hero element: the Thread Wall — every thread standing vertically side by side,
// height + density + warmth telling the whole story at a glance.

const AT = {
  bg: '#1A1917',
  surface: '#242320',
  surfaceRaised: '#2A2925',
  hairline: 'rgba(250,250,248,0.07)',
  hairlineStrong: 'rgba(250,250,248,0.12)',
  text: '#FAFAF8',
  muted: '#8A8580',
  mutedSoft: '#6C6862',
  amber: '#F5A623',
  amberBright: '#FFC34A',
  amberSoft: 'rgba(245,166,35,0.12)',
  silver: '#C9C5BD',
  silverDim: '#6E6A63',
};

const atDisplay = {
  fontFamily: '"Fraunces", "Times New Roman", serif',
  fontStyle: 'italic',
  fontWeight: 300,
  letterSpacing: '-0.012em',
};
const atBody = {
  fontFamily: '-apple-system, "SF Pro Text", "SF Pro", system-ui, sans-serif',
};

// ─────────────────────────────────────────────────────────
// Vertical thread — flows bottom (oldest) to top (most recent).
// `entries` controls node count (density). `vitality` 0–1 sets how
// warm/alive the thread reads. `cold` makes the top barely glow
// (a goal gone quiet). `complete` renders it fully gold.
// ─────────────────────────────────────────────────────────
function ThreadColumn({
  width = 56,
  height = 300,
  entries = 18,
  reach = 1,        // 0–1 — how tall this thread climbs in the wall
  vitality = 1,     // 0–1 — warmth of the most recent node
  cold = false,     // goal gone quiet — top stays cool
  complete = false, // finished goal — fully gold
}) {
  const id = React.useId();
  const cx = width / 2;
  const amp = width * 0.26;
  const freq = 2.4;

  const topPad = 16;
  const bottomPad = 10;
  const usable = height - topPad - bottomPad;
  const threadH = usable * reach;
  const yBottom = height - bottomPad;
  const yTop = yBottom - threadH;

  // Sample the meander densely for a smooth path
  const steps = 80;
  const curve = [];
  for (let i = 0; i <= steps; i++) {
    const p = i / steps;                 // 0 bottom → 1 top
    const y = yBottom - p * threadH;
    const x = cx + Math.sin(p * Math.PI * freq) * amp * (0.4 + 0.6 * p);
    curve.push([x, y, p]);
  }
  const d = curve.map((pt, i) => (i === 0 ? `M ${pt[0]} ${pt[1]}` : `L ${pt[0]} ${pt[1]}`)).join(' ');

  // Node positions — one per entry, evenly along the thread
  const nodes = [];
  const n = Math.max(2, entries);
  for (let i = 0; i < n; i++) {
    const p = i / (n - 1);
    const y = yBottom - p * threadH;
    const x = cx + Math.sin(p * Math.PI * freq) * amp * (0.4 + 0.6 * p);
    nodes.push({ x, y, p });
  }

  // Top colour: gold if alive, cool silver if the goal has gone quiet
  const topGold = complete || !cold;
  const gradTopColor = complete ? AT.amberBright : (cold ? AT.silverDim : AT.amber);
  const gradTopOpacity = cold ? 0.5 : 1;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        {/* Vertical: bottom silver → top warm (or cool, if quiet) */}
        <linearGradient id={`vt-${id}`} x1="0" y1={yBottom} x2="0" y2={yTop} gradientUnits="userSpaceOnUse">
          <stop offset="0"   stopColor={complete ? '#D8B26E' : AT.silver} stopOpacity={complete ? 1 : 0.5} />
          <stop offset="0.5" stopColor={complete ? AT.amber : '#C9B68A'} stopOpacity={complete ? 1 : 0.75} />
          <stop offset="1"   stopColor={gradTopColor} stopOpacity={gradTopOpacity} />
        </linearGradient>
        <radialGradient id={`vt-glow-${id}`}>
          <stop offset="0" stopColor={complete ? AT.amberBright : AT.amber} stopOpacity={cold ? 0.28 : 0.6} />
          <stop offset="1" stopColor={AT.amber} stopOpacity="0" />
        </radialGradient>
        <filter id={`vt-blur-${id}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>

      {/* soft underlay glow */}
      <path d={d} stroke={`url(#vt-${id})`} strokeWidth="5" strokeLinecap="round" opacity="0.12" filter={`url(#vt-blur-${id})`} />
      {/* main thread */}
      <path d={d} stroke={`url(#vt-${id})`} strokeWidth="1.6" strokeLinecap="round" />

      {/* Nodes — bottom silver → top warm */}
      {nodes.map((nd, i) => {
        const isTop = i === nodes.length - 1;
        const p = nd.p;

        if (isTop) {
          if (complete) {
            return (
              <g key={i}>
                <circle cx={nd.x} cy={nd.y} r="11" fill={`url(#vt-glow-${id})`} />
                <circle cx={nd.x} cy={nd.y} r="3.6" fill={AT.amberBright} />
                <circle cx={nd.x} cy={nd.y} r="1.5" fill="#FFF6E0" />
              </g>
            );
          }
          if (cold) {
            // Gone quiet — a faint, cool top node. Still present, barely glowing.
            return (
              <g key={i}>
                <circle cx={nd.x} cy={nd.y} r="9" fill={`url(#vt-glow-${id})`} opacity="0.5" />
                <circle cx={nd.x} cy={nd.y} r="3" fill={AT.bg} />
                <circle cx={nd.x} cy={nd.y} r="3" fill="none" stroke={AT.silverDim} strokeWidth="1" />
              </g>
            );
          }
          // Alive — warm glowing top node with a breathing aura
          return (
            <g key={i}>
              <circle cx={nd.x} cy={nd.y} r={10 + 4 * vitality} fill={`url(#vt-glow-${id})`}>
                <animate attributeName="r" values={`${8 + 3 * vitality};${13 + 4 * vitality};${8 + 3 * vitality}`} dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.55;0.9;0.55" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx={nd.x} cy={nd.y} r="3.6" fill={AT.amber} />
              <circle cx={nd.x} cy={nd.y} r="3.6" fill="none" stroke="#FAFAF8" strokeOpacity="0.4" strokeWidth="0.6" />
              <circle cx={nd.x} cy={nd.y} r="1.5" fill="#FFE7B8" />
            </g>
          );
        }

        // Body nodes — interpolate silver → warm toward the top
        let col;
        if (complete) {
          const r = Math.round(216 + (245 - 216) * p);
          const g = Math.round(178 + (166 - 178) * p);
          const b = Math.round(110 + (35 - 110) * p);
          col = `rgb(${r},${g},${b})`;
        } else if (cold) {
          // stays mostly silver/cool
          const r = Math.round(201 + (180 - 201) * p);
          const g = Math.round(197 + (172 - 197) * p);
          const b = Math.round(189 + (150 - 189) * p);
          col = `rgb(${r},${g},${b})`;
        } else {
          const warm = Math.pow(p, 1.3);
          const r = Math.round(201 + (245 - 201) * warm);
          const g = Math.round(197 + (166 - 197) * warm);
          const b = Math.round(189 + (35 - 189) * warm);
          col = `rgb(${r},${g},${b})`;
        }
        const radius = 2.0 + 0.8 * p;
        return (
          <g key={i}>
            <circle cx={nd.x} cy={nd.y} r={radius} fill={col} opacity={cold ? 0.7 : 0.95} />
          </g>
        );
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
// The Thread Wall — signature element
// ─────────────────────────────────────────────────────────
function AllThreadsWall({ threads }) {
  return (
    <div style={{
      margin: '0 18px 30px',
      background: `linear-gradient(180deg, ${AT.surface} 0%, #1E1D1A 100%)`,
      border: `0.5px solid ${AT.hairline}`,
      borderRadius: 26,
      padding: '22px 6px 18px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* warm wash from top */}
      <div style={{
        position: 'absolute', top: -70, left: '50%', transform: 'translateX(-50%)',
        width: 320, height: 200,
        background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(245,166,35,0.12) 0%, rgba(245,166,35,0) 70%)',
        pointerEvents: 'none',
      }} />

      {/* baseline — the shared ground all threads rise from */}
      <div style={{
        position: 'absolute', left: 22, right: 22, bottom: 56, height: 0.5,
        background: `linear-gradient(90deg, transparent, ${AT.hairlineStrong} 20%, ${AT.hairlineStrong} 80%, transparent)`,
        pointerEvents: 'none',
      }} />

      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around',
        position: 'relative', height: 300,
      }}>
        {threads.map((t) => (
          <div key={t.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
            <ThreadColumn
              width={58}
              height={300}
              entries={t.entries}
              reach={t.reach}
              vitality={t.vitality}
              cold={t.cold}
            />
          </div>
        ))}
      </div>

      {/* Labels under each thread */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around',
        position: 'relative', marginTop: 12, paddingTop: 12,
        borderTop: `0.5px solid ${AT.hairline}`,
      }}>
        {threads.map((t) => (
          <div key={t.id} style={{ width: 58 + 16, textAlign: 'center' }}>
            <div style={{
              ...atDisplay, fontSize: 13, lineHeight: 1.15, color: t.cold ? AT.muted : AT.text,
              marginBottom: 5, textWrap: 'balance',
            }}>
              {t.name}
            </div>
            <div style={{
              ...atBody, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.04em',
              color: t.cold ? AT.mutedSoft : AT.amber,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
            }}>
              {t.cold ? (
                <span style={{ color: AT.mutedSoft, fontWeight: 500, letterSpacing: '0.02em' }}>quiet · {t.lastLogged}</span>
              ) : (
                <>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill={AT.amber}>
                    <path d="M12 3c.5 3 3.5 4 3.5 8a3.5 3.5 0 0 1-7 0c0-1.2.5-2 1-2.5C9 10 9 8 12 3Z" />
                  </svg>
                  {t.streak}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Goal row card — full width, gold left strip, mini thread
// ─────────────────────────────────────────────────────────
function GoalRowCard({ goal, onOpen }) {
  const done = goal.completed;
  return (
    <div
      onClick={onOpen}
      style={{
        position: 'relative',
        background: AT.surface,
        border: `0.5px solid ${AT.hairline}`,
        borderRadius: 20,
        padding: '16px 18px 14px 20px',
        cursor: 'pointer',
        overflow: 'hidden',
        opacity: done ? 0.82 : 1,
      }}
    >
      {/* gold left strip */}
      <div style={{
        position: 'absolute', left: 0, top: 14, bottom: 14, width: 3, borderRadius: 2,
        background: done
          ? `linear-gradient(180deg, ${AT.amberBright}, ${AT.amber})`
          : `linear-gradient(180deg, ${AT.amber}, rgba(245,166,35,0.25))`,
        opacity: goal.cold ? 0.3 : 1,
      }} />

      {/* Top row: chip + name (left), entries/last (right) */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
            {done ? (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '3px 8px 3px 6px', borderRadius: 6,
                background: AT.amberSoft, border: `0.5px solid rgba(245,166,35,0.3)`,
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={AT.amber} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12l5 5L20 6" />
                </svg>
                <span style={{ ...atBody, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.16em', color: AT.amber }}>COMPLETE</span>
              </div>
            ) : (
              <div style={{
                ...atBody, fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
                color: AT.mutedSoft,
                padding: '3px 8px', borderRadius: 6,
                background: 'rgba(250,250,248,0.04)',
              }}>
                {goal.category}
              </div>
            )}
          </div>
          <h3 style={{ ...atDisplay, fontSize: 22, lineHeight: 1.05, color: AT.text, margin: 0 }}>
            {goal.name}
          </h3>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0, paddingTop: 2 }}>
          <div style={{ ...atBody, fontSize: 16, fontWeight: 500, color: AT.text, lineHeight: 1, letterSpacing: '-0.01em' }}>
            {goal.entries}
          </div>
          <div style={{ ...atBody, fontSize: 10.5, color: AT.mutedSoft, marginTop: 4, letterSpacing: '0.04em' }}>
            entries
          </div>
        </div>
      </div>

      {/* Horizontal mini thread */}
      <div style={{ margin: '12px -4px 0' }}>
        <ThreadPath
          width={300}
          height={52}
          nodes={goal.miniNodes}
          progress={done ? 1 : goal.progress}
          accent={AT.amber}
        />
      </div>

      {/* Footer: streak / last logged */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 8, paddingTop: 10, borderTop: `0.5px solid ${AT.hairline}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {done ? (
            <span style={{ ...atBody, fontSize: 12, color: AT.muted }}>
              Finished {goal.finishedLabel}
            </span>
          ) : goal.cold ? (
            <span style={{ ...atBody, fontSize: 12, color: AT.mutedSoft }}>
              Gone quiet · needs attention
            </span>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill={AT.amber}>
                <path d="M12 3c.5 3 3.5 4 3.5 8a3.5 3.5 0 0 1-7 0c0-1.2.5-2 1-2.5C9 10 9 8 12 3Z" />
              </svg>
              <span style={{ ...atBody, fontSize: 12.5, fontWeight: 500, color: AT.text }}>{goal.streak} day streak</span>
            </>
          )}
        </div>
        <div style={{ ...atBody, fontSize: 12, color: AT.mutedSoft }}>
          {done ? `${goal.durationLabel}` : `last ${goal.lastLogged}`}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Section label
// ─────────────────────────────────────────────────────────
function ThreadsSectionLabel({ children }) {
  return (
    <div style={{
      ...atBody, fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
      color: AT.mutedSoft, padding: '0 22px', marginBottom: 14,
    }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Header — back, label, title, segmented control
// ─────────────────────────────────────────────────────────
function AllThreadsHeader({ onBack, filter, onFilter }) {
  return (
    <div style={{ padding: '4px 18px 8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 40, marginBottom: 16 }}>
        <button
          onClick={onBack}
          style={{
            width: 38, height: 38, borderRadius: 19,
            background: AT.surface, border: `0.5px solid ${AT.hairline}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={AT.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
      </div>

      <div style={{ padding: '0 4px' }}>
        <div style={{
          ...atBody, fontSize: 11, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: AT.mutedSoft, marginBottom: 8,
        }}>
          May 2026
        </div>
        <h1 style={{ ...atDisplay, fontSize: 40, lineHeight: 1.0, color: AT.text, margin: '0 0 20px' }}>
          All threads.
        </h1>
      </div>

      {/* Segmented control */}
      <div style={{
        display: 'flex', gap: 4, padding: 4,
        background: 'rgba(0,0,0,0.25)', borderRadius: 14,
        border: `0.5px solid ${AT.hairline}`,
      }}>
        {[
          { id: 'active', label: 'Active' },
          { id: 'completed', label: 'Completed' },
        ].map(seg => {
          const sel = filter === seg.id;
          return (
            <button
              key={seg.id}
              onClick={() => onFilter(seg.id)}
              style={{
                flex: 1, position: 'relative',
                background: sel ? AT.surfaceRaised : 'transparent',
                border: sel ? `0.5px solid ${AT.hairline}` : '0.5px solid transparent',
                borderRadius: 11, cursor: 'pointer',
                padding: '9px 0 11px',
                ...atBody, fontSize: 13.5, fontWeight: 600,
                color: sel ? AT.text : AT.mutedSoft,
                letterSpacing: '0.01em',
                transition: 'color 160ms ease, background 160ms ease',
              }}
            >
              {seg.label}
              {/* gold underline indicator */}
              <div style={{
                position: 'absolute', left: '50%', bottom: 5, transform: 'translateX(-50%)',
                width: sel ? 22 : 0, height: 2, borderRadius: 1,
                background: AT.amber,
                transition: 'width 200ms cubic-bezier(0.22,0.61,0.36,1)',
              }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Floating action button
// ─────────────────────────────────────────────────────────
function ThreadFAB({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute', right: 20, bottom: 96, zIndex: 20,
        width: 58, height: 58, borderRadius: 29,
        background: `linear-gradient(180deg, #F8B547 0%, ${AT.amber} 100%)`,
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 12px 32px rgba(245,166,35,0.45), 0 2px 8px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.3) inset',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1917" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  );
}

// ─────────────────────────────────────────────────────────
// Tab bar (Goals active)
// ─────────────────────────────────────────────────────────
function ThreadsTabBar({ onTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'progress', label: 'Progress', icon: 'progress' },
    { id: 'goals', label: 'Goals', icon: 'goals' },
    { id: 'profile', label: 'Profile', icon: 'profile' },
  ];
  const active = 'goals';
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: 34, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 34, height: 120,
        background: `linear-gradient(180deg, rgba(26,25,23,0) 0%, rgba(26,25,23,0.9) 55%, ${AT.bg} 100%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '6px 14px 4px', pointerEvents: 'auto',
        borderTop: `0.5px solid ${AT.hairline}`,
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
              }}
            >
              <Icon name={t.icon} size={22} color={isActive ? AT.amber : AT.mutedSoft} stroke={1.6} />
              <div style={{
                ...atBody, fontSize: 10, fontWeight: 500,
                color: isActive ? AT.text : AT.mutedSoft, letterSpacing: '0.02em',
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

// ─────────────────────────────────────────────────────────
// Demo data
// ─────────────────────────────────────────────────────────
const ACTIVE_THREADS = [
  { id: 't1', name: 'Daily writing', entries: 87, reach: 1.0,  vitality: 0.9, cold: false, streak: 12, lastLogged: 'yesterday', category: 'Craft',     progress: 0.86, miniNodes: 11 },
  { id: 't3', name: 'Reading',       entries: 142, reach: 0.92, vitality: 1.0, cold: false, streak: 21, lastLogged: 'today',     category: 'Mind',      progress: 0.94, miniNodes: 12 },
  { id: 't2', name: 'Strength',      entries: 34, reach: 0.6,  vitality: 0.7, cold: false, streak: 6,  lastLogged: '2d ago',    category: 'Body',      progress: 0.55, miniNodes: 8 },
  { id: 't4', name: 'Learn Swift',   entries: 12, reach: 0.42, vitality: 0.2, cold: true,  streak: 0,  lastLogged: '5d ago',    category: 'Mind',      progress: 0.3,  miniNodes: 5 },
];

const COMPLETED_THREADS = [
  { id: 'c1', name: 'Couch to 5K',   entries: 64,  reach: 0.85, vitality: 1, cold: false, completed: true, category: 'Body', progress: 1, miniNodes: 10, finishedLabel: 'Mar 28', durationLabel: '9 weeks', },
  { id: 'c2', name: 'Read 12 books', entries: 48,  reach: 1.0,  vitality: 1, cold: false, completed: true, category: 'Mind', progress: 1, miniNodes: 12, finishedLabel: 'Feb 2',  durationLabel: 'all year', },
];

// ─────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────
function AllThreadsScreen({ onBack, onOpenGoal, onNewGoal, onTab }) {
  const [filter, setFilter] = React.useState('active');
  const showActive = filter === 'active';

  const wallThreads = showActive ? ACTIVE_THREADS : COMPLETED_THREADS;
  const cards = showActive ? ACTIVE_THREADS : COMPLETED_THREADS;

  return (
    <div style={{
      width: '100%', height: '100%',
      boxSizing: 'border-box',
      background: AT.bg,
      color: AT.text,
      position: 'relative',
      overflow: 'hidden',
      paddingTop: 54,
    }}>
      {/* ambient warmth */}
      <div style={{
        position: 'absolute', top: -120, right: -120, width: 360, height: 360,
        background: 'radial-gradient(circle, rgba(245,166,35,0.06) 0%, rgba(245,166,35,0) 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', position: 'relative', paddingBottom: 130 }} className="hide-scrollbar">
        <AllThreadsHeader onBack={onBack} filter={filter} onFilter={setFilter} />

        <div style={{ height: 22 }} />

        {/* The Thread Wall */}
        <AllThreadsWall threads={wallThreads} />

        {/* Card list */}
        <ThreadsSectionLabel>
          {showActive ? `Active · ${ACTIVE_THREADS.length} threads` : `Completed · ${COMPLETED_THREADS.length} threads`}
        </ThreadsSectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 18px' }}>
          {cards.map(g => (
            <GoalRowCard key={g.id} goal={g} onOpen={() => onOpenGoal && onOpenGoal(g)} />
          ))}
        </div>
      </div>

      <ThreadFAB onClick={onNewGoal || (() => {})} />
      <ThreadsTabBar onTab={onTab} />
    </div>
  );
}

Object.assign(window, { AllThreadsScreen });
