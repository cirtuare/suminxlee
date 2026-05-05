const BASE_URL = import.meta.env.BASE_URL ?? '/';

const EXTERNAL_URL = /^(?:[a-z]+:)?\/\//i;

export function withBase(path: string): string {
  if (!path) return path;

  if (
    EXTERNAL_URL.test(path) ||
    path.startsWith('data:') ||
    path.startsWith('blob:') ||
    path.startsWith('mailto:') ||
    path.startsWith('#')
  ) {
    return path;
  }

  const normalizedBase = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
  const relativePath = path.startsWith('/') ? path.slice(1) : path;

  if (relativePath.startsWith(normalizedBase)) {
    return relativePath;
  }

  return `${normalizedBase}${relativePath}`;
}
