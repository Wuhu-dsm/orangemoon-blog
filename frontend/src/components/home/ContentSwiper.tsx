import { useState, useCallback, type ReactNode } from 'react'
import { motion, type PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ContentSwiperProps {
  children: ReactNode[]
  itemsPerPage?: number
  showArrows?: boolean
  showDots?: boolean
  className?: string
}

export default function ContentSwiper({
  children,
  itemsPerPage = 3,
  showArrows = true,
  showDots = true,
  className = '',
}: ContentSwiperProps) {
  const [page, setPage] = useState(0)
  const total = children.length
  const maxPage = Math.max(0, Math.ceil(total / itemsPerPage) - 1)

  const goPrev = useCallback(() => {
    setPage((p) => Math.max(0, p - 1))
  }, [])

  const goNext = useCallback(() => {
    setPage((p) => Math.min(maxPage, p + 1))
  }, [maxPage])

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const threshold = 50
      if (info.offset.x < -threshold) {
        goNext()
      } else if (info.offset.x > threshold) {
        goPrev()
      }
    },
    [goPrev, goNext]
  )

  if (total === 0) return null

  const itemWidthPercent = 100 / itemsPerPage
  const translateX = -(page * 100)

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="relative px-7">
        {/* 左箭头 */}
        {showArrows && maxPage > 0 && (
          <button
            type="button"
            onClick={goPrev}
            disabled={page === 0}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-1 text-muted-foreground shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-foreground disabled:opacity-0 dark:bg-gray-800/90 dark:hover:bg-gray-800"
            aria-label="上一页"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        {/* 右箭头 */}
        {showArrows && maxPage > 0 && (
          <button
            type="button"
            onClick={goNext}
            disabled={page === maxPage}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-1 text-muted-foreground shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-foreground disabled:opacity-0 dark:bg-gray-800/90 dark:hover:bg-gray-800"
            aria-label="下一页"
          >
            <ChevronRight size={16} />
          </button>
        )}

        <div className="overflow-hidden">
          <motion.div
            className="flex h-full cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            animate={{ x: `${translateX}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {children.map((child, idx) => (
              <div
                key={idx}
                className="h-full shrink-0 px-1.5"
                style={{ width: `${itemWidthPercent}%` }}
              >
                {child}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 分页点 */}
      {showDots && maxPage > 0 && (
        <div className="mt-2 flex items-center justify-center gap-1.5">
          {Array.from({ length: maxPage + 1 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPage(idx)}
              className={`block h-1.5 rounded-full transition-all ${
                idx === page ? 'w-4 bg-primary' : 'w-1.5 bg-primary/30'
              }`}
              aria-label={`切换到第 ${idx + 1} 页`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
