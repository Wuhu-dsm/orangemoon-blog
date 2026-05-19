import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const slides = [
  {
    title: '写代码是热爱',
    subtitle: '写生活是本能',
    description: '在技术与生活之间，寻找平衡与热爱',
    cta: '探索我的世界',
  },
]

export default function BannerCarousel() {
  const [current] = useState(0)

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-100 to-accent p-8 sm:p-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="relative z-10"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {slides[current].title}
          </h2>
          <p className="mt-1 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            {slides[current].subtitle}
          </p>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            {slides[current].description}
          </p>
          <button
            type="button"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            {slides[current].cta}
            <ArrowRight size={16} />
          </button>
        </motion.div>
      </AnimatePresence>

      {/* Pagination dots */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`block h-1.5 rounded-full transition-all ${
              idx === current ? 'w-6 bg-primary' : 'w-1.5 bg-primary/40'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
