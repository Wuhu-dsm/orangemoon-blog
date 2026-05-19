import { Link, useLocation } from 'react-router-dom'
import logoFeather from '@/assets/home/logo-feather.png'
import mascotReading from '@/assets/home/mascot-reading.png'
import { cn } from '@/lib/utils'
import { dockActions, navItems } from '../data'
import styles from '../Home.module.css'
import IconActionButton from './IconActionButton'

export default function HomeSidebar() {
  const location = useLocation()

  return (
    <aside className={cn(styles.sidebar, 'flex flex-col px-5 py-6')}>
      <Link
        to="/"
        className="flex items-center gap-3 rounded-2xl px-2 py-1 text-[#14335f] transition hover:text-[#18a89f]"
        aria-label="SoraBlog 首页"
      >
        <img
          src={logoFeather}
          alt=""
          className="size-12 rounded-2xl object-cover shadow-md shadow-sky-100"
          aria-hidden="true"
        />
        <span className="min-w-0">
          <span className="block text-xl font-bold leading-6">SoraBlog</span>
          <span className="block text-xs font-medium text-[#6f8aaa]">
            记录 · 思考 · 成长
          </span>
        </span>
      </Link>

      <nav className="mt-7 flex flex-col gap-1.5" aria-label="主导航">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.path === '/'
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-[#e8fbff] text-[#0d7e9f] shadow-sm shadow-sky-100'
                  : 'text-[#526b8f] hover:bg-white/80 hover:text-[#18a89f]',
              )}
            >
              <span
                className={cn(
                  'inline-flex size-9 items-center justify-center rounded-xl transition',
                  isActive
                    ? 'bg-white text-[#20b8aa]'
                    : 'bg-[#f2f8fc] text-[#7a91ac] group-hover:bg-white group-hover:text-[#20b8aa]',
                )}
              >
                <Icon size={18} strokeWidth={1.9} />
              </span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-7 overflow-hidden rounded-[24px] border border-[#cfe6f4] bg-gradient-to-b from-white to-[#edfaff] p-4 shadow-sm">
        <img
          src={mascotReading}
          alt="正在阅读的 SoraBlog 吉祥物"
          className="mx-auto h-28 w-full object-contain"
        />
        <div className="mt-3 rounded-2xl bg-white/82 p-3 text-center shadow-sm">
          <p className="text-xs font-medium leading-5 text-[#587392]">
            “把每天的小想法认真收藏，时间会替你写成长长的答案。”
          </p>
        </div>
      </div>

      <div className="mt-auto pt-7">
        <div className="grid grid-cols-4 gap-2">
          {dockActions.map((action) => (
            <IconActionButton
              key={action.label}
              icon={action.icon}
              label={action.label}
              className="size-10 rounded-xl"
            />
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-[#8aa0b8]">
          © 2026 SoraBlog
        </p>
      </div>
    </aside>
  )
}
