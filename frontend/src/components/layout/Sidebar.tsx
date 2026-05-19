import {
  BookOpen,
  Clock,
  FileText,
  FolderOpen,
  Home,
  Link as LinkIcon,
  MessageSquare,
  User,
  X,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useSidebarStore } from '../../stores/sidebarStore'
import { Settings, Moon, Gift, Code } from 'lucide-react'
import { useThemeStore } from '../../stores/themeStore'

const navItems = [
  { icon: Home, label: '首页', path: '/' },
  { icon: FileText, label: '文章', path: '/articles' },
  { icon: FolderOpen, label: '项目', path: '/projects' },
  { icon: BookOpen, label: '笔记', path: '/notes' },
  { icon: Clock, label: '时间轴', path: '/timeline' },
  { icon: User, label: '关于我', path: '/about' },
  { icon: LinkIcon, label: '友链', path: '/friends' },
  { icon: MessageSquare, label: '留言板', path: '/guestbook' },
]

export default function Sidebar() {
  const location = useLocation()
  const { isOpen, close } = useSidebarStore()
  const { toggle } = useThemeStore()

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={close}
      />
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-900 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-start justify-between p-6">
          <Link to="/" className="flex flex-col" onClick={close}>
            <span className="text-xl font-bold leading-none">
              <span className="text-primary-500">Sora</span>Blog
            </span>
            <span className="mt-1 text-xs text-gray-500">记录 · 思考 · 成长</span>
          </Link>
          <button
            type="button"
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 lg:hidden dark:hover:bg-gray-800 dark:hover:text-gray-50"
            onClick={close}
            aria-label="关闭导航"
            title="关闭导航"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={close}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-primary-100/60 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Decorative illustration */}
        <div className="relative mt-4 flex justify-center px-3">
          <img
            src="/images/home/role_sider.png"
            alt=" decoration"
            className="h-40 w-auto object-contain opacity-90"
          />
          <img
            src="/images/home/star.png"
            alt=""
            className="absolute -right-2 top-4 h-8 w-auto animate-pulse"
          />
          <img
            src="/images/home/leaf.png"
            alt=""
            className="absolute -left-1 top-8 h-6 w-auto"
          />
        </div>

        {/* Quote */}
        <div className="mt-4 px-6 text-center">
          <p className="text-xs leading-relaxed text-muted-foreground">
            生活明朗，万物可爱
            <br />
            保持热爱，奔赴山海。
          </p>
        </div>

        {/* Shortcut buttons */}
        <div className="mt-4 flex justify-center gap-3 px-3">
          <button
            type="button"
            aria-label="切换主题"
            title="切换主题"
            onClick={toggle}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition hover:bg-secondary/80"
          >
            <Moon size={16} />
          </button>
          <button
            type="button"
            aria-label="设置"
            title="设置"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition hover:bg-secondary/80"
          >
            <Settings size={16} />
          </button>
          <button
            type="button"
            aria-label="通知"
            title="通知"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition hover:bg-secondary/80"
          >
            <Gift size={16} />
          </button>
          <button
            type="button"
            aria-label="GitHub"
            title="GitHub"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition hover:bg-secondary/80"
          >
            <Code size={16} />
          </button>
        </div>

        {/* Copyright */}
        <div className="mt-auto py-4 text-center">
          <p className="text-[10px] text-muted-foreground">© 2024 SoraBlog</p>
        </div>
      </aside>
    </>
  )
}
