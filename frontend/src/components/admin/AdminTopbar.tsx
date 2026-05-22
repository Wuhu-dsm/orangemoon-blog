import { Link, useLocation } from 'react-router-dom'
import { Search, Bell, User, Globe } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/authStore'

const pageTitles: Record<string, string> = {
  '/admin': '仪表盘',
  '/admin/articles': '文章管理',
  '/admin/notes': '笔记管理',
  '/admin/projects': '项目管理',
  '/admin/friends': '友链管理',
  '/admin/guestbook': '留言管理',
  '/admin/users': '用户管理',
}

export default function AdminTopbar() {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const title = pageTitles[location.pathname] || '后台管理'

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="ml-10 flex items-center gap-4 lg:ml-0">
        <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h1>
      </div>

      <div className="hidden flex-1 items-center justify-center px-8 md:flex">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            placeholder="搜索内容..."
            className="h-9 rounded-lg border-gray-200 bg-gray-50 pl-9 text-sm dark:border-gray-700 dark:bg-gray-800"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          title="返回博客首页"
        >
          <Globe size={16} />
          <span className="hidden sm:inline">返回博客</span>
        </Link>
        <button
          type="button"
          className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          aria-label="通知"
          title="通知"
        >
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-2 pl-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">
            <User size={16} />
          </div>
          <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-300 md:block">
            {user?.username || '管理员'}
          </span>
        </div>
      </div>
    </header>
  )
}
