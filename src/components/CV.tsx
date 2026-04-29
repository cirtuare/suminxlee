import type { ReactNode } from 'react';
import { useFade } from '../hooks/useFade';
import Eyebrow from './Eyebrow';

interface CVEntryProps {
  role: string;
  org: string;
  sub?: string;
  period?: string;
  bullets?: string[];
}

function CVEntry({ role, org, sub, period, bullets }: CVEntryProps) {
  return (
    <div className="cv-row" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', padding: '1.35rem 0', borderBottom: '1px solid rgba(40,8,14,0.06)', alignItems: 'start' }}>
      <div>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)', marginBottom: '0.18rem' }}>{role}</div>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: '0.74rem', color: 'var(--pink)', marginBottom: sub ? '0.1rem' : '0.45rem' }}>{org}</div>
        {sub && <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.68rem', color: 'var(--dim)', marginBottom: '0.45rem' }}>{sub}</div>}
        {bullets && (
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.26rem' }}>
            {bullets.map((b, i) => (
              <li key={i} style={{ display: 'flex', gap: '0.7rem', alignItems: 'flex-start' }}>
                <span style={{ marginTop: '0.5em', width: 3, height: 3, borderRadius: '50%', background: 'rgba(240,80,110,0.4)', flexShrink: 0, display: 'block' }} />
                <span style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.65 }}>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {period && <div className="cv-row-right" style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.65rem', color: 'var(--dim)', whiteSpace: 'nowrap', textAlign: 'right', paddingTop: '0.1rem' }}>{period}</div>}
    </div>
  );
}

function CVSimpleRow({ left, sub, right }: { left: string; sub?: string; right?: string }) {
  return (
    <div className="cv-row" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', padding: '0.95rem 0', borderBottom: '1px solid rgba(40,8,14,0.06)', alignItems: 'center' }}>
      <div>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text)', marginBottom: sub ? '0.13rem' : 0 }}>{left}</div>
        {sub && <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.7rem', color: 'var(--muted)' }}>{sub}</div>}
      </div>
      {right && <div className="cv-row-right" style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.65rem', color: 'var(--dim)', whiteSpace: 'nowrap', textAlign: 'right' }}>{right}</div>}
    </div>
  );
}

function CVSection({ title, children }: { title: string; children: ReactNode }) {
  const ref = useFade();
  return (
    <div ref={ref} className="fi" style={{ marginBottom: '2.25rem' }}>
      <div style={{ marginBottom: '0.55rem' }}>
        <Eyebrow style={{ fontSize: '0.6rem', color: 'var(--text)', letterSpacing: '0.18em' }}>{title}</Eyebrow>
      </div>
      <div style={{ borderTop: '1px solid rgba(40,8,14,0.09)' }}>{children}</div>
    </div>
  );
}

export default function CV() {
  return (
    <div className="page-enter page-pad" style={{ maxWidth: 860, margin: '0 auto' }}>
      <CVSection title="Education">
        <CVSimpleRow left="B.S. Civil, Urban & Environmental Engineering" sub="Seoul National University" right="2023 – 2027" />
        <CVSimpleRow left="B.A. Information Science and Culture" sub="Seoul National University" right="2023 – 2027" />
      </CVSection>
      <CVSection title="Research Experience">
        <CVEntry role="Research Intern" org="IMSI Lab, Seoul National University" sub="Advisor: Prof. Nam-Joon Kim" period="Feb 2026 – Present"
          bullets={['Led dataset curation, aggregating 10 dental datasets into a standardized benchmark with visualization pipeline', 'Conducted ablation studies training deep learning models across multiple medical imaging projects']} />
      </CVSection>
      <CVSection title="Industry Experience">
        <CVEntry role="Software Developer & Team Lead — Color 3D" org="3D Tactile Color Display for Visual Accessibility" sub="HCI · Assistive Technology" period="Jul – Dec 2025"
          bullets={['ICAT 2025 Speaker — presented full-stack tactile display system', 'Developed iOS app with color-height mapping, voice-guided interfaces, and on-device AI descriptions', 'Engineered ESP32 firmware for 24-motor BT control system with real-time tactile rendering']} />
        <CVEntry role='iOS Lead Developer — "Acon"' org="Restaurant Finder App" period="Jan – Oct 2025"
          bullets={["Proposed and architected app structure; managed App Store release end-to-end; led cross-functional teams", "Implemented memory-optimized photo album selection using Apple's Photos framework", 'Designed extensible LocationManager with CoreLocation + Naver Map API; implemented Amplitude analytics']} />
        <CVEntry role='iOS Developer — "Siksha"' org="SNU Dining App · 10,000+ users" period="Mar 2024 – Present"
          bullets={['Maintained and improved SwiftUI app, refactoring to clean architecture', 'Proposed and developed KakaoTalk menu-sharing feature']} />
        <CVEntry role='iOS Developer — "Dateroad"' org="Date Course Sharing App" period="Jul 2024 – Mar 2025"
          bullets={['Developed complex UI components and reusable custom alert controller', 'Configured Google AdMob integration and implemented rewarded Google Ads']} />
        <CVEntry role="2024 WISET Engineering Research Team G6" org="River Discharge & Water Quality Analysis" sub="Hydrology · WISET" period="Mar – Nov 2024"
          bullets={['Python pipeline for 10-year multi-resolution time series across 14 water quality parameters', 'FFT, power spectrum, fractal dimension analysis using NumPy and SciPy']} />
      </CVSection>
      <CVSection title="Publications">
        <CVSimpleRow left="3D Tactile Display for Non-visual Color Perception" sub="HCI Korea 2026 · First author · with Yehyeon Park*" right="2026" />
        <CVSimpleRow left="NEMESIS: Noise-suppressed Efficient MAE with Enhanced Superpatch Integration Strategy" sub="Under review (preprint) · Co-author" right="2025" />
        <CVSimpleRow left="MATHENA: Mamba-based Dental Anatomy Hierarchical Estimator and Holistic Evaluation Network for Anatomy" sub="Under review (preprint) · Co-author" right="2025" />
        <CVSimpleRow left="Memory and Spatial Patterns in River Discharge using Fractal Theory" sub="KSCE 2024 Convention · Co-author" right="2024" />
      </CVSection>
      <CVSection title="Honors & Awards">
        <CVSimpleRow left="AI·SW Maestro Trainee" sub="Ministry of Science and ICT · Nationwide · ~$6,800 scholarship" right="Apr 2026 – Present" />
        <CVSimpleRow left="Excellence Award, SNU Social Responsibility Contest" sub="SNUSR" right="Nov 2025" />
        <CVSimpleRow left="ICAT 2025 Speaker" sub="International Conference on Appropriate Technology" right="2025" />
      </CVSection>
      <CVSection title="Leadership">
        <CVEntry role="Executive Committee, Project Team Leader" org="Wafflestudio — SNU Web/App Development Club" period="Aug 2024 – Aug 2025"
          bullets={['Led 400+ members in web/app development, managing communications via Slack', 'Organized alum homecoming event spanning 20 years of club history', 'Primary coordinator for collaboration with SNU Festival Committee']} />
      </CVSection>
      <CVSection title="Teaching">
        <CVSimpleRow left="Tutor — Computing Essentials (F37.204)" sub="SNU · Instructor: Prof. Yamada Akihiko · Python syntax, exam setting" right="Spring 2026" />
      </CVSection>
      <CVSection title="Skills">
        <CVSimpleRow left="Programming" sub="Python · Swift · TypeScript" />
        <CVSimpleRow left="Design & Prototyping" sub="Figma · Cinema 4D · Adobe Premiere Pro · Illustrator" />
        <CVSimpleRow left="Languages" sub="Korean (Native) · English (Fluent — iBT TOEFL 109)" />
      </CVSection>
    </div>
  );
}
