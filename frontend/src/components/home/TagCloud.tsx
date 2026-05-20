import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionCard from '@/components/ui/section-card'

interface Tag {
  name: string
  count: number
}

const tags: Tag[] = [
  { name: '前端开发', count: 23 },
  { name: '生活', count: 18 },
  { name: '设计', count: 15 },
  { name: '随笔', count: 12 },
  { name: 'Next.js', count: 10 },
  { name: 'TypeScript', count: 9 },
  { name: '旅行', count: 8 },
  { name: '动画', count: 7 },
  { name: '工具', count: 6 },
  { name: '思考', count: 6 },
]

const colorThemes = [
  {
    bg: 'bg-primary/10',
    text: 'text-primary',
    darkBg: 'dark:bg-primary/20',
    darkText: 'dark:text-primary',
    hoverBg: 'hover:bg-primary/20',
    darkHoverBg: 'dark:hover:bg-primary/30',
  },
  {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    darkBg: 'dark:bg-slate-800/50',
    darkText: 'dark:text-slate-300',
    hoverBg: 'hover:bg-slate-200',
    darkHoverBg: 'dark:hover:bg-slate-800/70',
  },
  {
    bg: 'bg-primary/10',
    text: 'text-primary',
    darkBg: 'dark:bg-primary/20',
    darkText: 'dark:text-primary',
    hoverBg: 'hover:bg-primary/20',
    darkHoverBg: 'dark:hover:bg-primary/30',
  },
  {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    darkBg: 'dark:bg-slate-800/50',
    darkText: 'dark:text-slate-300',
    hoverBg: 'hover:bg-slate-200',
    darkHoverBg: 'dark:hover:bg-slate-800/70',
  },
  {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    darkBg: 'dark:bg-blue-900/20',
    darkText: 'dark:text-blue-400',
    hoverBg: 'hover:bg-blue-100',
    darkHoverBg: 'dark:hover:bg-blue-900/30',
  },
  {
    bg: 'bg-primary/10',
    text: 'text-primary',
    darkBg: 'dark:bg-primary/20',
    darkText: 'dark:text-primary',
    hoverBg: 'hover:bg-primary/20',
    darkHoverBg: 'dark:hover:bg-primary/30',
  },
  {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    darkBg: 'dark:bg-blue-900/20',
    darkText: 'dark:text-blue-400',
    hoverBg: 'hover:bg-blue-100',
    darkHoverBg: 'dark:hover:bg-blue-900/30',
  },
  {
    bg: 'bg-primary/10',
    text: 'text-primary',
    darkBg: 'dark:bg-primary/20',
    darkText: 'dark:text-primary',
    hoverBg: 'hover:bg-primary/20',
    darkHoverBg: 'dark:hover:bg-primary/30',
  },
  {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    darkBg: 'dark:bg-blue-900/20',
    darkText: 'dark:text-blue-400',
    hoverBg: 'hover:bg-blue-100',
    darkHoverBg: 'dark:hover:bg-blue-900/30',
  },
  {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    darkBg: 'dark:bg-blue-900/20',
    darkText: 'dark:text-blue-400',
    hoverBg: 'hover:bg-blue-100',
    darkHoverBg: 'dark:hover:bg-blue-900/30',
  },
]

export default function TagCloud() {
  return (
    <SectionCard padding="none" className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-semibold">标签云</h4>
        <Link
          to="/articles"
          className="flex items-center gap-1 text-xs text-muted-foreground transition hover:text-primary"
        >
          更多标签 <ArrowRight size={12} />
        </Link>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {tags.map((tag, index) => {
          const theme = colorThemes[index % colorThemes.length]
          return (
            <Link
              key={tag.name}
              to={`/articles?tag=${encodeURIComponent(tag.name)}`}
              className={`
                inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium
                transition-all duration-200 ease-out
                hover:-translate-y-0.5 hover:shadow-sm hover:scale-105
                active:scale-95
                ${theme.bg} ${theme.text} ${theme.darkBg} ${theme.darkText}
                ${theme.hoverBg} ${theme.darkHoverBg}
              `}
            >
              {tag.name}
              <span className="text-[10px] opacity-60">{tag.count}</span>
            </Link>
          )
        })}
      </div>
    </SectionCard>
  )
}
