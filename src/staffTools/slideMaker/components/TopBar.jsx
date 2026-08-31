import React from 'react';
import {C, ui} from '../constants/styles';
import {ASPECT_RATIOS} from '../constants/data';

export default function TopBar({onDownload, onDownloadJpg, onCopy, aspectRatio, onAspectRatioChange, onUndo, canUndo, onToggleSidebar}) {
  return (
    <div style={{
      background: C.navBg,
      padding: "0 16px",
      position: "sticky",
      top: 0,
      zIndex: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 52,
      gap: 8,
    }}>
      <div style={{display: "flex", alignItems: "center", gap: 12, minWidth: 0}}>
        <button
          onClick={onToggleSidebar}
          className="sidebar-toggle-btn"
          style={{
            display: 'none',
            border: 'none',
            background: 'rgba(255,255,255,0.1)',
            color: C.navText,
            borderRadius: 6,
            padding: '6px 10px',
            cursor: 'pointer',
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          ☰
        </button>
        <div style={{minWidth: 0}}>
          <div style={{
            fontFamily: ui.display,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: C.accentLight,
            lineHeight: 1,
          }}>URF COMMUNICATIONS</div>
          <div style={{
            fontFamily: ui.display,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: C.navText,
            lineHeight: 1.2,
          }}>SLIDE DESIGNER</div>
        </div>
      </div>

      <div style={{display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end"}}>
        <div style={{display: "flex", background: "rgba(255,255,255,0.08)", borderRadius: 6, padding: 2}} className="aspect-ratio-group">
          {ASPECT_RATIOS.map(r => (
            <button
              key={r.id}
              onClick={() => onAspectRatioChange(r)}
              style={{
                padding: "4px 10px",
                border: "none",
                borderRadius: 4,
                background: aspectRatio?.id === r.id ? C.accent : "transparent",
                color: aspectRatio?.id === r.id ? "#fff" : "rgba(255,255,255,0.55)",
                fontFamily: ui.display,
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: "0.05em",
                cursor: "pointer",
                transition: "background 0.15s, color 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        <button
          onClick={onUndo}
          disabled={!canUndo}
          style={{
            padding: "6px 12px",
            border: `1px solid rgba(255,255,255,0.2)`,
            borderRadius: 6,
            background: "transparent",
            color: canUndo ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.25)",
            fontFamily: ui.display,
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            cursor: canUndo ? "pointer" : "not-allowed",
            whiteSpace: "nowrap",
          }}
          title={canUndo ? "Undo last change" : "Nothing to undo"}
        >
          ↶ Undo
        </button>

        <button onClick={onDownload} style={{...primaryBtn, whiteSpace: "nowrap"}} className="dl-png-btn">↓ PNG</button>
        <button onClick={onDownloadJpg} style={{...jpgBtn, whiteSpace: "nowrap"}} className="dl-jpg-btn">↓ JPG</button>
      </div>
    </div>
  );
}

const primaryBtn = {
  padding: "6px 16px",
  border: "none",
  borderRadius: 6,
  background: "#FFFFFF",
  color: "#1E1E21",
  fontFamily: ui.display,
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  cursor: "pointer",
};

const jpgBtn = {
  padding: "6px 16px",
  border: "1px solid rgba(255,255,255,0.3)",
  borderRadius: 6,
  background: "transparent",
  color: "#FFFFFF",
  fontFamily: ui.display,
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  cursor: "pointer",
};
