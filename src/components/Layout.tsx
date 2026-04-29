import type { ReactNode } from 'react';
import type { Tab } from '../types';
import { TABS } from '../constants';
import { useIsMobile } from '../hooks/useIsMobile';
import Eyebrow from './Eyebrow';

interface Props {
  tab: Tab;
  setTab: (t: Tab) => void;
  children: ReactNode;
}

export default function Layout({ tab, setTab, children }: Props) {
  const mobile = useIsMobile();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="glass" style={{
        position: 'sticky', top: 0, zIndex: 90,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: mobile ? '0.85rem 1.25rem' : '1rem 2.5rem',
        borderBottom: '1px solid rgba(40,8,14,0.07)', gap: '0.75rem',
      }}>
        <button onClick={() => setTab('about')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font)', fontWeight: 800, fontSize: '0.95rem',
          letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text)',
          padding: 0, flexShrink: 0,
        }}>
          Sumin Lee
        </button>
        <nav className="nav-tabs">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: tab === t ? 'rgba(255,255,255,0.55)' : 'none',
              backdropFilter: tab === t ? 'blur(16px)' : 'none',
              WebkitBackdropFilter: tab === t ? 'blur(16px)' : 'none',
              border: tab === t ? '1px solid rgba(255,255,255,0.9)' : '1px solid transparent',
              boxShadow: tab === t ? '0 2px 12px rgba(40,8,14,0.08), inset 0 1px 0 rgba(255,255,255,1)' : 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font)', fontWeight: tab === t ? 600 : 400,
              fontSize: mobile ? '0.6rem' : '0.62rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: tab === t ? 'var(--pink)' : 'var(--muted)',
              padding: mobile ? '0.38rem 0.7rem' : '0.42rem 0.85rem',
              borderRadius: '9999px',
              transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
              transform: tab === t ? 'scale(1.04)' : 'scale(1)',
              whiteSpace: 'nowrap',
            }}>
              {t}
            </button>
          ))}
        </nav>
        <div className="nav-spacer" style={{ width: 100 }} />
      </header>
      <main style={{ flex: 1 }}>{children}</main>
      <footer className="footer-row" style={{
        padding: mobile ? '1rem 1.25rem' : '1.1rem 2.5rem',
        borderTop: '1px solid rgba(40,8,14,0.07)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Eyebrow>© 2026 Sumin Lee · Seoul National University</Eyebrow>
        <Eyebrow>cirtuare@snu.ac.kr</Eyebrow>
      </footer>
    </div>
  );
}
