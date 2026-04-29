import type { BlogBlock } from '../types';

interface BlogBodyProps {
  blocks?: BlogBlock[];
  mobile: boolean;
  cg: string;
}

interface BlogImageProps {
  src?: string;
  caption?: string;
  wide?: boolean;
  cg: string;
  mobile: boolean;
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

function BlogImage({ src, caption, cg, mobile: _mobile, wide }: BlogImageProps) {
  return (
    <figure style={{ margin: 0 }}>
      <div style={{ borderRadius: '1rem', overflow: 'hidden', aspectRatio: wide ? '16/7' : '3/2', position: 'relative', background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.7)' }}>
        {src ? (
          <img src={src} alt={caption ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <>
            <div className={cg} style={{ position: 'absolute', inset: 0, opacity: 0.25 }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(40,8,14,0.2)" strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
              <span style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.5rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(40,8,14,0.2)' }}>Photo</span>
            </div>
          </>
        )}
      </div>
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
    <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: '0.85rem' }}>
      {images.map((img, i) => <BlogImage key={i} {...img} cg={cg} mobile={mobile} />)}
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

export default function BlogBody({ blocks, mobile, cg }: BlogBodyProps) {
  if (!blocks || blocks.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'text':       return <BlogText key={i} content={b.content} mobile={mobile} />;
          case 'heading':    return <BlogHeading key={i} content={b.content} mobile={mobile} />;
          case 'image':      return <BlogImage key={i} src={b.src} caption={b.caption} wide={b.wide} cg={cg} mobile={mobile} />;
          case 'image-pair': return <BlogImagePair key={i} images={b.images} mobile={mobile} cg={cg} />;
          case 'quote':      return <BlogQuote key={i} content={b.content} mobile={mobile} />;
        }
      })}
    </div>
  );
}
