import { apiClient, type ApiEnvelope } from './client'
import type { BlockContent, ContentStatus } from '../types/content'

export type NoteType = 'short' | 'code' | 'quote' | 'todo'
export type ProjectStatus = 'pending' | 'developing' | 'updating' | 'archived'
export type ContentBodyDto = { blocks: BlockContent }

export interface Article {
  _id: string
  title: string
  slug: string
  summary?: string
  coverImage?: string
  tags: string[]
  category?: string
  body?: ContentBodyDto
  status: ContentStatus
  publishedAt?: string
  deletedAt?: string
  deletedBy?: string
  createdAt: string
  updatedAt: string
}

export interface Note {
  _id: string
  title: string
  slug: string
  summary?: string
  coverImage?: string
  tags: string[]
  noteType: NoteType
  body?: ContentBodyDto
  status: ContentStatus
  publishedAt?: string
  deletedAt?: string
  deletedBy?: string
  createdAt: string
  updatedAt: string
}

export interface Project {
  _id: string
  title: string
  slug: string
  summary?: string
  coverImage?: string
  screenshots: string[]
  tags: string[]
  techStack: string[]
  projectStatus?: ProjectStatus
  repositoryUrl?: string
  demoUrl?: string
  body?: ContentBodyDto
  status: ContentStatus
  publishedAt?: string
  deletedAt?: string
  deletedBy?: string
  createdAt: string
  updatedAt: string
}

export interface ContentListResponse<T> {
  items: T[]
  total: number
}

export interface ContentQueryParams {
  page?: number
  pageSize?: number
  status?: ContentStatus
  search?: string
  tag?: string
  category?: string
  noteType?: NoteType
  projectStatus?: ProjectStatus
}

export interface CreateArticleDto {
  title: string
  slug?: string
  summary?: string
  coverImage?: string
  tags?: string[]
  category?: string
  body?: ContentBodyDto
  status?: ContentStatus
}

export interface CreateNoteDto {
  title: string
  slug?: string
  summary?: string
  coverImage?: string
  tags?: string[]
  noteType: NoteType
  body?: ContentBodyDto
  status?: ContentStatus
}

export interface CreateProjectDto {
  title: string
  slug?: string
  summary?: string
  coverImage?: string
  screenshots?: string[]
  tags?: string[]
  techStack?: string[]
  projectStatus?: ProjectStatus
  repositoryUrl?: string
  demoUrl?: string
  body?: ContentBodyDto
  status?: ContentStatus
}

export type UpdateArticleDto = Partial<CreateArticleDto>
export type UpdateNoteDto = Partial<CreateNoteDto>
export type UpdateProjectDto = Partial<CreateProjectDto>

// ─── Articles ───

export async function findAllArticles(params?: ContentQueryParams) {
  const response = await apiClient.get<
    unknown,
    ApiEnvelope<ContentListResponse<Article>>
  >('/admin/articles', { params })
  return response.data
}

export async function findArticleById(id: string) {
  const response = await apiClient.get<unknown, ApiEnvelope<Article>>(
    `/admin/articles/${id}`,
  )
  return response.data
}

export async function createArticle(dto: CreateArticleDto) {
  const response = await apiClient.post<unknown, ApiEnvelope<Article>>(
    '/admin/articles',
    dto,
  )
  return response.data
}

export async function updateArticle(id: string, dto: UpdateArticleDto) {
  const response = await apiClient.patch<unknown, ApiEnvelope<Article>>(
    `/admin/articles/${id}`,
    dto,
  )
  return response.data
}

export async function publishArticle(id: string) {
  const response = await apiClient.patch<unknown, ApiEnvelope<Article>>(
    `/admin/articles/${id}/publish`,
  )
  return response.data
}

export async function unpublishArticle(id: string) {
  const response = await apiClient.patch<unknown, ApiEnvelope<Article>>(
    `/admin/articles/${id}/unpublish`,
  )
  return response.data
}

export async function archiveArticle(id: string) {
  const response = await apiClient.patch<unknown, ApiEnvelope<Article>>(
    `/admin/articles/${id}/archive`,
  )
  return response.data
}

export async function softDeleteArticle(id: string) {
  const response = await apiClient.delete<unknown, ApiEnvelope<Article>>(
    `/admin/articles/${id}`,
  )
  return response.data
}

// ─── Notes ───

export async function findAllNotes(params?: ContentQueryParams) {
  const response = await apiClient.get<
    unknown,
    ApiEnvelope<ContentListResponse<Note>>
  >('/admin/notes', { params })
  return response.data
}

export async function findNoteById(id: string) {
  const response = await apiClient.get<unknown, ApiEnvelope<Note>>(
    `/admin/notes/${id}`,
  )
  return response.data
}

export async function createNote(dto: CreateNoteDto) {
  const response = await apiClient.post<unknown, ApiEnvelope<Note>>(
    '/admin/notes',
    dto,
  )
  return response.data
}

export async function updateNote(id: string, dto: UpdateNoteDto) {
  const response = await apiClient.patch<unknown, ApiEnvelope<Note>>(
    `/admin/notes/${id}`,
    dto,
  )
  return response.data
}

export async function publishNote(id: string) {
  const response = await apiClient.patch<unknown, ApiEnvelope<Note>>(
    `/admin/notes/${id}/publish`,
  )
  return response.data
}

export async function unpublishNote(id: string) {
  const response = await apiClient.patch<unknown, ApiEnvelope<Note>>(
    `/admin/notes/${id}/unpublish`,
  )
  return response.data
}

export async function archiveNote(id: string) {
  const response = await apiClient.patch<unknown, ApiEnvelope<Note>>(
    `/admin/notes/${id}/archive`,
  )
  return response.data
}

export async function softDeleteNote(id: string) {
  const response = await apiClient.delete<unknown, ApiEnvelope<Note>>(
    `/admin/notes/${id}`,
  )
  return response.data
}

// ─── Projects ───

export async function findAllProjects(params?: ContentQueryParams) {
  const response = await apiClient.get<
    unknown,
    ApiEnvelope<ContentListResponse<Project>>
  >('/admin/projects', { params })
  return response.data
}

export async function findProjectById(id: string) {
  const response = await apiClient.get<unknown, ApiEnvelope<Project>>(
    `/admin/projects/${id}`,
  )
  return response.data
}

export async function createProject(dto: CreateProjectDto) {
  const response = await apiClient.post<unknown, ApiEnvelope<Project>>(
    '/admin/projects',
    dto,
  )
  return response.data
}

export async function updateProject(id: string, dto: UpdateProjectDto) {
  const response = await apiClient.patch<unknown, ApiEnvelope<Project>>(
    `/admin/projects/${id}`,
    dto,
  )
  return response.data
}

export async function publishProject(id: string) {
  const response = await apiClient.patch<unknown, ApiEnvelope<Project>>(
    `/admin/projects/${id}/publish`,
  )
  return response.data
}

export async function unpublishProject(id: string) {
  const response = await apiClient.patch<unknown, ApiEnvelope<Project>>(
    `/admin/projects/${id}`,
    { status: 'draft' },
  )
  return response.data
}

export async function archiveProject(id: string) {
  const response = await apiClient.patch<unknown, ApiEnvelope<Project>>(
    `/admin/projects/${id}/archive`,
  )
  return response.data
}

export async function softDeleteProject(id: string) {
  const response = await apiClient.delete<unknown, ApiEnvelope<Project>>(
    `/admin/projects/${id}`,
  )
  return response.data
}
