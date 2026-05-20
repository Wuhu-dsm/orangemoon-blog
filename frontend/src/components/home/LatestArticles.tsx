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
  {
    id: 4,
    category: '技术',
    title: 'TypeScript 高级类型体操入门',
    excerpt: '从条件类型到模板字面量类型，带你系统掌握 TS 类型编程。',
    date: '2024/05/15',
    views: '2.1k',
    cover: '/images/home/avatar.png',
  },
  {
    id: 5,
    category: '设计',
    title: '聊聊我常用的配色方案',
    excerpt: '分享几个我日常工作中高频使用的配色工具与配色思路。',
    date: '2024/05/10',
    views: '860',
    cover: '/images/home/email.png',
  },
]

export default function LatestArticles() {
  return (
    <section className="rounded-2xl bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold">最新文章</h3>
        <Link
          to="/articles"
          className="flex items-center gap-1 text-xs text-muted-foreground transition hover:text-primary"
        >
          查看全部 <ArrowRight size={12} />
        </Link>
      </div>
      <div className="h-[108px]">
        <div 
          className="grid grid-cols-3 gap-3 h-[180px]" 
          style={{ transform: 'scale(0.6)', transformOrigin: 'top left', width: '166.666666%' }}
        >
          {articles.slice(0, 3).map((article) => (
            <Card
              key={article.id}
              className="group h-full overflow-hidden border-border/60 bg-white transition hover:shadow-md dark:bg-gray-900"
            >
              <div className="relative h-24 overflow-hidden">
                <img
                  src={article.cover}
                  alt={article.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <Badge className="absolute left-2 top-2 bg-primary/90 text-[10px] text-primary-foreground hover:bg-primary">
                  {article.category}
                </Badge>
              </div>
              <CardContent className="p-2.5">
                <h4 className="line-clamp-1 text-xs font-semibold text-foreground">
                  {article.title}
                </h4>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                  {article.excerpt}
                </p>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{article.date}</span>
                  <span className="flex items-center gap-0.5">
                    <Eye size={10} />
                    {article.views}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
