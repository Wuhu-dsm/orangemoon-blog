import { cn } from '@/lib/utils'
import { tagCloud } from '../data'
import type { TagSummary } from '../types'
import styles from '../Home.module.css'
import SectionHeader from './SectionHeader'

const toneClass: Record<TagSummary['tone'], string> = {
  mint: 'bg-[#dff7f1] text-[#28a99d]',
  blue: 'bg-[#e4f0ff] text-[#3f82d8]',
  cyan: 'bg-[#e5f8fb] text-[#38a9bc]',
  yellow: 'bg-[#fff5d7] text-[#c79418]',
}

export default function TagCloudCard() {
  return (
    <section className={`${styles.glassPanel} p-5`}>
      <div className="flex items-start justify-between gap-3">
        <SectionHeader title="标签云" />
        <a
          href="/articles"
          className="mt-1 text-sm font-semibold text-[#42bfb2] transition hover:text-[#219e95] focus:outline-none focus:ring-2 focus:ring-[#72d9ce]/60"
        >
          更多标签
        </a>
      </div>
      <div className="flex flex-wrap gap-3">
        {tagCloud.map((tag) => (
          <span
            key={tag.name}
            className={cn('rounded-xl px-4 py-2 text-sm font-black', toneClass[tag.tone])}
          >
            {tag.name}
            <span className="ml-2 opacity-70">{tag.count}</span>
          </span>
        ))}
      </div>
    </section>
  )
}
