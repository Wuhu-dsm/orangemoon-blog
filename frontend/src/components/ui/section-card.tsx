import { cn } from '@/lib/utils'

interface SectionCardProps {
  children: React.ReactNode
  className?: string
  padding?: 'default' | 'sm' | 'none'
}

const paddingMap = {
  default: 'p-5',
  sm: 'p-4',
  none: '',
}

export default function SectionCard({
  children,
  className,
  padding = 'default',
}: SectionCardProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl  bg-card shadow-[0_2px_16px_rgba(0,0,0,0.05)]',
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  )
}
