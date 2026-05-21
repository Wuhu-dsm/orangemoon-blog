/**
 * Project-owned content types.
 * No vendor-specific editor imports here — editor adapters bridge to BlockNote.
 */

export type ContentKind = 'article' | 'note' | 'project'

export type ContentStatus = 'draft' | 'published' | 'archived'

/**
 * Canonical block JSON produced by the editor.
 * Vendor-agnostic: adapters convert between this and editor-native types.
 */
export type BlockContent = Array<Record<string, unknown>>

export interface ContentSummary {
  id: string
  title: string
  slug: string
  kind: ContentKind
  status: ContentStatus
  summary?: string
  tags?: string[]
  coverUrl?: string
  publishedAt?: string
  updatedAt: string
  createdAt: string
}

export interface ContentListItem {
  id: string
  title: string
  slug: string
  status: ContentStatus
  kind: ContentKind
  tags: string[]
  updatedAt: string
  publishedAt?: string
}
