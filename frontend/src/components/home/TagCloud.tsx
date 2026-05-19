import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const tags = [
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

export default function TagCloud() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
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
        {tags.map((tag) => (
          <Link
            key={tag.name}
            to={`/articles?tag=${encodeURIComponent(tag.name)}`}
            className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-[10px] text-primary-700 transition hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/30"
          >
            {tag.name}
            <span className="text-[9px] opacity-70">{tag.count}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
