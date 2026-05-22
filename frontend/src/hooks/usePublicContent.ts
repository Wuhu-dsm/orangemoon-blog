import { useQuery } from '@tanstack/react-query'
import {
  fetchPublicArticles,
  fetchPublicProjects,
  type PublicArticle,
  type PublicProject,
} from '@/api/publicContent'

export const publicContentKeys = {
  projects: {
    all: ['public', 'projects'] as const,
    list: (params?: Record<string, unknown>) =>
      [...publicContentKeys.projects.all, 'list', params] as const,
  },
  articles: {
    all: ['public', 'articles'] as const,
    list: (params?: Record<string, unknown>) =>
      [...publicContentKeys.articles.all, 'list', params] as const,
  },
}

export function usePublicProjects(params?: {
  page?: number
  pageSize?: number
  projectStatus?: string
}) {
  return useQuery({
    queryKey: publicContentKeys.projects.list(params ?? {}),
    queryFn: () => fetchPublicProjects(params),
    staleTime: 5 * 60 * 1000, // 5 min — public data changes infrequently
  })
}

export function usePublicArticles(params?: {
  page?: number
  pageSize?: number
  tag?: string
  category?: string
  search?: string
}) {
  return useQuery({
    queryKey: publicContentKeys.articles.list(params ?? {}),
    queryFn: () => fetchPublicArticles(params),
    staleTime: 5 * 60 * 1000, // 5 min — public data changes infrequently
  })
}

export type { PublicArticle, PublicProject }
