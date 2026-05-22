import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Swiper as SwiperInstance } from 'swiper'
import { A11y, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useSettings } from '@/hooks/useSetting'

import 'swiper/css'

const DEFAULT_SLIDES = [
  { image: '/images/home/banner.png' },
  { image: '/images/home/banner-bg.png' },
]

export default function BannerCarousel() {
  const swiperRef = useRef<SwiperInstance | null>(null)
  const [current, setCurrent] = useState(0)
  const settingsQuery = useSettings()

  const slides =
    settingsQuery.data?.banners && settingsQuery.data.banners.length > 0
      ? settingsQuery.data.banners.map((image) => ({ image }))
      : DEFAULT_SLIDES

  return (
    <section
      className="relative h-[250px] overflow-hidden rounded-2xl bg-cover bg-center"
      aria-label="Home banner carousel"
    >
      <Swiper
        modules={[A11y, Autoplay]}
        rewind={slides.length > 1}
        speed={650}
        grabCursor
        resistanceRatio={0.65}
        threshold={4}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        onSlideChange={(swiper) => setCurrent(swiper.activeIndex)}
        className="absolute inset-0 h-full w-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={`${slide.image}-${idx}`}>
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            className="group absolute left-4 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-primary shadow-md backdrop-blur-md border border-border/50 transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-primary-foreground hover:shadow-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="上一张轮播图"
            title="上一张"
          >
            <ChevronLeft size={20} strokeWidth={2.5} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            className="group absolute right-4 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-primary shadow-md backdrop-blur-md border border-border/50 transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-primary-foreground hover:shadow-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="下一张轮播图"
            title="下一张"
          >
            <ChevronRight size={20} strokeWidth={2.5} aria-hidden="true" />
          </button>

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((slide, idx) => (
              <button
                type="button"
                key={`${slide.image}-${idx}`}
                onClick={() => swiperRef.current?.slideTo(idx)}
                className="flex h-4 w-5 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80"
                aria-label={`切换到第 ${idx + 1} 张轮播图`}
                aria-current={idx === current ? 'true' : undefined}
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    idx === current ? 'bg-primary shadow-sm shadow-primary/50' : 'bg-white/60 hover:bg-white/90'
                  }`}
                  style={{ width: idx === current ? 24 : 8 }}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
