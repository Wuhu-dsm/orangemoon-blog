import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


const slides = [
  {
    title: "写代码是热爱",
    subtitle: "写生活是本能",
    description: "在技术与生活之间，寻找平衡与热爱",
    cta: "探索我的世界",
  },
];

export default function BannerCarousel() {
  const [current] = useState(0);

  return (
    <section
      className="relative overflow-hidden rounded-2xl bg-cover bg-center p-6 sm:p-8 h-[250px]"
      style={{ backgroundImage: "url(/images/home/banner.png)" }}
    >
      {/*<div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />*/}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="relative z-10"
        ></motion.div>
      </AnimatePresence>

      {/* Pagination dots */}
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`block h-1.5 rounded-full transition-all ${
              idx === current ? "w-6 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}