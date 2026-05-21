import { Bell, Gift, LogOut, Menu, Search } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useSidebarStore } from '../../stores/sidebarStore'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const openSidebar = useSidebarStore((state) => state.open)

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          className="rounded-lg p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground lg:hidden"
          onClick={openSidebar}
          aria-label="打开导航"
          title="打开导航"
        >
          <Menu size={18} />
        </button>
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/70"
            size={16}
            aria-hidden="true"
          />
          <input
            type="text"
            name="site-search"
            aria-label="搜索文章、笔记、项目"
            autoComplete="off"
            placeholder="搜索文章、笔记、项目..."
            className="h-11 w-full rounded-full bg-white pl-11 pr-16 text-sm font-normal shadow-sm outline-none transition placeholder:text-muted-foreground/60 focus:shadow-md focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-border/50 bg-white/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/70 backdrop-blur-sm sm:inline">
            ⌘ K
          </kbd>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="relative rounded-lg p-2 text-foreground/70 transition hover:bg-accent hover:text-foreground"
          aria-label="活动"
          title="活动"
        >
          <Gift size={18} />
          <span
            aria-hidden="true"
            className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary"
          />
        </button>
        <ThemeToggle />
        <button
          type="button"
          className="rounded-lg p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground"
          aria-label="通知"
          title="通知"
        >
          <Bell size={18} />
        </button>
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <img
              src={user?.avatar || '/images/home/avatar.png'}
              alt={user?.username || '博主头像'}
              width={32}
              height={32}
              className="size-8 rounded-full bg-muted object-cover"
            />
            <span className="hidden text-sm font-medium sm:inline">
              {user?.username}
            </span>
            <button
              type="button"
              className="rounded-lg p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground"
              onClick={logout}
              aria-label="退出登录"
              title="退出登录"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <span className="hidden rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur sm:inline">
            访客
          </span>
        )}
      </div>
    </header>
  )
}
