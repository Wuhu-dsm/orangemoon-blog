import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ContentStatus } from '@/types/content'

export type ContentStatusFilter = 'all' | ContentStatus

interface AdminContentToolbarProps {
  status: ContentStatusFilter
  search: string
  createLabel: string
  searchPlaceholder: string
  onStatusChange: (status: ContentStatusFilter) => void
  onSearchChange: (search: string) => void
  onCreate: () => void
}

export function AdminContentToolbar({
  status,
  search,
  createLabel,
  searchPlaceholder,
  onStatusChange,
  onSearchChange,
  onCreate,
}: AdminContentToolbarProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <Tabs
        value={status}
        onValueChange={(value) => onStatusChange(value as ContentStatusFilter)}
      >
        <TabsList className="max-w-full overflow-x-auto">
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="draft">草稿</TabsTrigger>
          <TabsTrigger value="published">已发布</TabsTrigger>
          <TabsTrigger value="archived">已归档</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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
        <Button type="button" onClick={onCreate} className="gap-2">
          <Plus className="size-4" />
          {createLabel}
        </Button>
      </div>
    </div>
  )
}
