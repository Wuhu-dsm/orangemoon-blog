import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'
import { cn } from '../../lib/utils'
import ContentSwiper from './ContentSwiper'

interface Project {
  id: number
  name: string
  status: string
  description: string
  cover: string
  coverPosition: string
  statusClassName: string
}

interface FeaturedProjectsProps {
  className?: string
}

const projects: Project[] = [
  {
    id: 1,
    name: 'SoraUI 组件库',
    status: '进行中',
    description: '基于 React + TS 的轻量级组件库',
    cover: '/images/home/01-home-dashboard.png',
    coverPosition: '25% 78%',
    statusClassName:
      'bg-teal-500/90 text-white shadow-sm hover:bg-teal-500/90 dark:bg-teal-400/90 dark:text-teal-950',
  },
  {
    id: 2,
    name: 'Windy 团队管理系统',
    status: '已完成',
    description: '一款简洁美观的团队管理工具',
    cover: '/images/home/banner-bg.png',
    coverPosition: '52% 55%',
    statusClassName:
      'bg-emerald-500/90 text-white shadow-sm hover:bg-emerald-500/90 dark:bg-emerald-400/90 dark:text-emerald-950',
  },
  {
    id: 3,
    name: 'Anime.js 动画集',
    status: '已完成',
    description: '收集整理的动画效果与实战示例',
    cover: '/images/home/avatar.png',
    coverPosition: '50% 42%',
    statusClassName:
      'bg-emerald-500/90 text-white shadow-sm hover:bg-emerald-500/90 dark:bg-emerald-400/90 dark:text-emerald-950',
  },
  {
    id: 4,
    name: 'Markdown 编辑器',
    status: '进行中',
    description: '支持实时预览的轻量 Markdown 编辑器',
    cover: '/images/home/profile.png',
    coverPosition: '70% 12%',
    statusClassName:
      'bg-teal-500/90 text-white shadow-sm hover:bg-teal-500/90 dark:bg-teal-400/90 dark:text-teal-950',
  },
  {
    id: 5,
    name: '个人博客 v2.0',
    status: '已完成',
    description: '使用 Next.js 重构的全栈博客系统',
    cover: '/images/home/01-home-dashboard.png',
    coverPosition: '47% 72%',
    statusClassName:
      'bg-emerald-500/90 text-white shadow-sm hover:bg-emerald-500/90 dark:bg-emerald-400/90 dark:text-emerald-950',
  },
]

export default function FeaturedProjects({ className }: FeaturedProjectsProps) {
  return (
    <section
      className={cn(
        'rounded-[24px] border border-white/60 bg-white/60 p-5 shadow-[0_12px_40px_rgba(125,211,252,0.2)] backdrop-blur-xl dark:ring-white/10',
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-semibold text-[#1E293B]">
          <Sparkles size={16} className="text-cyan-400" />
          精选项目
        </h3>
        <Link
          to="/projects"
          className="flex items-center gap-1 text-xs text-muted-foreground transition hover:text-primary"
        >
          查看全部 <ArrowRight size={12} />
        </Link>
      </div>
      <ContentSwiper itemsPerPage={3} className="h-[260px]">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="group relative flex h-full flex-col gap-0 overflow-hidden rounded-[24px] border border-white/50 bg-white/40 py-0 shadow-[0_8px_32px_rgba(125,211,252,0.15)] backdrop-blur-xl transition-all duration-300 ease-out hover:translate-y-[-6px] hover:shadow-[0_16px_48px_rgba(125,211,252,0.25)] group-[.is-active]:shadow-[0_16px_48px_rgba(125,211,252,0.3)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[24px] before:bg-gradient-to-b before:from-white/25 before:to-transparent dark:bg-white/10"
          >
            <div className="relative h-[180px] shrink-0 overflow-hidden rounded-t-[24px] bg-muted group-[.is-active]:h-full">
              <img
                src={project.cover}
                alt=""
                width={320}
                height={140}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                style={{ objectPosition: project.coverPosition }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-transparent to-transparent group-[.is-active]:from-transparent group-[.is-active]:via-transparent group-[.is-active]:to-black/60" />
              <Badge
                variant="secondary"
                className={cn(
                  'absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]',
                  project.status === '进行中'
                    ? 'bg-gradient-to-r from-sky-400 to-blue-500'
                    : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                )}
              >
                {project.status}
              </Badge>
              {/* Active card overlay */}
              <div className="hidden absolute inset-x-0 bottom-0 flex-col justify-end p-5 group-[.is-active]:flex">
                <h4 className="text-lg font-bold text-white drop-shadow-md">{project.name}</h4>
                <p className="mt-1 text-sm text-white/80 drop-shadow">{project.description}</p>
                <div className="mt-3 inline-flex items-center gap-1 self-start rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 px-4 py-1.5 text-sm font-medium text-white shadow-lg">
                  探索项目详情 <ArrowRight size={14} />
                </div>
              </div>
            </div>
            <CardContent className="flex min-h-0 flex-1 flex-col p-3 group-[.is-active]:hidden">
              <div className="min-w-0">
                <h4 className="truncate text-xs font-bold text-[#1E293B]">{project.name}</h4>
                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#64748B]">
                  {project.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </ContentSwiper>
    </section>
  )
}