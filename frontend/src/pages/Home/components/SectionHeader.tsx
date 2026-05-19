import type { ButtonHTMLAttributes } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type SectionHeaderProps = {
  title: string
  actionLabel?: string
  actionProps?: ButtonHTMLAttributes<HTMLButtonElement>
}

export default function SectionHeader({
  title,
  actionLabel,
  actionProps,
}: SectionHeaderProps) {
  const { className, type = 'button', ...buttonProps } = actionProps ?? {}

  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-lg font-bold text-[#102a56]">{title}</h2>
      {actionLabel ? (
        <button
          type={type}
          className={cn(
            'inline-flex items-center gap-1 text-sm font-semibold text-[#42bfb2] transition hover:text-[#219e95] focus:outline-none focus:ring-2 focus:ring-[#72d9ce]/60',
            className,
          )}
          {...buttonProps}
        >
          {actionLabel}
          <ArrowRight size={16} />
        </button>
      ) : null}
    </div>
  )
}
