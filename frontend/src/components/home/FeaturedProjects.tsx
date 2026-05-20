import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'
import ContentSwiper from './ContentSwiper'

const projects = [
  {
    id: 1,
    name: 'SoraUI 组件库',
    status: '进行中',
    description: '基于 React + TS 的轻量级组件库',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    cover: '/images/home/01-home-dashboard.png',
  },
  {
    id: 2,
    name: 'Windy 团队管理系统',
    status: '已完成',
    description: '一款简洁美观的团队管理工具',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    cover: '/images/home/banner-bg.png',
  },
  {
    id: 3,
    name: 'Anime.js 动画集',
    status: '已完成',
    description: '收集整理的动画效果与实战示例',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    cover: '/images/home/profile.png',
  },
]

export default function FeaturedProjects() {
  return (
    <section className="rounded-2xl bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold">精选项目</h3>
        <Link
          to="/projects"
          className="flex items-center gap-1 text-xs text-muted-foreground transition hover:text-primary"
        >
          查看全部 <ArrowRight size={12} />
        </Link>
      </div>
      <ContentSwiper itemsPerPage={3} className="h-[180px]">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="group flex h-full flex-col overflow-hidden border-border/60 bg-white transition hover:shadow-md dark:bg-gray-900"
          >
            <div className="relative h-24 overflow-hidden">
              <img
                src={project.cover}
                alt={project.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <Badge variant="secondary" className={`absolute left-2 top-2 text-[10px] ${project.color}`}>
                {project.status}
              </Badge>
            </div>
            <CardContent className="flex flex-col gap-1.5 p-3">
              <h4 className="text-xs font-semibold">{project.name}</h4>
              <p className="text-[11px] text-muted-foreground line-clamp-1">
                {project.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </ContentSwiper>
    </section>
  )
}
