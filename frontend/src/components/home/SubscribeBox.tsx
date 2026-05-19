import { useState } from 'react'
import { Mail } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export default function SubscribeBox() {
  const [email, setEmail] = useState('')

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 to-accent p-5 sm:p-6">
      <img
        src="/images/home/email.png"
        alt=""
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 opacity-30"
      />
      <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            订阅更新，不错过每一篇精彩内容
          </h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            每周发送精选文章与灵感分享
          </p>
        </div>
        <div className="flex w-full max-w-sm items-center gap-2">
          <div className="relative flex-1">
            <Mail
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="email"
              placeholder="输入你的邮箱地址..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 rounded-xl border-border bg-card pl-9 text-xs"
            />
          </div>
          <Button className="h-9 rounded-xl px-4 text-xs">订阅</Button>
        </div>
      </div>
    </section>
  )
}
