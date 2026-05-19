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
      <h4 className="text-xs font-semibold">标签云</h4>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.name}
            to={`/articles?tag=${encodeURIComponent(tag.name)}`}
            className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[10px] text-secondary-foreground transition hover:bg-primary hover:text-primary-foreground"
          >
            {tag.name}
            <span className="text-[9px] opacity-70">{tag.count}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
