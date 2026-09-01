export const C = {
  bg: "#F9F9F7",
  card: "#FFFFFF",
  cardAlt: "#F3F1EA",
  border: "#E7E2D6",
  borderLight: "#F1EEE6",
  text: "#080C0B",
  textSec: "#3F4542",
  textTer: "#6B706C",
  accent: "#0B1613",
  accentLight: "#3F4542",
  accentBg: "#F1EEE6",
  accentDark: "#000000",
  sun: "#FFC44F",
  gold: "#CCA866",
  goldText: "#A6790F",
  navBg: "#0B1613",
  navText: "#F9F9F7",
  success: "#2E7D32",
  error: "#DC2626",
  warning: "#B45309",
};

export const ui = {
  body: "'Inter',sans-serif",
  display: "'Inter Tight',sans-serif",
};

export const iS = {
  width: "100%",
  padding: "9px 12px",
  border: `1px solid ${C.border}`,
  borderRadius: 6,
  fontFamily: ui.body,
  fontSize: 14,
  color: C.text,
  background: C.card,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

export const lS = {
  display: "block",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: C.textTer,
  marginBottom: 4,
  fontFamily: ui.display,
};
