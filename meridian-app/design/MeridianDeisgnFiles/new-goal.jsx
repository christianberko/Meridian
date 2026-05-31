// Meridian — New Goal (New Thread) creation screen
// Single scrollable form. Same design system as Detail/Home.

const NG = {
  bg: '#1A1917',
  surface: '#242320',
  surfaceRaised: '#2A2925',
  hairline: 'rgba(250,250,248,0.07)',
  hairlineStrong: 'rgba(250,250,248,0.12)',
  text: '#FAFAF8',
  muted: '#8A8580',
  mutedSoft: '#6C6862',
  warmGrey: '#A8A19A',
  amber: '#F5A623',
  amberSoft: 'rgba(245,166,35,0.10)',
  amberSofter: 'rgba(245,166,35,0.05)',
  amberBorder: 'rgba(245,166,35,0.45)',
  silver: '#C9C5BD',
};

const ngDisplay = {
  fontFamily: '"Fraunces", "Times New Roman", serif',
  fontStyle: 'italic',
  fontWeight: 300,
  letterSpacing: '-0.01em',
};

const ngBody = {
  fontFamily: '-apple-system, "SF Pro Text", "SF Pro", system-ui, sans-serif',
};

const ngLabel = {
  ...ngBody,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.20em',
  textTransform: 'uppercase',
  color: NG.warmGrey,
};

// ─────────────────────────────────────────────────────────
// Section wrapper — label + optional aside + body
// ─────────────────────────────────────────────────────────
function Section({ label, aside, hint, children, gap = 14 }) {
  return (
    <section style={{ marginBottom: 30 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: gap }}>
        <div style={ngLabel}>{label}</div>
        {aside && (
          <div style={{
            ...ngBody, fontSize: 11, fontWeight: 500,
            letterSpacing: '0.04em',
            color: NG.mutedSoft, fontStyle: 'italic',
          }}>
            {aside}
          </div>
        )}
      </div>
      {hint && (
        <div style={{
          ...ngBody, fontSize: 12, lineHeight: 1.45,
          color: NG.mutedSoft, marginTop: -6, marginBottom: 14,
        }}>
          {hint}
        </div>
      )}
      {children}
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// Underline-style text input (large, intentional)
// ─────────────────────────────────────────────────────────
function ThreadInput({ value, onChange, placeholder, fontSize = 22, autoFocus = false }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ position: 'relative', paddingBottom: 14 }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          padding: '4px 0',
          color: NG.text,
          fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif',
          fontSize,
          fontWeight: 400,
          letterSpacing: '-0.012em',
          lineHeight: 1.25,
          boxSizing: 'border-box',
          minWidth: 0,
        }}
      />
      {/* base hairline */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 1,
        background: NG.hairlineStrong,
      }} />
      {/* focused / filled gold line */}
      <div style={{
        position: 'absolute', left: 0, bottom: 0, height: 1.5,
        width: focused || value ? '100%' : 0,
        background: `linear-gradient(90deg, ${NG.amber} 0%, rgba(245,166,35,0.4) 100%)`,
        transition: 'width 240ms ease',
      }} />
      <style>{`
        input::placeholder { color: ${NG.mutedSoft}; font-style: italic; font-weight: 400; }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Category chips
// ─────────────────────────────────────────────────────────
function CategoryChips({ value, onChange, options }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              ...ngBody,
              fontSize: 13.5,
              fontWeight: 500,
              letterSpacing: '-0.005em',
              padding: '10px 16px',
              borderRadius: 999,
              cursor: 'pointer',
              border: selected
                ? '1px solid transparent'
                : `1px solid ${NG.amberBorder}`,
              background: selected ? NG.amber : 'transparent',
              color: selected ? '#1A1917' : NG.amber,
              boxShadow: selected
                ? '0 6px 18px rgba(245,166,35,0.25), inset 0 1px 0 rgba(255,255,255,0.25)'
                : 'inset 0 0 0 0 transparent',
              transition: 'background 160ms ease, color 160ms ease, box-shadow 160ms ease',
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Cadence cards — three large options side-by-side
// ─────────────────────────────────────────────────────────
function CadenceCard({ value, label, description, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        position: 'relative',
        padding: '18px 10px 16px',
        borderRadius: 18,
        cursor: 'pointer',
        background: selected ? NG.amberSoft : 'rgba(250,250,248,0.025)',
        border: selected
          ? `1px solid ${NG.amber}`
          : `0.5px solid ${NG.hairline}`,
        boxShadow: selected
          ? '0 0 0 4px rgba(245,166,35,0.08), 0 10px 28px rgba(245,166,35,0.10)'
          : 'none',
        textAlign: 'center',
        transition: 'all 200ms ease',
        overflow: 'hidden',
      }}
    >
      {selected && (
        <div style={{
          position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)',
          width: 120, height: 80,
          background: 'radial-gradient(ellipse 60% 100% at 50% 100%, rgba(245,166,35,0.20) 0%, rgba(245,166,35,0) 70%)',
          pointerEvents: 'none',
        }} />
      )}
      <div style={{
        ...ngDisplay,
        fontSize: 22,
        color: selected ? NG.amber : NG.text,
        lineHeight: 1,
        marginBottom: 6,
        position: 'relative',
      }}>
        {label}
      </div>
      <div style={{
        ...ngBody, fontSize: 11.5, lineHeight: 1.3,
        color: selected ? 'rgba(245,166,35,0.85)' : NG.muted,
        letterSpacing: '0.01em',
        position: 'relative',
      }}>
        {description}
      </div>
    </button>
  );
}

function CadenceRow({ value, onChange }) {
  const options = [
    { value: 'daily', label: 'Daily', description: 'Every day' },
    { value: 'weekly', label: 'Weekly', description: 'Set specific days' },
    { value: 'custom', label: 'Custom', description: 'You decide' },
  ];
  return (
    <div style={{ display: 'flex', gap: 9 }}>
      {options.map((o) => (
        <CadenceCard
          key={o.value}
          {...o}
          selected={value === o.value}
          onClick={() => onChange(o.value)}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Deadline pill
// ─────────────────────────────────────────────────────────
function DeadlinePill({ value, onChange }) {
  const has = !!value;
  return (
    <button
      onClick={() => onChange(has ? null : 'set')}
      style={{
        ...ngBody,
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 16px 14px 18px',
        borderRadius: 999,
        background: has ? NG.amberSoft : 'rgba(250,250,248,0.025)',
        border: has ? `1px solid ${NG.amberBorder}` : `0.5px solid ${NG.hairlineStrong}`,
        cursor: 'pointer',
        color: NG.text,
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: '-0.005em',
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={has ? NG.amber : NG.warmGrey} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
        <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
      </svg>
      <span style={{ color: has ? NG.text : NG.warmGrey }}>
        {has ? value : 'No deadline'}
      </span>
      <span style={{ flex: 1 }} />
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={NG.muted} strokeWidth="2" strokeLinecap="round">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </button>
  );
}

// ─────────────────────────────────────────────────────────
// Header — back + centered title
// ─────────────────────────────────────────────────────────
function NewGoalHeader({ onBack }) {
  return (
    <div style={{
      position: 'relative',
      padding: '4px 18px 22px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: 44,
    }}>
      <button
        onClick={onBack}
        aria-label="Back"
        style={{
          position: 'absolute', left: 18,
          width: 38, height: 38, borderRadius: 19,
          background: NG.surface, border: `0.5px solid ${NG.hairline}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', padding: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={NG.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      <div style={{ ...ngDisplay, fontSize: 22, color: NG.text }}>
        New thread
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────
function NewGoalScreen({ onBack, onCreate }) {
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState('Craft');
  const [work, setWork] = React.useState('');
  const [cadence, setCadence] = React.useState('daily');
  const [deadline, setDeadline] = React.useState(null);

  const canCreate = name.trim().length > 0;

  return (
    <div style={{
      width: '100%', height: '100%',
      boxSizing: 'border-box',
      background: NG.bg,
      color: NG.text,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* ambient warm wash */}
      <div style={{
        position: 'absolute', top: -120, right: -100, width: 360, height: 360,
        background: 'radial-gradient(circle, rgba(245,166,35,0.08) 0%, rgba(245,166,35,0) 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', bottom: -160, left: -120, width: 380, height: 380,
        background: 'radial-gradient(circle, rgba(245,166,35,0.05) 0%, rgba(245,166,35,0) 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div
        className="hide-scrollbar"
        style={{
          position: 'absolute',
          top: 54, left: 0, right: 0, bottom: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingBottom: 220,
          zIndex: 1,
        }}
      >
        <NewGoalHeader onBack={onBack} />

        <div style={{ padding: '6px 22px 0' }}>
          {/* opening contextual line */}
          <div style={{
            ...ngBody,
            fontSize: 13.5,
            lineHeight: 1.5,
            color: NG.muted,
            marginBottom: 28,
            textWrap: 'pretty',
          }}>
            Threads are the things you keep choosing.{' '}
            <span style={{ ...ngDisplay, color: NG.text }}>Make one that matters.</span>
          </div>

          <Section label="What do you want to achieve?">
            <ThreadInput
              value={name}
              onChange={setName}
              placeholder="e.g. Learn Swift, Run a 5K, Write daily…"
            />
          </Section>

          <Section label="Category">
            <CategoryChips
              value={category}
              onChange={setCategory}
              options={['Craft', 'Body', 'Mind', 'Career', 'Creative', 'Life']}
            />
          </Section>

          <Section
            label="What does doing the work look like?"
            hint="This helps your AI coach give better suggestions."
          >
            <ThreadInput
              value={work}
              onChange={setWork}
              placeholder="e.g. Write 200 words, Run 20 mins, Study one concept…"
              fontSize={18}
            />
          </Section>

          <Section label="How often?">
            <CadenceRow value={cadence} onChange={setCadence} />
          </Section>

          <Section label="End date" aside="optional">
            <DeadlinePill value={deadline} onChange={setDeadline} />
          </Section>
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        paddingBottom: 30, pointerEvents: 'none', zIndex: 5,
      }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: 130,
          background: `linear-gradient(180deg, rgba(26,25,23,0) 0%, rgba(26,25,23,0.92) 55%, ${NG.bg} 100%)`,
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', padding: '0 22px', pointerEvents: 'auto' }}>
          <button
            onClick={onCreate}
            disabled={!canCreate}
            style={{
              width: '100%', height: 54, borderRadius: 27,
              background: canCreate
                ? 'linear-gradient(180deg, #F8B547 0%, #F5A623 100%)'
                : 'rgba(250,250,248,0.06)',
              border: 'none',
              cursor: canCreate ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: canCreate
                ? '0 12px 32px rgba(245,166,35,0.34), 0 1px 0 rgba(255,255,255,0.28) inset, 0 -1px 0 rgba(0,0,0,0.16) inset'
                : 'none',
              ...ngBody, fontSize: 16, fontWeight: 600,
              color: canCreate ? '#1A1917' : NG.mutedSoft,
              letterSpacing: '-0.005em',
              transition: 'all 200ms ease',
            }}
          >
            Create thread
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={canCreate ? '#1A1917' : NG.mutedSoft} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M14 6l6 6-6 6" />
            </svg>
          </button>
          <div style={{
            ...ngBody, fontSize: 11, color: NG.mutedSoft,
            textAlign: 'center', marginTop: 10,
            letterSpacing: '0.02em',
          }}>
            You can edit these settings anytime
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { NewGoalScreen });
