import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  HelpCircle,
  Home,
  Lock,
  Mail,
  Sparkles,
} from 'lucide-react'
import { ownerLogin } from '../../api/auth'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { cn } from '../../lib/utils'
import { useAuthStore } from '../../stores/authStore'

export default function OwnerLogin() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const auth = await ownerLogin({ usernameOrEmail, password })
      setAuth(auth.user, auth.accessToken, auth.refreshToken)
      navigate(searchParams.get('returnTo') || '/', { replace: true })
    } catch (loginError) {
      const message =
        loginError instanceof Error ? loginError.message : '登录失败，请检查账号和密码'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_0%,rgba(186,230,253,0.9),transparent_36%),linear-gradient(135deg,#f8fdff_0%,#eef8ff_48%,#fbfffd_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between gap-3">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img
              src="/images/sidebar/logo.png"
              alt=""
              className="h-11 w-auto shrink-0"
            />
            <div className="min-w-0">
              <p className="truncate text-xl font-bold text-slate-900">
                SoraBlog
              </p>
              <p className="truncate text-xs text-slate-500">
                记录 · 思考 · 成长
              </p>
            </div>
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="ghost" size="lg">
              <Link to="/" className="gap-2">
                <Home size={16} />
                返回首页
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/" className="gap-2">
                <HelpCircle size={16} />
                帮助中心
              </Link>
            </Button>
          </div>
        </header>

        <section className="grid flex-1 items-center py-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative hidden min-h-[640px] overflow-hidden rounded-l-[28px] border border-white/80 bg-sky-100 shadow-[0_24px_90px_rgba(79,148,183,0.18)] lg:block">
            <img
              src="/images/home/banner-bg.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-sky-100/60 via-white/10 to-teal-100/50" />
            <div className="relative z-10 flex h-full flex-col justify-center px-20">
              <div className="max-w-md">
                <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/65 px-4 py-2 text-sm font-medium text-teal-700 shadow-sm backdrop-blur">
                  <Sparkles size={16} />
                  Owner only
                </div>
                <h1 className="text-6xl font-bold leading-tight text-slate-950">
                  SoraBlog
                </h1>
                <p className="mt-5 text-2xl font-medium text-slate-700">
                  记录 · 思考 · 成长
                </p>
                <p className="mt-12 max-w-xs text-base leading-8 text-slate-600">
                  欢迎回来。这里保留给博主本人，用来继续书写属于你的故事。
                </p>
              </div>
            </div>
            <img
              src="/images/sidebar/cat.png"
              alt=""
              className="absolute bottom-4 right-8 z-10 h-52 w-auto object-contain drop-shadow-2xl"
            />
          </div>

          <div className="mx-auto flex w-full max-w-xl flex-col justify-center rounded-[28px] border border-white/80 bg-white/95 px-6 py-10 shadow-[0_24px_90px_rgba(31,92,121,0.16)] backdrop-blur sm:px-14 lg:min-h-[640px] lg:rounded-l-none">
            <div>
              <div className="mb-6 inline-flex rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
                隐藏入口
              </div>
              <h2 className="text-4xl font-bold text-slate-950">欢迎回来</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                登录你的 SoraBlog 账户，继续书写新的篇章。
              </p>
            </div>

            <form className="mt-10 flex flex-col gap-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="sr-only">邮箱地址或用户名</span>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                    aria-hidden="true"
                  />
                  <Input
                    value={usernameOrEmail}
                    onChange={(event) => setUsernameOrEmail(event.target.value)}
                    autoComplete="username"
                    placeholder="邮箱地址 / 用户名"
                    className="h-13 rounded-xl border-slate-200 bg-white pl-12 text-sm shadow-sm"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="sr-only">密码</span>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                    aria-hidden="true"
                  />
                  <Input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="请输入密码"
                    className="h-13 rounded-xl border-slate-200 bg-white pl-12 pr-12 text-sm shadow-sm"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? '隐藏密码' : '显示密码'}
                    title={showPassword ? '隐藏密码' : '显示密码'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between text-sm text-slate-500">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="size-4 rounded border-slate-300 text-teal-500 focus:ring-teal-500"
                  />
                  记住我
                </label>
                <Link to="/" className="text-slate-500 hover:text-teal-700">
                  返回博客
                </Link>
              </div>

              <p
                className={cn(
                  'min-h-5 text-sm text-red-500',
                  !error && 'invisible',
                )}
              >
                {error || '登录失败'}
              </p>

              <Button
                type="submit"
                size="lg"
                className="h-13 gap-2 rounded-xl bg-teal-500 text-base shadow-lg shadow-teal-500/20 hover:bg-teal-600"
                disabled={isSubmitting}
              >
                <Sparkles size={17} />
                {isSubmitting ? '登录中...' : '登录'}
              </Button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}
