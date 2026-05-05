import type { Publication, PubType } from '../types';

export const PUBS: Publication[] = [
  {
    id: 'p3', type: 'Preprint', year: '2026',
    title: "I'm Fine, But My Voice Isn't: Cross-Modal Affective Dissonance Detection for Reflective Journaling",
    authors: 'Sumin Lee†',
    venue: 'Under review',
    note: 'First author',
    href: 'https://arxiv.org/abs/2604.27517',
  },
  {
    id: 'c2', type: 'Conference', year: '2026',
    title: '3D Tactile Display for Non-visual Color Perception',
    authors: 'Sumin Lee*, Yehyeon Park*',
    venue: 'Proceedings of HCI Korea 2026',
    note: 'First author · Equal contribution',
    href: 'https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE12746013',
  },
  {
    id: 'p2', type: 'Preprint', year: '2025',
    title: 'NEMESIS: Noise-suppressed Efficient MAE with Enhanced Superpatch Integration Strategy',
    authors: 'Kyeonghun Kim, Hyeonseok Jung, Youngung Han, Hyunsu Go, Eunseob Choi, Seongbin Park, Junsu Lim, Jiwon Yang, Sumin Lee, Insung Hwang, Ken Ying-Kai Liao, Nam-Joon Kim†',
    venue: 'Under review',
    note: 'Co-author',
    href: 'https://arxiv.org/abs/2604.01612',
  },
  {
    id: 'p1', type: 'Preprint', year: '2025',
    title: 'MATHENA: Mamba-based Architectural Tooth Hierarchical Estimator and Holistic Evaluation Network for Anatomy',
    authors: 'Kyeonghun Kim, Jaehyung Park, Youngung Han, ..., Sumin Lee, ..., Nam-Joon Kim†',
    venue: 'Under review',
    note: 'Co-author',
    href: 'https://arxiv.org/abs/2604.00537',
  },
  {
    id: 'c1', type: 'Conference', year: '2024',
    title: 'Memory and Spatial Patterns in Long-Term Time Series of River Discharge and Water Quality Parameters Using Fractal Theory',
    authors: 'Eunpyo Lee, Jungsoo Woo, Sumin Lee, Soyun Ihn, Soohyun Yang†',
    venue: 'KSCE 2024 Convention',
    note: 'Co-author',
    href: 'https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE12088233',
  },
];

export const PUB_TYPE_STYLE: Record<PubType, { text: string }> = {
  Conference: { text: 'var(--pink)' },
  Preprint:   { text: 'var(--peach)' },
};
