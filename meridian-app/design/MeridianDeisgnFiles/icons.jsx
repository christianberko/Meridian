// Minimal stroke icons in SF Pro style for tabs + actions.
function Icon({ name, size = 24, color = 'currentColor', active = false, stroke = 1.6 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };

  switch (name) {
    case 'home':
      return active ? (
        <svg {...common} fill={color} stroke="none">
          <path d="M3.5 11.2 12 4l8.5 7.2v7.3a1.5 1.5 0 0 1-1.5 1.5h-3.5v-5.5h-7V20H5a1.5 1.5 0 0 1-1.5-1.5v-7.3Z" />
        </svg>
      ) : (
        <svg {...common}>
          <path d="M3.5 11.2 12 4l8.5 7.2v7.3a1.5 1.5 0 0 1-1.5 1.5h-3.5v-5.5h-7V20H5a1.5 1.5 0 0 1-1.5-1.5v-7.3Z" />
        </svg>
      );
    case 'progress':
      return (
        <svg {...common}>
          <path d="M4 17l4-5 4 3 6-8" />
          <circle cx={4} cy={17} r={1.2} fill={color} stroke="none" />
          <circle cx={8} cy={12} r={1.2} fill={color} stroke="none" />
          <circle cx={12} cy={15} r={1.2} fill={color} stroke="none" />
          <circle cx={18} cy={7} r={1.2} fill={color} stroke="none" />
        </svg>
      );
    case 'goals':
      // Concentric arcs — like a target / meridian
      return (
        <svg {...common}>
          <circle cx={12} cy={12} r={8.5} />
          <circle cx={12} cy={12} r={5} />
          <circle cx={12} cy={12} r={1.6} fill={color} stroke="none" />
        </svg>
      );
    case 'profile':
      return (
        <svg {...common}>
          <circle cx={12} cy={9} r={3.5} />
          <path d="M5 20c1.5-3.5 4.2-5 7-5s5.5 1.5 7 5" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...common} strokeWidth={2.2}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case 'sparkle':
      return (
        <svg {...common} strokeWidth={1.4}>
          <path d="M12 3l1.6 5.2L19 10l-5.4 1.8L12 17l-1.6-5.2L5 10l5.4-1.8L12 3Z" fill={color} stroke="none" />
          <path d="M19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" fill={color} stroke="none" opacity="0.55" />
        </svg>
      );
    case 'arrow':
      return (
        <svg {...common}>
          <path d="M5 12h14M14 6l6 6-6 6" />
        </svg>
      );
    case 'flame':
      return (
        <svg {...common} strokeWidth={1.4}>
          <path d="M12 3c.5 3 3.5 4 3.5 8a3.5 3.5 0 0 1-7 0c0-1.2.5-2 1-2.5C9 10 9 8 12 3Z" fill={color} stroke="none" />
        </svg>
      );
    case 'chevron':
      return (
        <svg {...common}>
          <path d="M9 6l6 6-6 6" />
        </svg>
      );
    default:
      return null;
  }
}

Object.assign(window, { Icon });
