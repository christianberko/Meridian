// Meridian — Profile screen (fourth tab)
// Minimal, warm. Identity → streak → preferences → account → meta.

const PR = {
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
const prLabel = {
  ...prBody,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.20em',
  textTransform: 'uppercase',
  color: PR.warmGrey,
};

// ─────────────────────────────────────────────────────────
// Identity block — logo, name, since, stat strip
// ─────────────────────────────────────────────────────────
function IdentityBlock({ name, since, stats }) {
  return (
    <div style={{ padding: '8px 22px 26px', textAlign: 'center', position: 'relative' }}>
      {/* warm wash behind */}
      <div style={{
        position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
        width: 360, height: 240,
        background: 'radial-gradient(ellipse 60% 70% at 50% 40%, rgba(245,166,35,0.12) 0%, rgba(245,166,35,0) 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 28,
          background: PR.amberSoft,
          border: `0.5px solid ${PR.amberBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(245,166,35,0.18)',
        }}>
          <ThreadMark size={28} stroke={1.8} />
        </div>
      </div>

      <h1 style={{
        ...prDisplay, fontSize: 38, color: PR.text,
        margin: '0 0 6px', lineHeight: 1.05,
        position: 'relative',
      }}>
        {name}
      </h1>

      <div style={{
        ...prBody, fontSize: 12.5, color: PR.muted,
        marginBottom: 14, letterSpacing: '0.01em', position: 'relative',
      }}>
        {since}
      </div>

      <div style={{
        ...prBody, fontSize: 12, color: PR.warmGrey,
        letterSpacing: '0.04em', position: 'relative',
        display: 'inline-flex', alignItems: 'center', gap: 8,
      }}>
        {stats.map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && <span style={{ color: PR.mutedSoft }}>·</span>}
            <span>
              <span style={{ color: PR.text, fontWeight: 600 }}>{s.value}</span>{' '}
              <span>{s.label}</span>
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Streak card — large number + week dot row
// ─────────────────────────────────────────────────────────
function StreakCard({ streak, week, todayIndex }) {
  // week: array of 7 booleans (Mon..Sun)
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <div style={{ margin: '0 22px 26px', position: 'relative' }}>
      <div style={{
        position: 'relative',
        background: `linear-gradient(180deg, ${PR.surface} 0%, #1F1E1B 100%)`,
        border: `0.5px solid ${PR.hairline}`,
        borderRadius: 22,
        padding: '20px 22px 18px',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -50, right: -50, width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(245,166,35,0.15) 0%, rgba(245,166,35,0) 65%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', position: 'relative' }}>
          <div>
            <div style={{
              ...prBody, fontSize: 10.5, fontWeight: 600,
              letterSpacing: '0.20em', textTransform: 'uppercase',
              color: PR.warmGrey, marginBottom: 6,
            }}>
              Current streak
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <div style={{
                ...prDisplay, fontSize: 56, lineHeight: 0.95,
                color: PR.amber,
                textShadow: '0 0 28px rgba(245,166,35,0.35)',
                letterSpacing: '-0.03em',
              }}>
                {streak}
              </div>
              <div style={{ ...prBody, fontSize: 13, color: PR.muted, fontWeight: 500 }}>
                day streak
              </div>
            </div>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
            background: PR.amberSoft, border: `0.5px solid ${PR.amberBorder}`,
            borderRadius: 999, padding: '5px 10px 5px 8px',
            ...prBody, fontSize: 11.5, fontWeight: 600, color: PR.amber,
            letterSpacing: '0.02em',
          }}>
            <Icon name="flame" size={13} color={PR.amber} />
            On fire
          </div>
        </div>

        {/* 7-day row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          gap: 8, marginTop: 20, position: 'relative',
        }}>
          {week.map((logged, i) => {
            const isToday = i === todayIndex;
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 11,
                  background: logged ? PR.amber : 'transparent',
                  border: logged
                    ? `1px solid ${PR.amber}`
                    : `1px solid ${isToday ? PR.amberBorder : 'rgba(250,250,248,0.18)'}`,
                  boxShadow: logged
                    ? '0 0 0 3px rgba(245,166,35,0.10), 0 4px 10px rgba(245,166,35,0.18)'
                    : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  {isToday && !logged && (
                    <div style={{
                      width: 4, height: 4, borderRadius: 2,
                      background: PR.amber,
                    }} />
                  )}
                </div>
                <div style={{
                  ...prBody, fontSize: 10.5, fontWeight: 500,
                  color: isToday ? PR.amber : PR.mutedSoft,
                  letterSpacing: '0.06em',
                }}>
                  {days[i]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Settings list — clean rows with custom toggle / value+chevron
// ─────────────────────────────────────────────────────────
function MeridianToggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      aria-pressed={value}
      style={{
        width: 44, height: 26, borderRadius: 13,
        background: value
          ? 'linear-gradient(180deg, #F8B547 0%, #F5A623 100%)'
          : 'rgba(250,250,248,0.08)',
        border: value ? 'none' : `0.5px solid ${PR.hairlineStrong}`,
        position: 'relative', cursor: 'pointer',
        padding: 0,
        boxShadow: value
          ? '0 6px 14px rgba(245,166,35,0.30), inset 0 1px 0 rgba(255,255,255,0.25)'
          : 'inset 0 1px 2px rgba(0,0,0,0.30)',
        transition: 'background 220ms ease',
      }}
    >
      <div style={{
        position: 'absolute',
        top: 2, left: value ? 20 : 2,
        width: 22, height: 22, borderRadius: 11,
        background: value ? '#FFFCEC' : '#C9C5BD',
        boxShadow: '0 1px 3px rgba(0,0,0,0.30), 0 0 0 0.5px rgba(0,0,0,0.05)',
        transition: 'left 220ms cubic-bezier(.4,1.4,.5,1)',
      }} />
    </button>
  );
}

function Row({ label, children, last, onClick, accent }) {
  const clickable = !!onClick;
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '15px 0',
        borderBottom: last ? 'none' : `0.5px solid ${PR.hairline}`,
        cursor: clickable ? 'pointer' : 'default',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          ...prBody, fontSize: 15, fontWeight: 500,
          color: accent === 'muted' ? PR.muted : PR.text,
          letterSpacing: '-0.005em',
        }}>
          {label}
        </div>
      </div>
      {children}
    </div>
  );
}

function ValueChevron({ value, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {value && (
        <div style={{
          ...prBody, fontSize: 14, color: accent === 'gold' ? PR.amber : PR.muted,
          fontWeight: 500, letterSpacing: '-0.005em',
        }}>
          {value}
        </div>
      )}
      <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
        <path d="M1 1l6 6-6 6" stroke={PR.mutedSoft} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ListCard({ children }) {
  return (
    <div style={{
      margin: '0 22px',
      background: 'rgba(250,250,248,0.025)',
      border: `0.5px solid ${PR.hairline}`,
      borderRadius: 18,
      padding: '2px 18px',
    }}>
      {children}
    </div>
  );
}

function SectionHeader({ label, aside }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      padding: '0 26px 10px',
    }}>
      <div style={prLabel}>{label}</div>
      {aside && (
        <div style={{
          ...prBody, fontSize: 11, fontWeight: 500,
          color: PR.amber, fontStyle: 'italic',
          letterSpacing: '0.01em',
        }}>
          {aside}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Local tab bar (no floating CTA on profile)
// ─────────────────────────────────────────────────────────
function ProfileTabBar({ active, onTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'progress', label: 'Progress', icon: 'progress' },
    { id: 'goals', label: 'Goals', icon: 'goals' },
    { id: 'profile', label: 'Profile', icon: 'profile' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      paddingBottom: 34, zIndex: 6,
      pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 34, height: 90,
        background: `linear-gradient(180deg, rgba(26,25,23,0) 0%, rgba(26,25,23,0.85) 50%, ${PR.bg} 100%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '8px 14px 6px', pointerEvents: 'auto',
        borderTop: `0.5px solid ${PR.hairline}`,
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
                color: isActive ? PR.text : PR.mutedSoft,
              }}
            >
              <Icon
                name={t.icon}
                size={22}
                color={isActive ? PR.amber : PR.mutedSoft}
                active={isActive && t.id === 'home'}
                stroke={1.6}
              />
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

// ─────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────
function ProfileScreen({ onTab, tweaks }) {
  const [coach, setCoach] = React.useState(true);

  const name = (tweaks && tweaks.name) || 'Alex';

  return (
    <div style={{
      width: '100%', height: '100%',
      boxSizing: 'border-box',
      background: PR.bg,
      color: PR.text,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* faint ambient on edges */}
      <div style={{
        position: 'absolute', bottom: -180, left: -100, width: 360, height: 360,
        background: 'radial-gradient(circle, rgba(245,166,35,0.05) 0%, rgba(245,166,35,0) 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* scroll region */}
      <div
        className="hide-scrollbar"
        style={{
          position: 'absolute',
          top: 54, left: 0, right: 0, bottom: 0,
          overflowY: 'auto', overflowX: 'hidden',
          paddingBottom: 120,
          zIndex: 1,
        }}
      >
        <IdentityBlock
          name={name}
          since="Building since January 2026"
          stats={[
            { value: '4', label: 'threads' },
            { value: '247', label: 'entries' },
            { value: '90', label: 'days' },
          ]}
        />

        <StreakCard
          streak={12}
          week={[true, true, true, true, true, true, false]}
          todayIndex={6}
        />

        <SectionHeader label="Preferences" />
        <ListCard>
          <Row label="AI Coach">
            <MeridianToggle value={coach} onChange={setCoach} />
          </Row>
          <Row label="Daily reminder" onClick={() => {}}>
            <ValueChevron value="7:00 AM" />
          </Row>
          <Row label="Notification style" onClick={() => {}}>
            <ValueChevron value="Nudge" />
          </Row>
          <Row label="Appearance" last onClick={() => {}}>
            <ValueChevron value="Dark" />
          </Row>
        </ListCard>

        <div style={{ height: 28 }} />

        <SectionHeader label="Account" />
        <ListCard>
          <Row label="Edit profile" onClick={() => {}}>
            <ValueChevron />
          </Row>
          <Row label="Export my evidence" onClick={() => {}}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                ...prBody, fontSize: 11, fontWeight: 600,
                color: PR.amber, letterSpacing: '0.04em',
                fontStyle: 'italic',
              }}>
                Your data, always yours
              </div>
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                <path d="M1 1l6 6-6 6" stroke={PR.mutedSoft} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Row>
          <Row label="Sign out" last accent="muted" onClick={() => {}} />
        </ListCard>

        {/* Bottom meta */}
        <div style={{
          marginTop: 30, marginBottom: 8,
          textAlign: 'center', padding: '0 22px',
        }}>
          <div style={{
            ...prBody, fontSize: 11, color: PR.mutedSoft,
            letterSpacing: '0.10em', textTransform: 'uppercase',
            marginBottom: 6,
          }}>
            Meridian v1.0
          </div>
          <div style={{
            ...prDisplay, fontSize: 13, color: PR.muted,
            letterSpacing: '-0.005em',
          }}>
            Made for people who do the work.
          </div>
        </div>
      </div>

      <ProfileTabBar active="profile" onTab={onTab || (() => {})} />
    </div>
  );
}

Object.assign(window, { ProfileScreen });
