import { useState, useCallback } from 'react';
import type { Tab } from './types';
import { TABS } from './constants';
import Layout from './components/Layout';
import About from './components/About';
import Publications from './components/Publications';
import Projects from './components/Projects';
import CV from './components/CV';

export default function App() {
  const [tab, setTabRaw] = useState<Tab>(() => {
    const s = localStorage.getItem('sl_tab3');
    return (TABS as string[]).includes(s ?? '') ? (s as Tab) : 'about';
  });

  const setTab = useCallback((t: Tab) => {
    setTabRaw(t);
    localStorage.setItem('sl_tab3', t);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Layout tab={tab} setTab={setTab}>
      {tab === 'about'        && <About />}
      {tab === 'publications' && <Publications />}
      {tab === 'projects'     && <Projects />}
      {tab === 'cv'           && <CV />}
    </Layout>
  );
}
