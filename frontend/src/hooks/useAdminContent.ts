import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query'
import type {
  Article,
  Note,
  Project,
  ArticleListParams,
  NoteListParams,
  ProjectListParams,
  UpdateArticlePayload,
  UpdateNotePayload,
  UpdateProjectPayload,
} from '../api/adminContent'
import {
  listArticles,
  getArticle,
  createArticle,
  updateArticle,
  publishArticle,
  unpublishArticle,
  archiveArticle,
  deleteArticle,
  listNotes,
  getNote,
  createNote,
  updateNote,
  publishNote,
  unpublishNote,
  archiveNote,
  deleteNote,
  listProjects,
  getProject,
  createProject,
  updateProject,
  publishProject,
  archiveProject,
  deleteProject,
} from '../api/adminContent'

// ─── Query keys ───

const keys = {
  articles: {
    all: () => ['admin', 'articles'] as const,
    list: (params?: ArticleListParams) =>
      [...keys.articles.all(), 'list', params] as const,
    detail: (id: string) => [...keys.articles.all(), 'detail', id] as const,
  },
  notes: {
    all: () => ['admin', 'notes'] as const,
    list: (params?: NoteListParams) =>
      [...keys.notes.all(), 'list', params] as const,
    detail: (id: string) => [...keys.notes.all(), 'detail', id] as const,
  },
  projects: {
    all: () => ['admin', 'projects'] as const,
    list: (params?: ProjectListParams) =>
      [...keys.projects.all(), 'list', params] as const,
    detail: (id: string) => [...keys.projects.all(), 'detail', id] as const,
  },
}

// ─── Articles ───

export function useArticlesList(params?: ArticleListParams) {
  return useQuery({
    queryKey: keys.articles.list(params),
    queryFn: () => listArticles(params),
  })
}

export function useArticleDetail(id: string): UseQueryResult<Article, Error> {
  return useQuery({
    queryKey: keys.articles.detail(id),
    queryFn: () => getArticle(id),
    enabled: !!id,
  })
}

export function useCreateArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.articles.all() })
    },
  })
}

export function useUpdateArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateArticlePayload }) =>
      updateArticle(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: keys.articles.all() })
      qc.invalidateQueries({ queryKey: keys.articles.detail(id) })
    },
  })
}

export function usePublishArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: publishArticle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.articles.all() })
    },
  })
}

export function useUnpublishArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: unpublishArticle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.articles.all() })
    },
  })
}

export function useArchiveArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: archiveArticle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.articles.all() })
    },
  })
}

export function useDeleteArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.articles.all() })
    },
  })
}

// ─── Notes ───

export function useNotesList(params?: NoteListParams) {
  return useQuery({
    queryKey: keys.notes.list(params),
    queryFn: () => listNotes(params),
  })
}

export function useNoteDetail(id: string): UseQueryResult<Note, Error> {
  return useQuery({
    queryKey: keys.notes.detail(id),
    queryFn: () => getNote(id),
    enabled: !!id,
  })
}

export function useCreateNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.notes.all() })
    },
  })
}

export function useUpdateNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateNotePayload }) =>
      updateNote(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: keys.notes.all() })
      qc.invalidateQueries({ queryKey: keys.notes.detail(id) })
    },
  })
}

export function usePublishNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: publishNote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.notes.all() })
    },
  })
}

export function useUnpublishNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: unpublishNote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.notes.all() })
    },
  })
}

export function useArchiveNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: archiveNote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.notes.all() })
    },
  })
}

export function useDeleteNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.notes.all() })
    },
  })
}

// ─── Projects ───

export function useProjectsList(params?: ProjectListParams) {
  return useQuery({
    queryKey: keys.projects.list(params),
    queryFn: () => listProjects(params),
  })
}

export function useProjectDetail(id: string): UseQueryResult<Project, Error> {
  return useQuery({
    queryKey: keys.projects.detail(id),
    queryFn: () => getProject(id),
    enabled: !!id,
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.projects.all() })
    },
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProjectPayload }) =>
      updateProject(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: keys.projects.all() })
      qc.invalidateQueries({ queryKey: keys.projects.detail(id) })
    },
  })
}

export function usePublishProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: publishProject,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.projects.all() })
    },
  })
}

export function useArchiveProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: archiveProject,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.projects.all() })
    },
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.projects.all() })
    },
  })
}
