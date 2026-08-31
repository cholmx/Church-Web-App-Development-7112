export const C = {
  bg: "#E8F0F2",
  card: "#F4F9FA",
  cardAlt: "#DCE9EC",
  border: "#B8CDD4",
  borderLight: "#CCE0E6",
  text: "#0A1A1F",
  textSec: "#1A3A42",
  textTer: "#4A7080",
  accent: "#E98A15",
  accentLight: "#F5B055",
  accentBg: "#FEF3E2",
  accentDark: "#B86A0A",
  navBg: "#0A1A1F",
  navText: "#F0EDE8",
  success: "#059669",
  error: "#DC2626",
  warning: "#D97706",
};

export const ui = {
  body: "'DM Sans',sans-serif",
  display: "'League Spartan',sans-serif",
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