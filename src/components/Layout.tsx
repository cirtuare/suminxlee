import type { ReactNode } from 'react';
import type { Tab } from '../types';
import { TABS } from '../constants';
import { useIsMobile } from '../hooks/useIsMobile';
import { withBase } from '../utils/withBase';

interface Props {
  tab: Tab;
  setTab: (t: Tab) => void;
  children: ReactNode;
}

export default function Layout({ tab, setTab, children }: Props) {
  const mobile = useIsMobile();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Full-viewport gradient — fixed so it always covers the screen */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 55% 60% at 5% 90%, rgba(240,80,110,0.10) 0%, transparent 60%),
          radial-gradient(ellipse 50% 50% at 95% 10%, rgba(240,112,72,0.08) 0%, transparent 55%),
          radial-gradient(ellipse 40% 40% at 50% 50%, rgba(251,188,181,0.05) 0%, transparent 70%)
        `,
      }} />
      <header className="glass" style={{
        position: 'sticky', top: 0, zIndex: 90,
        borderBottom: '1px solid rgba(40,8,14,0.07)',
      }}>
        <div className="site-container" style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: mobile ? '0.85rem 1.25rem' : '1rem 2.5rem',
        }}>
          <button onClick={() => setTab('about')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 0, flexShrink: 0, display: 'flex', alignItems: 'center',
          }}>
            <img src={withBase('/img/logo.png')} alt="Sumin Lee" style={{ height: 32, width: 'auto', display: 'block', marginTop: 3 }} />
          </button>
          <nav className="nav-tabs" style={{ marginLeft: 'auto' }}>
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
        </div>
      </header>
      <main className="site-container" style={{ flex: 1 }}>{children}</main>
      <footer style={{ borderTop: '1px solid rgba(40,8,14,0.07)' }}>
        <div className="site-container footer-row" style={{
          padding: mobile ? '1rem 1.25rem' : '1.1rem 2.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem 1rem',
          fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.75rem', lineHeight: 1.5, color: 'var(--muted)',
        }}>
          <span>cirtuare(at)snu.ac.kr</span>
          <span style={{ marginLeft: 'auto', textAlign: 'right', whiteSpace: 'nowrap' }}>
            Last updated: <time dateTime="2026-10">Oct 2026</time>
          </span>
        </div>
      </footer>
    </div>
  );
}
