import { useEffect, useState, type ReactNode } from 'react';
import { useFade } from '../hooks/useFade';
import Eyebrow from './Eyebrow';

const SECTIONS = [
  { id: 'cv-education',  label: 'Education' },
  { id: 'cv-research',   label: 'Research Experience' },
  { id: 'cv-pubs',       label: 'Publications' },
  { id: 'cv-honors',     label: 'Honors & Awards' },
  { id: 'cv-projects',   label: 'Selected Projects' },
  { id: 'cv-teaching',   label: 'Teaching' },
  { id: 'cv-leadership', label: 'Leadership' },
  { id: 'cv-skills',     label: 'Skills & Languages' },
];

function useIsWide(bp = 1080) {
  const [wide, setWide] = useState(() => window.innerWidth > bp);
  useEffect(() => {
    const fn = () => setWide(window.innerWidth > bp);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, [bp]);
  return wide;
}

function useActiveSection() {
  const [active, setActive] = useState(SECTIONS[0].id);
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '-10% 0px -80% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);
  return active;
}

function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function TOC({ active }: { active: string }) {
  return (
    <nav style={{ display: 'flex', flexDirection: 'column' }}>
      {SECTIONS.map(s => {
        const on = s.id === active;
        return (
          <button
            key={s.id}
            onClick={() => goTo(s.id)}
            onMouseEnter={e => { if (!on) (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}
            onMouseLeave={e => { if (!on) (e.currentTarget as HTMLElement).style.color = 'var(--dim)'; }}
            style={{
              fontFamily: 'var(--font)', fontWeight: on ? 600 : 400,
              fontSize: '0.63rem', letterSpacing: '0.03em',
              color: on ? 'var(--pink)' : 'var(--dim)',
              textAlign: 'left', background: 'none', border: 'none',
              borderLeft: `2px solid ${on ? 'var(--pink)' : 'rgba(40,8,14,0.08)'}`,
              padding: '0.35rem 0 0.35rem 0.75rem',
              cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s',
              lineHeight: 1.4,
            }}
          >
            {s.label}
          </button>
        );
      })}
    </nav>
  );
}

function CVSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const ref = useFade();
  return (
    <div id={id} ref={ref} className="fi" style={{ marginBottom: '2.5rem', scrollMarginTop: '5rem' }}>
      <div style={{ marginBottom: '0.55rem' }}>
        <Eyebrow style={{ fontSize: '0.6rem', color: 'var(--text)', letterSpacing: '0.18em' }}>{title}</Eyebrow>
      </div>
      <div style={{ borderTop: '1px solid rgba(40,8,14,0.09)' }}>{children}</div>
    </div>
  );
}

function EntryRow({ left, right }: { left: ReactNode; right?: string }) {
  return (
    <div className="cv-row" style={{ display: 'grid', gridTemplateColumns: right ? '1fr auto' : '1fr', gap: '2rem', padding: '1.1rem 0', borderBottom: '1px solid rgba(40,8,14,0.06)', alignItems: 'start' }}>
      <div>{left}</div>
      {right && <div className="cv-row-right" style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.65rem', color: 'var(--dim)', whiteSpace: 'nowrap', textAlign: 'right', paddingTop: '0.1rem' }}>{right}</div>}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.26rem', marginTop: '0.42rem' }}>
      {items.map((b, i) => (
        <li key={i} style={{ display: 'flex', gap: '0.7rem', alignItems: 'flex-start' }}>
          <span style={{ marginTop: '0.52em', width: 3, height: 3, borderRadius: '50%', background: 'rgba(240,80,110,0.4)', flexShrink: 0, display: 'block' }} />
          <span style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.65 }}>{b}</span>
        </li>
      ))}
    </ul>
  );
}

function Authors({ text }: { text: string }) {
  const parts = text.split('Sumin Lee');
  return (
    <span>
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 && <strong style={{ fontWeight: 700, color: 'var(--text)' }}>Sumin Lee</strong>}
        </span>
      ))}
    </span>
  );
}

const T = {
  title: { fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)', marginBottom: '0.15rem' } as const,
  italic: { fontFamily: 'var(--font)', fontWeight: 400, fontStyle: 'italic' as const, fontSize: '0.7rem', color: 'var(--muted)' },
};

function PdfButton() {
  return (
    <a
      href="/cv/Sumin-Lee-Resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = 'var(--pink)';
        el.style.borderColor = 'rgba(240,80,110,0.38)';
        el.style.background = 'rgba(255,255,255,0.88)';
        el.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = 'var(--muted)';
        el.style.borderColor = 'rgba(40,8,14,0.12)';
        el.style.background = 'rgba(255,255,255,0.62)';
        el.style.transform = 'none';
      }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
        fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.6rem',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--muted)', textDecoration: 'none',
        padding: '0.48rem 0.9rem', borderRadius: '9999px',
        background: 'rgba(255,255,255,0.62)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(40,8,14,0.12)',
        boxShadow: '0 1px 6px rgba(40,8,14,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
        transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <line x1="10" y1="9" x2="8" y2="9"/>
      </svg>
      PDF
    </a>
  );
}

export default function CV() {
  const wide = useIsWide();
  const active = useActiveSection();

  return (
    <div className="page-enter page-pad">
      <div style={{ maxWidth: wide ? 980 : 760, margin: '0 auto', display: 'flex', gap: '3.5rem', alignItems: 'flex-start' }}>

        {/* TOC + PDF button (wide) */}
        {wide && (
          <div style={{ position: 'sticky', top: '2.5rem', width: 148, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <TOC active={active} />
            <PdfButton />
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* PDF button (narrow) */}
          {!wide && (
            <div style={{ marginBottom: '2rem' }}>
              <PdfButton />
            </div>
          )}

          <CVSection id="cv-education" title="Education">
            <EntryRow
              left={
                <>
                  <div style={T.title}>Seoul National University</div>
                  <div style={T.italic}>B.S. in Civil, Urban &amp; Environmental Engineering, B.A. in Information Science and Culture</div>
                </>
              }
              right="2023 – 2027 (Expected)"
            />
          </CVSection>

          <CVSection id="cv-research" title="Research Experience">
            <EntryRow
              left={
                <>
                  <div style={T.title}>IMSI LAB, SNU</div>
                  <div style={T.italic}>Research Intern (Advisor: Prof. Nam-Joon Kim)</div>
                  <Bullets items={[
                    'Led dataset curation, aggregating 10 dental datasets into a single standardized benchmark with visualization pipeline',
                    'Conducted ablation studies training deep learning models across multiple ongoing medical imaging projects',
                  ]} />
                </>
              }
              right="Feb 2026 – Present"
            />
          </CVSection>

          <CVSection id="cv-pubs" title="Publications">
            <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.62rem', color: 'var(--dim)', padding: '0.7rem 0 0.1rem', lineHeight: 1.6 }}>
              C: conference &nbsp;·&nbsp; P: preprint &nbsp;·&nbsp; *: equal contribution &nbsp;·&nbsp; †: corresponding author
            </div>
            {[
              {
                badge: 'P',
                title: "I'm Fine, But My Voice Isn't: Cross-Modal Affective Dissonance Detection for Reflective Journaling",
                authors: 'Sumin Lee†',
                venue: 'Under review',
              },
              {
                badge: 'C',
                title: '3D Tactile Display for Non-visual Color Perception',
                authors: 'Sumin Lee*†, Yehyeon Park*',
                venue: 'Proceedings of HCI Korea 2026',
              },
              {
                badge: 'P',
                title: 'NEMESIS: Noise-suppressed Efficient MAE with Enhanced Superpatch Integration Strategy',
                authors: 'Kyeonghun Kim, Hyeonseok Jung, Youngung Han, Hyunsu Go, Eunseob Choi, Seongbin Park, Junsu Lim, Jiwon Yang, Sumin Lee, Insung Hwang, Ken Ying-Kai Liao, Nam-Joon Kim†',
                venue: 'Under review',
              },
              {
                badge: 'P',
                title: 'MATHENA: Mamba-based Architectural Tooth Hierarchical Estimator and Holistic Evaluation Network for Anatomy',
                authors: 'Kyeonghun Kim, Jaehyung Park, Youngung Han, Anna Jung, Seongbin Park, Sumin Lee, Jiwon Yang, Jiyoon Han, Subeen Lee, Junsu Lim, Hyunsu Go, Eunseob Choi, Hyeonseok Jung, Soo Yong Kim, Woo Kyoung Jeong, Won Jae Lee, Pa Hong, Hyuk-Jae Lee, Ken Ying-Kai Liao, Nam-Joon Kim†',
                venue: 'Under review',
              },
              {
                badge: 'C',
                title: 'Memory and Spatial Patterns in Long-Term Time Series of River Discharge and Water Quality Parameters Using Fractal Theory',
                authors: 'Eunpyo Lee, Jungsoo Woo, Sumin Lee, Soyun Ihn, Soohyun Yang†',
                venue: 'KSCE 2024 Convention',
              },
            ].map((pub, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: '0.75rem', padding: '1.1rem 0', borderBottom: '1px solid rgba(40,8,14,0.06)', alignItems: 'start' }}>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.58rem', letterSpacing: '0.06em', color: 'var(--pink)', paddingTop: '0.2rem' }}>{pub.badge}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text)', lineHeight: 1.4, marginBottom: '0.28rem' }}>{pub.title}</div>
                  <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.71rem', color: 'var(--muted)', marginBottom: '0.18rem' }}><Authors text={pub.authors} /></div>
                  <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontStyle: 'italic', fontSize: '0.68rem', color: 'var(--dim)' }}>{pub.venue}</div>
                </div>
              </div>
            ))}
          </CVSection>

          <CVSection id="cv-honors" title="Honors & Awards">
            <EntryRow
              left={
                <>
                  <div style={T.title}>AI·SW Maestro Trainee</div>
                  <div style={T.italic}>Nationwide Software Training Program with scholarship approximately US $6,800 (Ministry of Science and ICT)</div>
                </>
              }
              right="Apr 2026 – Present"
            />
            <EntryRow
              left={
                <>
                  <div style={T.title}>Excellence Award, SNU Social Responsibility Contest</div>
                  <div style={T.italic}>Organized by SNUSR (Seoul National University Social Responsibility)</div>
                </>
              }
              right="Nov 2025"
            />
          </CVSection>

          <CVSection id="cv-projects" title="Selected Projects">
            {[
              {
                title: 'Color 3D: 3D Tactile Color Display for Visual Accessibility',
                role: 'Software Developer & Team Lead | HCI, Assistive Technology',
                period: 'Jul 2025 – Dec 2025',
                bullets: [
                  'International Conference on Appropriate Technology (ICAT) 2025 Speaker',
                  'Developed full-stack tactile display system enabling visually impaired users to independently perceive colors through haptic feedback',
                  'Implemented an iOS application featuring multimodal interaction via color-height mapping algorithms, voice-guided interfaces, and on-device AI descriptions',
                  'Engineered ESP32 firmware for 24-motor control system with Bluetooth communication protocol for real-time tactile rendering',
                ],
              },
              {
                title: 'River Discharge & Water Quality Time-Series Data Analysis',
                role: '2024 WISET Engineering Research Team G6 Member | Hydrology',
                period: 'Mar 2024 – Nov 2024',
                bullets: [
                  "Developed a comprehensive Python data pipeline that efficiently processed 10-year multi-resolution time series data across 14 water quality parameters from Korea's major river basins",
                  'Implemented signal processing techniques (FFT, power spectrum analysis) using NumPy and SciPy to identify memory patterns and fractal characteristics in environmental data, creating various log-log visualizations',
                ],
              },
              {
                title: 'SNU Club App "Allclear"',
                role: 'Mobile Developer | React Native',
                period: 'Sep 2025 – Present',
                bullets: [
                  'Migrated iOS app to a new Apple Developer account, resolving code signing and deployment issues',
                  'Led Admin Feature TF, defining requirements and driving decisions between design and backend teams',
                ],
              },
              {
                title: 'SNU Dining App "Siksha"',
                role: 'iOS Developer',
                period: 'Mar 2024 – Present',
                bullets: [
                  'Maintained and improved SwiftUI app serving 10,000+ users, refactoring to clean architecture and implementing various features',
                  'Diagnosed and resolved App Store rejection by revising privacy policy for anonymous content',
                ],
              },
              {
                title: 'Restaurant Finder App "Acon"',
                role: 'iOS Lead Developer',
                period: 'Jan 2025 – Oct 2025',
                bullets: [
                  'Spearheaded iOS development by proposing and architecting the app structure; managed App Store release end-to-end and led coordination across product, design, android, and backend teams to align priorities and resolve blockers',
                  "Implemented memory-optimized custom photo album selection using Apple's Photos framework",
                  'Designed extensible LocationManager with CoreLocation framework and Multicast delegate pattern and integrated it with Naver Map API, creating a location verification system',
                  'Proposed and implemented Amplitude analytics via a custom AmplitudeManager class for user behavior tracking',
                ],
              },
              {
                title: 'Date Course Sharing App "Dateroad"',
                role: 'iOS Developer',
                period: 'Jul 2024 – Mar 2025',
                bullets: [
                  'Developed complex UI components and engineered reusable custom alert controller to streamline use across multiple app sections',
                  'Configured Google AdMob integration and implemented rewarded Google Video Ads',
                ],
              },
            ].map((proj, i) => (
              <EntryRow
                key={i}
                left={
                  <>
                    <div style={T.title}>{proj.title}</div>
                    <div style={T.italic}>{proj.role}</div>
                    <Bullets items={proj.bullets} />
                  </>
                }
                right={proj.period}
              />
            ))}
          </CVSection>

          <CVSection id="cv-teaching" title="Teaching">
            <EntryRow
              left={
                <>
                  <div style={T.title}>Computing Essentials</div>
                  <div style={T.italic}>Seoul National University F37.204(003) Tutor (Instructor: Prof. Yamada Akihiko)</div>
                  <Bullets items={['Supported 30 students with Python programming and debugging']} />
                </>
              }
              right="Spring 2026"
            />
          </CVSection>

          <CVSection id="cv-leadership" title="Leadership">
            <EntryRow
              left={
                <>
                  <div style={T.title}>
                    Wafflestudio{' '}
                    <span style={{ fontWeight: 400 }}>(Seoul National University Web/App Development Club)</span>
                  </div>
                  <div style={T.italic}>Executive Committee, Project Team Leader</div>
                  <Bullets items={[
                    'Led 400+ members in web/app programming development, managing communications and driving engagement via Slack',
                    'Organized alum homecoming event, bringing together members across 20 years of club history to create meaningful connections',
                    'Served as the primary coordinator for collaboration with Seoul National University Festival Committee, synthesizing discussion points',
                  ]} />
                </>
              }
              right="Aug 2024 – Aug 2025"
            />
          </CVSection>

          <CVSection id="cv-skills" title="Technical Skills & Languages">
            {[
              { label: 'Programming',         value: 'Python, Swift, TypeScript, React Native' },
              { label: 'Design & Prototyping', value: 'Figma, Cinema 4D, Adobe Premiere Pro, Illustrator' },
              { label: 'Languages',            value: 'English (Fluent — iBT TOEFL 109), Korean (Native)' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', gap: '1.5rem', padding: '0.85rem 0', borderBottom: '1px solid rgba(40,8,14,0.06)', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.72rem', color: 'var(--text)', minWidth: 150, flexShrink: 0 }}>{label}</span>
                <span style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.72rem', color: 'var(--muted)' }}>{value}</span>
              </div>
            ))}
          </CVSection>

        </div>
      </div>
    </div>
  );
}
