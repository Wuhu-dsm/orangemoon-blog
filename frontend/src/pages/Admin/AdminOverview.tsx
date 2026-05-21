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

interface StatItem {
  label: string
  count: number
  draft: number
  icon: React.ElementType
  tint: string
}

const stats: StatItem[] = [
  {
    label: '文章',
    count: 0,
    draft: 0,
    icon: FileText,
    tint: 'bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-300',
  },
  {
    label: '笔记',
    count: 0,
    draft: 0,
    icon: BookOpen,
    tint: 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-300',
  },
  {
    label: '项目',
    count: 0,
    draft: 0,
    icon: FolderOpen,
    tint: 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-300',
  },
]

const quickActions = [
  { label: '写文章', path: '/admin/articles/new', icon: PenLine },
  { label: '记笔记', path: '/admin/notes/new', icon: BookOpen },
  { label: '建项目', path: '/admin/projects/new', icon: FolderOpen },
]

export default function AdminOverview() {
  const hasContent = stats.some((s) => s.count > 0)

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
                >
                  <Icon size={22} />
                </div>
                <div>
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
            <p className="text-sm text-gray-500 dark:text-gray-400">
              暂无最近编辑内容
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
