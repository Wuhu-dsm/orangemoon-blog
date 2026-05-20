import { ArrowRight } from 'lucide-react'
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
  {
    id: 4,
    name: 'Markdown 编辑器',
    status: '进行中',
    description: '支持实时预览的轻量 Markdown 编辑器',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  },
  {
    id: 5,
    name: '个人博客 v2.0',
    status: '已完成',
    description: '使用 Next.js 重构的全栈博客系统',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
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
      <div className="h-[60px]">
        <div 
          className="grid grid-cols-3 gap-3 h-[100px]" 
          style={{ transform: 'scale(0.6)', transformOrigin: 'top left', width: '166.666666%' }}
        >
          {projects.slice(0, 3).map((project) => (
            <Card
              key={project.id}
              className="flex h-full flex-col justify-center border-border/60 bg-white transition hover:shadow-md dark:bg-gray-900"
            >
              <CardContent className="flex flex-col gap-1.5 p-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold">{project.name}</h4>
                  <Badge variant="secondary" className={`text-[10px] ${project.color}`}>
                    {project.status}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {project.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
