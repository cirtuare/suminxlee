import { MailIcon, GithubIcon, LinkedinIcon } from '../icons';
import { useIsMobile } from '../hooks/useIsMobile';
import Eyebrow from './Eyebrow';

const SOCIAL = [
  { Icon: MailIcon,     href: 'mailto:cirtuare@snu.ac.kr',           label: 'cirtuare@snu.ac.kr' },
  { Icon: GithubIcon,   href: 'https://github.com/cirtuare',          label: 'github.com/cirtuare' },
  { Icon: LinkedinIcon, href: 'https://www.linkedin.com/in/cirtuare', label: 'linkedin.com/in/cirtuare' },
];

const NEWS = [
  { date: 'Apr 2026', text: 'Opened my personal website!' },
  { date: 'Feb 2026', text: 'Joined the SNU IMSI Lab, advised by Prof. Nam-joon Kim.' },
  { date: 'Jan 2026', text: 'Presented a poster at HCI Korea 2026.' },
];

function PhotoPlaceholder({ width, height }: { width: number; height: number }) {
  return (
    <div style={{
      width, height, flexShrink: 0,
      borderRadius: '0.9rem', position: 'relative', overflow: 'hidden',
      background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.7)',
    }}>
      <div className="cg1" style={{ position: 'absolute', inset: 0, opacity: 0.18 }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(240,80,110,0.35)" strokeWidth="1.2"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
        <Eyebrow style={{ color: 'rgba(240,80,110,0.35)', fontSize: '0.44rem' }}>Photo</Eyebrow>
      </div>
    </div>
  );
}

export default function About() {
  const mobile = useIsMobile();
  const px = mobile ? '1.25rem' : '2.5rem';

  return (
    // Full-viewport wrapper — gradient lives here so it spans the whole page width
    <div className="page-enter" style={{
      position: 'relative',
      height: mobile ? 'auto' : 'calc(100vh - 54px - 44px)',
      overflow: mobile ? 'visible' : 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 55% 60% at 5% 90%, rgba(240,80,110,0.10) 0%, transparent 60%),
          radial-gradient(ellipse 50% 50% at 95% 10%, rgba(240,112,72,0.08) 0%, transparent 55%),
          radial-gradient(ellipse 40% 40% at 50% 50%, rgba(251,188,181,0.05) 0%, transparent 70%)
        `,
      }} />

      {/* Content constrained to readable width */}
      <div style={{
        position: 'relative', zIndex: 5,
        height: mobile ? 'auto' : '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: mobile ? `2rem ${px} 3rem` : `2.8rem ${px}`,
        maxWidth: 1100, width: '100%', margin: '0 auto',
        gap: mobile ? '1.75rem' : '0',
      }}>

        {/* Name + photo — tightly grouped, photo bottom-aligned to name */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.25rem' }}>
          <h1 style={{
            fontFamily: 'var(--font)', fontWeight: 700,
            fontSize: mobile ? 'clamp(2.6rem,12vw,3.5rem)' : 'clamp(2.8rem,5vw,4.5rem)',
            lineHeight: 0.92, color: 'var(--text)', letterSpacing: '-0.03em',
          }}>
            Sumin<br />Lee
          </h1>
          <PhotoPlaceholder width={mobile ? 62 : 112} height={mobile ? 76 : 138} />
        </div>

        {/* Bio */}
        <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: mobile ? '0.8rem' : '0.82rem', color: 'var(--muted)', lineHeight: 1.85 }}>
            I am an undergraduate student in Civil, Urban & Environmental Engineering and Information Science & Culture at{' '}
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>Seoul National University</span>.
            {' '}I am drawn to spaces where technology meaningfully improves everyday life — not just in high-impact breakthroughs, but in the incremental ways that quietly shape how people live.
          </p>
          <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: mobile ? '0.8rem' : '0.82rem', color: 'var(--muted)', lineHeight: 1.85 }}>
            My research interests lie in{' '}
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>Human-AI Interaction</span>
            , with a growing curiosity toward multimodal interaction — how vision, language, and touch can be integrated to create AI systems that are more attuned to human context. I am currently working at the IMSI Lab on Medical AI research, building a stronger technical foundation in AI as I work toward becoming an HAI researcher.
          </p>
        </div>

        {/* News */}
        <div style={{ maxWidth: 680 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.8rem' }}>
            <Eyebrow style={{ letterSpacing: '0.2em' }}>News</Eyebrow>
            <div style={{ flex: 1, height: 1, background: 'rgba(40,8,14,0.08)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {NEWS.map(({ date, text }, i) => (
              <div key={date} style={{
                display: 'flex', gap: '1rem', alignItems: 'baseline',
                padding: '0.52rem 0',
                borderBottom: i < NEWS.length - 1 ? '1px solid rgba(40,8,14,0.06)' : 'none',
              }}>
                <span style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.6rem', color: 'var(--pink)', whiteSpace: 'nowrap', letterSpacing: '0.04em', minWidth: 54 }}>{date}</span>
                <span style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social */}
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
          {SOCIAL.map(({ Icon, href, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="soc-btn" title={label}>
              <Icon s={17} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
