import { type ReactNode } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'
import { cn } from '../../lib/utils'
import ShowcaseGrid from './ShowcaseGrid'
import { usePublicProjects, type PublicProject } from '@/hooks/usePublicContent'

interface FeaturedProjectsProps {
  className?: string
}

const projectStatusLabels: Record<string, string> = {
  pending: '待启动',
  developing: '开发中',
  updating: '更新中',
  archived: '已归档',
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'pending':
    case 'developing':
      return 'bg-gradient-to-r from-sky-400 to-blue-500'
    case 'updating':
      return 'bg-gradient-to-r from-emerald-400 to-teal-500'
    case 'archived':
      return 'bg-gradient-to-r from-slate-400 to-gray-500'
    default:
      return 'bg-gradient-to-r from-sky-400 to-blue-500'
  }
}

interface DisplayProject {
  id: string
  name: string
  status: string
  description: string
  cover: string
  coverPosition: string
  statusClassName: string
}

function mapToDisplayProject(project: PublicProject): DisplayProject {
  const status = project.projectStatus ?? 'pending'
  return {
    id: project._id,
    name: project.title,
    status: projectStatusLabels[status] ?? '待启动',
    description: project.summary ?? '',
    cover: project.coverImage ?? '',
    coverPosition: 'center',
    statusClassName: getStatusBadgeClass(status),
  }
}

function FeaturedProjectsShell({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <section
      className={cn(
        'rounded-[14px] border border-white/60 bg-white/60 p-3 shadow-[0_12px_40px_rgba(125,211,252,0.2)] backdrop-blur-xl dark:ring-white/10',
        className
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-[#1E293B]">
          <Sparkles size={14} className="text-cyan-400" />
          精选项目
        </h3>
        <Link
          to="/projects"
          className="flex items-center gap-1 text-[11px] text-muted-foreground transition hover:text-primary"
        >
          查看全部 <ArrowRight size={12} />
        </Link>
      </div>
      {children}
    </section>
  )
}

export default function FeaturedProjects({ className }: FeaturedProjectsProps) {
  const { data, isLoading, isError } = usePublicProjects({ pageSize: 10 })

  const displayProjects = (data?.items ?? []).map(mapToDisplayProject)
  const visibleProjects = displayProjects.slice(0, 3)

  // Error state: API failed — keep section visible with non-breaking fallback
  if (isError && !isLoading) {
    return (
      <FeaturedProjectsShell className={className}>
        <div className="flex h-[156px] items-center justify-center rounded-[14px] border border-dashed border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
          <p className="text-xs text-muted-foreground">项目加载失败，请稍后重试</p>
        </div>
      </FeaturedProjectsShell>
    )
  }

  // Loading state: render skeleton cards
  if (isLoading) {
    return (
      <FeaturedProjectsShell className={className}>
        <ShowcaseGrid className="h-[156px]">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex h-full flex-col gap-0 overflow-hidden rounded-[14px] border border-white/50 bg-white/40 py-0"
            >
              <div className="h-[108px] shrink-0 animate-pulse rounded-t-[14px] bg-gray-200 dark:bg-gray-800" />
              <div className="flex min-h-0 flex-1 flex-col gap-1 p-2">
                <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-2.5 w-24 animate-pulse rounded bg-gray-100 dark:bg-gray-800/60" />
              </div>
            </div>
          ))}
        </ShowcaseGrid>
      </FeaturedProjectsShell>
    )
  }

  // Empty state: no published projects — keep section visible so layout stays stable
  if (visibleProjects.length === 0) {
    return (
      <FeaturedProjectsShell className={className}>
        <div className="flex h-[156px] items-center justify-center rounded-[14px] border border-dashed border-slate-200 bg-white/40 dark:border-slate-700 dark:bg-white/5">
          <p className="text-xs text-muted-foreground">项目正在整理中</p>
        </div>
      </FeaturedProjectsShell>
    )
  }

  return (
    <FeaturedProjectsShell className={className}>
      <ShowcaseGrid className="h-[156px]">
        {visibleProjects.map((project) => (
          <Card
            key={project.id}
            className="group relative flex h-full flex-col gap-0 overflow-hidden rounded-[14px] border border-white/50 bg-white/40 py-0 shadow-[0_5px_20px_rgba(125,211,252,0.14)] backdrop-blur-xl transition-all duration-300 ease-out hover:translate-y-[-3px] hover:shadow-[0_10px_30px_rgba(125,211,252,0.22)] group-[.is-active]:shadow-[0_10px_30px_rgba(125,211,252,0.28)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[14px] before:bg-gradient-to-b before:from-white/25 before:to-transparent dark:bg-white/10"
          >
            <div className="relative h-[108px] shrink-0 overflow-hidden rounded-t-[14px] bg-muted group-[.is-active]:h-full">
              {project.cover ? (
                <img
                  src={project.cover}
                  alt=""
                  width={320}
                  height={140}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  style={{ objectPosition: project.coverPosition }}
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-sky-100 to-blue-200 dark:from-sky-900/30 dark:to-blue-900/20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-transparent to-transparent group-[.is-active]:from-transparent group-[.is-active]:via-transparent group-[.is-active]:to-black/60" />
              <Badge
                variant="secondary"
                className={cn(
                  'absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]',
                  project.statusClassName
                )}
              >
                {project.status}
              </Badge>
              {/* Active card overlay */}
              <div className="absolute inset-x-0 bottom-0 hidden flex-col justify-end p-3 group-[.is-active]:flex">
                <h4 className="text-sm font-bold text-white drop-shadow-md">{project.name}</h4>
                <p className="mt-0.5 line-clamp-2 text-xs text-white/80 drop-shadow">{project.description}</p>
                <div className="mt-2 inline-flex items-center gap-1 self-start rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 px-2.5 py-1 text-xs font-medium text-white shadow-lg">
                  探索项目详情 <ArrowRight size={14} />
                </div>
              </div>
            </div>
            <CardContent className="flex min-h-0 flex-1 flex-col p-2 group-[.is-active]:hidden">
              <div className="min-w-0">
                <h4 className="truncate text-[11px] font-bold text-[#1E293B]">{project.name}</h4>
                <p className="mt-0.5 line-clamp-1 text-[10px] leading-relaxed text-[#64748B]">
                  {project.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </ShowcaseGrid>
    </FeaturedProjectsShell>
  )
}
