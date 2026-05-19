import { Send } from 'lucide-react'
import subscribeBannerBg from '@/assets/home/subscribe-banner-bg.png'

export default function SubscribeBanner() {
  return (
    <section className="relative min-h-[86px] overflow-hidden rounded-3xl border border-[#bde4f0] bg-[#eaf9ff] px-8 py-5 shadow-[0_16px_40px_rgba(82,142,174,0.14)]">
      <img
        src={subscribeBannerBg}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative z-10 grid items-center gap-5 md:grid-cols-[1fr_360px]">
        <div>
          <h2 className="text-lg font-black text-[#102a56]">
            订阅更新，不错过每一篇精彩内容
          </h2>
          <p className="mt-1 text-sm font-semibold text-[#647a9b]">
            每周发送精选文章与灵感分享
          </p>
        </div>
        <form className="flex rounded-2xl bg-white/85 p-1.5 shadow-inner">
          <label className="sr-only" htmlFor="home-subscribe-email">
            邮箱地址
          </label>
          <input
            id="home-subscribe-email"
            type="email"
            className="min-w-0 flex-1 bg-transparent px-4 text-sm font-semibold text-[#2a426d] outline-none"
            placeholder="输入你的邮箱地址..."
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-[#45c7b8] px-5 py-2 text-sm font-black text-white transition hover:bg-[#2eb6a9] focus:outline-none focus:ring-2 focus:ring-[#72d9ce]/60"
          >
            <Send size={16} aria-hidden="true" />
            订阅
          </button>
        </form>
      </div>
    </section>
  )
}
