import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ContentBlockPreview } from '@/components/admin/editor/ContentBlockPreview'
import {
  AdminContentEditor,
  type ContentEditorValue,
} from '@/components/admin/content/AdminContentEditor'
import {
  AdminContentTable,
  type AdminContentItem,
} from '@/components/admin/content/AdminContentTable'
import {
  AdminContentToolbar,
  type ContentStatusFilter,
} from '@/components/admin/content/AdminContentToolbar'
import {
  useAdminProject,
  useAdminProjects,
  useArchiveAdminProject,
  useCreateAdminProject,
  usePublishAdminProject,
  useSoftDeleteAdminProject,
  useUnpublishAdminProject,
  useUpdateAdminProject,
} from '@/hooks/useAdminContent'
import type { CreateProjectDto, Project } from '@/api/adminContent'
import type { ContentStatus } from '@/types/content'

export default function AdminProjects() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const isNew = location.pathname.endsWith('/new')
  const isEditor = isNew || Boolean(id)
  const [status, setStatus] = useState<ContentStatusFilter>('all')
  const [search, setSearch] = useState('')
  const [previewItem, setPreviewItem] = useState<Project | null>(null)
  const [actionPendingId, setActionPendingId] = useState<string>()

  const queryParams = useMemo(
    () => ({
      status: status === 'all' ? undefined : status,
      search: search.trim() || undefined,
    }),
    [search, status],
  )

  const projectsQuery = useAdminProjects(queryParams)
  const projectQuery = useAdminProject(id)
  const createProject = useCreateAdminProject()
  const updateProject = useUpdateAdminProject()
  const publishProject = usePublishAdminProject()
  const unpublishProject = useUnpublishAdminProject()
  const archiveProject = useArchiveAdminProject()
  const softDeleteProject = useSoftDeleteAdminProject()

  async function handleSaveDraft(value: ContentEditorValue) {
    if (id) {
      await updateProject.mutateAsync({
        id,
        dto: toProjectDto(value, 'draft'),
      })
      return
    }

    const created = await createProject.mutateAsync(toProjectDto(value, 'draft'))
    navigate(`/admin/projects/${created._id}/edit`, { replace: true })
  }

  async function handlePublish(value: ContentEditorValue) {
    if (id) {
      await updateProject.mutateAsync({ id, dto: toProjectDto(value) })
      await publishProject.mutateAsync(id)
      return
    }

    const created = await createProject.mutateAsync(toProjectDto(value, 'draft'))
    await publishProject.mutateAsync(created._id)
    navigate(`/admin/projects/${created._id}/edit`, { replace: true })
  }

  async function runRowAction(
    item: AdminContentItem,
    action: (targetId: string) => Promise<unknown>,
  ) {
    setActionPendingId(item._id)
    try {
      await action(item._id)
    } finally {
      setActionPendingId(undefined)
    }
  }

  if (isEditor) {
    return (
      <AdminContentEditor
        key={isNew ? 'project-new' : projectQuery.data?._id ?? 'project-loading'}
        kind="project"
        mode={isNew ? 'create' : 'edit'}
        initialValue={projectQuery.data}
        isLoading={Boolean(id) && projectQuery.isLoading}
        isSaving={createProject.isPending || updateProject.isPending}
        isPublishing={publishProject.isPending}
        isDeleting={softDeleteProject.isPending}
        onBack={() => navigate('/admin/projects')}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onSoftDelete={
          id
            ? async () => {
                await softDeleteProject.mutateAsync(id)
                navigate('/admin/projects')
              }
            : undefined
        }
      />
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            项目管理
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            管理项目介绍、技术栈、截图和发布状态。
          </p>
        </div>

        <Card>
          <CardContent className="space-y-4 p-4">
            <AdminContentToolbar
              status={status}
              search={search}
              createLabel="新建项目"
              searchPlaceholder="搜索项目名称或 slug..."
              onStatusChange={setStatus}
              onSearchChange={setSearch}
              onCreate={() => navigate('/admin/projects/new')}
            />
            <AdminContentTable
              config={{
                kind: 'project',
                emptyTitle: '还没有内容',
                emptyDescription:
                  '先写第一篇文章，或切换到笔记、项目开始整理你的内容。',
              }}
              items={projectsQuery.data?.items ?? []}
              isLoading={projectsQuery.isLoading}
              error={projectsQuery.error}
              actionPendingId={actionPendingId}
              onEdit={(item) => navigate(`/admin/projects/${item._id}/edit`)}
              onPreview={(item) => setPreviewItem(item as Project)}
              onPublish={(item) =>
                void runRowAction(item, publishProject.mutateAsync)
              }
              onUnpublish={(item) =>
                void runRowAction(item, unpublishProject.mutateAsync)
              }
              onArchive={(item) =>
                void runRowAction(item, archiveProject.mutateAsync)
              }
              onSoftDelete={(item) =>
                void runRowAction(item, softDeleteProject.mutateAsync)
              }
            />
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={Boolean(previewItem)}
        onOpenChange={(open) => {
          if (!open) setPreviewItem(null)
        }}
      >
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewItem?.title ?? '项目预览'}</DialogTitle>
            <DialogDescription>
              {previewItem?.summary ?? '暂无摘要'}
            </DialogDescription>
          </DialogHeader>
          <ContentBlockPreview value={previewItem?.body?.blocks ?? []} />
        </DialogContent>
      </Dialog>
    </>
  )
}

function toProjectDto(
  value: ContentEditorValue,
  status?: ContentStatus,
): CreateProjectDto {
  return {
    title: value.title,
    slug: value.slug,
    summary: value.summary,
    coverImage: value.coverImage,
    screenshots: value.screenshots,
    tags: value.tags,
    techStack: value.techStack,
    projectStatus: value.projectStatus,
    repositoryUrl: value.repositoryUrl,
    demoUrl: value.demoUrl,
    body: { blocks: value.body },
    status,
  }
}
