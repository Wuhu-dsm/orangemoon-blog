import { ArrowRight, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'

const articles = [
  {
    id: 1,
    category: '技术',
    title: '我用 Next.js 14 重构了个人博客',
    excerpt: '从 Vite 迁移到 Next.js 的完整过程记录，包括 SSR、ISR 的实践心得。',
    date: '2024/06/01',
    views: '1.2k',
    cover: '/images/home/profile.png',
  },
  {
    id: 2,
    category: '生活',
    title: '去镰仓吧！吹吹海风看看海',
    excerpt: '一次说走就走的旅行，在江之电沿线留下的夏日回忆。',
    date: '2024/05/28',
    views: '982',
    cover: '/images/home/email.png',
  },
  {
    id: 3,
    category: '思考',
    title: '为什么我们总是很难坚持？',
    excerpt: '关于意志力、习惯养成和自我欺骗的一些观察与反思。',
    date: '2024/05/20',
    views: '1.5k',
    cover: '/images/home/avatar.png',
  },
]

export default function LatestArticles() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">最新文章</h3>
        <Link
          to="/articles"
          className="flex items-center gap-1 text-sm text-muted-foreground transition hover:text-primary"
        >
          查看全部 <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Card
            key={article.id}
            className="group overflow-hidden border-border/60 bg-card transition hover:shadow-md"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={article.cover}
                alt={article.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <Badge className="absolute left-3 top-3 bg-primary/90 text-primary-foreground hover:bg-primary">
                {article.category}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h4 className="line-clamp-1 text-sm font-semibold text-foreground">
                {article.title}
              </h4>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {article.excerpt}
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{article.date}</span>
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {article.views}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
