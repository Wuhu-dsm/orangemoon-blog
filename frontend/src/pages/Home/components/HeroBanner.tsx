import { ArrowRight, Sparkles } from 'lucide-react'
import styles from '../Home.module.css'

const carouselDots = ['hero-slide-1', 'hero-slide-2', 'hero-slide-3']

export default function HeroBanner() {
  return (
    <section
      className={`${styles.heroSky} flex min-h-[286px] flex-col justify-between p-7 text-white shadow-lg shadow-sky-100 sm:p-9`}
      aria-labelledby="home-hero-title"
    >
      <div className="relative z-10 max-w-xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/20 px-3 py-1.5 text-sm font-medium text-white shadow-sm backdrop-blur">
          <Sparkles size={16} strokeWidth={1.9} aria-hidden="true" />
          <span>SoraBlog</span>
        </div>

        <h1
          id="home-hero-title"
          className="text-4xl font-bold leading-tight text-white sm:text-5xl"
        >
          写代码是热爱
          <span className="mt-2 block">写生活是本能</span>
        </h1>
        <p className="mt-5 text-base font-medium leading-7 text-white/88 sm:text-lg">
          在技术与生活之间，寻找平衡与热爱
        </p>
      </div>

      <div className="relative z-10 mt-8 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#167ca6] shadow-md shadow-sky-300/30 transition hover:-translate-y-0.5 hover:text-[#13a69c] focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-[#55bdf0]"
        >
          <span>探索我的世界</span>
          <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2" aria-label="轮播分页">
          {carouselDots.map((dot, index) => (
            <button
              key={dot}
              type="button"
              className={`h-2.5 rounded-full bg-white transition ${
                index === 0 ? 'w-7 opacity-95' : 'w-2.5 opacity-55'
              }`}
              aria-label={`查看第 ${index + 1} 张轮播`}
              aria-current={index === 0 ? 'true' : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
