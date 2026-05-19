# Home Dashboard UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the SoraBlog home page into the approved phase-01 dashboard UI shown in `ui-drafts/01-home-dashboard.png`.

**Architecture:** Keep the rebuild local to `frontend/src/pages/Home/` with a home-owned dashboard layout, typed local data, and focused components. Route `/` directly to the home dashboard so the existing generic `Layout`, `Header`, and `Sidebar` remain available for future pages but do not wrap this custom design.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, CSS Modules, lucide-react, existing `@/*` TypeScript path alias.

---

## File Map

- Create: `frontend/src/assets/home/logo-feather.png`
  - Repo-owned copy of the feather logo source asset.
- Create: `frontend/src/assets/home/mascot-reading.png`
  - Repo-owned copy of the reading mascot source asset.
- Create: `frontend/src/assets/home/profile-card-bg.png`
  - Repo-owned copy of the profile-card background source asset.
- Create: `frontend/src/assets/home/subscribe-banner-bg.png`
  - Repo-owned copy of the subscription banner source asset.
- Create: `frontend/src/pages/Home/types.ts`
  - Type definitions for home dashboard data.
- Create: `frontend/src/pages/Home/data.ts`
  - Typed local data for nav, articles, projects, tags, timeline, and stats.
- Create: `frontend/src/pages/Home/Home.module.css`
  - Home-specific background, card, chart, thumbnail, and responsive styling.
- Create: `frontend/src/pages/Home/components/IconActionButton.tsx`
  - Shared circular icon button.
- Create: `frontend/src/pages/Home/components/SectionHeader.tsx`
  - Shared section title and trailing action.
- Create: `frontend/src/pages/Home/components/DashboardLayout.tsx`
  - Dashboard shell with left sidebar and main canvas.
- Create: `frontend/src/pages/Home/components/HomeSidebar.tsx`
  - SoraBlog brand, nav, mascot, quote, and bottom dock.
- Create: `frontend/src/pages/Home/components/TopBar.tsx`
  - Search bar and top-right actions.
- Create: `frontend/src/pages/Home/components/HeroBanner.tsx`
  - Main visual banner with headline, CTA, and dots.
- Create: `frontend/src/pages/Home/components/ProfileCard.tsx`
  - Profile summary card with background asset, stats, and social buttons.
- Create: `frontend/src/pages/Home/components/ArticlePreviewCard.tsx`
  - Single latest-article card.
- Create: `frontend/src/pages/Home/components/ArticleSection.tsx`
  - Latest articles section.
- Create: `frontend/src/pages/Home/components/ProjectCard.tsx`
  - Single project preview card.
- Create: `frontend/src/pages/Home/components/ProjectCarousel.tsx`
  - Featured projects row.
- Create: `frontend/src/pages/Home/components/ReadingStatsCard.tsx`
  - Reading metrics and lightweight SVG line chart.
- Create: `frontend/src/pages/Home/components/TagCloudCard.tsx`
  - Tag chips panel.
- Create: `frontend/src/pages/Home/components/TimelineCard.tsx`
  - Compact month timeline panel.
- Create: `frontend/src/pages/Home/components/SubscribeBanner.tsx`
  - Bottom subscription banner.
- Modify: `frontend/src/pages/Home/Home.tsx`
  - Compose the dashboard components.
- Modify: `frontend/src/router/index.tsx`
  - Route `/` directly to `Home`.

---

## Task 1: Assets, Types, and Local Data

**Files:**
- Create: `frontend/src/assets/home/logo-feather.png`
- Create: `frontend/src/assets/home/mascot-reading.png`
- Create: `frontend/src/assets/home/profile-card-bg.png`
- Create: `frontend/src/assets/home/subscribe-banner-bg.png`
- Create: `frontend/src/pages/Home/types.ts`
- Create: `frontend/src/pages/Home/data.ts`

- [ ] **Step 1: Copy the supplied image assets into the repo**

Run from repo root:

```powershell
New-Item -ItemType Directory -Force -Path "frontend\src\assets\home"
Copy-Item -LiteralPath "C:\Users\Administrator\Downloads\ChatGPT Image 2026年5月19日 20_41_06.png" -Destination "frontend\src\assets\home\logo-feather.png" -Force
Copy-Item -LiteralPath "C:\Users\Administrator\Downloads\ChatGPT Image 2026年5月19日 20_40_53.png" -Destination "frontend\src\assets\home\mascot-reading.png" -Force
Copy-Item -LiteralPath "C:\Users\Administrator\Downloads\ChatGPT Image 2026年5月19日 20_41_16.png" -Destination "frontend\src\assets\home\profile-card-bg.png" -Force
Copy-Item -LiteralPath "C:\Users\Administrator\Downloads\ChatGPT Image 2026年5月19日 20_41_19.png" -Destination "frontend\src\assets\home\subscribe-banner-bg.png" -Force
Get-ChildItem -LiteralPath "frontend\src\assets\home" | Select-Object Name,Length
```

Expected: the final command lists `logo-feather.png`, `mascot-reading.png`, `profile-card-bg.png`, and `subscribe-banner-bg.png`, each with a non-zero `Length`.

- [ ] **Step 2: Create `types.ts`**

Write `frontend/src/pages/Home/types.ts`:

```ts
import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  label: string
  path: string
  icon: LucideIcon
}

export type DockAction = {
  label: string
  icon: LucideIcon
}

export type ArticleTone = 'studio' | 'ocean' | 'room'

export type ArticlePreview = {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  views: string
  tone: ArticleTone
}

export type ProjectTone = 'library' | 'system' | 'anime'

export type ProjectPreview = {
  id: string
  title: string
  description: string
  status: '进行中' | '已完成'
  tone: ProjectTone
}

export type StatItem = {
  label: string
  value: string
}

export type ReadingMetric = {
  label: string
  value: string
  delta: string
}

export type TagTone = 'mint' | 'blue' | 'cyan' | 'yellow'

export type TagSummary = {
  name: string
  count: number
  tone: TagTone
}

export type TimelineItem = {
  month: string
  content: string
}
```

- [ ] **Step 3: Create `data.ts`**

Write `frontend/src/pages/Home/data.ts`:

```ts
import {
  BadgeCheck,
  Bell,
  BookOpen,
  Clock,
  FileText,
  FolderOpen,
  Gift,
  Home,
  Link as LinkIcon,
  Mail,
  MessageSquare,
  Moon,
  Rss,
  Settings,
  User,
} from 'lucide-react'
import type {
  ArticlePreview,
  DockAction,
  NavItem,
  ProjectPreview,
  ReadingMetric,
  StatItem,
  TagSummary,
  TimelineItem,
} from './types'

export const navItems: NavItem[] = [
  { icon: Home, label: '首页', path: '/' },
  { icon: FileText, label: '文章', path: '/articles' },
  { icon: FolderOpen, label: '项目', path: '/projects' },
  { icon: BookOpen, label: '笔记', path: '/notes' },
  { icon: Clock, label: '时间轴', path: '/timeline' },
  { icon: User, label: '关于我', path: '/about' },
  { icon: LinkIcon, label: '友链', path: '/friends' },
  { icon: MessageSquare, label: '留言板', path: '/guestbook' },
]

export const dockActions: DockAction[] = [
  { icon: Moon, label: '切换主题' },
  { icon: Settings, label: '设置' },
  { icon: Bell, label: '通知' },
  { icon: MessageSquare, label: '菜单' },
]

export const topActions: DockAction[] = [
  { icon: Gift, label: '礼物' },
  { icon: Bell, label: '通知' },
]

export const profileStats: StatItem[] = [
  { label: '文章', value: '56' },
  { label: '项目', value: '12' },
  { label: '笔记', value: '89' },
  { label: '粉丝', value: '1.2k' },
]

export const socialActions: DockAction[] = [
  { icon: BadgeCheck, label: '作品集' },
  { icon: BookOpen, label: '知乎' },
  { icon: Rss, label: 'RSS' },
  { icon: Mail, label: '邮箱' },
]

export const articles: ArticlePreview[] = [
  {
    id: 'next-blog',
    title: '我用 Next.js 14 重构了个人博客',
    excerpt: '记录一次从零到一重构博客的过程，性能提升 60%，体验更丝滑。',
    category: '技术',
    date: '2024/06/01',
    views: '1.2k',
    tone: 'studio',
  },
  {
    id: 'kamakura-sea',
    title: '去镰仓吧！吹吹海风看看海',
    excerpt: '日本镰仓旅行小记，镰仓高校前的海，真的会让人治愈。',
    category: '生活',
    date: '2024/05/28',
    views: '982',
    tone: 'ocean',
  },
  {
    id: 'persistence',
    title: '为什么我们总是很难坚持？',
    excerpt: '从习惯养成的底层逻辑出发，聊聊如何建立属于自己的系统。',
    category: '思考',
    date: '2024/05/20',
    views: '1.5k',
    tone: 'room',
  },
]

export const projects: ProjectPreview[] = [
  {
    id: 'soraui',
    title: 'SoraUI 组件库',
    description: '基于 React + TS 的轻量级组件库',
    status: '进行中',
    tone: 'library',
  },
  {
    id: 'windy',
    title: 'Windy 团队管理系统',
    description: '一款简洁美观的团队管理工具',
    status: '已完成',
    tone: 'system',
  },
  {
    id: 'animejs',
    title: 'Anime.js 动画集',
    description: '收集整理的动画效果与实战示例',
    status: '已完成',
    tone: 'anime',
  },
]

export const readingMetrics: ReadingMetric[] = [
  { label: '文章阅读', value: '12.4k', delta: '18.6%' },
  { label: '独立访客', value: '3.2k', delta: '12.8%' },
  { label: '阅读时长', value: '28.6h', delta: '9.7%' },
]

export const tagCloud: TagSummary[] = [
  { name: '前端开发', count: 23, tone: 'mint' },
  { name: '生活', count: 18, tone: 'blue' },
  { name: '设计', count: 15, tone: 'mint' },
  { name: '随笔', count: 12, tone: 'cyan' },
  { name: 'Next.js', count: 10, tone: 'blue' },
  { name: 'TypeScript', count: 9, tone: 'mint' },
  { name: '旅行', count: 8, tone: 'blue' },
  { name: '动画', count: 7, tone: 'mint' },
  { name: '工具', count: 6, tone: 'blue' },
  { name: '思考', count: 6, tone: 'cyan' },
]

export const timelineItems: TimelineItem[] = [
  { month: '2024-06', content: '发布了新文章《我用 Next.js 14 重构了个人博客》' },
  { month: '2024-05', content: '完成了 Windy 团队管理系统' },
  { month: '2024-04', content: '新增了 3 篇笔记' },
  { month: '2024-03', content: '博客访问量突破 10,000 🎉' },
]
```

- [ ] **Step 4: Verify the new TypeScript files**

Run:

```powershell
Set-Location frontend
npm.cmd run build
```

Expected: `tsc -b && vite build` exits with code 0.

- [ ] **Step 5: Commit Task 1**

```powershell
git add frontend/src/assets/home frontend/src/pages/Home/types.ts frontend/src/pages/Home/data.ts
git commit -m "feat: add home dashboard assets and data"
```

Expected: commit succeeds and includes only the four copied images plus `types.ts` and `data.ts`.

---

## Task 2: Home Styling and Shared Primitives

**Files:**
- Create: `frontend/src/pages/Home/Home.module.css`
- Create: `frontend/src/pages/Home/components/IconActionButton.tsx`
- Create: `frontend/src/pages/Home/components/SectionHeader.tsx`

- [ ] **Step 1: Create `Home.module.css` with design tokens and custom surfaces**

Write `frontend/src/pages/Home/Home.module.css`:

```css
.dashboardPage {
  min-height: 100vh;
  background:
    radial-gradient(circle at 22% 8%, rgba(205, 239, 255, 0.9), transparent 34%),
    radial-gradient(circle at 86% 12%, rgba(218, 247, 241, 0.82), transparent 28%),
    linear-gradient(135deg, #f8fcff 0%, #edf8ff 48%, #f7fbff 100%);
  color: #102a56;
}

.dashboardShell {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  min-height: 100vh;
}

.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  border-right: 1px solid rgba(172, 207, 230, 0.65);
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(24px);
}

.mainCanvas {
  min-width: 0;
  padding: 24px 32px 28px;
}

.contentGrid {
  display: grid;
  grid-template-columns: minmax(0, 1.52fr) minmax(350px, 0.92fr);
  gap: 20px;
  align-items: start;
}

.leftColumn,
.rightColumn {
  display: grid;
  gap: 18px;
}

.glassPanel {
  border: 1px solid rgba(181, 218, 239, 0.72);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 18px 50px rgba(85, 132, 166, 0.14);
  backdrop-filter: blur(18px);
}

.softPanel {
  border: 1px solid rgba(185, 222, 238, 0.72);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.74);
  box-shadow: 0 14px 36px rgba(88, 130, 168, 0.1);
}

.heroSky {
  position: relative;
  overflow: hidden;
  min-height: 286px;
  border-radius: 22px;
  background:
    radial-gradient(circle at 58% 24%, rgba(255, 255, 255, 0.98) 0 10%, transparent 11%),
    radial-gradient(circle at 66% 32%, rgba(255, 255, 255, 0.86) 0 8%, transparent 9%),
    linear-gradient(135deg, #48aef0 0%, #79d7f8 44%, #bff2ff 100%);
}

.heroSky::after {
  content: '';
  position: absolute;
  inset: auto -6% -22% 36%;
  height: 58%;
  border-radius: 50% 50% 0 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.68), rgba(126, 216, 226, 0.32));
  filter: blur(2px);
}

.thumbnailStudio,
.thumbnailOcean,
.thumbnailRoom,
.thumbnailLibrary,
.thumbnailSystem,
.thumbnailAnime {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
}

.thumbnailStudio {
  background: linear-gradient(135deg, #183d66, #9bdcf7 55%, #fff4cf);
}

.thumbnailOcean {
  background: linear-gradient(135deg, #4aaee8, #b9f0ff 48%, #ffe6a7);
}

.thumbnailRoom {
  background: linear-gradient(135deg, #314a73, #d8ecf3 52%, #ffd9bf);
}

.thumbnailLibrary {
  background: linear-gradient(135deg, #7ed9f8, #f8fcff 52%, #87d8cc);
}

.thumbnailSystem {
  background: linear-gradient(135deg, #52b8f2, #e6fbff 48%, #7edecf);
}

.thumbnailAnime {
  background: linear-gradient(135deg, #0f223e, #4e7ca5 52%, #12182a);
}

.chartPath {
  fill: none;
  stroke: #56bdea;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.chartArea {
  fill: url('#readingGradient');
}

@media (max-width: 1180px) {
  .dashboardShell {
    grid-template-columns: 220px minmax(0, 1fr);
  }

  .contentGrid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 820px) {
  .dashboardShell {
    display: block;
  }

  .sidebar {
    position: relative;
    height: auto;
  }

  .mainCanvas {
    padding: 18px;
  }

  .heroSky {
    min-height: 240px;
  }
}
```

- [ ] **Step 2: Create `IconActionButton.tsx`**

Write `frontend/src/pages/Home/components/IconActionButton.tsx`:

```tsx
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type IconActionButtonProps = {
  icon: LucideIcon
  label: string
  className?: string
}

export default function IconActionButton({
  icon: Icon,
  label,
  className,
}: IconActionButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex size-11 items-center justify-center rounded-2xl border border-[#c8dff0] bg-white/75 text-[#294574] shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:text-[#22b8aa] focus:outline-none focus:ring-2 focus:ring-[#72d9ce]/60',
        className,
      )}
      aria-label={label}
      title={label}
    >
      <Icon size={20} strokeWidth={1.9} />
    </button>
  )
}
```

- [ ] **Step 3: Create `SectionHeader.tsx`**

Write `frontend/src/pages/Home/components/SectionHeader.tsx`:

```tsx
import { ArrowRight } from 'lucide-react'

type SectionHeaderProps = {
  title: string
  actionLabel?: string
}

export default function SectionHeader({ title, actionLabel }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-lg font-bold text-[#102a56]">{title}</h2>
      {actionLabel ? (
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#42bfb2] transition hover:text-[#219e95] focus:outline-none focus:ring-2 focus:ring-[#72d9ce]/60"
        >
          {actionLabel}
          <ArrowRight size={16} />
        </button>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 4: Verify shared primitives**

Run:

```powershell
Set-Location frontend
npm.cmd run build
```

Expected: build exits with code 0.

- [ ] **Step 5: Commit Task 2**

```powershell
git add frontend/src/pages/Home/Home.module.css frontend/src/pages/Home/components/IconActionButton.tsx frontend/src/pages/Home/components/SectionHeader.tsx
git commit -m "feat: add home dashboard styling primitives"
```

Expected: commit succeeds and includes only Task 2 files.

---

## Task 3: Dashboard Shell, Sidebar, and Top Bar

**Files:**
- Create: `frontend/src/pages/Home/components/DashboardLayout.tsx`
- Create: `frontend/src/pages/Home/components/HomeSidebar.tsx`
- Create: `frontend/src/pages/Home/components/TopBar.tsx`

- [ ] **Step 1: Create `DashboardLayout.tsx`**

Write `frontend/src/pages/Home/components/DashboardLayout.tsx`:

```tsx
import type { ReactNode } from 'react'
import styles from '../Home.module.css'
import HomeSidebar from './HomeSidebar'
import TopBar from './TopBar'

type DashboardLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardShell}>
        <HomeSidebar />
        <div className={styles.mainCanvas}>
          <TopBar />
          {children}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `HomeSidebar.tsx`**

Write `frontend/src/pages/Home/components/HomeSidebar.tsx`:

```tsx
import { Link, useLocation } from 'react-router-dom'
import logoFeather from '@/assets/home/logo-feather.png'
import mascotReading from '@/assets/home/mascot-reading.png'
import { cn } from '@/lib/utils'
import { dockActions, navItems } from '../data'
import styles from '../Home.module.css'
import IconActionButton from './IconActionButton'

export default function HomeSidebar() {
  const location = useLocation()

  return (
    <aside className={cn(styles.sidebar, 'flex flex-col px-8 py-8')}>
      <Link to="/" className="flex items-center gap-3">
        <img src={logoFeather} alt="" className="size-12 rounded-xl object-contain" />
        <div>
          <div className="flex items-center gap-2 text-2xl font-black tracking-[0] text-[#102a56]">
            SoraBlog
            <span className="text-[#233b66]">✦</span>
          </div>
          <p className="mt-1 text-sm font-medium text-[#60779e]">记录 · 思考 · 成长</p>
        </div>
      </Link>

      <nav className="mt-9 grid gap-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex h-14 items-center gap-4 rounded-2xl px-5 text-base font-bold transition',
                isActive
                  ? 'bg-[#d9f5ef] text-[#109b91] shadow-sm'
                  : 'text-[#263d6a] hover:bg-white/70 hover:text-[#109b91]',
              )}
            >
              <Icon size={21} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-8">
        <img
          src={mascotReading}
          alt="Sora reading"
          className="mx-auto w-[185px] max-w-full object-contain"
        />
        <div className="mt-5 rounded-2xl bg-[#f2f7fb] px-6 py-5 text-center text-sm font-semibold leading-7 text-[#5e7295] shadow-inner">
          <span className="text-2xl text-[#bed0df]">“</span>
          <p>生活明朗，万物可爱</p>
          <p>保持热爱，奔赴山海。</p>
          <span className="text-2xl text-[#bed0df]">”</span>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-3">
          {dockActions.map((action) => (
            <IconActionButton
              key={action.label}
              icon={action.icon}
              label={action.label}
              className="size-10 rounded-full"
            />
          ))}
        </div>
        <p className="mt-6 text-center text-xs font-semibold text-[#8293ad]">© 2024 SoraBlog</p>
      </div>
    </aside>
  )
}
```

- [ ] **Step 3: Create `TopBar.tsx`**

Write `frontend/src/pages/Home/components/TopBar.tsx`:

```tsx
import { Search } from 'lucide-react'
import profileCardBg from '@/assets/home/profile-card-bg.png'
import { topActions } from '../data'
import IconActionButton from './IconActionButton'

export default function TopBar() {
  return (
    <header className="mb-6 flex items-center justify-between gap-5">
      <label className="relative block w-full max-w-[440px]">
        <span className="sr-only">搜索文章、笔记、项目</span>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#53709d]"
          size={22}
        />
        <input
          type="search"
          placeholder="搜索文章、笔记、项目..."
          className="h-12 w-full rounded-2xl border border-[#c9dded] bg-white/84 pl-12 pr-20 text-sm font-semibold text-[#233b66] shadow-sm outline-none transition focus:border-[#6bd8ce] focus:ring-4 focus:ring-[#a6eee6]/40"
        />
        <kbd className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rounded-lg border border-[#cbdceb] bg-[#f7fbff] px-2 py-1 text-xs font-bold text-[#6b7d9e]">
          ⌘ K
        </kbd>
      </label>

      <div className="flex shrink-0 items-center gap-4">
        {topActions.map((action) => (
          <IconActionButton key={action.label} icon={action.icon} label={action.label} />
        ))}
        <button
          type="button"
          className="size-12 overflow-hidden rounded-full border-4 border-white bg-[#dff8f4] shadow-md focus:outline-none focus:ring-2 focus:ring-[#72d9ce]/70"
          aria-label="个人资料"
          title="个人资料"
        >
          <img src={profileCardBg} alt="" className="h-full w-full object-cover object-left" />
        </button>
      </div>
    </header>
  )
}
```

- [ ] **Step 4: Verify shell components**

Run:

```powershell
Set-Location frontend
npm.cmd run build
```

Expected: build exits with code 0. These components are not wired into `Home.tsx` yet, so the visual page remains unchanged after this task.

- [ ] **Step 5: Commit Task 3**

```powershell
git add frontend/src/pages/Home/components/DashboardLayout.tsx frontend/src/pages/Home/components/HomeSidebar.tsx frontend/src/pages/Home/components/TopBar.tsx
git commit -m "feat: add home dashboard shell"
```

Expected: commit succeeds and includes only Task 3 files.

---

## Task 4: Hero Banner and Profile Card

**Files:**
- Create: `frontend/src/pages/Home/components/HeroBanner.tsx`
- Create: `frontend/src/pages/Home/components/ProfileCard.tsx`

- [ ] **Step 1: Create `HeroBanner.tsx`**

Write `frontend/src/pages/Home/components/HeroBanner.tsx`:

```tsx
import { ArrowRight, Sparkles } from 'lucide-react'
import styles from '../Home.module.css'

export default function HeroBanner() {
  return (
    <section className={styles.heroSky}>
      <div className="relative z-10 flex h-full min-h-[286px] flex-col justify-center px-14 py-10 text-white">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-white/90">
          <Sparkles size={18} />
          <span>记录热爱，也记录成长</span>
        </div>
        <h1 className="max-w-[520px] text-[44px] font-black leading-[1.22] tracking-[0] drop-shadow-md">
          写代码是热爱
          <br />
          写生活是本能
        </h1>
        <p className="mt-5 text-lg font-semibold text-white/90">
          在技术与生活之间，寻找平衡与热爱
        </p>
        <button
          type="button"
          className="mt-7 inline-flex w-fit items-center gap-2 rounded-2xl bg-[#43c7b8] px-7 py-3 text-base font-bold text-white shadow-lg shadow-[#219eaa]/30 transition hover:-translate-y-0.5 hover:bg-[#2db7aa] focus:outline-none focus:ring-4 focus:ring-white/45"
        >
          探索我的世界
          <ArrowRight size={18} />
        </button>
      </div>
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {[0, 1, 2, 3, 4].map((dot) => (
          <span
            key={dot}
            className={`size-3 rounded-full ${dot === 1 ? 'bg-[#3ab9a9]' : 'bg-white/72'}`}
          />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `ProfileCard.tsx`**

Write `frontend/src/pages/Home/components/ProfileCard.tsx`:

```tsx
import profileCardBg from '@/assets/home/profile-card-bg.png'
import { profileStats, socialActions } from '../data'
import styles from '../Home.module.css'
import IconActionButton from './IconActionButton'

export default function ProfileCard() {
  return (
    <section className={`${styles.glassPanel} relative overflow-hidden p-7`}>
      <img
        src={profileCardBg}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-95"
      />
      <div className="relative z-10">
        <div className="flex items-center gap-5">
          <div className="size-24 overflow-hidden rounded-full border-4 border-white bg-[#dff8f4] shadow-lg">
            <img src={profileCardBg} alt="Sora avatar" className="h-full w-full object-cover object-left" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-[#102a56]">Sora</h2>
              <span className="rounded-full bg-[#dff4ff] px-2.5 py-1 text-xs font-black text-[#3286d9]">
                Lv.5
              </span>
            </div>
            <p className="mt-2 text-sm font-bold text-[#627899]">前端开发 & 设计爱好者</p>
          </div>
        </div>

        <p className="mt-5 max-w-[390px] text-sm font-semibold leading-7 text-[#42577d]">
          热爱技术，喜欢设计，也热爱生活。这里是我的数字花园。
        </p>

        <div className="mt-6 grid grid-cols-4 divide-x divide-[#d4e5f2] text-center">
          {profileStats.map((stat) => (
            <div key={stat.label}>
              <p className="text-sm font-bold text-[#6d82a2]">{stat.label}</p>
              <p className="mt-1 text-xl font-black text-[#102a56]">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4 px-8">
          {socialActions.map((action) => (
            <IconActionButton key={action.label} icon={action.icon} label={action.label} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Verify key visual cards**

Run:

```powershell
Set-Location frontend
npm.cmd run build
```

Expected: build exits with code 0.

- [ ] **Step 4: Commit Task 4**

```powershell
git add frontend/src/pages/Home/components/HeroBanner.tsx frontend/src/pages/Home/components/ProfileCard.tsx
git commit -m "feat: add home hero and profile card"
```

Expected: commit succeeds and includes only Task 4 files.

---

## Task 5: Content Modules

**Files:**
- Create: `frontend/src/pages/Home/components/ArticlePreviewCard.tsx`
- Create: `frontend/src/pages/Home/components/ArticleSection.tsx`
- Create: `frontend/src/pages/Home/components/ProjectCard.tsx`
- Create: `frontend/src/pages/Home/components/ProjectCarousel.tsx`
- Create: `frontend/src/pages/Home/components/ReadingStatsCard.tsx`
- Create: `frontend/src/pages/Home/components/TagCloudCard.tsx`
- Create: `frontend/src/pages/Home/components/TimelineCard.tsx`
- Create: `frontend/src/pages/Home/components/SubscribeBanner.tsx`

- [ ] **Step 1: Create `ArticlePreviewCard.tsx`**

Write `frontend/src/pages/Home/components/ArticlePreviewCard.tsx`:

```tsx
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ArticlePreview } from '../types'
import styles from '../Home.module.css'

const toneClass: Record<ArticlePreview['tone'], string> = {
  studio: styles.thumbnailStudio,
  ocean: styles.thumbnailOcean,
  room: styles.thumbnailRoom,
}

export default function ArticlePreviewCard({ article }: { article: ArticlePreview }) {
  return (
    <article className="min-w-0">
      <div className={cn('h-[118px]', toneClass[article.tone])}>
        <span className="absolute left-3 top-3 rounded-lg bg-[#38b7aa] px-3 py-1 text-xs font-black text-white shadow">
          {article.category}
        </span>
      </div>
      <h3 className="mt-3 line-clamp-1 text-base font-black text-[#102a56]">{article.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-[#667a9d]">
        {article.excerpt}
      </p>
      <div className="mt-3 flex items-center justify-between text-xs font-bold text-[#7d90ad]">
        <span>{article.date}</span>
        <span className="inline-flex items-center gap-1">
          <Eye size={14} />
          {article.views}
        </span>
      </div>
    </article>
  )
}
```

- [ ] **Step 2: Create `ArticleSection.tsx`**

Write `frontend/src/pages/Home/components/ArticleSection.tsx`:

```tsx
import { articles } from '../data'
import styles from '../Home.module.css'
import ArticlePreviewCard from './ArticlePreviewCard'
import SectionHeader from './SectionHeader'

export default function ArticleSection() {
  return (
    <section className={`${styles.glassPanel} p-5`}>
      <SectionHeader title="最新文章" actionLabel="查看全部" />
      <div className="grid gap-5 md:grid-cols-3">
        {articles.map((article) => (
          <ArticlePreviewCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create `ProjectCard.tsx` and `ProjectCarousel.tsx`**

Write `frontend/src/pages/Home/components/ProjectCard.tsx`:

```tsx
import { cn } from '@/lib/utils'
import type { ProjectPreview } from '../types'
import styles from '../Home.module.css'

const toneClass: Record<ProjectPreview['tone'], string> = {
  library: styles.thumbnailLibrary,
  system: styles.thumbnailSystem,
  anime: styles.thumbnailAnime,
}

export default function ProjectCard({ project }: { project: ProjectPreview }) {
  return (
    <article className="min-w-0">
      <div className={cn('h-[92px]', toneClass[project.tone])}>
        <span className="absolute left-3 top-3 rounded-lg bg-[#52cbbb] px-3 py-1 text-xs font-black text-white">
          {project.status}
        </span>
      </div>
      <h3 className="mt-3 line-clamp-1 text-base font-black text-[#102a56]">{project.title}</h3>
      <p className="mt-1 line-clamp-1 text-xs font-semibold text-[#6d82a2]">{project.description}</p>
    </article>
  )
}
```

Write `frontend/src/pages/Home/components/ProjectCarousel.tsx`:

```tsx
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { projects } from '../data'
import styles from '../Home.module.css'
import IconActionButton from './IconActionButton'
import ProjectCard from './ProjectCard'
import SectionHeader from './SectionHeader'

export default function ProjectCarousel() {
  return (
    <section className={`${styles.glassPanel} p-5`}>
      <SectionHeader title="精选项目" actionLabel="查看全部" />
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4">
        <IconActionButton icon={ChevronLeft} label="上一个项目" className="size-10 rounded-full" />
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <IconActionButton icon={ChevronRight} label="下一个项目" className="size-10 rounded-full" />
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {[0, 1, 2].map((dot) => (
          <span key={dot} className={`h-2 rounded-full ${dot === 1 ? 'w-8 bg-[#50c7bb]' : 'w-2 bg-[#c8dff0]'}`} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create `ReadingStatsCard.tsx`**

Write `frontend/src/pages/Home/components/ReadingStatsCard.tsx`:

```tsx
import { ChevronDown } from 'lucide-react'
import { readingMetrics } from '../data'
import styles from '../Home.module.css'

export default function ReadingStatsCard() {
  return (
    <section className={`${styles.glassPanel} p-5`}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-black text-[#102a56]">阅读统计</h2>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-xl border border-[#d3e4f1] bg-white/70 px-3 py-2 text-sm font-bold text-[#526b93]"
        >
          本月
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {readingMetrics.map((metric) => (
          <div key={metric.label}>
            <p className="text-sm font-bold text-[#657b9f]">{metric.label}</p>
            <p className="mt-2 text-2xl font-black text-[#102a56]">{metric.value}</p>
            <p className="mt-1 text-xs font-black text-[#31b6a8]">↑ {metric.delta}</p>
          </div>
        ))}
      </div>

      <svg viewBox="0 0 560 180" className="mt-4 h-[172px] w-full" role="img" aria-label="阅读统计折线图">
        <defs>
          <linearGradient id="readingGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7bdbea" stopOpacity="0.36" />
            <stop offset="100%" stopColor="#7bdbea" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className={styles.chartArea} d="M10 130 C50 122 58 126 88 116 S132 36 165 70 S222 112 260 88 S308 50 352 74 S412 118 448 80 S505 62 550 70 L550 174 L10 174 Z" />
        <path className={styles.chartPath} d="M10 130 C50 122 58 126 88 116 S132 36 165 70 S222 112 260 88 S308 50 352 74 S412 118 448 80 S505 62 550 70" />
        <circle cx="308" cy="50" r="7" fill="#fff" stroke="#4abfe8" strokeWidth="4" />
        <g>
          <rect x="288" y="8" width="88" height="48" rx="10" fill="#ffffff" stroke="#62bdf2" />
          <text x="303" y="29" fill="#6a7f9f" fontSize="12" fontWeight="700">05-20</text>
          <text x="303" y="46" fill="#6a7f9f" fontSize="12" fontWeight="700">阅读量：560</text>
        </g>
        <text x="8" y="176" fill="#8ba0bd" fontSize="13" fontWeight="700">05-01</text>
        <text x="206" y="176" fill="#8ba0bd" fontSize="13" fontWeight="700">05-10</text>
        <text x="360" y="176" fill="#8ba0bd" fontSize="13" fontWeight="700">05-20</text>
        <text x="516" y="176" fill="#8ba0bd" fontSize="13" fontWeight="700">05-31</text>
      </svg>
    </section>
  )
}
```

- [ ] **Step 5: Create `TagCloudCard.tsx` and `TimelineCard.tsx`**

Write `frontend/src/pages/Home/components/TagCloudCard.tsx`:

```tsx
import { cn } from '@/lib/utils'
import { tagCloud } from '../data'
import type { TagSummary } from '../types'
import styles from '../Home.module.css'
import SectionHeader from './SectionHeader'

const toneClass: Record<TagSummary['tone'], string> = {
  mint: 'bg-[#dff7f1] text-[#28a99d]',
  blue: 'bg-[#e4f0ff] text-[#3f82d8]',
  cyan: 'bg-[#e5f8fb] text-[#38a9bc]',
  yellow: 'bg-[#fff5d7] text-[#c79418]',
}

export default function TagCloudCard() {
  return (
    <section className={`${styles.glassPanel} p-5`}>
      <SectionHeader title="标签云" actionLabel="更多标签" />
      <div className="flex flex-wrap gap-3">
        {tagCloud.map((tag) => (
          <span
            key={tag.name}
            className={cn('rounded-xl px-4 py-2 text-sm font-black', toneClass[tag.tone])}
          >
            {tag.name}
            <span className="ml-2 opacity-70">{tag.count}</span>
          </span>
        ))}
      </div>
    </section>
  )
}
```

Write `frontend/src/pages/Home/components/TimelineCard.tsx`:

```tsx
import { timelineItems } from '../data'
import styles from '../Home.module.css'
import SectionHeader from './SectionHeader'

export default function TimelineCard() {
  return (
    <section className={`${styles.glassPanel} relative overflow-hidden p-5`}>
      <SectionHeader title="时间轴" actionLabel="查看全部" />
      <div className="space-y-4 border-l-2 border-[#8bdad0] pl-5">
        {timelineItems.map((item) => (
          <article key={item.month} className="relative">
            <span className="absolute -left-[30px] top-1 size-3 rounded-full bg-[#50c7bb] ring-4 ring-[#e2f8f4]" />
            <h3 className="text-sm font-black text-[#304a76]">{item.month}</h3>
            <p className="mt-1 text-sm font-semibold leading-6 text-[#6a7f9f]">{item.content}</p>
          </article>
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-3 right-4 h-16 w-14 rounded-full bg-[#d8f3ed] opacity-75" />
    </section>
  )
}
```

- [ ] **Step 6: Create `SubscribeBanner.tsx`**

Write `frontend/src/pages/Home/components/SubscribeBanner.tsx`:

```tsx
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
          <h2 className="text-lg font-black text-[#102a56]">订阅更新，不错过每一篇精彩内容</h2>
          <p className="mt-1 text-sm font-semibold text-[#647a9b]">每周发送精选文章与灵感分享</p>
        </div>
        <form className="flex rounded-2xl bg-white/86 p-1.5 shadow-inner">
          <label className="sr-only" htmlFor="home-subscribe-email">邮箱地址</label>
          <input
            id="home-subscribe-email"
            type="email"
            className="min-w-0 flex-1 bg-transparent px-4 text-sm font-semibold text-[#2a426d] outline-none"
            placeholder="输入你的邮箱地址..."
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-[#45c7b8] px-5 py-2 text-sm font-black text-white transition hover:bg-[#2eb6a9]"
          >
            <Send size={16} />
            订阅
          </button>
        </form>
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Verify content modules**

Run:

```powershell
Set-Location frontend
npm.cmd run build
```

Expected: build exits with code 0.

- [ ] **Step 8: Commit Task 5**

```powershell
git add frontend/src/pages/Home/components/ArticlePreviewCard.tsx frontend/src/pages/Home/components/ArticleSection.tsx frontend/src/pages/Home/components/ProjectCard.tsx frontend/src/pages/Home/components/ProjectCarousel.tsx frontend/src/pages/Home/components/ReadingStatsCard.tsx frontend/src/pages/Home/components/TagCloudCard.tsx frontend/src/pages/Home/components/TimelineCard.tsx frontend/src/pages/Home/components/SubscribeBanner.tsx
git commit -m "feat: add home dashboard content modules"
```

Expected: commit succeeds and includes only Task 5 files.

---

## Task 6: Wire the Home Page, Route, and Visual Verification

**Files:**
- Modify: `frontend/src/pages/Home/Home.tsx`
- Modify: `frontend/src/router/index.tsx`
- Modify: `frontend/src/pages/Home/Home.module.css`

- [ ] **Step 1: Replace `Home.tsx` with dashboard composition**

Write `frontend/src/pages/Home/Home.tsx`:

```tsx
import styles from './Home.module.css'
import ArticleSection from './components/ArticleSection'
import DashboardLayout from './components/DashboardLayout'
import HeroBanner from './components/HeroBanner'
import ProfileCard from './components/ProfileCard'
import ProjectCarousel from './components/ProjectCarousel'
import ReadingStatsCard from './components/ReadingStatsCard'
import SubscribeBanner from './components/SubscribeBanner'
import TagCloudCard from './components/TagCloudCard'
import TimelineCard from './components/TimelineCard'

export default function Home() {
  return (
    <DashboardLayout>
      <div className={styles.contentGrid}>
        <div className={styles.leftColumn}>
          <HeroBanner />
          <ArticleSection />
          <ProjectCarousel />
          <SubscribeBanner />
        </div>
        <div className={styles.rightColumn}>
          <ProfileCard />
          <ReadingStatsCard />
          <div className="grid gap-5 lg:grid-cols-2">
            <TagCloudCard />
            <TimelineCard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
```

- [ ] **Step 2: Route `/` directly to `Home`**

Write `frontend/src/router/index.tsx`:

```tsx
import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home/Home'

export const router = createBrowserRouter([{ path: '/', element: <Home /> }])
```

- [ ] **Step 3: Add final responsive refinements to `Home.module.css`**

Append this block to `frontend/src/pages/Home/Home.module.css`:

```css
@media (max-width: 640px) {
  .mainCanvas {
    padding: 14px;
  }

  .contentGrid,
  .leftColumn,
  .rightColumn {
    gap: 14px;
  }

  .glassPanel,
  .softPanel {
    border-radius: 18px;
  }
}
```

- [ ] **Step 4: Run the production build**

Run:

```powershell
Set-Location frontend
npm.cmd run build
```

Expected: `tsc -b && vite build` exits with code 0.

- [ ] **Step 5: Start the dev server**

Run:

```powershell
Set-Location frontend
npm.cmd run dev -- --host 127.0.0.1
```

Expected: Vite prints a local URL such as `http://127.0.0.1:5173/`.

- [ ] **Step 6: Capture desktop and mobile screenshots**

Use the browser verification tool or Playwright against the Vite URL:

```powershell
Set-Location frontend
npx.cmd playwright --version
```

Expected: command prints a Playwright version. If Playwright is not installed in the project, use the available Codex browser tool to inspect `http://127.0.0.1:5173/`.

Required visual checks:

- Desktop width around `1728x956`: page structure matches the target draft.
- Mobile width around `390x844`: content is readable in one column, with no text overflow.
- Mascot, feather logo, profile-card background, and subscription-banner background render from `frontend/src/assets/home`.
- The global old sidebar and header do not appear on the home page.

- [ ] **Step 7: Commit Task 6**

```powershell
git add frontend/src/pages/Home/Home.tsx frontend/src/pages/Home/Home.module.css frontend/src/router/index.tsx
git commit -m "feat: wire home dashboard UI"
```

Expected: commit succeeds and includes only Task 6 files.

---

## Final Verification Checklist

- [ ] `npm.cmd run build` passes from `frontend/`.
- [ ] Desktop browser screenshot resembles `ui-drafts/01-home-dashboard.png` in structure, mood, and density.
- [ ] Mobile browser check has no overlapping text or broken controls.
- [ ] `git status --short` shows only pre-existing unrelated changes, such as the two old deleted plan files already present before this plan.
- [ ] No backend files are modified.
- [ ] No admin, article detail, project detail, notes, timeline detail, auth, or store behavior is modified.

## Plan Self-Review

- Spec coverage: Tasks cover assets, componentization, home modules, typed local data, responsive behavior, accessibility labels, and verification.
- Scope: The plan only rebuilds the home dashboard and route wiring.
- Type consistency: `types.ts` names are used by `data.ts` and component props with matching property names.
- Verification: Build and browser checks are included before final handoff.
