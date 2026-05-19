import { ChevronLeft, ChevronRight } from 'lucide-react'
import { projects } from '../data'
import styles from '../Home.module.css'
import ProjectCard from './ProjectCard'
import SectionHeader from './SectionHeader'

export default function ProjectCarousel() {
  return (
    <section className={`${styles.glassPanel} p-5`}>
      <div className="flex items-start justify-between gap-3">
        <SectionHeader title="精选项目" />
        <a
          href="/projects"
          className="mt-1 text-sm font-semibold text-[#42bfb2] transition hover:text-[#219e95] focus:outline-none focus:ring-2 focus:ring-[#72d9ce]/60"
        >
          查看全部
        </a>
      </div>
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4">
        <span
          className="inline-flex size-10 items-center justify-center rounded-full border border-[#c8dff0] bg-white/75 text-[#294574] shadow-sm"
          aria-hidden="true"
        >
          <ChevronLeft size={20} strokeWidth={1.9} />
        </span>
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <span
          className="inline-flex size-10 items-center justify-center rounded-full border border-[#c8dff0] bg-white/75 text-[#294574] shadow-sm"
          aria-hidden="true"
        >
          <ChevronRight size={20} strokeWidth={1.9} />
        </span>
      </div>
      <div className="mt-4 flex justify-center gap-2" aria-hidden="true">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className={`h-2 rounded-full ${dot === 1 ? 'w-8 bg-[#50c7bb]' : 'w-2 bg-[#c8dff0]'}`}
          />
        ))}
      </div>
    </section>
  )
}
