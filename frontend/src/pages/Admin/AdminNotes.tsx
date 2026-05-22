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
  useAdminNote,
  useAdminNotes,
  useArchiveAdminNote,
  useCreateAdminNote,
  usePublishAdminNote,
  useSoftDeleteAdminNote,
  useUnpublishAdminNote,
  useUpdateAdminNote,
} from '@/hooks/useAdminContent'
import type { CreateNoteDto, Note } from '@/api/adminContent'
import type { ContentStatus } from '@/types/content'

export default function AdminNotes() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const isNew = location.pathname.endsWith('/new')
  const isEditor = isNew || Boolean(id)
  const [status, setStatus] = useState<ContentStatusFilter>('all')
  const [search, setSearch] = useState('')
  const [previewItem, setPreviewItem] = useState<Note | null>(null)
  const [actionPendingId, setActionPendingId] = useState<string>()

  const queryParams = useMemo(
    () => ({
      status: status === 'all' ? undefined : status,
      search: search.trim() || undefined,
    }),
    [search, status],
  )

  const notesQuery = useAdminNotes(queryParams)
  const noteQuery = useAdminNote(id)
  const createNote = useCreateAdminNote()
  const updateNote = useUpdateAdminNote()
  const publishNote = usePublishAdminNote()
  const unpublishNote = useUnpublishAdminNote()
  const archiveNote = useArchiveAdminNote()
  const softDeleteNote = useSoftDeleteAdminNote()

  async function handleSaveDraft(value: ContentEditorValue) {
    if (id) {
      await updateNote.mutateAsync({
        id,
        dto: toNoteDto(value, 'draft'),
      })
      return
    }

    const created = await createNote.mutateAsync(toNoteDto(value, 'draft'))
    navigate(`/admin/notes/${created._id}/edit`, { replace: true })
  }

  async function handlePublish(value: ContentEditorValue) {
    if (id) {
      await updateNote.mutateAsync({ id, dto: toNoteDto(value) })
      await publishNote.mutateAsync(id)
      return
    }

    const created = await createNote.mutateAsync(toNoteDto(value, 'draft'))
    await publishNote.mutateAsync(created._id)
    navigate(`/admin/notes/${created._id}/edit`, { replace: true })
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
        key={isNew ? 'note-new' : noteQuery.data?._id ?? 'note-loading'}
        kind="note"
        mode={isNew ? 'create' : 'edit'}
        initialValue={noteQuery.data}
        isLoading={Boolean(id) && noteQuery.isLoading}
        isSaving={createNote.isPending || updateNote.isPending}
        isPublishing={publishNote.isPending}
        isDeleting={softDeleteNote.isPending}
        onBack={() => navigate('/admin/notes')}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onSoftDelete={
          id
            ? async () => {
                await softDeleteNote.mutateAsync(id)
                navigate('/admin/notes')
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
            笔记管理
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            管理碎片灵感、代码摘录、待办和短内容。
          </p>
        </div>

        <Card>
          <CardContent className="space-y-4 p-4">
            <AdminContentToolbar
              status={status}
              search={search}
              createLabel="新建笔记"
              searchPlaceholder="搜索笔记标题或 slug..."
              onStatusChange={setStatus}
              onSearchChange={setSearch}
              onCreate={() => navigate('/admin/notes/new')}
            />
            <AdminContentTable
              config={{
                kind: 'note',
                emptyTitle: '还没有内容',
                emptyDescription:
                  '先写第一篇文章，或切换到笔记、项目开始整理你的内容。',
              }}
              items={notesQuery.data?.items ?? []}
              isLoading={notesQuery.isLoading}
              error={notesQuery.error}
              actionPendingId={actionPendingId}
              onEdit={(item) => navigate(`/admin/notes/${item._id}/edit`)}
              onPreview={(item) => setPreviewItem(item as Note)}
              onPublish={(item) => void runRowAction(item, publishNote.mutateAsync)}
              onUnpublish={(item) =>
                void runRowAction(item, unpublishNote.mutateAsync)
              }
              onArchive={(item) => void runRowAction(item, archiveNote.mutateAsync)}
              onSoftDelete={(item) =>
                void runRowAction(item, softDeleteNote.mutateAsync)
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
            <DialogTitle>{previewItem?.title ?? '笔记预览'}</DialogTitle>
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

function toNoteDto(
  value: ContentEditorValue,
  status?: ContentStatus,
): CreateNoteDto {
  return {
    title: value.title,
    slug: value.slug,
    summary: value.summary,
    coverImage: value.coverImage,
    tags: value.tags,
    noteType: value.noteType ?? 'short',
    body: { blocks: value.body },
    status,
  }
}
