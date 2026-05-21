import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Link as LinkIcon, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'

export default function AdminFriendLinks() {
  const [status, setStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          友链管理
        </h2>
        <Button asChild className="gap-2">
          <Link to="/admin/friends/new">
            <Plus size={16} />
            添加友链
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Tabs value={status} onValueChange={setStatus}>
              <TabsList>
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="pending">待审核</TabsTrigger>
                <TabsTrigger value="approved">已通过</TabsTrigger>
                <TabsTrigger value="rejected">已拒绝</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative max-w-sm">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <Input
                placeholder="搜索网站名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center py-12 text-center">
            <LinkIcon
              size={40}
              className="mb-4 text-gray-300 dark:text-gray-600"
            />
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {searchQuery
                ? `未找到匹配 "${searchQuery}" 的内容`
                : '还没有友链'}
            </h3>
            {!searchQuery && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                添加第一个友链，或等待访客提交申请。
              </p>
            )}
            <Button asChild className="mt-4 gap-2">
              <Link to="/admin/friends/new">
                <Plus size={16} />
                添加友链
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
