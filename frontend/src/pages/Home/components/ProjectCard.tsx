import { cn } from '@/lib/utils'
import type { ProjectPreview } from '../types'
import styles from '../Home.module.css'

const toneClass: Record<ProjectPreview['tone'], string> = {
  library: styles.thumbnailLibrary,
  system: styles.thumbnailSystem,
  anime: styles.thumbnailAnime,
}

type ProjectCardProps = {
  project: ProjectPreview
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="min-w-0">
      <div className={cn('h-[92px]', toneClass[project.tone])}>
        <span className="absolute left-3 top-3 rounded-lg bg-[#52cbbb] px-3 py-1 text-xs font-black text-white">
          {project.status}
        </span>
      </div>
      <h3 className="mt-3 line-clamp-1 text-base font-black text-[#102a56]">
        {project.title}
      </h3>
      <p className="mt-1 line-clamp-1 text-xs font-semibold text-[#6d82a2]">
        {project.description}
      </p>
    </article>
  )
}
