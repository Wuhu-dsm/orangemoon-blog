import { apiClient, type ApiEnvelope } from './client'

/** Public project fields exposed by GET /api/v1/projects */
export interface PublicProject {
  _id: string
  title: string
  slug: string
  summary?: string
  coverImage?: string
  techStack: string[]
  projectStatus?: string
  repositoryUrl?: string
  demoUrl?: string
  createdAt: string
  updatedAt: string
}

export interface PublicListResponse<T> {
  items: T[]
  total: number
}

export async function fetchPublicProjects(params?: {
  page?: number
  pageSize?: number
  projectStatus?: string
}): Promise<PublicListResponse<PublicProject>> {
  const response = await apiClient.get<
    unknown,
    ApiEnvelope<PublicListResponse<PublicProject>>
  >('/projects', { params })
  return response.data
}

/** Public article fields exposed by GET /api/v1/articles */
export interface PublicArticle {
  _id: string
  title: string
  slug: string
  summary?: string
  coverImage?: string
  tags: string[]
  category?: string
  body?: { blocks: unknown }
  publishedAt?: string
  createdAt: string
  updatedAt: string
  viewCount?: number
  readCount?: number
  views?: number
}

export async function fetchPublicArticles(params?: {
  page?: number
  pageSize?: number
  tag?: string
  category?: string
  search?: string
}): Promise<PublicListResponse<PublicArticle>> {
  const response = await apiClient.get<
    unknown,
    ApiEnvelope<PublicListResponse<PublicArticle>>
  >('/articles', { params })
  return response.data
}
