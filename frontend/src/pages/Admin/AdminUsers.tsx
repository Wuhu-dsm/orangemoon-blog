import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Shield, ShieldOff, UserCog, UserRound } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  AdminManagementTable,
  type ManagementColumn,
} from '@/components/admin/management/AdminManagementTable'
import {
  findAllAdminUsers,
  updateAdminUser,
  type AdminUser,
  type AdminUserListParams,
  type AdminUserRole,
  type AdminUserStatus,
  type AdminUpdateUserDto,
} from '@/api/adminManagement'

const userKeys = {
  all: ['admin', 'users'] as const,
  list: (params: AdminUserListParams) =>
    [...userKeys.all, 'list', params] as const,
}

const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '正常' },
  { value: 'banned', label: '已禁用' },
]

const columns: ManagementColumn<AdminUser>[] = [
  {
    key: 'user',
    label: '用户',
    className: 'min-w-64 whitespace-normal',
    render: (item) => (
      <div className="space-y-1">
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {item.username}
        </div>
        <div className="text-xs text-gray-500">{item.email}</div>
      </div>
    ),
  },
  {
    key: 'role',
    label: '角色',
    render: (item) => (
      <Badge variant="outline">{item.role === 'admin' ? '管理员' : '用户'}</Badge>
    ),
  },
  {
    key: 'status',
    label: '状态',
    render: (item) => (
      <Badge
        variant="secondary"
        className={
          item.status === 'active'
            ? 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300'
            : 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
        }
      >
        {item.status === 'active' ? '正常' : '已禁用'}
      </Badge>
    ),
  },
  {
    key: 'level',
    label: '等级',
    render: (item) => `Lv.${item.level}`,
  },
  {
    key: 'lastLoginAt',
    label: '最近登录',
    render: (item) => formatDate(item.lastLoginAt),
  },
]

export default function AdminUsers() {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState('all')
  const [role, setRole] = useState<'all' | AdminUserRole>('all')
  const [search, setSearch] = useState('')

  const queryParams = useMemo<AdminUserListParams>(
    () => ({
      status: status === 'all' ? undefined : (status as AdminUserStatus),
      role: role === 'all' ? undefined : role,
      search: search.trim() || undefined,
    }),
    [role, search, status],
  )

  const usersQuery = useQuery({
    queryKey: userKeys.list(queryParams),
    queryFn: () => findAllAdminUsers(queryParams),
  })

  const updateUser = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: AdminUpdateUserDto }) =>
      updateAdminUser(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      toast.success('用户更新成功')
    },
    onError: () => toast.error('用户更新失败'),
  })

  function updateTargetUser(user: AdminUser, dto: AdminUpdateUserDto) {
    void updateUser.mutateAsync({ id: user._id, dto })
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          用户管理
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          查看用户信息，调整管理员/用户角色，并禁用异常账号。
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <AdminManagementTable
            items={usersQuery.data?.items ?? []}
            columns={columns}
            status={status}
            search={search}
            statusOptions={statusOptions}
            searchPlaceholder="搜索用户名或邮箱..."
            emptyTitle="还没有用户"
            emptyDescription="系统用户会显示在这里，只有管理员可以进入此页面。"
            isLoading={usersQuery.isLoading}
            error={usersQuery.error}
            getRowId={(item) => item._id}
            onStatusChange={setStatus}
            onSearchChange={setSearch}
            extraControls={
              <select
                value={role}
                onChange={(event) =>
                  setRole(event.target.value as 'all' | AdminUserRole)
                }
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                aria-label="按角色筛选用户"
              >
                <option value="all">全部角色</option>
                <option value="admin">管理员</option>
                <option value="user">用户</option>
              </select>
            }
            actions={[
              {
                label: '设为管理员',
                icon: <UserCog />,
                disabled: (item) => item.role === 'admin' || updateUser.isPending,
                onClick: (item) => updateTargetUser(item, { role: 'admin' }),
              },
              {
                label: '设为用户',
                icon: <UserRound />,
                disabled: (item) => item.role === 'user' || updateUser.isPending,
                onClick: (item) => updateTargetUser(item, { role: 'user' }),
              },
              {
                label: '禁用',
                icon: <ShieldOff />,
                variant: 'destructive',
                disabled: (item) =>
                  item.status === 'banned' || updateUser.isPending,
                onClick: (item) => updateTargetUser(item, { status: 'banned' }),
              },
              {
                label: '恢复',
                icon: <Shield />,
                disabled: (item) =>
                  item.status === 'active' || updateUser.isPending,
                onClick: (item) => updateTargetUser(item, { status: 'active' }),
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
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
