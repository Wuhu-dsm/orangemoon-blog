import { useState, type FormEvent } from 'react'

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
        'pt-10 -mt-10 bg-right-bottom  bg-no-repeat bg-contain bg-[url("./images/home/subscribe-banner.png")] relative h-56  rounded-2xl  border-sky-100/80 bg-transparent shadow-[0_10px_30px_rgba(125,211,252,0.16)]',
        className
      )}
    >
      <div className="relative z-10 flex h-full flex-col justify-center px-6 pr-[30%]">
        <div>
          <h3 className="text-sm font-semibold leading-tight text-[#1E293B]">
            订阅更新
          </h3>
          <p className="mt-0.5 text-[11px] text-[#64748B]">
            不错过每一篇精彩内容
          </p>
        </div>
        <form className="mt-3 flex max-w-[450px] items-center gap-2" onSubmit={handleSubmit}>
          <label htmlFor="subscribe-email" className="sr-only">
            邮箱地址
          </label>
          <Input
            id="subscribe-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="输入你的邮箱地址..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-8 min-w-0 rounded-full border-sky-100 bg-white/90 px-4 text-[11px] shadow-sm placeholder:text-[#9CA3AF] focus-visible:ring-teal-300"
          />
          <Button
            type="submit"
            className="h-8 shrink-0 rounded-full bg-teal-500 px-5 text-[11px] font-medium text-white shadow-sm hover:bg-teal-600"
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
