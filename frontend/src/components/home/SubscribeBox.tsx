import { useState, type FormEvent } from 'react'
import { Mail } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { cn } from '../../lib/utils'

interface SubscribeBoxProps {
  className?: string
}

export default function SubscribeBox({ className }: SubscribeBoxProps) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(email.trim() ? '订阅信息已记录' : '请输入邮箱地址')
  }

  return (
    <section
      className={cn(
        'relative h-[160px] overflow-hidden rounded-2xl shadow-sm',
        className
      )}
    >
      <img
        src="/images/home/email.png"
        alt=""
        width={2172}
        height={724}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-bottom"
      />
      <div className="absolute inset-0 bg-white/10 dark:bg-background/35" />
      <div className="relative z-10 flex h-full items-center justify-between gap-6 px-6 sm:px-8">
        <div className="hidden flex-none sm:block sm:w-[32%]">
          <h3 className="text-sm font-semibold leading-tight text-foreground">
            订阅更新，不错过每一篇精彩内容
          </h3>
          <p className="mt-1 text-[11px] text-muted-foreground">
            每周发送精选文章与灵感分享
          </p>
        </div>
        <form
          className="flex w-full flex-1 items-center gap-3 sm:max-w-[420px]"
          onSubmit={handleSubmit}
        >
          <div className="relative min-w-0 flex-1">
            <label htmlFor="subscribe-email" className="sr-only">
              邮箱地址
            </label>
            <Mail
              size={14}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="subscribe-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="输入你的邮箱地址…"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 rounded-full border-0 bg-white pl-9 pr-3 text-xs shadow-sm dark:bg-white/95"
            />
          </div>
          <Button
            type="submit"
            className="h-10 shrink-0 rounded-full bg-teal-500 px-6 text-xs text-white shadow-sm hover:bg-teal-600"
          >
            订阅
          </Button>
          <span className="sr-only" aria-live="polite">
            {message}
          </span>
        </form>
      </div>
    </section>
  )
}
