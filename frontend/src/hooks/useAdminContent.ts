import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  archiveArticle,
  archiveNote,
  archiveProject,
  createArticle,
  createNote,
  createProject,
  findAllArticles,
  findAllNotes,
  findAllProjects,
  findArticleById,
  findNoteById,
  findProjectById,
  publishArticle,
  publishNote,
  publishProject,
  softDeleteArticle,
  softDeleteNote,
  softDeleteProject,
  unpublishArticle,
  unpublishNote,
  unpublishProject,
  updateArticle,
  updateNote,
  updateProject,
  type Article,
  type ContentQueryParams,
  type CreateArticleDto,
  type CreateNoteDto,
  type CreateProjectDto,
  type Note,
  type Project,
  type UpdateArticleDto,
  type UpdateNoteDto,
  type UpdateProjectDto,
} from '../api/adminContent'

type UpdateVariables<T> = {
  id: string
  dto: T
}

export const adminContentKeys = {
  articles: {
    all: ['admin', 'articles'] as const,
    list: (params?: ContentQueryParams) =>
      [...adminContentKeys.articles.all, 'list', params] as const,
    detail: (id: string) =>
      [...adminContentKeys.articles.all, 'detail', id] as const,
  },
  notes: {
    all: ['admin', 'notes'] as const,
    list: (params?: ContentQueryParams) =>
      [...adminContentKeys.notes.all, 'list', params] as const,
    detail: (id: string) =>
      [...adminContentKeys.notes.all, 'detail', id] as const,
  },
  projects: {
    all: ['admin', 'projects'] as const,
    list: (params?: ContentQueryParams) =>
      [...adminContentKeys.projects.all, 'list', params] as const,
    detail: (id: string) =>
      [...adminContentKeys.projects.all, 'detail', id] as const,
  },
}

function invalidateArticleQueries(queryClient: ReturnType<typeof useQueryClient>, id?: string) {
  queryClient.invalidateQueries({ queryKey: adminContentKeys.articles.all })
  if (id) {
    queryClient.invalidateQueries({ queryKey: adminContentKeys.articles.detail(id) })
  }
}

function invalidateNoteQueries(queryClient: ReturnType<typeof useQueryClient>, id?: string) {
  queryClient.invalidateQueries({ queryKey: adminContentKeys.notes.all })
  if (id) {
    queryClient.invalidateQueries({ queryKey: adminContentKeys.notes.detail(id) })
  }
}

function invalidateProjectQueries(queryClient: ReturnType<typeof useQueryClient>, id?: string) {
  queryClient.invalidateQueries({ queryKey: adminContentKeys.projects.all })
  if (id) {
    queryClient.invalidateQueries({ queryKey: adminContentKeys.projects.detail(id) })
  }
}

export function useAdminArticles(params?: ContentQueryParams) {
  return useQuery({
    queryKey: adminContentKeys.articles.list(params),
    queryFn: () => findAllArticles(params),
  })
}

export function useAdminArticle(id?: string): UseQueryResult<Article, Error> {
  return useQuery({
    queryKey: adminContentKeys.articles.detail(id ?? ''),
    queryFn: () => findArticleById(id ?? ''),
    enabled: Boolean(id),
  })
}

export function useCreateAdminArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateArticleDto) => createArticle(dto),
    onSuccess: (article) => {
      invalidateArticleQueries(queryClient, article._id)
      toast.success('文章创建成功')
    },
    onError: () => toast.error('文章创建失败'),
  })
}

export function useUpdateAdminArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: UpdateVariables<UpdateArticleDto>) =>
      updateArticle(id, dto),
    onSuccess: (_, { id }) => {
      invalidateArticleQueries(queryClient, id)
      toast.success('文章更新成功')
    },
    onError: () => toast.error('文章更新失败'),
  })
}

export function usePublishAdminArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: publishArticle,
    onSuccess: (article) => {
      invalidateArticleQueries(queryClient, article._id)
      toast.success('文章已发布')
    },
    onError: () => toast.error('文章发布失败'),
  })
}

export function useUnpublishAdminArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: unpublishArticle,
    onSuccess: (article) => {
      invalidateArticleQueries(queryClient, article._id)
      toast.success('文章已取消发布')
    },
    onError: () => toast.error('文章取消发布失败'),
  })
}

export function useArchiveAdminArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: archiveArticle,
    onSuccess: (article) => {
      invalidateArticleQueries(queryClient, article._id)
      toast.success('文章已归档')
    },
    onError: () => toast.error('文章归档失败'),
  })
}

export function useSoftDeleteAdminArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: softDeleteArticle,
    onSuccess: (article) => {
      invalidateArticleQueries(queryClient, article._id)
      toast.success('文章已删除')
    },
    onError: () => toast.error('文章删除失败'),
  })
}

export function useAdminNotes(params?: ContentQueryParams) {
  return useQuery({
    queryKey: adminContentKeys.notes.list(params),
    queryFn: () => findAllNotes(params),
  })
}

export function useAdminNote(id?: string): UseQueryResult<Note, Error> {
  return useQuery({
    queryKey: adminContentKeys.notes.detail(id ?? ''),
    queryFn: () => findNoteById(id ?? ''),
    enabled: Boolean(id),
  })
}

export function useCreateAdminNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateNoteDto) => createNote(dto),
    onSuccess: (note) => {
      invalidateNoteQueries(queryClient, note._id)
      toast.success('笔记创建成功')
    },
    onError: () => toast.error('笔记创建失败'),
  })
}

export function useUpdateAdminNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: UpdateVariables<UpdateNoteDto>) =>
      updateNote(id, dto),
    onSuccess: (_, { id }) => {
      invalidateNoteQueries(queryClient, id)
      toast.success('笔记更新成功')
    },
    onError: () => toast.error('笔记更新失败'),
  })
}

export function usePublishAdminNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: publishNote,
    onSuccess: (note) => {
      invalidateNoteQueries(queryClient, note._id)
      toast.success('笔记已发布')
    },
    onError: () => toast.error('笔记发布失败'),
  })
}

export function useUnpublishAdminNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: unpublishNote,
    onSuccess: (note) => {
      invalidateNoteQueries(queryClient, note._id)
      toast.success('笔记已取消发布')
    },
    onError: () => toast.error('笔记取消发布失败'),
  })
}

export function useArchiveAdminNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: archiveNote,
    onSuccess: (note) => {
      invalidateNoteQueries(queryClient, note._id)
      toast.success('笔记已归档')
    },
    onError: () => toast.error('笔记归档失败'),
  })
}

export function useSoftDeleteAdminNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: softDeleteNote,
    onSuccess: (note) => {
      invalidateNoteQueries(queryClient, note._id)
      toast.success('笔记已删除')
    },
    onError: () => toast.error('笔记删除失败'),
  })
}

export function useAdminProjects(params?: ContentQueryParams) {
  return useQuery({
    queryKey: adminContentKeys.projects.list(params),
    queryFn: () => findAllProjects(params),
  })
}

export function useAdminProject(id?: string): UseQueryResult<Project, Error> {
  return useQuery({
    queryKey: adminContentKeys.projects.detail(id ?? ''),
    queryFn: () => findProjectById(id ?? ''),
    enabled: Boolean(id),
  })
}

export function useCreateAdminProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateProjectDto) => createProject(dto),
    onSuccess: (project) => {
      invalidateProjectQueries(queryClient, project._id)
      toast.success('项目创建成功')
    },
    onError: () => toast.error('项目创建失败'),
  })
}

export function useUpdateAdminProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: UpdateVariables<UpdateProjectDto>) =>
      updateProject(id, dto),
    onSuccess: (_, { id }) => {
      invalidateProjectQueries(queryClient, id)
      toast.success('项目更新成功')
    },
    onError: () => toast.error('项目更新失败'),
  })
}

export function usePublishAdminProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: publishProject,
    onSuccess: (project) => {
      invalidateProjectQueries(queryClient, project._id)
      toast.success('项目已发布')
    },
    onError: () => toast.error('项目发布失败'),
  })
}

export function useUnpublishAdminProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: unpublishProject,
    onSuccess: (project) => {
      invalidateProjectQueries(queryClient, project._id)
      toast.success('项目已取消发布')
    },
    onError: () => toast.error('项目取消发布失败'),
  })
}

export function useArchiveAdminProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: archiveProject,
    onSuccess: (project) => {
      invalidateProjectQueries(queryClient, project._id)
      toast.success('项目已归档')
    },
    onError: () => toast.error('项目归档失败'),
  })
}

export function useSoftDeleteAdminProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: softDeleteProject,
    onSuccess: (project) => {
      invalidateProjectQueries(queryClient, project._id)
      toast.success('项目已删除')
    },
    onError: () => toast.error('项目删除失败'),
  })
}
