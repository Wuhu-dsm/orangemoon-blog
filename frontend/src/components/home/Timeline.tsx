import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const events = [
  {
    time: '2024-06',
    content: '发布了新文章《我用 Next.js 14 重构了个人博客》',
  },
  {
    time: '2024-05',
    content: '完成了 Windy 团队管理系统',
  },
  {
    time: '2024-04',
    content: '新增了 3 篇笔记',
  },
  {
    time: '2024-03',
    content: '博客访问量突破 10,000 🎉',
  },
]

export default function Timeline() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold">时间轴</h4>
        <Link
          to="/timeline"
          className="flex items-center gap-0.5 text-[10px] text-muted-foreground transition hover:text-primary"
        >
          查看全部 <ArrowRight size={10} />
        </Link>
      </div>
      <div className="relative mt-3 space-y-3 pl-3">
        {/* Vertical line */}
        <div className="absolute left-[5px] top-1.5 h-[calc(100%-12px)] w-px bg-border" />
        {events.map((e, idx) => (
          <div key={idx} className="relative">
            <span className="absolute -left-3 top-1.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-card" />
            <p className="text-[10px] font-medium text-muted-foreground">
              {e.time}
            </p>
            <p className="mt-0.5 text-[10px] leading-relaxed text-foreground">
              {e.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
