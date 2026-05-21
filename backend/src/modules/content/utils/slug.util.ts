export function createSlugBase(title: string): string {
  if (!title || title.trim().length === 0) {
    return 'untitled';
  }

  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u3400-\u4dbf\u{20000}-\u{2a6df}\u{2a700}-\u{2b73f}\u{2b740}-\u{2b81f}\u{2b820}-\u{2ceaf}\u{f900}-\u{faff}\u{2f800}-\u{2fa1f}-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
