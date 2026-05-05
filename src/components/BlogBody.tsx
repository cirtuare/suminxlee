import type { ReactNode } from 'react';
import type { BlogBlock } from '../types';
import { withBase } from '../utils/withBase';

interface BlogBodyProps {
  blocks?: BlogBlock[];
  mobile: boolean;
  cg: string;
}

function BlogText({ content, mobile }: { content: string; mobile: boolean }) {
  return (
    <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: mobile ? '0.9rem' : '0.96rem', color: 'var(--muted)', lineHeight: 2, margin: 0 }}>
      {content}
    </p>
  );
}

function BlogHeading({ content, mobile }: { content: string; mobile: boolean }) {
  return (
    <h2 style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: mobile ? '1.05rem' : '1.15rem', color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.3, margin: 0 }}>
      {content}
    </h2>
  );
}

function BlogSubheading({ content, mobile }: { content: string; mobile: boolean }) {
  return (
    <h3 style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: mobile ? '0.88rem' : '0.94rem', color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1.35, margin: 0, opacity: 0.8 }}>
      {content}
    </h3>
  );
}

function BlogImage({ src, caption, cg }: { src?: string; caption?: string; cg: string; mobile: boolean; wide?: boolean }) {
  return (
    <figure style={{ margin: 0 }}>
      {src ? (
        <div style={{ borderRadius: '1rem', overflow: 'hidden' }}>
          <img src={withBase(src)} alt={caption ?? ''} style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
      ) : (
        <div style={{
          borderRadius: '1rem', minHeight: 140, position: 'relative',
          background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.4rem',
        }}>
          <div className={cg} style={{ position: 'absolute', inset: 0, opacity: 0.18, borderRadius: '1rem' }} />
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(40,8,14,0.2)" strokeWidth="1.2" style={{ position: 'relative' }}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
          <span style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.5rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(40,8,14,0.2)', position: 'relative' }}>Photo</span>
        </div>
      )}
      {caption && (
        <figcaption style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.76rem', color: 'var(--dim)', lineHeight: 1.6, marginTop: '0.65rem', paddingLeft: '0.1rem' }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function BlogImagePair({ images, mobile, cg }: { images: Array<{ src?: string; caption?: string }>; mobile: boolean; cg: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: '0.85rem', alignItems: 'start' }}>
      {images.map((img, i) => <BlogImage key={i} {...img} cg={cg} mobile={mobile} />)}
    </div>
  );
}

function BlogImageRow({ images, mobile }: { images: Array<{ src: string }>; mobile: boolean }) {
  const count = images.length;
  const visible = Math.min(count, 5);
  const itemWidth = mobile
    ? 'calc((100% - 0.6rem) / 2.4)'
    : `calc((100% - ${visible - 1} * 0.75rem) / ${visible})`;

  return (
    <div className="img-row" style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
      {images.map((img, i) => (
        <div key={i} style={{
          flex: `0 0 ${itemWidth}`,
          aspectRatio: '9/19',
          borderRadius: '1rem',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.55)',
          border: '1px solid rgba(255,255,255,0.7)',
        }}>
          <img src={withBase(img.src)} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
        </div>
      ))}
    </div>
  );
}

function BlogQuote({ content, mobile }: { content: string; mobile: boolean }) {
  return (
    <blockquote style={{ margin: 0, borderLeft: '2px solid var(--pink)', paddingLeft: '1.25rem' }}>
      <p style={{ fontFamily: 'var(--font)', fontWeight: 500, fontStyle: 'italic', fontSize: mobile ? '0.93rem' : '1rem', color: 'var(--text)', lineHeight: 1.75, margin: 0 }}>
        {content}
      </p>
    </blockquote>
  );
}

function BlogYoutube({ id, caption }: { id: string; caption?: string }) {
  return (
    <figure style={{ margin: 0 }}>
      <div style={{ borderRadius: '1rem', overflow: 'hidden', aspectRatio: '16/9', position: 'relative' }}>
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={caption ?? 'Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', display: 'block' }}
        />
      </div>
      {caption && (
        <figcaption style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.76rem', color: 'var(--dim)', lineHeight: 1.6, marginTop: '0.65rem', paddingLeft: '0.1rem' }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function BlogRole({ bullets, mobile }: { bullets: Array<string | { text: string; sub: string[] }>; mobile: boolean }) {
  const fs = mobile ? '0.88rem' : '0.92rem';
  return (
    <div>
      <div style={{ height: 2, background: 'var(--pink)', opacity: 0.3, borderRadius: 1, marginBottom: '1.5rem' }} />
      <div style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--pink)', marginBottom: '1rem' }}>
        My Role
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {bullets.map((b, i) => {
          const text = typeof b === 'string' ? b : b.text;
          const sub  = typeof b === 'string' ? [] : b.sub;
          return (
            <li key={i}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: fs, color: 'var(--pink)', lineHeight: 1.75, flexShrink: 0, opacity: 0.6 }}>—</span>
                <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: fs, color: 'var(--muted)', lineHeight: 1.75, margin: 0 }}>{text}</p>
              </div>
              {sub.length > 0 && (
                <ul style={{ listStyle: 'none', padding: 0, margin: '0.4rem 0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {sub.map((s, j) => (
                    <li key={j} style={{ display: 'flex', gap: '0.55rem', alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '1rem', color: 'var(--pink)', lineHeight: 1.45, flexShrink: 0, opacity: 0.35 }}>•</span>
                      <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: mobile ? '0.8rem' : '0.84rem', color: 'var(--muted)', lineHeight: 1.75, margin: 0, opacity: 0.85 }}>{s}</p>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function BlogBody({ blocks, mobile, cg }: BlogBodyProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {blocks.map((b, i) => {
        const prevType = i === 0 ? null : blocks[i - 1].type;
        const mt = i === 0 ? '0' : (prevType === 'subheading' || prevType === 'heading') ? '0.25rem' : '2.25rem';
        let node: ReactNode;
        switch (b.type) {
          case 'text':       node = <BlogText content={b.content} mobile={mobile} />; break;
          case 'heading':    node = <BlogHeading content={b.content} mobile={mobile} />; break;
          case 'subheading': node = <BlogSubheading content={b.content} mobile={mobile} />; break;
          case 'image':      node = <BlogImage src={b.src} caption={b.caption} wide={b.wide} cg={cg} mobile={mobile} />; break;
          case 'image-pair': node = <BlogImagePair images={b.images} mobile={mobile} cg={cg} />; break;
          case 'image-row':  node = <BlogImageRow images={b.images} mobile={mobile} />; break;
          case 'quote':      node = <BlogQuote content={b.content} mobile={mobile} />; break;
          case 'youtube':    node = <BlogYoutube id={b.id} caption={b.caption} />; break;
          case 'role':       node = <BlogRole bullets={b.bullets} mobile={mobile} />; break;
        }
        return <div key={i} style={{ marginTop: mt }}>{node}</div>;
      })}
    </div>
  );
}
