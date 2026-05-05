import { useState } from 'react';
import { PUBS, PUB_TYPE_STYLE } from '../data/publications';
import { useFade } from '../hooks/useFade';
import { useIsMobile } from '../hooks/useIsMobile';
import Eyebrow from './Eyebrow';
import type { Publication } from '../types';

function PubRow({ p, isLast }: { p: Publication; isLast: boolean }) {
  const [hovered, setHovered] = useState(false);
  const clickable = !!p.href;
  const mobile = useIsMobile();

  const inner = (
    <div
      className="pub-row pub-grid"
      onMouseEnter={() => clickable && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '52px 1fr 52px',
        gap: '1.75rem',
        padding: '1.85rem 0.75rem',
        alignItems: 'start',
        marginLeft: '-0.75rem',
        marginRight: '-0.75rem',
        cursor: clickable ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.38rem', paddingTop: '0.05rem' }}>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.62rem', color: 'var(--dim)', letterSpacing: '0.08em' }}>{p.id.toUpperCase()}</div>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: PUB_TYPE_STYLE[p.type].text, width: 'fit-content' }}>{p.type}</div>
        {mobile && clickable && (
          <div style={{
            width: 22, height: 22, marginTop: '0.25rem',
            borderRadius: '50%',
            border: `1.5px solid ${hovered ? 'rgba(240,80,110,0.6)' : 'rgba(240,80,110,0.25)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: hovered ? 'scale(1.25)' : 'scale(1)',
            transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), border-color 0.22s ease',
            color: hovered ? 'var(--pink)' : 'rgba(240,80,110,0.45)',
            flexShrink: 0,
          }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 8L8 2M8 2H3.5M8 2V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.45, marginBottom: '0.38rem' }}>{p.title}</div>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '0.45rem' }}>{p.authors}</div>
        <span style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.68rem', color: 'var(--pink)' }}>{p.venue}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', paddingTop: '0.05rem' }}>
        <span className="pub-year" style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.66rem', color: 'var(--dim)' }}>{p.year}</span>
        {!mobile && clickable && (
          <div style={{
            width: 22, height: 22,
            borderRadius: '50%',
            border: `1.5px solid ${hovered ? 'rgba(240,80,110,0.6)' : 'rgba(240,80,110,0.25)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: hovered ? 'scale(1.25)' : 'scale(1)',
            transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), border-color 0.22s ease',
            color: hovered ? 'var(--pink)' : 'rgba(240,80,110,0.45)',
            flexShrink: 0,
          }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 8L8 2M8 2H3.5M8 2V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      {clickable ? (
        <a href={p.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
          {inner}
        </a>
      ) : inner}
      {!isLast && <hr className="rule" />}
    </div>
  );
}

export default function Publications() {
  const f = useFade();
  return (
    <div className="page-enter page-pad" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div ref={f} className="fi">
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 'clamp(1.1rem,2vw,1.6rem)', letterSpacing: '-0.04em', color: 'rgba(40,8,14,0.72)', lineHeight: 1, margin: 0 }}>Publications</h1>
        </div>
        {PUBS.map((p, i) => (
          <PubRow key={p.id} p={p} isLast={i === PUBS.length - 1} />
        ))}
      </div>
    </div>
  );
}
