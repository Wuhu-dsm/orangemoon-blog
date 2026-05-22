import type { ReactNode } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export interface ManagementStatusOption {
  value: string
  label: string
}

export interface ManagementColumn<T> {
  key: string
  label: string
  className?: string
  render: (item: T) => ReactNode
}

export interface ManagementAction<T> {
  label: string
  icon: ReactNode
  variant?: 'ghost' | 'destructive' | 'outline'
  disabled?: (item: T) => boolean
  onClick: (item: T) => void
}

interface AdminManagementTableProps<T> {
  items: T[]
  columns: ManagementColumn<T>[]
  status: string
  search: string
  statusOptions: ManagementStatusOption[]
  searchPlaceholder: string
  emptyTitle: string
  emptyDescription: string
  isLoading?: boolean
  error?: unknown
  extraControls?: ReactNode
  getRowId: (item: T) => string
  actions?: ManagementAction<T>[]
  onStatusChange: (status: string) => void
  onSearchChange: (search: string) => void
}

export function AdminManagementTable<T>({
  items,
  columns,
  status,
  search,
  statusOptions,
  searchPlaceholder,
  emptyTitle,
  emptyDescription,
  isLoading = false,
  error,
  extraControls,
  getRowId,
  actions = [],
  onStatusChange,
  onSearchChange,
}: AdminManagementTableProps<T>) {
  const hasError = error !== undefined && error !== null

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={status} onValueChange={onStatusChange}>
          <TabsList className="max-w-full overflow-x-auto">
            {statusOptions.map((option) => (
              <TabsTrigger key={option.value} value={option.value}>
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {extraControls}
          <div className="relative w-full sm:w-72">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
            />
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="rounded-lg border border-dashed border-gray-200 py-12 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
          正在加载数据...
        </div>
      )}

      {hasError && !isLoading && (
        <div className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-8 text-center text-sm text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
          数据加载失败，请稍后重试。
        </div>
      )}

      {!isLoading && !hasError && items.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-200 px-4 py-14 text-center dark:border-gray-800">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {emptyTitle}
          </h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-gray-500 dark:text-gray-400">
            {emptyDescription}
          </p>
        </div>
      )}

      {!isLoading && !hasError && items.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.label}
                </TableHead>
              ))}
              {actions.length > 0 && (
                <TableHead className="text-right">操作</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={getRowId(item)}>
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.render(item)}
                  </TableCell>
                ))}
                {actions.length > 0 && (
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {actions.map((action) => (
                        <Button
                          key={action.label}
                          type="button"
                          size="icon-sm"
                          variant={action.variant ?? 'ghost'}
                          aria-label={action.label}
                          title={action.label}
                          disabled={action.disabled?.(item)}
                          onClick={() => action.onClick(item)}
                        >
                          {action.icon}
                        </Button>
                      ))}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
