import type { CSSProperties } from 'react';

interface Props {
  children: React.ReactNode;
  style?: CSSProperties;
}

export default function Eyebrow({ children, style = {} }: Props) {
  return (
    <div style={{
      fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.58rem',
      letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--dim)',
      ...style,
    }}>
      {children}
    </div>
  );
}
