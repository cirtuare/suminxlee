import { MailIcon, GithubIcon, LinkedinIcon } from '../icons';
import { useIsMobile } from '../hooks/useIsMobile';
import Eyebrow from './Eyebrow';
import { withBase } from '../utils/withBase';

const SOCIAL = [
  { Icon: MailIcon,     href: 'mailto:cirtuare@snu.ac.kr',           label: 'cirtuare@snu.ac.kr' },
  { Icon: GithubIcon,   href: 'https://github.com/cirtuare',          label: 'github.com/cirtuare' },
  { Icon: LinkedinIcon, href: 'https://www.linkedin.com/in/cirtuare', label: 'linkedin.com/in/cirtuare' },
];

const NEWS = [
  { date: 'May 2026', text: 'Opened my personal website!' },
  { date: 'Feb 2026', text: 'Joined the SNU IMSI Lab, advised by Prof. Nam-joon Kim.' },
  { date: 'Jan 2026', text: 'Presented a poster at HCI Korea 2026.' },
];

const MASK = 'radial-gradient(ellipse 95% 95% at 50% 42%, black 72%, transparent 100%)';

export default function About() {
  const mobile = useIsMobile();
  const px = mobile ? '1.25rem' : '2.5rem';

  return (
    <div className="page-enter" style={{ position: 'relative' }}>

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1100, margin: '0 auto',
        padding: mobile ? `2.5rem 1.5rem 3.5rem` : `3rem 2.5rem 4rem`,
        display: 'flex', flexDirection: 'column', gap: '2.5rem',
      }}>

        {mobile ? (
          /* ── Mobile: Name → Photo (centered) → Bio ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <h1 style={{
              fontFamily: 'var(--font)', fontWeight: 700,
              fontSize: 'clamp(2.4rem,10vw,3rem)',
              lineHeight: 1, color: 'rgba(40,8,14,0.72)', letterSpacing: '-0.04em', margin: 0,
            }}>
              Sumin Lee
            </h1>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="prof-swap" style={{
                width: '62%', maxWidth: 210, aspectRatio: '4/5',
                WebkitMaskImage: MASK, maskImage: MASK,
              }}>
                <img src={withBase('/img/prof-pic.png')} alt="Sumin Lee" />
                <img className="prof-hidden" src={withBase('/img/prof-hidden.png')} alt="" aria-hidden="true" />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.9, margin: 0 }}>
                I am an undergraduate student in Civil, Urban & Environmental Engineering and Information Science & Culture at{' '}
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>Seoul National University</span>.
                {' '}I am drawn to spaces where technology meaningfully improves everyday life — not just in high-impact breakthroughs, but in the incremental ways that quietly shape how people live. On the side, I have worked as an iOS developer, with 4 released products reaching 10,000+ users.
              </p>
              <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.9, margin: 0 }}>
                My research interests lie in{' '}
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>human-AI interaction</span>
                , with a growing curiosity toward how humans and AI collaborate — how multimodal engagement with AI shapes not only the outcomes of that collaboration but also people's understanding and wellbeing. At the core is an interest in how AI can improve quality of life, not only in high-impact applications but in the incremental ways that shape everyday experience.
              </p>
              <div style={{ display: 'flex', gap: '0.45rem', paddingTop: '0.25rem' }}>
                {SOCIAL.map(({ Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="soc-btn" title={label}>
                    <Icon s={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── Desktop: Photo left | Name + Bio right ── */
          <div style={{ display: 'flex', flexDirection: 'row', gap: '2.5rem', alignItems: 'flex-start' }}>
            <div className="prof-swap" style={{
              flexShrink: 0, width: 170, aspectRatio: '4/5',
              WebkitMaskImage: MASK, maskImage: MASK,
            }}>
              <img src={withBase('/img/prof-pic.png')} alt="Sumin Lee" />
              <img className="prof-hidden" src={withBase('/img/prof-hidden.png')} alt="" aria-hidden="true" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h1 style={{
                fontFamily: 'var(--font)', fontWeight: 600,
                fontSize: 'clamp(2.5rem,4vw,3.5rem)',
                lineHeight: 1, color: 'rgba(40,8,14,0.72)', letterSpacing: '-0.04em', margin: 0,
              }}>
                Sumin Lee
              </h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.9, margin: 0 }}>
                  I am an undergraduate student in Civil, Urban & Environmental Engineering and Information Science & Culture at{' '}
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>Seoul National University</span>.
                  {' '}I am drawn to spaces where technology meaningfully improves everyday life — not just in high-impact breakthroughs, but in the incremental ways that quietly shape how people live. On the side, I have worked as an iOS developer, with 4 released products reaching 10,000+ users.
                </p>
                <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.9, margin: 0 }}>
                  My research interests lie in{' '}
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>human-AI interaction</span>
                  , with a growing curiosity toward how humans and AI collaborate — how multimodal engagement with AI shapes not only the outcomes of that collaboration but also people's understanding and wellbeing. At the core is an interest in how AI can improve quality of life, not only in high-impact applications but in the incremental ways that shape everyday experience.
                </p>
                <div style={{ display: 'flex', gap: '0.45rem', paddingTop: '0.1rem' }}>
                  {SOCIAL.map(({ Icon, href, label }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="soc-btn" title={label}>
                      <Icon s={17} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── News ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Eyebrow style={{ letterSpacing: '0.2em' }}>News</Eyebrow>
            <div style={{ flex: 1, height: 1, background: 'rgba(40,8,14,0.08)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {NEWS.map(({ date, text }, i) => (
              <div key={date} style={{
                display: 'flex', gap: '1rem', alignItems: 'baseline',
                padding: '0.5rem 0',
                borderBottom: i < NEWS.length - 1 ? '1px solid rgba(40,8,14,0.06)' : 'none',
              }}>
                <span style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.6rem', color: 'var(--pink)', whiteSpace: 'nowrap', letterSpacing: '0.04em', minWidth: 54 }}>{date}</span>
                <span style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
