import { useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'

const projects = [
  {
    id: 1,
    name: 'SoraUI 组件库',
    status: '进行中',
    description: '基于 React + TS 的轻量级组件库',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  },
  {
    id: 2,
    name: 'Windy 团队管理系统',
    status: '已完成',
    description: '一款简洁美观的团队管理工具',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  },
  {
    id: 3,
    name: 'Anime.js 动画集',
    status: '已完成',
    description: '收集整理的动画效果与实战示例',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  },
]

export default function FeaturedProjects() {
  const [page, setPage] = useState(0)
  const perPage = 2
  const maxPage = Math.ceil(projects.length / perPage) - 1
  const visible = projects.slice(page * perPage, page * perPage + perPage)

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">精选项目</h3>
        <Link
          to="/projects"
          className="flex items-center gap-1 text-sm text-muted-foreground transition hover:text-primary"
        >
          查看全部 <ArrowRight size={14} />
        </Link>
      </div>
      <div className="relative">
        <div className="grid gap-4 sm:grid-cols-2">
          {visible.map((project) => (
            <Card
              key={project.id}
              className="border-border/60 bg-card transition hover:shadow-md"
            >
              <CardContent className="flex flex-col gap-2 p-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">{project.name}</h4>
                  <Badge variant="secondary" className={project.color}>
                    {project.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {project.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Carousel controls */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-full p-1 text-muted-foreground transition hover:bg-accent disabled:opacity-30"
            aria-label="上一页"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-1.5">
            {Array.from({ length: maxPage + 1 }).map((_, idx) => (
              <span
                key={idx}
                className={`block h-1.5 rounded-full transition-all ${
                  idx === page ? 'w-4 bg-primary' : 'w-1.5 bg-primary/30'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
            disabled={page === maxPage}
            className="rounded-full p-1 text-muted-foreground transition hover:bg-accent disabled:opacity-30"
            aria-label="下一页"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
