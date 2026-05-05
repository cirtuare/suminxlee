import { useState, useCallback, useMemo } from 'react';
import type { TagName, Project } from '../types';
import { PROJECTS, ALL_TAGS } from '../data/projects';
import ProjectCard from './ProjectCard';
import ProjectDetail from './ProjectDetail';

export default function Projects() {
  const [activeTags, setActiveTags] = useState<Set<TagName>>(new Set());
  const [selected, setSelected] = useState<Project | null>(null);

  const toggleTag = useCallback((t: TagName) => {
    setActiveTags(prev => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t); else next.add(t);
      return next;
    });
  }, []);

  const PINNED_ORDER = ['CADD', 'Color 3D', 'Acon', 'MATHENA'];

  const filtered = useMemo(() => {
    const list = activeTags.size === 0 ? PROJECTS : PROJECTS.filter(p => p.tags.some(t => activeTags.has(t)));
    return [...list].sort((a, b) => {
      const ai = PINNED_ORDER.indexOf(a.title);
      const bi = PINNED_ORDER.indexOf(b.title);
      if (ai >= 0 && bi >= 0) return ai - bi;
      if (ai >= 0) return -1;
      if (bi >= 0) return 1;
      return 0;
    });
  }, [activeTags]);

  if (selected) return <ProjectDetail project={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="page-enter page-pad" style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 'clamp(1.1rem,2vw,1.6rem)', letterSpacing: '-0.04em', color: 'rgba(40,8,14,0.72)', lineHeight: 1, margin: 0, marginBottom: '1.1rem' }}>Projects</h1>
        <div className="filter-row" style={{ display: 'flex', gap: '0.38rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button className={`tag-pill${activeTags.size === 0 ? ' active' : ''}`} onClick={() => setActiveTags(new Set())}>All</button>
          {ALL_TAGS.map(t => (
            <button key={t} className={`tag-pill${activeTags.has(t) ? ' active' : ''}`} onClick={() => toggleTag(t)}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(270px, 100%), 1fr))', gap: '1.1rem' }}>
        {filtered.map(p => <ProjectCard key={p.title} project={p} onOpen={setSelected} />)}
      </div>
    </div>
  );
}
