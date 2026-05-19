import { useId } from 'react'
import { ChevronDown } from 'lucide-react'
import { readingMetrics } from '../data'
import styles from '../Home.module.css'

export default function ReadingStatsCard() {
  const gradientId = `${useId().replace(/:/g, '')}-reading-gradient`

  return (
    <section className={`${styles.glassPanel} p-5`}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-black text-[#102a56]">阅读统计</h2>
        <span className="inline-flex items-center gap-1 rounded-xl border border-[#d3e4f1] bg-white/70 px-3 py-2 text-sm font-bold text-[#526b93]">
          本月
          <ChevronDown size={16} aria-hidden="true" />
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {readingMetrics.map((metric) => (
          <div key={metric.label}>
            <p className="text-sm font-bold text-[#657b9f]">{metric.label}</p>
            <p className="mt-2 text-2xl font-black text-[#102a56]">{metric.value}</p>
            <p className="mt-1 text-xs font-black text-[#31b6a8]">+{metric.delta}</p>
          </div>
        ))}
      </div>

      <svg
        viewBox="0 0 560 180"
        className="mt-4 h-[172px] w-full"
        role="img"
        aria-label="阅读统计折线图"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7bdbea" stopOpacity="0.36" />
            <stop offset="100%" stopColor="#7bdbea" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          fill={`url(#${gradientId})`}
          d="M10 130 C50 122 58 126 88 116 S132 36 165 70 S222 112 260 88 S308 50 352 74 S412 118 448 80 S505 62 550 70 L550 174 L10 174 Z"
        />
        <path
          className={styles.chartPath}
          d="M10 130 C50 122 58 126 88 116 S132 36 165 70 S222 112 260 88 S308 50 352 74 S412 118 448 80 S505 62 550 70"
        />
        <circle cx="308" cy="50" r="7" fill="#fff" stroke="#4abfe8" strokeWidth="4" />
        <g>
          <rect x="288" y="8" width="88" height="48" rx="10" fill="#ffffff" stroke="#62bdf2" />
          <text x="303" y="29" fill="#6a7f9f" fontSize="12" fontWeight="700">
            05-20
          </text>
          <text x="303" y="46" fill="#6a7f9f" fontSize="12" fontWeight="700">
            阅读量:560
          </text>
        </g>
        <text x="8" y="176" fill="#8ba0bd" fontSize="13" fontWeight="700">
          05-01
        </text>
        <text x="206" y="176" fill="#8ba0bd" fontSize="13" fontWeight="700">
          05-10
        </text>
        <text x="360" y="176" fill="#8ba0bd" fontSize="13" fontWeight="700">
          05-20
        </text>
        <text x="516" y="176" fill="#8ba0bd" fontSize="13" fontWeight="700">
          05-31
        </text>
      </svg>
    </section>
  )
}
