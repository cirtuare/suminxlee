export type Tab = 'about' | 'publications' | 'projects' | 'cv';
export type PubType = 'Conference' | 'Preprint';
export type TagName = 'HCI' | 'Civil Eng' | 'Design' | 'iOS' | 'Medical' | 'ML' | 'Dev';

export interface Publication {
  id: string;
  type: PubType;
  year: string;
  title: string;
  authors: string;
  venue: string;
  note: string;
  href?: string;
}

export type BlogBlock =
  | { type: 'text'; content: string }
  | { type: 'heading'; content: string }
  | { type: 'subheading'; content: string }
  | { type: 'image'; src?: string; caption?: string; wide?: boolean }
  | { type: 'image-pair'; images: Array<{ src?: string; caption?: string }> }
  | { type: 'image-row'; images: Array<{ src: string }> }
  | { type: 'quote'; content: string }
  | { type: 'youtube'; id: string; caption?: string }
  | { type: 'role'; bullets: Array<string | { text: string; sub: string[] }> };

export interface Project {
  title: string;
  subtitle: string;
  period: string;
  role: string;
  venue: string;
  tags: TagName[];
  cg: string;
  thumbnail?: string;
  thumbnailPosition?: string;
  pinned?: boolean;
  links?: { label: string; href: string }[];
  bullets: string[];
  body?: BlogBlock[];
}
