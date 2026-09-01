// Category badges are informational (letting staff tell announcement types
// apart at a glance), not brand chrome, so they keep their own colors while
// everything else below uses the site-wide deep/sun/gold/ivory admin palette.
export const scopeChipColors: Record<string, { bg: string; text: string; border: string }> = {
  whole_church:  { bg: '#E5E5E5', text: '#1E1E21', border: '#D0D0D0' },
  ministry:      { bg: '#EFEFEF', text: '#3A3A3D', border: '#DCDCDC' },
  informational: { bg: '#F5F5F5', text: '#6E6E6E', border: '#E5E5E5' },
};

export const scopeRangeColors: Record<string, string> = {
  whole_church:  '#1E1E21',
  ministry:      '#4A4A4D',
  informational: '#7A7A7D',
};

export const C = {
  // Surfaces
  bg:          '#F9F9F7',
  bgSubtle:    '#F1EEE6',
  card:        '#FFFFFF',
  cardAlt:     '#F5F3EC',
  // Borders
  border:      '#E7E2D6',
  borderMed:   '#D8D0BE',
  borderFocus: '#0B1613',
  // Text
  text:        '#080C0B',
  textSec:     '#3F4542',
  textTer:     '#6B706C',
  textMuted:   '#9B9C93',
  // Accent (design-system dark - matches the main site's admin buttons/nav)
  accent:      '#0B1613',
  accentBg:    '#F1EEE6',
  accentDark:  '#000000',
  accentHover: '#1B2622',
  // Highlight (design-system yellow/gold, for CTAs and dark-panel accents)
  sun:         '#FFC44F',
  gold:        '#CCA866',
  goldText:    '#A6790F',
  // Status
  warn:        '#BA1A1A',
  warnBg:      '#FFDAD6',
  success:     '#2E7D32',
  successBg:   '#DCF0DD',
  // Interaction tints
  high:        '#0B1613',
  highBg:      '#F1EEE6',
  // Dark panels (Stage, Slides)
  stageBg:     '#0B1613',
  stageText:   '#FFFFFF',
  stageAccent: '#FFC44F',
  slideBg:     '#0B1613',
  slideText:   '#FFFFFF',
  // Nav
  navBg:       '#0B1613',
  navText:     '#FFFFFF',
} as const;

export const font = {
  body:    "'Inter', sans-serif",
  display: "'Inter Tight', sans-serif",
  mono:    "'JetBrains Mono', 'Fira Mono', monospace",
} as const;
