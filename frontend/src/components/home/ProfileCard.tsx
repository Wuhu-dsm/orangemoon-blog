import { Code, Mail, X } from 'lucide-react'

const stats = [
  { label: '文章', value: '56' },
  { label: '项目', value: '12' },
  { label: '笔记', value: '89' },
  { label: '粉丝', value: '1.2k' },
]

const socials = [
  { icon: Code, label: 'GitHub', href: '#' },
  { icon: X, label: '知乎', href: '#' },
  { icon: X, label: '微博', href: '#' },
  { icon: Mail, label: '邮箱', href: '#' },
]

export default function ProfileCard() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border bg-cover bg-center p-5 shadow-sm"
      style={{ backgroundImage: 'url(/images/home/profile.png)' }}
    >
      <div className="relative z-10">
        {/* Top row: avatar + info */}
        <div className="flex items-start gap-3">
          <img
            src="/images/home/avatar.png"
            alt="Sora"
            className="h-14 w-14 rounded-full border-2 border-primary/20 object-cover"
          />
          <div className="flex-1 pt-0.5">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-semibold">Sora</h4>
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                Lv.5
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              前端开发 & 设计爱好者
            </p>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          热爱技术，喜欢设计，也热爱生活。
          <br />
          这里是我的数字花园 🌱
        </p>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-4 gap-2 border-t border-border/60 pt-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-sm font-semibold">{s.value}</span>
              <span className="text-[10px] text-muted-foreground">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Socials */}
        <div className="mt-4 flex justify-center gap-3">
          {socials.map((s) => {
            const Icon = s.icon
            return (
              <a
                key={s.label}
                href={s.href}
                title={s.label}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition hover:bg-primary hover:text-primary-foreground"
              >
                <Icon size={14} />
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
