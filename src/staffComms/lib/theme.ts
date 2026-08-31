export const scopeChipColors: Record<string, { bg: string; text: string; border: string }> = {
  whole_church:  { bg: '#BDECE7', text: '#003B36', border: '#9DD4CF' },
  ministry:      { bg: '#CFEAC5', text: '#2A4A26', border: '#B0CFA6' },
  informational: { bg: '#F4F1E8', text: '#4A4553', border: '#D8D3C4' },
};

export const scopeRangeColors: Record<string, string> = {
  whole_church:  '#003B36',
  ministry:      '#4D6547',
  informational: '#7A7286',
};

export const C = {
  // Surfaces
  bg:          '#F4F1E8',
  bgSubtle:    '#EBE7DA',
  card:        '#FFFFFF',
  cardAlt:     '#EBE7DA',
  // Borders
  border:      '#D8D3C4',
  borderMed:   '#B0A892',
  borderFocus: '#003B36',
  // Text
  text:        '#1A1C1C',
  textSec:     '#4A4553',
  textTer:     '#7A7286',
  textMuted:   '#9E9AAA',
  // Accent (Orange — primary brand)
  accent:      '#E98A15',
  accentBg:    '#FEF1DC',
  accentDark:  '#B86910',
  accentHover: '#C97A12',
  // Status
  warn:        '#BA1A1A',
  warnBg:      '#FFDAD6',
  success:     '#4D6547',
  successBg:   '#CCE7C2',
  // Interaction tints
  high:        '#E98A15',
  highBg:      '#FEF1DC',
  // Dark panels (Stage, Slides) — Deep Forest
  stageBg:     '#003B36',
  stageText:   '#FFFFFF',
  stageAccent: '#E98A15',
  slideBg:     '#003B36',
  slideText:   '#FFFFFF',
  // Nav
  navBg:       '#003B36',
  navText:     '#FFFFFF',
} as const;

export const font = {
  body:    "'Inter', sans-serif",
  display: "'Inter Tight', sans-serif",
  mono:    "'JetBrains Mono', 'Fira Mono', monospace",
} as const;
