import { MailIcon, GithubIcon, LinkedinIcon, DocumentIcon } from '../icons';
import { useIsMobile } from '../hooks/useIsMobile';
import Eyebrow from './Eyebrow';
import { withBase } from '../utils/withBase';

const SOCIAL = [
  { Icon: MailIcon,     href: 'mailto:cirtuare@snu.ac.kr',           label: 'cirtuare@snu.ac.kr' },
  { Icon: GithubIcon,   href: 'https://github.com/cirtuare',          label: 'github.com/cirtuare' },
  { Icon: LinkedinIcon, href: 'https://www.linkedin.com/in/cirtuare', label: 'linkedin.com/in/cirtuare' },
  { Icon: DocumentIcon, href: withBase('/cv/Sumin-Lee-Resume.pdf'),   label: 'Curriculum vitae (PDF)' },
];

const NEWS = [
  { date: 'Jul 2026', text: 'Joined KIXLAB, advised by Prof. Juho Kim.' },
  { date: 'May 2026', text: 'Opened my personal website!' },
  { date: 'Feb 2026', text: 'Joined the SNU IMSI Lab, advised by Prof. Nam-joon Kim.' },
  { date: 'Jan 2026', text: 'Presented a poster at HCI Korea 2026.' },
];

const MASK = 'radial-gradient(ellipse 95% 95% at 50% 42%, black 72%, transparent 100%)';

function ProfileLinks() {
  return (
    <div className="profile-links" style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
      {SOCIAL.map(({ Icon, href, label }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="soc-btn" title={label} aria-label={label} style={{ width: '2.25rem', height: '2.25rem' }}>
          <Icon s={16} />
        </a>
      ))}
    </div>
  );
}

export default function About() {
  const mobile = useIsMobile();
  const px = mobile ? '1.25rem' : '2.5rem';

  return (
    <div className="page-enter" style={{ position: 'relative' }}>

      <div style={{
        position: 'relative', zIndex: 1,
        padding: mobile ? `2.5rem 1.5rem 3.5rem` : `3rem 2.5rem 4rem`,
        display: 'flex', flexDirection: 'column', gap: '2.5rem',
      }}>

        {mobile ? (
          /* ── Mobile: Name → Photo + Links (centered) → Bio ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <h1 style={{
              fontFamily: 'var(--font)', fontWeight: 700,
              fontSize: 'clamp(2.4rem,10vw,3rem)',
              lineHeight: 1, color: 'rgba(40,8,14,0.72)', letterSpacing: '-0.04em', margin: 0,
            }}>
              Sumin Lee
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div className="profile-photo" style={{
                width: '62%', maxWidth: 210, aspectRatio: '4/5',
                WebkitMaskImage: MASK, maskImage: MASK,
              }}>
                <img src={withBase('/img/prof-pic-crop.jpg')} alt="Sumin Lee" />
              </div>
              <ProfileLinks />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.9375rem', color: 'var(--muted)', lineHeight: 1.75, margin: 0 }}>
                I am an undergraduate student in Civil, Urban & Environmental Engineering and{' '}
                <strong style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Information Science & Culture</strong> at{' '}
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>Seoul National University</span>.
              </p>
              <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.9375rem', color: 'var(--muted)', lineHeight: 1.75, margin: 0 }}>
                My research interests lie in{' '}
                <span style={{ fontWeight: 600, color: 'rgba(40,8,14,0.72)' }}>human-computer interaction (HCI)</span>
                {' '}and{' '}
                <span style={{ fontWeight: 600, color: 'rgba(40,8,14,0.72)' }}>human-AI interaction (HAI)</span>.
                {' '}I’m interested in designing interactions that support communication and collaboration between people and generative AI.
              </p>
              <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.9375rem', color: 'var(--muted)', lineHeight: 1.75, margin: 0 }}>
                On the side, I’ve worked as an iOS developer, contributing to four released products reaching over 10,000 users.
              </p>
            </div>
          </div>
        ) : (
          /* ── Desktop: Photo + Links left | Name + Bio right ── */
          <div style={{ display: 'flex', flexDirection: 'row', gap: '2.5rem', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', flexShrink: 0, width: 170 }}>
              <div className="profile-photo" style={{
                width: '100%', aspectRatio: '4/5',
                WebkitMaskImage: MASK, maskImage: MASK,
              }}>
                <img src={withBase('/img/prof-pic-crop.jpg')} alt="Sumin Lee" />
              </div>
              <ProfileLinks />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h1 style={{
                fontFamily: 'var(--font)', fontWeight: 600,
                fontSize: 'clamp(2.5rem,4vw,3.5rem)',
                lineHeight: 1, color: 'rgba(40,8,14,0.72)', letterSpacing: '-0.04em', margin: 0,
              }}>
                Sumin Lee
              </h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.90625rem', color: 'var(--muted)', lineHeight: 1.75, margin: 0 }}>
                  I am an undergraduate student in Civil, Urban & Environmental Engineering and{' '}
                  <strong style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Information Science & Culture</strong> at{' '}
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>Seoul National University</span>.
                </p>
                <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.90625rem', color: 'var(--muted)', lineHeight: 1.75, margin: 0 }}>
                  My research interests lie in{' '}
                  <span style={{ fontWeight: 600, color: 'rgba(40,8,14,0.72)' }}>human-computer interaction (HCI)</span>
                  {' '}and{' '}
                  <span style={{ fontWeight: 600, color: 'rgba(40,8,14,0.72)' }}>human-AI interaction (HAI)</span>.
                  {' '}I’m interested in designing interactions that support communication and collaboration between people and generative AI.
                </p>
                <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.90625rem', color: 'var(--muted)', lineHeight: 1.75, margin: 0 }}>
                  On the side, I’ve worked as an iOS developer, contributing to four released products reaching over 10,000 users.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── News ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Eyebrow style={{ fontSize: '0.75rem', letterSpacing: '0.04em', textTransform: 'none' }}>News</Eyebrow>
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
