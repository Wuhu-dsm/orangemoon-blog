import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'
import { ArrowRight } from 'lucide-react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

const slides = [
  {
    title: '写代码是热爱',
    subtitle: '写生活是本能',
    description: '在技术与生活之间，寻找平衡与热爱',
    cta: '探索我的世界',
    bg: '/images/home/banner-bg.png'
  },
]

export default function BannerCarousel() {
  return (
    <section className="relative overflow-hidden rounded-2xl">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full bg-cover bg-center p-6 sm:p-8"
              style={{ backgroundImage: `url(${slide.bg})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
              <div className="relative z-10">
                <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm sm:text-3xl">
                  {slide.title}
                </h2>
                <p className="text-2xl font-bold tracking-tight text-white drop-shadow-sm sm:text-3xl">
                  {slide.subtitle}
                </p>
                <p className="mt-3 max-w-md text-xs text-white/80">
                  {slide.description}
                </p>
                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
                >
                  {slide.cta}
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
