export type Tab = 'about' | 'publications' | 'projects' | 'cv';
export type PubType = 'Conference' | 'Preprint';
export type TagName = 'hci' | 'civil engineering' | 'design' | 'iOS' | 'medical' | 'ml';

export interface Publication {
  id: string;
  type: PubType;
  year: string;
  title: string;
  authors: string;
  venue: string;
  note: string;
}

export type BlogBlock =
  | { type: 'text'; content: string }
  | { type: 'heading'; content: string }
  | { type: 'image'; src?: string; caption?: string; wide?: boolean }
  | { type: 'image-pair'; images: Array<{ src?: string; caption?: string }> }
  | { type: 'quote'; content: string };

export interface Project {
  title: string;
  subtitle: string;
  period: string;
  role: string;
  venue: string;
  tags: TagName[];
  cg: string;
  bullets: string[];
  body?: BlogBlock[];
}
