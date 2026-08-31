import { useState } from 'react';
import { Menu, X, ExternalLink } from 'lucide-react';
import { C, font } from '../lib/theme';
import { TABS } from '../lib/constants';
import type { Tab } from '../types';

interface TabBarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const EXTERNAL_LINKS = [
  { href: 'https://onrealm.org/urfellowship', label: 'Realm' },
];

const activeTabLabel = (key: Tab) => TABS.find(t => t.key === key)?.label ?? key;

export function TabBar({ active, onChange }: TabBarProps) {
  const [open, setOpen] = useState(false);

  const handleTabSelect = (key: Tab) => {
    onChange(key);
    setOpen(false);
  };

  return (
    <>
      {/* Desktop: horizontal scroll row */}
      <div className="tab-bar tab-bar-desktop" style={{
        display: 'flex',
        gap: 0,
        overflowX: 'auto',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        {TABS.map(t => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key as Tab)}
              style={{
                padding: '9px 12px',
                border: 'none',
                borderBottom: isActive ? `2px solid ${C.stageAccent}` : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: font.display,
                fontSize: 11,
                fontWeight: isActive ? 700 : 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: isActive ? C.stageAccent : 'rgba(241,245,249,0.4)',
                background: 'transparent',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'color 0.15s, border-color 0.15s',
                outline: 'none',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(241,245,249,0.72)'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(241,245,249,0.4)'; }}
            >
              {t.label}
            </button>
          );
        })}
        {EXTERNAL_LINKS.map(link => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '9px 12px',
              border: 'none',
              borderBottom: '2px solid transparent',
              fontFamily: font.display,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'rgba(241,245,249,0.3)',
              background: 'transparent',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              textDecoration: 'none',
              transition: 'color 0.15s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(241,245,249,0.6)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(241,245,249,0.3)')}
          >
            {link.label}
            <ExternalLink size={9} style={{ opacity: 0.6 }} />
          </a>
        ))}
      </div>

      {/* Mobile: active tab label + hamburger trigger */}
      <div className="tab-bar-mobile" style={{
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '0 4px',
        height: 38,
      }}>
        <span style={{
          fontFamily: font.display,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: C.stageAccent,
        }}>
          {activeTabLabel(active)}
        </span>
        <button
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: 'rgba(241,245,249,0.6)',
            borderRadius: 4,
            transition: 'color 0.15s',
            outline: 'none',
          }}
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 98,
              background: 'rgba(0,0,0,0.4)',
            }}
          />
          {/* Drawer panel */}
          <div
            className="mobile-drawer"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              background: C.navBg,
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              zIndex: 99,
              boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
            }}
          >
            {TABS.map(t => {
              const isActive = active === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => handleTabSelect(t.key as Tab)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    borderLeft: isActive ? `3px solid ${C.stageAccent}` : '3px solid transparent',
                    background: isActive ? 'rgba(249,115,22,0.07)' : 'transparent',
                    cursor: 'pointer',
                    fontFamily: font.display,
                    fontSize: 12,
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: isActive ? C.stageAccent : 'rgba(241,245,249,0.55)',
                    textAlign: 'left',
                    transition: 'background 0.1s, color 0.1s',
                    outline: 'none',
                  }}
                >
                  {t.label}
                </button>
              );
            })}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
            {EXTERNAL_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  width: '100%',
                  padding: '11px 16px',
                  borderLeft: '3px solid transparent',
                  fontFamily: font.display,
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'rgba(241,245,249,0.35)',
                  textDecoration: 'none',
                  boxSizing: 'border-box',
                  transition: 'color 0.1s',
                }}
              >
                {link.label}
                <ExternalLink size={10} style={{ opacity: 0.5 }} />
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
}
