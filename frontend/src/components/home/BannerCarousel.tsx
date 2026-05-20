import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const slides = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
]

export default function BannerCarousel() {
  const [current] = useState(0)

  return (
    <section
      className="relative w-full overflow-hidden rounded-2xl bg-cover bg-center sm:p-8"
      style={{ backgroundImage: 'url(/images/home/banner-bg.png)', aspectRatio: '21/9', minHeight: '200px' }}
    >
      {/* Pagination dots */}
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`block h-1.5 rounded-full transition-all ${
              idx === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
