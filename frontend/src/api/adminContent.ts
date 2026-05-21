import { apiClient, type ApiEnvelope } from './client'
import type { BlockContent, ContentStatus } from '../types/content'

// ─── Enums ───

export type NoteType = 'short' | 'code' | 'quote' | 'todo'

export type ProjectStatus = 'planning' | 'in-progress' | 'completed' | 'maintenance'

// ─── Shared fields ───

interface ContentBase {
  _id: string
  title: string
  slug: string
  summary?: string
  coverImage?: string
  tags: string[]
  body?: BlockContent
  status: ContentStatus
  publishedAt?: string
  updatedAt: string
  createdAt: string
  deletedAt?: string
  deletedBy?: string
}

// ─── Entity types ───

export interface Article extends ContentBase {
  category?: string
}

export interface Note extends ContentBase {
  noteType: NoteType
}

export interface Project extends ContentBase {
  screenshots: string[]
  techStack: string[]
  projectStatus?: ProjectStatus
  repositoryUrl?: string
  demoUrl?: string
}

export type AdminContentItem = Article | Note | Project

// ─── List response ───

export interface ListResponse<T> {
  items: T[]
  total: number
}

// ─── Query params ───

export interface ContentListParams {
  page?: number
  pageSize?: number
  status?: ContentStatus
  search?: string
  tag?: string
}

export interface ArticleListParams extends ContentListParams {
  category?: string
}

export interface NoteListParams extends ContentListParams {
  noteType?: NoteType
}

export interface ProjectListParams extends ContentListParams {
  projectStatus?: ProjectStatus
}

// ─── Create / Update payloads ───

export interface CreateArticlePayload {
  title: string
  slug?: string
  summary?: string
  coverImage?: string
  tags?: string[]
  category?: string
  body?: BlockContent
  status?: ContentStatus
}

export interface UpdateArticlePayload {
  title?: string
  slug?: string
  summary?: string
  coverImage?: string
  tags?: string[]
  category?: string
  body?: BlockContent
  status?: ContentStatus
}

export interface CreateNotePayload {
  title: string
  slug?: string
  summary?: string
  coverImage?: string
  tags?: string[]
  noteType: NoteType
  body?: BlockContent
  status?: ContentStatus
}

export interface UpdateNotePayload {
  title?: string
  slug?: string
  summary?: string
  coverImage?: string
  tags?: string[]
  noteType?: NoteType
  body?: BlockContent
  status?: ContentStatus
}

export interface CreateProjectPayload {
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
  body?: BlockContent
  status?: ContentStatus
}

export interface UpdateProjectPayload {
  title?: string
  slug?: string
  summary?: string
  coverImage?: string
  screenshots?: string[]
  tags?: string[]
  techStack?: string[]
  projectStatus?: ProjectStatus
  repositoryUrl?: string
  demoUrl?: string
  body?: BlockContent
  status?: ContentStatus
}

// ─── Articles ───

export async function listArticles(params?: ArticleListParams) {
  const response = await apiClient.get<unknown, ApiEnvelope<ListResponse<Article>>>(
    '/admin/articles',
    { params },
  )
  return response.data
}

export async function getArticle(id: string) {
  const response = await apiClient.get<unknown, ApiEnvelope<Article>>(
    `/admin/articles/${id}`,
  )
  return response.data
}

export async function createArticle(payload: CreateArticlePayload) {
  const response = await apiClient.post<unknown, ApiEnvelope<Article>>(
    '/admin/articles',
    payload,
  )
  return response.data
}

export async function updateArticle(id: string, payload: UpdateArticlePayload) {
  const response = await apiClient.patch<unknown, ApiEnvelope<Article>>(
    `/admin/articles/${id}`,
    payload,
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

export async function deleteArticle(id: string) {
  const response = await apiClient.delete<unknown, ApiEnvelope<Article>>(
    `/admin/articles/${id}`,
  )
  return response.data
}

// ─── Notes ───

export async function listNotes(params?: NoteListParams) {
  const response = await apiClient.get<unknown, ApiEnvelope<ListResponse<Note>>>(
    '/admin/notes',
    { params },
  )
  return response.data
}

export async function getNote(id: string) {
  const response = await apiClient.get<unknown, ApiEnvelope<Note>>(
    `/admin/notes/${id}`,
  )
  return response.data
}

export async function createNote(payload: CreateNotePayload) {
  const response = await apiClient.post<unknown, ApiEnvelope<Note>>(
    '/admin/notes',
    payload,
  )
  return response.data
}

export async function updateNote(id: string, payload: UpdateNotePayload) {
  const response = await apiClient.patch<unknown, ApiEnvelope<Note>>(
    `/admin/notes/${id}`,
    payload,
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

export async function deleteNote(id: string) {
  const response = await apiClient.delete<unknown, ApiEnvelope<Note>>(
    `/admin/notes/${id}`,
  )
  return response.data
}

// ─── Projects ───

export async function listProjects(params?: ProjectListParams) {
  const response = await apiClient.get<unknown, ApiEnvelope<ListResponse<Project>>>(
    '/admin/projects',
    { params },
  )
  return response.data
}

export async function getProject(id: string) {
  const response = await apiClient.get<unknown, ApiEnvelope<Project>>(
    `/admin/projects/${id}`,
  )
  return response.data
}

export async function createProject(payload: CreateProjectPayload) {
  const response = await apiClient.post<unknown, ApiEnvelope<Project>>(
    '/admin/projects',
    payload,
  )
  return response.data
}

export async function updateProject(id: string, payload: UpdateProjectPayload) {
  const response = await apiClient.patch<unknown, ApiEnvelope<Project>>(
    `/admin/projects/${id}`,
    payload,
  )
  return response.data
}

export async function publishProject(id: string) {
  const response = await apiClient.patch<unknown, ApiEnvelope<Project>>(
    `/admin/projects/${id}/publish`,
  )
  return response.data
}

export async function archiveProject(id: string) {
  const response = await apiClient.patch<unknown, ApiEnvelope<Project>>(
    `/admin/projects/${id}/archive`,
  )
  return response.data
}

export async function deleteProject(id: string) {
  const response = await apiClient.delete<unknown, ApiEnvelope<Project>>(
    `/admin/projects/${id}`,
  )
  return response.data
}
