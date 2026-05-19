import { timelineItems } from '../data'
import styles from '../Home.module.css'
import SectionHeader from './SectionHeader'

export default function TimelineCard() {
  return (
    <section className={`${styles.glassPanel} relative overflow-hidden p-5`}>
      <div className="flex items-start justify-between gap-3">
        <SectionHeader title="时间轴" />
        <a
          href="/timeline"
          className="mt-1 text-sm font-semibold text-[#42bfb2] transition hover:text-[#219e95] focus:outline-none focus:ring-2 focus:ring-[#72d9ce]/60"
        >
          查看全部
        </a>
      </div>
      <div className="space-y-4 border-l-2 border-[#8bdad0] pl-5">
        {timelineItems.map((item) => (
          <article key={item.month} className="relative">
            <span className="absolute -left-[30px] top-1 size-3 rounded-full bg-[#50c7bb] ring-4 ring-[#e2f8f4]" />
            <h3 className="text-sm font-black text-[#304a76]">{item.month}</h3>
            <p className="mt-1 text-sm font-semibold leading-6 text-[#6a7f9f]">{item.content}</p>
          </article>
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-3 right-4 h-16 w-14 rounded-full bg-[#d8f3ed] opacity-75" />
    </section>
  )
}
