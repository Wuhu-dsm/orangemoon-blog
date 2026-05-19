import { Bell, Gift, Menu, Search, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useSidebarStore } from '../../stores/sidebarStore'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const { isAuthenticated, user } = useAuthStore()
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
          />
          <input
            type="text"
            placeholder="搜索文章、笔记、项目..."
            className="h-11 w-full rounded-full bg-white pl-11 pr-16 text-sm font-normal shadow-sm outline-none transition placeholder:text-muted-foreground/60 focus:shadow-md"
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
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
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
              src={user?.avatar || '/default-avatar.png'}
              alt={user?.username || '用户头像'}
              className="size-8 rounded-full bg-muted object-cover"
            />
            <span className="hidden text-sm font-medium sm:inline">{user?.username}</span>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex h-10 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 sm:px-4"
          >
            <User size={16} />
            <span className="hidden sm:inline">登录</span>
          </Link>
        )}
      </div>
    </header>
  )
}
