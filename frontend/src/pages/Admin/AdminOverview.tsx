import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  BookOpen,
  FolderOpen,
  PenLine,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  useAdminArticles,
  useAdminNotes,
  useAdminProjects,
} from '@/hooks/useAdminContent'

interface StatItem {
  label: string
  count: number
  draft: number
  icon: React.ElementType
  tint: string
}

const STAT_DEFS = [
  {
    label: '文章',
    icon: FileText,
    tint: 'bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-300',
  },
  {
    label: '笔记',
    icon: BookOpen,
    tint: 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-300',
  },
  {
    label: '项目',
    icon: FolderOpen,
    tint: 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-300',
  },
] as const

interface RecentEntry {
  _id: string
  title: string
  _kind: 'article' | 'note' | 'project'
  updatedAt: string
}

const quickActions = [
  { label: '写文章', path: '/admin/articles/new', icon: PenLine },
  { label: '记笔记', path: '/admin/notes/new', icon: BookOpen },
  { label: '建项目', path: '/admin/projects/new', icon: FolderOpen },
]

export default function AdminOverview() {
  const articlesAll = useAdminArticles()
  const articlesDraft = useAdminArticles({ status: 'draft', pageSize: 1 })
  const notesAll = useAdminNotes()
  const notesDraft = useAdminNotes({ status: 'draft', pageSize: 1 })
  const projectsAll = useAdminProjects()
  const projectsDraft = useAdminProjects({ status: 'draft', pageSize: 1 })

  const stats: StatItem[] = useMemo(() => [
    { ...STAT_DEFS[0], count: articlesAll.data?.total ?? 0, draft: articlesDraft.data?.total ?? 0 },
    { ...STAT_DEFS[1], count: notesAll.data?.total ?? 0, draft: notesDraft.data?.total ?? 0 },
    { ...STAT_DEFS[2], count: projectsAll.data?.total ?? 0, draft: projectsDraft.data?.total ?? 0 },
  ], [articlesAll.data?.total, articlesDraft.data?.total, notesAll.data?.total, notesDraft.data?.total, projectsAll.data?.total, projectsDraft.data?.total])

  const isLoading =
    articlesAll.isPending ||
    notesAll.isPending ||
    projectsAll.isPending

  const recentEntries: RecentEntry[] = useMemo(() => {
    const merged: RecentEntry[] = [
      ...(articlesAll.data?.items ?? []).map((a) => ({
        _id: a._id,
        title: a.title,
        _kind: 'article' as const,
        updatedAt: a.updatedAt,
      })),
      ...(notesAll.data?.items ?? []).map((n) => ({
        _id: n._id,
        title: n.title,
        _kind: 'note' as const,
        updatedAt: n.updatedAt,
      })),
      ...(projectsAll.data?.items ?? []).map((p) => ({
        _id: p._id,
        title: p.title,
        _kind: 'project' as const,
        updatedAt: p.updatedAt,
      })),
    ]
    merged.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    return merged.slice(0, 8)
  }, [articlesAll.data?.items, notesAll.data?.items, projectsAll.data?.items])

  const hasContent = recentEntries.length > 0

  const kindLabel: Record<string, string> = {
    article: '文章',
    note: '笔记',
    project: '项目',
  }
  const kindTint: Record<string, string> = {
    article: 'bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-300',
    note: 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-300',
    project: 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-300',
  }
  const kindEditPath: Record<string, (id: string) => string> = {
    article: (id) => `/admin/articles/${id}/edit`,
    note: (id) => `/admin/notes/${id}/edit`,
    project: (id) => `/admin/projects/${id}/edit`,
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.tint}`}
                  style={isLoading ? { opacity: 0.5 } : undefined}
                >
                  <Icon size={22} />
                </div>
                <div style={isLoading ? { opacity: 0.5 } : undefined}>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {stat.count}
                  </p>
                  {stat.draft > 0 && (
                    <Badge variant="secondary" className="mt-1">
                      {stat.draft} 草稿
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">
          快速创建
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.label}
                to={action.path}
                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-primary-200 hover:bg-primary-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-800 dark:hover:bg-primary-900/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">
                  <Icon size={20} />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {action.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent edits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">最近编辑</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasContent ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText
                size={40}
                className="mb-4 text-gray-300 dark:text-gray-600"
              />
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                还没有内容
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                先写第一篇文章，或切换到笔记、项目开始整理你的内容。
              </p>
              <Button asChild className="mt-4 gap-2">
                <Link to="/admin/articles/new">
                  <PenLine size={16} />
                  写新文章
                </Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentEntries.map((entry) => (
                <li
                  key={`${entry._kind}-${entry._id}`}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <Badge
                    variant="secondary"
                    className={`shrink-0 text-xs ${kindTint[entry._kind]}`}
                  >
                    {kindLabel[entry._kind]}
                  </Badge>
                  <Link
                    to={kindEditPath[entry._kind](entry._id)}
                    className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400"
                  >
                    {entry.title || '无标题'}
                  </Link>
                  <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">
                    {new Date(entry.updatedAt).toLocaleDateString('zh-CN')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
