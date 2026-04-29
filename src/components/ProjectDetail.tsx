import { useEffect } from 'react';
import type { Project } from '../types';
import { useIsMobile } from '../hooks/useIsMobile';
import { BackIcon } from '../icons';
import Eyebrow from './Eyebrow';
import BlogBody from './BlogBody';

interface Props {
  project: Project;
  onBack: () => void;
}

export default function ProjectDetail({ project, onBack }: Props) {
  const mobile = useIsMobile();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  return (
    <div className="page-enter">
      {/* Hero */}
      <div className={project.cg} style={{ position: 'relative', height: mobile ? '42vh' : '52vh', minHeight: 240, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(40,8,14,0.1) 0%, rgba(40,8,14,0.7) 100%)' }} />
        <button onClick={onBack} style={{
          position: 'absolute', top: '1.5rem', left: mobile ? '1.25rem' : '2.5rem',
          display: 'flex', alignItems: 'center', gap: '0.45rem',
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.28)', borderRadius: '9999px', padding: '0.42rem 0.9rem',
          cursor: 'pointer', color: 'rgba(255,255,255,0.9)',
          fontFamily: 'var(--font)', fontWeight: 500, fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase',
          transition: 'background 0.15s', zIndex: 5, boxShadow: '0 2px 12px rgba(40,8,14,0.15)',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}>
          <BackIcon s={12} />Projects
        </button>
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', padding: mobile ? '2rem 1.25rem' : '3rem 2.5rem', maxWidth: 760, width: '100%' }}>
          <div style={{ display: 'flex', gap: '0.38rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
            {project.tags.map(t => (
              <div key={t} style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.18rem 0.5rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.35)', color: '#fff' }}>{t}</div>
            ))}
          </div>
          <h1 style={{ fontFamily: 'var(--font)', fontWeight: 800, fontSize: mobile ? 'clamp(2rem,9vw,2.8rem)' : 'clamp(2.5rem,5vw,4rem)', lineHeight: 0.95, letterSpacing: '-0.03em', color: '#fff', marginBottom: '0.6rem' }}>{project.title}</h1>
          <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: mobile ? '0.8rem' : '0.88rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{project.subtitle}</p>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: mobile ? '2.5rem 1.25rem 5rem' : '3.5rem 2.5rem 7rem' }}>
        <div className="glass-card" style={{ display: 'flex', gap: mobile ? '1.25rem' : '3rem', flexWrap: 'wrap', padding: '1.25rem 1.5rem', marginBottom: '3rem' }}>
          {(['Role', 'Period', 'Venue'] as const).map(k => (
            <div key={k}>
              <Eyebrow style={{ marginBottom: '0.3rem' }}>{k}</Eyebrow>
              <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text)' }}>
                {k === 'Role' ? project.role : k === 'Period' ? project.period : project.venue}
              </div>
            </div>
          ))}
        </div>

        <BlogBody blocks={project.body} mobile={mobile} cg={project.cg} />

        {(!project.body || project.body.length === 0) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {project.bullets.map((b, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', padding: '1.5rem 0', borderBottom: i < project.bullets.length - 1 ? '1px solid var(--ghost)' : 'none' }}>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 800, fontSize: '1rem', color: 'var(--pink)', lineHeight: 1, minWidth: 28, paddingTop: '0.08rem', flexShrink: 0, opacity: 0.45 }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: mobile ? '0.88rem' : '0.93rem', color: 'var(--muted)', lineHeight: 1.9, margin: 0 }}>{b}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
