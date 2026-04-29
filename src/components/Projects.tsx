import { useState, useCallback, useMemo } from 'react';
import type { TagName, Project } from '../types';
import { PROJECTS, ALL_TAGS } from '../data/projects';
import { useFade } from '../hooks/useFade';
import Eyebrow from './Eyebrow';
import ProjectCard from './ProjectCard';
import ProjectDetail from './ProjectDetail';

export default function Projects() {
  const [activeTags, setActiveTags] = useState<Set<TagName>>(new Set());
  const [selected, setSelected] = useState<Project | null>(null);
  const f = useFade();

  const toggleTag = useCallback((t: TagName) => {
    setActiveTags(prev => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t); else next.add(t);
      return next;
    });
  }, []);

  const filtered = useMemo(() => {
    if (activeTags.size === 0) return PROJECTS;
    return PROJECTS.filter(p => p.tags.some(t => activeTags.has(t)));
  }, [activeTags]);

  if (selected) return <ProjectDetail project={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="page-enter page-pad" style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div ref={f} className="fi" style={{ marginBottom: '2.5rem' }}>
        <Eyebrow style={{ marginBottom: '1.1rem' }}>Projects</Eyebrow>
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
