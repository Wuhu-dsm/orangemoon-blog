import { Children, type ReactNode } from 'react'

import { cn } from '../../lib/utils'

interface ShowcaseGridProps {
  children: ReactNode
  className?: string
  activeIndex?: number
}

export default function ShowcaseGrid({
  children,
  className,
  activeIndex = 1,
}: ShowcaseGridProps) {
  const items = Children.toArray(children).slice(0, 3)

  if (items.length === 0) return null

  const activeItemIndex = Math.min(activeIndex, items.length - 1)

  return (
    <div
      className={cn(
        'grid min-w-0 grid-cols-3 px-[17px]',
        className
      )}
    >
      {items.map((child, index) => {
        const isActive = index === activeItemIndex
        const isSide = !isActive

        return (
          <div
            key={index}
            className={cn(
              'group h-full min-w-0 origin-center px-1 transition-all duration-300 transform-gpu will-change-transform [backface-visibility:hidden]',
              isActive && 'is-active z-20 scale-100 opacity-100',
              isSide && 'is-side z-10 scale-[0.9] opacity-100',
              isSide &&
                '[&_*]:[-webkit-font-smoothing:antialiased] [&_*]:[backface-visibility:hidden] [&_*]:[text-rendering:geometricPrecision] [&_*]:[text-shadow:0_0_0_currentColor]',
              isSide && index % 2 === 0 && '-rotate-2',
              isSide && index % 2 === 1 && 'rotate-2'
            )}
          >
            {child}
          </div>
        )
      })}
    </div>
  )
}
