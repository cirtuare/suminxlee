import { useState, useCallback, useEffect } from 'react';
import type { Tab, Project } from './types';
import { TABS } from './constants';
import { PROJECTS } from './data/projects';
import Layout from './components/Layout';
import About from './components/About';
import Publications from './components/Publications';
import Projects from './components/Projects';
import CV from './components/CV';

function toSlug(title: string) {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function parseHash(): { tab: Tab; project: Project | null } {
  const hash = window.location.hash.slice(1);
  const [tabPart, slug] = hash.split('/');
  const tab: Tab = (TABS as string[]).includes(tabPart) ? (tabPart as Tab) : 'about';
  const project = slug ? (PROJECTS.find(p => toSlug(p.title) === slug) ?? null) : null;
  return { tab, project };
}

export default function App() {
  const [{ tab, project }, setNav] = useState(parseHash);

  useEffect(() => {
    const handler = () => setNav(parseHash());
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const setTab = useCallback((t: Tab) => {
    history.pushState(null, '', `#${t}`);
    setNav({ tab: t, project: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openProject = useCallback((p: Project) => {
    history.pushState(null, '', `#projects/${toSlug(p.title)}`);
    setNav({ tab: 'projects', project: p });
  }, []);

  const closeProject = useCallback(() => {
    history.back();
  }, []);

  return (
    <Layout tab={tab} setTab={setTab}>
      {tab === 'about'        && <About />}
      {tab === 'publications' && <Publications />}
      {tab === 'projects'     && <Projects selected={project} onOpen={openProject} onClose={closeProject} />}
      {tab === 'cv'           && <CV />}
    </Layout>
  );
}
