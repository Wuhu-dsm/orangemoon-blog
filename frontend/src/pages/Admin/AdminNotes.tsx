import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, BookOpen, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'

export default function AdminNotes() {
  const [status, setStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          笔记列表
        </h2>
        <Button asChild className="gap-2">
          <Link to="/admin/notes/new">
            <Plus size={16} />
            新建笔记
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Tabs value={status} onValueChange={setStatus}>
              <TabsList>
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="draft">草稿</TabsTrigger>
                <TabsTrigger value="published">已发布</TabsTrigger>
                <TabsTrigger value="archived">已归档</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative max-w-sm">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <Input
                placeholder="搜索笔记标题..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center py-12 text-center">
            <BookOpen
              size={40}
              className="mb-4 text-gray-300 dark:text-gray-600"
            />
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {searchQuery
                ? `未找到匹配 "${searchQuery}" 的内容`
                : '还没有内容'}
            </h3>
            {!searchQuery && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                先写第一篇文章，或切换到笔记、项目开始整理你的内容。
              </p>
            )}
            <Button asChild className="mt-4 gap-2">
              <Link to="/admin/notes/new">
                <Plus size={16} />
                新建笔记
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
