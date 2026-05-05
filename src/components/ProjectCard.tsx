import { useState } from 'react';
import type { Project } from '../types';
import { TAG_COL } from '../data/projects';
import { useFade } from '../hooks/useFade';
import { withBase } from '../utils/withBase';

interface Props {
  project: Project;
  onOpen: (p: Project) => void;
}

export default function ProjectCard({ project, onOpen }: Props) {
  const [hov, setHov] = useState(false);
  const ref = useFade();

  return (
    <div
      ref={ref} className="fi"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onOpen(project)}
      style={{
        borderRadius: '1.15rem', overflow: 'hidden', position: 'relative', cursor: 'pointer',
        transform: hov ? 'translateY(-5px) scale(1.015)' : 'none',
        transition: 'transform 0.33s cubic-bezier(0.16,1,0.3,1)',
        aspectRatio: '4/5',
        boxShadow: hov ? '0 8px 32px rgba(40,8,14,0.14)' : '0 2px 12px rgba(40,8,14,0.07)',
      }}
    >
      {project.thumbnail ? (
        <img
          src={withBase(project.thumbnail)}
          alt={project.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: project.thumbnailPosition ?? 'center', display: 'block' }}
        />
      ) : (
        <div className={project.cg} style={{ position: 'absolute', inset: 0 }} />
      )}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%', background: 'linear-gradient(to bottom, transparent 0%, rgba(243,237,238,0.88) 48%, rgba(243,237,238,0.98) 70%, rgba(243,237,238,1) 100%)' }} />

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.1rem 1.2rem' }}>
        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.55rem' }}>
          {project.tags.map(t => (
            <div key={t} style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: '0.49rem', letterSpacing: '0.1em', padding: '0.16rem 0.45rem', borderRadius: '9999px', background: `${TAG_COL['iOS']}18`, border: `0.5px solid ${TAG_COL['iOS']}33`, color: TAG_COL['iOS'] }}>{t}</div>
          ))}
        </div>
        <h3 style={{ fontFamily: 'var(--font)', fontWeight: 800, fontSize: 'clamp(1rem,1.55vw,1.25rem)', lineHeight: 1.05, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: '0.2rem' }}>{project.title}</h3>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.65rem', color: 'var(--muted)', lineHeight: 1.4, marginBottom: '0.7rem' }}>{project.subtitle}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.6rem', borderTop: '1px solid rgba(40,8,14,0.08)' }}>
          <span style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.6rem', color: 'var(--pink)' }}>{project.venue}</span>
          <span style={{ fontFamily: 'var(--font)', fontWeight: 300, fontSize: '0.57rem', color: 'var(--dim)', whiteSpace: 'nowrap' }}>{project.period}</span>
        </div>
      </div>
    </div>
  );
}
