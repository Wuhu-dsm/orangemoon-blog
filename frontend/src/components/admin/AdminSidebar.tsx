import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  FolderOpen,
  Link as LinkIcon,
  MessageSquare,
  Users,
  Menu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

const navItems = [
  { icon: LayoutDashboard, label: '仪表盘', path: '/admin' },
  { icon: FileText, label: '文章', path: '/admin/articles' },
  { icon: BookOpen, label: '笔记', path: '/admin/notes' },
  { icon: FolderOpen, label: '项目', path: '/admin/projects' },
  { icon: LinkIcon, label: '友链', path: '/admin/friends' },
  { icon: MessageSquare, label: '留言', path: '/admin/guestbook' },
  { icon: Users, label: '用户', path: '/admin/users' },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-6">
        <Link
          to="/admin"
          className="text-lg font-bold text-gray-800 dark:text-gray-100"
          onClick={onNavigate}
        >
          SoraBlog 后台
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              title={item.label}
              aria-label={item.label}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-200'
              )}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default function AdminSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile trigger */}
      <div className="fixed left-0 top-0 z-40 flex h-16 items-center px-4 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="打开导航菜单"
              title="打开导航菜单"
            >
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>后台导航</SheetTitle>
            </SheetHeader>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:flex">
        <SidebarContent />
      </aside>
    </>
  )
}
