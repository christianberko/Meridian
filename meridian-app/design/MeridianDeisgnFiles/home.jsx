// Meridian — Home screen
// Dark, warm, minimal. Fraunces italic display + SF Pro body.

const C = {
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

const display = {
  fontFamily: '"Fraunces", "Times New Roman", serif',
  fontStyle: 'italic',
  fontWeight: 300,
  letterSpacing: '-0.01em',
};

const body = {
  fontFamily: '-apple-system, "SF Pro Text", "SF Pro", system-ui, sans-serif',
};

// ─────────────────────────────────────────────────────────
// Greeting header
// ─────────────────────────────────────────────────────────
function Greeting({ name, period, dateLabel }) {
  return (
    <div style={{ padding: '8px 22px 18px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...body, fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.mutedSoft, marginBottom: 8 }}>
          {dateLabel}
        </div>
        <h1 style={{ ...display, fontSize: 34, lineHeight: 1.05, color: C.text, margin: 0 }}>
          Good {period},
          <br />
          <span style={{ color: C.text }}>{name}.</span>
        </h1>
      </div>
      <div style={{
        width: 40, height: 40, borderRadius: 20,
        background: C.surface, border: `0.5px solid ${C.hairline}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: 18,
      }}>
        <ThreadMark size={22} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// AI nudge card
// ─────────────────────────────────────────────────────────
function NudgeCard({ lastTime, today }) {
  return (
    <div style={{ margin: '0 18px 26px', position: 'relative' }}>
      <div style={{
        position: 'relative',
        background: `linear-gradient(180deg, ${C.surface} 0%, #1F1E1B 100%)`,
        border: `0.5px solid ${C.hairline}`,
        borderRadius: 20,
        padding: '18px 18px 18px 18px',
        overflow: 'hidden',
      }}>
        {/* warm corner glow */}
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 160, height: 160,
          background: 'radial-gradient(circle, rgba(245,166,35,0.18) 0%, rgba(245,166,35,0) 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, position: 'relative' }}>
          <div style={{
            width: 22, height: 22, borderRadius: 11,
            background: C.amberSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="sparkle" size={13} color={C.amber} />
          </div>
          <div style={{ ...body, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.amber }}>
            Coach
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ ...body, fontSize: 12, color: C.mutedSoft }}>now</div>
        </div>

        <div style={{ ...body, fontSize: 15, lineHeight: 1.5, color: C.text, position: 'relative' }}>
          <span style={{ color: C.muted }}>Last session you </span>
          {lastTime}
          <span style={{ color: C.muted }}>. </span>
          <br />
          <span style={{ ...display, fontStyle: 'italic', fontSize: 17, color: C.text }}>Today —</span>{' '}
          <span style={{ color: C.text }}>{today}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16, position: 'relative' }}>
          <button style={{
            ...body, fontSize: 13, fontWeight: 600, color: C.text,
            background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            Accept the nudge
            <Icon name="arrow" size={14} color={C.amber} stroke={1.8} />
          </button>
          <button style={{
            ...body, fontSize: 13, fontWeight: 500, color: C.mutedSoft,
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
// Goal card
// ─────────────────────────────────────────────────────────
function GoalCard({ goal, onOpen }) {
  return (
    <div
      onClick={onOpen}
      style={{
        flex: '0 0 auto',
        width: 280,
        background: C.surface,
        border: `0.5px solid ${C.hairline}`,
        borderRadius: 22,
        padding: '18px 18px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        cursor: 'pointer',
      }}
    >
      {/* Header row: name + chevron */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...body, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.mutedSoft, marginBottom: 6 }}>
            {goal.category}
          </div>
          <h3 style={{ ...display, fontSize: 24, lineHeight: 1.1, color: C.text, margin: 0 }}>
            {goal.name}
          </h3>
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: 14,
          background: 'rgba(250,250,248,0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="chevron" size={14} color={C.muted} />
        </div>
      </div>

      {/* Thread visualization */}
      <div style={{
        margin: '2px -4px 0',
        padding: '6px 0 0',
      }}>
        <ThreadPath width={252} height={64} nodes={goal.nodes} progress={goal.progress} />
      </div>

      {/* Footer: entry count + streak */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        paddingTop: 4,
        borderTop: `0.5px solid ${C.hairline}`,
        marginTop: -2,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 10 }}>
          <div style={{ ...body, fontSize: 18, fontWeight: 500, color: C.text, lineHeight: 1, letterSpacing: '-0.01em' }}>
            {goal.entries}
          </div>
          <div style={{ ...body, fontSize: 11, color: C.mutedSoft, marginTop: 4, letterSpacing: '0.04em' }}>
            entries
          </div>
        </div>

        <div style={{ width: 0.5, height: 26, background: C.hairline, marginTop: 8 }} />

        <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <Icon name="flame" size={14} color={C.amber} />
            <div style={{ ...body, fontSize: 18, fontWeight: 500, color: C.text, lineHeight: 1, letterSpacing: '-0.01em' }}>
              {goal.streak}
            </div>
          </div>
          <div style={{ ...body, fontSize: 11, color: C.mutedSoft, marginTop: 4, letterSpacing: '0.04em' }}>
            day streak
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{
          ...body, fontSize: 11, fontWeight: 500, color: C.muted,
          paddingTop: 10,
        }}>
          {goal.lastLogged}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Horizontal scroll of goal cards
// ─────────────────────────────────────────────────────────
function ThreadsSection({ goals, onOpenGoal, onSeeAll }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        padding: '0 22px', marginBottom: 14,
      }}>
        <h2 style={{ ...display, fontSize: 22, color: C.text, margin: 0 }}>
          Your threads
        </h2>
        <button onClick={onSeeAll} style={{
          ...body, fontSize: 13, fontWeight: 500, color: C.muted,
          background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          All {goals.length}
          <Icon name="chevron" size={12} color={C.muted} stroke={1.8} />
        </button>
      </div>

      <div style={{
        display: 'flex', gap: 12, overflowX: 'auto', overflowY: 'hidden',
        padding: '4px 18px 4px',
        scrollSnapType: 'x mandatory',
        scrollbarWidth: 'none',
      }}
        className="hide-scrollbar"
      >
        {goals.map(g => (
          <div key={g.id} style={{ scrollSnapAlign: 'start' }}>
            <GoalCard goal={g} onOpen={() => onOpenGoal && onOpenGoal(g)} />
          </div>
        ))}
        <div style={{ flex: '0 0 6px' }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Today's stat strip — small contextual block under threads
// ─────────────────────────────────────────────────────────
function TodayStrip({ count, perfectDays }) {
  return (
    <div style={{
      margin: '0 22px 110px',
      padding: '14px 16px',
      background: 'rgba(250,250,248,0.02)',
      border: `0.5px solid ${C.hairline}`,
      borderRadius: 16,
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: C.surfaceRaised,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `0.5px solid ${C.hairline}`,
      }}>
        <div style={{ ...display, fontSize: 19, color: C.amber, lineHeight: 1 }}>{count}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...body, fontSize: 13.5, color: C.text, fontWeight: 500, marginBottom: 2 }}>
          {count === 0 ? 'No evidence logged yet today' : count === 1 ? '1 entry today' : `${count} entries today`}
        </div>
        <div style={{ ...body, fontSize: 12, color: C.muted }}>
          {perfectDays} perfect days this month · keep the thread
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Bottom: floating CTA + tab bar
// ─────────────────────────────────────────────────────────
function BottomBar({ active, onTab, onLog }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'progress', label: 'Progress', icon: 'progress' },
    { id: 'goals', label: 'Goals', icon: 'goals' },
    { id: 'profile', label: 'Profile', icon: 'profile' },
  ];

  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      paddingBottom: 34, // home indicator space
      pointerEvents: 'none',
    }}>
      {/* gradient fade so content scrolls cleanly behind */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 34, height: 180,
        background: `linear-gradient(180deg, rgba(26,25,23,0) 0%, rgba(26,25,23,0.85) 45%, ${C.bg} 100%)`,
        pointerEvents: 'none',
      }} />

      {/* Floating CTA */}
      <div style={{ position: 'relative', padding: '0 22px 12px', pointerEvents: 'auto' }}>
        <button
          onClick={onLog}
          style={{
            width: '100%', height: 54, borderRadius: 27,
            background: `linear-gradient(180deg, #F8B547 0%, ${C.amber} 100%)`,
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 10px 32px rgba(245,166,35,0.32), 0 1px 0 rgba(255,255,255,0.25) inset, 0 -1px 0 rgba(0,0,0,0.15) inset',
            ...body, fontSize: 16, fontWeight: 600, color: '#1A1917',
            letterSpacing: '-0.01em',
          }}
        >
          <Icon name="plus" size={18} color="#1A1917" stroke={2.4} />
          Log evidence
        </button>
      </div>

      {/* Tab bar */}
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '6px 14px 4px', pointerEvents: 'auto',
      }}>
        {tabs.map(t => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onTab(t.id)}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                padding: '8px 12px',
                color: isActive ? C.text : C.mutedSoft,
              }}
            >
              <Icon name={t.icon} size={22} color={isActive ? C.amber : C.mutedSoft} active={isActive && t.id === 'home'} stroke={1.6} />
              <div style={{
                ...body, fontSize: 10, fontWeight: 500,
                color: isActive ? C.text : C.mutedSoft,
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

// ─────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────
function HomeScreen({ tweaks, onOpenGoal, onLog, onTab, onSeeAll }) {
  const [tab, setTab] = React.useState('home');

  const handleTab = (t) => {
    setTab(t);
    if (onTab) onTab(t);
  };

  const period = tweaks.period || 'morning';

  // Demo data
  const goals = [
    {
      id: 'g1',
      category: 'Craft',
      name: 'Daily writing',
      progress: 0.72,
      nodes: 9,
      entries: 87,
      streak: 12,
      lastLogged: 'yesterday',
    },
    {
      id: 'g2',
      category: 'Body',
      name: 'Strength',
      progress: 0.45,
      nodes: 8,
      entries: 34,
      streak: 6,
      lastLogged: '2d ago',
    },
    {
      id: 'g3',
      category: 'Mind',
      name: 'Reading',
      progress: 0.88,
      nodes: 10,
      entries: 142,
      streak: 21,
      lastLogged: 'today',
    },
    {
      id: 'g4',
      category: 'Stillness',
      name: 'Meditation',
      progress: 0.32,
      nodes: 8,
      entries: 23,
      streak: 4,
      lastLogged: '3d ago',
    },
  ];

  const nudge = {
    morning: {
      last: <span style={{ color: C.text }}>wrote 420 words on the essay before breakfast</span>,
      today: 'protect the same window — 7:00 to 7:40. One paragraph counts.',
    },
    afternoon: {
      last: <span style={{ color: C.text }}>ran 3.2 km at an uncomfortable pace</span>,
      today: 'go slower. Same distance, conversational breath, nothing to prove.',
    },
    evening: {
      last: <span style={{ color: C.text }}>read 18 pages before falling asleep</span>,
      today: 'phone in the kitchen by 9:30. Let the book find you again.',
    },
  }[period];

  const dateLabel = {
    morning: 'Tuesday · 8 May',
    afternoon: 'Tuesday · 8 May',
    evening: 'Tuesday · 8 May',
  }[period];

  return (
    <div style={{
      width: '100%', height: '100%',
      boxSizing: 'border-box',
      background: C.bg,
      color: C.text,
      position: 'relative',
      overflow: 'hidden',
      paddingTop: 54, // status bar
    }}>
      {/* very subtle warm vignette in upper right */}
      <div style={{
        position: 'absolute', top: -120, right: -120, width: 380, height: 380,
        background: 'radial-gradient(circle, rgba(245,166,35,0.06) 0%, rgba(245,166,35,0) 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', position: 'relative' }} className="hide-scrollbar">
        <Greeting name={tweaks.name || 'Alex'} period={period} dateLabel={dateLabel} />
        <NudgeCard lastTime={nudge.last} today={nudge.today} />
        <ThreadsSection goals={goals} onOpenGoal={onOpenGoal} onSeeAll={onSeeAll} />
        <TodayStrip count={1} perfectDays={18} />
      </div>

      <BottomBar active={tab} onTab={handleTab} onLog={onLog || (() => {})} />
    </div>
  );
}

Object.assign(window, { HomeScreen });
