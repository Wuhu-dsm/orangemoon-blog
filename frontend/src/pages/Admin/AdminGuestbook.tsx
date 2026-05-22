import { useMemo, useState } from 'react'
import { Eye, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  AdminManagementTable,
  type ManagementColumn,
} from '@/components/admin/management/AdminManagementTable'

type GuestbookStatus = 'visible' | 'deleted'

interface GuestbookItem {
  id: string
  nickname: string
  message: string
  status: GuestbookStatus
  createdAt: string
}

const guestbookItems: GuestbookItem[] = []

const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'visible', label: '可见' },
  { value: 'deleted', label: '已删除' },
]

const statusLabel: Record<GuestbookStatus, string> = {
  visible: '可见',
  deleted: '已删除',
}

const columns: ManagementColumn<GuestbookItem>[] = [
  {
    key: 'message',
    label: '留言内容',
    className: 'min-w-80 whitespace-normal',
    render: (item) => (
      <div className="space-y-1">
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {item.nickname}
        </div>
        <div className="line-clamp-2 text-sm text-gray-500">
          {item.message}
        </div>
      </div>
    ),
  },
  {
    key: 'status',
    label: '状态',
    render: (item) => <Badge variant="outline">{statusLabel[item.status]}</Badge>,
  },
  {
    key: 'createdAt',
    label: '提交时间',
    render: (item) => item.createdAt,
  },
]

export default function AdminGuestbook() {
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')

  const filteredItems = useMemo(() => {
    return guestbookItems.filter((item) => {
      const statusMatched = status === 'all' || item.status === status
      const keyword = search.trim().toLowerCase()
      const searchMatched =
        !keyword ||
        item.nickname.toLowerCase().includes(keyword) ||
        item.message.toLowerCase().includes(keyword)

      return statusMatched && searchMatched
    })
  }, [search, status])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          留言管理
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          查看留言并执行删除操作，不设置审核流程。
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <AdminManagementTable
            items={filteredItems}
            columns={columns}
            status={status}
            search={search}
            statusOptions={statusOptions}
            searchPlaceholder="搜索留言内容或昵称..."
            emptyTitle="还没有留言"
            emptyDescription="访客提交的留言会显示在这里，可查看或删除。"
            getRowId={(item) => item.id}
            onStatusChange={setStatus}
            onSearchChange={setSearch}
            actions={[
              {
                label: '查看',
                icon: <Eye />,
                onClick: () => undefined,
              },
              {
                label: '删除',
                icon: <Trash2 />,
                variant: 'destructive',
                disabled: (item) => item.status === 'deleted',
                onClick: () => undefined,
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
