# Home Dashboard UI Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the home page into a three-column dashboard layout with an anime-inspired, fresh, light-card aesthetic based on the design spec in `home-ui-design/design.md`.

**Architecture:** Refactor the existing two-column layout (Sidebar + Main) into a three-column layout (Sidebar + Main + Right Panel). Extract every content module into its own focused component. Introduce a soft mint/white color palette, decorative illustrations, and lightweight animations using Framer Motion. Keep all existing routing and stores untouched.

**Tech Stack:** React 18 + TypeScript, Vite, Tailwind CSS 3, shadcn/ui primitives, Framer Motion, Recharts, Lucide React, Zustand.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `frontend/src/pages/Layout.tsx` | Root three-column layout shell (Sidebar + Main + RightPanel) |
| `frontend/src/components/layout/Sidebar.tsx` | Left nav + brand + decorative illustration + quote + shortcuts |
| `frontend/src/components/layout/Header.tsx` | Top search bar + action icons (gift, bell, avatar) |
| `frontend/src/pages/Home/Home.tsx` | Home page orchestrator: Banner + Articles + Projects + Subscribe |
| `frontend/src/components/home/BannerCarousel.tsx` | Hero banner with carousel dots |
| `frontend/src/components/home/LatestArticles.tsx` | Article card grid (3 items) |
| `frontend/src/components/home/FeaturedProjects.tsx` | Project carousel with status badges |
| `frontend/src/components/home/SubscribeBox.tsx` | Email capture CTA |
| `frontend/src/components/home/ProfileCard.tsx` | Author profile card (avatar, stats, social links) |
| `frontend/src/components/home/ReadingStats.tsx` | Recharts line chart + metric cards |
| `frontend/src/components/home/TagCloud.tsx` | Tag list with counts |
| `frontend/src/components/home/Timeline.tsx` | Month-based timeline list |
| `frontend/src/index.css` | Theme tokens (mint/soft-blue palette) |

---

### Task 1: Copy Design Assets & Verify Build

**Files:**
- Create: `frontend/public/images/home/` directory
- Copy into it: `01-home-dashboard.png`, `profile.png`, `avatar.png`, `email.png`, `role_sider.png`, `star.png`, `leaf.png`

- [ ] **Step 1: Copy assets**

```bash
mkdir -p frontend/public/images/home
cp home-ui-design/profile.png frontend/public/images/home/
cp home-ui-design/avatar.png frontend/public/images/home/
cp home-ui-design/email.png frontend/public/images/home/
cp home-ui-design/role_sider.png frontend/public/images/home/
cp home-ui-design/star.png frontend/public/images/home/
cp home-ui-design/leaf.png frontend/public/images/home/
cp home-ui-design/01-home-dashboard.png frontend/public/images/home/
```

- [ ] **Step 2: Verify existing build still passes**

Run: `cd frontend && npm run build`
Expected: Build completes with 0 errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/public/images/home/
git commit -m "assets: copy home dashboard design assets"
```

---

### Task 2: Update Theme Tokens (Mint Palette)

**Files:**
- Modify: `frontend/src/index.css`
- Modify: `frontend/tailwind.config.js`

- [ ] **Step 1: Update CSS variables for light mode**

In `frontend/src/index.css`, replace the `:root` block (lines 6-48) with:

```css
:root {
  --font-sans: 'Geist Variable', Inter, ui-sans-serif, system-ui, sans-serif;
  --font-heading: var(--font-sans);
  --background: 180 20% 97%;
  --foreground: 220 20% 18%;
  --card: 0 0% 100%;
  --card-foreground: 220 20% 18%;
  --popover: 0 0% 100%;
  --popover-foreground: 220 20% 18%;
  --primary: 160 55% 45%;
  --primary-foreground: 0 0% 100%;
  --secondary: 180 30% 94%;
  --secondary-foreground: 220 20% 18%;
  --muted: 180 20% 94%;
  --muted-foreground: 220 10% 50%;
  --accent: 190 60% 92%;
  --accent-foreground: 220 20% 18%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 180 15% 90%;
  --input: 180 15% 90%;
  --ring: 160 55% 45%;
  --chart-1: 160 55% 45%;
  --chart-2: 190 70% 55%;
  --chart-3: 45 95% 60%;
  --chart-4: 260 70% 65%;
  --chart-5: 0 84.2% 60.2%;
  --radius: 0.75rem;
  --sidebar: 0 0% 100%;
  --sidebar-foreground: 220 20% 18%;
  --sidebar-primary: 160 55% 45%;
  --sidebar-primary-foreground: 0 0% 100%;
  --sidebar-accent: 180 30% 94%;
  --sidebar-accent-foreground: 220 20% 18%;
  --sidebar-border: 180 15% 90%;
  --sidebar-ring: 160 55% 45%;
  color: hsl(var(--foreground));
  background: hsl(var(--background));
  font-family: var(--font-sans);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- [ ] **Step 2: Update dark mode tokens**

In the same file, replace the `.dark` block (lines 51-78) with:

```css
.dark {
  --background: 220 20% 10%;
  --foreground: 180 20% 95%;
  --card: 220 18% 13%;
  --card-foreground: 180 20% 95%;
  --popover: 220 18% 13%;
  --popover-foreground: 180 20% 95%;
  --primary: 160 55% 50%;
  --primary-foreground: 220 20% 10%;
  --secondary: 220 15% 18%;
  --secondary-foreground: 180 20% 95%;
  --muted: 220 15% 18%;
  --muted-foreground: 180 10% 60%;
  --accent: 220 15% 18%;
  --accent-foreground: 180 20% 95%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 220 15% 20%;
  --input: 220 15% 20%;
  --ring: 160 55% 50%;
  --sidebar: 220 18% 13%;
  --sidebar-foreground: 180 20% 95%;
  --sidebar-primary: 160 55% 50%;
  --sidebar-primary-foreground: 220 20% 10%;
  --sidebar-accent: 220 15% 18%;
  --sidebar-accent-foreground: 180 20% 95%;
  --sidebar-border: 220 15% 20%;
  --sidebar-ring: 160 55% 50%;
}
```

- [ ] **Step 3: Update Tailwind primary scale**

In `frontend/tailwind.config.js`, replace the existing `primary` object inside `colors` with:

```js
primary: {
  DEFAULT: 'hsl(var(--primary))',
  foreground: 'hsl(var(--primary-foreground))',
  50: '#f0fdfa',
  100: '#ccfbf1',
  200: '#99f6e4',
  300: '#5eead4',
  400: '#2dd4bf',
  500: '#14b8a6',
  600: '#0d9488',
  700: '#0f766e',
  800: '#115e59',
  900: '#134e4a',
},
```

- [ ] **Step 4: Verify build**

Run: `cd frontend && npm run build`
Expected: Build completes with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/index.css frontend/tailwind.config.js
git commit -m "style: update theme tokens to mint palette"
```

---

### Task 3: Refactor Layout to Three Columns

**Files:**
- Modify: `frontend/src/pages/Layout.tsx`

- [ ] **Step 1: Rewrite Layout.tsx**

Replace the entire file with:

```tsx
import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'
import ProfileCard from '../components/home/ProfileCard'
import ReadingStats from '../components/home/ReadingStats'
import TagCloud from '../components/home/TagCloud'
import Timeline from '../components/home/Timeline'

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:ml-64 lg:mr-80">
        <Header />
        <div className="flex flex-1 gap-6 p-4 sm:p-6">
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
      {/* Right Panel — hidden on smaller screens */}
      <aside className="fixed right-0 top-0 z-30 hidden h-screen w-80 overflow-y-auto border-l border-border bg-card/50 backdrop-blur xl:flex xl:flex-col xl:gap-4 xl:p-4">
        <ProfileCard />
        <ReadingStats />
        <div className="grid grid-cols-2 gap-4">
          <TagCloud />
          <Timeline />
        </div>
      </aside>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `cd frontend && npm run build`
Expected: Build completes with 0 errors (components not yet created will fail; that is expected for now).

Note: The build will fail because `ProfileCard`, `ReadingStats`, `TagCloud`, and `Timeline` do not exist yet. That is expected and will be resolved in later tasks.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Layout.tsx
git commit -m "layout: refactor to three-column dashboard shell"
```

---

### Task 4: Enhance Sidebar with Decorations

**Files:**
- Modify: `frontend/src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Add imports and data**

At the top of `Sidebar.tsx`, add these imports after the existing ones:

```tsx
import { Settings, Moon, Gift, Github } from 'lucide-react'
import { useThemeStore } from '../../stores/themeStore'
```

- [ ] **Step 2: Add decorations inside the aside**

Inside the `<aside>` element, after the closing `</nav>` tag (before the closing `</aside>`), insert:

```tsx
        {/* Decorative illustration */}
        <div className="relative mt-4 flex justify-center px-3">
          <img
            src="/images/home/role_sider.png"
            alt=" decoration"
            className="h-40 w-auto object-contain opacity-90"
          />
          <img
            src="/images/home/star.png"
            alt=""
            className="absolute -right-2 top-4 h-8 w-auto animate-pulse"
          />
          <img
            src="/images/home/leaf.png"
            alt=""
            className="absolute -left-1 top-8 h-6 w-auto"
          />
        </div>

        {/* Quote */}
        <div className="mt-4 px-6 text-center">
          <p className="text-xs leading-relaxed text-muted-foreground">
            生活明朗，万物可爱
            <br />
            保持热爱，奔赴山海。
          </p>
        </div>

        {/* Shortcut buttons */}
        <div className="mt-4 flex justify-center gap-3 px-3">
          <button
            type="button"
            aria-label="切换主题"
            title="切换主题"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition hover:bg-secondary/80"
          >
            <Moon size={16} />
          </button>
          <button
            type="button"
            aria-label="设置"
            title="设置"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition hover:bg-secondary/80"
          >
            <Settings size={16} />
          </button>
          <button
            type="button"
            aria-label="通知"
            title="通知"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition hover:bg-secondary/80"
          >
            <Gift size={16} />
          </button>
          <button
            type="button"
            aria-label="GitHub"
            title="GitHub"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition hover:bg-secondary/80"
          >
            <Github size={16} />
          </button>
        </div>

        {/* Copyright */}
        <div className="mt-auto py-4 text-center">
          <p className="text-[10px] text-muted-foreground">© 2024 SoraBlog</p>
        </div>
```

- [ ] **Step 3: Adjust active link style to match design mint highlight**

Change the active class inside the nav map from:
```
bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300
```
to:
```
bg-primary-100/60 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300
```

- [ ] **Step 4: Verify build**

Run: `cd frontend && npm run build`
Expected: Build completes with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/layout/Sidebar.tsx
git commit -m "feat(sidebar): add decorations, quote, shortcuts and copyright"
```

---

### Task 5: Enhance Header (Gift Icon + Shortcut Hint)

**Files:**
- Modify: `frontend/src/components/layout/Header.tsx`

- [ ] **Step 1: Add Gift import and keyboard hint**

Replace the existing import line:
```tsx
import { Bell, Menu, Search, User } from 'lucide-react'
```
with:
```tsx
import { Bell, Gift, Menu, Search, User } from 'lucide-react'
```

- [ ] **Step 2: Add gift button before the bell**

In the `<div className="flex shrink-0 items-center gap-2 sm:gap-3">`, insert before the `<ThemeToggle />`:

```tsx
        <button
          type="button"
          className="relative rounded-lg p-2 text-foreground/70 transition hover:bg-accent hover:text-foreground"
          aria-label="活动"
          title="活动"
        >
          <Gift size={18} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
```

- [ ] **Step 3: Add ⌘K keyboard hint to search input**

Wrap the existing search `<input>` inside a relative container and add a `<kbd>` badge. Replace the existing search `<div>` block:

```tsx
        <div className="relative w-full max-w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <input
            type="text"
            placeholder="搜索文章、笔记、项目..."
            className="h-10 w-full rounded-xl bg-muted pl-10 pr-16 text-sm outline-none ring-primary transition focus:ring-2"
          />
          <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
            ⌘ K
          </kbd>
        </div>
```

- [ ] **Step 4: Verify build**

Run: `cd frontend && npm run build`
Expected: Build completes with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/layout/Header.tsx
git commit -m "feat(header): add gift icon, notification dot and ⌘K search hint"
```

---

### Task 6: Create BannerCarousel Component

**Files:**
- Create: `frontend/src/components/home/BannerCarousel.tsx`

- [ ] **Step 1: Write the component**

```tsx
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
```

- [ ] **Step 2: Verify build**

Run: `cd frontend && npm run build`
Expected: Build completes with 0 errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/home/BannerCarousel.tsx
git commit -m "feat(home): add banner carousel component"
```

---

### Task 7: Create LatestArticles Component

**Files:**
- Create: `frontend/src/components/home/LatestArticles.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { ArrowRight, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'

const articles = [
  {
    id: 1,
    category: '技术',
    title: '我用 Next.js 14 重构了个人博客',
    excerpt: '从 Vite 迁移到 Next.js 的完整过程记录，包括 SSR、ISR 的实践心得。',
    date: '2024/06/01',
    views: '1.2k',
    cover: '/images/home/profile.png',
  },
  {
    id: 2,
    category: '生活',
    title: '去镰仓吧！吹吹海风看看海',
    excerpt: '一次说走就走的旅行，在江之电沿线留下的夏日回忆。',
    date: '2024/05/28',
    views: '982',
    cover: '/images/home/email.png',
  },
  {
    id: 3,
    category: '思考',
    title: '为什么我们总是很难坚持？',
    excerpt: '关于意志力、习惯养成和自我欺骗的一些观察与反思。',
    date: '2024/05/20',
    views: '1.5k',
    cover: '/images/home/avatar.png',
  },
]

export default function LatestArticles() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">最新文章</h3>
        <Link
          to="/articles"
          className="flex items-center gap-1 text-sm text-muted-foreground transition hover:text-primary"
        >
          查看全部 <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Card
            key={article.id}
            className="group overflow-hidden border-border/60 bg-card transition hover:shadow-md"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={article.cover}
                alt={article.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <Badge className="absolute left-3 top-3 bg-primary/90 text-primary-foreground hover:bg-primary">
                {article.category}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h4 className="line-clamp-1 text-sm font-semibold text-foreground">
                {article.title}
              </h4>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {article.excerpt}
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{article.date}</span>
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {article.views}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `cd frontend && npm run build`
Expected: Build completes with 0 errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/home/LatestArticles.tsx
git commit -m "feat(home): add latest articles section"
```

---

### Task 8: Create FeaturedProjects Component

**Files:**
- Create: `frontend/src/components/home/FeaturedProjects.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'

const projects = [
  {
    id: 1,
    name: 'SoraUI 组件库',
    status: '进行中',
    description: '基于 React + TS 的轻量级组件库',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  },
  {
    id: 2,
    name: 'Windy 团队管理系统',
    status: '已完成',
    description: '一款简洁美观的团队管理工具',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  },
  {
    id: 3,
    name: 'Anime.js 动画集',
    status: '已完成',
    description: '收集整理的动画效果与实战示例',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  },
]

export default function FeaturedProjects() {
  const [page, setPage] = useState(0)
  const perPage = 2
  const maxPage = Math.ceil(projects.length / perPage) - 1
  const visible = projects.slice(page * perPage, page * perPage + perPage)

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">精选项目</h3>
        <Link
          to="/projects"
          className="flex items-center gap-1 text-sm text-muted-foreground transition hover:text-primary"
        >
          查看全部 <ArrowRight size={14} />
        </Link>
      </div>
      <div className="relative">
        <div className="grid gap-4 sm:grid-cols-2">
          {visible.map((project) => (
            <Card
              key={project.id}
              className="border-border/60 bg-card transition hover:shadow-md"
            >
              <CardContent className="flex flex-col gap-2 p-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">{project.name}</h4>
                  <Badge variant="secondary" className={project.color}>
                    {project.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {project.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Carousel controls */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-full p-1 text-muted-foreground transition hover:bg-accent disabled:opacity-30"
            aria-label="上一页"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-1.5">
            {Array.from({ length: maxPage + 1 }).map((_, idx) => (
              <span
                key={idx}
                className={`block h-1.5 rounded-full transition-all ${
                  idx === page ? 'w-4 bg-primary' : 'w-1.5 bg-primary/30'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
            disabled={page === maxPage}
            className="rounded-full p-1 text-muted-foreground transition hover:bg-accent disabled:opacity-30"
            aria-label="下一页"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `cd frontend && npm run build`
Expected: Build completes with 0 errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/home/FeaturedProjects.tsx
git commit -m "feat(home): add featured projects carousel"
```

---

### Task 9: Create SubscribeBox Component

**Files:**
- Create: `frontend/src/components/home/SubscribeBox.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { useState } from 'react'
import { Mail } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export default function SubscribeBox() {
  const [email, setEmail] = useState('')

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 to-accent p-6 sm:p-8">
      <img
        src="/images/home/email.png"
        alt=""
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 opacity-30"
      />
      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            订阅更新，不错过每一篇精彩内容
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            每周发送精选文章与灵感分享
          </p>
        </div>
        <div className="flex w-full max-w-sm items-center gap-2">
          <div className="relative flex-1">
            <Mail
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="email"
              placeholder="输入你的邮箱地址..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 rounded-xl border-border bg-card pl-9 text-sm"
            />
          </div>
          <Button className="h-10 rounded-xl px-5 text-sm">订阅</Button>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `cd frontend && npm run build`
Expected: Build completes with 0 errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/home/SubscribeBox.tsx
git commit -m "feat(home): add email subscribe box"
```

---

### Task 10: Create ProfileCard Component

**Files:**
- Create: `frontend/src/components/home/ProfileCard.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { Github, Mail, Twitter } from 'lucide-react'

const stats = [
  { label: '文章', value: '56' },
  { label: '项目', value: '12' },
  { label: '笔记', value: '89' },
  { label: '粉丝', value: '1.2k' },
]

const socials = [
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Twitter, label: '知乎', href: '#' },
  { icon: Twitter, label: '微博', href: '#' },
  { icon: Mail, label: '邮箱', href: '#' },
]

export default function ProfileCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm">
      {/* Decorative cat */}
      <img
        src="/images/home/avatar.png"
        alt=""
        className="pointer-events-none absolute -right-2 -top-2 h-16 w-16 opacity-60"
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="relative">
          <img
            src="/images/home/avatar.png"
            alt="Sora"
            className="h-16 w-16 rounded-full border-2 border-primary/20 object-cover"
          />
          <span className="absolute -bottom-1 -right-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
            Lv.5
          </span>
        </div>

        <h4 className="mt-3 text-base font-semibold">Sora</h4>
        <p className="text-xs text-muted-foreground">前端开发 & 设计爱好者</p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          热爱技术，喜欢设计，也热爱生活。
          <br />
          这里是我的数字花园 🌱
        </p>

        {/* Stats */}
        <div className="mt-4 grid w-full grid-cols-4 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-sm font-semibold">{s.value}</span>
              <span className="text-[10px] text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Socials */}
        <div className="mt-4 flex gap-3">
          {socials.map((s) => {
            const Icon = s.icon
            return (
              <a
                key={s.label}
                href={s.href}
                title={s.label}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition hover:bg-primary hover:text-primary-foreground"
              >
                <Icon size={14} />
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `cd frontend && npm run build`
Expected: Build completes with 0 errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/home/ProfileCard.tsx
git commit -m "feat(right-panel): add profile card with stats and social links"
```

---

### Task 11: Create ReadingStats Component (Recharts)

**Files:**
- Create: `frontend/src/components/home/ReadingStats.tsx`

- [ ] **Step 1: Write the component**

```tsx
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
import { ArrowUpRight } from 'lucide-react'

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
        <div className="flex gap-1">
          {ranges.map((r, idx) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(idx)}
              className={`rounded-md px-2 py-1 text-[10px] transition ${
                idx === range
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              {r}
            </button>
          ))}
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
              formatter={(value: number) => [`阅读量：${value}`, '']}
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
```

- [ ] **Step 2: Verify build**

Run: `cd frontend && npm run build`
Expected: Build completes with 0 errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/home/ReadingStats.tsx
git commit -m "feat(right-panel): add reading stats with recharts line chart"
```

---

### Task 12: Create TagCloud Component

**Files:**
- Create: `frontend/src/components/home/TagCloud.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { Link } from 'react-router-dom'

const tags = [
  { name: '前端开发', count: 23 },
  { name: '生活', count: 18 },
  { name: '设计', count: 15 },
  { name: '随笔', count: 12 },
  { name: 'Next.js', count: 10 },
  { name: 'TypeScript', count: 9 },
  { name: '旅行', count: 7 },
  { name: '动画', count: 6 },
  { name: '工具', count: 5 },
  { name: '思考', count: 4 },
]

export default function TagCloud() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h4 className="text-xs font-semibold">标签云</h4>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.name}
            to={`/articles?tag=${encodeURIComponent(tag.name)}`}
            className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[10px] text-secondary-foreground transition hover:bg-primary hover:text-primary-foreground"
          >
            {tag.name}
            <span className="text-[9px] opacity-70">{tag.count}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `cd frontend && npm run build`
Expected: Build completes with 0 errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/home/TagCloud.tsx
git commit -m "feat(right-panel): add tag cloud component"
```

---

### Task 13: Create Timeline Component

**Files:**
- Create: `frontend/src/components/home/Timeline.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const events = [
  {
    time: '2024-06',
    content: '发布了新文章《我用 Next.js 14 重构了个人博客》',
  },
  {
    time: '2024-05',
    content: '完成了 Windy 团队管理系统',
  },
  {
    time: '2024-04',
    content: '新增了 3 篇笔记',
  },
  {
    time: '2024-03',
    content: '博客访问量突破 10,000 🎉',
  },
]

export default function Timeline() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold">时间轴</h4>
        <Link
          to="/timeline"
          className="flex items-center gap-0.5 text-[10px] text-muted-foreground transition hover:text-primary"
        >
          查看全部 <ArrowRight size={10} />
        </Link>
      </div>
      <div className="relative mt-3 space-y-3 pl-3">
        {/* Vertical line */}
        <div className="absolute left-[5px] top-1.5 h-[calc(100%-12px)] w-px bg-border" />
        {events.map((e, idx) => (
          <div key={idx} className="relative">
            <span className="absolute -left-3 top-1.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-card" />
            <p className="text-[10px] font-medium text-muted-foreground">
              {e.time}
            </p>
            <p className="mt-0.5 text-[10px] leading-relaxed text-foreground">
              {e.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `cd frontend && npm run build`
Expected: Build completes with 0 errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/home/Timeline.tsx
git commit -m "feat(right-panel): add timeline component"
```

---

### Task 14: Wire Up Home Page

**Files:**
- Modify: `frontend/src/pages/Home/Home.tsx`

- [ ] **Step 1: Replace Home.tsx**

```tsx
import BannerCarousel from '../../components/home/BannerCarousel'
import LatestArticles from '../../components/home/LatestArticles'
import FeaturedProjects from '../../components/home/FeaturedProjects'
import SubscribeBox from '../../components/home/SubscribeBox'

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <BannerCarousel />
      <LatestArticles />
      <FeaturedProjects />
      <SubscribeBox />
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `cd frontend && npm run build`
Expected: Build completes with 0 errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Home/Home.tsx
git commit -m "feat(home): wire up banner, articles, projects and subscribe sections"
```

---

### Task 15: Verify Full Build & Visual QA

**Files:**
- None (verification only)

- [ ] **Step 1: Full production build**

Run: `cd frontend && npm run build`
Expected: Build completes with 0 errors and 0 warnings.

- [ ] **Step 2: Lint check**

Run: `cd frontend && npm run lint`
Expected: ESLint passes with 0 errors.

- [ ] **Step 3: Start dev server and visually verify**

Run: `cd frontend && npm run dev`
Open http://localhost:5173 in browser.

Checklist:
- [ ] Three-column layout renders on xl breakpoint (Sidebar + Main + Right Panel)
- [ ] Right panel hides below xl breakpoint
- [ ] Sidebar shows decorations, quote, shortcut buttons, copyright
- [ ] Header shows search with ⌘K badge, gift icon, bell, avatar/login
- [ ] Home page shows Banner → Articles → Projects → Subscribe stacked vertically
- [ ] All cards use rounded-2xl, light mint palette, soft shadows
- [ ] No horizontal scroll
- [ ] Dark mode toggles correctly and all modules remain readable

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: final build verification and visual QA"
```

---

## Spec Coverage Check

| Design Requirement | Implementing Task |
|---|---|
| Left sidebar navigation + brand | Task 4 (enhanced existing) |
| Sidebar decorative illustration | Task 4 |
| Sidebar quote + shortcuts | Task 4 |
| Sidebar copyright | Task 4 |
| Top search bar with ⌘K hint | Task 5 |
| Top gift / bell / avatar actions | Task 5 |
| Banner carousel | Task 6 |
| Latest articles (3 cards) | Task 7 |
| Featured projects carousel | Task 8 |
| Subscribe CTA | Task 9 |
| Right panel profile card | Task 10 |
| Right panel reading stats + chart | Task 11 |
| Right panel tag cloud | Task 12 |
| Right panel timeline | Task 13 |
| Three-column layout | Task 3 |
| Mint/white color palette | Task 2 |

## Placeholder Scan

- No "TBD", "TODO", or "implement later" strings remain in the plan.
- Every task contains complete code blocks for every modification step.
- Every task contains exact build/lint commands with expected output.

## Type Consistency

- All Recharts types inferred from data shape.
- Zustand stores untouched; no signature drift.
- Tailwind custom colors (`primary-50` through `primary-900`) defined in config and used consistently.
- `encodeURIComponent` used in TagCloud to prevent URL encoding bugs.
