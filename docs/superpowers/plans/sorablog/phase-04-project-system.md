# Phase 4: 项目系统

> **目标:** 实现项目展示页、项目详情页
> **UI 稿参考:** 03-projects-gallery.png, 11-project-detail-windy-platform.png
> **前置条件:** Phase 3 完成
> **验收标准:** 项目卡片展示、详情页渲染、状态筛选正常

---

## Task 4.1: 后端 - 项目 API 完善

**Files:**
- Modify: `backend/src/modules/project/project.service.ts`
- Modify: `backend/src/modules/project/project.controller.ts`

- [ ] **Step 1: 增强 ProjectService**

```typescript
async findAll(query: any = {}): Promise<{ items: ProjectDocument[]; total: number }> {
  const filter: any = {}
  if (query.category) filter.category = query.category
  if (query.status) filter.status = query.status

  const page = parseInt(query.page) || 1
  const limit = parseInt(query.limit) || 10
  const skip = (page - 1) * limit

  const [items, total] = await Promise.all([
    this.projectModel.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).exec(),
    this.projectModel.countDocuments(filter),
  ])

  return { items, total }
}

async findBySlug(slug: string): Promise<ProjectDocument | null> {
  return this.projectModel.findOne({ slug }).exec()
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/modules/project/project.service.ts
git commit -m "feat(backend): enhance project list with pagination and filters"
```

---

## Task 4.2: 后端 - 项目种子数据

**Files:**
- Modify: `backend/src/seed.ts`

- [ ] **Step 1: 添加更多项目种子**

```typescript
// 在 seed.ts 中添加
await projectService.create({
  title: 'SoraUI 组件库',
  slug: 'soraui-component-library',
  summary: '基于 React + TS 的轻量级组件库',
  description: '# 项目详情...',
  status: '已发布',
  category: 'UI',
  techStack: ['React', 'TypeScript', 'Storybook'],
  order: 1,
})

await projectService.create({
  title: 'Anime.js 动画集',
  slug: 'animejs-animation-collection',
  summary: '收集整理的动画效果与实战示例',
  description: '# 项目详情...',
  status: '开发中',
  category: '动画',
  techStack: ['TypeScript', 'GSAP', 'Vite'],
  order: 2,
})
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/seed.ts
git commit -m "chore(backend): add more project seed data"
```

---

## Task 4.3: 前端 - 项目展示页

**Files:**
- Create: `frontend/src/pages/Projects/Projects.tsx`
- Create: `frontend/src/pages/Projects/components/ProjectFilter.tsx`
- Create: `frontend/src/pages/Projects/components/ProjectStats.tsx`

**UI 参考:** 03-projects-gallery.png（顶部 Banner、项目总览统计、分类筛选、项目卡片网格、右侧标签云和最近更新）

- [ ] **Step 1: Projects 页面**

```tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '../../api/projects'
import ProjectCard from '../../components/common/ProjectCard'

const categories = ['全部', 'Web', 'UI', '动画', '实验']
const statuses = ['全部', '已发布', '开发中', '实验中']

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [activeStatus, setActiveStatus] = useState('全部')

  const { data } = useQuery({
    queryKey: ['projects', activeCategory, activeStatus],
    queryFn: () => projectsApi.getList({
      category: activeCategory === '全部' ? undefined : activeCategory,
      status: activeStatus === '全部' ? undefined : activeStatus,
    }),
  })

  const projects = (data as any)?.data?.items || []

  return (
    <div>
      {/* Banner */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">精选作品集 <span className="text-primary-500">✦</span></h1>
          <p className="text-gray-500">每一个项目，都是一次探索与创造</p>
          <div className="flex gap-4 mt-4">
            <span className="flex items-center gap-1 text-sm text-gray-500">💚 专注创造</span>
            <span className="flex items-center gap-1 text-sm text-gray-500">🔄 持续迭代</span>
            <span className="flex items-center gap-1 text-sm text-gray-500">📤 分享开放</span>
          </div>
        </div>
      </div>

      {/* 筛选 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm ${
                activeCategory === cat ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600'
              }`}>
              {cat} {cat === '全部' ? '18' : ''}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm border border-gray-200">
            <option>最新更新</option>
          </select>
        </div>
      </div>

      {/* 项目网格 */}
      <div className="grid grid-cols-3 gap-4">
        {projects.map((project: any) => <ProjectCard key={project._id} project={project} />)}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/Projects/
git commit -m "feat(frontend): add projects gallery page"
```

---

## Task 4.4: 前端 - 项目详情页

**Files:**
- Create: `frontend/src/pages/ProjectDetail/ProjectDetail.tsx`

**UI 参考:** 11-project-detail-windy-platform.png（项目 Banner、统计数据、功能模块、开发历程、设计截图、版本趋势）

- [ ] **Step 1: ProjectDetail**

```tsx
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '../../api/projects'

export default function ProjectDetail() {
  const { slug } = useParams()
  const { data, isLoading } = useQuery({ queryKey: ['project', slug], queryFn: () => projectsApi.getBySlug(slug!) })
  const project = (data as any)?.data

  if (isLoading) return <div>加载中...</div>
  if (!project) return <div>项目不存在</div>

  return (
    <div className="space-y-6">
      {/* 项目头图 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
        <div className="flex gap-8">
          <div className="w-1/2">
            <img src={project.coverImage || '/project-placeholder.png'} alt={project.title} className="w-full rounded-xl" />
          </div>
          <div className="w-1/2">
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm ${
                project.status === '已发布' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>{project.status}</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            <p className="text-gray-500 mb-4">{project.summary}</p>
            <div className="flex gap-2 mb-6">
              {project.techStack?.map((tech: string) => (
                <span key={tech} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">{tech}</span>
              ))}
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-2 bg-primary-500 text-white rounded-lg">在线预览</button>
              <button className="px-6 py-2 border border-gray-200 rounded-lg">查看源码</button>
            </div>
          </div>
        </div>
      </div>

      {/* 统计数据 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-2xl font-bold">2.8k</div>
          <div className="text-sm text-gray-500">GitHub Stars</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-2xl font-bold">12.4k</div>
          <div className="text-sm text-gray-500">注册用户</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-2xl font-bold">28.6k</div>
          <div className="text-sm text-gray-500">项目访问量</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-2xl font-bold">92%</div>
          <div className="text-sm text-gray-500">项目完成度</div>
        </div>
      </div>

      {/* 功能模块 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
        <h2 className="text-xl font-bold mb-6">功能模块</h2>
        <div className="grid grid-cols-2 gap-4">
          {project.features?.map((feature: any, index: number) => (
            <div key={index} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                {feature.icon || '⚡'}
              </div>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            </div>
          )) || <div className="text-gray-500">暂无功能模块描述</div>}
        </div>
      </div>

      {/* 项目描述 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: project.description }} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/ProjectDetail/
git commit -m "feat(frontend): add project detail page"
```

---

## Task 4.5: Phase 4 验收

- [ ] **Step 1: 验证项目列表**

```bash
# 打开 http://localhost:5173/projects
# 检查: 分类筛选切换时列表更新
# 检查: 项目卡片显示状态标签
```

- [ ] **Step 2: 验证项目详情**

```bash
# 点击项目卡片进入详情页
# 检查: 头图和标题显示正确
# 检查: 统计数据展示
# 检查: 功能模块网格
```

- [ ] **Step 3: UI 对照检查**

对照 03-projects-gallery.png、11-project-detail-windy-platform.png 检查：
- [ ] 项目卡片状态标签颜色
- [ ] 详情页左右布局
- [ ] 统计数据网格

- [ ] **Step 4: Commit**

```bash
git commit --allow-empty -m "checkpoint: phase 4 project system complete"
```
