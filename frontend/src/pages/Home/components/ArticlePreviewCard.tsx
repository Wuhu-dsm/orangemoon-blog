import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ArticlePreview } from '../types'
import styles from '../Home.module.css'

const toneClass: Record<ArticlePreview['tone'], string> = {
  studio: styles.thumbnailStudio,
  ocean: styles.thumbnailOcean,
  room: styles.thumbnailRoom,
}

type ArticlePreviewCardProps = {
  article: ArticlePreview
}

export default function ArticlePreviewCard({ article }: ArticlePreviewCardProps) {
  return (
    <article className="min-w-0">
      <div className={cn('h-[118px]', toneClass[article.tone])}>
        <span className="absolute left-3 top-3 rounded-lg bg-[#38b7aa] px-3 py-1 text-xs font-black text-white shadow">
          {article.category}
        </span>
      </div>
      <h3 className="mt-3 line-clamp-1 text-base font-black text-[#102a56]">
        {article.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-[#667a9d]">
        {article.excerpt}
      </p>
      <div className="mt-3 flex items-center justify-between text-xs font-bold text-[#7d90ad]">
        <span>{article.date}</span>
        <span className="inline-flex items-center gap-1">
          <Eye size={14} aria-hidden="true" />
          {article.views}
        </span>
      </div>
    </article>
  )
}
