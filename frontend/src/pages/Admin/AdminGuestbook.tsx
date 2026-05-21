import { useState } from 'react'
import { MessageSquare, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export default function AdminGuestbook() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          留言管理
        </h2>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative max-w-sm">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <Input
                placeholder="搜索留言内容..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare
              size={40}
              className="mb-4 text-gray-300 dark:text-gray-600"
            />
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {searchQuery
                ? `未找到匹配 "${searchQuery}" 的内容`
                : '还没有留言'}
            </h3>
            {!searchQuery && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                访客提交的留言将显示在这里。
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
