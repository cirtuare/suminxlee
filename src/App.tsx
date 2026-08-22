import { useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import type { Tab, Project } from './types';
import { PROJECTS } from './data/projects';
import Layout from './components/Layout';
import About from './components/About';
import Publications from './components/Publications';
import Projects from './components/Projects';

function toSlug(title: string) {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function ProjectsRoute() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const selected = slug ? (PROJECTS.find(p => toSlug(p.title) === slug) ?? null) : null;

  const openProject = useCallback((p: Project) => {
    navigate(`/projects/${toSlug(p.title)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const closeProject = useCallback(() => {
    navigate('/projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  return <Projects selected={selected} onOpen={openProject} onClose={closeProject} />;
}

function TabLayout({ tab }: { tab: Tab }) {
  const navigate = useNavigate();
  const setTab = useCallback((t: Tab) => {
    navigate(`/${t === 'about' ? '' : t}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  return (
    <Layout tab={tab} setTab={setTab}>
      {tab === 'about'        && <About />}
      {tab === 'publications' && <Publications />}
      {tab === 'projects'     && <ProjectsRoute />}
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TabLayout tab="about" />} />
      <Route path="/publications" element={<TabLayout tab="publications" />} />
      <Route path="/projects" element={<TabLayout tab="projects" />} />
      <Route path="/projects/:slug" element={<TabLayout tab="projects" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
