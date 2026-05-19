import { articles } from '../data'
import styles from '../Home.module.css'
import ArticlePreviewCard from './ArticlePreviewCard'
import SectionHeader from './SectionHeader'

export default function ArticleSection() {
  return (
    <section id="latest-articles" className={`${styles.glassPanel} scroll-mt-6 p-5`}>
      <div className="flex items-start justify-between gap-3">
        <SectionHeader title="最新文章" />
        <a
          href="/articles"
          className="mt-1 text-sm font-semibold text-[#42bfb2] transition hover:text-[#219e95] focus:outline-none focus:ring-2 focus:ring-[#72d9ce]/60"
        >
          查看全部
        </a>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {articles.map((article) => (
          <ArticlePreviewCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  )
}
