// Meridian — Empty state screens
// Three zero-data states presented side-by-side in a design canvas.
// Each looks like its parent screen but with a quiet invitation instead of content.

const ES = {
  bg: '#1A1917',
  surface: '#242320',
  surfaceRaised: '#2A2925',
  hairline: 'rgba(250,250,248,0.07)',
  hairlineStrong: 'rgba(250,250,248,0.12)',
  text: '#FAFAF8',
  muted: '#9A948D',
  mutedSoft: '#6C6862',
  warmGrey: '#A8A19A',
  amber: '#F5A623',
  amberSoft: 'rgba(245,166,35,0.10)',
  amberSofter: 'rgba(245,166,35,0.05)',
  amberBorder: 'rgba(245,166,35,0.40)',
  silver: '#C9C5BD',
  silverDim: 'rgba(201,197,189,0.45)',
};

const esDisplay = {
  fontFamily: '"Fraunces", "Times New Roman", serif',
  fontStyle: 'italic',
  fontWeight: 300,
  letterSpacing: '-0.01em',
};
const esBody = {
  fontFamily: '-apple-system, "SF Pro Text", "SF Pro", system-ui, sans-serif',
};
const esLabel = {
  ...esBody,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.20em',
  textTransform: 'uppercase',
  color: ES.warmGrey,
};

// ─────────────────────────────────────────────────────────
// Shared: gold pill button
// ─────────────────────────────────────────────────────────
function EsGoldButton({ children, full = false, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...esBody, fontSize: 14.5, fontWeight: 600,
        color: '#1A1917', letterSpacing: '-0.005em',
        background: 'linear-gradient(180deg, #F8B547 0%, #F5A623 100%)',
        border: 'none', cursor: 'pointer',
        height: 46, padding: full ? 0 : '0 22px',
        width: full ? '100%' : 'auto',
        borderRadius: 999,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        boxShadow: '0 10px 24px rgba(245,166,35,0.30), 0 1px 0 rgba(255,255,255,0.28) inset, 0 -1px 0 rgba(0,0,0,0.16) inset',
      }}
    >
      {children}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1A1917" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M14 6l6 6-6 6" />
      </svg>
    </button>
  );
}

// ─────────────────────────────────────────────────────────
// Shared: tab bar (no floating CTA in this view)
// ─────────────────────────────────────────────────────────
function EsTabBar({ active }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'progress', label: 'Progress', icon: 'progress' },
    { id: 'goals', label: 'Goals', icon: 'goals' },
    { id: 'profile', label: 'Profile', icon: 'profile' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      paddingBottom: 34, zIndex: 5, pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 34, height: 90,
        background: `linear-gradient(180deg, rgba(26,25,23,0) 0%, rgba(26,25,23,0.85) 50%, ${ES.bg} 100%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '8px 14px 6px', pointerEvents: 'auto',
        borderTop: `0.5px solid ${ES.hairline}`,
      }}>
        {tabs.map(t => {
          const isActive = active === t.id;
          return (
            <div key={t.id} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '8px 12px',
            }}>
              <Icon
                name={t.icon}
                size={22}
                color={isActive ? ES.amber : ES.mutedSoft}
                active={isActive && t.id === 'home'}
                stroke={1.6}
              />
              <div style={{
                ...esBody, fontSize: 10, fontWeight: 500,
                color: isActive ? ES.text : ES.mutedSoft,
                letterSpacing: '0.02em',
              }}>
                {t.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// State 1: Home — no goals
// ─────────────────────────────────────────────────────────
function HomeEmpty() {
  return (
    <div style={{
      width: '100%', height: '100%',
      boxSizing: 'border-box',
      background: ES.bg, color: ES.text,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* warm vignette */}
      <div style={{
        position: 'absolute', top: -120, right: -120, width: 360, height: 360,
        background: 'radial-gradient(circle, rgba(245,166,35,0.06) 0%, rgba(245,166,35,0) 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute', top: 54, left: 0, right: 0, bottom: 0,
        overflow: 'hidden',
        paddingBottom: 130,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Greeting */}
        <div style={{ padding: '18px 22px 0' }}>
          <div style={{
            ...esBody, fontSize: 11, fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: ES.warmGrey, marginBottom: 8,
          }}>
            Tuesday · 8 May
          </div>
          <h1 style={{ ...esDisplay, fontSize: 34, color: ES.text, margin: '0 0 4px', lineHeight: 1.05 }}>
            Good morning, Alex.
          </h1>
          <div style={{ ...esBody, fontSize: 14, color: ES.muted, lineHeight: 1.45 }}>
            No threads yet. Let's start the first one.
          </div>
        </div>

        {/* Section label */}
        <div style={{ padding: '30px 26px 12px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={esLabel}>Your threads</div>
          <div style={{ ...esBody, fontSize: 12, color: ES.mutedSoft }}>0 active</div>
        </div>

        {/* Empty card */}
        <div style={{ padding: '0 22px', flex: 1, display: 'flex' }}>
          <div style={{
            position: 'relative',
            flex: 1,
            background: `linear-gradient(180deg, ${ES.surface} 0%, #1E1D1A 100%)`,
            border: `0.5px solid ${ES.hairline}`,
            borderRadius: 24,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '34px 28px',
            overflow: 'hidden',
            textAlign: 'center',
          }}>
            {/* ambient bloom behind seed */}
            <div style={{
              position: 'absolute', top: '38%', left: '50%',
              width: 200, height: 200, transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(201,197,189,0.10) 0%, rgba(201,197,189,0) 65%)',
              pointerEvents: 'none',
            }} />

            {/* Single silver seed node */}
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ marginBottom: 22, position: 'relative' }}>
              <defs>
                <radialGradient id="es-seed-glow">
                  <stop offset="0" stopColor="#C9C5BD" stopOpacity="0.35" />
                  <stop offset="0.5" stopColor="#C9C5BD" stopOpacity="0.10" />
                  <stop offset="1" stopColor="#C9C5BD" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="es-seed-core">
                  <stop offset="0" stopColor="#E8E4DC" />
                  <stop offset="1" stopColor="#9D998F" />
                </radialGradient>
              </defs>
              <circle cx="40" cy="40" r="38" fill="url(#es-seed-glow)">
                <animate attributeName="opacity" values="0.55;0.9;0.55" dur="3.4s" repeatCount="indefinite" />
              </circle>
              <circle cx="40" cy="40" r="18" fill="url(#es-seed-glow)" opacity="0.9" />
              <circle cx="40" cy="40" r="5" fill="url(#es-seed-core)" />
              <circle cx="40" cy="40" r="5" fill="none" stroke="#FAFAF8" strokeOpacity="0.25" strokeWidth="0.6" />
            </svg>

            <div style={{
              ...esDisplay, fontSize: 24, color: ES.text,
              margin: '0 0 8px', lineHeight: 1.15,
            }}>
              Your first thread is waiting.
            </div>
            <div style={{
              ...esBody, fontSize: 13.5, lineHeight: 1.5,
              color: ES.warmGrey,
              maxWidth: 240, marginBottom: 22,
              textWrap: 'pretty',
            }}>
              Every great goal starts with a single entry. Start one now.
            </div>

            <EsGoldButton>Create your first thread</EsGoldButton>
          </div>
        </div>
      </div>

      <EsTabBar active="home" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// State 2: Goal Detail — no evidence yet
// ─────────────────────────────────────────────────────────
function DetailEmpty() {
  return (
    <div style={{
      width: '100%', height: '100%',
      boxSizing: 'border-box',
      background: ES.bg, color: ES.text,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -120, right: -120, width: 360, height: 360,
        background: 'radial-gradient(circle, rgba(245,166,35,0.05) 0%, rgba(245,166,35,0) 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute', top: 54, left: 0, right: 0, bottom: 0,
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '4px 18px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 40, marginBottom: 14 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 19,
              background: ES.surface, border: `0.5px solid ${ES.hairline}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ES.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </div>
            <div style={{
              width: 38, height: 38, borderRadius: 19,
              background: ES.surface, border: `0.5px solid ${ES.hairline}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={ES.text}>
                <circle cx="5" cy="12" r="1.6" />
                <circle cx="12" cy="12" r="1.6" />
                <circle cx="19" cy="12" r="1.6" />
              </svg>
            </div>
          </div>
          <div style={{ padding: '0 4px' }}>
            <div style={{
              ...esBody, fontSize: 11, fontWeight: 600,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: ES.amber, marginBottom: 8,
            }}>
              Craft
            </div>
            <h1 style={{ ...esDisplay, fontSize: 38, lineHeight: 1.02, color: ES.text, margin: '0 0 12px' }}>
              Daily writing
            </h1>
            <div style={{ ...esBody, fontSize: 13.5, color: ES.muted }}>
              <span style={{ color: ES.text }}>0 entries</span>
              <span style={{ color: ES.mutedSoft }}> · </span>
              <span>started today</span>
            </div>
          </div>
        </div>

        {/* Empty thread card */}
        <div style={{
          margin: '0 18px 22px',
          background: `linear-gradient(180deg, ${ES.surface} 0%, #1E1D1A 100%)`,
          border: `0.5px solid ${ES.hairline}`,
          borderRadius: 24,
          padding: '20px 14px 18px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 8px 14px' }}>
            <div style={{
              ...esBody, fontSize: 11, fontWeight: 600, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: ES.mutedSoft,
            }}>
              The thread
            </div>
            <div style={{ ...esBody, fontSize: 11, color: ES.muted, fontStyle: 'italic' }}>
              waiting to begin
            </div>
          </div>

          {/* Single start node + dotted trail */}
          <svg width="322" height="120" viewBox="0 0 322 120" fill="none" style={{ display: 'block' }}>
            <defs>
              <linearGradient id="es-trail" x1="0" y1="60" x2="322" y2="60" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#C9C5BD" stopOpacity="0.55" />
                <stop offset="0.6" stopColor="#C9C5BD" stopOpacity="0.18" />
                <stop offset="1" stopColor="#C9C5BD" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="es-start-glow">
                <stop offset="0" stopColor="#C9C5BD" stopOpacity="0.35" />
                <stop offset="1" stopColor="#C9C5BD" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="es-start-core">
                <stop offset="0" stopColor="#E8E4DC" />
                <stop offset="1" stopColor="#9D998F" />
              </radialGradient>
            </defs>

            {/* Dotted line drifts slightly downward to imply a path */}
            <path
              d="M 36 60 C 100 60, 140 70, 200 64 C 252 60, 290 56, 310 56"
              stroke="url(#es-trail)"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeDasharray="2 6"
            />

            {/* Start node with soft halo */}
            <circle cx="36" cy="60" r="32" fill="url(#es-start-glow)">
              <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="36" cy="60" r="14" fill="url(#es-start-glow)" opacity="0.7" />
            <circle cx="36" cy="60" r="5" fill="url(#es-start-core)" />
            <circle cx="36" cy="60" r="5" fill="none" stroke="#FAFAF8" strokeOpacity="0.30" strokeWidth="0.6" />

            {/* tiny tick label under the start node */}
            <text x="36" y="92" textAnchor="middle" fill={ES.mutedSoft} fontSize="9.5" fontFamily="SF Pro Text, -apple-system, sans-serif" letterSpacing="2">START</text>
          </svg>
        </div>

        {/* Invitation copy */}
        <div style={{ padding: '0 28px', textAlign: 'center' }}>
          <h2 style={{
            ...esDisplay, fontSize: 26, color: ES.text,
            margin: '4px 0 10px', lineHeight: 1.15,
          }}>
            Your thread begins here.
          </h2>
          <div style={{
            ...esBody, fontSize: 13.5, lineHeight: 1.5,
            color: ES.warmGrey, maxWidth: 280, margin: '0 auto 22px',
            textWrap: 'pretty',
          }}>
            Log your first piece of evidence to start building.
          </div>
          <EsGoldButton>Log first evidence</EsGoldButton>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// State 3: Progress — Thread Wall with 4 ghost columns
// ─────────────────────────────────────────────────────────
function ProgressEmpty() {
  const labels = ['Thread 1', 'Thread 2', 'Thread 3', 'Thread 4'];
  return (
    <div style={{
      width: '100%', height: '100%',
      boxSizing: 'border-box',
      background: ES.bg, color: ES.text,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -120, right: -120, width: 360, height: 360,
        background: 'radial-gradient(circle, rgba(245,166,35,0.04) 0%, rgba(245,166,35,0) 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute', top: 54, left: 0, right: 0, bottom: 0,
        overflow: 'hidden',
        paddingBottom: 100,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '14px 22px 20px' }}>
          <div style={{
            ...esBody, fontSize: 11, fontWeight: 600,
            letterSpacing: '0.20em', textTransform: 'uppercase',
            color: ES.warmGrey, marginBottom: 6,
          }}>
            Progress
          </div>
          <h1 style={{ ...esDisplay, fontSize: 30, color: ES.text, margin: 0, lineHeight: 1.05 }}>
            Your wall of threads.
          </h1>
        </div>

        {/* Section label */}
        <div style={{ padding: '0 26px 14px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={esLabel}>Your threads</div>
        </div>

        {/* Thread wall — 4 ghost columns */}
        <div style={{
          margin: '0 22px',
          background: `linear-gradient(180deg, ${ES.surface} 0%, #1E1D1A 100%)`,
          border: `0.5px solid ${ES.hairline}`,
          borderRadius: 22,
          padding: '20px 16px 16px',
          position: 'relative',
          overflow: 'hidden',
          flex: 1,
          maxHeight: 360,
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 8,
            position: 'relative',
          }}>
            {labels.map((label, i) => (
              <div key={i} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* faint vertical line */}
                <div style={{
                  position: 'absolute',
                  top: 6, bottom: 28,
                  left: '50%', transform: 'translateX(-50%)',
                  width: 1,
                  background: `linear-gradient(180deg,
                    rgba(201,197,189,0.0) 0%,
                    rgba(201,197,189,0.08) 30%,
                    rgba(201,197,189,0.20) 80%,
                    rgba(201,197,189,0.30) 100%)`,
                }} />
                <div style={{ flex: 1 }} />
                {/* silver base node */}
                <svg width="46" height="46" viewBox="0 0 46 46" fill="none" style={{ marginBottom: 6 }}>
                  <defs>
                    <radialGradient id={`es-pg-glow-${i}`}>
                      <stop offset="0" stopColor="#C9C5BD" stopOpacity="0.30" />
                      <stop offset="1" stopColor="#C9C5BD" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id={`es-pg-core-${i}`}>
                      <stop offset="0" stopColor="#E8E4DC" />
                      <stop offset="1" stopColor="#9D998F" />
                    </radialGradient>
                  </defs>
                  <circle cx="23" cy="23" r="22" fill={`url(#es-pg-glow-${i})`}>
                    <animate attributeName="opacity" values="0.5;0.9;0.5" dur={`${3.0 + i * 0.3}s`} repeatCount="indefinite" />
                  </circle>
                  <circle cx="23" cy="23" r="4" fill={`url(#es-pg-core-${i})`} />
                  <circle cx="23" cy="23" r="4" fill="none" stroke="#FAFAF8" strokeOpacity="0.22" strokeWidth="0.5" />
                </svg>
                <div style={{
                  ...esBody, fontSize: 10, fontWeight: 500,
                  letterSpacing: '0.10em', textTransform: 'uppercase',
                  color: ES.mutedSoft,
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invitation copy */}
        <div style={{ padding: '24px 28px 0', textAlign: 'center' }}>
          <h2 style={{
            ...esDisplay, fontSize: 24, color: ES.text,
            margin: '0 0 8px', lineHeight: 1.15,
          }}>
            Nothing to show yet.
          </h2>
          <div style={{
            ...esBody, fontSize: 13, lineHeight: 1.5,
            color: ES.warmGrey, maxWidth: 290, margin: '0 auto',
            textWrap: 'pretty',
          }}>
            Start logging evidence across your threads to see your momentum build here.
          </div>
        </div>
      </div>

      <EsTabBar active="progress" />
    </div>
  );
}

Object.assign(window, { HomeEmpty, DetailEmpty, ProgressEmpty });
