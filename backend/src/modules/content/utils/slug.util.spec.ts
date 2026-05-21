import { createSlugBase } from './slug.util';

describe('createSlugBase', () => {
  it('converts English title to lowercase slug with hyphens', () => {
    expect(createSlugBase('Hello World')).toBe('hello-world');
  });

  it('preserves CJK characters', () => {
    expect(createSlugBase('你好世界')).toBe('你好世界');
  });

  it('handles mixed punctuation correctly', () => {
    expect(createSlugBase('Hello, World! (Test)')).toBe('hello-world-test');
  });

  it('collapses repeated whitespace into single hyphens', () => {
    expect(createSlugBase('Hello    World')).toBe('hello-world');
  });

  it('falls back to untitled for empty title', () => {
    expect(createSlugBase('')).toBe('untitled');
  });

  it('falls back to untitled for whitespace-only title', () => {
    expect(createSlugBase('   ')).toBe('untitled');
  });

  it('handles mixed English and CJK', () => {
    expect(createSlugBase('Hello 世界 World')).toBe('hello-世界-world');
  });

  it('trims leading and trailing hyphens', () => {
    expect(createSlugBase('  Hello World  ')).toBe('hello-world');
  });

  it('removes unsafe punctuation while keeping hyphens and word chars', () => {
    expect(createSlugBase('a@b#c$d%e&f*g')).toBe('abcdefg');
  });
});
