import { Search } from 'lucide-react'
import profileCardBg from '@/assets/home/profile-card-bg.png'
import { cn } from '@/lib/utils'
import { topActions } from '../data'
import IconActionButton from './IconActionButton'

export default function TopBar() {
  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="relative min-w-0 flex-1 sm:max-w-xl">
        <label htmlFor="home-dashboard-search" className="sr-only">
          搜索文章、笔记、项目
        </label>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7f9ab6]"
          size={18}
          strokeWidth={1.9}
          aria-hidden="true"
        />
        <input
          id="home-dashboard-search"
          type="search"
          placeholder="搜索文章、笔记、项目..."
          className="h-12 w-full rounded-2xl border border-[#c8dff0] bg-white/78 py-2 pl-11 pr-20 text-sm text-[#173861] shadow-sm outline-none transition placeholder:text-[#8ba3bc] focus:border-[#77dcd1] focus:ring-4 focus:ring-[#77dcd1]/20"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-lg border border-[#d7e8f2] bg-[#f5fbff] px-2 py-1 text-xs font-semibold text-[#7190ad] sm:inline-flex">
          ⌘ K
        </kbd>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {topActions.map((action) => (
          <IconActionButton
            key={action.label}
            icon={action.icon}
            label={action.label}
          />
        ))}
        <button
          type="button"
          className={cn(
            'ml-1 size-12 rounded-2xl border border-white/80 bg-cover bg-center shadow-md shadow-sky-100 transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#72d9ce]/60',
          )}
          style={{ backgroundImage: `url(${profileCardBg})` }}
          aria-label="打开个人资料"
          title="打开个人资料"
        />
      </div>
    </header>
  )
}
