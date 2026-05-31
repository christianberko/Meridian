// Meridian — Log Evidence bottom sheet
// Slides up over Goal Detail. Dims the screen behind.

const LE = {
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
  amberBorder: 'rgba(245,166,35,0.35)',
  silver: '#C9C5BD',
};

const leDisplay = {
  fontFamily: '"Fraunces", "Times New Roman", serif',
  fontStyle: 'italic',
  fontWeight: 300,
  letterSpacing: '-0.01em',
};
const leBody = {
  fontFamily: '-apple-system, "SF Pro Text", "SF Pro", system-ui, sans-serif',
};

function MoodSelector({ value, onChange }) {
  const moods = [
    { value: 'meh', emoji: '😐', label: 'meh' },
    { value: 'good', emoji: '🙂', label: 'good' },
    { value: 'strong', emoji: '💪', label: 'strong' },
    { value: 'fire', emoji: '🔥', label: 'fire' },
  ];
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{
        ...leBody, fontSize: 11, fontWeight: 600,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        color: LE.muted, marginBottom: 12,
      }}>
        How did it feel?
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {moods.map(m => {
          const selected = value === m.value;
          return (
            <button
              key={m.value}
              onClick={() => onChange(m.value)}
              style={{
                flex: 1, height: 56, borderRadius: 16,
                background: selected ? 'rgba(245,166,35,0.08)' : 'rgba(250,250,248,0.025)',
                border: selected
                  ? `1px solid ${LE.amber}`
                  : `0.5px solid ${LE.hairline}`,
                boxShadow: selected
                  ? '0 0 0 4px rgba(245,166,35,0.10), inset 0 0 0 0.5px rgba(245,166,35,0.4)'
                  : 'none',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24,
                filter: selected ? 'none' : 'grayscale(0.45) opacity(0.6)',
                transition: 'all 180ms ease',
                padding: 0,
              }}
            >
              <span style={{ lineHeight: 1 }}>{m.emoji}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LogEvidenceSheet({ open, onClose, onSave }) {
  const [text, setText] = React.useState('');
  const [mood, setMood] = React.useState('strong');
  const [focused, setFocused] = React.useState(false);
  const taRef = React.useRef(null);

  // Animate in
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    if (open) {
      const t = setTimeout(() => setMounted(true), 10);
      return () => clearTimeout(t);
    } else {
      setMounted(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      {/* Scrim */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(10,10,8,0.55)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 240ms ease',
          cursor: 'pointer',
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'relative',
        width: '100%',
        background: LE.surface,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        border: `0.5px solid ${LE.hairline}`,
        borderBottom: 'none',
        boxShadow: '0 -24px 60px rgba(0,0,0,0.6), 0 -1px 0 rgba(250,250,248,0.05) inset',
        padding: '10px 20px 28px',
        paddingBottom: 'calc(34px + 18px)', // home indicator + breathing room
        transform: mounted ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 360ms cubic-bezier(0.22, 0.61, 0.36, 1)',
        overflow: 'hidden',
      }}>
        {/* warm corner glow */}
        <div style={{
          position: 'absolute', top: -50, right: -60, width: 240, height: 240,
          background: 'radial-gradient(circle, rgba(245,166,35,0.10) 0%, rgba(245,166,35,0) 65%)',
          pointerEvents: 'none',
        }} />

        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0 14px', position: 'relative' }}>
          <div style={{ width: 38, height: 5, borderRadius: 3, background: 'rgba(250,250,248,0.15)' }} />
        </div>

        {/* Title + context */}
        <div style={{ position: 'relative', marginBottom: 18 }}>
          <h2 style={{ ...leDisplay, fontSize: 28, lineHeight: 1.1, color: LE.text, margin: '0 0 8px' }}>
            What did you do today?
          </h2>
          <div style={{
            ...leBody, fontSize: 11, fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: LE.amber,
          }}>
            Daily writing · May 8
          </div>
        </div>

        {/* Coach pre-fill */}
        <div style={{
          position: 'relative',
          background: 'rgba(245,166,35,0.04)',
          border: `0.5px solid ${LE.amberBorder}`,
          borderRadius: 14,
          padding: '12px 14px',
          marginBottom: 18,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Icon name="sparkle" size={12} color={LE.amber} />
            <div style={{
              ...leBody, fontSize: 10.5, fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: LE.amber,
            }}>
              Coach
            </div>
          </div>
          <div style={{ ...leBody, fontSize: 13.5, lineHeight: 1.45, color: LE.text }}>
            <span style={{ color: LE.muted }}>Last time you wrote </span>
            420 words
            <span style={{ color: LE.muted }}>. Try to match or beat that today.</span>
          </div>
        </div>

        {/* Textarea */}
        <div style={{
          position: 'relative',
          background: 'rgba(0,0,0,0.22)',
          borderRadius: 16,
          border: focused ? `1px solid ${LE.amber}` : `0.5px solid ${LE.hairline}`,
          boxShadow: focused
            ? '0 0 0 4px rgba(245,166,35,0.12), 0 0 24px rgba(245,166,35,0.08)'
            : 'none',
          transition: 'all 220ms ease',
          padding: '14px 14px',
        }}>
          <textarea
            ref={taRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Describe what you actually did..."
            rows={4}
            style={{
              width: '100%',
              minHeight: 96,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              ...leBody,
              fontSize: 15,
              lineHeight: 1.5,
              color: LE.text,
              padding: 0,
              caretColor: LE.amber,
            }}
          />
          <div style={{
            position: 'absolute', bottom: 10, right: 14,
            ...leBody, fontSize: 11, color: LE.mutedSoft, letterSpacing: '0.04em',
          }}>
            {text.trim() ? `${text.trim().split(/\s+/).length} words` : 'optional'}
          </div>
        </div>

        {/* Mood */}
        <MoodSelector value={mood} onChange={setMood} />

        {/* Save */}
        <div style={{ marginTop: 22 }}>
          <button
            onClick={() => onSave && onSave({ text, mood })}
            style={{
              width: '100%', height: 54, borderRadius: 27,
              background: `linear-gradient(180deg, #F8B547 0%, ${LE.amber} 100%)`,
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 10px 32px rgba(245,166,35,0.32), 0 1px 0 rgba(255,255,255,0.25) inset, 0 -1px 0 rgba(0,0,0,0.15) inset',
              ...leBody, fontSize: 16, fontWeight: 600, color: '#1A1917',
              letterSpacing: '-0.01em',
            }}
          >
            Save evidence
          </button>
          <div style={{
            ...leBody, fontSize: 12, color: LE.mutedSoft,
            textAlign: 'center', marginTop: 12, letterSpacing: '0.01em',
          }}>
            This adds a node to your thread
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LogEvidenceSheet });
