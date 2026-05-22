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
  useAdminArticle,
  useAdminArticles,
  useArchiveAdminArticle,
  useCreateAdminArticle,
  usePublishAdminArticle,
  useSoftDeleteAdminArticle,
  useUnpublishAdminArticle,
  useUpdateAdminArticle,
} from '@/hooks/useAdminContent'
import type { Article, CreateArticleDto } from '@/api/adminContent'
import type { ContentStatus } from '@/types/content'

export default function AdminArticles() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const isNew = location.pathname.endsWith('/new')
  const isEditor = isNew || Boolean(id)
  const [status, setStatus] = useState<ContentStatusFilter>('all')
  const [search, setSearch] = useState('')
  const [previewItem, setPreviewItem] = useState<Article | null>(null)
  const [actionPendingId, setActionPendingId] = useState<string>()

  const queryParams = useMemo(
    () => ({
      status: status === 'all' ? undefined : status,
      search: search.trim() || undefined,
    }),
    [search, status],
  )

  const articlesQuery = useAdminArticles(queryParams)
  const articleQuery = useAdminArticle(id)
  const createArticle = useCreateAdminArticle()
  const updateArticle = useUpdateAdminArticle()
  const publishArticle = usePublishAdminArticle()
  const unpublishArticle = useUnpublishAdminArticle()
  const archiveArticle = useArchiveAdminArticle()
  const softDeleteArticle = useSoftDeleteAdminArticle()

  async function handleSaveDraft(value: ContentEditorValue) {
    if (id) {
      await updateArticle.mutateAsync({
        id,
        dto: toArticleDto(value, 'draft'),
      })
      return
    }

    const created = await createArticle.mutateAsync(toArticleDto(value, 'draft'))
    navigate(`/admin/articles/${created._id}/edit`, { replace: true })
  }

  async function handlePublish(value: ContentEditorValue) {
    if (id) {
      await updateArticle.mutateAsync({ id, dto: toArticleDto(value) })
      await publishArticle.mutateAsync(id)
      return
    }

    const created = await createArticle.mutateAsync(toArticleDto(value, 'draft'))
    await publishArticle.mutateAsync(created._id)
    navigate(`/admin/articles/${created._id}/edit`, { replace: true })
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
        key={isNew ? 'article-new' : articleQuery.data?._id ?? 'article-loading'}
        kind="article"
        mode={isNew ? 'create' : 'edit'}
        initialValue={articleQuery.data}
        isLoading={Boolean(id) && articleQuery.isLoading}
        isSaving={createArticle.isPending || updateArticle.isPending}
        isPublishing={publishArticle.isPending}
        isDeleting={softDeleteArticle.isPending}
        onBack={() => navigate('/admin/articles')}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onSoftDelete={
          id
            ? async () => {
                await softDeleteArticle.mutateAsync(id)
                navigate('/admin/articles')
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
            文章管理
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            管理文章草稿、发布状态、预览和回收站操作。
          </p>
        </div>

        <Card>
          <CardContent className="space-y-4 p-4">
            <AdminContentToolbar
              status={status}
              search={search}
              createLabel="写新文章"
              searchPlaceholder="搜索文章标题或 slug..."
              onStatusChange={setStatus}
              onSearchChange={setSearch}
              onCreate={() => navigate('/admin/articles/new')}
            />
            <AdminContentTable
              config={{
                kind: 'article',
                emptyTitle: '还没有内容',
                emptyDescription:
                  '先写第一篇文章，或切换到笔记、项目开始整理你的内容。',
              }}
              items={articlesQuery.data?.items ?? []}
              isLoading={articlesQuery.isLoading}
              error={articlesQuery.error}
              actionPendingId={actionPendingId}
              onEdit={(item) => navigate(`/admin/articles/${item._id}/edit`)}
              onPreview={(item) => setPreviewItem(item as Article)}
              onPublish={(item) =>
                void runRowAction(item, publishArticle.mutateAsync)
              }
              onUnpublish={(item) =>
                void runRowAction(item, unpublishArticle.mutateAsync)
              }
              onArchive={(item) =>
                void runRowAction(item, archiveArticle.mutateAsync)
              }
              onSoftDelete={(item) =>
                void runRowAction(item, softDeleteArticle.mutateAsync)
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
            <DialogTitle>{previewItem?.title ?? '文章预览'}</DialogTitle>
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

function toArticleDto(
  value: ContentEditorValue,
  status?: ContentStatus,
): CreateArticleDto {
  return {
    title: value.title,
    slug: value.slug,
    summary: value.summary,
    coverImage: value.coverImage,
    tags: value.tags,
    category: value.category,
    body: { blocks: value.body },
    status,
  }
}
