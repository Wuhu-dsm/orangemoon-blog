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
  { name: '旅行', count: 7 },
  { name: '动画', count: 6 },
  { name: '工具', count: 5 },
  { name: '思考', count: 4 },
]

const colorThemes = [
  {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    darkBg: 'dark:bg-sky-900/20',
    darkText: 'dark:text-sky-300',
    hoverBg: 'hover:bg-sky-100',
    darkHoverBg: 'dark:hover:bg-sky-900/30',
  },
  {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    darkBg: 'dark:bg-emerald-900/20',
    darkText: 'dark:text-emerald-300',
    hoverBg: 'hover:bg-emerald-100',
    darkHoverBg: 'dark:hover:bg-emerald-900/30',
  },
  {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    darkBg: 'dark:bg-violet-900/20',
    darkText: 'dark:text-violet-300',
    hoverBg: 'hover:bg-violet-100',
    darkHoverBg: 'dark:hover:bg-violet-900/30',
  },
  {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    darkBg: 'dark:bg-amber-900/20',
    darkText: 'dark:text-amber-300',
    hoverBg: 'hover:bg-amber-100',
    darkHoverBg: 'dark:hover:bg-amber-900/30',
  },
  {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    darkBg: 'dark:bg-rose-900/20',
    darkText: 'dark:text-rose-300',
    hoverBg: 'hover:bg-rose-100',
    darkHoverBg: 'dark:hover:bg-rose-900/30',
  },
  {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    darkBg: 'dark:bg-cyan-900/20',
    darkText: 'dark:text-cyan-300',
    hoverBg: 'hover:bg-cyan-100',
    darkHoverBg: 'dark:hover:bg-cyan-900/30',
  },
  {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    darkBg: 'dark:bg-orange-900/20',
    darkText: 'dark:text-orange-300',
    hoverBg: 'hover:bg-orange-100',
    darkHoverBg: 'dark:hover:bg-orange-900/30',
  },
  {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    darkBg: 'dark:bg-teal-900/20',
    darkText: 'dark:text-teal-300',
    hoverBg: 'hover:bg-teal-100',
    darkHoverBg: 'dark:hover:bg-teal-900/30',
  },
  {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    darkBg: 'dark:bg-indigo-900/20',
    darkText: 'dark:text-indigo-300',
    hoverBg: 'hover:bg-indigo-100',
    darkHoverBg: 'dark:hover:bg-indigo-900/30',
  },
  {
    bg: 'bg-lime-50',
    text: 'text-lime-700',
    darkBg: 'dark:bg-lime-900/20',
    darkText: 'dark:text-lime-300',
    hoverBg: 'hover:bg-lime-100',
    darkHoverBg: 'dark:hover:bg-lime-900/30',
  },
]

function getTagSize(count: number) {
  if (count >= 15) return 'text-[11px] px-3 py-1.5'
  if (count >= 10) return 'text-[10px] px-2.5 py-1'
  if (count >= 5) return 'text-[10px] px-2 py-1'
  return 'text-[9px] px-2 py-0.5'
}

export default function TagCloud() {
  return (
    <SectionCard padding="sm">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-xs font-semibold">标签云</h4>
        <Link
          to="/articles"
          className="flex items-center gap-0.5 text-[10px] text-muted-foreground transition hover:text-primary"
        >
          更多标签 <ArrowRight size={10} />
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => {
          const theme = colorThemes[index % colorThemes.length]
          const sizeClasses = getTagSize(tag.count)
          return (
            <Link
              key={tag.name}
              to={`/articles?tag=${encodeURIComponent(tag.name)}`}
              className={`
                inline-flex items-center gap-1 rounded-full font-medium
                transition-all duration-200 ease-out
                hover:-translate-y-0.5 hover:shadow-sm hover:scale-105
                active:scale-95
                ${sizeClasses}
                ${theme.bg} ${theme.text} ${theme.darkBg} ${theme.darkText}
                ${theme.hoverBg} ${theme.darkHoverBg}
              `}
            >
              {tag.name}
              <span className="text-[9px] opacity-60">{tag.count}</span>
            </Link>
          )
        })}
      </div>
    </SectionCard>
  )
}
