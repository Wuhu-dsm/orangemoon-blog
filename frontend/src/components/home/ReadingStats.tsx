import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { ArrowUpRight, ChevronDown } from 'lucide-react'

const data = [
  { day: '05-01', value: 320 },
  { day: '05-05', value: 450 },
  { day: '05-10', value: 380 },
  { day: '05-15', value: 520 },
  { day: '05-20', value: 560 },
  { day: '05-25', value: 480 },
  { day: '05-30', value: 600 },
]

const ranges = ['本周', '本月', '本年']

const metrics = [
  { label: '文章阅读', value: '12.4k', change: '+18.6%' },
  { label: '独立访客', value: '3.2k', change: '+12.8%' },
  { label: '阅读时长', value: '28.6h', change: '+9.7%' },
]

export default function ReadingStats() {
  const [range, setRange] = useState(1)

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">阅读统计</h4>
        <div className="relative">
          <select
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
            className="appearance-none rounded-md border border-border bg-secondary px-2 py-1 pr-6 text-[10px] text-secondary-foreground outline-none"
          >
            {ranges.map((r, idx) => (
              <option key={r} value={idx}>
                {r}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {metrics.map((m) => (
          <div key={m.label} className="text-center">
            <p className="text-xs font-semibold">{m.value}</p>
            <p className="text-[10px] text-muted-foreground">{m.label}</p>
            <p className="mt-0.5 flex items-center justify-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight size={10} />
              {m.change}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mt-4 h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                borderRadius: '0.5rem',
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--card))',
                fontSize: 12,
              }}
              formatter={(value) => [`阅读量：${value}`, '']}
              labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 3, fill: 'hsl(var(--primary))' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
