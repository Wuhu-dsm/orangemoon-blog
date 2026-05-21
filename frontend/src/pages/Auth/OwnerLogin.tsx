import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  HelpCircle,
  Home,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react";
import { ownerLogin } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

export default function OwnerLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const auth = await ownerLogin({ usernameOrEmail, password });
      setAuth(auth.user, auth.accessToken, auth.refreshToken);
      navigate(searchParams.get("returnTo") || "/", { replace: true });
    } catch (loginError) {
      const message =
        loginError instanceof Error
          ? loginError.message
          : "登录失败，请检查账号和密码";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_0%,rgba(186,230,253,0.9),transparent_36%),linear-gradient(135deg,#f8fdff_0%,#eef8ff_48%,#fbfffd_100%)] text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between gap-3">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img
              src="/images/sidebar/logo.png"
              alt=""
              className="h-11 w-auto shrink-0"
            />
            <div className="min-w-0">
              <p className="truncate text-xl font-bold text-foreground">
                SoraBlog
              </p>
              <p className="truncate text-xs text-muted-foreground">
                记录 · 思考 · 成长
              </p>
            </div>
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/" className="gap-2">
                <Home size={16} />
                返回首页
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
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
              src="/images/home/banner1.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />


          </div>

          <div className="mx-auto flex w-full max-w-xl flex-col justify-center rounded-[28px] border border-white/80 bg-card/95 px-6 py-10 shadow-[0_24px_90px_rgba(31,92,121,0.16)] backdrop-blur sm:px-14 lg:min-h-[640px] lg:rounded-l-none">
            <div>
              <div className="mb-6 inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                隐藏入口
              </div>
              <h2 className="text-4xl font-bold text-foreground">欢迎回来</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                登录你的 SoraBlog 账户，继续书写新的篇章。
              </p>
            </div>

            <form className="mt-10 flex flex-col gap-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="sr-only">邮箱地址或用户名</span>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                    aria-hidden="true"
                  />
                  <Input
                    value={usernameOrEmail}
                    onChange={(event) => setUsernameOrEmail(event.target.value)}
                    autoComplete="username"
                    placeholder="邮箱地址 / 用户名"
                    className="h-12 rounded-xl border-input bg-background pl-12 text-sm shadow-sm"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="sr-only">密码</span>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                    aria-hidden="true"
                  />
                  <Input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="请输入密码"
                    className="h-12 rounded-xl border-input bg-background pl-12 pr-12 text-sm shadow-sm"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "隐藏密码" : "显示密码"}
                    title={showPassword ? "隐藏密码" : "显示密码"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="size-4 rounded border-border text-primary focus:ring-ring"
                  />
                  记住我
                </label>
                <Link to="/" className="hover:text-primary">
                  返回博客
                </Link>
              </div>

              <p
                className={cn(
                  "min-h-5 text-sm text-destructive",
                  !error && "invisible",
                )}
              >
                {error || "登录失败"}
              </p>

              <Button
                type="submit"
                size="lg"
                className="h-12 gap-2 rounded-xl bg-primary text-base shadow-lg shadow-primary/20 hover:bg-primary/90"
                disabled={isSubmitting}
              >
                <Sparkles size={17} />
                {isSubmitting ? "登录中..." : "登录"}
              </Button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
