# Phase 8: 搜索 + 管理后台

> **目标:** 实现全文搜索、管理后台仪表盘
> **UI 稿参考:** 18-search-results-nextjs.png
> **前置条件:** Phase 7 完成
> **验收标准:** 搜索返回结果、管理后台可登录访问

---

## Task 8.1: 后端 - 搜索模块 (ES)

**Files:**
- Create: `backend/src/modules/search/search.module.ts`
- Create: `backend/src/modules/search/search.service.ts`
- Create: `backend/src/modules/search/search.controller.ts`
- Create: `backend/src/modules/search/search.processor.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: SearchService**

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common'
import { ElasticsearchService } from '../../shared/elasticsearch/elasticsearch.service'

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly indices = ['articles', 'projects', 'notes']
  constructor(private readonly esService: ElasticsearchService) {}

  async onModuleInit() {
    for (const index of this.indices) {
      await this.esService.createIndex(index, {
        properties: {
          title: { type: 'text', analyzer: 'ik_max_word' },
          content: { type: 'text', analyzer: 'ik_max_word' },
          summary: { type: 'text' },
          tags: { type: 'keyword' },
          category: { type: 'keyword' },
          createdAt: { type: 'date' },
          views: { type: 'integer' },
        },
      })
    }
  }

  async indexDocument(index: string, id: string, doc: any) {
    return this.esService.indexDocument(index, id, doc)
  }

  async search(q: string, types: string[], page = 1, limit = 10) {
    const indices = types.length > 0 ? types : this.indices
    const from = (page - 1) * limit
    const result = await this.esService.search(indices.join(','), {
      query: { multi_match: { query: q, fields: ['title^3', 'content', 'summary', 'tags'] } },
      highlight: { fields: { title: {}, content: { fragment_size: 150 } } },
      from, size: limit,
    })
    return {
      total: result.hits.total,
      hits: result.hits.hits.map((hit: any) => ({ id: hit._id, index: hit._index, source: hit._source, highlight: hit.highlight })),
    }
  }

  async getSuggestions(q: string) {
    const result = await this.esService.search('articles', {
      query: { match_phrase_prefix: { title: q } }, size: 5, _source: ['title', 'slug'],
    })
    return result.hits.hits.map((hit: any) => hit._source.title)
  }
}
```

- [ ] **Step 2: SearchController**

```typescript
import { Controller, Get, Query } from '@nestjs/common'
import { Public } from '../../common/decorators/public.decorator'
import { SearchService } from './search.service'

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}
  @Public() @Get() async search(@Query('q') q: string, @Query('types') types?: string, @Query('page') page?: string) {
    return this.searchService.search(q, types ? types.split(',') : [], parseInt(page || '1'))
  }
  @Public() @Get('suggestions') async suggestions(@Query('q') q: string) {
    return this.searchService.getSuggestions(q)
  }
}
```

- [ ] **Step 3: SearchProcessor**

```typescript
import { Processor, Process } from '@nestjs/bull'
import { Job } from 'bull'
import { SearchService } from './search.service'

@Processor('sync-to-es')
export class SearchProcessor {
  constructor(private searchService: SearchService) {}
  @Process('index-document') async handleIndex(job: Job) {
    const { index, id, document } = job.data
    await this.searchService.indexDocument(index, id, document)
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/modules/search/ backend/src/app.module.ts
git commit -m "feat(backend): add elasticsearch search module"
```

---

## Task 8.2: 后端 - 管理后台 API

**Files:**
- Create: `backend/src/modules/admin/admin.module.ts`
- Create: `backend/src/modules/admin/admin.controller.ts`
- Create: `backend/src/modules/admin/admin.service.ts`
- Create: `backend/src/common/guards/roles.guard.ts`
- Modify: `backend/src/main.ts`

- [ ] **Step 1: RolesGuard**

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()])
    if (!requiredRoles) return true
    return requiredRoles.includes(context.switchToHttp().getRequest().user?.role)
  }
}
```

- [ ] **Step 2: AdminController**

```typescript
import { Controller, Get, Post } from '@nestjs/common'
import { Roles } from '../../common/decorators/roles.decorator'
import { AdminService } from './admin.service'

@Controller('admin')
@Roles('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}
  @Get('dashboard') async dashboard() { return this.adminService.getDashboardStats() }
  @Post('search/rebuild') async rebuildSearchIndex() { return this.adminService.rebuildSearchIndex() }
}
```

- [ ] **Step 3: 更新 main.ts**

```typescript
import { RolesGuard } from './common/guards/roles.guard'
app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector))
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/modules/admin/ backend/src/common/guards/roles.guard.ts backend/src/main.ts
git commit -m "feat(backend): add admin module with roles guard"
```

---

## Task 8.3: 前端 - 搜索结果页

**Files:**
- Create: `frontend/src/pages/Search/Search.tsx`
- Create: `frontend/src/api/search.ts`

**UI 参考:** 18-search-results-nextjs.png（搜索结果分类筛选、文章/项目/笔记聚合展示、右侧搜索建议）

- [ ] **Step 1: Search API**

```typescript
import { apiClient } from './client'
export const searchApi = {
  search: (q: string, types?: string) => apiClient.get('/search', { params: { q, types } }),
  getSuggestions: (q: string) => apiClient.get('/search/suggestions', { params: { q } }),
}
```

- [ ] **Step 2: Search 页面**

```tsx
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { searchApi } from '../../api/search'
import ArticleCard from '../../components/common/ArticleCard'

const typeFilters = [
  { key: 'all', label: '全部' },
  { key: 'articles', label: '文章' },
  { key: 'projects', label: '项目' },
  { key: 'notes', label: '笔记' },
]

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const activeType = searchParams.get('type') || 'all'

  const { data, isLoading } = useQuery({
    queryKey: ['search', q, activeType],
    queryFn: () => searchApi.search(q, activeType === 'all' ? undefined : activeType),
    enabled: !!q,
  })

  const results = (data as any)?.data?.hits || []

  const setType = (type: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (type === 'all') newParams.delete('type')
    else newParams.set('type', type)
    setSearchParams(newParams)
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <h1 className="text-2xl font-bold mb-2">搜索 "{q}"</h1>
        <p className="text-gray-500 mb-6">找到约 {results.length} 条结果</p>

        {/* 分类筛选 */}
        <div className="flex gap-2 mb-6">
          {typeFilters.map((filter) => (
            <button key={filter.key} onClick={() => setType(filter.key)}
              className={`px-4 py-2 rounded-full text-sm ${
                activeType === filter.key ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600'
              }`}>
              {filter.label}
            </button>
          ))}
        </div>

        {isLoading ? <div>搜索中...</div> : (
          <div className="space-y-4">
            {results.map((hit: any) => (
              <div key={hit.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">{hit.index}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  <span dangerouslySetInnerHTML={{ __html: hit.highlight?.title?.[0] || hit.source.title }} />
                </h3>
                <p className="text-gray-500 text-sm">
                  <span dangerouslySetInnerHTML={{ __html: hit.highlight?.content?.[0] || hit.source.summary }} />
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* 搜索建议 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold mb-4">搜索建议</h3>
          <div className="space-y-2">
            {['Next.js 14 新特性', 'Next.js App Router 教程', 'Next.js 性能优化'].map((suggestion, index) => (
              <a key={index} href={`/search?q=${encodeURIComponent(suggestion)}`}
                className="block text-sm text-gray-600 hover:text-primary-500 py-1">
                {suggestion}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Search/ frontend/src/api/search.ts
git commit -m "feat(frontend): add search results page"
```

---

## Task 8.4: 前端 - 管理后台

**Files:**
- Create: `frontend/src/pages/Admin/AdminLayout.tsx`
- Create: `frontend/src/pages/Admin/Dashboard/Dashboard.tsx`

- [ ] **Step 1: AdminLayout**

```tsx
import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

export default function AdminLayout() {
  const { user } = useAuthStore()
  if (user?.role !== 'admin') return <Navigate to="/" />

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="fixed left-0 top-0 w-64 h-full bg-white dark:bg-gray-800 border-r">
        <div className="p-4 font-bold text-lg">管理后台</div>
        <nav className="px-4 space-y-1">
          <a href="/admin" className="block py-2 px-3 rounded-lg text-sm hover:bg-gray-100">仪表盘</a>
          <a href="/admin/articles" className="block py-2 px-3 rounded-lg text-sm hover:bg-gray-100">文章管理</a>
          <a href="/admin/projects" className="block py-2 px-3 rounded-lg text-sm hover:bg-gray-100">项目管理</a>
          <a href="/admin/notes" className="block py-2 px-3 rounded-lg text-sm hover:bg-gray-100">笔记管理</a>
          <a href="/admin/friend-links" className="block py-2 px-3 rounded-lg text-sm hover:bg-gray-100">友链审核</a>
          <a href="/admin/guestbook" className="block py-2 px-3 rounded-lg text-sm hover:bg-gray-100">留言管理</a>
        </nav>
      </aside>
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Dashboard**

```tsx
export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: '文章数', value: '--', color: 'bg-blue-500' },
          { label: '项目数', value: '--', color: 'bg-green-500' },
          { label: '笔记数', value: '--', color: 'bg-purple-500' },
          { label: '总浏览量', value: '--', color: 'bg-orange-500' },
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <div className={`w-10 h-10 ${stat.color} rounded-lg mb-3`} />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 最近动态 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4">最近动态</h2>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full bg-primary-500" />
              <span className="text-sm text-gray-500">2024-06-01 12:00</span>
              <span className="text-sm">发布了新文章</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Admin/
git commit -m "feat(frontend): add admin layout and dashboard"
```

---

## Task 8.5: 更新路由配置

**Files:**
- Modify: `frontend/src/router/index.tsx`

- [ ] **Step 1: 添加所有路由**

```tsx
import { createBrowserRouter } from 'react-router-dom'
import Layout from '../pages/Layout'
import Home from '../pages/Home/Home'
import Articles from '../pages/Articles/Articles'
import ArticleDetail from '../pages/ArticleDetail/ArticleDetail'
import TagArchive from '../pages/TagArchive/TagArchive'
import Projects from '../pages/Projects/Projects'
import ProjectDetail from '../pages/ProjectDetail/ProjectDetail'
import Notes from '../pages/Notes/Notes'
import NoteDetail from '../pages/NoteDetail/NoteDetail'
import NoteCollection from '../pages/NoteCollection/NoteCollection'
import Timeline from '../pages/Timeline/Timeline'
import YearlySummary from '../pages/YearlySummary/YearlySummary'
import About from '../pages/About/About'
import Contact from '../pages/Contact/Contact'
import Friends from '../pages/Friends/Friends'
import FriendApply from '../pages/FriendApply/FriendApply'
import Guestbook from '../pages/Guestbook/Guestbook'
import MyMessages from '../pages/MyMessages/MyMessages'
import Search from '../pages/Search/Search'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import AdminLayout from '../pages/Admin/AdminLayout'
import AdminDashboard from '../pages/Admin/Dashboard/Dashboard'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'articles', element: <Articles /> },
      { path: 'articles/:slug', element: <ArticleDetail /> },
      { path: 'articles/tags/:tag', element: <TagArchive /> },
      { path: 'projects', element: <Projects /> },
      { path: 'projects/:slug', element: <ProjectDetail /> },
      { path: 'notes', element: <Notes /> },
      { path: 'notes/:slug', element: <NoteDetail /> },
      { path: 'notes/collections/:id', element: <NoteCollection /> },
      { path: 'timeline', element: <Timeline /> },
      { path: 'timeline/year/:year', element: <YearlySummary /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'friends', element: <Friends /> },
      { path: 'friends/apply', element: <FriendApply /> },
      { path: 'guestbook', element: <Guestbook /> },
      { path: 'guestbook/my', element: <MyMessages /> },
      { path: 'search', element: <Search /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [{ index: true, element: <AdminDashboard /> }],
  },
])
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/router/index.tsx
git commit -m "feat(frontend): add all routes"
```

---

## Task 8.6: Phase 8 验收

- [ ] **Step 1: 验证搜索**

```bash
# 访问 /search?q=Next.js
# 检查: 搜索结果渲染
# 检查: 分类筛选
```

- [ ] **Step 2: 验证管理后台**

```bash
# 访问 /admin
# 检查: 管理员可访问
# 检查: 普通用户重定向到首页
```

- [ ] **Step 3: Commit**

```bash
git commit --allow-empty -m "checkpoint: phase 8 search and admin complete"
```
