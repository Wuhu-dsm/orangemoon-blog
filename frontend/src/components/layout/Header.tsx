import { Bell, Menu, Search, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useSidebarStore } from '../../stores/sidebarStore'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const { isAuthenticated, user } = useAuthStore()
  const openSidebar = useSidebarStore((state) => state.open)

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-gray-200 bg-white/95 px-4 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 lg:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50"
          onClick={openSidebar}
          aria-label="打开导航"
          title="打开导航"
        >
          <Menu size={18} />
        </button>
        <div className="relative w-full max-w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="搜索文章、笔记、项目..."
            className="h-10 w-full rounded-lg bg-gray-100 pl-10 pr-4 text-sm outline-none ring-primary-500 transition focus:ring-2 dark:bg-gray-800"
          />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <button
          type="button"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50"
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
              className="size-8 rounded-full bg-gray-200 object-cover dark:bg-gray-700"
            />
            <span className="hidden text-sm sm:inline">{user?.username}</span>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex h-10 items-center gap-2 rounded-lg bg-primary-500 px-3 text-sm font-medium text-white transition hover:bg-primary-600 sm:px-4"
          >
            <User size={16} />
            <span className="hidden sm:inline">登录</span>
          </Link>
        )}
      </div>
    </header>
  )
}
