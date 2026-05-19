import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  label: string
  path: string
  icon: LucideIcon
}

export type DockAction = {
  label: string
  icon: LucideIcon
}

export type ArticleTone = 'studio' | 'ocean' | 'room'

export type ArticlePreview = {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  views: string
  tone: ArticleTone
}

export type ProjectTone = 'library' | 'system' | 'anime'

export type ProjectPreview = {
  id: string
  title: string
  description: string
  status: '进行中' | '已完成'
  tone: ProjectTone
}

export type StatItem = {
  label: string
  value: string
}

export type ReadingMetric = {
  label: string
  value: string
  delta: string
}

export type TagTone = 'mint' | 'blue' | 'cyan' | 'yellow'

export type TagSummary = {
  name: string
  count: number
  tone: TagTone
}

export type TimelineItem = {
  month: string
  content: string
}
