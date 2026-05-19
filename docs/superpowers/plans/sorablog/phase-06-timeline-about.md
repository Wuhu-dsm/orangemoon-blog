# Phase 6: 时间轴 + 个人

> **目标:** 实现时间轴页、年度总结页、关于我页、联系合作页
> **UI 稿参考:** 05-timeline-activity.png, 14-yearly-timeline-summary.png, 06-about-profile.png, 15-contact-collaboration.png
> **前置条件:** Phase 5 完成
> **验收标准:** 时间轴按月展示、年度数据可视化、关于我页面完整、联系表单可用

---

## Task 6.1: 后端 - 时间轴模块

**Files:**
- Create: `backend/src/modules/timeline/timeline.module.ts`
- Create: `backend/src/modules/timeline/timeline.service.ts`
- Create: `backend/src/modules/timeline/timeline.controller.ts`
- Create: `backend/src/modules/timeline/schemas/timeline.schema.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: TimelineSchema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type TimelineDocument = HydratedDocument<Timeline>

@Schema({ timestamps: true })
export class Timeline {
  @Prop({ required: true }) title: string
  @Prop() description: string
  @Prop({ enum: ['article', 'project', 'life', 'milestone'], required: true }) type: string
  @Prop({ required: true }) date: Date
  @Prop() year: number
  @Prop() month: number
  @Prop() coverImage: string
  @Prop({ enum: ['article', 'project', 'note', 'external'] }) linkType: string
  @Prop({ type: Types.ObjectId }) linkId: Types.ObjectId
  @Prop() linkUrl: string
  @Prop({ type: Object }) meta: any
}

export const TimelineSchema = SchemaFactory.createForClass(Timeline)
```

- [ ] **Step 2: TimelineService + Controller**

提供 findAll（支持 year/type 筛选）、getYearSummary（年度汇总）接口。

- [ ] **Step 3: Commit**

```bash
git add backend/src/modules/timeline/ backend/src/app.module.ts
git commit -m "feat(backend): add timeline module"
```

---

## Task 6.2: 前端 - 时间轴页

**Files:**
- Create: `frontend/src/pages/Timeline/Timeline.tsx`
- Create: `frontend/src/pages/Timeline/components/TimelineItem.tsx`
- Create: `frontend/src/pages/Timeline/components/YearStats.tsx`
- Create: `frontend/src/api/timeline.ts`

**UI 参考:** 05-timeline-activity.png（时间线样式、年度数据、成长趋势图、日历视图、里程碑）

- [ ] **Step 1: Timeline API**

```typescript
import { apiClient } from './client'
export const timelineApi = {
  getList: (params?: any) => apiClient.get('/timeline', { params }),
  getYearSummary: (year: number) => apiClient.get(`/timeline/year/${year}/summary`),
}
```

- [ ] **Step 2: TimelineItem**

```tsx
export default function TimelineItem({ event }: { event: any }) {
  const typeColors: Record<string, string> = {
    article: 'bg-blue-500',
    project: 'bg-green-500',
    life: 'bg-purple-500',
    milestone: 'bg-yellow-500',
  }

  const typeLabels: Record<string, string> = {
    article: '文章发布',
    project: '项目完成',
    life: '生活瞬间',
    milestone: '里程碑',
  }

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${typeColors[event.type] || 'bg-gray-400'}`} />
        <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="pb-8 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`px-2 py-0.5 rounded text-xs text-white ${typeColors[event.type] || 'bg-gray-400'}`}>
            {typeLabels[event.type] || event.type}
          </span>
          <span className="text-sm text-gray-400">{new Date(event.date).toLocaleDateString()}</span>
        </div>
        <h3 className="font-semibold mb-1">{event.title}</h3>
        <p className="text-sm text-gray-500">{event.description}</p>
        {event.coverImage && (
          <img src={event.coverImage} alt={event.title} className="mt-3 w-48 h-32 object-cover rounded-lg" />
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Timeline 页面**

```tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { timelineApi } from '../../api/timeline'
import TimelineItem from './components/TimelineItem'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const types = ['全部', '文章', '项目', '生活']

const growthData = [
  { month: '01', articles: 2, projects: 1, notes: 5 },
  { month: '02', articles: 3, projects: 0, notes: 8 },
  { month: '03', articles: 4, projects: 1, notes: 10 },
  { month: '04', articles: 5, projects: 2, notes: 12 },
  { month: '05', articles: 6, projects: 2, notes: 15 },
  { month: '06', articles: 8, projects: 3, notes: 18 },
]

export default function Timeline() {
  const [activeType, setActiveType] = useState('全部')
  const { data } = useQuery({
    queryKey: ['timeline', activeType],
    queryFn: () => timelineApi.getList({ type: activeType === '全部' ? undefined : activeType }),
  })

  const events = (data as any)?.data || []

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">时间轴</h1>
          <p className="text-gray-500">记录成长的每一个瞬间，回顾每一段值得铭记的旅程 ✨</p>
        </div>

        <div className="flex gap-2 mb-6">
          {types.map((type) => (
            <button key={type} onClick={() => setActiveType(type)}
              className={`px-4 py-2 rounded-full text-sm ${
                activeType === type ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600'
              }`}>
              {type}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
          {events.map((event: any) => <TimelineItem key={event._id} event={event} />)}
        </div>
      </div>

      <div className="space-y-6">
        {/* 年度数据 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold mb-4">年度数据 2024</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center"><div className="text-xl font-bold">23</div><div className="text-xs text-gray-500">文章发布</div></div>
            <div className="text-center"><div className="text-xl font-bold">7</div><div className="text-xs text-gray-500">项目完成</div></div>
            <div className="text-center"><div className="text-xl font-bold">46</div><div className="text-xs text-gray-500">笔记记录</div></div>
            <div className="text-center"><div className="text-xl font-bold">28.6k</div><div className="text-xs text-gray-500">总阅读量</div></div>
          </div>
          <div className="text-center text-sm text-primary-500">持续创作的第 162 天 🎉</div>
        </div>

        {/* 成长趋势 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold mb-4">成长趋势</h3>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="articles" stroke="#22c55e" strokeWidth={2} />
              <Line type="monotone" dataKey="projects" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="notes" stroke="#a855f7" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/Timeline/ frontend/src/api/timeline.ts
git commit -m "feat(frontend): add timeline page with charts"
```

---

## Task 6.3: 前端 - 年度总结页

**Files:**
- Create: `frontend/src/pages/YearlySummary/YearlySummary.tsx`

**UI 参考:** 14-yearly-timeline-summary.png（年度数据概览、成就徽章、月度时间轴、活跃日历、里程碑）

- [ ] **Step 1: YearlySummary**

```tsx
import { useParams } from 'react-router-dom'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const monthlyData = [
  { month: '1月', articles: 2, projects: 1, notes: 5, travel: 0 },
  { month: '2月', articles: 3, projects: 0, notes: 8, travel: 1 },
  { month: '3月', articles: 4, projects: 1, notes: 10, travel: 0 },
  { month: '4月', articles: 5, projects: 2, notes: 12, travel: 1 },
  { month: '5月', articles: 6, projects: 2, notes: 15, travel: 0 },
  { month: '6月', articles: 8, projects: 3, notes: 18, travel: 1 },
]

const badges = [
  { name: '持续创作', count: '56 篇文章', icon: '📝' },
  { name: '代码工匠', count: '12 个项目', icon: '💻' },
  { name: '远方探索者', count: '8 次旅行', icon: '🧭' },
  { name: '知识收藏家', count: '146 条笔记', icon: '📚' },
]

export default function YearlySummary() {
  const { year } = useParams()

  return (
    <div className="space-y-8">
      {/* 年度头图 */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-12 text-white">
        <h1 className="text-5xl font-bold mb-4">{year}</h1>
        <p className="text-primary-100 text-lg">记录热爱，见证成长的每一步 ✨</p>
      </div>

      {/* 统计数据 */}
      <div className="grid grid-cols-6 gap-4">
        {[
          { label: '记录天数', value: '305 天', sub: '占比 83%' },
          { label: '发布文章', value: '56 篇', sub: '较去年 +27%' },
          { label: '完成项目', value: '12 个', sub: '较去年 +50%' },
          { label: '旅行记录', value: '8 次', sub: '共 32 天' },
          { label: '获得点赞', value: '28.6k', sub: '较去年 +68%' },
          { label: '访客总数', value: '126.7k', sub: '较去年 +42%' },
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            <div className="text-xs text-green-500 mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* 成就徽章 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
        <h2 className="text-xl font-bold mb-6">年度心情 & 成就</h2>
        <div className="grid grid-cols-4 gap-4">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <span className="text-3xl">{badge.icon}</span>
              <div>
                <div className="font-semibold">{badge.name}</div>
                <div className="text-sm text-gray-500">{badge.count}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 月度趋势图 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
        <h2 className="text-xl font-bold mb-6">年度数据概览</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="articles" stroke="#22c55e" name="文章发布" />
            <Line type="monotone" dataKey="projects" stroke="#3b82f6" name="项目完成" />
            <Line type="monotone" dataKey="notes" stroke="#a855f7" name="笔记记录" />
            <Line type="monotone" dataKey="travel" stroke="#f59e0b" name="旅行记录" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/YearlySummary/
git commit -m "feat(frontend): add yearly summary page"
```

---

## Task 6.4: 前端 - 关于我页

**Files:**
- Create: `frontend/src/pages/About/About.tsx`

**UI 参考:** 06-about-profile.png（个人 Banner、成长经历、教育背景、生活碎片、技能标签）

- [ ] **Step 1: About**

```tsx
const skills = ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'UI/UX', '动画设计', '摄影']

const experiences = [
  { period: '2024 - 至今', title: '全栈探索阶段', description: '持续探索前端与全栈技术，专注于打造高质量的产品与体验，并分享知识与思考。' },
  { period: '2022 - 2024', title: '前端进阶阶段', description: '深入学习 React 生态与工程化，参与多个实际项目，积累了丰富的实战经验。' },
  { period: '2020 - 2022', title: '编程启蒙阶段', description: '从零开始学习编程，建立了对代码世界的好奇与热爱。' },
]

const educations = [
  { period: '2020 - 2024', school: '某某大学 · 计算机科学与技术 · 本科', description: '主修计算机科学与技术，期间参与多个项目与竞赛，获得优秀毕业生。' },
  { period: '2017 - 2020', school: '某某高级中学 · 理科', description: '在数学和物理的世界里发现逻辑之美，开启编程之旅。' },
]

export default function About() {
  return (
    <div className="space-y-8">
      {/* 个人 Banner */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-12 text-white relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-8">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl">
            👩‍💻
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Sora <span className="text-sm bg-white/20 px-2 py-1 rounded-full">Lv.5</span></h1>
            <p className="text-primary-100 mb-4">前端开发 & 设计爱好者</p>
            <p className="text-primary-100 mb-4">热爱技术，喜欢设计，也热爱生活。<br />在代码与生活之间，寻找平衡与热爱。</p>
            <div className="flex gap-2">
              {skills.map((skill) => (
                <span key={skill} className="px-3 py-1 bg-white/20 rounded-full text-sm">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 关于我 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
        <h2 className="text-xl font-bold mb-4">🌿 关于我</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          嗨！我是 Sora，一名前端开发者，也是一名热爱设计与创作的数字游移者。
          我喜欢用代码构建有温度的产品，用设计传递美好体验。
        </p>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          这个博客记录了我的学习笔记、项目实践、生活灵感与思考沉淀。
          希望我的分享能对你有所帮助，也期待认识更多志同道合的朋友 ✨
        </p>
      </div>

      {/* 成长经历 + 教育背景 */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
          <h2 className="text-xl font-bold mb-6">成长经历</h2>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-primary-500" />
                  {index < experiences.length - 1 && <div className="w-0.5 flex-1 bg-gray-200" />}
                </div>
                <div className="pb-6">
                  <div className="text-sm text-primary-500 mb-1">{exp.period}</div>
                  <h3 className="font-semibold mb-1">{exp.title}</h3>
                  <p className="text-sm text-gray-500">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
          <h2 className="text-xl font-bold mb-6">教育背景</h2>
          <div className="space-y-6">
            {educations.map((edu, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 shrink-0">
                  🎓
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">{edu.period}</div>
                  <h3 className="font-semibold mb-1">{edu.school}</h3>
                  <p className="text-sm text-gray-500">{edu.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 生活碎片 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">生活碎片</h2>
          <a href="#" className="text-sm text-primary-500">查看更多 →</a>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/About/
git commit -m "feat(frontend): add about page"
```

---

## Task 6.5: 前端 - 联系合作页

**Files:**
- Create: `frontend/src/pages/Contact/Contact.tsx`

**UI 参考:** 15-contact-collaboration.png（联系方式、合作表单、服务列表、合作伙伴评价）

- [ ] **Step 1: Contact**

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const services = [
  { icon: '💻', title: '博客 / 个人网站定制', desc: '基于 Next.js & Tailwind CSS 的现代化网站开发' },
  { icon: '🎨', title: 'UI / UX 设计', desc: '界面设计、用户体验优化、设计系统搭建' },
  { icon: '⚛️', title: '前端开发', desc: 'React / TypeScript / 动效与交互实现' },
  { icon: '📊', title: '技术咨询', desc: '技术选型、架构建议、性能优化' },
]

export default function Contact() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-8">
        {/* 联系头图 */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-12 text-white">
          <h1 className="text-3xl font-bold mb-4">期待与你一起创造美好 ✨</h1>
          <p className="text-primary-100">交流想法 · 探索合作 · 共创未来</p>
          <p className="text-primary-100 mt-2">如果你有有趣的想法、项目合作或内容共创的需求，欢迎随时联系我！</p>
        </div>

        {/* 联系方式 */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: '📧', title: '邮箱联系', value: 'sora@example.com', action: '发送邮件' },
            { icon: '🌐', title: '社交媒体', value: '关注我，获取最新动态', action: '查看主页' },
            { icon: '📍', title: '所在位置', value: '中国 · 杭州', action: '查看地图' },
          ].map((item, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{item.value}</p>
              <button className="text-sm text-primary-500 hover:underline">{item.action}</button>
            </div>
          ))}
        </div>

        {/* 合作表单 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200">
          <h2 className="text-xl font-bold mb-6">合作洽谈 / 需求提交</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">称呼 *</label>
                <Input placeholder="例如：小明 / 团队名称" />
              </div>
              <div>
                <label className="text-sm font-medium">联系方式 *</label>
                <Input placeholder="邮箱 / 微信 / 电话" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">合作类型 *</label>
              <select className="w-full px-3 py-2 border rounded-lg">
                <option>请选择合作类型</option>
                <option>网站开发</option>
                <option>UI 设计</option>
                <option>技术咨询</option>
                <option>内容合作</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">需求描述 *</label>
              <Textarea placeholder="请详细描述你的项目背景、目标、需求内容、合作方式等信息..." rows={4} />
            </div>
            <Button className="w-full">提交需求</Button>
          </form>
        </div>
      </div>

      <div className="space-y-6">
        {/* 我能提供的服务 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold mb-4">我能提供的服务</h3>
          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={index} className="flex gap-3">
                <span className="text-2xl">{service.icon}</span>
                <div>
                  <div className="font-medium text-sm">{service.title}</div>
                  <div className="text-xs text-gray-500">{service.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/Contact/
git commit -m "feat(frontend): add contact page"
```

---

## Task 6.6: Phase 6 验收

- [ ] **Step 1: 验证时间轴**

```bash
# 打开 http://localhost:5173/timeline
# 检查: 时间线样式正确
# 检查: 右侧图表显示
```

- [ ] **Step 2: 验证关于我**

```bash
# 打开 http://localhost:5173/about
# 检查: Banner 样式
# 检查: 成长经历时间线
```

- [ ] **Step 3: UI 对照检查**

对照 05-timeline-activity.png、14-yearly-timeline-summary.png、06-about-profile.png、15-contact-collaboration.png：
- [ ] 时间轴节点颜色
- [ ] 年度总结图表
- [ ] 关于我页面布局

- [ ] **Step 4: Commit**

```bash
git commit --allow-empty -m "checkpoint: phase 6 timeline and about complete"
```
