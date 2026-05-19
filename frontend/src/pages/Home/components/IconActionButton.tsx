import type { ButtonHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type IconActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: LucideIcon
  label: string
}

export default function IconActionButton({
  icon: Icon,
  label,
  className,
  type = 'button',
  'aria-label': ariaLabel,
  ...buttonProps
}: IconActionButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex size-11 items-center justify-center rounded-2xl border border-[#c8dff0] bg-white/75 text-[#294574] shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:text-[#22b8aa] focus:outline-none focus:ring-2 focus:ring-[#72d9ce]/60',
        className,
      )}
      aria-label={ariaLabel ?? label}
      title={label}
      {...buttonProps}
    >
      <Icon size={20} strokeWidth={1.9} />
    </button>
  )
}
