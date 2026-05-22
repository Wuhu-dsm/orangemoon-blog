import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  Archive,
  Eye,
  FileText,
  Pencil,
  Send,
  Trash2,
  Undo2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Article, Note, Project } from '@/api/adminContent'
import type { ContentKind, ContentStatus } from '@/types/content'

export type AdminContentItem = Article | Note | Project

interface ContentKindConfig {
  kind: ContentKind
  emptyTitle: string
  emptyDescription: string
}

interface AdminContentTableProps {
  config: ContentKindConfig
  items: AdminContentItem[]
  isLoading?: boolean
  error?: unknown
  actionPendingId?: string
  onEdit: (item: AdminContentItem) => void
  onPreview: (item: AdminContentItem) => void
  onPublish: (item: AdminContentItem) => void
  onUnpublish: (item: AdminContentItem) => void
  onArchive: (item: AdminContentItem) => void
  onSoftDelete: (item: AdminContentItem) => void
}

const statusLabel: Record<ContentStatus, string> = {
  draft: '草稿',
  published: '已发布',
  archived: '已归档',
}

const statusBadgeClass: Record<ContentStatus, string> = {
  draft: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  published: 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300',
  archived: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
}

export function AdminContentTable({
  config,
  items,
  isLoading = false,
  error,
  actionPendingId,
  onEdit,
  onPreview,
  onPublish,
  onUnpublish,
  onArchive,
  onSoftDelete,
}: AdminContentTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<AdminContentItem | null>(null)

  if (isLoading) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 py-12 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
        正在加载内容...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-8 text-center text-sm text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
        内容加载失败，请稍后重试。
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 px-4 py-14 text-center dark:border-gray-800">
        <FileText className="mb-4 size-10 text-gray-300 dark:text-gray-600" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {config.emptyTitle}
        </h3>
        <p className="mt-1 max-w-md text-sm text-gray-500 dark:text-gray-400">
          {config.emptyDescription}
        </p>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-64">标题</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>分类</TableHead>
            <TableHead>标签</TableHead>
            <TableHead>更新时间</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id}>
              <TableCell className="max-w-80 whitespace-normal">
                <div className="space-y-1">
                  <div className="line-clamp-1 font-medium text-gray-900 dark:text-gray-100">
                    {item.title}
                  </div>
                  <div className="line-clamp-1 text-xs text-gray-500">
                    /{item.slug}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={statusBadgeClass[item.status]}
                >
                  {statusLabel[item.status]}
                </Badge>
              </TableCell>
              <TableCell>{getKindMeta(config.kind, item)}</TableCell>
              <TableCell className="max-w-56 whitespace-normal">
                <div className="flex flex-wrap gap-1">
                  {item.tags.length > 0 ? (
                    item.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">未设置</span>
                  )}
                </div>
              </TableCell>
              <TableCell>{formatDate(item.updatedAt)}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <IconAction
                    label="编辑"
                    icon={<Pencil />}
                    onClick={() => onEdit(item)}
                  />
                  <IconAction
                    label="预览"
                    icon={<Eye />}
                    onClick={() => onPreview(item)}
                  />
                  {item.status === 'published' ? (
                    <IconAction
                      label="取消发布"
                      icon={<Undo2 />}
                      pending={actionPendingId === item._id}
                      onClick={() => onUnpublish(item)}
                    />
                  ) : (
                    <IconAction
                      label="发布"
                      icon={<Send />}
                      pending={actionPendingId === item._id}
                      onClick={() => onPublish(item)}
                    />
                  )}
                  <IconAction
                    label="归档"
                    icon={<Archive />}
                    pending={actionPendingId === item._id}
                    onClick={() => onArchive(item)}
                  />
                  <IconAction
                    label="移入回收站"
                    icon={<Trash2 />}
                    pending={actionPendingId === item._id}
                    variant="destructive"
                    onClick={() => setDeleteTarget(item)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>移入回收站</DialogTitle>
            <DialogDescription>
              该内容会从列表和公开访问中隐藏，确认移入回收站吗？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteTarget) {
                  onSoftDelete(deleteTarget)
                  setDeleteTarget(null)
                }
              }}
            >
              移入回收站
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function IconAction({
  label,
  icon,
  pending = false,
  variant = 'ghost',
  onClick,
}: {
  label: string
  icon: ReactNode
  pending?: boolean
  variant?: 'ghost' | 'destructive'
  onClick: () => void
}) {
  return (
    <Button
      type="button"
      size="icon-sm"
      variant={variant}
      aria-label={label}
      title={label}
      disabled={pending}
      onClick={onClick}
    >
      {icon}
    </Button>
  )
}

function getKindMeta(kind: ContentKind, item: AdminContentItem) {
  if (kind === 'article' && 'category' in item) {
    return item.category || '未分类'
  }

  if (kind === 'note' && 'noteType' in item) {
    return noteTypeLabel[item.noteType] ?? item.noteType
  }

  if (kind === 'project' && 'projectStatus' in item) {
    return item.projectStatus ? projectStatusLabel[item.projectStatus] : '未设置'
  }

  return '未设置'
}

const noteTypeLabel: Record<string, string> = {
  short: '短笔记',
  code: '代码',
  quote: '摘录',
  todo: '待办',
}

const projectStatusLabel: Record<string, string> = {
  planning: '规划中',
  'in-progress': '进行中',
  completed: '已完成',
  maintenance: '维护中',
}

function formatDate(value?: string) {
  if (!value) return '未记录'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
