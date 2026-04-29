import { PUBS, PUB_TYPE_STYLE } from '../data/publications';
import { useFade } from '../hooks/useFade';
import Eyebrow from './Eyebrow';

export default function Publications() {
  const f = useFade();
  return (
    <div className="page-enter page-pad" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div ref={f} className="fi">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '2.5rem' }}>
          <Eyebrow>Publications</Eyebrow>
          <Eyebrow style={{ fontSize: '0.5rem', opacity: 0.65 }}>C: conference · P: preprint · *: equal contribution · †: corresponding</Eyebrow>
        </div>
        {PUBS.map((p, i) => (
          <div key={p.id}>
            <div className="pub-row pub-grid" style={{ display: 'grid', gridTemplateColumns: '52px 1fr 52px', gap: '1.75rem', padding: '1.85rem 0.75rem', alignItems: 'start', marginLeft: '-0.75rem', marginRight: '-0.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.38rem', paddingTop: '0.05rem' }}>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.62rem', color: 'var(--dim)', letterSpacing: '0.08em' }}>{p.id.toUpperCase()}</div>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: PUB_TYPE_STYLE[p.type].text, width: 'fit-content' }}>{p.type}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.45, marginBottom: '0.38rem' }}>{p.title}</div>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '0.45rem' }}>{p.authors}</div>
                <span style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.68rem', color: 'var(--pink)' }}>{p.venue}</span>
              </div>
              <div className="pub-year" style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.66rem', color: 'var(--dim)', textAlign: 'right', paddingTop: '0.05rem' }}>{p.year}</div>
            </div>
            {i < PUBS.length - 1 && <hr className="rule" />}
          </div>
        ))}
      </div>
    </div>
  );
}
