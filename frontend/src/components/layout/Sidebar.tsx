import {
  BookOpen,
  Clock,
  FileText,
  FolderOpen,
  Home,
  Link as LinkIcon,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  X,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useSidebarStore } from '../../stores/sidebarStore'

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
  const { isOpen, close, collapsed, toggleCollapsed } = useSidebarStore()

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={close}
      />
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'w-[72px]' : 'w-64'}`}
      >
        {/* Logo 区 */}
        <div
          className={`flex items-start pt-6 pb-4 ${
            collapsed
              ? 'px-2 justify-center'
              : 'px-6 justify-between'
          }`}
        >
          {!collapsed && (
            <Link
              to="/"
              className="flex items-center gap-3"
              onClick={close}
            >
              <img
                src="/images/sidebar/logo.png"
                alt=""
                className="h-10 w-auto shrink-0"
              />
              <div className="flex flex-col">
                <span className="flex items-center gap-1 text-xl font-bold leading-none text-gray-800 dark:text-gray-100">
                  SoraBlog
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-teal-400"
                  >
                    <path
                      d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span className="mt-1 text-xs text-gray-400 tracking-wide">
                  记录 · 思考 · 成长
                </span>
              </div>
            </Link>
          )}
          <button
            type="button"
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 lg:hidden dark:hover:bg-gray-800 dark:hover:text-gray-50"
            onClick={close}
            aria-label="关闭导航"
            title="关闭导航"
          >
            <X size={18} />
          </button>
          <button
            type="button"
            className="hidden rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 lg:flex dark:hover:bg-gray-800 dark:hover:text-gray-50"
            onClick={toggleCollapsed}
            aria-label={collapsed ? '展开侧边栏' : '收起侧边栏'}
            title={collapsed ? '展开侧边栏' : '收起侧边栏'}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* 主导航菜单 */}
        <nav className={`flex flex-1 flex-col gap-1 ${collapsed ? 'px-2' : 'px-4'}`}>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={close}
                title={item.label}
                className={`flex items-center rounded-xl py-3 text-[15px] font-medium transition-colors ${
                  collapsed ? 'justify-center px-2' : 'gap-4 px-5'
                } ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-200'
                }`}
              >
                <Icon size={19} strokeWidth={1.8} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* 装饰插画区 */}
        {!collapsed && (
          <div className="relative -mt-3 flex justify-start px-4">
            <img
              src="/images/sidebar/cat.png"
              alt=""
              className="h-44 w-auto object-contain"
            />
            <img
              src="/images/sidebar/stars.png"
              alt=""
              className="pointer-events-none absolute -top-5 right-0 h-auto w-40"
            />
          </div>
        )}

        {/* 语录卡片 */}
        {!collapsed && (
          <div className="mx-5 mt-3 rounded-2xl bg-gray-50 px-4 py-2 dark:bg-gray-800/50">
            <div className="flex flex-col items-center gap-0.5">
              <span className="self-start text-2xl font-bold leading-none text-gray-400 dark:text-gray-500">
                &ldquo;
              </span>
              <p className="line-clamp-2 px-2 text-center text-xs font-medium leading-relaxed text-gray-600 dark:text-gray-300">
                生活明朗，万物可爱，保持热爱，奔赴山海。
              </p>
              <span className="self-end text-2xl font-bold leading-none text-gray-400 dark:text-gray-500">
                &rdquo;
              </span>
            </div>
          </div>
        )}

        {/* 版权信息 */}
        {!collapsed && (
          <div className="mt-auto py-4 text-center">
            <p className="text-[10px] text-muted-foreground">
              © {new Date().getFullYear()} SoraBlog
            </p>
          </div>
        )}
      </aside>
    </>
  )
}
