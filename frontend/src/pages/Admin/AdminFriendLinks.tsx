import { useMemo, useState } from 'react'
import { Check, ExternalLink, Trash2, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  AdminManagementTable,
  type ManagementColumn,
} from '@/components/admin/management/AdminManagementTable'

type FriendLinkStatus = 'pending' | 'approved' | 'rejected'

interface FriendLinkItem {
  id: string
  siteName: string
  url: string
  owner: string
  status: FriendLinkStatus
  submittedAt: string
}

const friendLinks: FriendLinkItem[] = []

const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待审核' },
  { value: 'approved', label: '已通过' },
  { value: 'rejected', label: '已拒绝' },
]

const statusLabel: Record<FriendLinkStatus, string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已拒绝',
}

const columns: ManagementColumn<FriendLinkItem>[] = [
  {
    key: 'siteName',
    label: '站点',
    className: 'min-w-64 whitespace-normal',
    render: (item) => (
      <div className="space-y-1">
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {item.siteName}
        </div>
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary-600"
        >
          {item.url}
          <ExternalLink className="size-3" />
        </a>
      </div>
    ),
  },
  {
    key: 'owner',
    label: '申请人',
    render: (item) => item.owner,
  },
  {
    key: 'status',
    label: '状态',
    render: (item) => <Badge variant="outline">{statusLabel[item.status]}</Badge>,
  },
  {
    key: 'submittedAt',
    label: '提交时间',
    render: (item) => item.submittedAt,
  },
]

export default function AdminFriendLinks() {
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')

  const filteredItems = useMemo(() => {
    return friendLinks.filter((item) => {
      const statusMatched = status === 'all' || item.status === status
      const keyword = search.trim().toLowerCase()
      const searchMatched =
        !keyword ||
        item.siteName.toLowerCase().includes(keyword) ||
        item.url.toLowerCase().includes(keyword) ||
        item.owner.toLowerCase().includes(keyword)

      return statusMatched && searchMatched
    })
  }, [search, status])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          友链管理
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          管理待审核、已通过、已拒绝的友链申请。
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
            searchPlaceholder="搜索站点名称、链接或申请人..."
            emptyTitle="还没有友链申请"
            emptyDescription="待审核、已通过、已拒绝的友链都会在这里管理。"
            getRowId={(item) => item.id}
            onStatusChange={setStatus}
            onSearchChange={setSearch}
            actions={[
              {
                label: '通过',
                icon: <Check />,
                disabled: (item) => item.status === 'approved',
                onClick: () => undefined,
              },
              {
                label: '拒绝',
                icon: <X />,
                disabled: (item) => item.status === 'rejected',
                onClick: () => undefined,
              },
              {
                label: '删除',
                icon: <Trash2 />,
                variant: 'destructive',
                onClick: () => undefined,
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
